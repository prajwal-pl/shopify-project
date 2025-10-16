# Project Knowledge Summary - Ring Builder MVP

**Generated:** October 14, 2025  
**Purpose:** Quick reference for AI assistant onboarding  
**Status:** ✅ Up to date

---

## 🎯 WHAT IS THIS PROJECT?

**Ring Builder MVP for Shopify** - A custom app that lets jewelry stores offer personalized ring building in 4 steps:

1. Choose Setting → 2. Select Diamond → 3. Customize → 4. Review & Purchase

**Current Phase:** 2.0 - Metafields Architecture & GemFind Feature Parity  
**Completion:** 90% (9/11 tasks, Task 8 VTO is optional)  
**Status:** ✅ **Production Ready**

---

## 🏗️ ARCHITECTURE OVERVIEW

### Technology Stack

- **Framework:** React Router 7 (Shopify App Template)
- **Language:** TypeScript (100% type-safe, 0 errors)
- **Database:** Prisma ORM (SQLite dev, PostgreSQL prod)
- **Shopify:** Admin API, Metafields, Webhooks
- **Performance:** 46.67 KB gzipped bundle, 1.58s build time

### Data Architecture: Dual Storage

```
SHOPIFY METAFIELDS (Source of Truth)
  ↓ sync via webhooks
APP DATABASE (Performance Cache)
  ↓ fast queries
CUSTOMER UI (Ring Builder)
```

**Why Dual Storage?**

- Metafields = Permanent (survives app uninstall)
- Database = Fast queries (< 100ms for complex filters)

### Database Models (Key)

1. **StoneMetadata** - Diamond specs (shape, carat, 4Cs, diamondType)
2. **SettingMetadata** - Ring setting specs (style, compatible shapes, metal prices)
3. **Configuration** - Customer ring builds (with shareToken for Phase 2.0)
4. **CustomerInquiry** - Phase 2.0: hints, info requests, viewing appointments
5. **AppSettings** - Merchant configuration

---

## 📁 PROJECT STRUCTURE

```
/ai-memory/              # AI context & progress tracking
  ├── AI_CONTEXT_MASTER.md  ⭐ START HERE - Single source of truth
  ├── SECURITY_AUDIT_PHASE_2.md (8.5/10 score)
  ├── PHASE_2_COMPLETE_FINAL.md
  └── archive/          # 48 historical documents

/docs/                  # User documentation
  ├── PHASE_2_SETUP.md  (merchant onboarding)
  ├── PHASE_2_MANUAL_TESTING.md (complete test suite)
  ├── METAFIELDS_ARCHITECTURE.md (technical reference)
  └── QUICK_VALIDATION_CHECKLIST.md

/app/
  ├── components/
  │   ├── admin/       # 6 components (dashboards, modals)
  │   ├── builder/     # 31 components (customer UI)
  │   └── shared/      # 4 shared components
  ├── routes/          # 38 routes (admin + customer + API)
  ├── services/        # 7 server services
  │   ├── metafields.server.ts (530 lines - metafields CRUD)
  │   ├── product.server.ts (575 lines - product queries)
  │   ├── inquiry.server.ts (customer engagement)
  │   └── pricing.server.ts (price calculations)
  ├── types/           # TypeScript definitions
  └── utils/           # 7 utility files

/prisma/
  ├── schema.prisma    # Database schema
  └── scripts/         # Migration validation script
```

---

## 🚀 PHASE 2.0 KEY FEATURES

### Merchant Experience (Admin)

- ✅ Visual product management (icon-based forms, 30-second setup)
- ✅ 21 Shopify metafield definitions (automatic setup)
- ✅ Customer inquiry dashboard (track hints, info requests, appointments)
- ✅ Product status indicators
- ✅ CSV import still available (advanced users)

### Customer Experience (Storefront)

- ✅ Icon-based visual filters (GemFind-style)
- ✅ Diamond type tabs: Mined | Lab Grown | Fancy Color (with count badges)
- ✅ Grid/list view toggle (localStorage persistence)
- ✅ 2-4 diamond comparison (differences highlighted)
- ✅ Save & share configurations (email, Facebook, Twitter)
- ✅ Customer engagement: Drop hints, request info, schedule viewing, email friends
- ✅ Enhanced product detail pages (SEO-optimized with Open Graph + Twitter Cards)
- ✅ Certificate viewer (GIA/AGS PDF viewer)
- ✅ Debounced SKU search (300ms)
- ✅ Records per page selector (12/20/50/100)

