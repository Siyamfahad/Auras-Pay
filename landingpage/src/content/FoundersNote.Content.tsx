import { FoundersNoteType } from "@/common/modules/FoundersNote";
import ImageFoundersNote from "@/assets/images/FoundersNote.User.png";

export default {
  kicker: "From Our Founders",
  title: "Building the Bridge Between Crypto and Everyday Life",
  description: [
    "When we started AURAS, we had a simple vision: make crypto as easy to use as sending a text message. We saw the incredible potential of Solana's technology but noticed that existing wallets were either too complex for newcomers or too limited for power users.",
    "That's why we built AURAS - a wallet that doesn't compromise. Whether you're buying coffee with a QR code, executing complex DeFi strategies, or simply storing your digital assets, AURAS provides the security, speed, and simplicity you deserve.",
    "We believe the future of finance is decentralized, instant, and accessible to everyone. AURAS is our contribution to making that future a reality.",
  ],
  author: {
    name: "Alex Kumar & Sarah Lee",
    title: "Co-Founders, AURAS",
    image: "/images/founders.jpg",
  },
  button: {
    title: "Learn Our Story",
    href: "#story",
    type: "secondary",
  },
} as FoundersNoteType;
