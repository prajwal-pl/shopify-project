# Local Development Testing Guide

## Complete Testing Flow for Multi-Merchant Onboarding & Theme System

This guide walks through testing the **complete production experience** locally using development mode.

---

## Pre-Flight Checklist

✅ **Database**: Clean and ready
✅ **Onboarding system**: Built and ready
✅ **Theme customization**: 9 fields (colors, fonts, CSS)
✅ **Auth routes**: OAuth callback configured
✅ **Embed system**: Public route ready
✅ **Multi-tenancy**: Shop-based data isolation

---

## Development Testing Flow

### Phase 1: Start Development Server

**Command:**
```bash
shopify app dev
```

**What happens:**
1. CLI starts local React Router server
2. Creates tunnel URL (e.g., `https://xyz.trycloudflare.com`)
3. Temporarily updates app OAuth URLs
4. Prompts for store selection

**Select store:**
- Use existing: `demo-store-123456789552125478794`
- Or create new dev store via Partners dashboard

**Result:** Dev server running with tunnel URL

---

### Phase 2: Install App on First Store

**How:**
1. Server is running
2. Press `p` in terminal (opens preview/install URL)
3. Browser opens to OAuth screen
4. Click "Install app"
5. OAuth completes → redirects to app

**Expected flow:**
```
OAuth screen → Install → auth/callback → Merchant created in DB →
Check onboarding status → Redirect to /app/onboarding
```

**Verification:**
- [ ] OAuth permission screen shows
- [ ] All scopes listed (read/write products, orders, customers)
- [ ] After clicking "Install", redirected to app
- [ ] Onboarding screen appears (Step 1: Welcome)

---

### Phase 3: Complete Onboarding (Store A - "Luxury Jewelers")

#### Step 1: Welcome Screen

**What you see:**
- Welcome message
- "Ring Builder" branding
- "Get Started" button

**Action:** Click "Get Started"

**Verification:**
- [ ] Welcome screen shows correctly
- [ ] Button works
- [ ] Progresses to Step 2

---

#### Step 2: Create Page

**What happens automatically:**
- App calls Shopify Admin API
- Creates page: "Design Your Ring"
- Handle: `design-your-ring`
- URL: `your-store.myshopify.com/pages/design-your-ring`

**What you see:**
- Loading indicator
- Success message: "Page created!"
- Page details shown

**Action:** Click "Continue"

**Verification:**
- [ ] Page creation succeeds
- [ ] Success message shows
- [ ] Can proceed to Step 3

**Debug (if fails):**
```bash
# Check Shopify API scopes
# Ensure write_content scope is granted
```

---

#### Step 3: Add to Menu

**What happens:**
- App finds main menu
- Adds "Design Your Ring" link
- Links to page created in Step 2

**What you see:**
- Menu selection dropdown (usually "main-menu")
- Add button
- Success message

**Action:** Click "Add to Menu"

**Verification:**
- [ ] Menu item added successfully
- [ ] Success message shows
- [ ] Can proceed to Step 4

---

#### Step 4: Customize Theme ⭐ KEY STEP

**This is where multi-merchant magic happens!**

**What you see:**
- **Color pickers:**
  - Primary Color
  - Accent Color
  - Background Color
  - Text Color

- **Style options:**
  - Font family dropdown
  - Border radius slider
  - Button style selector
  - Dark mode toggle

- **Custom CSS textarea**

- **Live preview panel** showing theme in real-time

