const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const { v4: uuidv4 } = require('uuid');
const { logger } = require('../utils/logger');
const { authenticate, authenticateApiKey, checkCredits } = require('../middleware/auth');
const solanaService = require('../services/solanaService');

const router = express.Router();
const prisma = new PrismaClient();

// Validate Solana wallet address using our service
const isValidSolanaAddress = (address) => {
  return solanaService.isValidAddress(address);
};

// @route   POST /api/payment-link
// @desc    Create a new payment link
// @access  Private (API Key or JWT)
router.post('/payment-link', [
  // Use either API key or JWT authentication
  (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        error: 'Authorization header is required'
      });
    }

    // Check if it's an API key (UUID format) or JWT token
    const token = authHeader.replace('Bearer ', '');
    const isApiKey = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(token);
    
    if (isApiKey) {
      authenticateApiKey(req, res, next);
    } else {
      authenticate(req, res, next);
    }
  },
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
  body('walletAddress')
    .optional()
    .custom((value) => {
      if (value && !isValidSolanaAddress(value)) {
        throw new Error('Invalid Solana wallet address');
      }
      return true;
    })
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

    const { amount, currency = 'SOL', label, message, walletAddress } = req.body;

    // Use provided wallet address or user's default wallet address
    const recipientWallet = walletAddress || req.user.walletAddress;
    
    if (!recipientWallet) {
      return res.status(400).json({
        success: false,
        error: 'Wallet address is required. Please provide a wallet address or set your default wallet address.'
      });
    }

    // Generate unique invoice ID
    const invoiceId = `INV-${Date.now()}-${uuidv4().substring(0, 8)}`;
    const finalMessage = message || invoiceId;

    // Create Solana Pay payment request using our service
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
          createdViaApi: false // Dashboard creation
        },
        select: {
          id: true,
          amount: true,
          currency: true,
          label: true,
          message: true,
          solanaPayUrl: true,
          qrCodeData: true,
          status: true,
          createdAt: true
        }
      });

      return payment;
    });

    logger.info(`Payment link created by user ${req.user.email}: ${result.id}`);

    res.status(201).json({
      success: true,
      message: 'Payment link created successfully',
      data: {
        payment: result,
        recipientWallet,
        invoiceId,
        creditsRemaining: req.user.transactionCredits - 1
      }
    });

  } catch (error) {
    logger.error('Create payment link error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while creating payment link'
    });
  }
});

// @route   GET /api/payments
// @desc    Get user's payment history
// @access  Private
router.get('/payments', authenticate, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {
      userId: req.user.id,
      ...(status && { status: status.toUpperCase() })
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
          solanaPayUrl: true,
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
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      }
    });

  } catch (error) {
    logger.error('Get payments error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching payments'
    });
  }
});

// @route   GET /api/payments/:id
// @desc    Get specific payment details
// @access  Private
router.get('/payments/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    const payment = await prisma.payment.findFirst({
      where: {
        id,
        userId: req.user.id
      },
      select: {
        id: true,
        amount: true,
        currency: true,
        label: true,
        message: true,
        solanaPayUrl: true,
        qrCodeData: true,
        status: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        error: 'Payment not found'
      });
    }

    res.json({
      success: true,
      data: {
        payment
      }
    });

  } catch (error) {
    logger.error('Get payment details error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching payment details'
    });
  }
});

// @route   GET /api/balance
// @desc    Get user's credit balance
// @access  Private
router.get('/balance', authenticate, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        transactionCredits: true,
        _count: {
          select: {
            payments: true,
            transactions: {
              where: { status: 'COMPLETED' }
            }
          }
        }
      }
    });

    res.json({
      success: true,
      data: {
        currentCredits: user.transactionCredits,
        totalPaymentsCreated: user._count.payments,
        totalCreditsPurchased: user._count.transactions
      }
    });

  } catch (error) {
    logger.error('Get balance error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching balance'
    });
  }
});

// @route   GET /api/stats
// @desc    Get user's payment statistics
// @access  Private
router.get('/stats', authenticate, async (req, res) => {
  try {
    const stats = await prisma.payment.groupBy({
      by: ['status'],
      where: { userId: req.user.id },
      _count: {
        status: true
      }
    });

    const totalAmount = await prisma.payment.aggregate({
      where: { 
        userId: req.user.id,
        status: 'COMPLETED'
      },
      _sum: {
        amount: true
      }
    });

    const formattedStats = stats.reduce((acc, stat) => {
      acc[stat.status.toLowerCase()] = stat._count.status;
      return acc;
    }, {});

    res.json({
      success: true,
      data: {
        paymentCounts: {
          pending: formattedStats.pending || 0,
          completed: formattedStats.completed || 0,
          expired: formattedStats.expired || 0,
          failed: formattedStats.failed || 0
        },
        totalAmountReceived: totalAmount._sum.amount || 0,
        currentCredits: req.user.transactionCredits
      }
    });

  } catch (error) {
    logger.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching statistics'
    });
  }
});

// @route   POST /api/payments/:id/verify
// @desc    Verify a payment transaction
// @access  Private
router.post('/payments/:id/verify', [
  authenticate,
  body('signature')
    .isLength({ min: 1 })
    .withMessage('Transaction signature is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { id } = req.params;
    const { signature } = req.body;

    // Get payment details
    const payment = await prisma.payment.findFirst({
      where: {
        id,
        userId: req.user.id
      }
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        error: 'Payment not found'
      });
    }

    if (payment.status === 'COMPLETED') {
      return res.status(400).json({
        success: false,
        error: 'Payment already verified'
      });
    }

    // Get user's wallet address
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { walletAddress: true }
    });

    // Verify the payment using Solana service
    const verification = await solanaService.verifyPayment({
      signature,
      recipient: user.walletAddress,
      amount: payment.amount * Math.pow(10, payment.currency === 'SOL' ? 9 : 6),
      token: payment.currency,
      reference: payment.reference
    });

    if (verification.verified) {
      // Update payment status
      const updatedPayment = await prisma.payment.update({
        where: { id },
        data: {
          status: 'COMPLETED',
          transactionSignature: signature,
          verifiedAt: new Date()
        }
      });

      logger.info(`Payment verified: ${id} with signature: ${signature}`);

      res.json({
        success: true,
        message: 'Payment verified successfully',
        data: {
          payment: updatedPayment,
          verification
        }
      });
    } else {
      res.status(400).json({
        success: false,
        error: 'Payment verification failed',
        details: verification.error
      });
    }

  } catch (error) {
    logger.error('Payment verification error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while verifying payment'
    });
  }
});

// @route   GET /api/supported-tokens
// @desc    Get list of supported tokens
// @access  Public
router.get('/supported-tokens', (req, res) => {
  try {
    const tokens = solanaService.getSupportedTokens();
    
    res.json({
      success: true,
      data: {
        tokens
      }
    });
  } catch (error) {
    logger.error('Get supported tokens error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching supported tokens'
    });
  }
});

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'Payment routes working' });
});

module.exports = router; 