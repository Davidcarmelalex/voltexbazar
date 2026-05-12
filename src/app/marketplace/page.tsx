"use client";
import { useState } from "react";
import Link from "next/link";
import { Search, Filter, Star, Zap, Shield, Brain, Bot, TrendingUp } from "lucide-react";

const agents = [
  { id: "a1", name: "SalesBot Pro", category: "Sales", rating: 4.8, reviews: 124, price: "49 USDT/mo", description: "AI sales agent that qualifies leads, sends follow-ups, and books meetings — fully autonomous.", tags: ["crm", "email", "scheduling"], status: "live" },
  { id: "a2", name: "SupportAI", category: "Customer Support", rating: 4.9, reviews: 287, price: "89 USDT/mo", description: "24/7 customer support agent. Handles tickets, resolves FAQs, escalates edge cases.", tags: ["support", "chat", "zendesk"], status: "live" },
  { id: "a3", name: "ContentEngine", category: "Marketing", rating: 4.6, reviews: 89, price: "39 USDT/mo", description: "Generates blog posts, social content, and ad copy from your brand guidelines.", tags: ["content", "seo", "social"], status: "live" },
  { id: "a4", name: "DataAnalyst", category: "Analytics", rating: 4.7, reviews: 156, price: "79 USDT/mo", description: "Connects to your data sources and produces weekly insight reports automatically.", tags: ["analytics", "reports", "sql"], status: "live" },
  { id: "a5", name: "LegalDraft", category: "Legal", rating: 4.5, reviews: 43, price: "129 USDT/mo", description: "Drafts NDAs, contracts, and compliance documents. Reviewed by legal AI trained on commercial law.", tags: ["legal", "contracts", "compliance"], status: "live" },
  { id: "a6", name: "HRAssistant", category: "HR", rating: 4.7, reviews: 71, price: "59 USDT/mo", description: "Screens CVs, schedules interviews, sends offers. Handles your hiring pipeline end-to-end.", tags: ["hiring", "hr", "recruiting"], status: "live" },
];

const categories = ["All", "Sales", "Customer Support", "Marketing", "Analytics", "Legal", "HR"];
const categoryIcons: Record<string, any> = { Sales: TrendingUp, "Customer Support": Shield, Marketing: Star, Analytics: Brain, Legal: Shield, HR: Bot };

export default function MarketplacePage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filtered = agents.filter((a) => {
    const matchCat = category === "All" || a.category === category;
    const q = search.toLowerCase();
    const matchSearch = !q || a.name.toLowerCase().includes(q) || a.description.toLowerCase().includes(q) || a.tags.some(t => t.includes(q));
    return matchCat && matchSearch;
  });

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(139,92,246,0.08),transparent_35%),linear-gradient(180deg,#09090b_0%,#000_100%)] text-white">
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="max-w-3xl mb-12">
          <h1 className="text-4xl font-bold md:text-5xl">Agent Marketplace</h1>
          <p className="mt-4 text-lg text-silver">Deploy AI agents that run your business — no engineering required.</p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-silver/50" />
            <input
              type="search"
              placeholder="Search agents..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/5 pl-10 pr-4 py-2.5 text-sm text-white placeholder-silver/50 outline-none focus:border-purple-500/40"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${
                  category === cat ? "border-purple-500 bg-purple-500/20 text-purple-300" : "border-white/10 text-silver hover:border-purple-500/40"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((agent) => {
            const Icon = categoryIcons[agent.category] || Bot;
            return (
              <div key={agent.id} className="rounded-xl border border-white/8 bg-white/3 p-5 hover:border-purple-500/20 transition-colors flex flex-col">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-purple-500/20 bg-purple-500/10">
                    <Icon className="h-5 w-5 text-purple-400" />
                  </div>
                  <div className="flex items-center gap-1 text-xs text-silver/60">
                    <Star className="h-3 w-3 fill-gold text-gold" />
                    <span>{agent.rating}</span>
                    <span className="text-silver/40">({agent.reviews})</span>
                  </div>
                </div>
                <h3 className="font-semibold text-white mb-1">{agent.name}</h3>
                <span className="text-xs text-purple-400 mb-3">{agent.category}</span>
                <p className="text-sm text-silver leading-relaxed flex-1">{agent.description}</p>
                <div className="mt-4 flex flex-wrap gap-1 mb-4">
                  {agent.tags.map(tag => (
                    <span key={tag} className="rounded bg-white/5 px-2 py-0.5 text-xs text-silver/60">#{tag}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-white">{agent.price}</span>
                  <Link href={`/agent/${agent.id}`} className="rounded border border-purple-500/40 bg-purple-500/10 px-4 py-1.5 text-xs font-medium text-purple-300 hover:bg-purple-500/20 transition-colors">
                    Deploy
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
