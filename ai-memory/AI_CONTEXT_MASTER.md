# AI Context Master - Ring Builder Phase 3.0

**Purpose:** Single source of truth for AI assistants  
**Last Updated:** October 14, 2025  
**Version:** 3.0 SaaS Platform - App Store Ready  
**Status:** 🔄 50% COMPLETE - Launching in 2-3 Weeks

---

## 🎯 PROJECT OVERVIEW

**What This Is:**
Multi-Tenant SaaS Ring Builder for Shopify App Store - GemFind Competitor

**Current Phase:** 3.0 - SaaS Transformation & App Store Launch  
**Status:** 🔄 50% Complete - Launching in 2-3 Weeks

**Big News (Oct 14):** Built 50% of SaaS transformation in 3 hours!

- ✅ Subscription billing ($29/$99/$299/month)
- ✅ Merchant management
- ✅ Onboarding wizard
- ✅ Admin billing page
- ✅ Theme app blocks
- ✅ GDPR webhooks
- ✅ Complete documentation (20+ guides)

**Key Achievement:** Transformed from CSV-based admin to visual forms with GemFind feature parity

---

## 📊 QUICK STATUS

### Phase 3.0 Completion

- **Overall Progress:** 50% (ready for App Store in 7-10 days)
- **Epic 1** (App Store & Multi-Tenancy): 80% (12/15 tasks) ✅
- **Epic 2** (Theme Integration): 25% (3/12 tasks) ⚠️
- **Epic 3-8:** Deferred to post-launch ⚪
- **Code Written:** ~12,400 lines (10K Phase 2 + 2.4K Phase 3)
- **Files Created:** 63 (42 Phase 2 + 21 Phase 3)
- **Documentation:** 34 files (~16,500 lines)
- **TypeScript Errors:** 0 ✅
- **Build Time:** 1.43s ✅
- **Bundle Size:** 46.67 KB gzipped ✅

### What Works Right Now

**Phase 2.0 Features (Customer-Facing):**

- ✅ Visual admin product management (30-second setup)
- ✅ Shopify metafields integration (21 definitions)
- ✅ Icon-based customer filters
- ✅ Diamond type tabs (Mined/Lab/Fancy)
- ✅ Grid/list view toggle
- ✅ Diamond comparison (2-4 diamonds)
- ✅ Save & share configurations
- ✅ Customer engagement (4 inquiry types)
- ✅ Enhanced detail pages with SEO
- ✅ Performance optimized (React.memo, debouncing)

**Phase 3.0 Features (SaaS Infrastructure) - NEW!:**

- ✅ Subscription billing (3 tiers: $29/$99/$299/month)
- ✅ Multi-tenant merchant management
- ✅ 4-step onboarding wizard
- ✅ Admin billing dashboard
- ✅ Feature gating by plan
- ✅ Product limit enforcement (100/1K/unlimited)
- ✅ Theme app blocks (drag-and-drop installation)
- ✅ GDPR compliance webhooks (3 mandatory)
- ✅ Privacy policy & terms of service
- ✅ OAuth callback with auto-onboarding

---

## 🏗️ ARCHITECTURE ESSENTIALS

### Data Flow

```
SHOPIFY (Source of Truth)
  ├─ Products (title, price, images)
  └─ Metafields (21 ringbuilder.* fields)
       ↓ Webhooks sync
APP DATABASE (Performance Cache)
  ├─ StoneMetadata (diamondType, 4Cs, etc.)
  ├─ SettingMetadata (style, metals, etc.)
  └─ Configuration (customer builds)
       ↓ Fast queries
CUSTOMER (Ring Builder UI)
  └─ 4-step flow with all features
```

### Database Schema (Key Models)

