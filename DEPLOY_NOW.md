# 🚀 Deploy NOW - Your Exact Next Steps

Your app is **ready to deploy**! Follow these steps in order.

## ✅ Pre-Deploy Status

✓ Prisma schema updated to PostgreSQL
✓ Vercel configuration ready
✓ Build tested successfully
✓ Pre-deploy checks passed

## 📋 What You Need

Before starting, have these ready:
- [ ] GitHub account
- [ ] Vercel account (free - sign up at vercel.com)
- [ ] Shopify Partners account (free - partners.shopify.com)

---

## Step 1: Commit Your Changes (2 minutes)

```bash
# Check what changed
git status

# Add all changes
git add .

# Commit with a meaningful message
git commit -m "feat: prepare for production deployment

- Updated Prisma schema to PostgreSQL
- Added Vercel configuration
- Created deployment documentation
- Fixed navigation race condition bug
- Added structured logging
- Implemented form validation"

# If you don't have a GitHub repo yet:
gh repo create shopify-gem-finder --public --source=. --remote=origin --push

# If you already have a remote:
git push origin main
```

---

## Step 2: Set Up Shopify Partner Account (5 minutes)

### A. Create Partner Account
1. Go to https://partners.shopify.com/signup
2. Sign up (completely free, no credit card)
3. Verify your email

### B. Create Development Store
1. In Partners Dashboard → **Stores**
2. Click **Add store** → **Development store**
3. Fill in:
   - Store name: `my-gem-finder-demo` (or any name)
   - Store purpose: **Test an app or theme**
   - ✓ Include test data
4. Click **Create development store**
5. **Save your store URL**: `my-gem-finder-demo.myshopify.com`

