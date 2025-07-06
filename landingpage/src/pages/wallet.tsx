import Head from "next/head";
import Hero from "@/common/modules/Hero";
import GradientBackgroundImage from "@/common/components/backgrounds/GradientBackgroundImage";
import HeroGradientBackground from "@/assets/images/Hero.Gradient.svg";
import LargeRedGradientBackground from "@/assets/images/LargeRedBackground.Gradient.svg";
import FeatureGrid from "@/common/modules/FeatureGrid";
import FeatureContent from "@/common/modules/FeatureContent";
import UserReviews from "@/common/modules/UserReviews";
import StatNumbers from "@/common/modules/StatNumbers";
import FAQ from "@/common/modules/FAQ";
import CallToActionBlock from "@/common/modules/CallToActionBlock";
import Section from "@/common/components/containers/Section";
import FoundersNote from "@/common/modules/FoundersNote";
import LogoClouds from "@/common/modules/LogoClouds";
import GradientBackground from "@/common/components/backgrounds/GradientBackground";
import AppLayout from "@/common/layouts/AppLayout";

// Wallet-specific content
const WalletHeroContent = {
  notfication: {
    tag: "New",
    text: "AURAS Wallet: The Future of Solana is Here!",
    button: "Join Beta",
    href: "#beta",
  },
  title: "Your Gateway to the Solana Ecosystem - Secure, Fast, Non-Custodial",
  description:
    "Experience the power of Solana with AURAS Wallet. Store, send, and manage SOL, USDT, and SPL tokens with military-grade security. Complete control over your keys, instant QR payments, and seamless DeFi integration.",
  buttons: [
    { title: "Download Wallet", href: "#download", type: "primary" as const },
    { title: "Explore Features", href: "#features", type: "secondary" as const },
  ],
  image: {
    src: "/images/Hero.Dashboard.png",
    width: 1000,
  },
};

const WalletFeatureGridContent = {
  title: "Why Choose AURAS Wallet",
  description:
    "The most secure and user-friendly Solana wallet with cutting-edge features designed for both beginners and power users.",
  features: [
    {
      icon: "🔐",
      title: "Non-Custodial Security",
      description: "Your keys, your crypto. Complete control with military-grade encryption and hardware wallet support.",
    },
    {
      icon: "⚡",
      title: "Lightning Fast",
      description: "Built on Solana for sub-second transaction speeds and ultra-low fees. The fastest wallet experience.",
    },
    {
      icon: "📱",
      title: "QR Code Payments",
      description: "Send and receive crypto with simple QR codes. Perfect for in-person transactions and quick transfers.",
    },
    {
      icon: "🌐",
      title: "Multi-Platform",
      description: "Available on iOS, Android, and Web. Sync seamlessly across all your devices.",
    },
    {
      icon: "🔄",
      title: "DeFi Integration",
      description: "Direct access to Solana's DeFi ecosystem. Swap, stake, and earn rewards without leaving the wallet.",
    },
    {
      icon: "🛡️",
      title: "Advanced Security",
      description: "Biometric authentication, transaction signing, and optional 2FA for maximum protection.",
    },
    {
      icon: "💎",
      title: "NFT Support",
      description: "View, send, and manage your Solana NFTs with a beautiful gallery interface.",
    },
    {
      icon: "📊",
      title: "Portfolio Tracking",
      description: "Real-time portfolio tracking with charts, analytics, and price alerts for all your assets.",
    },
  ],
};

const WalletFAQContent = {
  kicker: "Frequently Asked Questions",
  title: "Everything You Need to Know About AURAS Wallet",
  description:
    "Get answers to common questions about security, features, and getting started.",
  faqs: [
    {
      question: "Is AURAS Wallet really non-custodial?",
      answer:
        "Yes! AURAS Wallet is completely non-custodial. You control your private keys, which are encrypted and stored only on your device. We never have access to your funds or private keys.",
    },
    {
      question: "What cryptocurrencies does AURAS Wallet support?",
      answer:
        "AURAS Wallet supports SOL (Solana), USDT, USDC, and all SPL tokens on the Solana blockchain. We're continuously adding support for new tokens as they launch.",
    },
    {
      question: "How do QR code payments work?",
      answer:
        "Simply scan a QR code or generate one for someone to scan. The wallet automatically fills in the recipient address and amount. Confirm the transaction and it's sent instantly on the Solana network.",
    },
    {
      question: "Can I use AURAS Wallet for DeFi?",
      answer:
        "Absolutely! AURAS Wallet has built-in DeFi features including token swaps, staking, and direct integration with major Solana DeFi protocols. Earn rewards without leaving the wallet.",
    },
    {
      question: "How secure is AURAS Wallet?",
      answer:
        "AURAS Wallet uses military-grade AES-256 encryption, biometric authentication, and optional 2FA. Your private keys are encrypted and stored only on your device, never on our servers.",
    },
    {
      question: "Is there a mobile app?",
      answer:
        "Yes! AURAS Wallet is available on iOS and Android, with a web version for desktop. All versions sync seamlessly so you can access your wallet anywhere.",
    },
  ],
};

