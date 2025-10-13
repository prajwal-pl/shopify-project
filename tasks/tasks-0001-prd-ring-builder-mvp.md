# Task List: Ring Builder MVP - Shopify App

**Based on PRD**: `0001-prd-ring-builder-mvp.md`  
**Generated**: October 12, 2025  
**Status**: Ready for Implementation  
**Estimated Timeline**: 12 weeks

---

## Overview

This task list breaks down the Ring Builder MVP into actionable tasks following the PRD requirements. Each task is designed to be testable upon completion, with clear acceptance criteria.

**Key Principles**:

- ✅ Every task must produce testable output
- ✅ Multi-tenant data isolation in all queries
- ✅ Backend validation for all client calculations
- ✅ Mobile-responsive by default
- ✅ No scope creep - strictly follow PRD Non-Goals

---

## Relevant Files

### Database & Models

- `prisma/schema.prisma` - Extend with 5 new models (Configuration, SettingMetadata, StoneMetadata, AppSettings, AnalyticsEvent)
- `app/db.server.ts` - Database client (already exists)

### Core Backend Services

- `app/services/product.server.ts` - Product fetching and caching from Shopify
- `app/services/pricing.server.ts` - Price calculation and validation
- `app/services/configuration.server.ts` - Configuration CRUD operations
- `app/services/cart.server.ts` - Shopify cart integration

### Utility Modules

- `app/utils/constants.ts` - Diamond grades, metal types, ring sizes, etc.
- `app/utils/validators.ts` - Input validation functions
- `app/utils/formatters.ts` - Price, date, text formatting
- `app/utils/shopify-helpers.ts` - Shopify API helper functions

### Admin API Routes

- `app/routes/api.admin.products.ts` - List all products
- `app/routes/api.admin.products.$id.mark.ts` - Mark product as Setting/Stone
- `app/routes/api.admin.products.$id.metadata.ts` - Update metadata
- `app/routes/api.admin.import.ts` - CSV bulk import
- `app/routes/api.admin.export.ts` - CSV export
- `app/routes/api.admin.settings.ts` - Get/update app settings

### Builder API Routes (Public)

- `app/routes/api.builder.settings.ts` - Fetch settings with filters
- `app/routes/api.builder.stones.ts` - Fetch stones with filters
- `app/routes/api.builder.cart.ts` - Add configuration to cart

### Admin Pages (React Router)

- `app/routes/app.builder.tsx` - Builder admin layout
- `app/routes/app.builder._index.tsx` - Dashboard home
- `app/routes/app.builder.products.tsx` - Product listing
- `app/routes/app.builder.products.$id.tsx` - Product edit page
- `app/routes/app.builder.settings.tsx` - Settings page

### Admin Components

- `app/components/admin/ProductList.tsx` - Product grid with badges
- `app/components/admin/ProductCard.tsx` - Individual product card
- `app/components/admin/SettingMetadataForm.tsx` - Setting form
- `app/components/admin/StoneMetadataForm.tsx` - Stone form
- `app/components/admin/CSVImporter.tsx` - CSV upload interface
- `app/components/admin/SettingsForm.tsx` - App settings form

### Storefront Components (Builder)

- `app/components/builder/BuilderApp.tsx` - Root builder component
- `app/components/builder/BuilderProvider.tsx` - Context provider for state
- `app/components/builder/StepNavigation.tsx` - Progress indicator
- `app/components/builder/PriceSummary.tsx` - Sticky price display
- `app/components/builder/steps/SettingSelector.tsx` - Step 1
- `app/components/builder/steps/StoneSelector.tsx` - Step 2
- `app/components/builder/steps/Customization.tsx` - Step 3
- `app/components/builder/steps/Review.tsx` - Step 4
- `app/components/builder/FilterSidebar.tsx` - Filters for settings
- `app/components/builder/StoneFilters.tsx` - Advanced stone filters
- `app/components/builder/SettingCard.tsx` - Setting display card
- `app/components/builder/StoneTable.tsx` - Desktop table view
- `app/components/builder/StoneCardList.tsx` - Mobile card view
- `app/components/builder/Modal.tsx` - Reusable modal

### Shared Components

- `app/components/shared/Button.tsx` - Reusable button
- `app/components/shared/RangeSlider.tsx` - Price/carat range slider
- `app/components/shared/LoadingSpinner.tsx` - Loading indicator
- `app/components/shared/ErrorMessage.tsx` - Error display

### Theme App Extension

- `extensions/ring-builder/shopify.extension.toml` - Extension config
- `extensions/ring-builder/blocks/ring-builder.liquid` - Liquid template
- `extensions/ring-builder/assets/ring-builder.js` - Compiled React app
- `extensions/ring-builder/assets/ring-builder.css` - Styles

### Webhooks

- `app/routes/webhooks.products.update.tsx` - Product update handler
- `app/routes/webhooks.products.delete.tsx` - Product delete handler

### TypeScript Types

- `app/types/builder.ts` - Builder-specific types and interfaces
- `app/types/shopify.ts` - Shopify API response types

### Configuration

- `shopify.app.toml` - Update with required scopes and webhooks
- `vite.config.ts` - Vite configuration (may need updates)
- `.env.example` - Environment variable template

### Testing & Documentation

- `tests/services/pricing.test.ts` - Pricing service tests
- `tests/services/product.test.ts` - Product service tests
- `tests/utils/validators.test.ts` - Validator tests
- `docs/MERCHANT_SETUP.md` - Merchant onboarding guide
- `docs/API_TESTING.md` - API testing guide (curl examples)
- `docs/TESTING_CHECKLIST.md` - Feature testing checklist

---

## High-Level Tasks (Parent Tasks)

Based on the PRD analysis and current codebase assessment, here are the main implementation phases:

- [ ] **1.0 Foundation & Database Setup** (Week 1-2)
- [ ] **2.0 Admin Product Management Interface** (Week 3-4)
- [ ] **3.0 Admin Settings & Configuration** (Week 5)
- [ ] **4.0 Storefront Builder Core (Steps 1 & 2)** (Week 6-7)
- [ ] **5.0 Storefront Builder Completion (Steps 3 & 4)** (Week 8-9)
- [ ] **6.0 Cart Integration & Order Creation** (Week 10)
- [ ] **7.0 Webhooks & Product Sync** (Week 10)
- [ ] **8.0 Testing, Polish & Documentation** (Week 11-12)

---

## Phase Summary

### Phase 1: Foundation (1.0)

**Goal**: Set up database models, utilities, and core services. All subsequent features depend on this.

**Testable Outcome**: Database migrations run successfully, core services can be imported and tested.

### Phase 2: Admin Product Management (2.0)

**Goal**: Enable merchants to mark products and add metadata.

**Testable Outcome**: Merchant can log in, view products, mark as Setting/Stone, save metadata, and import CSV.

### Phase 3: Admin Settings (3.0)

**Goal**: Provide merchant configuration interface.

**Testable Outcome**: Merchant can enable/disable builder, set markup, configure side stones.

### Phase 4: Storefront Core (4.0)

**Goal**: Build Step 1 (Settings) and Step 2 (Stones) with filtering.

**Testable Outcome**: Customer can browse settings, filter stones, see prices update.

### Phase 5: Storefront Completion (5.0)

**Goal**: Build Step 3 (Customization) and Step 4 (Review).

**Testable Outcome**: Customer can select ring size, review configuration, see final price.

### Phase 6: Cart Integration (6.0)

**Goal**: Connect builder to Shopify cart.

**Testable Outcome**: Customer can add configured ring to cart, see it in Shopify cart with all details.

### Phase 7: Webhooks (7.0)

**Goal**: Keep product data synchronized.

**Testable Outcome**: Product updates in Shopify reflect in builder immediately.

### Phase 8: Testing & Launch (8.0)

**Goal**: Comprehensive testing and documentation.

**Testable Outcome**: All features work on mobile/desktop, no critical bugs, documentation complete.

---

## Detailed Tasks & Sub-Tasks

---

## 1.0 Foundation & Database Setup

**Goal**: Set up database schema, utilities, and core service layer.

**Testing**: After completion, run `npx prisma generate && npx prisma migrate dev` successfully.

