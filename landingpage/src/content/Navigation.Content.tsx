import { NavigationMenuType } from "@/common/modules/NavigationMenu";

// Use relative URLs so they work on any port
const useRelativeUrls = true;

export default {
  name: "🔷 AURAS Pay",
  links: [
    { title: "Why Non-Custodial", href: "/#features" },
    { title: "Merchant Success", href: "/#testimonials" },
    { title: "API Integration", href: "/#about" },
    { title: "Pricing", href: "/#faq" },
  ],
  buttons: [
    { title: "Auras Wallet", href: process.env.NEXT_PUBLIC_WALLET_URL || "http://localhost:3000", type: "secondary" },
    { title: "Merchant Login", href: "/login", type: "secondary" },
    { title: "Start Earning", href: "/register", type: "primary" },
  ],
} as NavigationMenuType;
