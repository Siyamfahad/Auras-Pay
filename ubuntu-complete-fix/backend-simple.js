const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || '0.0.0.0';

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100
});

// CORS configuration for your server
const corsOptions = {
  origin: [
    'http://91.99.185.144',
    'http://91.99.185.144:3000',
    'http://91.99.185.144:3002', 
    'http://91.99.185.144:5174',
    'http://localhost:3000',
    'http://localhost:3002',
    'http://localhost:5174'
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(limiter);
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    server: `${HOST}:${PORT}`,
    message: 'AURAS Pay Backend is running properly'
  });
});

// Test API endpoint
app.get('/api/test', (req, res) => {
  res.json({
    message: 'AURAS Pay API is working!',
    timestamp: new Date().toISOString(),
    server: `http://91.99.185.144:${PORT}`
  });
});

// Mock auth endpoints (temporary)
app.post('/api/auth/login', (req, res) => {
  res.json({
    success: true,
    message: 'Login endpoint working (database setup pending)',
    user: { id: 1, username: 'demo' },
    token: 'demo_token_' + Date.now()
  });
});

app.post('/api/auth/register', (req, res) => {
  res.json({
    success: true,
    message: 'Register endpoint working (database setup pending)',
    user: { id: 1, username: 'demo' }
  });
});

// Mock payments endpoint
app.get('/api/payments', (req, res) => {
  res.json({
    success: true,
    payments: [],
    message: 'Payments endpoint working (database setup pending)'
  });
});

// Catch all API routes
app.use('/api/*', (req, res) => {
  res.json({
    message: 'API endpoint available',
    endpoint: req.originalUrl,
    method: req.method,
    note: 'Database integration pending'
  });
});

// Start server
app.listen(PORT, HOST, () => {
  console.log(`🚀 AURAS Pay Backend Server running on ${HOST}:${PORT}`);
  console.log(`📊 Health check: http://91.99.185.144:${PORT}/health`);
  console.log(`🧪 Test API: http://91.99.185.144:${PORT}/api/test`);
  console.log(`✅ Backend ready and working!`);
});
