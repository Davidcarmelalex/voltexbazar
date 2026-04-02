"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ArrowRight, Check, Clock, Copy, Globe, Mail, MessageCircle, Star, TrendingUp } from "lucide-react";
import api, { Deployment, Payment, PaymentConfig, Subscription } from "@/lib/api";

type AgentPricing = {
  plan: string;
  price: number;
  features: string[];
};

type AgentDetailData = {
  id: string;
  name: string;
  description: string;
  longDescription?: string;
  price: number;
  earnings?: number;
  time?: string;
  rating?: number;
  reviews?: number;
  image?: string;
  icon?: string;
  category?: string;
  tags?: string[];
  features?: string[];
  integrations?: string[];
  pricing?: AgentPricing[];
};

const fallbackAgentData: Record<string, AgentDetailData> = {
  "1": {
    id: "1",
    name: "Client Hunter AI",
    description: "Finds and contacts leads daily across multiple platforms.",
    longDescription:
      "Client Hunter AI acts like a 24/7 sales assistant that identifies leads, follows up, and keeps your pipeline moving without manual chasing.",
    price: 49,
    earnings: 3200,
    time: "2h/day",
    rating: 4.9,
    reviews: 128,
    image: "🎯",
    category: "Marketing",
    tags: ["leads", "outreach", "automation"],
    features: [
      "Automated lead discovery",
      "Personalized outreach messages",
      "Multi-platform support",
      "Meeting booking support",
      "CRM sync",
      "Performance analytics",
    ],
    integrations: ["WhatsApp", "Telegram", "Email", "Calendar", "CRM"],
    pricing: [
      { plan: "Starter", price: 49, features: ["100 leads/month", "1 platform", "Email support"] },
      { plan: "Pro", price: 99, features: ["500 leads/month", "All platforms", "Priority support"] },
      { plan: "Enterprise", price: 199, features: ["Unlimited leads", "Custom workflows", "24/7 support"] },
    ],
  },
};

