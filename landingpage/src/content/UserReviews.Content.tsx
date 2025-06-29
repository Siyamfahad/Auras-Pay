import { UserReviewSectionType } from "@/common/modules/UserReviews";

export default {
  kicker: "What Our Users Say",
  title: "Trusted by Crypto Enthusiasts Worldwide",
  buttons: [
    { title: "Download Wallet", href: "#download", type: "primary" },
    { title: "Join Community", href: "#community", type: "secondary" },
  ],
  userReviews: [
    {
      stars: 5,
      quote:
        "AURAS completely changed how I interact with Solana. The speed is incredible - I can execute arbitrage trades in milliseconds. The security features give me peace of mind with my portfolio.",
      image: {
        src: "https://images.unsplash.com/photo-1494790108755-2616b612b820?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
      },
      name: "Sarah Chen",
      role: "DeFi Trader",
    },
    {
      stars: 5,
      quote:
        "Finally, a wallet that gets Solana right. The QR payment feature is a game-changer for IRL transactions. I've recommended AURAS to my entire crypto community.",
      image: {
        src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      },
      name: "Marcus Rodriguez",
      role: "NFT Collector",
    },
    {
      stars: 5,
      quote:
        "As a developer, I appreciate AURAS's clean API integration and seamless dApp connectivity. It's the most polished Solana wallet I've used.",
      image: {
        src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      },
      name: "Jennifer Kim",
      role: "Blockchain Developer",
    },
  ],
} as UserReviewSectionType;
