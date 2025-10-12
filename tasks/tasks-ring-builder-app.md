# Task List: Ring Builder Shopify App
**Based on**: PRD_RING_BUILDER_APP.md  
**Generated**: 2025-10-04  
**Status**: Ready for Implementation

---

## Overview

This task list provides a comprehensive, step-by-step guide to building the Ring Builder Shopify App. Each task is broken down into actionable sub-tasks that a junior developer can follow. The tasks are organized in logical phases that build upon each other.

**Estimated Timeline**: 12-14 weeks  
**Team Size**: 2-3 developers  
**Prerequisites**: 
- Node.js 20.10+
- Shopify Partner account
- Test Shopify store
- PostgreSQL for production (SQLite for dev)

---

## Relevant Files

### Database & Models
- `prisma/schema.prisma` - Extend with all builder-specific models (Configuration, SettingMetadata, StoneMetadata, AppSettings, AnalyticsEvent)
- `app/db.server.ts` - Database client (already exists)

### Core Backend Services
- `app/services/product.server.ts` - Service for fetching and managing products from Shopify
- `app/services/pricing.server.ts` - Pricing calculation logic
- `app/services/configuration.server.ts` - Configuration management
- `app/services/order.server.ts` - Order creation and management
- `app/services/analytics.server.ts` - Analytics tracking and reporting
- `app/services/email.server.ts` - Email notification service
- `app/services/image.server.ts` - Image composition and optimization

### API Routes (Backend)
- `app/routes/api.builder.settings.ts` - GET settings with filters
- `app/routes/api.builder.stones.ts` - GET stones with filters
- `app/routes/api.builder.configure.ts` - POST/GET configuration
- `app/routes/api.builder.configuration.$id.ts` - GET specific configuration
- `app/routes/api.builder.cart.ts` - POST add to cart
- `app/routes/api.builder.share.ts` - POST generate share link
- `app/routes/api.builder.products.ts` - GET all products for admin
- `app/routes/api.builder.products.$id.metadata.ts` - POST/PUT product metadata
- `app/routes/api.builder.import.ts` - POST CSV import
- `app/routes/api.builder.export.ts` - GET CSV export
- `app/routes/api.builder.analytics.ts` - GET analytics data

### Admin Pages (Backend + Frontend)
- `app/routes/app.builder.tsx` - Layout for all builder admin pages
- `app/routes/app.builder._index.tsx` - Builder dashboard (analytics overview)
- `app/routes/app.builder.products.tsx` - Product management page
- `app/routes/app.builder.products.$id.tsx` - Single product edit page
- `app/routes/app.builder.settings.tsx` - Settings page (tabs: general, pricing, email, appearance)
- `app/routes/app.builder.configurations.tsx` - List all configurations
- `app/routes/app.builder.configurations.$id.tsx` - View single configuration
- `app/routes/app.builder.analytics.tsx` - Detailed analytics page

### Webhooks
- `app/routes/webhooks.products.create.tsx` - Product created webhook
- `app/routes/webhooks.products.update.tsx` - Product updated webhook
- `app/routes/webhooks.products.delete.tsx` - Product deleted webhook
- `app/routes/webhooks.orders.create.tsx` - Order created webhook

### Shared Utilities
- `app/utils/constants.ts` - Constants (shapes, metal types, grades, etc.)
- `app/utils/validators.ts` - Input validation functions
- `app/utils/formatters.ts` - Price, date, text formatting
- `app/utils/filters.ts` - Filter logic for settings/stones
- `app/utils/shopify.ts` - Shopify API helpers (GraphQL queries)

### Theme App Extension (Storefront)
- `extensions/ring-builder/shopify.extension.toml` - Extension configuration
- `extensions/ring-builder/blocks/ring-builder.liquid` - Liquid block template
- `extensions/ring-builder/assets/ring-builder.js` - React app bundle
- `extensions/ring-builder/assets/ring-builder.css` - Styles

### Storefront React App (Source)
- `app/components/builder/BuilderApp.tsx` - Root component for storefront builder
- `app/components/builder/BuilderProvider.tsx` - Context provider for builder state
- `app/components/builder/StepNavigation.tsx` - Step indicator component
- `app/components/builder/PriceSummary.tsx` - Price display component
- `app/components/builder/steps/SettingSelector.tsx` - Step 1: Choose Setting
- `app/components/builder/steps/StoneSelector.tsx` - Step 2: Choose Stone
- `app/components/builder/steps/Customization.tsx` - Step 3: Customize
- `app/components/builder/steps/Review.tsx` - Step 4: Review & Cart
- `app/components/builder/SettingCard.tsx` - Setting display card
- `app/components/builder/SettingModal.tsx` - Setting details modal
- `app/components/builder/StoneTable.tsx` - Stone listing table (desktop)
- `app/components/builder/StoneCardList.tsx` - Stone listing cards (mobile)
- `app/components/builder/StoneModal.tsx` - Stone details modal
- `app/components/builder/FilterSidebar.tsx` - Filters for settings
- `app/components/builder/StoneFilters.tsx` - Filters for stones
- `app/components/builder/RingSizeSelector.tsx` - Ring size selection
- `app/components/builder/EngravingInput.tsx` - Engraving text input
- `app/components/builder/RingPreview.tsx` - Visual preview component

### Admin Components
- `app/components/admin/ProductCard.tsx` - Product card for admin
- `app/components/admin/ProductMarkToggle.tsx` - Toggle for marking as setting/stone
- `app/components/admin/SettingMetadataForm.tsx` - Form for setting metadata
- `app/components/admin/StoneMetadataForm.tsx` - Form for stone metadata
- `app/components/admin/ConfigurationList.tsx` - List of configurations
- `app/components/admin/ConfigurationCard.tsx` - Single configuration card
- `app/components/admin/AnalyticsDashboard.tsx` - Analytics overview
- `app/components/admin/FunnelChart.tsx` - Funnel visualization
- `app/components/admin/PopularItemsChart.tsx` - Popular items chart
- `app/components/admin/SettingsForm.tsx` - App settings form
- `app/components/admin/CSVImporter.tsx` - CSV import interface

### Shared Components
- `app/components/shared/Modal.tsx` - Reusable modal component
- `app/components/shared/Button.tsx` - Reusable button component
- `app/components/shared/Card.tsx` - Reusable card component
- `app/components/shared/FilterGroup.tsx` - Filter group component
- `app/components/shared/RangeSlider.tsx` - Range slider component
- `app/components/shared/LoadingSpinner.tsx` - Loading indicator
- `app/components/shared/EmptyState.tsx` - Empty state component

### Types & Interfaces
- `app/types/builder.ts` - TypeScript interfaces for builder (Configuration, Setting, Stone, etc.)
- `app/types/shopify.ts` - Shopify API response types
- `app/types/api.ts` - API request/response types

### Configuration
- `shopify.app.toml` - Update with required scopes and webhooks
- `package.json` - Add new dependencies
- `.env.example` - Update with new environment variables

### Documentation
- `docs/MERCHANT_GUIDE.md` - Guide for merchants using the app
- `docs/API_DOCUMENTATION.md` - API endpoint documentation
- `docs/DEVELOPMENT.md` - Developer setup guide
- `docs/DEPLOYMENT.md` - Production deployment guide

---

## High-Level Tasks (Parent Tasks)

Below are the main phases of development. Each will be broken down into detailed sub-tasks:

### Phase 1: Foundation & Infrastructure (Week 1-2)
- [ ] **1.0 Database Schema & Infrastructure Setup**
- [ ] **2.0 Core Backend Services & Utilities**

### Phase 2: Admin Dashboard (Week 3-4)
- [ ] **3.0 Admin Product Management**
- [ ] **4.0 Admin Settings & Configuration**

### Phase 3: Storefront Builder - Core (Week 5-7)
- [ ] **5.0 Storefront Builder - Foundation**
- [ ] **6.0 Storefront Builder - Step 1 (Settings Selection)**
- [ ] **7.0 Storefront Builder - Step 2 (Stone Selection)**
- [ ] **8.0 Storefront Builder - Step 3 (Customization)**
- [ ] **9.0 Storefront Builder - Step 4 (Review & Cart)**

### Phase 4: Integration & Features (Week 8-10)
- [ ] **10.0 Order Creation & Cart Integration**
- [ ] **11.0 Save & Share Functionality**
- [ ] **12.0 Admin Analytics Dashboard**
- [ ] **13.0 Webhooks & Product Sync**
- [ ] **14.0 Email Notifications**

### Phase 5: Polish & Launch (Week 11-12)
- [ ] **15.0 Mobile Optimization**
- [ ] **16.0 Theme App Extension**
- [ ] **17.0 Testing & Quality Assurance**
- [ ] **18.0 Documentation & Launch Preparation**

---

## Notes for Developer

### Architecture Overview
- **Backend**: Node.js with React Router, Prisma ORM
- **Frontend Admin**: Polaris Web Components
- **Frontend Storefront**: React with custom components
- **Database**: SQLite (dev), PostgreSQL (prod)
- **Shopify Integration**: GraphQL Admin API, Theme App Extensions

