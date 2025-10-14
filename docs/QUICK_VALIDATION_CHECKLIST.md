# Quick Validation Checklist - Phase 2.0

**Purpose:** Final validation before production  
**Time:** 30 minutes  
**Date:** October 14, 2025

---

## ✅ CRITICAL PATH TESTS (Must Pass)

### 1. Build & TypeScript ✅

```bash
npm run typecheck && npm run build
```

- [ ] TypeScript: 0 errors
- [ ] Build: Success
- [ ] Time: < 3 seconds

### 2. Admin Product Setup ✅

- [ ] Open `/app/builder/products`
- [ ] Click "Add as Diamond" → Form opens
- [ ] Fill required fields → Save
- [ ] Verify metafields in Shopify Admin
- [ ] Status changes to ✓ Active

### 3. Customer Builder Flow ✅

- [ ] Open `/builder?shop=your-store.myshopify.com`
- [ ] Select setting → Proceed
- [ ] Select diamond → Proceed
- [ ] Select ring size → Proceed
- [ ] Review shows all selections
- [ ] Add to cart works

### 4. Detail Pages ✅

- [ ] Open `/builder/setting/:id?shop=...`
- [ ] Page loads, SEO tags present
- [ ] Open `/builder/diamond/:id?shop=...`
- [ ] Page loads, specs display
- [ ] Certificate viewer works (if applicable)

### 5. Comparison Tool ✅

- [ ] Select 2+ diamonds
- [ ] "Compare Items" button appears
- [ ] Modal opens with comparison
- [ ] Select diamond works

### 6. Save & Share ✅

- [ ] Complete builder flow
- [ ] Click "Save" → URL generated
- [ ] Copy link works
- [ ] Open link in new tab → Config loads
- [ ] Share modal opens
- [ ] Email share works (if configured)

### 7. Customer Engagement ✅

- [ ] "Drop A Hint" button works
- [ ] "Request Info" button works
- [ ] "Schedule Viewing" button works
- [ ] Inquiry saved to database
- [ ] Admin can see inquiries

### 8. Performance ✅

- [ ] Page loads < 3 seconds
- [ ] Grid view renders smoothly
- [ ] SKU search debounced (300ms)
- [ ] No console errors

---

## 📱 MOBILE QUICK TEST

### iOS or Android

- [ ] Builder loads on mobile
- [ ] Icon filters tappable (44px+)
- [ ] Tabs work (Mined/Lab/Fancy)
- [ ] Grid view displays (1-2 columns)
- [ ] All modals fit on screen
- [ ] Forms are usable

---

## 🔒 SECURITY QUICK CHECK

- [ ] Admin routes require login
- [ ] Public routes work without auth
- [ ] No SQL errors with weird input
- [ ] No XSS with `<script>alert('test')</script>`
- [ ] Shop isolation works (can't see other shops' data)

---

## ✅ FINAL SIGN-OFF

**All Critical Tests:** [ ] PASSED

**Build Status:**

- TypeScript: **\_** errors
- Build: **\_** (Success/Fail)
- Bundle Size: **\_** KB

**Ready for Production:** [ ] YES [ ] NO

**Tested By:** **\*\***\_\_\_\_**\*\***  
**Date:** **\*\***\_\_\_\_**\*\***

---

**If all checked → SHIP IT! 🚀**