```prisma
model StoneMetadata {
  diamondType String @default("mined") // "mined" | "lab_grown" | "fancy_color"
  shape, carat, cut, color, clarity
  certificate, certificateUrl
  measurements, polish, symmetry, fluorescence
  @@index([shop, diamondType]) // Phase 2.0
}

model Configuration {
  shareToken String? @unique // Phase 2.0
  shareCount Int @default(0)
  savedAt DateTime?
  @@index([shareToken])
}

model CustomerInquiry {
  type String // "hint" | "info" | "viewing" | "email"
  status String @default("new") // "new" | "contacted" | "closed"
  // customer contact info, message, etc.
}
```

### Tech Stack

- React Router 7 (app framework)
- TypeScript (100% type-safe)
- Prisma ORM (database)
- Shopify Admin API (metafields, webhooks)
- SQLite (dev), PostgreSQL (prod)

---

## 📁 KEY FILES TO KNOW

### Critical Services

- `app/services/metafields.server.ts` - Metafields CRUD (530 lines)
- `app/services/product.server.ts` - Product queries (575 lines)
- `app/services/email.server.ts` - Email sending
- `app/services/inquiry.server.ts` - Customer inquiries

### Admin Components (7)

- `app/components/admin/AddDiamondModal.tsx` - Visual diamond form (450 lines)
- `app/components/admin/AddSettingModal.tsx` - Visual setting form (400 lines)
- `app/components/admin/ProductDashboard.tsx` - Product list with status
- `app/components/admin/InquiryDashboard.tsx` - Inquiry management

### Customer Components (20)

- `app/components/builder/DiamondTypeTabs.tsx` - Mined/Lab/Fancy tabs
- `app/components/builder/StoneGridView.tsx` - Grid view (React.memo)
- `app/components/builder/ComparisonModal.tsx` - 2-4 diamond comparison
- `app/components/builder/ShareModal.tsx` - Share via email/social
- `app/components/builder/InquiryModal.tsx` - 4 inquiry types
- `app/components/builder/ActionButtonGroup.tsx` - Customer actions

### Key Routes

- `app/routes/app.builder.products.tsx` - Admin product management
- `app/routes/builder.tsx` - Customer builder main
- `app/routes/builder.setting.$id.tsx` - Setting detail page (SEO)
- `app/routes/builder.diamond.$id.tsx` - Diamond detail page (SEO)
- `app/routes/api.builder.*.tsx` - Public APIs (8 endpoints)
- `app/routes/api.admin.*.tsx` - Admin APIs (7 endpoints)

### Utilities

- `app/utils/comparison-helpers.ts` - Comparison logic
- `app/utils/share-helpers.ts` - Share URL generation
- `app/utils/constants.ts` - All enums and constants

---

## 🔧 COMMON TASKS

### Adding a New Feature

1. Add types to `app/types/builder.ts`
2. Create service in `app/services/*.server.ts`
3. Create API route in `app/routes/api.*`
4. Create component in `app/components/*`
5. Test: `npm run typecheck && npm run build`

### Modifying Metafields

1. Update definitions in `app/services/metafields.server.ts`
2. Run metafield setup: POST `/api/admin/metafields/setup`
3. Update types in `app/types/metafields.ts`

### Database Changes

1. Edit `prisma/schema.prisma`
2. Run `npx prisma migrate dev --name description`
3. Update TypeScript types
4. Test migration

### Performance Optimization

- Use React.memo for expensive list components
- Debounce search inputs (300ms)
- Lazy load images: `loading="lazy"`
- Check bundle: Look for large chunks in build output

---

## 🚨 CRITICAL PATTERNS

### Multi-Tenant Isolation (ALWAYS)

```typescript
// ✅ ALWAYS filter by shop
await prisma.stoneMetadata.findMany({
  where: { shop: userShop }, // Required!
});
```

### Authentication

```typescript
// Admin routes
const { admin, session } = await authenticate.admin(request);
const shop = session.shop;

// Public routes
const shop = url.searchParams.get("shop"); // From URL
```

### Metafields Write Pattern