### Technical Improvements

- ✅ React.memo optimization on expensive components
- ✅ Performance targets exceeded (bundle size, build time)
- ✅ Security audit passed (8.5/10)
- ✅ Comprehensive documentation
- ✅ Manual testing guide (37 KB)

---

## 🔧 KEY PATTERNS & CONVENTIONS

### Multi-Tenant Isolation (CRITICAL)

```typescript
// ✅ ALWAYS filter by shop
await prisma.stoneMetadata.findMany({
  where: { shop: userShop }, // Required!
});
```

### Dual Storage Write Pattern

```typescript
// Write to BOTH Shopify metafields AND database
await writeProductMetafields(admin, productId, metafields); // Shopify
await prisma.stoneMetadata.create({ data }); // Database cache
```

### Authentication

```typescript
// Admin routes
const { admin, session } = await authenticate.admin(request);

// Public routes (customer-facing)
const shop = url.searchParams.get("shop"); // From URL parameter
```

### Error Handling

```typescript
try {
  // Operation
} catch (error) {
  console.error("Error details:", error); // Log for debugging
  return { success: false, error: "User-friendly message" }; // Return to UI
}
```

---

## 📊 CURRENT STATUS

### Completion

- **Core Features:** 100% ✅
- **Tasks Complete:** 9/11 (82%) ✅
  - ✅ Tasks 1-7: All features implemented
  - ❌ Task 8: Virtual Try-On (optional, deferred)
  - ✅ Tasks 9-11: Detail pages, optimization, docs
- **Code Quality:**
  - TypeScript Errors: 0 ✅
  - Lines of Code: ~10,000
  - Components: 41
  - API Endpoints: 20
  - Build Time: 1.58s ✅
  - Bundle Size: 46.67 KB gzipped ✅

### Security Audit Results

**Score: 8.5/10** ✅

**Strengths:**

- Authentication: 10/10 ✅
- Authorization: 10/10 ✅
- Data Protection: 10/10 ✅
- Input Validation: 9/10 ✅
- SQL Injection: Protected via Prisma ORM ✅
- XSS: Protected via React auto-escaping ✅

**Recommendations (30-60 days):**

1. Add rate limiting to inquiry endpoint
2. Add CAPTCHA to customer forms
3. Add URL validation for certificate field
4. Consider 90-day token expiration

---

## 🚨 CRITICAL CONSTRAINTS

### Always Follow

1. **Multi-tenant isolation:** All queries MUST filter by `shop`
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

## 📖 DOCUMENTATION MAP

### Start Here (AI Assistants)

1. **AI_CONTEXT_MASTER.md** ⭐ - Everything you need in one file
2. SECURITY_AUDIT_PHASE_2.md - Security patterns
3. This file - Quick orientation

### For Development Work

1. **docs/METAFIELDS_ARCHITECTURE.md** - How data flows
2. **app/types/builder.ts** - All TypeScript types
3. **docs/API_TESTING.md** - API documentation

### For Testing

1. **docs/QUICK_VALIDATION_CHECKLIST.md** - 30-minute test
2. **docs/PHASE_2_MANUAL_TESTING.md** - Complete test suite

### For Merchants

1. **docs/PHASE_2_SETUP.md** - 15-minute onboarding guide
2. **docs/HOW_TO_USE_CSV_IMPORT.md** - Bulk import

---

## 🔍 COMMON TASKS

### Running the App

```bash
npm run dev              # Start development server
npm run typecheck        # Check TypeScript (ALWAYS before commit)
npm run build            # Production build
npx prisma studio        # View database
```

### Adding a New Feature

1. Add types to `app/types/builder.ts`
2. Create service in `app/services/*.server.ts`
3. Create API route in `app/routes/api.*`
4. Create component in `app/components/*`
5. Test: `npm run typecheck && npm run build`

### Modifying Database

1. Edit `prisma/schema.prisma`
2. Run `npx prisma migrate dev --name description`
3. Update TypeScript types
4. Test migration

### Debugging

