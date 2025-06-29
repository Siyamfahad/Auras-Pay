import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { paymentsAPI } from '../services/api';
import Layout from '../components/Layout';
import { 
  CreditCard, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  Plus, 
  ArrowRight,
  Eye,
  DollarSign,
  Activity,
  AlertTriangle,
  BarChart3
} from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalPayments: 0,
    completedPayments: 0,
    pendingPayments: 0,
    totalAmount: 0
  });
  const [recentPayments, setRecentPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const statusColors = {
    PENDING: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    COMPLETED: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    EXPIRED: 'bg-slate-500/10 text-slate-400 border border-slate-500/20',
    FAILED: 'bg-red-500/10 text-red-400 border border-red-500/20'
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // Fetch recent payments
      const paymentsResponse = await paymentsAPI.getPayments({ limit: 5 });
      const payments = paymentsResponse.data.data.payments;
      setRecentPayments(payments);

      // Calculate stats from payments
      const totalPayments = payments.length;
      const completedPayments = payments.filter(p => p.status === 'COMPLETED').length;
      const pendingPayments = payments.filter(p => p.status === 'PENDING').length;
      const totalAmount = payments
        .filter(p => p.status === 'COMPLETED')
        .reduce((sum, p) => sum + parseFloat(p.amount), 0);

      setStats({
        totalPayments,
        completedPayments,
        pendingPayments,
        totalAmount
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const StatCard = ({ title, value, icon: Icon, trend, description }) => (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gray-800 rounded-md">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-400">{title}</p>
            <p className="text-2xl font-semibold text-white mt-1">{value}</p>
          </div>
        </div>
        {trend && (
          <div className="text-right">
            <p className="text-xs text-gray-500">{description}</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-white">Dashboard</h1>
            <p className="text-gray-400 mt-1">Welcome back, {user?.email?.split('@')[0] || 'User'}</p>
          </div>
          <Link
            to="/create-payment"
            className="bg-white text-black px-6 py-2.5 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Create Payment</span>
          </Link>
        </div>

        {/* Wallet Setup Alert */}
        {!user?.walletAddress && (
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-amber-400 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-amber-400">Wallet Setup Required</h3>
                <p className="text-sm text-amber-300/80 mt-1">
                  Configure your Solana wallet address to start receiving payments.
                </p>
                  <Link
                    to="/settings"
                  className="inline-flex items-center text-sm font-medium text-amber-400 hover:text-amber-300 mt-2"
                  >
                    Set up wallet
                  <ArrowRight className="h-3 w-3 ml-1" />
                  </Link>
              </div>
            </div>
          </div>
        )}

        {/* Credits Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium text-white">Available Credits</h2>
              <div className="flex items-baseline space-x-2 mt-2">
                <span className="text-3xl font-semibold text-white">{user?.transactionCredits || 0}</span>
                <span className="text-sm text-gray-400">credits remaining</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">Each credit creates one payment link</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <p className="text-xs text-gray-500">Usage this month</p>
                <p className="text-sm text-gray-400">— credits</p>
              </div>
              {(user?.transactionCredits || 0) < 5 && (
                <Link
                  to="/settings"
                  className="bg-gray-800 text-gray-300 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors"
                >
                  Buy Credits
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Payments"
            value={stats.totalPayments}
            icon={BarChart3}
            description="All time"
          />
          <StatCard
            title="Completed"
            value={stats.completedPayments}
            icon={CheckCircle}
            description="Successfully paid"
          />
          <StatCard
            title="Pending"
            value={stats.pendingPayments}
            icon={Clock}
            description="Awaiting payment"
          />
          <StatCard
            title="Total Received"
            value={`${stats.totalAmount.toFixed(3)} SOL`}
            icon={DollarSign}
            description="Total earnings"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Payments */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900 border border-gray-800 rounded-lg">
              <div className="px-6 py-4 border-b border-gray-800">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-white">Recent Payments</h3>
                  <Link
                    to="/payments"
                    className="text-sm text-gray-400 hover:text-white flex items-center space-x-1"
                  >
                    <span>View all</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>

              <div className="divide-y divide-gray-800">
                {isLoading ? (
                  <div className="px-6 py-12 text-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mx-auto"></div>
                    <p className="text-gray-400 mt-2 text-sm">Loading payments...</p>
                  </div>
                ) : recentPayments.length === 0 ? (
                  <div className="px-6 py-12 text-center">
                    <Eye className="h-8 w-8 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400 mb-4">No payments yet</p>
                    <Link
                      to="/create-payment"
                      className="inline-flex items-center text-sm text-white bg-gray-800 px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create your first payment
                    </Link>
                  </div>
                ) : (
                  recentPayments.map((payment) => (
                    <div key={payment.id} className="px-6 py-4 hover:bg-gray-800/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">{payment.label}</p>
                          <p className="text-xs text-gray-500 mt-1">{payment.message || 'No description'}</p>
                            </div>
                        <div className="flex items-center space-x-4 ml-4">
                            <div className="text-right">
                            <p className="text-sm font-medium text-white">
                                {payment.amount} {payment.currency}
                              </p>
                              <p className="text-xs text-gray-500">{formatDate(payment.createdAt)}</p>
                          </div>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[payment.status]}`}>
                            {payment.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-medium text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  to="/create-payment"
                  className="flex items-center justify-between p-3 border border-gray-800 rounded-md hover:border-gray-700 hover:bg-gray-800/50 transition-all group"
                >
                  <div className="flex items-center space-x-3">
                    <Plus className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium text-white">Create Payment</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-600 group-hover:text-gray-400" />
                </Link>

                <Link
                  to="/payments"
                  className="flex items-center justify-between p-3 border border-gray-800 rounded-md hover:border-gray-700 hover:bg-gray-800/50 transition-all group"
                >
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium text-white">View Payments</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-600 group-hover:text-gray-400" />
                </Link>

                <Link
                  to="/settings"
                  className="flex items-center justify-between p-3 border border-gray-800 rounded-md hover:border-gray-700 hover:bg-gray-800/50 transition-all group"
                >
                  <div className="flex items-center space-x-3">
                    <CreditCard className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium text-white">Settings</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-600 group-hover:text-gray-400" />
                </Link>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-medium text-white mb-3">Tips</h3>
              <div className="space-y-3 text-sm text-gray-400">
                <p>• Use clear payment descriptions to help customers understand charges</p>
                <p>• Monitor payment status in real-time from the Payments page</p>
                <p>• Set up your wallet address to start receiving payments</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 