# 🧪 RING BUILDER - COMPLETE TESTING GUIDE

**Start Here!** - Step-by-step instructions to test your Ring Builder MVP  
**Date:** October 12, 2025  
**Status:** Dev Server Running ✅

---

## 🔗 YOUR APPLICATION URLS

Based on your running server:

**Local URL:** http://localhost:51077/  
**Public URL (Cloudflare Tunnel):** https://fine-parcel-sodium-bills.trycloudflare.com  
**Dev Store:** builder-store-103.myshopify.com  
**GraphiQL:** http://localhost:51076

---

## 🎯 TESTING ROADMAP

We'll test in this order:

1. **Database Setup** (5 min) - Add test data
2. **Admin Interface** (15 min) - Test product management
3. **API Endpoints** (10 min) - Verify all APIs work
4. **Builder Components** (Optional) - Test customer flow
5. **Webhooks** (5 min) - Test product sync

**Total Time:** ~35 minutes

---

## 📊 STEP 1: DATABASE SETUP (5 minutes)

### Open Prisma Studio

**In a NEW terminal window:**

```bash
cd /Users/samarthgugnani/Projects/prashant/gold-jwellers-shopify-v2/builder-mvp-app
npx prisma studio
```

**Opens at:** http://localhost:5555

### Add Default AppSettings

1. Click **"AppSettings"** in left sidebar
2. Click **"Add record"** button
3. Fill in the form:

```
id: (auto-generated)
shop: builder-store-103.myshopify.com
builderEnabled: true
markupPercent: 5
sideStones: {"enabled":true,"qualities":["Good","Better","Best","Premium"],"pricing":{"Good":50,"Better":75,"Best":100,"Premium":150},"minQuantity":8,"maxQuantity":24}
engravingFee: 0
notifyOnConfig: false
primaryColor: #000000
accentColor: #d4af37
```

4. Click **"Save 1 change"**

**✅ Checkpoint:** AppSettings record created

### Add Test SettingMetadata (Optional)

1. Click **"SettingMetadata"**
2. Click **"Add record"**
3. Fill in:

```
shop: builder-store-103.myshopify.com
productId: gid://shopify/Product/123
style: solitaire
settingHeight: medium
compatibleShapes: ["round","cushion","oval"]
basePrices: {"14k_white_gold":1200,"14k_yellow_gold":1250,"18k_rose_gold":1400,"platinum":1800}
images: ["https://cdn.shopify.com/s/files/1/0000/0000/products/setting.jpg"]
featured: true
```

4. Click **"Save 1 change"**

### Add Test StoneMetadata (Optional)

1. Click **"StoneMetadata"**
2. Click **"Add record"**
3. Fill in:

```
shop: builder-store-103.myshopify.com
productId: gid://shopify/Product/456
stoneType: Diamond
shape: round
carat: 1.5
cut: excellent
color: G
clarity: VS1
certificate: GIA
certificateNumber: 2141234567
price: 8999
available: true
images: ["https://cdn.shopify.com/s/files/1/0000/0000/products/diamond.jpg"]
```

4. Click **"Save 1 change"**

**✅ Checkpoint:** Test data created

---

## 🏢 STEP 2: TEST ADMIN INTERFACE (15 minutes)

### Access Admin Dashboard

**URL:** http://localhost:51077/app

**Or Public URL:** https://fine-parcel-sodium-bills.trycloudflare.com/app

**Note:** You may need to authenticate with Shopify first.

### Test 2.1: Admin Login & Navigation

**Steps:**

1. Navigate to http://localhost:51077/app
2. If prompted, install app on builder-store-103.myshopify.com
3. Complete OAuth authentication
4. Should redirect to admin dashboard

**Expected:**

- ✅ App loads in Shopify admin iframe
- ✅ Polaris components render
- ✅ Navigation menu shows: Dashboard, Products, Settings
- ✅ No console errors

**✅ Checkpoint:** Admin accessible

### Test 2.2: Products Page

**Steps:**

1. Click **"Products"** in navigation
2. View products list
3. Search for a product (if search exists)
4. Scroll through products

