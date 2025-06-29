import { HeroType } from "@/common/modules/Hero";

import ImageDashboard from "@/assets/images/Hero.Dashboard.png";

// Use relative URLs so they work on any port

export default {
  notfication: {
    tag: "Revolutionary",
    text: "🔷 AURAS Pay: The First True Non-Custodial Payment Gateway on Solana!",
    button: "Join the Revolution",
    href: "/register",
  },
  title: "Accept Crypto Payments Like Never Before",
  description:
    "The world's first decentralized payment gateway that keeps YOU in control. Create payment links in seconds, get paid directly to YOUR wallet, and scale your business with lightning-fast Solana transactions. Zero middlemen. Zero custody risks. Pure peer-to-peer commerce.",
  buttons: [
    { title: "Start Accepting Payments", href: "/register", type: "primary" },
    { title: "See How It Works", href: "/#features", type: "secondary" },
  ],
  image: {
    src: ImageDashboard,
    width: 1000,
  },
} as HeroType;
