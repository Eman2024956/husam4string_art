import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Arabic is the primary language: the bare domain opens the Arabic site.
  async redirects() {
    return [{ source: "/", destination: "/ar", permanent: false }];
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
