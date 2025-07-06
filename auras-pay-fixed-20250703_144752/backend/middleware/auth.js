const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const { logger } = require('../utils/logger');

const prisma = new PrismaClient();

// JWT Authentication middleware
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.startsWith('Bearer ') 
      ? authHeader.slice(7) 
      : null;

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Access denied. No token provided.'
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Get user from database with admin flag
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          walletAddress: true,
          transactionCredits: true,
          isAdmin: true,
          status: true,
          createdAt: true
        }
      });

      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Invalid token. User not found.'
        });
      }

      if (user.status !== 'ACTIVE') {
        return res.status(403).json({
          success: false,
          error: 'Account is not active.'
        });
      }

      req.user = user;
      next();
    } catch (jwtError) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token.'
      });
    }
  } catch (error) {
    logger.error('Authentication error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error during authentication'
    });
  }
};

// API Key Authentication middleware
const authenticateApiKey = async (req, res, next) => {
  try {
    // Check for API key in both X-API-Key header and Authorization Bearer header
    let apiKey = req.header('X-API-Key');
    
    if (!apiKey) {
      const authHeader = req.header('Authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.slice(7);
        // Check if it's a UUID format (API key)
        const isApiKey = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(token);
        if (isApiKey) {
          apiKey = token;
        }
      }
    }

    if (!apiKey) {
      return res.status(401).json({
        success: false,
        error: 'API key is required. Provide it via X-API-Key header or Authorization: Bearer header.'
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
    res.status(500).json({
      success: false,
      error: 'Server error during authentication'
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