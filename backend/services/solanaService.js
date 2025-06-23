const { Connection, PublicKey, clusterApiUrl } = require('@solana/web3.js');
const { createTransferCheckedInstruction, getAssociatedTokenAddress, getMint } = require('@solana/spl-token');
const { encodeURL, createQR } = require('@solana/pay');
const QRCode = require('qrcode');
const BigNumber = require('bignumber.js');
const { logger } = require('../utils/logger');

class SolanaService {
  constructor() {
    // Use devnet for development, mainnet-beta for production
    this.connection = new Connection(
      process.env.SOLANA_RPC_URL || clusterApiUrl('devnet'),
      'confirmed'
    );
    
    // Common SPL tokens on Solana
    this.supportedTokens = {
      SOL: {
        mint: null, // Native SOL
        decimals: 9,
        symbol: 'SOL',
        name: 'Solana'
      },
      USDC: {
        mint: new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'), // Mainnet USDC
        decimals: 6,
        symbol: 'USDC',
        name: 'USD Coin'
      }
    };

    // For devnet, use different token addresses
    if (process.env.NODE_ENV === 'development') {
      this.supportedTokens.USDC.mint = new PublicKey('4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU'); // Devnet USDC
    }
  }

  /**
   * Create a Solana Pay payment request
   */
  async createPaymentRequest({
    recipient,
    amount,
    token = 'SOL',
    label,
    message,
    memo
  }) {
    try {
      const recipientPublicKey = new PublicKey(recipient);
      const tokenInfo = this.supportedTokens[token];
      
      if (!tokenInfo) {
        throw new Error(`Unsupported token: ${token}`);
      }

      // Convert amount to BigNumber format expected by Solana Pay
      const amountBN = new BigNumber(amount);

      const paymentRequest = {
        recipient: recipientPublicKey,
        amount: amountBN,
        splToken: tokenInfo.mint,
        reference: this.generateReference(),
        label: label || 'AURAS Pay',
        message: message || 'Payment via AURAS Pay',
        memo: memo
      };

      // Create the payment URL
      const url = encodeURL(paymentRequest);
      
      // Generate QR code
      const qrCode = await this.generateQRCode(url.toString());

      return {
        url: url.toString(),
        qrCode,
        reference: paymentRequest.reference.toString(),
        amount: amountBN.toNumber(),
        token: tokenInfo,
        recipient: recipient
      };
    } catch (error) {
      logger.error('Error creating payment request:', error);
      throw error;
    }
  }

  /**
   * Generate a unique reference for the payment
   */
  generateReference() {
    return new PublicKey(
      Array.from({ length: 32 }, () => Math.floor(Math.random() * 256))
    );
  }

  /**
   * Generate QR code for payment URL
   */
  async generateQRCode(url) {
    try {
      const qrCodeDataURL = await QRCode.toDataURL(url, {
        errorCorrectionLevel: 'M',
        type: 'image/png',
        quality: 0.92,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        width: 256
      });
      
      return qrCodeDataURL;
    } catch (error) {
      logger.error('Error generating QR code:', error);
      throw error;
    }
  }

  /**
   * Verify a payment transaction
   */
  async verifyPayment({
    signature,
    recipient,
    amount,
    token = 'SOL',
    reference
  }) {
    try {
      const recipientPublicKey = new PublicKey(recipient);
      const referencePublicKey = new PublicKey(reference);
      const tokenInfo = this.supportedTokens[token];

      // Get transaction details
      const transaction = await this.connection.getTransaction(signature, {
        commitment: 'confirmed'
      });

      if (!transaction) {
        return { verified: false, error: 'Transaction not found' };
      }

      if (transaction.meta?.err) {
        return { verified: false, error: 'Transaction failed' };
      }

      return {
        verified: true,
        amount: amount,
        signature,
        blockTime: transaction.blockTime,
        slot: transaction.slot
      };
    } catch (error) {
      logger.error('Error verifying payment:', error);
      return { verified: false, error: error.message };
    }
  }

  /**
   * Get supported tokens list
   */
  getSupportedTokens() {
    return Object.entries(this.supportedTokens).map(([key, token]) => ({
      symbol: key,
      name: token.name,
      decimals: token.decimals,
      mint: token.mint?.toString() || null
    }));
  }

  /**
   * Validate Solana address
   */
  isValidAddress(address) {
    try {
      new PublicKey(address);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get account balance
   */
  async getBalance(address, token = 'SOL') {
    try {
      const publicKey = new PublicKey(address);
      const tokenInfo = this.supportedTokens[token];

      if (!tokenInfo) {
        throw new Error(`Unsupported token: ${token}`);
      }

      if (tokenInfo.mint) {
        // SPL Token balance
        const tokenAccount = await getAssociatedTokenAddress(
          tokenInfo.mint,
          publicKey
        );
        
        const balance = await this.connection.getTokenAccountBalance(tokenAccount);
        return {
          balance: balance.value.uiAmount || 0,
          decimals: tokenInfo.decimals,
          token: token
        };
      } else {
        // SOL balance
        const balance = await this.connection.getBalance(publicKey);
        return {
          balance: balance / Math.pow(10, tokenInfo.decimals),
          decimals: tokenInfo.decimals,
          token: token
        };
      }
    } catch (error) {
      logger.error('Error getting balance:', error);
      throw error;
    }
  }
}

module.exports = new SolanaService(); 