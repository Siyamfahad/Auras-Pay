const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { logger } = require('../utils/logger');
const { authenticate } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Middleware to check if user is admin
const requireAdmin = (req, res, next) => {
  // Simple admin check - you can implement proper role-based access
  if (!req.user || (!req.user.email.includes('admin') && req.user.id !== 1)) {
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
      email: {
        contains: search
      }
    } : {};

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          walletAddress: true,
          transactionCredits: true,
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
      where: { id: parseInt(userId) },
      select: { id: true, email: true, transactionCredits: true }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Calculate new credit balance (ensure it doesn't go below 0)
    const newBalance = Math.max(0, user.transactionCredits + adjustmentValue);

    // Update user credits
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(userId) },
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
      totalPayments,
      totalCreditsIssued
    ] = await Promise.all([
      prisma.user.count(),
      prisma.payment.count(),
      prisma.user.aggregate({
        _sum: {
          transactionCredits: true
        }
      })
    ]);

    // Calculate total revenue from transactions
    const revenueData = await prisma.transaction.aggregate({
      _sum: {
        amountPaid: true
      }
    });

    const analytics = {
      totalUsers,
      totalPayments,
      totalCreditsIssued: totalCreditsIssued._sum.transactionCredits || 0,
      totalRevenue: revenueData._sum.amountPaid || 0
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
    const [recentPayments, recentUsers, recentTransactions] = await Promise.all([
      prisma.payment.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
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
        }
      }),
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          createdAt: true,
          transactionCredits: true
        }
      }),
      prisma.transaction.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          creditsAdded: true,
          amountPaid: true,
          createdAt: true,
          user: {
            select: {
              email: true
            }
          }
        }
      })
    ]);

    res.json({
      success: true,
      data: {
        recentPayments,
        recentUsers,
        recentTransactions
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

module.exports = router; 