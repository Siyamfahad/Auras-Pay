import { FeatureContentType } from "@/common/modules/FeatureContent";
import SpeedDashboardImage from "@/assets/images/speed-dashboard.png";

export default {
  position: "right",
  kicker: "Lightning Speed",
  title: "Transaction at the Speed of Thought",
  description:
    "Experience the full power of Solana's 65,000 TPS directly in your pocket. Send SOL to friends in milliseconds, swap tokens instantly, and enjoy near-zero fees. AURAS Wallet is built for the speed of modern finance.",
  buttons: [
    { title: "Try Demo", href: "#demo", type: "secondary" },
  ],
  features: [
    {
      title: "Sub-Second Confirmation",
      description: "Your transactions confirm faster than you can blink. Solana's speed, perfected.",
    },
    {
      title: "Near-Zero Fees",
      description: "Pay fractions of pennies per transaction. Keep more of your money where it belongs.",
    },
    {
      title: "Instant Token Swaps",
      description: "Built-in DEX integration for lightning-fast swaps between SOL, USDT, and any SPL token.",
    },
    {
      title: "Batch Transactions",
      description: "Send to multiple recipients in a single transaction. Save time and fees.",
    },
  ],
  image: {
    src: SpeedDashboardImage,
    alt: "AURAS Wallet Speed Features",
    width: 500,
    height: 400,
    border: false,
  },
} as FeatureContentType;
