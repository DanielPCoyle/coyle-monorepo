/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    BUILDERIO_API_KEY: process.env.BUILDERIO_API_KEY,
  },
};

export default nextConfig;
