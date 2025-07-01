const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const paymentRoutes = require('./routes/payments');
const webhookRoutes = require('./routes/webhooks');
const adminRoutes = require('./routes/admin');
const apiRoutes = require('./routes/api');
const { errorHandler } = require('./middleware/errorHandler');
const { logger } = require('./utils/logger');
const { findAvailablePort, saveCurrentPort, updateFrontendEnv } = require('./utils/portDiscovery');
const paymentExpirationService = require('./utils/paymentExpirationService');

const app = express();
const DEFAULT_PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'http://localhost:3000', // Next.js landing page
    'http://localhost:5173'  // React frontend
  ],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  }
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    message: 'AURAS Pay Backend is running!'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/webhooks', webhookRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', apiRoutes);

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'AURAS Pay API is working!',
    timestamp: new Date().toISOString(),
    availableRoutes: {
      auth: '/api/auth/*',
      payments: '/api/payments/*',
      webhooks: '/api/webhooks/*'
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
    availableRoutes: ['/health', '/api/test']
  });
});

// Global error handler
app.use(errorHandler);

// Start server with automatic port detection
async function startServer() {
  try {
    const port = await findAvailablePort(DEFAULT_PORT);
    
    app.listen(port, () => {
      // Save the current port for other processes
      saveCurrentPort(port);
      
      logger.info(`🚀 AURAS Pay Backend Server running on port ${port}`);
      logger.info(`📊 Health check available at http://localhost:${port}/health`);
  logger.info(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
      
      // Start payment expiration service
      paymentExpirationService.start();
      logger.info(`⏰ Payment expiration service started`);
      
      if (port !== parseInt(DEFAULT_PORT)) {
        console.log(`\n⚠️  Port ${DEFAULT_PORT} was busy, server started on port ${port} instead`);
        updateFrontendEnv(port);
        console.log(`🔄 Frontend will automatically use the new backend URL\n`);
      } else {
        // Still update frontend env to ensure consistency
        updateFrontendEnv(port);
      }
    });
  } catch (error) {
    logger.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
}

// Start the server
startServer();

// Graceful shutdown
process.on('SIGINT', () => {
  logger.info('Received SIGINT, shutting down gracefully...');
  paymentExpirationService.stop();
  process.exit(0);
});

process.on('SIGTERM', () => {
  logger.info('Received SIGTERM, shutting down gracefully...');
  paymentExpirationService.stop();
  process.exit(0);
});

module.exports = app; 