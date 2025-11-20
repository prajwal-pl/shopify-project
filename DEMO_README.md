# 🎬 Multi-Merchant Demo - Start Here

This guide will get you ready to demo the Ring Builder app in **15 minutes**.

---

## 📚 Documentation Structure

We've created multiple guides for different needs:

### 🚀 Quick Start (15 min setup)
**File:** `docs/DEMO_QUICK_START.md`
- Create 2 stores
- Install app on each
- Customize themes
- 5-minute demo script

👉 **START HERE** if you need to demo ASAP

### 📖 Complete Guide (60 min detailed)
**File:** `docs/MULTI_MERCHANT_DEMO_GUIDE.md`
- Full step-by-step instructions
- All demo scenarios
- Troubleshooting
- Q&A preparation
- Screen recording tips

👉 **READ THIS** for comprehensive understanding

### ✅ Demo Day Checklist (printable)
**File:** `docs/DEMO_DAY_CHECKLIST.md`
- Pre-demo checklist
- During-demo checklist
- Emergency procedures
- Key talking points

👉 **PRINT THIS** for demo day

---

## ⚡ Super Quick Start (5 min read)

### What You'll Demo

```
┌─────────────────────────────────────┐
│  Store A: Luxury Jewelers          │
│  Colors: Purple & Gold              │
│  Font: Playfair Display (elegant)   │
│  Style: Rounded buttons             │
└─────────────────────────────────────┘
              ↓
    SAME APP, DIFFERENT THEME!
              ↓
┌─────────────────────────────────────┐
│  Store B: Modern Rings Co           │
│  Colors: Teal & Coral               │
│  Font: Inter (modern)               │
│  Style: Pill buttons                │
└─────────────────────────────────────┘
```

### Key Demo Points

1. **Multi-Tenancy**: Multiple stores can install
2. **Theme Isolation**: Each store has own colors/branding
3. **Shopify Embedding**: Works in their store
4. **External Embedding**: Works on WordPress, HTML sites
5. **Instant Updates**: Theme changes propagate immediately

---

## 🛠️ Setup Commands

### Create Development Stores
```
1. Go to https://partners.shopify.com
2. Create "luxury-jewelers-demo"
3. Create "modern-rings-demo"
```

### Install & Configure
```bash
# Start dev server
shopify app dev

# Select store when prompted
# Complete onboarding
# Go to Settings → Theme & Branding
# Customize colors
# Save
```

### Verify Setup
```bash
# Check installed merchants
node scripts/demo-setup.mjs check

# Apply demo themes automatically
node scripts/demo-setup.mjs apply-themes

# Show all demo URLs
node scripts/demo-setup.mjs urls
```

---

## 🔗 Important URLs

Replace `PORT` with your dev server port (usually 41583):

**Store A:**
```
Builder: http://localhost:PORT/builder?shop=luxury-jewelers-demo.myshopify.com
Embed: http://localhost:PORT/embed/builder?shop=luxury-jewelers-demo.myshopify.com
```

**Store B:**
```
Builder: http://localhost:PORT/builder?shop=modern-rings-demo.myshopify.com
Embed: http://localhost:PORT/embed/builder?shop=modern-rings-demo.myshopify.com
```

**Settings:**
```
Theme Settings: /app/builder/settings?tab=theme
Embed Code: /app/builder/embed
```

---

## 🎯 5-Minute Demo Script

### Minute 1: Introduction
"I'm going to show you a multi-tenant Ring Builder that lets multiple jewelry stores use the same app with their own branding."

### Minute 2: Visual Comparison
- Open Store A builder (purple)
- Open Store B builder (teal)
- "Same app, completely different brands"

### Minute 3: Settings Control
- Show theme settings page
- Change a color
- Save and reload
- "Changes apply instantly"

### Minute 4: Embedding
- Show embed code generator
- Show external HTML file (if prepared)
- "Works on any website, not just Shopify"

### Minute 5: Q&A
Answer questions about:
- How merchants set it up
- How themes work
- Product catalog (acknowledge current limitation)
- Deployment & scaling

---

## 📸 What to Screenshot

1. **Side-by-side comparison**
   - Split screen: Store A (purple) | Store B (teal)

2. **Theme settings page**
   - Color pickers visible
   - Live preview showing

