const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const { v4: uuidv4 } = require('uuid');
const { logger } = require('../utils/logger');
const { authenticateApiKey, checkCredits } = require('../middleware/auth');
const solanaService = require('../services/solanaService');

const router = express.Router();
const prisma = new PrismaClient();

// Validate Solana wallet address
const isValidSolanaAddress = (address) => {
  return solanaService.isValidAddress(address);
};

// @route   POST /api/v1/payment-links
// @desc    Create payment link via API (for store integration)
// @access  API Key Required
router.post('/v1/payment-links', [
  authenticateApiKey,
  checkCredits(1),
  body('amount')
    .isFloat({ min: 0.000000001 })
    .withMessage('Amount must be a positive number'),
  body('currency')
    .optional()
    .isIn(['SOL', 'USDC'])
    .withMessage('Currency must be SOL or USDC'),
  body('label')
    .isLength({ min: 1, max: 100 })
    .withMessage('Label is required and must be less than 100 characters'),
  body('message')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Message must be less than 200 characters'),
  body('reference')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Reference must be less than 100 characters'),
  body('walletAddress')
    .optional()
    .custom((value) => {
      if (value && !isValidSolanaAddress(value)) {
        throw new Error('Invalid Solana wallet address');
      }
      return true;
    }),
  body('webhookUrl')
    .optional()
    .isURL()
    .withMessage('Webhook URL must be a valid URL')
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { 
      amount, 
      currency = 'SOL', 
      label, 
      message, 
      reference,
      walletAddress,
      webhookUrl 
    } = req.body;

    // Use provided wallet address or user's default wallet address
    const recipientWallet = walletAddress || req.user.walletAddress;
    
    if (!recipientWallet) {
      return res.status(400).json({
        success: false,
        error: 'Wallet address is required. Please provide a wallet address or set your default wallet address.'
      });
    }

    // Generate unique invoice ID
    const invoiceId = reference || `API-${Date.now()}-${uuidv4().substring(0, 8)}`;
    const finalMessage = message || `Payment for ${label}`;

    // Create Solana Pay payment request
    const paymentRequest = await solanaService.createPaymentRequest({
      recipient: recipientWallet,
      amount: parseFloat(amount),
      token: currency,
      label,
      message: finalMessage,
      memo: invoiceId
    });

    // Start transaction to deduct credit and create payment
    const result = await prisma.$transaction(async (tx) => {
      // Deduct 1 credit from user
      await tx.user.update({
        where: { id: req.user.id },
        data: {
          transactionCredits: {
            decrement: 1
          }
        }
      });

      // Create payment record
      const payment = await tx.payment.create({
        data: {
          userId: req.user.id,
          amount: parseFloat(amount),
          currency,
          label,
          message: finalMessage,
          solanaPayUrl: paymentRequest.url,
          qrCodeData: paymentRequest.qrCode,
          reference: paymentRequest.reference,
          webhookUrl,
          createdViaApi: true // Track API usage
        },
        select: {
          id: true,
          amount: true,
          currency: true,
          label: true,
          message: true,
          solanaPayUrl: true,
          qrCodeData: true,
          reference: true,
          status: true,
          createdAt: true
        }
      });

      return payment;
    });

    logger.info(`API payment link created by user ${req.user.email}: ${result.id}`);

    res.status(201).json({
      success: true,
      message: 'Payment link created successfully',
      data: {
        id: result.id,
        amount: result.amount,
        currency: result.currency,
        label: result.label,
        message: result.message,
        solanaPayUrl: result.solanaPayUrl,
        qrCodeData: result.qrCodeData,
        reference: result.reference,
        status: result.status,
        recipientWallet,
        createdAt: result.createdAt,
        creditsRemaining: req.user.transactionCredits - 1
      }
    });

  } catch (error) {
    logger.error('API create payment link error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while creating payment link'
    });
  }
});

// @route   GET /api/v1/payment-links/:id
// @desc    Get payment link status via API
// @access  API Key Required
router.get('/v1/payment-links/:id', authenticateApiKey, async (req, res) => {
  try {
    const { id } = req.params;
    logger.info(`API: Fetching payment ${id} for user ${req.user.id}`);

    const payment = await prisma.payment.findFirst({
      where: {
        id: id,
        userId: req.user.id // Ensure user can only access their own payments
      },
      select: {
        id: true,
        amount: true,
        currency: true,
        label: true,
        message: true,
        solanaPayUrl: true,
        reference: true,
        status: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        error: 'Payment link not found'
      });
    }

    res.json({
      success: true,
      data: payment
    });

  } catch (error) {
    logger.error('API get payment link error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching payment link'
    });
  }
});

// @route   GET /api/v1/payment-links
// @desc    List payment links via API
// @access  API Key Required
router.get('/v1/payment-links', authenticateApiKey, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status,
      reference,
      from_date,
      to_date 
    } = req.query;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build where clause
    const where = {
      userId: req.user.id,
      ...(status && { status: status.toUpperCase() }),
      ...(reference && { reference: { contains: reference } }),
      ...(from_date || to_date) && {
        createdAt: {
          ...(from_date && { gte: new Date(from_date) }),
          ...(to_date && { lte: new Date(to_date) })
        }
      }
    };

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        select: {
          id: true,
          amount: true,
          currency: true,
          label: true,
          message: true,
          reference: true,
          status: true,
          createdAt: true,
          updatedAt: true
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit)
      }),
      prisma.payment.count({ where })
    ]);

    res.json({
      success: true,
      data: {
        payments,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalPayments: total,
          hasNextPage: skip + parseInt(limit) < total,
          hasPreviousPage: parseInt(page) > 1
        }
      }
    });

  } catch (error) {
    logger.error('API list payments error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching payments'
    });
  }
});

// @route   GET /api/v1/account
// @desc    Get API account info and usage stats
// @access  API Key Required
router.get('/v1/account', authenticateApiKey, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        walletAddress: true,
        transactionCredits: true,
        status: true,
        createdAt: true
      }
    });

    // Get usage statistics
    const [totalPayments, totalApiPayments, completedPayments] = await Promise.all([
      prisma.payment.count({
        where: { userId: req.user.id }
      }),
      prisma.payment.count({
        where: { 
          userId: req.user.id,
          createdViaApi: true 
        }
      }),
      prisma.payment.count({
        where: { 
          userId: req.user.id,
          status: 'COMPLETED' 
        }
      })
    ]);

    res.json({
      success: true,
      data: {
        account: user,
        usage: {
          totalPayments,
          apiPayments: totalApiPayments,
          dashboardPayments: totalPayments - totalApiPayments,
          completedPayments,
          creditsRemaining: user.transactionCredits
        }
      }
    });

  } catch (error) {
    logger.error('API account info error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching account info'
    });
  }
});

// @route   GET /api/v1/supported-tokens
// @desc    Get list of supported tokens
// @access  API Key Required
router.get('/v1/supported-tokens', authenticateApiKey, async (req, res) => {
  try {
    const supportedTokens = await solanaService.getSupportedTokens();
    
    res.json({
      success: true,
      data: {
        tokens: supportedTokens
      }
    });

  } catch (error) {
    logger.error('API supported tokens error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching supported tokens'
    });
  }
});

module.exports = router; 