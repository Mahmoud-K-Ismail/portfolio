# Favicon Setup Instructions

## Current Setup
- A placeholder `icon.svg` has been created in `/src/app/`
- The layout.tsx metadata references your photo as a fallback

## To Use Your Photo as Favicon

### Option 1: Convert Photo to Icon (Recommended)
1. **Convert your photo to icon format:**
   - Use an online tool like [favicon.io](https://favicon.io/favicon-converter/) or [realfavicongenerator.net](https://realfavicongenerator.net/)
   - Upload your photo: `/public/202510-30-NYUAD_mki4895-0785-RetSquare.jpg`
   - Download the generated favicon files

2. **Place the icon file in `/src/app/`:**
   - Rename it to `icon.png` (or keep as `icon.ico`)
   - Place it directly in `/src/app/icon.png`
   - Next.js will automatically detect and use it

3. **Delete the placeholder:**
   - Remove `/src/app/icon.svg` if you're using a PNG/ICO instead

### Option 2: Use SVG (If you have an SVG version)
- Replace `/src/app/icon.svg` with your SVG version
- Make sure it's optimized for small sizes (32x32 or 64x64 viewBox)

### Option 3: Quick Manual Conversion
If you have ImageMagick installed:
```bash
convert public/202510-30-NYUAD_mki4895-0785-RetSquare.jpg -resize 32x32 src/app/icon.png
```

## After Adding Your Icon
1. **Clear browser cache** or use incognito mode
2. **Redeploy on Vercel** (if needed, uncheck "Use existing Build Cache")
3. The favicon should appear automatically

## File Locations
- **Current photo:** `/public/202510-30-NYUAD_mki4895-0785-RetSquare.jpg`
- **Icon should be:** `/src/app/icon.png` (or `icon.svg`, `icon.ico`)
- **Placeholder:** `/src/app/icon.svg` (can be replaced)

## Notes
- Next.js App Router automatically detects `icon.png`, `icon.svg`, or `favicon.ico` in the `/app` directory
- The icon should be square and ideally 32x32, 64x64, or 128x128 pixels
- For best results, use a simple, high-contrast image that's recognizable at small sizes


