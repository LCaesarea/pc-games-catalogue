import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Next.js only optimises images from hosts it has been told about. These are Strapi's uploads.
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
        pathname: "/uploads/**",
      },
    ],
    // Next.js refuses to fetch images from localhost/private addresses by default. Strapi runs on localhost
    // in development, so this lets it through. On a deployed site this is WRONG: it would let the image
    // optimizer fetch from private addresses (an SSRF risk), so remove it and use Strapi's real public host.
    dangerouslyAllowLocalIP: true,
  },
};

export default nextConfig;
