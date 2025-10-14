# Task List: Phase 2.0 - GemFind Feature Parity

**Source PRD:** `0002-prd-gemfind-feature-parity.md`  
**Project:** Ring Builder - Shopify App  
**Phase:** 2.0 (Enhancement)  
**Timeline:** 8 weeks  
**Status:** Ready for Implementation

---

## Relevant Files

### Database & Schema

- `prisma/schema.prisma` - Add new fields to existing models, create new models (SavedConfiguration, CustomerInquiry)
- `prisma/migrations/` - New migrations for Phase 2.0 schema changes

### Services

- `app/services/product.server.ts` - Add diamond type filtering, SKU search, comparison data fetching
- `app/services/configuration.server.ts` - Add save/share functionality, shareable URL generation
- `app/services/email.server.ts` - NEW: Email service for all 4 email templates
- `app/services/inquiry.server.ts` - NEW: Customer inquiry management service
- `app/services/vto.server.ts` - NEW: Virtual Try-On integration service (optional)

### API Routes - Public (Customer-Facing)

- `app/routes/api.builder.save.tsx` - NEW: Save configuration and generate share URL
- `app/routes/api.builder.saved.$token.tsx` - NEW: Load saved configuration by token
- `app/routes/api.builder.share.tsx` - NEW: Share configuration via email/social
- `app/routes/api.builder.inquiry.tsx` - NEW: Submit customer inquiries
- `app/routes/api.builder.product.$id.tsx` - NEW: Get detailed product info
- `app/routes/api.builder.compare.tsx` - NEW: Compare multiple diamonds
- `app/routes/api.builder.stones.tsx` - MODIFY: Add diamond type filtering, records per page

### API Routes - Admin (Authenticated)

- `app/routes/api.admin.inquiries.tsx` - NEW: List customer inquiries
- `app/routes/api.admin.inquiries.$id.tsx` - NEW: Update inquiry status
- `app/routes/api.admin.saved-configs.tsx` - NEW: List saved configurations
- `app/routes/api.admin.icons.upload.tsx` - NEW: Upload custom filter icons

### Frontend Routes (Storefront)

- `app/routes/builder.saved.$token.tsx` - NEW: Load saved configuration page
- `app/routes/builder.setting.$id.tsx` - NEW: Setting detail page
- `app/routes/builder.diamond.$id.tsx` - NEW: Diamond detail page

### Admin Routes

- `app/routes/app.builder.inquiries.tsx` - NEW: Inquiry management page
- `app/routes/app.builder.saved-configs.tsx` - NEW: Saved configurations management

### Components (40+ new/modified)

- See detailed component list in Relevant Files section above

### Utilities & Types

- `app/utils/constants.ts` - MODIFY: Add new constants
- `app/utils/icons.ts` - NEW: Default icon sets
- `app/utils/email-templates.ts` - NEW: Email generators
- `app/utils/share-helpers.ts` - NEW: Social sharing helpers
- `app/utils/url-helpers.ts` - NEW: Share token generation
- `app/types/builder.ts` - MODIFY: Add new types

### Assets

- `public/icons/settings/` - NEW: 9 setting style icons
- `public/icons/shapes/` - NEW: 10 stone shape icons

---

## Tasks

### **1.0 Database Schema Updates & Migrations** (Weeks 1-2, FR-14, FR-16, FR-17)

#### 1.1 Modify Existing Models

- [ ] **1.1.1** Open `prisma/schema.prisma` file
- [ ] **1.1.2** Locate StoneMetadata model
- [ ] **1.1.3** Add `diamondType String` field after `stoneType` field (default: "mined")
- [ ] **1.1.4** Add `certificateUrl String?` field after `certificateNumber` (nullable for backward compatibility)
- [ ] **1.1.5** Add index for diamondType: `@@index([shop, diamondType])` for tab count queries
- [ ] **1.1.6** Locate Configuration model
- [ ] **1.1.7** Add `shareToken String? @unique` field (for shareable URLs)
- [ ] **1.1.8** Add `shareCount Int @default(0)` field (tracks share events)
- [ ] **1.1.9** Add `savedAt DateTime?` field (when saved vs completed)
- [ ] **1.1.10** Add index on shareToken: `@@index([shareToken])` for URL lookups
- [ ] **1.1.11** Locate AppSettings model
- [ ] **1.1.12** Add `customerEngagement String?` JSON field (action button config)
- [ ] **1.1.13** Add `virtualTryOn String?` JSON field (VTO provider, API keys)
- [ ] **1.1.14** Add `socialSharing String?` JSON field (Facebook, Twitter, Pinterest config)
- [ ] **1.1.15** Add `customIcons String?` JSON field (custom icon URLs)

#### 1.2 Create New Models

- [ ] **1.2.1** Add SavedConfiguration model at end of schema file
- [ ] **1.2.2** Add fields: `id String @id @default(cuid())`
- [ ] **1.2.3** Add field: `configurationId String @unique` (references Configuration)
- [ ] **1.2.4** Add field: `shareToken String @unique` (short slug for URL)
- [ ] **1.2.5** Add field: `views Int @default(0)` (track how many times accessed)
- [ ] **1.2.6** Add field: `createdAt DateTime @default(now())`
- [ ] **1.2.7** Add field: `expiresAt DateTime?` (optional expiration, 90 days default)
- [ ] **1.2.8** Add index: `@@index([shareToken])` for fast URL lookups
- [ ] **1.2.9** Add index: `@@index([configurationId])` for reverse lookups
- [ ] **1.2.10** Add CustomerInquiry model after SavedConfiguration
- [ ] **1.2.11** Add fields: `id String @id @default(cuid())`
- [ ] **1.2.12** Add field: `shop String` (multi-tenant isolation)
- [ ] **1.2.13** Add field: `type String` (values: "hint", "info", "viewing", "email")
- [ ] **1.2.14** Add field: `configurationId String?` (optional reference to configuration)
- [ ] **1.2.15** Add field: `productId String?` (setting or stone ID for standalone inquiries)
- [ ] **1.2.16** Add fields: `customerName String?`, `customerEmail String`, `customerPhone String?`
- [ ] **1.2.17** Add fields: `message String?`, `preferredDate DateTime?`, `preferredTime String?`
- [ ] **1.2.18** Add field: `status String @default("new")` (values: "new", "contacted", "closed")
- [ ] **1.2.19** Add field: `createdAt DateTime @default(now())`
- [ ] **1.2.20** Add indexes: `@@index([shop, type])`, `@@index([shop, status])`, `@@index([createdAt])`

#### 1.3 Create & Apply Migration

- [ ] **1.3.1** Run `npx prisma migrate dev --name phase_2_gemfind_parity` to create migration
- [ ] **1.3.2** Review generated migration SQL file for correctness
- [ ] **1.3.3** Verify all indexes are created in migration
- [ ] **1.3.4** Test migration on fresh database (drop and recreate to ensure clean state)
- [ ] **1.3.5** Run `npx prisma generate` to update Prisma Client types
- [ ] **1.3.6** Verify TypeScript types generated correctly for new fields and models
- [ ] **1.3.7** Create data migration script to set existing StoneMetadata.diamondType = "mined"
- [ ] **1.3.8** Test migration rollback: `npx prisma migrate reset` (ensure reversibility)
- [ ] **1.3.9** Test database queries with new fields (create, read, update, delete)
- [ ] **1.3.10** Verify multi-tenant isolation: queries on SavedConfiguration and CustomerInquiry filter by shop
- [ ] **1.3.11** Document migration in `/docs/PHASE_2_MIGRATION.md` with step-by-step guide
- [ ] **1.3.12** Add migration notes to CHANGELOG.md

---

### **2.0 Visual Enhancements - Icon Filters & Diamond Type Tabs** (Weeks 1-2, FR-13, FR-14)

#### 2.1 Create Default Icon Assets

- [ ] **2.1.1** Create directory structure: `public/icons/settings/`, `public/icons/shapes/`
- [ ] **2.1.2** Source or design 9 setting style icons (SVG format, 64x64px): halo.svg, solitaire.svg, three-stone.svg, single-row.svg, trellis.svg, multi-row.svg, vintage.svg, pave.svg, bypass.svg
- [ ] **2.1.3** Source or design 10 stone shape icons (SVG format, 64x64px): round.svg, radiant.svg, princess.svg, pear.svg, oval.svg, marquise.svg, heart.svg, emerald.svg, cushion.svg, asscher.svg
- [ ] **2.1.4** Optimize all SVG icons: remove unnecessary metadata, minify
- [ ] **2.1.5** Create @2x versions for retina displays (128x128px) if using PNG
- [ ] **2.1.6** Ensure all icons have transparent backgrounds
- [ ] **2.1.7** Verify icons are black line art style (consistent with design)
- [ ] **2.1.8** Test icon display quality on different screen densities
- [ ] **2.1.9** Compress icons: ensure each file < 10KB
- [ ] **2.1.10** Add alt text descriptions for each icon in metadata

#### 2.2 Update Constants & Utilities

- [ ] **2.2.1** Open `app/utils/constants.ts`
- [ ] **2.2.2** Add DIAMOND_TYPES constant: `[{ value: "mined", label: "Mined" }, { value: "lab_grown", label: "Lab Grown" }, { value: "fancy_color", label: "Fancy Color" }]`
- [ ] **2.2.3** Add type: `type DiamondType = typeof DIAMOND_TYPES[number]["value"]`
- [ ] **2.2.4** Update SETTING_STYLES to include iconPath property for each style
- [ ] **2.2.5** Update STONE_SHAPES to include iconPath property for each shape
- [ ] **2.2.6** Create `app/utils/icons.ts` file
- [ ] **2.2.7** Implement getSettingStyleIcon() function: returns icon URL or custom URL from AppSettings
- [ ] **2.2.8** Implement getStoneShapeIcon() function: returns icon URL or custom URL
- [ ] **2.2.9** Implement preloadIcons() function: preload all icons for faster display
- [ ] **2.2.10** Add helper function: getDiamondTypeLabel() for display labels

#### 2.3 Create IconFilter Component

