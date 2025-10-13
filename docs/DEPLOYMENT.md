# Deployment Guide - Ring Builder MVP

**Purpose**: Deploy the Ring Builder app to production  
**Last Updated**: October 12, 2025  
**Est. Time**: 1-2 hours

---

## Prerequisites

- ✅ All phases complete (1.0 - 7.0)
- ✅ Build successful (`npm run build`)
- ✅ TypeScript passes (`npm run typecheck`)
- ✅ All tests passing
- ✅ Database migrations ready
- ✅ Environment variables configured

---

## Pre-Deployment Checklist

### 1. Code Quality ✅

```bash
# Run all checks
npm run typecheck
npm run build
npm run lint

# Should all pass with 0 critical errors
```

### 2. Database Ready ✅

```bash
# Verify migrations
npx prisma migrate status

# Should show: "Database is up to date"
```

### 3. Environment Variables

Create `.env.production` file:

```bash
# Shopify App Credentials
SHOPIFY_API_KEY="your_api_key"
SHOPIFY_API_SECRET="your_api_secret"

# Database
DATABASE_URL="postgresql://user:password@host:5432/database"

# App URL
SHOPIFY_APP_URL="https://your-app-domain.com"

# Session Storage
SESSION_SECRET="generate_random_32_char_string"

# Optional
NODE_ENV="production"
```

**Security:** Never commit `.env.production` to git!

---

## Deployment Options

### Option 1: Shopify Partner Hosting (Recommended for MVP)

**Pros:**
- Free for development
- Easy setup
- Integrated with Shopify CLI

**Steps:**

1. **Build the app:**
   ```bash
   npm run build
   ```

2. **Deploy using Shopify CLI:**
   ```bash
   npm run deploy
   ```

3. **Follow prompts:**
   - Select your app
   - Confirm deployment
   - Wait for completion

4. **Update app URL:**
   - Shopify CLI will provide a URL
   - Update `shopify.app.toml` if needed

### Option 2: Heroku

**Pros:**
- Simple deployment
- PostgreSQL add-on available
- Free tier available

**Steps:**

1. **Install Heroku CLI:**
   ```bash
   brew install heroku/brew/heroku
   heroku login
   ```

2. **Create Heroku app:**
   ```bash
   heroku create your-ring-builder-app
   ```

3. **Add PostgreSQL:**
   ```bash
   heroku addons:create heroku-postgresql:mini
   ```

4. **Set environment variables:**
   ```bash
   heroku config:set SHOPIFY_API_KEY="your_key"
   heroku config:set SHOPIFY_API_SECRET="your_secret"
   heroku config:set SHOPIFY_APP_URL="https://your-app.herokuapp.com"
   heroku config:set SESSION_SECRET="random_string"
   ```

5. **Deploy:**
   ```bash
   git push heroku main
   ```

6. **Run migrations:**
   ```bash
   heroku run npx prisma migrate deploy
   ```

7. **Open app:**
   ```bash
   heroku open
   ```

### Option 3: Fly.io

**Pros:**
- Fast global deployment
- Built-in PostgreSQL
- Developer-friendly

**Steps:**

1. **Install Fly CLI:**
   ```bash
   curl -L https://fly.io/install.sh | sh
   fly auth login
   ```

2. **Initialize Fly app:**
   ```bash
   fly launch
   ```

3. **Create PostgreSQL:**
   ```bash
   fly postgres create
   ```

4. **Set secrets:**
   ```bash
   fly secrets set SHOPIFY_API_KEY="your_key"
   fly secrets set SHOPIFY_API_SECRET="your_secret"
   fly secrets set SESSION_SECRET="random_string"
   ```

5. **Deploy:**
   ```bash
   fly deploy
   ```

6. **Run migrations:**
   ```bash
   fly ssh console
   npx prisma migrate deploy
   exit
   ```

### Option 4: Railway

**Pros:**
- Simple setup
- PostgreSQL included
- Automatic deploys from Git

**Steps:**

