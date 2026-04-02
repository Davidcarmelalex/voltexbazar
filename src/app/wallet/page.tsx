"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Copy,
  ExternalLink,
  RefreshCw,
  Shield,
  TrendingUp,
  Wallet,
  Zap,
} from "lucide-react";
import api, { Payment, Wallet as ApiWallet } from "@/lib/api";

type Transaction = {
  id: string;
  type: string;
  amount: number;
  status: string;
  date?: string;
};

export default function WalletPage() {
  const [wallet, setWallet] = useState<ApiWallet | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [depositAmount, setDepositAmount] = useState("149");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawAddress, setWithdrawAddress] = useState("");
  const [paymentIntent, setPaymentIntent] = useState<Payment | null>(null);

  const loadWalletData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [walletRes, transactionsRes] = await Promise.all([
        api.getWallet(),
        api.getTransactions(),
      ]);

      if (walletRes.success) {
        setWallet(walletRes.wallet);
      }
      if (transactionsRes.success) {
        setTransactions(transactionsRes.transactions);
      }
    } catch {
      setError("Failed to load wallet data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWalletData();
  }, []);

  const copyAddress = () => {
    const target = paymentIntent?.address || wallet?.address;
    if (!target) return;
    navigator.clipboard.writeText(target);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCreatePayment = async () => {
    try {
      setError(null);
      setStatusMessage(null);
      const response = await api.createPayment(Number(depositAmount), "growth");
      setPaymentIntent(response.payment);
      setStatusMessage("Payment order created. Send funds to the generated deposit reference.");
      await loadWalletData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create payment order");
    }
  };

  const handleWithdraw = async () => {
    try {
      setError(null);
      setStatusMessage(null);
      await api.withdraw(Number(withdrawAmount), withdrawAddress);
      setWithdrawAmount("");
      setWithdrawAddress("");
      setStatusMessage("Withdrawal request queued for review.");
      await loadWalletData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit withdrawal");
    }
  };

  return (
    <main className="min-h-screen bg-[#05070D]">
      <Navbar />
      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-3xl font-bold font-[family-name:var(--font-orbitron)] mb-2 text-white">Wallet</h1>
            <p className="text-[#A0AEC0]">Manage treasury deposits, pending confirmations, and withdrawal requests.</p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-gradient-to-br from-[#7B61FF]/30 to-[#00E5FF]/30 border border-white/10 rounded-2xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[#00E5FF]/20 flex items-center justify-center">
                      <Wallet className="w-6 h-6 text-[#00E5FF]" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-white">Treasury Balance</h2>
                      <p className="text-sm text-[#718096]">{paymentIntent?.currency || "USDT"} ({paymentIntent?.network || "Configured chain"})</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-[#00FFC6]/20 text-[#00FFC6] rounded-full text-sm">
                    <Shield className="w-4 h-4" />
                    Secure
                  </div>
                </div>

                {loading ? (
                  <div className="text-4xl font-bold text-white mb-2">Loading...</div>
                ) : error ? (
                  <div className="text-4xl font-bold text-[#FF7A00] mb-2">Action required</div>
                ) : (
                  <div className="text-4xl font-bold text-white mb-2">${(wallet?.balance || 0).toFixed(2)}</div>
                )}

                <div className="flex items-center gap-2 text-sm text-[#718096] mb-6">
                  <span className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4 text-[#00FFC6]" />
                    Funding and settlement visibility
                  </span>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <button onClick={handleCreatePayment} className="flex items-center justify-center gap-2 py-3 bg-[#00E5FF] text-[#05070D] font-semibold rounded-xl hover:bg-[#00FFC6] transition-colors">
                    <ArrowUpRight className="w-5 h-5" />
                    Create Deposit Order
                  </button>
                  <button onClick={handleWithdraw} className="flex items-center justify-center gap-2 py-3 bg-[#101826] border border-white/10 text-white font-semibold rounded-xl hover:bg-[#101826]/80 transition-colors">
                    <ArrowDownLeft className="w-5 h-5" />
                    Queue Withdrawal
                  </button>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-[#0A0F1C] border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#718096] mb-1">Pending</p>
                    <p className="text-2xl font-bold text-white">${(wallet?.pendingBalance || 0).toFixed(2)}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-[#FF7A00]/20 flex items-center justify-center">
                    <RefreshCw className="w-6 h-6 text-[#FF7A00]" />
                  </div>
                </div>
                <p className="text-xs text-[#718096] mt-2">
                  {transactions.filter((t) => t.status === "pending" || t.status === "processing").length} transaction(s) awaiting final settlement or review
                </p>
              </motion.div>

              {statusMessage ? (
                <div className="rounded-xl border border-[#00FFC6]/30 bg-[#00FFC6]/10 p-4 text-sm text-[#CCFFF4]">
                  {statusMessage}
                </div>
              ) : null}

              {error ? (
                <div className="rounded-xl border border-[#FF7A00]/30 bg-[#FF7A00]/10 p-4 text-sm text-[#FFD8B0]">
                  {error}
                </div>
              ) : null}

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-[#0A0F1C] border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-white">Recent Transactions</h2>
                  <button onClick={loadWalletData} className="text-sm text-[#00E5FF] hover:underline">Refresh</button>
                </div>
                <div className="space-y-4">
                  {transactions.length ? transactions.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-4 bg-[#101826] rounded-xl">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tx.type === "deposit" ? "bg-[#00FFC6]/20" : tx.type === "payment" ? "bg-[#00E5FF]/20" : "bg-[#FF7A00]/20"}`}>
                          {tx.type === "deposit" ? <ArrowDownLeft className="w-5 h-5 text-[#00FFC6]" /> : tx.type === "payment" ? <Zap className="w-5 h-5 text-[#00E5FF]" /> : <ArrowUpRight className="w-5 h-5 text-[#FF7A00]" />}
                        </div>
                        <div>
                          <p className="text-white font-medium capitalize">{tx.type}</p>
                          <p className="text-xs text-[#718096]">{tx.date || "Pending timestamp"}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${tx.type === "deposit" ? "text-[#00FFC6]" : tx.type === "payment" ? "text-white" : "text-[#FF7A00]"}`}>
                          {tx.type === "deposit" ? "+" : "-"}${tx.amount}
                        </p>
                        <p className={`text-xs ${tx.status === "completed" ? "text-[#00FFC6]" : "text-[#FF7A00]"}`}>{tx.status}</p>
                      </div>
                    </div>
                  )) : (
                    <div className="rounded-xl border border-white/10 bg-[#101826] p-5 text-sm text-[#718096]">
                      No transactions yet. Create your first payment order to start the ledger.
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            <div className="space-y-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-[#0A0F1C] border border-white/10 rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Deposit Order</h2>
                <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-[#718096]">Amount</label>
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="mb-4 w-full rounded-xl border border-white/10 bg-[#101826] px-4 py-3 text-white focus:outline-none focus:border-[#00E5FF]"
                />
                <div className="p-4 bg-[#101826] rounded-xl mb-4">
                  <p className="text-xs text-[#718096] mb-2">{paymentIntent?.currency || "USDT"} ({paymentIntent?.network || "Configured chain"})</p>
                  <p className="text-sm text-white font-mono break-all">{paymentIntent?.address || wallet?.address || "Create a deposit order to get a unique reference."}</p>
                </div>
                {paymentIntent?.instructions ? (
                  <p className="mb-4 text-xs leading-6 text-[#A0AEC0]">{paymentIntent.instructions}</p>
                ) : null}
                <button onClick={copyAddress} className="w-full flex items-center justify-center gap-2 py-3 bg-[#00E5FF]/20 text-[#00E5FF] rounded-xl font-medium hover:bg-[#00E5FF]/30 transition-colors">
                  <Copy className="w-4 h-4" /> {copied ? "Copied!" : "Copy Address"}
                </button>
                <p className="text-xs text-[#718096] mt-3 text-center">Send only the configured token to this address.</p>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-[#0A0F1C] border border-white/10 rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Withdrawal Request</h2>
                <div className="space-y-3">
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="Amount"
                    className="w-full rounded-xl border border-white/10 bg-[#101826] px-4 py-3 text-white focus:outline-none focus:border-[#00E5FF]"
                  />
                  <input
                    type="text"
                    value={withdrawAddress}
                    onChange={(e) => setWithdrawAddress(e.target.value)}
                    placeholder="Destination wallet address"
                    className="w-full rounded-xl border border-white/10 bg-[#101826] px-4 py-3 text-white focus:outline-none focus:border-[#00E5FF]"
                  />
                  <button onClick={handleWithdraw} className="w-full flex items-center justify-center gap-3 p-3 bg-[#101826] rounded-xl text-white hover:bg-[#101826]/80">
                    <ArrowDownLeft className="w-5 h-5 text-[#FF7A00]" />
                    <span className="text-sm">Queue Withdrawal</span>
                  </button>
                  <button onClick={loadWalletData} className="w-full flex items-center gap-3 p-3 bg-[#101826] rounded-xl text-white hover:bg-[#101826]/80">
                    <RefreshCw className="w-5 h-5 text-[#00E5FF]" />
                    <span className="text-sm">Refresh Balance</span>
                  </button>
                  <button className="w-full flex items-center gap-3 p-3 bg-[#101826] rounded-xl text-white hover:bg-[#101826]/80">
                    <ExternalLink className="w-5 h-5 text-[#7B61FF]" />
                    <span className="text-sm">View on Explorer</span>
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