export default function AgentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const agentId = Array.isArray(params.id) ? params.id[0] : params.id || "1";

  const [agent, setAgent] = useState<AgentDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState("Starter");
  const [payment, setPayment] = useState<Payment | null>(null);
  const [paymentConfig, setPaymentConfig] = useState<PaymentConfig | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [deployment, setDeployment] = useState<Deployment | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [activationLoading, setActivationLoading] = useState(false);
  const [paymentRefreshLoading, setPaymentRefreshLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadAgent() {
      try {
        setLoading(true);
        const res = await api.getAgent(agentId);
        if (!mounted) return;

        if (res.success && res.agent) {
          const base = fallbackAgentData[res.agent.id] ?? fallbackAgentData["1"];
          const merged: AgentDetailData = {
            ...base,
            ...res.agent,
            image: res.agent.icon || base.image,
            pricing: base.pricing,
            features: base.features,
            integrations: base.integrations,
            rating: base.rating,
            reviews: base.reviews,
            earnings: base.earnings,
            time: base.time,
          };
          setAgent(merged);
          setSelectedPlan(base.pricing?.[0]?.plan || "Starter");
        } else {
          setAgent(fallbackAgentData[agentId] ?? fallbackAgentData["1"]);
        }
      } catch {
        if (mounted) {
          setAgent(fallbackAgentData[agentId] ?? fallbackAgentData["1"]);
          setError("Using fallback details while live agent data is unavailable.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadAgent();
    return () => {
      mounted = false;
    };
  }, [agentId]);

  const pricing = agent?.pricing ?? fallbackAgentData["1"].pricing ?? [];
  const selectedPricing = pricing.find((item) => item.plan === selectedPlan) ?? pricing[0];

  useEffect(() => {
    if (!payment?.id || payment.status === "completed" || payment.status === "expired") {
      return;
    }

    const interval = window.setInterval(async () => {
      try {
        const statusRes = await api.getPaymentStatus(payment.id);
        setPayment(statusRes.payment);
      } catch {
        // Keep UI stable; manual refresh remains available.
      }
    }, 15000);

    return () => window.clearInterval(interval);
  }, [payment]);

  async function beginCheckout() {
    if (!agent || !selectedPricing) return;

    setCheckoutLoading(true);
    setCheckoutError("");
    try {
      const me = await api.getMe().catch(() => null);
      if (!me?.user?.id) {
        router.push(`/auth?redirect=/agent/${agent.id}`);
        return;
      }

      const [paymentRes, configRes] = await Promise.all([
        api.createPayment(selectedPricing.price, selectedPlan),
        api.getPaymentConfig(),
      ]);

      setPayment(paymentRes.payment);
      setPaymentConfig(configRes.config);
    } catch (err) {
      setCheckoutError(err instanceof Error ? err.message : "Failed to generate payment");
    } finally {
      setCheckoutLoading(false);
    }
  }

  async function activateAndDeploy() {
    if (!agent || !payment) return;
    if (payment.status !== "completed") {
      setCheckoutError("Payment must be fully confirmed before activation.");
      return;
    }

    setActivationLoading(true);
    setCheckoutError("");
    try {
      const subscriptionRes = await api.activateSubscription(agent.id, selectedPlan, payment.id);
      const deploymentRes = await api.deployAgent(agent.id, { plan: selectedPlan, paymentId: payment.id });
      setSubscription(subscriptionRes.subscription);
      setDeployment(deploymentRes.deployment);
    } catch (err) {
      setCheckoutError(err instanceof Error ? err.message : "Failed to activate deployment");
    } finally {
      setActivationLoading(false);
    }
  }

  async function copyPaymentAddress() {
    if (payment?.address) {
      await navigator.clipboard.writeText(payment.address);
    }
  }

  async function refreshPaymentStatus() {
    if (!payment?.id) return;

    setPaymentRefreshLoading(true);
    setCheckoutError("");
    try {
      const statusRes = await api.getPaymentStatus(payment.id);
      setPayment(statusRes.payment);
    } catch (err) {
      setCheckoutError(err instanceof Error ? err.message : "Failed to refresh payment status");
    } finally {
      setPaymentRefreshLoading(false);
    }
  }

  if (loading || !agent) {
    return (
      <main className="min-h-screen bg-[#05070D] flex items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#00E5FF] border-t-transparent" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#05070D]">
      <Navbar />
      <div className="pt-24 pb-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <p className="text-sm text-[#718096]">Marketplace / {agent.category} / {agent.name}</p>
          </motion.div>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="space-y-8 lg:col-span-2">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-white/10 bg-[#0A0F1C] p-8">
                <div className="flex flex-col gap-6 sm:flex-row">
                  <div className="flex h-32 w-32 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#101826] to-[#0A0F1C] text-6xl">
                    {agent.image || "🤖"}
                  </div>
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-3">
                      <span className="rounded-full bg-[#00FFC6]/20 px-3 py-1 text-xs font-medium text-[#00FFC6]">
                        {agent.category}
                      </span>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-[#FF7A00] text-[#FF7A00]" />
                        <span className="font-medium text-white">{agent.rating ?? 4.8}</span>
                        <span className="text-[#718096]">({agent.reviews ?? 0} reviews)</span>
                      </div>
                    </div>
                    <h1 className="mb-3 text-3xl font-bold text-white">{agent.name}</h1>
                    <p className="text-[#A0AEC0]">{agent.longDescription || agent.description}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-white/10 bg-[#0A0F1C] p-8">
                <h2 className="mb-6 text-xl font-semibold text-white">Features</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {(agent.features || []).map((feature, index) => (
                    <div key={`${feature}-${index}`} className="flex items-center gap-3">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#00FFC6]/20">
                        <Check className="h-3 w-3 text-[#00FFC6]" />
                      </div>
                      <span className="text-[#A0AEC0]">{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-white/10 bg-[#0A0F1C] p-8">
                <h2 className="mb-6 text-xl font-semibold text-white">Integrations</h2>
                <div className="flex flex-wrap gap-3">
                  {(agent.integrations || []).map((integration) => (
                    <div key={integration} className="flex items-center gap-2 rounded-xl bg-[#101826] px-4 py-2">
                      {integration === "WhatsApp" && <MessageCircle className="h-4 w-4 text-[#00FFC6]" />}
                      {integration === "Email" && <Mail className="h-4 w-4 text-[#00E5FF]" />}
                      {!["WhatsApp", "Email"].includes(integration) && <Globe className="h-4 w-4 text-[#7B61FF]" />}
                      <span className="text-sm text-white">{integration}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            <div className="space-y-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="sticky top-24 rounded-2xl border border-white/10 bg-[#0A0F1C] p-6">
                <h2 className="mb-6 text-xl font-semibold text-white">Choose Plan</h2>

                <div className="mb-6 space-y-3">
                  {pricing.map((plan) => (
                    <button
                      key={plan.plan}
                      onClick={() => setSelectedPlan(plan.plan)}
                      className={`w-full rounded-xl border-2 p-4 text-left transition-all ${
                        selectedPlan === plan.plan
                          ? "border-[#00E5FF] bg-[#00E5FF]/20"
                          : "border-transparent bg-[#101826] hover:border-white/20"
                      }`}
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <span className="font-medium text-white">{plan.plan}</span>
                        <span className="text-xl font-bold text-white">
                          ${plan.price}
                          <span className="text-sm text-[#718096]">/mo</span>
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {plan.features.slice(0, 2).map((feature, index) => (
                          <span key={`${feature}-${index}`} className="text-xs text-[#718096]">• {feature}</span>
                        ))}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="mb-4 flex items-center justify-between rounded-xl bg-[#101826] p-3">
                  <span className="text-[#718096]">Monthly price</span>
                  <span className="text-2xl font-bold text-white">${selectedPricing?.price ?? agent.price}</span>
                </div>

                <button
                  onClick={beginCheckout}
                  disabled={checkoutLoading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF7A00] to-[#FF9500] py-4 font-semibold text-white shadow-[0_0_20px_rgba(255,122,0,0.8)] disabled:opacity-70"
                >
                  {checkoutLoading ? "Generating payment..." : "Pay With Crypto"}
                  <ArrowRight className="h-5 w-5" />
                </button>

                <p className="mt-4 text-center text-xs text-[#718096]">
                  Crypto only. {paymentConfig ? `${paymentConfig.token} on ${paymentConfig.chain}.` : "A payment address appears after login."}
                </p>

                {error ? <p className="mt-4 text-sm text-[#FF7A00]">{error}</p> : null}
                {checkoutError ? <p className="mt-4 text-sm text-[#FF7A00]">{checkoutError}</p> : null}

                {payment ? (
                  <div className="mt-5 rounded-2xl border border-[#00E5FF]/30 bg-[#07111B] p-4">
                    <p className="text-sm font-semibold text-white">Payment ready</p>
                    <p className="mt-2 text-sm text-[#A0AEC0]">
                      Send exactly <span className="text-white">{payment.amount} {payment.currency}</span> on <span className="text-white">{payment.network}</span>.
                    </p>
                    <p className="mt-3 break-all rounded-xl bg-[#101826] p-3 font-mono text-xs text-white">{payment.address}</p>
                    <button
                      onClick={copyPaymentAddress}
                      className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#00E5FF]/20 py-3 text-sm font-medium text-[#00E5FF] hover:bg-[#00E5FF]/30"
                    >
                      <Copy className="h-4 w-4" />
                      Copy payment address
                    </button>
                    <div className="mt-3 rounded-xl border border-white/10 bg-[#101826] p-3 text-xs text-[#A0AEC0]">
                      <p>Status: <span className="text-white">{payment.status || "pending"}</span></p>
                      {typeof payment.confirmations === "number" ? (
                        <p className="mt-1">Confirmations: <span className="text-white">{payment.confirmations}</span>{paymentConfig?.confirmationsRequired ? ` / ${paymentConfig.confirmationsRequired}` : ""}</p>
                      ) : null}
                    </div>
                    {payment.instructions ? <p className="mt-3 text-xs text-[#718096]">{payment.instructions}</p> : null}
                    {payment.expiresAt ? <p className="mt-2 text-xs text-[#718096]">Expires: {new Date(payment.expiresAt).toLocaleString()}</p> : null}
                    <button
                      onClick={refreshPaymentStatus}
                      disabled={paymentRefreshLoading}
                      className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-[#101826] px-4 py-3 text-sm font-semibold text-white hover:border-[#00E5FF]/40 disabled:opacity-60"
                    >
                      {paymentRefreshLoading ? "Refreshing..." : "Refresh Payment Status"}
                    </button>
                    <button
                      onClick={activateAndDeploy}
                      disabled={activationLoading || payment.status !== "completed"}
                      className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF7A00] to-[#FF9500] px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
                    >
                      {activationLoading ? "Activating..." : payment.status === "completed" ? "Activate My Agent" : "Waiting For Confirmation"}
                    </button>
                    <p className="mt-2 text-xs text-[#718096]">
                      Launch mode: activation is unlocked after payment status reaches confirmed.
                    </p>
                  </div>
                ) : null}

                {subscription ? (
                  <div className="mt-4 rounded-2xl border border-[#00FFC6]/20 bg-[#07140F] p-4 text-sm">
                    <p className="font-semibold text-white">Subscription active</p>
                    <p className="mt-2 text-[#A0AEC0]">Plan: <span className="text-white">{subscription.plan}</span></p>
                    <p className="text-[#A0AEC0]">Status: <span className="text-white">{subscription.status}</span></p>
                  </div>
                ) : null}

                {deployment ? (
                  <div className="mt-4 rounded-2xl border border-white/10 bg-[#101826] p-4 text-sm">
                    <p className="font-semibold text-white">Deployment created</p>
                    <p className="mt-2 text-[#A0AEC0]">Status: <span className="text-white">{deployment.status}</span></p>
                    {deployment.containerName ? (
                      <p className="text-[#A0AEC0]">Container: <span className="font-mono text-white">{deployment.containerName}</span></p>
                    ) : null}
                    {deployment.deploymentMode ? (
                      <p className="text-[#A0AEC0]">Mode: <span className="text-white">{deployment.deploymentMode}</span></p>
                    ) : null}
                  </div>
                ) : null}

                <div className="mt-6 grid grid-cols-2 gap-4 border-t border-white/10 pt-6">
                  <div className="text-center">
                    <div className="mb-1 flex items-center justify-center gap-1">
                      <TrendingUp className="h-4 w-4 text-[#00FFC6]" />
                      <span className="text-lg font-bold text-white">+${agent.earnings ?? 0}</span>
                    </div>
                    <p className="text-xs text-[#718096]">Potential monthly impact</p>
                  </div>
                  <div className="text-center">
                    <div className="mb-1 flex items-center justify-center gap-1">
                      <Clock className="h-4 w-4 text-[#7B61FF]" />
                      <span className="text-lg font-bold text-white">{agent.time ?? "24/7"}</span>
                    </div>
                    <p className="text-xs text-[#718096]">Time saved</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
