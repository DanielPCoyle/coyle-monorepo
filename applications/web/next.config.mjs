/* eslint-disable */
/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@coyle/database"],
  env: {
    NEXT_PUBLIC_BUILDER_API_KEY: process.env.NEXT_PUBLIC_BUILDER_API_KEY,
    NEXT_PUBLIC_INKSOFT_STORE: process.env.NEXT_PUBLIC_INKSOFT_STORE,
    NEXT_PUBLIC_ALGOLIA_CLIENT_KEY: process.env.NEXT_PUBLIC_ALGOLIA_CLIENT_KEY,
    NEXT_PUBLIC_ALGOLIA_CLIENT_ID: process.env.NEXT_PUBLIC_ALGOLIA_CLIENT_ID,
    NEXT_PUBLIC_SOCKET_SITE: process.env.NEXT_PUBLIC_SOCKET_SITE,
    NEXT_PUBLIC_OPEN_AI_KEY: process.env.NEXT_PUBLIC_OPEN_AI_KEY,
    NEXT_PUBLIC_BUILDER_IO_PRIVATE_KEY:
      process.env.NEXT_PUBLIC_BUILDER_IO_PRIVATE_KEY,
    NEXT_PUBLIC_BUILDER_IO_PUBLIC_KEY:
      process.env.NEXT_PUBLIC_BUILDER_IO_PUBLIC_KEY,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_JWT_SECRET: process.env.NEXT_PUBLIC_JWT_SECRET,
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.inksoft.com",
      },
      {
        protocol: "https",
        hostname: "cdn.builder.io",
      },
      {
        protocol: "https",
        hostname: "bsoonvbgwrslsigymsmn.supabase.co",
      },
      {
        protocol: "https",
        hostname: "qsiqcduxfmdzxqqsupte.supabase.co",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/store/:path*", // Define your endpoint path
        destination: "https://cdn.inksoft.com/get_a_store/:path*", // Proxy to external URL
      },
    ];
  },
};

export default nextConfig;
