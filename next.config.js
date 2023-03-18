import MDXPlugin from '@next/mdx';
import WindiCSSWebpackPlugin from 'windicss-webpack-plugin';

const withMDX = MDXPlugin({
  extension: /\.mdx?$/,
  options: {
    // If you use remark-gfm, you'll need to use next.config.mjs
    // as the package is ESM only
    // https://github.com/remarkjs/remark-gfm#install
    remarkPlugins: [],
    rehypePlugins: [],
    // If you use `MDXProvider`, uncomment the following line.
    providerImportSource: '@mdx-js/react',
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.plugins.push(new WindiCSSWebpackPlugin());
    return config;
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Configure pageExtensions to include md and mdx
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  reactStrictMode: true,
};

export default withMDX(nextConfig);
