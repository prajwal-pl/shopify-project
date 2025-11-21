# Production Installation Guide

## How Real Merchants Install Your App (No Code Access)

This guide explains the **complete production flow** from a merchant's perspective - exactly what your clients will experience when installing your Vercel-hosted app.

---

## Overview: The Merchant Experience

```
┌─────────────────────────────────────────────────────────────┐
│                    MERCHANT'S PERSPECTIVE                   │
│                 (No codebase access needed)                 │
└─────────────────────────────────────────────────────────────┘

Step 1: Merchant has Shopify store
   ↓
Step 2: Merchant finds your app
   ↓
Step 3: Clicks "Install App"
   ↓
Step 4: OAuth authorization (automatic)
   ↓
Step 5: Redirected to your Vercel app
   ↓
Step 6: Onboarding starts automatically
   ↓
Step 7: Merchant customizes theme (purple/gold, teal/coral, etc.)
   ↓
Step 8: App is embedded in their store
   ↓
Step 9: Merchant uses ring builder
```

---

## Part 1: Understanding App Distribution

### Option A: Shopify App Store (Public Distribution)

**What It Is:**
- Your app is listed publicly in Shopify App Store
- Any merchant can find and install it
- Requires Shopify approval (1-2 weeks review process)

**How Merchants Install:**
1. Go to Shopify Admin → Apps → App Store
2. Search "Gem Finder" (your app name)
3. Click "Add app"
4. Click "Install app" on permission screen
5. Automatically redirected to your Vercel app
6. Onboarding starts

**Installation URL:** None needed - merchants find it in App Store

---

### Option B: Custom App Link (Private Distribution)

**What It Is:**
- You share a direct installation link
- Only merchants with the link can install
- No App Store approval needed
- Perfect for private clients or beta testing

**How Merchants Install:**
You give them a URL like:
```
https://YOUR-STORE.myshopify.com/admin/oauth/authorize?client_id=919488cf655c3aa5d74db87c9faaec6a
```

They:
1. Visit the URL
2. Click "Install app"
3. Automatically redirected to your Vercel app
4. Onboarding starts

---

### Option C: Partners Dashboard (Development Testing)

**What It Is:**
- Install directly from Partners dashboard
- For testing on development stores
- Simulates production flow

**How You Test:**
1. Go to Partners dashboard
2. Select your app
3. Click "Select store"
4. Choose dev store
5. App installs using production Vercel URL

---

## Part 2: Current State - Your Setup

### What You Have Deployed

**Production App:**
- URL: `https://shopify-gem-finder.vercel.app`
- Status: ✅ Deployed and running
- Database: Neon PostgreSQL
- All features: Onboarding, theme customization, embed code

**App Configuration:**
- Client ID: `919488cf655c3aa5d74db87c9faaec6a`
- OAuth Redirect: `https://shopify-gem-finder.vercel.app/auth/callback`
- Scopes: Products, Orders, Customers (read/write)

**Test Store:**
- Name: demo-store-123456789552125478794
- Type: Development store (via Partners)
- Status: Not yet installed

---

## Part 3: Installation Methods for Testing

### Method 1: OAuth Authorization URL (Direct Install)

**For Development Stores:**

Use this URL format:
```
https://admin.shopify.com/oauth/redirect_from_cli?client_id=919488cf655c3aa5d74db87c9faaec6a&store=demo-store-123456789552125478794
```

**Steps:**
1. Visit the URL in browser
2. Select your dev store if prompted
3. Click "Install app"
4. OAuth completes → redirects to Vercel
5. Onboarding starts

---

### Method 2: Via Partners Dashboard

**Steps:**
1. Go to: https://partners.shopify.com/187914129/apps
2. Click "gem finder"
3. Click "Select store" or "Test your app"
4. Select: `demo-store-123456789552125478794`
5. Click "Install"

---

### Method 3: Standard OAuth (For Real Stores)

**For production/trial stores (not Partners dev stores):**

```
https://demo-store-123456789552125478794.myshopify.com/admin/oauth/authorize?client_id=919488cf655c3aa5d74db87c9faaec6a&scope=read_customers,read_orders,read_products,write_customers,write_orders,write_products&redirect_uri=https://shopify-gem-finder.vercel.app/auth/callback
```

---

## Part 4: What Happens After Installation

### Automatic Flow (No Client Action Needed)

