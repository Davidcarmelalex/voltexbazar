"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import { 
  DollarSign, Users, Clock, Activity, 
  Play, Pause, Settings, Plus, TrendingUp,
  Zap, MessageCircle, Mail
} from "lucide-react";
import { XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import api from "@/lib/api";

type DashboardUser = {
  id: string;
  name: string;
};

type AgentStatus = {
  id: number | string;
  name: string;
  status?: string;
  earnings: number;
  tasks: number;
  uptime: string;
  icon: string;
  containerName?: string | null;
  deploymentMode?: string | null;
};

type ActivityItem = {
  id: number;
  action: string;
  agent: string;
  time: string;
  type: string;
};

const revenueData = [
  { name: "Mon", value: 1200 },
  { name: "Tue", value: 1800 },
  { name: "Wed", value: 1400 },
  { name: "Thu", value: 2100 },
  { name: "Fri", value: 1900 },
  { name: "Sat", value: 2400 },
  { name: "Sun", value: 2800 },
];

const activeAgents = [
  { id: 1, name: "Client Hunter AI", status: "running", earnings: 1250, tasks: 45, uptime: "99.9%", icon: "🎯" },
  { id: 2, name: "WhatsApp Sales Pro", status: "running", earnings: 890, tasks: 32, uptime: "99.8%", icon: "💬" },
  { id: 3, name: "Content Generator", status: "paused", earnings: 450, tasks: 12, uptime: "100%", icon: "✍️" },
  { id: 4, name: "Support Bot", status: "running", earnings: 680, tasks: 89, uptime: "99.9%", icon: "🎧" },
];

const recentActivity = [
  { id: 1, action: "New lead captured", agent: "Client Hunter AI", time: "2 min ago", type: "success" },
  { id: 2, action: "Sale closed - $299", agent: "WhatsApp Sales Pro", time: "15 min ago", type: "success" },
  { id: 3, action: "Content published", agent: "Content Generator", time: "1 hour ago", type: "info" },
  { id: 4, action: "Support ticket resolved", agent: "Support Bot", time: "2 hours ago", type: "success" },
  { id: 5, action: "Payment received", agent: "Invoice Generator", time: "3 hours ago", type: "success" },
];

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<DashboardUser | null>(null);
  const [agents, setAgents] = useState<AgentStatus[]>(activeAgents);
  const [activity, setActivity] = useState<ActivityItem[]>(recentActivity);
  const [stats, setStats] = useState({
    totalEarnings: agents.reduce((sum, agent) => sum + agent.earnings, 0),
    leadsGenerated: 178,
    hoursSaved: 168,
    activeAgents: agents.filter((a) => a.status === "running").length,
    revenueChange: 12.5,
    leadsChange: 8.2,
    hoursChange: 24,
  });
  const [loading, setLoading] = useState(true);
  const [agentActionLoading, setAgentActionLoading] = useState<string | null>(null);
  const [agentActionError, setAgentActionError] = useState<string>("");

  useEffect(() => {
    let mounted = true;

    async function loadDashboard() {
      try {
        const me = await api.getMe();
        if (!mounted) return;
        setUser(me.user);

        const [statsRes, agentsRes, activityRes] = await Promise.all([
          api.getDashboardStats(me.user.id),
          api.getAgentPerformance(me.user.id),
          api.getActivity(me.user.id),
        ]);

        if (!mounted) return;
        setStats(statsRes.stats);
        setAgents(
          agentsRes.agents.length
            ? agentsRes.agents.map((agent) => ({
                id: agent.id,
                name: agent.name,
                status: agent.status ?? "paused",
                earnings: agent.earnings ?? 0,
                tasks: agent.tasks ?? 0,
                uptime: agent.uptime ?? "0%",
                icon: agent.icon ?? "🤖",
              }))
            : activeAgents
        );
        setActivity(activityRes.activities);
      } catch {
        router.replace("/auth");
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      mounted = false;
    };
  }, [router]);

  const toggleAgent = async (id: number | string) => {
    const target = agents.find((agent) => String(agent.id) === String(id));
    if (!target) return;

    setAgentActionError("");
    setAgentActionLoading(String(id));

    try {
      const response = target.status === "running"
        ? await api.stopAgent(String(id))
        : await api.startAgent(String(id));

      setAgents((current) =>
        current.map((agent) =>
          String(agent.id) === String(id)
            ? {
                ...agent,
                status: response.deployment.status ?? agent.status,
                containerName: response.deployment.containerName ?? agent.containerName,
                deploymentMode: response.deployment.deploymentMode ?? agent.deploymentMode,
              }
            : agent,
        ),
      );
    } catch (err) {
      setAgentActionError(err instanceof Error ? err.message : "Failed to update agent state");
    } finally {
      setAgentActionLoading(null);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#05070D] flex items-center justify-center text-white">
        Deploying your workspace...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#05070D]">
      <Navbar />
      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-3xl font-bold font-[family-name:var(--font-orbitron)] mb-2 text-white">Dashboard</h1>
            <p className="text-[#A0AEC0]">
              {user ? `Welcome back, ${user.name}. Monitor your AI agents and deploy new operators.` : "Monitor your AI agents and track performance"}
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { icon: DollarSign, color: "00FFC6", label: "Total Earnings", value: `$${stats.totalEarnings.toLocaleString()}`, change: `+${stats.revenueChange}%` },
              { icon: Users, color: "00E5FF", label: "Leads Generated", value: `${stats.leadsGenerated}`, change: `+${stats.leadsChange}%` },
              { icon: Clock, color: "7B61FF", label: "Hours Saved", value: `${stats.hoursSaved}`, change: `+${stats.hoursChange}h` },
              { icon: Activity, color: "FF7A00", label: "Active Systems", value: `${stats.activeAgents}`, change: `${agents.length} deployed` },
            ].map((item, i) => (
              <motion.div key={item.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }} className="bg-[#0A0F1C] border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-[#${item.color}]/20 flex items-center justify-center`}>
                    <item.icon className={`w-6 h-6 text-[#${item.color}]`} />
                  </div>
                  <span className="flex items-center gap-1 text-xs text-[#00FFC6]"><TrendingUp className="w-3 h-3" /> {item.change}</span>
                </div>
                <div className="text-2xl font-bold text-white mb-1">{item.value}</div>
                <div className="text-sm text-[#718096]">{item.label}</div>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-[#0A0F1C] border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-white">Revenue Overview</h2>
                  <select className="bg-[#101826] border border-white/10 rounded-lg px-3 py-1 text-sm text-white">
                    <option>This Week</option><option>This Month</option><option>This Year</option>
                  </select>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueData}>
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#00E5FF" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" stroke="#718096" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#718096" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                      <Tooltip contentStyle={{ backgroundColor: '#0A0F1C', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} labelStyle={{ color: '#A0AEC0' }} itemStyle={{ color: '#00E5FF' }} />
                      <Area type="monotone" dataKey="value" stroke="#00E5FF" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-[#0A0F1C] border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-white">Active Automations</h2>
                  <button className="flex items-center gap-2 px-4 py-2 bg-[#00E5FF]/20 text-[#00E5FF] rounded-lg text-sm font-medium hover:bg-[#00E5FF]/30">
                    <Plus className="w-4 h-4" />Deploy New
                  </button>
                </div>
                {agentActionError ? (
                  <div className="mb-4 rounded-xl border border-[#FF7A00]/30 bg-[#FF7A00]/10 px-4 py-3 text-sm text-[#FFD8B0]">
                    {agentActionError}
                  </div>
                ) : null}
                <div className="space-y-4">
                  {agents.map((agent) => (
                    <div key={agent.id} className="flex items-center justify-between p-4 bg-[#101826] rounded-xl">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[#0A0F1C] flex items-center justify-center text-2xl">{agent.icon}</div>
                          <div>
                            <h3 className="text-white font-medium">{agent.name}</h3>
                          <div className="flex items-center gap-3 mt-1">
                            <span className={`flex items-center gap-1 text-xs ${agent.status === "running" ? "text-[#00FFC6]" : "text-[#718096]"}`}>
                              <span className={`w-2 h-2 rounded-full ${agent.status === "running" ? "bg-[#00FFC6]" : "bg-[#718096]"}`} />
                              {agent.status === "running" ? "Running" : "Paused"}
                            </span>
                            <span className="text-xs text-[#718096]">{agent.tasks} tasks</span>
                            <span className="text-xs text-[#718096]">{agent.uptime} uptime</span>
                          </div>
                          {agent.containerName ? (
                            <p className="mt-1 text-xs font-mono text-[#718096]">{agent.containerName}</p>
                          ) : null}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-white font-semibold">${agent.earnings}</div>
                          <div className="text-xs text-[#718096]">this month</div>
                        </div>
                        <button
                          onClick={() => toggleAgent(agent.id)}
                          disabled={agentActionLoading === String(agent.id)}
                          className={`p-2 rounded-lg ${agent.status === "running" ? "bg-[#FF7A00]/20 text-[#FF7A00]" : "bg-[#00FFC6]/20 text-[#00FFC6]"} disabled:opacity-60`}
                        >
                          {agentActionLoading === String(agent.id) ? (
                            <span className="block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          ) : agent.status === "running" ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </button>
                        <button className="p-2 rounded-lg bg-[#101826] text-[#718096] hover:text-white"><Settings className="w-4 h-4" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            <div className="space-y-8">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="bg-[#0A0F1C] border border-white/10 rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
                <div className="space-y-3">
                  {[{ icon: Zap, color: "00E5FF", label: "Deploy Agent" }, { icon: Activity, color: "7B61FF", label: "View Analytics" }, { icon: Settings, color: "FF7A00", label: "Settings" }].map((action) => (
                    <button key={action.label} className="w-full flex items-center gap-3 p-3 bg-[#101826] rounded-xl text-white hover:bg-[#101826]/80">
                      <div className={`w-10 h-10 rounded-lg bg-[#${action.color}]/20 flex items-center justify-center`}>
                        <action.icon className={`w-5 h-5 text-[#${action.color}]`} />
                      </div>
                      <span className="text-sm font-medium">{action.label}</span>
                    </button>
                  ))}
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="bg-[#0A0F1C] border border-white/10 rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Live Activity</h2>
                <div className="space-y-4">
                  {activity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${activity.type === "success" ? "bg-[#00FFC6]" : "bg-[#00E5FF]"}`} />
                      <div className="flex-1">
                        <p className="text-sm text-white">{activity.action}</p>
                        <p className="text-xs text-[#718096]">{activity.agent} • {activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }} className="bg-[#0A0F1C] border border-white/10 rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Integrations</h2>
                <div className="flex gap-3">
                  <div className="flex-1 p-3 bg-[#101826] rounded-xl text-center">
                    <MessageCircle className="w-6 h-6 text-[#00FFC6] mx-auto mb-2" />
                    <span className="text-xs text-[#A0AEC0]">WhatsApp</span>
                  </div>
                  <div className="flex-1 p-3 bg-[#101826] rounded-xl text-center">
                    <span className="✈️ text-2xl mb-1 block">✈️</span>
                    <span className="text-xs text-[#A0AEC0]">Telegram</span>
                  </div>
                  <div className="flex-1 p-3 bg-[#101826] rounded-xl text-center">
                    <Mail className="w-6 h-6 text-[#00E5FF] mx-auto mb-2" />
                    <span className="text-xs text-[#A0AEC0]">Email</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
