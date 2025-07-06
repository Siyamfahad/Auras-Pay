const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const { logger } = require('../utils/logger');
const { authenticate } = require('../middleware/auth');
const paymentExpirationService = require('../utils/paymentExpirationService');

const router = express.Router();
const prisma = new PrismaClient();

// Middleware to check if user is admin
const requireAdmin = (req, res, next) => {
  // Check if user has isAdmin flag set to true, or fallback to legacy checks
  if (!req.user || (!req.user.isAdmin && !req.user.email?.includes('admin') && req.user.id !== 1)) {
    return res.status(403).json({
      success: false,
      error: 'Admin access required'
    });
  }
  next();
};

// @route   GET /api/admin/users
// @desc    Get all users with their stats
// @access  Admin only
router.get('/users', authenticate, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = search ? {
      OR: [
        {
          email: {
            contains: search
          }
        },
        {
          walletAddress: {
            contains: search
          }
        }
      ]
    } : {};

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          walletAddress: true,
          transactionCredits: true,
          isAdmin: true,
          status: true,
          createdAt: true
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit)
      }),
      prisma.user.count({ where })
    ]);

    // Get payment counts for each user
    const userIds = users.map(u => u.id);
    const paymentCounts = await prisma.payment.groupBy({
      by: ['userId'],
      where: {
        userId: {
          in: userIds
        }
      },
      _count: {
        id: true
      }
    });

    // Format users with payment count
    const formattedUsers = users.map(user => ({
      ...user,
      totalPayments: paymentCounts.find(p => p.userId === user.id)?._count.id || 0
    }));

    res.json({
      success: true,
      data: {
        users: formattedUsers,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalUsers: total
        }
      }
    });

  } catch (error) {
    logger.error('Admin get users error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching users'
    });
  }
});

// @route   POST /api/admin/adjust-credits
// @desc    Manually adjust user credits
// @access  Admin only
router.post('/adjust-credits', authenticate, requireAdmin, async (req, res) => {
  try {
    const { userId, adjustment, reason } = req.body;

    if (!userId || adjustment === undefined) {
      return res.status(400).json({
        success: false,
        error: 'User ID and adjustment amount are required'
      });
    }

    const adjustmentValue = parseInt(adjustment);
    if (isNaN(adjustmentValue)) {
      return res.status(400).json({
        success: false,
        error: 'Adjustment must be a valid number'
      });
    }

    // Get current user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, transactionCredits: true, isAdmin: true }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Prevent adjusting admin user credits
    if (user.isAdmin) {
      return res.status(400).json({
        success: false,
        error: 'Cannot adjust admin user credits'
      });
    }

    // Calculate new credit balance (ensure it doesn't go below 0)
    const newBalance = Math.max(0, user.transactionCredits + adjustmentValue);

    // Update user credits
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { transactionCredits: newBalance },
      select: {
        id: true,
        email: true,
        transactionCredits: true
      }
    });

    // Log the adjustment
    logger.info(`Admin ${req.user.email} adjusted credits for user ${user.email}: ${adjustmentValue} (reason: ${reason || 'No reason provided'})`);

    res.json({
      success: true,
      message: 'Credits adjusted successfully',
      data: {
        user: updatedUser,
        adjustment: adjustmentValue,
        previousBalance: user.transactionCredits,
        newBalance: newBalance
      }
    });

  } catch (error) {
    logger.error('Admin adjust credits error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while adjusting credits'
    });
  }
});

