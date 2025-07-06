import Head from "next/head";
import Link from "next/link";
import { useState, useEffect } from "react";
import AppLayout from "@/common/layouts/AppLayout";

export default function LoginPage() {
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    // Auto-redirect to the dashboard after 3 seconds
    const timer = setTimeout(() => {
      setIsRedirecting(true);
      const currentHost = window.location.hostname;
      window.location.href = `http://${currentHost}:5174/login`;
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleRedirectNow = () => {
    setIsRedirecting(true);
    const currentHost = window.location.hostname;
    window.location.href = `http://${currentHost}:5174/login`;
  };

  return (
    <>
      <Head>
        <title>Login - AURAS Pay</title>
        <meta name="description" content="Sign in to your AURAS Pay merchant account to manage payments and access your dashboard." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AppLayout>
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <div className="text-center">
              <h2 className="mt-6 text-3xl font-extrabold text-white">
                Sign in to your account
              </h2>
              <p className="mt-2 text-sm text-gray-400">
                Access your AURAS Pay merchant dashboard
              </p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-8">
              {isRedirecting ? (
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
                  <h3 className="text-lg font-medium text-white mb-2">Redirecting to Dashboard...</h3>
                  <p className="text-gray-400">Taking you to the secure login page</p>
                </div>
              ) : (
                <div className="text-center">
                  <div className="mb-6">
                    <div className="text-4xl mb-4">🔐</div>
                    <h3 className="text-lg font-medium text-white mb-2">Secure Merchant Login</h3>
                    <p className="text-gray-400 mb-6">
                      You'll be redirected to our secure dashboard where you can sign in with your merchant credentials.
                    </p>
                  </div>

                  <button
                    onClick={handleRedirectNow}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
                  >
                    Continue to Dashboard Login
                  </button>

                  <div className="mt-6 text-sm text-gray-400">
                    <p>Don't have an account? <Link href="/register" className="text-purple-400 hover:text-purple-300">Register here</Link></p>
                    <p className="mt-2">Auto-redirecting in <span className="text-purple-400">3 seconds</span>...</p>
                  </div>
                </div>
              )}
            </div>

            <div className="text-center">
              <div className="space-y-2 text-sm text-gray-400">
                <p>🔒 Your data is protected with enterprise-grade security</p>
                <p>🌍 Access from anywhere with our secure dashboard</p>
                <p>⚡ Lightning-fast Solana transactions</p>
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
    </>
  );
}
