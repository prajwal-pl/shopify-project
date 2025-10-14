# Task List: Phase 2.0 - Metafields Architecture & GemFind Feature Parity

**Source PRD:** `0003-prd-phase-2-metafields-architecture.md`  
**Generated:** October 13, 2025  
**Timeline:** 8 weeks (5 development phases)  
**Status:** Ready for implementation

---

## Relevant Files

### Database & Schema

- `prisma/schema.prisma` - Add new fields for Phase 2.0 (diamondType, shareToken, CustomerInquiry model)
- `prisma/migrations/` - New migration files for Phase 2.0 schema changes

### Services (Backend Logic)

- `app/services/metafields.server.ts` - NEW: Shopify metafields integration service
- `app/services/product.server.ts` - MODIFY: Add metafields sync, diamond type filtering
- `app/services/configuration.server.ts` - MODIFY: Add save/share functionality
- `app/services/email.server.ts` - NEW: Email sending service (SendGrid/SES/Postmark)
- `app/services/inquiry.server.ts` - NEW: Customer inquiry handling
- `app/services/comparison.server.ts` - NEW: Diamond comparison logic

### API Routes (Admin)

- `app/routes/api.admin.products.$id.metadata.tsx` - MODIFY: Write to metafields on save
- `app/routes/api.admin.products.$id.mark.tsx` - MODIFY: Initialize metafields when marking
- `app/routes/api.admin.metafields.setup.tsx` - NEW: Create metafield definitions
- `app/routes/api.admin.metafields.sync.tsx` - NEW: Manual sync trigger
- `app/routes/api.admin.inquiries.tsx` - NEW: List customer inquiries
- `app/routes/api.admin.inquiries.$id.tsx` - NEW: Update inquiry status

### API Routes (Public Builder)

- `app/routes/api.builder.stones.tsx` - MODIFY: Add diamond type filtering, SKU search
- `app/routes/api.builder.settings.tsx` - MODIFY: Enhanced filtering
- `app/routes/api.builder.save.tsx` - NEW: Save configuration with shareable URL
- `app/routes/api.builder.saved.$token.tsx` - NEW: Load saved configuration
- `app/routes/api.builder.share.tsx` - NEW: Share configuration via email/social
- `app/routes/api.builder.inquiry.tsx` - NEW: Submit customer inquiry
- `app/routes/api.builder.compare.tsx` - NEW: Compare multiple diamonds
- `app/routes/api.builder.product.$id.tsx` - NEW: Get detailed product info

### Webhooks

- `app/routes/webhooks.products.update.tsx` - MODIFY: Sync metafields to database
- `app/routes/webhooks.products.delete.tsx` - MODIFY: Clean up metadata and metafields

### Admin UI Components

- `app/components/admin/ProductDashboard.tsx` - NEW: Enhanced product list with status indicators
- `app/components/admin/AddDiamondModal.tsx` - NEW: Visual form for diamond specs
- `app/components/admin/AddSettingModal.tsx` - NEW: Visual form for setting specs
- `app/components/admin/IconShapeSelector.tsx` - NEW: Icon-based shape selector component
- `app/components/admin/MetalPricingTable.tsx` - NEW: Metal pricing input table
- `app/components/admin/InquiryDashboard.tsx` - NEW: Customer inquiry management
- `app/components/admin/SavedConfigsList.tsx` - NEW: List of saved configurations

### Customer Builder Components

- `app/components/builder/IconFilter.tsx` - NEW: Icon-based filter component (reusable)
- `app/components/builder/DiamondTypeTabs.tsx` - NEW: Mined/Lab Grown/Fancy Color tabs
- `app/components/builder/ViewModeToggle.tsx` - NEW: Grid/List toggle component
- `app/components/builder/StoneGridView.tsx` - NEW: Grid view for diamonds
- `app/components/builder/RecordsPerPageSelector.tsx` - NEW: Pagination control
- `app/components/builder/SKUSearchField.tsx` - NEW: Search by stock number
- `app/components/builder/ComparisonModal.tsx` - NEW: Side-by-side comparison
- `app/components/builder/ShareModal.tsx` - NEW: Share configuration modal
- `app/components/builder/ActionButtonGroup.tsx` - NEW: Drop Hint, Email, Schedule buttons
- `app/components/builder/InquiryModal.tsx` - NEW: Customer inquiry forms
- `app/components/builder/VirtualTryOnButton.tsx` - NEW: VTO integration
- `app/components/builder/StoneFilters.tsx` - MODIFY: Add icon-based filters, diamond type tabs
- `app/components/builder/StoneSelector.tsx` - MODIFY: Integrate new components (tabs, grid view, comparison)
- `app/components/builder/Review.tsx` - MODIFY: Add action buttons, save/share

### Detail Pages

- `app/routes/builder.setting.$id.tsx` - NEW: Enhanced setting detail page
- `app/routes/builder.diamond.$id.tsx` - NEW: Enhanced diamond detail page
- `app/components/builder/ProductDetailPage.tsx` - NEW: Shared detail page layout
- `app/components/builder/ImageGallery.tsx` - NEW: Product image gallery with zoom
- `app/components/builder/SpecificationPanel.tsx` - NEW: Product specs display
- `app/components/builder/CertificateViewer.tsx` - NEW: GIA certificate viewer

### Utilities & Helpers

- `app/utils/metafields-helpers.ts` - NEW: Metafield CRUD operations
- `app/utils/share-helpers.ts` - NEW: Generate share URLs, tokens
- `app/utils/email-templates.ts` - NEW: Email template generators
- `app/utils/comparison-helpers.ts` - NEW: Comparison logic, difference detection

### Email Templates

- `app/templates/email-share-configuration.html` - NEW: Share email template
- `app/templates/email-drop-hint.html` - NEW: Drop a hint email template
- `app/templates/email-request-info.html` - NEW: Request info email (to merchant)
- `app/templates/email-schedule-viewing.html` - NEW: Schedule viewing email (to merchant)

### Assets

- `public/icons/styles/` - NEW: 9 SVG icons for setting styles
- `public/icons/shapes/` - NEW: 10 SVG icons for diamond shapes
- `public/icons/actions/` - NEW: Icons for action buttons

### Types

- `app/types/builder.ts` - MODIFY: Add new types (DiamondType, Inquiry, SavedConfiguration)
- `app/types/metafields.ts` - NEW: Metafield type definitions

### Configuration

- `package.json` - MODIFY: Add new dependencies (react-icons, @sendgrid/mail, nanoid, ical-generator)

