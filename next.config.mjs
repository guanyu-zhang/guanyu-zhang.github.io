import createMDX from '@next/mdx'
import remarkGfm from 'remark-gfm'
import pwa from 'next-pwa'

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  // Add pageExtensions to include `md` and `x` files as pages
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  env: {
    NEXT_PUBLIC_WALINE_SERVER_URL: process.env.NEXT_PUBLIC_WALINE_SERVER_URL,
  },
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkGfm],
    // If you use `MDXProvider`, uncomment the following line.
    // providerImportSource: "@mdx-js/react",
  },
});

const withPWA = pwa({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
})

export default withPWA(withMDX(nextConfig));