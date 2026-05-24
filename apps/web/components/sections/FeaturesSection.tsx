"use client";

import { motion } from "framer-motion";
import {
  ShieldCheck,
  MapPin,
  BarChart2,
  Bot,
  Globe2,
  Banknote,
  Layers,
  Lock,
} from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Halal-Certified Inventory",
    description:
      "Every publisher on our network is manually verified for halal content. No alcohol, gambling, or adult content — ever.",
    color: "green",
  },
  {
    icon: MapPin,
    title: "Precision Geo-Targeting",
    description:
      "Target by country, city, or region. Reach Muslims in Indonesia, Malaysia, Pakistan, UK, US, and 50+ more countries.",
    color: "gold",
  },
  {
    icon: BarChart2,
    title: "Real-Time Analytics",
    description:
      "Live dashboards for impressions, clicks, CTR, conversions, and spend. Know exactly where your money is going.",
    color: "green",
  },
  {
    icon: Bot,
    title: "Fraud Protection",
    description:
      "Advanced bot detection and invalid traffic filtering. You only pay for real human engagement.",
    color: "gold",
  },
  {
    icon: Globe2,
    title: "Interest Targeting",
    description:
      "Reach audiences interested in Islamic finance, halal food, modest fashion, Islamic education, Muslim travel, and more.",
    color: "green",
  },
  {
    icon: Banknote,
    title: "Flexible Payment Options",
    description:
      "Support for bank transfers, PayPal, Wise, and more — critical for publishers across SEA and MENA markets.",
    color: "gold",
  },
  {
    icon: Layers,
    title: "Multi-Format Ads",
    description:
      "Display banners (728×90, 300×250, 160×600), mobile banners (320×50), native ads, and video pre-roll.",
    color: "green",
  },
  {
    icon: Lock,
    title: "Brand Safety",
    description:
      "Blocklist competitors, sensitive topics, or specific publishers. Full transparency and control over every placement.",
    color: "gold",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-24 bg-white">
      <div className="container-brand">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="badge-gold mb-4">Platform Features</span>
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-brand-charcoal mt-4 mb-4">
            Built for the{" "}
            <span className="gradient-text">Muslim market</span>
          </h2>
          <p className="text-brand-muted">
            Every feature is designed with the needs of Muslim advertisers and
            publishers in mind — from Shariah compliance to multilingual support.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: (i % 4) * 0.1 }}
              className="card-brand p-6 group"
            >
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-colors ${
                  feature.color === "green"
                    ? "bg-brand-green/10 group-hover:bg-brand-green/20"
                    : "bg-brand-gold/10 group-hover:bg-brand-gold/20"
                }`}
              >
                <feature.icon
                  size={20}
                  className={
                    feature.color === "green"
                      ? "text-brand-green"
                      : "text-brand-gold-dark"
                  }
                />
              </div>
              <h3 className="font-display font-bold text-brand-charcoal mb-2 text-lg">
                {feature.title}
              </h3>
              <p className="text-brand-muted text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
