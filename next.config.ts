import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // For Vercel deployment via GitHub, no special config needed
  // Enable static export and basePath only when building for GitHub Pages
  ...(process.env.GITHUB_PAGES === 'true' && { 
    output: 'export',
    basePath: '/portfolio', // Required for GitHub Pages when repo is not named username.github.io
  }),
  
  // Optimize images
  images: {
    unoptimized: true,
  },
  
  // Strict mode for better development experience
  reactStrictMode: true,
  
  // Handle ESM packages that need transpilation
  transpilePackages: ['react-force-graph-2d', 'force-graph'],
};

export default nextConfig;
