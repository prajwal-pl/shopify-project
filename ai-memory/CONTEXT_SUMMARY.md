# Project Context Summary for AI Assistant

**Purpose**: This document provides a comprehensive context summary for AI assistants to understand the project state and provide accurate help.

**Last Updated**: October 12, 2025  
**Session**: Initial Deep Analysis

---

## What This Project Is

This is a **Shopify embedded app** that will enable jewelry stores to offer **custom ring building** to their customers. Think of it like a car configurator, but for engagement rings:

1. Customer selects a ring setting (the band)
2. Customer selects a center stone (diamond/gemstone)
3. Customer customizes (ring size, engraving)
4. Customer reviews and adds to cart
5. Merchant receives order with complete specifications

---

## Current Project State: PLANNING PHASE

### ✅ What EXISTS (Working)

- Shopify app template fully set up
- React Router v7.9.1 configured
- Prisma ORM installed with SQLite
- Basic authentication working
- Can install on Shopify stores
- Has one sample admin page

### ❌ What DOESN'T EXIST (Needs Building)

- Ring builder functionality (0%)
- Database models for builder
- Admin product management UI
- Storefront builder interface
- API endpoints
- Theme app extension
- **Literally all business logic**

**Bottom Line**: The template is ready, but we're at the starting line. The actual ring builder app needs to be built from scratch.

---

## Key Architectural Decisions

### Multi-Tenant SaaS

- One app, many stores
- Each store's data is isolated by `shop` field
- Must ALWAYS filter queries by shop

### Two Separate UIs

1. **Admin UI** (Polaris components for merchants)
   - Manage products
   - Configure settings
   - View analytics
2. **Storefront UI** (React components for customers)
   - Step-by-step builder
   - Product selection
   - Add to cart

### Data Storage Strategy

- **Products**: Stored in Shopify (via Admin API)
- **Metadata**: Stored in app database (builder-specific attributes)
- **Configurations**: Stored in app database (customer selections)
- **Orders**: Created in Shopify (via Admin API)

### Integration Approach

- **Admin**: Embedded app iframe
- **Storefront**: Theme App Extension block
- **Communication**: RESTful API (not GraphQL for builder)

---

## Critical Database Relationships

```
Shopify Products
     │
     ├─ Has Setting Metadata ────────┐
     │  (styles, prices, etc.)       │
     │                                │
     └─ Has Stone Metadata ───────────┤
        (4 Cs, certificate, etc.)    │
                                      │
                                      ▼
                         Customer Configuration
                         (settingId + stoneId + customizations)
                                      │
                                      ▼
                              Shopify Order
                         (line item properties)
```

### Why This Matters

- Products live in Shopify (inventory management)
- Metadata lives in app (builder-specific attributes)
- Must sync via webhooks when products change
- Configuration links to products via Shopify GIDs

---

## Essential Context for AI

### When User Asks About...

#### "Products" or "Inventory"

- Products are Shopify products (managed via Admin API)
- Settings = ring bands (products with special metadata)
- Stones = diamonds/gems (products with 4C specifications)
- Use GraphQL for product CRUD
- Store metadata in app database

#### "Configuration" or "Builder"

- Configuration = one customer's ring choices
- Stored in app database (Configuration model)
- References Shopify products by GID
- Can be "in-progress", "completed", or "ordered"
- Needs share token for URL sharing

#### "Pricing"

