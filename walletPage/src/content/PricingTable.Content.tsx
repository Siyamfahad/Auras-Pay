import { PageHeaderType } from "@/common/modules/PageHeader";
import { PricingTableType } from "@/common/modules/PricingTable";

export const PricingPageHeaderContent: PageHeaderType = {
  title: "Simple, transparent pricing",
  description:
    "Read about the technology, design, history, and business behind NextSiders. If you want to get notified about new posts, subscribe below!",
};

export const PricingTableContent: PricingTableType = {
  plans: [
    {
      name: "Basic Plan",
      description: "Great for small businesses launching their product.",
      price: "$99",
      interval: "one-time payment",
      includeLocalTaxesInformation: true,
      featured: false,
      buttton: {
        type: "primary",
        title: "Try for free",
        href: "#",
      },
      features: [
        "Create up to 3 Projects",
        "500 Landing Pages",
        "Access to Basic Templates",
      ],
    },
    {
      name: "Premium Plan",
      description:
        "Great for growing teams that need more features for their business.",
      price: "$199",
      interval: "one-time payment",
      includeLocalTaxesInformation: true,
      featured: true,
      buttton: {
        type: "primary",
        title: "Try for free",
        href: "#",
      },
      features: [
        "Create Unlimited Projects",
        "Unlimited Landing Pages",
        "Access to Basic & Pro Templates",
      ],
    },
    {
      name: "Enterprise Plan",
      description:
        "Great for enterprise businesses that need to scale really big.",
      featured: false,
      buttton: {
        type: "primary",
        title: "Get In Touch",
        href: "#",
      },
      features: [
        "Create Unlimited Projects",
        "Unlimited Landing Pages",
        "Access to Basic & Pro Templates",
        "Template inspiration gallery",
        "Customized Template to your needs",
      ],
    },
  ],
};
