import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { authAPI, creditsAPI } from '../services/api';
import Layout from '../components/Layout';
import { 
  User, 
  Wallet, 
  CreditCard, 
  Save, 
  Check,
  AlertCircle,
  Package,
  Star,
  Key,
  Copy,
  Eye,
  EyeOff,
  RefreshCw,
  Trash2
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('account');
  const [isLoading, setIsLoading] = useState(false);
  const [walletAddress, setWalletAddress] = useState(user?.walletAddress || '');
  const [isPurchasing, setIsPurchasing] = useState(false);
  
  // API Key state
  const [apiKeyInfo, setApiKeyInfo] = useState(null);
  const [showApiKey, setShowApiKey] = useState(false);
  const [newApiKey, setNewApiKey] = useState(null);
  const [isGeneratingKey, setIsGeneratingKey] = useState(false);

  const creditPackages = [
    {
      id: 'starter',
      name: 'Starter Pack',
      credits: 100,
      price: 10,
      pricePerCredit: 0.10,
      popular: false,
      description: 'Perfect for getting started'
    },
    {
      id: 'growth',
      name: 'Growth Pack',
      credits: 500,
      price: 40,
      pricePerCredit: 0.08,
      popular: true,
      description: 'Best value for growing businesses',
      savings: '20% savings'
    },
    {
      id: 'enterprise',
      name: 'Enterprise Pack',
      credits: 1000,
      price: 70,
      pricePerCredit: 0.07,
      popular: false,
      description: 'For high-volume merchants',
      savings: '30% savings'
    }
  ];

  useEffect(() => {
    setWalletAddress(user?.walletAddress || '');
  }, [user]);

  useEffect(() => {
    if (activeTab === 'api') {
      fetchApiKeyInfo();
    }
  }, [activeTab]);

  const fetchApiKeyInfo = async () => {
    try {
      const response = await authAPI.getApiKeyInfo();
      setApiKeyInfo(response.data.data);
    } catch (error) {
      console.error('Failed to fetch API key info:', error);
    }
  };

  const validateWalletAddress = (address) => {
    // Basic Solana address validation (Base58, 32-44 characters)
    const solanaAddressRegex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
    return solanaAddressRegex.test(address);
  };

  const handleUpdateWallet = async (e) => {
    e.preventDefault();
    
    if (!walletAddress.trim()) {
      toast.error('Please enter a wallet address');
      return;
    }

    if (!validateWalletAddress(walletAddress)) {
      toast.error('Please enter a valid Solana wallet address');
      return;
    }

    setIsLoading(true);
    try {
      await authAPI.updateWallet(walletAddress);
      updateUser({ ...user, walletAddress });
      toast.success('Wallet address updated successfully!');
    } catch (error) {
      console.error('Update wallet error:', error);
      toast.error(error.response?.data?.error || 'Failed to update wallet address');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePurchaseCredits = async (packageId) => {
    setIsPurchasing(true);
    try {
      const response = await creditsAPI.purchaseCredits(packageId);
      
      if (response.data.success) {
        // Redirect to Stripe checkout
        window.location.href = response.data.data.checkoutUrl;
      } else {
        toast.error('Failed to create checkout session');
      }
    } catch (error) {
      console.error('Purchase credits error:', error);
      toast.error(error.response?.data?.error || 'Failed to initiate purchase');
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleGenerateApiKey = async () => {
    setIsGeneratingKey(true);
    try {
      const response = await authAPI.generateApiKey();
      setNewApiKey(response.data.data.apiKey);
      setShowApiKey(true);
      await fetchApiKeyInfo();
      toast.success('API key generated successfully!');
    } catch (error) {
      console.error('Generate API key error:', error);
      toast.error(error.response?.data?.error || 'Failed to generate API key');
    } finally {
      setIsGeneratingKey(false);
    }
  };

  const handleRevokeApiKey = async () => {
    if (!confirm('Are you sure you want to revoke your API key? This will break any existing integrations.')) {
      return;
    }

    try {
      await authAPI.revokeApiKey();
      setApiKeyInfo({ ...apiKeyInfo, hasApiKey: false, apiKeyMasked: null });
      setNewApiKey(null);
      setShowApiKey(false);
      toast.success('API key revoked successfully');
    } catch (error) {
      console.error('Revoke API key error:', error);
      toast.error(error.response?.data?.error || 'Failed to revoke API key');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const tabs = [
    { id: 'account', name: 'Account', icon: User },
    { id: 'wallet', name: 'Wallet', icon: Wallet },
    { id: 'credits', name: 'Credits', icon: CreditCard },
    { id: 'api', name: 'API Integration', icon: Key }
  ];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account, wallet, and credits</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Account Tab */}
          {activeTab === 'account' && (
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <User className="h-6 w-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">Account Information</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Email address cannot be changed</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Status
                  </label>
                  <div className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-600 font-medium">Active</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Member Since
                  </label>
                  <p className="text-sm text-gray-900">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : 'Unknown'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Wallet Tab */}
          {activeTab === 'wallet' && (
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <Wallet className="h-6 w-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">Wallet Settings</h2>
              </div>

              <form onSubmit={handleUpdateWallet} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Default Solana Wallet Address
                  </label>
                  <input
                    type="text"
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    placeholder="Enter your Solana wallet address (e.g., 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    This address will be used as the default recipient for payment links
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-medium text-blue-900">Important</h3>
                      <p className="text-sm text-blue-700 mt-1">
                        Make sure you own this wallet address. All payments will be sent directly to this address.
                        AURAS Pay does not hold or control your funds.
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !walletAddress.trim() || walletAddress === user?.walletAddress}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Updating...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>Update Wallet Address</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Credits Tab */}
          {activeTab === 'credits' && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <CreditCard className="h-6 w-6 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Credit Management</h2>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Current Balance</p>
                  <p className="text-2xl font-bold text-blue-600">{user?.transactionCredits || 0} Credits</p>
                </div>
              </div>

              {/* Current Usage */}
              <div className="bg-gray-50 rounded-lg p-4 mb-8">
                <h3 className="text-sm font-medium text-gray-900 mb-2">How Credits Work</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 1 credit = 1 payment link creation</li>
                  <li>• Credits never expire</li>
                  <li>• New users get 5 free credits</li>
                  <li>• No monthly fees or hidden charges</li>
                </ul>
              </div>

              {/* Credit Packages */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Purchase Credits</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {creditPackages.map((pkg) => (
                    <div
                      key={pkg.id}
                      className={`relative bg-white border-2 rounded-lg p-6 ${
                        pkg.popular ? 'border-blue-500' : 'border-gray-200'
                      }`}
                    >
                      {pkg.popular && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                            <Star className="h-3 w-3" />
                            <span>Most Popular</span>
                          </div>
                        </div>
                      )}

                      <div className="text-center">
                        <h4 className="text-lg font-semibold text-gray-900">{pkg.name}</h4>
                        <p className="text-sm text-gray-500 mt-1">{pkg.description}</p>
                        
                        <div className="mt-4">
                          <span className="text-3xl font-bold text-gray-900">${pkg.price}</span>
                          <p className="text-sm text-gray-500">for {pkg.credits} credits</p>
                          <p className="text-xs text-gray-400">${pkg.pricePerCredit.toFixed(2)} per credit</p>
                        </div>

                        {pkg.savings && (
                          <div className="mt-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {pkg.savings}
                            </span>
                          </div>
                        )}

                        <button
                          onClick={() => handlePurchaseCredits(pkg.id)}
                          disabled={isPurchasing}
                          className={`w-full mt-6 py-3 px-4 rounded-lg font-medium transition-colors ${
                            pkg.popular
                              ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                              : 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2'
                          } disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2`}
                        >
                          {isPurchasing ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                              <span>Processing...</span>
                            </>
                          ) : (
                            <>
                              <Package className="h-4 w-4" />
                              <span>Purchase Credits</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-medium text-yellow-900">Payment Processing</h3>
                      <p className="text-sm text-yellow-700 mt-1">
                        Credit purchases are processed through Stripe. After successful payment, 
                        credits will be added to your account immediately.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* API Integration Tab */}
          {activeTab === 'api' && (
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <Key className="h-6 w-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">API Integration</h2>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <Key className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-blue-900">API for E-commerce Integration</h3>
                    <p className="text-sm text-blue-700 mt-1">
                      Use our secure API to create payment links programmatically in your store. 
                      Each API call deducts 1 credit from your account.
                    </p>
                  </div>
                </div>
              </div>

              {/* API Key Management */}
              <div className="space-y-6">
                {apiKeyInfo && apiKeyInfo.hasApiKey ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        API Key
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type={showApiKey ? 'text' : 'password'}
                          value={newApiKey || (showApiKey ? 'Loading...' : apiKeyInfo.apiKeyMasked)}
                          readOnly
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 font-mono text-sm"
                        />
                        <button
                          onClick={() => setShowApiKey(!showApiKey)}
                          className="p-2 text-gray-500 hover:text-gray-700"
                          title={showApiKey ? 'Hide API key' : 'Show API key'}
                        >
                          {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                        <button
                          onClick={() => copyToClipboard(newApiKey || apiKeyInfo.apiKeyMasked)}
                          className="p-2 text-blue-600 hover:text-blue-700"
                          title="Copy to clipboard"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                      </div>
                      {newApiKey && (
                        <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <div className="flex items-start space-x-2">
                            <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                            <p className="text-sm text-yellow-700">
                              <strong>Important:</strong> This is your new API key. Store it securely - you won't be able to see it again.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center space-x-2">
                          <Check className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium text-gray-900">Status</span>
                        </div>
                        <p className="text-sm text-green-600 mt-1">Active</p>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center space-x-2">
                          <CreditCard className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium text-gray-900">Credits</span>
                        </div>
                        <p className="text-sm text-blue-600 mt-1">{apiKeyInfo.creditsRemaining || 0} remaining</p>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center space-x-2">
                          <Package className="h-4 w-4 text-purple-600" />
                          <span className="text-sm font-medium text-gray-900">API Calls</span>
                        </div>
                        <p className="text-sm text-purple-600 mt-1">{apiKeyInfo.totalApiCalls || 0} total</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <button
                        onClick={handleGenerateApiKey}
                        disabled={isGeneratingKey}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isGeneratingKey ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>Generating...</span>
                          </>
                        ) : (
                          <>
                            <RefreshCw className="h-4 w-4" />
                            <span>Generate New Key</span>
                          </>
                        )}
                      </button>
                      
                      <button
                        onClick={handleRevokeApiKey}
                        className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Revoke Key</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <Key className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No API Key Found</h3>
                    <p className="text-sm text-gray-500 mb-6">Generate an API key to start integrating AURAS Pay into your store.</p>
                    
                    <button
                      onClick={handleGenerateApiKey}
                      disabled={isGeneratingKey}
                      className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed mx-auto"
                    >
                      {isGeneratingKey ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Generating...</span>
                        </>
                      ) : (
                        <>
                          <Key className="h-4 w-4" />
                          <span>Generate API Key</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* API Documentation */}
              <div className="mt-8 border-t border-gray-200 pt-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">API Documentation</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Quick Start</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Create payment links programmatically with simple HTTP requests.
                    </p>
                    <div className="bg-gray-900 rounded text-green-400 text-xs p-3 font-mono">
                      <div>POST /api/v1/payment-links</div>
                      <div>Authorization: Bearer YOUR_API_KEY</div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Rate Limits</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• 100 requests per 15 minutes</li>
                      <li>• 1 credit per payment link</li>
                      <li>• No burst limits</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-6 flex items-center space-x-4">
                  <a
                    href="/api-docs"
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    View Full Documentation →
                  </a>
                  <a
                    href="/api-examples"
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Code Examples →
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