### Development Workflow
1. Start with database schema and migrations
2. Build backend services (testable, independent)
3. Create API routes that use services
4. Build admin UI pages
5. Build storefront components
6. Integrate with Theme App Extension
7. Test end-to-end flows
8. Optimize and deploy

### Code Quality Standards
- TypeScript for type safety
- Unit tests for services and utilities
- Integration tests for API routes
- E2E tests for critical flows
- ESLint + Prettier for code formatting
- Comments for complex logic

### Testing Strategy
- **Unit Tests**: Services, utilities, helpers
- **Integration Tests**: API routes, webhooks
- **Component Tests**: React components
- **E2E Tests**: Complete user flows (Playwright/Cypress)

### Environment Variables Required
```env
SHOPIFY_API_KEY=
SHOPIFY_API_SECRET=
SHOPIFY_APP_URL=
SCOPES=write_products,read_products,write_orders,read_orders
DATABASE_URL=
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASSWORD=
CDN_URL= (optional)
```

---

---

## Detailed Task Breakdown

Below are all 18 parent tasks broken down into actionable sub-tasks. Each sub-task is specific, testable, and can be implemented independently where possible.

---

## 1.0 Database Schema & Infrastructure Setup

**Goal**: Set up the database foundation with all required models and relationships.

- [ ] **1.1** Update `shopify.app.toml` with required OAuth scopes
  - Add `write_products,read_products` for product management
  - Add `write_orders,read_orders` for order creation
  - Add `write_customers,read_customers` for customer data
  - Add `write_draft_orders,read_draft_orders` for quote generation
  - Commit changes to version control

- [ ] **1.2** Extend `prisma/schema.prisma` with Configuration model
  - Add Configuration model with all fields (id, shop, customerId, settingId, stoneId, metalType, ringSize, engraving, prices, status, timestamps)
  - Add indexes on shop, customerId, status, and shareToken
  - Add enum for ConfigurationStatus (in_progress, completed, ordered, abandoned)

- [ ] **1.3** Extend `prisma/schema.prisma` with SettingMetadata model
  - Add SettingMetadata model with fields (id, shop, productId, style, settingHeight, prongType, compatibleShapes, basePrices, images, featured)
  - Add unique constraint on productId
  - Add indexes on shop, style, and featured
  - Add JSON field for basePrices object

- [ ] **1.4** Extend `prisma/schema.prisma` with StoneMetadata model
  - Add StoneMetadata model with fields (id, shop, productId, stoneType, shape, carat, cut, color, clarity, certificate info, measurements, price, available)
  - Add unique constraint on productId
  - Add indexes on shop, stoneType, shape, carat, price, available
  - Add composite index on (cut, color, clarity) for 4Cs filtering

- [ ] **1.5** Extend `prisma/schema.prisma` with AppSettings model
  - Add AppSettings model with fields (id, shop, builderEnabled, stepsEnabled JSON, fees, markupPercent, email notifications, UI customization)
  - Add unique constraint on shop
  - Set default values for all configuration options

- [ ] **1.6** Extend `prisma/schema.prisma` with AnalyticsEvent model
  - Add AnalyticsEvent model with fields (id, shop, configurationId, customerId, eventType, eventData JSON, timestamp)
  - Add indexes on shop, eventType, configurationId
  - Add enum for common event types

- [ ] **1.7** Create database migration
  - Run `npx prisma migrate dev --name add_builder_models`
  - Verify migration creates all tables correctly
  - Test migration rollback capability

- [ ] **1.8** Generate Prisma Client
  - Run `npx prisma generate`
  - Verify TypeScript types are generated
  - Test database connection with a simple query

- [ ] **1.9** Create database seed script (optional, for development)
  - Create `prisma/seed.ts` with sample data
  - Add sample AppSettings for test shop
  - Add script to package.json: `"seed": "tsx prisma/seed.ts"`

- [ ] **1.10** Update `.env.example` with new environment variables
  - Add `DATABASE_URL` example (PostgreSQL for production)
  - Add `SMTP_*` variables for email service
  - Add `CDN_URL` for image hosting (optional)
  - Document all new variables in comments

---

## 2.0 Core Backend Services & Utilities

**Goal**: Build reusable services and utilities that will be used throughout the app.

- [ ] **2.1** Create `app/utils/constants.ts`
  - Define `METAL_TYPES` array: ['14k_white_gold', '14k_yellow_gold', '18k_rose_gold', 'platinum']
  - Define `STONE_SHAPES` array: ['Round', 'Princess', 'Cushion', 'Emerald', 'Oval', 'Pear', 'Marquise', 'Heart', 'Asscher', 'Radiant']
  - Define `CUT_GRADES` array: ['Excellent', 'Very Good', 'Good', 'Fair', 'Poor']
  - Define `COLOR_GRADES` array: ['D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M']
  - Define `CLARITY_GRADES` array: ['FL', 'IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1', 'SI2', 'I1', 'I2', 'I3']
  - Define `SETTING_STYLES` array: ['Solitaire', 'Halo', 'Three-Stone', 'Vintage', 'Modern', 'Pavé', 'Channel', 'Tension']
  - Define `CERTIFICATION_TYPES` array: ['GIA', 'AGS', 'IGI', 'EGL', 'HRD']
  - Define `RING_SIZES` array: ['3', '3.5', '4', ..., '12']
  - Export all as typed constants

- [ ] **2.2** Create `app/utils/validators.ts`
  - Create `validateEngraving(text: string)` - max 25 chars, alphanumeric + spaces
  - Create `validateRingSize(size: string)` - must be in RING_SIZES array
  - Create `validateMetalType(metal: string)` - must be in METAL_TYPES
  - Create `validateEmail(email: string)` - basic email regex
  - Create `validatePrice(price: number)` - must be positive
  - Create `validateCarat(carat: number)` - 0.25 to 10.0 range
  - Add unit tests for all validators

- [ ] **2.3** Create `app/utils/formatters.ts`
  - Create `formatPrice(amount: number, currency: string)` - returns formatted currency string
  - Create `formatCarat(carat: number)` - returns "1.50 ct" format
  - Create `formatDate(date: Date)` - returns "Jan 15, 2025" format
  - Create `formatStoneTitle(stone)` - returns "1.50ct Round G VS1" format
  - Create `truncate(text: string, length: number)` - truncate with ellipsis
  - Add unit tests for all formatters

- [ ] **2.4** Create `app/utils/shopify.ts` - Shopify GraphQL query helpers
  - Create `PRODUCT_QUERY` - GraphQL query string for product with variants and metafields
  - Create `PRODUCTS_QUERY` - GraphQL query for multiple products with pagination
  - Create `CREATE_ORDER_MUTATION` - GraphQL mutation for order creation
  - Create `UPDATE_METAFIELD_MUTATION` - GraphQL mutation for metafield updates
  - Create `parseShopifyGid(gid: string)` - extracts numeric ID from GID
  - Create `buildShopifyGid(type: string, id: string)` - builds GID string
  - Add JSDoc comments for all functions

- [ ] **2.5** Create `app/services/product.server.ts` - Product service
  - Create `getProducts(shop, filters)` - fetch products from Shopify with filters
  - Create `getProduct(shop, productId)` - fetch single product
  - Create `getSettings(shop, filters)` - fetch products marked as settings
  - Create `getStones(shop, filters)` - fetch products marked as stones
  - Create `updateProductMetafields(shop, productId, metafields)` - update metafields
  - Implement caching strategy (store in database after first fetch)
  - Add error handling for Shopify API failures
  - Add unit tests with mocked Shopify API

- [ ] **2.6** Create `app/services/pricing.server.ts` - Pricing calculation service
  - Create `calculateSettingPrice(settingId, metalType, shop)` - get price from metadata
  - Create `calculateStonePrice(stoneId, shop)` - get stone price
  - Create `calculateCustomizationFees(options, shop)` - calculate engraving + gift wrap fees
  - Create `calculateTotalPrice(configuration, shop)` - sum all prices + markup
  - Create `applyMarkup(price, markupPercent)` - apply merchant markup
  - Add unit tests with sample data

- [ ] **2.7** Create `app/services/configuration.server.ts` - Configuration management service
  - Create `createConfiguration(data, shop)` - save new configuration to database
  - Create `getConfiguration(configurationId, shop)` - fetch configuration with shop isolation
  - Create `updateConfiguration(configurationId, data, shop)` - update existing configuration
  - Create `listConfigurations(shop, filters)` - list with pagination and filters
  - Create `generateShareToken()` - generate unique shareable token
  - Create `getConfigurationByShareToken(token)` - fetch by share token
  - Add validation for all inputs
  - Add unit tests

- [ ] **2.8** Create `app/services/analytics.server.ts` - Analytics tracking service
  - Create `trackEvent(shop, eventType, data)` - save analytics event to database
  - Create `getConfigurationFunnel(shop, dateRange)` - calculate step completion rates
  - Create `getPopularSettings(shop, limit)` - top settings by selection count
  - Create `getPopularStones(shop, limit)` - top stones by selection count
  - Create `getConversionMetrics(shop, dateRange)` - calculate conversion rates
  - Create `getAverageOrderValue(shop, dateRange)` - calculate AOV
  - Add unit tests with sample analytics data

