"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Menu, X, Rocket, LayoutDashboard, Wallet, Bot, LogOut } from "lucide-react";
import Button from "../ui/Button";
import api from "@/lib/api";

type NavUser = {
  id: string;
  name: string;
};

export default function Navbar() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<NavUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const navLinks = [
    { href: "/marketplace", label: "Marketplace", icon: Bot },
    { href: "/pricing", label: "Pricing", icon: Wallet },
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/wallet", label: "Wallet", icon: Wallet },
  ];

  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      try {
        const result = await api.getMe();
        if (mounted) {
          setUser(result.user);
        }
      } catch {
        if (mounted) {
          setUser(null);
        }
      } finally {
        if (mounted) {
          setAuthLoading(false);
        }
      }
    }

    loadUser();
    return () => {
      mounted = false;
    };
  }, []);

  async function handleLogout() {
    await api.logout().catch(() => null);
    setUser(null);
    router.push("/auth");
    router.refresh();
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#05070D]/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00E5FF] to-[#7B61FF] flex items-center justify-center">
                <Rocket className="w-6 h-6 text-[#05070D]" />
              </div>
              <div className="absolute inset-0 rounded-xl bg-[#00E5FF] opacity-30 blur-lg group-hover:opacity-50 transition-opacity" />
            </div>
            <span className="text-xl font-bold font-[family-name:var(--font-orbitron)] tracking-wider">
              <span className="text-[#00E5FF]">VOLTEX</span>
              <span className="text-white">BAZAR</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-2 text-[#A0AEC0] hover:text-[#00E5FF] transition-colors"
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            ))}
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#718096]" />
              <input
                type="text"
                placeholder="Search launch-ready agents..."
                className="w-72 bg-[#0A0F1C] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-[#718096] focus:outline-none focus:border-[#00E5FF] transition-colors"
              />
            </div>
            {authLoading ? null : user ? (
              <>
                <span className="text-sm text-[#A0AEC0]">Signed in as <span className="text-white">{user.name}</span></span>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm text-white hover:border-[#00E5FF]/40"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <Link href="/auth">
                <Button variant="secondary" size="sm">
                  Login
                </Button>
              </Link>
            )}
            <Link href="/marketplace">
              <Button size="sm">
                Launch An Agent
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-[#A0AEC0]"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-[#0A0F1C] border-t border-white/5"
          >
            <div className="px-4 py-4 space-y-4">
              {/* Mobile Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#718096]" />
                <input
                  type="text"
                  placeholder="Search launch-ready agents..."
                  className="w-full bg-[#101826] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-[#718096] focus:outline-none focus:border-[#00E5FF]"
                />
              </div>

              {/* Mobile Links */}
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-3 text-[#A0AEC0] hover:text-[#00E5FF] py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <link.icon className="w-5 h-5" />
                  {link.label}
                </Link>
              ))}

              <div className="flex gap-3 pt-4 border-t border-white/5">
                {user ? (
                  <button onClick={handleLogout} className="flex-1">
                    <Button variant="secondary" size="sm" className="w-full">
                      Logout
                    </Button>
                  </button>
                ) : (
                  <Link href="/auth" className="flex-1">
                    <Button variant="secondary" size="sm" className="w-full">
                      Login
                    </Button>
                  </Link>
                )}
                <Link href="/marketplace" className="flex-1">
                  <Button size="sm" className="w-full">
                    Launch
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
