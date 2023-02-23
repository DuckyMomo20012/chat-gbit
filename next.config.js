import WindiCSSWebpackPlugin from 'windicss-webpack-plugin';

/** @type {import('next').NextConfig} */

export default {
  webpack: (config) => {
    config.plugins.push(new WindiCSSWebpackPlugin());
    return config;
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
};
