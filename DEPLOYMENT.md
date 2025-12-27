# Deployment Guide

## Quick Deploy to Vercel (Recommended)

### Step 1: Push to GitHub

1. Create a new repository on GitHub (if you haven't already)
2. Add the remote and push:

```bash
git remote add origin https://github.com/YOUR_USERNAME/portfolio.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"Add New Project"**
3. Import your `portfolio` repository
4. Vercel will auto-detect Next.js - just click **"Deploy"**

### Step 3: Add Environment Variables

1. In your Vercel project dashboard, go to **Settings** → **Environment Variables**
2. Add:
   - **Name:** `MISTRAL_API_KEY`
   - **Value:** Your Mistral API key (`rJrJeRrdKk6X8taSAnBFKKZ2qFj39RY3`)
   - **Environment:** Production, Preview, Development (select all)
3. Click **Save**
4. Go to **Deployments** tab and click **"Redeploy"** on the latest deployment

### Step 4: Add Resume PDF

1. Place your resume PDF in the `public` folder as `resume.pdf`
2. Commit and push:
   ```bash
   git add public/resume.pdf
   git commit -m "Add resume PDF"
   git push
   ```
3. Vercel will auto-deploy the update

## Your Portfolio Will Be Live At:
`https://your-project-name.vercel.app`

## Optional: Custom Domain
- In Vercel dashboard → Settings → Domains
- Add your custom domain (e.g., `mahmoudkassem.com`)

## Notes:
- The RAG chat will work without the API key (uses fallback), but responses will be better with Mistral AI
- Make sure your resume PDF is in `public/resume.pdf`
- All future pushes to `main` branch will auto-deploy

