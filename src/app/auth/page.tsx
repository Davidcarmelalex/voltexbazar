"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Lock, Mail, Phone, Rocket, User } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import api from "@/lib/api";

export default function Auth() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const resetMessages = () => {
    setError("");
    setSuccess("");
  };

  const handleEmailAuth = async () => {
    resetMessages();
    setLoading(true);

    try {
      if (isLogin) {
        await api.login(email, password);
        setSuccess("Login successful. Redirecting to your dashboard.");
      } else {
        await api.register(name, email, phone, password);
        setSuccess("Account created successfully. Redirecting to your dashboard.");
      }

      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async () => {
    if (phone.length < 10) return;
    resetMessages();
    setLoading(true);

    try {
      await api.sendOTP(phone);
      setOtpSent(true);
      setSuccess("OTP sent successfully. Enter the six-digit code to continue.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) return;
    resetMessages();
    setLoading(true);

    try {
      await api.verifyOTP(phone, otp);
      setSuccess("Phone login successful. Redirecting to your dashboard.");
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#05070D] flex">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#00E5FF]/20 to-[#7B61FF]/20" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
            <div className="relative mb-8">
              <div className="w-48 h-48 rounded-full bg-gradient-to-br from-[#00E5FF] to-[#7B61FF] flex items-center justify-center mx-auto">
                <div className="w-40 h-40 rounded-full bg-[#05070D] flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#00E5FF]/20 to-[#7B61FF]/20 flex items-center justify-center">
                    <span className="text-7xl">🤖</span>
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 rounded-full border-2 border-[#00E5FF]/50 animate-pulse" style={{ animationDuration: "2s" }} />
            </div>

            <h2 className="text-3xl font-bold font-[family-name:var(--font-orbitron)] mb-4">
              <span className="text-white">Welcome to </span>
              <span className="text-[#00E5FF]">VoltexBazar</span>
            </h2>
            <p className="text-[#A0AEC0] max-w-md">
              AI agents for UAE businesses, expats, and busy teams. Create an account, fund your wallet, and launch operators without technical setup.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00E5FF] to-[#7B61FF] flex items-center justify-center">
              <Rocket className="w-6 h-6 text-[#05070D]" />
            </div>
            <span className="text-xl font-bold font-[family-name:var(--font-orbitron)]">
              <span className="text-[#00E5FF]">VOLTEX</span>
              <span className="text-white">BAZAR</span>
            </span>
          </div>

          <div className="flex bg-[#0A0F1C] border border-white/10 rounded-xl p-1 mb-8">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 rounded-lg text-sm font-medium transition-colors ${isLogin ? "bg-[#00E5FF] text-[#05070D]" : "text-[#718096] hover:text-white"}`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 rounded-lg text-sm font-medium transition-colors ${!isLogin ? "bg-[#00E5FF] text-[#05070D]" : "text-[#718096] hover:text-white"}`}
            >
              Sign Up
            </button>
          </div>

          <h1 className="text-2xl font-bold text-white mb-2">{isLogin ? "Welcome back" : "Create account"}</h1>
          <p className="text-[#718096] mb-8">
            {isLogin ? "Login to manage your AI agents and wallet." : "Create your account and launch your first AI operator."}
          </p>

          <button
            onClick={() => api.beginGoogleLogin()}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 p-4 mb-6 bg-white text-[#05070D] rounded-xl font-semibold hover:bg-white/90 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Start Your AI Workforce
          </button>

          <p className="text-sm text-[#A0AEC0] mb-8 text-center">Start fast with Google or use direct email access below.</p>

          <div className="space-y-4">
            {!isLogin ? (
              <div className="relative">
                <User className="absolute left-3 top-[43px] w-5 h-5 text-[#718096]" />
                <Input label="Full Name" placeholder="David Carmel Alex" value={name} onChange={(e) => setName(e.target.value)} className="pl-10" />
              </div>
            ) : null}

            <div className="relative">
              <Mail className="absolute left-3 top-[43px] w-5 h-5 text-[#718096]" />
              <Input label="Email Address" type="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-[43px] w-5 h-5 text-[#718096]" />
              <Input
                label="Password"
                type="password"
                placeholder={isLogin ? "Enter your password" : "Create a strong password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="relative">
              <Phone className="absolute left-3 top-[43px] w-5 h-5 text-[#718096]" />
              <Input label="Phone Number" type="tel" placeholder="+971 50 000 0000" value={phone} onChange={(e) => setPhone(e.target.value)} className="pl-10" />
            </div>

            <Button onClick={handleEmailAuth} className="w-full" size="lg" disabled={loading || !email || !password || (!isLogin && (!name || !phone))}>
              {loading ? "Processing..." : isLogin ? "Login With Email" : "Create Account"}
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>

          <div className="my-8 rounded-2xl border border-white/10 bg-[#0A0F1C] p-5">
            <p className="text-sm font-semibold text-white">Phone login fallback</p>
            <p className="mt-2 text-sm text-[#718096]">Use OTP when you want a lighter mobile login path.</p>

            <div className="mt-4 space-y-4">
              {otpSent ? (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                  <label className="block text-sm font-medium text-[#A0AEC0] mb-2">Enter OTP</label>
                  <input
                    type="text"
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    className="w-full bg-[#101826] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-[#718096] focus:outline-none focus:border-[#00E5FF] text-center tracking-widest font-mono text-xl"
                    maxLength={6}
                  />
                </motion.div>
              ) : null}

              {!otpSent ? (
                <Button onClick={handleSendOTP} className="w-full" size="lg" disabled={loading || phone.length < 10}>
                  {loading ? "Sending..." : "Send OTP"}
                  <ArrowRight className="w-5 h-5" />
                </Button>
              ) : (
                <Button onClick={handleVerifyOTP} className="w-full" size="lg" disabled={loading || otp.length !== 6}>
                  {loading ? "Verifying..." : "Verify & Login"}
                  <ArrowRight className="w-5 h-5" />
                </Button>
              )}
            </div>
          </div>

          {error ? <p className="mt-4 text-sm text-[#FF6B6B]">{error}</p> : null}
          {success ? <p className="mt-4 text-sm text-[#00FFC6]">{success}</p> : null}

          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-sm text-[#718096]">operational access</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <p className="mt-8 text-center text-sm text-[#718096]">
            By continuing, you agree to our <a href="#" className="text-[#00E5FF] hover:underline">Terms</a> and <a href="#" className="text-[#00E5FF] hover:underline">Privacy Policy</a>
          </p>
        </motion.div>
      </div>
    </main>
  );
}
