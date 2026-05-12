"use client";
import { BarChart3, Bot, Zap, CreditCard, Activity, TrendingUp, AlertCircle, CheckCircle } from "lucide-react";

const stats = [
  { label: "Active Agents", value: "3", change: "+1 this week", icon: Bot, color: "text-purple-400" },
  { label: "Tasks Executed", value: "1,847", change: "+234 today", icon: Zap, color: "text-blue-400" },
  { label: "USDT Balance", value: "420.00", change: "Next billing: Jun 1", icon: CreditCard, color: "text-gold" },
  { label: "Success Rate", value: "98.4%", change: "+0.2% vs last month", icon: TrendingUp, color: "text-emerald-400" },
];

const agents = [
  { name: "SalesBot Pro", status: "active", tasks_today: 47, uptime: "99.9%", last_action: "Sent follow-up to lead@company.com" },
  { name: "SupportAI", status: "active", tasks_today: 183, uptime: "100%", last_action: "Resolved ticket #4821 — shipping inquiry" },
  { name: "ContentEngine", status: "paused", tasks_today: 0, uptime: "—", last_action: "Generated 3 blog posts on May 10" },
];

const activity = [
  { time: "2 min ago", event: "SalesBot Pro qualified lead: Jane Smith (Acme Corp)", status: "success" },
  { time: "11 min ago", event: "SupportAI resolved ticket #4823 — refund request", status: "success" },
  { time: "34 min ago", event: "SupportAI escalated ticket #4819 — requires human review", status: "warn" },
  { time: "1h ago", event: "SalesBot Pro sent 12 follow-up emails", status: "success" },
  { time: "2h ago", event: "Payment confirmed — 49 USDT deducted (SalesBot Pro)", status: "success" },
];

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <header className="border-b border-white/8 bg-black/60 px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-white">Dashboard</h1>
            <p className="text-xs text-silver/60">Welcome back, David</p>
          </div>
          <a href="/marketplace" className="rounded border border-purple-500/40 bg-purple-500/10 px-4 py-2 text-xs font-medium text-purple-300 hover:bg-purple-500/20 transition-colors">
            + Deploy Agent
          </a>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Stats */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((s) => (
            <div key={s.label} className="rounded-xl border border-white/8 bg-white/3 p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-silver/60">{s.label}</span>
                <s.icon className={`h-4 w-4 ${s.color}`} />
              </div>
              <div className="text-2xl font-bold text-white">{s.value}</div>
              <div className="mt-1 text-xs text-silver/60">{s.change}</div>
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          {/* Agents */}
          <div className="rounded-xl border border-white/8 bg-white/3">
            <div className="flex items-center justify-between p-5 border-b border-white/8">
              <h2 className="font-semibold text-white">Your Agents</h2>
              <a href="/marketplace" className="text-xs text-purple-400 hover:text-purple-300">Browse marketplace →</a>
            </div>
            <div className="divide-y divide-white/5">
              {agents.map((agent) => (
                <div key={agent.name} className="flex items-center gap-4 p-4">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg border ${agent.status === "active" ? "border-emerald-500/30 bg-emerald-500/10" : "border-white/10 bg-white/5"}`}>
                    <Bot className={`h-4 w-4 ${agent.status === "active" ? "text-emerald-400" : "text-silver/40"}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-white">{agent.name}</span>
                      <span className={`rounded-full px-2 py-0.5 text-xs ${agent.status === "active" ? "bg-emerald-500/20 text-emerald-400" : "bg-white/10 text-silver"}`}>
                        {agent.status}
                      </span>
                    </div>
                    <p className="text-xs text-silver/60 truncate">{agent.last_action}</p>
                  </div>
                  <div className="text-right text-xs text-silver/60">
                    <div>{agent.tasks_today} tasks today</div>
                    <div>Uptime: {agent.uptime}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity feed */}
          <div className="rounded-xl border border-white/8 bg-white/3">
            <div className="p-5 border-b border-white/8">
              <h2 className="font-semibold text-white">Live Activity</h2>
            </div>
            <div className="divide-y divide-white/5">
              {activity.map((item, i) => (
                <div key={i} className="flex gap-3 p-4">
                  {item.status === "success"
                    ? <CheckCircle className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    : <AlertCircle className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                  }
                  <div>
                    <p className="text-xs text-silver leading-relaxed">{item.event}</p>
                    <p className="text-xs text-silver/40 mt-1">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
