# 🔷 AURAS Pay

**Decentralized crypto payment gateway for merchants, built on Solana blockchain.**

Non-custodial by design – payments are always peer-to-peer from customer to merchant.

## ✨ Features

- 🚀 **Solana Pay Integration** - Fast, low-cost blockchain payments
- 💳 **Credit-based System** - Prepaid model for payment link creation
- 🔐 **Non-custodial** - Direct wallet-to-wallet payments
- 📱 **QR Code Generation** - Easy mobile payments
- 🎯 **Merchant Dashboard** - Track payments and manage credits
- 🔑 **API Integration** - Integrate with your existing systems
- 💰 **Stripe Integration** - Easy credit purchases
- 📊 **Analytics** - Payment statistics and reporting

## 🏗️ Architecture

```
Customer Wallet → Solana Blockchain → Merchant Wallet
                      ↑
                AURAS Pay (facilitates)
```

**Key Principle**: AURAS Pay never holds funds. All payments go directly from customer to merchant.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Stripe account (for credit purchases)

### 1. Clone Repository

```bash
git clone <repository-url>
cd auras-pay
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Setup environment variables
cp env.example .env
# Edit .env with your configuration

# Setup database
npx prisma generate
npx prisma migrate dev --name init

# Start backend server
npm run dev
```

Backend will run on `http://localhost:3001`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your configuration

# Start frontend server
npm run dev
```

Frontend will run on `http://localhost:3000`

## 📋 Environment Variables

### Backend (.env)

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/auras_pay"

# JWT
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"

# Solana
SOLANA_NETWORK="devnet"
SOLANA_RPC_URL="https://api.devnet.solana.com"

# Stripe
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"

# Server
PORT=3001
FRONTEND_URL="http://localhost:3000"
```

### Frontend (.env)

```env
REACT_APP_API_URL="http://localhost:3001"
REACT_APP_STRIPE_PUBLISHABLE_KEY="pk_test_your_stripe_publishable_key"
```

## 🎯 How It Works

### For Merchants

1. **Register** - Create account with email and Solana wallet
2. **Get Credits** - Purchase credits via Stripe ($0.07-$0.10 per payment)
3. **Create Payment Links** - Generate Solana Pay URLs and QR codes
4. **Share with Customers** - Send links or show QR codes
5. **Receive Payments** - Funds go directly to your wallet

### For Customers

1. **Scan QR Code** - Or click payment link
2. **Open Solana Wallet** - Phantom, Solflare, etc.
3. **Approve Payment** - Transaction goes directly to merchant
4. **Instant Settlement** - No intermediaries

## 💰 Pricing

**Credit-based Model** (1 credit = 1 payment link)

- 100 credits = $10 ($0.10 per payment)
- 500 credits = $40 ($0.08 per payment)
- 1000 credits = $70 ($0.07 per payment)

**New users get 5 free credits!**

## 🔌 API Integration

### Create Payment Link

```bash
curl -X POST http://localhost:3001/api/payment-link \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "amount": 0.1,
    "currency": "SOL",
    "label": "My Store",
    "message": "Order #123"
  }'
```

### Response

```json
{
  "success": true,
  "data": {
    "payment": {
      "id": "uuid",
      "solanaPayUrl": "solana:wallet?amount=0.1&label=My%20Store&message=Order%20123",
      "qrCodeData": "data:image/png;base64,iVBOR...",
      "amount": 0.1,
      "currency": "SOL"
    },
    "creditsRemaining": 99
  }
}
```

## 🛠️ Tech Stack

### Backend
- **Node.js + Express** - Server framework
- **PostgreSQL + Prisma** - Database and ORM
- **@solana/pay** - Solana Pay protocol
- **Stripe** - Credit card processing
- **JWT** - Authentication

### Frontend
- **React + Vite** - UI framework
- **Tailwind CSS** - Styling
- **React Query** - API state management
- **React Router** - Navigation

## 📊 Database Schema

### Users
- Authentication & wallet info
- Credit balance tracking
- API key management

### Payments
- Payment link records
- Solana Pay URLs
- QR code data

### Transactions
- Credit purchase history
- Stripe payment tracking

## 🔒 Security

- **Rate Limiting** - 100 requests per 15 minutes
- **Input Validation** - All inputs sanitized
- **Password Hashing** - bcrypt with salt
- **JWT Authentication** - Secure token-based auth
- **API Key Protection** - UUID-based API keys
- **Non-custodial Design** - No funds ever held

## 🚀 Deployment

### Backend (Railway)

1. Connect GitHub repo to Railway
2. Set environment variables
3. Deploy automatically

### Frontend (Vercel)

1. Connect GitHub repo to Vercel
2. Set environment variables
3. Deploy automatically

### Database (Supabase)

1. Create Supabase project
2. Copy connection string to DATABASE_URL
3. Run migrations

## 📈 Roadmap

### Phase 1 (Current)
- ✅ MVP Backend API
- ✅ Authentication system
- ✅ Solana Pay integration
- ✅ Credit system
- ✅ Stripe integration

### Phase 2 (Next)
- 🔄 React frontend dashboard
- 🔄 Payment link management
- 🔄 Analytics dashboard
- 🔄 Email notifications

### Phase 3 (Future)
- 📱 Mobile app
- 🌐 Multi-currency support
- 📊 Advanced analytics
- 🏢 Enterprise features

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📧 Email: support@auraspay.com
- 💬 Discord: [Join our community](https://discord.gg/auraspay)
- 📖 Docs: [docs.auraspay.com](https://docs.auraspay.com)

## 🌟 Why AURAS Pay?

### vs Traditional Payment Processors
- ❌ **Traditional**: 2.9% + $0.30 per transaction
- ✅ **AURAS Pay**: $0.07-$0.10 per transaction (flat fee)

### vs Other Crypto Gateways
- ❌ **Others**: Complex setup, high fees, custodial
- ✅ **AURAS Pay**: Simple setup, low fees, non-custodial

### vs Coinbase Commerce
- ❌ **Coinbase**: 1% fee, limited to USD settlements
- ✅ **AURAS Pay**: Flat fee, Solana-native, faster

---

**Built with ❤️ for the Solana ecosystem** 