# AURAS Pay Backend

Decentralized crypto payment gateway for merchants, built on Solana blockchain.

## Features

- 🔐 JWT Authentication & API Key Management
- 💳 Solana Pay Integration
- 📊 Credit-based Usage System
- 💰 Stripe Payment Processing
- 🎯 QR Code Generation
- 📈 Payment Analytics
- 🔒 Non-custodial Design

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Blockchain**: Solana (@solana/pay, @solana/web3.js)
- **Payments**: Stripe
- **Authentication**: JWT + bcrypt
- **Validation**: express-validator
- **Security**: helmet, cors, rate-limiting

## Quick Start

### 1. Prerequisites

- Node.js 18+ installed
- PostgreSQL database running
- Stripe account (for credit purchases)

### 2. Installation

```bash
# Clone and navigate to backend
cd backend

# Install dependencies
npm install

# Copy environment variables
cp env.example .env
```

### 3. Environment Setup

Edit `.env` file with your configuration:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/auras_pay?schema=public"

# JWT Secret (generate a strong secret)
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_EXPIRES_IN="7d"

# Server Configuration
PORT=3001
NODE_ENV="development"

# Solana Configuration
SOLANA_NETWORK="devnet"
SOLANA_RPC_URL="https://api.devnet.solana.com"

# Stripe Configuration
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"
STRIPE_PUBLISHABLE_KEY="pk_test_your_stripe_publishable_key"

# Frontend URL
FRONTEND_URL="http://localhost:3000"
```

### 4. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# (Optional) Open Prisma Studio to view data
npx prisma studio
```

### 5. Start Development Server

```bash
# Start in development mode
npm run dev

# Or start in production mode
npm start
```

The server will be running at `http://localhost:3001`

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | User login | No |
| GET | `/auth/me` | Get user profile | JWT |

### Payments

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/payment-link` | Create payment link | API Key or JWT |
| GET | `/api/payments` | Get payment history | JWT |
| GET | `/api/payments/:id` | Get payment details | JWT |
| GET | `/api/balance` | Get credit balance | JWT |
| GET | `/api/stats` | Get payment statistics | JWT |

### Webhooks

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/webhooks/stripe` | Stripe webhook handler | Webhook Secret |

## API Usage Examples

### 1. Register User

```bash
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "merchant@example.com",
    "password": "SecurePass123",
    "walletAddress": "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM"
  }'
```

### 2. Create Payment Link

```bash
curl -X POST http://localhost:3001/api/payment-link \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "amount": 0.1,
    "currency": "SOL",
    "label": "My Store",
    "message": "Payment for Order #123"
  }'
```

### 3. Get Payment History

```bash
curl -X GET "http://localhost:3001/api/payments?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Database Schema

### Users Table
- `id` - UUID primary key
- `email` - Unique email address
- `password_hash` - Bcrypt hashed password
- `wallet_address` - Solana wallet address
- `api_key` - Unique API key for programmatic access
- `transaction_credits` - Available credits for creating payments
- `status` - Account status (ACTIVE, INACTIVE, SUSPENDED)

### Payments Table
- `id` - UUID primary key
- `user_id` - Foreign key to users
- `amount` - Payment amount
- `currency` - Payment currency (SOL, USDC)
- `label` - Merchant label
- `message` - Payment message/memo
- `solana_pay_url` - Generated Solana Pay URL
- `qr_code_data` - Base64 QR code image
- `status` - Payment status (PENDING, COMPLETED, EXPIRED, FAILED)

### Transactions Table
- `id` - UUID primary key
- `user_id` - Foreign key to users
- `credits_added` - Number of credits purchased
- `amount_paid` - Amount paid in USD
- `payment_method` - Payment method (STRIPE, PAYPAL, CRYPTO)
- `stripe_payment_id` - Stripe payment ID
- `status` - Transaction status

## Credit System

AURAS Pay uses a prepaid credit system:

- **1 Credit = 1 Payment Link**
- New users get **5 free credits**
- Credit packages:
  - 100 credits = $10 ($0.10 per payment)
  - 500 credits = $40 ($0.08 per payment)
  - 1000 credits = $70 ($0.07 per payment)

## Solana Pay Integration

Payment links use the Solana Pay standard:

```
solana:WALLET_ADDRESS?amount=AMOUNT&label=MERCHANT_NAME&message=INVOICE_ID
```

Features:
- Direct wallet-to-wallet payments
- QR code generation
- Non-custodial design
- Support for SOL and USDC

## Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Input Validation**: All inputs validated and sanitized
- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based auth
- **API Key Authentication**: UUID-based API keys
- **CORS Protection**: Configured for frontend origin
- **Error Handling**: Comprehensive error handling and logging

## Development Commands

```bash
# Install dependencies
npm install

# Start development server with auto-reload
npm run dev

# Start production server
npm start

# Run tests
npm test

# Database commands
npm run migrate    # Run migrations
npm run generate   # Generate Prisma client
npm run studio     # Open Prisma Studio
```

## Deployment

### Railway (Recommended)

1. Connect your GitHub repository to Railway
2. Set environment variables in Railway dashboard
3. Deploy automatically on git push

### Manual Deployment

1. Build the application:
```bash
npm install --production
npx prisma generate
npx prisma migrate deploy
```

2. Start the server:
```bash
npm start
```

## Environment Variables Reference

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Yes | - |
| `JWT_SECRET` | JWT signing secret | Yes | - |
| `JWT_EXPIRES_IN` | JWT expiration time | No | 7d |
| `PORT` | Server port | No | 3001 |
| `NODE_ENV` | Environment mode | No | development |
| `SOLANA_NETWORK` | Solana network | No | devnet |
| `SOLANA_RPC_URL` | Solana RPC endpoint | No | devnet URL |
| `STRIPE_SECRET_KEY` | Stripe secret key | Yes | - |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret | Yes | - |
| `FRONTEND_URL` | Frontend URL for CORS | No | http://localhost:3000 |

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check DATABASE_URL format
   - Ensure PostgreSQL is running
   - Verify credentials

2. **Stripe Webhook Issues**
   - Check webhook secret
   - Verify endpoint URL
   - Test with Stripe CLI

3. **Solana Pay Errors**
   - Validate wallet addresses
   - Check network configuration
   - Verify amount format

### Logs

The application logs all important events:
- User registrations and logins
- Payment link creations
- Credit purchases
- Errors and warnings

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details. 