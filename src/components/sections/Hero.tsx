"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Button from "../ui/Button";
import { ArrowRight, Zap, Shield, Globe } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00E5FF]/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#7B61FF]/20 rounded-full blur-[120px]" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0A0F1C] border border-white/10 mb-6">
              <span className="w-2 h-2 rounded-full bg-[#00FFC6] animate-pulse" />
              <span className="text-sm text-[#A0AEC0]">Built for UAE businesses, expats, and busy operators</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-[family-name:var(--font-orbitron)] leading-tight mb-6">
              <span className="text-white">AI Help For</span>
              <br />
              <span className="text-[#00E5FF] text-glow">Real Life In The UAE</span>
            </h1>

            <p className="text-lg text-[#A0AEC0] mb-8 max-w-lg">
              VoltexBazar gives small business owners, expats, creators, and service teams ready-made AI agents for sales, support, follow-up, and daily operations without technical setup.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link href="/marketplace">
                <Button size="lg" className="group w-full sm:w-auto">
                  Find My Agent
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/auth">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  Create Account
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-8">
              <div>
                <div className="text-3xl font-bold text-white font-[family-name:var(--font-orbitron)]">500+</div>
                <div className="text-sm text-[#718096]">Ready Agents</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white font-[family-name:var(--font-orbitron)]">$2M+</div>
                <div className="text-sm text-[#718096]">Pipeline Managed</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white font-[family-name:var(--font-orbitron)]">99.9%</div>
                <div className="text-sm text-[#718096]">Service Availability</div>
              </div>
            </div>
          </motion.div>

          {/* Right Content - Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Main Visual Card */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#00E5FF]/30 to-[#7B61FF]/30 rounded-3xl blur-3xl" />
              <div className="relative bg-[#0A0F1C] border border-white/10 rounded-3xl p-8 overflow-hidden">
                {/* Robot/AI Visual */}
                <div className="flex items-center justify-center mb-8">
                  <div className="relative">
                    <div className="w-48 h-48 rounded-full bg-gradient-to-br from-[#00E5FF] to-[#7B61FF] flex items-center justify-center">
                      <div className="w-40 h-40 rounded-full bg-[#05070D] flex items-center justify-center">
                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#00E5FF]/20 to-[#7B61FF]/20 flex items-center justify-center">
                          <div className="text-6xl">🤖</div>
                        </div>
                      </div>
                    </div>
                    {/* Glow Ring */}
                    <div className="absolute inset-0 rounded-full border-2 border-[#00E5FF]/50 animate-pulse" style={{ animationDuration: '2s' }} />
                  </div>
                </div>

                {/* Status Cards */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-[#101826] rounded-xl p-4 text-center">
                    <Zap className="w-6 h-6 text-[#00FFC6] mx-auto mb-2" />
                    <div className="text-lg font-semibold text-white">Simple</div>
                    <div className="text-xs text-[#718096]">No technical setup</div>
                  </div>
                  <div className="bg-[#101826] rounded-xl p-4 text-center">
                    <Shield className="w-6 h-6 text-[#00E5FF] mx-auto mb-2" />
                    <div className="text-lg font-semibold text-white">Reliable</div>
                    <div className="text-xs text-[#718096]">Managed deployment</div>
                  </div>
                  <div className="bg-[#101826] rounded-xl p-4 text-center">
                    <Globe className="w-6 h-6 text-[#7B61FF] mx-auto mb-2" />
                    <div className="text-lg font-semibold text-white">Local</div>
                    <div className="text-xs text-[#718096]">UAE-ready workflows</div>
                  </div>
                </div>

                {/* Floating Elements */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute top-4 right-4 bg-[#0A0F1C] border border-white/10 rounded-lg px-3 py-2"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#00FFC6]" />
                    <span className="text-xs text-[#A0AEC0]">Lead follow-up active</span>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                  className="absolute bottom-20 left-4 bg-[#0A0F1C] border border-white/10 rounded-lg px-3 py-2"
                >
                  <div className="text-xs text-[#A0AEC0]">Customer replied ✓</div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
