# 🌐 Domain Management Guide

## 📋 Your Current Domains

### Railway (Production Backend)
```
https://companion-app-production-0cc9.up.railway.app
```

### Vercel (Frontend Deployments)
```
https://companion-app-tau.vercel.app (Latest)
https://companion-app-git-main-itcbrio.vercel.app
https://companion-8j6mcqkhn-itcbrio.vercel.app
```

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────────┐
│   Vercel        │    │     Railway         │
│   (Frontend)    │◄──►│   (Backend/API)    │
│                 │    │                     │
│ - Next.js App   │    │ - PostgreSQL DB    │
│ - Static Assets │    │ - API Routes       │
│ - CDN           │    │ - Vector Search     │
└─────────────────┘    └─────────────────────┘
```

## 🔧 Configuration

### Railway Backend Configuration
```bash
# Environment Variables in Railway
DATABASE_URL=postgresql://username:password@host:port/database
VECTOR_DB=postgresql
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_****
CLERK_SECRET_KEY=sk_test_****
OPENAI_API_KEY=sk-****
UPSTASH_REDIS_REST_URL=https://****
UPSTASH_REDIS_REST_TOKEN=AZ****
```

### Vercel Frontend Configuration
```bash
# Environment Variables in Vercel
NEXT_PUBLIC_RAILWAY_API_URL=https://companion-app-production-0cc9.up.railway.app
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_****
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

## 🚀 Deployment Strategy

### Option 1: Railway Only (Recommended)
- **Backend**: Railway (PostgreSQL + API)
- **Frontend**: Railway (Next.js App)
- **URL**: `https://companion-app-production-0cc9.up.railway.app`

**Pros:**
- Single platform
- Easier management
- Lower costs
- Better integration

### Option 2: Vercel + Railway
- **Backend**: Railway (PostgreSQL + API)
- **Frontend**: Vercel (Next.js App)
- **URLs**: Vercel domains

**Pros:**
- Better CDN
- Faster static assets
- Global edge deployment

## 📊 Domain Comparison

| Platform | URL | Purpose | Status |
|----------|-----|---------|--------|
| Railway | `companion-app-production-0cc9.up.railway.app` | Full Stack | ✅ Production |
| Vercel | `companion-app-tau.vercel.app` | Frontend | ✅ Latest |
| Vercel | `companion-app-git-main-itcbrio.vercel.app` | Frontend | 🔄 Git-based |
| Vercel | `companion-8j6mcqkhn-itcbrio.vercel.app` | Frontend | 🔄 Direct |

## 🛠️ Management Commands

### Railway CLI
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Check status
railway status

# View logs
railway logs

# Deploy
railway up
```

### Vercel CLI
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# List projects
vercel ls

# View domains
vercel domains ls
```

## 🔍 Health Checks

### Railway Backend
```bash
# Health Check
curl https://companion-app-production-0cc9.up.railway.app/api/health

# Test API
curl https://companion-app-production-0cc9.up.railway.app/api/test

# Startup Check
curl https://companion-app-production-0cc9.up.railway.app/api/startup
```

### Vercel Frontend
```bash
# Main page
curl https://companion-app-git-main-itcbrio.vercel.app/

# API proxy (if configured)
curl https://companion-app-git-main-itcbrio.vercel.app/api/health
```

## 🎯 Recommended Setup

### For Production (Recommended)
1. **Use Railway for everything**
   - Backend: PostgreSQL + API
   - Frontend: Next.js App
   - URL: `https://companion-app-production-0cc9.up.railway.app`

2. **Configure environment variables in Railway**
   ```bash
   DATABASE_URL=postgresql://...
   VECTOR_DB=postgresql
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   OPENAI_API_KEY=sk-...
   UPSTASH_REDIS_REST_URL=https://...
   UPSTASH_REDIS_REST_TOKEN=AZ...
   ```

3. **Deploy from Git**
   ```bash
   git push origin main
   # Railway auto-deploys
   ```

### For Development
1. **Use Vercel for frontend**
   - Faster development cycles
   - Better preview deployments
   - Easy rollbacks

2. **Configure Vercel environment**
   ```bash
   NEXT_PUBLIC_RAILWAY_API_URL=https://companion-app-production-0cc9.up.railway.app
   ```

## 🚨 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Add Railway domain to Clerk allowed origins
   - Configure CORS in API routes

2. **Environment Variables**
   - Ensure all variables are set in both platforms
   - Check for typos in variable names

3. **Domain Conflicts**
   - Use different domains for different environments
   - Configure proper redirects

### Debugging Commands
```bash
# Check Railway logs
railway logs

# Check Vercel logs
vercel logs

# Test API connectivity
curl -I https://companion-app-production-0cc9.up.railway.app/api/health

# Test frontend
curl -I https://companion-app-git-main-itcbrio.vercel.app/
```

## 📈 Monitoring

### Railway Dashboard
- Logs: Real-time application logs
- Metrics: CPU, Memory, Network
- Deployments: Build and deployment history

### Vercel Dashboard
- Analytics: Page views, performance
- Functions: Serverless function logs
- Domains: Custom domain management

## 🎯 Next Steps

1. **Choose your primary platform** (Railway recommended)
2. **Configure all environment variables**
3. **Set up custom domain** (optional)
4. **Configure monitoring and alerts**
5. **Set up CI/CD pipeline**

## 📞 Support

- **Railway**: [docs.railway.app](https://docs.railway.app)
- **Vercel**: [vercel.com/docs](https://vercel.com/docs)
- **Clerk**: [clerk.com/docs](https://clerk.com/docs) 