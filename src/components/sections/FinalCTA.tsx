"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Button from "../ui/Button";
import { ArrowRight, Check } from "lucide-react";

const benefits = [
  "Crypto-first checkout",
  "No technical setup required",
  "Useful for UAE operators and expats",
  "WhatsApp-friendly workflows",
  "Plug-and-play launch path",
  "Start with one agent and grow",
];

export default function FinalCTA() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00E5FF]/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-5xl font-bold font-[family-name:var(--font-orbitron)] mb-6">
            <span className="text-white">Choose The Agent That </span>
            <span className="text-[#00E5FF] text-glow">Fits Your Life</span>
          </h2>
          
          <p className="text-lg text-[#A0AEC0] mb-8 max-w-2xl mx-auto">
            VoltexBazar should feel simple enough for a first-time buyer and strong enough for a serious operator. Start with one useful agent and launch from there.
          </p>

          {/* Benefits */}
          <div className="grid sm:grid-cols-2 gap-3 mb-10 max-w-xl mx-auto text-left">
            {benefits.map((benefit) => (
              <div key={benefit} className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-[#00FFC6]/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-[#00FFC6]" />
                </div>
                <span className="text-sm text-[#A0AEC0]">{benefit}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/marketplace">
              <Button size="lg" className="group w-full sm:w-auto">
                Browse Agents
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/auth">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                Create Account
              </Button>
            </Link>
          </div>

          <p className="mt-6 text-sm text-[#718096]">
            Crypto-first activation • simple launch flow • no technical onboarding
          </p>
        </motion.div>
      </div>
    </section>
  );
}
