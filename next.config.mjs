/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_BUILDER_API_KEY: process.env.NEXT_PUBLIC_BUILDER_API_KEY,
    NEXT_PUBLIC_INKSOFT_STORE: process.env.NEXT_PUBLIC_INKSOFT_STORE,
    NEXT_PUBLIC_ALGOLIA_CLIENT_KEY: process.env.NEXT_PUBLIC_ALGOLIA_CLIENT_KEY,
    NEXT_PUBLIC_ALGOLIA_CLIENT_ID: process.env.NEXT_PUBLIC_ALGOLIA_CLIENT_ID,

  },
};

export default nextConfig;
