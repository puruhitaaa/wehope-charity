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
        hostname: "5qaj29xq4i.ufs.sh",
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
  experimental: {
    reactCompiler: true,
  },
}

export default nextConfig