- [ ] **1.1** Update `shopify.app.toml` with required OAuth scopes
  - Add scopes: `write_products,read_products,write_orders,read_orders,write_customers,read_customers`
  - Update webhook subscriptions for `products/update` and `products/delete`
  - **Test**: Run `npm run dev` and verify app loads without scope errors
  - **Files**: `shopify.app.toml`

- [ ] **1.2** Create constants file with all enums and options
  - Define `METAL_TYPES`, `STONE_SHAPES`, `CUT_GRADES`, `COLOR_GRADES`, `CLARITY_GRADES`, `SETTING_STYLES`, `RING_SIZES`, `CERTIFICATION_TYPES`
  - Export as typed constants with TypeScript enums where appropriate
  - **Test**: Import constants in another file, verify TypeScript autocomplete works
  - **Files**: `app/utils/constants.ts`

- [ ] **1.3** Create validators utility module
  - `validateRingSize(size: string): boolean`
  - `validateMetalType(metal: string): boolean`
  - `validateCarat(carat: number): boolean`
  - `validatePrice(price: number): boolean`
  - `validateShop(shop: string): boolean`
  - All validators throw descriptive errors on failure
  - **Test**: Create `tests/utils/validators.test.ts` with jest tests for all validators
  - **Files**: `app/utils/validators.ts`, `tests/utils/validators.test.ts`

- [ ] **1.4** Create formatters utility module
  - `formatPrice(amount: number, currency: string): string`
  - `formatCarat(carat: number): string` (returns "1.50 ct")
  - `formatStoneTitle(stone): string` (returns "1.50ct Round G VS1")
  - `formatDate(date: Date): string`
  - **Test**: Create unit tests, verify edge cases (negative numbers, null values)
  - **Files**: `app/utils/formatters.ts`, `tests/utils/formatters.test.ts`

- [ ] **1.5** Create Shopify helper utilities
  - `parseShopifyGid(gid: string): string` - extracts numeric ID
  - `buildShopifyGid(type: string, id: string): string` - builds GID
  - `buildProductQuery()` - returns GraphQL query string for products
  - `buildMetafieldInput(namespace, key, value)` - returns metafield input
  - **Test**: Test GID parsing/building with various formats
  - **Files**: `app/utils/shopify-helpers.ts`, `tests/utils/shopify-helpers.test.ts`

- [ ] **1.6** Extend Prisma schema with Configuration model
  - Add all fields: id, shop, customerId, customerEmail, settingId, stoneId, metalType, ringSize, sideStonesConfig, prices, status, shareToken, timestamps
  - Add indexes: `@@index([shop, customerId])`, `@@index([shop, status])`
  - Add enum: `ConfigurationStatus` (in_progress, completed, ordered)
  - **Test**: Run `npx prisma format` to validate schema syntax
  - **Files**: `prisma/schema.prisma`

- [ ] **1.7** Extend Prisma schema with SettingMetadata model
  - Fields: id, shop, productId (unique), style, settingHeight, compatibleShapes (String[]), basePrices (String for JSON), images (String[]), featured, timestamps
  - Add indexes: `@@index([shop, style])`, `@@index([shop, featured])`
  - **Test**: Verify schema syntax with `npx prisma format`
  - **Files**: `prisma/schema.prisma`

- [ ] **1.8** Extend Prisma schema with StoneMetadata model
  - Fields: id, shop, productId (unique), stoneType, shape, carat, cut, color, clarity, certificate, certificateNumber, certificateUrl, measurements, tablePercent, depthPercent, polish, symmetry, fluorescence, images (String[]), price, available, timestamps
  - Add indexes: `@@index([shop, shape, carat])`, `@@index([shop, available])`, `@@index([shop, price])`
  - **Test**: Verify schema
  - **Files**: `prisma/schema.prisma`

- [ ] **1.9** Extend Prisma schema with AppSettings model
  - Fields: id, shop (unique), builderEnabled, sideStones (JSON string), engravingFee, markupPercent, notifyOnConfig, notificationEmail, primaryColor, accentColor, timestamps
  - Set defaults: builderEnabled: true, markupPercent: 0
  - **Test**: Verify schema
  - **Files**: `prisma/schema.prisma`

- [ ] **1.10** Extend Prisma schema with AnalyticsEvent model (optional)
  - Fields: id, shop, configurationId, customerId, eventType, eventData (String for JSON), timestamp
  - Add indexes: `@@index([shop, eventType])`, `@@index([shop, configurationId])`
  - **Test**: Verify schema
  - **Files**: `prisma/schema.prisma`

- [ ] **1.11** Create database migration
  - Run: `npx prisma migrate dev --name add_builder_models`
  - Verify all tables created in dev.sqlite
  - **Test**: Run `npx prisma studio` and verify all 5 new tables exist with correct columns
  - **Files**: `prisma/migrations/[timestamp]_add_builder_models/migration.sql`

- [ ] **1.12** Generate Prisma Client
  - Run: `npx prisma generate`
  - Verify TypeScript types are generated for all models
  - **Test**: Import `prisma.configuration` in a route, verify autocomplete works
  - **Files**: `node_modules/.prisma/client/*` (generated)

- [ ] **1.13** Create TypeScript types file
  - Define interfaces: `Configuration`, `SettingMetadata`, `StoneMetadata`, `BuilderFilters`, `PriceBreakdown`, `ConfigurationSummary`
  - Export all types
  - **Test**: Import types in another file, verify TypeScript doesn't error
  - **Files**: `app/types/builder.ts`

- [ ] **1.14** Create Product service
  - `getProducts(shop, filters)` - fetch from Shopify with caching
  - `getProduct(shop, productId)` - single product
  - `getSettings(shop, filters)` - fetch setting products
  - `getStones(shop, filters)` - fetch stone products
  - All functions MUST filter by shop (multi-tenant isolation)
  - **Test**: Create unit tests with mocked Shopify API responses
  - **Files**: `app/services/product.server.ts`, `tests/services/product.test.ts`

- [ ] **1.15** Create Pricing service
  - `calculateSettingPrice(settingId, metalType, shop)` - get price from metadata
  - `calculateStonePrice(stoneId, shop)` - get stone price
  - `calculateSideStonesFee(quality, quantity, shop)` - calculate side stones
  - `calculateTotalPrice(configuration, shop)` - sum all + markup
  - `applyMarkup(price, markupPercent)` - apply merchant markup
  - **Test**: Unit tests with sample data, verify calculations are accurate
  - **Files**: `app/services/pricing.server.ts`, `tests/services/pricing.test.ts`

- [ ] **1.16** Create Configuration service
  - `createConfiguration(data, shop)` - save new config
  - `getConfiguration(id, shop)` - fetch with shop isolation
  - `updateConfiguration(id, data, shop)` - update existing
  - `listConfigurations(shop, filters)` - list with pagination
  - All functions enforce shop filtering
  - **Test**: Unit tests verifying shop isolation (can't access other shop's configs)
  - **Files**: `app/services/configuration.server.ts`, `tests/services/configuration.test.ts`

- [ ] **1.17** Create Cart service
  - `addToCart(configuration, shop)` - generate line item properties and add to Shopify cart
  - `buildLineItemProperties(configuration)` - generate properties object
  - `findVariantId(productId, metalType, shop)` - find correct variant
  - **Test**: Mock Shopify cart API, verify line item properties are correctly formatted
  - **Files**: `app/services/cart.server.ts`, `tests/services/cart.test.ts`

- [ ] **1.18** ✅ VALIDATE TASK 1.0 COMPLETION
  - **Reference**: `tasks/validate-task-completion.md` - Phase 1 validation
  - Run: `npm test && npm run typecheck`
  - Run: `npx prisma migrate status` - verify all migrations applied
  - Run: `npx prisma studio` - verify all 5 new tables exist
  - Verify: All 17 sub-tasks (1.1-1.17) completed and tested
  - Verify: All acceptance criteria below met
  - **STOP**: Do not proceed to Task 2.0 until all checks pass ✅

**Acceptance Criteria for Task 1.0**:

- ✅ All Prisma models created and migrated
- ✅ All utility functions tested and working
- ✅ All services have unit tests with >80% coverage
- ✅ TypeScript has no errors (`npm run typecheck`)
- ✅ Can import and use services in route files

---

## 2.0 Admin Product Management Interface