1. Sign up at railway.app
2. Create new project
3. Connect GitHub repository
4. Add PostgreSQL service
5. Set environment variables in dashboard
6. Deploy automatically on push

---

## Post-Deployment Steps

### 1. Update Shopify App Configuration

1. Navigate to Shopify Partner Dashboard
2. Go to your app settings
3. Update **App URL**: `https://your-app-domain.com`
4. Update **Allowed redirection URLs**:
   - `https://your-app-domain.com/api/auth`
   - `https://your-app-domain.com/api/auth/callback`
5. Save changes

### 2. Run Database Migrations

```bash
# On your production server
npx prisma migrate deploy
```

### 3. Verify Webhooks

```bash
# Check webhook registration
curl https://your-app-domain.com/webhooks/products/update

# Should return webhook handler response
```

### 4. Test Installation

1. Install app on a test store
2. Complete the setup process
3. Test all features
4. Create a test configuration
5. Complete a test order

**Verify:**
- ✅ App installs successfully
- ✅ OAuth flow works
- ✅ Database connections work
- ✅ Webhooks register
- ✅ All features functional

---

## Database Migration (SQLite to PostgreSQL)

### Production Requirement

**SQLite** is for development only. Production MUST use **PostgreSQL**.

### Migration Steps

1. **Backup development data:**
   ```bash
   npx prisma studio
   # Export important data (settings/stones if needed)
   ```

2. **Update DATABASE_URL:**
   ```env
   DATABASE_URL="postgresql://user:password@host:5432/database"
   ```

3. **Push schema to PostgreSQL:**
   ```bash
   npx prisma migrate deploy
   ```

4. **Verify:**
   ```bash
   npx prisma studio
   # Should connect to PostgreSQL
   ```

5. **Import data (if needed):**
   - Use CSV import feature in app
   - Or use Prisma seeding script

---

## Monitoring & Maintenance

### Health Checks

**Endpoint:** `/health` (to be created)

**Monitor:**
- App uptime
- Database connection
- Webhook delivery
- API response times

### Logging

**Production logging:**

```bash
# View logs (Heroku)
heroku logs --tail

# View logs (Fly.io)
fly logs

# View logs (Railway)
# Check dashboard
```

**What to monitor:**
- Webhook receipts
- Error messages
- Database queries
- API calls to Shopify

### Backup Strategy

**Daily:**
- Automated database backups (via hosting provider)

**Weekly:**
- Export configurations (CSV)
- Export settings/stones metadata

**Monthly:**
- Full database snapshot
- Test restore procedure

---

## Scaling Considerations

### When to Scale

**Signs you need to scale:**
- Response times > 1 second
- Database queries slow
- Multiple merchants (10+)
- High traffic (1000+ visits/day)

### Scaling Options

1. **Database:**
   - Upgrade PostgreSQL plan
   - Add read replicas
   - Implement caching (Redis)

2. **App Server:**
   - Increase dyno/instance size
   - Add more instances
   - Implement load balancing

3. **Assets:**
   - Use CDN for images
   - Implement asset caching
   - Optimize bundle sizes

---

## Security Checklist

Before production launch:

- [ ] All environment variables in `.env` (not hardcoded)
- [ ] SESSION_SECRET is random and strong (32+ characters)
- [ ] HTTPS enabled (required by Shopify)
- [ ] Webhook HMAC verification working
- [ ] Multi-tenant isolation verified (no data leaks)
- [ ] Input validation on all endpoints
- [ ] Rate limiting implemented (if high traffic)
- [ ] Database connection pooling configured
- [ ] Error messages don't expose sensitive data
- [ ] Admin routes require authentication

---

## Rollback Procedure

If deployment fails or has critical bugs:

### Quick Rollback

```bash
# Heroku
heroku rollback

# Fly.io
fly releases
fly deploy --image <previous-image>

# Git-based (Railway, etc.)
git revert HEAD
git push
```

### Database Rollback

```bash
# Only if migrations cause issues
npx prisma migrate resolve --rolled-back [migration_name]
```

**⚠️ Warning:** Test rollback procedure in staging first!

---

## Performance Optimization

