import type { NextConfig } from "next";
import {domainRedirects} from './src/lib/site-config'

const nextConfig: NextConfig = {
  async redirects() {
    return domainRedirects(process.env)
  },
  async headers() {
    return [{ source: '/api/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] }]
  },
  async rewrites() {
    const backend = (process.env.API_INTERNAL_URL || 'http://127.0.0.1:3101').replace(/\/+$/, '')
    return [{ source: '/api/:path*', destination: `${backend}/api/:path*` }]
  },
};

export default nextConfig;
