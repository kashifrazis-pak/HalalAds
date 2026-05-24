/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  redirects: async () => [
    { source: "/login", destination: "/auth/signin", permanent: true },
    { source: "/signin", destination: "/auth/signin", permanent: true },
    { source: "/sign-in", destination: "/auth/signin", permanent: true },
    { source: "/logout", destination: "/api/auth/signout", permanent: false },
  ],
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
