# AURAS Pay API Documentation

## Overview

The AURAS Pay API allows merchants to integrate crypto payments into their e-commerce stores programmatically. Each API call deducts 1 credit from your account balance.

**Base URL:** `https://your-backend-url.com/api`

## Authentication

All API endpoints require authentication using your unique API key. Include your API key in the `Authorization` header:

```
Authorization: Bearer YOUR_API_KEY
```

### Getting Your API Key

1. Log into your AURAS Pay dashboard
2. Go to Settings → API Integration
3. Click "Generate API Key"
4. **Important:** Store your API key securely - you won't be able to see it again

## Rate Limiting

- **100 requests per 15 minutes** per IP address
- HTTP 429 status code returned when limit exceeded

## Credit System

- **1 credit = 1 payment link creation**
- API calls automatically deduct credits from your account
- HTTP 402 status code returned when insufficient credits
- Purchase credits through the dashboard or Stripe integration

## API Endpoints

### 1. Create Payment Link

Create a new payment request for your customers.

**Endpoint:** `POST /api/v1/payment-links`

**Request Body:**
```json
{
  "amount": 0.1,
  "currency": "SOL",
  "label": "Premium Subscription",
  "message": "Monthly subscription payment",
  "reference": "ORDER-123",
  "walletAddress": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
  "webhookUrl": "https://yourstore.com/webhooks/payment"
}
```

**Parameters:**
- `amount` (required): Payment amount (minimum 0.000000001)
- `currency` (optional): "SOL" or "USDC" (default: "SOL")
- `label` (required): Payment description (max 100 chars)
- `message` (optional): Additional message (max 200 chars)
- `reference` (optional): Your internal reference ID (max 100 chars)
- `walletAddress` (optional): Recipient wallet (uses your default if not provided)
- `webhookUrl` (optional): URL to receive payment notifications

**Response:**
```json
{
  "success": true,
  "message": "Payment link created successfully",
  "data": {
    "id": "payment-id-123",
    "amount": 0.1,
    "currency": "SOL",
    "label": "Premium Subscription",
    "message": "Monthly subscription payment",
    "solanaPayUrl": "solana:7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU?amount=0.1&label=Premium%20Subscription",
    "qrCodeData": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
    "reference": "ORDER-123",
    "status": "PENDING",
    "recipientWallet": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
    "createdAt": "2024-01-15T10:30:00Z",
    "creditsRemaining": 49
  }
}
```

### 2. Get Payment Status

Check the status of a specific payment.

