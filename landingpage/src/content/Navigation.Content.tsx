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
    { title: "Auras Wallet", href: "/wallet", type: "secondary" },
    { title: "Merchant Login", href: "/login", type: "secondary" },
    { title: "Start Earning", href: "/register", type: "primary" },
  ],
} as NavigationMenuType;
