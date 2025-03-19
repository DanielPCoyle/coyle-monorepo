/* eslint-disable */
/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@coyle/chat-db"],
  async headers() {
    return [
      {
        source: "/api/:path*", // Allow all API endpoints
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "https://shop.philaprints.com", // Allow subdomain
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, OPTIONS, PUT, DELETE",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "X-Requested-With, Content-Type, Authorization",
          },
        ],
      },
    ];
  },
  env: {
    NEXT_PUBLIC_BUILDER_API_KEY: process.env.NEXT_PUBLIC_BUILDER_API_KEY,
    NEXT_PUBLIC_INKSOFT_STORE: process.env.NEXT_PUBLIC_INKSOFT_STORE,
    NEXT_PUBLIC_ALGOLIA_CLIENT_KEY: process.env.NEXT_PUBLIC_ALGOLIA_CLIENT_KEY,
    NEXT_PUBLIC_ALGOLIA_CLIENT_ID: process.env.NEXT_PUBLIC_ALGOLIA_CLIENT_ID,
    NEXT_PUBLIC_OPEN_AI_KEY: process.env.NEXT_PUBLIC_OPEN_AI_KEY,
    NEXT_PUBLIC_BUILDER_IO_PRIVATE_KEY:process.env.NEXT_PUBLIC_BUILDER_IO_PRIVATE_KEY,
    NEXT_PUBLIC_BUILDER_IO_PUBLIC_KEY:process.env.NEXT_PUBLIC_BUILDER_IO_PUBLIC_KEY,
    NEXT_PUBLIC_JWT_SECRET: process.env.NEXT_PUBLIC_JWT_SECRET,
    NEXT_PUBLIC_EMAIL: process.env.NEXT_PUBLIC_EMAIL,
    NEXT_PUBLIC_EMAIL_APP_PASSWORD: process.env.NEXT_PUBLIC_EMAIL_APP_PASSWORD,
    REACT_APP_SOCKET_SITE: process.env.REACT_APP_SOCKET_SITE,
    REACT_APP_SUPABASE_URL: process.env.REACT_APP_SUPABASE_URL,
    REACT_APP_SUPABASE_ANON_KEY: process.env.REACT_APP_SUPABASE_ANON_KEY,
    REACT_APP_API_BASE_URL: process.env.REACT_APP_API_BASE_URL,
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
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(mp3|wav)$/,
      use: [
        {
          loader: "file-loader",
          options: {
            name: "[name].[ext]",
            outputPath: "static/media/",
            publicPath: "/_next/static/media/",
          },
        },
      ],
    });
    return config;
  },
};

export default nextConfig;
