import { FeatureContentType } from "@/common/modules/FeatureContent";
import WalletFeaturesImage from "@/assets/images/wallet-features.png";

export default {
  position: "left",
  kicker: "Core Features",
  title: "Everything You Need in a Crypto Wallet",
  description:
    "AURAS Wallet focuses on delivering the essential crypto wallet experience perfectly. Send, receive, and store your digital assets with confidence. We're building additional features and will expand our offerings as we grow.",
  buttons: [
    { title: "Get Started", href: "#download", type: "secondary" },
  ],
  features: [
    {
      title: "Secure Storage",
      description: "Keep your SOL, USDT, and SPL tokens safe with military-grade encryption and non-custodial architecture.",
    },
    {
      title: "QR Code Payments",
      description: "Scan to pay anywhere. Perfect for merchants, restaurants, and peer-to-peer transactions.",
    },
    {
      title: "Transaction History",
      description: "Track all your transactions with detailed history, timestamps, and easy-to-read summaries.",
    },
    {
      title: "Multi-Device Sync",
      description: "Access your wallet securely across mobile and web platforms with seamless synchronization.",
    },
  ],
  image: {
    src: WalletFeaturesImage,
    alt: "AURAS Wallet Core Features",
    width: 500,
    height: 400,
    border: false,
  },
} as FeatureContentType;
