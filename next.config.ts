import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  
  serverActions: {
    bodySizeLimit: "10mb", 
  },
  images: {
    remotePatterns: [
      { hostname: "img.freepik.com", protocol: "https" },
      { hostname: "placehold.co", protocol: "https" },
      { hostname: "www.freepik.com", protocol: "https" },
      { hostname: "gravatar.com", protocol: "https" },
      { hostname: "lh3.googleusercontent.com", protocol: "https" },
      { hostname: "rdde.comgg", protocol: "https" },
      { hostname: "unsplash.com", protocol: "https" },
      { hostname: "res.cloudinary.com", protocol: "https" },
    ],
  },
};

export default nextConfig;
