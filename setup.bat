@echo off
echo.
echo 🚀 Setting up AURAS Pay project...
echo ==================================
echo.

REM Check if Node.js is installed
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js (version 18 or higher) first.
    echo    Download from: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js detected
echo.

REM Install root dependencies
echo 📦 Installing root dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install root dependencies
    pause
    exit /b 1
)

echo.
echo 📦 Installing all project dependencies...
call npm run install:all
if %errorlevel% neq 0 (
    echo ❌ Failed to install project dependencies
    pause
    exit /b 1
)

echo.
echo 🗄️  Setting up database...
cd backend

REM Copy environment file if it doesn't exist
if not exist .env (
    if exist env.example (
        copy env.example .env
        echo ✅ Created .env file from env.example
    ) else (
        echo ⚠️  No env.example file found. You'll need to create .env manually.
    )
)

REM Generate Prisma client
echo 🔧 Generating Prisma client...
call npx prisma generate
if %errorlevel% neq 0 (
    echo ❌ Failed to generate Prisma client
    pause
    exit /b 1
)

REM Run database migrations
echo 🔧 Running database migrations...
call npx prisma migrate dev --name init
if %errorlevel% neq 0 (
    echo ❌ Failed to run database migrations
    pause
    exit /b 1
)

REM Setup admin user
echo 👤 Setting up admin user...
call node scripts/setup-admin.js
if %errorlevel% neq 0 (
    echo ❌ Failed to setup admin user
    pause
    exit /b 1
)

cd ..

REM Build landing page static files
echo.
echo 🏗️  Building landing page...
cd landingpage
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Failed to build landing page
    pause
    exit /b 1
)
cd ..

REM Copy static files to frontend
echo 📁 Copying static files to frontend...
xcopy /E /Y landingpage\out\* frontend\public\

echo.
echo 🎉 Setup complete!
echo ==================================
echo.
echo 🚀 To start the development environment:
echo    npm run dev:all    # Start all services (recommended)
echo    npm run dev        # Start backend + frontend only
echo.
echo 📱 Your services will be available at:
echo    🌐 Landing Page:  http://localhost:5174/
echo    💼 Dashboard:     http://localhost:5174/dashboard
echo    👑 Admin Panel:   http://localhost:5174/admin
echo    🔗 API Backend:   http://localhost:3001
echo    💳 Wallet Page:   http://localhost:3000
echo.
echo 🔐 Admin credentials:
echo    Email: admin@aurasepay.com
echo    Password: admin123
echo.
echo ⚠️  IMPORTANT:
echo    1. Change the admin password after first login
echo    2. Update .env files with your configuration
echo    3. Make sure to set up your Solana wallet for payments
echo.
echo 📚 For more information, check the README.md file
echo.
pause 