- [ ] **2.9** Create `app/types/builder.ts` - TypeScript interfaces
  - Define `Configuration` interface matching Prisma model
  - Define `SettingMetadata` interface
  - Define `StoneMetadata` interface
  - Define `BuilderFilters` interface for settings and stones
  - Define `PriceBreakdown` interface
  - Define `ConfigurationSummary` interface
  - Export all interfaces

- [ ] **2.10** Create `app/types/api.ts` - API request/response types
  - Define `ApiResponse<T>` generic interface
  - Define request types for all API endpoints
  - Define response types for all API endpoints
  - Define error response structure
  - Export all types

---

## 3.0 Admin Product Management

**Goal**: Build admin interface for merchants to manage products as settings or stones.

- [ ] **3.1** Create `app/routes/app.builder.tsx` - Builder admin layout
  - Create layout component with Polaris shell
  - Add navigation menu: Dashboard, Products, Configurations, Settings, Analytics
  - Use `<s-app-nav>` for navigation links
  - Add `<Outlet />` for nested routes
  - Style with consistent spacing and Polaris components

- [ ] **3.2** Create `app/routes/api.builder.products.ts` - API to fetch all products
  - Create loader function that authenticates admin
  - Fetch products from Shopify GraphQL API (paginated, 50 per page)
  - Fetch associated metadata from database (SettingMetadata, StoneMetadata)
  - Merge Shopify product data with metadata
  - Return JSON response with products array
  - Add error handling and logging

- [ ] **3.3** Create `app/routes/app.builder.products.tsx` - Products listing page
  - Create loader to fetch products from API
  - Display products in grid layout using `<s-card>` components
  - Show product image, title, price, SKU
  - Add badge showing "Setting" or "Stone" if marked
  - Add "Mark as Setting" / "Mark as Stone" buttons
  - Add search input to filter by product title
  - Add pagination controls (Next/Previous)
  - Handle loading states with skeleton loaders

- [ ] **3.4** Create `app/components/admin/ProductCard.tsx` - Product card component
  - Accept product prop with type safety
  - Display product thumbnail image (fallback if no image)
  - Display title, price, SKU
  - Show badge if marked as Setting/Stone
  - Add action buttons: "Mark as Setting", "Mark as Stone", "Edit", "View"
  - Add click handler to navigate to edit page
  - Style with Polaris card styling

- [ ] **3.5** Create `app/routes/api.builder.products.$id.mark.ts` - API to mark product
  - Create action function to mark product as Setting or Stone
  - Validate productId and type parameters
  - Create SettingMetadata or StoneMetadata record in database
  - Link to Shopify product via productId (GID)
  - Return success response with metadata
  - Handle duplicate marking (update if exists)

- [ ] **3.6** Create `app/routes/app.builder.products.$id.tsx` - Product edit page
  - Create loader to fetch single product and its metadata
  - Display product details (image, title, description, price, variants)
  - Show conditional form based on product type (Setting vs Stone)
  - If Setting: show SettingMetadataForm component
  - If Stone: show StoneMetadataForm component
  - Add "Save" button that submits form
  - Add "Cancel" button to go back
  - Show success/error toast messages

- [ ] **3.7** Create `app/components/admin/SettingMetadataForm.tsx` - Setting metadata form
  - Create form with Polaris form components
  - Add dropdown for Style (options from SETTING_STYLES constant)
  - Add dropdown for Setting Height (Low, Medium, High)
  - Add dropdown for Prong Type
  - Add multi-select for Compatible Shapes (checkboxes)
  - Add currency inputs for base prices (one for each metal type)
  - Add image URLs field (textarea, one URL per line)
  - Add featured toggle
  - Implement form validation
  - Handle form submission with useSubmit hook

- [ ] **3.8** Create `app/components/admin/StoneMetadataForm.tsx` - Stone metadata form
  - Create form with Polaris form components
  - Add dropdown for Stone Type (Diamond, Sapphire, etc.)
  - Add dropdown for Shape (options from STONE_SHAPES)
  - Add number input for Carat Weight (decimal, 2 places)
  - Add dropdown for Cut Grade (options from CUT_GRADES)
  - Add dropdown for Color Grade (options from COLOR_GRADES)
  - Add dropdown for Clarity Grade (options from CLARITY_GRADES)
  - Add dropdown for Certificate Type
  - Add text input for Certificate Number
  - Add text input for Certificate URL
  - Add text input for Measurements
  - Add optional fields: Table %, Depth %, Polish, Symmetry, Fluorescence
  - Implement form validation
  - Handle form submission

- [ ] **3.9** Create `app/routes/api.builder.products.$id.metadata.ts` - API to save metadata
  - Create action function to update metadata
  - Parse form data and validate all fields
  - Use validators from utils/validators.ts
  - Update SettingMetadata or StoneMetadata in database (upsert)
  - Also update Shopify product metafields via GraphQL
  - Return success/error response
  - Add comprehensive error handling

- [ ] **3.10** Create `app/routes/api.builder.import.ts` - CSV import endpoint
  - Create action function to handle file upload
  - Parse CSV file (use library like papaparse)
  - Validate CSV format and required columns
  - For each row, create/update StoneMetadata record
  - Handle errors gracefully (continue on error, collect errors)
  - Return summary: successful imports, errors
  - Add progress tracking (optional, for large imports)

- [ ] **3.11** Create `app/routes/api.builder.export.ts` - CSV export endpoint
  - Create loader function to export settings or stones
  - Fetch all SettingMetadata or StoneMetadata for shop
  - Convert to CSV format
  - Set proper headers for file download
  - Return CSV file response
  - Include all relevant fields in export

- [ ] **3.12** Create `app/components/admin/CSVImporter.tsx` - CSV import UI component
  - Create file upload input
  - Add "Choose File" button styled with Polaris
  - Show file name after selection
  - Add "Import" button to submit form
  - Show loading spinner during import
  - Display success/error messages after import
  - Show detailed error list if errors occurred
  - Add "Download Template" link for CSV format

---

## 4.0 Admin Settings & Configuration

**Goal**: Build admin settings page for merchant configuration.

- [ ] **4.1** Create `app/routes/app.builder.settings.tsx` - Settings page with tabs
  - Create page with Polaris `<s-tabs>` component
  - Add 4 tabs: General, Pricing, Email Notifications, Appearance
  - Create loader to fetch AppSettings for current shop
  - Create action to save settings
  - Handle tab switching state
  - Show each tab's form content conditionally

- [ ] **4.2** Implement General Settings tab
  - Add toggle for "Enable Builder" (builderEnabled field)
  - Add informational text explaining what happens when disabled
  - Add toggle for "Enable Side Stones Step" (for future feature, disabled)
  - Use `<s-switch>` Polaris component for toggles
  - Update form on change, save on blur or explicit save button

- [ ] **4.3** Implement Pricing Rules tab
  - Add currency input for "Engraving Fee" (engravingFee field)
  - Add currency input for "Gift Wrap Fee" (giftWrapFee field)
  - Add percentage input for "Markup Percentage" (markupPercent field)
  - Add help text explaining how markup is applied
  - Use Polaris `<s-text-field>` components
  - Add validation (must be non-negative numbers)

- [ ] **4.4** Implement Email Notifications tab
  - Add toggle for "Notify on Configuration Save" (notifyOnConfig field)
  - Add toggle for "Notify on Order" (notifyOnOrder field)
  - Add text input for "Notification Email Address" (notificationEmail field)
  - Add email validation
  - Show preview of email templates (read-only, informational)
  - Use Polaris form components

- [ ] **4.5** Implement Appearance tab
  - Add color picker for "Primary Color" (primaryColor field)
  - Add color picker for "Accent Color" (accentColor field)
  - Add file upload for "Logo" (logoUrl field)
  - Show logo preview after upload
  - Store logo in Shopify files or CDN
  - Add "Reset to Defaults" button
  - Use Polaris `<s-color-picker>` or HTML color input

- [ ] **4.6** Create `app/routes/api.builder.settings.ts` - API to save settings
  - Create loader to fetch current AppSettings for shop
  - Create action to update AppSettings
  - Validate all fields before saving
  - Use upsert to create settings if they don't exist
  - Return updated settings or error
  - Add comprehensive error handling

- [ ] **4.7** Handle logo upload
  - If logo file is uploaded, save to Shopify Files via GraphQL
  - Or integrate with CDN (Cloudinary, AWS S3)
  - Store resulting URL in database
  - Add file size and type validation (max 2MB, PNG/JPG only)
  - Return logo URL to client

- [ ] **4.8** Add "Save Settings" button to settings page
  - Add sticky footer with Save and Cancel buttons
  - Disable save button if no changes made
  - Show loading state during save
  - Show success toast after save
  - Show error banner if save fails
  - Use Shopify toast API: `shopify.toast.show()`

- [ ] **4.9** Add settings initialization for new installations
  - When app is installed, create default AppSettings record
  - Set sensible defaults (engravingFee: 50, giftWrapFee: 25, markup: 0)
  - Can be done in afterAuth hook or during first admin load
  - Ensure settings exist before rendering settings page

