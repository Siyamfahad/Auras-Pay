import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { adminAPI } from '../services/api';
import Layout from '../components/Layout';
import { 
  Users, 
  CreditCard, 
  TrendingUp, 
  DollarSign,
  Search,
  Edit,
  AlertCircle,
  Plus,
  Minus,
  Shield
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    totalPayments: 0,
    totalCreditsIssued: 0,
    totalRevenue: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [creditAdjustment, setCreditAdjustment] = useState('');
  const [reason, setReason] = useState('');

  // Check if user is admin - use the isAdmin field with fallback to old logic
  const isAdmin = user?.isAdmin || user?.email === 'admin@aurasepay.com' || user?.email?.includes('admin') || user?.id === 1;

  console.log('Admin check:', { 
    userIsAdmin: user?.isAdmin, 
    userEmail: user?.email, 
    userId: user?.id, 
    finalIsAdmin: isAdmin 
  });

  useEffect(() => {
    if (isAdmin) {
      fetchAdminData();
    }
  }, [isAdmin]);

  const fetchAdminData = async () => {
    setIsLoading(true);
    try {
      const [usersResponse, analyticsResponse] = await Promise.all([
        adminAPI.getUsers({ search: searchTerm }),
        adminAPI.getAnalytics()
      ]);

      if (usersResponse.data.success) {
        setUsers(usersResponse.data.data.users);
      }
      
      if (analyticsResponse.data.success) {
        setAnalytics(analyticsResponse.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
      toast.error('Failed to load admin data. You may need to login as admin.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreditAdjustment = async (userId, adjustment) => {
    if (!adjustment || isNaN(adjustment)) {
      toast.error('Please enter a valid number');
      return;
    }

    try {
      const response = await adminAPI.adjustCredits(userId, parseInt(adjustment), reason || 'Manual admin adjustment');
      
      if (response.data.success) {
        // Update local state
        setUsers(users.map(u => 
          u.id === userId 
            ? { ...u, transactionCredits: response.data.data.user.transactionCredits }
            : u
        ));
        
        toast.success(`Credits ${adjustment > 0 ? 'added' : 'deducted'} successfully`);
        setEditingUser(null);
        setCreditAdjustment('');
        setReason('');
      }
    } catch (error) {
      console.error('Failed to adjust credits:', error);
      toast.error(error.response?.data?.error || 'Failed to adjust credits');
    }
  };

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isAdmin) {
        fetchAdminData();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, isAdmin]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
          <div className="max-w-4xl mx-auto text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-gray-300">Loading admin panel...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!isAdmin) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
          <div className="max-w-4xl mx-auto text-center py-12">
            <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
            <p className="text-gray-300 mb-4">You don't have permission to access the admin panel.</p>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
              <p className="text-sm text-gray-400">Admin email: admin@aurasepay.com</p>
              <p className="text-sm text-gray-400">Current user: {user?.email || 'Not logged in'}</p>
              <p className="text-sm text-gray-400">Is Admin: {user?.isAdmin ? 'Yes' : 'No'}</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                Admin Dashboard
              </h1>
              <p className="text-gray-300 mt-2">Manage users, credits, and view platform analytics</p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg px-4 py-2 border border-gray-700">
              <span className="text-sm text-gray-400">Logged in as: </span>
              <span className="font-medium text-purple-400">{user?.email}</span>
            </div>
          </div>

          {/* Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6 hover:bg-gray-800/70 transition-all duration-300">
              <div className="flex items-center">
                <div className="p-3 bg-blue-600/20 rounded-lg">
                  <Users className="h-8 w-8 text-blue-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">Total Users</p>
                  <p className="text-2xl font-bold text-white">{analytics.totalUsers || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6 hover:bg-gray-800/70 transition-all duration-300">
              <div className="flex items-center">
                <div className="p-3 bg-green-600/20 rounded-lg">
                  <CreditCard className="h-8 w-8 text-green-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">Total Payments</p>
                  <p className="text-2xl font-bold text-white">{analytics.totalPayments || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6 hover:bg-gray-800/70 transition-all duration-300">
              <div className="flex items-center">
                <div className="p-3 bg-purple-600/20 rounded-lg">
                  <TrendingUp className="h-8 w-8 text-purple-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">Credits Issued</p>
                  <p className="text-2xl font-bold text-white">{analytics.totalCreditsIssued || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6 hover:bg-gray-800/70 transition-all duration-300">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-600/20 rounded-lg">
                  <DollarSign className="h-8 w-8 text-yellow-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">Total Revenue</p>
                  <p className="text-2xl font-bold text-white">${analytics.totalRevenue || 0}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Users Management */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <Users className="h-6 w-6 text-purple-400" />
              User Management
            </h2>
            
            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users by email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-400 transition-all duration-300"
                />
              </div>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Wallet
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Credits
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Payments
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800/30 divide-y divide-gray-700">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-700/30 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-white flex items-center gap-2">
                              {user.email}
                              {user.isAdmin && (
                                <div className="p-1 bg-purple-600/20 rounded">
                                  <Shield className="h-4 w-4 text-purple-400" />
                                </div>
                              )}
                            </div>
                            <div className="text-sm text-gray-400">ID: {user.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {user.walletAddress ? (
                          <div className="font-mono text-xs bg-gray-700/50 px-2 py-1 rounded">
                            {user.walletAddress.substring(0, 8)}...{user.walletAddress.substring(user.walletAddress.length - 8)}
                          </div>
                        ) : (
                          <span className="text-gray-500">Not connected</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-600/20 text-green-400 border border-green-600/30">
                          {user.transactionCredits} credits
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {user.totalPayments || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {!user.isAdmin && (
                          <button
                            onClick={() => setEditingUser(user)}
                            className="text-purple-400 hover:text-purple-300 flex items-center gap-1 px-3 py-1 rounded-lg hover:bg-purple-600/20 transition-all duration-200"
                          >
                            <Edit className="h-4 w-4" />
                            Edit Credits
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {users.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  No users found
                </div>
              )}
            </div>
          </div>

          {/* Edit Credits Modal */}
          {editingUser && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center">
              <div className="relative p-6 border border-gray-700 w-96 shadow-2xl rounded-xl bg-gray-800 mx-4">
                <div className="mt-3">
                  <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                    <Edit className="h-5 w-5 text-purple-400" />
                    Adjust Credits for {editingUser.email}
                  </h3>
                  
                  <div className="mb-4 p-3 bg-gray-700/50 rounded-lg">
                    <p className="text-sm text-gray-300">
                      Current credits: <span className="font-medium text-green-400">{editingUser.transactionCredits}</span>
                    </p>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Credit Adjustment
                    </label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setCreditAdjustment('-10')}
                        className="flex items-center gap-1 px-3 py-2 border border-red-600/30 text-red-400 rounded-md hover:bg-red-600/20 transition-all duration-200"
                      >
                        <Minus className="h-4 w-4" /> 10
                      </button>
                      <button
                        onClick={() => setCreditAdjustment('-100')}
                        className="flex items-center gap-1 px-3 py-2 border border-red-600/30 text-red-400 rounded-md hover:bg-red-600/20 transition-all duration-200"
                      >
                        <Minus className="h-4 w-4" /> 100
                      </button>
                      <input
                        type="number"
                        value={creditAdjustment}
                        onChange={(e) => setCreditAdjustment(e.target.value)}
                        placeholder="Enter amount"
                        className="flex-1 border border-gray-600 rounded-md px-3 py-2 bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      />
                      <button
                        onClick={() => setCreditAdjustment('10')}
                        className="flex items-center gap-1 px-3 py-2 border border-green-600/30 text-green-400 rounded-md hover:bg-green-600/20 transition-all duration-200"
                      >
                        <Plus className="h-4 w-4" /> 10
                      </button>
                      <button
                        onClick={() => setCreditAdjustment('100')}
                        className="flex items-center gap-1 px-3 py-2 border border-green-600/30 text-green-400 rounded-md hover:bg-green-600/20 transition-all duration-200"
                      >
                        <Plus className="h-4 w-4" /> 100
                      </button>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Reason (optional)
                    </label>
                    <input
                      type="text"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Reason for adjustment"
                      className="w-full border border-gray-600 rounded-md px-3 py-2 bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleCreditAdjustment(editingUser.id, creditAdjustment)}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-md hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium"
                    >
                      Apply Changes
                    </button>
                    <button
                      onClick={() => {
                        setEditingUser(null);
                        setCreditAdjustment('');
                        setReason('');
                      }}
                      className="flex-1 bg-gray-600 text-gray-200 px-4 py-2 rounded-md hover:bg-gray-500 transition-all duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
} 