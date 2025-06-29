# 🌟 AURAS Pay - Complete Payment Solution

A comprehensive payment platform built with React, Node.js, and Solana blockchain integration, featuring a modern dashboard, admin panel, and landing pages.

## 🚀 Quick Start

### Prerequisites
- **Node.js** (version 18 or higher)
- **npm** (comes with Node.js)
- **Git**

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone <your-repository-url>
   cd "Auras Pay"
   ```

2. **Run the automated setup script:**
   
   **For macOS/Linux:**
   ```bash
   chmod +x setup.sh
   ./setup.sh
   ```
   
   **For Windows:**
   ```batch
   setup.bat
   ```

   Or manually install dependencies:
   ```bash
   npm install
   npm run install:all
   ```

3. **Start all services:**
   ```bash
   npm run dev:all
   ```

### 🌐 Access Your Application

Once everything is running, you can access:

- **🏠 Landing Page**: http://localhost:5174/
- **💼 Dashboard**: http://localhost:5174/dashboard  
- **👑 Admin Panel**: http://localhost:5174/admin
- **🔗 API Backend**: http://localhost:3001
- **💳 Wallet Page**: http://localhost:3000

### 🔐 Default Admin Credentials

- **Email**: `admin@aurasepay.com`
- **Password**: `admin123`

> ⚠️ **Important**: Change the admin password after first login!

## 📁 Project Structure

```
Auras Pay/
├── backend/          # Node.js API server with Prisma ORM
├── frontend/         # React dashboard with Vite
├── landingpage/      # Next.js landing page
├── walletPage/       # Next.js wallet landing page
├── setup.sh          # Automated setup script
└── README.md
```

## 🛠️ Manual Setup (Alternative)

If the automated setup doesn't work, follow these steps:

### 1. Install Dependencies
```bash
# Root dependencies
npm install

# Backend dependencies
cd backend && npm install && cd ..

# Frontend dependencies  
cd frontend && npm install && cd ..

# Landing page dependencies
cd landingpage && npm install && cd ..

# Wallet page dependencies
cd walletPage && npm install && cd ..
```

### 2. Database Setup
```bash
cd backend
cp env.example .env  # Create environment file
npx prisma generate  # Generate Prisma client
npx prisma migrate dev --name init  # Run migrations
node scripts/setup-admin.js  # Create admin user
cd ..
```

### 3. Build Static Files
```bash
cd landingpage
npm run build
cd ..
cp -r landingpage/out/* frontend/public/
```

### 4. Start Development
```bash
npm run dev:all
```

## 📋 Available Scripts

From the root directory:

- `npm run dev:all` - Start all services (backend, frontend, wallet page)
- `npm run dev` - Start backend and frontend only
- `npm run install:all` - Install dependencies for all projects
- `npm run build:landing` - Build landing page
- `npm run deploy:landing` - Build and deploy landing page

## 🔧 Environment Configuration

Create `.env` files in each project directory:

### Backend (.env)
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-jwt-secret"
SOLANA_NETWORK="devnet"
# Add your Solana configuration
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3001
VITE_SOLANA_NETWORK=devnet
```

## 🌟 Features

### 💼 Dashboard Features
- User authentication and registration
- Payment creation and management
- Transaction history
- Settings and profile management
- Modern dark theme UI

### 👑 Admin Panel Features
- User management
- Payment oversight
- System analytics
- Modern glassmorphism design
- Dark theme interface

### 🌐 Landing Pages
- Professional marketing site
- Wallet-focused landing page
- Responsive design
- Modern animations and effects

### 🔗 Backend API
- RESTful API endpoints
- JWT authentication
- Prisma ORM with SQLite
- Solana blockchain integration
- Comprehensive middleware

## 🚀 Deployment

The project is configured for easy deployment:

1. **Build all projects**:
   ```bash
   npm run build:all
   ```

2. **Deploy static files**:
   ```bash
   npm run deploy:landing
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Troubleshooting

### Port Conflicts
If you encounter port conflicts:
- Backend runs on port 3001
- Frontend runs on port 5174  
- Wallet page runs on port 3000

### Database Issues
```bash
cd backend
npx prisma migrate reset
npx prisma migrate dev
node scripts/setup-admin.js
```

### Node Modules Issues
```bash
rm -rf node_modules package-lock.json
rm -rf */node_modules */package-lock.json
npm install
npm run install:all
```

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the documentation in each project folder
- Review the API documentation in `backend/API_DOCUMENTATION.md`

---

Built with ❤️ by the AURAS Pay team 