- [ ] **4.10** Add loading and error states
  - Show skeleton loaders while fetching settings
  - Show error banner if fetch fails
  - Add retry button on error
  - Handle network errors gracefully

---

## 5.0 Storefront Builder - Foundation

**Goal**: Set up the foundation for the customer-facing builder (React app structure).

- [ ] **5.1** Create `app/components/builder/BuilderApp.tsx` - Root builder component
  - Create main component that renders all builder steps
  - Accept props: shop, apiBaseUrl, initialConfig (if resuming)
  - Render BuilderProvider as wrapper
  - Render StepNavigation component
  - Render current step component based on state
  - Render PriceSummary component (sticky sidebar or header)
  - Add loading and error states

- [ ] **5.2** Create `app/components/builder/BuilderProvider.tsx` - Context provider
  - Create React Context for builder state
  - Define state interface: currentStep, selectedSetting, selectedStone, customizations, totalPrice
  - Implement reducer for state updates (or useState)
  - Provide actions: selectSetting, selectStone, updateCustomization, goToStep, etc.
  - Fetch and populate initial data if resuming saved config
  - Persist state to localStorage on changes (for guest users)
  - Export useBuilder hook for consuming context

- [ ] **5.3** Create `app/components/builder/StepNavigation.tsx` - Step indicator
  - Accept props: currentStep, totalSteps, completedSteps
  - Render step circles with numbers
  - Show step labels (Choose Setting, Choose Stone, Customize, Review)
  - Style completed steps with checkmark icon
  - Style current step with accent color
  - Make completed steps clickable to go back
  - Use CSS for responsive layout (horizontal on desktop, vertical on mobile)

- [ ] **5.4** Create `app/components/builder/PriceSummary.tsx` - Price display component
  - Accept props: settingPrice, stonePrice, customizationFees, totalPrice
  - Render price breakdown (collapsed by default, expandable)
  - Show running total prominently
  - Update in real-time as selections change
  - Add "Starting at" text if incomplete configuration
  - Style with sticky positioning (always visible)
  - Use currency formatter from utils

- [ ] **5.5** Set up API client for storefront builder
  - Create `app/components/builder/api.ts` helper
  - Create `fetchSettings(shop, filters)` function - calls /api/builder/settings
  - Create `fetchStones(shop, filters)` function - calls /api/builder/stones
  - Create `saveConfiguration(data)` function - calls /api/builder/configure
  - Create `addToCart(configurationId)` function - calls /api/builder/cart
  - Use fetch API with error handling
  - Return typed responses based on types/api.ts

- [ ] **5.6** Create `app/routes/api.builder.settings.ts` - Settings API endpoint
  - Create loader function (GET) to fetch settings
  - Parse query parameters: style, metalType, priceMin, priceMax, page, limit
  - Fetch SettingMetadata from database with filters
  - Fetch corresponding Shopify products
  - Merge data and return JSON
  - Implement pagination (default 24 per page)
  - Add caching headers for performance

- [ ] **5.7** Create `app/routes/api.builder.stones.ts` - Stones API endpoint
  - Create loader function (GET) to fetch stones
  - Parse query parameters: shape, caratMin, caratMax, cut, color, clarity, priceMin, priceMax, certification, page, limit
  - Fetch StoneMetadata from database with complex filters
  - Fetch corresponding Shopify products
  - Merge data and return JSON
  - Implement pagination (default 50 per page)
  - Optimize query with proper indexes

- [ ] **5.8** Create builder entry point component
  - Create `app/routes/_index/builder.tsx` (or separate route if needed)
  - This will be rendered by Theme App Extension
  - Import BuilderApp component
  - Pass shop prop from window object or data attribute
  - Handle errors and show fallback UI
  - Export as default

- [ ] **5.9** Set up builder CSS/styling
  - Create `app/components/builder/builder.css` stylesheet
  - Define CSS variables for theming (colors, fonts, spacing)
  - Style for mobile-first approach
  - Add media queries for tablet and desktop
  - Ensure accessibility (focus states, ARIA labels)
  - Use CSS Grid/Flexbox for layouts

- [ ] **5.10** Add error boundaries
  - Create `app/components/builder/ErrorBoundary.tsx`
  - Catch and display errors gracefully
  - Show user-friendly error messages
  - Add "Try Again" button
  - Log errors to analytics service

---

## 6.0 Storefront Builder - Step 1 (Settings Selection)

**Goal**: Implement Step 1 where customers choose a ring setting.

- [ ] **6.1** Create `app/components/builder/steps/SettingSelector.tsx` - Main step component
  - Create component that fetches and displays settings
  - Use useBuilder hook to access context
  - Fetch settings on mount using API client
  - Handle loading and error states
  - Render FilterSidebar and SettingGrid side-by-side (desktop)
  - Render FilterDrawer and SettingGrid stacked (mobile)
  - Handle setting selection and advance to Step 2

- [ ] **6.2** Create `app/components/builder/FilterSidebar.tsx` - Filters for settings
  - Accept props: filters, onFilterChange
  - Render filter groups for: Style, Metal Type, Price Range
  - Use FilterGroup component for each group
  - Use RangeSlider component for price
  - Apply filters on change (debounced)
  - Show "Clear All" button
  - Style with sticky positioning

- [ ] **6.3** Create `app/components/shared/FilterGroup.tsx` - Reusable filter component
  - Accept props: title, options, selected, onChange, multiSelect
  - Render title with collapse/expand icon
  - Render checkboxes or radio buttons for options
  - Handle selection state
  - Style with Polaris-like appearance

- [ ] **6.4** Create `app/components/shared/RangeSlider.tsx` - Price range slider
  - Accept props: min, max, value, onChange
  - Use HTML range input or library (e.g., rc-slider)
  - Show min and max labels
  - Show current values above/below slider
  - Update on drag
  - Style with custom styling

- [ ] **6.5** Create `app/components/builder/SettingGrid.tsx` - Grid of setting cards
  - Accept props: settings[], onSelectSetting
  - Render settings in responsive grid (2 cols mobile, 3-4 cols desktop)
  - Use SettingCard component for each setting
  - Show "No results" empty state if no settings
  - Add pagination or infinite scroll
  - Handle loading skeleton

- [ ] **6.6** Create `app/components/builder/SettingCard.tsx` - Individual setting card
  - Accept props: setting, onSelect
  - Display setting image (thumbnail)
  - Display setting name
  - Display "Starting at" price
  - Add "Quick View" icon/button
  - Add "Select" button
  - Handle hover effects
  - Style with card shadow and border

- [ ] **6.7** Create `app/components/builder/SettingModal.tsx` - Setting details modal
  - Accept props: setting, isOpen, onClose, onSelect
  - Display large images in carousel/gallery
  - Display full description
  - Display available metal types with prices
  - Display compatible stone shapes
  - Display technical specifications
  - Add "Select" button in modal
  - Use Modal component from shared

- [ ] **6.8** Create `app/components/shared/Modal.tsx` - Reusable modal component
  - Accept props: isOpen, onClose, title, children, footer
  - Render modal overlay with backdrop
  - Render modal content with close button
  - Handle escape key and backdrop click to close
  - Trap focus within modal (accessibility)
  - Animate entrance/exit
  - Style with z-index and centered positioning

- [ ] **6.9** Implement setting selection logic
  - When "Select" is clicked, save setting to context
  - Calculate base price for default metal type
  - Update totalPrice in context
  - Mark Step 1 as completed
  - Navigate to Step 2 automatically
  - Track analytics event: "setting_selected"

- [ ] **6.10** Add mobile filter drawer
  - Create drawer component that slides in from left/bottom
  - Show filters in drawer (same as sidebar)
  - Add "Apply" and "Close" buttons
  - Trigger drawer with "Filters" button in header
  - Style with smooth animation

---

## 7.0 Storefront Builder - Step 2 (Stone Selection)

**Goal**: Implement Step 2 where customers choose a center stone.

- [ ] **7.1** Create `app/components/builder/steps/StoneSelector.tsx` - Main step component
  - Create component that fetches and displays stones
  - Filter stones by compatible shapes based on selected setting
  - Fetch stones on mount using API client with filters
  - Handle loading and error states (show spinner, retry button)
  - Render StoneFilters and StoneTable/StoneCardList
  - Handle stone selection and advance to Step 3
  - Add "Back to Settings" button

- [ ] **7.2** Create `app/components/builder/StoneFilters.tsx` - Advanced stone filters
  - Accept props: filters, onFilterChange
  - Render filter groups for: Shape, Carat, Cut, Color, Clarity, Price, Certification
  - Use multi-select for Shape (filter by compatible shapes)
  - Use RangeSlider for Carat and Price
  - Use dropdowns for Cut, Color, Clarity (multi-select)
  - Use checkboxes for Certification types
  - Apply filters on change (debounced)
  - Show active filter count badge
  - Add "Clear All" button