const DownloadSection = () => (
  <Section background="lighter" id="download">
    <div className="text-center">
      <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
        Download AURAS Wallet
      </h2>
      <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
        Get started with the most secure and feature-rich Solana wallet. Available on all platforms.
      </p>
      
      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
          <div className="text-4xl mb-4">📱</div>
          <h3 className="text-xl font-semibold text-white mb-2">iOS App</h3>
          <p className="text-gray-400 mb-4">Download from the App Store</p>
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors">
            Coming Soon
          </button>
        </div>
        
        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
          <div className="text-4xl mb-4">🤖</div>
          <h3 className="text-xl font-semibold text-white mb-2">Android App</h3>
          <p className="text-gray-400 mb-4">Download from Google Play</p>
          <button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors">
            Coming Soon
          </button>
        </div>
        
        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
          <div className="text-4xl mb-4">💻</div>
          <h3 className="text-xl font-semibold text-white mb-2">Web App</h3>
          <p className="text-gray-400 mb-4">Use in your browser</p>
          <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-colors">
            Launch App
          </button>
        </div>
      </div>
      
      <div className="mt-8 text-sm text-gray-400">
        <p>🔒 All downloads are secure and verified</p>
        <p>⚡ Start using AURAS Wallet in under 2 minutes</p>
      </div>
    </div>
  </Section>
);

export default function WalletPage() {
  return (
    <>
      {/* Meta Tags */}
      <Head>
        <title>AURAS Wallet - Secure Solana Crypto Wallet | Lightning Fast Transactions</title>
        <meta name="description" content="Experience the power of Solana with AURAS Wallet. Store, send, and manage SOL, USDT, and SPL tokens with military-grade security. Complete control over your keys, instant QR payments, and seamless DeFi integration." />
        <meta name="keywords" content="Solana wallet, crypto wallet, SOL, USDT, SPL tokens, DeFi, non-custodial, QR payments, staking, Solana blockchain, cryptocurrency" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="og:title" content="AURAS Wallet - Your Gateway to the Solana Ecosystem" />
        <meta property="og:description" content="The most secure and fastest Solana wallet. Non-custodial, cross-platform, with QR payments and DeFi integration." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AURAS Wallet - Solana Crypto Wallet" />
        <meta name="twitter:description" content="The most secure and fastest Solana wallet for SOL, USDT, and SPL tokens." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Hero Background Gradient Image */}
      <GradientBackgroundImage
        src={HeroGradientBackground}
        className="opacity-80"
      />

      <AppLayout>
        {/* Hero Section */}
        <Section>
          <Hero {...WalletHeroContent} />
        </Section>

        {/* Feature Grid Section */}
        <Section background="lighter" id="features">
          <FeatureGrid {...WalletFeatureGridContent} />
          <GradientBackground position="bottom-left" />
          <GradientBackground position="bottom-right" />
        </Section>

        {/* Download Section */}
        <DownloadSection />

        {/* FAQ Section */}
        <Section id="faq">
          <FAQ {...WalletFAQContent} />
        </Section>

        {/* Call to Action Block Section */}
        <Section background="lighter">
          <CallToActionBlock 
            title="Ready to Experience the Future of Crypto?"
            description="Join thousands of users who trust AURAS Wallet for their Solana transactions. Secure, fast, and completely non-custodial."
            buttons={[
              { title: "Download Now", href: "#download", type: "primary" as const },
              { title: "Learn More", href: "#features", type: "secondary" as const },
            ]}
          />
        </Section>
      </AppLayout>
    </>
  );
} 