---

## High-Level Tasks

Based on PRD analysis and existing codebase assessment, here are the parent tasks:

- [ ] **1.0 Database Schema & Metafields Foundation**
- [ ] **2.0 Shopify Metafields Integration System**
- [ ] **3.0 Admin Product Management UI Enhancements**
- [ ] **4.0 Customer Visual Enhancements (Icons, Tabs, Grid View)**
- [ ] **5.0 Diamond Comparison Tool**
- [ ] **6.0 Save & Share Configuration System**
- [ ] **7.0 Customer Engagement Features (Inquiry Forms & Actions)**
- [ ] **8.0 Virtual Try-On Integration**
- [ ] **9.0 Enhanced Product Detail Pages**
- [ ] **10.0 Performance Optimization & Caching**
- [ ] **11.0 Testing, Migration & Documentation**

---

## Current State Assessment

### ✅ **What Phase 1.0 Already Has:**

**Database:**

- Configuration model ✓
- SettingMetadata model ✓
- StoneMetadata model ✓
- AppSettings model ✓
- AnalyticsEvent model ✓

**Admin APIs:**

- Mark product as setting/stone ✓
- Update product metadata ✓
- List products with metadata ✓
- CSV import/export ✓
- Settings management ✓

**Customer Builder:**

- 4-step flow ✓
- Setting selector with filters ✓
- Stone selector with filters (table view) ✓
- Customization step ✓
- Review and add to cart ✓
- Real-time pricing ✓

**Infrastructure:**

- Webhooks (products update/delete) ✓
- Multi-tenant isolation ✓
- Shopify authentication ✓

### 🔨 **What Phase 2.0 Needs to Add:**

**New Database Fields:**

- `StoneMetadata.diamondType` (mined/lab_grown/fancy_color)
- `Configuration.shareToken` (for shareable URLs)
- `Configuration.savedAt` (when saved vs completed)
- New `CustomerInquiry` model
- New AppSettings fields (customerEngagement, virtualTryOn, socialSharing)

**New Services:**

- Metafields CRUD operations
- Email sending service
- Inquiry management
- Comparison logic
- Share URL generation

**New UI Components:**

- Icon-based filters (9 styles, 10 shapes)
- Diamond type tabs
- Grid view for stones
- Comparison modal
- Share modal
- Inquiry forms (4 types)
- Detail pages
- And more...

---

## Notes

- All new features build upon existing Phase 1.0 foundation
- Maintain backward compatibility (existing merchants continue working)
- Metafields are written BOTH to Shopify (permanent) and app database (cache)
- Icons should be SVG for scalability
- Email service will require API credentials (SendGrid/SES/Postmark)
- Testing should cover admin UI, customer UX, and API integration
- Mobile responsiveness is critical for all new components

---

## Tasks

### Phase 2.1: Foundation (Weeks 1-2)

- [ ] **1.0 Database Schema & Metafields Foundation**
  - [ ] 1.1 Create Prisma migration for new fields in `StoneMetadata` model
    - Add `diamondType` field (String, required, values: "mined", "lab_grown", "fancy_color")
    - Add index on `[shop, diamondType]` for tab filtering performance
    - Set default value "mined" for existing records
  - [ ] 1.2 Create Prisma migration for new fields in `Configuration` model
    - Add `shareToken` field (String, optional, unique)
    - Add `shareCount` field (Int, default: 0)
    - Add `savedAt` field (DateTime, optional)
    - Add index on `shareToken` for shareable URL lookups
  - [ ] 1.3 Create new `CustomerInquiry` Prisma model
    - Fields: id, shop, type, configurationId, productId, customerName, customerEmail, customerPhone, message, preferredDate, preferredTime, status, createdAt
    - Add indexes on `[shop, type]`, `[shop, status]`, `[createdAt]`
    - Status enum: "new", "contacted", "closed"
    - Type enum: "hint", "info", "viewing", "email"
  - [ ] 1.4 Add new fields to `AppSettings` model
    - Add `customerEngagement` field (String, optional, stores JSON)
    - Add `virtualTryOn` field (String, optional, stores JSON)
    - Add `socialSharing` field (String, optional, stores JSON)
  - [ ] 1.5 Run database migrations
    - Execute `npx prisma migrate dev --name phase_2_foundation`
    - Verify migration success
    - Test rollback scenario
  - [ ] 1.6 Update TypeScript types in `app/types/builder.ts`
    - Add `DiamondType` type ("mined" | "lab_grown" | "fancy_color")
    - Add `InquiryType` type ("hint" | "info" | "viewing" | "email")
    - Add `SavedConfiguration` interface
    - Add `CustomerInquiry` interface
    - Update `Stone` interface to include `diamondType`
  - [ ] 1.7 Create `app/types/metafields.ts` for metafield type definitions
    - Define `DiamondMetafields` interface
    - Define `SettingMetafields` interface
    - Define metafield value type mappings
  - [ ] 1.8 **Validate Task 1.0 Completion**
    - Run `npm run typecheck && npm run lint && npm run build` (all must pass)
    - Verify migrations applied successfully (`npx prisma studio` - check new tables/fields exist)
    - Confirm new TypeScript types have no errors
    - Test database rollback scenario
    - Review: All 1.x sub-tasks completed ✅

