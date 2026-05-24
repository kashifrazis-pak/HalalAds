"use client";

import { motion } from "framer-motion";
import { BarChart3, Target, Zap, Globe, DollarSign, Code2 } from "lucide-react";

const advertiserSteps = [
  {
    icon: Target,
    step: "01",
    title: "Create your campaign",
    description:
      "Set your targeting — countries, languages, and interest categories like Islamic finance, halal food, or modest fashion.",
  },
  {
    icon: Zap,
    step: "02",
    title: "Launch in minutes",
    description:
      "Upload your creatives, set your budget, and go live. Your ads start reaching Muslim audiences immediately.",
  },
  {
    icon: BarChart3,
    step: "03",
    title: "Optimise & scale",
    description:
      "Real-time analytics show impressions, clicks, and conversions. Scale what works across our entire network.",
  },
];

const publisherSteps = [
  {
    icon: Globe,
    step: "01",
    title: "Register your site",
    description:
      "Submit your website for Halal content verification. We review within 24 hours.",
  },
  {
    icon: Code2,
    step: "02",
    title: "Add one line of code",
    description:
      "Copy-paste our lightweight JavaScript snippet — works on any site or CMS including WordPress.",
  },
  {
    icon: DollarSign,
    step: "03",
    title: "Start earning",
    description:
      "Earn up to 70% revenue share. Get paid monthly via bank transfer, PayPal, or Wise.",
  },
];

function StepCard({
  icon: Icon,
  step,
  title,
  description,
  index,
}: {
  icon: React.ElementType;
  step: string;
  title: string;
  description: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className="relative"
    >
      <div className="card-brand p-8 h-full">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-xl bg-brand-green/10 flex items-center justify-center">
              <Icon size={22} className="text-brand-green" />
            </div>
          </div>
          <div>
            <span className="text-xs font-bold text-brand-gold tracking-widest uppercase">
              Step {step}
            </span>
            <h3 className="font-display text-xl font-bold text-brand-charcoal mt-1 mb-3">
              {title}
            </h3>
            <p className="text-brand-muted text-sm leading-relaxed">{description}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function HowItWorks() {
  return (
    <section className="py-24 bg-brand-cream">
      <div className="container-brand">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="badge-green mb-4">How It Works</span>
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-brand-charcoal mt-4 mb-4">
            Simple to start.{" "}
            <span className="gradient-text-green">Powerful at scale.</span>
          </h2>
          <p className="text-brand-muted">
            Whether you&apos;re a global brand looking to reach Muslim consumers or a
            website owner wanting to monetize halal traffic — HalalAds makes it
            effortless.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Advertisers */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-green text-white text-sm font-semibold mb-8">
              For Advertisers
            </div>
            <div className="flex flex-col gap-4">
              {advertiserSteps.map((step, i) => (
                <StepCard key={step.step} {...step} index={i} />
              ))}
            </div>
          </div>

          {/* Publishers */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-gold text-brand-charcoal text-sm font-semibold mb-8">
              For Publishers
            </div>
            <div className="flex flex-col gap-4">
              {publisherSteps.map((step, i) => (
                <StepCard key={step.step} {...step} index={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
