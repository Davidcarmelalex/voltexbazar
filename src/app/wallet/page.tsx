"use client";
import { useState } from "react";
import { Copy, CheckCircle, AlertCircle, ExternalLink } from "lucide-react";

const TREASURY_WALLET = "0xa8CBFC06285A23E892Fb74c34a63F28988Beb9C6";

const transactions = [
  { hash: "0x1a2b...3c4d", type: "deposit", token: "USDT", amount: "+200.00", status: "confirmed", date: "May 12, 2026" },
  { hash: "0x5e6f...7a8b", type: "charge", token: "USDT", amount: "-49.00", status: "confirmed", date: "May 1, 2026" },
  { hash: "0x9c0d...1e2f", type: "deposit", token: "USDC", amount: "+100.00", status: "confirmed", date: "Apr 28, 2026" },
];

export default function WalletPage() {
  const [copied, setCopied] = useState(false);

  const copyAddress = async () => {
    await navigator.clipboard.writeText(TREASURY_WALLET);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(139,92,246,0.07),transparent_35%),linear-gradient(180deg,#09090b_0%,#000_100%)] text-white">
      <section className="mx-auto max-w-3xl px-6 py-20">
        <h1 className="text-3xl font-bold mb-2">Wallet</h1>
        <p className="text-silver mb-10">Manage your USDT/USDC balance for agent subscriptions.</p>

        {/* Balance */}
        <div className="grid gap-4 grid-cols-2 mb-8">
          <div className="rounded-xl border border-white/8 bg-white/3 p-6">
            <p className="text-xs text-silver/60 mb-2">USDT Balance</p>
            <p className="text-3xl font-bold text-white">251.00</p>
            <p className="text-xs text-silver/60 mt-1">Available</p>
          </div>
          <div className="rounded-xl border border-white/8 bg-white/3 p-6">
            <p className="text-xs text-silver/60 mb-2">USDC Balance</p>
            <p className="text-3xl font-bold text-white">100.00</p>
            <p className="text-xs text-silver/60 mt-1">Available</p>
          </div>
        </div>

        {/* Deposit */}
        <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-6 mb-8">
          <h2 className="font-semibold text-white mb-4">Deposit USDT or USDC</h2>
          <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-3 mb-3">
            <code className="flex-1 text-xs text-silver font-mono truncate">{TREASURY_WALLET}</code>
            <button onClick={copyAddress} className="flex-shrink-0 text-silver hover:text-purple-400 transition-colors">
              {copied ? <CheckCircle className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
          <div className="flex items-start gap-2 text-xs text-silver/60">
            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5 text-gold" />
            <p>Send only USDT or USDC (ERC-20) on EVM-compatible networks to this address. Other tokens will not be credited.</p>
          </div>
        </div>

        {/* Transactions */}
        <div className="rounded-xl border border-white/8 bg-white/3">
          <div className="p-5 border-b border-white/8">
            <h2 className="font-semibold text-white">Transaction History</h2>
          </div>
          <div className="divide-y divide-white/5">
            {transactions.map((tx) => (
              <div key={tx.hash} className="flex items-center gap-4 p-4">
                <div className={`h-2 w-2 rounded-full flex-shrink-0 ${tx.type === "deposit" ? "bg-emerald-400" : "bg-red-400"}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white capitalize">{tx.type}</span>
                    <span className="text-xs text-silver/60">{tx.token}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-silver/40">
                    <span className="font-mono truncate">{tx.hash}</span>
                    <ExternalLink className="h-3 w-3 flex-shrink-0" />
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-semibold ${tx.type === "deposit" ? "text-emerald-400" : "text-silver"}`}>{tx.amount}</div>
                  <div className="text-xs text-silver/40">{tx.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