```
1. OAuth completes
   ↓
2. Shopify redirects to: https://shopify-gem-finder.vercel.app/auth/callback
   ↓
3. Your app receives:
   - shop: merchant's store domain
   - accessToken: to call Shopify API
   - timestamp, hmac: for security
   ↓
4. Your app creates Merchant record in database
   ↓
5. Your app checks onboarding status
   ↓
6. Redirects to: /app/onboarding (first install)
   OR
   Redirects to: /app (already onboarded)
```

### Onboarding Flow (6 Steps)

**Step 1: Welcome**
- Intro to Ring Builder
- Click "Get Started"

**Step 2: Create Page**
- App automatically creates Shopify page
- URL: `/pages/design-your-ring`
- Uses Shopify Admin API

**Step 3: Add to Menu**
- App adds page to navigation
- Merchant can customize menu name

**Step 4: Customize Theme**
- **THIS IS WHERE MULTI-MERCHANT MAGIC HAPPENS**
- Merchant selects colors:
  - Primary Color (e.g., purple #9333EA)
  - Accent Color (e.g., gold #F59E0B)
  - Background Color
  - Text Color
- Chooses font, button style
- Adds custom CSS
- **Each merchant gets unique theme stored in database**

**Step 5: Test Builder**
- Preview ring builder with their theme
- Try building a ring
- See theme applied in real-time

**Step 6: Complete**
- Onboarding marked complete
- Dashboard unlocked
- App fully functional

---

## Part 5: Embedding in Merchant's Store

### Two Embedding Methods

#### Method A: Theme App Extension (Automatic)

Your app has a theme extension:
- Merchant goes to: Themes → Customize → App Embeds
- Finds "Ring Builder"
- Toggles ON
- Builder appears on their site
- Uses merchant's custom theme colors

#### Method B: Iframe Embed (Manual)

Merchant gets embed code from your app:

1. In your app, go to: Settings → Embed
2. Copy embed code:
```html
<iframe
  src="https://shopify-gem-finder.vercel.app/embed/builder?shop=MERCHANT-STORE.myshopify.com"
  width="100%"
  height="800px"
  frameborder="0">
</iframe>
```
3. Paste in Shopify page or blog post
4. Builder appears with their custom theme

---

## Part 6: Multi-Merchant Architecture

### How Data Isolation Works

**Each merchant gets:**
- ✅ Separate database row (keyed by `shop` domain)
- ✅ Unique theme settings (colors, fonts, CSS)
- ✅ Own products (if using database products)
- ✅ Own orders and customer data
- ✅ Independent onboarding state

**Database Structure:**
```
Merchant Table:
┌─────────────────────────────────┬──────────────┬──────────────┐
│ shop                            │ theme        │ onboarding   │
├─────────────────────────────────┼──────────────┼──────────────┤
│ luxury-jewelers.myshopify.com   │ purple/gold  │ completed    │
│ modern-rings.myshopify.com      │ teal/coral   │ completed    │
│ demo-store-123...myshopify.com  │ default      │ not started  │
└─────────────────────────────────┴──────────────┴──────────────┘

AppSettings Table (linked to Merchant):
┌─────────────────────────────────┬──────────┬─────────┬────────────┐
│ shop                            │ primary  │ accent  │ bgColor    │
├─────────────────────────────────┼──────────┼─────────┼────────────┤
│ luxury-jewelers.myshopify.com   │ #9333EA  │ #F59E0B │ #FFFFFF    │
│ modern-rings.myshopify.com      │ #14B8A6  │ #FB7185 │ #F9FAFB    │
└─────────────────────────────────┴──────────┴─────────┴────────────┘
```

**Query Example (Automatic Isolation):**
```javascript
// When merchant visits app, Shopify passes shop parameter
const shop = "luxury-jewelers.myshopify.com";

// All queries automatically filtered by shop
const settings = await prisma.appSettings.findUnique({
  where: { shop }  // ← Only gets this merchant's data
});

// Merchant B cannot see Merchant A's data
```

---

## Part 7: Testing Production Flow RIGHT NOW

### Option 1: Direct OAuth URL (Try This First)

**Step-by-step:**

1. Open this URL in your browser:
```
https://admin.shopify.com/oauth/redirect_from_cli?client_id=919488cf655c3aa5d74db87c9faaec6a&store=demo-store-123456789552125478794
```

2. You should see:
   - Shopify OAuth permission screen
   - List of requested permissions
   - "Install app" button

3. Click "Install app"

4. Shopify redirects to:
   ```
   https://shopify-gem-finder.vercel.app/auth/callback?code=...&shop=demo-store-123456789552125478794.myshopify.com
   ```

5. Your Vercel app:
   - Exchanges code for access token
   - Creates merchant record
   - Checks onboarding
   - Redirects to `/app/onboarding`

6. You see onboarding screen!

---

### Option 2: Create Real Shopify Trial Store

**Why:** Dev stores have OAuth restrictions. Real trial stores act like production.

**Steps:**

1. Go to: https://www.shopify.com/free-trial
2. Create new store (NOT via Partners)
3. Store name: `your-name-gem-test`
4. Complete setup

5. Use this installation URL:
```
https://your-name-gem-test.myshopify.com/admin/oauth/authorize?client_id=919488cf655c3aa5d74db87c9faaec6a&scope=read_customers,read_orders,read_products,write_customers,write_orders,write_products&redirect_uri=https://shopify-gem-finder.vercel.app/auth/callback
```

6. Install → Onboarding starts

**This is EXACTLY how real merchants will install.**

---

## Part 8: Simulating Multiple Merchants

### Scenario: Testing Multi-Merchant Themes

**Goal:** Show that 2 merchants get different themes

**Setup:**

1. **Merchant A (Luxury Jewelers)**
   - Install on store A
   - Complete onboarding
   - Set theme: Purple (#9333EA), Gold (#F59E0B)
   - View builder → See purple/gold theme

2. **Merchant B (Modern Rings)**
   - Install on store B
   - Complete onboarding
   - Set theme: Teal (#14B8A6), Pink (#FB7185)
   - View builder → See teal/pink theme

3. **Test Embed:**
   ```html
   <!-- Merchant A's embed -->
   <iframe src="https://shopify-gem-finder.vercel.app/embed/builder?shop=store-a.myshopify.com"></iframe>
   <!-- Shows purple/gold -->

   <!-- Merchant B's embed -->
   <iframe src="https://shopify-gem-finder.vercel.app/embed/builder?shop=store-b.myshopify.com"></iframe>
   <!-- Shows teal/pink -->
   ```

4. **Verify Database:**
   ```sql
   SELECT shop, primaryColor, accentColor
   FROM AppSettings;

   -- Returns:
   -- store-a.myshopify.com | #9333EA | #F59E0B
   -- store-b.myshopify.com | #14B8A6 | #FB7185
   ```

---

## Part 9: Common Issues & Solutions

### Issue 1: OAuth "invalid_link" Error

**Cause:** Using wrong OAuth endpoint for dev stores

**Solution:** Use Partners redirect:
```
https://admin.shopify.com/oauth/redirect_from_cli?client_id=919488cf655c3aa5d74db87c9faaec6a&store=YOUR-STORE
```

---

### Issue 2: App Shows But No Onboarding

**Cause:** Merchant record exists but onboarding not started

**Solution:** Reset onboarding:
```bash
node scripts/reset-onboarding-demo.mjs YOUR-STORE.myshopify.com
```

---

### Issue 3: Theme Not Applying

**Cause:** Theme settings not saved or shop parameter missing

**Debug:**
```javascript
// Check theme in database
const settings = await prisma.appSettings.findUnique({
  where: { shop: "YOUR-STORE.myshopify.com" },
  select: { primaryColor: true, accentColor: true }
});
console.log(settings); // Should show colors
```

---

### Issue 4: Embed Shows Wrong Theme

**Cause:** Shop parameter missing or incorrect in embed URL

**Fix:** Ensure embed URL includes shop:
```html
<iframe src="https://shopify-gem-finder.vercel.app/embed/builder?shop=EXACT-STORE.myshopify.com"></iframe>
```

---

## Part 10: Going Live for Real Merchants

### Step 1: Verify Production Deployment

**Checklist:**
- ✅ App deployed to Vercel
- ✅ Environment variables set (DATABASE_URL, SHOPIFY_API_KEY, etc.)
- ✅ Domain configured (optional: custom domain)
- ✅ All routes working (test /auth/callback, /app, /embed)

---

### Step 2: Submit to App Store (Optional)

**If you want public distribution:**

1. Go to Partners Dashboard
2. Click "gem finder" app
3. Click "Submit for Review"
4. Fill out:
   - App description
   - Screenshots
   - Privacy policy URL
   - Support email
   - Pricing model

5. Wait 1-2 weeks for Shopify review

6. Once approved → appears in App Store

---

### Step 3: Share Installation Link (For Private Clients)

**If you want private distribution:**

Give clients this URL template:
```
https://THEIR-STORE.myshopify.com/admin/oauth/authorize?client_id=919488cf655c3aa5d74db87c9faaec6a&scope=read_customers,read_orders,read_products,write_customers,write_orders,write_products&redirect_uri=https://shopify-gem-finder.vercel.app/auth/callback
```

Replace `THEIR-STORE` with their actual store name.

Send email:
```
Subject: Install Gem Finder on Your Shopify Store

Hi [Client Name],

To install Gem Finder on your store:

1. Click this link: [Installation URL]
2. Review the permissions
3. Click "Install app"
4. Complete the 5-minute onboarding

You'll be able to customize colors, fonts, and branding to match your store.

Questions? Reply to this email.

Best,
[Your Name]
```

---

## Part 11: No Code Required for Clients

### What Clients Never See or Touch

❌ Codebase
❌ GitHub repository
❌ Vercel dashboard
❌ Database
❌ Terminal commands
❌ Technical configuration

### What Clients Do See and Use

✅ Installation link (1 click)
✅ Shopify permission screen (standard OAuth)
✅ Onboarding wizard (6 steps, 5 minutes)
✅ Theme customization UI (color pickers, dropdowns)
✅ Embed code generator (copy/paste)
✅ Ring builder (their branded version)
✅ Settings dashboard (manage products, pricing)

### The Client Experience (Summary)

```
1. Receives installation link
   ↓
2. Clicks link
   ↓
3. Sees Shopify permission screen
   ↓
4. Clicks "Install app"
   ↓
5. Redirected to your app (Vercel)
   ↓
6. Completes onboarding (picks colors, fonts)
   ↓
7. App is live in their store
   ↓
8. Customers use ring builder
   ↓
9. Orders come through with custom rings
```

**Total time: 5-10 minutes**
**Technical knowledge required: ZERO**

---

## Part 12: Next Steps for You

### To Test Production Right Now

**Option A: Try OAuth URL with dev store**
```
https://admin.shopify.com/oauth/redirect_from_cli?client_id=919488cf655c3aa5d74db87c9faaec6a&store=demo-store-123456789552125478794
```

**Option B: Create Shopify trial store**
1. Go to shopify.com/free-trial
2. Create store
3. Use standard OAuth URL
4. Test full onboarding

**Option C: Wait for next dev session**
- Use `shopify app dev`
- Install on dev store via tunnel
- Complete onboarding
- Test theme customization

---

### To Prepare for Real Clients

**Week 1:**
- [ ] Test onboarding on 2-3 stores
- [ ] Verify theme isolation works
- [ ] Test embed on different themes
- [ ] Fix any bugs

**Week 2:**
- [ ] Create support documentation
- [ ] Set up support email
- [ ] Create privacy policy
- [ ] Create terms of service

**Week 3:**
- [ ] Submit to App Store (if public)
- [ ] OR prepare installation links (if private)
- [ ] Test on real client store (with permission)

**Week 4:**
- [ ] Launch! 🚀
- [ ] Monitor installations
- [ ] Provide support
- [ ] Iterate based on feedback

---

## Summary

**Production Installation Flow:**
1. Merchant receives link → clicks
2. OAuth completes → redirects to Vercel
3. Onboarding starts → customizes theme
4. App embedded → fully functional
5. **No code access needed at any point**

**Multi-Merchant:**
- Each merchant → separate database row
- Each merchant → custom theme colors
- Each merchant → isolated data
- All merchants → same Vercel URL

**Your Role:**
- Deploy once to Vercel ✅
- Share installation links
- Support merchants
- Monitor & iterate

**Merchant Role:**
- Click install link
- Complete onboarding
- Use the app
- **That's it!**

---

## Appendix: Useful URLs

**Your App:**
- Production: https://shopify-gem-finder.vercel.app
- Partners: https://partners.shopify.com/187914129/apps/288951402497

**Installation (Dev Store):**
```
https://admin.shopify.com/oauth/redirect_from_cli?client_id=919488cf655c3aa5d74db87c9faaec6a&store=demo-store-123456789552125478794
```

**Installation (Real Store):**
```
https://STORE.myshopify.com/admin/oauth/authorize?client_id=919488cf655c3aa5d74db87c9faaec6a&scope=read_customers,read_orders,read_products,write_customers,write_orders,write_products&redirect_uri=https://shopify-gem-finder.vercel.app/auth/callback
```

**Database Check:**
```javascript
// See all installed merchants
const merchants = await prisma.merchant.findMany({
  include: { settings: true }
});
```

---

**Ready to test? Try the OAuth URL above and see onboarding in action!**
