# AURAS Pay API Documentation

Welcome to the AURAS Pay API! This documentation provides comprehensive information about integrating with our Solana-based payment processing platform.

## Table of Contents
- [Overview](#overview)
- [Authentication](#authentication)
- [Rate Limiting](#rate-limiting)
- [Endpoints](#endpoints)
- [Webhooks](#webhooks)
- [Error Handling](#error-handling)
- [SDKs & Examples](#sdks--examples)

## Overview

AURAS Pay is a powerful Solana-based payment processing API that allows merchants to create payment links, process transactions, and manage payments seamlessly. Our API supports both SOL and USDC tokens with automatic QR code generation for easy mobile payments.

### Base URL
```
https://your-domain.com/api
```

### API Features
- ✅ Create payment links with Solana Pay integration
- ✅ Real-time payment verification
- ✅ Webhook notifications for all payment events
- ✅ Automatic payment expiration management
- ✅ QR code generation for mobile payments
- ✅ Support for SOL and USDC tokens
- ✅ Credit-based pricing system
- ✅ Rate limiting and security features

## Authentication

AURAS Pay API supports two authentication methods:

### 1. API Key Authentication

You can authenticate using your API key in two ways:

#### Option A: Authorization Bearer Header
```bash
curl -X POST https://your-domain.com/api/payments/payment-link \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json"
```

#### Option B: X-API-Key Header
```bash
curl -X POST https://your-domain.com/api/payments/payment-link \
  -H "X-API-Key: YOUR_API_KEY" \
  -H "Content-Type: application/json"
```

### 2. JWT Token Authentication

For dashboard access and admin operations:

```bash
curl -X POST https://your-domain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "your@email.com", "password": "password"}'
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user-id",
      "email": "your@email.com",
      "walletAddress": "wallet-address",
      "transactionCredits": 100
    }
  }
}
```

### Getting Your API Key

1. Login to your AURAS Pay dashboard
2. Navigate to Settings page
3. Your API key is displayed in the API section
4. Keep your API key secure and never expose it in client-side code

## Rate Limiting

API requests are rate-limited to prevent abuse:

- **Limit**: 100 requests per 15 minutes per API key
- **Headers**: Rate limit information is included in response headers
- **Status Code**: `429 Too Many Requests` when limit exceeded

**Rate Limit Headers:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## Endpoints

### Payments

#### Create Payment Link

Create a new payment link with Solana Pay integration.

**Endpoint:** `POST /api/payments/payment-link`

**Headers:**
```
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
```

**Request Body:**
```json
{
  "amount": 0.1,
  "currency": "SOL",
  "label": "Coffee Purchase",
  "message": "Thank you for your purchase!",
  "walletAddress": "recipient-wallet-address",
  "webhookUrl": "https://your-domain.com/webhook"
}
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `amount` | number | ✅ | Payment amount (min: 0.001, max: 1000000) |
| `currency` | string | ❌ | "SOL" or "USDC" (default: "SOL") |
| `label` | string | ✅ | Payment description (max: 100 chars) |
| `message` | string | ❌ | Additional message (max: 500 chars) |
| `walletAddress` | string | ❌ | Recipient wallet (uses your default if not provided) |
| `webhookUrl` | string | ❌ | URL for webhook notifications |

**Response:**
```json
{
  "success": true,
  "message": "Payment link created successfully",
  "data": {
    "payment": {
      "id": "payment-uuid",
    "amount": 0.1,
    "currency": "SOL",
      "label": "Coffee Purchase",
      "message": "Thank you for your purchase!",
      "solanaPayUrl": "solana:wallet?amount=0.1&reference=ref&label=Coffee...",
      "qrCodeData": "data:image/png;base64,iVBORw0KGgo...",
    "status": "PENDING",
      "createdAt": "2024-01-01T12:00:00.000Z"
    },
    "recipientWallet": "recipient-wallet-address",
    "invoiceId": "INV-1640995200-abc123",
    "creditsRemaining": 99
  }
}
```

#### Get Payment Details

Retrieve details of a specific payment.

**Endpoint:** `GET /api/payments/:id`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "payment-uuid",
    "amount": 0.1,
    "currency": "SOL",
    "label": "Coffee Purchase",
    "message": "Thank you for your purchase!",
    "status": "PENDING",
    "solanaPayUrl": "solana:wallet?amount=0.1...",
    "qrCodeData": "data:image/png;base64,iVBORw0KGgo...",
    "transactionSignature": null,
    "verifiedAt": null,
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  }
}
```

#### Verify Payment

Verify a payment transaction on the Solana blockchain.

**Endpoint:** `POST /api/payments/:id/verify`

**Request Body:**
```json
{
  "signature": "transaction-signature-from-solana"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment verified successfully",
  "data": {
    "payment": {
      "id": "payment-uuid",
    "status": "COMPLETED",
      "transactionSignature": "verified-signature",
      "verifiedAt": "2024-01-01T12:05:00.000Z"
    },
    "verification": {
      "isValid": true,
      "amount": 0.1,
      "currency": "SOL",
      "blockTime": 1640995500
    }
  }
}
```

#### List Payments

Get a paginated list of your payments.

**Endpoint:** `GET /api/payments`

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 10, max: 100) |
| `status` | string | Filter by status: PENDING, COMPLETED, EXPIRED, FAILED |
| `currency` | string | Filter by currency: SOL, USDC |

**Response:**
```json
{
  "success": true,
  "data": {
    "payments": [
      {
        "id": "payment-uuid",
        "amount": 0.1,
        "currency": "SOL",
        "label": "Coffee Purchase",
        "status": "COMPLETED",
        "createdAt": "2024-01-01T12:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 50,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

### Account Management

#### Get Account Balance

Get your current credit balance and account information.

**Endpoint:** `GET /api/payments/balance`

**Response:**
```json
{
  "success": true,
  "data": {
    "transactionCredits": 95,
    "walletAddress": "your-wallet-address",
    "email": "your@email.com"
  }
}
```

#### Get Payment Statistics

Get detailed statistics about your payments.

**Endpoint:** `GET /api/payments/stats`

**Response:**
```json
{
  "success": true,
  "data": {
    "totalPayments": 150,
    "completedPayments": 142,
    "pendingPayments": 3,
    "failedPayments": 5,
    "totalVolume": {
      "SOL": 12.5,
      "USDC": 1250.75
    },
    "thisMonth": {
      "payments": 25,
      "volume": {
        "SOL": 2.1,
        "USDC": 210.50
      }
    }
  }
}
```

#### Get Supported Tokens

Get list of supported cryptocurrency tokens.

**Endpoint:** `GET /api/payments/supported-tokens`

**Response:**
```json
{
  "success": true,
  "data": [
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
      "mintAddress": "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"
    }
  ]
}
```

## Webhooks

Webhooks allow you to receive real-time notifications about payment events. You can specify a `webhookUrl` when creating a payment to receive notifications.

### Webhook Events

| Event | Description |
|-------|-------------|
| `payment.created` | Payment link created |
| `payment.completed` | Payment successfully completed |
| `payment.failed` | Payment failed |
| `payment.expired` | Payment expired (after 24 hours) |

### Webhook Headers

AURAS Pay includes the following headers with webhook requests:

```
Content-Type: application/json
User-Agent: AURAS-Pay-Webhook/1.0
X-AURAS-Signature: sha256=signature-hash
X-AURAS-Event: payment.completed
X-AURAS-Delivery: unique-delivery-id
X-AURAS-Timestamp: 2024-01-01T12:00:00.000Z
```

### Webhook Payload

#### Payment Created
```json
{
  "event_type": "payment.created",
  "event_id": "event-uuid",
  "created_at": "2024-01-01T12:00:00.000Z",
  "data": {
    "payment": {
      "id": "payment-uuid",
      "amount": 0.1,
      "currency": "SOL",
      "label": "Coffee Purchase",
      "message": "Thank you for your purchase!",
      "status": "PENDING",
      "solana_pay_url": "solana:wallet?amount=0.1...",
      "reference": "reference-key",
      "created_at": "2024-01-01T12:00:00.000Z"
    },
    "user": {
      "id": "user-uuid",
      "email": "merchant@example.com"
    }
  }
}
```

#### Payment Completed
```json
{
  "event_type": "payment.completed",
  "event_id": "event-uuid",
  "created_at": "2024-01-01T12:05:00.000Z",
  "data": {
    "payment": {
      "id": "payment-uuid",
      "amount": 0.1,
      "currency": "SOL",
      "status": "COMPLETED",
      "transaction_signature": "verified-signature",
      "completed_at": "2024-01-01T12:05:00.000Z"
    },
    "transaction": {
      "isValid": true,
      "amount": 0.1,
      "currency": "SOL",
      "blockTime": 1640995500
    },
    "user": {
      "id": "user-uuid",
      "email": "merchant@example.com"
    }
  }
}
```

### Webhook Security

Webhooks are secured using HMAC-SHA256 signatures. Verify the signature to ensure the webhook is from AURAS Pay:

```javascript
const crypto = require('crypto');

function verifyWebhook(payload, signature, secret) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');
    
  return `sha256=${expectedSignature}` === signature;
}

// Usage
const isValid = verifyWebhook(
  req.body, 
  req.headers['x-auras-signature'], 
  'your-webhook-secret'
);
```

### Webhook Retry Policy

- **Retries**: Up to 3 attempts
- **Timeout**: 30 seconds per attempt
- **Backoff**: Exponential backoff (1s, 2s, 4s)
- **Success**: HTTP status 200-299
- **Failure**: Any other status code

## Error Handling

### HTTP Status Codes

| Code | Description |
|------|-------------|
| `200` | Success |
| `201` | Created |
| `400` | Bad Request - Invalid parameters |
| `401` | Unauthorized - Invalid API key |
| `403` | Forbidden - Insufficient permissions |
| `404` | Not Found - Resource doesn't exist |
| `429` | Too Many Requests - Rate limit exceeded |
| `500` | Internal Server Error |

### Error Response Format

```json
{
  "success": false,
  "error": "Error message",
  "details": [
    {
      "field": "amount",
      "message": "Amount must be between 0.001 and 1000000"
    }
  ]
}
```

### Common Errors

#### Invalid API Key
```json
{
  "success": false,
  "error": "Invalid API key"
}
```

#### Insufficient Credits
```json
{
  "success": false,
  "error": "Insufficient credits to create payment link"
}
```

#### Validation Error
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    {
      "field": "amount",
      "message": "Amount is required"
    },
    {
      "field": "label",
      "message": "Label must be less than 100 characters"
    }
  ]
}
```

## SDKs & Examples

### JavaScript/Node.js Example

```javascript
const axios = require('axios');

class AURASPayAPI {
  constructor(apiKey, baseURL = 'https://your-domain.com/api') {
    this.apiKey = apiKey;
    this.baseURL = baseURL;
  }

  async createPayment(paymentData) {
    try {
      const response = await axios.post(
        `${this.baseURL}/payments/payment-link`,
        paymentData,
        {
  headers: {
            'Authorization': `Bearer ${this.apiKey}`,
    'Content-Type': 'application/json'
  }
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(`Payment creation failed: ${error.response?.data?.error || error.message}`);
    }
  }

  async getPayment(paymentId) {
    try {
      const response = await axios.get(
        `${this.baseURL}/payments/${paymentId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`
          }
        }
      );
      return response.data;
  } catch (error) {
      throw new Error(`Get payment failed: ${error.response?.data?.error || error.message}`);
    }
  }

  async verifyPayment(paymentId, signature) {
    try {
      const response = await axios.post(
        `${this.baseURL}/payments/${paymentId}/verify`,
        { signature },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
  } catch (error) {
      throw new Error(`Payment verification failed: ${error.response?.data?.error || error.message}`);
    }
  }
}

// Usage
const aurasAPI = new AURASPayAPI('your-api-key');

// Create a payment
const payment = await aurasAPI.createPayment({
  amount: 0.1,
  currency: 'SOL',
  label: 'Coffee Purchase',
  message: 'Thank you for your order!',
  webhookUrl: 'https://your-domain.com/webhook'
});

console.log('Payment created:', payment.data.payment.id);
console.log('QR Code:', payment.data.payment.qrCodeData);
```

### Python Example

```python
import requests
import json

class AURASPayAPI:
    def __init__(self, api_key, base_url='https://your-domain.com/api'):
        self.api_key = api_key
        self.base_url = base_url
        self.headers = {
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        }
    
    def create_payment(self, payment_data):
        response = requests.post(
            f'{self.base_url}/payments/payment-link',
            headers=self.headers,
            json=payment_data
        )
        response.raise_for_status()
        return response.json()
    
    def get_payment(self, payment_id):
        response = requests.get(
            f'{self.base_url}/payments/{payment_id}',
            headers=self.headers
        )
        response.raise_for_status()
        return response.json()
    
    def verify_payment(self, payment_id, signature):
        response = requests.post(
            f'{self.base_url}/payments/{payment_id}/verify',
            headers=self.headers,
            json={'signature': signature}
        )
        response.raise_for_status()
        return response.json()

# Usage
auras_api = AURASPayAPI('your-api-key')

# Create a payment
payment = auras_api.create_payment({
    'amount': 0.1,
    'currency': 'SOL',
    'label': 'Coffee Purchase',
    'message': 'Thank you for your order!',
    'webhookUrl': 'https://your-domain.com/webhook'
})

print(f"Payment created: {payment['data']['payment']['id']}")
```

### PHP Example

```php
<?php

class AURASPayAPI {
    private $apiKey;
    private $baseURL;
    
    public function __construct($apiKey, $baseURL = 'https://your-domain.com/api') {
        $this->apiKey = $apiKey;
        $this->baseURL = $baseURL;
    }
    
    public function createPayment($paymentData) {
        $url = $this->baseURL . '/payments/payment-link';
        $headers = [
            'Authorization: Bearer ' . $this->apiKey,
            'Content-Type: application/json'
        ];
        
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($paymentData));
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        if ($httpCode !== 201) {
            throw new Exception('Payment creation failed');
        }
        
        return json_decode($response, true);
    }
}

// Usage
$aurasAPI = new AURASPayAPI('your-api-key');

$payment = $aurasAPI->createPayment([
    'amount' => 0.1,
    'currency' => 'SOL',
    'label' => 'Coffee Purchase',
    'message' => 'Thank you for your order!',
    'webhookUrl' => 'https://your-domain.com/webhook'
]);

echo "Payment created: " . $payment['data']['payment']['id'];
?>
```

## Merchant Integration Examples

### Iframe Implementation

For merchants who want to embed payment processing directly into their website, AURAS Pay provides iframe integration options.

#### Simple Iframe Embed

```html
<!DOCTYPE html>
<html>
<head>
    <title>Payment Checkout</title>
    <style>
        .payment-container {
            width: 100%;
            max-width: 400px;
            margin: 0 auto;
            padding: 20px;
            background: #f5f5f5;
            border-radius: 8px;
        }
        
        .payment-iframe {
            width: 100%;
            height: 500px;
            border: none;
            border-radius: 8px;
        }
        
        .loading {
            text-align: center;
            padding: 40px;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="payment-container">
        <h2>Complete Your Payment</h2>
        <iframe 
            id="payment-iframe"
            class="payment-iframe" 
            src=""
            style="display: none;">
        </iframe>
        <div id="loading" class="loading">Preparing payment...</div>
    </div>

    <script>
        async function createPaymentIframe() {
            try {
                // Create payment via your backend
                const response = await fetch('/api/create-payment', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        amount: 0.1,
                        currency: 'SOL',
                        label: 'Product Purchase',
                        message: 'Thank you for your order!'
                    })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    // Create payment page URL for iframe
                    const paymentUrl = `${window.location.origin}/payment/${data.payment.id}`;
                    
                    const iframe = document.getElementById('payment-iframe');
                    iframe.src = paymentUrl;
                    iframe.style.display = 'block';
                    document.getElementById('loading').style.display = 'none';
                    
                    // Listen for payment completion
                    window.addEventListener('message', function(event) {
                        if (event.data.type === 'PAYMENT_COMPLETED') {
                            window.location.href = '/success?payment=' + event.data.paymentId;
                        } else if (event.data.type === 'PAYMENT_FAILED') {
                            alert('Payment failed: ' + event.data.error);
                        }
                    });
                }
            } catch (error) {
                console.error('Failed to create payment:', error);
                document.getElementById('loading').textContent = 'Failed to load payment. Please try again.';
            }
        }
        
        // Initialize payment iframe
        createPaymentIframe();
    </script>
</body>
</html>
```

#### React Component with Iframe

```jsx
import React, { useState, useEffect, useRef } from 'react';

const PaymentIframe = ({ amount, currency = 'SOL', label, onSuccess, onError }) => {
    const [loading, setLoading] = useState(true);
    const [paymentUrl, setPaymentUrl] = useState('');
    const iframeRef = useRef(null);

    useEffect(() => {
        createPayment();
        
        // Listen for messages from iframe
        const handleMessage = (event) => {
            if (event.data.type === 'PAYMENT_COMPLETED') {
                onSuccess?.(event.data.paymentId);
            } else if (event.data.type === 'PAYMENT_FAILED') {
                onError?.(event.data.error);
            }
        };
        
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [amount, currency, label]);

    const createPayment = async () => {
        try {
            const response = await fetch('/api/create-payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.REACT_APP_API_KEY}`
                },
                body: JSON.stringify({
                    amount,
                    currency,
                    label,
                    webhookUrl: `${window.location.origin}/api/webhook`
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                setPaymentUrl(`${window.location.origin}/payment/${data.data.payment.id}`);
                setLoading(false);
            } else {
                throw new Error(data.error);
            }
        } catch (error) {
            console.error('Payment creation failed:', error);
            onError?.(error.message);
        }
    };

    return (
        <div className="payment-iframe-container">
            {loading ? (
                <div className="flex items-center justify-center h-96">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Preparing payment...</p>
                    </div>
                </div>
            ) : (
                <iframe
                    ref={iframeRef}
                    src={paymentUrl}
                    className="w-full h-96 border-0 rounded-lg"
                    title="Payment Checkout"
                />
            )}
        </div>
    );
};

// Usage in your React app
const CheckoutPage = () => {
    const handlePaymentSuccess = (paymentId) => {
        console.log('Payment successful:', paymentId);
        // Redirect to success page or show success message
        window.location.href = `/success?payment=${paymentId}`;
    };
    
    const handlePaymentError = (error) => {
        console.error('Payment failed:', error);
        alert('Payment failed: ' + error);
    };

    return (
        <div className="max-w-md mx-auto mt-8 p-6">
            <h1 className="text-2xl font-bold mb-6">Complete Your Purchase</h1>
            <PaymentIframe
                amount={0.1}
                currency="SOL"
                label="Premium Subscription"
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
            />
        </div>
    );
};

export default CheckoutPage;
```

### E-commerce Integration Examples

#### WooCommerce Plugin (PHP)

```php
<?php
// AURAS Pay WooCommerce Gateway

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

add_action('plugins_loaded', 'auras_pay_gateway_init', 11);

function auras_pay_gateway_init() {
    class WC_Auras_Pay_Gateway extends WC_Payment_Gateway {
        
        public function __construct() {
            $this->id = 'auras_pay';
            $this->icon = '';
            $this->has_fields = false;
            $this->method_title = 'AURAS Pay';
            $this->method_description = 'Accept Solana payments via AURAS Pay';
            
            $this->init_form_fields();
            $this->init_settings();
            
            $this->title = $this->get_option('title');
            $this->description = $this->get_option('description');
            $this->api_key = $this->get_option('api_key');
            $this->webhook_url = $this->get_option('webhook_url');
            
            add_action('woocommerce_update_options_payment_gateways_' . $this->id, array($this, 'process_admin_options'));
            add_action('woocommerce_api_auras_pay_webhook', array($this, 'webhook_handler'));
        }
        
        public function init_form_fields() {
            $this->form_fields = array(
                'enabled' => array(
                    'title' => 'Enable/Disable',
                    'type' => 'checkbox',
                    'label' => 'Enable AURAS Pay',
                    'default' => 'yes'
                ),
                'title' => array(
                    'title' => 'Title',
                    'type' => 'text',
                    'description' => 'Payment method title that customers will see.',
                    'default' => 'Pay with Solana',
                    'desc_tip' => true,
                ),
                'description' => array(
                    'title' => 'Description',
                    'type' => 'textarea',
                    'description' => 'Payment method description that customers will see.',
                    'default' => 'Pay securely with SOL or USDC using AURAS Pay.',
                ),
                'api_key' => array(
                    'title' => 'API Key',
                    'type' => 'text',
                    'description' => 'Get your API key from AURAS Pay dashboard.',
                    'desc_tip' => true,
                ),
            );
        }
        
        public function process_payment($order_id) {
            $order = wc_get_order($order_id);
            
            try {
                // Create AURAS Pay payment
                $payment_data = array(
                    'amount' => $order->get_total(),
                    'currency' => 'SOL', // You might want to convert from order currency
                    'label' => 'Order #' . $order->get_order_number(),
                    'message' => 'Payment for order #' . $order->get_order_number(),
                    'webhookUrl' => home_url('/wc-api/auras_pay_webhook/')
                );
                
                $response = wp_remote_post('https://your-domain.com/api/payments/payment-link', array(
                    'headers' => array(
                        'Authorization' => 'Bearer ' . $this->api_key,
                        'Content-Type' => 'application/json',
                    ),
                    'body' => json_encode($payment_data),
                    'timeout' => 30,
                ));
                
                if (is_wp_error($response)) {
                    throw new Exception('Payment request failed');
                }
                
                $body = json_decode(wp_remote_retrieve_body($response), true);
                
                if (!$body['success']) {
                    throw new Exception($body['error'] ?? 'Payment creation failed');
                }
                
                // Store payment ID in order meta
                $order->update_meta_data('_auras_pay_payment_id', $body['data']['payment']['id']);
                $order->save();
                
                // Redirect to payment page
                return array(
                    'result' => 'success',
                    'redirect' => add_query_arg('auras_payment_id', $body['data']['payment']['id'], $order->get_checkout_payment_url(true))
                );
                
            } catch (Exception $e) {
                wc_add_notice('Payment error: ' . $e->getMessage(), 'error');
                return array(
                    'result' => 'failure',
                );
            }
        }
        
        public function webhook_handler() {
            $payload = file_get_contents('php://input');
            $data = json_decode($payload, true);
            
            if (isset($data['type']) && $data['type'] === 'payment.completed') {
                $payment_id = $data['data']['id'];
                
                // Find order by payment ID
                $orders = wc_get_orders(array(
                    'meta_key' => '_auras_pay_payment_id',
                    'meta_value' => $payment_id,
                    'limit' => 1,
                ));
                
                if (!empty($orders)) {
                    $order = $orders[0];
                    $order->payment_complete($data['data']['transactionSignature']);
                    $order->add_order_note('Payment completed via AURAS Pay. Transaction: ' . $data['data']['transactionSignature']);
                }
            }
            
            status_header(200);
            exit;
        }
    }
}

// Add the gateway to WooCommerce
function add_auras_pay_gateway($gateways) {
    $gateways[] = 'WC_Auras_Pay_Gateway';
    return $gateways;
}
add_filter('woocommerce_payment_gateways', 'add_auras_pay_gateway');
?>
```

#### Shopify App Integration

```javascript
// Shopify App - Payment Extension
const express = require('express');
const { createHmac } = require('crypto');
const app = express();

// Middleware to verify Shopify webhooks
const verifyShopifyWebhook = (req, res, next) => {
    const hmac = req.get('X-Shopify-Hmac-Sha256');
    const secret = process.env.SHOPIFY_WEBHOOK_SECRET;
    const hash = createHmac('sha256', secret).update(req.body, 'utf8').digest('base64');
    
    if (hash === hmac) {
        next();
    } else {
        res.status(401).send('Unauthorized');
    }
};

// Handle order creation
app.post('/shopify/order/created', verifyShopifyWebhook, async (req, res) => {
    const order = req.body;
    
    try {
        // Create AURAS Pay payment for the order
        const payment = await createAurasPayment({
            amount: parseFloat(order.total_price),
            currency: 'SOL',
            label: `Shopify Order #${order.order_number}`,
            message: `Payment for ${order.line_items.length} items`,
            webhookUrl: `${process.env.APP_URL}/auras/webhook`,
            metadata: {
                shopify_order_id: order.id,
                customer_email: order.email
            }
        });
        
        // Store payment info in your database
        await savePaymentMapping(order.id, payment.data.payment.id);
        
        res.status(200).send('OK');
    } catch (error) {
        console.error('Failed to create AURAS payment:', error);
        res.status(500).send('Error');
    }
});

async function createAurasPayment(paymentData) {
    const response = await fetch('https://your-domain.com/api/payments/payment-link', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.AURAS_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentData)
    });
    
    return await response.json();
}
```

### Frontend Framework Examples

#### Vue.js Payment Component

```vue
<template>
  <div class="payment-component">
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Creating payment...</p>
    </div>
    
    <div v-else-if="error" class="error-state">
      <p class="error-message">{{ error }}</p>
      <button @click="retryPayment" class="retry-btn">Try Again</button>
    </div>
    
    <div v-else class="payment-ready">
      <div class="payment-info">
        <h3>Payment Details</h3>
        <p><strong>Amount:</strong> {{ payment.amount }} {{ payment.currency }}</p>
        <p><strong>Description:</strong> {{ payment.label }}</p>
      </div>
      
      <div class="qr-code-section">
        <img :src="payment.qrCodeData" alt="Payment QR Code" class="qr-code" />
        <p class="qr-instruction">Scan with your Solana wallet</p>
      </div>
      
      <div class="solana-pay-link">
        <a :href="payment.solanaPayUrl" class="solana-btn">
          Open in Wallet App
        </a>
      </div>
      
      <div class="payment-status">
        <p v-if="paymentStatus === 'pending'" class="status-pending">
          Waiting for payment...
        </p>
        <p v-else-if="paymentStatus === 'completed'" class="status-success">
          ✅ Payment completed!
        </p>
        <p v-else-if="paymentStatus === 'failed'" class="status-error">
          ❌ Payment failed
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';

