# Production Deployment Guide - Phase 3.0

**For:** App Store Launch  
**Date:** October 14, 2025  
**Status:** Ready to Deploy

---

## 🎯 DEPLOYMENT OPTIONS

### Option 1: Heroku (RECOMMENDED - Easiest)

**Pros:**

- ✅ Simplest for Shopify apps
- ✅ PostgreSQL included
- ✅ Auto-scaling
- ✅ CLI deployment

**Pricing:** $12/mo (Eco dyno + Postgres Mini)

**Steps:**

```bash
# 1. Install Heroku CLI
brew install heroku/brew/heroku

# 2. Login
heroku login

# 3. Create app
heroku create your-ring-builder-app

# 4. Add PostgreSQL
heroku addons:create heroku-postgresql:mini

# 5. Set environment variables
heroku config:set SHOPIFY_API_KEY=your_key
heroku config:set SHOPIFY_API_SECRET=your_secret
heroku config:set SHOPIFY_APP_URL=https://your-ring-builder-app.herokuapp.com
heroku config:set SCOPES=write_products,read_products,write_orders,read_orders,write_customers,read_customers
heroku config:set NODE_ENV=production

# 6. Deploy
git push heroku main

# 7. Run migrations
heroku run npx prisma migrate deploy

# 8. Open app
heroku open
```

---

### Option 2: Fly.io (Modern, Free Tier)

**Pros:**

- ✅ Free tier available
- ✅ Modern platform
- ✅ Fast deploys
- ✅ Global edge network

**Pricing:** $0-10/mo (free tier → paid as you scale)

**Steps:**

```bash
# 1. Install flyctl
brew install flyctl

# 2. Login
fly auth login

# 3. Launch app (interactive)
fly launch

# 4. Set secrets
fly secrets set SHOPIFY_API_KEY=your_key
fly secrets set SHOPIFY_API_SECRET=your_secret
fly secrets set DATABASE_URL=your_postgres_url
fly secrets set SHOPIFY_APP_URL=https://your-app.fly.dev

# 5. Deploy
fly deploy

# 6. Run migrations
fly ssh console -C "npx prisma migrate deploy"
```

---

### Option 3: Railway (Simple, Affordable)

**Pros:**

- ✅ Very simple
- ✅ $5/mo starter
- ✅ PostgreSQL included
- ✅ Good for MVPs

**Pricing:** $5-10/mo

**Steps:**

1. Go to https://railway.app
2. Connect GitHub repository
3. Add PostgreSQL service
4. Set environment variables
5. Deploy automatically on push

---

## 🔧 ENVIRONMENT VARIABLES

### Required Variables

```bash
# Shopify Configuration
SHOPIFY_API_KEY=your_shopify_api_key
SHOPIFY_API_SECRET=your_shopify_api_secret
SHOPIFY_APP_URL=https://your-production-domain.com
SCOPES=write_products,read_products,write_orders,read_orders,write_customers,read_customers

# Database
DATABASE_URL=postgresql://user:password@host:5432/database

# Node Environment
NODE_ENV=production

# Optional: Email Service
SENDGRID_API_KEY=your_sendgrid_key
EMAIL_FROM_ADDRESS=noreply@your-domain.com
EMAIL_FROM_NAME=Ring Builder
MERCHANT_EMAIL=support@your-domain.com
```

---

## 📋 PRE-DEPLOYMENT CHECKLIST

### Code Quality

- [x] TypeScript errors: 0
- [x] Build successful
- [x] All tests passing (manual tests)
- [x] No console errors
- [x] Performance optimized

### Database

- [ ] PostgreSQL set up
- [ ] DATABASE_URL configured
- [ ] Migrations tested
- [ ] Prisma Client generated
- [ ] Connection pooling configured

### Security

- [x] GDPR webhooks implemented
- [x] Multi-tenant isolation verified
- [ ] Environment variables secured
- [ ] No secrets in code
- [ ] SSL/TLS enabled

### Shopify Configuration

- [ ] App scopes correct
- [ ] Webhook URLs updated
- [ ] OAuth redirect URLs configured
- [ ] App URL matches deployment

---

## 🚀 DEPLOYMENT STEPS (Heroku Example)

### Step 1: Prepare Repository

