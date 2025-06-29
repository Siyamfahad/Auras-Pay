import { NavigationMenuType } from "@/common/modules/NavigationMenu";

export default {
  name: "AURAS",
  links: [
    { title: "Features", href: "/#features" },
    { title: "Security", href: "/#security" },
    { title: "About", href: "/#about" },
    { title: "FAQ", href: "/#faq" },
    { title: "Support", href: "/support" },
  ],
  buttons: [
    { title: "Download Wallet", href: "#download", type: "primary" },
  ],
} as NavigationMenuType;
