import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ArrowRight, Coins, Rocket, ShieldCheck, Wallet } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "$49",
    cadence: "/month",
    audience: "For solo operators testing their first AI workflow",
    features: [
      "One launch-ready agent",
      "Crypto-first checkout",
      "Deployment onboarding path",
      "Basic operator dashboard",
    ],
  },
  {
    name: "Growth",
    price: "$149",
    cadence: "/month",
    audience: "For service teams and lean businesses that need repeatable automation",
    features: [
      "Multiple agent categories",
      "Priority deployment queue",
      "Wallet and transaction visibility",
      "Commercial workflow support",
    ],
    featured: true,
  },
  {
    name: "Operator",
    price: "Custom",
    cadence: "",
    audience: "For organizations that want managed rollout and deeper Voltex support",
    features: [
      "Custom deployment model",
      "Managed activation support",
      "Higher-touch operating design",
      "Scaled commercial rollout planning",
    ],
  },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[#05070D] text-white">
      <Navbar />
      <section className="border-b border-white/8 pt-24">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.24em] text-[#00E5FF]">
              <Coins className="h-4 w-4" />
              Pricing built for real deployment, not vanity tiers
            </div>
            <h1 className="mt-6 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
              Clear plans for buyers who care about outcomes, not AI jargon.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#A0AEC0]">
              VoltexBazar pricing is structured around launch readiness, payment clarity, and deployment support.
              The product should feel easy to buy and easy to trust.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-[2rem] border p-8 ${
                plan.featured
                  ? "border-[#00E5FF]/40 bg-[linear-gradient(180deg,rgba(0,229,255,0.10),rgba(10,15,28,0.94))]"
                  : "border-white/10 bg-white/5"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.22em] text-[#00E5FF]">{plan.name}</p>
                  <div className="mt-4 flex items-end gap-2">
                    <span className="text-4xl font-semibold text-white">{plan.price}</span>
                    <span className="pb-1 text-sm text-[#718096]">{plan.cadence}</span>
                  </div>
                </div>
                {plan.featured ? (
                  <span className="rounded-full bg-[#00E5FF]/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#00E5FF]">
                    Best launch fit
                  </span>
                ) : null}
              </div>

              <p className="mt-5 text-sm leading-7 text-[#A0AEC0]">{plan.audience}</p>

              <ul className="mt-8 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-white">
                    <span className="mt-1 h-2 w-2 rounded-full bg-[#00FFC6]" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/auth"
                className={`mt-8 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-4 text-sm font-semibold transition-colors ${
                  plan.featured
                    ? "bg-[#00E5FF] text-[#05070D] hover:bg-[#00FFC6]"
                    : "border border-white/10 bg-[#101826] text-white hover:border-[#00E5FF]/40"
                }`}
              >
                Start With {plan.name}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {[
            {
              icon: Wallet,
              title: "Crypto-first payment path",
              body: "Launches start with USDT and USDC on EVM-compatible chains instead of scattered billing options.",
            },
            {
              icon: ShieldCheck,
              title: "Deployment guardrails",
              body: "Plans are framed around what can be activated credibly, not fake enterprise promises.",
            },
            {
              icon: Rocket,
              title: "Built to go live",
              body: "Each tier maps to a launch posture so the buyer understands the next step immediately.",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-[2rem] border border-white/10 bg-[#0A0F1C] p-6">
              <item.icon className="h-5 w-5 text-[#00E5FF]" />
              <h2 className="mt-4 text-xl font-semibold text-white">{item.title}</h2>
              <p className="mt-3 text-sm leading-7 text-[#A0AEC0]">{item.body}</p>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
}
