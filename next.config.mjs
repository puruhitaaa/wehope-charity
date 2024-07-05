/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
        port: "",
        // pathname: '/account123/**',
      },
      {
        protocol: "https",
        hostname: "img.clerk.com",
        port: "",
      },
    ],
  },
};

export default nextConfig;
