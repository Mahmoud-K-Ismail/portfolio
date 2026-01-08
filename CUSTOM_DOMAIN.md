# Setting Up Custom Domain

## Option 1: Use Vercel's Free Domain (Easiest)

Vercel provides a free `.vercel.app` domain. You can customize the project name:
- In Vercel dashboard → Settings → General
- Change project name to `mahmoud-kassem` or `kassem`
- Your site will be: `https://mahmoud-kassem.vercel.app` or `https://kassem.vercel.app`

## Option 2: Buy a Custom Domain

### Recommended Domain Registrars:
- **Namecheap** - Good prices, easy to use
- **Cloudflare** - At-cost pricing, great DNS
- **Google Domains** - Simple interface

### Suggested Domains:
- `mahmoudkassem.com`
- `kassem.dev` (if available)
- `mkassem.com`
- `mahmoudkassem.dev`

### Steps After Buying:

1. **In Vercel Dashboard:**
   - Go to your project → Settings → Domains
   - Click "Add Domain"
   - Enter your domain (e.g., `mahmoudkassem.com`)
   - Vercel will show you DNS records to add

2. **In Your Domain Registrar:**
   - Go to DNS settings
   - Add the DNS records Vercel provides:
     - Type: `A` record pointing to Vercel's IP
     - Type: `CNAME` record for `www` subdomain
   - Or use Vercel's nameservers (easier)

3. **Wait for DNS Propagation:**
   - Usually takes 5-60 minutes
   - Vercel will automatically configure SSL (HTTPS)

## Option 3: Use a Subdomain

If you already own a domain, you can use:
- `portfolio.yourdomain.com`
- `mahmoud.yourdomain.com`
- `kassem.yourdomain.com`

Just add it in Vercel → Settings → Domains and configure DNS.

## Quick Setup (If you have a domain):

```bash
# After deploying to Vercel:
# 1. Go to Vercel Dashboard → Your Project → Settings → Domains
# 2. Add your domain
# 3. Follow the DNS configuration instructions
# 4. Wait for DNS to propagate (5-60 min)
# 5. SSL certificate will be auto-configured
```

Your site will be live at your custom domain! 🎉


