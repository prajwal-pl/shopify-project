# Build & Deployment Validation Guide

**Purpose**: Validate builds, deployments, and production readiness  
**Last Updated**: October 12, 2025

---

## Pre-Build Checks

### 1. Code Quality Validation

```bash
# TypeScript type checking
npm run typecheck

# Expected: No TypeScript errors
# If errors: Fix before proceeding
```

```bash
# ESLint checking
npm run lint

# Expected: No linting errors
# If warnings: Review and fix critical ones
```

```bash
# Prettier formatting (if configured)
npx prettier --check "app/**/*.{ts,tsx}"

# Expected: All files formatted correctly
# To fix: npx prettier --write "app/**/*.{ts,tsx}"
```

---

### 2. Database Validation

```bash
# Check Prisma schema is valid
npx prisma format

# Expected: No errors, schema formatted

# Verify all migrations applied
npx prisma migrate status

# Expected: "Database schema is up to date!"

# Generate Prisma Client
npx prisma generate

# Expected: Client generated successfully

# Open Prisma Studio to verify data
npx prisma studio

# Expected: All tables visible (Session, Configuration, SettingMetadata, StoneMetadata, AppSettings, AnalyticsEvent)
```

---

### 3. Environment Variables Check

```bash
# Create .env.production file
cp .env.example .env.production

# Edit and fill required variables:
# - SHOPIFY_API_KEY
# - SHOPIFY_API_SECRET
# - SHOPIFY_APP_URL
# - SCOPES
# - DATABASE_URL

# Verify all required vars set
cat .env.production | grep -E "^[A-Z]" | sort
```

**Required Variables**:

```env
SHOPIFY_API_KEY=your_key
SHOPIFY_API_SECRET=your_secret
SHOPIFY_APP_URL=https://your-app-url.com
SCOPES=write_products,read_products,write_orders,read_orders,write_customers,read_customers
DATABASE_URL=postgresql://user:pass@host:5432/dbname
```

---

## Build Process

### 4. Development Build Test

```bash
# Clean previous builds
rm -rf build/
rm -rf .react-router/

# Run development server
npm run dev

# Expected: Server starts on port 3000 (or configured port)
# Expected: No build errors
# Expected: Can access http://localhost:3000

# Open browser DevTools Console
# Expected: No errors

# Navigate through app
# Expected: All pages load
```

---

### 5. Production Build Test

```bash
# Build for production
npm run build

# Expected output:
# ✓ compiled successfully
# Build artifacts in /build directory

# Check build artifacts
ls -lh build/

# Expected files:
# - build/server/index.js (server bundle)
# - build/client/ (client assets)

# Check bundle sizes
du -sh build/server/
du -sh build/client/

# Expected:
# - Server < 5MB
# - Client < 2MB (combined)
```

---

### 6. Production Server Test (Local)

```bash
# Run production server locally
npm run start

# Expected: Server starts
# Access http://localhost:3000

# Test critical paths:
# 1. Load admin interface
# 2. Navigate to products page
# 3. Navigate to settings page
# All should load without errors

# Check server logs
# Expected: No errors
```

---

## Database Migration Validation

### 7. Production Database Setup

```bash
# For fresh production database (PostgreSQL)

# Set production DATABASE_URL
export DATABASE_URL="postgresql://user:pass@prod-host:5432/dbname"

# Run migrations
npx prisma migrate deploy

# Expected: All migrations applied successfully

# Generate Prisma Client for production
npx prisma generate

# Verify connection
npx prisma db execute --stdin <<EOF
SELECT 1;
EOF

# Expected: Connection successful
```

---

### 8. Database Backup (Before Deploy)

```bash
# Backup development database
cp prisma/dev.sqlite prisma/dev.sqlite.backup

# For PostgreSQL production
pg_dump -h host -U user -d dbname > backup-$(date +%Y%m%d).sql

# Verify backup created
ls -lh backup-*.sql
```

---

## Shopify App Configuration Validation

### 9. Verify App Config

```bash
# Check shopify.app.toml
cat shopify.app.toml

# Verify:
# - client_id is set
# - scopes include all required: write_products, read_products, write_orders, read_orders, write_customers, read_customers
# - webhooks registered: products/update, products/delete
# - application_url is production URL (not localhost)
# - embedded = true
```

---

### 10. Deploy App Configuration

```bash
# Deploy app config to Shopify
npm run deploy

# Expected:
# - Configuration deployed successfully
# - Webhooks registered
# - Scopes updated (may require merchant reauthorization)

# Verify in Partner Dashboard
# - Go to Partners → Apps → Your App
# - Check scopes match
# - Check webhook subscriptions exist
```

---

## Theme Extension Validation