export default {
  name: 'AurasPaymentComponent',
  props: {
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'SOL'
    },
    label: {
      type: String,
      required: true
    },
    message: String,
    onSuccess: Function,
    onError: Function
  },
  setup(props) {
    const loading = ref(true);
    const error = ref(null);
    const payment = ref(null);
    const paymentStatus = ref('pending');
    let statusInterval = null;

    const createPayment = async () => {
      try {
        loading.value = true;
        error.value = null;
        
        const response = await fetch('/api/payments/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            amount: props.amount,
            currency: props.currency,
            label: props.label,
            message: props.message
          })
        });
        
        const data = await response.json();
        
        if (data.success) {
          payment.value = data.data.payment;
          startStatusPolling();
        } else {
          throw new Error(data.error);
        }
      } catch (err) {
        error.value = err.message;
        props.onError?.(err.message);
      } finally {
        loading.value = false;
      }
    };

    const startStatusPolling = () => {
      statusInterval = setInterval(async () => {
        try {
          const response = await fetch(`/api/payments/${payment.value.id}/status`);
          const data = await response.json();
          
          if (data.success) {
            paymentStatus.value = data.data.status.toLowerCase();
            
            if (paymentStatus.value === 'completed') {
              clearInterval(statusInterval);
              props.onSuccess?.(payment.value.id);
            } else if (paymentStatus.value === 'failed' || paymentStatus.value === 'expired') {
              clearInterval(statusInterval);
              props.onError?.('Payment failed or expired');
            }
          }
        } catch (err) {
          console.error('Status check failed:', err);
        }
      }, 3000);
    };

    const retryPayment = () => {
      createPayment();
    };

    onMounted(() => {
      createPayment();
    });

    onUnmounted(() => {
      if (statusInterval) {
        clearInterval(statusInterval);
      }
    });

    return {
      loading,
      error,
      payment,
      paymentStatus,
      retryPayment
    };
  }
};
</script>

