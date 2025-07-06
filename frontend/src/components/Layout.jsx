import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Home,
  CreditCard,
  Plus,
  Settings,
  LogOut,
  Menu,
  X,
  Sparkles,
  Book,
} from 'lucide-react';
import paylogo from '../assets/paylogo.svg';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Payments', href: '/payments', icon: CreditCard },
  { name: 'Create Payment', href: '/create-payment', icon: Plus },
  { name: 'API Docs', href: '/api-docs', icon: Book },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-dark">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 flex z-40 md:hidden ${sidebarOpen ? '' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
        
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-gray-900 border-r border-gray-800">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent-primary bg-gray-800 hover:bg-gray-700 transition-colors"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
          
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex justify-center px-4 mb-8">
              <img 
                src={paylogo}
                alt="AURAS Pay" 
                className="h-16 w-auto"
              />
            </div>
            <nav className="px-3 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-4 py-3 text-base font-medium rounded-xl transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-r from-accent-primary to-accent-secondary text-white shadow-accent/20'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon className="mr-4 h-6 w-6" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
          
          <div className="flex-shrink-0 border-t border-gray-800 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-accent-primary to-accent-secondary flex items-center justify-center">
                  <span className="text-sm font-bold text-white">
                    {user?.email?.[0]?.toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-base font-medium text-white truncate">{user?.email}</p>
                <p className="text-sm text-gray-400">{user?.transactionCredits || 0} credits</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-gray-900 border-r border-gray-800">
          <div className="flex-1 flex flex-col pt-6 pb-4 overflow-y-auto">
            <div className="flex justify-center flex-shrink-0 px-4 mb-8">
              <img 
                src={paylogo}
                alt="AURAS Pay" 
                className="h-16 w-auto"
              />
            </div>
            <nav className="flex-1 px-3 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-r from-accent-primary to-accent-secondary text-white shadow-lg shadow-accent-primary/20'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
          
          <div className="flex-shrink-0 border-t border-gray-800 p-4">
            <div className="flex items-center w-full">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-accent-primary to-accent-secondary flex items-center justify-center">
                  <span className="text-sm font-bold text-white">
                    {user?.email?.[0]?.toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-white truncate">{user?.email}</p>
                <div className="flex items-center space-x-1 mt-1">
                  <Sparkles className="h-3 w-3 text-accent-primary" />
                  <p className="text-xs text-gray-400">{user?.transactionCredits || 0} credits</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="ml-2 p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-accent-primary transition-all duration-300"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-64 flex flex-col flex-1">
        <div className="sticky top-0 z-10 md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-gradient-dark backdrop-blur-md">
          <button
            type="button"
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent-primary transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
        
        <main className="flex-1">
          <div className="py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