```bash
# Ensure clean state
git status
git add .
git commit -m "Phase 3.0: Ready for production deployment"
```

### Step 2: Create Heroku App

```bash
# Create app
heroku create your-ring-builder-app

# Add PostgreSQL
heroku addons:create heroku-postgresql:mini

# Get DATABASE_URL (automatically set)
heroku config:get DATABASE_URL
```

### Step 3: Configure Environment

```bash
# Set all required variables
heroku config:set \
  SHOPIFY_API_KEY=your_key \
  SHOPIFY_API_SECRET=your_secret \
  SHOPIFY_APP_URL=https://your-ring-builder-app.herokuapp.com \
  SCOPES=write_products,read_products,write_orders,read_orders,write_customers,read_customers \
  NODE_ENV=production
```

### Step 4: Update Prisma for PostgreSQL

**File:** `prisma/schema.prisma`

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### Step 5: Deploy

```bash
# Push to Heroku
git push heroku main

# Run migrations
heroku run npx prisma migrate deploy

# Generate Prisma Client
heroku run npx prisma generate

# Open app
heroku open
```

### Step 6: Verify Deployment

```bash
# Check logs
heroku logs --tail

# Check dyno status
heroku ps

# Check database
heroku pg:info
```

---

## ✅ POST-DEPLOYMENT VERIFICATION

### 1. Test Homepage

```bash
curl https://your-app.herokuapp.com
# Should return app homepage
```

### 2. Test OAuth

- Go to: `https://your-app.herokuapp.com/auth?shop=test-store.myshopify.com`
- Should redirect to Shopify OAuth

### 3. Test API Endpoints

```bash
# Check health (if you add one)
curl https://your-app.herokuapp.com/api/health
```

### 4. Test Database

```bash
# Open Prisma Studio (locally with production DB)
DATABASE_URL=your_production_url npx prisma studio
```

### 5. Monitor Logs

```bash
# Heroku
heroku logs --tail

# Look for:
# ✅ "Server started"
# ✅ "Database connected"
# ❌ No errors
```

---

## 📊 MONITORING SETUP

### Sentry (Error Tracking)

```bash
# 1. Sign up at sentry.io

# 2. Install
npm install @sentry/react @sentry/node

# 3. Initialize in app/entry.server.tsx
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
});

# 4. Set environment variable
heroku config:set SENTRY_DSN=your_sentry_dsn
```

### Uptime Monitoring

**UptimeRobot (Free):**

1. Sign up at https://uptimerobot.com
2. Add monitor for your app URL
3. Set check interval: 5 minutes
4. Add alert email

**Pingdom:**

1. Sign up at https://www.pingdom.com
2. Add HTTP(S) check
3. Configure alerting

---

## 🔄 CONTINUOUS DEPLOYMENT

### Auto-Deploy from GitHub

**Heroku:**

```bash
# Connect to GitHub
heroku plugins:install heroku-repo
heroku repo:auth

# Enable auto-deploy
# (Or use Heroku Dashboard → Deploy → GitHub)
```

**Fly.io:**

```bash
# GitHub Actions auto-deploy
fly deploy --remote-only
```

---

## 📈 SCALING CONFIGURATION

### Heroku Scaling

**When you hit 100+ merchants:**

```bash
# Upgrade dyno
heroku ps:scale web=1:standard-1x

# Upgrade database
heroku addons:upgrade heroku-postgresql:standard-0
```

**When you hit 500+ merchants:**

```bash
# Scale horizontally
heroku ps:scale web=2:standard-1x

# Upgrade database
heroku addons:upgrade heroku-postgresql:standard-2
```

### Database Connection Pooling

**Add to DATABASE_URL:**

```
?connection_limit=20&pool_timeout=20
```

**Or use PgBouncer:**

```bash
heroku buildpacks:add https://github.com/heroku/heroku-buildpack-pgbouncer
```

---

## 🚨 TROUBLESHOOTING

### Deployment Fails

**Error:** "Build failed"

- Check `npm run build` works locally
- Verify all dependencies in package.json
- Check Node version matches (20+)

**Error:** "Database connection failed"

- Verify DATABASE_URL is set
- Check PostgreSQL is running
- Test connection with: `npx prisma db execute --stdin <<< "SELECT 1;"`