**Goal**: Enable merchants to mark products, edit metadata, and import/export data.

**Testing**: Merchant can log in, view products, mark as Setting/Stone, and save metadata.

- [ ] **2.1** Create admin builder layout route
  - File: `app/routes/app.builder.tsx`
  - Create layout with Polaris `<s-app-nav>` for navigation
  - Navigation items: Dashboard, Products, Settings
  - Include `<Outlet />` for nested routes
  - **Test**: Navigate to `/app/builder`, verify layout renders with navigation
  - **Files**: `app/routes/app.builder.tsx`

- [ ] **2.2** Create products list API route
  - File: `app/routes/api.admin.products.ts`
  - Loader: Authenticate admin, fetch products from Shopify (first 50)
  - Include metafields with namespace "builder"
  - Query app database for existing SettingMetadata/StoneMetadata
  - Merge Shopify data with metadata
  - Return JSON with `{ products: [], hasNextPage: bool }`
  - **Test**: `curl -H "Authorization: Bearer $TOKEN" http://localhost:3000/api/admin/products`
  - **Files**: `app/routes/api.admin.products.ts`

- [ ] **2.3** Create product mark API route
  - File: `app/routes/api.admin.products.$id.mark.ts`
  - Action: Accept `productId` and `type` (setting or stone)
  - Create empty SettingMetadata or StoneMetadata record
  - Link to Shopify product via productId (GID)
  - Return success response
  - Handle duplicate marking (update if exists)
  - **Test**: `curl -X POST -d '{"type":"setting"}' http://localhost:3000/api/admin/products/gid:123/mark`
  - **Files**: `app/routes/api.admin.products.$id.mark.ts`

- [ ] **2.4** Create metadata update API route
  - File: `app/routes/api.admin.products.$id.metadata.ts`
  - Action: Parse form data, validate all fields
  - Update SettingMetadata or StoneMetadata (upsert)
  - Validate required fields based on type
  - Return success/error response
  - **Test**: POST with sample metadata, verify database update
  - **Files**: `app/routes/api.admin.products.$id.metadata.ts`

- [ ] **2.5** Create CSV import API route
  - File: `app/routes/api.admin.import.ts`
  - Action: Handle file upload (multipart/form-data)
  - Parse CSV (use library like `papaparse` or `csv-parse`)
  - Validate CSV columns: productId, shape, carat, cut, color, clarity, certificate, etc.
  - For each row, create/update StoneMetadata
  - Collect errors, return summary: `{ imported: 45, errors: 5, errorDetails: [...] }`
  - **Test**: Upload test CSV with 10 stones, verify import summary and database
  - **Files**: `app/routes/api.admin.import.ts`

- [ ] **2.6** Create CSV export API route
  - File: `app/routes/api.admin.export.ts`
  - Loader: Fetch all SettingMetadata or StoneMetadata for shop
  - Convert to CSV format with headers
  - Set response headers: `Content-Type: text/csv`, `Content-Disposition: attachment`
  - Return CSV string
  - **Test**: `curl http://localhost:3000/api/admin/export?type=stones > export.csv`, verify CSV format
  - **Files**: `app/routes/api.admin.export.ts`

- [ ] **2.7** Create products listing page
  - File: `app/routes/app.builder.products.tsx`
  - Loader: Fetch products from API
  - Display in grid using `<s-card>` components
  - Show product image, title, price, SKU
  - Add badge: "Setting" or "Stone" if marked
  - Add "Mark as Setting" / "Mark as Stone" buttons
  - Include search input (filter by title client-side for MVP)
  - **Test**: Navigate to `/app/builder/products`, verify grid renders
  - **Files**: `app/routes/app.builder.products.tsx`

- [ ] **2.8** Create ProductCard component
  - Display: image (with fallback), title, price, SKU
  - Show badge if marked as Setting/Stone
  - Action buttons: "Mark as Setting", "Mark as Stone", "Edit"
  - Click handler navigates to edit page
  - Use Polaris styling (`<s-card>`, `<s-badge>`, `<s-button>`)
  - **Test**: Render in products page, verify all data displays correctly
  - **Files**: `app/components/admin/ProductCard.tsx`

- [ ] **2.9** Create product edit page
  - File: `app/routes/app.builder.products.$id.tsx`
  - Loader: Fetch product and metadata
  - Display product details (image, title, description)
  - Show SettingMetadataForm if marked as Setting
  - Show StoneMetadataForm if marked as Stone
  - Show "Mark as Setting/Stone" buttons if not marked
  - **Test**: Navigate to `/app/builder/products/gid:123`, verify form renders
  - **Files**: `app/routes/app.builder.products.$id.tsx`

- [ ] **2.10** Create SettingMetadataForm component
  - Form fields using Polaris components (`<s-select>`, `<s-text-field>`, `<s-checkbox>`)
  - Style dropdown (from SETTING_STYLES constant)
  - Setting Height dropdown (Low, Medium, High)
  - Compatible Shapes multi-select checkboxes
  - Base prices for 4 metal types (currency inputs)
  - Featured toggle
  - Submit button, cancel button
  - Form validation before submit
  - **Test**: Fill form, submit, verify API call with correct data
  - **Files**: `app/components/admin/SettingMetadataForm.tsx`

- [ ] **2.11** Create StoneMetadataForm component
  - Form fields using Polaris components
  - Stone Type dropdown (Diamond, Sapphire, Ruby, etc.)
  - Shape dropdown (from STONE_SHAPES constant)
  - Carat input (number, decimal)
  - Cut, Color, Clarity dropdowns (from constants)
  - Certificate Type dropdown, Certificate Number input, Certificate URL input
  - Measurements input (text, format hint)
  - Optional fields: Table %, Depth %, Polish, Symmetry, Fluorescence
  - Form validation
  - **Test**: Fill form with all fields, submit, verify data saved correctly
  - **Files**: `app/components/admin/StoneMetadataForm.tsx`

- [ ] **2.12** Create CSV importer component
  - File upload input with drag-and-drop area
  - "Download Template" link (generates sample CSV)
  - "Import" button triggers upload
  - Loading spinner during import
  - Display results: "45 stones imported, 5 errors"
  - Show error details in expandable section
  - **Test**: Upload valid CSV, verify success message; upload invalid CSV, verify errors shown
  - **Files**: `app/components/admin/CSVImporter.tsx`

- [ ] **2.13** Add CSV import/export to products page
  - Add "Import CSV" button that opens modal with CSVImporter
  - Add "Export CSV" button that downloads file
  - Use `<s-modal>` for import interface
  - **Test**: Click import, upload CSV, verify import; click export, verify download
  - **Files**: `app/routes/app.builder.products.tsx` (update)

- [ ] **2.14** ✅ VALIDATE TASK 2.0 COMPLETION
  - **Reference**: `tasks/validate-task-completion.md` - Phase 2 validation
  - Run: `curl "$BASE_URL/api/admin/products" -H "Authorization: Bearer $TOKEN"`
  - Test: Complete admin workflow (view products → mark → edit metadata → save)
  - Test: Import sample CSV, verify success
  - Test: Export to CSV, verify format correct
  - Verify: All 13 sub-tasks (2.1-2.13) completed and tested
  - Verify: All acceptance criteria below met
  - **STOP**: Do not proceed to Task 3.0 until all checks pass ✅

**Acceptance Criteria for Task 2.0**:

- ✅ Merchant can view all Shopify products in admin
- ✅ Merchant can mark product as Setting or Stone
- ✅ Merchant can fill and save setting metadata
- ✅ Merchant can fill and save stone metadata
- ✅ Merchant can bulk import stones via CSV
- ✅ Merchant can export settings/stones to CSV
- ✅ All forms have validation and error handling
- ✅ All API endpoints return proper error messages

---

## 3.0 Admin Settings & Configuration

**Goal**: Provide merchant configuration interface for builder settings.

**Testing**: Merchant can enable/disable builder, set markup, configure side stones.

- [ ] **3.1** Create settings API route
  - File: `app/routes/api.admin.settings.ts`
  - Loader (GET): Fetch AppSettings for current shop, create defaults if not exist
  - Action (PUT): Parse form data, validate fields, upsert AppSettings
  - Validate: markup >= 0, side stones fees >= 0
  - Return updated settings or validation errors
  - **Test**: GET `/api/admin/settings` returns settings; PUT updates them
  - **Files**: `app/routes/api.admin.settings.ts`

