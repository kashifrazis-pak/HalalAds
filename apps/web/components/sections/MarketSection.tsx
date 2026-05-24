"use client";

import { motion } from "framer-motion";

const markets = [
  { country: "Indonesia", flag: "🇮🇩", population: "237M Muslims", growth: "+18% YoY ad spend" },
  { country: "Malaysia", flag: "🇲🇾", population: "20M Muslims", growth: "+22% YoY ad spend" },
  { country: "Pakistan", flag: "🇵🇰", population: "212M Muslims", growth: "+31% YoY ad spend" },
  { country: "United Kingdom", flag: "🇬🇧", population: "3.9M Muslims", growth: "High purchasing power" },
  { country: "United States", flag: "🇺🇸", population: "3.5M Muslims", growth: "$98B buying power" },
  { country: "Saudi Arabia", flag: "🇸🇦", population: "33M Muslims", growth: "Expanding soon" },
];

const categories = [
  "Islamic Finance", "Halal Food & Beverage", "Modest Fashion",
  "Islamic Education", "Muslim Travel", "Halal Cosmetics",
  "Real Estate", "Healthcare", "Tech & Apps",
];

export default function MarketSection() {
  return (
    <section className="py-24 bg-brand-charcoal text-white overflow-hidden">
      <div className="container-brand">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="badge-gold mb-6">The Opportunity</span>
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-white mt-4 mb-6">
              The world&apos;s most{" "}
              <span className="gradient-text">underserved</span>{" "}
              advertising market
            </h2>
            <p className="text-white/70 text-lg leading-relaxed mb-8">
              The global halal economy is valued at <strong className="text-white">$2.6 trillion</strong> and
              growing at 5.3% annually. Yet Muslim consumers remain chronically
              underserved by existing ad networks that don&apos;t understand cultural
              nuance, language, or Shariah compliance.
            </p>
            <p className="text-white/70 leading-relaxed mb-10">
              HalalAds is purpose-built to bridge this gap — with native understanding
              of Islamic values, multilingual support, and a publisher network rooted
              in halal content.
            </p>

            {/* Category pills */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <span
                  key={cat}
                  className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/70 text-xs font-medium hover:bg-brand-gold/10 hover:border-brand-gold/30 hover:text-brand-gold transition-colors cursor-default"
                >
                  {cat}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Right: market cards */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 gap-4"
          >
            {markets.map((market, i) => (
              <motion.div
                key={market.country}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 hover:border-brand-gold/30 transition-all group"
              >
                <div className="text-3xl mb-3">{market.flag}</div>
                <div className="font-display font-bold text-white text-lg mb-1">
                  {market.country}
                </div>
                <div className="text-white/60 text-xs mb-2">{market.population}</div>
                <div className="text-brand-gold text-xs font-semibold">{market.growth}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
