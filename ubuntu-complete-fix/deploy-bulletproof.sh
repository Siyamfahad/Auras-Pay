#!/bin/bash
echo "🚀 BULLETPROOF AURAS PAY DEPLOYMENT"
echo "==================================="

# Stop everything
echo "🛑 Stopping all PM2 processes..."
pm2 delete all 2>/dev/null || true

# Install global dependencies
echo "📦 Installing global dependencies..."
npm install -g serve pm2

# Install backend dependencies (minimal)
echo "📚 Installing backend dependencies..."
npm init -y 2>/dev/null || true
npm install express cors express-rate-limit --save

# Create logs directory
mkdir -p logs

# Copy files from original deployment
echo "📁 Setting up files..."
if [ -d "/root/auras-pay-fixed-20250703_144752/frontend" ]; then
    cp -r /root/auras-pay-fixed-20250703_144752/frontend ./
    echo "✅ Frontend copied"
else
    echo "❌ Frontend not found - please copy manually"
fi

if [ -d "/root/auras-pay-fixed-20250703_144752/landingpage" ]; then
    cp -r /root/auras-pay-fixed-20250703_144752/landingpage ./
    echo "✅ Landing page copied"
else
    echo "❌ Landing page not found - please copy manually"
fi

# Start services
echo "🚀 Starting services..."
pm2 start ecosystem-bulletproof.config.js
pm2 save

echo ""
echo "✅ DEPLOYMENT COMPLETE!"
echo ""
echo "📊 Status:"
pm2 status

echo ""
echo "🌐 Your URLs:"
echo "   Main Site: http://91.99.185.144:3002"
echo "   Backend API: http://91.99.185.144:3001"
echo "   Frontend: http://91.99.185.144:5174"
echo "   Health Check: http://91.99.185.144:3001/health"
echo ""
echo "🔧 If any service is down, run: pm2 restart all"
echo ""
echo "🧪 Test your API:"
echo "   curl http://91.99.185.144:3001/health"
echo "   curl http://91.99.185.144:3001/api/test"