**Expected:**

- ✅ Products display in grid/list
- ✅ Product images load
- ✅ Product titles, prices, SKUs visible
- ✅ "Mark as Setting" and "Mark as Stone" buttons visible
- ✅ Badges show if already marked

**✅ Checkpoint:** Products page works

### Test 2.3: Mark Product as Setting

**Steps:**

1. Find an unmarked product
2. Click **"Mark as Setting"** button
3. Wait for page reload/navigation
4. Should see metadata form

**Expected:**

- ✅ Success message appears
- ✅ Product now shows "Setting" badge
- ✅ Metadata form displays

**Test the Metadata Form:**

1. Fill in all fields:
   - **Style:** Select "Solitaire"
   - **Setting Height:** Select "Medium"
   - **Compatible Shapes:** Check Round, Cushion, Oval
   - **14K White Gold Price:** 1200
   - **14K Yellow Gold Price:** 1250
   - **18K Rose Gold Price:** 1400
   - **Platinum Price:** 1800
   - **Featured:** Toggle ON

2. Click **"Save Metadata"** button

3. Wait for response

**Expected:**

- ✅ Success message: "Metadata saved successfully"
- ✅ Form values persist on reload
- ✅ Database record created (check Prisma Studio)

**✅ Checkpoint:** Setting metadata works

### Test 2.4: Mark Product as Stone

**Steps:**

1. Find another unmarked product
2. Click **"Mark as Stone"** button
3. Fill stone metadata form:
   - **Stone Type:** Diamond
   - **Shape:** Round
   - **Carat:** 1.50
   - **Cut:** Excellent
   - **Color:** G
   - **Clarity:** VS1
   - **Certificate:** GIA
   - **Certificate Number:** 2141234567
   - **Price:** 8999
   - **Measurements:** 7.35 x 7.40 x 4.50
   - **Table %:** 57
   - **Depth %:** 61.5

4. Click **"Save Metadata"**

**Expected:**

- ✅ Success message appears
- ✅ Data saves to database
- ✅ Product shows "Stone" badge

**✅ Checkpoint:** Stone metadata works

### Test 2.5: Settings Page

**Steps:**

1. Click **"Settings"** in navigation
2. Should see 3 tabs: General, Pricing Rules, Side Stones

**Test General Tab:**

- Toggle **"Enable Builder"** ON/OFF
- Save settings

**Test Pricing Rules Tab:**

- Set **"Markup Percentage"** to 5
- Save settings

**Test Side Stones Tab:**

- Toggle **"Enable Side Stones"** ON
- Add quality options: "Good, Better, Best, Premium"
- Set prices for each quality
- Set min quantity: 8
- Set max quantity: 24
- Save settings

**Expected:**

- ✅ All tabs work
- ✅ Settings save successfully
- ✅ Toast notification appears
- ✅ Settings persist on page reload

**✅ Checkpoint:** Settings page works

### Test 2.6: CSV Import (Optional)

**Steps:**

1. Go to Products page
2. Click **"Import CSV"** button
3. Download template
4. Fill with test data (or use `docs/SAMPLE_STONE_IMPORT.csv`)
5. Upload CSV
6. Click **"Import"**
7. Review results

**Expected:**

- ✅ Template downloads
- ✅ Import processes
- ✅ Success/error summary shows
- ✅ Records created in database

**✅ Checkpoint:** CSV import works

---

## 🔌 STEP 3: TEST API ENDPOINTS (10 minutes)

### Open a NEW Terminal

```bash
cd /Users/samarthgugnani/Projects/prashant/gold-jwellers-shopify-v2/builder-mvp-app
```

### Test 3.1: Settings API

```bash
# Get all settings
curl "http://localhost:51077/api/builder/settings?shop=builder-store-103.myshopify.com" | jq

# Expected: JSON with settings array
```

**Verify:**

- ✅ Returns valid JSON
- ✅ Has `settings` array
- ✅ Has `filters` object
- ✅ Has `pagination` object
- ✅ If you created settings, they appear in array

### Test 3.2: Stones API

