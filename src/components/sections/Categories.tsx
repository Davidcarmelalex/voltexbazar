"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const categories = [
  {
    name: "Get More Leads",
    icon: "📣",
    count: 45,
    color: "#00E5FF",
    description: "For real estate, services, clinics, and sales teams that need more conversations.",
    href: "/marketplace?category=Marketing",
  },
  {
    name: "Reply To Customers Faster",
    icon: "💬",
    count: 32,
    color: "#7B61FF",
    description: "Great for WhatsApp-heavy businesses that lose sales when replies are slow.",
    href: "/marketplace?category=Sales",
  },
  {
    name: "Run Daily Operations",
    icon: "🛠️",
    count: 28,
    color: "#FF7A00",
    description: "Handle repetitive admin, follow-ups, and internal tasks without extra hires.",
    href: "/marketplace?category=Productivity",
  },
  {
    name: "Sell On Chat",
    icon: "🛒",
    count: 21,
    color: "#00FFC6",
    description: "Turn incoming chat from WhatsApp into guided offers, answers, and conversions.",
    href: "/marketplace?category=Ecommerce",
  },
  {
    name: "Create Content Faster",
    icon: "✍️",
    count: 38,
    color: "#FF6B9D",
    description: "For creators, consultants, and founders who need social posts and campaign content.",
    href: "/marketplace?category=Content",
  },
  {
    name: "Support Customers 24/7",
    icon: "🎧",
    count: 24,
    color: "#4ECDC4",
    description: "Keep customer questions handled even when your team is offline or overloaded.",
    href: "/marketplace?category=Support",
  },
];

export default function Categories() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold font-[family-name:var(--font-orbitron)] mb-4">
            <span className="text-white">Browse by </span>
            <span className="text-[#00E5FF]">Business Outcome</span>
          </h2>
          <p className="text-[#A0AEC0] max-w-2xl mx-auto">
            Start from the problem you want solved instead of technical labels.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={category.href}
                className="group block rounded-2xl border border-white/10 bg-[#0A0F1C] p-6 transition-all hover:border-white/30"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-xl text-2xl"
                    style={{ 
                      backgroundColor: `${category.color}20`,
                      boxShadow: `0 0 20px ${category.color}20`
                    }}
                  >
                    {category.icon}
                  </div>
                  <span className="text-sm text-[#718096]">{category.count} agents</span>
                </div>
              
                <h3 className="mb-2 text-xl font-semibold text-white transition-colors group-hover:text-[#00E5FF]">
                  {category.name}
                </h3>
                <p className="mb-4 text-sm text-[#718096]">{category.description}</p>
              
                <div className="flex items-center text-[#00E5FF] text-sm font-medium group-hover:gap-2 transition-all">
                  Explore
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