- [ ] **2.0 Shopify Metafields Integration System**
  - [ ] 2.1 Create `app/services/metafields.server.ts` service
    - Implement `createMetafieldDefinitions(admin)` - Creates metafield definitions on app install
    - Implement `writeProductMetafields(admin, productId, metafields)` - Write metafields to product
    - Implement `readProductMetafields(admin, productId)` - Read metafields from product
    - Implement `deleteProductMetafields(admin, productId, keys)` - Remove metafields
  - [ ] 2.2 Define diamond metafield definitions
    - namespace: "ringbuilder"
    - Fields: type, shape, carat, cut, color, clarity, diamond_type, certificate, certificate_number, certificate_url
    - Use correct Shopify types (single_line_text_field, number_decimal, url)
  - [ ] 2.3 Define setting metafield definitions
    - namespace: "ringbuilder"
    - Fields: type, style, compatible_shapes, metal_prices, setting_height
    - Use list.single_line_text_field for compatible_shapes, json for metal_prices
  - [ ] 2.4 Create `app/routes/api.admin.metafields.setup.tsx` API endpoint
    - POST handler to create metafield definitions
    - Call on app installation/first admin access
    - Implement idempotent logic (check if already exists)
    - Return success/failure status
  - [ ] 2.5 Modify `app/routes/api.admin.products.$id.metadata.tsx`
    - After saving to database, also write to Shopify metafields
    - Use `writeProductMetafields` from metafields service
    - Handle GraphQL errors gracefully
    - Return combined success status (db + metafields)
  - [ ] 2.6 Modify `app/routes/webhooks.products.update.tsx`
    - Read metafields from webhook payload
    - Sync metafield changes to app database (StoneMetadata/SettingMetadata)
    - Handle partial updates (only changed fields)
    - Log sync activities for debugging
  - [ ] 2.7 Modify `app/routes/webhooks.products.delete.tsx`
    - Delete both database records AND metafields
    - Clean up related configurations
    - Handle cascade deletes properly
  - [ ] 2.8 Create `app/routes/api.admin.metafields.sync.tsx` manual sync endpoint
    - GET/POST handler to manually trigger sync
    - Read all products with ringbuilder metafields
    - Update app database with metafield data
    - Return sync summary (products synced, errors)
  - [ ] 2.9 **Validate Task 2.0 Completion**
    - Run `npm run typecheck && npm run lint && npm run build` (all must pass)
    - Test metafield definitions creation (check in Shopify admin)
    - Test write/read metafields (create test product, add specs, verify in Shopify)
    - Test webhook sync (update product in Shopify, verify app database updates)
    - Test manual sync endpoint (trigger sync, verify results)
    - Review: All 2.x sub-tasks completed ✅

- [ ] **3.0 Admin Product Management UI Enhancements**
  - [ ] 3.1 Create `app/components/admin/IconShapeSelector.tsx`
    - Display 10 shape icons in grid layout
    - Support single-select mode
    - Highlight selected shape (border + background color)
    - Mobile-responsive (2-5 columns based on screen size)
    - Props: `selected`, `onChange`, `shapes` array
  - [ ] 3.2 Create `app/components/admin/AddDiamondModal.tsx`
    - Modal component with form for diamond specs
    - Product preview section (image, title, price from Shopify)
    - Icon-based shape selector (use IconShapeSelector component)
    - Carat weight number input with validation (0.01 - 50.00 range)
    - Cut dropdown (Excellent, Very Good, Good, Fair, Poor)
    - Color dropdown (D, E, F, G, H, I, J, K, L, M)
    - Clarity dropdown (FL, IF, VVS1, VVS2, VS1, VS2, SI1, SI2, I1, I2, I3)
    - Diamond Type radio buttons (Mined, Lab Grown, Fancy Color)
    - Certificate dropdown (GIA, AGS, IGI, None)
    - Certificate number text input
    - Certificate URL input (file upload OR URL paste)
    - Advanced specs accordion (measurements, table%, depth%, polish, symmetry, fluorescence)
    - Form validation (required fields: shape, carat, diamond_type)
    - Submit handler calls API endpoint
    - Success/error message display
  - [ ] 3.3 Create `app/components/admin/AddSettingModal.tsx`
    - Modal component with form for setting specs
    - Product preview section
    - Style dropdown (Solitaire, Halo, Three Stone, Vintage, etc.)
    - Compatible shapes multi-select with icons (checkboxes)
    - Setting height dropdown (Low, Medium, High, optional)
    - Metal pricing table component (MetalPricingTable)
    - Featured checkbox
    - Form validation (required: style, compatible_shapes, metal_prices)
    - Submit handler
    - Success/error feedback
  - [ ] 3.4 Create `app/components/admin/MetalPricingTable.tsx`
    - Table with 7 rows (one per metal type)
    - Currency inputs for each metal
    - Metal type labels with color indicators
    - Validation (all prices >= 0)
    - Props: `prices` object, `onChange` handler
  - [ ] 3.5 Create `app/components/admin/ProductDashboard.tsx`
    - Enhanced product list with status indicators
    - Three status badges: ✓ Active (complete), ⚠ Incomplete (missing data), ○ Unmarked
    - Product cards with larger images (150x150px)
    - Display key metadata for marked products (e.g., "Mined, Round, 1.50ct")
    - Action buttons: "Add as Diamond", "Add as Setting", "Edit Specs", "Remove"
    - Search and filter controls
    - Pagination controls
    - "Sync from Shopify" button (triggers manual sync)
  - [ ] 3.6 Modify `app/routes/app.builder.products.tsx`
    - Replace existing UI with ProductDashboard component
    - Add modal state management (which modal is open)
    - Pass product data to modals
    - Handle modal open/close
    - Refresh data after successful save
  - [ ] 3.7 Update CSV import UI (move to "Advanced Tools" section)
    - Create collapsible "Advanced Tools" section in ProductDashboard
    - Move CSV import button inside advanced section
    - Add warning: "For bulk operations only (100+ products)"
    - Keep existing CSV functionality but hide by default
  - [ ] 3.8 Create `app/components/admin/InquiryDashboard.tsx`
    - List all customer inquiries with filters
    - Group by type (Hint, Info, Viewing, Email)
    - Status filter (New, Contacted, Closed)
    - Date range filter
    - Inquiry cards showing: type icon, customer info, ring details, message preview
    - Actions: View Details, Mark Read, Mark Contacted, Mark Closed
    - "Reply to Customer" button (opens email client)
  - [ ] 3.9 Create new admin route `app/routes/app.builder.inquiries.tsx`
    - Loader fetches inquiries from database
    - Renders InquiryDashboard component
    - Add to admin navigation
  - [ ] 3.10 **Validate Task 3.0 Completion**
    - Run `npm run typecheck && npm run lint && npm run build` (all must pass)
    - Test admin UI loads without errors
    - Test "Add as Diamond" modal (open, fill form, save, verify metafields + db)
    - Test "Add as Setting" modal (same flow)
    - Verify product dashboard shows correct status indicators
    - Test edit functionality (modify existing specs)
    - Verify CSV import still works (in Advanced Tools section)
    - Review: All 3.x sub-tasks completed ✅

### Phase 2.2: Visual Enhancements (Weeks 3-4)

