import { FeatureContentType } from "@/common/modules/FeatureContent";
import SpeedDashboardImage from "@/assets/images/speed-dashboard.png";

export default {
  position: "right",
  kicker: "Powerful Integration",
  title: "Built for Developers, Loved by Merchants",
  description:
    "Integrate AURAS Pay into any system with our comprehensive RESTful API. Create payment links, track transactions, manage invoices, and automate everything. From simple e-commerce stores to complex enterprise systems - we've got you covered.",
  buttons: [
    { title: "View API Docs", href: "#api", type: "secondary" },
  ],
  features: [
    {
      title: "RESTful API",
      description: "Clean, well-documented API for seamless integration with any platform or custom application.",
    },
    {
      title: "Real-time Webhooks",
      description: "Get instant notifications for payments, confirmations, and transaction status changes.",
    },
    {
      title: "Payment Links & QR Codes",
      description: "Generate payment links and QR codes programmatically or from your merchant dashboard.",
    },
    {
      title: "Advanced Analytics",
      description: "Track revenue, monitor payment flows, and analyze customer behavior with detailed reporting.",
    },
  ],
  image: {
    src: SpeedDashboardImage,
    alt: "AURAS Pay Developer Dashboard",
    width: 500,
    height: 400,
    border: false,
  },
} as FeatureContentType;