- [ ] **3.2** Create settings page route
  - File: `app/routes/app.builder.settings.tsx`
  - Loader: Fetch settings from API
  - Render SettingsForm component
  - Handle form submission
  - Show success toast on save (use `shopify.toast.show()`)
  - Show error banner if save fails
  - **Test**: Navigate to `/app/builder/settings`, verify form loads with current values
  - **Files**: `app/routes/app.builder.settings.tsx`

- [ ] **3.3** Create SettingsForm component with tabs
  - Use Polaris `<s-tabs>` for 3 sections
  - Tab 1: General Settings
  - Tab 2: Pricing Rules
  - Tab 3: Side Stones Configuration
  - State management for tab switching
  - Single form submission for all tabs
  - **Test**: Switch between tabs, verify content changes
  - **Files**: `app/components/admin/SettingsForm.tsx`

- [ ] **3.4** Implement General Settings tab
  - Enable/Disable Builder toggle (`<s-switch>`)
  - Info text explaining what happens when disabled
  - Display app block URL/instructions (read-only)
  - **Test**: Toggle switch, submit form, verify setting updated
  - **Files**: `app/components/admin/SettingsForm.tsx` (update)

- [ ] **3.5** Implement Pricing Rules tab
  - Markup Percentage input (`<s-text-field type="number">`)
  - Help text: "Applied to total price of setting + stone + side stones"
  - Validation: Must be >= 0, <= 100
  - **Test**: Enter 15, submit, verify markup saved; enter -5, verify validation error
  - **Files**: `app/components/admin/SettingsForm.tsx` (update)

- [ ] **3.6** Implement Side Stones Configuration tab
  - Enable Side Stones toggle
  - Side Stone Quality Options input (comma-separated text)
  - Side Stone Pricing per quality (dynamic inputs based on qualities)
  - Min/Max Quantity inputs
  - Conditionally show/hide fields based on toggle
  - **Test**: Enable side stones, add qualities "Good,Better,Best", set prices, submit
  - **Files**: `app/components/admin/SettingsForm.tsx` (update)

- [ ] **3.7** Add form validation
  - Validate all numeric fields are numbers
  - Validate min < max for side stone quantity
  - Show field-level errors (use Polaris `error` prop)
  - Disable submit button if form has errors
  - **Test**: Submit invalid data, verify errors shown; fix errors, verify submit works
  - **Files**: `app/components/admin/SettingsForm.tsx` (update)

- [ ] **3.8** Add save/cancel buttons
  - Sticky footer with Save and Cancel buttons
  - Disable save if no changes made (track dirty state)
  - Show loading spinner on save button during submit
  - Reset form on cancel
  - **Test**: Make changes, click save, verify loading state and success
  - **Files**: `app/components/admin/SettingsForm.tsx` (update)

- [ ] **3.9** Initialize default settings on app install
  - In `app/routes/app._index.tsx` or afterAuth hook
  - Check if AppSettings exists for shop
  - If not, create with defaults: builderEnabled: true, markupPercent: 0, sideStones: disabled
  - **Test**: Install app on fresh store, verify settings created automatically
  - **Files**: `app/routes/app._index.tsx` or `app/shopify.server.ts`

- [ ] **3.10** ✅ VALIDATE TASK 3.0 COMPLETION
  - **Reference**: `tasks/validate-task-completion.md` - Phase 3 validation
  - Run: `curl "$BASE_URL/api/admin/settings" -H "Authorization: Bearer $TOKEN"`
  - Test: Navigate to settings page, change all settings, save, reload - verify persisted
  - Test: Enable side stones, configure, save - verify works
  - Verify: All 9 sub-tasks (3.1-3.9) completed and tested
  - Verify: All acceptance criteria below met
  - **STOP**: Do not proceed to Task 4.0 until all checks pass ✅

**Acceptance Criteria for Task 3.0**:

- ✅ Merchant can enable/disable builder
- ✅ Merchant can set markup percentage
- ✅ Merchant can configure side stones (enable, qualities, pricing)
- ✅ All validation works correctly
- ✅ Form shows loading/success/error states
- ✅ Settings persist across page reloads

---

## 4.0 Storefront Builder Core (Steps 1 & 2)

**Goal**: Build customer-facing builder with setting and stone selection.

**Testing**: Customer can browse settings, filter stones, see price updates.

- [ ] **4.1** Create settings API endpoint
  - File: `app/routes/api.builder.settings.ts`
  - Loader (public, no auth): Parse query params (style, metalType, priceMin, priceMax, page)
  - Fetch SettingMetadata from database with filters
  - Join with Shopify product data
  - Paginate (24 per page)
  - Return JSON: `{ settings: [], filters: { styles: [], metals: [], priceRange: {} }, pagination: {} }`
  - **Test**: `curl "http://localhost:3000/api/builder/settings?style=solitaire"` returns filtered results
  - **Files**: `app/routes/api.builder.settings.ts`

