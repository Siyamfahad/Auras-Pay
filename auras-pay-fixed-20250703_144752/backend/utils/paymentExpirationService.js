const { PrismaClient } = require('@prisma/client');
const { logger } = require('./logger');
const webhookService = require('./webhookService');

const prisma = new PrismaClient();

class PaymentExpirationService {
  constructor() {
    this.expirationTime = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    this.cleanupInterval = 60 * 60 * 1000; // Check every hour
    this.intervalId = null;
  }

  /**
   * Start the automatic cleanup process
   */
  start() {
    if (this.intervalId) {
      this.stop();
    }

    logger.info('Starting payment expiration service');
    this.intervalId = setInterval(() => {
      this.expireOldPayments().catch(error => {
        logger.error('Error in payment expiration cleanup:', error);
      });
    }, this.cleanupInterval);

    // Run immediately on start
    this.expireOldPayments().catch(error => {
      logger.error('Error in initial payment expiration cleanup:', error);
    });
  }

  /**
   * Stop the automatic cleanup process
   */
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      logger.info('Stopped payment expiration service');
    }
  }

  /**
   * Find and expire old pending payments
   */
  async expireOldPayments() {
    try {
      const expirationDate = new Date(Date.now() - this.expirationTime);
      
      // Find payments that should be expired
      const expiredPayments = await prisma.payment.findMany({
        where: {
          status: 'PENDING',
          createdAt: {
            lt: expirationDate
          }
        },
        include: {
          user: {
            select: {
              id: true,
              email: true
            }
          }
        }
      });

      if (expiredPayments.length === 0) {
        logger.debug('No payments to expire');
        return { expired: 0 };
      }

      logger.info(`Found ${expiredPayments.length} payments to expire`);

      let expiredCount = 0;
      let webhookCount = 0;

      for (const payment of expiredPayments) {
        try {
          // Update payment status to EXPIRED
          const updatedPayment = await prisma.payment.update({
            where: { id: payment.id },
            data: { 
              status: 'EXPIRED',
              updatedAt: new Date()
            }
          });

          expiredCount++;
          logger.info(`Expired payment: ${payment.id}`);

          // Send webhook notification if webhook URL is provided
          if (payment.webhookUrl) {
            try {
              await webhookService.sendPaymentExpired(payment.webhookUrl, updatedPayment, payment.user);
              webhookCount++;
              logger.info(`Webhook sent for expired payment: ${payment.id}`);
            } catch (webhookError) {
              logger.error(`Failed to send webhook for expired payment ${payment.id}:`, webhookError);
            }
          }

        } catch (error) {
          logger.error(`Failed to expire payment ${payment.id}:`, error);
        }
      }

      logger.info(`Payment expiration complete: ${expiredCount} payments expired, ${webhookCount} webhooks sent`);
      
      return {
        expired: expiredCount,
        webhooksSent: webhookCount,
        totalFound: expiredPayments.length
      };

    } catch (error) {
      logger.error('Error in expireOldPayments:', error);
      throw error;
    }
  }

  /**
   * Manually expire a specific payment
   */
  async expirePayment(paymentId, reason = 'Manual expiration') {
    try {
      const payment = await prisma.payment.findUnique({
        where: { id: paymentId },
        include: {
          user: {
            select: {
              id: true,
              email: true
            }
          }
        }
      });

      if (!payment) {
        throw new Error('Payment not found');
      }

      if (payment.status !== 'PENDING') {
        throw new Error(`Payment is not pending (current status: ${payment.status})`);
      }

      // Update payment status to EXPIRED
      const updatedPayment = await prisma.payment.update({
        where: { id: paymentId },
        data: { 
          status: 'EXPIRED',
          updatedAt: new Date()
        }
      });

      logger.info(`Manually expired payment: ${paymentId} - ${reason}`);

      // Send webhook notification if webhook URL is provided
      if (payment.webhookUrl) {
        try {
          await webhookService.sendPaymentExpired(payment.webhookUrl, updatedPayment, payment.user);
          logger.info(`Webhook sent for manually expired payment: ${paymentId}`);
        } catch (webhookError) {
          logger.error(`Failed to send webhook for expired payment ${paymentId}:`, webhookError);
        }
      }

      return updatedPayment;

    } catch (error) {
      logger.error(`Error expiring payment ${paymentId}:`, error);
      throw error;
    }
  }

  /**
   * Get statistics about payment expiration
   */
  async getExpirationStats() {
    try {
      const now = new Date();
      const expirationDate = new Date(now.getTime() - this.expirationTime);

      const [pendingPayments, expiredPayments, soonToExpire] = await Promise.all([
        prisma.payment.count({
          where: { status: 'PENDING' }
        }),
        prisma.payment.count({
          where: { status: 'EXPIRED' }
        }),
        prisma.payment.count({
          where: {
            status: 'PENDING',
            createdAt: {
              lt: new Date(now.getTime() - (this.expirationTime * 0.8)) // 80% of expiration time
            }
          }
        })
      ]);

      return {
        pendingPayments,
        expiredPayments,
        soonToExpire,
        expirationTimeHours: this.expirationTime / (60 * 60 * 1000),
        nextCleanup: new Date(now.getTime() + this.cleanupInterval)
      };

    } catch (error) {
      logger.error('Error getting expiration stats:', error);
      throw error;
    }
  }
}

module.exports = new PaymentExpirationService(); 