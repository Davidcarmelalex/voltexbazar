import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://voltexbazar.io"),
  title: "VoltexBazar | AI Agent Marketplace for the Voltex Network",
  description:
    "VoltexBazar is the Voltex Network marketplace for deployable AI agents built for UAE operators, service businesses, and modern commerce teams.",
  keywords: [
    "voltexbazar",
    "voltex network",
    "AI agents",
    "UAE marketplace",
    "automation",
    "crypto payments",
  ],
  openGraph: {
    title: "VoltexBazar | AI Agent Marketplace for the Voltex Network",
    description:
      "AI agents for real-world operators, with crypto-first checkout and a launch model built around UAE business reality.",
    url: "https://voltexbazar.io",
    siteName: "VoltexBazar",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