<style scoped>
.payment-component {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  background: white;
}

.loading-state, .error-state {
  text-align: center;
  padding: 40px 20px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.qr-code {
  max-width: 200px;
  margin: 20px auto;
  display: block;
}

.solana-btn {
  display: inline-block;
  background: #9945ff;
  color: white;
  padding: 12px 24px;
  border-radius: 6px;
  text-decoration: none;
  margin: 20px 0;
}

.status-pending { color: #ffa500; }
.status-success { color: #28a745; }
.status-error { color: #dc3545; }
</style>
```

#### Angular Service and Component

```typescript
// auras-pay.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, interval, switchMap, takeWhile } from 'rxjs';

export interface PaymentRequest {
  amount: number;
  currency?: string;
  label: string;
  message?: string;
  webhookUrl?: string;
}

export interface Payment {
  id: string;
  amount: number;
  currency: string;
  label: string;
  message?: string;
  status: string;
  solanaPayUrl: string;
  qrCodeData: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class AurasPayService {
  private apiUrl = '/api/payments';

  constructor(private http: HttpClient) {}

  createPayment(paymentData: PaymentRequest): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(`${this.apiUrl}/create`, paymentData, { headers });
  }

  getPaymentStatus(paymentId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${paymentId}/status`);
  }

  pollPaymentStatus(paymentId: string): Observable<any> {
    return interval(3000).pipe(
      switchMap(() => this.getPaymentStatus(paymentId)),
      takeWhile((response) => {
        const status = response.data?.status?.toLowerCase();
        return status === 'pending';
      }, true)
    );
  }
}
```

```typescript
// payment.component.ts
import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { AurasPayService, PaymentRequest, Payment } from './auras-pay.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-auras-payment',
  template: `
    <div class="payment-component">
      <div *ngIf="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Creating payment...</p>
      </div>
      
      <div *ngIf="error" class="error-state">
        <p class="error-message">{{ error }}</p>
        <button (click)="retryPayment()" class="retry-btn">Try Again</button>
      </div>
      
      <div *ngIf="payment && !loading && !error" class="payment-ready">
        <div class="payment-info">
          <h3>Payment Details</h3>
          <p><strong>Amount:</strong> {{ payment.amount }} {{ payment.currency }}</p>
          <p><strong>Description:</strong> {{ payment.label }}</p>
        </div>
        
        <div class="qr-code-section">
          <img [src]="payment.qrCodeData" alt="Payment QR Code" class="qr-code" />
          <p class="qr-instruction">Scan with your Solana wallet</p>
        </div>
        
        <div class="solana-pay-link">
          <a [href]="payment.solanaPayUrl" class="solana-btn">
            Open in Wallet App
          </a>
        </div>
        
        <div class="payment-status">
          <p *ngIf="paymentStatus === 'pending'" class="status-pending">
            Waiting for payment...
          </p>
          <p *ngIf="paymentStatus === 'completed'" class="status-success">
            ✅ Payment completed!
          </p>
          <p *ngIf="paymentStatus === 'failed'" class="status-error">
            ❌ Payment failed
          </p>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit, OnDestroy {
  @Input() amount!: number;
  @Input() currency: string = 'SOL';
  @Input() label!: string;
  @Input() message?: string;
  
  @Output() success = new EventEmitter<string>();
  @Output() failed = new EventEmitter<string>();

  loading = false;
  error: string | null = null;
  payment: Payment | null = null;
  paymentStatus = 'pending';
  
  private statusSubscription?: Subscription;

  constructor(private aurasPayService: AurasPayService) {}

  ngOnInit() {
    this.createPayment();
  }

  ngOnDestroy() {
    if (this.statusSubscription) {
      this.statusSubscription.unsubscribe();
    }
  }

  createPayment() {
    this.loading = true;
    this.error = null;

    const paymentData: PaymentRequest = {
      amount: this.amount,
      currency: this.currency,
      label: this.label,
      message: this.message
    };

    this.aurasPayService.createPayment(paymentData).subscribe({
      next: (response) => {
        if (response.success) {
          this.payment = response.data.payment;
          this.startStatusPolling();
        } else {
          this.error = response.error || 'Payment creation failed';
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || 'Payment creation failed';
        this.loading = false;
        this.failed.emit(this.error);
      }
    });
  }

  private startStatusPolling() {
    if (!this.payment) return;

    this.statusSubscription = this.aurasPayService.pollPaymentStatus(this.payment.id).subscribe({
      next: (response) => {
        if (response.success) {
          this.paymentStatus = response.data.status.toLowerCase();
          
          if (this.paymentStatus === 'completed') {
            this.success.emit(this.payment!.id);
          } else if (this.paymentStatus === 'failed' || this.paymentStatus === 'expired') {
            this.failed.emit('Payment failed or expired');
          }
        }
      },
      error: (err) => {
        console.error('Status polling failed:', err);
      }
    });
  }

  retryPayment() {
    this.createPayment();
  }
}
```

### Backend Webhook Handlers

#### Node.js Express Webhook Handler

```javascript
const express = require('express');
const crypto = require('crypto');
const app = express();

// Middleware to verify webhook signatures
const verifyWebhookSignature = (req, res, next) => {
    const signature = req.headers['x-auras-signature'];
    const payload = JSON.stringify(req.body);
    const secret = process.env.AURAS_WEBHOOK_SECRET;
    
    if (!secret || !signature) {
        return res.status(401).send('Missing signature or secret');
    }
    
    const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(payload)
        .digest('hex');
    
    if (signature !== `sha256=${expectedSignature}`) {
        return res.status(401).send('Invalid signature');
    }
    
    next();
};

// Webhook endpoint
app.post('/webhook/auras-pay', express.json(), verifyWebhookSignature, async (req, res) => {
    const { type, data } = req.body;
    
    try {
        switch (type) {
            case 'payment.created':
                await handlePaymentCreated(data);
                break;
                
            case 'payment.completed':
                await handlePaymentCompleted(data);
                break;
                
            case 'payment.failed':
                await handlePaymentFailed(data);
                break;
                
            case 'payment.expired':
                await handlePaymentExpired(data);
                break;
                
            default:
                console.log(`Unhandled webhook type: ${type}`);
        }
        
        res.status(200).send('Webhook processed');
    } catch (error) {
        console.error('Webhook processing failed:', error);
        res.status(500).send('Webhook processing failed');
    }
});

async function handlePaymentCreated(paymentData) {
    console.log('Payment created:', paymentData.id);
    
    // Update your database
    await updateOrderStatus(paymentData.invoiceId, 'payment_pending');
    
    // Send confirmation email to customer
    await sendPaymentInstructions(paymentData);
}

async function handlePaymentCompleted(paymentData) {
    console.log('Payment completed:', paymentData.id);
    
    // Update order status
    await updateOrderStatus(paymentData.invoiceId, 'paid');
    
    // Process the order (ship product, grant access, etc.)
    await processOrder(paymentData.invoiceId);
    
    // Send confirmation email
    await sendPaymentConfirmation(paymentData);
    
    // Grant access or fulfill order
    await fulfillOrder(paymentData);
}

async function handlePaymentFailed(paymentData) {
    console.log('Payment failed:', paymentData.id);
    
    await updateOrderStatus(paymentData.invoiceId, 'payment_failed');
    await sendPaymentFailedNotification(paymentData);
}

async function handlePaymentExpired(paymentData) {
    console.log('Payment expired:', paymentData.id);
    
    await updateOrderStatus(paymentData.invoiceId, 'payment_expired');
    await sendPaymentExpiredNotification(paymentData);
}

// Helper functions
async function updateOrderStatus(invoiceId, status) {
    // Your database update logic
    console.log(`Updating order ${invoiceId} to status: ${status}`);
}

async function processOrder(invoiceId) {
    // Your order processing logic
    console.log(`Processing order: ${invoiceId}`);
}

async function sendPaymentConfirmation(paymentData) {
    // Your email sending logic
    console.log(`Sending confirmation for payment: ${paymentData.id}`);
}
```

### Simple HTML/JavaScript Implementation

#### Basic Payment Form

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AURAS Pay Checkout</title>
    <style>
        .payment-form {
            max-width: 500px;
            margin: 50px auto;
            padding: 30px;
            border: 1px solid #ddd;
            border-radius: 10px;
            font-family: Arial, sans-serif;
        }
        
        .form-group {
            margin-bottom: 20px;
        }
        
        label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
        }
        
        input, select, textarea {
            width: 100%;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
            box-sizing: border-box;
        }
        
        button {
            background: #9945ff;
            color: white;
            padding: 12px 30px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            width: 100%;
        }
        
        button:hover {
            background: #8035e6;
        }
        
        .payment-modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            z-index: 1000;
        }
        
        .modal-content {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 30px;
            border-radius: 10px;
            text-align: center;
            max-width: 400px;
            width: 90%;
        }
        
        .qr-code {
            max-width: 250px;
            margin: 20px auto;
        }
        
        .close-btn {
            position: absolute;
            top: 10px;
            right: 15px;
            font-size: 24px;
            cursor: pointer;
        }
    </style>
</head>
<body>
    <div class="payment-form">
        <h2>AURAS Pay Checkout</h2>
        <form id="paymentForm">
            <div class="form-group">
                <label for="amount">Amount:</label>
                <input type="number" id="amount" step="0.001" min="0.001" required>
            </div>
            
            <div class="form-group">
                <label for="currency">Currency:</label>
                <select id="currency">
                    <option value="SOL">SOL (Solana)</option>
                    <option value="USDC">USDC</option>
                </select>
            </div>
            
            <div class="form-group">
                <label for="label">Description:</label>
                <input type="text" id="label" maxlength="100" required>
            </div>
            
            <div class="form-group">
                <label for="message">Message (optional):</label>
                <textarea id="message" maxlength="500" rows="3"></textarea>
            </div>
            
            <button type="submit">Create Payment</button>
        </form>
    </div>

    <!-- Payment Modal -->
    <div id="paymentModal" class="payment-modal">
        <div class="modal-content">
            <span class="close-btn" onclick="closePaymentModal()">&times;</span>
            <h3>Complete Your Payment</h3>
            <div id="paymentContent">
                <p>Creating payment...</p>
            </div>
        </div>
    </div>

    <script>
        document.getElementById('paymentForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = {
                amount: parseFloat(document.getElementById('amount').value),
                currency: document.getElementById('currency').value,
                label: document.getElementById('label').value,
                message: document.getElementById('message').value || undefined
            };
            
            await createPayment(formData);
        });

        async function createPayment(paymentData) {
            try {
                // Show modal
                document.getElementById('paymentModal').style.display = 'block';
                document.getElementById('paymentContent').innerHTML = '<p>Creating payment...</p>';
                
                // Call your backend to create payment
                const response = await fetch('/api/create-payment', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(paymentData)
                });
                
                const result = await response.json();
                
                if (result.success) {
                    displayPayment(result.data.payment);
                    pollPaymentStatus(result.data.payment.id);
                } else {
                    throw new Error(result.error);
                }
            } catch (error) {
                document.getElementById('paymentContent').innerHTML = 
                    `<p style="color: red;">Error: ${error.message}</p>
                     <button onclick="closePaymentModal()">Close</button>`;
            }
        }

        function displayPayment(payment) {
            document.getElementById('paymentContent').innerHTML = `
                <div>
                    <p><strong>Amount:</strong> ${payment.amount} ${payment.currency}</p>
                    <p><strong>Description:</strong> ${payment.label}</p>
                    
                    <div class="qr-code">
                        <img src="${payment.qrCodeData}" alt="Payment QR Code" style="width: 100%;">
                    </div>
                    
                    <p>Scan QR code with your Solana wallet</p>
                    
                    <div style="margin: 20px 0;">
                        <a href="${payment.solanaPayUrl}" style="
                            background: #9945ff;
                            color: white;
                            padding: 10px 20px;
                            text-decoration: none;
                            border-radius: 5px;
                            display: inline-block;
                        ">Open in Wallet</a>
                    </div>
                    
                    <div id="paymentStatus">
                        <p style="color: orange;">⏳ Waiting for payment...</p>
                    </div>
                </div>
            `;
        }

        async function pollPaymentStatus(paymentId) {
            const pollInterval = setInterval(async () => {
                try {
                    const response = await fetch(`/api/payment-status/${paymentId}`);
                    const result = await response.json();
                    
                    if (result.success) {
                        const status = result.data.status.toLowerCase();
                        const statusElement = document.getElementById('paymentStatus');
                        
                        if (status === 'completed') {
                            clearInterval(pollInterval);
                            statusElement.innerHTML = '<p style="color: green;">✅ Payment completed successfully!</p>';
                            setTimeout(() => {
                                window.location.href = '/success?payment=' + paymentId;
                            }, 2000);
                        } else if (status === 'failed' || status === 'expired') {
                            clearInterval(pollInterval);
                            statusElement.innerHTML = '<p style="color: red;">❌ Payment failed or expired</p>';
                        }
                    }
                } catch (error) {
                    console.error('Status check failed:', error);
                }
            }, 3000);
            
            // Stop polling after 10 minutes
            setTimeout(() => clearInterval(pollInterval), 600000);
        }

        function closePaymentModal() {
            document.getElementById('paymentModal').style.display = 'none';
        }
    </script>
</body>
</html>
```

#### Quick Integration Script

```html
<!-- Add this to any webpage for instant AURAS Pay integration -->
<script src="https://unpkg.com/axios/dist/axios.min.js"></script>
<script>
class AurasPayQuick {
    constructor(config) {
        this.apiKey = config.apiKey;
        this.apiUrl = config.apiUrl || 'https://your-domain.com/api';
        this.onSuccess = config.onSuccess || (() => {});
        this.onError = config.onError || ((error) => alert('Payment failed: ' + error));
    }

    // Create a payment button
    createPaymentButton(elementId, paymentData) {
        const button = document.getElementById(elementId);
        if (!button) {
            console.error('Element not found:', elementId);
            return;
        }

        button.addEventListener('click', () => {
            this.initiatePayment(paymentData);
        });
    }

    // Initiate payment process
    async initiatePayment(paymentData) {
        try {
            const response = await axios.post(`${this.apiUrl}/payments/payment-link`, paymentData, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.success) {
                this.showPaymentModal(response.data.data.payment);
            } else {
                throw new Error(response.data.error);
            }
        } catch (error) {
            this.onError(error.message);
        }
    }

    // Show payment modal
    showPaymentModal(payment) {
        // Create modal HTML
        const modalHtml = `
            <div id="aurasPayModal" style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.8);
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
            ">
                <div style="
                    background: white;
                    padding: 30px;
                    border-radius: 10px;
                    text-align: center;
                    max-width: 400px;
                    position: relative;
                ">
                    <button onclick="document.getElementById('aurasPayModal').remove()" style="
                        position: absolute;
                        top: 10px;
                        right: 15px;
                        background: none;
                        border: none;
                        font-size: 24px;
                        cursor: pointer;
                    ">&times;</button>
                    
                    <h3>Complete Payment</h3>
                    <p><strong>${payment.amount} ${payment.currency}</strong></p>
                    <p>${payment.label}</p>
                    
                    <img src="${payment.qrCodeData}" style="max-width: 250px; margin: 20px 0;">
                    
                    <p>Scan with your Solana wallet</p>
                    
                    <a href="${payment.solanaPayUrl}" style="
                        background: #9945ff;
                        color: white;
                        padding: 12px 24px;
                        text-decoration: none;
                        border-radius: 5px;
                        display: inline-block;
                        margin: 10px 0;
                    ">Open Wallet</a>
                    
                    <div id="aurasPayStatus">
                        <p style="color: orange;">Waiting for payment...</p>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHtml);
        this.pollPaymentStatus(payment.id);
    }

    // Poll payment status
    async pollPaymentStatus(paymentId) {
        const pollInterval = setInterval(async () => {
            try {
                const response = await axios.get(`${this.apiUrl}/payments/${paymentId}`);
                
                if (response.data.success) {
                    const status = response.data.data.status.toLowerCase();
                    const statusElement = document.getElementById('aurasPayStatus');
                    
                    if (status === 'completed') {
                        clearInterval(pollInterval);
                        statusElement.innerHTML = '<p style="color: green;">✅ Payment completed!</p>';
                        setTimeout(() => {
                            document.getElementById('aurasPayModal').remove();
                            this.onSuccess(paymentId);
                        }, 2000);
                    } else if (status === 'failed' || status === 'expired') {
                        clearInterval(pollInterval);
                        statusElement.innerHTML = '<p style="color: red;">❌ Payment failed</p>';
                        this.onError('Payment failed or expired');
                    }
                }
            } catch (error) {
                console.error('Status check failed:', error);
            }
        }, 3000);

        setTimeout(() => clearInterval(pollInterval), 600000);
    }
}

// Usage example:
// const aurasPayQuick = new AurasPayQuick({
//     apiKey: 'your-api-key',
//     apiUrl: 'https://your-domain.com/api',
//     onSuccess: (paymentId) => {
//         console.log('Payment successful:', paymentId);
//         window.location.href = '/success';
//     },
//     onError: (error) => {
//         alert('Payment failed: ' + error);
//     }
// });

// aurasPayQuick.createPaymentButton('payButton', {
//     amount: 0.1,
//     currency: 'SOL',
//     label: 'Product Purchase',
//     message: 'Thank you for your order!'
// });
</script>

<!-- Example usage in HTML -->
<!--
<button id="payButton">Pay with AURAS Pay</button>
<script>
    const aurasPayQuick = new AurasPayQuick({
        apiKey: 'your-api-key',
        onSuccess: (paymentId) => alert('Payment successful!'),
        onError: (error) => alert('Payment failed: ' + error)
    });
    
    aurasPayQuick.createPaymentButton('payButton', {
        amount: 0.1,
        currency: 'SOL',
        label: 'Coffee Purchase'
    });
</script>
-->
```

### Implementation Guides

#### For E-commerce Platforms

1. **WooCommerce**: Use the provided PHP plugin code
2. **Shopify**: Implement the Node.js webhook integration
3. **Magento**: Adapt the PHP examples for Magento's payment gateway interface
4. **Custom Stores**: Use the React/Vue/Angular components

#### For SaaS Applications

1. **Subscription Billing**: Implement webhooks to handle subscription renewals
2. **Usage-based Billing**: Create payments based on usage metrics
3. **One-time Purchases**: Use the simple payment form examples

#### Security Best Practices

1. **Never expose API keys** in frontend code
2. **Always verify webhooks** using signature verification
3. **Implement rate limiting** on your payment endpoints
4. **Log all payment events** for auditing
5. **Use HTTPS** for all payment-related endpoints

#### Testing Your Integration

1. Use test API keys for development
2. Test webhook endpoints with tools like ngrok
3. Verify payment flows in different browsers
4. Test mobile wallet compatibility
5. Monitor error rates and response times

## Testing

### Test API Key

For testing purposes, you can use the sandbox environment. Contact support to get test API keys.

### Webhook Testing

Use tools like [webhook.site](https://webhook.site) to test webhook notifications:

1. Create a unique webhook URL at webhook.site
2. Use this URL as your `webhookUrl` when creating payments
3. Monitor incoming webhook events in real-time

## Support

- **Documentation**: [https://docs.aurasepay.com](https://docs.aurasepay.com)
- **Support Email**: support@aurasepay.com
- **Status Page**: [https://status.aurasepay.com](https://status.aurasepay.com)
- **GitHub**: [https://github.com/aurasepay](https://github.com/aurasepay)

## Changelog

### v1.2.0 (Latest)
- ✅ Added webhook support for all payment events
- ✅ Implemented automatic payment expiration (24 hours)
- ✅ Fixed API key authentication via Authorization header
- ✅ Added payment expiration management endpoints
- ✅ Enhanced error handling and validation

### v1.1.0
- ✅ Added USDC token support
- ✅ Implemented rate limiting
- ✅ Added payment verification
- ✅ Enhanced QR code generation

### v1.0.0
- ✅ Initial API release
- ✅ SOL payment support
- ✅ Basic payment link creation
- ✅ Solana Pay integration 