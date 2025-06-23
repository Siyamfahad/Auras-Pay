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
  Activity
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
    PENDING: 'bg-yellow-100 text-yellow-800',
    COMPLETED: 'bg-green-100 text-green-800',
    EXPIRED: 'bg-gray-100 text-gray-800',
    FAILED: 'bg-red-100 text-red-800'
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

  const StatCard = ({ title, value, icon: Icon, color, description }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center">
        <div className={`flex-shrink-0 p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="ml-4 flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {description && (
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user?.email?.split('@')[0] || 'User'}! 👋
            </h1>
            <p className="text-gray-600 mt-2">Here's what's happening with your payments today.</p>
          </div>
          <Link
            to="/create-payment"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Create Payment</span>
          </Link>
        </div>

        {/* Credits Card */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-sm p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold mb-2">Available Credits</h2>
              <p className="text-3xl font-bold">{user?.transactionCredits || 0}</p>
              <p className="text-blue-100 mt-1">Each credit creates one payment link</p>
            </div>
            <div className="text-right">
              <CreditCard className="h-12 w-12 text-blue-200 mb-2" />
              {(user?.transactionCredits || 0) < 5 && (
                <Link
                  to="/settings"
                  className="inline-flex items-center px-3 py-2 bg-white bg-opacity-20 rounded-lg text-sm font-medium hover:bg-opacity-30 transition-colors"
                >
                  Buy More Credits
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Payments"
            value={stats.totalPayments}
            icon={Activity}
            color="bg-blue-500"
            description="All payment links created"
          />
          <StatCard
            title="Completed"
            value={stats.completedPayments}
            icon={CheckCircle}
            color="bg-green-500"
            description="Successfully paid"
          />
          <StatCard
            title="Pending"
            value={stats.pendingPayments}
            icon={Clock}
            color="bg-yellow-500"
            description="Awaiting payment"
          />
          <StatCard
            title="Total Received"
            value={`${stats.totalAmount.toFixed(3)} SOL`}
            icon={DollarSign}
            color="bg-purple-500"
            description="From completed payments"
          />
        </div>

        {/* Recent Payments and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Payments */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Payments</h3>
                  <Link
                    to="/payments"
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                  >
                    View All
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {isLoading ? (
                  <div className="p-6 text-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-gray-600 mt-2">Loading payments...</p>
                  </div>
                ) : recentPayments.length === 0 ? (
                  <div className="p-6 text-center">
                    <Eye className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">No payments yet</p>
                    <Link
                      to="/create-payment"
                      className="mt-2 inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Create your first payment link
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>
                  </div>
                ) : (
                  recentPayments.map((payment) => (
                    <div key={payment.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">{payment.label}</p>
                              <p className="text-sm text-gray-500">{payment.message || 'No message'}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-gray-900">
                                {payment.amount} {payment.currency}
                              </p>
                              <p className="text-xs text-gray-500">{formatDate(payment.createdAt)}</p>
                            </div>
                          </div>
                        </div>
                        <div className="ml-4">
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
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  to="/create-payment"
                  className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <Plus className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium text-gray-900">Create Payment Link</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                </Link>

                <Link
                  to="/payments"
                  className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <Eye className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium text-gray-900">View All Payments</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                </Link>

                <Link
                  to="/settings"
                  className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <CreditCard className="h-5 w-5 text-purple-600" />
                    <span className="text-sm font-medium text-gray-900">Buy Credits</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                </Link>
              </div>
            </div>

            {/* Tips Card */}
            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg border border-green-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">💡 Pro Tips</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <p>• Share payment links via QR codes for easy mobile payments</p>
                <p>• Set clear labels to help customers understand what they're paying for</p>
                <p>• Monitor payment status in real-time from the Payments page</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 