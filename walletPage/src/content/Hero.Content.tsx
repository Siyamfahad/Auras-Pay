import { HeroType } from "@/common/modules/Hero";

import ImageDashboard from "@/assets/images/Hero.Dashboard.png";

export default {
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
    { title: "Download Wallet", href: "#download", type: "primary" },
    { title: "Explore Features", href: "/#features", type: "secondary" },
  ],
  image: {
    src: ImageDashboard,
    width: 1000,
  },
} as HeroType;
