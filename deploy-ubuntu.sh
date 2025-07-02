#!/bin/bash

# AURAS Pay - Ubuntu Server Deployment Script
# Run with: chmod +x deploy-ubuntu.sh && sudo ./deploy-ubuntu.sh

set -e

echo "🚀 Starting AURAS Pay Ubuntu Server Deployment..."

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

# Check if running as root
if [[ $EUID -ne 0 ]]; then
   print_error "This script must be run as root (use sudo)"
   exit 1
fi

# Get domain from user
print_header "Domain Configuration"
read -p "Enter your domain name (e.g., yourdomain.com): " DOMAIN
if [[ -z "$DOMAIN" ]]; then
    print_error "Domain name is required"
    exit 1
fi

# Update system
print_header "Updating System"
apt update && apt upgrade -y

# Install required packages
print_header "Installing Required Packages"
apt install -y nginx postgresql postgresql-contrib curl wget unzip git

# Install Node.js 18.x
print_header "Installing Node.js 18.x"
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Install PM2 globally
print_header "Installing PM2"
npm install -g pm2 serve

# Setup PostgreSQL
print_header "Setting up PostgreSQL"
systemctl start postgresql
systemctl enable postgresql

# Create database and user
print_status "Creating database and user..."
sudo -u postgres psql << EOF
CREATE DATABASE auras_pay;
CREATE USER auras_user WITH ENCRYPTED PASSWORD 'auras_pay_strong_password_2024';
GRANT ALL PRIVILEGES ON DATABASE auras_pay TO auras_user;
\q
EOF

# Create application user
print_header "Creating Application User"
if ! id "auras" &>/dev/null; then
    useradd -m -s /bin/bash auras
    print_status "Created user 'auras'"
else
    print_status "User 'auras' already exists"
fi

# Get current directory (where the project is)
SCRIPT_DIR=$(dirname "$(readlink -f "$0")")
APP_DIR="/home/auras/auras-pay"

# Copy project to application directory
print_header "Setting up Application Directory"
if [ -d "$APP_DIR" ]; then
    print_warning "Removing existing application directory"
    rm -rf "$APP_DIR"
fi

