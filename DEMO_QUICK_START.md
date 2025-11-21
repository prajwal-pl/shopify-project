# Quick Demo Start Guide

## 🎯 Goal
Test multi-merchant onboarding and theme system locally in 15 minutes.

---

## ✅ Pre-Flight Check Complete

```
✅ Database: Connected
✅ Routes: All exist
✅ Services: All ready
✅ Theme fields: 4/4 present
✅ Current installations: 0 (clean slate)
```

---

## 🚀 Quick Start (Follow These Steps)

### Step 1: Start Dev Server (2 min)

```bash
shopify app dev
```

**What happens:**
- Local server starts
- Tunnel URL created
- Prompts for store selection

**Select:** `demo-store-123456789552125478794` (or create new)

**Wait for:** "Ready, watching for changes in your app"

---

### Step 2: Install App (1 min)

**In terminal, press:** `p` (opens install URL)

**What you'll see:**
- OAuth permission screen
- List of scopes
- "Install app" button

**Click:** "Install app"

**Expected result:** Redirects to onboarding

---

### Step 3: Complete Onboarding - Store A "Luxury Jewelers" (5 min)

#### 3.1: Welcome
- Click "Get Started"

#### 3.2: Create Page
- App creates page automatically
- Click "Continue"

#### 3.3: Add to Menu
- Click "Add to Menu"
- Success → Click "Continue"

#### 3.4: Customize Theme (KEY STEP) ⭐
**Set these colors:**
- Primary: `#9333EA` (Purple)
- Accent: `#F59E0B` (Gold)
- Background: `#FAFAFA` (Off-white)
- Text: `#1F2937` (Dark gray)

**Set these styles:**
- Font: `Playfair Display`
- Border Radius: `8px`
- Button Style: `Filled`

**Click:** "Save Theme"

#### 3.5: Test Builder
- Preview shows purple/gold theme
- Click "Continue"

#### 3.6: Complete!
- Click "Go to Dashboard"

**✅ Store A installed with purple/gold theme**

---

### Step 4: Verify Theme (1 min)

```bash
# Check database
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.appSettings.findMany({
  select: { shop: true, primaryColor: true, accentColor: true }
}).then(s => console.log(s))
.finally(() => prisma.\$disconnect());
"
```

**Expected output:**
```javascript
[
  {
    shop: 'demo-store-123456789552125478794.myshopify.com',
    primaryColor: '#9333EA',
    accentColor: '#F59E0B'
  }
]
```

---

### Step 5: Test Embed (2 min)

**Create test file:**
```bash
cat > test-embed.html << 'EOF'
<!DOCTYPE html>
<html>
<head><title>Store A Embed Test</title></head>
<body style="font-family: Arial; padding: 20px;">
  <h1>Luxury Jewelers (Purple/Gold Theme)</h1>
  <iframe
    src="http://localhost:XXXX/embed/builder?shop=demo-store-123456789552125478794.myshopify.com"
    width="100%"
    height="800px"
    frameborder="0">
  </iframe>
</body>
</html>
EOF
```

**Replace `XXXX`** with your dev server port (check terminal output)

**Open in browser:**
```bash
open test-embed.html  # Mac
xdg-open test-embed.html  # Linux
```

**Verify:** Builder shows with purple/gold theme

---

### Step 6: Install on Second Store (Optional, 7 min)

**To test multi-tenancy:**

1. Stop dev server: `Ctrl+C`
2. Restart: `shopify app dev --reset`
3. Select different store OR create new
4. Press `p` to install
5. Complete onboarding with **different theme**:
   - Primary: `#14B8A6` (Teal)
   - Accent: `#FB7185` (Pink)
6. Verify database shows 2 rows
7. Test both embeds side-by-side

---

## ✅ Success Criteria

You've successfully tested when:

- [ ] OAuth installation works
- [ ] Onboarding completes (6 steps)
- [ ] Theme saves (purple/gold)
- [ ] Database shows theme data
- [ ] Embed works with theme applied
- [ ] (Optional) Second store has different theme

---

## 🐛 Quick Troubleshooting

**Issue: Onboarding doesn't start**
```bash
node scripts/reset-onboarding-demo.mjs demo-store-123456789552125478794.myshopify.com
```

**Issue: "This app is under review"**
- This happens with non-dev stores
- Use Partners dev stores via `shopify app dev`

**Issue: Theme not showing**
- Refresh page
- Check browser console
- Verify database has theme data

---

## 📚 Detailed Guides

- **Full Testing:** `docs/LOCAL_DEVELOPMENT_TESTING.md`
- **Production:** `docs/PRODUCTION_INSTALLATION_GUIDE.md`
- **Multi-Merchant Demo:** `docs/MULTI_MERCHANT_DEMO_GUIDE.md`

---

## 🎉 What You Just Tested

✅ **Multi-tenant architecture** - Each merchant gets isolated data
✅ **Theme customization** - Per-merchant colors, fonts, CSS
✅ **Onboarding system** - 6-step wizard
✅ **OAuth flow** - Shopify authentication
✅ **Embed system** - Iframe with theme applied
✅ **Database persistence** - Theme saved and loaded

---

**Ready? Run `shopify app dev` and follow the steps above!**