### C. Create App
1. In Partners Dashboard → **Apps**
2. Click **Create app** → **Create app manually**
3. Fill in:
   - App name: `Gem Finder`
   - App URL: `https://temporary.com` (we'll update this)
4. Click **Create app**

### D. Get Your Credentials
1. In your app → **Overview** tab
2. **Copy and save these**:
   - **Client ID** (looks like: `919488cf655c3aa5d74db87c9faaec6a`)
   - **Client secret** (click to reveal, then copy)

---

## Step 3: Set Up Database (5 minutes)

Choose **ONE** option:

### Option A: Vercel Postgres (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Link your project
vercel link
# Follow prompts:
# - Set up new project? Yes
# - Link to existing? No
# - Project name: shopify-gem-finder
# - Directory: ./

# Create PostgreSQL database
vercel postgres create
# Name it: gem-finder-db
# Choose region: (closest to you)

# Get the database URL
vercel env pull .env.production
# This creates .env.production with POSTGRES_URL
```

**Your DATABASE_URL** will be in `.env.production` as `POSTGRES_URL`

### Option B: Neon.tech (Alternative)

1. Go to https://neon.tech
2. Sign up (free tier: 10GB)
3. Create new project: `gem-finder`
4. Copy **Connection string** from dashboard
5. Format: `postgresql://user:pass@ep-...neon.tech/neondb?sslmode=require`

---

## Step 4: Deploy to Vercel (5 minutes)

### A. Via Vercel Dashboard (Easiest)

1. Go to https://vercel.com/new
2. **Import** your GitHub repository
3. **Configure Project**:
   - Framework Preset: **Other**
   - Build Command: `npm run build`
   - Output Directory: `build/client`
   - Install Command: `npm install && npx prisma generate`

4. **Environment Variables** - Click "Add" for each:

   ```
   Name: NODE_ENV
   Value: production

   Name: DATABASE_URL
   Value: [your-postgresql-url-from-step-3]

   Name: SHOPIFY_API_KEY
   Value: [your-client-id-from-step-2D]

   Name: SHOPIFY_API_SECRET
   Value: [your-client-secret-from-step-2D]

   Name: SCOPES
   Value: write_products,read_products,write_orders,read_orders,write_customers,read_customers
   ```

5. Click **Deploy**
6. Wait 2-3 minutes for deployment
7. **Copy your Vercel URL**: `https://shopify-gem-finder-abc123.vercel.app`

### B. Via CLI (Alternative)

```bash
# Deploy to Vercel
vercel --prod

# Add environment variables
vercel env add NODE_ENV production
vercel env add DATABASE_URL production
vercel env add SHOPIFY_API_KEY production
vercel env add SHOPIFY_API_SECRET production
vercel env add SCOPES production

# Follow prompts to enter values
```

---

## Step 5: Update Shopify App URLs (3 minutes)

### A. In Shopify Partners Dashboard

1. Go to your app → **Configuration**
2. Update these URLs (use your Vercel URL from Step 4):

   **App URL**:
   ```
   https://your-actual-vercel-url.vercel.app
   ```

   **Allowed redirection URLs** (add both):
   ```
   https://your-actual-vercel-url.vercel.app/api/auth/callback
   https://your-actual-vercel-url.vercel.app/api/auth
   ```

3. Click **Save**

### B. Update Local Config

Update `shopify.app.toml` with your actual Vercel URL:

```toml
client_id = "your-actual-client-id"
name = "gem finder"
application_url = "https://your-actual-vercel-url.vercel.app"
embedded = true

[auth]
redirect_urls = [
  "https://your-actual-vercel-url.vercel.app/api/auth/callback"
]
```

Commit and push:
```bash
git add shopify.app.toml
git commit -m "chore: update production URLs"
git push
# Vercel will auto-deploy!
```

---

## Step 6: Run Database Migrations (2 minutes)

```bash
# Use your DATABASE_URL from Step 3
DATABASE_URL="your-postgres-url-here" npx prisma migrate deploy

# If you get an error, try:
npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script > migration.sql

# Then apply:
DATABASE_URL="your-url" psql -f migration.sql
```

---

## Step 7: Install App on Dev Store (2 minutes)

### Method 1: Via Partners Dashboard

1. In Partners → Your App
2. Click **Test on development store**
3. Select your dev store (from Step 2B)
4. Click **Install app**
5. Grant permissions when prompted
6. You're redirected to your app! 🎉

### Method 2: Via URL

1. Build install URL:
   ```
   https://admin.shopify.com/store/my-gem-finder-demo/oauth/install?client_id=YOUR_CLIENT_ID
   ```
2. Open in browser
3. Click **Install**

---

## Step 8: Test Your App (5 minutes)

### A. Access Admin Panel
```
https://admin.shopify.com/store/YOUR_STORE/apps/gem-finder
```

### B. Test Admin Features
1. Go to **Products** section
2. Mark some products as Settings
3. Mark some products as Diamonds
4. Add metadata (carat, clarity, etc.)

### C. Test Builder Flow
```
https://your-vercel-url.vercel.app/builder?shop=your-store.myshopify.com
```

Test the complete flow:
1. ✓ Select a setting
2. ✓ Select a diamond
3. ✓ Review page loads
4. ✓ Add to cart works

---

## 🎉 Success Checklist

You're done when:
- [ ] App installs without errors
- [ ] Admin panel loads in Shopify
- [ ] Can view products in app
- [ ] Can mark products as settings/diamonds
- [ ] Builder URL loads for customers
- [ ] Can complete full ring configuration
- [ ] Can add to cart successfully

---

## 🔗 Your Demo URLs

**Admin Panel**:
```
https://admin.shopify.com/store/YOUR_STORE/apps/gem-finder
```

**Customer Builder** (share this):
```
https://your-vercel-url.vercel.app/builder?shop=YOUR_STORE.myshopify.com
```

---

## 🐛 Troubleshooting

### Issue: "Failed to fetch" or OAuth error
**Fix**:
- Check environment variables in Vercel
- Verify redirect URLs match exactly
- Make sure shopify.app.toml client_id is correct

### Issue: Database connection error
**Fix**:
```bash
# Verify DATABASE_URL in Vercel
vercel env ls

# Test connection locally
DATABASE_URL="your-url" npx prisma studio
```

### Issue: Build fails on Vercel
**Fix**:
- Check Vercel logs: `vercel logs`
- Ensure build command includes: `npx prisma generate`
- Verify Node version >= 20.10

### Issue: App doesn't load in Shopify admin
**Fix**:
- Check vercel.json has correct headers
- Verify `embedded = true` in shopify.app.toml
- Look at browser console for CORS errors

---

## 📊 Monitor Your Deployment

```bash
# View real-time logs
vercel logs --follow

# Check deployment status
vercel ls

# View environment variables
vercel env ls
```

---

## 🎯 Next Steps After Deployment

1. **Add test products** in your dev store
2. **Configure metadata** for settings and diamonds
3. **Test the full flow** multiple times
4. **Share demo URL** with stakeholders
5. **Gather feedback** and iterate

---

## 💰 Cost Reminder

Everything you just deployed is **FREE**:
- ✅ Shopify Partner Account: Free forever
- ✅ Development Store: Free forever
- ✅ Vercel Hosting: Free tier (100GB bandwidth)
- ✅ Vercel Postgres: Free tier (256MB storage)
- ✅ **Total: $0/month**

⚠️ For production (real store), consider upgrading to Vercel Pro ($20/month)

---

## 🆘 Need Help?

If you get stuck:

1. **Check logs**: `vercel logs --follow`
2. **Review docs**: `DEPLOYMENT_SHOPIFY_DEMO.md`
3. **Verify checklist**: Run `./scripts/pre-deploy-check.sh`
4. **Check Shopify status**: https://status.shopify.com
5. **Vercel status**: https://vercel-status.com

---

**Time to complete**: 20-25 minutes
**Difficulty**: Beginner-friendly
**Cost**: $0

Let's go! 🚀
