import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "8mb",
      // The preview proxy forwards localhost as its host while the browser uses
      // a per-preview e2b.app origin. Keep this limited to the preview domain.
      allowedOrigins: ["*.e2b.app"],
    },
  },
};

export default nextConfig;