```typescript
// ALWAYS write to both: Shopify metafields + DB
await writeProductMetafields(admin, productId, metafields); // Shopify
await prisma.stoneMetadata.create({ data }); // Database cache
```

### Error Handling

```typescript
try {
  // Operation
} catch (error) {
  console.error("Error details:", error); // Log
  return { success: false, error: "User-friendly message" }; // Return
}
```

---

## 📖 DOCUMENTATION MAP

### For Development

- **Architecture:** `docs/METAFIELDS_ARCHITECTURE.md`
- **Testing:** `docs/PHASE_2_MANUAL_TESTING.md`
- **Quick Check:** `docs/QUICK_VALIDATION_CHECKLIST.md`

### For Merchants

- **Setup Guide:** `docs/PHASE_2_SETUP.md`
- **CSV Import:** `docs/HOW_TO_USE_CSV_IMPORT.md`

### For Security

- **Security Audit:** `ai-memory/SECURITY_AUDIT_PHASE_2.md` (Score: 8.5/10)

### For Deployment

- **Migration Script:** `prisma/scripts/migrate-to-phase-2.ts`
- **README:** Updated with Phase 2.0 features

---

## 🎯 DEFERRED FEATURES

### Task 8.0: Virtual Try-On (Optional)

- **Status:** Deferred to post-launch
- **Reason:** Optional per PRD, can add based on merchant feedback
- **Effort:** 2 hours
- **Implementation:** Simple image upload overlay

### Future Enhancements (Phase 3.0)

- AI-powered recommendations
- Advanced analytics dashboard
- Customer accounts
- Multi-language support
- Financing integration

---

## 🔍 TROUBLESHOOTING QUICK REFERENCE

### TypeScript Errors

- Check imports (no `json` from react-router in v7)
- Use proper types from `~/types/builder.ts`
- Avoid `any`, use proper interfaces

### Build Errors

- Check all imports resolve
- Verify Prisma client generated: `npx prisma generate`
- Clear `.cache` and `build` folders

### Metafields Not Saving

- Verify setup ran: POST `/api/admin/metafields/setup`
- Check Shopify Admin → Settings → Custom Data
- Verify admin session has write permissions

### Webhooks Not Triggering

- Check `shopify.app.toml` registration
- Use Shopify CLI: `shopify webhook trigger --topic products/update`
- Check console logs for "Webhook received"

---

## 🚀 DEPLOYMENT CHECKLIST

### Pre-Deploy

- [x] TypeScript: 0 errors
- [x] Build: Success
- [x] Tests: Documented
- [x] Security: Audited
- [x] Docs: Complete

### Deploy Steps

1. Run migration script (validation)
2. Deploy to staging
3. Quick manual test (30 min)
4. Deploy to production
5. Monitor for 24-48 hours

### Environment Variables Needed

```bash
# Email (optional but recommended)
SENDGRID_API_KEY=xxx
EMAIL_FROM_ADDRESS=noreply@store.com
MERCHANT_EMAIL=merchant@store.com

# Shopify (auto-configured by CLI)
SHOPIFY_API_KEY=xxx
SHOPIFY_API_SECRET=xxx
```

---

## 💡 AI ASSISTANT TIPS

### When Asked to Debug

1. Check TypeScript errors first: `npm run typecheck`
2. Look at recent git changes: Check what was modified
3. Read service files before modifying
4. Test incrementally

### When Adding Features

1. Follow existing patterns (see services/)
2. Add types first
3. Use multi-tenant isolation (shop filter)
4. Write tests/docs alongside code

### When Optimizing

1. Check bundle size in build output
2. Use React.memo for list components
3. Debounce user inputs (300ms)
4. Lazy load images

### When Fixing Bugs

1. Check console logs (both server and client)
2. Verify database state (Prisma Studio)
3. Check Shopify metafields
4. Test webhook payloads

---

## 📋 CRITICAL CONSTRAINTS

### Must Always Follow

