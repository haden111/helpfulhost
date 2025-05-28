
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'flagcdn.com',
        port: '',
        pathname: '/**',
      },
      // Add other domains if your logo might be hosted elsewhere in the future
      // For example, if you use a CMS:
      // {
      //   protocol: 'https',
      //   hostname: 'cdn.your-cms.com',
      // },
    ],
  },
};

export default nextConfig;
