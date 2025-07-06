#!/bin/bash
echo "🚀 Deploying AURAS Pay on server..."

# Install PM2 if needed
if ! command -v pm2 &> /dev/null; then
    echo "Installing PM2..."
    npm install -g pm2 serve
fi

# Create logs directory
mkdir -p logs

# Stop existing processes
pm2 delete all || true

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend && npm install --production && cd ..

# Build frontend if needed
if [ ! -d "frontend/dist" ]; then
    echo "Building frontend..."
    cd frontend && npm install && npm run build && cd ..
fi

# Build landing page if needed
if [ ! -d "landingpage/.next" ]; then
    echo "Building landing page..."
    cd landingpage && npm install && npm run build && cd ..
fi

# Start services
echo "Starting services with PM2..."
pm2 start ecosystem.config.js
pm2 save

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