1. Check TypeScript: `npm run typecheck`
2. Check recent changes: `git status`
3. View database: `npx prisma studio`
4. Read service files before modifying
5. Check console logs (server + client)

---

## 🎯 DEFERRED & FUTURE WORK

### Task 8.0: Virtual Try-On (Deferred)

- Status: Optional per PRD
- Reason: Can add based on merchant feedback
- Effort: ~2 hours
- Implementation: Simple image upload overlay

### Recommended Next Steps (30-60 days)

1. Add rate limiting to `/api/builder/inquiry`
2. Add CAPTCHA to customer forms
3. Replace emoji icons with professional SVGs
4. Add URL validation to certificate field
5. Implement token expiration (90 days)

### Phase 3.0 Ideas (Future)

- AI-powered diamond recommendations
- Advanced analytics dashboard
- Customer accounts & saved preferences
- Multi-language support
- Financing integration

---

## 🚀 DEPLOYMENT STATUS

### Pre-Deploy Checklist

- [x] TypeScript: 0 errors ✅
- [x] Build: Success ✅
- [x] Tests: Documented ✅
- [x] Security: Audited (8.5/10) ✅
- [x] Docs: Complete ✅

### Environment Variables Needed

```bash
# Email Service (optional but recommended)
SENDGRID_API_KEY=xxx
# OR AWS_SES_ACCESS_KEY + AWS_SES_SECRET_KEY
# OR POSTMARK_API_KEY

EMAIL_FROM_ADDRESS=noreply@your-store.com
EMAIL_FROM_NAME=Your Store Name
MERCHANT_EMAIL=merchant@your-store.com

# Shopify (auto-configured by CLI)
SHOPIFY_API_KEY=xxx
SHOPIFY_API_SECRET=xxx
```

### Ready for Production

✅ **YES** - Core security is solid, features complete, documentation comprehensive

Monitor for 24-48 hours post-deploy and add rate limiting/CAPTCHA within 30-60 days.

---

## 💡 TIPS FOR AI ASSISTANTS

### When Asked to Debug

1. Run `npm run typecheck` first
2. Check `git status` for recent changes
3. Read relevant service files
4. Check console logs
5. Verify database state in Prisma Studio

### When Adding Features

1. Follow existing patterns (check services/)
2. Add types first in `app/types/builder.ts`
3. Use multi-tenant isolation (shop filter)
4. Write tests/docs alongside code

### When Optimizing

1. Check bundle size in build output
2. Use React.memo for list components
3. Debounce user inputs (300ms)
4. Lazy load images (`loading="lazy"`)

### When Fixing Bugs

1. Check console logs (server + client)
2. Verify database state
3. Check Shopify metafields
4. Test webhook payloads
5. Verify shop parameter everywhere

---

## 📋 QUICK REFERENCE

### Most Important Files

- `ai-memory/AI_CONTEXT_MASTER.md` - Master context
- `app/types/builder.ts` - All TypeScript types
- `app/services/metafields.server.ts` - Metafields CRUD
- `app/services/product.server.ts` - Product queries
- `prisma/schema.prisma` - Database schema
- `docs/METAFIELDS_ARCHITECTURE.md` - Architecture

### Critical URLs

- Admin: `/app/builder/products`
- Customer: `/builder?shop=store.myshopify.com`
- Inquiries: `/app/builder/inquiries`
- Settings: `/app/builder/settings`
- Detail Pages: `/builder/setting/:id`, `/builder/diamond/:id`

### Key Commands

```bash
npm run dev                    # Development
npm run typecheck              # TypeScript check (ALWAYS before commit)
npm run build                  # Production build
npx prisma studio              # View database
npx prisma migrate dev         # Run migrations
```

---

## ✅ SUMMARY

**Project:** Ring Builder MVP Phase 2.0  
**Status:** 90% Complete, Production Ready  
**Quality:** Excellent (0 TypeScript errors, 8.5/10 security)  
**Documentation:** Comprehensive and organized  
**Next Steps:** Deploy, monitor, add rate limiting within 30 days

**Key Achievement:** Transformed from CSV-based admin to visual forms with GemFind feature parity, dual-storage architecture, and comprehensive customer engagement features.

---

**This document provides everything needed to quickly understand and work on this project.**  
**For deeper details, see `AI_CONTEXT_MASTER.md` ⭐**
