import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // For Vercel deployment via GitHub, no special config needed
  // Enable static export only when building for GitHub Pages
  // Note: For root URL (mahmoud-k-ismail.github.io), repo must be named 'mahmoud-k-ismail.github.io'
  ...(process.env.GITHUB_PAGES === 'true' && { 
    output: 'export',
    // basePath: '/portfolio', // Uncomment if repo is named 'portfolio' and you want /portfolio/ subpath
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
