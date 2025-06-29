import { PageHeaderType } from "@/common/modules/PageHeader";
import { PricingTableType } from "@/common/modules/PricingTable";

export const PricingPageHeaderContent: PageHeaderType = {
  title: "Simple, transparent pricing",
  description:
    "Read about the technology, design, history, and business behind NextSiders. If you want to get notified about new posts, subscribe below!",
};

export default {
  title: "Simple, Transparent Pricing",
  description:
    "Prepaid transaction credits. No monthly fees, no hidden costs, no surprises. Pay only for what you use.",
  plans: [
    {
      name: "Starter Pack",
      description: "Perfect for small businesses and freelancers getting started with crypto payments",
      price: "$25",
      interval: "100 Transactions",
      features: [
        "100 Payment Transactions",
        "Payment Links & QR Codes",
        "Basic Dashboard Analytics",
        "Email Support",
        "No Expiration on Credits",
      ],
      buttton: {
        title: "Get Started",
        href: "/register",
        type: "secondary",
      },
    },
    {
      name: "Business Pack",
      description: "Ideal for growing businesses with regular payment volume",
      price: "$95",
      interval: "500 Transactions",
      featured: true,
      features: [
        "500 Payment Transactions",
        "Advanced Dashboard & Analytics",
        "API Access & Integration",
        "Custom Payment Pages",
        "Priority Support",
        "No Expiration on Credits",
        "Bulk Transaction Reports",
      ],
      buttton: {
        title: "Scale Your Business",
        href: "/register",
        type: "primary",
      },
    },
    {
      name: "Enterprise Pack",
      description: "For high-volume merchants and enterprise applications",
      price: "$395",
      interval: "2500 Transactions",
      features: [
        "2500 Payment Transactions",
        "Full API Access & Webhooks",
        "White-label Payment Pages",
        "Custom Integration Support",
        "Dedicated Account Manager",
        "No Expiration on Credits",
        "Advanced Fraud Protection",
        "Custom Reporting & Analytics",
      ],
      buttton: {
        title: "Go Enterprise",
        href: "/register",
        type: "secondary",
      },
    },
  ],
  note: "🔷 Additional transaction packs available anytime. All prices exclude Solana network fees (~$0.00025 per transaction).",
} as PricingTableType;

export const PricingTableContent = {
  title: "Simple, Transparent Pricing",
  description:
    "Prepaid transaction credits. No monthly fees, no hidden costs, no surprises. Pay only for what you use.",
  plans: [
    {
      name: "Starter Pack",
      description: "Perfect for small businesses and freelancers getting started with crypto payments",
      price: "$25",
      interval: "100 Transactions",
      features: [
        "100 Payment Transactions",
        "Payment Links & QR Codes",
        "Basic Dashboard Analytics",
        "Email Support",
        "No Expiration on Credits",
      ],
      buttton: {
        title: "Get Started",
        href: "/register",
        type: "secondary",
      },
    },
    {
      name: "Business Pack",
      description: "Ideal for growing businesses with regular payment volume",
      price: "$95",
      interval: "500 Transactions",
      featured: true,
      features: [
        "500 Payment Transactions",
        "Advanced Dashboard & Analytics",
        "API Access & Integration",
        "Custom Payment Pages",
        "Priority Support",
        "No Expiration on Credits",
        "Bulk Transaction Reports",
      ],
      buttton: {
        title: "Scale Your Business",
        href: "/register",
        type: "primary",
      },
    },
    {
      name: "Enterprise Pack",
      description: "For high-volume merchants and enterprise applications",
      price: "$395",
      interval: "2500 Transactions",
      features: [
        "2500 Payment Transactions",
        "Full API Access & Webhooks",
        "White-label Payment Pages",
        "Custom Integration Support",
        "Dedicated Account Manager",
        "No Expiration on Credits",
        "Advanced Fraud Protection",
        "Custom Reporting & Analytics",
      ],
      buttton: {
        title: "Go Enterprise",
        href: "/register",
        type: "secondary",
      },
    },
  ],
} as PricingTableType;
