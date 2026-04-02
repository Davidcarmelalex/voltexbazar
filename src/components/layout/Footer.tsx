"use client";

import Link from "next/link";
import { Rocket, Github, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  const footerLinks = {
    Product: [
      { label: "Marketplace", href: "/marketplace" },
      { label: "Pricing", href: "/pricing" },
      { label: "Wallet", href: "/wallet" },
      { label: "Dashboard", href: "/dashboard" },
    ],
    Company: [
      { label: "Voltex Network", href: "/" },
      { label: "UAE Launch Thesis", href: "/pricing" },
      { label: "Marketplace Access", href: "/auth" },
      { label: "Contact", href: "mailto:hello@voltex.network" },
    ],
    Resources: [
      { label: "Launch Readiness", href: "/pricing" },
      { label: "Agent Categories", href: "/marketplace" },
      { label: "Operator Setup", href: "/dashboard" },
      { label: "Support", href: "mailto:hello@voltex.network" },
    ],
    Legal: [
      { label: "Payments", href: "/wallet" },
      { label: "Platform Access", href: "/auth" },
      { label: "Security", href: "/dashboard" },
    ],
  };

  const socialLinks = [
    { icon: Github, href: "#", label: "GitHub" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Mail, href: "mailto:hello@voltex.network", label: "Email" },
  ];

  return (
    <footer className="bg-[#0A0F1C] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00E5FF] to-[#7B61FF] flex items-center justify-center">
                <Rocket className="w-6 h-6 text-[#05070D]" />
              </div>
              <span className="text-xl font-bold font-[family-name:var(--font-orbitron)] tracking-wider">
                <span className="text-[#00E5FF]">VOLTEX</span>
                <span className="text-white">BAZAR</span>
              </span>
            </Link>
            <p className="text-[#718096] text-sm mb-6 max-w-xs">
              The Voltex Network marketplace for launch-ready AI agents built for operators, service teams, and UAE-facing businesses.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 rounded-lg bg-[#101826] border border-white/5 flex items-center justify-center text-[#718096] hover:text-[#00E5FF] hover:border-[#00E5FF] transition-all"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-white font-semibold mb-4">{title}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[#718096] text-sm hover:text-[#00E5FF] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[#718096] text-sm">
            © 2026 VoltexBazar. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-[#718096] text-sm">Powered by</span>
            <span className="text-[#00E5FF] font-semibold">Voltex Network</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
