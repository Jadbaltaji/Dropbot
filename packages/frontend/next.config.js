/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    typedRoutes: true,
  },
  // images: {
  //   remotePatterns: [
  //     {
  //       protocol: "https",
  //       hostname: "imgur.com",
  //       pathname: "/*.png",
  //     },
  //     {
  //       protocol: "https",
  //       hostname: "i.imgur.com",
  //       pathname: "/*.png",
  //     },
  //   ],
  // },
  images: {
    domains: ["imgur.com", "i.imgur.com"],
  },
  webpack: (config) => {
    config.externals = [
      ...config.externals,
      "pino-pretty",
      "lokijs",
      "encoding",
      {
        "utf-8-validate": "commonjs utf-8-validate",
        bufferutil: "commonjs bufferutil",
      },
    ];

    return config;
  },
};

module.exports = nextConfig;