- [ ] **7.3** Create `app/components/builder/StoneTable.tsx` - Desktop table view
  - Accept props: stones[], onSelectStone
  - Render table with columns: Image, Shape, Carat, Cut, Color, Clarity, Price, Certificate, Actions
  - Make columns sortable (click header to sort)
  - Highlight row on hover
  - Add "Details" and "Select" buttons in Actions column
  - Show pagination controls at bottom
  - Style with alternating row colors

- [ ] **7.4** Create `app/components/builder/StoneCardList.tsx` - Mobile card view
  - Accept props: stones[], onSelectStone
  - Render stones as cards (1 col on mobile)
  - Display key info: Image, Carat, Shape, Price, 4Cs summary
  - Add "Details" and "Select" buttons
  - Use infinite scroll or "Load More" button
  - Style with compact layout

- [ ] **7.5** Create `app/components/builder/StoneModal.tsx` - Stone details modal
  - Accept props: stone, isOpen, onClose, onSelect
  - Display high-res image or video of stone
  - Display certificate info with link to certificate
  - Display detailed specifications table (measurements, table%, depth%, etc.)
  - Display plot diagram if available (image)
  - Display full 4Cs information
  - Add "Select" button in modal footer
  - Use Modal component from shared

- [ ] **7.6** Implement table sorting
  - Add state for sortColumn and sortDirection
  - On column header click, update sort state
  - Sort stones array based on current sort
  - Show sort indicator (up/down arrow) on active column
  - Default sort: Price ascending

- [ ] **7.7** Implement pagination for stones
  - Add state for currentPage
  - Fetch stones for current page from API
  - Show page numbers or Next/Previous buttons
  - Update URL query params with page number (optional)
  - Scroll to top on page change

- [ ] **7.8** Implement stone selection logic
  - When "Select" is clicked, save stone to context
  - Add stone price to totalPrice in context
  - Mark Step 2 as completed
  - Navigate to Step 3 automatically
  - Track analytics event: "stone_selected"

- [ ] **7.9** Add certificate link handling
  - If certificate URL is provided, make certificate number a link
  - Open certificate PDF/page in new tab
  - Add external link icon
  - Handle missing certificate gracefully

- [ ] **7.10** Optimize stone fetching
  - Implement client-side caching (cache API responses)
  - Show cached results immediately while fetching updated data
  - Add loading indicator for filter changes
  - Debounce filter changes (wait 300ms before fetching)

---

## 8.0 Storefront Builder - Step 3 (Customization)

**Goal**: Implement Step 3 where customers customize ring size, metal type, and engraving.

- [ ] **8.1** Create `app/components/builder/steps/Customization.tsx` - Main step component
  - Create component with customization form
  - Load customization options from context (metal types, current ring size, etc.)
  - Render RingSizeSelector component
  - Render MetalTypeSelector component
  - Render EngravingInput component
  - Render GiftOptions component
  - Show running price updates as options change
  - Add "Back" and "Continue to Review" buttons

- [ ] **8.2** Create `app/components/builder/RingSizeSelector.tsx` - Ring size selector
  - Accept props: selectedSize, onSelect
  - Display ring sizes as buttons or dropdown (3, 3.5, 4, ..., 12)
  - Highlight selected size
  - Add "Ring Size Guide" link that opens modal with sizing chart
  - Add "Don't know your size?" help text
  - Style with visual buttons (recommended) or dropdown

- [ ] **8.3** Create ring size guide modal
  - Create modal component with sizing chart image
  - Add instructions on how to measure ring size
  - Add printable ring sizer (optional)
  - Add link to video tutorial (optional)
  - Use Modal component from shared

- [ ] **8.4** Create `app/components/builder/MetalTypeSelector.tsx` - Metal type selector
  - Accept props: selectedMetal, availableMetals (with prices), onSelect
  - Display metal types as radio buttons or visual swatches
  - Show price for each metal type
  - Highlight selected metal
  - Update price immediately on change
  - Show metal swatch images (gold color, white gold, rose gold, platinum)

- [ ] **8.5** Create `app/components/builder/EngravingInput.tsx` - Engraving text input
  - Accept props: value, onChange, fee
  - Display text input with character counter (max 25 chars)
  - Show preview of engraving text (italic font or script font)
  - Show engraving fee below input
  - Validate characters (alphanumeric + spaces only)
  - Add help text: "Engraving will be placed on the inside of the band"
  - Style with elegant font for preview

- [ ] **8.6** Create `app/components/builder/GiftOptions.tsx` - Gift wrap and message
  - Accept props: giftWrap (boolean), giftMessage (string), onChange
  - Display checkbox for "Add Gift Wrapping" with fee
  - Show textarea for gift message if gift wrap is selected
  - Validate gift message length (max 200 chars)
  - Show character counter
  - Style with Polaris form components

- [ ] **8.7** Implement price updates on customization changes
  - When metal type changes, recalculate setting price
  - When engraving is added, add engraving fee
  - When gift wrap is selected, add gift wrap fee
  - Update context state with new prices
  - Update PriceSummary component in real-time

- [ ] **8.8** Implement "Continue to Review" logic
  - Validate all customizations (ring size required, engraving valid)
  - Save customizations to context
  - Mark Step 3 as completed
  - Navigate to Step 4 (Review)
  - Track analytics event: "customization_completed"

- [ ] **8.9** Add validation and error handling
  - Show error message if ring size not selected
  - Show error if engraving has invalid characters
  - Disable "Continue" button if validation fails
  - Style errors with red text and icons

- [ ] **8.10** Add "Skip Engraving" option
  - Make engraving optional
  - Show "Skip" or "No Engraving" checkbox
  - Clear engraving text if skipped
  - Update price accordingly

---

## 9.0 Storefront Builder - Step 4 (Review & Cart)

**Goal**: Implement Step 4 where customers review their configuration and add to cart.

- [ ] **9.1** Create `app/components/builder/steps/Review.tsx` - Main review component
  - Create component that displays full configuration summary
  - Render RingPreview component with visual
  - Render ConfigurationSummary component with details
  - Render PriceBreakdown component
  - Add "Edit" buttons for each section (links back to specific step)
  - Add "Save Configuration" button
  - Add "Add to Cart" button (primary action)
  - Show loading state during cart addition

- [ ] **9.2** Create `app/components/builder/RingPreview.tsx` - Visual preview component
  - Accept props: settingImage, stoneImage, metalType
  - Display composite image of ring (setting + stone)
  - Option 1: Client-side canvas composition (overlay stone on setting)
  - Option 2: Request composite image from backend API
  - Option 3: Show setting and stone images side-by-side
  - Add zoom functionality (click to enlarge)
  - Add "360° View" button (future feature, can be disabled)
  - Style with elegant presentation

- [ ] **9.3** Create `app/components/builder/ConfigurationSummary.tsx` - Details list
  - Accept props: configuration object
  - Display setting details: Name, SKU, Metal Type, Style
  - Display stone details: Carat, Shape, Cut, Color, Clarity, Certificate
  - Display customizations: Ring Size, Engraving (if any), Gift Wrap (if selected)
  - Show "Edit" button next to each section
  - Style as clean list with icons

- [ ] **9.4** Create `app/components/builder/PriceBreakdown.tsx` - Itemized pricing
  - Accept props: settingPrice, stonePrice, engravingFee, giftWrapFee, total
  - Display each price component as row
  - Show subtotal before fees
  - Show total with emphasis (large, bold)
  - Add expand/collapse for breakdown (collapsed by default)
  - Format prices with currency formatter
  - Style with clear visual hierarchy

- [ ] **9.5** Implement "Edit" functionality
  - When "Edit Setting" is clicked, go back to Step 1 (preserve current selection)
  - When "Edit Stone" is clicked, go back to Step 2
  - When "Edit Customization" is clicked, go back to Step 3
  - Don't lose existing selections when editing
  - Use context to maintain state

- [ ] **9.6** Implement "Save Configuration" functionality
  - Create function that calls saveConfiguration API
  - Show loading spinner on button during save
  - Generate share token if guest user
  - Show success message with shareable link
  - Allow copying link to clipboard
  - Track analytics event: "configuration_saved"

