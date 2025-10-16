# Production Environment Variables

**For:** Phase 3.0 Production Deployment  
**Date:** October 14, 2025  
**Security:** NEVER commit actual values to git!

---

## 🔐 REQUIRED VARIABLES

### Shopify Configuration
```bash
# From Shopify Partners Dashboard → Apps → Your App
SHOPIFY_API_KEY=your_shopify_api_key_here
SHOPIFY_API_SECRET=your_shopify_api_secret_here

# Your production URL
SHOPIFY_APP_URL=https://your-app.herokuapp.com

# App scopes (DO NOT CHANGE unless adding features)
SCOPES=write_products,read_products,write_orders,read_orders,write_customers,read_customers

# Node environment
NODE_ENV=production
```

### Database
```bash
# PostgreSQL connection string
# Automatically set by Heroku when you add Postgres
# Or get from Supabase/Railway dashboard
DATABASE_URL=postgresql://username:password@host:5432/database
```

---

## 📧 OPTIONAL: EMAIL SERVICE

### Option 1: SendGrid (Recommended)
```bash
# Sign up: https://sendgrid.com (free: 100 emails/day)
SENDGRID_API_KEY=SG.xxxxxxxxxxxx
EMAIL_FROM_ADDRESS=noreply@your-domain.com
EMAIL_FROM_NAME=Ring Builder
MERCHANT_EMAIL=support@your-domain.com
```

### Option 2: AWS SES
```bash
AWS_SES_ACCESS_KEY=your_access_key
AWS_SES_SECRET_KEY=your_secret_key
AWS_SES_REGION=us-east-1
EMAIL_FROM_ADDRESS=noreply@your-domain.com
```

### Option 3: Postmark
```bash
POSTMARK_API_KEY=your_postmark_api_key
EMAIL_FROM_ADDRESS=noreply@your-domain.com
```

---

## 📊 OPTIONAL: MONITORING

### Sentry (Error Tracking)
```bash
# Sign up: https://sentry.io (free: 5K events/month)
SENTRY_DSN=https://xxxxx@sentry.io/xxxxx
```

---

## ⚙️ HOW TO SET VARIABLES

### Heroku
```bash
# Set one variable
heroku config:set SHOPIFY_API_KEY=your_key --app your-app-name

# Set multiple variables
heroku config:set \
  SHOPIFY_API_KEY=your_key \
  SHOPIFY_API_SECRET=your_secret \
  SHOPIFY_APP_URL=https://your-app.herokuapp.com \
  --app your-app-name

# View all variables
heroku config --app your-app-name

# View specific variable
heroku config:get SHOPIFY_API_KEY --app your-app-name
```

### Fly.io
```bash
# Set variables (called "secrets")
fly secrets set SHOPIFY_API_KEY=your_key
fly secrets set SHOPIFY_API_SECRET=your_secret

# List secrets
fly secrets list
```

### Railway
1. Go to Railway dashboard
2. Select your project
3. Click "Variables" tab
4. Add each variable manually

---

## ✅ VERIFICATION CHECKLIST

After setting all variables:

**Required:**
- [ ] SHOPIFY_API_KEY set
- [ ] SHOPIFY_API_SECRET set
- [ ] SHOPIFY_APP_URL set (matches your deployment URL)
- [ ] SCOPES set
- [ ] DATABASE_URL set (or auto-set by host)
- [ ] NODE_ENV=production

**Recommended:**
- [ ] Email service configured (SendGrid/SES/Postmark)
- [ ] EMAIL_FROM_ADDRESS set
- [ ] MERCHANT_EMAIL set
- [ ] SENTRY_DSN set

**Verify:**
```bash
# Heroku
heroku config --app your-app-name | grep SHOPIFY

# Should show:
# SHOPIFY_API_KEY: your_key
# SHOPIFY_API_SECRET: your_secret
# SHOPIFY_APP_URL: https://...
```

---

## 🚨 SECURITY BEST PRACTICES

### DO:
✅ Use environment variables for ALL secrets  
✅ Use different values for dev/staging/production  
✅ Rotate secrets every 90 days  
✅ Use strong, unique passwords  
✅ Enable 2FA on all service accounts  
✅ Never commit secrets to git  

### DON'T:
❌ Hardcode secrets in code  
❌ Commit .env files to git  
❌ Share secrets via email/Slack  
❌ Use same secrets for dev and prod  
❌ Leave default passwords  
❌ Expose secrets in error messages  

---

## 🔄 UPDATING VARIABLES

### When You Need to Change a Variable

**Heroku:**
```bash
# Update
heroku config:set SHOPIFY_API_KEY=new_value --app your-app-name

# Remove
heroku config:unset SHOPIFY_API_KEY --app your-app-name

# App restarts automatically after change
```

**Fly.io:**
```bash
# Update
fly secrets set SHOPIFY_API_KEY=new_value

# Remove
fly secrets unset SHOPIFY_API_KEY

# Deploy to apply changes
fly deploy
```

---

## 📋 TROUBLESHOOTING

### App Won't Start

**Check environment variables are set:**
```bash
heroku config --app your-app-name
```

**Look for missing required variables:**
- SHOPIFY_API_KEY
- SHOPIFY_API_SECRET
- DATABASE_URL

### Database Connection Fails

**Check DATABASE_URL format:**
```
postgresql://username:password@host:5432/database?sslmode=require
```

**Test connection:**
```bash
# Heroku
heroku pg:info --app your-app-name

# Local
psql $DATABASE_URL
```

### OAuth Fails

**Check SHOPIFY_APP_URL matches deployment:**
```bash
# Should be:
SHOPIFY_APP_URL=https://your-app.herokuapp.com

# NOT:
# http://localhost:3000 (development URL)
# https://example.com (placeholder)
```

**Update in Shopify Partners Dashboard:**
- App URL must match
- Redirect URLs must match

---

## 🎯 QUICK SETUP GUIDE

**For fastest setup on Heroku:**

```bash
# 1. Create app and add Postgres
heroku create your-app-name
heroku addons:create heroku-postgresql:mini --app your-app-name

# 2. Set required variables (update with your actual values)
heroku config:set \
  SHOPIFY_API_KEY=your_actual_key \
  SHOPIFY_API_SECRET=your_actual_secret \
  SHOPIFY_APP_URL=https://your-app-name.herokuapp.com \
  SCOPES=write_products,read_products,write_orders,read_orders,write_customers,read_customers \
  NODE_ENV=production \
  --app your-app-name

# 3. Deploy
git push heroku main

# 4. Run migrations
heroku run npx prisma migrate deploy --app your-app-name

# 5. Test
curl https://your-app-name.herokuapp.com/api/health
```

**Done!** App is live in production.

---

**Document Version:** 1.0  
**Created:** October 14, 2025  
**Status:** Production Ready