### 11. Build & Deploy Extension

```bash
# If you created theme app extension
cd extensions/ring-builder

# Verify extension config
cat shopify.extension.toml

# Deploy extension
npm run deploy

# Expected: Extension deployed to Shopify

# Test in theme editor:
# 1. Go to Online Store → Themes → Customize
# 2. Add app block: "Ring Builder"
# 3. Verify block appears and functions
```

---

## Integration Testing

### 12. End-to-End Flow Test

```bash
# Start server
npm run dev

# Test sequence:
# 1. Open http://localhost:3000/app (admin)
# 2. Mark products as settings/stones
# 3. Add metadata
# 4. Configure settings
# 5. Open storefront with builder
# 6. Complete full configuration flow
# 7. Add to cart
# 8. Verify cart contains correct item

# All steps should work without errors
```

---

### 13. API Integration Test

```bash
# Run all curl tests from API_TESTING.md

# Admin APIs
curl "${BASE_URL}/api/admin/products" -H "Authorization: Bearer ${TOKEN}"
# Should return products

# Builder APIs
curl "${BASE_URL}/api/builder/settings"
# Should return settings

curl "${BASE_URL}/api/builder/stones"
# Should return stones

# Cart API
curl -X POST "${BASE_URL}/api/builder/cart" \
  -H "Content-Type: application/json" \
  -d '{...full config...}'
# Should add to cart

# All should succeed (200-299 status codes)
```

---

### 14. Webhook Integration Test

```bash
# Trigger webhooks using Shopify CLI
shopify webhook trigger --topic products/update

# Check logs
tail -f logs/app.log

# Expected: Webhook received and processed

shopify webhook trigger --topic products/delete

# Expected: Webhook processed, metadata updated
```

---

## Performance Benchmarks

### 15. API Response Times

```bash
# Test each endpoint response time
for endpoint in \
  "api/builder/settings" \
  "api/builder/stones" \
  "api/admin/products" \
  "api/admin/settings"
do
  echo "Testing ${endpoint}..."
  time curl -o /dev/null -s -w "Time: %{time_total}s\n" \
    "${BASE_URL}/${endpoint}"
done

# Expected: All < 0.5s
```

---

### 16. Load Testing (Optional but Recommended)

```bash
# Install Apache Bench or similar
# brew install apache2 (macOS)

# Test concurrent requests
ab -n 100 -c 10 "${BASE_URL}/api/builder/settings"

# Expected:
# - All requests succeed
# - No timeouts
# - Average response time < 500ms
```

---

### 17. Database Query Performance

```bash
# In Prisma Studio or database client

# Test complex stone query
EXPLAIN QUERY PLAN
SELECT * FROM "StoneMetadata"
WHERE shop = 'test.myshopify.com'
  AND shape = 'round'
  AND carat >= 1.0
  AND carat <= 2.0
  AND available = true
ORDER BY price ASC
LIMIT 50;

# Expected: Uses indexes (not full table scan)

# Test with 1000 stones in database
# Query should complete in < 100ms
```

---

## Security Validation

### 18. Security Checklist

```bash
# Check for hardcoded secrets
grep -r "SHOPIFY_API_SECRET" app/ --exclude-dir=node_modules

# Expected: No hardcoded secrets (only env vars)

# Check for console.log in production
grep -r "console.log" app/ --exclude-dir=node_modules

# Expected: Minimal or none (clean up debug logs)

# Run npm audit
npm audit

# Expected: No critical vulnerabilities
# If vulnerabilities: Run npm audit fix
```

---

### 19. Multi-Tenant Isolation Test

```bash
# Create test script: test-isolation.sh

#!/bin/bash
# Create config for Shop A
CONFIG_A=$(curl -X POST "${BASE_URL}/api/builder/cart" \
  -H "X-Shop-Domain: shop-a.myshopify.com" \
  -d '{...}' | jq -r '.configurationId')

# Try to access from Shop B
curl "${BASE_URL}/api/admin/configurations/${CONFIG_A}" \
  -H "X-Shop-Domain: shop-b.myshopify.com"

# Expected: 404 or empty (can't access Shop A's data)
```

---

## Production Deployment Validation

### 20. Pre-Deployment Checklist

- [ ] All tests passed (TESTING_CHECKLIST.md)
- [ ] Build succeeds with no errors
- [ ] TypeScript compiles cleanly
- [ ] Linter passes
- [ ] All environment variables configured
- [ ] Database migrations ready
- [ ] Shopify app config deployed
- [ ] Extension deployed (if applicable)
- [ ] Documentation complete
- [ ] Backup created

---

### 21. Deploy to Production

