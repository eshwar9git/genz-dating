import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hide the floating "N" Next.js dev badge (shows in emulator/WebView during npm run dev)
  devIndicators: false,
  // Allow Capacitor Android emulator / LAN origins to hit the Next dev server
  allowedDevOrigins: [
    "10.0.2.2",
    "localhost",
    "127.0.0.1",
    "10.0.0.168",
    // Capacitor iOS Simulator / device WebView origins
    "capacitor://localhost",
    "ionic://localhost",
  ],
  images: {
    // Next 16 defaults to qualities: [75] only — higher values are clamped
    // and full-bleed cards look soft. Allow 90 for Discover / Reels.
    qualities: [75, 90],
    deviceSizes: [640, 750, 828, 1080, 1200, 1600, 1920, 2048, 3840],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "**.tiktokcdn.com",
      },
      {
        protocol: "https",
        hostname: "**.tiktokcdn-us.com",
      },
    ],
  },
};

export default nextConfig;