- [ ] **4.0 Customer Visual Enhancements (Icons, Tabs, Grid View)**
  - [ ] 4.1 Create icon assets
    - Source or create 9 SVG icons for setting styles (save to `public/icons/styles/`)
    - Source or create 10 SVG icons for diamond shapes (save to `public/icons/shapes/`)
    - Optimize SVGs (remove unnecessary data, < 10KB each)
    - Create icon sprite or individual files
    - Test icons at different sizes (32px, 64px, 128px)
  - [ ] 4.2 Create `app/components/builder/IconFilter.tsx` reusable component
    - Props: `items` (array), `selected` (array or single), `onChange`, `multiSelect` (boolean), `iconType` (style/shape)
    - Renders icon grid with labels
    - Handles selection state (border highlight)
    - Mobile-responsive (2-5 columns)
    - Accessibility: aria-labels, keyboard navigation
    - Animation on selection (smooth transition)
  - [ ] 4.3 Create `app/components/builder/DiamondTypeTabs.tsx`
    - Three tabs: Mined, Lab Grown, Fancy Color
    - Tab component with count badges
    - Active tab styling (burgundy #6D2932)
    - Inactive tab styling (light gray)
    - Click handler updates active tab
    - Props: `activeType`, `onTypeChange`, `counts` object
    - Mobile-responsive (full-width tabs)
  - [ ] 4.4 Create `app/components/builder/StoneGridView.tsx`
    - Grid layout (2-4 columns responsive)
    - Stone card component showing:
      - Image (or placeholder)
      - Shape badge
      - Carat weight
      - "Cut, Color, Clarity" summary line
      - Price
      - Certificate badge (e.g., "GIA")
      - Checkbox for comparison
      - "View Details" button
    - Lazy loading for images
    - Hover effects
    - Mobile-optimized (1-2 columns)
  - [ ] 4.5 Create `app/components/builder/ViewModeToggle.tsx`
    - Toggle button with two states: Grid, List
    - Icons for each mode (grid icon, list icon)
    - Active state highlighting
    - Persist preference to localStorage
    - Props: `viewMode`, `onViewModeChange`
  - [ ] 4.6 Create `app/components/builder/RecordsPerPageSelector.tsx`
    - Dropdown with options: 12, 20, 50, 100
    - Default: 20
    - Persist preference to localStorage
    - Update pagination when changed
    - Props: `perPage`, `onChange`, `totalCount`
  - [ ] 4.7 Create `app/components/builder/SKUSearchField.tsx`
    - Text input with search icon
    - Placeholder: "Search Diamond Stock #"
    - Search button or Enter key trigger
    - Clear button (X icon)
    - Loading state while searching
    - "No results" message
    - Props: `onSearch`, `isLoading`
  - [ ] 4.8 Modify `app/components/builder/StoneFilters.tsx`
    - Replace text-based shape filter with IconFilter component
    - Add DiamondTypeTabs at top of filters
    - Keep existing filters (carat, cut, color, clarity sliders/dropdowns)
    - Update filter state to include `diamondType`
    - Update styling to match GemFind (burgundy accents)
  - [ ] 4.9 Modify `app/components/builder/steps/StoneSelector.tsx`
    - Integrate DiamondTypeTabs component
    - Add ViewModeToggle (Grid/List)
    - Add RecordsPerPageSelector
    - Add SKUSearchField
    - Conditionally render StoneGridView or StoneTable based on view mode
    - Add results summary (e.g., "6,869 Similar Diamonds")
    - Update state management for new filters
  - [ ] 4.10 Modify `app/routes/api.builder.stones.tsx` API endpoint
    - Add `diamondType` query parameter
    - Add `sku` query parameter for SKU search
    - Add `perPage` query parameter (12, 20, 50, 100)
    - Update database query to filter by diamondType
    - Implement SKU search (search by productId)
    - Return diamond type counts for tab badges
    - Update response format to include counts
  - [ ] 4.11 **Validate Task 4.0 Completion**
    - Run `npm run typecheck && npm run lint && npm run build` (all must pass)
    - Test icon filters display correctly (desktop & mobile)
    - Test diamond type tabs switch and filter correctly
    - Verify tab count badges show accurate numbers
    - Test grid view displays properly (responsive columns)
    - Test view mode toggle (Grid ↔ List) and localStorage persistence
    - Test records per page selector changes results
    - Test SKU search finds correct diamond
    - Verify all icons load and are < 10KB each
    - Review: All 4.x sub-tasks completed ✅

- [ ] **9.0 Enhanced Product Detail Pages** (moved up to Phase 2.2 for UI continuity)
  - [ ] 9.1 Create `app/components/builder/ImageGallery.tsx`
    - Main image display (large, zoomable)
    - Thumbnail strip (4-6 thumbnails)
    - Click thumbnail to change main image
    - Zoom on hover or click (desktop)
    - Swipe gestures (mobile)
    - 360° viewer integration (if video available)
    - Lightbox mode for full-screen view
  - [ ] 9.2 Create `app/components/builder/SpecificationPanel.tsx`
    - Two-column specs table
    - Diamond specs: Carat, Cut, Color, Clarity, Certificate, Measurements, Table%, Depth%, Polish, Symmetry, Fluorescence
    - Setting specs: Style, Metal options, Compatible shapes, Setting height
    - Responsive (single column on mobile)
    - Certificate number as clickable link (if certificate_url exists)
  - [ ] 9.3 Create `app/components/builder/CertificateViewer.tsx`
    - Modal or inline PDF viewer
    - "View Certificate" button/link
    - Opens certificate_url in iframe or new tab
    - Fallback if PDF can't be embedded
    - Mobile-friendly (download option)
  - [ ] 9.4 Create `app/components/builder/ProductDetailPage.tsx` layout component
    - Two-column layout (image left, info right)
    - Responsive (stacked on mobile)
    - Props: `product`, `type` (setting or diamond), `onActionClick`
    - Integrates ImageGallery, SpecificationPanel, ActionButtonGroup
    - Price display with metal type selector (for settings)
    - Breadcrumb navigation
  - [ ] 9.5 Create `app/routes/builder.setting.$id.tsx` route
    - Loader fetches setting by ID (from database + Shopify)
    - Renders ProductDetailPage with setting data
    - Handles metal type selection (updates price display)
    - "Add Your Diamond" button (proceeds to Step 2)
    - Action buttons (Virtual Try On, Request Info, Email Friend)
    - Social sharing buttons
    - SEO meta tags (Open Graph for sharing)
  - [ ] 9.6 Create `app/routes/builder.diamond.$id.tsx` route
    - Loader fetches diamond by ID
    - Renders ProductDetailPage with diamond data
    - Certificate viewer integration
    - "Add to Cart" button (if standalone purchase)
    - "Complete Your Ring" button (if from builder)
    - Action buttons (Drop Hint, Request Info, Email Friend, Schedule, Print)
    - Social sharing buttons
    - SEO meta tags
  - [ ] 9.7 Update routing in `app/routes.ts`
    - Add routes for `/builder/setting/:id` and `/builder/diamond/:id`
    - Ensure proper nesting and authentication
  - [ ] 9.8 **Validate Task 9.0 Completion**
    - Run `npm run typecheck && npm run lint && npm run build` (all must pass)
    - Test setting detail page loads (`/builder/setting/:id`)
    - Test diamond detail page loads (`/builder/diamond/:id`)
    - Verify image gallery works (thumbnails, zoom, swipe on mobile)
    - Test specification panel displays all data correctly
    - Test certificate viewer (if certificate_url present)
    - Verify detail pages are shareable (Open Graph meta tags)
    - Test responsive design on mobile
    - Review: All 9.x sub-tasks completed ✅

### Phase 2.3: Engagement Features (Weeks 5-6)

- [ ] **5.0 Diamond Comparison Tool**
  - [ ] 5.1 Add comparison checkbox to stone cards/table rows
    - Modify StoneGridView to include checkbox
    - Modify StoneTable to include checkbox column
    - Checkbox state managed in parent component
    - Max 4 selections enforced
    - Visual feedback when max reached
  - [ ] 5.2 Create `app/components/builder/ComparisonFloatingButton.tsx`
    - Floating button (fixed position, bottom-right)
    - Shows count: "Compare Items (3)"
    - Only visible when 2+ diamonds selected
    - Click opens ComparisonModal
    - Animated entrance/exit
    - Mobile-optimized position
  - [ ] 5.3 Create `app/components/builder/ComparisonModal.tsx`
    - Full-screen modal with comparison table
    - Side-by-side columns (2-4 diamonds)
    - Responsive (horizontal scroll on mobile)
    - Rows: Image, Shape, Carat, Cut, Color, Clarity, Price, Certificate, Measurements, Table%, Depth%, Polish, Symmetry, Fluorescence
    - Highlight differences (yellow background)
    - "Best Value" indicator (lowest price per carat)
    - "Select This Diamond" button for each column
    - "Remove from comparison" button
    - Close button
  - [ ] 5.4 Create `app/utils/comparison-helpers.ts`
    - `detectDifferences(stones)` - Identifies which fields differ
    - `calculateBestValue(stones)` - Determines best price per carat
    - `formatComparisonData(stones)` - Transforms data for display
  - [ ] 5.5 Create `app/routes/api.builder.compare.tsx` API endpoint
    - POST handler accepts array of stone IDs
    - Fetches stone data from database
    - Returns comparison data with differences highlighted
    - Calculates best value
    - Validates input (2-4 stones only)
  - [ ] 5.6 Integrate comparison into StoneSelector
    - Add state for selected stones (array)
    - Render ComparisonFloatingButton when 2+ selected
    - Render ComparisonModal
    - Handle "Select This Diamond" action (closes modal, selects stone, proceeds)
    - Persist comparison selections in sessionStorage
  - [ ] 5.7 Add comparison persistence
    - Save selected stone IDs to sessionStorage on selection
    - Restore comparison state on page refresh
    - Clear on session end or manual clear
  - [ ] 5.8 **Validate Task 5.0 Completion**
    - Run `npm run typecheck && npm run lint && npm run build` (all must pass)
    - Test comparison checkboxes appear on stone cards/table
    - Test floating "Compare Items" button appears when 2+ selected
    - Test comparison modal opens and displays 2-4 diamonds correctly
    - Verify differences are highlighted (yellow background)
    - Verify "Best Value" indicator appears on lowest price/carat
    - Test "Select This Diamond" closes modal and proceeds to next step
    - Test comparison persists in sessionStorage after refresh
    - Review: All 5.x sub-tasks completed ✅

- [ ] **6.0 Save & Share Configuration System**
  - [ ] 6.1 Create `app/utils/share-helpers.ts`
    - `generateShareToken()` - Creates unique 8-12 character token (use nanoid)
    - `generateShareUrl(shop, token)` - Creates full shareable URL
    - `validateShareToken(token)` - Validates token format
  - [ ] 6.2 Create `app/routes/api.builder.save.tsx` API endpoint
    - POST handler accepts configuration data
    - Validates configuration (setting, stone, customization complete)
    - Generates unique share token
    - Saves configuration to database with status: "saved"
    - Updates Configuration.shareToken and savedAt fields
    - Returns share token and full URL
    - Handles errors (duplicate tokens, database failures)
  - [ ] 6.3 Create `app/routes/api.builder.saved.$token.tsx` API endpoint
    - GET handler accepts share token
    - Looks up configuration in database by shareToken
    - Fetches full setting and stone data
    - Recalculates price (in case prices changed)
    - Returns complete configuration object
    - Handles not found (404) and expired configurations
    - Increments view count (analytics)
  - [ ] 6.4 Create `app/services/email.server.ts` email service
    - Initialize email provider (SendGrid/AWS SES/Postmark based on env vars)
    - `sendEmail(to, subject, html, attachments?)` - Core send function
    - `sendShareEmail(config, recipientEmail, senderName, message)` - Share email
    - `sendHintEmail(config, recipientEmail, senderName, message, specialDate)` - Hint email (NO price)
    - `sendInfoRequestEmail(config, merchant, customer)` - Request info (to merchant)
    - `sendScheduleEmail(config, merchant, customer, preferredDate, preferredTime)` - Schedule viewing
    - Error handling and retry logic
    - Rate limiting prevention
  - [ ] 6.5 Create email templates in `app/templates/`
    - `email-share-configuration.html` - Share email with ring image and details
    - `email-drop-hint.html` - Hint email (romantic, no pricing)
    - `email-request-info.html` - Info request (to merchant)
    - `email-schedule-viewing.html` - Viewing request with iCal attachment
    - Use inline CSS (email compatibility)
    - Merchant logo placeholder
    - Mobile-responsive (max-width 600px)
    - Test rendering in multiple email clients
  - [ ] 6.6 Create `app/components/builder/ShareModal.tsx`
    - Modal with share options
    - Email share form (recipient email, your name, message)
    - Copy link button (copy to clipboard with success feedback)
    - Social sharing buttons (Facebook, Twitter, Pinterest)
    - Facebook: Opens Facebook Share Dialog (requires FB App ID)
    - Twitter: Opens Twitter post dialog with pre-filled text
    - Close button
    - Form validation
    - Submit handlers for each share method
  - [ ] 6.7 Create `app/routes/api.builder.share.tsx` API endpoint
    - POST handler with share method (email, facebook, twitter)
    - For email: validates recipient, sends via email service
    - For social: returns sharing URLs
    - Tracks share count (increment Configuration.shareCount)
    - Returns success/error status
  - [ ] 6.8 Add "Save Search" button to builder UI
    - Persistent button visible on all steps
    - Floating or in header
    - Click triggers save API call
    - Shows success modal with shareable URL
    - Copy to clipboard functionality
  - [ ] 6.9 Modify `app/components/builder/steps/Review.tsx`
    - Add "Share" button next to "Add to Cart"
    - Opens ShareModal on click
    - Pass current configuration to modal
    - Update layout to accommodate new buttons
  - [ ] 6.10 Create saved configuration loader route `app/routes/builder.saved.$token.tsx`
    - Loader fetches saved configuration by token
    - Pre-fills builder with saved data
    - Renders builder UI with all selections
    - Shows message: "Loading saved configuration..."
    - Handles invalid/expired tokens (redirect to builder home)
  - [ ] 6.11 **Validate Task 6.0 Completion**
    - Run `npm run typecheck && npm run lint && npm run build` (all must pass)
    - Test "Save Search" button generates shareable URL
    - Test copy to clipboard works
    - Test saved configuration loads from URL (all data pre-filled)
    - Test Share modal opens with all options
    - Test email share sends successfully (check inbox)
    - Test Facebook/Twitter share buttons open correct dialogs
    - Verify prices recalculate when loading saved config
    - Test email templates render correctly (check in email client)
    - Review: All 6.x sub-tasks completed ✅

- [ ] **7.0 Customer Engagement Features (Inquiry Forms & Actions)**
  - [ ] 7.1 Create `app/components/builder/ActionButtonGroup.tsx`
    - Four buttons: Drop A Hint, Request More Info, E-Mail A Friend, Schedule Viewing
    - Conditional Virtual Try-On button (if enabled in settings)
    - Icon + label for each button
    - Consistent styling (burgundy #6D2932)
    - Mobile: full-width stacked buttons
    - Desktop: horizontal row or 2x2 grid
    - Props: `configuration`, `onActionClick`, `vtoEnabled`
  - [ ] 7.2 Create `app/components/builder/InquiryModal.tsx` multi-purpose modal
    - Dynamic form based on inquiry type
    - Drop A Hint form: recipient email, your name, special date, message
    - Request Info form: your name, your email, phone, question/message
    - Email Friend form: friend name, friend email, message
    - Schedule Viewing form: name, email, phone, preferred date, preferred time, message
    - Form validation (different required fields per type)
    - Date picker for special date and viewing date
    - Time picker for viewing time
    - Submit handler calls inquiry API
    - Success/error messages
    - Close button
  - [ ] 7.3 Create `app/routes/api.builder.inquiry.tsx` API endpoint
    - POST handler accepts inquiry data
    - Validates based on type (required fields)
    - Saves to CustomerInquiry database table
    - Sends email based on type:
      - Drop Hint: to recipient (no pricing, romantic message)
      - Request Info: to merchant (customer contact + question)
      - Email Friend: to friend (full details with pricing)
      - Schedule: to merchant (with iCal attachment)
    - Returns success status and inquiry ID
  - [ ] 7.4 Create `app/services/inquiry.server.ts`
    - `createInquiry(data)` - Saves inquiry to database
    - `getInquiries(shop, filters)` - List inquiries with filtering
    - `updateInquiryStatus(id, status)` - Update inquiry status
    - `generateICalAttachment(date, time, customer, config)` - Creates .ics file for calendar
  - [ ] 7.5 Add iCal generation to Schedule Viewing email
    - Use ical-generator library
    - Create calendar event with:
      - Summary: "Ring Viewing - [Customer Name]"
      - Description: Configuration details
      - Start time: Preferred date/time
      - Duration: 1 hour (default)
      - Location: Store address (from AppSettings)
    - Attach .ics file to email
  - [ ] 7.6 Integrate ActionButtonGroup into detail pages
    - Add to ProductDetailPage component
    - Pass configuration context
    - Handle action clicks (open appropriate modal)
  - [ ] 7.7 Integrate ActionButtonGroup into Review step
    - Modify `app/components/builder/steps/Review.tsx`
    - Add action buttons below price summary
    - Include Save and Share buttons
    - Ensure mobile layout works well
  - [ ] 7.8 Create `app/routes/api.admin.inquiries.tsx` API endpoint
    - GET handler lists all inquiries for shop
    - Supports filtering by type, status, date range
    - Pagination (50 per page)
    - Returns inquiry data with related configuration info
  - [ ] 7.9 Create `app/routes/api.admin.inquiries.$id.tsx` API endpoint
    - PUT handler updates inquiry status
    - Validates status value (new, contacted, closed)
    - Returns updated inquiry
  - [ ] 7.10 Add inquiry notification email preferences to AppSettings
    - Add UI in settings page for notification email
    - Toggle for each inquiry type (enable/disable notifications)
    - Save to AppSettings.customerEngagement JSON field
  - [ ] 7.11 **Validate Task 7.0 Completion**
    - Run `npm run typecheck && npm run lint && npm run build` (all must pass)
    - Test all 4 action buttons appear on detail pages and Review step
    - Test Drop A Hint form submits and sends email (verify recipient receives, NO price shown)
    - Test Request Info form sends to merchant (verify merchant receives inquiry)
    - Test Email A Friend sends successfully
    - Test Schedule Viewing sends with iCal attachment (verify .ics file)
    - Test admin inquiry dashboard shows all inquiries
    - Test inquiry status updates work
    - Verify all inquiry emails render correctly in email clients
    - Review: All 7.x sub-tasks completed ✅

### Phase 2.4: Advanced Features (Week 7)

- [ ] **8.0 Virtual Try-On Integration**
  - [ ] 8.1 Create `app/components/builder/VirtualTryOnButton.tsx`
    - Button component with icon + label
    - Opens VTO experience based on integration type
    - Props: `productImage`, `productSku`, `integrationType`, `apiConfig`
    - Loading state while VTO loads
    - Error handling (service unavailable)
  - [ ] 8.2 Implement Option B: Simple Image Upload VTO
    - Create `app/components/builder/VTOImageUpload.tsx`
    - User uploads hand photo
    - Canvas-based image composition (overlay ring on hand)
    - Adjustable positioning (drag/resize)
    - Download composed image button
    - Simple, no API dependencies
  - [ ] 8.3 (Optional) Implement Option A: Third-Party API Integration
    - Create `app/services/vto.server.ts` proxy service
    - Integrate with Dor Technologies or GemFind VTO API
    - Handle API authentication
    - Pass product image URL and SKU
    - Display VTO in iframe or modal
    - Track usage
  - [ ] 8.4 Add VTO settings to AppSettings admin UI
    - Enable/Disable VTO toggle
    - Integration type selector (None, Simple Upload, Third-Party API, AR Quick Look)
    - API credentials input (conditional on type)
    - Custom button label input
    - Test button (verify integration works)
  - [ ] 8.5 Integrate VTO button into ProductDetailPage
    - Add VirtualTryOnButton to action buttons
    - Only show if VTO enabled in AppSettings
    - Pass product data to VTO component
  - [ ] 8.6 Add VTO analytics tracking
    - Track button clicks (AnalyticsEvent table)
    - Track VTO completions
    - Add to admin analytics dashboard (future use)
  - [ ] 8.7 **Validate Task 8.0 Completion**
    - Run `npm run typecheck && npm run lint && npm run build` (all must pass)
    - Test VTO button appears (if enabled in settings)
    - Test VTO button hidden (if disabled in settings)
    - Test simple image upload VTO works (upload photo, overlay ring, download)
    - Test VTO settings in admin (enable/disable, integration type selection)
    - Verify VTO analytics tracking records usage
    - Test on mobile devices (image upload works)
    - Review: All 8.x sub-tasks completed ✅

### Phase 2.3 Continued: Engagement Features (Weeks 5-6)

- [ ] **10.0 Performance Optimization & Caching** (addressed throughout development)
  - [ ] 10.1 Implement browser-level caching
    - Cache filter options in localStorage (24-hour TTL)
    - Cache user preferences (view mode, records per page) permanently
    - Cache comparison selections in sessionStorage (session only)
    - Implement cache invalidation on data changes
  - [ ] 10.2 Optimize image loading
    - Implement lazy loading for product images (use loading="lazy" attribute)
    - Optimize icon SVGs (gzip, remove unnecessary metadata)
    - Use WebP format where supported (with fallbacks)
    - Implement image CDN caching headers
  - [ ] 10.3 Optimize API queries
    - Add database indexes (verify from migrations in 1.1)
    - Implement query result caching (in-memory or Redis if needed)
    - Use select queries (don't fetch unnecessary fields)
    - Paginate large result sets
  - [ ] 10.4 Implement React component optimizations
    - Add React.memo to expensive components (StoneCard, ComparisonModal)
    - Use useMemo for derived data (filter results, price calculations)
    - Use useCallback for event handlers
    - Implement virtualized lists for 100+ items (react-window or react-virtualized)
  - [ ] 10.5 Bundle size optimization
    - Code splitting for modals (dynamic imports)
    - Tree-shaking unused dependencies
    - Analyze bundle with Vite's build analyzer
    - Target: < 200KB initial bundle (gzipped)
  - [ ] 10.6 Debounce search inputs
    - Add 300ms debounce to SKU search
    - Add 500ms debounce to text search
    - Prevent excessive API calls
  - [ ] 10.7 Performance testing
    - Test with 1,000 products in database
    - Test with 10,000 products (stress test)
    - Measure API response times (target < 500ms)
    - Measure page load times (target < 3s)
    - Test on 3G network (mobile simulation)
  - [ ] 10.8 **Validate Task 10.0 Completion**
    - Run `npm run typecheck && npm run lint && npm run build` (all must pass)
    - Run Lighthouse audit (verify 90+ performance score)
    - Verify API response times < 500ms (check all endpoints)
    - Verify page load times < 3s (check all pages)
    - Check bundle size < 200KB (gzipped)
    - Test with 1000+ products (performance acceptable)
    - Test localStorage and sessionStorage caching works
    - Verify lazy loading for images
    - Review: All 10.x sub-tasks completed ✅

### Phase 2.5: Testing & Launch (Week 8)

- [ ] **11.0 Testing, Migration & Documentation**
  - [ ] 11.1 Write migration script for Phase 1.0 → Phase 2.0
    - Script: `prisma/scripts/migrate-to-phase-2.ts`
    - Read existing StoneMetadata records
    - Set diamondType = "mined" for all (default)
    - Write all existing data to Shopify metafields
    - Create metafield definitions if not exist
    - Handle errors gracefully
    - Dry-run mode for testing
    - Progress logging
  - [ ] 11.2 Create comprehensive end-to-end test suite
    - Test admin product setup flow (mark → add specs → save)
    - Test metafields sync (update in Shopify → syncs to app)
    - Test customer builder flow (select → filter → compare → save → share)
    - Test email sending (all 4 types)
    - Test saved configuration loading
    - Test inquiry submission and merchant notification
    - Test mobile responsive design
  - [ ] 11.3 Create unit tests for new services
    - `metafields.server.test.ts` - Test metafield CRUD operations
    - `email.server.test.ts` - Test email sending (mock email service)
    - `inquiry.server.test.ts` - Test inquiry creation and management
    - `comparison-helpers.test.ts` - Test comparison logic
    - `share-helpers.test.ts` - Test token generation and validation
  - [ ] 11.4 Create integration tests for new API endpoints
    - Test `/api/admin/products/:id/metadata` with metafields write
    - Test `/api/builder/save` and `/api/builder/saved/:token`
    - Test `/api/builder/compare`
    - Test `/api/builder/inquiry`
    - Test `/api/builder/share`
  - [ ] 11.5 Mobile testing
    - Test on iPhone (Safari)
    - Test on Android (Chrome)
    - Test tablet (iPad)
    - Verify touch targets (min 44x44px)
    - Test gestures (swipe, pinch-zoom)
    - Verify all modals work on mobile
  - [ ] 11.6 Accessibility testing
    - Test keyboard navigation (Tab, Enter, Space)
    - Test screen reader compatibility (VoiceOver, NVDA)
    - Verify ARIA labels on all interactive elements
    - Check color contrast ratios (WCAG AA)
    - Test focus indicators
  - [ ] 11.7 Performance audit
    - Run Lighthouse audit (target: 90+ performance score)
    - Check Core Web Vitals (LCP, FID, CLS)
    - Analyze bundle size
    - Test API response times under load
    - Memory leak testing
  - [ ] 11.8 Update documentation
    - Update `README.md` with Phase 2.0 features
    - Create `docs/PHASE_2_SETUP.md` merchant setup guide
    - Create `docs/PHASE_2_ADMIN_GUIDE.md` admin UI guide
    - Create `docs/METAFIELDS_ARCHITECTURE.md` technical documentation
    - Update `docs/API_TESTING.md` with new endpoints
    - Create migration guide (`docs/MIGRATION_PHASE_1_TO_2.md`)
  - [ ] 11.9 Create beta testing plan
    - Identify 2-3 beta merchant stores
    - Prepare beta testing checklist
    - Set up feedback collection form
    - Plan staged rollout (staging → beta → production)
  - [ ] 11.10 Security audit
    - Review authentication on all new endpoints
    - Validate input sanitization (prevent XSS, SQL injection)
    - Check rate limiting on inquiry endpoints
    - Review email service security (prevent abuse)
    - Audit metafield permissions (admin access only)
  - [ ] 11.11 **Validate Task 11.0 Completion (FINAL VALIDATION)**
    - Run `npm run typecheck && npm run lint && npm run build` (all must pass ✅)
    - Execute complete end-to-end test suite (all tests pass)
    - Run migration script on test database (verify success)
    - Complete mobile testing checklist (iPhone, Android, iPad)
    - Complete accessibility testing (keyboard nav, screen reader, WCAG AA)
    - Run performance audit (Lighthouse 90+, API < 500ms, Page < 3s)
    - Verify all documentation updated
    - Complete security audit checklist
    - Test beta merchant onboarding (full flow from install to first order)
    - **FINAL CHECK:** All 11.x sub-tasks completed ✅
    - **Phase 2.0 LAUNCH READY** 🚀

---

## Additional Implementation Notes

### Development Best Practices

1. **Git Workflow:**
   - Create feature branch for each parent task (e.g., `feature/2.0-metafields-integration`)
   - Commit after each sub-task completion
   - Pull request reviews before merging to main
   - Squash commits for clean history

2. **Code Quality:**
   - TypeScript strict mode (no any types where possible)
   - ESLint passes with no errors
   - Prettier formatting applied
   - Component props documented (TSDoc comments)
   - Reusable components extracted (DRY principle)

3. **Testing Strategy:**
   - Write tests alongside feature development (not after)
   - Test edge cases (empty states, error states)
   - Mock external services (email, Shopify API)
   - Integration tests for critical flows
   - Manual testing on staging environment

4. **Database Migrations:**
   - Never edit existing migrations (create new ones)
   - Test migrations with rollback
   - Back up production data before running
   - Use transactions where possible

5. **API Design:**
   - RESTful conventions
   - Proper HTTP status codes (200, 201, 400, 404, 500)
   - Consistent error response format
   - Request/response validation
   - API versioning consideration (future)

6. **UI/UX Implementation:**
   - Mobile-first responsive design
   - Loading states for all async operations
   - Error states with helpful messages
   - Success feedback (toasts, modals, inline messages)
   - Consistent spacing and typography (design system)

### Environment Variables Needed

```bash
# Email Service (choose one)
SENDGRID_API_KEY=your_key_here
# OR
AWS_SES_ACCESS_KEY=your_key_here
AWS_SES_SECRET_KEY=your_key_here
# OR
POSTMARK_API_KEY=your_key_here

# Social Sharing (optional)
FACEBOOK_APP_ID=your_app_id_here

# Virtual Try-On (optional, if using third-party)
VTO_API_KEY=your_vto_key_here
VTO_API_URL=https://api.vto-provider.com

# Email Configuration
EMAIL_FROM_ADDRESS=noreply@merchant-store.com
EMAIL_FROM_NAME=Merchant Store Name
MERCHANT_EMAIL=merchant@store.com
```

### Dependencies to Install

Run after completing task 1.0:

```bash
npm install react-icons @sendgrid/mail nanoid ical-generator react-image-gallery
```

Optional (for advanced features):

```bash
npm install react-window  # For virtualized lists (if needed for large catalogs)
npm install date-fns  # For date formatting
npm install validator  # For email/phone validation
```

---

## Task Completion Criteria

Each task is considered complete when:

- ✅ Code implemented and committed
- ✅ TypeScript errors resolved
- ✅ ESLint passes
- ✅ Manual testing completed
- ✅ Unit tests written (where applicable)
- ✅ Documentation updated (inline comments, README if needed)
- ✅ PR reviewed and merged

---

## Estimated Effort

**Task 1.0:** 3-4 days (schema design is critical)  
**Task 2.0:** 5-7 days (metafields integration is complex)  
**Task 3.0:** 7-10 days (significant UI work)  
**Task 4.0:** 8-10 days (many visual components)  
**Task 5.0:** 4-5 days (comparison logic + UI)  
**Task 6.0:** 5-7 days (save/share + email integration)  
**Task 7.0:** 6-8 days (4 inquiry types + forms)  
**Task 8.0:** 3-5 days (depends on VTO option chosen)  
**Task 9.0:** 5-7 days (detail pages + image gallery)  
**Task 10.0:** 3-5 days (optimization ongoing throughout)  
**Task 11.0:** 5-7 days (testing and migration)

**Total:** 54-75 working days (~8-10 weeks with 2-3 developers working in parallel)

---

## Parallel Work Opportunities

**Developer 1:** Tasks 1.0, 2.0, 3.0 (Backend + Admin)  
**Developer 2:** Tasks 4.0, 9.0 (Customer UI)  
**Developer 3:** Tasks 5.0, 6.0, 7.0 (Features)

Then converge:
**All Developers:** Tasks 8.0, 10.0, 11.0 (Final features, optimization, testing)

---

## Risk Mitigation

**High-Risk Areas:**

1. Metafields integration (Task 2.0) - Test thoroughly, have rollback plan
2. Email deliverability (Tasks 6.0, 7.0) - Use reputable service, monitor bounce rates
3. Migration script (Task 11.1) - Test on staging with production data copy
4. Performance with large catalogs (Task 10.0) - Load test early

**Mitigation Strategies:**

- Early prototyping of risky features
- Staging environment testing
- Beta merchant testing before full rollout
- Feature flags for gradual rollout
- Monitoring and alerting setup

---

**END OF TASK LIST**

**Total Tasks:** 11 parent tasks, 98 sub-tasks (including 11 validation sub-tasks)  
**Total Files:** ~52 files (40 new, 12 modified)  
**Status:** ✅ Ready for development

**Validation Approach:** Each parent task includes a final validation sub-task that ensures quality standards before proceeding to the next task.

**Next Step:** Begin Task 1.0 - Database Schema & Metafields Foundation