```bash
# Build production bundle
NODE_ENV=production npm run build

# Deploy to hosting platform (example: Heroku)
git push heroku main

# Or deploy to Fly.io
fly deploy

# Or deploy to AWS/other platform per their docs
```

---

### 22. Post-Deployment Validation

```bash
# Set production URL
export PROD_URL="https://your-app.com"

# Health check
curl "${PROD_URL}/healthz"

# Expected: 200 OK (if health endpoint exists)

# Test admin access
curl "${PROD_URL}/app"

# Expected: Admin interface loads

# Test API endpoints
curl "${PROD_URL}/api/builder/settings"

# Expected: Returns data (may be empty if no products marked yet)

# Check logs on production server
# - No errors on startup
# - No connection errors
# - Database connected successfully
```

---

### 23. Smoke Test on Production

**Admin Smoke Test**:

1. Install app on test store
2. Log in to admin
3. Navigate to Products → Mark one product
4. Navigate to Settings → Save settings
5. All actions complete successfully

**Storefront Smoke Test**:

1. Add builder block to theme
2. View storefront page with builder
3. Complete one full configuration
4. Add to cart
5. Verify in cart
6. Configuration successful

---

### 24. Monitoring Setup

```bash
# Set up error monitoring (e.g., Sentry)
# Add Sentry DSN to environment variables

# Set up uptime monitoring
# - Pingdom, UptimeRobot, or similar
# - Monitor production URL every 5 minutes

# Set up logging
# - Configure log aggregation (e.g., Papertrail, Loggly)
# - Ensure errors logged with context

# Test alerting
# - Trigger an error
# - Verify alert received (email, Slack, etc.)
```

---

## Rollback Plan

### 25. Prepare Rollback

```bash
# Tag current version before deploy
git tag -a v1.0.0-mvp -m "MVP Release"
git push origin v1.0.0-mvp

# If deployment fails, rollback:
git revert HEAD
# Or restore previous version:
git checkout v0.9.0
git push heroku main --force

# Restore database if needed
psql -h host -U user -d dbname < backup-20251012.sql
```

---

## Performance Monitoring

### 26. Post-Launch Monitoring

**Metrics to Track**:

- API response times (should stay < 500ms)
- Error rate (should stay < 1%)
- Database query times
- Memory usage
- CPU usage

**Tools**:

- Built-in server logging
- New Relic / DataDog (if budget allows)
- Shopify Partner Dashboard (app performance metrics)

---

## Continuous Validation

### Daily/Weekly Checks

```bash
# Run automated tests (if you create them)
npm test

# Check error logs
tail -100 logs/error.log

# Check slow queries (if database logging enabled)
# Look for queries > 1 second

# Monitor uptime
# Check uptime monitoring dashboard

# Check user feedback
# Review app store reviews
# Check support tickets
```

---

## Validation Script (All-in-One)

Create `scripts/validate-build.sh`:

```bash
#!/bin/bash

echo "🚀 Ring Builder MVP - Build Validation Script"
echo "=============================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# TypeScript
echo "📝 Checking TypeScript..."
if npm run typecheck; then
  echo -e "${GREEN}✓ TypeScript passed${NC}"
else
  echo -e "${RED}✗ TypeScript failed${NC}"
  exit 1
fi

# Linter
echo ""
echo "🔍 Running Linter..."
if npm run lint; then
  echo -e "${GREEN}✓ Linter passed${NC}"
else
  echo -e "${RED}✗ Linter failed${NC}"
  exit 1
fi

# Prisma
echo ""
echo "🗄️  Validating Database..."
if npx prisma format; then
  echo -e "${GREEN}✓ Prisma schema valid${NC}"
else
  echo -e "${RED}✗ Prisma schema invalid${NC}"
  exit 1
fi

if npx prisma generate; then
  echo -e "${GREEN}✓ Prisma client generated${NC}"
else
  echo -e "${RED}✗ Prisma client generation failed${NC}"
  exit 1
fi

# Build
echo ""
echo "🔨 Building for production..."
if npm run build; then
  echo -e "${GREEN}✓ Build succeeded${NC}"
else
  echo -e "${RED}✗ Build failed${NC}"
  exit 1
fi

# Check bundle size
echo ""
echo "📦 Checking bundle sizes..."
SERVER_SIZE=$(du -sh build/server/ | cut -f1)
CLIENT_SIZE=$(du -sh build/client/ | cut -f1)
echo "Server bundle: ${SERVER_SIZE}"
echo "Client bundle: ${CLIENT_SIZE}"

echo ""
echo -e "${GREEN}✅ All validation checks passed!${NC}"
echo ""
echo "🚀 Ready to deploy!"
```

**Usage**:

```bash
chmod +x scripts/validate-build.sh
./scripts/validate-build.sh
```

