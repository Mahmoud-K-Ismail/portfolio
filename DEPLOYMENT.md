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

---

## Deploy to GitHub Pages (Separate from Vercel)

This setup allows you to deploy to `mahmoud-k-ismail.github.io` **without affecting** your Vercel deployment.

### Step 1: Enable GitHub Pages in Repository Settings

1. Go to your GitHub repository: `https://github.com/mahmoud-k-ismail/portfolio`
2. Navigate to **Settings** → **Pages**
3. Under **Source**, select **"Deploy from a branch"**
4. Choose branch: **`gh-pages`**
5. Folder: **`/ (root)`**
6. Click **Save**

### Step 2: Initial Deployment

The GitHub Actions workflow is set up to deploy manually. To deploy:

1. Go to your repository on GitHub
2. Click on **Actions** tab
3. Select **"Deploy to GitHub Pages"** workflow
4. Click **"Run workflow"** button (on the right)
5. Select the branch (usually `main`)
6. Click **"Run workflow"**

The workflow will:
- Build your Next.js app as a static site
- Deploy it to the `gh-pages` branch
- Your site will be live at `https://mahmoud-k-ismail.github.io`

### Step 3: Future Deployments

**Option A: Manual Trigger (Recommended)**
- Go to **Actions** → **"Deploy to GitHub Pages"** → **"Run workflow"**
- This ensures you control when GitHub Pages updates

**Option B: Automatic on Branch Push (Optional)**
- Uncomment the `push` section in `.github/workflows/deploy-gh-pages.yml`
- Push to the specified branch to auto-deploy

### Important Notes:

- ✅ **Vercel deployment is unaffected** - This only deploys to GitHub Pages
- ✅ **Manual control** - GitHub Pages only updates when you trigger the workflow
- ✅ **Static export** - GitHub Pages uses a static build (no server-side features)
- ⚠️ **API routes** - The RAG API (`/api/rag`) won't work on GitHub Pages (static hosting)
- ⚠️ **Environment variables** - If needed, add them as GitHub Secrets in repository settings

### Troubleshooting:

- **Workflow not showing?** Make sure the `.github/workflows/deploy-gh-pages.yml` file is committed and pushed
- **Build fails?** Check the Actions tab for error logs
- **Site not updating?** Wait a few minutes after deployment, GitHub Pages can take 1-2 minutes to update


