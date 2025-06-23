import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { paymentsAPI } from '../services/api';
import Layout from '../components/Layout';
import { CreditCard, Copy, Download, QrCode, ExternalLink, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CreatePaymentPage() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    amount: '',
    currency: 'SOL',
    label: '',
    message: '',
    walletAddress: user?.walletAddress || ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [paymentResult, setPaymentResult] = useState(null);

  const supportedTokens = [
    { symbol: 'SOL', name: 'Solana', decimals: 9 },
    { symbol: 'USDC', name: 'USD Coin', decimals: 6 }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user || user.transactionCredits < 1) {
      toast.error('Insufficient credits. Please purchase more credits.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await paymentsAPI.createPaymentLink(formData);
      setPaymentResult(response.data.data);
      toast.success('Payment link created successfully!');
    } catch (error) {
      console.error('Payment creation error:', error);
      toast.error(error.response?.data?.error || 'Failed to create payment link');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    toast.success(`${type} copied to clipboard!`);
  };

  const downloadQRCode = () => {
    if (!paymentResult?.payment?.qrCodeData) return;
    
    const link = document.createElement('a');
    link.download = `payment-qr-${paymentResult.payment.id}.png`;
    link.href = paymentResult.payment.qrCodeData;
    link.click();
    toast.success('QR code downloaded!');
  };

  const resetForm = () => {
    setPaymentResult(null);
    setFormData({
      amount: '',
      currency: 'SOL',
      label: '',
      message: '',
      walletAddress: user?.walletAddress || ''
    });
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create Payment Link</h1>
            <p className="text-gray-600 mt-2">Generate Solana Pay links with QR codes for your customers</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Available Credits</p>
            <p className="text-2xl font-bold text-blue-600">{user?.transactionCredits || 0}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Form */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <CreditCard className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Payment Details</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Amount and Currency */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount *
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    step="0.000000001"
                    min="0"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Currency *
                  </label>
                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {supportedTokens.map(token => (
                      <option key={token.symbol} value={token.symbol}>
                        {token.symbol} - {token.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Label */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Label *
                </label>
                <input
                  type="text"
                  name="label"
                  value={formData.label}
                  onChange={handleInputChange}
                  maxLength="100"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Coffee Purchase"
                />
                <p className="text-xs text-gray-500 mt-1">This appears in the customer's wallet</p>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  maxLength="200"
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Optional message for the customer"
                />
              </div>

              {/* Wallet Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recipient Wallet Address
                </label>
                <input
                  type="text"
                  name="walletAddress"
                  value={formData.walletAddress}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Uses your default wallet address if empty"
                />
                <p className="text-xs text-gray-500 mt-1">Leave empty to use your default wallet</p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !user || user.transactionCredits < 1}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating Payment Link...
                  </span>
                ) : (
                  `Create Payment Link (1 Credit)`
                )}
              </button>

              {user && user.transactionCredits < 1 && (
                <p className="text-sm text-red-600 text-center">
                  You need at least 1 credit to create a payment link.
                </p>
              )}
            </form>
          </div>

          {/* Payment Result */}
          {paymentResult ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <h2 className="text-xl font-semibold text-gray-900">Payment Link Created</h2>
              </div>

              <div className="space-y-6">
                {/* QR Code */}
                <div className="text-center">
                  <div className="inline-block p-4 bg-white border-2 border-gray-200 rounded-lg">
                    <img 
                      src={paymentResult.payment.qrCodeData} 
                      alt="Payment QR Code"
                      className="w-48 h-48 mx-auto"
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-2">Scan with any Solana wallet</p>
                </div>

                {/* Payment Details */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Payment URL
                    </label>
                    <div className="flex">
                      <input
                        type="text"
                        value={paymentResult.payment.solanaPayUrl}
                        readOnly
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg bg-gray-50 text-sm"
                      />
                      <button
                        onClick={() => copyToClipboard(paymentResult.payment.solanaPayUrl, 'Payment URL')}
                        className="px-3 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Amount
                      </label>
                      <p className="text-lg font-semibold text-gray-900">
                        {paymentResult.payment.amount} {paymentResult.payment.currency}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        {paymentResult.payment.status}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Recipient Wallet
                    </label>
                    <p className="text-sm text-gray-600 font-mono break-all">
                      {paymentResult.recipientWallet}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button
                    onClick={downloadQRCode}
                    className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download QR
                  </button>
                  <button
                    onClick={() => window.open(`/payments/${paymentResult.payment.id}`, '_blank')}
                    className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Details
                  </button>
                </div>

                {/* Create Another */}
                <button
                  onClick={resetForm}
                  className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Create Another Payment Link
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
              <QrCode className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to Generate</h3>
              <p className="text-gray-600">Fill out the form to create your payment link and QR code</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
} 