### Database Indexes

Verify indexes exist (already in schema):

```sql
-- Should have indexes on:
-- SettingMetadata: shop, style, featured
-- StoneMetadata: shop, shape, carat, available, price
-- Configuration: shop, customerId, status
```

### Caching Strategy

**What to cache:**
- Product data (5-minute TTL)
- AppSettings (1-hour TTL)
- Setting/Stone lists (5-minute TTL)

**Implementation:**
- Use React Context for client-side
- Use Redis for server-side (future)

### CDN Configuration

**For production:**
- Serve static assets via CDN
- Cache product images
- Enable gzip compression

---

## Monitoring & Alerts

### Recommended Tools

**Application Monitoring:**
- Sentry (error tracking)
- LogRocket (session replay)
- DataDog (APM)

**Uptime Monitoring:**
- Pingdom
- UptimeRobot
- Better Uptime

**Alerts to Setup:**
- App down (5+ minute outage)
- Error rate > 5%
- Database connection failures
- Webhook delivery failures

---

## Deployment Verification

After deployment, verify:

### 1. App Installation ✅

```bash
# Install on test store
# Should complete without errors
```

### 2. API Endpoints ✅

```bash
# Test each endpoint
curl https://your-app-domain.com/api/builder/settings
curl https://your-app-domain.com/api/builder/stones
# Both should return valid JSON
```

### 3. Database Connection ✅

```bash
# Check database connection
# Should show "Connected" in logs
```

### 4. Webhooks ✅

```bash
# Update a product in Shopify
# Verify webhook received (check logs)
# Verify data synchronized
```

### 5. Complete Flow ✅

1. Install app on test store
2. Mark products as settings/stones
3. Add metadata
4. Visit storefront builder
5. Complete configuration
6. Add to cart
7. Complete checkout
8. Verify order in Shopify admin

**All passing?** ✅ **Deployment successful!**

---

## Troubleshooting Deployment

### Build Fails

**Symptoms:** `npm run build` fails

**Solutions:**
- Check TypeScript errors: `npm run typecheck`
- Check for missing dependencies: `npm install`
- Clear cache: `rm -rf node_modules && npm install`

### Database Connection Fails

**Symptoms:** "Can't connect to database"

**Solutions:**
- Verify `DATABASE_URL` in environment variables
- Check database is running
- Verify firewall allows connections
- Test connection string locally

### Webhooks Not Working

**Symptoms:** Products don't sync automatically

**Solutions:**
- Verify webhooks registered in Shopify Partner dashboard
- Check app URL is correct and accessible
- Verify HTTPS is enabled
- Check webhook endpoint logs
- Test with `shopify webhook trigger`

### App Won't Install

**Symptoms:** Installation fails or loops

**Solutions:**
- Verify OAuth URLs in Partner dashboard
- Check `shopify.app.toml` configuration
- Verify scopes are correct
- Clear browser cookies and try again

---

## Production Checklist

Before making app public:

- [ ] Deployed to production environment
- [ ] Database using PostgreSQL (not SQLite)
- [ ] All environment variables set
- [ ] HTTPS enabled
- [ ] Webhooks verified working
- [ ] Test installation successful
- [ ] Complete flow tested end-to-end
- [ ] Performance acceptable (< 3s load)
- [ ] Error handling working
- [ ] Monitoring setup
- [ ] Backup strategy in place
- [ ] Documentation complete
- [ ] Team trained
- [ ] Support process defined

**All checked?** ✅ **Ready for production!**

---

## Going Live

1. **Update App Listing** (if public app)
   - Add screenshots
   - Write clear description
   - Set pricing (if applicable)
   - Add support contact

2. **Announce Launch**
   - Email existing customers
   - Social media announcement
   - Update website

3. **Monitor Closely**
   - Watch error rates first week
   - Respond quickly to issues
   - Collect feedback

4. **Iterate**
   - Fix bugs promptly
   - Plan next features
   - Improve based on feedback

---

**Congratulations on deploying your Ring Builder app!** 🚀💍

---

**End of Deployment Guide**

