import type { NextConfig } from "next";

const SUB_DIRECTORY = "/flag-quiz"; //これは適切な値にしてください。

const isProd = process.env.NODE_ENV == "production";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: isProd ? SUB_DIRECTORY : "",
  assetPrefix: isProd ? SUB_DIRECTORY : "",
  publicRuntimeConfig: {
    basePath: isProd ? SUB_DIRECTORY : "",
  },
};

export default nextConfig;
