import React, { useState, useEffect } from 'react';
import { Copy, Check, ExternalLink, BookOpen, Code, Shield, Zap, Globe } from 'lucide-react';
import { authAPI } from '../services/api';

const ApiDocsPage = () => {
  const [copiedText, setCopiedText] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [activeSection, setActiveSection] = useState('overview');
  const [isLoadingApiKey, setIsLoadingApiKey] = useState(true);

  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        const response = await authAPI.getApiKeyInfo();
        if (response.data.data.hasApiKey) {
          setApiKey(response.data.data.apiKeyMasked);
        }
      } catch (error) {
        console.error('Failed to fetch API key:', error);
      } finally {
        setIsLoadingApiKey(false);
      }
    };

    fetchApiKey();
  }, []);

  const copyToClipboard = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(label);
      setTimeout(() => setCopiedText(''), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const CopyButton = ({ text, label, className = "" }) => (
    <button
      onClick={() => copyToClipboard(text, label)}
      className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-800 hover:bg-gray-700 text-white rounded-md transition-colors ${className}`}
    >
      {copiedText === label ? (
        <>
          <Check className="w-4 h-4 text-green-400" />
          Copied!
        </>
      ) : (
        <>
          <Copy className="w-4 h-4" />
          Copy
        </>
      )}
    </button>
  );

  const CodeBlock = ({ children, language = "bash", copyText, copyLabel }) => (
    <div className="relative bg-gray-900 rounded-lg p-4 overflow-x-auto">
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs text-gray-400 uppercase tracking-wide">{language}</span>
        {copyText && <CopyButton text={copyText} label={copyLabel} />}
      </div>
      <pre className="text-green-400 text-sm">
        <code>{children}</code>
      </pre>
    </div>
  );

  const sections = [
    { id: 'overview', title: 'Overview', icon: BookOpen },
    { id: 'authentication', title: 'Authentication', icon: Shield },
    { id: 'endpoints', title: 'Endpoints', icon: Globe },
    { id: 'webhooks', title: 'Webhooks', icon: Zap },
    { id: 'merchant-integration', title: 'Merchant Integration', icon: Code },
    { id: 'examples', title: 'Examples', icon: Code },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full border border-blue-500/30 mb-6">
            <BookOpen className="w-6 h-6 text-blue-400" />
            <span className="text-blue-400 font-medium">API Documentation</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            AURAS Pay API
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Comprehensive guide to integrating Solana-based payment processing into your applications
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Navigation</h3>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeSection === section.id
                        ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                        : 'text-gray-400 hover:text-white hover:bg-gray-700/30'
                    }`}
                  >
                    <section.icon className="w-4 h-4" />
                    {section.title}
                  </button>
                ))}
              </nav>

              {/* Quick Start */}
              <div className="mt-8 p-4 bg-gradient-to-r from-green-600/20 to-blue-600/20 rounded-lg border border-green-500/30">
                <h4 className="text-green-400 font-medium mb-2">Your API Key</h4>
                <div className="flex items-center gap-2">
                  <code className="text-xs text-gray-300 bg-gray-800 px-2 py-1 rounded flex-1 truncate">
                    {isLoadingApiKey ? 'Loading...' : (apiKey || 'No API key found')}
                  </code>
                  {apiKey && !isLoadingApiKey && (
                    <CopyButton text={apiKey} label="api-key" className="text-xs px-2 py-1" />
                  )}
                </div>
                {!apiKey && !isLoadingApiKey && (
                  <p className="text-yellow-400 text-xs mt-2">
                    Generate an API key in the Settings page to get started
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-8">
            {/* Overview Section */}
            {activeSection === 'overview' && (
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <BookOpen className="w-6 h-6 text-blue-400" />
                  Overview
                </h2>
                
                <div className="prose prose-invert max-w-none">
                  <p className="text-gray-300 text-lg leading-relaxed mb-6">
                    AURAS Pay is a powerful Solana-based payment processing API that allows merchants to create payment links, 
                    process transactions, and manage payments seamlessly. Our API supports both SOL and USDC tokens with 
                    automatic QR code generation for easy mobile payments.
                  </p>

                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg p-6 border border-blue-500/30">
                      <h3 className="text-lg font-semibold text-blue-400 mb-3">Base URL</h3>
                      <CodeBlock 
                        language="url"
                        copyText={`${window.location.origin}/api`}
                        copyLabel="base-url"
                      >
                        {`${window.location.origin}/api`}
                      </CodeBlock>
                    </div>

                    <div className="bg-gradient-to-r from-green-600/20 to-teal-600/20 rounded-lg p-6 border border-green-500/30">
                      <h3 className="text-lg font-semibold text-green-400 mb-3">Rate Limit</h3>
                      <div className="text-gray-300">
                        <div className="flex justify-between">
                          <span>Requests:</span>
                          <span className="text-green-400">100/15min</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Method:</span>
                          <span className="text-green-400">Per API Key</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-white mb-4">API Features</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      'Create payment links with Solana Pay integration',
                      'Real-time payment verification',
                      'Webhook notifications for all payment events',
                      'Automatic payment expiration management',
                      'QR code generation for mobile payments',
                      'Support for SOL and USDC tokens',
                      'Credit-based pricing system',
                      'Rate limiting and security features'
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center gap-3 text-gray-300">
                        <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Authentication Section */}
            {activeSection === 'authentication' && (
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <Shield className="w-6 h-6 text-green-400" />
                  Authentication
                </h2>

                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4">API Key Authentication</h3>
                    <p className="text-gray-300 mb-6">
                      You can authenticate using your API key in two ways:
                    </p>

                    <div className="grid lg:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-lg font-medium text-blue-400 mb-3">Option A: Authorization Bearer Header</h4>
                        <CodeBlock 
                          language="bash"
                          copyText={`curl -X POST ${window.location.origin}/api/payments/payment-link \\\n  -H "Authorization: Bearer ${apiKey || 'YOUR_API_KEY'}" \\\n  -H "Content-Type: application/json"`}
                          copyLabel="bearer-auth"
                        >
{`curl -X POST ${window.location.origin}/api/payments/payment-link \\
  -H "Authorization: Bearer ${apiKey || 'YOUR_API_KEY'}" \\
  -H "Content-Type: application/json"`}
                        </CodeBlock>
                      </div>

                      <div>
                        <h4 className="text-lg font-medium text-purple-400 mb-3">Option B: X-API-Key Header</h4>
                        <CodeBlock 
                          language="bash"
                          copyText={`curl -X POST ${window.location.origin}/api/payments/payment-link \\\n  -H "X-API-Key: ${apiKey || 'YOUR_API_KEY'}" \\\n  -H "Content-Type: application/json"`}
                          copyLabel="x-api-key"
                        >
{`curl -X POST ${window.location.origin}/api/payments/payment-link \\
  -H "X-API-Key: ${apiKey || 'YOUR_API_KEY'}" \\
  -H "Content-Type: application/json"`}
                        </CodeBlock>
                      </div>
                    </div>
                  </div>

                  {/* Security Best Practices */}
                  <div className="bg-gradient-to-r from-red-600/20 to-orange-600/20 rounded-lg p-6 border border-red-500/30">
                    <h4 className="text-red-400 font-medium mb-3">🔒 Security Best Practices</h4>
                    <div className="space-y-3 text-gray-300">
                      <div className="flex items-start gap-3">
                        <Shield className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-medium">Never expose API keys</span> in frontend code - always use backend endpoints
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Shield className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-medium">Always verify webhooks</span> using signature verification
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Shield className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-medium">Implement rate limiting</span> on your payment endpoints
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Shield className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-medium">Use HTTPS</span> for all payment-related endpoints
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Endpoints Section */}
            {activeSection === 'endpoints' && (
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <Globe className="w-6 h-6 text-purple-400" />
                  API Endpoints
                </h2>

                <div className="space-y-8">
                  {/* Create Payment Link */}
                  <div className="border border-gray-700 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="px-3 py-1 bg-green-600 text-white text-sm font-medium rounded">POST</span>
                      <code className="text-purple-400 font-mono">/api/payments/payment-link</code>
                    </div>
                    
                    <h4 className="text-lg font-semibold text-white mb-3">Create Payment Link</h4>
                    <p className="text-gray-300 mb-4">Create a new payment link with Solana Pay integration.</p>

                    <div className="space-y-4">
                      <div>
                        <h5 className="font-medium text-white mb-2">Request Body:</h5>
                        <CodeBlock 
                          language="json"
                          copyText={JSON.stringify({
                            amount: 0.1,
                            currency: "SOL",
                            label: "Coffee Purchase",
                            message: "Thank you for your purchase!",
                            webhookUrl: "https://your-domain.com/webhook"
                          }, null, 2)}
                          copyLabel="create-payment-request"
                        >
{`{
  "amount": 0.1,
  "currency": "SOL",
  "label": "Coffee Purchase",
  "message": "Thank you for your purchase!",
  "webhookUrl": "https://your-domain.com/webhook"
}`}
                        </CodeBlock>
                      </div>

                      <div>
                        <h5 className="font-medium text-white mb-2">Parameters:</h5>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm text-gray-300">
                            <thead>
                              <tr className="border-b border-gray-700">
                                <th className="text-left py-2 text-blue-400">Parameter</th>
                                <th className="text-left py-2 text-blue-400">Type</th>
                                <th className="text-left py-2 text-blue-400">Required</th>
                                <th className="text-left py-2 text-blue-400">Description</th>
                              </tr>
                            </thead>
                            <tbody className="space-y-2">
                              <tr className="border-b border-gray-800">
                                <td className="py-2 font-mono text-purple-400">amount</td>
                                <td className="py-2">number</td>
                                <td className="py-2 text-green-400">✅</td>
                                <td className="py-2">Payment amount (min: 0.001, max: 1000000)</td>
                              </tr>
                              <tr className="border-b border-gray-800">
                                <td className="py-2 font-mono text-purple-400">currency</td>
                                <td className="py-2">string</td>
                                <td className="py-2 text-gray-500">❌</td>
                                <td className="py-2">"SOL" or "USDC" (default: "SOL")</td>
                              </tr>
                              <tr className="border-b border-gray-800">
                                <td className="py-2 font-mono text-purple-400">label</td>
                                <td className="py-2">string</td>
                                <td className="py-2 text-green-400">✅</td>
                                <td className="py-2">Payment description (max: 100 chars)</td>
                              </tr>
                              <tr className="border-b border-gray-800">
                                <td className="py-2 font-mono text-purple-400">webhookUrl</td>
                                <td className="py-2">string</td>
                                <td className="py-2 text-gray-500">❌</td>
                                <td className="py-2">URL for webhook notifications</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Get Payment Details */}
                  <div className="border border-gray-700 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded">GET</span>
                      <code className="text-purple-400 font-mono">/api/payments/:id</code>
                    </div>
                    
                    <h4 className="text-lg font-semibold text-white mb-3">Get Payment Details</h4>
                    <p className="text-gray-300 mb-4">Retrieve details of a specific payment.</p>

                    <CodeBlock language="json">
{`{
  "success": true,
  "data": {
    "id": "payment-uuid",
    "amount": 0.1,
    "currency": "SOL",
    "status": "PENDING",
    "solanaPayUrl": "solana:wallet?amount=0.1...",
    "qrCodeData": "data:image/png;base64,iVBORw0KGgo...",
    "createdAt": "2024-01-01T12:00:00.000Z"
  }
}`}
                    </CodeBlock>
                  </div>
                </div>
              </div>
            )}

            {/* Webhooks Section */}
            {activeSection === 'webhooks' && (
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <Zap className="w-6 h-6 text-yellow-400" />
                  Webhooks
                </h2>

                <div className="space-y-8">
                  <div>
                    <p className="text-gray-300 text-lg mb-6">
                      Webhooks allow you to receive real-time notifications about payment events. 
                      Specify a <code className="text-purple-400 bg-gray-800 px-2 py-1 rounded">webhookUrl</code> when creating a payment.
                    </p>

                    <h3 className="text-xl font-semibold text-white mb-4">Webhook Events</h3>
                    <div className="grid md:grid-cols-2 gap-4 mb-8">
                      {[
                        { event: 'payment.created', description: 'Payment link created', color: 'blue' },
                        { event: 'payment.completed', description: 'Payment successfully completed', color: 'green' },
                        { event: 'payment.failed', description: 'Payment failed', color: 'red' },
                        { event: 'payment.expired', description: 'Payment expired (after 24 hours)', color: 'orange' }
                      ].map((item) => (
                        <div key={item.event} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                          <div className={`text-${item.color}-400 font-mono text-sm mb-2`}>{item.event}</div>
                          <div className="text-gray-300 text-sm">{item.description}</div>
                        </div>
                      ))}
                    </div>

                    <h3 className="text-xl font-semibold text-white mb-4">Example Webhook Payload</h3>
                    <CodeBlock 
                      language="json"
                      copyText={JSON.stringify({
                        event_type: "payment.completed",
                        event_id: "event-uuid",
                        created_at: "2024-01-01T12:05:00.000Z",
                        data: {
                          payment: {
                            id: "payment-uuid",
                            amount: 0.1,
                            currency: "SOL",
                            status: "COMPLETED",
                            transaction_signature: "verified-signature",
                            completed_at: "2024-01-01T12:05:00.000Z"
                          },
                          user: {
                            id: "user-uuid",
                            email: "merchant@example.com"
                          }
                        }
                      }, null, 2)}
                      copyLabel="webhook-payload"
                    >
{`{
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
    "user": {
      "id": "user-uuid",
      "email": "merchant@example.com"
    }
  }
}`}
                    </CodeBlock>
                  </div>
                </div>
              </div>
            )}

            {/* Merchant Integration Section */}
            {activeSection === 'merchant-integration' && (
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <Code className="w-6 h-6 text-blue-400" />
                  Merchant Integration Examples
                </h2>

                <div className="space-y-8">
                  {/* Iframe Implementation */}
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4">🖼️ Iframe Implementation</h3>
                    <p className="text-gray-300 mb-6">
                      Embed payment processing directly into your website without redirecting users away from your domain.
                    </p>

                    <h4 className="text-lg font-semibold text-blue-400 mb-3">Simple Iframe Embed</h4>
                    <CodeBlock 
                      language="html"
                      copyText={`<!DOCTYPE html>
<html>
<head>
    <title>Payment Checkout</title>
    <style>
        .payment-container {
            max-width: 400px;
            margin: 0 auto;
            padding: 20px;
            border-radius: 8px;
        }
        .payment-iframe {
            width: 100%;
            height: 500px;
            border: none;
            border-radius: 8px;
        }
    </style>
</head>
<body>
    <div class="payment-container">
        <h2>Complete Your Payment</h2>
        <iframe id="payment-iframe" class="payment-iframe" src="" style="display: none;"></iframe>
        <div id="loading">Preparing payment...</div>
    </div>

    <script>
        async function createPaymentIframe() {
            try {
                // Create payment via your backend
                const response = await fetch(window.location.origin + '/api/payments/payment-link', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ${apiKey || 'your-api-key'}'
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
                    const paymentUrl = window.location.origin + '/payment/' + data.data.payment.id;
                    
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
</html>`}
                      copyLabel="iframe-embed"
                    >
{`<!DOCTYPE html>
<html>
<head>
    <title>Payment Checkout</title>
    <style>
        .payment-container {
            max-width: 400px;
            margin: 0 auto;
            padding: 20px;
            border-radius: 8px;
        }
        .payment-iframe {
            width: 100%;
            height: 500px;
            border: none;
            border-radius: 8px;
        }
    </style>
</head>
<body>
    <div class="payment-container">
        <h2>Complete Your Payment</h2>
        <iframe id="payment-iframe" class="payment-iframe" 
                src="" style="display: none;"></iframe>
        <div id="loading">Preparing payment...</div>
    </div>

    <script>
        async function createPaymentIframe() {
            try {
                // Create payment via your backend
                const response = await fetch(window.location.origin + '/api/payments/payment-link', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ${apiKey || 'your-api-key'}'
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
                    const paymentUrl = window.location.origin + '/payment/' + data.data.payment.id;
                    
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
</html>`}
                    </CodeBlock>
                  </div>

                  {/* React Component */}
                  <div>
                    <h4 className="text-lg font-semibold text-blue-400 mb-3">React Payment Component</h4>
                    <CodeBlock 
                      language="jsx"
                      copyText={`import React, { useState, useEffect } from 'react';

const PaymentIframe = ({ amount, currency = 'SOL', label, onSuccess, onError }) => {
    const [loading, setLoading] = useState(true);
    const [paymentUrl, setPaymentUrl] = useState('');

    useEffect(() => {
        createPayment();
    }, [amount, currency, label]);

    const createPayment = async () => {
        try {
            const response = await fetch('/api/create-payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': \`Bearer \${process.env.REACT_APP_API_KEY}\`
                },
                body: JSON.stringify({ 
                    amount, 
                    currency, 
                    label,
                    webhookUrl: window.location.origin + '/api/webhook'
                })
            });
            
            const data = await response.json();
            if (data.success) {
                setPaymentUrl(window.location.origin + '/payment/' + data.data.payment.id);
                setLoading(false);
                
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
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    <p className="mt-4">Preparing payment...</p>
                </div>
            ) : (
                <iframe
                    src={paymentUrl}
                    className="w-full h-96 border-0 rounded-lg"
                    title="Payment Checkout"
                />
            )}
        </div>
    );
};

// Usage
const CheckoutPage = () => (
    <PaymentIframe
        amount={0.1}
        currency="SOL"
        label="Premium Subscription"
        onSuccess={(paymentId) => window.location.href = \`/success?payment=\${paymentId}\`}
        onError={(error) => alert('Payment failed: ' + error)}
    />
);`}
                      copyLabel="react-component"
                    >
{`import React, { useState, useEffect } from 'react';

const PaymentIframe = ({ amount, currency = 'SOL', label, onSuccess, onError }) => {
    const [loading, setLoading] = useState(true);
    const [paymentUrl, setPaymentUrl] = useState('');

    useEffect(() => {
        createPayment();
    }, [amount, currency, label]);

    const createPayment = async () => {
        try {
            const response = await fetch('/api/create-payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': \`Bearer \${process.env.REACT_APP_API_KEY}\`
                },
                body: JSON.stringify({ 
                    amount, 
                    currency, 
                    label,
                    webhookUrl: window.location.origin + '/api/webhook'
                })
            });
            
            const data = await response.json();
            if (data.success) {
                setPaymentUrl(window.location.origin + '/payment/' + data.data.payment.id);
                setLoading(false);
                
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
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    <p className="mt-4">Preparing payment...</p>
                </div>
            ) : (
                <iframe
                    src={paymentUrl}
                    className="w-full h-96 border-0 rounded-lg"
                    title="Payment Checkout"
                />
            )}
        </div>
    );
};

// Usage
const CheckoutPage = () => (
    <PaymentIframe
        amount={0.1}
        currency="SOL"
        label="Premium Subscription"
        onSuccess={(paymentId) => window.location.href = \`/success?payment=\${paymentId}\`}
        onError={(error) => alert('Payment failed: ' + error)}
    />
);`}
                    </CodeBlock>
                  </div>

                  {/* E-commerce Integration */}
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4">🛒 E-commerce Platform Integration</h3>
                    
                    <h4 className="text-lg font-semibold text-green-400 mb-3">WooCommerce Plugin (PHP)</h4>
                    <CodeBlock 
                      language="php"
                      copyText={`<?php
// AURAS Pay WooCommerce Gateway
class WC_Auras_Pay_Gateway extends WC_Payment_Gateway {
    
    public function __construct() {
        $this->id = 'auras_pay';
        $this->method_title = 'AURAS Pay';
        $this->method_description = 'Accept Solana payments via AURAS Pay';
        
        $this->init_form_fields();
        $this->init_settings();
        
        $this->title = $this->get_option('title');
        $this->api_key = $this->get_option('api_key');
        
        add_action('woocommerce_update_options_payment_gateways_' . $this->id, array($this, 'process_admin_options'));
    }
    
    public function process_payment($order_id) {
        $order = wc_get_order($order_id);
        
        // Create AURAS Pay payment
        $payment_data = array(
            'amount' => $order->get_total(),
            'currency' => 'SOL',
            'label' => 'Order #' . $order->get_order_number(),
            'webhookUrl' => home_url('/wc-api/auras_pay_webhook/')
        );
        
        $response = wp_remote_post(get_option('auras_pay_api_url', 'https://your-domain.com') . '/api/payments/payment-link', array(
            'headers' => array(
                'Authorization' => 'Bearer ' . $this->api_key,
                'Content-Type' => 'application/json',
            ),
            'body' => json_encode($payment_data),
        ));
        
        $body = json_decode(wp_remote_retrieve_body($response), true);
        
        if ($body['success']) {
            // Store payment ID in order meta
            $order->update_meta_data('_auras_pay_payment_id', $body['data']['payment']['id']);
            $order->save();
            
            // Redirect to payment page
            return array(
                'result' => 'success',
                'redirect' => add_query_arg('auras_payment_id', $body['data']['payment']['id'], $order->get_checkout_payment_url(true))
            );
        } else {
            wc_add_notice('Payment error: ' . ($body['error'] ?? 'Payment creation failed'), 'error');
            return array('result' => 'failure');
        }
    }
}
?>`}
                      copyLabel="woocommerce-plugin"
                    >
{`<?php
// AURAS Pay WooCommerce Gateway
class WC_Auras_Pay_Gateway extends WC_Payment_Gateway {
    
    public function __construct() {
        $this->id = 'auras_pay';
        $this->method_title = 'AURAS Pay';
        $this->method_description = 'Accept Solana payments via AURAS Pay';
        
        $this->init_form_fields();
        $this->init_settings();
        
        $this->title = $this->get_option('title');
        $this->api_key = $this->get_option('api_key');
    }
    
    public function process_payment($order_id) {
        $order = wc_get_order($order_id);
        
        // Create AURAS Pay payment
        $payment_data = array(
            'amount' => $order->get_total(),
            'currency' => 'SOL',
            'label' => 'Order #' . $order->get_order_number(),
            'webhookUrl' => home_url('/wc-api/auras_pay_webhook/')
        );
        
        $response = wp_remote_post(get_option('auras_pay_api_url', 'https://your-domain.com') . '/api/payments/payment-link', array(
            'headers' => array(
                'Authorization' => 'Bearer ' . $this->api_key,
                'Content-Type' => 'application/json',
            ),
            'body' => json_encode($payment_data),
        ));
        
        $body = json_decode(wp_remote_retrieve_body($response), true);
        
        if ($body['success']) {
            // Store payment ID in order meta
            $order->update_meta_data('_auras_pay_payment_id', $body['data']['payment']['id']);
            $order->save();
            
            // Redirect to payment page
            return array(
                'result' => 'success',
                'redirect' => add_query_arg('auras_payment_id', $body['data']['payment']['id'], $order->get_checkout_payment_url(true))
            );
        } else {
            wc_add_notice('Payment error: ' . ($body['error'] ?? 'Payment creation failed'), 'error');
            return array('result' => 'failure');
        }
    }
}
?>`}
                    </CodeBlock>
                  </div>

                  {/* Backend Proxy Implementation */}
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4">🔒 Backend Proxy Implementation</h3>
                    <p className="text-gray-300 mb-4">
                      For maximum security, create backend endpoints that proxy requests to AURAS Pay API. This keeps your API key secure on the server.
                    </p>
                    
                    <h4 className="text-lg font-semibold text-yellow-400 mb-3">Node.js/Express Backend</h4>
                    <CodeBlock 
                      language="javascript"
                      copyText={`// backend/routes/payments.js
const express = require('express');
const axios = require('axios');
const router = express.Router();

const AURAS_API_KEY = process.env.AURAS_API_KEY; // Your API key: ${apiKey || 'your-api-key'}
const AURAS_API_URL = process.env.AURAS_API_URL || window.location.origin + '/api';

// Create payment endpoint
router.post('/create-payment', async (req, res) => {
    try {
        const { amount, currency = 'SOL', label, message } = req.body;
        
        // Validate input
        if (!amount || !label) {
            return res.status(400).json({
                success: false,
                error: 'Amount and label are required'
            });
        }
        
        // Create payment with AURAS Pay
        const response = await axios.post(AURAS_API_URL + '/payments/payment-link', {
            amount,
            currency,
            label,
            message,
            webhookUrl: process.env.APP_URL + '/api/webhook/payment'
        }, {
            headers: {
                'Authorization': \`Bearer \${AURAS_API_KEY}\`,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.data.success) {
            // Store payment in your database if needed
            // await savePaymentToDb(response.data.data.payment);
            
            res.json({
                success: true,
                data: response.data.data
            });
        } else {
            res.status(400).json({
                success: false,
                error: response.data.error
            });
        }
    } catch (error) {
        console.error('Payment creation failed:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create payment'
        });
    }
});

// Get payment status endpoint
router.get('/payment-status/:paymentId', async (req, res) => {
    try {
        const { paymentId } = req.params;
        
        const response = await axios.get(\`\${AURAS_API_URL}/payments/\${paymentId}\`, {
            headers: {
                'Authorization': \`Bearer \${AURAS_API_KEY}\`
            }
        });
        
        if (response.data.success) {
            res.json({
                success: true,
                data: {
                    status: response.data.data.status,
                    transactionSignature: response.data.data.transactionSignature,
                    verifiedAt: response.data.data.verifiedAt
                }
            });
        } else {
            res.status(404).json({
                success: false,
                error: 'Payment not found'
            });
        }
    } catch (error) {
        console.error('Payment status check failed:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get payment status'
        });
    }
});

// Webhook handler
router.post('/webhook/payment', express.raw({type: 'application/json'}), (req, res) => {
    try {
        // Parse webhook payload
        const payload = JSON.parse(req.body);
        const { event_type, data } = payload;
        
        // Process webhook based on event type
        switch (event_type) {
            case 'payment.completed':
                handlePaymentCompleted(data.payment);
                break;
            case 'payment.failed':
                handlePaymentFailed(data.payment);
                break;
            case 'payment.expired':
                handlePaymentExpired(data.payment);
                break;
        }
        
        res.status(200).send('OK');
    } catch (error) {
        console.error('Webhook processing failed:', error);
        res.status(500).send('Error');
    }
});

async function handlePaymentCompleted(payment) {
    console.log('Payment completed:', payment.id);
    // Update order status in your database
    // Send confirmation email
    // Grant access to product/service
}

async function handlePaymentFailed(payment) {
    console.log('Payment failed:', payment.id);
    // Update order status
    // Send failure notification
}

async function handlePaymentExpired(payment) {
    console.log('Payment expired:', payment.id);
    // Clean up expired payment
    // Send expiration notification
}

module.exports = router;`}
                      copyLabel="backend-proxy"
                    >
{`// backend/routes/payments.js
const express = require('express');
const axios = require('axios');
const router = express.Router();

const AURAS_API_KEY = process.env.AURAS_API_KEY; // Your API key: ${apiKey || 'your-api-key'}
const AURAS_API_URL = process.env.AURAS_API_URL || window.location.origin + '/api';

// Create payment endpoint
router.post('/create-payment', async (req, res) => {
    try {
        const { amount, currency = 'SOL', label, message } = req.body;
        
        // Validate input
        if (!amount || !label) {
            return res.status(400).json({
                success: false,
                error: 'Amount and label are required'
            });
        }
        
        // Create payment with AURAS Pay
        const response = await axios.post(AURAS_API_URL + '/payments/payment-link', {
            amount,
            currency,
            label,
            message,
            webhookUrl: process.env.APP_URL + '/api/webhook/payment'
        }, {
            headers: {
                'Authorization': \`Bearer \${AURAS_API_KEY}\`,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.data.success) {
            res.json({
                success: true,
                data: response.data.data
            });
        } else {
            res.status(400).json({
                success: false,
                error: response.data.error
            });
        }
    } catch (error) {
        console.error('Payment creation failed:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create payment'
        });
    }
});

// Get payment status endpoint
router.get('/payment-status/:paymentId', async (req, res) => {
    try {
        const { paymentId } = req.params;
        
        const response = await axios.get(\`\${AURAS_API_URL}/payments/\${paymentId}\`, {
            headers: {
                'Authorization': \`Bearer \${AURAS_API_KEY}\`
            }
        });
        
        if (response.data.success) {
            res.json({
                success: true,
                data: {
                    status: response.data.data.status,
                    transactionSignature: response.data.data.transactionSignature,
                    verifiedAt: response.data.data.verifiedAt
                }
            });
        } else {
            res.status(404).json({
                success: false,
                error: 'Payment not found'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to get payment status'
        });
    }
});

// Webhook handler
router.post('/webhook/payment', express.raw({type: 'application/json'}), (req, res) => {
    try {
        const payload = JSON.parse(req.body);
        const { event_type, data } = payload;
        
        switch (event_type) {
            case 'payment.completed':
                console.log('Payment completed:', data.payment.id);
                // Process successful payment
                break;
            case 'payment.failed':
                console.log('Payment failed:', data.payment.id);
                // Handle failed payment
                break;
        }
        
        res.status(200).send('OK');
    } catch (error) {
        res.status(500).send('Error');
    }
});

module.exports = router;`}
                    </CodeBlock>
                  </div>

                  {/* Quick Integration Script */}
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4">⚡ Quick Integration Script</h3>
                    <p className="text-gray-300 mb-4">
                      Add AURAS Pay to any website with this single script. Perfect for landing pages or simple checkout forms.
                    </p>
                    
                    <CodeBlock 
                      language="html"
                      copyText={`<!-- Add this script to any webpage -->
<script src="https://unpkg.com/axios/dist/axios.min.js"></script>
<script>
class AurasPayQuick {
    constructor(config) {
        this.apiKey = config.apiKey;
        this.apiUrl = config.apiUrl || '${window.location.origin}/api';
        this.onSuccess = config.onSuccess || (() => {});
        this.onError = config.onError || ((error) => alert('Payment failed: ' + error));
    }

    createPaymentButton(elementId, paymentData) {
        const button = document.getElementById(elementId);
        button.addEventListener('click', () => {
            this.initiatePayment(paymentData);
        });
    }

    async initiatePayment(paymentData) {
        try {
            const response = await axios.post(this.apiUrl + '/payments/payment-link', paymentData, {
                headers: {
                    'Authorization': 'Bearer ' + this.apiKey,
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

    showPaymentModal(payment) {
        const modalHtml = \`
            <div id="aurasPayModal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; align-items: center; justify-content: center;">
                <div style="background: white; padding: 30px; border-radius: 10px; text-align: center; max-width: 400px; position: relative;">
                    <button onclick="document.getElementById('aurasPayModal').remove()" style="position: absolute; top: 10px; right: 15px; background: none; border: none; font-size: 24px; cursor: pointer;">&times;</button>
                    <h3>Complete Payment</h3>
                    <p><strong>\${payment.amount} \${payment.currency}</strong></p>
                    <p>\${payment.label}</p>
                    <img src="\${payment.qrCodeData}" style="max-width: 250px; margin: 20px 0;">
                    <p>Scan with your Solana wallet</p>
                    <a href="\${payment.solanaPayUrl}" style="background: #9945ff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 0;">Open Wallet</a>
                    <div id="aurasPayStatus">
                        <p style="color: orange;">⏳ Waiting for payment...</p>
                    </div>
                </div>
            </div>
        \`;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        this.pollPaymentStatus(payment.id);
    }

    async pollPaymentStatus(paymentId) {
        const pollInterval = setInterval(async () => {
            try {
                const response = await axios.get(this.apiUrl + '/payments/' + paymentId);
                
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

        // Stop polling after 10 minutes
        setTimeout(() => clearInterval(pollInterval), 600000);
    }
}

// Usage example with your API key:
const aurasPayQuick = new AurasPayQuick({
    apiKey: '${apiKey || 'your-api-key'}',
    onSuccess: (paymentId) => {
        console.log('Payment successful:', paymentId);
        window.location.href = '/success?payment=' + paymentId;
    },
    onError: (error) => alert('Payment failed: ' + error)
});

// Create payment button
aurasPayQuick.createPaymentButton('payButton', {
    amount: 0.1,
    currency: 'SOL',
    label: 'Product Purchase',
    message: 'Thank you for your order!'
});
</script>

<!-- HTML Usage -->
<button id="payButton" style="background: #9945ff; color: white; padding: 12px 24px; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;">
    Pay with AURAS Pay
</button>`}
                      copyLabel="quick-script"
                    >
{`<!-- Add this script to any webpage -->
<script src="https://unpkg.com/axios/dist/axios.min.js"></script>
<script>
class AurasPayQuick {
    constructor(config) {
        this.apiKey = config.apiKey;
        this.apiUrl = config.apiUrl || '${window.location.origin}/api';
        this.onSuccess = config.onSuccess || (() => {});
        this.onError = config.onError || ((error) => alert('Payment failed: ' + error));
    }

    createPaymentButton(elementId, paymentData) {
        const button = document.getElementById(elementId);
        button.addEventListener('click', () => {
            this.initiatePayment(paymentData);
        });
    }

    async initiatePayment(paymentData) {
        try {
            const response = await axios.post(this.apiUrl + '/payments/payment-link', paymentData, {
                headers: {
                    'Authorization': 'Bearer ' + this.apiKey,
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

    showPaymentModal(payment) {
        const modalHtml = \`
            <div id="aurasPayModal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; align-items: center; justify-content: center;">
                <div style="background: white; padding: 30px; border-radius: 10px; text-align: center; max-width: 400px; position: relative;">
                    <button onclick="document.getElementById('aurasPayModal').remove()" style="position: absolute; top: 10px; right: 15px; background: none; border: none; font-size: 24px; cursor: pointer;">&times;</button>
                    <h3>Complete Payment</h3>
                    <p><strong>\${payment.amount} \${payment.currency}</strong></p>
                    <p>\${payment.label}</p>
                    <img src="\${payment.qrCodeData}" style="max-width: 250px; margin: 20px 0;">
                    <p>Scan with your Solana wallet</p>
                    <a href="\${payment.solanaPayUrl}" style="background: #9945ff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 0;">Open Wallet</a>
                    <div id="aurasPayStatus">
                        <p style="color: orange;">⏳ Waiting for payment...</p>
                    </div>
                </div>
            </div>
        \`;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        this.pollPaymentStatus(payment.id);
    }

    async pollPaymentStatus(paymentId) {
        const pollInterval = setInterval(async () => {
            try {
                const response = await axios.get(this.apiUrl + '/payments/' + paymentId);
                
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

        // Stop polling after 10 minutes
        setTimeout(() => clearInterval(pollInterval), 600000);
    }
}

// Usage example with your API key:
const aurasPayQuick = new AurasPayQuick({
    apiKey: '${apiKey || 'your-api-key'}',
    onSuccess: (paymentId) => {
        console.log('Payment successful:', paymentId);
        window.location.href = '/success?payment=' + paymentId;
    },
    onError: (error) => alert('Payment failed: ' + error)
});

// Create payment button
aurasPayQuick.createPaymentButton('payButton', {
    amount: 0.1,
    currency: 'SOL',
    label: 'Product Purchase',
    message: 'Thank you for your order!'
});
</script>

<!-- HTML Usage -->
<button id="payButton" style="background: #9945ff; color: white; padding: 12px 24px; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;">
    Pay with AURAS Pay
</button>`}
                    </CodeBlock>
                  </div>

                  {/* Implementation Guide */}
                  <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg p-6 border border-blue-500/30">
                    <h4 className="text-blue-400 font-medium mb-3">🚀 Implementation Guide</h4>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h5 className="text-white font-medium mb-2">E-commerce Platforms</h5>
                        <div className="space-y-2 text-gray-300 text-sm">
                          <div>• WooCommerce: Use PHP plugin code</div>
                          <div>• Shopify: Implement webhook integration</div>
                          <div>• Magento: Adapt PHP examples</div>
                          <div>• Custom: Use React/Vue components</div>
                        </div>
                      </div>
                      <div>
                        <h5 className="text-white font-medium mb-2">SaaS Applications</h5>
                        <div className="space-y-2 text-gray-300 text-sm">
                          <div>• Subscription billing with webhooks</div>
                          <div>• Usage-based billing</div>
                          <div>• One-time purchases</div>
                          <div>• API integration examples</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Domain Configuration */}
                  <div className="bg-gradient-to-r from-green-600/20 to-teal-600/20 rounded-lg p-6 border border-green-500/30">
                    <h4 className="text-green-400 font-medium mb-3">🌐 Domain Configuration</h4>
                    <div className="space-y-4 text-gray-300">
                      <div>
                        <h5 className="text-white font-medium mb-2">✅ The code examples above use dynamic URLs that automatically work on any domain:</h5>
                        <div className="bg-gray-800 rounded-lg p-3 font-mono text-sm">
                          <div className="text-green-400">// ✅ Dynamic - works on any domain</div>
                          <div className="text-blue-400">window.location.origin + '/api/payments/payment-link'</div>
                          <div className="text-gray-500 mt-2">// On localhost: http://localhost:5174/api/payments/payment-link</div>
                          <div className="text-gray-500">// On production: https://yourdomain.com/api/payments/payment-link</div>
                        </div>
                      </div>
                      
                      <div>
                        <h5 className="text-white font-medium mb-2">Environment Variables for Backend:</h5>
                        <div className="bg-gray-800 rounded-lg p-3 font-mono text-sm">
                          <div className="text-blue-400"># .env file</div>
                          <div className="text-green-400">AURAS_API_KEY=${apiKey || 'your-api-key'}</div>
                          <div className="text-green-400">AURAS_API_URL=https://yourdomain.com/api</div>
                          <div className="text-green-400">APP_URL=https://yourdomain.com</div>
                        </div>
                      </div>

                      <div>
                        <h5 className="text-white font-medium mb-2">Deployment Checklist:</h5>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span>Copy any code example - URLs are already dynamic</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span>Update environment variables with your domain</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span>Replace API key with your actual key</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span>Test on staging before production</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Examples Section */}
            {activeSection === 'examples' && (
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <Code className="w-6 h-6 text-green-400" />
                  Code Examples
                </h2>

                <div className="space-y-8">
                  {/* JavaScript Example */}
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4">JavaScript/Node.js</h3>
                    <CodeBlock 
                      language="javascript"
                      copyText={`const axios = require('axios');

class AURASPayAPI {
  constructor(apiKey, baseURL = '${window.location.origin}/api') {
    this.apiKey = apiKey;
    this.baseURL = baseURL;
  }

  async createPayment(paymentData) {
    try {
      const response = await axios.post(
        \`\${this.baseURL}/payments/payment-link\`,
        paymentData,
        {
          headers: {
            'Authorization': \`Bearer \${this.apiKey}\`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(\`Payment creation failed: \${error.response?.data?.error || error.message}\`);
    }
  }
}

// Usage
const aurasAPI = new AURASPayAPI('${apiKey || 'your-api-key'}');

const payment = await aurasAPI.createPayment({
  amount: 0.1,
  currency: 'SOL',
  label: 'Coffee Purchase',
  webhookUrl: 'https://your-domain.com/webhook'
});

console.log('Payment created:', payment.data.payment.id);`}
                      copyLabel="javascript-example"
                    >
{`const axios = require('axios');

class AURASPayAPI {
  constructor(apiKey, baseURL = '${window.location.origin}/api') {
    this.apiKey = apiKey;
    this.baseURL = baseURL;
  }

  async createPayment(paymentData) {
    try {
      const response = await axios.post(
        \`\${this.baseURL}/payments/payment-link\`,
        paymentData,
        {
          headers: {
            'Authorization': \`Bearer \${this.apiKey}\`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(\`Payment creation failed: \${error.response?.data?.error || error.message}\`);
    }
  }
}

// Usage
const aurasAPI = new AURASPayAPI('${apiKey || 'your-api-key'}');

const payment = await aurasAPI.createPayment({
  amount: 0.1,
  currency: 'SOL',
  label: 'Coffee Purchase',
  webhookUrl: 'https://your-domain.com/webhook'
});

console.log('Payment created:', payment.data.payment.id);`}
                    </CodeBlock>
                  </div>

                  {/* Testing Section */}
                  <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg p-6 border border-purple-500/30">
                    <h4 className="text-purple-400 font-medium mb-3">🧪 Testing Your Integration</h4>
                    <div className="space-y-3 text-gray-300">
                      <div>• Use <a href="https://webhook.site" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline inline-flex items-center gap-1">webhook.site <ExternalLink className="w-3 h-3" /></a> to test webhook notifications</div>
                      <div>• Start with small amounts (0.001 SOL) for testing</div>
                      <div>• Check your credit balance regularly during development</div>
                      <div>• Monitor payment status changes in the dashboard</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiDocsPage; 