- [ ] **9.7** Create `app/routes/api.builder.configure.ts` - Save configuration API
  - Create action function (POST) to save configuration
  - Validate all configuration data
  - Calculate total price on backend (don't trust client)
  - Create Configuration record in database with status "completed"
  - Generate unique shareToken if guest
  - Return configuration ID and share token
  - Add error handling

- [ ] **9.8** Implement "Add to Cart" functionality
  - Create function that calls addToCart API
  - Pass configuration ID to API
  - Show loading spinner on button
  - On success, show success toast message
  - Redirect to cart page or show "View Cart" button
  - Track analytics event: "add_to_cart"

- [ ] **9.9** Create `app/routes/api.builder.cart.ts` - Add to cart API
  - Create action function (POST) to add configuration to cart
  - Validate configuration ID
  - Fetch configuration from database
  - Build line item properties object with all config details
  - Use Shopify Ajax Cart API to add to cart
  - Return cart response with item added
  - Handle inventory check (ensure setting and stone available)

- [ ] **9.10** Add social proof and trust signals
  - Show "30-day return policy" badge
  - Show "Lifetime warranty" badge
  - Show "Free shipping" message (if applicable)
  - Show security badges (SSL, payment icons)
  - Add customer testimonials section (optional)
  - Style with trust-building visuals

---

## 10.0 Order Creation & Cart Integration

**Goal**: Integrate configuration with Shopify cart and create orders.

- [ ] **10.1** Implement Shopify Ajax Cart API integration
  - In api.builder.cart.ts, use fetch to call `/cart/add.js`
  - Build request body with variantId (setting product variant for selected metal)
  - Add line item properties with all configuration details
  - Handle response and return cart data
  - Handle errors (out of stock, API errors)

- [ ] **10.2** Build line item properties object
  - Create helper function `buildLineItemProperties(configuration)`
  - Include: Setting name, Setting SKU, Metal Type
  - Include: Stone details (carat, shape, color, clarity), Stone SKU, Certificate info
  - Include: Ring Size, Engraving text
  - Include: Configuration ID for internal tracking
  - Limit each property to 255 characters
  - Return object with key-value pairs

- [ ] **10.3** Handle variant selection for metal types
  - In Shopify, setting products should have variants for each metal type
  - Based on selected metal, find the matching variant ID
  - Pass variant ID to cart API
  - Handle case where variant is not found (error message)

- [ ] **10.4** Implement inventory checking
  - Before adding to cart, check if setting and stone are available
  - Query Shopify API for product inventory quantity
  - If out of stock, show error message and don't add to cart
  - Suggest alternative settings/stones (optional)

- [ ] **10.5** Create webhook handler for orders
  - Create `app/routes/webhooks.orders.create.tsx`
  - Register webhook in shopify.app.toml: `topics = ["orders/create"]`
  - When order is created, check if it contains builder configuration
  - Update Configuration status to "ordered" in database
  - Store order ID in Configuration record
  - Send email notification to merchant (if enabled)

- [ ] **10.6** Extract configuration details from order
  - Parse line item properties from order webhook payload
  - Extract Configuration ID from properties
  - Look up Configuration in database
  - Associate order with configuration

- [ ] **10.7** Implement order note generation
  - When order is created, generate a work order note for jeweler
  - Include all configuration details in note
  - Include images (or links to images) of setting and stone
  - Format as readable text or HTML
  - Attach note to order via GraphQL API (optional)

- [ ] **10.8** Handle order fulfillment tracking
  - Track fulfillment status in database (optional)
  - Update Configuration with fulfillment info
  - Send customer email when order ships (optional, future feature)

- [ ] **10.9** Test complete checkout flow
  - Create test configuration
  - Add to cart
  - Proceed to checkout
  - Complete test order
  - Verify order created in Shopify
  - Verify webhook received and processed
  - Verify Configuration updated in database

- [ ] **10.10** Add error handling for cart failures
  - Handle network errors gracefully
  - Show user-friendly error messages
  - Provide retry option
  - Log errors to analytics service

---

## 11.0 Save & Share Functionality

**Goal**: Allow customers to save configurations and share with others.

- [ ] **11.1** Implement save for logged-in customers
  - When "Save" is clicked, check if customer is logged in
  - If logged in, save Configuration with customerId
  - Show success message: "Configuration saved to your account"
  - Allow viewing saved configs in customer account page

- [ ] **11.2** Implement save for guest customers
  - If not logged in, save Configuration without customerId
  - Generate unique shareToken for configuration
  - Show success message with shareable link
  - Store share token in Configuration record

- [ ] **11.3** Create shareable link generation
  - Create function `generateShareUrl(shareToken)`
  - Return URL format: `https://store.com/pages/ring-builder?config=TOKEN`
  - Allow copying link to clipboard
  - Add "Copy Link" button with clipboard API

- [ ] **11.4** Create `app/routes/api.builder.share.ts` - Share API endpoint
  - Create action function (POST) to generate share link
  - Accept configuration ID
  - Generate or retrieve share token
  - Return full shareable URL
  - Track analytics event: "configuration_shared"

- [ ] **11.5** Implement configuration loading from share token
  - When builder loads with ?config=TOKEN query param, fetch configuration
  - Call API: GET /api/builder/configuration/by-token/:token
  - Load configuration data into builder state
  - Show message: "Loading saved configuration..."
  - Resume builder at last completed step

- [ ] **11.6** Create `app/routes/api.builder.configuration.by-token.$token.ts` - Fetch by token
  - Create loader function (GET) to fetch configuration by share token
  - Look up Configuration by shareToken in database
  - Return full configuration object
  - Handle invalid or expired tokens
  - Increment viewCount for analytics

- [ ] **11.7** Create customer account integration (optional)
  - Create customer account section to view saved configurations
  - List all configurations for logged-in customer
  - Show thumbnail, details, date saved
  - Add "Resume" button to load configuration
  - Add "Delete" button to remove configuration
  - Requires Shopify Customer Account API or theme customization

- [ ] **11.8** Implement configuration expiration (optional)
  - Add TTL for configurations (e.g., 90 days)
  - Delete or archive old configurations automatically
  - Show warning message for expiring configs

- [ ] **11.9** Add social sharing buttons (optional)
  - Add "Share via Email" button (opens email client with link)
  - Add "Share on Facebook" button (optional)
  - Add "Share on Pinterest" button (optional)
  - Use Web Share API for native sharing on mobile

- [ ] **11.10** Track sharing analytics
  - Track when configurations are shared
  - Track when shared configs are viewed (via token)
  - Track conversion rate from shared configs
  - Display in admin analytics dashboard

---

## 12.0 Admin Analytics Dashboard

**Goal**: Build analytics dashboard for merchants to track builder performance.

- [ ] **12.1** Create `app/routes/app.builder._index.tsx` - Dashboard home page
  - Create dashboard layout with stat cards
  - Fetch analytics data from API
  - Display key metrics: Total Configs, Completion Rate, Conversion Rate, AOV
  - Display charts: Funnel, Popular Settings, Popular Stones
  - Add date range selector (last 7 days, 30 days, 90 days, all time)
  - Show loading skeleton while fetching data

- [ ] **12.2** Create `app/components/admin/StatCard.tsx` - Metric card component
  - Accept props: title, value, change (percentage), icon
  - Display title, large value, and change indicator
  - Show up/down arrow and color based on change
  - Add icon for visual interest
  - Style with Polaris card styling

- [ ] **12.3** Implement stat calculations
  - Total Configurations: Count all configurations for shop
  - Completion Rate: % who reach Step 4 (use AnalyticsEvent data)
  - Conversion Rate: % of completed configs that became orders
  - Average Order Value: Average totalPrice of ordered configurations
  - Calculate change vs previous period (e.g., last 30 days vs previous 30 days)

- [ ] **12.4** Create `app/components/admin/FunnelChart.tsx` - Configuration funnel
  - Accept props: funnelData (array of steps with counts)
  - Display funnel visualization showing drop-off at each step
  - Steps: Started, Selected Setting, Selected Stone, Completed, Ordered
  - Show percentage completion for each step
  - Use chart library (Recharts, Chart.js) or custom SVG
  - Style with gradient colors

- [ ] **12.5** Create `app/components/admin/PopularItemsChart.tsx` - Bar chart
  - Accept props: items (array with name and count), title
  - Display horizontal bar chart
  - Show top 10 items (settings or stones)
  - Include thumbnail images in labels
  - Use chart library or custom CSS bars
  - Make bars clickable to view item details

- [ ] **12.6** Create `app/routes/api.builder.analytics.ts` - Analytics API endpoint
  - Create loader function (GET) to fetch analytics data
  - Parse query params: dateRange (start, end)
  - Calculate all metrics using AnalyticsService
  - Fetch funnel data, popular settings, popular stones
  - Return JSON with all analytics
  - Add caching (cache for 1 hour)

- [ ] **12.7** Implement funnel data calculation
  - Query AnalyticsEvent table for event counts by type
  - Count: builder_started, setting_selected, stone_selected, configuration_completed, add_to_cart, order_created
  - Calculate conversion rates between each step
  - Return structured funnel data

- [ ] **12.8** Implement popular items queries
  - Query Configuration table, join with SettingMetadata
  - Count occurrences of each settingId
  - Return top 10 settings with counts
  - Same for stones (count stoneId occurrences)

- [ ] **12.9** Add date range filtering
  - Create DateRangePicker component (Polaris has date picker)
  - Allow selecting preset ranges (last 7/30/90 days) or custom range
  - Update all queries to filter by date range
  - Update charts when date range changes

- [ ] **12.10** Add export functionality
  - Add "Export to CSV" button on dashboard
  - Export configuration list with all details
  - Export analytics summary
  - Use api.builder.export.ts route

---

## 13.0 Webhooks & Product Sync

**Goal**: Keep product data in sync with Shopify via webhooks.

- [ ] **13.1** Register product webhooks in shopify.app.toml
  - Add webhook subscription: `topics = ["products/create"]`
  - Add webhook subscription: `topics = ["products/update"]`
  - Add webhook subscription: `topics = ["products/delete"]`
  - Set URIs: `/webhooks/products/create`, `/webhooks/products/update`, `/webhooks/products/delete`

- [ ] **13.2** Create `app/routes/webhooks.products.create.tsx` - Product created webhook
  - Create action function to handle webhook
  - Parse webhook payload to get product data
  - Check if product has builder metafields (namespace: builder)
  - If yes, create SettingMetadata or StoneMetadata record
  - Return 200 OK response
  - Add error handling and logging

- [ ] **13.3** Create `app/routes/webhooks.products.update.tsx` - Product updated webhook
  - Create action function to handle webhook
  - Parse webhook payload
  - Check if product has builder metafields
  - Update existing SettingMetadata or StoneMetadata record
  - If metafields removed, delete metadata record
  - Handle product title, price, image updates
  - Return 200 OK response

- [ ] **13.4** Create `app/routes/webhooks.products.delete.tsx` - Product deleted webhook
  - Create action function to handle webhook
  - Parse webhook payload to get product ID
  - Look up SettingMetadata or StoneMetadata by productId
  - Mark as unavailable or delete record
  - Update any active configurations using this product (mark as incomplete)
  - Return 200 OK response

- [ ] **13.5** Implement webhook signature verification
  - All webhook handlers must verify HMAC signature
  - Use Shopify app library for verification
  - Reject requests with invalid signatures
  - Log suspicious requests

- [ ] **13.6** Implement webhook retry logic
  - Shopify retries webhooks on failure
  - Ensure webhooks are idempotent (safe to retry)
  - Use transaction IDs or timestamps to detect duplicates
  - Return 200 even if already processed

- [ ] **13.7** Add webhook error handling
  - Catch all errors in webhook handlers
  - Log errors to monitoring service
  - Return 500 status if error (Shopify will retry)
  - Don't expose internal errors in response

- [ ] **13.8** Create webhook testing utility
  - Use Shopify CLI: `shopify app webhook trigger --topic products/update`
  - Test all webhook handlers with dummy data
  - Verify database updates occur correctly
  - Verify no errors logged

- [ ] **13.9** Implement product inventory sync
  - When product updated, check inventory quantity
  - Update availability flag in metadata
  - If out of stock, mark as unavailable
  - Show "Out of Stock" badge in admin

- [ ] **13.10** Add manual sync functionality
  - Create "Sync Products" button in admin
  - Fetch all products from Shopify
  - Update all metadata records
  - Show progress indicator
  - Show summary: X products synced, Y errors

---

## 14.0 Email Notifications

**Goal**: Send email notifications to merchants and customers.

- [ ] **14.1** Set up email service
  - Choose email provider: SendGrid, AWS SES, Postmark, or SMTP
  - Add email credentials to environment variables
  - Create email service client in `app/services/email.server.ts`
  - Create `sendEmail(to, subject, html)` function
  - Add error handling for email failures

- [ ] **14.2** Create email templates
  - Create `app/email-templates/` directory
  - Create HTML email template for merchant notification (configuration saved)
  - Create HTML email template for merchant notification (order placed)
  - Create HTML email template for customer (configuration saved, optional)
  - Use inline CSS for compatibility
  - Include merchant logo and branding colors

- [ ] **14.3** Create merchant notification for configuration saved
  - Create `sendConfigurationNotification(shop, configuration)` function
  - Fetch AppSettings to check if notifications enabled
  - If enabled, get notification email address
  - Build email HTML with configuration details
  - Include link to view configuration in admin
  - Call sendEmail function

- [ ] **14.4** Create merchant notification for order placed
  - Create `sendOrderNotification(shop, order, configuration)` function
  - Check if order notifications enabled in settings
  - Build email HTML with order and configuration details
  - Include link to view order in Shopify admin
  - Call sendEmail function

- [ ] **14.5** Integrate email notifications in configuration save
  - In api.builder.configure.ts, after saving configuration
  - Call sendConfigurationNotification if configured
  - Don't block response on email send (async)
  - Log email errors but don't fail request

- [ ] **14.6** Integrate email notifications in order webhook
  - In webhooks.orders.create.tsx, after processing order
  - Call sendOrderNotification if configured
  - Include work order details for jeweler

- [ ] **14.7** Create email template helper functions
  - Create `renderConfigurationEmailTemplate(config)` in email.server.ts
  - Create `renderOrderEmailTemplate(order, config)` in email.server.ts
  - Use template literals or template engine (Handlebars, EJS)
  - Return HTML string

- [ ] **14.8** Add email preview in admin settings
  - In settings page, add "Preview Email" button
  - Show modal with sample email rendered
  - Allow testing email (send to test address)

- [ ] **14.9** Handle email failures gracefully
  - Catch email send errors
  - Log to monitoring service
  - Store failed emails in queue for retry (optional)
  - Don't expose errors to user

- [ ] **14.10** Add email logging
  - Create EmailLog model in Prisma (optional)
  - Store sent emails with: recipient, subject, status, timestamp
  - Allow viewing email history in admin (optional)

---

## 15.0 Mobile Optimization

**Goal**: Ensure builder works perfectly on mobile devices.

- [ ] **15.1** Test builder on mobile browsers
  - Test on iOS Safari (iPhone)
  - Test on Android Chrome
  - Test on various screen sizes (small, medium, large)
  - Identify layout issues, touch issues, performance issues

- [ ] **15.2** Optimize filter interface for mobile
  - Convert FilterSidebar to slide-in drawer on mobile
  - Add "Filters" button in header to open drawer
  - Show active filter count badge on button
  - Ensure drawer slides smoothly with animation
  - Add close button and backdrop

- [ ] **15.3** Optimize stone table for mobile
  - Switch from table to card layout on mobile (use StoneCardList)
  - Show only essential info on cards (image, carat, price, 4Cs)
  - Make cards tappable to open details modal
  - Use infinite scroll or "Load More" instead of pagination

- [ ] **15.4** Optimize touch interactions
  - Ensure all buttons are at least 44x44px (Apple guideline)
  - Add proper touch feedback (active states)
  - Prevent accidental double-taps
  - Test on actual devices (not just simulator)

- [ ] **15.5** Optimize images for mobile
  - Implement lazy loading for all images
  - Use responsive images (srcset) for different sizes
  - Compress images for faster loading
  - Use WebP format with fallback
  - Add loading skeletons while images load

- [ ] **15.6** Optimize step navigation for mobile
  - Stack step indicators vertically on very small screens
  - Make step labels shorter or hide on mobile
  - Ensure progress is still clear

- [ ] **15.7** Optimize price summary for mobile
  - Position price summary at bottom (sticky)
  - Make collapsible to save space
  - Show total price prominently
  - Show breakdown on expand

- [ ] **15.8** Test form inputs on mobile
  - Ensure keyboard appears correctly for text inputs
  - Use appropriate input types (number for carat, email for email)
  - Prevent page zoom on focus (use font-size: 16px minimum)
  - Test auto-fill and autocomplete

- [ ] **15.9** Optimize performance on mobile
  - Minimize JavaScript bundle size (code splitting)
  - Use React.lazy for non-critical components
  - Reduce API calls (batch requests, cache aggressively)
  - Optimize CSS (remove unused styles)
  - Test on slow 3G network

- [ ] **15.10** Add viewport meta tag
  - Ensure `<meta name="viewport" content="width=device-width, initial-scale=1">` is present
  - Prevent zooming if appropriate: `maximum-scale=1, user-scalable=no`
  - Test that page is responsive

---

## 16.0 Theme App Extension

**Goal**: Deploy builder to storefront via Theme App Extension.

- [ ] **16.1** Create theme app extension structure
  - Run: `shopify app generate extension`
  - Choose: "Theme App Extension"
  - Name: "ring-builder"
  - This creates `extensions/ring-builder/` directory

- [ ] **16.2** Configure extension in shopify.extension.toml
  - Set extension name: "Ring Builder"
  - Set version
  - Define app block type
  - Set target: "section" (can be added to any page)

- [ ] **16.3** Create Liquid template for app block
  - Create `extensions/ring-builder/blocks/ring-builder.liquid`
  - Add `{% schema %}` block defining settings (heading, description)
  - Add div with ID: `<div id="ring-builder-root"></div>`
  - Add data attributes for shop, API URL: `data-shop="{{ shop.permanent_domain }}"`
  - Load JavaScript file: `<script src="{{ 'ring-builder.js' | asset_url }}" defer></script>`
  - Load CSS file: `<link rel="stylesheet" href="{{ 'ring-builder.css' | asset_url }}">`

- [ ] **16.4** Build React app for storefront
  - Create build script in package.json: `"build:storefront": "vite build --config vite.storefront.config.ts"`
  - Create `vite.storefront.config.ts` for building builder JS
  - Configure build to output to `extensions/ring-builder/assets/`
  - Entry point: `app/components/builder/BuilderApp.tsx`
  - Output: `ring-builder.js` and `ring-builder.css`

- [ ] **16.5** Create storefront entry point
  - Create `app/components/builder/index.tsx`
  - Import BuilderApp component
  - Initialize React app: `ReactDOM.createRoot(document.getElementById('ring-builder-root')).render(<BuilderApp />)`
  - Read shop from data attribute
  - Handle errors with ErrorBoundary

- [ ] **16.6** Handle CORS for API calls
  - Storefront will call backend APIs from different origin
  - Add CORS headers to all API routes
  - Allow origin: merchant's store domain
  - Use session tokens for authentication (Shopify App Bridge)

- [ ] **16.7** Test extension locally
  - Run: `shopify app dev`
  - Open preview URL in browser
  - Go to Shopify theme editor
  - Add "Ring Builder" block to a page
  - Verify builder loads and functions correctly

- [ ] **16.8** Deploy extension to production
  - Run: `shopify app deploy`
  - This uploads extension to Shopify
  - Merchants can now add block via theme editor
  - Test on live store

- [ ] **16.9** Create merchant installation guide
  - Document how to add builder to store:
    1. Install app from App Store
    2. Go to Online Store > Themes > Customize
    3. Add "Ring Builder" app block to desired page
    4. Save and publish
  - Include screenshots
  - Add to merchant guide document

- [ ] **16.10** Handle theme compatibility
  - Test on popular themes (Dawn, Debut, Brooklyn, etc.)
  - Ensure styling doesn't conflict with theme
  - Use scoped CSS classes (prefix with "ring-builder-")
  - Test different theme fonts and colors

---

## 17.0 Testing & Quality Assurance

**Goal**: Comprehensive testing of all features.

- [ ] **17.1** Set up testing framework
  - Install Jest for unit tests: `npm install --save-dev jest @types/jest`
  - Install React Testing Library: `npm install --save-dev @testing-library/react`
  - Install Playwright or Cypress for E2E: `npm install --save-dev @playwright/test`
  - Configure Jest in package.json
  - Add test scripts: `"test": "jest"`, `"test:e2e": "playwright test"`

- [ ] **17.2** Write unit tests for utilities
  - Test all validators in utils/validators.ts
  - Test all formatters in utils/formatters.ts
  - Test constants exports
  - Aim for 90%+ code coverage
  - Run: `npm test`

- [ ] **17.3** Write unit tests for services
  - Test PricingService calculations
  - Test ConfigurationService CRUD operations
  - Test AnalyticsService metric calculations
  - Mock database calls with Prisma client mock
  - Test error handling

- [ ] **17.4** Write integration tests for API routes
  - Test /api/builder/settings with various filters
  - Test /api/builder/stones with pagination
  - Test /api/builder/configure (save and fetch)
  - Test /api/builder/cart (add to cart)
  - Mock Shopify API responses
  - Test authentication and shop isolation

- [ ] **17.5** Write component tests for React components
  - Test SettingCard renders correctly
  - Test StoneTable sorting and filtering
  - Test BuilderProvider state management
  - Test form components (validation, submission)
  - Use React Testing Library
  - Test user interactions (click, input, etc.)

- [ ] **17.6** Write E2E tests for complete flows
  - Test: Complete configuration flow (Steps 1-4, add to cart)
  - Test: Save configuration and load from share link
  - Test: Admin product marking and metadata editing
  - Test: Admin settings update
  - Use Playwright to automate browser
  - Run tests in CI/CD pipeline

- [ ] **17.7** Manual testing checklist
  - [ ] Admin can mark products as settings/stones
  - [ ] Admin can edit metadata for settings
  - [ ] Admin can edit metadata for stones
  - [ ] Admin can update app settings
  - [ ] Admin can view analytics dashboard
  - [ ] Customer can select setting with filters
  - [ ] Customer can select stone with advanced filters
  - [ ] Customer can customize ring (size, engraving)
  - [ ] Customer can review and add to cart
  - [ ] Configuration is saved to database
  - [ ] Order is created in Shopify with correct details
  - [ ] Webhooks update metadata correctly
  - [ ] Email notifications are sent
  - [ ] Shared links load configurations
  - [ ] Mobile experience is functional

- [ ] **17.8** Cross-browser testing
  - Test on Chrome (latest)
  - Test on Firefox (latest)
  - Test on Safari (latest)
  - Test on Edge (latest)
  - Test on mobile browsers (iOS Safari, Android Chrome)
  - Use BrowserStack or similar for testing

- [ ] **17.9** Performance testing
  - Test page load times (should be < 3s)
  - Test API response times (should be < 500ms)
  - Test with large datasets (1000+ stones)
  - Optimize slow queries
  - Use Lighthouse for performance audits
  - Aim for 90+ performance score

- [ ] **17.10** Security testing
  - Test SQL injection prevention (parameterized queries)
  - Test XSS prevention (sanitize inputs)
  - Test CSRF protection
  - Test authentication (can't access other shop's data)
  - Test rate limiting
  - Use security scanning tools (Snyk, npm audit)

---

## 18.0 Documentation & Launch Preparation

**Goal**: Finalize documentation and prepare for launch.

- [ ] **18.1** Create merchant onboarding guide
  - Create `docs/MERCHANT_GUIDE.md`
  - Section 1: Installation (how to install app)
  - Section 2: Setup (marking products, configuring settings)
  - Section 3: Adding builder to storefront (theme extension)
  - Section 4: Managing configurations
  - Section 5: Analytics and reporting
  - Section 6: FAQ and troubleshooting
  - Include screenshots for each step

- [ ] **18.2** Create developer documentation
  - Create `docs/DEVELOPMENT.md`
  - Section 1: Setup (clone, install, configure)
  - Section 2: Architecture overview
  - Section 3: Database schema
  - Section 4: API endpoints
  - Section 5: Services and utilities
  - Section 6: Testing
  - Section 7: Deployment
  - Include code examples

- [ ] **18.3** Create API documentation
  - Create `docs/API_DOCUMENTATION.md`
  - Document all API endpoints with:
    - Method and path
    - Request parameters
    - Request body (if applicable)
    - Response format
    - Error codes
    - Example requests/responses
  - Use consistent format (like OpenAPI spec)

- [ ] **18.4** Create deployment guide
  - Create `docs/DEPLOYMENT.md`
  - Section 1: Environment setup (server, database, DNS)
  - Section 2: Build process
  - Section 3: Database migration
  - Section 4: Environment variables
  - Section 5: Deploying to production
  - Section 6: Monitoring and logging
  - Recommend hosting platforms (Heroku, Fly.io, AWS)

- [ ] **18.5** Set up production environment
  - Provision PostgreSQL database
  - Set up hosting server (Node.js runtime)
  - Configure environment variables
  - Set up SSL certificate
  - Configure domain (if using custom domain)
  - Set up error monitoring (Sentry, Bugsnag)
  - Set up uptime monitoring (Pingdom, UptimeRobot)

- [ ] **18.6** Run production migration
  - Connect to production database
  - Run: `npx prisma migrate deploy`
  - Verify all tables created
  - Create initial AppSettings for first test shop

- [ ] **18.7** Deploy app to production
  - Build production bundle: `npm run build`
  - Deploy to hosting platform
  - Run: `shopify app deploy` to deploy extension
  - Verify app is accessible
  - Test installation on test shop

- [ ] **18.8** Submit to Shopify App Store (optional)
  - Create app listing in Partner Dashboard
  - Add app name, description, screenshots
  - Add pricing information (free or paid plans)
  - Submit for review
  - Address any review feedback
  - Publish app once approved

- [ ] **18.9** Create marketing materials
  - Create landing page for app
  - Create demo video showing features
  - Create blog post announcing launch
  - Create social media posts
  - Prepare email campaign for launch

- [ ] **18.10** Launch and monitor
  - Announce app launch
  - Monitor for errors and bugs
  - Respond to merchant support requests
  - Collect feedback from early users
  - Plan next iteration based on feedback

---

## Completion Checklist

When all tasks are complete, verify the following:

- [ ] Database schema is complete and migrated
- [ ] All API endpoints are functional and tested
- [ ] Admin dashboard is fully functional
- [ ] Storefront builder completes all 4 steps successfully
- [ ] Configurations are saved to database correctly
- [ ] Orders are created in Shopify with proper details
- [ ] Webhooks are registered and functional
- [ ] Email notifications are sent correctly
- [ ] Mobile experience is optimized
- [ ] Theme app extension is deployed
- [ ] All tests pass (unit, integration, E2E)
- [ ] Documentation is complete
- [ ] App is deployed to production
- [ ] At least 3 merchants have tested successfully

---

## Post-Launch Tasks (Future Iterations)

These are features to consider after MVP launch:

- [ ] Add 3D ring visualization (Three.js)
- [ ] Add AR try-on feature (WebXR)
- [ ] Add side stones/accent stones step
- [ ] Add comparison feature (compare stones side-by-side)
- [ ] Integrate with diamond supplier APIs (real-time pricing)
- [ ] Add AI-powered recommendations
- [ ] Add multi-language support (i18n)
- [ ] Add multi-currency support
- [ ] Add virtual appointment scheduling
- [ ] Add live chat integration
- [ ] Add abandoned configuration email campaign
- [ ] Add advanced analytics (cohort analysis, A/B testing)

---

**End of Task List**

Total Tasks: 18 parent tasks, 180 sub-tasks
Estimated Timeline: 12-14 weeks with 2-3 developers