- [ ] **4.2** Create stones API endpoint
  - File: `app/routes/api.builder.stones.ts`
  - Loader (public): Parse query params (shape, caratMin, caratMax, cut, color, clarity, priceMin, priceMax, certification, page)
  - Fetch StoneMetadata with complex filters (compatible with selected setting's shapes)
  - Paginate (50 per page)
  - Support sorting (price, carat, cut, color, clarity)
  - Return JSON with stones array and pagination
  - **Test**: `curl "http://localhost:3000/api/builder/stones?shape=round&caratMin=1&caratMax=2"` returns filtered stones
  - **Files**: `app/routes/api.builder.stones.ts`

- [ ] **4.3** Create BuilderProvider context
  - State: currentStep, selectedSetting, selectedStone, metalType, ringSize, sideStones, totalPrice
  - Actions: selectSetting, selectStone, updateMetalType, updateRingSize, goToStep, calculatePrice
  - Persist state to localStorage (for guest users)
  - Load state from localStorage on mount
  - **Test**: Render provider, call actions, verify state updates
  - **Files**: `app/components/builder/BuilderProvider.tsx`

- [ ] **4.4** Create BuilderApp root component
  - Wrap with BuilderProvider
  - Render StepNavigation component
  - Render current step component based on state
  - Render PriceSummary (sticky)
  - Handle loading and error states
  - **Test**: Render BuilderApp, verify step 1 shows by default
  - **Files**: `app/components/builder/BuilderApp.tsx`

- [ ] **4.5** Create StepNavigation component
  - Display 4 steps with numbers and labels
  - Show completed steps with checkmark icon
  - Highlight current step with accent color
  - Make completed steps clickable (navigate back)
  - Responsive: horizontal on desktop, vertical/compact on mobile
  - **Test**: Render with currentStep=2, verify step 1 completed, step 2 active, step 3-4 pending
  - **Files**: `app/components/builder/StepNavigation.tsx`

- [ ] **4.6** Create PriceSummary component
  - Display running total prominently
  - Show price breakdown (expandable/collapsible)
  - Items: Setting price, Stone price, Side stones (if applicable), Markup, Total
  - Use currency formatter from utils
  - Sticky positioning (always visible)
  - **Test**: Render with sample prices, verify formatting and layout
  - **Files**: `app/components/builder/PriceSummary.tsx`

- [ ] **4.7** Create SettingSelector (Step 1)
  - Fetch settings from API on mount
  - Display FilterSidebar and SettingGrid side-by-side (desktop)
  - Display FilterDrawer and SettingGrid stacked (mobile)
  - Handle loading state (skeleton loader)
  - Handle empty state ("No settings found")
  - **Test**: Render step 1, verify settings load and display
  - **Files**: `app/components/builder/steps/SettingSelector.tsx`

- [ ] **4.8** Create FilterSidebar component
  - Filter groups: Style, Metal Type, Price Range
  - Use FilterGroup component for each
  - Use RangeSlider for price
  - Apply filters on change (debounced 300ms)
  - Show "Clear All" button
  - Sticky positioning on desktop
  - **Test**: Select filters, verify settings update
  - **Files**: `app/components/builder/FilterSidebar.tsx`

- [ ] **4.9** Create FilterGroup component
  - Accept: title, options, selected, onChange, multiSelect
  - Render checkboxes or radio buttons
  - Collapsible with expand/collapse icon
  - **Test**: Render with sample options, verify selection works
  - **Files**: `app/components/shared/FilterGroup.tsx`

- [ ] **4.10** Create RangeSlider component
  - Use HTML range input (double slider for min/max)
  - Display min and max labels
  - Show current values
  - Call onChange on drag end
  - **Test**: Render, drag sliders, verify onChange called with correct values
  - **Files**: `app/components/shared/RangeSlider.tsx`

- [ ] **4.11** Create SettingCard component
  - Display: image (Shopify product image), name, starting price
  - "View Details" button (opens modal)
  - "Select" button (selects setting and metal type)
  - Hover effect
  - **Test**: Render card, click view details, verify modal opens
  - **Files**: `app/components/builder/SettingCard.tsx`

- [ ] **4.12** Create SettingModal component
  - Display: large images in carousel, description, SKU
  - Available metal types with prices (radio buttons)
  - Compatible stone shapes (read-only list)
  - "Select" button (closes modal and selects setting)
  - Close button and backdrop click
  - **Test**: Open modal, select metal type, click select, verify setting selected
  - **Files**: `app/components/builder/Modal.tsx` (if reusable) or within SettingCard

- [ ] **4.13** Create StoneSelector (Step 2)
  - Fetch stones from API (filtered by compatible shapes)
  - Display StoneFilters and StoneTable (desktop) or StoneCardList (mobile)
  - Handle loading, empty states
  - Pagination controls
  - **Test**: Navigate to step 2, verify stones load
  - **Files**: `app/components/builder/steps/StoneSelector.tsx`

- [ ] **4.14** Create StoneFilters component
  - Advanced filters: Shape, Carat, Cut, Color, Clarity, Price, Certification
  - Multi-select dropdowns for grades
  - Range sliders for carat and price
  - Apply filters on change (debounced)
  - Show active filter count badge
  - "Clear All" button
  - **Test**: Select multiple filters, verify stones update correctly
  - **Files**: `app/components/builder/StoneFilters.tsx`

- [ ] **4.15** Create StoneTable component (desktop)
  - Table columns: Image, Shape, Carat, Cut, Color, Clarity, Price, Certificate, Actions
  - Sortable columns (click header to sort)
  - "Details" button (opens modal)
  - "Select" button (selects stone)
  - Highlight row on hover
  - Responsive: hide on mobile
  - **Test**: Render table, sort by price, verify order changes
  - **Files**: `app/components/builder/StoneTable.tsx`

- [ ] **4.16** Create StoneCardList component (mobile)
  - Display stones as cards (1 column)
  - Show: image, carat, shape, price, 4Cs summary
  - "Details" and "Select" buttons
  - Infinite scroll or "Load More" button
  - Responsive: show only on mobile
  - **Test**: Resize to mobile, verify cards display correctly
  - **Files**: `app/components/builder/StoneCardList.tsx`

- [ ] **4.17** Create StoneModal component
  - Display: high-res image, certificate info with link
  - Detailed specs table (measurements, table%, depth%, polish, symmetry, fluorescence)
  - Price
  - "Select" button
  - **Test**: Open modal, verify all data displays, click certificate link
  - **Files**: `app/components/builder/Modal.tsx` (reuse) or separate

- [ ] **4.18** Implement real-time price calculation
  - When setting selected: add setting price to total
  - When stone selected: add stone price to total
  - When metal type changed: recalculate setting price
  - Update PriceSummary component in real-time
  - Use pricing service for calculations
  - **Test**: Select setting, verify price updates; select stone, verify price increases
  - **Files**: `app/components/builder/BuilderProvider.tsx` (update)

- [ ] **4.19** Add navigation logic
  - After setting selected: auto-advance to Step 2
  - After stone selected: auto-advance to Step 3
  - "Back" buttons on each step
  - Validate selections before advancing
  - **Test**: Complete step 1, verify step 2 loads; click back, verify step 1 restores
  - **Files**: `app/components/builder/BuilderProvider.tsx` (update)

- [ ] **4.20** ✅ VALIDATE TASK 4.0 COMPLETION
  - **Reference**: `tasks/validate-task-completion.md` - Phase 4 validation
  - Run: `curl "$BASE_URL/api/builder/settings"`
  - Run: `curl "$BASE_URL/api/builder/stones?shape=round&caratMin=1&caratMax=2"`
  - Test: Open builder in browser, complete Steps 1 and 2 fully
  - Test: Apply filters, verify results update
  - Test: Select setting and stone, verify price updates
  - Test: Resize to mobile, verify responsive design works
  - Verify: All 19 sub-tasks (4.1-4.19) completed and tested
  - Verify: All acceptance criteria below met
  - **STOP**: Do not proceed to Task 5.0 until all checks pass ✅

**Acceptance Criteria for Task 4.0**:

- ✅ Customer can view and filter settings by style, metal, price
- ✅ Customer can view setting details in modal
- ✅ Customer can select a setting and metal type
- ✅ Customer can view and filter stones by shape, carat, 4Cs, price
- ✅ Customer can sort stones by various fields
- ✅ Customer can view stone details with certificate
- ✅ Customer can select a stone
- ✅ Price updates in real-time as selections are made
- ✅ Works on both desktop and mobile (responsive)
- ✅ Pagination works for large datasets

---

## 5.0 Storefront Builder Completion (Steps 3 & 4)

**Goal**: Complete builder with customization and review steps.

**Testing**: Customer can customize ring, review configuration, see final price.

- [ ] **5.1** Create Customization (Step 3)
  - Display RingSizeSelector component
  - Conditionally display SideStonesSelector (if enabled in settings)
  - Show price updates in real-time
  - "Back" and "Continue to Review" buttons
  - Validate ring size selected before advancing
  - **Test**: Navigate to step 3, select ring size, verify validation
  - **Files**: `app/components/builder/steps/Customization.tsx`

- [ ] **5.2** Create RingSizeSelector component
  - Display ring sizes as buttons (3, 3.5, 4, ..., 12)
  - Highlight selected size
  - "Ring Size Guide" link (opens modal with sizing chart)
  - Help text: "Don't know your size?"
  - **Test**: Render, select size, verify selection highlighted
  - **Files**: `app/components/builder/RingSizeSelector.tsx`

- [ ] **5.3** Create ring size guide modal
  - Display ring sizing chart (static image or HTML table)
  - Instructions on how to measure
  - Close button
  - **Test**: Click "Ring Size Guide", verify modal opens with chart
  - **Files**: `app/components/builder/RingSizeGuide.tsx`

- [ ] **5.4** Create SideStonesSelector component
  - Conditionally render based on AppSettings
  - Quality selector (dropdown with merchant-defined options)
  - Quantity selector (number input with min/max from settings)
  - Display price per stone and total
  - Update total price in real-time
  - **Test**: Select quality "Premium", quantity 12, verify price calculated correctly
  - **Files**: `app/components/builder/SideStonesSelector.tsx`

- [ ] **5.5** Add customization validation
  - Ring size must be selected
  - If side stones enabled, quality and quantity must be valid
  - Show error messages for invalid selections
  - Disable "Continue" button until valid
  - **Test**: Try to continue without ring size, verify error shown
  - **Files**: `app/components/builder/steps/Customization.tsx` (update)

- [ ] **5.6** Create Review (Step 4)
  - Display complete configuration summary
  - Show RingPreview component
  - Show ConfigurationSummary component
  - Show PriceBreakdown component (detailed)
  - "Edit" buttons for each section
  - "Add to Cart" button (primary action)
  - **Test**: Navigate to step 4, verify all config details display
  - **Files**: `app/components/builder/steps/Review.tsx`

- [ ] **5.7** Create RingPreview component
  - Display setting image and stone image side-by-side
  - Clear labels: "Setting" and "Center Stone"
  - Image captions with names
  - Note: No image composition for MVP (simple side-by-side)
  - **Test**: Render with sample images, verify layout
  - **Files**: `app/components/builder/RingPreview.tsx`

- [ ] **5.8** Create ConfigurationSummary component
  - Display as clean list with sections:
    - Setting: Name, SKU, Metal Type, Style, Price
    - Stone: Carat, Shape, Cut, Color, Clarity, Certificate, Price
    - Side Stones: Quality, Quantity, Price (if applicable)
    - Ring Size: Selected size
  - "Edit" button for each section (navigates back to step)
  - **Test**: Render, verify all data displays correctly
  - **Files**: `app/components/builder/ConfigurationSummary.tsx`

- [ ] **5.9** Create detailed PriceBreakdown component
  - Itemized list:
    - Setting: $X
    - Stone: $Y
    - Side Stones: $Z (if applicable)
    - Subtotal: $A
    - Markup (X%): $B
    - Total: $C
  - Expandable/collapsible (collapsed by default)
  - Format prices with currency
  - **Test**: Render with sample prices, verify calculations and formatting
  - **Files**: `app/components/builder/PriceBreakdown.tsx`

- [ ] **5.10** Implement "Edit" functionality
  - Edit Setting button: goToStep(1), preserve state
  - Edit Stone button: goToStep(2), preserve state
  - Edit Customization button: goToStep(3), preserve state
  - Verify state persists when navigating back
  - **Test**: Click edit setting, change selection, return to review, verify changes reflected
  - **Files**: `app/components/builder/steps/Review.tsx` (update)

- [ ] **5.11** Add loading and error states to all steps
  - Show LoadingSpinner component while fetching data
  - Show ErrorMessage component if fetch fails
  - "Retry" button on errors
  - Empty state messages ("No settings found with these filters")
  - **Test**: Disconnect network, verify error message and retry button
  - **Files**: All step components

- [ ] **5.12** Create LoadingSpinner component
  - Animated spinner icon
  - Optional loading text
  - Center aligned
  - **Test**: Render, verify animation works
  - **Files**: `app/components/shared/LoadingSpinner.tsx`

- [ ] **5.13** Create ErrorMessage component
  - Display error icon and message
  - Optional "Retry" button
  - Optional "Go Back" button
  - Styled with error color
  - **Test**: Render with sample error, verify styling
  - **Files**: `app/components/shared/ErrorMessage.tsx`

- [ ] **5.14** Add mobile responsive styles
  - FilterSidebar becomes FilterDrawer (slide-out) on mobile
  - StoneTable becomes StoneCardList on mobile
  - Touch targets minimum 44px
  - Test on various screen sizes: 320px, 768px, 1024px
  - **Test**: Resize browser, verify layout adapts
  - **Files**: `app/components/builder/*.tsx` (add CSS modules)

- [ ] **5.15** Optimize images for builder
  - Lazy load all images (use `loading="lazy"`)
  - Show placeholder while loading
  - Compress images from Shopify (use image transforms)
  - **Test**: Load builder, check network tab, verify lazy loading works
  - **Files**: All components with images

- [ ] **5.16** ✅ VALIDATE TASK 5.0 COMPLETION
  - **Reference**: `tasks/validate-task-completion.md` - Phase 5 validation
  - Test: Complete full builder flow (Steps 1-2-3-4)
  - Test: Select ring size, verify validation works
  - Test: If side stones enabled, select quality and quantity
  - Test: Review step shows all details correctly
  - Test: Edit buttons navigate back and preserve state
  - Test: Price breakdown calculates correctly
  - Test: Resize to mobile, verify all steps responsive
  - Verify: All 15 sub-tasks (5.1-5.15) completed and tested
  - Verify: All acceptance criteria below met
  - **STOP**: Do not proceed to Task 6.0 until all checks pass ✅

**Acceptance Criteria for Task 5.0**:

- ✅ Customer can select ring size
- ✅ Customer can select side stones (if enabled)
- ✅ Customer can view complete configuration in review step
- ✅ Customer can edit any section from review
- ✅ Visual preview shows setting and stone images
- ✅ Price breakdown shows itemized costs
- ✅ All validation works correctly
- ✅ All loading/error states handled gracefully
- ✅ Fully responsive on mobile and desktop

---

## 6.0 Cart Integration & Order Creation

**Goal**: Connect builder to Shopify cart and create orders.

**Testing**: Customer can add to cart, see in Shopify cart with details.

- [ ] **6.1** Create cart API endpoint
  - File: `app/routes/api.builder.cart.ts`
  - Action (POST): Accept configuration data
  - Validate all data on backend (don't trust client)
  - Save configuration to database (Configuration model)
  - Generate unique configuration ID: `CONFIG-${timestamp}-${random}`
  - Calculate final price using pricing service
  - Find variant ID for selected metal type
  - Build line item properties object
  - Call Shopify Ajax Cart API to add item
  - Return success response with cart data
  - **Test**: POST configuration data, verify database record created and Shopify cart updated
  - **Files**: `app/routes/api.builder.cart.ts`

- [ ] **6.2** Implement buildLineItemProperties helper
  - In cart service: `buildLineItemProperties(configuration)`
  - Return object with keys:
    - "Setting": "[Name] - [Metal Type]"
    - "Setting SKU": "[SKU]"
    - "Center Stone": "[Carat]ct [Shape] [Color] [Clarity]"
    - "Stone SKU": "[SKU]"
    - "Stone Certificate": "[Type] [Number]"
    - "Side Stones": "[Quantity] stones, [Quality]" (if applicable)
    - "Ring Size": "[Size]"
    - "Configuration ID": "[ID]"
  - Ensure each value is ≤ 255 characters (Shopify limit)
  - **Test**: Call function with sample config, verify object format
  - **Files**: `app/services/cart.server.ts` (update)

- [ ] **6.3** Implement findVariantId helper
  - Query Shopify product by ID
  - Find variant matching selected metal type
  - Use variant option values to match (e.g., "Metal: 14K White Gold")
  - Return variant GID
  - Handle case where variant not found (error)
  - **Test**: Call with product ID and metal type, verify correct variant returned
  - **Files**: `app/services/cart.server.ts` (update)

- [ ] **6.4** Implement price validation
  - In cart API: recalculate price on backend
  - Compare with client-submitted price
  - If mismatch > $0.01: use backend price, warn user
  - Prevent cart addition if discrepancy is large
  - **Test**: Submit with incorrect price, verify backend recalculates
  - **Files**: `app/routes/api.builder.cart.ts` (update)

- [ ] **6.5** Implement inventory check
  - Before adding to cart, verify products are available
  - Query Shopify for inventory quantity
  - Check both setting variant and stone product
  - Return error if out of stock: "Sorry, this item is no longer available"
  - **Test**: Mark product as out of stock, try to add to cart, verify error shown
  - **Files**: `app/routes/api.builder.cart.ts` (update)

- [ ] **6.6** Add "Add to Cart" button handler
  - In Review step: onClick calls cart API
  - Show loading spinner on button during request
  - On success: show success message, redirect to cart
  - On error: show error message with retry option
  - Track analytics event (optional)
  - **Test**: Click add to cart, verify loading state and redirect
  - **Files**: `app/components/builder/steps/Review.tsx` (update)

- [ ] **6.7** Handle Shopify Ajax Cart API integration
  - Use fetch to POST to `/cart/add.js`
  - Request body: `{ items: [{ id: variantId, quantity: 1, properties: {...} }] }`
  - Handle response: success (cart data) or error (out of stock, etc.)
  - **Test**: Make API call, verify item added to Shopify cart
  - **Files**: `app/routes/api.builder.cart.ts` (update)

- [ ] **6.8** Save configuration to database
  - Create Configuration record with all data:
    - shop, customerId (if logged in), customerEmail
    - settingId, stoneId, metalType, ringSize, sideStonesConfig
    - settingPrice, stonePrice, sideStonesPrice, totalPrice
    - status: "completed", cartItemId, createdAt, configurationId
  - Enforce shop filtering (multi-tenant isolation)
  - **Test**: Add to cart, query database, verify configuration saved
  - **Files**: `app/routes/api.builder.cart.ts` (update)

- [ ] **6.9** Implement error handling for cart failures
  - Network errors: "Unable to add to cart. Please check your connection."
  - Out of stock: "Sorry, this item is no longer available."
  - API errors: "Something went wrong. Please try again."
  - Show retry button on all errors
  - Log errors to console for debugging
  - **Test**: Simulate various errors, verify user-friendly messages shown
  - **Files**: `app/routes/api.builder.cart.ts`, `app/components/builder/steps/Review.tsx`

- [ ] **6.10** Add redirect to cart page
  - On successful add: redirect to `/cart`
  - Use `window.location.href = '/cart'` or Shopify App Bridge redirect
  - Show brief success message before redirect (1-2 seconds)
  - **Test**: Add to cart, verify redirect to cart page with item visible
  - **Files**: `app/components/builder/steps/Review.tsx` (update)

- [ ] **6.11** Test complete flow end-to-end
  - Start builder → select setting → select stone → customize → review → add to cart
  - Verify all data persists through flow
  - Verify final price is correct
  - Verify cart item has all properties
  - Verify configuration saved to database
  - **Test**: Manual E2E test through entire flow
  - **Files**: N/A (testing)

- [ ] **6.12** ✅ VALIDATE TASK 6.0 COMPLETION
  - **Reference**: `tasks/validate-task-completion.md` - Phase 6 validation
  - Run: `curl -X POST "$BASE_URL/api/builder/cart" -d '{...full config...}'`
  - Test: Complete full E2E flow, add to cart successfully
  - Test: Open /cart in browser, verify item with all line item properties
  - Run: `npx prisma studio` - verify Configuration record saved
  - Test: Price validation - submit wrong price, verify backend recalculates
  - Test: Inventory check - out of stock product shows error
  - Verify: All 11 sub-tasks (6.1-6.11) completed and tested
  - Verify: All acceptance criteria below met
  - **STOP**: Do not proceed to Task 7.0 until all checks pass ✅

**Acceptance Criteria for Task 6.0**:

- ✅ Customer can add configured ring to Shopify cart
- ✅ Configuration saved to database with all details
- ✅ Line item properties include all configuration info
- ✅ Price is validated on backend (security)
- ✅ Inventory is checked before cart addition
- ✅ All errors handled gracefully with user-friendly messages
- ✅ Successful cart addition redirects to cart page
- ✅ Configuration ID is generated and stored

---

## 7.0 Webhooks & Product Sync

**Goal**: Keep product data synchronized with Shopify.

**Testing**: Update product in Shopify, verify builder data updates.

- [ ] **7.1** Register webhooks in shopify.app.toml
  - Add webhook subscriptions:

    ```toml
    [[webhooks.subscriptions]]
    topics = ["products/update"]
    uri = "/webhooks/products/update"

    [[webhooks.subscriptions]]
    topics = ["products/delete"]
    uri = "/webhooks/products/delete"
    ```

  - Redeploy app: `npm run deploy`
  - **Test**: Run `npm run dev`, check logs for webhook registration confirmation
  - **Files**: `shopify.app.toml`

- [ ] **7.2** Create products/update webhook handler
  - File: `app/routes/webhooks.products.update.tsx`
  - Action: Verify HMAC signature
  - Parse webhook payload (product data)
  - Check if product has builder metafields (namespace: "builder")
  - If yes: update corresponding SettingMetadata or StoneMetadata
  - If no: ignore webhook
  - Return 200 OK (fast response, < 5 seconds)
  - Handle errors gracefully (log but still return 200)
  - **Test**: Update product in Shopify, verify webhook received and data updated
  - **Files**: `app/routes/webhooks.products.update.tsx`

- [ ] **7.3** Create products/delete webhook handler
  - File: `app/routes/webhooks.products.delete.tsx`
  - Action: Verify HMAC signature
  - Parse webhook payload (product ID)
  - Find SettingMetadata or StoneMetadata by productId
  - Mark as deleted or remove from database
  - Return 200 OK
  - **Test**: Delete product in Shopify, verify metadata removed from database
  - **Files**: `app/routes/webhooks.products.delete.tsx`

- [ ] **7.4** Implement HMAC signature verification
  - Create utility: `verifyWebhookHmac(body, hmacHeader, secret)`
  - Use crypto module to compute HMAC-SHA256
  - Compare with header value
  - Return true/false
  - Reject webhook if signature invalid (return 401)
  - **Test**: Call function with valid/invalid signatures, verify behavior
  - **Files**: `app/utils/webhook-helpers.ts`

- [ ] **7.5** Implement webhook idempotency
  - Check if webhook already processed (use webhook ID or timestamp)
  - Store processed webhook IDs in database (optional) or use timestamps
  - If already processed: return 200 immediately
  - Prevents duplicate processing on retries
  - **Test**: Send same webhook twice, verify only processed once
  - **Files**: `app/routes/webhooks.products.update.tsx` (update)

- [ ] **7.6** Add webhook error logging
  - Log all webhook receipts with timestamp and shop
  - Log any errors during processing
  - Don't expose internal errors in response (security)
  - Always return 200 to prevent retries (unless need retry)
  - **Test**: Trigger webhook, check server logs for entries
  - **Files**: All webhook handlers

- [ ] **7.7** Handle product updates for builder products
  - If product marked as Setting: update SettingMetadata (prices, images, etc.)
  - If product marked as Stone: update StoneMetadata (price, availability, etc.)
  - Update relevant fields only (don't overwrite metadata)
  - **Test**: Update product price in Shopify, verify price updated in app database
  - **Files**: `app/routes/webhooks.products.update.tsx` (update)

- [ ] **7.8** Test webhook handlers locally
  - Use Shopify CLI: `shopify webhook trigger --topic products/update`
  - Verify webhook received and processed
  - Check database for updates
  - Check logs for any errors
  - **Test**: Run trigger command, verify handler executes
  - **Files**: N/A (testing)

- [ ] **7.9** ✅ VALIDATE TASK 7.0 COMPLETION
  - **Reference**: `tasks/validate-task-completion.md` - Phase 7 validation
  - Run: `shopify webhook trigger --topic products/update`
  - Run: `shopify webhook trigger --topic products/delete`
  - Verify: Webhooks appear in logs
  - Verify: Database updates after webhooks (check Prisma Studio)
  - Test: Send webhook with invalid HMAC, verify rejection (401)
  - Test: Send same webhook twice, verify idempotency
  - Verify: All 8 sub-tasks (7.1-7.8) completed and tested
  - Verify: All acceptance criteria below met
  - **STOP**: Do not proceed to Task 8.0 until all checks pass ✅

**Acceptance Criteria for Task 7.0**:

- ✅ Webhooks registered in shopify.app.toml
- ✅ products/update webhook updates metadata
- ✅ products/delete webhook removes metadata
- ✅ HMAC signatures verified for security
- ✅ Webhooks are idempotent (safe to retry)
- ✅ All errors logged but don't fail webhook
- ✅ Product changes in Shopify reflect in builder immediately

---

## 8.0 Testing, Polish & Documentation

**Goal**: Comprehensive testing, bug fixes, and launch preparation.

**Testing**: All features work on mobile/desktop, no critical bugs.

- [ ] **8.1** Cross-browser testing
  - Test on Chrome (latest)
  - Test on Firefox (latest)
  - Test on Safari (latest)
  - Test on Edge (latest)
  - Document any browser-specific issues
  - Fix critical browser compatibility issues
  - **Test**: Complete full builder flow on each browser
  - **Files**: N/A (testing)

- [ ] **8.2** Mobile device testing
  - Test on iOS Safari (iPhone)
  - Test on Android Chrome
  - Test on various screen sizes (320px, 375px, 414px)
  - Verify touch targets are ≥ 44px
  - Verify all features work on mobile
  - **Test**: Complete full flow on real mobile devices
  - **Files**: N/A (testing)

- [ ] **8.3** Performance optimization - Database
  - Add indexes to frequently queried fields
  - Verify queries use indexes (EXPLAIN QUERY PLAN in SQLite)
  - Optimize complex stone filter queries
  - Add pagination where missing
  - **Test**: Query 1000 stones with filters, verify response < 500ms
  - **Files**: `prisma/schema.prisma` (verify indexes)

- [ ] **8.4** Performance optimization - Frontend
  - Implement lazy loading for images
  - Debounce filter changes (300ms)
  - Minimize re-renders (React.memo where appropriate)
  - Code splitting for builder components
  - **Test**: Use Lighthouse, aim for 90+ performance score
  - **Files**: Various component files

- [ ] **8.5** Performance optimization - API
  - Implement caching for product data (React Context)
  - Minimize Shopify API calls
  - Batch requests where possible
  - Handle rate limits gracefully
  - **Test**: Monitor API response times, aim for < 500ms average
  - **Files**: Service files

- [ ] **8.6** Security audit
  - Verify all queries filter by shop (multi-tenant isolation)
  - Verify all inputs validated on backend
  - Verify webhook HMAC verification works
  - Check for SQL injection vulnerabilities (Prisma protects)
  - Check for XSS vulnerabilities (React escapes by default)
  - **Test**: Try to access other shop's data, verify blocked
  - **Files**: All service and route files

- [ ] **8.7** Create API testing document
  - Document all API endpoints with curl examples
  - Include authentication headers
  - Include sample request/response bodies
  - Include error scenarios
  - **Test**: Run all curl commands, verify they work
  - **Files**: `docs/API_TESTING.md`

- [ ] **8.8** Create feature testing checklist
  - List all features with step-by-step testing instructions
  - Include expected results for each step
  - Include edge cases to test
  - Cover both happy path and error scenarios
  - **Files**: `docs/TESTING_CHECKLIST.md`

- [ ] **8.9** Create merchant setup guide
  - Step-by-step onboarding instructions
  - How to install app
  - How to mark products as settings/stones
  - How to add metadata
  - How to import stones via CSV
  - How to configure settings
  - How to add builder to storefront (theme extension)
  - Include screenshots
  - **Files**: `docs/MERCHANT_SETUP.md`

- [ ] **8.10** Test CSV import with real data
  - Create sample CSV with 50 stones
  - Include various data scenarios (missing fields, invalid data)
  - Test import, verify success/error handling
  - Test export, verify CSV format correct
  - **Test**: Import sample CSV, verify 50 stones in database
  - **Files**: `tests/sample-stones.csv` (test data)

- [ ] **8.11** Test complete flow with 3 beta merchants
  - Set up 3 test stores
  - Have each store set up products and metadata
  - Have test customers complete configurations
  - Collect feedback on UX issues
  - Fix high-priority bugs
  - **Test**: Each merchant creates 10+ configurations successfully
  - **Files**: N/A (beta testing)

- [ ] **8.12** Bug fixes and polish
  - Fix all critical bugs found during testing
  - Fix high-priority bugs
  - Polish UI (spacing, alignment, colors)
  - Add loading states where missing
  - Improve error messages
  - **Test**: Regression test all features after fixes
  - **Files**: Various (based on bugs found)

- [ ] **8.13** Verify all Non-Goals are excluded
  - Review PRD Non-Goals section (NG-1 through NG-13)
  - Confirm none of these features were added
  - Remove any scope creep that crept in
  - Document features deferred to post-MVP
  - **Test**: Review all implemented features against Non-Goals list
  - **Files**: N/A (verification)

- [ ] **8.14** Create build and deploy validation
  - Test production build: `npm run build`
  - Verify no build errors
  - Test production server locally
  - Document deployment steps
  - **Test**: Run `npm run build && npm run start`, verify app works
  - **Files**: `docs/DEPLOYMENT.md`

- [ ] **8.15** Final acceptance testing
  - Verify all FR-1 through FR-12 are implemented
  - Complete full checklist from PRD Acceptance Criteria
  - Verify launch criteria met (50+ configs, 3+ merchants)
  - Sign off on MVP completion
  - **Test**: Complete all items in PRD Acceptance Criteria section
  - **Files**: N/A (final testing)

- [ ] **8.16** ✅ VALIDATE TASK 8.0 COMPLETION (FINAL MVP VALIDATION)
  - **Reference**: `tasks/validate-task-completion.md` - Phase 8 validation
  - Run: `npm run build && npm run typecheck && npm run lint`
  - Run: Complete `docs/TESTING_CHECKLIST.md` (all 150+ checks)
  - Run: All curl commands in `docs/API_TESTING.md`
  - Test: 3+ beta merchants complete full setup and testing
  - Test: 50+ configurations created across all beta merchants
  - Test: Cross-browser (Chrome, Firefox, Safari, Edge)
  - Test: Mobile devices (iOS Safari, Android Chrome)
  - Test: Performance (Lighthouse score > 80)
  - Test: Security audit (multi-tenant isolation, HMAC, validation)
  - Verify: All 15 sub-tasks (8.1-8.15) completed
  - Verify: All acceptance criteria below met
  - Verify: All PRD Non-Goals (NG-1 to NG-13) are NOT implemented
  - **LAUNCH DECISION**: Only proceed to production if ALL checks pass ✅

**Acceptance Criteria for Task 8.0**:

- ✅ All features tested on Chrome, Firefox, Safari, Edge
- ✅ All features work on iOS and Android mobile
- ✅ Performance targets met (< 3s load, < 500ms API)
- ✅ Security audit completed with no critical issues
- ✅ All documentation complete (API, testing, merchant guide)
- ✅ 3+ beta merchants tested successfully
- ✅ 50+ configurations created across beta merchants
- ✅ All critical and high-priority bugs fixed
- ✅ Build succeeds with no errors
- ✅ All PRD requirements verified complete

---

## Post-Implementation: Testing Prompts

After all tasks are complete, use these commands and checklists to validate the MVP:

### Build Validation

```bash
# Verify TypeScript compiles
npm run typecheck

# Verify build succeeds
npm run build

# Run linter
npm run lint

# Generate Prisma client
npx prisma generate

# Check database migrations
npx prisma migrate status
```

### API Testing (see `docs/API_TESTING.md` for full list)

```bash
# Get settings
curl "http://localhost:3000/api/builder/settings?style=solitaire"

# Get stones
curl "http://localhost:3000/api/builder/stones?shape=round&caratMin=1&caratMax=2"

# Add to cart (requires full config data)
curl -X POST -H "Content-Type: application/json" \
  -d '{"settingId":"...","stoneId":"...","metalType":"14k_white_gold","ringSize":"7"}' \
  http://localhost:3000/api/builder/cart
```

### Feature Testing Checklist (see `docs/TESTING_CHECKLIST.md`)

- [ ] Admin can log in and view dashboard
- [ ] Admin can view products list
- [ ] Admin can mark product as Setting
- [ ] Admin can mark product as Stone
- [ ] Admin can fill and save setting metadata
- [ ] Admin can fill and save stone metadata
- [ ] Admin can import stones via CSV
- [ ] Admin can export stones to CSV
- [ ] Admin can configure builder settings
- [ ] Customer can access builder
- [ ] Customer can view and filter settings
- [ ] Customer can select a setting
- [ ] Customer can view and filter stones
- [ ] Customer can select a stone
- [ ] Customer can select ring size
- [ ] Customer can select side stones (if enabled)
- [ ] Customer can review configuration
- [ ] Customer can add to cart
- [ ] Configuration appears in Shopify cart with correct details
- [ ] Price calculation is accurate
- [ ] Works on mobile (iOS/Android)
- [ ] Works on desktop (Chrome/Firefox/Safari)

### Performance Testing

```bash
# Run Lighthouse audit (install lighthouse CLI)
lighthouse http://localhost:3000 --view

# Check bundle size
npm run build
ls -lh build/

# Monitor API response times (use browser DevTools Network tab)
```

### Security Testing

```bash
# Verify multi-tenant isolation
# 1. Create config for shop A
# 2. Try to access it from shop B session
# 3. Should fail/return empty

# Verify input validation
# Try to submit invalid data to APIs
# Should return validation errors

# Verify webhook HMAC
# Send webhook with invalid HMAC
# Should reject with 401
```

---

## Summary

**Total Tasks**: 8 parent tasks, 93 sub-tasks (85 implementation + 8 validation checkpoints)

**Timeline**: 12 weeks (2-3 developers)

**Key Milestones**:

- Week 2: Database and services complete
- Week 4: Admin interface complete
- Week 5: Settings interface complete
- Week 7: Builder steps 1-2 complete
- Week 9: Builder steps 3-4 complete
- Week 10: Cart integration and webhooks complete
- Week 12: Testing complete, ready for launch

**Success Criteria**:

- All FR-1 through FR-12 implemented
- 50+ configurations created
- 3+ beta merchants tested successfully
- Zero critical bugs
- All documentation complete

---

**Next Step**: Start with Task 1.1 (Update shopify.app.toml)

**Remember**: After each sub-task completion, test the feature to ensure it works before moving to the next task!

---

**End of Task List**
