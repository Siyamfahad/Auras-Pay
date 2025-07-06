#!/bin/bash
echo "🚀 Deploying AURAS Pay on Ubuntu server..."

# Install dependencies if needed
echo "📦 Checking dependencies..."
if ! command -v serve &> /dev/null; then
    echo "Installing serve..."
    npm install -g serve
fi

if ! command -v pm2 &> /dev/null; then
    echo "Installing PM2..."
    npm install -g pm2
fi

# Create logs directory
mkdir -p logs

# Stop existing processes
echo "🛑 Stopping existing processes..."
pm2 delete all 2>/dev/null || true

# Install backend dependencies
echo "📚 Installing backend dependencies..."
cd backend && npm install --production 2>/dev/null && cd ..

# Check if required files exist
echo "🔍 Checking file structure..."
if [ ! -f "backend/server.js" ]; then
    echo "❌ backend/server.js not found!"
    exit 1
fi

if [ ! -f "landingpage/server.js" ]; then
    echo "❌ landingpage/server.js not found!"
    exit 1
fi

if [ ! -d "frontend/dist" ]; then
    echo "❌ frontend/dist not found!"
    exit 1
fi

echo "✅ All required files found!"

# Start services with fixed config
echo "🚀 Starting services with PM2..."
pm2 start ecosystem-fixed.config.js
pm2 save

echo ""
echo "✅ Deployment completed!"
echo ""
echo "🌐 Access your application:"
echo "   Main Site: http://91.99.185.144"
echo "   Wallet: http://91.99.185.144/wallet"  
echo "   Login: http://91.99.185.144/login"
echo "   Dashboard: http://91.99.185.144:5174"
echo "   Health: http://91.99.185.144:3001/health"
echo ""
echo "📊 Commands:"
echo "   pm2 status    - Check services"
echo "   pm2 logs      - View logs"
echo "   pm2 restart all - Restart"
echo ""
echo "🔧 Debug commands:"
echo "   pm2 logs auras-backend --lines 50"
echo "   pm2 logs auras-frontend --lines 50"
echo "   pm2 logs auras-landing --lines 50"
