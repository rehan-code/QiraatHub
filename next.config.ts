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
  redirects: async () => [
    // Hamza Al Kufi redirects
    {
      source: '/hamzah-al-koofi',
      destination: '/qiraat/hamza-al-kufi',
      permanent: true,
    },
    {
      source: '/hamza-al-kufi',
      destination: '/qiraat/hamza-al-kufi',
      permanent: true,
    },
    // Nafi al-Madani redirects
    {
      source: '/nafiʽ-al-madani',
      destination: '/qiraat/nafi-al-madani',
      permanent: true,
    },
    {
      source: '/nafi-al-madani',
      destination: '/qiraat/nafi-al-madani',
      permanent: true,
    },
    // Ibn Kathir redirects
    {
      source: '/ibn-kathir',
      destination: '/qiraat/ibn-kathir',
      permanent: true,
    },
    // Abu Amr Basri redirects
    {
      source: '/abu-amr-al-basri',
      destination: '/qiraat/abu-amr-basri',
      permanent: true,
    },
    {
      source: '/abu-amr-basri',
      destination: '/qiraat/abu-amr-basri',
      permanent: true,
    },
    // Ibn Amir Shami redirects
    {
      source: '/ibn-amir-dimashqi',
      destination: '/qiraat/ibn-amir-shami',
      permanent: true,
    },
    {
      source: '/ibn-amir-shami',
      destination: '/qiraat/ibn-amir-shami',
      permanent: true,
    },
    // Asim Al Koofi redirects
    {
      source: '/asim-al-koofi',
      destination: '/qiraat/asim-al-koofi',
      permanent: true,
    },
    // Al-Kisa'i redirects
    {
      source: '/al-kisai',
      destination: '/qiraat/al-kisai',
      permanent: true,
    },
    // Abu Jaafar redirects
    {
      source: '/abu-jaafar',
      destination: '/qiraat/abu-jaafar',
      permanent: true,
    },
    // Yaqub Hadrani redirects
    {
      source: '/yaqoub-al-hadrami',
      destination: '/qiraat/yaqub-hadrani',
      permanent: true,
    },
    {
      source: '/yaqub-hadrani',
      destination: '/qiraat/yaqub-hadrani',
      permanent: true,
    },
    // Khalaf Al Ashir redirects
    {
      source: '/khalaf-ibn-hisham',
      destination: '/qiraat/khalaf-al-ashir',
      permanent: true,
    },
    {
      source: '/khalaf-al-ashir',
      destination: '/qiraat/khalaf-al-ashir',
      permanent: true,
    },
  ],
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
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'qiraathub.com',
        port: '',
        pathname: '/wp-content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'old.qiraathub.com',
        port: '',
        pathname: '/wp-content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'www.alwa7y.com',
        port: '',
        pathname: '/downloads/**',
      },
    ],
  },
};

export default nextConfig;
