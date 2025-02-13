import type { NextConfig } from "next";
import type { Configuration as WebpackConfig } from "webpack";

interface CustomWebpackConfig extends WebpackConfig {
  module: {
    rules: {
      test?: RegExp;
      type?: string;
      generator?: {
        filename: string;
      };
    }[];
  } & WebpackConfig["module"];
}

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    turbo: {
      rules: {
        "*.mp3": ["file-loader"],
      },
    },
  },
  webpack: (config: CustomWebpackConfig, { isServer }) => {
    // Add custom webpack config for audio files when not using Turbopack
    config.module.rules.push({
      test: /\.mp3$/,
      type: "asset/resource",
      generator: {
        filename: "static/audio/[name][ext]",
      },
    });

    return config;
  },
  // images
  images: {
    domains: ["qiraathub.com", "www.alwa7y.com"],
  },
};

export default nextConfig;
