"use client";

import { motion } from "framer-motion";
import { CheckCircle, Rocket, MessageCircle, DollarSign } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Rocket,
    title: "Pick The Job",
    description: "Choose an agent based on what you want done: more leads, more replies, faster follow-up, less admin.",
  },
  {
    number: "02",
    icon: CheckCircle,
    title: "Pay With Crypto",
    description: "Receive a simple payment address and pay on the supported chain without payment setup confusion.",
  },
  {
    number: "03",
    icon: MessageCircle,
    title: "Launch Fast",
    description: "Your agent moves into a managed deployment flow instead of asking you for technical configuration.",
  },
  {
    number: "04",
    icon: DollarSign,
    title: "Run Your Business Better",
    description: "Use AI help for sales, support, booking, and daily operations across your channels.",
  },
];

export default function HowItWorks() {
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
            <span className="text-white">How It </span>
            <span className="text-[#00E5FF]">Works</span>
          </h2>
          <p className="text-[#A0AEC0] max-w-2xl mx-auto">
            Made to feel simple even if you have never deployed software before.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-[#00E5FF] to-transparent opacity-30" />
              )}
              
              <div className="bg-[#101826] border border-white/5 rounded-2xl p-6 h-full">
                {/* Number */}
                <div className="text-6xl font-bold font-[family-name:var(--font-orbitron)] text-[#00E5FF]/20 mb-4">
                  {step.number}
                </div>
                
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-[#00E5FF]/20 flex items-center justify-center mb-4">
                  <step.icon className="w-6 h-6 text-[#00E5FF]" />
                </div>
                
                <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-[#718096]">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="text-[#A0AEC0] mb-4">Start with one useful agent and grow from there.</p>
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-[#00FFC6]/20 text-[#00FFC6] rounded-full">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Crypto-first checkout for fast activation</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
