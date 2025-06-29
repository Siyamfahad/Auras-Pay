#!/bin/bash

# AURAS Pay Setup Script
# This script sets up the entire AURAS Pay project after cloning from git

echo "🚀 Setting up AURAS Pay project..."
echo "=================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js (version 18 or higher) first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install root dependencies
echo ""
echo "📦 Installing root dependencies..."
npm install

# Install all project dependencies
echo ""
echo "📦 Installing all project dependencies..."
npm run install:all

# Set up backend database
echo ""
echo "🗄️  Setting up database..."
cd backend

# Copy environment file if it doesn't exist
if [ ! -f .env ]; then
    if [ -f env.example ]; then
        cp env.example .env
        echo "✅ Created .env file from env.example"
    else
        echo "⚠️  No env.example file found. You'll need to create .env manually."
    fi
fi

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Run database migrations
echo "🔧 Running database migrations..."
npx prisma migrate dev --name init

# Setup admin user
echo "👤 Setting up admin user..."
node scripts/setup-admin.js

cd ..

# Build landing page static files
echo ""
echo "🏗️  Building landing page..."
cd landingpage
npm run build
cd ..

# Copy static files to frontend
echo "📁 Copying static files to frontend..."
cp -r landingpage/out/* frontend/public/

echo ""
echo "🎉 Setup complete!"
echo "=================================="
echo ""
echo "🚀 To start the development environment:"
echo "   npm run dev:all    # Start all services (recommended)"
echo "   npm run dev        # Start backend + frontend only"
echo ""
echo "📱 Your services will be available at:"
echo "   🌐 Landing Page:  http://localhost:5174/"
echo "   💼 Dashboard:     http://localhost:5174/dashboard"
echo "   👑 Admin Panel:   http://localhost:5174/admin"
echo "   🔗 API Backend:   http://localhost:3001"
echo "   💳 Wallet Page:   http://localhost:3000"
echo ""
echo "🔐 Admin credentials:"
echo "   Email: admin@aurasepay.com"
echo "   Password: admin123"
echo ""
echo "⚠️  IMPORTANT:"
echo "   1. Change the admin password after first login"
echo "   2. Update .env files with your configuration"
echo "   3. Make sure to set up your Solana wallet for payments"
echo ""
echo "📚 For more information, check the README.md file"
echo "" 