import { FeatureContentType } from "@/common/modules/FeatureContent";
import SecurityVaultImage from "@/assets/images/security-vault..png";

export default {
  position: "left",
  kicker: "True Non-Custodial",
  title: "Your Customers Pay You Directly",
  description:
    "AURAS Pay revolutionizes merchant payments by removing ALL middlemen. Your customers send crypto directly to YOUR wallet - we never touch your funds. Zero custody risk, zero frozen accounts, zero payment processor interference. You own your money, always.",
  buttons: [
    { title: "See How It Works", href: "#demo", type: "secondary" },
  ],
  features: [
    {
      title: "Direct Wallet Payments",
      description: "Payments flow directly from customer to your wallet. No intermediary accounts or custody risks.",
    },
    {
      title: "Zero Payment Holds",
      description: "Your money arrives instantly. No waiting periods, no account reviews, no frozen funds.",
    },
    {
      title: "Complete Ownership",
      description: "You control your wallet, your keys, your funds. True financial sovereignty for merchants.",
    },
    {
      title: "Instant Settlement",
      description: "Solana's sub-second confirmations mean immediate payment finality. No settlement delays.",
    },
  ],
  image: {
    src: SecurityVaultImage,
    alt: "AURAS Pay Non-Custodial Security",
    width: 500,
    height: 400,
    border: false,
  },
} as FeatureContentType;