### App Won't Start

**Check logs:**

```bash
heroku logs --tail
```

**Common issues:**

- Missing environment variables
- Database not migrated
- Port binding (use `process.env.PORT`)

### Performance Issues

**Check metrics:**

```bash
heroku pg:info
heroku ps:cpu
heroku ps:memory
```

**Solutions:**

- Upgrade dyno size
- Add database indexes
- Enable caching (Redis)

---

## 💾 BACKUP STRATEGY

### Automated Backups (Heroku)

```bash
# Schedule daily backups
heroku pg:backups:schedule DATABASE_URL --at '02:00 America/New_York'

# Verify schedule
heroku pg:backups:schedules

# Manual backup
heroku pg:backups:capture

# List backups
heroku pg:backups

# Download backup
heroku pg:backups:download
```

### Backup to S3 (Advanced)

```bash
# Install plugin
heroku plugins:install heroku-pg-extras

# Configure S3
heroku config:set AWS_ACCESS_KEY_ID=xxx
heroku config:set AWS_SECRET_ACCESS_KEY=xxx
heroku config:set AWS_S3_BUCKET=ring-builder-backups
```

---

## 🔐 SECURITY CHECKLIST

### SSL/TLS

- [ ] HTTPS enabled (automatic on Heroku/Fly.io)
- [ ] Force SSL in production
- [ ] Security headers configured

### Environment Security

- [ ] All secrets in environment variables
- [ ] No hardcoded credentials
- [ ] .env file in .gitignore
- [ ] Production secrets different from dev

### Database Security

- [ ] Strong database password
- [ ] SSL required for connections
- [ ] No public access
- [ ] Backups enabled

---

## 📞 SUPPORT AFTER DEPLOYMENT

### Monitoring Checklist

- [ ] Sentry error tracking configured
- [ ] Uptime monitoring enabled
- [ ] Log aggregation set up
- [ ] Alerts configured (email/Slack)
- [ ] Status page created (optional)

### Support Setup

- [ ] Support email configured (support@your-domain.com)
- [ ] Auto-responder set up
- [ ] FAQ page created
- [ ] Documentation published

---

## 🎯 NEXT STEPS AFTER DEPLOYMENT

### 1. Update Shopify App Configuration

- Go to Shopify Partners Dashboard
- Update App URL to production URL
- Update OAuth redirect URLs
- Update webhook URLs (if needed)

### 2. Test Production App

- Install on development store
- Complete onboarding flow
- Test billing
- Test app block
- Verify customer flow

### 3. Submit to App Store

- See `APP_STORE_LISTING.md`
- Upload screenshots
- Upload demo video
- Submit for review

---

## 📊 MONITORING PRODUCTION

### Daily Checks

- Check error rates (Sentry)
- Check uptime (UptimeRobot)
- Review logs for issues
- Monitor response times

### Weekly Checks

- Review performance metrics
- Check database size
- Review user feedback
- Plan optimizations

### Monthly Checks

- Analyze growth metrics
- Review costs vs revenue
- Plan infrastructure scaling
- Review security

---

## 💡 OPTIMIZATION TIPS

### Performance

- Add Redis for caching
- Enable CDN (Cloudflare)
- Optimize images
- Use connection pooling

### Cost

- Right-size dyno/database
- Use free tiers initially
- Scale up only when needed
- Monitor resource usage

### Reliability

- Enable auto-restarts
- Set up health checks
- Configure timeouts properly
- Implement retry logic

---

## ✅ DEPLOYMENT SUCCESS CRITERIA

### Technical

- [ ] App accessible via HTTPS
- [ ] Database connected
- [ ] All routes working
- [ ] No 500 errors
- [ ] Build successful

### Functional

- [ ] OAuth flow works
- [ ] Onboarding flow works
- [ ] Billing flow works
- [ ] Customer builder works
- [ ] Admin dashboard works

### Performance

- [ ] Page load < 3s
- [ ] API responses < 500ms
- [ ] Database queries < 100ms
- [ ] No timeouts

---

**You're ready to deploy! Follow this guide step-by-step.** 🚀

---

**Document Version:** 1.0  
**Last Updated:** October 14, 2025  
**Status:** Production Ready