mkdir -p "$APP_DIR"
cp -r "$SCRIPT_DIR"/* "$APP_DIR/"
chown -R auras:auras "$APP_DIR"

# Switch to auras user for the rest of the setup
print_header "Setting up Application as 'auras' user"

# Create setup script for auras user
cat > /tmp/auras_setup.sh << 'SETUP_SCRIPT'
#!/bin/bash
cd /home/auras/auras-pay

# Create logs directory
mkdir -p logs

# Setup environment files
echo "Setting up environment files..."

# Backend environment
cat > backend/.env << ENV_FILE
DATABASE_URL="postgresql://auras_user:auras_pay_strong_password_2024@localhost:5432/auras_pay?schema=public"
JWT_SECRET="$(openssl rand -base64 64)"
JWT_EXPIRES_IN="7d"
PORT=3001
NODE_ENV="production"
FRONTEND_URL="http://0.0.0.0:5174"
API_URL="http://0.0.0.0:3001"
SOLANA_NETWORK="mainnet-beta"
SOLANA_RPC_URL="https://api.mainnet-beta.solana.com"
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
ALLOWED_ORIGINS="http://0.0.0.0:5174,http://0.0.0.0:3000,http://0.0.0.0:3002,http://localhost:5174,http://localhost:3000,http://localhost:3002"
ENV_FILE

# Frontend environment
cat > frontend/.env << ENV_FILE
VITE_API_URL=http://0.0.0.0:3001
VITE_APP_NAME="AURAS Pay"
VITE_APP_VERSION="1.0.0"
VITE_NODE_ENV=production
ENV_FILE

# Also create .env.local for immediate use
cat > frontend/.env.local << ENV_FILE
VITE_API_URL=http://0.0.0.0:3001
ENV_FILE

# Install dependencies
echo "Installing dependencies..."
npm install

# Install backend dependencies
cd backend
npm install
cd ..

# Install frontend dependencies
cd frontend
npm install
cd ..

# Install landing page dependencies
cd landingpage
npm install
cd ..

# Install wallet page dependencies
cd walletPage
npm install
cd ..

# Run database migrations
echo "Running database migrations..."
cd backend
npx prisma migrate deploy
npx prisma generate

# Create admin user
echo "Creating admin user..."
node scripts/setup-admin.js
cd ..

# Build all projects
echo "Building all projects..."
npm run build:all

echo "Application setup completed!"
SETUP_SCRIPT

# Replace domain placeholder and run setup
sed "s/DOMAIN_PLACEHOLDER/$DOMAIN/g" /tmp/auras_setup.sh > /tmp/auras_setup_final.sh
chmod +x /tmp/auras_setup_final.sh
chown auras:auras /tmp/auras_setup_final.sh

# Run setup as auras user
sudo -u auras /tmp/auras_setup_final.sh

# Setup PM2 ecosystem
print_header "Setting up PM2"
sudo -u auras pm2 start "$APP_DIR/ecosystem.config.js"
sudo -u auras pm2 save
sudo -u auras pm2 startup systemd -u auras --hp /home/auras

# Setup Nginx
print_header "Setting up Nginx"
# Replace domain in nginx config
sed "s/yourdomain.com/$DOMAIN/g" "$APP_DIR/nginx.conf" > /etc/nginx/sites-available/auras-pay

# Enable site
ln -sf /etc/nginx/sites-available/auras-pay /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test nginx config
nginx -t

# Setup SSL with Let's Encrypt
print_header "Setting up SSL Certificate"
snap install --classic certbot
ln -sf /snap/bin/certbot /usr/bin/certbot

print_status "Obtaining SSL certificate..."
certbot --nginx -d "$DOMAIN" -d "www.$DOMAIN" --non-interactive --agree-tos --email admin@$DOMAIN

# Start services
print_header "Starting Services"
systemctl restart nginx
systemctl enable nginx

# Setup firewall
print_header "Configuring Firewall"
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw allow 3001/tcp  # Backend API
ufw allow 5174/tcp  # Frontend
ufw allow 3000/tcp  # Wallet Page
ufw --force enable

# Create backup script
print_header "Creating Backup Script"
cat > /home/auras/backup.sh << 'BACKUP_SCRIPT'
#!/bin/bash
BACKUP_DIR="/home/auras/backups"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p "$BACKUP_DIR"

# Backup database
pg_dump -h localhost -U auras_user -d auras_pay > "$BACKUP_DIR/database_$DATE.sql"

# Backup application
tar -czf "$BACKUP_DIR/app_$DATE.tar.gz" -C /home/auras auras-pay

# Keep only last 7 backups
find "$BACKUP_DIR" -name "*.sql" -mtime +7 -delete
find "$BACKUP_DIR" -name "*.tar.gz" -mtime +7 -delete

echo "Backup completed: $DATE"
BACKUP_SCRIPT

chmod +x /home/auras/backup.sh
chown auras:auras /home/auras/backup.sh

# Setup daily backup cron
echo "0 2 * * * /home/auras/backup.sh" | sudo -u auras crontab -

# Clean up temporary files
rm -f /tmp/auras_setup.sh /tmp/auras_setup_final.sh

print_header "Deployment Completed Successfully!"

echo -e "\n${GREEN}🎉 AURAS Pay has been deployed successfully!${NC}\n"
echo -e "${BLUE}Access your application:${NC}"
echo -e "🌐 Main App: https://$DOMAIN"
echo -e "🔧 Admin Panel: https://$DOMAIN/admin"
echo -e "💼 Wallet: https://$DOMAIN/wallet"
echo -e "📊 API Health: https://$DOMAIN/health"

echo -e "\n${BLUE}Admin Credentials:${NC}"
echo -e "Email: admin@aurasepay.com"
echo -e "Password: admin123"

echo -e "\n${BLUE}Important Files:${NC}"
echo -e "📁 App Directory: /home/auras/auras-pay"
echo -e "📄 Nginx Config: /etc/nginx/sites-available/auras-pay"
echo -e "📋 PM2 Status: sudo -u auras pm2 status"
echo -e "📝 Logs: /home/auras/auras-pay/logs/"

echo -e "\n${YELLOW}Next Steps:${NC}"
echo -e "1. Update your DNS records to point to this server"
echo -e "2. Configure your Stripe keys in backend/.env"
echo -e "3. Test all functionality"
echo -e "4. Set up monitoring (optional)"

echo -e "\n${GREEN}Useful Commands:${NC}"
echo -e "📊 Check PM2 status: sudo -u auras pm2 status"
echo -e "🔄 Restart services: sudo -u auras pm2 restart all"
echo -e "📋 View logs: sudo -u auras pm2 logs"
echo -e "🔧 Restart Nginx: sudo systemctl restart nginx"
echo -e "💾 Manual backup: sudo -u auras /home/auras/backup.sh"

print_status "Deployment script completed successfully!" 