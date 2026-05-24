/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  headers: async () => [
    {
      source: "/api/serve/:path*",
      headers: [
        { key: "Access-Control-Allow-Origin", value: "*" },
        { key: "Access-Control-Allow-Methods", value: "GET" },
      ],
    },
    {
      source: "/api/track/:path*",
      headers: [
        { key: "Access-Control-Allow-Origin", value: "*" },
        { key: "Access-Control-Allow-Methods", value: "GET" },
      ],
    },
  ],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" },
    ],
  },
};

export default nextConfig;
