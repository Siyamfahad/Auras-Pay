const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const { logger } = require('../utils/logger');
const { authenticate } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// @route   POST /auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, and one number'),
  body('walletAddress')
    .optional()
    .isLength({ min: 32, max: 44 })
    .withMessage('Invalid Solana wallet address format')
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

    const { email, password, walletAddress } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User already exists with this email'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        walletAddress: walletAddress || null,
        transactionCredits: 5 // Give 5 free credits to new users
      },
      select: {
        id: true,
        email: true,
        walletAddress: true,
        apiKey: true,
        transactionCredits: true,
        status: true,
        createdAt: true
      }
    });

    // Generate JWT token
    const token = generateToken(user.id);

    logger.info(`New user registered: ${email}`);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user,
        token
      }
    });

  } catch (error) {
    logger.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error during registration'
    });
  }
});

// @route   POST /auth/login
// @desc    Login user
// @access  Public
router.post('/login', [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
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

    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Check if account is active
    if (user.status !== 'ACTIVE') {
      return res.status(403).json({
        success: false,
        error: 'Account is not active'
      });
    }

    // Generate JWT token
    const token = generateToken(user.id);

    // Remove sensitive data
    const { passwordHash, ...userWithoutPassword } = user;

    logger.info(`User logged in: ${email}`);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: userWithoutPassword,
        token
      }
    });

  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error during login'
    });
  }
});

// @route   GET /auth/me
// @desc    Get current user profile
// @access  Private
router.get('/me', authenticate, async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        user: req.user
      }
    });
  } catch (error) {
    logger.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   PUT /auth/wallet
// @desc    Update user wallet address
// @access  Private
router.put('/wallet', [
  authenticate,
  body('walletAddress')
    .isLength({ min: 32, max: 44 })
    .withMessage('Invalid Solana wallet address format')
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

    const { walletAddress } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { walletAddress },
      select: {
        id: true,
        email: true,
        walletAddress: true,
        transactionCredits: true,
        status: true
      }
    });

    logger.info(`User ${req.user.email} updated wallet address`);

    res.json({
      success: true,
      message: 'Wallet address updated successfully',
      data: {
        user: updatedUser
      }
    });

  } catch (error) {
    logger.error('Update wallet error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   POST /auth/generate-api-key
// @desc    Generate a new API key for the user
// @access  Private
router.post('/generate-api-key', authenticate, async (req, res) => {
  try {
    const { v4: uuidv4 } = require('uuid');
    const newApiKey = uuidv4();

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { apiKey: newApiKey },
      select: {
        id: true,
        email: true,
        apiKey: true,
        transactionCredits: true
      }
    });

    logger.info(`User ${req.user.email} generated new API key`);

    res.json({
      success: true,
      message: 'API key generated successfully',
      data: {
        apiKey: updatedUser.apiKey,
        warning: 'Please store this API key securely. You will not be able to see it again.'
      }
    });

  } catch (error) {
    logger.error('Generate API key error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while generating API key'
    });
  }
});

// @route   GET /auth/api-key-info
// @desc    Get API key info (masked) and usage stats
// @access  Private
router.get('/api-key-info', authenticate, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        apiKey: true,
        transactionCredits: true,
        createdAt: true
      }
    });

    // Count API usage (payments created via API)
    const apiUsageCount = await prisma.payment.count({
      where: {
        userId: req.user.id,
        // You could add a field to track if payment was created via API vs dashboard
      }
    });

    const maskedApiKey = user.apiKey 
      ? `${user.apiKey.substring(0, 8)}...${user.apiKey.substring(user.apiKey.length - 4)}`
      : null;

    res.json({
      success: true,
      data: {
        hasApiKey: !!user.apiKey,
        apiKeyMasked: maskedApiKey,
        creditsRemaining: user.transactionCredits,
        totalApiCalls: apiUsageCount,
        memberSince: user.createdAt
      }
    });

  } catch (error) {
    logger.error('Get API key info error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   DELETE /auth/revoke-api-key
// @desc    Revoke the current API key
// @access  Private
router.delete('/revoke-api-key', authenticate, async (req, res) => {
  try {
    await prisma.user.update({
      where: { id: req.user.id },
      data: { apiKey: null }
    });

    logger.info(`User ${req.user.email} revoked API key`);

    res.json({
      success: true,
      message: 'API key revoked successfully'
    });

  } catch (error) {
    logger.error('Revoke API key error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while revoking API key'
    });
  }
});

// Placeholder for auth routes
router.get('/test', (req, res) => {
  res.json({ message: 'Auth routes working' });
});

module.exports = router; 