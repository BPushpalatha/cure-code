# Vercel Deployment Guide

This project is a Next.js app with API routes (Prisma) and an Emergency page relying on a signaling server (socket.io). Vercel deploys the Next.js app; the signaling server must run elsewhere.

## Prerequisites
- Node 18+ locally
- Vercel CLI installed: `npm i -g vercel`
- A hosted database (Postgres) if you want appointments to persist (Vercel Postgres / Neon / Supabase)
- An external signaling server URL (Railway/Render/Fly/EC2)

## Environment Variables
Copy `.env.example` to `.env` for local development. For Vercel, set these in Project Settings → Environment Variables (or via CLI):

- `DATABASE_PROVIDER` → `postgresql` (production)
- `DATABASE_URL` → Your Postgres connection string
- `NEXT_PUBLIC_SOCKET_URL` → Public URL of your signaling server

Locally you can keep:
- `DATABASE_PROVIDER=sqlite`
- `DATABASE_URL="file:./prisma/prisma/dev.db"`

## Prisma
We use `provider = env("DATABASE_PROVIDER")` so you can use SQLite locally and Postgres on Vercel.

Generate and push schema locally (optional if your DB is already provisioned):

```bash
npm run db:generate
npm run db:push
```

## Deploy
```bash
vercel login
vercel
vercel env add DATABASE_PROVIDER
vercel env add DATABASE_URL
vercel env add NEXT_PUBLIC_SOCKET_URL
vercel --prod
```

## Notes
- The signaling server in `server/signaling-server.js` is not deployed on Vercel. Host it on a separate platform and point `NEXT_PUBLIC_SOCKET_URL` to it.
- If `DATABASE_URL` is not set in production, appointment APIs will not work.
## Database Migrations (Production)
- Ensure DATABASE_URL is set in Vercel Project Settings.
- Apply schema changes to production once per change:

Windows PowerShell:
`powershell
postgresql://... = "<your-postgres-url>"
npm run prisma:migrate:deploy
`

macOS/Linux:
`ash
DATABASE_URL="<your-postgres-url>" npm run prisma:migrate:deploy
`

Notes:
- This runs prisma migrate deploy against the target database and is safe to run multiple times.
- postinstall already runs prisma generate automatically on Vercel.