```bash
# Get all stones
curl "http://localhost:51077/api/builder/stones?shop=builder-store-103.myshopify.com" | jq

# Test with filters
curl "http://localhost:51077/api/builder/stones?shop=builder-store-103.myshopify.com&shape=round&caratMin=1&caratMax=2" | jq
```

**Verify:**

- ✅ Returns valid JSON
- ✅ Has `stones` array
- ✅ Filtering works
- ✅ If you created stones, they appear

### Test 3.3: Cart API

```bash
# Test add to cart (requires valid product IDs)
curl -X POST "http://localhost:51077/api/builder/cart" \
  -F "shop=builder-store-103.myshopify.com" \
  -F "settingId=gid://shopify/Product/123" \
  -F "stoneId=gid://shopify/Product/456" \
  -F "metalType=14k_white_gold" \
  -F "ringSize=7" \
  -F "totalPrice=10199" | jq
```

**Expected (if products exist):**

- ✅ Returns JSON with `success: true`
- ✅ Has `configurationId`
- ✅ Has `cartData` object
- ✅ Configuration saved to database

**If products don't exist:**

- ✅ Returns error: "Setting not found" or "Stone not found"
- ✅ This is expected and correct!

### Test 3.4: Admin Products API

```bash
# List all products (requires auth - may not work via curl)
curl "http://localhost:51077/api/admin/products" | jq

# May return auth error - this is correct!
# Admin endpoints require Shopify session
```

**Expected:**

- ⚠️ May return 401/403 (authentication required)
- ✅ This is correct behavior for admin endpoints

**✅ Checkpoint:** All APIs respond correctly

---

## 💍 STEP 4: TEST BUILDER FLOW (Optional - Requires Setup)

### Option A: Test via Admin (Embedded)

The builder components can be tested in the admin:

1. Navigate to http://localhost:51077/app
2. The admin pages use React Router
3. Components are available but need a public route

### Option B: Create Quick Test Page

**Create a test route** to preview the builder:

**File:** `app/routes/test.builder.tsx`

```typescript
import { BuilderApp } from "~/components/builder/BuilderApp";

export default function TestBuilder() {
  return (
    <div>
      <h1>Ring Builder Test Page</h1>
      <BuilderApp shop="builder-store-103.myshopify.com" />
    </div>
  );
}
```

**Access:** http://localhost:51077/test/builder

**Expected:**

- ✅ BuilderApp renders
- ✅ Step 1 shows by default
- ✅ Settings load from API
- ✅ Can navigate through steps

### Option C: Use Shopify Storefront

**For complete customer experience:**

1. Log into builder-store-103.myshopify.com admin
2. Go to **Online Store → Themes**
3. Click **"Customize"** on active theme
4. Add **"Apps"** block
5. Look for Ring Builder app block
6. Add to page
7. Save and preview

---

## 🔄 STEP 5: TEST WEBHOOKS (5 minutes)

### Test Product Update Webhook

**In a NEW terminal:**

```bash
cd /Users/samarthgugnani/Projects/prashant/gold-jwellers-shopify-v2/builder-mvp-app

# Trigger webhook
shopify webhook trigger --topic products/update
```

**Check dev server terminal for:**

```
[YYYY-MM-DD...] Webhook received: { topic: 'products/update', shop: '...', webhookId: '...' }
Processing product update: ...
✅ Updated StoneMetadata for ...
```

**Expected:**

- ✅ Webhook received log appears
- ✅ Processing log appears
- ✅ Update confirmation (if product is a builder product)
- ✅ Returns 200 OK

### Test Product Delete Webhook

```bash
shopify webhook trigger --topic products/delete
```

**Check dev server logs:**

```
[YYYY-MM-DD...] Webhook received: { topic: 'products/delete', ... }
Processing product deletion: ...
```

**Expected:**

- ✅ Webhook received
- ✅ Deletion processed
- ✅ Returns 200 OK

**✅ Checkpoint:** Webhooks working

---

## 📋 COMPLETE TESTING CHECKLIST

### Database ✅

