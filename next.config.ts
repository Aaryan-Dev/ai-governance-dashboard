import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // e2e builds into its own folder so `next build` can never corrupt a running `next dev`.
  distDir: process.env.NEXT_DIST_DIR ?? ".next",
};

export default nextConfig;