**Endpoint:** `GET /api/v1/payment-links/{id}`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "payment-id-123",
    "amount": 0.1,
    "currency": "SOL",
    "label": "Premium Subscription",
    "message": "Monthly subscription payment",
    "solanaPayUrl": "solana:7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU?amount=0.1",
    "reference": "ORDER-123",
    "status": "COMPLETED",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:35:00Z"
  }
}
```

### 3. List Payment Links

Get a paginated list of your payment links.

**Endpoint:** `GET /api/v1/payment-links`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)
- `status` (optional): Filter by status (PENDING, COMPLETED, EXPIRED, FAILED)
- `reference` (optional): Filter by reference containing text
- `from_date` (optional): Filter from date (ISO 8601)
- `to_date` (optional): Filter to date (ISO 8601)

**Example:** `GET /api/v1/payment-links?page=1&limit=20&status=COMPLETED`

**Response:**
```json
{
  "success": true,
  "data": {
    "payments": [
      {
        "id": "payment-id-123",
        "amount": 0.1,
        "currency": "SOL",
        "label": "Premium Subscription",
        "reference": "ORDER-123",
        "status": "COMPLETED",
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalPayments": 50,
      "hasNextPage": true,
      "hasPreviousPage": false
    }
  }
}
```

### 4. Get Account Information

Get your account details and usage statistics.

**Endpoint:** `GET /api/v1/account`

**Response:**
```json
{
  "success": true,
  "data": {
    "account": {
      "id": "user-id-123",
      "email": "merchant@example.com",
      "walletAddress": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
      "transactionCredits": 50,
      "status": "ACTIVE",
      "createdAt": "2024-01-01T00:00:00Z"
    },
    "usage": {
      "totalPayments": 100,
      "apiPayments": 75,
      "dashboardPayments": 25,
      "completedPayments": 80,
      "creditsRemaining": 50
    }
  }
}
```

### 5. Get Supported Tokens

Get list of supported cryptocurrencies.

**Endpoint:** `GET /api/v1/supported-tokens`

**Response:**
```json
{
  "success": true,
  "data": {
    "tokens": [
      {
        "symbol": "SOL",
        "name": "Solana",
        "decimals": 9,
        "mintAddress": null
      },
      {
        "symbol": "USDC",
        "name": "USD Coin",
        "decimals": 6,
        "mintAddress": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
      }
    ]
  }
}
```

## Payment Statuses

- **PENDING**: Payment link created, waiting for customer payment
- **COMPLETED**: Payment received and verified on blockchain
- **EXPIRED**: Payment link expired (after 24 hours)
- **FAILED**: Payment failed or was rejected

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error message",
  "details": [
    {
      "field": "amount",
      "message": "Amount must be a positive number"
    }
  ]
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid API key)
- `402` - Payment Required (insufficient credits)
- `403` - Forbidden (account not active)
- `404` - Not Found
- `429` - Too Many Requests (rate limited)
- `500` - Internal Server Error

## Integration Examples

### Node.js/Express Example

```javascript
const axios = require('axios');

const aurasPayAPI = axios.create({
  baseURL: 'https://your-backend-url.com/api',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
});

// Create payment link
async function createPayment(orderData) {
  try {
    const response = await aurasPayAPI.post('/v1/payment-links', {
      amount: orderData.total,
      currency: 'SOL',
      label: `Order #${orderData.id}`,
      message: `Payment for ${orderData.items.length} items`,
      reference: orderData.id,
      webhookUrl: 'https://yourstore.com/webhooks/payment'
    });
    
    return response.data.data;
  } catch (error) {
    console.error('Payment creation failed:', error.response.data);
    throw error;
  }
}

// Check payment status
async function checkPaymentStatus(paymentId) {
  try {
    const response = await aurasPayAPI.get(`/v1/payment-links/${paymentId}`);
    return response.data.data;
  } catch (error) {
    console.error('Payment status check failed:', error.response.data);
    throw error;
  }
}
```

### Python Example

```python
import requests

class AurasPayAPI:
    def __init__(self, api_key, base_url):
        self.api_key = api_key
        self.base_url = base_url
        self.headers = {
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        }
    
    def create_payment(self, amount, label, reference=None):
        url = f"{self.base_url}/v1/payment-links"
        data = {
            'amount': amount,
            'currency': 'SOL',
            'label': label,
            'reference': reference
        }
        
        response = requests.post(url, json=data, headers=self.headers)
        response.raise_for_status()
        return response.json()['data']
    
    def get_payment_status(self, payment_id):
        url = f"{self.base_url}/v1/payment-links/{payment_id}"
        response = requests.get(url, headers=self.headers)
        response.raise_for_status()
        return response.json()['data']

# Usage
api = AurasPayAPI('YOUR_API_KEY', 'https://your-backend-url.com/api')
payment = api.create_payment(0.1, 'Premium Plan', 'ORDER-123')
print(f"Payment URL: {payment['solanaPayUrl']}")
```

### PHP Example

```php
<?php
class AurasPayAPI {
    private $apiKey;
    private $baseUrl;
    
    public function __construct($apiKey, $baseUrl) {
        $this->apiKey = $apiKey;
        $this->baseUrl = $baseUrl;
    }
    
    public function createPayment($amount, $label, $reference = null) {
        $url = $this->baseUrl . '/v1/payment-links';
        $data = [
            'amount' => $amount,
            'currency' => 'SOL',
            'label' => $label,
            'reference' => $reference
        ];
        
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Authorization: Bearer ' . $this->apiKey,
            'Content-Type: application/json'
        ]);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        
        $response = curl_exec($ch);
        curl_close($ch);
        
        return json_decode($response, true)['data'];
    }
}

// Usage
$api = new AurasPayAPI('YOUR_API_KEY', 'https://your-backend-url.com/api');
$payment = $api->createPayment(0.1, 'Premium Plan', 'ORDER-123');
echo "Payment URL: " . $payment['solanaPayUrl'];
?>
```

## Webhooks (Optional)

If you provide a `webhookUrl` when creating a payment, AURAS Pay will send HTTP POST notifications when payment status changes.

**Webhook Payload:**
```json
{
  "event": "payment.completed",
  "data": {
    "id": "payment-id-123",
    "reference": "ORDER-123",
    "amount": 0.1,
    "currency": "SOL",
    "status": "COMPLETED",
    "transactionSignature": "5J8...",
    "completedAt": "2024-01-15T10:35:00Z"
  }
}
```

**Webhook Events:**
- `payment.completed` - Payment successfully received
- `payment.failed` - Payment failed or rejected
- `payment.expired` - Payment link expired

## Best Practices

1. **Store API Key Securely**: Never expose your API key in client-side code
2. **Handle Rate Limits**: Implement exponential backoff for rate limit errors
3. **Validate Webhooks**: Verify webhook signatures (if implemented)
4. **Monitor Credits**: Check your credit balance regularly
5. **Error Handling**: Always handle API errors gracefully
6. **Reference IDs**: Use unique reference IDs for tracking
7. **Status Polling**: For critical payments, poll status periodically

## Support

- **Documentation**: [https://docs.auraspay.com](https://docs.auraspay.com)
- **Support Email**: support@auraspay.com
- **Discord**: [https://discord.gg/auraspay](https://discord.gg/auraspay)

---

*Last updated: December 2024* 