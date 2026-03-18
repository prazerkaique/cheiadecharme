import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@cheia/ui", "@cheia/db", "@cheia/types"],
};

export default nextConfig;
