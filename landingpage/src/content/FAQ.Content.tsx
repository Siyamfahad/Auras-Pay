import { FAQType } from "@/common/modules/FAQ";

export default {
  kicker: "Frequently Asked Questions",
  title: "Everything You Need to Know About AURAS Pay",
  description:
    "Get answers to common questions about fees, security, and getting started with crypto payments.",
  faqs: [
    {
      question: "How does AURAS Pay work?",
      answer:
        "AURAS Pay is a non-custodial payment gateway. You create payment links, customers pay with Solana, and funds go directly to your wallet. We never hold your money, ensuring complete security and control.",
    },
    {
      question: "What are the fees?",
      answer:
        "No monthly fees! You purchase credits: 100 credits for $10, 500 for $40, or 1000 for $70. Each credit creates one payment link. You only pay for what you use.",
    },
    {
      question: "How fast are payments processed?",
      answer:
        "Payments are processed instantly on the Solana blockchain, typically confirming in under 0.5 seconds. Much faster than traditional payment processors that take days to settle.",
    },
    {
      question: "Do I need a Solana wallet?",
      answer:
        "Yes, you'll need a Solana wallet address to receive payments. You can set this up during registration or later in your dashboard. We recommend using hardware wallets for maximum security.",
    },
    {
      question: "Can I integrate AURAS Pay into my website?",
      answer:
        "Absolutely! We provide a comprehensive API for seamless integration into e-commerce platforms, custom applications, and existing systems. Full documentation is available in your dashboard.",
    },
    {
      question: "What cryptocurrencies are supported?",
      answer:
        "Currently, we support SOL, USDT, USDC, and all SPL tokens on the Solana blockchain. We're continuously expanding support as the ecosystem grows.",
    },
  ],
} as FAQType;
