import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  WalletIcon, 
  ShieldCheckIcon, 
  BoltIcon, 
  GlobeIcon,
  CreditCardIcon,
  CheckIcon
} from 'lucide-react';

export default function LandingPage() {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: BoltIcon,
      title: 'Lightning Fast',
      description: 'Process payments in seconds with Solana\'s high-speed blockchain technology.',
    },
    {
      icon: ShieldCheckIcon,
      title: 'Non-Custodial',
      description: 'Payments go directly to your wallet. We never hold your funds.',
    },
    {
      icon: WalletIcon,
      title: 'Crypto Native',
      description: 'Built specifically for Solana ecosystem with native SPL token support.',
    },
    {
      icon: GlobeIcon,
      title: 'Global Reach',
      description: 'Accept payments from anywhere in the world without borders.',
    },
  ];

  const pricing = [
    {
      name: 'Starter',
      credits: 100,
      price: '$10',
      pricePerPayment: '$0.10',
      features: ['100 payment links', 'Basic analytics', 'Email support'],
    },
    {
      name: 'Professional',
      credits: 500,
      price: '$40',
      pricePerPayment: '$0.08',
      features: ['500 payment links', 'Advanced analytics', 'Priority support', 'Custom branding'],
      popular: true,
    },
    {
      name: 'Enterprise',
      credits: 1000,
      price: '$70',
      pricePerPayment: '$0.07',
      features: ['1000 payment links', 'Full analytics suite', 'Dedicated support', 'API access'],
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <WalletIcon className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-2xl font-bold text-gray-900">AURAS Pay</span>
            </div>
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <Link to="/dashboard" className="btn-primary">
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/login" className="btn-outline">
                    Sign In
                  </Link>
                  <Link to="/register" className="btn-primary">
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-primary-600 to-primary-400 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-gradient-to-r from-primary-600 to-primary-400 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">Accept crypto payments</span>{' '}
                  <span className="block text-primary-200 xl:inline">with ease</span>
                </h1>
                <p className="mt-3 text-base text-primary-100 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  The fastest way to accept Solana payments. Create payment links in seconds, 
                  get paid instantly, and manage everything from your dashboard.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link to="/register" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10">
                      Start Free Trial
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Link to="/login" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-500 hover:bg-primary-600 md:py-4 md:text-lg md:px-10">
                      Sign In
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <div className="h-56 w-full bg-gradient-to-br from-primary-400 to-primary-600 sm:h-72 md:h-96 lg:w-full lg:h-full flex items-center justify-center">
            <CreditCardIcon className="h-32 w-32 text-white opacity-20" />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Built for the future of payments
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              AURAS Pay combines the speed of Solana with the simplicity of traditional payment processors.
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div key={feature.title} className="relative">
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                      <Icon className="h-6 w-6" />
                    </div>
                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{feature.title}</p>
                    <p className="mt-2 ml-16 text-base text-gray-500">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="sm:text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Simple, transparent pricing
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Pay only for what you use. No monthly fees, no hidden costs.
            </p>
          </div>
          <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0">
            {pricing.map((plan) => (
              <div key={plan.name} className={`border border-gray-200 rounded-lg shadow-sm divide-y divide-gray-200 ${plan.popular ? 'border-primary-500 relative' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="inline-flex px-4 py-1 rounded-full text-sm font-semibold bg-primary-500 text-white">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">{plan.name}</h3>
                  <p className="mt-4 text-sm text-gray-500">{plan.credits} payment links</p>
                  <p className="mt-8">
                    <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
                    <span className="text-base font-medium text-gray-500"> / {plan.credits} credits</span>
                  </p>
                  <p className="mt-2 text-sm text-gray-500">{plan.pricePerPayment} per payment</p>
                  <Link
                    to="/register"
                    className={`mt-8 block w-full py-2 px-4 border border-transparent rounded-md text-sm font-medium text-center ${
                      plan.popular
                        ? 'bg-primary-600 text-white hover:bg-primary-700'
                        : 'bg-primary-50 text-primary-700 hover:bg-primary-100'
                    }`}
                  >
                    Get started
                  </Link>
                </div>
                <div className="pt-6 pb-8 px-6">
                  <h4 className="text-xs font-medium text-gray-900 tracking-wide uppercase">What's included</h4>
                  <ul className="mt-6 space-y-4">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex space-x-3">
                        <CheckIcon className="flex-shrink-0 h-5 w-5 text-green-500" />
                        <span className="text-sm text-gray-500">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-600">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to get started?</span>
            <span className="block text-primary-200">Create your first payment link today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-primary-50"
              >
                Get started for free
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <WalletIcon className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">AURAS Pay</span>
            </div>
            <p className="text-gray-500 text-sm">
              © 2024 AURAS Pay. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
} 