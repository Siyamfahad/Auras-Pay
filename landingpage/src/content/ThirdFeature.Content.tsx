import { FeatureContentType } from "@/common/modules/FeatureContent";
import WalletFeaturesImage from "@/assets/images/wallet-features.png";

export default {
  position: "left",
  kicker: "Merchant Dashboard",
  title: "Complete Payment Management at Your Fingertips",
  description:
    "Your command center for crypto payments. Track every transaction, manage payment links, view real-time analytics, and control your entire payment operation from one powerful dashboard. Built for merchants who demand insight and control.",
  buttons: [
    { title: "Try Dashboard", href: "/register", type: "secondary" },
  ],
  features: [
    {
      title: "Transaction Monitoring",
      description: "Real-time tracking of all payments with detailed transaction history and status updates.",
    },
    {
      title: "Payment Link Manager",
      description: "Create, edit, and organize payment links with custom amounts, descriptions, and expiry dates.",
    },
    {
      title: "Revenue Analytics",
      description: "Comprehensive reporting with charts, graphs, and insights to optimize your payment strategy.",
    },
    {
      title: "Customer Management",
      description: "Track customer payment patterns, manage recurring customers, and analyze payment behavior.",
    },
  ],
  image: {
    src: WalletFeaturesImage,
    alt: "AURAS Pay Merchant Dashboard",
    width: 500,
    height: 400,
    border: false,
  },
} as FeatureContentType;