- [ ] Prisma Studio opens (http://localhost:5555)
- [ ] All 5 models visible (Session, SettingMetadata, StoneMetadata, AppSettings, Configuration)
- [ ] Can create AppSettings record
- [ ] Can create SettingMetadata record
- [ ] Can create StoneMetadata record
- [ ] Data persists after save

### Admin Interface ✅

- [ ] Admin loads at /app
- [ ] OAuth authentication works (if needed)
- [ ] Dashboard displays
- [ ] Products page shows Shopify products
- [ ] Can mark product as Setting
- [ ] Can mark product as Stone
- [ ] Setting metadata form displays
- [ ] Stone metadata form displays
- [ ] All form fields editable
- [ ] Save button works
- [ ] Success messages appear
- [ ] Settings page loads
- [ ] All 3 tabs (General, Pricing, Side Stones) work
- [ ] Settings save successfully
- [ ] Data persists on reload

### API Endpoints ✅

- [ ] Settings API returns JSON
- [ ] Stones API returns JSON
- [ ] Cart API accepts POST requests
- [ ] Validation errors return properly
- [ ] All APIs respond < 500ms

### Webhooks ✅

- [ ] products/update webhook triggers
- [ ] products/delete webhook triggers
- [ ] Console logs show receipt
- [ ] No errors in processing
- [ ] Returns 200 OK

### Build & Code Quality ✅

- [ ] TypeScript: 0 errors (`npm run typecheck`)
- [ ] Build: Successful (`npm run build`)
- [ ] No console errors in browser
- [ ] No server errors in terminal

---

## 🎯 DETAILED TESTING SCENARIOS

### Scenario A: Complete Admin Workflow

**Goal:** Set up a ring builder from scratch

**Steps:**

1. **Install & Configure** (5 min)
   - [ ] Install app on builder-store-103
   - [ ] Navigate to admin
   - [ ] Go to Settings page
   - [ ] Enable builder
   - [ ] Set markup to 5%
   - [ ] Enable side stones
   - [ ] Save settings

2. **Add 3 Settings** (10 min)
   - [ ] Go to Products page
   - [ ] Mark 3 products as Settings
   - [ ] For each, add metadata:
     - Style (Solitaire, Halo, Vintage)
     - Heights (Low, Medium, High)
     - Compatible shapes
     - Prices for all metal types
   - [ ] Save all

3. **Add 10 Stones** (15 min)
   - [ ] Option A: Mark 10 products individually
   - [ ] Option B: Import via CSV
   - [ ] For each stone, add:
     - Shape, carat, 4Cs
     - Certificate info
     - Price
   - [ ] Verify all saved

4. **Verify Setup** (5 min)
   - [ ] Open Prisma Studio
   - [ ] Check SettingMetadata: 3 records
   - [ ] Check StoneMetadata: 10 records
   - [ ] Check AppSettings: 1 record
   - [ ] All data correct

**Expected Time:** 35 minutes  
**✅ Success:** Admin workflow complete

### Scenario B: Test API Integration

**Goal:** Verify all APIs work correctly

**Test Settings API:**

```bash
# Basic request
curl "http://localhost:51077/api/builder/settings?shop=builder-store-103.myshopify.com" | jq '.settings | length'

# Should return number of settings

# With filters
curl "http://localhost:51077/api/builder/settings?shop=builder-store-103.myshopify.com&style=solitaire" | jq

# Should filter by style

# Price range
curl "http://localhost:51077/api/builder/settings?shop=builder-store-103.myshopify.com&priceMin=1000&priceMax=2000" | jq
```

**Test Stones API:**

```bash
# Basic request
curl "http://localhost:51077/api/builder/stones?shop=builder-store-103.myshopify.com" | jq '.stones | length'

# With shape filter
curl "http://localhost:51077/api/builder/stones?shop=builder-store-103.myshopify.com&shape=round" | jq

# With carat range
curl "http://localhost:51077/api/builder/stones?shop=builder-store-103.myshopify.com&caratMin=1&caratMax=2" | jq

# With 4Cs filters
curl "http://localhost:51077/api/builder/stones?shop=builder-store-103.myshopify.com&cut=excellent&color=G&clarity=VS1" | jq
```

**Test Cart API:**

```bash
# Replace with actual product IDs from your database
curl -X POST "http://localhost:51077/api/builder/cart" \
  -F "shop=builder-store-103.myshopify.com" \
  -F "settingId=gid://shopify/Product/YOUR_SETTING_ID" \
  -F "stoneId=gid://shopify/Product/YOUR_STONE_ID" \
  -F "metalType=14k_white_gold" \
  -F "ringSize=7" \
  -F "totalPrice=10199" | jq
```

**Expected:**

- ✅ All APIs return valid JSON
- ✅ Filters work correctly
- ✅ Pagination info present
- ✅ No 500 errors

**✅ Success:** APIs validated

### Scenario C: Test State Management

**Goal:** Verify localStorage and state persistence

**Steps:**

1. **If you created a test route:**
   - Navigate to test builder page
   - Make some selections
   - Open browser DevTools
   - Go to Application → Local Storage
   - Look for `ring-builder-state` key
   - Should see JSON with your selections

2. **Verify persistence:**
   - Make selections
   - Reload page
   - Selections should restore

**Expected:**

- ✅ State saves to localStorage
- ✅ State loads on mount
- ✅ Shop-specific state isolation

---

## 🐛 TROUBLESHOOTING

### Issue: Admin Won't Load

**Symptoms:** Blank page or loading forever

**Solutions:**

1. Check console for errors (F12)
2. Verify authentication completed
3. Clear browser cache
4. Try incognito window
5. Check terminal for server errors

### Issue: APIs Return Empty

**Symptoms:** APIs return `{ settings: [], stones: [] }`

**Solution:**

- This is correct if no data in database!
- Add data via Prisma Studio or admin interface
- Verify shop parameter matches: `builder-store-103.myshopify.com`

### Issue: Cannot Save Metadata

**Symptoms:** Save button doesn't work or errors

**Solutions:**

1. Check browser console for errors
2. Verify all required fields filled
3. Check terminal for API errors
4. Verify database connection (Prisma Studio)
5. Check network tab for failed requests

### Issue: Webhooks Don't Trigger

**Symptoms:** No logs appear when triggering webhook

**Solutions:**

1. Verify dev server is running
2. Check Shopify CLI is authenticated
3. Run `shopify auth login` if needed
4. Check webhook URLs in `shopify.app.toml`

---

## 📊 VALIDATION CHECKLIST

### After Testing, Verify:

**Functionality:**

- [ ] Admin dashboard accessible
- [ ] Products can be marked
- [ ] Metadata can be saved
- [ ] Settings can be configured
- [ ] APIs return valid data
- [ ] Database operations work
- [ ] Webhooks trigger successfully

**Code Quality:**

- [ ] No console errors in browser
- [ ] No server errors in terminal
- [ ] TypeScript: 0 errors
- [ ] Build: Successful

**Performance:**

- [ ] Pages load quickly (< 3s)
- [ ] APIs respond quickly (< 500ms)
- [ ] No lag or freezing
- [ ] Smooth user experience

**All Checked?** ✅ **MVP is validated and working!**

---

## 🎯 WHAT YOU'RE TESTING

### Complete Feature List

**Admin Features:**

- ✅ OAuth authentication
- ✅ Product listing with pagination
- ✅ Mark as Setting/Stone
- ✅ Setting metadata form (8 fields)
- ✅ Stone metadata form (16 fields)
- ✅ CSV bulk import
- ✅ CSV export
- ✅ Builder settings (3 tabs)
- ✅ Markup configuration
- ✅ Side stones configuration

**API Features:**

- ✅ GET /api/builder/settings (with filters)
- ✅ GET /api/builder/stones (with filters & sorting)
- ✅ POST /api/builder/cart (create configuration)
- ✅ Admin APIs (products, settings)
- ✅ Webhook handlers (update, delete)

**Builder Components:**

- ✅ BuilderProvider (state management)
- ✅ BuilderApp (4-step flow)
- ✅ StepNavigation (progress indicator)
- ✅ PriceSummary (real-time pricing)
- ✅ All step components (1-4)
- ✅ All filter components
- ✅ All display components
- ✅ Mobile responsive

**Integration:**

- ✅ Shopify OAuth
- ✅ Admin GraphQL API
- ✅ Ajax Cart API (ready)
- ✅ Webhook events
- ✅ Database (Prisma + SQLite)

---

## 📸 SCREENSHOTS TO CAPTURE (Optional)

For documentation or demo purposes:

1. **Admin Dashboard** - Landing page
2. **Products Page** - Grid with badges
3. **Setting Metadata Form** - Filled out
4. **Stone Metadata Form** - Filled out
5. **Settings Page** - All 3 tabs
6. **Prisma Studio** - Database records
7. **Builder Components** - If you set up test page

---

## 🚀 NEXT STEPS AFTER TESTING

### If Everything Works ✅

1. **Document any issues** found
2. **Collect feedback** on UX
3. **Prepare for deployment** (see `docs/DEPLOYMENT.md`)
4. **Plan beta testing** (3-5 merchants)

### If Issues Found ⚠️

1. **Document the issue:**
   - What were you doing?
   - What happened?
   - What should have happened?
   - Error messages?
   - Browser/device?

2. **Check logs:**
   - Browser console
   - Server terminal
   - Database (Prisma Studio)

3. **Report for fixing**

---

## 💡 TESTING TIPS

### Use Multiple Tabs

1. **Tab 1:** Admin interface (http://localhost:51077/app)
2. **Tab 2:** Prisma Studio (http://localhost:5555)
3. **Tab 3:** This testing guide

### Use Browser DevTools

- **Console tab:** Check for JavaScript errors
- **Network tab:** Monitor API requests
- **Application tab:** Check localStorage
- **React DevTools:** Inspect component state

### Keep Terminal Visible

Watch for:

- API request logs
- Error messages
- Webhook receipts
- Database queries

### Test Systematically

Go through each feature:

1. Test the happy path first
2. Then test edge cases
3. Document what works
4. Document what doesn't

---

## 📚 REFERENCE DOCUMENTATION

**Comprehensive Guides:**

- `docs/API_TESTING.md` - Complete API reference
- `docs/TESTING_CHECKLIST.md` - Full feature testing
- `docs/MERCHANT_SETUP.md` - Merchant onboarding
- `docs/DEPLOYMENT.md` - Production deployment
- `docs/FINAL_ACCEPTANCE_TESTING.md` - Launch validation

**Quick Reference:**

- `docs/QUICK_TEST_GUIDE.md` - Quick start
- `docs/SAMPLE_STONE_IMPORT.csv` - CSV template
- `README_MVP_LAUNCH.md` - Project overview

---

## 🎉 YOU'RE READY TO TEST!

### Quick Start Commands

```bash
# Terminal 1: Dev server (already running)
npm run dev

# Terminal 2: Database browser
npx prisma studio

# Terminal 3: API testing
curl "http://localhost:51077/api/builder/settings?shop=builder-store-103.myshopify.com" | jq
```

### URLs to Open

1. **Admin:** http://localhost:51077/app
2. **Database:** http://localhost:5555
3. **Public Tunnel:** https://fine-parcel-sodium-bills.trycloudflare.com

---

## 🎯 EXPECTED OUTCOMES

After completing this testing guide, you should have:

- ✅ Verified admin interface works
- ✅ Created test settings and stones
- ✅ Confirmed APIs return data
- ✅ Tested webhooks trigger
- ✅ Validated database operations
- ✅ Confirmed app is production-ready

**Time Required:** 30-45 minutes for comprehensive testing

---

## 🚀 START TESTING!

**The application is running and ready!**

1. Open http://localhost:51077/app to start
2. Open http://localhost:5555 for database
3. Follow the scenarios above
4. Have fun testing your Ring Builder! 💍

**Need help?** All comprehensive documentation is in the `docs/` folder!

---

**Happy Testing!** 🧪✨

**Your Ring Builder MVP awaits!** 💍🚀