- Setting has different prices per metal type
- Stone has one price
- Add fees (engraving, gift wrap)
- Apply merchant markup
- Calculate on backend (don't trust client)

#### "Admin" or "Dashboard"

- Embedded iframe in Shopify admin
- Uses Polaris Web Components (`<s-card>`, `<s-button>`)
- Routes under `/app/*`
- Must authenticate each request

#### "Storefront" or "Builder UI"

- Separate React app (not in admin)
- Delivered as Theme App Extension
- Lives on merchant's storefront
- Public-facing (no auth required)
- Routes under `/api/builder/*` for data

#### "API Endpoints"

- Two categories: Admin API vs Builder API
- Admin = authenticated, shop-scoped
- Builder = public, returns filtered products
- Use REST (not GraphQL) for builder endpoints
- Always validate shop context

---

## Common Pitfalls to Avoid

### 1. Multi-Tenant Data Leaks

❌ **Bad**: `prisma.configuration.findMany()`  
✅ **Good**: `prisma.configuration.findMany({ where: { shop } })`

Always include shop filter!

### 2. Shopify ID Format

❌ **Bad**: `"123"` or `123`  
✅ **Good**: `"gid://shopify/Product/123"`

Use Shopify GID format for all product references.

### 3. Price Calculation

❌ **Bad**: Calculate only on client, trust result  
✅ **Good**: Calculate on client (UX), recalculate on server (security)

Never trust client-side price calculations.

### 4. Session Validation

❌ **Bad**: Skip auth on some routes  
✅ **Good**: Authenticate every admin request

Use `authenticate.admin(request)` on all admin routes.

### 5. Webhook Processing

❌ **Bad**: Long-running operations in webhook handler  
✅ **Good**: Queue job, return 200 immediately

Shopify expects fast webhook responses.

---

## File Organization Pattern

### Routes Pattern

```
app/routes/
├── api/                        # API endpoints
│   ├── builder/               # Public builder API
│   │   ├── settings.ts
│   │   ├── stones.ts
│   │   └── configure.ts
│   └── admin/                 # Authenticated admin API
│       ├── products.ts
│       └── settings.ts
├── app/                       # Admin pages
│   ├── builder.tsx           # Layout
│   ├── builder.products.tsx  # Products page
│   └── builder.settings.tsx  # Settings page
└── webhooks/                  # Webhook handlers
    ├── products.update.tsx
    └── orders.create.tsx
```

### Services Pattern

```
app/services/
├── product.server.ts         # Product operations
├── pricing.server.ts         # Price calculations
├── configuration.server.ts   # Config CRUD
├── order.server.ts          # Order creation
├── analytics.server.ts      # Event tracking
└── email.server.ts          # Notifications
```

### Components Pattern

```
app/components/
├── builder/                  # Storefront components
│   ├── BuilderApp.tsx
│   ├── steps/
│   │   ├── SettingSelector.tsx
│   │   ├── StoneSelector.tsx
│   │   ├── Customization.tsx
│   │   └── Review.tsx
│   └── shared/
│       ├── Modal.tsx
│       └── Button.tsx
└── admin/                    # Admin components
    ├── ProductCard.tsx
    ├── SettingMetadataForm.tsx
    └── StoneMetadataForm.tsx
```

---

## Development Workflow

### Starting a New Feature

1. Update Prisma schema if needed (+ migrate)
2. Create service layer (business logic)
3. Create API route (uses service)
4. Create UI component (calls API)
5. Test end-to-end
6. Update documentation

### Making Database Changes

```bash
# 1. Edit prisma/schema.prisma
# 2. Create migration
npx prisma migrate dev --name your_change_name

# 3. Generate Prisma Client
npx prisma generate

# 4. Restart dev server
npm run dev
```

### Adding New API Endpoint

```typescript
// app/routes/api.builder.example.ts
import { authenticate } from "~/shopify.server";

export async function loader({ request }) {
  const { shop } = await authenticate.admin(request);

  // Always filter by shop!
  const data = await prisma.model.findMany({
    where: { shop },
  });

  return json({ data });
}
```

---

## Testing Checklist

### For Any New Feature

- [ ] Works on desktop (Chrome, Firefox, Safari)
- [ ] Works on mobile (iOS Safari, Android Chrome)
- [ ] Data is shop-isolated (can't see other shops' data)
- [ ] Error handling is graceful
- [ ] Loading states are shown
- [ ] Form validation works
- [ ] Prices calculate correctly
- [ ] Database indexes exist for queries
- [ ] Webhooks handle failures
- [ ] Emails send correctly

---

## Environment Variables

### Required

```env
SHOPIFY_API_KEY=your_api_key
SHOPIFY_API_SECRET=your_secret
SHOPIFY_APP_URL=https://your-app.com
SCOPES=write_products,read_products,write_orders,read_orders
DATABASE_URL=postgresql://...
```

### Optional

```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your_sendgrid_api_key
CDN_URL=https://cdn.cloudinary.com/...
```

---

## Shopify-Specific Knowledge

### Product Variants

- Settings should have variants for each metal type
- Each variant has its own price
- Use `variantId` when adding to cart

### Metafields

- Use namespace `builder` for all app metafields
- Key examples: `setting_data`, `stone_data`
- Store as JSON strings
- Can query via GraphQL

### Line Item Properties

- Displayed to merchant on order
- Format: `{ "Key": "Value" }`
- Max 255 chars per value
- Not searchable in admin

### GraphQL Pagination

- Use `first: 50` for batch queries
- Check `pageInfo.hasNextPage`
- Use `after` cursor for next page
- Don't fetch all products at once

### Rate Limits

- 2 requests per second per shop
- Use batching when possible
- Implement exponential backoff
- Cache frequently accessed data

---

## Business Logic Rules

### Setting Selection

- Must be marked as "setting" in metadata
- Must have base prices for each metal type
- Must specify compatible stone shapes
- Show only available (not sold out)

### Stone Selection

- Must be marked as "stone" in metadata
- Must be compatible with selected setting
- Filter by 4 Cs (Carat, Cut, Color, Clarity)
- Show certificate information

### Price Calculation

```
Total = Setting Price (by metal)
      + Stone Price
      + Engraving Fee (if engraving)
      + Gift Wrap Fee (if gift wrap)
      * (1 + Markup %)
```

### Order Creation

1. Save configuration to database
2. Get variant ID for selected metal
3. Build line item properties
4. Call Shopify Ajax Cart API
5. Redirect to cart page

---

## Code Quality Standards

### TypeScript

- Use strict mode
- Define interfaces for all data structures
- No `any` types without justification
- Export types for reuse

### Error Handling

```typescript
try {
  // Operation
  return { success: true, data };
} catch (error) {
  console.error("Context:", error);
  return { success: false, error: error.message };
}
```

### Comments

- Explain WHY, not WHAT
- Document complex algorithms
- Add JSDoc for public functions
- Link to relevant docs

### Security

- Sanitize all user inputs
- Validate data on backend
- Use parameterized queries (Prisma does this)
- Never expose sensitive data in responses
- Always verify shop context

---

## Quick Decision Matrix

### Should this be in the app database or Shopify?

- **App DB**: Builder metadata, configurations, analytics
- **Shopify**: Products, orders, customers, inventory

### Should this be a GraphQL query or REST endpoint?

- **GraphQL**: Shopify Admin API operations (products, orders)
- **REST**: Builder API endpoints (settings, stones, configure)

### Should this be server-side or client-side?

- **Server**: Price calculations, data validation, order creation
- **Client**: UI interactions, form validation (UX), filtering (UX)

### Should this use Polaris or custom components?

- **Polaris**: Admin interface (consistency with Shopify)
- **Custom**: Storefront builder (match merchant's theme)

---

## Absolutely Critical Points

1. **ALWAYS filter by shop** in database queries
2. **NEVER trust client prices** - recalculate on server
3. **USE Shopify GIDs** for product references
4. **VALIDATE sessions** on every admin request
5. **HANDLE webhooks idempotently** (can be retried)
6. **TEST multi-tenant isolation** (can't access other shops)
7. **CACHE product data** (reduce API calls)
8. **INDEX database fields** (performance with large datasets)

---

## Next Immediate Steps

When user says "let's start coding":

1. **First**: Extend Prisma schema with 5 models
2. **Second**: Create migrations and generate Prisma client
3. **Third**: Update shopify.app.toml with required scopes
4. **Fourth**: Create product service layer
5. **Fifth**: Build admin product listing page

**Do NOT start with storefront** - merchants need to set up products first!

---

## Common User Questions & Answers

**Q: "Where do I start?"**  
A: Start with the database schema. Everything else depends on it.

**Q: "What's the hardest part?"**  
A: Multi-tenant data isolation and image composition for previews.

**Q: "Can I skip X feature for MVP?"**  
A: Check `tasks/PRD_RING_BUILDER_APP.md` - only items marked FR (Functional Requirement) are must-have.

**Q: "How long will this take?"**  
A: 12-14 weeks with 2-3 developers, based on 180+ tasks.

**Q: "Do I need to know Shopify?"**  
A: Yes, understanding Shopify Admin API and OAuth is essential.

**Q: "Can I use different tech?"**  
A: Not recommended. Template is React Router + Prisma. Changing would add weeks.

---

## Resources for Common Tasks

### Learn Shopify Admin API

- Docs: https://shopify.dev/docs/api/admin-graphql
- GraphiQL: Shopify admin → Apps → Develop apps → API credentials

### Learn Prisma

- Docs: https://www.prisma.io/docs
- Schema reference: https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference

### Learn React Router

- Docs: https://reactrouter.com/
- Loaders: https://reactrouter.com/en/main/route/loader
- Actions: https://reactrouter.com/en/main/route/action

### Learn Polaris Web Components

- Docs: https://shopify.dev/docs/api/app-home
- Component list: https://shopify.dev/docs/api/app-home/polaris-web-components

---

**AI Assistant Note**: This document provides the complete context needed to assist with this project. When user asks questions, refer to this context rather than making assumptions. The project is in planning phase with excellent documentation but 0% implementation of actual builder features.

**Last Context Update**: October 12, 2025 - Initial deep analysis complete
