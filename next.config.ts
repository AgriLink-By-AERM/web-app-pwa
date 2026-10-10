import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  ...(process.env.NODE_ENV === "development" ? { rewrites: async () => [{ source: "/api/v1/:path*", destination: `${process.env.FARMTRY_API_UPSTREAM || "http://localhost:5002"}/api/v1/:path*` }] } : {}),
  output: "export",
  images: {
    unoptimized: true
  }
};

export default nextConfig;
