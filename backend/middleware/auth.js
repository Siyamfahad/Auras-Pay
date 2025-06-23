const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const { logger } = require('../utils/logger');

const prisma = new PrismaClient();

// JWT Authentication middleware
const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Access token is required'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        walletAddress: true,
        transactionCredits: true,
        status: true
      }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token'
      });
    }

    if (user.status !== 'ACTIVE') {
      return res.status(403).json({
        success: false,
        error: 'Account is not active'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    return res.status(401).json({
      success: false,
      error: 'Invalid token'
    });
  }
};

// API Key Authentication middleware
const authenticateApiKey = async (req, res, next) => {
  try {
    const apiKey = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!apiKey) {
      return res.status(401).json({
        success: false,
        error: 'API key is required'
      });
    }

    const user = await prisma.user.findUnique({
      where: { apiKey },
      select: {
        id: true,
        email: true,
        walletAddress: true,
        transactionCredits: true,
        status: true
      }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid API key'
      });
    }

    if (user.status !== 'ACTIVE') {
      return res.status(403).json({
        success: false,
        error: 'Account is not active'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    logger.error('API key authentication error:', error);
    return res.status(401).json({
      success: false,
      error: 'Invalid API key'
    });
  }
};

// Check if user has sufficient credits
const checkCredits = (requiredCredits = 1) => {
  return (req, res, next) => {
    if (req.user.transactionCredits < requiredCredits) {
      return res.status(402).json({
        success: false,
        error: 'Insufficient credits',
        currentCredits: req.user.transactionCredits,
        requiredCredits
      });
    }
    next();
  };
};

module.exports = {
  authenticate,
  authenticateApiKey,
  checkCredits
}; 