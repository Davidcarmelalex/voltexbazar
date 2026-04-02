import Link from "next/link";
import {
  ArrowRight,
  Banknote,
  Bot,
  BriefcaseBusiness,
  Coins,
  Globe2,
  MessageSquareMore,
  ShieldCheck,
  Sparkles,
  Wallet,
  Zap,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const operatorSegments = [
  {
    title: "Solo operators",
    description:
      "Lead capture, appointment follow-up, quoting, and inbound replies without hiring a full ops team.",
    icon: BriefcaseBusiness,
  },
  {
    title: "Service businesses",
    description:
      "WhatsApp-first customer handling for clinics, consultancies, agencies, and field teams across the UAE.",
    icon: MessageSquareMore,
  },
  {
    title: "Commerce teams",
    description:
      "Agent flows for support, remarketing, abandoned cart recovery, and multilingual customer service.",
    icon: Bot,
  },
];

const launchTracks = [
  "Choose a ready agent by business outcome, not by model complexity.",
  "Launch with crypto-first checkout and major currency expansion as the next payment layer.",
  "Get a deployment path that fits UAE-facing operations, support volume, and response expectations.",
];

const productSignals = [
  { label: "Primary market", value: "UAE first" },
  { label: "Payments", value: "Crypto + multi-currency path" },
  { label: "Channels", value: "WhatsApp, web, ops workflows" },
  { label: "Positioning", value: "AI agents for real operators" },
];

const marketplaceCards = [
  {
    title: "Lead Response Agent",
    blurb: "Replies in minutes, qualifies inbound leads, and routes high-intent prospects to a human closer.",
    accent: "from-cyan-300/30 to-sky-500/10",
  },
  {
    title: "WhatsApp Sales Desk",
    blurb: "Built for UAE-first buying behavior where trust, speed, and chat continuity decide conversion.",
    accent: "from-emerald-300/30 to-cyan-500/10",
  },
  {
    title: "Follow-Up Operator",
    blurb: "Keeps quotations, reminders, and dormant conversations alive without manual tracking fatigue.",
    accent: "from-amber-300/30 to-orange-500/10",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--bg-dark)] text-white">
      <Navbar />

      <section className="relative overflow-hidden pt-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(52,211,235,0.18),transparent_28%),radial-gradient(circle_at_80%_20%,rgba(15,118,255,0.22),transparent_32%),radial-gradient(circle_at_60%_80%,rgba(245,158,11,0.12),transparent_28%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:72px_72px] opacity-40" />
        <div className="relative mx-auto flex max-w-7xl flex-col gap-16 px-4 pb-20 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div className="max-w-3xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-white/5 px-4 py-2 text-sm text-slate-200 backdrop-blur">
                <Sparkles className="h-4 w-4 text-cyan-300" />
                Voltex Network marketplace for AI agents built around UAE operator reality
              </div>

              <h1 className="max-w-4xl text-5xl font-semibold leading-[0.95] tracking-[-0.05em] text-white sm:text-6xl lg:text-7xl">
                Buy AI agents the same way you buy outcomes.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
                VoltexBazar is the launch marketplace for the Voltex ecosystem. It packages automation,
                customer response, follow-up, and commercial workflows into deployable agents for
                individuals, founders, and small business teams.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/marketplace"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--signal-orange)] px-6 py-4 text-sm font-semibold text-slate-950 transition-transform duration-200 hover:-translate-y-0.5"
                >
                  Enter Marketplace
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/pricing"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm font-semibold text-white transition-colors hover:border-cyan-300/50 hover:bg-cyan-300/10"
                >
                  View Launch Pricing
                </Link>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {productSignals.map((signal) => (
                  <div key={signal.label} className="rounded-2xl border border-white/8 bg-black/20 p-4 backdrop-blur">
                    <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">{signal.label}</p>
                    <p className="mt-2 text-sm font-medium text-white">{signal.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-cyan-300/20 via-sky-500/15 to-orange-400/15 blur-3xl" />
              <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(8,12,22,0.96),rgba(5,7,13,0.94))] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.45)]">
                <div className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/5 px-4 py-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Launch board</p>
                    <p className="mt-1 text-sm font-medium text-white">Crypto-first marketplace flow</p>
                  </div>
                  <Wallet className="h-5 w-5 text-cyan-300" />
                </div>

                <div className="mt-6 space-y-4">
                  {marketplaceCards.map((card) => (
                    <div
                      key={card.title}
                      className={`rounded-3xl border border-white/10 bg-gradient-to-br ${card.accent} p-[1px]`}
                    >
                      <div className="rounded-[calc(1.5rem-1px)] bg-slate-950/95 p-5">
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <h2 className="text-lg font-semibold text-white">{card.title}</h2>
                            <p className="mt-2 text-sm leading-6 text-slate-300">{card.blurb}</p>
                          </div>
                          <div className="rounded-2xl border border-white/8 bg-white/5 p-3">
                            <Bot className="h-5 w-5 text-cyan-300" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 grid gap-3 rounded-3xl border border-white/8 bg-white/5 p-5 sm:grid-cols-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Checkout</p>
                    <p className="mt-2 text-sm font-medium text-white">USDT and major token path</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Deployment</p>
                    <p className="mt-2 text-sm font-medium text-white">Managed activation and support</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Retention</p>
                    <p className="mt-2 text-sm font-medium text-white">Repeatable operator workflows</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <section className="rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-cyan-300/10 p-3">
                  <Globe2 className="h-5 w-5 text-cyan-300" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Why this matters</p>
                  <h2 className="text-2xl font-semibold text-white">AI adoption fails when the buyer has to become technical.</h2>
                </div>
              </div>
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">
                VoltexBazar is designed around practical buyers. The interface has to explain the job, the
                operating model, the payment rail, and the deployment promise in plain language. That is
                the only way a marketplace like this converts outside AI-native circles.
              </p>
            </section>

            <section className="rounded-[2rem] border border-white/10 bg-[#0a1322] p-8">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Launch flow</p>
              <div className="mt-5 space-y-4">
                {launchTracks.map((item, index) => (
                  <div key={item} className="flex gap-4 rounded-2xl border border-white/8 bg-white/5 p-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cyan-300/12 text-sm font-semibold text-cyan-300">
                      {index + 1}
                    </div>
                    <p className="text-sm leading-6 text-slate-200">{item}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">Designed for real use cases</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
              Three operator groups the marketplace should win first.
            </h2>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
            First launch focus: accessible, understandable, ROI-visible agents.
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {operatorSegments.map((segment) => (
            <div key={segment.title} className="rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-300/12">
                <segment.icon className="h-6 w-6 text-cyan-300" />
              </div>
              <h3 className="mt-6 text-2xl font-semibold text-white">{segment.title}</h3>
              <p className="mt-4 text-base leading-7 text-slate-300">{segment.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-white/6 bg-[#08111d]">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-18 sm:px-6 lg:grid-cols-3 lg:px-8">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8">
            <Coins className="h-6 w-6 text-amber-300" />
            <h3 className="mt-4 text-2xl font-semibold text-white">Crypto-native launch path</h3>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              Start with USDT and USDC on EVM-compatible chains, then widen support only after the
              marketplace operations harden.
            </p>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8">
            <ShieldCheck className="h-6 w-6 text-cyan-300" />
            <h3 className="mt-4 text-2xl font-semibold text-white">Deployment with guardrails</h3>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              Buyers should understand what they are buying, where it runs, and how support works before
              anything goes live.
            </p>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8">
            <Banknote className="h-6 w-6 text-orange-300" />
            <h3 className="mt-4 text-2xl font-semibold text-white">Visible commercial ROI</h3>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              Every listing should speak in terms of recovered leads, faster response time, or higher
              customer throughput, not abstract AI capability claims.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[2.5rem] border border-white/10 bg-[linear-gradient(120deg,rgba(5,10,18,0.96),rgba(9,22,36,0.92))] p-8 sm:p-12">
          <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">Next milestone</p>
              <h2 className="mt-3 max-w-3xl text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
                Turn the marketplace into a clean launch surface for the wider Voltex Network ecosystem.
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">
                VoltexBazar should become the distribution layer where buyers discover agents, understand
                deployment, choose payment, and move into activation without friction.
              </p>
            </div>
            <Link
              href="/auth"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-cyan-300/40 bg-cyan-300/12 px-6 py-4 text-sm font-semibold text-cyan-100 transition-colors hover:bg-cyan-300/20"
            >
              Start Builder Account
              <Zap className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
