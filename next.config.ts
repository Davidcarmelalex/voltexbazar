import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: __dirname,
  async rewrites() {
    const apiUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl || apiUrl.startsWith("/")) {
      return [];
    }

    const backendBase = apiUrl.replace(/\/api$/, "");
    return [
      {
        source: "/api/:path*",
        destination: `${backendBase}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
