"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Star, TrendingUp, Clock, ArrowRight } from "lucide-react";
import Button from "../ui/Button";

const agents = [
  {
    id: 1,
    name: "Client Hunter AI",
    description: "Finds & contacts leads daily across multiple platforms",
    price: 49,
    earnings: 3200,
    time: "2h/day",
    rating: 4.9,
    image: "🎯",
    category: "Marketing",
  },
  {
    id: 2,
    name: "WhatsApp Sales Pro",
    description: "Automates sales conversations and closes deals",
    price: 79,
    earnings: 4500,
    time: "0h/day",
    rating: 4.8,
    image: "💬",
    category: "Sales",
  },
  {
    id: 3,
    name: "Content Generator",
    description: "Creates blog posts, social media, and ads automatically",
    price: 39,
    earnings: 1800,
    time: "1h/day",
    rating: 4.7,
    image: "✍️",
    category: "Content",
  },
  {
    id: 4,
    name: "Data Analyst AI",
    description: "Processes data and generates insights 24/7",
    price: 99,
    earnings: 5200,
    time: "0h/day",
    rating: 4.9,
    image: "📊",
    category: "Analytics",
  },
  {
    id: 5,
    name: "Support Bot",
    description: "Handles customer queries around the clock",
    price: 59,
    earnings: 2800,
    time: "0h/day",
    rating: 4.8,
    image: "🎧",
    category: "Support",
  },
];

export default function FeaturedAgents() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12"
        >
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold font-[family-name:var(--font-orbitron)] mb-2">
              <span className="text-white">Popular </span>
              <span className="text-[#00E5FF]">Launches</span>
            </h2>
            <p className="text-[#A0AEC0]">The easiest agents to understand, buy, and launch right now.</p>
          </div>
          <Link href="/marketplace">
            <Button variant="secondary" size="sm">
              View All Agents
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {agents.map((agent, index) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group bg-[#0A0F1C] border border-white/10 rounded-2xl overflow-hidden hover:border-[#00E5FF] hover:shadow-[0_0_30px_rgba(0,229,255,0.3)] transition-all"
            >
              {/* Image Area */}
              <div className="h-32 bg-gradient-to-br from-[#101826] to-[#0A0F1C] flex items-center justify-center text-5xl relative">
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1C] to-transparent" />
                <span className="relative z-10">{agent.image}</span>
                <div className="absolute top-3 right-3">
                  <span className="px-2 py-1 text-xs font-medium bg-[#00FFC6]/20 text-[#00FFC6] rounded-full">
                    {agent.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-white font-semibold mb-1 group-hover:text-[#00E5FF] transition-colors">
                  {agent.name}
                </h3>
                <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.18em] text-[#00E5FF]">
                  Built for non-technical buyers
                </p>
                <p className="text-xs text-[#718096] mb-3 line-clamp-2">
                  {agent.description}
                </p>

                {/* Stats */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-[#FF7A00] fill-[#FF7A00]" />
                    <span className="text-xs text-white">{agent.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#718096]" />
                    <span className="text-xs text-[#718096]">{agent.time}</span>
                  </div>
                </div>

                {/* Earnings Badge */}
                <div className="flex items-center gap-1 mb-4">
                  <TrendingUp className="w-3 h-3 text-[#00FFC6]" />
                  <span className="text-xs text-[#00FFC6] font-medium">
                    +${agent.earnings}/mo potential
                  </span>
                </div>

                {/* Price & Deploy */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-lg font-bold text-white">${agent.price}</span>
                    <span className="text-xs text-[#718096]">/mo</span>
                  </div>
                  <Link
                    href={`/agent/${agent.id}`}
                    className="rounded-lg bg-[#00E5FF] px-3 py-1.5 text-sm font-semibold text-[#05070D] transition-colors hover:bg-[#00FFC6]"
                  >
                    Launch
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
