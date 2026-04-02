"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Users, MessageCircle, BriefcaseBusiness, Workflow, Zap, Shield } from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Get More Customers",
    description: "Launch agents that follow up with leads, reply fast, and keep your pipeline moving.",
    color: "#00E5FF",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp First",
    description: "Perfect for UAE buyers and expats who already run business through chat.",
    color: "#00FFC6",
  },
  {
    icon: BriefcaseBusiness,
    title: "Built For Busy Owners",
    description: "Made for small businesses, service teams, solo founders, and operators without technical staff.",
    color: "#FF7A00",
  },
  {
    icon: Workflow,
    title: "Plug And Play",
    description: "Choose an outcome, pay with crypto, and launch without touching server settings.",
    color: "#7B61FF",
  },
];

export default function Features() {
  return (
    <section className="py-20 bg-[#0A0F1C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold font-[family-name:var(--font-orbitron)] mb-4">
            <span className="text-white">Why </span>
            <span className="text-[#00E5FF]">VoltexBazar</span>
          </h2>
          <p className="text-[#A0AEC0] max-w-2xl mx-auto">
            A simpler way to use AI agents for everyday business work in the UAE without technical onboarding.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group bg-[#101826] border border-white/5 rounded-2xl p-6 hover:border-white/20 transition-all hover:scale-105"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{ 
                  backgroundColor: `${feature.color}20`,
                  boxShadow: `0 0 20px ${feature.color}30`
                }}
              >
                <feature.icon className="w-6 h-6" style={{ color: feature.color }} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-[#718096]">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Additional Benefits */}
        <div className="mt-16 grid sm:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-start gap-4 bg-[#101826] border border-white/5 rounded-2xl p-6"
          >
            <div className="w-12 h-12 rounded-xl bg-[#00E5FF]/20 flex items-center justify-center flex-shrink-0">
              <Zap className="w-6 h-6 text-[#00E5FF]" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Instant Deployment</h3>
              <p className="text-sm text-[#718096]">Open an agent, understand it fast, and move straight into payment and launch.</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-start gap-4 bg-[#101826] border border-white/5 rounded-2xl p-6"
          >
            <div className="w-12 h-12 rounded-xl bg-[#7B61FF]/20 flex items-center justify-center flex-shrink-0">
              <Shield className="w-6 h-6 text-[#7B61FF]" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Enterprise Security</h3>
              <p className="text-sm text-[#718096]">Managed deployment flow, isolated services, and a cleaner path from signup to activation.</p>
            </div>
          </motion.div>
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-2 rounded-xl bg-[#00E5FF] px-6 py-3 text-sm font-semibold text-[#05070D] transition-colors hover:bg-[#00FFC6]"
          >
            Explore Plug-And-Play Agents
          </Link>
        </div>
      </div>
    </section>
  );
}
