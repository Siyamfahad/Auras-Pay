import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, Sparkles, Shield, Gift } from 'lucide-react';
import paylogo from '../assets/paylogo.svg';

const schema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one lowercase letter, one uppercase letter, and one number'
    )
    .required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
});

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register: registerUser, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data) => {
    try {
      await registerUser(data.email, data.password);
      toast.success('Account created successfully! Welcome to AURAS Pay!');
      navigate('/dashboard', { replace: true });
    } catch (error) {
      console.error('Registration error:', error);
      if (error.response?.data?.details) {
        // Show specific validation errors
        error.response.data.details.forEach(detail => {
          toast.error(detail.msg);
        });
      } else {
        toast.error(error.response?.data?.error || 'Failed to create account');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-dark">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-primary"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-dark relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/3 w-72 h-72 bg-gradient-to-r from-accent-primary/15 to-accent-secondary/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-gradient-to-r from-accent-secondary/10 to-accent-primary/10 rounded-full blur-3xl animate-pulse delay-1500"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <img 
                src={paylogo}
                alt="AURAS Pay" 
                className="h-16 w-auto"
              />
            </div>
            <h2 className="text-4xl font-bold text-white mb-2">
              Join AURAS Pay
            </h2>
            <p className="text-xl gradient-text font-semibold mb-4">
              Start accepting crypto payments today
            </p>
            <p className="text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-accent-primary hover:text-accent-secondary transition-colors font-medium">
                Sign in here
              </Link>
            </p>
          </div>

          {/* Benefits Banner */}
          <div className="glass-effect rounded-2xl p-4 mb-6">
            <div className="flex items-center justify-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <Gift className="h-4 w-4 text-accent-primary" />
                <span className="text-gray-300">5 Free Credits</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-accent-primary" />
                <span className="text-gray-300">Secure</span>
              </div>
              <div className="flex items-center space-x-2">
                <Sparkles className="h-4 w-4 text-accent-primary" />
                <span className="text-gray-300">Instant Setup</span>
              </div>
            </div>
          </div>
          
          {/* Form Card */}
          <div className="card-gradient backdrop-blur-sm">
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email address
                  </label>
                  <input
                    {...register('email')}
                    type="email"
                    autoComplete="email"
                    className={`input ${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="Enter your email"
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-400">{errors.email.message}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      {...register('password')}
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      className={`input pr-12 ${errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                      placeholder="Create a strong password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-300 transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-2 text-sm text-red-400">{errors.password.message}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      {...register('confirmPassword')}
                      type={showConfirmPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      className={`input pr-12 ${errors.confirmPassword ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-300 transition-colors"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-2 text-sm text-red-400">{errors.confirmPassword.message}</p>
                  )}
                </div>
                
                {/* Password Requirements */}
                <div className="glass-effect rounded-xl p-4">
                  <p className="text-sm font-medium text-gray-300 mb-2">Password requirements:</p>
                  <ul className="text-xs text-gray-400 space-y-1">
                    <li>• At least 8 characters long</li>
                    <li>• Contains uppercase letter (A-Z)</li>
                    <li>• Contains lowercase letter (a-z)</li>
                    <li>• Contains at least one number (0-9)</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Link to="/" className="text-sm text-gray-400 hover:text-gray-300 transition-colors flex items-center">
                  ← Back to home
                </Link>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full text-lg font-semibold shadow-accent"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Creating account...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <Sparkles className="h-5 w-5" />
                    <span>Create Account</span>
                  </div>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-8 text-center space-y-4">
              <div className="glass-effect rounded-xl p-4">
                <p className="text-sm text-gray-300 mb-2">🎉 Welcome bonus:</p>
                <p className="text-accent-primary font-semibold">5 free credits to start accepting payments immediately</p>
              </div>
              <p className="text-xs text-gray-500">
                You can set up your wallet address later from your dashboard to start receiving payments.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
