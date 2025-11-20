# Demo Quick Start Guide
## 15-Minute Setup for Multi-Merchant Demo

This is the **TL;DR version** of the full demo guide. Follow these steps to get up and running quickly.

---

## 🚀 Quick Setup (15 minutes)

### Step 1: Create 2 Development Stores (5 min)

Go to https://partners.shopify.com/organizations

**Store A - Luxury Jewelers:**
- Name: `luxury-jewelers-demo`
- URL: `luxury-jewelers-demo.myshopify.com`
- Theme: Purple & Gold (#663399, #FFD700)

**Store B - Modern Rings:**
- Name: `modern-rings-demo`
- URL: `modern-rings-demo.myshopify.com`
- Theme: Teal & Coral (#14B8A6, #F87171)

### Step 2: Install App on Both Stores (5 min)

```bash
# Start dev server
shopify app dev

# When prompted, select: luxury-jewelers-demo
# Browser opens → Install app
# Complete onboarding for Store A

# Ctrl+C to stop
# Run again, select: modern-rings-demo
# Install and complete onboarding for Store B
```

### Step 3: Customize Themes (5 min)

**Store A (Purple & Gold):**
- Navigate to Settings → Theme & Branding
- Primary: `#663399`, Accent: `#FFD700`
- Font: "Playfair Display", Style: Rounded
- Save

**Store B (Teal & Coral):**
- Navigate to Settings → Theme & Branding
- Primary: `#14B8A6`, Accent: `#F87171`
- Font: "Inter", Style: Pill
- Save

---

## 🎬 5-Minute Demo Script

### 1. Show Theme Isolation (1 min)

**Open in browser:**
```
Tab 1: http://localhost:PORT/builder?shop=luxury-jewelers-demo.myshopify.com
Tab 2: http://localhost:PORT/builder?shop=modern-rings-demo.myshopify.com
```

**Say:** "Same app, different merchants, completely different branding"

### 2. Show Shopify Store Embedding (1 min)

**Open:**
```
luxury-jewelers-demo.myshopify.com/pages/design-your-ring
```

**Say:** "Automatically created page in merchant's store during onboarding"

### 3. Show External Embedding (2 min)

**Show embed code generator:**
```
/app/builder/embed
```

**Copy embed code → Paste in HTML → Open in browser**

**Say:** "Merchants can embed on WordPress, Wix, any website"

### 4. Show Settings Control (1 min)

**Navigate to:** `/app/builder/settings?tab=theme`

**Change a color → Save → Reload builder**

**Say:** "Changes propagate instantly across all embeds"

---

## 📸 Screenshot Checklist

Capture these for presentations:

1. **Side-by-side comparison**
   - Store A builder (purple) | Store B builder (teal)

2. **Theme settings page**
   - Show color pickers and live preview

3. **Shopify store page**
   - Builder embedded in merchant's store

4. **External HTML page**
   - Builder embedded on non-Shopify site

5. **Onboarding flow**
   - 6-step wizard screenshot

---

## 🎯 Key Demo Points

### For Non-Technical Audience

```
✅ "Multiple jewelry stores can use the same app"
✅ "Each store gets their own colors and branding"
✅ "Works inside Shopify AND on external websites"
✅ "Set up in 5 minutes, no coding required"
```

### For Technical Audience

```
✅ "Multi-tenant SaaS architecture"
✅ "PostgreSQL with shop-level isolation"
✅ "Dynamic theming with CSS variables"
✅ "CORS-enabled iframe embedding"
✅ "Real-time theme propagation"
```

---

## ⚡ Quick Commands

### Check Merchant Data
```bash
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
(async () => {
  const merchants = await prisma.merchant.findMany({
    select: { shop: true, id: true }
  });
  console.table(merchants);
  await prisma.\$disconnect();
})();
"
```

### Check Theme Settings
```bash
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
(async () => {
  const settings = await prisma.appSettings.findMany({
    select: { shop: true, primaryColor: true, accentColor: true }
  });
  console.table(settings);
  await prisma.\$disconnect();
})();
"
```

### Clear Cache & Restart
```bash
rm -rf node_modules/.prisma
npx prisma generate
shopify app dev
```

---

## 🔥 Live Demo URLs

**Store A:**
- Admin: `https://luxury-jewelers-demo.myshopify.com/admin`
- Builder: `http://localhost:PORT/builder?shop=luxury-jewelers-demo.myshopify.com`
- Store Page: `https://luxury-jewelers-demo.myshopify.com/pages/design-your-ring`

**Store B:**
- Admin: `https://modern-rings-demo.myshopify.com/admin`
- Builder: `http://localhost:PORT/builder?shop=modern-rings-demo.myshopify.com`
- Store Page: `https://modern-rings-demo.myshopify.com/pages/design-your-ring`

---

## 🛠️ Troubleshooting

**Theme not showing?**
```bash
npx prisma generate
# Restart dev server
```

**Embed not loading?**
- Check CORS headers in DevTools
- Verify app URL is correct

**Two stores same theme?**
- Check database: `SELECT * FROM "AppSettings"`
- Verify different shop values

---

## 📋 Pre-Demo Checklist

- [ ] Dev server running
- [ ] 2+ stores created and installed
- [ ] Each store has different theme
- [ ] Browser tabs prepared
- [ ] Screen sharing tested
- [ ] Terminal ready (if showing commands)
- [ ] Cache cleared

---

## 🎉 Success Criteria

✅ Can switch between stores and see different themes
✅ Theme changes save and propagate
✅ Embedding works on Shopify pages
✅ Embedding works on external HTML
✅ Onboarding completes without errors

---

**Ready to go!** 🚀

For detailed explanations, see: `/docs/MULTI_MERCHANT_DEMO_GUIDE.md`
