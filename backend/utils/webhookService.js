const axios = require('axios');
const crypto = require('crypto');
const { logger } = require('./logger');

class WebhookService {
  constructor() {
    this.retryAttempts = 3;
    this.retryDelay = 1000; // 1 second
  }

  /**
   * Generate webhook signature for security
   */
  generateSignature(payload, secret) {
    return crypto
      .createHmac('sha256', secret || process.env.WEBHOOK_SECRET || 'default-secret')
      .update(JSON.stringify(payload))
      .digest('hex');
  }

  /**
   * Send webhook notification
   */
  async sendWebhook(webhookUrl, payload, options = {}) {
    if (!webhookUrl) {
      logger.warn('No webhook URL provided');
      return { success: false, error: 'No webhook URL' };
    }

    const signature = this.generateSignature(payload, options.secret);
    
    const headers = {
      'Content-Type': 'application/json',
      'User-Agent': 'AURAS-Pay-Webhook/1.0',
      'X-AURAS-Signature': `sha256=${signature}`,
      'X-AURAS-Event': payload.event_type,
      'X-AURAS-Delivery': crypto.randomUUID(),
      'X-AURAS-Timestamp': new Date().toISOString()
    };

    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        logger.info(`Sending webhook (attempt ${attempt}/${this.retryAttempts}) to: ${webhookUrl}`);
        
        const response = await axios.post(webhookUrl, payload, {
          headers,
          timeout: 30000, // 30 second timeout
          validateStatus: (status) => status >= 200 && status < 300
        });

        logger.info(`Webhook delivered successfully to ${webhookUrl}`);
        return {
          success: true,
          status: response.status,
          response: response.data,
          attempt
        };

      } catch (error) {
        logger.error(`Webhook delivery failed (attempt ${attempt}):`, {
          url: webhookUrl,
          error: error.message,
          status: error.response?.status,
          data: error.response?.data
        });

        // If this is the last attempt, return the error
        if (attempt === this.retryAttempts) {
          return {
            success: false,
            error: error.message,
            status: error.response?.status,
            attempts: attempt
          };
        }

        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, this.retryDelay * attempt));
      }
    }
  }

  /**
   * Send payment created webhook
   */
  async sendPaymentCreated(webhookUrl, payment, user) {
    const payload = {
      event_type: 'payment.created',
      event_id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      data: {
        payment: {
          id: payment.id,
          amount: payment.amount,
          currency: payment.currency,
          label: payment.label,
          message: payment.message,
          status: payment.status,
          solana_pay_url: payment.solanaPayUrl,
          reference: payment.reference,
          created_at: payment.createdAt
        },
        user: {
          id: user.id,
          email: user.email
        }
      }
    };

    return this.sendWebhook(webhookUrl, payload);
  }

  /**
   * Send payment completed webhook
   */
  async sendPaymentCompleted(webhookUrl, payment, user, transactionDetails = {}) {
    const payload = {
      event_type: 'payment.completed',
      event_id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      data: {
        payment: {
          id: payment.id,
          amount: payment.amount,
          currency: payment.currency,
          label: payment.label,
          message: payment.message,
          status: payment.status,
          solana_pay_url: payment.solanaPayUrl,
          reference: payment.reference,
          transaction_signature: payment.transactionSignature,
          created_at: payment.createdAt,
          completed_at: payment.verifiedAt || payment.updatedAt
        },
        transaction: transactionDetails,
        user: {
          id: user.id,
          email: user.email
        }
      }
    };

    return this.sendWebhook(webhookUrl, payload);
  }

  /**
   * Send payment failed webhook
   */
  async sendPaymentFailed(webhookUrl, payment, user, reason = '') {
    const payload = {
      event_type: 'payment.failed',
      event_id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      data: {
        payment: {
          id: payment.id,
          amount: payment.amount,
          currency: payment.currency,
          label: payment.label,
          message: payment.message,
          status: payment.status,
          solana_pay_url: payment.solanaPayUrl,
          reference: payment.reference,
          created_at: payment.createdAt,
          failed_at: payment.updatedAt
        },
        failure_reason: reason,
        user: {
          id: user.id,
          email: user.email
        }
      }
    };

    return this.sendWebhook(webhookUrl, payload);
  }

  /**
   * Send payment expired webhook
   */
  async sendPaymentExpired(webhookUrl, payment, user) {
    const payload = {
      event_type: 'payment.expired',
      event_id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      data: {
        payment: {
          id: payment.id,
          amount: payment.amount,
          currency: payment.currency,
          label: payment.label,
          message: payment.message,
          status: payment.status,
          solana_pay_url: payment.solanaPayUrl,
          reference: payment.reference,
          created_at: payment.createdAt,
          expired_at: payment.updatedAt
        },
        user: {
          id: user.id,
          email: user.email
        }
      }
    };

    return this.sendWebhook(webhookUrl, payload);
  }
}

module.exports = new WebhookService(); 