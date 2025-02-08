import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "frontend-take-home.fetch.com",
        port: "",
        pathname: "/dog-images/**"
      }
    ]
  }
};

export default nextConfig;
