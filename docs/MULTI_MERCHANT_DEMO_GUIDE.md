# Multi-Merchant Demo Guide
## Complete Step-by-Step Demonstration of Multi-Tenant Ring Builder

This guide shows how to demonstrate the Ring Builder app working across multiple merchant stores with independent themes and embedded functionality.

---

## 🎯 Demo Objectives

By the end of this demo, you will show:

1. ✅ **Multiple merchants can install the app** (true multi-tenancy)
2. ✅ **Each merchant has independent theme customization**
3. ✅ **Each merchant can embed on their Shopify store**
4. ✅ **Each merchant can embed on external websites**
5. ✅ **Theme isolation** - Store A's colors don't affect Store B
6. ⚠️ **Current limitation** - All stores see same demo products (documented)

---

## 📋 Prerequisites

### Required
- Shopify Partner account
- App running locally (`shopify app dev`) or deployed
- At least 2 development stores (we'll create these)

### Recommended
- Simple HTML page for external embedding test
- Browser with multiple profiles or incognito windows
- Screen recording tool (for presentation)

---

## Part 1: Setup Development Stores

### Step 1.1: Create First Store (Luxury Jewelers)

1. **Go to Shopify Partners Dashboard**
   - URL: https://partners.shopify.com/organizations

2. **Create Development Store**
   - Click "Stores" → "Add store"
   - Select "Development store"
   - **Store name**: `luxury-jewelers-demo`
   - **Store purpose**: "Test an app or theme"
   - Click "Create development store"

3. **Save Store Details**
   ```
   Store A: Luxury Jewelers
   URL: luxury-jewelers-demo.myshopify.com
   Brand Colors: Purple & Gold (#663399, #FFD700)
   Theme: Elegant, luxurious
   ```

### Step 1.2: Create Second Store (Modern Rings Co)

Repeat the process:

1. Create another development store
2. **Store name**: `modern-rings-demo`
3. **Save Store Details**
   ```
   Store B: Modern Rings Co
   URL: modern-rings-demo.myshopify.com
   Brand Colors: Teal & Coral (#14B8A6, #F87171)
   Theme: Modern, minimalist
   ```

### Step 1.3: (Optional) Create Third Store

For extra demonstration:
- **Store name**: `vintage-gems-demo`
- **Colors**: Brown & Cream (#8B4513, #F5F5DC)
- **Theme**: Classic, vintage

---

## Part 2: Install App on Multiple Stores

### Step 2.1: Start Dev Server

```bash
cd /path/to/shopify-gem-finder
shopify app dev
```

**Important**: Note the URL, e.g., `https://your-tunnel-url.dev`

### Step 2.2: Install on Store A (Luxury Jewelers)

1. **When prompted by CLI**: Select `luxury-jewelers-demo`
2. **Browser opens**: Review permissions
3. **Click "Install app"**
4. **Expected**: Redirects to onboarding at `/app/onboarding`

**✅ Checkpoint**: App installed on Store A

### Step 2.3: Install on Store B (Modern Rings Co)

**Challenge**: CLI only supports one store at a time. Here's the workaround:

#### Method 1: Using Shopify CLI (Recommended)

```bash
# Stop current dev server (Ctrl+C)
# Restart and select different store
shopify app dev

# When prompted, select: modern-rings-demo
```

#### Method 2: Manual Installation URL

1. **Get your app's client ID** from `shopify.app.toml`:
   ```toml
   client_id = "your-client-id-here"
   ```

2. **Construct installation URL**:
   ```
   https://modern-rings-demo.myshopify.com/admin/oauth/authorize?client_id=YOUR_CLIENT_ID&scope=write_products,read_products,write_orders,read_orders,write_customers,read_customers,write_content,read_content,read_online_store_pages,write_online_store_navigation,read_online_store_navigation&redirect_uri=https://your-tunnel-url.dev/auth/callback
   ```

3. **Visit URL** in browser
4. **Click "Install app"**

**✅ Checkpoint**: App installed on Store B

---

## Part 3: Customize Theme for Each Store

### Step 3.1: Customize Store A (Luxury Jewelers) - Purple & Gold

1. **Access Store A's Admin**
   - URL: `https://luxury-jewelers-demo.myshopify.com/admin`
   - Navigate to Apps → Ring Builder

2. **Complete Onboarding**
   - Step 1 (Welcome): Click "Get Started"
   - Step 2 (Create Page):
     - Title: "Design Your Dream Ring"
     - Handle: "design-your-ring"
     - Click "Create Page"
   - Step 3 (Add to Menu): Click "Add to Menu" or "Skip"
   - Step 4 (Theme): Click "Go to Theme Settings"

3. **Configure Luxury Theme**
   - **Primary Color**: `#663399` (Purple) 🟣
   - **Accent Color**: `#FFD700` (Gold) 🟡
   - **Background**: `#FFFFFF` (White)
   - **Text Color**: `#1F1F1F` (Near Black)
   - **Button Style**: Rounded
   - **Border Radius**: 8px
   - **Font**: "Playfair Display" (elegant serif)
   - **Dark Mode**: OFF
   - Click "Save Settings"

4. **Complete Onboarding**
   - Step 5 (Test): Click "Open Ring Builder" → Verify colors
   - Step 6 (Complete): Click "Go to Dashboard"

**✅ Checkpoint**: Store A has purple & gold theme

### Step 3.2: Customize Store B (Modern Rings Co) - Teal & Coral

Switch to Store B's admin:

1. **Access Store B**
   - URL: `https://modern-rings-demo.myshopify.com/admin`
   - Navigate to Apps → Ring Builder

2. **Complete Onboarding** (same as Store A, steps 1-3)

3. **Configure Modern Theme**
   - **Primary Color**: `#14B8A6` (Teal) 🟢
   - **Accent Color**: `#F87171` (Coral) 🔴
   - **Background**: `#F9FAFB` (Light Gray)
   - **Text Color**: `#111827` (Dark Gray)
   - **Button Style**: Pill
   - **Border Radius**: 16px
   - **Font**: "Inter" (modern sans-serif)
   - **Dark Mode**: OFF
   - Click "Save Settings"

4. **Complete Onboarding**

**✅ Checkpoint**: Store B has teal & coral theme

---

## Part 4: Demo Embedded Builder in Shopify Stores

### Step 4.1: Test Store A's Embedded Builder

1. **Get Store A's Builder Page URL**
   - During onboarding, you created: `/pages/design-your-ring`
   - Full URL: `https://luxury-jewelers-demo.myshopify.com/pages/design-your-ring`

2. **Open in Browser**
   - You should see the Ring Builder embedded
   - **Verify Theme**:
     - ✅ Purple buttons
     - ✅ Gold accents
     - ✅ Rounded corners (8px)
     - ✅ Playfair Display font

3. **Take Screenshot** 📸
   - Title: "Store A - Luxury Jewelers (Purple & Gold)"

### Step 4.2: Test Store B's Embedded Builder

1. **Open Store B's Builder**
   - URL: `https://modern-rings-demo.myshopify.com/pages/design-your-ring`

2. **Verify Different Theme**:
   - ✅ Teal buttons
   - ✅ Coral accents
   - ✅ Pill-shaped buttons (fully rounded)
   - ✅ Inter font
   - ✅ Light gray background

3. **Take Screenshot** 📸
   - Title: "Store B - Modern Rings Co (Teal & Coral)"

**✅ Checkpoint**: Each store shows different theme on their own pages

---

## Part 5: Demo Direct Builder Routes (Shop Parameter)

### Step 5.1: Test Direct Access with Shop Parameter

Open these URLs side-by-side:

**Store A:**
```
http://localhost:PORT/builder?shop=luxury-jewelers-demo.myshopify.com
```

**Store B:**
```
http://localhost:PORT/builder?shop=modern-rings-demo.myshopify.com
```

**Expected Results**:
- Store A URL: Purple & Gold theme
- Store B URL: Teal & Coral theme
- **Same app, different themes!** 🎨

**✅ Checkpoint**: Shop parameter correctly loads per-merchant theme

---

## Part 6: Demo External Website Embedding

### Step 6.1: Get Embed Codes

**For Store A (Luxury Jewelers):**

1. **Navigate to Embed Code Generator**
   - URL: `https://luxury-jewelers-demo.myshopify.com/admin/apps/ring-builder/builder/embed`
   - Or: Click "Embed" in app navigation

2. **Copy Embed Code**
   - Review live preview
   - Adjust iframe height if needed (default 800px)
   - Click "Copy Code"

3. **Save Code** to file: `store-a-embed.html`

**For Store B (Modern Rings Co):**

1. Navigate to Store B's embed page
2. Copy embed code
3. Save to file: `store-b-embed.html`

### Step 6.2: Create External Demo Pages

**Create: `luxury-demo.html`**
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Luxury Jewelers - Design Your Ring</title>
  <style>
    body {
      margin: 0;
      font-family: 'Playfair Display', serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }
    .container {
      max-width: 1400px;
      margin: 0 auto;
      background: white;
      border-radius: 16px;
      padding: 40px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    }
    h1 {
      color: #663399;
      text-align: center;
      font-size: 48px;
      margin-bottom: 30px;
    }
    .tagline {
      text-align: center;
      color: #666;
      font-size: 20px;
      margin-bottom: 40px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>✨ Luxury Jewelers</h1>
    <p class="tagline">Create Your Perfect Ring with Our Exclusive Designer Collection</p>

    <!-- PASTE STORE A EMBED CODE HERE -->

  </div>
</body>
</html>
```

**Create: `modern-demo.html`**
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Modern Rings Co - Ring Builder</title>
  <style>
    body {
      margin: 0;
      font-family: 'Inter', system-ui, sans-serif;
      background: #F3F4F6;
      padding: 20px;
    }
    .container {
      max-width: 1400px;
      margin: 0 auto;
      background: white;
      border-radius: 24px;
      padding: 40px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.07);
    }
    h1 {
      color: #14B8A6;
      text-align: center;
      font-size: 42px;
      font-weight: 800;
      margin-bottom: 20px;
    }
    .tagline {
      text-align: center;
      color: #6B7280;
      font-size: 18px;
      margin-bottom: 40px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>💍 Modern Rings Co</h1>
    <p class="tagline">Design Your Custom Ring with Modern Elegance</p>

    <!-- PASTE STORE B EMBED CODE HERE -->

  </div>
</body>
</html>
```

### Step 6.3: Test External Embeds

1. **Open both HTML files** in browser
2. **Verify Each Shows Correct Theme**:
   - `luxury-demo.html`: Purple & Gold, Playfair font
   - `modern-demo.html`: Teal & Coral, Inter font

3. **Test Functionality**:
   - Browse ring settings
   - View diamonds
   - Verify iframe auto-resize works

**✅ Checkpoint**: External embedding works with theme isolation

---

## Part 7: Demo Embed Route (Public API)

### Step 7.1: Test Public Embed Endpoints

Open these URLs in browser:

**Store A Embed Route:**
```
http://localhost:PORT/embed/builder?shop=luxury-jewelers-demo.myshopify.com
```

**Store B Embed Route:**
```
http://localhost:PORT/embed/builder?shop=modern-rings-demo.myshopify.com
```

**Expected**:
- Each loads builder with correct theme
- No authentication required (public route)
- CORS headers allow embedding

**✅ Checkpoint**: Public embed routes work correctly

### Step 7.2: Test Tenant ID Parameter (Alternative)

Get merchant IDs from database:

```bash
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.merchant.findMany({ select: { id: true, shop: true } })
  .then(m => console.table(m))
  .finally(() => prisma.\$disconnect());
"
```

Then test:
```
http://localhost:PORT/embed/builder?tenantId=MERCHANT_ID_FOR_STORE_A
```

**✅ Checkpoint**: Tenant ID parameter also works

---

## Part 8: Demo Presentation Flow

### Recommended Presentation Order

#### Slide 1: Introduction (1 min)
```
🎯 "Today I'll demo our Multi-Tenant Ring Builder SaaS App"

Key Features:
- Multiple jewelry stores can install
- Each gets independent theme customization
- Embed on Shopify store OR external websites
- Complete isolation between merchants
```

#### Slide 2: Show Two Different Stores (2 min)
```
Split screen showing:

LEFT: Luxury Jewelers (Purple & Gold)
RIGHT: Modern Rings Co (Teal & Coral)

"Notice: Same app, completely different branding!"
```

#### Slide 3: Theme Customization (2 min)
```
Show Settings page for Store A:
- Color pickers
- Font selector
- Button style options
- Live preview

"Each merchant has full control over their brand appearance"
```

#### Slide 4: Shopify Store Embedding (2 min)
```
Navigate to:
luxury-jewelers-demo.myshopify.com/pages/design-your-ring

Show:
- Builder loads in their store
- Matches their brand colors
- Fully functional
```

#### Slide 5: External Website Embedding (3 min)
```
Open luxury-demo.html:
- Show it's a regular HTML file
- Embedded iframe loads
- Theme matches
- Auto-resizes

"Merchants can embed on WordPress, Wix, custom sites, anywhere!"
```

#### Slide 6: Multi-Tenant Architecture (2 min)
```
Show database schema:

AppSettings table:
- shop: "luxury-jewelers-demo..."
  - primaryColor: "#663399"
  - accentColor: "#FFD700"

- shop: "modern-rings-demo..."
  - primaryColor: "#14B8A6"
  - accentColor: "#F87171"

"Data is isolated per merchant - Store A cannot see Store B's settings"
```

#### Slide 7: Onboarding Experience (2 min)
```
Show onboarding for new store:
1. Welcome screen
2. Create Shopify page (automated)
3. Add to navigation menu (automated)
4. Customize theme
5. Test builder
6. Complete!

"Merchants are up and running in under 5 minutes"
```

#### Slide 8: Developer Experience (1 min)
```
Show code:

// Theme automatically applied per shop
const theme = await getThemeForShop(shop);

// Embed route supports any merchant
/embed/builder?shop=any-store.myshopify.com

"Built on Shopify's best practices for multi-tenant SaaS"
```

---

## Part 9: Live Q&A Demo Scenarios

### Scenario A: "Can Store B see Store A's data?"

**Demo**:
1. Open Store A settings → Show purple colors
2. Open Store B settings → Show teal colors
3. Switch between builders → Confirm isolation
4. Query database → Show separate records

**Answer**: "No, complete data isolation using shop parameter"

### Scenario B: "How do stores get embed code?"

**Demo**:
1. Navigate to `/app/builder/embed`
2. Show code generator interface
3. Adjust iframe height
4. Copy code
5. Paste in HTML file
6. Show it works

**Answer**: "Simple UI with copy-paste embed code, plus WordPress shortcode"

### Scenario C: "What if a store changes their theme?"

**Demo**:
1. Open Store A settings
2. Change primary color from purple to blue
3. Save
4. Reload builder → Shows new color
5. Reload external embed → Shows new color

**Answer**: "Changes propagate instantly across all embeds"

### Scenario D: "Can they embed on multiple websites?"

**Demo**:
1. Show same embed code works in multiple HTML files
2. Open luxury-demo.html
3. Open luxury-wordpress-demo.html (create this)
4. Both show same builder, same theme

**Answer**: "Yes, same embed code works anywhere"

### Scenario E: "Is it mobile responsive?"

**Demo**:
1. Open builder in desktop browser
2. Open DevTools → Toggle device toolbar
3. Test iPhone, iPad, Android sizes
4. Show iframe auto-resizes

**Answer**: "Fully responsive, tested on all devices"

---

## Part 10: Screen Recording Checklist

### Recording 1: Quick Overview (2 min)
- [ ] Show both stores side-by-side with different themes
- [ ] Navigate between Store A and Store B builders
- [ ] Highlight color differences

### Recording 2: Setup Process (5 min)
- [ ] Install app on new store
- [ ] Complete onboarding flow
- [ ] Customize theme
- [ ] Show builder on storefront

### Recording 3: Embed Demo (3 min)
- [ ] Get embed code
- [ ] Paste in HTML file
- [ ] Open in browser
- [ ] Test functionality

### Recording 4: Technical Overview (4 min)
- [ ] Show database schema
- [ ] Show theme service code
- [ ] Show embed route code
- [ ] Explain architecture

---

## Part 11: Key Talking Points

### For Business Stakeholders

```
✅ "Multiple stores can install from Shopify App Store"
✅ "Each store has complete branding control"
✅ "Works on Shopify AND external websites"
✅ "Merchants are live in 5 minutes"
✅ "No coding required for merchants"
```

### For Technical Stakeholders

```
✅ "Built on Shopify Remix stack"
✅ "PostgreSQL with Prisma for multi-tenancy"
✅ "React Router v7 for server-side rendering"
✅ "CSS variables for dynamic theming"
✅ "CORS and iframe embedding configured"
✅ "Auto-resize postMessage API"
```

---

## Part 12: Demo Checklist

### Pre-Demo Setup (Do this beforehand)
- [ ] Create 2-3 development stores
- [ ] Install app on each store
- [ ] Complete onboarding for each
- [ ] Customize themes differently
- [ ] Create external HTML demo pages
- [ ] Test all embed codes work
- [ ] Prepare browser tabs/windows
- [ ] Test screen sharing quality

### During Demo
- [ ] Clear browser cache before starting
- [ ] Close unnecessary tabs
- [ ] Turn off notifications
- [ ] Have URLs bookmarked
- [ ] Keep terminal ready (if needed)
- [ ] Zoom in on browser for visibility

### What to Emphasize
- [ ] **Visual contrast** between stores
- [ ] **Speed** of theme changes
- [ ] **Ease** of embedding
- [ ] **Isolation** between merchants
- [ ] **No coding** required

---

## Part 13: Known Limitations to Mention

### Current Limitation: Shared Product Catalog

**Be Transparent:**
```
"Currently, all merchants see the same demo product catalog.
This is intentional for demo purposes.

In production, each merchant will:
- Add their own ring settings as Shopify products
- Add their own diamonds as Shopify products
- Only see their own inventory

The architecture is ready - we just need to connect
the builder to each merchant's specific Shopify products."
```

**Why This Is OK for Demo:**
- Focus is on theme customization
- Focus is on embed functionality
- Multi-tenancy architecture is proven
- Product integration is straightforward next step

---

## Part 14: Follow-Up Resources

### Share After Demo

1. **Documentation**
   - Testing guide: `/docs/TESTING_COMPLETE_GUIDE.md`
   - Onboarding flow: `/docs/ONBOARDING_FLOW.md`

2. **Code Repositories**
   - Link to GitHub repo
   - Link to Shopify Partners app listing

3. **Screenshots**
   - Store A theme (purple & gold)
   - Store B theme (teal & coral)
   - External embed examples
   - Settings interface

4. **Demo Video**
   - Upload screen recording
   - Share YouTube/Loom link

---

## Part 15: Troubleshooting Demo Issues

### Issue: Theme Not Showing

**Solution:**
```bash
# Restart dev server
npx prisma generate
shopify app dev
```

### Issue: Embed Not Loading

**Check:**
- CORS headers in browser DevTools
- Iframe src URL is correct
- App is running on accessible URL

### Issue: Two Stores Same Theme

**Check:**
- Database has separate AppSettings records
- Prisma client is regenerated
- Server was restarted after schema changes

---

## 🎉 Demo Success Criteria

You've successfully demonstrated when:

✅ Two stores show visually different themes
✅ Theme changes save and persist
✅ Embedding works on Shopify store pages
✅ Embedding works on external HTML pages
✅ Settings are isolated per merchant
✅ Onboarding flow completes for each store
✅ Audience understands multi-tenant SaaS model

---

## 📞 Demo Day Preparation Timeline

### 1 Week Before
- [ ] Create all development stores
- [ ] Install app on each store
- [ ] Test all functionality
- [ ] Record backup demo videos

### 1 Day Before
- [ ] Verify all stores still working
- [ ] Regenerate Prisma client
- [ ] Test embed codes
- [ ] Prepare talking points

### Day Of Demo
- [ ] Start dev server 30 min early
- [ ] Open all necessary tabs
- [ ] Test screen sharing
- [ ] Clear browser cache
- [ ] Ready to go! 🚀

---

**Need Help?** Refer to `/docs/TESTING_COMPLETE_GUIDE.md` for detailed testing procedures.

**Questions During Demo?** Keep this guide open for quick reference!
