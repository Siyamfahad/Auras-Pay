#!/bin/bash

# AURAS Pay - Quick Deployment Fix Script
set -e

echo "🔧 AURAS Pay Quick Deployment Fix Script Starting..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() { echo -e "${GREEN}[INFO]${NC} $1"; }
print_header() { echo -e "\n${BLUE}========================================${NC}"; echo -e "${BLUE} $1${NC}"; echo -e "${BLUE}========================================${NC}\n"; }

DOMAIN="91.99.185.144"

print_header "Creating Fixed Deployment Package"

# Create deployment directory
DEPLOY_DIR="auras-pay-fixed-$(date +%Y%m%d_%H%M%S)"
mkdir -p "$DEPLOY_DIR"

print_status "Creating deployment package in $DEPLOY_DIR..."

# Copy working components
cp -r backend "$DEPLOY_DIR/"
cp -r frontend/dist "$DEPLOY_DIR/frontend-dist" 2>/dev/null || echo "Frontend dist not found, copying source..."
cp -r landingpage/.next "$DEPLOY_DIR/landingpage-next" 2>/dev/null || cp -r landingpage "$DEPLOY_DIR/landingpage-src"

# Copy essential files
cp ecosystem.config.js "$DEPLOY_DIR/"
cp nginx.conf "$DEPLOY_DIR/"
cp package.json "$DEPLOY_DIR/"
cp landingpage/server.js "$DEPLOY_DIR/landingpage-server.js" 2>/dev/null || echo "Using source server"
cp landingpage/package.json "$DEPLOY_DIR/landingpage-package.json"

# Create proper structure
mkdir -p "$DEPLOY_DIR/landingpage"
mkdir -p "$DEPLOY_DIR/frontend"

# Set up landing page
if [ -d "$DEPLOY_DIR/landingpage-next" ]; then
    mv "$DEPLOY_DIR/landingpage-next" "$DEPLOY_DIR/landingpage/.next"
else
    cp -r landingpage/* "$DEPLOY_DIR/landingpage/"
fi
cp landingpage/server.js "$DEPLOY_DIR/landingpage/" 2>/dev/null || echo "Server file handled"
cp landingpage/package.json "$DEPLOY_DIR/landingpage/"

# Set up frontend
if [ -d "$DEPLOY_DIR/frontend-dist" ]; then
    mv "$DEPLOY_DIR/frontend-dist" "$DEPLOY_DIR/frontend/dist"
else
    cp -r frontend/* "$DEPLOY_DIR/frontend/"
fi

# Create simplified ecosystem config
cat > "$DEPLOY_DIR/ecosystem.config.js" << 'ECOSYSTEM'
module.exports = {
  apps: [
    {
      name: 'auras-backend',
      script: './backend/server.js',
      cwd: './backend',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
        HOST: '0.0.0.0'
      },
      error_file: './logs/backend-error.log',
      out_file: './logs/backend-out.log',
      log_file: './logs/backend-combined.log',
      time: true,
      autorestart: true,
      max_restarts: 10
    },
    {
      name: 'auras-frontend',
      script: 'serve',
      args: '-s dist -l 5174 -n',
      cwd: './frontend',
      instances: 1,
      exec_mode: 'fork',
      env: { NODE_ENV: 'production' },
      error_file: './logs/frontend-error.log',
      out_file: './logs/frontend-out.log',
      log_file: './logs/frontend-combined.log',
      time: true,
      autorestart: true,
      max_restarts: 10
    },
    {
      name: 'auras-landing',
      script: './landingpage/server.js',
      cwd: './landingpage',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3002,
        HOST: '0.0.0.0'
      },
      error_file: './logs/landing-error.log',
      out_file: './logs/landing-out.log',
      log_file: './logs/landing-combined.log',
      time: true,
      autorestart: true,
      max_restarts: 10
    }
  ]
};
ECOSYSTEM

# Create environment files
cat > "$DEPLOY_DIR/backend/.env" << ENV_FILE
DATABASE_URL="postgresql://auras_user:auras_pay_strong_password_2024@localhost:5432/auras_pay?schema=public"
JWT_SECRET="$(openssl rand -base64 64 | tr -d '\n')"
JWT_EXPIRES_IN="7d"
PORT=3001
HOST="0.0.0.0"
NODE_ENV="production"
FRONTEND_URL="http://${DOMAIN}:5174"
API_URL="http://${DOMAIN}:3001"
SOLANA_NETWORK="mainnet-beta"
SOLANA_RPC_URL="https://api.mainnet-beta.solana.com"
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
ALLOWED_ORIGINS="http://${DOMAIN}:5174,http://${DOMAIN}:3000,http://${DOMAIN}:3002,http://${DOMAIN}"
ENV_FILE

cat > "$DEPLOY_DIR/frontend/.env" << ENV_FILE
VITE_API_URL=http://${DOMAIN}:3001
VITE_APP_NAME="AURAS Pay"
VITE_APP_VERSION="1.0.0"
VITE_NODE_ENV=production
ENV_FILE

# Create deployment script
cat > "$DEPLOY_DIR/deploy.sh" << 'DEPLOY_SCRIPT'
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
DEPLOY_SCRIPT

chmod +x "$DEPLOY_DIR/deploy.sh"

# Create zip
ZIP_NAME="auras-pay-fixed-$(date +%Y%m%d_%H%M%S).zip"
zip -r "$ZIP_NAME" "$DEPLOY_DIR"

print_header "Quick Fix Deployment Completed!"

echo -e "\n${GREEN}🎉 Fixed deployment package created!${NC}\n"
echo -e "${BLUE}📦 Package:${NC} $ZIP_NAME"
echo -e "${BLUE}📁 Folder:${NC} $DEPLOY_DIR"

echo -e "\n${YELLOW}🔧 Issues Fixed:${NC}"
echo -e "   ✅ Auras Wallet button uses /wallet route"
echo -e "   ✅ Backend enhanced with debugging & error handling"  
echo -e "   ✅ Login/Register pages redirect to dashboard"
echo -e "   ✅ Nginx routing fixed for all pages"
echo -e "   ✅ Environment variables configured"
echo -e "   ✅ Skipped problematic wallet page build"

echo -e "\n${BLUE}🚀 Deploy Instructions:${NC}"
echo -e "   1. Upload: $ZIP_NAME"
echo -e "   2. Extract: unzip $ZIP_NAME" 
echo -e "   3. Deploy: cd $DEPLOY_DIR && ./deploy.sh"

echo -e "\n${GREEN}🌐 URLs after deployment:${NC}"
echo -e "   http://91.99.185.144 - Main site"
echo -e "   http://91.99.185.144/wallet - Wallet page"
echo -e "   http://91.99.185.144/login - Login redirect"
echo -e "   http://91.99.185.144/register - Register redirect"
echo -e "   http://91.99.185.144:5174 - Dashboard"
echo -e "   http://91.99.185.144:3001/health - Health check"

print_status "Quick deployment package ready!"
