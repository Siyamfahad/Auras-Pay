import Head from "next/head";
import Link from "next/link";
import { useState, useEffect } from "react";
import AppLayout from "@/common/layouts/AppLayout";

export default function RegisterPage() {
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    // Auto-redirect to the dashboard after 3 seconds
    const timer = setTimeout(() => {
      setIsRedirecting(true);
      const currentHost = window.location.hostname;
      window.location.href = `http://${currentHost}:5174/register`;
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleRedirectNow = () => {
    setIsRedirecting(true);
    const currentHost = window.location.hostname;
    window.location.href = `http://${currentHost}:5174/register`;
  };

  return (
    <>
      <Head>
        <title>Register - AURAS Pay</title>
        <meta name="description" content="Create your AURAS Pay merchant account and start accepting crypto payments today." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AppLayout>
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <div className="text-center">
              <h2 className="mt-6 text-3xl font-extrabold text-white">
                Create your merchant account
              </h2>
              <p className="mt-2 text-sm text-gray-400">
                Start accepting crypto payments in minutes
              </p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-8">
              {isRedirecting ? (
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
                  <h3 className="text-lg font-medium text-white mb-2">Redirecting to Registration...</h3>
                  <p className="text-gray-400">Taking you to the secure registration page</p>
                </div>
              ) : (
                <div className="text-center">
                  <div className="mb-6">
                    <div className="text-4xl mb-4">🚀</div>
                    <h3 className="text-lg font-medium text-white mb-2">Start Your Crypto Journey</h3>
                    <p className="text-gray-400 mb-6">
                      Join thousands of merchants already using AURAS Pay to accept crypto payments with zero custody risk.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-4 mb-6">
                    <div className="flex items-center text-sm text-gray-300">
                      <span className="text-green-400 mr-2">✓</span>
                      Non-custodial payments directly to your wallet
                    </div>
                    <div className="flex items-center text-sm text-gray-300">
                      <span className="text-green-400 mr-2">✓</span>
                      Lightning-fast Solana transactions
                    </div>
                    <div className="flex items-center text-sm text-gray-300">
                      <span className="text-green-400 mr-2">✓</span>
                      Simple credit-based pricing
                    </div>
                    <div className="flex items-center text-sm text-gray-300">
                      <span className="text-green-400 mr-2">✓</span>
                      Free to get started
                    </div>
                  </div>

                  <button
                    onClick={handleRedirectNow}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
                  >
                    Create Your Account
                  </button>

                  <div className="mt-6 text-sm text-gray-400">
                    <p>Already have an account? <Link href="/login" className="text-purple-400 hover:text-purple-300">Sign in here</Link></p>
                    <p className="mt-2">Auto-redirecting in <span className="text-purple-400">3 seconds</span>...</p>
                  </div>
                </div>
              )}
            </div>

            <div className="text-center">
              <div className="space-y-2 text-sm text-gray-400">
                <p>💳 No monthly fees, pay only for what you use</p>
                <p>🔒 Your funds stay in your wallet, always</p>
                <p>⚡ Get paid instantly with every transaction</p>
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
    </>
  );
}
