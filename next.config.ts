import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // Autoriser les requêtes cross-origin pour le preview
  allowedDevOrigins: [
    'preview-chat-75aca206-7be6-45e6-92d7-7d3b6db085a4.space.z.ai',
    '.space.z.ai',
    'localhost:3000'
  ],
};

export default nextConfig;
