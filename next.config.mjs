/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: { bodySizeLimit: '10mb' }, // KYC and property photo uploads
  },
};

export default nextConfig;
