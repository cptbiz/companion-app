/** @type {import('next').NextConfig} */
const nextConfig = {
  // Production URL configuration
  env: {
    CUSTOM_KEY: process.env.NODE_ENV === 'production' 
      ? 'https://companion-app-production-0cc9.up.railway.app' 
      : 'http://localhost:3000',
  },
  // Server configuration
  serverRuntimeConfig: {
    // Will only be available on the server side
    mySecret: process.env.MY_SECRET,
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
    staticFolder: '/static',
    baseUrl: process.env.NODE_ENV === 'production' 
      ? 'https://companion-app-production-0cc9.up.railway.app' 
      : 'http://localhost:3000',
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "tjzk.replicate.delivery",
        port: "",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "replicate.delivery",
        port: "",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "a16z.com",
        port: "",
        pathname: "**",
      },
    ],
  },
};

module.exports = nextConfig;