- [ ] **2.3.1** Create `app/components/builder/IconFilter.tsx` file
- [ ] **2.3.2** Define props interface: icon (string URL), label (string), selected (boolean), onClick (function), disabled (boolean optional)
- [ ] **2.3.3** Render structure: container div with icon img and label text
- [ ] **2.3.4** Add default styling: flex column, align center, padding, cursor pointer
- [ ] **2.3.5** Add selected state styling: burgundy border (#6D2932, 3px solid), box-shadow
- [ ] **2.3.6** Add hover state (when not disabled): light gray background (#F7F7F7)
- [ ] **2.3.7** Add disabled state: opacity 0.5, cursor not-allowed
- [ ] **2.3.8** Ensure minimum touch target: 64px x 80px (icon + label)
- [ ] **2.3.9** Add onClick handler with disabled check
- [ ] **2.3.10** Implement keyboard accessibility: onKeyDown for Enter and Space keys
- [ ] **2.3.11** Add aria-label: `${label} filter, ${selected ? 'selected' : 'not selected'}`
- [ ] **2.3.12** Add role="button" and tabIndex={0} for keyboard navigation
- [ ] **2.3.13** Add transition animations: border color, background (0.2s ease)
- [ ] **2.3.14** Optimize icon img loading: use loading="lazy" attribute
- [ ] **2.3.15** Test IconFilter component in isolation (Storybook optional or manual test page)

#### 2.4 Create DiamondTypeTabs Component

- [ ] **2.4.1** Create `app/components/builder/DiamondTypeTabs.tsx` file
- [ ] **2.4.2** Define props: activeTab (DiamondType), onTabChange (function), counts ({ mined: number, lab_grown: number, fancy_color: number })
- [ ] **2.4.3** Render 3 tabs: Mined, Lab Grown, Fancy Color
- [ ] **2.4.4** Display count badges: "Mined (6,869)" format
- [ ] **2.4.5** Style active tab: burgundy background (#6D2932), white text, no border-bottom
- [ ] **2.4.6** Style inactive tabs: white background, dark text (#202223), 1px border
- [ ] **2.4.7** Add hover state for inactive tabs: light gray background
- [ ] **2.4.8** Implement tab click handler: calls onTabChange with new tab value
- [ ] **2.4.9** Add smooth transition animation on tab change (background, color: 0.3s ease)
- [ ] **2.4.10** Add info icon with tooltip explaining each diamond type (optional)
- [ ] **2.4.11** Ensure tabs are responsive: stack on mobile (<600px width)
- [ ] **2.4.12** Add loading state while counts are being fetched (show spinner or "Loading...")
- [ ] **2.4.13** Handle zero counts gracefully: "Mined (0)" with disabled styling
- [ ] **2.4.14** Add accessibility: aria-selected, role="tablist", role="tab"
- [ ] **2.4.15** Test tab keyboard navigation (arrow keys to switch tabs)

#### 2.5 Integrate Icon Filters into Existing Components

- [ ] **2.5.1** Open `app/components/builder/FilterSidebar.tsx`
- [ ] **2.5.2** Import IconFilter component
- [ ] **2.5.3** Replace existing style FilterGroup with grid of IconFilter components
- [ ] **2.5.4** Map over SETTING_STYLES to render IconFilter for each style
- [ ] **2.5.5** Implement multi-select logic: allow multiple styles selected simultaneously
- [ ] **2.5.6** Update filter state when IconFilter clicked (add/remove from selected array)
- [ ] **2.5.7** Add "Clear All" button for style filters
- [ ] **2.5.8** Create responsive grid layout: 3 columns (>1024px), 2 columns (>768px), 1 column (mobile)
- [ ] **2.5.9** Open `app/components/builder/StoneFilters.tsx`
- [ ] **2.5.10** Import IconFilter component
- [ ] **2.5.11** Replace shape FilterGroup with grid of IconFilter components for shapes
- [ ] **2.5.12** Map over STONE_SHAPES to render IconFilter for each shape
- [ ] **2.5.13** Implement multi-select for shapes
- [ ] **2.5.14** Add "Clear Filters" button for all stone filters
- [ ] **2.5.15** Test icon filter selection and deselection
- [ ] **2.5.16** Test multi-select behavior (multiple icons highlighted)

#### 2.6 Backend Support for Diamond Type Filtering

- [ ] **2.6.1** Open `app/services/product.server.ts`
- [ ] **2.6.2** Modify getStones() function signature to accept diamondType filter
- [ ] **2.6.3** Add diamondType filter to where clause: `where.diamondType = filters.diamondType`
- [ ] **2.6.4** Create new function: getDiamondTypeCounts() - returns count for each type
- [ ] **2.6.5** Implement query: `prisma.stoneMetadata.groupBy({ by: ['diamondType'], where: { shop, available: true }, _count: true })`
- [ ] **2.6.6** Transform result to object: `{ mined: X, lab_grown: Y, fancy_color: Z }`
- [ ] **2.6.7** Optimize with caching: cache counts for 5 minutes (reduce DB queries)
- [ ] **2.6.8** Open `app/routes/api.builder.stones.tsx`
- [ ] **2.6.9** Extract `diamondType` query param from URL
- [ ] **2.6.10** Pass diamondType to getStones() function
- [ ] **2.6.11** Fetch diamond type counts: call getDiamondTypeCounts()
- [ ] **2.6.12** Include counts in API response: `{ stones, filters, pagination, counts }`
- [ ] **2.6.13** Test API with different diamondType values: mined, lab_grown, fancy_color
- [ ] **2.6.14** Test API returns correct counts for each type
- [ ] **2.6.15** Verify index on [shop, diamondType] improves query performance

#### 2.7 Integrate Diamond Type Tabs into StoneSelector

- [ ] **2.7.1** Open `app/components/builder/steps/StoneSelector.tsx`
- [ ] **2.7.2** Import DiamondTypeTabs component
- [ ] **2.7.3** Add state for active diamond type (default: "mined")
- [ ] **2.7.4** Fetch diamond type counts from API on component mount
- [ ] **2.7.5** Render DiamondTypeTabs above StoneFilters
- [ ] **2.7.6** Pass activeTab, onTabChange, and counts props
- [ ] **2.7.7** Implement onTabChange handler: updates filter state and refetches stones
- [ ] **2.7.8** Update builder context to store selected diamondType
- [ ] **2.7.9** Persist diamondType selection in localStorage
- [ ] **2.7.10** Add loading state while stones are being fetched after tab change
- [ ] **2.7.11** Reset pagination to page 1 when tab changes
- [ ] **2.7.12** Test tab switching: Mined → Lab Grown → Fancy Color
- [ ] **2.7.13** Verify stone results change based on active tab
- [ ] **2.7.14** Test with filters applied: changing tab maintains other filters (shape, carat, etc.)
- [ ] **2.7.15** Test count badges update when filters change

---

### **3.0 Advanced Browsing Features - Grid/List, Pagination, SKU Search** (Weeks 1-2, FR-19)

#### 3.1 Create View Mode Toggle Component

- [ ] **3.1.1** Create `app/components/builder/ViewModeToggle.tsx` file
- [ ] **3.1.2** Define props: viewMode ("grid" | "list"), onToggle (function)
- [ ] **3.1.3** Render two buttons: Grid icon button and List icon button
- [ ] **3.1.4** Use react-icons or custom SVG: BsGrid3x3 (grid), BsList (list)
- [ ] **3.1.5** Style active button: burgundy background (#6D2932), white icon
- [ ] **3.1.6** Style inactive button: white background, dark icon, border
- [ ] **3.1.7** Add click handlers to toggle view mode
- [ ] **3.1.8** Save viewMode to localStorage on change: `localStorage.setItem('rb_view_mode', mode)`
- [ ] **3.1.9** Add accessibility: aria-label="Switch to grid view", aria-pressed for active state
- [ ] **3.1.10** Test toggle functionality: clicking switches modes correctly

#### 3.2 Update Builder State Management

- [ ] **3.2.1** Open `app/components/builder/BuilderProvider.tsx`
- [ ] **3.2.2** Add viewMode state: `const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')`
- [ ] **3.2.3** Initialize viewMode from localStorage on mount
- [ ] **3.2.4** Add recordsPerPage state: `const [recordsPerPage, setRecordsPerPage] = useState(20)`
- [ ] **3.2.5** Initialize recordsPerPage from localStorage on mount
- [ ] **3.2.6** Add viewMode and setViewMode to context value
- [ ] **3.2.7** Add recordsPerPage and setRecordsPerPage to context value
- [ ] **3.2.8** Update context type definition in builder.ts
- [ ] **3.2.9** Test context updates propagate correctly to consuming components

#### 3.3 Create Stone Grid View Component

- [ ] **3.3.1** Create `app/components/builder/StoneGridView.tsx` file
- [ ] **3.3.2** Define props: stones (array), onSelectStone (function), onViewDetails (function)
- [ ] **3.3.3** Create stone card component (can be internal or separate file)
- [ ] **3.3.4** Card structure: image (top), shape badge, carat, specs line, price, certificate badge, buttons
- [ ] **3.3.5** Display stone image with fallback diamond icon if no image
- [ ] **3.3.6** Add shape badge (top-left corner): "Round", "Princess", etc.
- [ ] **3.3.7** Display carat weight prominently: large font, bold
- [ ] **3.3.8** Display specs in one line: "Excellent G VS2" (Cut Color Clarity)
- [ ] **3.3.9** Display price: gold color (#D4AF37), bold, large
- [ ] **3.3.10** Add certificate badge (top-right corner): "GIA", "AGS", etc.
- [ ] **3.3.11** Add "View Details" button (outline style)
- [ ] **3.3.12** Add comparison checkbox (top-right, visible on hover or always on mobile)
- [ ] **3.3.13** Implement responsive grid CSS: 4 cols (>1200px), 3 cols (992-1199px), 2 cols (768-991px), 1 col (<768px)
- [ ] **3.3.14** Add hover effect on cards: slight elevation (box-shadow)
- [ ] **3.3.15** Implement lazy loading for images: use Intersection Observer API
- [ ] **3.3.16** Add loading skeleton while images load
- [ ] **3.3.17** Test grid view with 12, 20, 50, 100 stones
- [ ] **3.3.18** Test image lazy loading (scroll performance)
- [ ] **3.3.19** Test card click behavior (only buttons clickable, not whole card)
- [ ] **3.3.20** Test mobile grid view (single column, full-width cards)

#### 3.4 Create Records Per Page Selector

- [ ] **3.4.1** Create `app/components/builder/RecordsPerPageSelector.tsx` file
- [ ] **3.4.2** Define props: value (number), onChange (function)
- [ ] **3.4.3** Render dropdown with options: 12, 20, 50, 100
- [ ] **3.4.4** Display label: "Per Page:" before dropdown
- [ ] **3.4.5** Style dropdown to match theme (border, padding, font)
- [ ] **3.4.6** Implement onChange handler: updates context and localStorage
- [ ] **3.4.7** Reset pagination to page 1 when records per page changes
- [ ] **3.4.8** Add accessibility: aria-label="Records per page"
- [ ] **3.4.9** Test dropdown on mobile (ensure touch-friendly)
- [ ] **3.4.10** Test changing records per page triggers refetch with new limit

#### 3.5 Create SKU Search Bar Component

- [ ] **3.5.1** Create `app/components/builder/SKUSearchBar.tsx` file
- [ ] **3.5.2** Define props: value (string), onChange (function), onSearch (function)
- [ ] **3.5.3** Render text input with placeholder: "Search Diamond Stock #"
- [ ] **3.5.4** Add search icon button (magnifying glass icon)
- [ ] **3.5.5** Implement debounced onChange handler (300ms delay)
- [ ] **3.5.6** Install or create useDebounce hook if not available
- [ ] **3.5.7** Clear button (X icon) appears when input has value
- [ ] **3.5.8** Implement onSearch handler: triggers API call with SKU param
- [ ] **3.5.9** Handle Enter key press: triggers search immediately
- [ ] **3.5.10** Show loading spinner in search button while searching
- [ ] **3.5.11** Display "Searching..." state in input or below
- [ ] **3.5.12** Add accessibility: aria-label="Search by stock number"
- [ ] **3.5.13** Test debounce functionality (300ms delay works)
- [ ] **3.5.14** Test Enter key triggers search
- [ ] **3.5.15** Test clear button clears input and resets search

#### 3.6 Backend SKU Search Implementation

- [ ] **3.6.1** Open `app/services/product.server.ts`
- [ ] **3.6.2** Modify getStones() to accept `sku` parameter (optional string)
- [ ] **3.6.3** If SKU provided, change where clause to: `where.productId = { contains: sku }` or exact match
- [ ] **3.6.4** When SKU search active, consider ignoring other filters (or make configurable)
- [ ] **3.6.5** Add error handling: invalid SKU, special characters
- [ ] **3.6.6** Open `app/routes/api.builder.stones.tsx`
- [ ] **3.6.7** Extract `sku` query param from URL
- [ ] **3.6.8** Pass SKU to getStones() function
- [ ] **3.6.9** If SKU search returns 0 results, return empty array with helpful message
- [ ] **3.6.10** Test SKU search with exact product IDs
- [ ] **3.6.11** Test SKU search with partial matches (if using LIKE)
- [ ] **3.6.12** Test SKU search with special characters (-, \_, /)
- [ ] **3.6.13** Test SQL injection prevention (Prisma should handle, but verify)

#### 3.7 Create Results Summary Component

- [ ] **3.7.1** Create `app/components/builder/ResultsSummary.tsx` file
- [ ] **3.7.2** Define props: totalStones (number), comparisonCount (number), diamondType (string optional)
- [ ] **3.7.3** Display format: "[X] Similar Diamonds" or "[X] [Type] Diamonds"
- [ ] **3.7.4** If comparisonCount > 0, append: " | Compare Items ([count])"
- [ ] **3.7.5** Style totalStones in bold or larger font
- [ ] **3.7.6** Add optional filter summary: "Filtered by: Round, 1.0-2.0ct, $5K-$10K"
- [ ] **3.7.7** Make component responsive: wrap text on mobile
- [ ] **3.7.8** Update dynamically when filters or comparison changes (useEffect)
- [ ] **3.7.9** Test with various totals: 0, 1, 100, 10000 stones
- [ ] **3.7.10** Test comparison count display when 0, 1, 2, 3, 4 stones selected

#### 3.8 Backend Support for Dynamic Pagination

- [ ] **3.8.1** Open `app/routes/api.builder.stones.tsx`
- [ ] **3.8.2** Extract `limit` query param from URL (default: 20)
- [ ] **3.8.3** Validate limit: parseInt(), ensure >= 12 and <= 100
- [ ] **3.8.4** If invalid, use default 20 and log warning
- [ ] **3.8.5** Pass limit to getStones() function instead of hardcoded PAGINATION.STONES_PER_PAGE
- [ ] **3.8.6** Update pagination calculation: totalPages = Math.ceil(totalCount / limit)
- [ ] **3.8.7** Test with limit=12: returns 12 stones
- [ ] **3.8.8** Test with limit=100: returns up to 100 stones
- [ ] **3.8.9** Test with invalid limits: 0, -1, 999 (should use default 20)
- [ ] **3.8.10** Verify performance doesn't degrade with limit=100

#### 3.9 Integrate All Browsing Features into StoneSelector

- [ ] **3.9.1** Open `app/components/builder/steps/StoneSelector.tsx`
- [ ] **3.9.2** Import new components: ViewModeToggle, RecordsPerPageSelector, SKUSearchBar, ResultsSummary, StoneGridView
- [ ] **3.9.3** Create header section above stone list with controls: ViewModeToggle, RecordsPerPageSelector, SKUSearchBar
- [ ] **3.9.4** Add ResultsSummary below header (shows total and comparison count)
- [ ] **3.9.5** Get viewMode from builder context
- [ ] **3.9.6** Conditionally render StoneTable (if viewMode === "list") or StoneGridView (if viewMode === "grid")
- [ ] **3.9.7** Get recordsPerPage from context and pass to API
- [ ] **3.9.8** Implement SKU search state and handler
- [ ] **3.9.9** When SKU search active, display "Searching for: [SKU]" message
- [ ] **3.9.10** Add "Clear Search" button when SKU search active
- [ ] **3.9.11** Ensure pagination updates when recordsPerPage changes
- [ ] **3.9.12** Test full integration: toggle view modes while filters active
- [ ] **3.9.13** Test changing records per page: pagination recalculates correctly
- [ ] **3.9.14** Test SKU search: finds exact matches, shows "No results" appropriately
- [ ] **3.9.15** Test all browsing features work together harmoniously

---

### **4.0 Diamond Comparison Tool** (Weeks 3-4, FR-15)

#### 4.1 Add Comparison State Management

- [ ] **4.1.1** Open `app/components/builder/BuilderProvider.tsx`
- [ ] **4.1.2** Add comparison state: `const [comparedStones, setComparedStones] = useState<string[]>([])`
- [ ] **4.1.3** Initialize comparedStones from sessionStorage on mount: `JSON.parse(sessionStorage.getItem('rb_comparison') || '[]')`
- [ ] **4.1.4** Add useEffect to sync comparedStones to sessionStorage whenever it changes
- [ ] **4.1.5** Add helper function: addToComparison(stoneId) - adds if not exists, max 4 check
- [ ] **4.1.6** Add helper function: removeFromComparison(stoneId) - removes from array
- [ ] **4.1.7** Add helper function: clearComparison() - resets to empty array
- [ ] **4.1.8** Add comparedStones and comparison functions to context value
- [ ] **4.1.9** Update BuilderContext type in builder.ts
- [ ] **4.1.10** Test comparison state persists across page refreshes

#### 4.2 Create Comparison Checkbox Component

- [ ] **4.2.1** Create `app/components/builder/ComparisonCheckbox.tsx` file
- [ ] **4.2.2** Define props: stoneId (string), isSelected (boolean), onToggle (function), disabled (boolean optional)
- [ ] **4.2.3** Render checkbox input with label "Compare"
- [ ] **4.2.4** Style checkbox: custom burgundy checkmark when selected
- [ ] **4.2.5** Add disabled state when max 4 reached and this stone not selected
- [ ] **4.2.6** Show tooltip on hover when disabled: "Maximum 4 diamonds can be compared"
- [ ] **4.2.7** Implement onToggle handler with max validation
- [ ] **4.2.8** Add accessibility: aria-label="Add to comparison", aria-disabled
- [ ] **4.2.9** Test checkbox selection and deselection
- [ ] **4.2.10** Test disabled state when 4 stones selected

#### 4.3 Integrate Comparison Checkbox into Stone Views

- [ ] **4.3.1** Open `app/components/builder/StoneTable.tsx`
- [ ] **4.3.2** Import ComparisonCheckbox and useBuilder hook
- [ ] **4.3.3** Add new table column header: "Compare" (before Actions column)
- [ ] **4.3.4** Add ComparisonCheckbox to each table row
- [ ] **4.3.5** Get comparedStones from builder context
- [ ] **4.3.6** Check if current stone is in comparedStones array
- [ ] **4.3.7** Pass isSelected and onToggle props
- [ ] **4.3.8** Disable checkbox if 4 stones selected and this stone not selected
- [ ] **4.3.9** Open `app/components/builder/StoneGridView.tsx` (created in task 3.0)
- [ ] **4.3.10** Import ComparisonCheckbox
- [ ] **4.3.11** Add ComparisonCheckbox to stone card (top-right corner, absolute positioning)
- [ ] **4.3.12** Make checkbox always visible on mobile, visible on hover on desktop
- [ ] **4.3.13** Add z-index to ensure checkbox above image
- [ ] **4.3.14** Test checkbox functionality in both table and grid views
- [ ] **4.3.15** Test visual positioning and accessibility

#### 4.4 Create Floating Comparison Button

- [ ] **4.4.1** Create `app/components/builder/ComparisonButton.tsx` file
- [ ] **4.4.2** Define props: count (number), onClick (function)
- [ ] **4.4.3** Render button with text: "Compare Items ([count])"
- [ ] **4.4.4** Add scales icon (balance icon) before text
- [ ] **4.4.5** Position as fixed: bottom-right on desktop (32px from bottom and right)
- [ ] **4.4.6** Position as fixed: bottom-center on mobile (full-width minus margins)
- [ ] **4.4.7** Style with burgundy background (#6D2932), white text, large padding (16px 32px)
- [ ] **4.4.8** Add box-shadow for elevation effect
- [ ] **4.4.9** Add hover state: darker burgundy, lift slightly (translateY(-2px))
- [ ] **4.4.10** Implement slide-up animation on appearance (CSS keyframes or react-spring)
- [ ] **4.4.11** Render only when count >= 2 (conditional rendering)
- [ ] **4.4.12** Add z-index: 1000 (above other elements)
- [ ] **4.4.13** Test button appearance when 2nd stone selected
- [ ] **4.4.14** Test button updates count dynamically as stones selected/deselected
- [ ] **4.4.15** Test mobile positioning (doesn't overlap footer or other fixed elements)

#### 4.5 Backend Comparison API

- [ ] **4.5.1** Create `app/routes/api.builder.compare.tsx` file (POST endpoint)
- [ ] **4.5.2** Define request body type: `{ shop: string, stoneIds: string[] }`
- [ ] **4.5.3** Extract and validate stoneIds array (must have 2-4 items)
- [ ] **4.5.4** Validate each stoneId is valid format (string, not empty)
- [ ] **4.5.5** Open `app/services/product.server.ts`
- [ ] **4.5.6** Create getStonesByIds() function: accepts array of IDs, returns array of stones
- [ ] **4.5.7** Use `prisma.stoneMetadata.findMany({ where: { id: { in: stoneIds }, shop } })`
- [ ] **4.5.8** Maintain order from input stoneIds array
- [ ] **4.5.9** Create analyzeComparison() helper function
- [ ] **4.5.10** Identify differences: compare each field across all stones
- [ ] **4.5.11** Build differences object: `{ carat: [1.5, 1.45, 1.52], price: [8500, 7900, 9200] }`
- [ ] **4.5.12** Calculate price per carat for each stone
- [ ] **4.5.13** Determine bestValue: stone ID with lowest price per carat
- [ ] **4.5.14** Return comparison response: `{ stones, differences, bestValue }`
- [ ] **4.5.15** Test API with 2, 3, and 4 stone IDs
- [ ] **4.5.16** Test with invalid IDs (not found, wrong shop)
- [ ] **4.5.17** Test with duplicate IDs (should deduplicate)

#### 4.6 Create Comparison Modal & Table

- [ ] **4.6.1** Create `app/components/builder/ComparisonModal.tsx` file
- [ ] **4.6.2** Define props: stones (array), onClose (function), onSelectStone (function), onRemoveStone (function)
- [ ] **4.6.3** Render full-screen modal on mobile, large modal (90% width, 90% height) on desktop
- [ ] **4.6.4** Add modal header: "Compare Diamonds" title, close button (X)
- [ ] **4.6.5** Render ComparisonTable component in modal body
- [ ] **4.6.6** Add modal footer with "Close" button
- [ ] **4.6.7** Implement close handlers: X button, ESC key, click outside (overlay)
- [ ] **4.6.8** Add useEffect for ESC key listener
- [ ] **4.6.9** Prevent body scroll when modal open (add overflow: hidden to body)
- [ ] **4.6.10** Create `app/components/builder/ComparisonTable.tsx` file
- [ ] **4.6.11** Define props: stones (array), differences (object), bestValue (string), onRemove (function), onSelect (function)
- [ ] **4.6.12** Render table structure: first column is row labels, subsequent columns are stones
- [ ] **4.6.13** Add table rows: Image, Shape, Carat, Cut, Color, Clarity, Price, Certificate, Measurements, Table%, Depth%, Polish, Symmetry, Fluorescence
- [ ] **4.6.14** For each stone column, add header with stone thumbnail and "Remove" (X) button
- [ ] **4.6.15** Implement difference highlighting: check if value in differences array, apply yellow background (#FFF9C4)
- [ ] **4.6.16** Add "Best Value" badge to stone with lowest price per carat (green badge, "Best Value" text)
- [ ] **4.6.17** Render "View Details" link for each stone (opens detail page in new tab: target="\_blank")
- [ ] **4.6.18** Render "Select This Diamond" button for each stone at bottom of column
- [ ] **4.6.19** Style buttons: burgundy background, white text, full-width within column
- [ ] **4.6.20** Implement onRemove handler: removes stone from comparison
- [ ] **4.6.21** Implement onSelect handler: closes modal, selects stone in builder, advances to Step 3
- [ ] **4.6.22** Add responsive layout for mobile: horizontal scroll or stacked cards
- [ ] **4.6.23** Test table with 2 stones: displays correctly, differences highlighted
- [ ] **4.6.24** Test table with 4 stones: all columns visible, scrollable if needed
- [ ] **4.6.25** Test "Remove" button: stone removed from comparison, table updates
- [ ] **4.6.26** Test "Select This Diamond": modal closes, stone selected, Step 3 shown
- [ ] **4.6.27** Test mobile comparison view: usable on small screens
- [ ] **4.6.28** Test ESC key closes modal
- [ ] **4.6.29** Test clicking outside modal closes it
- [ ] **4.6.30** Add analytics tracking when comparison opened and when stone selected from comparison

---

### **5.0 Save & Share Configuration** (Week 5, FR-16)

#### 5.1 Create URL Helpers

- [ ] **5.1.1** Create `app/utils/url-helpers.ts` file
- [ ] **5.1.2** Implement generateShareToken() function: uses crypto.randomBytes or crypto.getRandomValues
- [ ] **5.1.3** Generate 8-12 character alphanumeric string (Base62: a-zA-Z0-9)
- [ ] **5.1.4** Ensure cryptographically secure randomness (not Math.random())
- [ ] **5.1.5** Implement validateShareToken() function: regex check for format ([a-zA-Z0-9]{8,12})
- [ ] **5.1.6** Implement buildShareUrl() function: constructs full URL from shop domain and token
- [ ] **5.1.7** Test token generation: check uniqueness over 10,000 iterations
- [ ] **5.1.8** Test token validation: accepts valid tokens, rejects invalid formats

#### 5.2 Backend Save Configuration API

- [ ] **5.2.1** Create `app/routes/api.builder.save.tsx` file (POST endpoint)
- [ ] **5.2.2** Define request body type: `{ configurationId: string, shop: string }`
- [ ] **5.2.3** Extract and validate configurationId (must exist in database)
- [ ] **5.2.4** Open `app/services/configuration.server.ts`
- [ ] **5.2.5** Create saveConfiguration() function: accepts configurationId, shop
- [ ] **5.2.6** Fetch Configuration to ensure it exists and belongs to shop
- [ ] **5.2.7** Generate unique shareToken using generateShareToken()
- [ ] **5.2.8** Check for token collision: query SavedConfiguration.findUnique({ where: { shareToken } })
- [ ] **5.2.9** If collision, regenerate token (max 3 retries, then error)
- [ ] **5.2.10** Calculate expiresAt: new Date() + 90 days (or read from AppSettings)
- [ ] **5.2.11** Create SavedConfiguration record: `{ configurationId, shareToken, views: 0, createdAt, expiresAt }`
- [ ] **5.2.12** Update Configuration record: set shareToken and savedAt fields
- [ ] **5.2.13** Build full share URL using shop domain + token
- [ ] **5.2.14** Return response: `{ success: true, shareToken, shareUrl, expiresAt }`
- [ ] **5.2.15** Add error handling: configuration not found, token collision (after retries), database errors
- [ ] **5.2.16** Test save API: valid configuration saves successfully
- [ ] **5.2.17** Test error cases: invalid configurationId, shop mismatch
- [ ] **5.2.18** Test token uniqueness: no collisions in 100 saves

#### 5.3 Backend Load Saved Configuration API

- [ ] **5.3.1** Create `app/routes/api.builder.saved.$token.tsx` file (GET endpoint)
- [ ] **5.3.2** Extract shareToken from URL params
- [ ] **5.3.3** Extract shop from query params
- [ ] **5.3.4** Create loadSavedConfiguration() function in configuration.server.ts
- [ ] **5.3.5** Fetch SavedConfiguration by shareToken
- [ ] **5.3.6** If not found, return 404 error
- [ ] **5.3.7** Check if expired: compare expiresAt with current date
- [ ] **5.3.8** If expired, return 410 Gone status with "Link expired" message
- [ ] **5.3.9** Increment views count: `prisma.savedConfiguration.update({ where: { shareToken }, data: { views: { increment: 1 } } })`
- [ ] **5.3.10** Fetch full Configuration using configurationId
- [ ] **5.3.11** Fetch Setting and Stone products using productIds
- [ ] **5.3.12** Recalculate current prices from SettingMetadata and StoneMetadata (prices may have changed)
- [ ] **5.3.13** Compare saved price vs current price, include both in response
- [ ] **5.3.14** Return comprehensive response: `{ configuration, setting, stone, priceDifference }`
- [ ] **5.3.15** Add error handling: token not found, configuration deleted, products unavailable
- [ ] **5.3.16** Test load API: valid token loads correctly
- [ ] **5.3.17** Test expired token: returns proper error
- [ ] **5.3.18** Test views increment on each access
- [ ] **5.3.19** Test price recalculation when prices changed

#### 5.4 Create Save Search Button & Success Modal

- [ ] **5.4.1** Create `app/components/builder/SaveSearchButton.tsx` file
- [ ] **5.4.2** Define props: onClick (function), loading (boolean), disabled (boolean)
- [ ] **5.4.3** Render button with bookmark icon + "Save Search" text
- [ ] **5.4.4** Style with outline button style (border, no background, hover: light background)
- [ ] **5.4.5** Add loading state: show spinner icon, disable button, text "Saving..."
- [ ] **5.4.6** Position in builder header/navigation (top-right or alongside Reset button)
- [ ] **5.4.7** Create SaveSuccessModal component (shown after successful save)
- [ ] **5.4.8** Display success message: "Configuration saved! Share this link:"
- [ ] **5.4.9** Show shareable URL in read-only input field (full URL)
- [ ] **5.4.10** Add "Copy Link" button with copy icon
- [ ] **5.4.11** Implement clipboard copy: navigator.clipboard.writeText(shareUrl)
- [ ] **5.4.12** Add fallback for older browsers: select input text, document.execCommand('copy')
- [ ] **5.4.13** Show "Copied!" message on successful copy (2s duration, green checkmark)
- [ ] **5.4.14** Add "Close" button to dismiss modal
- [ ] **5.4.15** Test save button: click triggers API call
- [ ] **5.4.16** Test success modal: displays URL, copy works
- [ ] **5.4.17** Test loading state during save
- [ ] **5.4.18** Test error handling: save fails (show error, allow retry)

#### 5.5 Create Saved Configuration Loader Route

- [ ] **5.5.1** Create `app/routes/builder.saved.$token.tsx` file
- [ ] **5.5.2** Extract shareToken from URL params
- [ ] **5.5.3** In loader function, call /api/builder/saved/:token
- [ ] **5.5.4** Handle API responses: success, not found, expired
- [ ] **5.5.5** If successful, prepare configuration data for builder
- [ ] **5.5.6** Render BuilderApp component with pre-filled state
- [ ] **5.5.7** Pass saved configuration data to BuilderProvider via initialState prop
- [ ] **5.5.8** Update BuilderProvider to accept and use initialState
- [ ] **5.5.9** Pre-select setting, stone, metalType, ringSize, sideStonesConfig from saved data
- [ ] **5.5.10** Show banner: "Loaded from saved configuration. Last saved: [date]"
- [ ] **5.5.11** If price changed, show price difference: "Price updated: $8,500 → $8,750 (+$250)"
- [ ] **5.5.12** Allow customer to edit any selection (normal builder flow)
- [ ] **5.5.13** Allow customer to proceed to checkout without changes
- [ ] **5.5.14** Test loading saved configuration from URL
- [ ] **5.5.15** Test builder state pre-filled correctly
- [ ] **5.5.16** Test price difference display when prices changed
- [ ] **5.5.17** Test editing loaded configuration works normally
- [ ] **5.5.18** Test 404 page when token not found
- [ ] **5.5.19** Test expiration page when link expired

#### 5.6 Create Share Modal (Basic Structure)

- [ ] **5.6.1** Create `app/components/builder/ShareModal.tsx` file
- [ ] **5.6.2** Define props: isOpen (boolean), onClose (function), configurationId (string), shareUrl (string)
- [ ] **5.6.3** Render modal overlay and content
- [ ] **5.6.4** Add modal header: "Share Configuration" title
- [ ] **5.6.5** Create tab navigation: Email, Copy Link, Facebook, Twitter
- [ ] **5.6.6** Render active tab content based on selection
- [ ] **5.6.7** Implement modal close handlers (X, ESC, outside click)
- [ ] **5.6.8** Test modal open/close functionality
- [ ] **5.6.9** Test tab switching

#### 5.7 Integrate Save Button into Builder

- [ ] **5.7.1** Open `app/components/builder/BuilderApp.tsx` or StepNavigation component
- [ ] **5.7.2** Import SaveSearchButton component
- [ ] **5.7.3** Add SaveSearchButton to header/navigation (visible on all steps)
- [ ] **5.7.4** Implement save handler: validates configuration complete before saving
- [ ] **5.7.5** If incomplete, show message: "Please complete your configuration before saving"
- [ ] **5.7.6** If complete, call /api/builder/save
- [ ] **5.7.7** Open SaveSuccessModal on success
- [ ] **5.7.8** Add error handling and retry logic
- [ ] **5.7.9** Test save button on each step
- [ ] **5.7.10** Test validation: can't save incomplete configuration

---

### **6.0 Customer Engagement & Inquiry System** (Weeks 6-7, FR-17)

#### 6.1 Create Inquiry Service

- [ ] **6.1.1** Create `app/services/inquiry.server.ts` file
- [ ] **6.1.2** Define InquiryType enum or type: "drop_a_hint" | "request_info" | "email_friend" | "schedule_viewing"
- [ ] **6.1.3** Implement createInquiry() function: accepts inquiry data, returns inquiry ID
- [ ] **6.1.4** Validate required fields based on inquiry type
- [ ] **6.1.5** Sanitize inputs: strip HTML tags, limit message length
- [ ] **6.1.6** Create CustomerInquiry record in database with all fields
- [ ] **6.1.7** Implement getInquiries() function for admin: fetch by shop, paginated (50 per page)
- [ ] **6.1.8** Add filters: type, status, date range (startDate, endDate)
- [ ] **6.1.9** Implement getInquiry() function: fetch single inquiry by ID
- [ ] **6.1.10** Implement updateInquiryStatus() function: change status (new → contacted → closed)
- [ ] **6.1.11** Add multi-tenant check: ensure shop matches before updating
- [ ] **6.1.12** Test createInquiry: saves correctly with all fields
- [ ] **6.1.13** Test getInquiries: pagination and filters work
- [ ] **6.1.14** Test updateInquiryStatus: status changes correctly

#### 6.2 Create Inquiry API Endpoint

- [ ] **6.2.1** Create `app/routes/api.builder.inquiry.tsx` file (POST endpoint)
- [ ] **6.2.2** Define request body type with all possible fields
- [ ] **6.2.3** Extract and validate: shop, type, customerEmail (required)
- [ ] **6.2.4** Validate email format using regex or validator library
- [ ] **6.2.5** Type-specific validation:
- [ ] **6.2.6** If "drop_a_hint": require recipientEmail, optional senderName, specialDate, message
- [ ] **6.2.7** If "request_info": require name, email, phone optional, question required (max 1000 chars)
- [ ] **6.2.8** If "email_friend": require recipientEmail, optional senderName, message
- [ ] **6.2.9** If "schedule_viewing": require name, email, phone, preferredDate, preferredTime optional
- [ ] **6.2.10** Validate preferredDate is future date (not in past)
- [ ] **6.2.11** Call createInquiry() service function
- [ ] **6.2.12** Return success response with inquiry ID
- [ ] **6.2.13** Add rate limiting: max 5 inquiries per hour per IP/session (prevent spam)
- [ ] **6.2.14** Test API with all 4 inquiry types
- [ ] **6.2.15** Test validation: reject invalid emails, past dates, missing required fields
- [ ] **6.2.16** Test rate limiting: 6th inquiry within hour fails

#### 6.3 Create Shared Inquiry Modal Wrapper

- [ ] **6.3.1** Create `app/components/builder/InquiryModal.tsx` file
- [ ] **6.3.2** Define props: isOpen, onClose, title, children, onSubmit, loading
- [ ] **6.3.3** Render modal overlay and content
- [ ] **6.3.4** Add modal header with dynamic title
- [ ] **6.3.5** Render children (form fields) in modal body
- [ ] **6.3.6** Add modal footer with "Cancel" and "Submit" buttons
- [ ] **6.3.7** Implement close handlers (X, ESC, outside click)
- [ ] **6.3.8** Show loading state on submit button when loading=true
- [ ] **6.3.9** Add success confirmation screen (checkmark, success message)
- [ ] **6.3.10** Auto-close modal after 3 seconds on success (optional)

#### 6.4 Create Drop A Hint Modal

- [ ] **6.4.1** Create `app/components/builder/DropAHintModal.tsx` file
- [ ] **6.4.2** Define state: recipientEmail, senderName, specialDate, message, errors
- [ ] **6.4.3** Render form fields: Recipient Email (required), Your Name (optional), Special Date (date picker), Message (textarea, 500 char max)
- [ ] **6.4.4** Add email validation on blur: regex check
- [ ] **6.4.5** Add character counter for message field: "X / 500 characters"
- [ ] **6.4.6** Add form submission handler
- [ ] **6.4.7** Validate required fields before submit
- [ ] **6.4.8** Call /api/builder/inquiry with type="drop_a_hint"
- [ ] **6.4.9** Show success message: "Your hint has been sent! 💍"
- [ ] **6.4.10** Clear form on success
- [ ] **6.4.11** Add error handling: display validation errors, API errors
- [ ] **6.4.12** Test form validation: all scenarios (missing email, invalid email, too long message)
- [ ] **6.4.13** Test successful submission
- [ ] **6.4.14** Test mobile form layout

#### 6.5 Create Request Info Modal

- [ ] **6.5.1** Create `app/components/builder/RequestInfoModal.tsx` file
- [ ] **6.5.2** Define state: name, email, phone, question, errors
- [ ] **6.5.3** Render form fields: Name (required), Email (required), Phone (optional), Question (textarea, 1000 char max, required)
- [ ] **6.5.4** Add validation: name not empty, email format, question min 10 chars
- [ ] **6.5.5** Add character counter for question field: "X / 1000 characters"
- [ ] **6.5.6** Implement submit handler: call /api/builder/inquiry with type="request_info"
- [ ] **6.5.7** Show success message: "Your question has been sent to our team. We'll respond within 24 hours."
- [ ] **6.5.8** Test form validation and submission
- [ ] **6.5.9** Test mobile layout

#### 6.6 Create Email Friend Modal

- [ ] **6.6.1** Create `app/components/builder/EmailFriendModal.tsx` file
- [ ] **6.6.2** Reuse ShareEmailForm component (will be created in task 10.0)
- [ ] **6.6.3** Pre-populate subject: "Check out this ring!"
- [ ] **6.6.4** Call /api/builder/inquiry with type="email_friend"
- [ ] **6.6.5** Show success: "Email sent to your friend!"
- [ ] **6.6.6** Test integration with email sending (task 10.0)

#### 6.7 Create Schedule Viewing Modal

- [ ] **6.7.1** Create `app/components/builder/ScheduleViewingModal.tsx` file
- [ ] **6.7.2** Define state: name, email, phone, preferredDate, preferredTime, message, errors
- [ ] **6.7.3** Render form fields: Name, Email, Phone (all required), Preferred Date (date picker), Preferred Time (time picker), Message (optional)
- [ ] **6.7.4** Use HTML5 date input or install react-datepicker if needed
- [ ] **6.7.5** Set min date to today (prevent past dates)
- [ ] **6.7.6** Create time selector: dropdown with slots (9:00 AM, 9:30 AM, ..., 5:00 PM)
- [ ] **6.7.7** Validate date is in future
- [ ] **6.7.8** Validate all required fields before submit
- [ ] **6.7.9** Implement submit handler: call /api/builder/inquiry with type="schedule_viewing"
- [ ] **6.7.10** Show success: "Viewing request sent! We'll contact you soon to confirm."
- [ ] **6.7.11** Test date validation: rejects past dates
- [ ] **6.7.12** Test form submission with all fields
- [ ] **6.7.13** Test mobile date/time pickers

#### 6.8 Create Action Button Group Component

- [ ] **6.8.1** Create `app/components/builder/ActionButtonGroup.tsx` file
- [ ] **6.8.2** Define props: onDropAHint, onRequestInfo, onEmailFriend, onScheduleViewing (all functions)
- [ ] **6.8.3** Import icons from react-icons: FaRegHeart (hint), FaInfoCircle (info), FaEnvelope (email), FaCalendar (viewing)
- [ ] **6.8.4** Render 4 buttons in grid layout: 2x2 on desktop
- [ ] **6.8.5** Style buttons: burgundy outline (#6D2932), icon + label, equal width
- [ ] **6.8.6** On mobile: stack vertically, full-width buttons
- [ ] **6.8.7** Add hover effect: burgundy background, white text/icon
- [ ] **6.8.8** Implement click handlers for each button
- [ ] **6.8.9** Add conditional rendering: check AppSettings.customerEngagement to show/hide each button
- [ ] **6.8.10** Test button layout on desktop (2x2 grid)
- [ ] **6.8.11** Test button layout on mobile (stacked, full-width)
- [ ] **6.8.12** Test conditional rendering when some buttons disabled

#### 6.9 Integrate Action Buttons into Builder

- [ ] **6.9.1** Import ActionButtonGroup into product detail pages (task 7.0)
- [ ] **6.9.2** Add ActionButtonGroup to Step 4 Review component
- [ ] **6.9.3** Open `app/components/builder/steps/Review.tsx`
- [ ] **6.9.4** Import ActionButtonGroup and all 4 modals
- [ ] **6.9.5** Add state for modal visibility (4 boolean states)
- [ ] **6.9.6** Render ActionButtonGroup with click handlers
- [ ] **6.9.7** Render modals conditionally based on visibility state
- [ ] **6.9.8** Pass configurationId and product IDs to modals
- [ ] **6.9.9** Test each button opens correct modal
- [ ] **6.9.10** Test modals close correctly

#### 6.10 Admin Inquiry Management

- [ ] **6.10.1** Create `app/routes/api.admin.inquiries.tsx` file (GET endpoint)
- [ ] **6.10.2** Authenticate request (Shopify session)
- [ ] **6.10.3** Extract query params: page, type, status, startDate, endDate
- [ ] **6.10.4** Call getInquiries() service with filters
- [ ] **6.10.5** Return paginated inquiry list
- [ ] **6.10.6** Create `app/routes/api.admin.inquiries.$id.tsx` file (PUT endpoint)
- [ ] **6.10.7** Extract inquiry ID from params
- [ ] **6.10.8** Extract new status from request body
- [ ] **6.10.9** Validate status value: "new", "contacted", or "closed"
- [ ] **6.10.10** Call updateInquiryStatus() service
- [ ] **6.10.11** Return success response
- [ ] **6.10.12** Create `app/routes/app.builder.inquiries.tsx` admin page
- [ ] **6.10.13** Create `app/components/admin/InquiryList.tsx` component
- [ ] **6.10.14** Render table with columns: Date, Type, Customer Email, Message Preview, Status, Actions
- [ ] **6.10.15** Add type badges: color-coded (hint=pink, info=blue, viewing=green, email=purple)
- [ ] **6.10.16** Add status badges: color-coded (new=red, contacted=yellow, closed=green)
- [ ] **6.10.17** Add "View Details" button for each inquiry
- [ ] **6.10.18** Create `app/components/admin/InquiryDetail.tsx` modal
- [ ] **6.10.19** Display all inquiry details: customer info, message, preferred date/time, configuration link
- [ ] **6.10.20** Add action buttons: "Mark as Contacted", "Mark as Closed", "Reply to Customer"
- [ ] **6.10.21** Implement status update: call /api/admin/inquiries/:id
- [ ] **6.10.22** Implement "Reply to Customer" mailto link with pre-filled email
- [ ] **6.10.23** Add filters to inquiry list: type dropdown, status dropdown, date range picker
- [ ] **6.10.24** Test inquiry list displays correctly with various inquiries
- [ ] **6.10.25** Test status updates work
- [ ] **6.10.26** Test filters work correctly
- [ ] **6.10.27** Test pagination
- [ ] **6.10.28** Test reply to customer opens email client correctly

---

### **7.0 Enhanced Product Detail Pages** (Weeks 3-4, FR-20)

#### 7.1 Backend Product Detail API

- [ ] **7.1.1** Create `app/routes/api.builder.product.$id.tsx` file (GET endpoint)
- [ ] **7.1.2** Extract product ID from URL params
- [ ] **7.1.3** Extract shop from query params
- [ ] **7.1.4** Open `app/services/product.server.ts`
- [ ] **7.1.5** Create getProductDetail() function: accepts productId (metadata ID), shop
- [ ] **7.1.6** Determine if ID is for setting or stone (query both tables)
- [ ] **7.1.7** If setting: fetch SettingMetadata with all fields
- [ ] **7.1.8** If stone: fetch StoneMetadata with all fields
- [ ] **7.1.9** Parse JSON fields: images, basePrices (for settings)
- [ ] **7.1.10** Return comprehensive product object with metadata
- [ ] **7.1.11** Add error handling: product not found, shop mismatch
- [ ] **7.1.12** Test API with setting IDs
- [ ] **7.1.13** Test API with stone IDs
- [ ] **7.1.14** Test invalid IDs return 404

#### 7.2 Create Image Gallery Component

- [ ] **7.2.1** Create `app/components/builder/ImageGallery.tsx` file
- [ ] **7.2.2** Install react-image-gallery if using library, or build custom
- [ ] **7.2.3** Define props: images (string array), productName (string for alt text)
- [ ] **7.2.4** Render main large image (500-600px width on desktop)
- [ ] **7.2.5** Render thumbnail strip below main image (horizontal scroll)
- [ ] **7.2.6** Implement thumbnail click: updates main image
- [ ] **7.2.7** Add zoom functionality: click main image opens lightbox/modal with high-res version
- [ ] **7.2.8** Or implement magnifier on hover (lens effect, 2x zoom)
- [ ] **7.2.9** Add left/right navigation arrows for main image
- [ ] **7.2.10** Support keyboard navigation: arrow keys to change images
- [ ] **7.2.11** Add loading skeleton while images load
- [ ] **7.2.12** Optimize: lazy load thumbnails, preload main image
- [ ] **7.2.13** Add 360° viewer support (detect images with pattern like "image-1.jpg" to "image-36.jpg")
- [ ] **7.2.14** If 360° detected, add drag-to-rotate functionality
- [ ] **7.2.15** Test gallery with 1, 5, and 10 images
- [ ] **7.2.16** Test zoom functionality on desktop
- [ ] **7.2.17** Test mobile swipe gestures
- [ ] **7.2.18** Test 360° viewer if available

#### 7.3 Create Specification Panel Component

- [ ] **7.3.1** Create `app/components/builder/SpecificationPanel.tsx` file
- [ ] **7.3.2** Define props: specs (object with key-value pairs), type ("setting" | "diamond")
- [ ] **7.3.3** Render two-column table: Label | Value
- [ ] **7.3.4** For settings: display Style, Metal Types Available, Compatible Shapes, Setting Height
- [ ] **7.3.5** For diamonds: display Shape, Carat, Cut, Color, Clarity, Certificate, Measurements, Table%, Depth%, Polish, Symmetry, Fluorescence
- [ ] **7.3.6** Format values using existing formatters from utils
- [ ] **7.3.7** Handle missing values: display "-" or hide row
- [ ] **7.3.8** Add collapsible sections for mobile: "Specifications" accordion
- [ ] **7.3.9** Style table: alternating row backgrounds for readability
- [ ] **7.3.10** Test with full spec data
- [ ] **7.3.11** Test with minimal spec data (missing fields)
- [ ] **7.3.12** Test mobile collapsible behavior

#### 7.4 Create Certificate Viewer Component

- [ ] **7.4.1** Create `app/components/builder/CertificateViewer.tsx` file
- [ ] **7.4.2** Define props: certificate Type, certificateNumber, certificateUrl (optional)
- [ ] **7.4.3** Render certificate badge: "GIA Certified" with shield icon
- [ ] **7.4.4** If certificateUrl exists, display "View Certificate" link
- [ ] **7.4.5** Implement view handler: opens PDF in modal (iframe) or new tab (target="\_blank")
- [ ] **7.4.6** If using modal: create CertificatePDFModal component
- [ ] **7.4.7** Embed PDF in iframe within modal (handle browsers that don't support iframe PDFs)
- [ ] **7.4.8** Add "Download PDF" button as fallback
- [ ] **7.4.9** If certificateUrl is null, display just certificate number
- [ ] **7.4.10** Add "Certificate Number: [number]" text
- [ ] **7.4.11** Test PDF viewer on Chrome, Firefox, Safari
- [ ] **7.4.12** Test fallback when browser doesn't support iframe PDFs
- [ ] **7.4.13** Test download functionality
- [ ] **7.4.14** Test mobile PDF viewing

#### 7.5 Create Setting Detail Page

- [ ] **7.5.1** Create `app/routes/builder.setting.$id.tsx` file
- [ ] **7.5.2** Extract setting ID from URL params
- [ ] **7.5.3** In loader: fetch setting details from /api/builder/product/:id
- [ ] **7.5.4** Render two-column layout: 50% image gallery, 50% info panel
- [ ] **7.5.5** Left side: ImageGallery component with setting images
- [ ] **7.5.6** Right side: Setting name (h1), SKU, description
- [ ] **7.5.7** Add "Ring Specification" section with dropdowns:
- [ ] **7.5.8** Metal Type dropdown (14K White, 14K Yellow, 18K Rose, Platinum)
- [ ] **7.5.9** Center Stone Size dropdown (0.50ct, 0.75ct, 1.00ct, 1.25ct, 1.50ct, 1.75ct, 2.00ct, 2.50ct+)
- [ ] **7.5.10** Ring Size dropdown (3-12)
- [ ] **7.5.11** Display price that updates based on selected metal type
- [ ] **7.5.12** Add SpecificationPanel: display style, compatible shapes, setting height
- [ ] **7.5.13** Add "Add Your Diamond" button (large, burgundy, proceeds to Step 2 with this setting)
- [ ] **7.5.14** Add VTO button (if enabled)
- [ ] **7.5.15** Add ActionButtonGroup (Request Info, Email Friend)
- [ ] **7.5.16** Add SocialShareButtons (Save, Facebook, Twitter)
- [ ] **7.5.17** Add disclaimer: "NOTE: All metal color images may not be available"
- [ ] **7.5.18** Implement "Add Your Diamond" click: pre-selects setting in builder, navigates to Step 2
- [ ] **7.5.19** Add breadcrumb navigation: Home > Ring Builder > Settings > [Setting Name]
- [ ] **7.5.20** Test setting detail page loads correctly
- [ ] **7.5.21** Test price updates when metal type changes
- [ ] **7.5.22** Test "Add Your Diamond" flow

#### 7.6 Create Diamond Detail Page

- [ ] **7.6.1** Create `app/routes/builder.diamond.$id.tsx` file
- [ ] **7.6.2** Extract diamond ID from URL params
- [ ] **7.6.3** In loader: fetch diamond details from /api/builder/product/:id
- [ ] **7.6.4** Render two-column layout similar to setting page
- [ ] **7.6.5** Left side: ImageGallery with diamond image (high-res zoom enabled)
- [ ] **7.6.6** Add CertificateViewer component (badge + View link)
- [ ] **7.6.7** Add "Internal use Only: Click Here" link (merchant-only, optional feature)
- [ ] **7.6.8** Right side: Diamond title "[Carat] Carat [Shape] Diamond"
- [ ] **7.6.9** Add descriptive paragraph: "This [Cut] cut, [Color] color, [Clarity] clarity diamond comes accompanied by a diamond grading report from [Certificate]"
- [ ] **7.6.10** Render SpecificationPanel with comprehensive diamond specs
- [ ] **7.6.11** Display price prominently (large, gold color)
- [ ] **7.6.12** Add "Add To Cart" button (if standalone diamond purchase)
- [ ] **7.6.13** Add "Complete Your Ring" button (if builder context exists, proceeds to setting selection)
- [ ] **7.6.14** Add "Print Details" button (window.print() or custom print layout)
- [ ] **7.6.15** Add ActionButtonGroup (all 4 action buttons)
- [ ] **7.6.16** Add SocialShareButtons
- [ ] **7.6.17** Test diamond detail page loads correctly
- [ ] **7.6.18** Test certificate viewer integration
- [ ] **7.6.19** Test "Complete Your Ring" flow (navigates to builder with diamond pre-selected)
- [ ] **7.6.20** Test print functionality

#### 7.7 Open Graph Meta Tags

- [ ] **7.7.1** Open `app/root.tsx`
- [ ] **7.7.2** Create meta function for detail pages (accepts loader data)
- [ ] **7.7.3** Add og:title meta tag (product name + key specs)
- [ ] **7.7.4** Add og:description meta tag (price + description snippet)
- [ ] **7.7.5** Add og:image meta tag (product primary image URL)
- [ ] **7.7.6** Add og:url meta tag (canonical URL to detail page)
- [ ] **7.7.7** Add og:type="product" meta tag
- [ ] **7.7.8** Add Twitter Card meta tags: twitter:card="summary_large_image"
- [ ] **7.7.9** Test meta tags with Facebook Debugger tool
- [ ] **7.7.10** Test meta tags with Twitter Card Validator
- [ ] **7.7.11** Verify images display in social preview

#### 7.8 Builder Context Preservation

- [ ] **7.8.1** Add query param to detail page URLs: `?fromBuilder=true`
- [ ] **7.8.2** Store builder state in sessionStorage before navigating to detail page
- [ ] **7.8.3** Add "Back to Builder" button when fromBuilder=true
- [ ] **7.8.4** Restore builder state when returning from detail page
- [ ] **7.8.5** Test: open detail from Step 1, back button returns to Step 1
- [ ] **7.8.6** Test: open detail from direct URL, no back button shown
- [ ] **7.8.7** Test state preservation across detail page navigation

#### 7.9 Mobile Optimization

- [ ] **7.9.1** Test detail pages on mobile (320px to 768px widths)
- [ ] **7.9.2** Stack layout on mobile: image gallery full-width, then info below
- [ ] **7.9.3** Make specification panel collapsible on mobile
- [ ] **7.9.4** Stack action buttons vertically on mobile
- [ ] **7.9.5** Test image gallery swipe gestures
- [ ] **7.9.6** Test form dropdowns on mobile keyboards
- [ ] **7.9.7** Optimize images for mobile (serve smaller versions)

---

### **8.0 Virtual Try-On Integration** (Week 7, FR-18)

#### 8.1 Decision & Planning

- [ ] **8.1.1** Review VTO options with stakeholders (Option A: API, B: DIY, C: AR)
- [ ] **8.1.2** Evaluate budget: Option A ($500-2000/mo), Option B (free), Option C (free but requires 3D models)
- [ ] **8.1.3** Decide on primary VTO approach (can support multiple)
- [ ] **8.1.4** If Option A: research providers (Dor Technologies, GemFind VTO, jewelry-specific solutions)
- [ ] **8.1.5** If Option A: create trial/sandbox account with chosen provider
- [ ] **8.1.6** Document chosen approach in `/docs/VTO_SETUP.md`

#### 8.2 Option A: Third-Party API Integration

- [ ] **8.2.1** Create `app/services/vto.server.ts` file (if Option A chosen)
- [ ] **8.2.2** Install VTO provider SDK or HTTP client (axios)
- [ ] **8.2.3** Add VTO API credentials to .env: `VTO_API_KEY`, `VTO_API_URL`
- [ ] **8.2.4** Implement initializeVTO() function: authenticate with VTO service
- [ ] **8.2.5** Implement createVTOSession() function: pass ring image URL, SKU, customer ID
- [ ] **8.2.6** Implement getVTOSessionUrl() function: returns URL to VTO experience
- [ ] **8.2.7** Handle VTO API responses and errors (timeout, auth failure, service down)
- [ ] **8.2.8** Add retry logic for transient failures (max 2 retries)
- [ ] **8.2.9** Create `/api/builder/vto` endpoint: proxy to VTO service
- [ ] **8.2.10** Test API integration with sandbox account
- [ ] **8.2.11** Test error handling when VTO service is down

#### 8.3 Option B: DIY Image Upload & Overlay

- [ ] **8.3.1** Create `app/components/builder/VTOImageUpload.tsx` file (if Option B chosen)
- [ ] **8.3.2** Render file input with drag-and-drop zone
- [ ] **8.3.3** Add file validation: accept only image/\* (jpg, png, jpeg)
- [ ] **8.3.4** Validate file size: max 10MB
- [ ] **8.3.5** Preview uploaded hand photo in component
- [ ] **8.3.6** Create VTOOverlay component: displays ring image overlaid on hand photo
- [ ] **8.3.7** Use CSS absolute positioning to overlay ring on hand
- [ ] **8.3.8** Add draggable functionality: customer can reposition ring
- [ ] **8.3.9** Add resize control: slider to adjust ring size (50%-150%)
- [ ] **8.3.10** Add rotation control: slider to rotate ring (-45° to +45°)
- [ ] **8.3.11** Implement "Download Image" button: uses HTML canvas to composite images
- [ ] **8.3.12** Canvas API: draw hand photo, then draw ring on top at specified position/size/rotation
- [ ] **8.3.13** Export as PNG: canvas.toDataURL() or canvas.toBlob()
- [ ] **8.3.14** Trigger browser download with generated filename: "ring-tryon-[date].png"
- [ ] **8.3.15** Test image upload validation (file type, size)
- [ ] **8.3.16** Test drag positioning works smoothly
- [ ] **8.3.17** Test resize and rotation controls
- [ ] **8.3.18** Test download functionality across browsers

#### 8.4 Option C: AR Quick Look (iOS)

- [ ] **8.4.1** Research USDZ format requirements (if Option C chosen)
- [ ] **8.4.2** Source or create 3D models for rings (.usdz format)
- [ ] **8.4.3** Store USDZ files in public/models/ directory
- [ ] **8.4.4** Implement AR Quick Look link: `<a rel="ar" href="/models/ring.usdz">`
- [ ] **8.4.5** Add AR icon/button that triggers AR Quick Look on iOS Safari
- [ ] **8.4.6** Detect iOS Safari: show AR button, hide on other platforms
- [ ] **8.4.7** Test AR Quick Look on actual iOS device (iPhone or iPad)
- [ ] **8.4.8** Test fallback on non-iOS devices (show alternative or hide button)

#### 8.5 Create Virtual Try-On Modal

- [ ] **8.5.1** Create `app/components/builder/VirtualTryOnModal.tsx` file
- [ ] **8.5.2** Define props: isOpen, onClose, productImage, productName, vtoType ("api" | "upload" | "ar")
- [ ] **8.5.3** Render modal (full-screen on mobile, large on desktop)
- [ ] **8.5.4** If vtoType="api": embed VTO experience in iframe or render provider's SDK
- [ ] **8.5.5** If vtoType="upload": render VTOImageUpload component
- [ ] **8.5.6** If vtoType="ar": show AR Quick Look instructions
- [ ] **8.5.7** Add close button and handlers
- [ ] **8.5.8** Add loading state while VTO initializes
- [ ] **8.5.9** Test modal with each VTO type
- [ ] **8.5.10** Test on mobile full-screen mode

#### 8.6 Create VTO Button Component

- [ ] **8.6.1** Create "Virtual Try On" button component
- [ ] **8.6.2** Use camera icon from react-icons (FaCamera or similar)
- [ ] **8.6.3** Style with burgundy background, white text, prominent
- [ ] **8.6.4** Add click handler: opens VirtualTryOnModal
- [ ] **8.6.5** Add to product detail pages (settings and diamonds)
- [ ] **8.6.6** Add to Step 4 (Review page)
- [ ] **8.6.7** Fetch VTO settings from AppSettings API or context
- [ ] **8.6.8** Only render if AppSettings.virtualTryOn.enabled === true
- [ ] **8.6.9** Use custom button label if provided in settings
- [ ] **8.6.10** Test button shows/hides based on settings

#### 8.7 Admin VTO Configuration

- [ ] **8.7.1** This is covered in task 9.0 (Admin Configuration Enhancements)
- [ ] **8.7.2** Ensure VTO settings save correctly in AppSettings.virtualTryOn JSON field
- [ ] **8.7.3** Test enabling/disabling VTO from admin

#### 8.8 Analytics & Tracking

- [ ] **8.8.1** Track VTO button clicks in AnalyticsEvent model
- [ ] **8.8.2** Track VTO completions (if Option B: when download clicked)
- [ ] **8.8.3** Optionally track correlation with conversion (users who used VTO vs didn't)
- [ ] **8.8.4** Test tracking events are recorded

#### 8.9 Testing & Documentation

- [ ] **8.9.1** Test VTO on desktop browsers (Chrome, Firefox, Safari)
- [ ] **8.9.2** Test VTO on mobile devices (iOS and Android)
- [ ] **8.9.3** Test with various ring images (different sizes, backgrounds)
- [ ] **8.9.4** Test error scenarios: service down, upload fails, unsupported browser
- [ ] **8.9.5** Document VTO setup in `/docs/VTO_SETUP.md`
- [ ] **8.9.6** Add troubleshooting guide for common VTO issues
- [ ] **8.9.7** Create video demo of VTO feature (optional)

---

### **9.0 Admin Configuration Enhancements** (Week 8, FR-22)

#### 9.1 Add New Settings Tabs

- [ ] **9.1.1** Open `app/routes/app.builder.settings.tsx`
- [ ] **9.1.2** Update tab navigation to include: General, Pricing, Side Stones, Customer Engagement, Virtual Try-On, Appearance
- [ ] **9.1.3** Add tab state management (useState or URL params for active tab)
- [ ] **9.1.4** Render appropriate component based on active tab
- [ ] **9.1.5** Style active tab with underline or background color
- [ ] **9.1.6** Test tab switching works smoothly
- [ ] **9.1.7** Test tab persistence (URL params method preferred)

#### 9.2 Create Customer Engagement Settings Component

- [ ] **9.2.1** Create `app/components/admin/CustomerEngagementSettings.tsx` file
- [ ] **9.2.2** Add heading: "Customer Engagement & Inquiry Tools"
- [ ] **9.2.3** Create "Action Buttons" section with 4 toggles:
- [ ] **9.2.4** Toggle for "Drop A Hint" (s-checkbox, label, description)
- [ ] **9.2.5** Toggle for "Request More Info"
- [ ] **9.2.6** Toggle for "E-Mail A Friend"
- [ ] **9.2.7** Toggle for "Schedule Viewing"
- [ ] **9.2.8** Add "Notification Email" text field (s-text-field): where inquiries are sent
- [ ] **9.2.9** Validate email format on blur (regex check)
- [ ] **9.2.10** Add optional "Custom Button Labels" section:
- [ ] **9.2.11** Text input for each button (override default labels)
- [ ] **9.2.12** Show character limit: max 30 chars per label
- [ ] **9.2.13** Add "Save & Share" subsection:
- [ ] **9.2.14** Toggle to enable/disable save functionality
- [ ] **9.2.15** Toggle to enable/disable social sharing
- [ ] **9.2.16** Text input for custom shareable URL prefix (optional)
- [ ] **9.2.17** Add save button: calls /api/admin/settings with customerEngagement JSON
- [ ] **9.2.18** Show success/error banner after save
- [ ] **9.2.19** Test all toggles work correctly
- [ ] **9.2.20** Test email validation
- [ ] **9.2.21** Test settings save and load

#### 9.3 Create Virtual Try-On Settings Component

- [ ] **9.3.1** Create `app/components/admin/VirtualTryOnSettings.tsx` file
- [ ] **9.3.2** Add heading: "Virtual Try-On Configuration"
- [ ] **9.3.3** Add master toggle: "Enable Virtual Try-On"
- [ ] **9.3.4** Add integration type selector (s-select dropdown):
- [ ] **9.3.5** Options: "None", "Third-Party API", "DIY Image Upload", "AR Quick Look"
- [ ] **9.3.6** Conditionally show API credentials fields if "Third-Party API" selected:
- [ ] **9.3.7** API Provider (dropdown: Dor, GemFind, Custom)
- [ ] **9.3.8** API Key (password field with show/hide toggle)
- [ ] **9.3.9** API URL (text field, optional if provider is known)
- [ ] **9.3.10** Add "Test Connection" button: verifies API credentials work
- [ ] **9.3.11** Show connection status: green checkmark (success) or red X (failure)
- [ ] **9.3.12** Add "Custom Button Label" text field (override "Virtual Try On")
- [ ] **9.3.13** Add save button: calls /api/admin/settings with virtualTryOn JSON
- [ ] **9.3.14** Test enable/disable toggle
- [ ] **9.3.15** Test integration type selector shows/hides appropriate fields
- [ ] **9.3.16** Test "Test Connection" button
- [ ] **9.3.17** Test settings save correctly

#### 9.4 Create Appearance Settings Component

- [ ] **9.4.1** Create `app/components/admin/AppearanceSettings.tsx` file
- [ ] **9.4.2** Add heading: "Builder Appearance Customization"
- [ ] **9.4.3** Create "Custom Icons" section:
- [ ] **9.4.4** Add IconUploader component for setting style icons (9 icons)
- [ ] **9.4.5** Add IconUploader component for stone shape icons (10 icons)
- [ ] **9.4.6** Show preview of current icons (default or custom)
- [ ] **9.4.7** Add "Reset to Defaults" button for icons
- [ ] **9.4.8** Create "Color Customization" section:
- [ ] **9.4.9** Add primary color picker (s-color-picker or HTML5 input type="color")
- [ ] **9.4.10** Add secondary/accent color picker
- [ ] **9.4.11** Show live preview of colors (sample buttons, highlights)
- [ ] **9.4.12** Create "Email Branding" section:
- [ ] **9.4.13** Add logo upload (file input for merchant logo)
- [ ] **9.4.14** Validate logo: image format (jpg, png, svg), size <1MB, dimensions (min 200px wide)
- [ ] **9.4.15** Show logo preview
- [ ] **9.4.16** Add save button: calls /api/admin/settings with appearance JSON
- [ ] **9.4.17** Test icon uploads
- [ ] **9.4.18** Test color pickers update preview
- [ ] **9.4.19** Test logo upload and validation
- [ ] **9.4.20** Test settings save and apply to frontend

#### 9.5 Create Icon Uploader Component

- [ ] **9.5.1** Create `app/components/admin/IconUploader.tsx` file
- [ ] **9.5.2** Define props: iconType ("setting" | "shape"), currentIcons (object), onUpload (function)
- [ ] **9.5.3** Render grid of upload zones (9 for settings, 10 for shapes)
- [ ] **9.5.4** Each zone shows: icon name (e.g., "Halo"), current icon preview, upload button
- [ ] **9.5.5** Add file input (hidden) triggered by upload button click
- [ ] **9.5.6** Accept formats: .svg, .png, .webp
- [ ] **9.5.7** Validate on change: file type, size (<10KB), dimensions (min 64x64px)
- [ ] **9.5.8** Show validation errors below upload zone
- [ ] **9.5.9** Preview uploaded icon before saving
- [ ] **9.5.10** Add "Upload All" option: bulk upload via ZIP file (advanced, optional)
- [ ] **9.5.11** Create `/api/admin/icons/upload` endpoint (POST)
- [ ] **9.5.12** Handle multipart/form-data file upload
- [ ] **9.5.13** Validate file on server side (double-check type, size, dimensions)
- [ ] **9.5.14** Upload to Shopify Files API or cloud storage (S3, Cloudinary)
- [ ] **9.5.15** Return uploaded icon URL
- [ ] **9.5.16** Save URL in AppSettings.customIcons JSON field
- [ ] **9.5.17** Test single icon upload
- [ ] **9.5.18** Test validation rejects invalid files
- [ ] **9.5.19** Test icon appears in frontend after upload

#### 9.6 Update Product Metadata Forms

- [ ] **9.6.1** Open stone metadata form component (from Phase 1.0)
- [ ] **9.6.2** Add "Diamond Type" dropdown field (s-select)
- [ ] **9.6.3** Options: Mined, Lab Grown, Fancy Color
- [ ] **9.6.4** Set default: Mined
- [ ] **9.6.5** Mark as required field
- [ ] **9.6.6** Add "Certificate URL" text field (s-text-field)
- [ ] **9.6.7** Add placeholder: "https://example.com/certificates/gia-123456.pdf"
- [ ] **9.6.8** Validate URL format on blur (must be valid HTTPS URL)
- [ ] **9.6.9** Add help text: "Link to GIA, AGS, or other certificate PDF"
- [ ] **9.6.10** Update form submit to include new fields
- [ ] **9.6.11** Test adding diamond type when creating new stone metadata
- [ ] **9.6.12** Test editing existing stone metadata (updates diamond type)
- [ ] **9.6.13** Test certificate URL validation (accepts valid, rejects invalid)

#### 9.7 Update CSV Import/Export

- [ ] **9.7.1** Open CSV import handler (from Phase 1.0)
- [ ] **9.7.2** Add support for new columns: `diamond_type`, `certificate_url`
- [ ] **9.7.3** Parse diamond_type column: accept "mined", "lab_grown", "fancy_color", "Mined", "Lab Grown", etc. (case-insensitive)
- [ ] **9.7.4** Default to "mined" if column missing or empty
- [ ] **9.7.5** Validate certificate_url: must be valid URL if provided
- [ ] **9.7.6** Update CSV export to include new columns
- [ ] **9.7.7** Update sample CSV template: add example rows with new columns
- [ ] **9.7.8** Test CSV import with new columns
- [ ] **9.7.9** Test CSV import backward compatibility (old CSVs without new columns still work)
- [ ] **9.7.10** Test CSV export includes new data

#### 9.8 Saved Configurations Admin View

- [ ] **9.8.1** Create `app/routes/app.builder.saved-configs.tsx` file
- [ ] **9.8.2** Create `app/routes/api.admin/saved-configs.tsx` (GET endpoint)
- [ ] **9.8.3** Authenticate request (Shopify session)
- [ ] **9.8.4** Open `app/services/configuration.server.ts`
- [ ] **9.8.5** Create getSavedConfigurations() function: fetch by shop, paginated
- [ ] **9.8.6** Join SavedConfiguration with Configuration for full details
- [ ] **9.8.7** Return: shareToken, views, shareCount, createdAt, configuration summary
- [ ] **9.8.8** Create `app/components/admin/SavedConfigurationsList.tsx` component
- [ ] **9.8.9** Render table: Date Saved, Share URL, Views, Share Count, Status, Actions
- [ ] **9.8.10** Add "Copy URL" button for each configuration
- [ ] **9.8.11** Add "View Configuration" button: opens saved URL in new tab
- [ ] **9.8.12** Add pagination controls (50 per page)
- [ ] **9.8.13** Add filters: date range, status (saved, completed, ordered)
- [ ] **9.8.14** Test saved configurations list displays correctly
- [ ] **9.8.15** Test "Copy URL" functionality
- [ ] **9.8.16** Test "View Configuration" opens correct URL

#### 9.9 Testing Admin Enhancements

- [ ] **9.9.1** Test all new settings tabs display correctly
- [ ] **9.9.2** Test settings save in each tab
- [ ] **9.9.3** Test settings load correctly on page refresh
- [ ] **9.9.4** Test conditional fields show/hide based on selections
- [ ] **9.9.5** Test icon upload workflow end-to-end
- [ ] **9.9.6** Test inquiry management workflow
- [ ] **9.9.7** Test saved configurations management
- [ ] **9.9.8** Verify all admin features work on mobile

---

### **10.0 Email Service Integration** (Week 5-6, FR-16, FR-17)

#### 10.1 Email Service Setup

- [ ] **10.1.1** Choose email service provider: SendGrid (recommended), AWS SES, or Postmark
- [ ] **10.1.2** Create account on chosen provider
- [ ] **10.1.3** Verify email domain (add DNS records: SPF, DKIM, DMARC)
- [ ] **10.1.4** Obtain API key from provider
- [ ] **10.1.5** Add to .env file: `EMAIL_API_KEY`, `EMAIL_FROM_ADDRESS`, `EMAIL_FROM_NAME`
- [ ] **10.1.6** Install email SDK: `npm install @sendgrid/mail` (or equivalent)
- [ ] **10.1.7** Test email service connection with test email
- [ ] **10.1.8** Document setup process in `/docs/EMAIL_SETUP.md`

#### 10.2 Create Email Service

- [ ] **10.2.1** Create `app/services/email.server.ts` file
- [ ] **10.2.2** Initialize email client (SendGrid, SES, or Postmark)
- [ ] **10.2.3** Implement sendEmail() base function: accepts EmailOptions (to, subject, html, text, attachments)
- [ ] **10.2.4** Add email validation: check recipient email format
- [ ] **10.2.5** Implement retry logic: max 3 attempts with exponential backoff (1s, 2s, 4s)
- [ ] **10.2.6** Add error handling: network errors, auth errors, rate limits
- [ ] **10.2.7** Log all email attempts to AnalyticsEvent or create EmailLog model
- [ ] **10.2.8** Track: recipient, subject, status (sent, failed, bounced), timestamp
- [ ] **10.2.9** Implement sendBulkEmails() for multiple recipients (if needed)
- [ ] **10.2.10** Add rate limiting: max 10 emails per hour per session (prevent spam)
- [ ] **10.2.11** Test sendEmail() function with test recipient
- [ ] **10.2.12** Test retry logic (simulate failure)
- [ ] **10.2.13** Test rate limiting (11th email fails)

#### 10.3 Create Email Template Generator

- [ ] **10.3.1** Create `app/utils/email-templates.ts` file
- [ ] **10.3.2** Create base HTML template: header, body, footer, responsive styles
- [ ] **10.3.3** Add merchant branding: logo (from AppSettings), colors, contact info
- [ ] **10.3.4** Implement generateShareConfigurationEmail() function
- [ ] **10.3.5** Template structure: Greeting, "X wants to share a ring with you", ring images, specs, price, CTA button
- [ ] **10.3.6** Include inline CSS for email client compatibility
- [ ] **10.3.7** Add plain text version (fallback for text-only clients)
- [ ] **10.3.8** Implement generateDropAHintEmail() function
- [ ] **10.3.9** Template structure: Romantic greeting, hint message, ring images, NO PRICE, special date, view link
- [ ] **10.3.10** Tone: romantic and mysterious (it's a hint!)
- [ ] **10.3.11** Implement generateRequestInfoEmail() function (to merchant)
- [ ] **10.3.12** Template structure: Customer inquiry notification, contact details, question, configuration details, reply CTA
- [ ] **10.3.13** Include "Reply to Customer" button (mailto: link)
- [ ] **10.3.14** Implement generateScheduleViewingEmail() function (to merchant)
- [ ] **10.3.15** Template structure: Viewing request notification, customer details, preferred date/time, configuration, calendar CTA
- [ ] **10.3.16** Generate iCal attachment: create .ics file in RFC 5545 format
- [ ] **10.3.17** iCal fields: VEVENT, SUMMARY, DTSTART, DTEND, LOCATION, DESCRIPTION, ATTENDEE
- [ ] **10.3.18** Test each template renders correctly in HTML preview
- [ ] **10.3.19** Test plain text versions are readable
- [ ] **10.3.20** Test iCal attachment opens in calendar apps

#### 10.4 Integrate Email Sending into Inquiry API

- [ ] **10.4.1** Open `app/routes/api.builder/inquiry.tsx`
- [ ] **10.4.2** After creating inquiry in database, trigger appropriate email
- [ ] **10.4.3** If type="drop_a_hint": send Drop A Hint email to recipientEmail
- [ ] **10.4.4** If type="request_info": send Request Info email to merchant (notificationEmail from AppSettings)
- [ ] **10.4.5** If type="email_friend": send Share Configuration email to recipientEmail
- [ ] **10.4.6** If type="schedule_viewing": send Schedule Viewing email to merchant with iCal attachment
- [ ] **10.4.7** Handle email sending errors: log error, but still return success to user (inquiry saved even if email fails)
- [ ] **10.4.8** Add async email sending (don't block API response)
- [ ] **10.4.9** Optionally use queue (Bull, BullMQ) for email processing
- [ ] **10.4.10** Test email sending integrated with inquiry submission

#### 10.5 Create Share Email Form Component

- [ ] **10.5.1** Create `app/components/builder/ShareEmailForm.tsx` file
- [ ] **10.5.2** Define props: configurationId, shareUrl, onSuccess
- [ ] **10.5.3** Render form fields: Recipient Email (required), Your Name (optional), Message (optional, 500 chars)
- [ ] **10.5.4** Add email validation
- [ ] **10.5.5** Add character counter for message
- [ ] **10.5.6** Implement submit handler: call /api/builder/share endpoint
- [ ] **10.5.7** Create `/api/builder/share` endpoint (POST)
- [ ] **10.5.8** Send Share Configuration email using email service
- [ ] **10.5.9** Increment Configuration.shareCount on successful send
- [ ] **10.5.10** Return success response
- [ ] **10.5.11** Show success message in form: "Email sent successfully!"
- [ ] **10.5.12** Test form validation
- [ ] **10.5.13** Test email sending
- [ ] **10.5.14** Test shareCount increments

#### 10.6 Email Testing & Validation

- [ ] **10.6.1** Send test emails to Gmail account: verify delivery and rendering
- [ ] **10.6.2** Send test emails to Outlook: verify rendering
- [ ] **10.6.3** Send test emails to Yahoo Mail: verify rendering
- [ ] **10.6.4** Send test emails to Apple Mail (iOS and macOS): verify rendering
- [ ] **10.6.5** Test responsive email templates on mobile email clients
- [ ] **10.6.6** Test all 4 email templates with real configuration data
- [ ] **10.6.7** Use Litmus or Email on Acid for comprehensive email testing (optional)
- [ ] **10.6.8** Test spam score: use Mail Tester (mail-tester.com) to check deliverability
- [ ] **10.6.9** Verify SPF and DKIM pass: use MX Toolbox or similar
- [ ] **10.6.10** Monitor bounce rates in email service dashboard
- [ ] **10.6.11** Aim for >95% delivery rate
- [ ] **10.6.12** Add email preview feature in admin: merchants can send test emails to themselves

#### 10.7 Email Error Handling

- [ ] **10.7.1** Implement graceful failure: inquiry/share saved even if email fails
- [ ] **10.7.2** Log email errors to console and AnalyticsEvent
- [ ] **10.7.3** Show user-friendly message: "Your request was submitted, but we couldn't send the email. We'll follow up via phone."
- [ ] **10.7.4** Add admin notification of email failures (optional)
- [ ] **10.7.5** Implement retry queue for failed emails (background job)
- [ ] **10.7.6** Test various failure scenarios: SMTP down, rate limited, invalid recipient
- [ ] **10.7.7** Verify errors don't crash the application

---

### **11.0 Social Sharing Integration** (Week 5, FR-21)

#### 11.1 Facebook Integration Setup

- [ ] **11.1.1** Go to developers.facebook.com and create Facebook App
- [ ] **11.1.2** Configure app for website: add site URL
- [ ] **11.1.3** Obtain Facebook App ID from app dashboard
- [ ] **11.1.4** Add to .env file: `FACEBOOK_APP_ID=[your-app-id]`
- [ ] **11.1.5** Open `app/root.tsx`
- [ ] **11.1.6** Add Facebook SDK script in head: async load from connect.facebook.net/en_US/sdk.js
- [ ] **11.1.7** Initialize FB SDK: `window.fbAsyncInit` with appId, cookie, xfbml, version
- [ ] **11.1.8** Test FB SDK loads correctly (check window.FB exists)

#### 11.2 Create Social Sharing Helpers

- [ ] **11.2.1** Create `app/utils/share-helpers.ts` file
- [ ] **11.2.2** Implement generateFacebookShareUrl() function
- [ ] **11.2.3** Accept params: url, quote (optional)
- [ ] **11.2.4** Use FB.ui() Share Dialog method
- [ ] **11.2.5** Return promise that resolves on share success
- [ ] **11.2.6** Implement generateTwitterShareUrl() function
- [ ] **11.2.7** Build Twitter Web Intent URL: `https://twitter.com/intent/tweet?text=...&url=...&hashtags=...`
- [ ] **11.2.8** URL encode all parameters
- [ ] **11.2.9** Implement generatePinterestShareUrl() function
- [ ] **11.2.10** Build Pinterest Pin It URL: `https://pinterest.com/pin/create/button/?url=...&media=...&description=...`
- [ ] **11.2.11** Require image URL for Pinterest
- [ ] **11.2.12** Create buildShareText() helper: generates share text from configuration
- [ ] **11.2.13** Format: "[Setting Name] with [Carat]ct [Shape] Diamond - $[Price]"
- [ ] **11.2.14** Add optional hashtags: #EngagementRing #CustomRing #DiamondRing
- [ ] **11.2.15** Test URL generation for each platform
- [ ] **11.2.16** Test URL encoding handles special characters

#### 11.3 Create Social Share Buttons Component

- [ ] **11.3.1** Create `app/components/builder/SocialShareButtons.tsx` file
- [ ] **11.3.2** Define props: shareUrl, shareText, imageUrl, onSave (function)
- [ ] **11.3.3** Import icons: FaRegBookmark (save), FaFacebook, FaTwitter, FaPinterest
- [ ] **11.3.4** Render 4 buttons: Save, Facebook, Twitter, Pinterest
- [ ] **11.3.5** Style each button with platform brand colors:
- [ ] **11.3.6** Save: gray/neutral (#6B7280)
- [ ] **11.3.7** Facebook: FB blue (#1877F2)
- [ ] **11.3.8** Twitter: Twitter blue (#1DA1F2)
- [ ] **11.3.9** Pinterest: Pinterest red (#E60023)
- [ ] **11.3.10** Implement "Save" button click: calls onSave(), stores to localStorage, shows "Saved!" toast
- [ ] **11.3.11** Implement "Facebook" button click: calls FB.ui() Share Dialog
- [ ] **11.3.12** Implement "Twitter" button click: opens Twitter intent URL in popup window (600x400px)
- [ ] **11.3.13** Implement "Pinterest" button click: opens Pinterest URL in popup window (600x600px)
- [ ] **11.3.14** Add loading states for social buttons while API calls in progress
- [ ] **11.3.15** Track social shares: call analytics when shared
- [ ] **11.3.16** Handle share failures: FB SDK not loaded, popup blocked, etc.
- [ ] **11.3.17** Test Save button: saves to localStorage, shows confirmation
- [ ] **11.3.18** Test Facebook share: opens dialog, shares correctly
- [ ] **11.3.19** Test Twitter share: opens compose, text pre-filled
- [ ] **11.3.20** Test Pinterest share: opens pin creator, image included

#### 11.4 Implement Open Graph Meta Tags

- [ ] **11.4.1** Create meta function for each detail page route
- [ ] **11.4.2** Setting detail page meta:
- [ ] **11.4.3** og:title: "[Setting Name] - [Style] Ring Setting"
- [ ] **11.4.4** og:description: "Starting at $[Price]. Available in [Metal Types]. Compatible with [Shapes]."
- [ ] **11.4.5** og:image: primary setting image URL
- [ ] **11.4.6** og:url: canonical URL to detail page
- [ ] **11.4.7** og:type: "product"
- [ ] **11.4.8** Diamond detail page meta:
- [ ] **11.4.9** og:title: "[Carat] Carat [Shape] Diamond - [Cut] [Color] [Clarity]"
- [ ] **11.4.10** og:description: "$[Price] - [Certificate] Certified"
- [ ] **11.4.11** og:image: diamond image URL
- [ ] **11.4.12** Saved configuration page meta:
- [ ] **11.4.13** og:title: "Custom Ring Configuration - [Setting] with [Diamond]"
- [ ] **11.4.14** og:description: "Total: $[Price]. Saved configuration ready to purchase."
- [ ] **11.4.15** og:image: setting or composite image
- [ ] **11.4.16** Add Twitter Card meta tags: twitter:card="summary_large_image", twitter:title, twitter:description, twitter:image
- [ ] **11.4.17** Test og: tags with Facebook Debugger: https://developers.facebook.com/tools/debug/
- [ ] **11.4.18** Test Twitter Card with Twitter Card Validator: https://cards-dev.twitter.com/validator
- [ ] **11.4.19** Verify images display correctly in social previews
- [ ] **11.4.20** Test og: tags update when configuration changes

#### 11.5 Mobile Native Share Sheet

- [ ] **11.5.1** Detect if browser supports navigator.share (iOS Safari, Android Chrome)
- [ ] **11.5.2** If supported, add "Share" button that uses native share sheet
- [ ] **11.5.3** Call navigator.share({ title, text, url }) with configuration details
- [ ] **11.5.4** Native share shows apps: Messages, Email, Twitter, Facebook, etc.
- [ ] **11.5.5** If not supported, fallback to individual social buttons
- [ ] **11.5.6** Test native share on iOS Safari
- [ ] **11.5.7** Test native share on Android Chrome
- [ ] **11.5.8** Test fallback on desktop browsers

#### 11.6 Share Analytics Tracking

- [ ] **11.6.1** Create trackShare() function in analytics util
- [ ] **11.6.2** Track platform: "facebook", "twitter", "pinterest", "email", "native", "copy_link"
- [ ] **11.6.3** Track configurationId and shareToken
- [ ] **11.6.4** Save to AnalyticsEvent model: type="share", eventData with platform
- [ ] **11.6.5** Increment Configuration.shareCount on each share
- [ ] **11.6.6** Test tracking events are recorded correctly
- [ ] **11.6.7** Verify shareCount increments

#### 11.7 Integrate Social Sharing into Components

- [ ] **11.7.1** Add SocialShareButtons to ShareModal (task 5.6)
- [ ] **11.7.2** Add SocialShareButtons to Step 4 Review page
- [ ] **11.7.3** Add SocialShareButtons to product detail pages (setting and diamond)
- [ ] **11.7.4** Pass correct shareUrl, shareText, imageUrl to component
- [ ] **11.7.5** Test social buttons appear in all locations
- [ ] **11.7.6** Test sharing from each location works correctly

#### 11.8 Testing & Troubleshooting

- [ ] **11.8.1** Test Facebook sharing: verify Share Dialog opens, post appears on timeline
- [ ] **11.8.2** Test Twitter sharing: verify compose dialog opens, post appears on timeline
- [ ] **11.8.3** Test Pinterest pinning: verify pin created on board
- [ ] **11.8.4** Test on browsers with ad blockers (may block social scripts)
- [ ] **11.8.5** Test on browsers with strict privacy settings (may block third-party cookies)
- [ ] **11.8.6** Add fallback messaging when social features blocked
- [ ] **11.8.7** Test popup blockers: handle gracefully if popup blocked
- [ ] **11.8.8** Create troubleshooting guide in `/docs/SOCIAL_SHARING_SETUP.md`

---

### **12.0 Testing, Optimization & Documentation** (Week 8, FR-23)

#### 12.1 Performance Optimization

- [ ] **12.1.1** Run Lighthouse audit on all new pages (target: 90+ performance score)
- [ ] **12.1.2** Optimize icon images: convert to WebP, compress to <10KB each
- [ ] **12.1.3** Implement lazy loading for ComparisonModal (don't load until opened)
- [ ] **12.1.4** Add React.memo to expensive components (ImageGallery, ComparisonTable, StoneGridView)
- [ ] **12.1.5** Implement virtualization for grid view if >100 stones (react-window or react-virtualized)
- [ ] **12.1.6** Add debouncing to all search/filter inputs (300ms)
- [ ] **12.1.7** Cache filter options in localStorage (shapes, colors, etc.) - refresh every 24 hours
- [ ] **12.1.8** Optimize database queries: ensure all new queries use indexes
- [ ] **12.1.9** Test comparison query performance with 1000+ stones
- [ ] **12.1.10** Verify build time remains <2s after all changes

#### 12.2 Cross-Browser Testing

- [ ] **12.2.1** Test all features on Chrome (desktop and mobile)
- [ ] **12.2.2** Test all features on Firefox (desktop and mobile)
- [ ] **12.2.3** Test all features on Safari (desktop and iOS)
- [ ] **12.2.4** Test all features on Edge (desktop)
- [ ] **12.2.5** Test icon filters display correctly across browsers
- [ ] **12.2.6** Test modal animations and transitions
- [ ] **12.2.7** Test email sending and receiving across providers
- [ ] **12.2.8** Test social sharing on each platform

#### 12.3 Mobile Testing

- [ ] **12.3.1** Test icon filters on mobile (touch targets >=44px)
- [ ] **12.3.2** Test diamond type tabs on mobile (easy tap, no mis-clicks)
- [ ] **12.3.3** Test grid view on mobile (1 column, smooth scrolling)
- [ ] **12.3.4** Test comparison modal on mobile (horizontal scroll or stacked)
- [ ] **12.3.5** Test all modals on mobile (full screen, easy close)
- [ ] **12.3.6** Test action buttons on mobile (stacked, full-width, proper spacing)
- [ ] **12.3.7** Test image gallery on mobile (swipe, pinch zoom)
- [ ] **12.3.8** Test VTO on mobile (upload, overlay, download)
- [ ] **12.3.9** Test form inputs on mobile (keyboards, date/time pickers)
- [ ] **12.3.10** Test social sharing with native share sheet (iOS/Android)

#### 12.4 Edge Case Testing

- [ ] **12.4.1** Test with 0 stones (show "No stones available" message)
- [ ] **12.4.2** Test with 1 stone (comparison disabled, grid/list both work)
- [ ] **12.4.3** Test with 10,000+ stones (pagination, performance)
- [ ] **12.4.4** Test saved configuration with deleted products (show "Product no longer available")
- [ ] **12.4.5** Test expired saved configurations (show "Link expired" message)
- [ ] **12.4.6** Test invalid share tokens (show 404 or "Not found")
- [ ] **12.4.7** Test email failures (SMTP down, invalid recipient)
- [ ] **12.4.8** Test social API failures (Facebook down, Twitter rate limited)
- [ ] **12.4.9** Test VTO failures (API down, upload fails, unsupported browser)
- [ ] **12.4.10** Test comparison with identical diamonds (no differences to highlight)
- [ ] **12.4.11** Test SKU search with no results
- [ ] **12.4.12** Test SKU search with special characters in SKU

#### 12.5 Backward Compatibility Testing

- [ ] **12.5.1** Verify Phase 1.0 merchants can upgrade without breaking
- [ ] **12.5.2** Test existing configurations load correctly after migration
- [ ] **12.5.3** Test existing stone metadata works with new diamondType field (defaults to "mined")
- [ ] **12.5.4** Verify all Phase 1.0 features still work (4-step flow, pricing, cart)
- [ ] **12.5.5** Test with Phase 1.0 configuration (without new fields)
- [ ] **12.5.6** Ensure new features are opt-in (disabled by default in AppSettings)

#### 12.6 Security Testing

- [ ] **12.6.1** Test multi-tenant isolation on SavedConfiguration (can't access other shop's saved configs)
- [ ] **12.6.2** Test multi-tenant isolation on CustomerInquiry
- [ ] **12.6.3** Validate all inquiry inputs for XSS vulnerabilities
- [ ] **12.6.4** Test SQL injection prevention on SKU search
- [ ] **12.6.5** Validate share token generation (cryptographically secure, no collisions)
- [ ] **12.6.6** Test rate limiting on email sending (prevent spam)
- [ ] **12.6.7** Test file upload validation (icon upload, prevent malicious files)
- [ ] **12.6.8** Verify API authentication on all admin endpoints

#### 12.7 Integration Testing

- [ ] **12.7.1** Test complete flow: Browse settings → Select → Save → Share via email → Recipient loads URL → Completes purchase
- [ ] **12.7.2** Test comparison flow: Select 3 diamonds → Compare → Select from comparison → Complete configuration
- [ ] **12.7.3** Test inquiry flow: Drop A Hint → Email sent → Merchant receives → Replies to customer
- [ ] **12.7.4** Test VTO flow: Click VTO → Complete experience → Return to builder → Add to cart
- [ ] **12.7.5** Test admin configuration: Enable features → Features appear in builder → Disable → Features hidden
- [ ] **12.7.6** Test diamond type flow: Select Lab Grown tab → See lab grown stones only → Compare → Share
- [ ] **12.7.7** Test SKU search: Search by stock# → Find exact match → View details → Add to configuration

#### 12.8 Documentation

- [ ] **12.8.1** Create /docs/PHASE_2_FEATURES.md (comprehensive guide to all new features)
- [ ] **12.8.2** Update /docs/MERCHANT_SETUP.md to include Phase 2.0 features setup
- [ ] **12.8.3** Create /docs/EMAIL_SETUP.md (email service configuration guide)
- [ ] **12.8.4** Create /docs/VTO_SETUP.md (virtual try-on integration guide)
- [ ] **12.8.5** Create /docs/SOCIAL_SHARING_SETUP.md (Facebook App ID, og: tags)
- [ ] **12.8.6** Create /docs/ICON_CUSTOMIZATION.md (how to upload custom icons)
- [ ] **12.8.7** Update /docs/API_TESTING.md with new endpoint examples
- [ ] **12.8.8** Create /docs/PHASE_2_MIGRATION_GUIDE.md (for Phase 1.0 → 2.0 upgrade)
- [ ] **12.8.9** Update README.md with Phase 2.0 features overview
- [ ] **12.8.10** Create demo video or GIF showcasing Phase 2.0 features (optional)

#### 12.9 Deployment Preparation

- [ ] **12.9.1** Update .env.example with new environment variables
- [ ] **12.9.2** Update package.json with new dependencies and versions
- [ ] **12.9.3** Run production build test: `npm run build`
- [ ] **12.9.4** Test production server: `npm run start`
- [ ] **12.9.5** Verify all assets bundled correctly (icons, fonts, styles)
- [ ] **12.9.6** Create deployment checklist in /docs/DEPLOYMENT.md (Phase 2.0 section)
- [ ] **12.9.7** Document rollback procedure if Phase 2.0 has issues
- [ ] **12.9.8** Prepare feature flags if gradual rollout needed

#### 12.10 Beta Testing & Launch

- [ ] **12.10.1** Deploy to staging environment
- [ ] **12.10.2** Test all features on staging with real data
- [ ] **12.10.3** Identify 2-3 beta merchants
- [ ] **12.10.4** Onboard beta merchants and enable Phase 2.0 features
- [ ] **12.10.5** Collect feedback after 1 week of beta testing
- [ ] **12.10.6** Fix critical bugs from beta feedback
- [ ] **12.10.7** Deploy to production
- [ ] **12.10.8** Monitor error logs and performance for first 48 hours
- [ ] **12.10.9** Track feature adoption metrics (save rate, share rate, inquiry rate)
- [ ] **12.10.10** Create Phase 2.0 launch announcement

---

## Detailed Task Breakdown by Week

### Weeks 1-2: Visual Enhancements & Foundation

**Tasks:** 1.0, 2.0, 3.0 (70 sub-tasks)
**Deliverable:** Icon filters, diamond type tabs, grid/list toggle, advanced browsing

### Weeks 3-4: Comparison & Detail Pages

**Tasks:** 4.0, 7.0 (62 sub-tasks)
**Deliverable:** Comparison tool, rich product detail pages

### Week 5: Save & Share

**Tasks:** 5.0, 10.0 (partial), 11.0 (66 sub-tasks)
**Deliverable:** Save functionality, email sharing, social sharing

### Weeks 6-7: Customer Engagement

**Tasks:** 6.0, 9.0 (partial), 10.0 (complete) (78 sub-tasks)
**Deliverable:** 4 action buttons, inquiry system, email templates

### Week 7: Virtual Try-On

**Tasks:** 8.0 (30 sub-tasks)
**Deliverable:** VTO integration (chosen provider)

### Week 8: Admin & Testing

**Tasks:** 9.0 (complete), 12.0 (96 sub-tasks)
**Deliverable:** Admin enhancements, comprehensive testing, launch prep

---

## Task Statistics

- **Total Parent Tasks:** 12
- **Total Sub-Tasks:** 378 (highly detailed, edge-case covered)
- **New Components:** 35
- **Modified Components:** 5
- **New API Endpoints:** 11
- **Modified API Endpoints:** 2
- **New Services:** 3 (email, inquiry, VTO)
- **New Database Models:** 2 (SavedConfiguration, CustomerInquiry)
- **Modified Database Models:** 3 (StoneMetadata, Configuration, AppSettings)
- **New Database Fields:** 12
- **New Database Indexes:** 8
- **Email Templates:** 4
- **Icon Assets:** 19 (9 setting styles + 10 stone shapes)
- **New Routes:** 8 (3 storefront + 5 admin)
- **Estimated Lines of Code:** ~8,000-10,000 new lines

---

## Implementation Notes

### Clean Code Practices

1. **Type Safety:** All new code must be fully typed (no `any` types)
2. **Service Layer:** Business logic in services, not in components or routes
3. **Validation:** Backend validation for all user inputs
4. **Error Handling:** Try/catch blocks, user-friendly error messages
5. **Multi-Tenant:** Always filter by shop in database queries
6. **Accessibility:** aria-labels, keyboard navigation, min touch targets
7. **Performance:** Lazy loading, memoization, debouncing, indexes
8. **Testing:** Test each feature as completed (don't accumulate testing debt)

### Development Workflow

1. Create database migrations first (task 1.0)
2. Build backend services and APIs (parallel with frontend)
3. Build frontend components (use Phase 1.0 patterns)
4. Integrate components into routes
5. Test feature end-to-end
6. Fix bugs before moving to next task
7. Document as you go

### Priority Levels

- **P0 (Critical):** Tasks 1.0, 2.0, 3.0, 5.0, 10.0 (core functionality)
- **P1 (High):** Tasks 4.0, 6.0, 7.0, 11.0 (customer-facing features)
- **P2 (Medium):** Tasks 8.0, 9.0 (admin and optional features)
- **P3 (Polish):** Task 12.0 (testing, optimization, docs)

### Parallel Work Opportunities

- **Developer 1:** Tasks 1.0, 2.0, 3.0 (visual enhancements)
- **Developer 2:** Tasks 5.0, 10.0, 11.0 (save/share/email)
- **Developer 3:** Tasks 4.0, 6.0, 7.0 (comparison, inquiry, detail pages)
- **Week 7-8:** All developers on task 12.0 (testing)

---

**End of Task List**

**Total Sub-Tasks:** ~320  
**Estimated Effort:** 8 weeks with 2-3 developers  
**Status:** Ready for implementation kickoff

**Next Step:** Assign tasks to development team and begin with Task 1.0 (Database migrations)
