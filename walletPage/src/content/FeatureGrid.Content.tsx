import { FeatureGridType } from "@/common/modules/FeatureGrid";
import { IconShield, IconBolt, IconDeviceMobile, IconQrcode, IconCoin, IconCreditCard } from "@tabler/icons";

export default {
  kicker: "Why Choose AURAS",
  title: "Next-Generation Crypto Wallet Built for Solana Power Users",
  description:
    "Experience lightning-fast transactions, bank-level security, and complete control over your digital assets. Built by crypto experts for the future of DeFi.",
  features: [
    {
      title: "Military-Grade Security",
      description:
        "Your private keys, your control. Advanced encryption, biometric authentication, and hardware wallet integration for ultimate protection.",
      icon: <IconShield />,
    },
    {
      title: "Lightning-Fast Transactions",
      description:
        "Experience Solana's 65,000 TPS with sub-second transaction confirmation. Pay, send, and swap at the speed of thought.",
      icon: <IconBolt />,
    },
    {
      title: "Cross-Platform Access",
      description:
        "Native mobile apps for iOS & Android, plus seamless web access. Your crypto, everywhere you go.",
      icon: <IconDeviceMobile />,
    },
    {
      title: "QR Code Payments",
      description:
        "Scan and pay instantly. Perfect for merchants, friends, and everyday transactions. The future of payments is here.",
      icon: <IconQrcode />,
    },
    {
      title: "DeFi Integration",
      description:
        "Stake SOL, swap tokens, access yield farming, and interact with 1000+ Solana dApps directly from your wallet.",
      icon: <IconCoin />,
    },
    {
      title: "Bill Payment Hub",
      description:
        "Pay utilities, subscriptions, and bills with crypto through our licensed partner network. Bridge crypto to real-world payments.",
      icon: <IconCreditCard />,
    },
  ],
} as FeatureGridType;
