# Vercel Deployment Guide

This guide covers deploying the Next.js app in the `starter/` directory to Vercel.

## Prerequisites

1. **GitHub repo**: https://github.com/BPushpalatha/cure-code
2. **Branch**: `feature/preventa-starter` (or merge to `main` first)
3. **Postgres database**: Get a connection string from:
   - [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
   - [Neon](https://neon.tech/) (free tier available)
   - [Supabase](https://supabase.com/) (free tier available)
4. **Signaling server** (for Emergency page WebRTC):
   - Deploy `starter/server/signaling-server.js` to a Node.js host (Render, Railway, or a VM)
   - Or skip for now and set `NEXT_PUBLIC_SOCKET_URL` later

## Deploy via Vercel Dashboard (Recommended)

### 1. Import Project
- Go to [vercel.com/new](https://vercel.com/new)
- Click **Import Git Repository**
- Select `BPushpalatha/cure-code`
- Choose branch: `feature/preventa-starter` (or `main` if merged)

### 2. Configure Project
- **Framework Preset**: Next.js (auto-detected)
- **Root Directory**: `starter` ⚠️ **Important**: Must be set to `starter`
- **Build Command**: `npm run build` (default)
- **Output Directory**: `.next` (default)

### 3. Add Environment Variables
Click **Environment Variables** and add:

| Key | Value | Notes |
|-----|-------|-------|
| `DATABASE_URL` | `postgresql://user:pass@host:5432/db?sslmode=require` | Your Postgres connection string |
| `NEXT_PUBLIC_SOCKET_URL` | `https://your-signal-server.com` | Optional: signaling server for Emergency page |

### 4. Deploy
- Click **Deploy**
- Wait 2-3 minutes for build to complete
- Preview URL will be available (e.g., `https://cure-code-xyz.vercel.app`)

### 5. Initialize Database Schema
Run migrations once before first use:

```powershell
# From your local machine
cd C:\Users\MYDESK\cure-code\starter
$env:DATABASE_URL="postgresql://user:pass@host:5432/db?sslmode=require"
npx prisma db push
```

Or run directly in Vercel:
- Go to **Settings** → **Functions** → **Serverless Function Logs**
- Add a one-time build command: `npx prisma db push`

### 6. Verify Deployment
- Visit your deployment URL
- Test pages: `/`, `/emergency`
- Test API: `GET /api/auth/me` (should return 401 if not logged in)

## Deploy via Vercel CLI

### 1. Install CLI
```powershell
npm install -g vercel
```

### 2. Link Project
```powershell
cd C:\Users\MYDESK\cure-code\starter
vercel link
```

### 3. Add Environment Variables
```powershell
vercel env add DATABASE_URL production
# Paste your Postgres URL when prompted

vercel env add NEXT_PUBLIC_SOCKET_URL production
# Paste your signaling server URL when prompted
```

### 4. Deploy Preview
```powershell
vercel
```

### 5. Deploy Production
```powershell
vercel --prod
```

### 6. Initialize Database
```powershell
$env:DATABASE_URL="your-postgres-url"
npx prisma db push
```

## Post-Deployment

### Custom Domain (Optional)
- Go to **Settings** → **Domains**
- Add your domain: `yourdomain.com`
- Update DNS records as instructed

### Deploy Signaling Server
The Emergency page requires a WebRTC signaling server. Deploy `starter/server/signaling-server.js`:

**Option 1: Render.com (Free)**
1. Create new Web Service
2. Connect GitHub repo
3. Set build command: `npm install`
4. Set start command: `node server/signaling-server.js`
5. Copy service URL and set as `NEXT_PUBLIC_SOCKET_URL` in Vercel

**Option 2: Railway.app (Free)**
1. New Project → Deploy from GitHub
2. Select repo and branch
3. Add start command: `node starter/server/signaling-server.js`
4. Copy Railway URL and set as `NEXT_PUBLIC_SOCKET_URL`

**Option 3: VPS/VM**
```bash
# On your server
git clone https://github.com/BPushpalatha/cure-code.git
cd cure-code/starter
npm install
node server/signaling-server.js &
# Use server IP:3001 as NEXT_PUBLIC_SOCKET_URL
```

### Update Environment Variables
After deploying signaling server:
```powershell
cd C:\Users\MYDESK\cure-code\starter
vercel env add NEXT_PUBLIC_SOCKET_URL production
# Paste signaling server URL
vercel --prod  # Redeploy to pick up new env
```

## Troubleshooting

### Build fails: "Prisma Client not initialized"
- Ensure `postinstall` script exists in `package.json`: `"postinstall": "prisma generate"`
- Check build logs for Prisma generation errors

### Database connection fails
- Verify `DATABASE_URL` format: `postgresql://user:password@host:5432/dbname?sslmode=require`
- Check database accepts connections from Vercel IPs
- For Neon/Supabase: ensure pooling is enabled

### Emergency page doesn't load
- Check browser console for WebRTC errors
- Verify `NEXT_PUBLIC_SOCKET_URL` is set and reachable
- Ensure signaling server is running and accessible

### API routes return 500
- Check Vercel Function Logs for detailed errors
- Verify Prisma schema migrations are applied: `npx prisma db push`

## Production Checklist

- [ ] Database migrations applied
- [ ] Environment variables set in Vercel
- [ ] Custom domain configured (optional)
- [ ] Signaling server deployed and `NEXT_PUBLIC_SOCKET_URL` set
- [ ] Test all pages: dashboard, emergency, family history
- [ ] Test API routes: auth, family members, medical records
- [ ] Monitor Vercel Function Logs for errors
- [ ] Set up Vercel Analytics (optional)

## Support

- Vercel Docs: https://vercel.com/docs
- Prisma Docs: https://www.prisma.io/docs
- Next.js Docs: https://nextjs.org/docs

---

**Note**: The app in `starter/` is a standalone Next.js project. The root `cure-code` repo may contain other projects; ensure Vercel's root directory is set to `starter`.