3. **External embed**
   - HTML page with builder embedded
   - Show URL is not Shopify

4. **Onboarding wizard**
   - 6-step flow screenshot

---

## 🚨 Common Issues & Fixes

### Theme Not Showing
```bash
# Clear Prisma cache and regenerate
rm -rf node_modules/.prisma
npx prisma generate

# Restart dev server
shopify app dev
```

### Stores Not Different
```bash
# Check database has different settings
node scripts/demo-setup.mjs check

# Reapply themes
node scripts/demo-setup.mjs apply-themes
```

### Embed Not Loading
- Check CORS in browser DevTools
- Verify app URL is accessible
- Check iframe src URL is correct

---

## ✅ Pre-Demo Checklist

Quick checklist before starting demo:

- [ ] Dev server running
- [ ] 2 stores created & installed
- [ ] Each store has different theme
- [ ] Browser cache cleared
- [ ] All URLs bookmarked
- [ ] Screenshots ready (backup)
- [ ] Screen sharing tested (if virtual)

---

## 🎓 What Each File Does

```
docs/
├── DEMO_QUICK_START.md           # 15-min setup guide
├── MULTI_MERCHANT_DEMO_GUIDE.md  # Complete 60-min guide
├── DEMO_DAY_CHECKLIST.md         # Printable checklist
└── TESTING_COMPLETE_GUIDE.md     # Full testing procedures

scripts/
├── demo-setup.mjs                # Helper script for demo setup
├── check-db-columns.mjs          # Verify database schema
└── test-prisma-client.mjs        # Test Prisma client

public/
└── demo-embed-template.html      # Template for external embedding
```

---

## 🎬 Demo Flow Recommendation

**For Technical Audience:**
```
1. Show architecture (database, services)
2. Show theme isolation in code
3. Live demo of both stores
4. Show external embedding
5. Q&A about implementation
```

**For Business Audience:**
```
1. Show visual comparison first (wow factor)
2. Show how merchants customize
3. Show embedding capabilities
4. Discuss go-to-market
5. Q&A about features
```

**For Mixed Audience:**
```
1. Visual comparison (appeal to everyone)
2. Settings customization (show ease of use)
3. Embedding demo (show flexibility)
4. Quick architecture overview (for tech folks)
5. Q&A (split by audience)
```

---

## 💡 Pro Tips

### For Best Demo Impact

1. **Start with Visual** - Open both stores side-by-side immediately
2. **Use Real Scenarios** - "Imagine you're Luxury Jewelers..."
3. **Show, Don't Tell** - Actually change colors, don't just describe
4. **Handle Issues Gracefully** - If something breaks, explain architecture instead
5. **Keep It Moving** - Don't get stuck on one feature
6. **End Strong** - Recap key benefits before Q&A

### For Technical Questions

**"How does theme isolation work?"**
- Show database schema
- Explain shop parameter
- Show theme service code

**"What about product catalog?"**
- Acknowledge current limitation
- Show database supports it
- Explain next steps

**"How do you scale this?"**
- Explain Shopify's infrastructure
- Mention Neon serverless PostgreSQL
- Discuss caching strategies

---

## 🎉 Success Criteria

Your demo is successful if the audience:

✅ Understands it's multi-tenant (multiple stores)
✅ Sees visual difference between stores
✅ Understands merchants control their branding
✅ Sees embedding works in multiple contexts
✅ Asks questions about using it (not about whether it works)

---

## 📞 Need Help?

If you get stuck:

1. Check `docs/MULTI_MERCHANT_DEMO_GUIDE.md` for detailed instructions
2. Run `node scripts/demo-setup.mjs check` to diagnose issues
3. Check terminal for error messages
4. Restart dev server if needed
5. Use screenshots as backup

---

## 🚀 Ready to Go!

**Quick Setup:**
```bash
# 1. Create 2 Shopify development stores
# 2. Install app on each: shopify app dev
# 3. Apply themes: node scripts/demo-setup.mjs apply-themes
# 4. Show URLs: node scripts/demo-setup.mjs urls
# 5. Open browsers and demo!
```

**Then read:** `docs/DEMO_QUICK_START.md` for 5-minute demo script

**Good luck! You've got this! 🎬**