1. **Multi-tenant isolation:** All queries filter by `shop`
2. **Dual storage:** Write to Shopify metafields AND database
3. **Type safety:** No `any` types
4. **Error handling:** Try/catch all async operations
5. **Validation:** Both client-side and server-side
6. **Backward compatibility:** Phase 1.0 must still work

### Never Do

1. ❌ Skip shop parameter validation
2. ❌ Write to database without writing to metafields
3. ❌ Use `any` type (use `unknown` and narrow)
4. ❌ Expose sensitive data in error messages
5. ❌ Break Phase 1.0 functionality
6. ❌ Deploy without running typecheck

---

## 🎯 SUCCESS METRICS (MONITOR POST-LAUNCH)

### Merchant

- Product setup time: < 30 seconds ✅
- Setup error rate: < 5% ✅
- Merchant satisfaction: 4.5+ stars (measure)

### Customer

- Configuration completion: 40%+ (measure)
- Feature engagement: 20%+ use new features (measure)
- Time to decision: < 8.5 min (measure)

### Technical

- API response: < 500ms ✅
- Page load: < 3s ✅
- Data sync accuracy: 99.9%+ ✅
- Uptime: 99.5%+ (monitor)

---

## 🚨 KNOWN LIMITATIONS & FUTURE WORK

### Current Limitations

1. No rate limiting (add in 30 days)
2. No CAPTCHA on forms (add in 60 days)
3. Token expiration not implemented (nice to have)
4. Icons are emoji (can replace with SVG)
5. No Virtual Try-On (deferred)

### Recommended Next Steps (30-60 days)

1. Add rate limiting to `/api/builder/inquiry`
2. Add CAPTCHA to customer forms
3. Replace emoji icons with professional SVGs
4. Add URL validation to certificate field
5. Implement token expiration (90 days)

---

## 📞 QUICK REFERENCES

### Most Common Commands

```bash
# Development
npm run dev                    # Start dev server
npm run typecheck             # Check TypeScript
npm run build                 # Production build
npx prisma studio             # View database
npx prisma migrate dev        # Run migrations

# Testing
npx ts-node prisma/scripts/migrate-to-phase-2.ts  # Validate migration
shopify webhook trigger --topic products/update    # Test webhook

# Deployment
npm run build && deploy        # Build and deploy
```

### Critical URLs

- Admin: `/app/builder/products`
- Customer: `/builder?shop=store.myshopify.com`
- Inquiries: `/app/builder/inquiries`
- Settings: `/app/builder/settings`
- Detail Pages: `/builder/setting/:id`, `/builder/diamond/:id`

---

## 🎓 FOR NEW AI ASSISTANTS

### Read First

1. This file (AI_CONTEXT_MASTER.md)
2. `docs/METAFIELDS_ARCHITECTURE.md` - How data flows
3. `docs/QUICK_VALIDATION_CHECKLIST.md` - How to test

### When Modifying Code

1. Check `app/types/builder.ts` for types
2. Look at similar files for patterns
3. Always run `npm run typecheck`
4. Test with manual testing guide

### When Debugging

1. Check recent changes (git status)
2. Look at error messages carefully
3. Check Prisma Studio for database state
4. Verify shop parameter everywhere

---

## ✅ FINAL STATE

**Phase 2.0 Status:** PRODUCTION READY  
**Security:** Audited (8.5/10)  
**Performance:** Exceeds all targets  
**Documentation:** Complete  
**Next:** Deploy and monitor

**Key Files:**

- PRD: `tasks/0003-prd-phase-2-metafields-architecture.md`
- Tasks: `tasks/tasks-0003-prd-phase-2-metafields-architecture.md`
- Security: `ai-memory/SECURITY_AUDIT_PHASE_2.md`
- Testing: `docs/PHASE_2_MANUAL_TESTING.md`
- Setup: `docs/PHASE_2_SETUP.md`

---

**This file contains everything an AI needs to work effectively on this project.**  
**For detailed historical context, see archived folder.**
