import { FAQType } from "@/common/modules/FAQ";

export default {
  kicker: "Frequently Asked Questions",
  title: "Everything You Need to Know About AURAS Wallet",
  description:
    "Get answers to common questions about security, features, and getting started with AURAS.",
  faqs: [
    {
      question: "Is AURAS Wallet safe to use?",
      answer:
        "Absolutely. AURAS is a non-custodial wallet, meaning your private keys never leave your device. We use military-grade encryption, biometric authentication, and support hardware wallet integration for maximum security.",
    },
    {
      question: "What cryptocurrencies does AURAS support?",
      answer:
        "AURAS supports SOL, USDT, USDC, and all SPL tokens on the Solana blockchain. We're continuously adding support for new tokens as they launch on Solana.",
    },
    {
      question: "How fast are transactions with AURAS?",
      answer:
        "Transactions typically confirm in under 0.5 seconds thanks to Solana's high-performance blockchain. You'll experience near-instant payments and token swaps.",
    },
    {
      question: "Can I stake SOL directly in the wallet?",
      answer:
        "Yes! AURAS has built-in staking functionality. You can stake your SOL, choose validators, and track your rewards directly within the wallet interface.",
    },
    {
      question: "Does AURAS work on mobile devices?",
      answer:
        "AURAS is available on iOS and Android with full feature parity. You can also access your wallet through our secure web interface on any device.",
    },
    {
      question: "What are the fees for using AURAS?",
      answer:
        "AURAS itself is free to use. You only pay Solana network fees (typically fractions of a penny) for transactions. There are no hidden fees or subscription costs.",
    },
  ],
} as FAQType;
