"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Search, Filter, Star, TrendingUp, Clock, SlidersHorizontal, Sparkles, Rocket, ShieldCheck, ArrowRight } from "lucide-react";
import api, { Agent } from "@/lib/api";

export default function Marketplace() {
  const router = useRouter();
  const [agentsData, setAgentsData] = useState<Agent[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("popular");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMarketplaceData = async () => {
      try {
        setLoading(true);
        const res = await api.getAgents();
        
        if (res.success) {
          setAgentsData(res.agents);
          // Extract unique categories from agents data
          const uniqueCategories = Array.from(
            new Set(
              res.agents
                .map((agent) => agent.category)
                .filter((category): category is string => Boolean(category)),
            ),
          );
          setCategories(["All", ...uniqueCategories.sort()]);
        }
      } catch (err) {
        setError("Failed to load marketplace data");
        console.error("Marketplace data error:", err);
        // Set fallback data
        setCategories(["All", "Marketing", "Sales", "Content", "Analytics", "Support", "Finance", "HR", "Ecommerce", "Productivity"]);
      } finally {
        setLoading(false);
      }
    };

    loadMarketplaceData();
  }, []);

  const filteredAgents = agentsData.filter((agent) => {
    const matchesCategory = selectedCategory === "All" || agent.category === selectedCategory;
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedAgents = [...filteredAgents].sort((a, b) => {
    if (sortBy === "popular") return (b.reviews || 0) - (a.reviews || 0);
    if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
    if (sortBy === "price-low") return (a.price || 0) - (b.price || 0);
    if (sortBy === "price-high") return (b.price || 0) - (a.price || 0);
    return 0;
  });

  const featuredAgent = sortedAgents[0] || agentsData[0];

  return (
    <main className="min-h-screen bg-[#05070D]">
      <Navbar />
      
      <div className="pt-24 pb-12">
        <div className="border-b border-white/5 bg-[radial-gradient(circle_at_top_left,rgba(0,229,255,0.18),transparent_34%),radial-gradient(circle_at_top_right,rgba(255,122,0,0.18),transparent_28%),linear-gradient(180deg,rgba(123,97,255,0.18),rgba(5,7,13,0.05))]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#00E5FF]/30 bg-[#07111B] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#00E5FF]">
                <Sparkles className="h-4 w-4" />
                Plug And Play AI Deployment
              </div>
              <h1 className="mt-5 text-3xl font-bold font-[family-name:var(--font-orbitron)] sm:text-5xl">
                <span className="text-white">Choose an AI worker.</span>
                <br />
                <span className="text-[#00E5FF]">We handle the technical side.</span>
              </h1>
              <p className="mt-4 max-w-3xl text-[#A0AEC0]">
                Pick the result you want, pay with crypto, and launch a ready-made operator without managing servers, scripts, or integrations yourself.
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {[
                  { icon: Rocket, title: "1. Pick your outcome", text: "Lead generation, support, content, sales, or internal operations." },
                  { icon: ShieldCheck, title: "2. Pay with crypto", text: "USDT or USDC on supported EVM chains. No payment setup confusion." },
                  { icon: Sparkles, title: "3. Go live fast", text: "Your agent is prepared for deployment without technical onboarding." },
                ].map((item) => (
                  <div key={item.title} className="rounded-2xl border border-white/10 bg-[#0A0F1C]/80 p-5">
                    <item.icon className="h-5 w-5 text-[#00E5FF]" />
                    <p className="mt-3 text-sm font-semibold text-white">{item.title}</p>
                    <p className="mt-2 text-sm text-[#718096]">{item.text}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="lg:w-64 flex-shrink-0">
              <div className="sticky top-24 space-y-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#718096]" />
                  <input
                    type="text"
                    placeholder="Search agents..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#0A0F1C] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-[#718096] focus:outline-none focus:border-[#00E5FF]"
                  />
                </div>

                <div className="bg-[#0A0F1C] border border-white/10 rounded-2xl p-4">
                  <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                    <Filter className="w-4 h-4 text-[#00E5FF]" />
                    Pick by outcome
                  </h3>
                  <div className="space-y-1">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          selectedCategory === category
                            ? "bg-[#00E5FF]/20 text-[#00E5FF]"
                            : "text-[#718096] hover:text-white hover:bg-white/5"
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-[#00E5FF]/20 bg-[#07111B] p-4">
                  <p className="text-sm font-semibold text-white">Non-technical buyer mode</p>
                  <p className="mt-2 text-sm text-[#718096]">
                    Every listing is framed for business outcomes, not technical setup. Open an agent, choose a plan, pay, and deploy.
                  </p>
                </div>
              </div>
            </aside>

            <div className="flex-1">
              {featuredAgent ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8 overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(135deg,rgba(255,122,0,0.20),rgba(0,229,255,0.18),rgba(10,15,28,0.95))] p-6"
                >
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div className="max-w-2xl">
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#00FFC6]">Fastest launch</p>
                      <h3 className="mt-2 text-2xl font-semibold text-white">{featuredAgent.name}</h3>
                      <p className="mt-3 text-sm text-[#D5E3F5]">{featuredAgent.description}</p>
                      <div className="mt-4 flex flex-wrap gap-3 text-sm text-[#D5E3F5]">
                        <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1">Starts at ${featuredAgent.price}/mo</span>
                        <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1">Crypto checkout</span>
                        <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1">Deployment-ready</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <button
                        onClick={() => router.push(`/agent/${featuredAgent.id}`)}
                        className="rounded-xl bg-[#05070D] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0A0F1C]"
                      >
                        Open Agent
                      </button>
                      <button
                        onClick={() => router.push(`/agent/${featuredAgent.id}`)}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-[#05070D]"
                      >
                        Launch This Agent
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : null}

              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-[#718096]">
                  Showing <span className="text-white font-medium">{sortedAgents.length}</span> ready-to-launch agents
                </p>
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#718096]" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-[#0A0F1C] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00E5FF]"
                  >
                    <option value="popular">Most Popular</option>
                    <option value="rating">Highest Rated</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                </div>
              </div>

              {loading ? (
                <div className="mb-6 rounded-2xl border border-white/10 bg-[#0A0F1C] p-4 text-sm text-[#A0AEC0]">
                  Loading marketplace catalog...
                </div>
              ) : null}

              {error ? (
                <div className="mb-6 rounded-2xl border border-[#FF7A00]/30 bg-[#FF7A00]/10 p-4 text-sm text-[#FFD8B0]">
                  {error}
                </div>
              ) : null}

              <div className="mb-6 grid gap-4 md:grid-cols-3">
                {[
                  { title: "No setup calls", text: "Users should understand what the agent does immediately." },
                  { title: "One clear payment path", text: "Crypto checkout is tied to a generated payment order." },
                  { title: "Deployment first", text: "Every card pushes toward launch instead of feature overload." },
                ].map((item) => (
                  <div key={item.title} className="rounded-2xl border border-white/10 bg-[#0A0F1C] p-4">
                    <p className="text-sm font-semibold text-white">{item.title}</p>
                    <p className="mt-2 text-sm text-[#718096]">{item.text}</p>
                  </div>
                ))}
              </div>

              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {sortedAgents.map((agent, index) => (
                  <motion.div
                    key={agent.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group bg-[#0A0F1C] border border-white/10 rounded-2xl overflow-hidden hover:border-[#00E5FF] hover:shadow-[0_0_30px_rgba(0,229,255,0.3)] transition-all"
                  >
                    <div className="h-36 bg-gradient-to-br from-[#101826] to-[#0A0F1C] flex items-center justify-center text-6xl relative">
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1C] to-transparent" />
                      <span className="relative z-10">{agent.icon || agent.image || "🤖"}</span>
                      <div className="absolute top-3 right-3">
                        <span className="px-2 py-1 text-xs font-medium bg-[#00FFC6]/20 text-[#00FFC6] rounded-full">
                          {agent.category}
                        </span>
                      </div>
                    </div>

                    <div className="p-5">
                      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-[#00E5FF] transition-colors">
                        {agent.name}
                      </h3>
                      <p className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-[#00E5FF]">Plug-and-play operator</p>
                      <p className="text-xs text-[#718096] mb-4 line-clamp-2">{agent.description}</p>

                      <div className="flex flex-wrap gap-1 mb-4">
                        {(agent.tags || []).slice(0, 3).map((tag: string) => (
                          <span key={tag} className="px-2 py-0.5 text-xs bg-[#101826] text-[#718096] rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-[#FF7A00] fill-[#FF7A00]" />
                          <span className="text-xs text-white">{agent.rating}</span>
                          <span className="text-xs text-[#718096]">({agent.reviews})</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#718096]" />
                          <span className="text-xs text-[#718096]">{agent.time}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 mb-4">
                        <TrendingUp className="w-3 h-3 text-[#00FFC6]" />
                        <span className="text-xs text-[#00FFC6] font-medium">+${agent.earnings}/mo potential</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-lg font-bold text-white">${agent.price}</span>
                          <span className="text-xs text-[#718096]">/mo</span>
                          <p className="mt-1 text-[11px] text-[#718096]">Crypto checkout available</p>
                        </div>
                        <Link
                          href={`/agent/${agent.id}`}
                          className="rounded-lg bg-[#00E5FF] px-4 py-2 text-sm font-semibold text-[#05070D] transition-colors hover:bg-[#00FFC6]"
                        >
                          Launch
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
