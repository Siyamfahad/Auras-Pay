#!/bin/bash

# AURAS Pay - Deployment Fix Script
# Run with: chmod +x deploy-fix.sh && ./deploy-fix.sh

set -e

echo "🔧 AURAS Pay Deployment Fix Script Starting..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "\n${BLUE}========================================${NC}"
    echo -e "${BLUE} $1${NC}"
    echo -e "${BLUE}========================================${NC}\n"
}

# Set server configuration
DOMAIN="91.99.185.144"
print_status "Configuring for server IP: $DOMAIN"

print_header "Step 1: Installing Dependencies"
print_status "Installing all dependencies..."
npm run install:all

print_header "Step 2: Setting Up Environment Files"

# Backend environment
print_status "Creating backend environment file..."
cat > backend/.env << ENV_FILE
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

# Frontend environment
print_status "Creating frontend environment file..."
cat > frontend/.env << ENV_FILE
VITE_API_URL=http://${DOMAIN}:3001
VITE_APP_NAME="AURAS Pay"
VITE_APP_VERSION="1.0.0"
VITE_NODE_ENV=production
ENV_FILE

# Also create .env.local for immediate use
cat > frontend/.env.local << ENV_FILE
VITE_API_URL=http://${DOMAIN}:3001
ENV_FILE

print_header "Step 3: Building All Projects"

# Build frontend
print_status "Building frontend..."
cd frontend
npm run build
cd ..

# Build landing page
print_status "Building landing page..."
cd landingpage
npm run build
cd ..

# Build wallet page
print_status "Building wallet page..."
cd walletPage
npm run build
cd ..

print_header "Step 4: Creating Deployment Package"

# Create deployment directory
DEPLOY_DIR="auras-pay-deployment-$(date +%Y%m%d_%H%M%S)"
mkdir -p "$DEPLOY_DIR"

print_status "Creating deployment package in $DEPLOY_DIR..."

# Copy essential files
cp -r backend "$DEPLOY_DIR/"
cp -r frontend/dist "$DEPLOY_DIR/frontend-dist"
cp -r landingpage/.next "$DEPLOY_DIR/landingpage-next"
cp -r walletPage/.next "$DEPLOY_DIR/walletPage-next"
cp -r landingpage/public "$DEPLOY_DIR/landingpage-public"
cp -r walletPage/public "$DEPLOY_DIR/walletPage-public"

# Copy server files
cp landingpage/server.js "$DEPLOY_DIR/landingpage-server.js"
cp walletPage/server.js "$DEPLOY_DIR/walletPage-server.js"
cp landingpage/package.json "$DEPLOY_DIR/landingpage-package.json"
cp walletPage/package.json "$DEPLOY_DIR/walletPage-package.json"

# Copy configuration files
cp ecosystem.config.js "$DEPLOY_DIR/"
cp nginx.conf "$DEPLOY_DIR/"
cp package.json "$DEPLOY_DIR/"

# Create production structure
mkdir -p "$DEPLOY_DIR/landingpage"
mkdir -p "$DEPLOY_DIR/walletPage"
mkdir -p "$DEPLOY_DIR/frontend"

# Move files to proper structure
mv "$DEPLOY_DIR/landingpage-next" "$DEPLOY_DIR/landingpage/.next"
mv "$DEPLOY_DIR/landingpage-public" "$DEPLOY_DIR/landingpage/public"
mv "$DEPLOY_DIR/landingpage-server.js" "$DEPLOY_DIR/landingpage/server.js"
mv "$DEPLOY_DIR/landingpage-package.json" "$DEPLOY_DIR/landingpage/package.json"

mv "$DEPLOY_DIR/walletPage-next" "$DEPLOY_DIR/walletPage/.next"
mv "$DEPLOY_DIR/walletPage-public" "$DEPLOY_DIR/walletPage/public"
mv "$DEPLOY_DIR/walletPage-server.js" "$DEPLOY_DIR/walletPage/server.js"
mv "$DEPLOY_DIR/walletPage-package.json" "$DEPLOY_DIR/walletPage/package.json"

mv "$DEPLOY_DIR/frontend-dist" "$DEPLOY_DIR/frontend/dist"

# Create deployment script
cat > "$DEPLOY_DIR/deploy-server.sh" << 'DEPLOY_SCRIPT'
#!/bin/bash

# Server Deployment Script
echo "🚀 Deploying AURAS Pay on server..."

# Install global dependencies if needed
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

# Start all services
echo "Starting all services with PM2..."
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

echo "✅ Deployment completed!"
echo ""
echo "🌐 Access your application:"
echo "   Main Site: http://91.99.185.144"
echo "   Wallet: http://91.99.185.144/wallet"
echo "   Login: http://91.99.185.144/login"
echo "   Dashboard: http://91.99.185.144:5174"
echo "   Health Check: http://91.99.185.144:3001/health"
echo ""
echo "📊 Useful commands:"
echo "   pm2 status - Check all services"
echo "   pm2 logs - View all logs"
echo "   pm2 restart all - Restart all services"
echo ""
DEPLOY_SCRIPT

chmod +x "$DEPLOY_DIR/deploy-server.sh"

print_header "Step 5: Creating Zip Package"

# Create zip file
ZIP_NAME="auras-pay-deployment-$(date +%Y%m%d_%H%M%S).zip"
zip -r "$ZIP_NAME" "$DEPLOY_DIR"

print_status "Deployment package created: $ZIP_NAME"

print_header "Deployment Fix Completed Successfully!"

echo -e "\n${GREEN}🎉 All issues have been fixed and deployment package created!${NC}\n"

echo -e "${BLUE}📦 Deployment Package:${NC} $ZIP_NAME"
echo -e "${BLUE}📁 Deployment Folder:${NC} $DEPLOY_DIR"

echo -e "\n${YELLOW}🔧 Issues Fixed:${NC}"
echo -e "   ✅ Auras Wallet button now uses relative URL (/wallet)"
echo -e "   ✅ Backend enhanced with debug logging and error handling"
echo -e "   ✅ Login/Register pages created with proper redirects"
echo -e "   ✅ Nginx configuration updated for proper routing"
echo -e "   ✅ PM2 ecosystem configuration improved"
echo -e "   ✅ Environment variables properly configured"

echo -e "\n${BLUE}🚀 Deployment Instructions:${NC}"
echo -e "   1. Upload $ZIP_NAME to your server"
echo -e "   2. Unzip: unzip $ZIP_NAME"
echo -e "   3. Run: cd $DEPLOY_DIR && ./deploy-server.sh"

echo -e "\n${GREEN}🌐 Access URLs after deployment:${NC}"
echo -e "   Main Site: http://91.99.185.144"
echo -e "   Wallet Page: http://91.99.185.144/wallet"
echo -e "   Login: http://91.99.185.144/login"
echo -e "   Register: http://91.99.185.144/register"
echo -e "   Dashboard: http://91.99.185.144:5174"
echo -e "   Health Check: http://91.99.185.144:3001/health"

print_status "Deployment fix script completed successfully!"