**Action for Store A (Luxury Jewelers):**
1. Set Primary Color: **Purple** (#9333EA)
2. Set Accent Color: **Gold** (#F59E0B)
3. Set Background: **Off-white** (#FAFAFA)
4. Set Text Color: **Dark** (#1F2937)
5. Select Font: **Playfair Display** (elegant serif)
6. Set Border Radius: **8px** (slightly rounded)
7. Button Style: **Filled**
8. Dark Mode: **Off**
9. Custom CSS:
   ```css
   /* Luxury theme enhancements */
   .ring-builder-container {
     box-shadow: 0 10px 40px rgba(147, 51, 234, 0.1);
   }
   ```
10. Click "Save Theme"

**What happens internally:**
```javascript
// Data saved to AppSettings table
{
  shop: "demo-store-123456789552125478794.myshopify.com",
  primaryColor: "#9333EA",
  accentColor: "#F59E0B",
  backgroundColor: "#FAFAFA",
  textColor: "#1F2937",
  fontFamily: "Playfair Display",
  borderRadius: 8,
  buttonStyle: "filled",
  darkMode: false,
  customCSS: "/* Luxury theme ... */"
}
```

**Verification:**
- [ ] All color pickers work
- [ ] Live preview updates in real-time
- [ ] "Save Theme" succeeds
- [ ] Theme persists (refresh page → theme still there)
- [ ] Can proceed to Step 5

---

#### Step 5: Test Builder

**What you see:**
- Iframe or preview of ring builder
- **Theme applied:** Purple and gold colors
- Try building a ring:
  - Select setting
  - Choose diamond
  - See price calculation
  - All in purple/gold theme

**Action:** Play with builder, then click "Continue"

**Verification:**
- [ ] Builder loads with theme applied
- [ ] Colors match what was set (purple/gold)
- [ ] Builder is functional
- [ ] Can proceed to Step 6

---

#### Step 6: Complete!

**What you see:**
- Success screen
- "Onboarding Complete" message
- "Go to Dashboard" button

**Action:** Click "Go to Dashboard"

**What happens:**
- Onboarding marked complete in database
- Redirected to `/app` (main dashboard)
- Dashboard shows Ring Builder interface

**Verification:**
- [ ] Success screen shows
- [ ] Onboarding marked complete
- [ ] Dashboard loads
- [ ] Future visits skip onboarding

---

### Phase 4: Verify Theme Persistence

**Test:**
1. Refresh the page
2. Go to Settings → Theme & Branding
3. Check colors are still set (purple/gold)

**Verification:**
- [ ] Theme persists across refreshes
- [ ] Colors match what was saved
- [ ] Custom CSS present

---

### Phase 5: Test Embed (Store A)

**How:**
1. In app, go to Settings → Embed
2. Copy embed code:
   ```html
   <iframe
     src="https://xyz.trycloudflare.com/embed/builder?shop=demo-store-123456789552125478794.myshopify.com"
     width="100%"
     height="800px">
   </iframe>
   ```
3. Create test HTML file:
   ```bash
   nano test-embed-store-a.html
   ```
4. Paste:
   ```html
   <!DOCTYPE html>
   <html>
   <head><title>Store A Embed Test</title></head>
   <body>
     <h1>Luxury Jewelers - Ring Builder</h1>
     <iframe
       src="https://TUNNEL-URL/embed/builder?shop=demo-store-123456789552125478794.myshopify.com"
       width="100%"
       height="800px"
       frameborder="0">
     </iframe>
   </body>
   </html>
   ```
5. Open in browser
6. See ring builder with purple/gold theme

**Verification:**
- [ ] Embed loads
- [ ] Theme is purple/gold (Store A theme)
- [ ] Builder is functional in iframe
- [ ] No CORS errors

---

### Phase 6: Install on Second Store (Multi-Merchant Test)

**Goal:** Prove that Store B gets different theme, isolated data

**How:**
1. Stop dev server (Ctrl+C)
2. Restart: `shopify app dev --reset`
3. Select **different store** OR create new dev store
4. Press `p` to install
5. Complete onboarding with DIFFERENT theme

**For Store B (Modern Rings):**
1. Primary Color: **Teal** (#14B8A6)
2. Accent Color: **Pink** (#FB7185)
3. Background: **Gray** (#F9FAFB)
4. Text: **Charcoal** (#374151)
5. Font: **Inter** (modern sans-serif)
6. Border Radius: **16px** (very rounded)
7. Button Style: **Outlined**
8. Dark Mode: **Off**

**What happens internally:**
```javascript
// Second row in AppSettings table
{
  shop: "second-store.myshopify.com",
  primaryColor: "#14B8A6",
  accentColor: "#FB7185",
  // ... teal/pink theme
}
```

**Verification:**
- [ ] Second installation succeeds
- [ ] Onboarding starts fresh (not completed)
- [ ] Theme customization shows default values (not Store A's)
- [ ] Save works
- [ ] Theme is teal/pink (NOT purple/gold)

---

### Phase 7: Verify Data Isolation

**Check database:**
```bash
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.appSettings.findMany({
  select: {
    shop: true,
    primaryColor: true,
    accentColor: true
  }
}).then(settings => {
  console.log('🎨 Theme settings per merchant:');
  settings.forEach(s => {
    console.log(\`  \${s.shop}: \${s.primaryColor} / \${s.accentColor}\`);
  });
}).finally(() => prisma.\$disconnect());
"
```

**Expected output:**
```
🎨 Theme settings per merchant:
  demo-store-123456789552125478794.myshopify.com: #9333EA / #F59E0B
  second-store.myshopify.com: #14B8A6 / #FB7185
```

**Verification:**
- [ ] Two rows in database
- [ ] Different shops
- [ ] Different themes
- [ ] Data is isolated

---

### Phase 8: Test Embed Multi-Tenancy

**Create two HTML files:**

**test-embed-store-a.html:**
```html
<!DOCTYPE html>
<html>
<body style="font-family: Arial;">
  <h1>Luxury Jewelers (Purple/Gold)</h1>
  <iframe
    src="http://localhost:PORT/embed/builder?shop=demo-store-123456789552125478794.myshopify.com"
    width="100%"
    height="800px">
  </iframe>
</body>
</html>
```

**test-embed-store-b.html:**
```html
<!DOCTYPE html>
<html>
<body style="font-family: Arial;">
  <h1>Modern Rings (Teal/Pink)</h1>
  <iframe
    src="http://localhost:PORT/embed/builder?shop=second-store.myshopify.com"
    width="100%"
    height="800px">
  </iframe>
</body>
</html>
```

**Open both files side-by-side:**
- Store A: Purple/gold theme
- Store B: Teal/pink theme
- **Same embed code, different `shop` parameter**

**Verification:**
- [ ] Store A iframe shows purple/gold
- [ ] Store B iframe shows teal/pink
- [ ] Themes are correctly isolated
- [ ] Both functional

---

## Testing Checklist Summary

### ✅ Core Functionality
- [ ] OAuth installation works
- [ ] Onboarding starts automatically
- [ ] All 6 onboarding steps complete
- [ ] Theme customization saves
- [ ] Dashboard loads after onboarding

### ✅ Theme System
- [ ] Color pickers work
- [ ] Font selection works
- [ ] Custom CSS applies
- [ ] Live preview updates
- [ ] Theme persists across refreshes

### ✅ Multi-Tenancy
- [ ] Store A has purple/gold theme
- [ ] Store B has teal/pink theme
- [ ] Database has separate rows
- [ ] Themes don't interfere
- [ ] Embed respects shop parameter

### ✅ Embed System
- [ ] Embed code generated
- [ ] Iframe loads
- [ ] Theme applies in iframe
- [ ] CORS works
- [ ] Auto-resize works (if implemented)

---

## Troubleshooting

### Issue: Onboarding doesn't start

**Fix:**
```bash
# Reset onboarding for store
node scripts/reset-onboarding-demo.mjs STORE-NAME.myshopify.com

# Refresh app
```

---

### Issue: Theme not applying

**Debug:**
1. Check database:
   ```bash
   node -e "
   const { PrismaClient } = require('@prisma/client');
   const prisma = new PrismaClient();
   prisma.appSettings.findUnique({
     where: { shop: 'STORE.myshopify.com' }
   }).then(s => console.log(s))
   .finally(() => prisma.\$disconnect());
   "
   ```

2. Check if ThemeProvider is loaded
3. Check browser console for errors

---

### Issue: Dev server won't start

**Fix:**
```bash
# Kill any running processes
pkill -f "shopify app dev"

# Clear cache
rm -rf node_modules/.cache
rm -rf .shopify

# Restart
shopify app dev
```

---

### Issue: Database connection error

**Fix:**
```bash
# Check DATABASE_URL in .env
cat .env | grep DATABASE_URL

# Test connection
npx prisma db pull

# Regenerate client
npx prisma generate
```

---

## Success Criteria

**You've successfully tested multi-merchant system when:**

✅ Store A completes onboarding with purple/gold theme
✅ Store B completes onboarding with teal/pink theme
✅ Database shows 2 rows with different themes
✅ Store A embed shows purple/gold
✅ Store B embed shows teal/pink
✅ Both embeds work simultaneously
✅ No theme bleeding between stores
✅ All features work (product selection, pricing, etc.)

---

## Next Steps After Local Testing

1. **Deploy to Vercel** (already done)
2. **Test production URLs** with real stores
3. **Submit to App Store** OR share install links
4. **Onboard first real client**
5. **Monitor database growth**
6. **Iterate based on feedback**

---

## Quick Start Commands

```bash
# 1. Start dev server
shopify app dev

# 2. Press 'p' to install

# 3. Complete onboarding

# 4. Check database
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.appSettings.findMany()
.then(s => console.log(s))
.finally(() => prisma.\$disconnect());
"

# 5. Test embed
# Create HTML file with iframe

# 6. Install on second store
# Ctrl+C, then: shopify app dev --reset
```

---

**Ready to test? Run `shopify app dev` and follow Phase 1!**