// @route   GET /api/admin/analytics
// @desc    Get platform analytics
// @access  Admin only
router.get('/analytics', authenticate, requireAdmin, async (req, res) => {
  try {
    const [
      totalUsers,
      totalAdmins,
      totalPayments,
      totalCreditsIssued,
      pendingPayments,
      completedPayments
    ] = await Promise.all([
      prisma.user.count({ where: { isAdmin: false } }),
      prisma.user.count({ where: { isAdmin: true } }),
      prisma.payment.count(),
      prisma.user.aggregate({
        _sum: {
          transactionCredits: true
        },
        where: { isAdmin: false }
      }),
      prisma.payment.count({ where: { status: 'PENDING' } }),
      prisma.payment.count({ where: { status: 'COMPLETED' } })
    ]);

    // Calculate total revenue from transactions
    const revenueData = await prisma.transaction.aggregate({
      _sum: {
        amountPaid: true
      },
      where: {
        status: 'COMPLETED'
      }
    });

    // Get recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentUsers = await prisma.user.count({
      where: {
        createdAt: {
          gte: thirtyDaysAgo
        },
        isAdmin: false
      }
    });

    const recentPayments = await prisma.payment.count({
      where: {
        createdAt: {
          gte: thirtyDaysAgo
        }
      }
    });

    const analytics = {
      totalUsers,
      totalAdmins,
      totalPayments,
      pendingPayments,
      completedPayments,
      totalCreditsIssued: totalCreditsIssued._sum.transactionCredits || 0,
      totalRevenue: revenueData._sum.amountPaid || 0,
      recentActivity: {
        newUsers: recentUsers,
        newPayments: recentPayments
      }
    };

    res.json({
      success: true,
      data: analytics
    });

  } catch (error) {
    logger.error('Admin analytics error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching analytics'
    });
  }
});

// @route   GET /api/admin/recent-activity
// @desc    Get recent platform activity
// @access  Admin only
router.get('/recent-activity', authenticate, requireAdmin, async (req, res) => {
  try {
    const { limit = 20 } = req.query;

    // Get recent users
    const recentUsers = await prisma.user.findMany({
      where: { isAdmin: false },
      select: {
        id: true,
        email: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit) / 2
    });

    // Get recent payments
    const recentPayments = await prisma.payment.findMany({
      select: {
        id: true,
        amount: true,
        currency: true,
        status: true,
        createdAt: true,
        user: {
          select: {
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit) / 2
    });

    res.json({
      success: true,
      data: {
        recentUsers,
        recentPayments
      }
    });

  } catch (error) {
    logger.error('Admin recent activity error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching recent activity'
    });
  }
});

// @route   GET /api/admin/payment-expiration/stats
// @desc    Get payment expiration statistics
// @access  Admin only
router.get('/payment-expiration/stats', authenticate, requireAdmin, async (req, res) => {
  try {
    const stats = await paymentExpirationService.getExpirationStats();

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    logger.error('Admin payment expiration stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching expiration stats'
    });
  }
});

// @route   POST /api/admin/payment-expiration/run
// @desc    Manually run payment expiration cleanup
// @access  Admin only
router.post('/payment-expiration/run', authenticate, requireAdmin, async (req, res) => {
  try {
    logger.info(`Admin ${req.user.email} triggered manual payment expiration cleanup`);
    const result = await paymentExpirationService.expireOldPayments();

    res.json({
      success: true,
      message: 'Payment expiration cleanup completed',
      data: result
    });

  } catch (error) {
    logger.error('Admin manual payment expiration error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while running payment expiration'
    });
  }
});

// @route   POST /api/admin/payment-expiration/expire/:id
// @desc    Manually expire a specific payment
// @access  Admin only
router.post('/payment-expiration/expire/:id', [
  authenticate,
  requireAdmin,
  body('reason')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Reason must be less than 200 characters')
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
    const { reason = `Manual expiration by admin ${req.user.email}` } = req.body;

    const result = await paymentExpirationService.expirePayment(id, reason);

    logger.info(`Admin ${req.user.email} manually expired payment ${id}: ${reason}`);

    res.json({
      success: true,
      message: 'Payment expired successfully',
      data: result
    });

  } catch (error) {
    logger.error('Admin manual payment expiration error:', error);
    
    if (error.message === 'Payment not found') {
      return res.status(404).json({
        success: false,
        error: 'Payment not found'
      });
    }

    if (error.message.includes('not pending')) {
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }

    res.status(500).json({
      success: false,
      error: 'Server error while expiring payment'
    });
  }
});

module.exports = router; 