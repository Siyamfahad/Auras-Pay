import { FeatureContentType } from "@/common/modules/FeatureContent";
import SecurityVaultImage from "@/assets/images/security-vault..png";

export default {
  position: "left",
  kicker: "Unbreakable Security",
  title: "Your Crypto, Your Keys, Your Control",
  description:
    "AURAS Wallet puts you in complete control of your digital assets. With military-grade encryption, advanced biometric authentication, and hardware wallet integration, your SOL, USDT, and SPL tokens are safer than traditional banks. Zero custody, zero compromise.",
  buttons: [
    { title: "Learn About Security", href: "#security", type: "secondary" },
  ],
  features: [
    {
      title: "Non-Custodial Architecture",
      description: "Your private keys never leave your device. Complete sovereignty over your crypto assets.",
    },
    {
      title: "Biometric Protection",
      description: "Face ID, Touch ID, and PIN protection. Multiple layers of authentication for ultimate security.",
    },
    {
      title: "Hardware Integration",
      description: "Seamless integration with Ledger and Trezor hardware wallets for cold storage security.",
    },
    {
      title: "Advanced Encryption",
      description: "Military-grade AES-256 encryption protects your seed phrases and transaction data.",
    },
  ],
  image: {
    src: SecurityVaultImage,
    alt: "AURAS Wallet Security Features",
    width: 500,
    height: 400,
    border: false,
  },
} as FeatureContentType;