---

## Production Readiness Checklist

### Final Verification Before Production

- [ ] **Code Quality**
  - [ ] TypeScript: No errors
  - [ ] Linter: No errors
  - [ ] No console.log statements in production code
  - [ ] No TODO comments unresolved

- [ ] **Build**
  - [ ] Production build succeeds
  - [ ] Build artifacts exist in /build
  - [ ] No build warnings
  - [ ] Bundle sizes reasonable

- [ ] **Database**
  - [ ] All migrations applied
  - [ ] Prisma client generated
  - [ ] Indexes created for performance
  - [ ] Backup created

- [ ] **Configuration**
  - [ ] All environment variables set
  - [ ] Shopify app config deployed
  - [ ] Webhooks registered
  - [ ] Scopes correct

- [ ] **Testing**
  - [ ] All API tests passed (API_TESTING.md)
  - [ ] All feature tests passed (TESTING_CHECKLIST.md)
  - [ ] Mobile tested on real devices
  - [ ] Cross-browser tested
  - [ ] Performance targets met
  - [ ] Security audit complete

- [ ] **Documentation**
  - [ ] Merchant setup guide complete
  - [ ] API documentation complete
  - [ ] Deployment guide complete
  - [ ] Troubleshooting guide complete

- [ ] **Monitoring**
  - [ ] Error monitoring configured (Sentry, etc.)
  - [ ] Uptime monitoring configured
  - [ ] Logging configured
  - [ ] Alerts configured

- [ ] **Launch Criteria** (from PRD)
  - [ ] 3+ beta merchants tested
  - [ ] 50+ configurations created
  - [ ] Zero critical bugs
  - [ ] All FR-1 through FR-12 implemented

---

## Deployment Commands Reference

### Heroku Deployment

```bash
# Create Heroku app
heroku create your-app-name

# Add PostgreSQL addon
heroku addons:create heroku-postgresql:mini

# Set environment variables
heroku config:set SHOPIFY_API_KEY=your_key
heroku config:set SHOPIFY_API_SECRET=your_secret
heroku config:set SHOPIFY_APP_URL=https://your-app-name.herokuapp.com

# Deploy
git push heroku main

# Run migrations
heroku run npx prisma migrate deploy

# View logs
heroku logs --tail
```

---

### Fly.io Deployment

```bash
# Install flyctl
# brew install flyctl (macOS)

# Create app
fly launch

# Add PostgreSQL
fly postgres create

# Connect database
fly postgres attach <postgres-app-name>

# Set secrets
fly secrets set SHOPIFY_API_KEY=your_key
fly secrets set SHOPIFY_API_SECRET=your_secret

# Deploy
fly deploy

# Run migrations
fly ssh console
npx prisma migrate deploy
exit

# View logs
fly logs
```

---

### Custom Server Deployment

```bash
# On your server (via SSH)

# Clone repo
git clone https://github.com/your-repo/ring-builder.git
cd ring-builder

# Install dependencies
npm ci --production

# Set environment variables
export $(cat .env.production | xargs)

# Run migrations
npx prisma migrate deploy

# Build
npm run build

# Start with PM2 (process manager)
pm2 start npm --name "ring-builder" -- start
pm2 save
pm2 startup

# View logs
pm2 logs ring-builder
```

---

## Post-Deployment Monitoring

### Check These Metrics Hourly (First Day)

```bash
# Error rate
curl "${PROD_URL}/api/health/errors"

# Response times
curl -o /dev/null -s -w "Total time: %{time_total}s\n" \
  "${PROD_URL}/api/builder/settings"

# Active sessions
# Check database: SELECT COUNT(*) FROM "Session"

# Configurations created
# Check database: SELECT COUNT(*) FROM "Configuration" WHERE DATE(createdAt) = CURRENT_DATE
```

---

## Rollback Triggers

**Rollback immediately if**:

- Error rate > 5%
- Multiple customer reports of broken features
- Database connection failures
- Critical security vulnerability discovered
- App crashes on startup

**Rollback procedure**:

1. Revert to previous version (git revert or restore)
2. Redeploy previous working version
3. Restore database backup if needed
4. Notify affected merchants
5. Investigate issue in development
6. Fix and redeploy

---

## Success Indicators

**Deployment is successful when**:

- ✅ No errors in production logs
- ✅ All API endpoints responding < 500ms
- ✅ At least 1 merchant completes full workflow
- ✅ At least 1 customer completes configuration and checks out
- ✅ Error rate < 1%
- ✅ Uptime > 99%
- ✅ No critical bugs reported
- ✅ All monitoring dashboards green

---

**End of Build Validation Guide**

**Remember**: Always test thoroughly before deploying to production!
