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

// Add debug logging
console.log('🔧 Starting AURAS Pay Backend Server...');
console.log('📍 Current working directory:', process.cwd());
console.log('🌍 NODE_ENV:', process.env.NODE_ENV);
console.log('🔌 DEFAULT_PORT:', DEFAULT_PORT);
console.log('📡 HOST:', process.env.HOST || 'default');

// Security middleware
app.use(helmet());

// CORS configuration with debugging
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'http://localhost:3000', // Next.js landing page
  'http://localhost:5173', // React frontend
  'http://localhost:5174', // React frontend (Vite default)
  'http://91.99.185.144:3000', // Server wallet page
  'http://91.99.185.144:5174', // Server frontend
  'http://91.99.185.144:3002', // Server landing page
  'http://91.99.185.144'       // Server root
];

// Add allowed origins from environment variable for production
if (process.env.ALLOWED_ORIGINS) {
  const additionalOrigins = process.env.ALLOWED_ORIGINS.split(',');
  allowedOrigins.push(...additionalOrigins);
}

console.log('🌐 Allowed CORS origins:', allowedOrigins);

app.use(cors({
  origin: allowedOrigins,
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
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint with detailed information
app.get('/health', (req, res) => {
  const health = {
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    message: 'AURAS Pay Backend is running!',
    environment: process.env.NODE_ENV || 'development',
    port: DEFAULT_PORT,
    pid: process.pid,
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    cors_origins: allowedOrigins.length
  };
  
  console.log('📊 Health check accessed:', {
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: health.timestamp
  });
  
  res.json(health);
});

// Debug endpoint to test CORS
app.get('/api/test', (req, res) => {
  console.log('🧪 Test API accessed:', {
    ip: req.ip,
    origin: req.get('Origin'),
    userAgent: req.get('User-Agent')
  });
  
  res.json({
    success: true,
    message: 'CORS and API is working!',
    timestamp: new Date().toISOString(),
    origin: req.get('Origin'),
    ip: req.ip
  });
});

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/webhooks', webhookRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', apiRoutes);

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  console.log('❌ API route not found:', req.originalUrl);
  res.status(404).json({
    success: false,
    error: 'API endpoint not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Error handling middleware
app.use(errorHandler);

// Global error handlers
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Start server with automatic port detection
async function startServer() {
  try {
    const port = await findAvailablePort(DEFAULT_PORT);
    const host = process.env.HOST || (process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost');
    
    console.log(`🚀 Attempting to start server on ${host}:${port}`);
    
    const server = app.listen(port, host, () => {
      // Save the current port for other processes
      saveCurrentPort(port);
      
      logger.info(`🚀 AURAS Pay Backend Server running on ${host}:${port}`);
      logger.info(`📊 Health check available at http://${host === '0.0.0.0' ? '91.99.185.144' : host}:${port}/health`);
      logger.info(`🧪 Test API available at http://${host === '0.0.0.0' ? '91.99.185.144' : host}:${port}/api/test`);
      logger.info(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
      
      // Start payment expiration service
      try {
        paymentExpirationService.start();
        logger.info(`⏰ Payment expiration service started`);
      } catch (expireError) {
        logger.error(`❌ Failed to start payment expiration service:`, expireError);
      }
      
      if (port !== parseInt(DEFAULT_PORT)) {
        console.log(`\n⚠️  Port ${DEFAULT_PORT} was busy, server started on port ${port} instead`);
        updateFrontendEnv(port);
        console.log(`🔄 Frontend will automatically use the new backend URL\n`);
      } else {
        // Still update frontend env to ensure consistency
        updateFrontendEnv(port);
      }
      
      // Additional info for production
      if (process.env.NODE_ENV === 'production') {
        logger.info(`🌐 Server accessible externally on port ${port}`);
        logger.info(`🔒 Make sure firewall allows connections on port ${port}`);
        console.log(`\n✅ Backend server ready at http://91.99.185.144:${port}`);
        console.log(`✅ Health check: http://91.99.185.144:${port}/health`);
        console.log(`✅ Test API: http://91.99.185.144:${port}/api/test\n`);
      }
    });

    // Handle server errors
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${port} is already in use`);
        logger.error(`Port ${port} is already in use`);
      } else {
        console.error(`❌ Server error:`, error);
        logger.error('Server error:', error);
      }
      process.exit(1);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    logger.error('Failed to start server:', error.message);
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