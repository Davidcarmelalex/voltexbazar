"use client";
import Link from "next/link";
import { Check, Zap } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "Free",
    period: "",
    description: "Explore the marketplace and test agents before deploying.",
    features: [
      "Access to marketplace",
      "1 agent (limited)",
      "500 tasks / month",
      "Email support",
      "Community access",
    ],
    cta: "Get Started",
    href: "/auth/register",
    highlighted: false,
  },
  {
    name: "Operator",
    price: "149",
    period: "USDT / month",
    description: "For businesses ready to deploy agents and automate operations.",
    features: [
      "Up to 5 active agents",
      "50,000 tasks / month",
      "All marketplace agents",
      "Custom agent configuration",
      "Priority support",
      "Webhook integrations",
      "Analytics dashboard",
    ],
    cta: "Deploy Now",
    href: "/auth/register?plan=operator",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For institutions that need dedicated infrastructure and SLAs.",
    features: [
      "Unlimited agents",
      "Unlimited tasks",
      "Dedicated deployment",
      "Custom agent development",
      "SLA guarantees",
      "White-label option",
      "Dedicated account manager",
      "On-premise deployment",
    ],
    cta: "Contact Sales",
    href: "/support",
    highlighted: false,
  },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(139,92,246,0.08),transparent_35%),linear-gradient(180deg,#09090b_0%,#000_100%)] text-white">
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-medium tracking-[0.2em] text-purple-300 uppercase mb-6">
            Pricing
          </span>
          <h1 className="text-4xl font-bold md:text-5xl">Simple, transparent pricing</h1>
          <p className="mt-4 text-silver max-w-xl mx-auto">
            Pay in USDT or USDC. No hidden fees. Cancel anytime. Deploy agents in minutes.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-xl border p-8 flex flex-col ${
                plan.highlighted
                  ? "border-purple-500/50 bg-purple-500/10 ring-1 ring-purple-500/20"
                  : "border-white/8 bg-white/3"
              }`}
            >
              {plan.highlighted && (
                <div className="flex items-center gap-1.5 text-xs font-medium text-purple-300 mb-4">
                  <Zap className="h-3.5 w-3.5" /> Most popular
                </div>
              )}
              <h2 className="text-lg font-semibold text-white">{plan.name}</h2>
              <div className="mt-3 mb-2">
                <span className="text-4xl font-bold text-white">{plan.price}</span>
                {plan.period && <span className="text-sm text-silver ml-2">{plan.period}</span>}
              </div>
              <p className="text-sm text-silver mb-6">{plan.description}</p>
              <ul className="space-y-3 flex-1 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-silver">
                    <Check className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href={plan.href}
                className={`rounded border px-6 py-3 text-sm font-medium text-center transition-colors ${
                  plan.highlighted
                    ? "border-purple-500/60 bg-purple-500/20 text-purple-200 hover:bg-purple-500/30"
                    : "border-white/10 text-silver hover:border-white/30"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-sm text-silver/60">
            All plans accept USDT and USDC on EVM-compatible networks.{" "}
            <Link href="/wallet" className="text-purple-400 hover:text-purple-300">Set up your wallet →</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
