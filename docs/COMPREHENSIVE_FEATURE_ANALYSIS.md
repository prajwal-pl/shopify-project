# Ring Builder - Shopify App Feature Analysis & Task List

**Last Updated:** October 22, 2025
**Current Completion:** ~40% Complete
**Timeline to MVP:** 4-5 weeks (conservative) | 3 weeks (aggressive)
**App Type:** Shopify App (integrates with Shopify cart & admin)

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Critical Context: This is a Shopify App](#critical-context-this-is-a-shopify-app)
3. [Analytics & Lead Generation (PRIORITY)](#analytics--lead-generation-priority)
4. [Current State by Route/Page](#current-state-by-routepage)
5. [Detailed Tasks by Route (Small Tasks)](#detailed-tasks-by-route-small-tasks)
6. [Cross-Cutting Features](#cross-cutting-features)
7. [Sprint Plan with Small Tasks](#sprint-plan-with-small-tasks)
8. [Features Removed from Scope](#features-removed-from-scope)

---

## Executive Summary

### Current State Overview

**Step 1 (Settings Selection):** 90% Complete
**Step 2 (Diamond Selection):** 85% Complete
**Step 3 (Review/Complete):** 70% Complete
**Step 4 (Customization):** 0% Complete ❌ **CRITICAL BLOCKER**
**Analytics & Tracking:** 0% Complete ❌ **CRITICAL for lead generation**
**Shopify Cart Integration:** 20% Complete ❌ **CRITICAL BLOCKER**

### Key Achievements
- ✅ Strong TypeScript + React Router 7 foundation
- ✅ Detail view pages for settings and diamonds
- ✅ Advanced filtering system (shapes, 4Cs, carat, price)
- ✅ Diamond type categorization (Mined/Lab/Fancy)
- ✅ Mock data integration with 50+ products
- ✅ Price calculation system with breakdown
- ✅ Step navigation with completion tracking
- ✅ Responsive design (desktop/tablet/mobile)

### Critical Gaps (MUST IMPLEMENT)
1. ❌ **Step 4 (Customization)** - Cannot complete purchase without this
2. ❌ **Shopify Cart Integration** - Cannot add to cart
3. ❌ **Analytics & Lead Tracking** - Cannot track users for sales follow-up
4. ❌ **Save & Share** - Cannot capture leads via sharing
5. ❌ **Comparison Feature** - Built but not connected
6. ❌ **Customer Engagement Modals** - Cannot capture inquiry leads

---

## Critical Context: This is a Shopify App

### What This Means

**This is NOT a standalone website. It's a Shopify App that:**

1. **Integrates with Merchant's Shopify Store**
   - Installed via Shopify App Store
   - Uses merchant's products as inventory
   - Adds configured rings to merchant's Shopify cart
   - Uses Shopify's checkout process

2. **Generates Leads for Merchants**
   - Tracks what customers are viewing/comparing
   - Captures customer inquiries (phone, email)
   - Shows abandoned configurations
   - Provides merchant with sales opportunities

3. **Key Shopify Integration Points**
   - **Cart API:** Add configured ring to Shopify cart with line item properties
   - **Admin API:** Sync product data, manage inventory
   - **Webhooks:** Track product updates, cart abandonment
   - **Metafields:** Store ring/diamond metadata
   - **Analytics:** Track user behavior for merchant follow-up

### User Flow (End-to-End)

```
Customer visits merchant's website
    ↓
Clicks "Build Your Ring" (embedded in theme)
    ↓
Goes through 4-step builder:
    Step 1: Select Setting
    Step 2: Select Diamond
    Step 3: (MISSING) Customize (ring size, metal, engraving)
    Step 4: Review
    ↓
Clicks "Add to Cart"
    ↓
Configuration saved to database with:
    - Customer tracking ID
    - All selections
    - Timestamp
    - Analytics data
    ↓
Added to Shopify cart with line item properties:
    - Setting SKU
    - Diamond SKU
    - Customizations
    - Configuration ID
    ↓
Customer proceeds to Shopify checkout
    ↓
Merchant receives order with full configuration details
```

### Why This Matters for Development

**Every feature must consider:**
- Does this help merchant close sales?
- Does this capture lead information?
- Does this integrate with Shopify properly?
- Does this track customer behavior for follow-up?

---

## Analytics & Lead Generation (PRIORITY)

### Why Analytics is Critical

**Merchants need to know:**
1. Who is using the ring builder (even if they don't purchase)
2. What they're looking at (price range, styles, diamonds)
3. Where they drop off (which step do they abandon)
4. Contact information (from inquiries, hints, shares)
5. Configuration details (so they can call and help close the sale)

### What to Track (Required for MVP)

#### 1. User Session Tracking
```typescript
interface UserSession {
  sessionId: string;           // Unique session ID
  shop: string;                // Merchant shop
  startedAt: Date;             // When they started
  lastActiveAt: Date;          // Last activity timestamp
  currentStep: number;         // Where they are
  device: 'mobile' | 'desktop'; // Device type
  referrer?: string;           // How they got here
}
```

#### 2. Product View Tracking
```typescript
interface ProductView {
  sessionId: string;
  productType: 'setting' | 'diamond';
  productId: string;
  sku: string;
  price: number;
  viewedAt: Date;
  viewDuration: number;        // How long they viewed (seconds)
  viewedInDetail: boolean;     // Did they open detail page?
}
```

#### 3. Filter Usage Tracking
```typescript
interface FilterUsage {
  sessionId: string;
  step: number;
  filterType: string;          // 'shape', 'price', 'cut', etc.
  filterValue: any;            // Selected value
  appliedAt: Date;
}
```

#### 4. Configuration Tracking
```typescript
interface ConfigurationProgress {
  sessionId: string;
  configurationId?: string;    // After save
  settingId?: string;          // Selected setting
  diamondId?: string;          // Selected diamond
  customizations?: object;     // Ring size, metal, etc.
  totalPrice: number;
  completedSteps: number[];    // [1, 2] means completed step 1 & 2
  lastUpdatedAt: Date;
  status: 'in_progress' | 'completed' | 'abandoned' | 'purchased';
}
```

#### 5. Lead Capture Events
```typescript
interface LeadCapture {
  sessionId: string;
  leadType: 'inquiry' | 'hint' | 'share' | 'save';
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  message?: string;
  configurationId?: string;
  capturedAt: Date;
}
```

#### 6. Abandonment Tracking
```typescript
interface Abandonment {
  sessionId: string;
  configurationId?: string;
  abandonedAtStep: number;
  timeSpent: number;           // Total time in builder (seconds)
  itemsViewed: number;         // How many products they viewed
  priceRange: {                // What they were looking at
    min: number;
    max: number;
  };
  abandonedAt: Date;
}
```

### Analytics Implementation Tasks

**File Location:** `app/services/analytics.server.ts` (NEW)

**Priority: P0 (CRITICAL - Implement alongside Step 4)**

**Task 1.1: Create Analytics Service** (1 day)
- Create `AnalyticsService` class
- Methods:
  - `trackSession(sessionId, data)`
  - `trackProductView(sessionId, productData)`
  - `trackFilterUsage(sessionId, filterData)`
  - `trackConfiguration(sessionId, configData)`
  - `trackLeadCapture(sessionId, leadData)`
  - `trackAbandonment(sessionId)`
- Store in database (AnalyticsEvent table)
- Batch writes for performance (every 30 seconds)

**Task 1.2: Add Session Management to BuilderProvider** (0.5 days)
- Generate unique sessionId on builder load (nanoid)
- Store in localStorage and state
- Track session start time
- Track last activity time
- Update on every user interaction

**Task 1.3: Implement Product View Tracking** (0.5 days)
- Track when user clicks on product card
- Track when user opens detail view
- Track view duration (time spent on detail page)
- Send to analytics service on unmount

**Task 1.4: Implement Filter Tracking** (0.5 days)
- Track every filter change (shape, price, cut, color, clarity)
- Track filter combinations
- Track preset usage
- Send to analytics service on change

**Task 1.5: Implement Configuration Tracking** (0.5 days)
- Track when user selects setting
- Track when user selects diamond
- Track customization changes
- Track step completion
- Update configuration status
- Mark as abandoned if inactive for 30 minutes

**Task 1.6: Implement Lead Capture Tracking** (0.5 days)
- Track when user submits inquiry form
- Track when user drops a hint
- Track when user shares configuration
- Track when user saves configuration
- Store customer contact info
- Associate with configuration

**Task 1.7: Create Merchant Analytics Dashboard** (2 days)
- Route: `/app/builder/analytics`
- Show metrics:
  - Active sessions (last 24 hours)
  - Total configurations (in_progress, completed, abandoned)
  - Lead captures (count by type)
  - Popular products (most viewed)
  - Drop-off points (which step users abandon)
  - Price range analysis (what customers are looking at)
- Filters: Date range, configuration status
- Export to CSV

**Task 1.8: Create Lead Management Interface** (1 day)
- Route: `/app/builder/leads`
- Show captured leads:
  - Customer name, email, phone
  - Lead type (inquiry, hint, share)
  - Configuration details
  - Date captured
  - Follow-up status (new, contacted, closed)
- Mark as contacted/closed
- Add notes
- Export to CSV

**Task 1.9: Abandoned Cart Recovery** (1 day)
- Identify abandoned configurations (no activity for 30 min)
- If customer email captured → send reminder email
- Email template: "You left a beautiful ring behind..."
- Include configuration link
- Track email open/click rates

**Task 1.10: Analytics API Endpoints** (0.5 days)
- `POST /api/builder/analytics/track` - Track event
- `GET /api/builder/analytics/dashboard` - Get dashboard data
- `GET /api/builder/analytics/leads` - Get leads list
- `GET /api/builder/analytics/abandonments` - Get abandoned configs
- Rate limiting: 1000 req/hour per shop

### Analytics Integration Points

**When to Track:**

1. **Page Load:** Track session start
2. **Product Card Click:** Track product view
3. **Detail View Open:** Track detailed view
4. **Filter Change:** Track filter usage
5. **Product Selection:** Track configuration update
6. **Step Navigation:** Track step completion
7. **Inquiry Submit:** Track lead capture
8. **Share/Save:** Track lead capture
9. **Add to Cart:** Track conversion
10. **Page Exit:** Track potential abandonment

**Example Implementation:**

```typescript
// In BuilderProvider.tsx
const trackEvent = (eventType: string, data: any) => {
  fetch('/api/builder/analytics/track', {
    method: 'POST',
    body: JSON.stringify({
      sessionId,
      shop,
      eventType,
      data,
      timestamp: new Date(),
    }),
  });
};

// Usage
const showSettingDetailView = (setting: Setting) => {
  setViewDetailSetting(setting);
  setShowSettingDetail(true);

  // Track product view
  trackEvent('product_view', {
    productType: 'setting',
    productId: setting.id,
    sku: setting.sku,
    price: setting.startingPrice,
  });
};
```

---

## Current State by Route/Page

### 1. `/builder` - Main Ring Builder Route

**File:** `app/routes/builder.tsx`
**Component:** `BuilderApp.tsx`
**Status:** 70% Complete

#### ✅ What's Working
- Public storefront route accessible via `?shop=` parameter
- Iframe embedding support with height auto-resize
- BuilderProvider context wrapping entire app
- Step-based navigation system
- Responsive layout grid (main content + sidebar)
- Conditional rendering based on step and detail view state

#### ⚠️ Partially Working
- Step navigation allows jumping to step 3 without completing customization
- Price summary sidebar shows $0 if no selections made
- Mobile sticky price summary positioning

#### ❌ Missing Features
- No global search bar
- No breadcrumb navigation
- No progress save indicator
- **No analytics tracking integration** ❌ CRITICAL

#### 📋 Detailed Tasks

**Priority: P0 (Critical)**

**Task: Integrate Analytics Tracking** (1 day)
- Add analytics initialization to BuilderApp
- Generate sessionId on mount
- Track session start
- Track session end (on unmount)
- Track step changes
- Pass analytics methods to all child components via context

**Priority: P1 (High)**

**Task: Add Global Search** (1.5 days)
- Subtask 1.1: Create SearchBar component (0.5 days)
  - Input with magnifying glass icon
  - Debounced search (300ms)
  - Dropdown for results
- Subtask 1.2: Implement search logic (0.5 days)
  - Search settings by: name, SKU, style
  - Search diamonds by: SKU, shape, certificate
  - Combine results
- Subtask 1.3: Add navigation on select (0.5 days)
  - Click result → navigate to detail view
  - Track search event in analytics

**Task: Implement Progress Saving** (1 day)
- Subtask 2.1: Auto-save to localStorage (0.5 days)
  - Save every 30 seconds
  - Save on step change
  - Save on selection change
- Subtask 2.2: Resume functionality (0.5 days)
  - Check for saved config on load
  - Show "Resume" banner
  - Load saved state into BuilderProvider
  - Clear on cart checkout

**Task: Add Breadcrumb Navigation** (0.5 days)
- Create Breadcrumb component
- Show: Home > Build Your Ring > [Current Step Name]
- Make clickable to go back
- Update on step change

**Priority: P2 (Medium)**

**Task: Add Error Boundary** (0.5 days)
- Wrap BuilderApp in ErrorBoundary
- Create fallback UI with "Refresh" button
- Log errors to console
- Show user-friendly error messages

---

### 2. Step 1: Settings Selection

**File:** `app/components/builder/steps/SettingSelector.tsx`
**Related Components:** `SettingCard.tsx`, `RingCard.tsx`, `SettingDetailView.tsx`
**Status:** 90% Complete

#### ✅ What's Working
- Ring products grid display with images
- Settings grid display (from API)
- Style filter with visual image selector
- Metal type filter with grid selector
- Price range filter with min/max inputs
- Results count display
- Action bar with "Save Search" and "Reset" buttons
- Detail view navigation on card click
- Empty state with "Clear Filters" button
- Responsive grid layout
- Loading spinner during initial fetch
- Error handling with retry button

#### ⚠️ Partially Working
- "Save Search" button doesn't do anything
- No visual feedback when filters are applied
- No filter count badges
- **No analytics tracking on product views** ❌ CRITICAL

#### ❌ Missing Features
- No wishlist/favorites on cards
- No sort options (price, name)
- No pagination or infinite scroll

#### 📋 Detailed Tasks (Small Chunks)

**File Location:** `app/components/builder/steps/SettingSelector.tsx`

**Priority: P0 (Critical)**

**Task: Add Analytics Tracking to Settings** (0.5 days)
- Track when user views settings list
- Track filter changes (style, metal, price)
- Track product card clicks
- Track detail view opens
- Track "Add Your Diamond" clicks

**Priority: P1 (High)**

**Task: Add Wishlist/Favorites**
- Subtask 3.1: Add heart icon to cards (0.5 days)
  - Position in top-right corner
  - Toggle on click
  - Filled/unfilled states
  - Animation on click
- Subtask 3.2: Implement favorites state (0.5 days)
  - Add to BuilderProvider
  - Store in localStorage
  - Sync across tabs
  - Track favorite event in analytics
- Subtask 3.3: Create FavoritesModal (0.5 days)
  - Show all favorited items
  - Remove button
  - Navigate to detail view

**Task: Implement Sort Options** (0.5 days)
- Add sort dropdown to results bar
- Options: Price Low/High, Name A-Z
- Apply sort to products and settings
- Track sort usage in analytics

**Task: Add Pagination** (0.5 days)
- Add pagination controls at bottom
- Show "Page X of Y"
- Previous/Next buttons
- 12 items per page
- Track page navigation in analytics

**File Location:** `app/components/builder/SettingDetailView.tsx`

**Priority: P0 (Critical)**

**Task: Connect Metal Type Selector** (0.5 days)
- Wire up dropdown to BuilderProvider
- Update selectedMetalType on change
- Recalculate price
- Track selection in analytics

**Task: Connect Side Stone Selector** (0.5 days)
- Wire up dropdown to BuilderProvider
- Update sideStones state
- Recalculate price with side stones
- Track selection in analytics

**Task: Connect Center Stone Size Selector** (0.5 days)
- Wire up dropdown
- Filter compatible diamonds on step 2
- Track selection in analytics

**Task: Connect Ring Size Selector** (0.5 days)
- Wire up dropdown to BuilderProvider
- Update ringSize state
- Make required field
- Track selection in analytics

**Priority: P1 (High)**

**Task: Implement Action Buttons**
- Subtask 4.1: Create InquiryModal component (1 day)
  - Shared modal for all inquiry types
  - Form fields: name, email, phone, message
  - Validation
  - Submit to API
- Subtask 4.2: Wire up "Drop A Hint" (0.25 days)
  - Open InquiryModal with type='hint'
  - Track lead capture in analytics
- Subtask 4.3: Wire up "Request More Info" (0.25 days)
  - Open InquiryModal with type='info'
  - Track lead capture in analytics
- Subtask 4.4: Wire up "Schedule Viewing" (0.25 days)
  - Open InquiryModal with type='viewing'
  - Date/time picker
  - Track lead capture in analytics
- Subtask 4.5: Wire up "Email A Friend" (0.25 days)
  - Open InquiryModal with type='email'
  - Track share event in analytics

**Task: Add Social Share Buttons** (0.5 days)
- Facebook, Twitter, Pinterest buttons
- Copy link button
- Generate shareable URL
- Track share events in analytics

---

### 3. Step 2: Diamond Selection

**File:** `app/components/builder/steps/StoneSelector.tsx`
**Related Components:** `DiamondCard.tsx`, `StoneTable.tsx`, `DiamondDetailView.tsx`
**Status:** 85% Complete

#### ✅ What's Working
- Diamond type tabs (Mined/Lab Grown/Fancy Color) with count badges
- Shape icon selector (10 shapes)
- Quality sliders (Cut, Color, Clarity) with visual ranges
- Carat range filter with min/max
- Price range filter with min/max
- Results control bar with count, per page, search, view toggle
- Grid view for mock diamonds
- Table view for API diamonds (sortable columns)
- Sort by price/carat (asc/desc)
- Loading spinner during fetch
- Empty state with reset button
- Responsive layout
- Detail view navigation on card click
- Mock data integration with 50+ diamonds

#### ⚠️ Partially Working
- "Save Search" button doesn't do anything
- "Compare" count shows 0 (not integrated)
- Search by SKU works but no visual feedback
- **No analytics tracking on diamond views** ❌ CRITICAL

#### ❌ Missing Features
- No "Compare" checkbox on cards (feature built, needs integration)
- No comparison floating button
- No wishlist/favorites on cards
- No filter presets

#### 📋 Detailed Tasks (Small Chunks)

**File Location:** `app/components/builder/steps/StoneSelector.tsx`

**Priority: P0 (Critical - MUST DO THIS WEEK)**

**Task: Integrate Comparison Feature**
- Subtask 5.1: Add comparison state (0.5 days)
  - Add to BuilderProvider:
    - `comparisonList: Stone[]`
    - `addToComparison(stone)`
    - `removeFromComparison(id)`
    - `clearComparison()`
  - Persist in localStorage
  - Track comparison adds in analytics

- Subtask 5.2: Add Compare checkbox to cards (0.5 days)
  - Position in top-right corner
  - Show/hide based on comparison state
  - Disable if limit (4) reached
  - Show toast when limit reached

- Subtask 5.3: Create ComparisonFloatingButton (0.5 days)
  - Fixed bottom-right position
  - Show when 2+ diamonds in comparison
  - Display count
  - Pulse animation on add

- Subtask 5.4: Connect ComparisonModal (0.5 days)
  - Open modal on button click
  - Wire up "Select This Diamond" button
  - Wire up "Remove" button
  - Track comparison view in analytics
  - Track diamond selection from comparison

**Task: Add Analytics Tracking to Diamonds** (0.5 days)
- Track diamond type tab changes
- Track filter changes (shape, cut, color, clarity, carat, price)
- Track product card clicks
- Track detail view opens
- Track comparison adds/removes
- Track "Complete Your Ring" clicks

**Priority: P1 (High)**

**Task: Add Wishlist/Favorites for Diamonds** (1 day)
- Same as settings (reuse components)
- Heart icon on DiamondCard
- Favorites state in BuilderProvider
- Track favorite events in analytics

**Task: Add Filter Presets** (0.5 days)
- Create presets dropdown
- Presets:
  - "Excellent Cut, D-F Color, VVS-VS"
  - "Best Value" (H-I, SI1-SI2)
  - "Triple Excellent"
- Apply preset → update all filters
- Track preset usage in analytics

**Task: Implement SKU Search Enhancements** (0.5 days)
- Add magnifying glass icon
- Show "Searching..." indicator
- Highlight search term
- Show result count
- Track search usage in analytics

**File Location:** `app/components/builder/DiamondDetailView.tsx`

**Priority: P0 (Critical)**

**Task: Implement Action Buttons** (1 day)
- Same as SettingDetailView
- Reuse InquiryModal component
- Track all lead captures in analytics

**Priority: P1 (High)**

**Task: Add Certificate Viewer** (0.5 days)
- "View Certificate" button
- Open modal with certificate
- Track certificate views in analytics

**Task: Add Social Share Buttons** (0.5 days)
- Same as SettingDetailView
- Track share events in analytics

---

### 4. Step 3: Review & Complete

**File:** `app/components/builder/CompleteRingReview.tsx`
**Status:** 70% Complete

#### ✅ What's Working
- Combined setting + diamond display
- Setting image carousel with thumbnails
- Setting details display
- Diamond specifications display
- Setting price display
- Diamond price display
- Total price calculation
- "Add to Cart" button (UI only - NOT FUNCTIONAL)
- Action buttons (UI only)
- Responsive two-column layout
- SKU display for both items

#### ⚠️ Partially Working
- Metal Type, Side Stones, Ring Size show hardcoded values (not from state)
- Action buttons don't open modals
- **"Add to Cart" button doesn't do anything** ❌ CRITICAL BLOCKER
- **No analytics tracking** ❌ CRITICAL

#### ❌ Missing Features
- No "Edit" buttons to go back to steps
- No "Save Configuration" button (lead capture opportunity)
- No "Share" buttons (lead capture opportunity)
- No print/PDF functionality
- No Shopify cart integration

#### 📋 Detailed Tasks (Small Chunks)

**File Location:** `app/components/builder/CompleteRingReview.tsx`

**Priority: P0 (CRITICAL BLOCKERS - IMPLEMENT IMMEDIATELY)**

**Task: Connect State to Display** (0.5 days)
- Replace hardcoded values with BuilderProvider state
- Show validation warnings if missing
- Track review page view in analytics

**Task: Implement "Add to Cart" Functionality**
- Subtask 6.1: Create CartService (0.5 days)
  - File: `app/services/cart.server.ts`
  - Method: `addToShopifyCart(configuration, shop)`
  - Handle Shopify Cart API integration
  - Return cart URL for redirect

- Subtask 6.2: Save configuration before adding to cart (0.5 days)
  - Call `/api/builder/save` endpoint
  - Generate unique configurationId
  - Store all selections in database
  - Track configuration save in analytics

- Subtask 6.3: Create Shopify cart line item (0.5 days)
  - Create line item with properties:
    ```typescript
    {
      variantId: setting.shopifyVariantId,
      quantity: 1,
      properties: [
        { key: 'Configuration ID', value: configurationId },
        { key: 'Setting', value: setting.name },
        { key: 'Setting SKU', value: setting.sku },
        { key: 'Diamond', value: `${stone.carat}ct ${stone.shape}` },
        { key: 'Diamond SKU', value: stone.id },
        { key: 'Certificate', value: stone.certificate },
        { key: 'Metal Type', value: selectedMetalType },
        { key: 'Ring Size', value: ringSize },
        { key: 'Side Stones', value: sideStones?.quality || 'None' },
        { key: 'Total Price', value: totalPrice },
      ]
    }
    ```

- Subtask 6.4: Handle add to cart flow (0.5 days)
  - Show loading spinner on button
  - Disable button during API call
  - On success:
    - Track add_to_cart event in analytics (CONVERSION!)
    - Show success toast
    - Redirect to Shopify cart
  - On error:
    - Track error in analytics
    - Show error message
    - Provide retry button

**Task: Implement Action Button Modals** (0.5 days)
- Wire up "Request More Info" button
- Wire up "Schedule Viewing" button
- Track lead captures in analytics
- These are HIGH-VALUE lead capture opportunities

**Priority: P1 (High - Lead Capture)**

**Task: Add "Edit" Buttons** (0.5 days)
- Add edit button next to Setting section → goToStep(1)
- Add edit button next to Diamond section → goToStep(2)
- Add edit button next to Customization → goToStep(3)
- Track edit clicks in analytics

**Task: Add "Save Configuration" Button**
- Subtask 7.1: Create save functionality (0.5 days)
  - Call `/api/builder/save` endpoint
  - Generate shareToken
  - Track save event in analytics (LEAD CAPTURE)

- Subtask 7.2: Create SavedConfigModal (0.5 days)
  - Show shareable URL with copy button
  - QR code generation
  - Email option (capture email = LEAD!)
  - Social share buttons
  - Track shares in analytics

**Task: Add Share Buttons**
- Subtask 8.1: Create ShareButtonGroup component (0.5 days)
  - Facebook, Twitter, Pinterest buttons
  - Email share button
  - Copy link button

- Subtask 8.2: Implement share functionality (0.5 days)
  - Generate shareable URL with token
  - Track share events in analytics (LEAD CAPTURE)
  - Increment shareCount in database
  - Each share = potential lead

**Task: Add Configuration Summary Card** (0.5 days)
- Display complete configuration details
- Configuration ID
- Date created
- All selections
- Total price
- "Print" and "Email" buttons

**Task: Implement Print/PDF Functionality** (0.5 days)
- "Print Configuration" button
- Create printable HTML template
- Use window.print()
- Track print events in analytics

**Task: Add Email Configuration Option** (0.5 days)
- "Email This Configuration" button
- Modal with email form
- Send via `/api/builder/share`
- Track email sends in analytics (LEAD CAPTURE)

---

### 5. Step 4: Customization (NOT IMPLEMENTED)

**File:** `app/components/builder/steps/Customization.tsx` (EXISTS but minimal)
**Status:** 5% Complete (skeleton only)

#### ❌ Everything is Missing
- Ring size selector
- Metal type selector (if not selected in step 1)
- Side stones configuration
- Engraving options
- Gift message
- Preview panel
- Price updates
- Validation
- Navigation buttons
- **Analytics tracking**

#### 📋 Detailed Tasks (Small Chunks - HIGH PRIORITY)

**File Location:** `app/components/builder/steps/Customization.tsx`

**Priority: P0 (CRITICAL BLOCKER - IMPLEMENT THIS WEEK)**

**This is THE blocker preventing cart integration. Must be implemented first.**

**Task: Ring Size Selector** (0.5 days)
- Subtask 9.1: Use existing RingSizeSelector component
  - Already exists! Just wire it up
  - Dropdown with sizes 3-13 (half sizes)
  - Default from BuilderProvider state
  - On change → call `updateRingSize(size)`
  - Track selection in analytics

- Subtask 9.2: Add "Find My Size" link
  - Opens RingSizeGuide modal (already exists!)
  - Track guide opens in analytics

**Task: Metal Type Selector** (0.5 days)
- Only show if not selected in step 1
- Use existing MetalGridSelector component
- Options: 14K/18K White/Yellow/Rose Gold, Platinum
- Show price difference for each
- On change → call `updateMetalType(type)` and `calculatePrice()`
- Track selection in analytics

**Task: Side Stones Configuration** (0.5 days)
- Check if setting supports side stones
- Show quality selector dropdown:
  - [1] H-I color, SI1-SI2 clarity
  - [2] G-H color, VS2-SI1 clarity
  - [3] F-G color, VS1-VS2 clarity
  - [None] No side stones
- Show price for each option
- On change → call `updateSideStones(config)` and `calculatePrice()`
- Track selection in analytics

**Task: Engraving Options** (0.5 days)
- Checkbox: "Add Engraving"
- Text input (max 25 chars)
- Character counter
- Font selector (Script, Block, Italic)
- Position selector (Inside/Outside band)
- Engraving fee display
- On change → recalculate price
- Track engraving adds in analytics

**Task: Gift Message** (0.5 days)
- Checkbox: "Include Gift Message"
- Textarea (max 250 chars)
- Character counter
- Free feature (no price change)
- Store in configuration metadata
- Track gift message adds in analytics

**Task: Preview Panel** (1 day)
- Subtask 10.1: Create CustomizationPreview component (0.5 days)
  - Fixed right column (desktop)
  - Show setting image
  - Show diamond image overlay
  - Show ring size
  - Show side stones indicator
  - Show engraving preview

- Subtask 10.2: Implement price breakdown (0.5 days)
  - Setting: $X
  - Diamond: $X
  - Side Stones: $X (if any)
  - Engraving: $X (if any)
  - Total: $X (large, bold)
  - Update in real-time

**Task: Validation & Navigation** (0.5 days)
- Validate required fields (ring size, metal type if not set)
- Show inline validation errors
- Disable "Continue" button until valid
- "Back" button → goToStep(2)
- "Continue to Review" button → validate then goToStep(3)
- Track step completion in analytics

**Task: Component Layout** (0.5 days)
- Two-column layout (customization left, preview right)
- Mobile: stacked layout
- Sticky preview panel
- Consistent spacing
- Maroon accent color for buttons

**Task: Add Analytics to Customization Step** (0.5 days)
- Track step 3 entry
- Track all customization changes
- Track validation errors
- Track step completion
- Track abandonment if user leaves

**Testing Checklist:**
- [ ] Ring size saves to state
- [ ] Metal type updates price
- [ ] Side stones update price
- [ ] Engraving fee applies correctly
- [ ] Validation prevents invalid submission
- [ ] Preview updates in real-time
- [ ] Back button works
- [ ] Continue button navigates to review
- [ ] Mobile layout is responsive
- [ ] Analytics events fire correctly

---

### 6. API Routes (Small Tasks)

#### `/api/builder/settings` - Settings API

**File:** `app/routes/api.builder.settings.tsx`
**Status:** 70% Complete

**Missing:** Filtering, pagination, sorting, caching

**Tasks:**
- Task 11.1: Add query param filtering (0.5 days)
- Task 11.2: Add pagination (0.5 days)
- Task 11.3: Add sorting (0.5 days)
- Task 11.4: Implement caching (0.5 days)

#### `/api/builder/stones` - Stones API

**File:** `app/routes/api.builder.stones.tsx`
**Status:** 70% Complete

**Missing:** Full filtering, pagination, caching

**Tasks:**
- Task 12.1: Add full filtering (0.5 days)
- Task 12.2: Add pagination (0.5 days)
- Task 12.3: Implement caching (0.5 days)

#### `/api/builder/cart` - Cart API (CRITICAL)

**File:** `app/routes/api.builder.cart.tsx`
**Status:** 40% Complete

**Missing:** Shopify integration (THE BLOCKER)

**Tasks (Priority P0):**
- Task 13.1: Implement Shopify Cart API integration (1 day)
  - Subtask: Get shop access token
  - Subtask: Create cart line item with properties
  - Subtask: Handle API errors
  - Subtask: Return cart URL

- Task 13.2: Add configuration save before cart (0.5 days)
  - Save full configuration to database
  - Generate configurationId
  - Include in line item properties

- Task 13.3: Track add_to_cart in analytics (0.5 days)
  - This is THE conversion event
  - Track success/failure
  - Track cart value

#### `/api/builder/save` - Save Configuration API

**File:** `app/routes/api.builder.save.tsx`
**Status:** 60% Complete

**Missing:** Email notification, complete response

**Tasks:**
- Task 14.1: Add email notification option (0.5 days)
- Task 14.2: Return full configuration object (0.25 days)
- Task 14.3: Generate QR code URL (0.25 days)

#### `/api/builder/share` - Share Configuration API

**File:** `app/routes/api.builder.share.tsx`
**Status:** 50% Complete

**Missing:** Email sending, share tracking

**Tasks:**
- Task 15.1: Implement email sending (0.5 days)
- Task 15.2: Increment shareCount (0.25 days)
- Task 15.3: Generate Open Graph meta tags (0.25 days)
- Task 15.4: Track share events (0.25 days)

#### `/api/builder/inquiry` - Customer Inquiry API

**File:** `app/routes/api.builder.inquiry.tsx`
**Status:** 50% Complete

**Missing:** Email notifications (LEAD CAPTURE)

**Tasks:**
- Task 16.1: Send email to merchant (0.5 days)
  - Include customer contact info
  - Include configuration details
  - Include inquiry type and message

- Task 16.2: Send confirmation to customer (0.5 days)
  - Thank you email
  - Copy of their inquiry
  - Next steps

- Task 16.3: Generate calendar invite for viewing appointments (0.5 days)
  - iCal format
  - Include configuration link
  - Send to both customer and merchant

#### `/api/builder/analytics/track` - Analytics Tracking (NEW)

**File:** `app/routes/api.builder.analytics.track.tsx`
**Status:** 0% Complete

**Tasks:**
- Task 17.1: Create analytics tracking endpoint (0.5 days)
  - Accept event data
  - Validate session
  - Store in database
  - Rate limiting

- Task 17.2: Implement batch processing (0.5 days)
  - Accept multiple events
  - Process in background
  - Return immediately

#### `/api/builder/analytics/dashboard` - Analytics Dashboard Data (NEW)

**File:** `app/routes/api.builder.analytics.dashboard.tsx`
**Status:** 0% Complete

**Tasks:**
- Task 18.1: Create dashboard data endpoint (1 day)
  - Aggregate analytics data
  - Calculate metrics
  - Return JSON

- Task 18.2: Add date range filtering (0.5 days)
- Task 18.3: Add caching (5 minute TTL) (0.5 days)

---

## Cross-Cutting Features (Small Tasks)

### 1. Search & Discovery

**Priority:** P1
**Effort:** 2-3 days (broken into small tasks)

**Task 19.1: Create Global Search Bar** (0.5 days)
- Add to BuilderApp header
- Search input with icon
- Debounced search (300ms)

**Task 19.2: Implement Search Logic** (0.5 days)
- Search across settings and diamonds
- Search by SKU, name, shape
- Return combined results

**Task 19.3: Add Autocomplete Dropdown** (0.5 days)
- Show suggestions as user types
- Product type badges
- Navigate to detail on click
- Track searches in analytics

**Task 19.4: Implement Recently Viewed** (1 day)
- Track in localStorage
- Show as horizontal scrollable cards
- Limit to 20 items
- Track clicks in analytics

**Task 19.5: Add Recommended Products** (1 day)
- Basic algorithm (compatible shapes, price range)
- Display below main content
- Track clicks in analytics

### 2. Wishlist / Favorites

**Priority:** P1
**Effort:** 1.5 days

**Task 20.1: Add Favorites State** (0.5 days)
- Add to BuilderProvider
- Persist in localStorage
- Track favorite events in analytics

**Task 20.2: Add Heart Icons to Cards** (0.5 days)
- Settings cards
- Diamond cards
- Toggle functionality
- Animation

**Task 20.3: Create Favorites Modal** (0.5 days)
- Show all favorited items
- Remove button
- Navigate to detail
- Track views in analytics

### 3. Save & Share Configurations (LEAD CAPTURE)

**Priority:** P0 (HIGH VALUE FOR LEAD GENERATION)
**Effort:** 2 days

**Task 21.1: Implement Save Configuration** (0.5 days)
- Button on review page
- Call `/api/builder/save`
- Generate shareToken
- Track save event (LEAD!)

**Task 21.2: Create SaveConfigModal** (0.5 days)
- Show shareable URL
- QR code
- Email option (CAPTURE EMAIL = LEAD!)
- Social share buttons

**Task 21.3: Implement Share Functionality** (0.5 days)
- Facebook share
- Twitter share
- Pinterest share
- Copy link
- Track all shares (LEADS!)

**Task 21.4: Load Saved Configuration** (0.5 days)
- Handle ?config=[token] URL param
- Fetch from API
- Load into BuilderProvider
- Track config loads in analytics

### 4. Ring Size Guide

**Priority:** P1
**Effort:** 1 day

**Task 22.1: Enhance RingSizeGuide Modal** (0.5 days)
- Component exists, enhance it
- Add measurement instructions
- Size conversion chart
- Video tutorial embed

**Task 22.2: Create Printable Ring Sizer** (0.5 days)
- PDF template
- Actual-size ring sizer strip
- Download button
- Track downloads in analytics

### 5. SEO & Social Meta Tags (for sharing)

**Priority:** P2
**Effort:** 1 day

**Task 23.1: Add Meta Tags to Routes** (0.5 days)
- title, description, keywords
- Canonical URLs
- Shop name in titles

**Task 23.2: Add Open Graph Tags** (0.5 days)
- For shared configuration page
- Generate OG image
- Product schema JSON-LD

**Task 23.3: Add Twitter Card Tags** (0.5 days)
- summary_large_image format
- Shop handle

### 6. Performance Optimizations

**Priority:** P2
**Effort:** 1.5 days

**Task 24.1: Implement Image Lazy Loading** (0.5 days)
- loading="lazy" on all images
- Blur-up placeholders
- Skeleton loaders

**Task 24.2: Add Code Splitting** (0.5 days)
- React.lazy() for detail views
- Suspense with loading fallback
- Separate bundle for comparison modal

**Task 24.3: Implement Caching Strategy** (0.5 days)
- Cache product images
- Cache API responses (5 min TTL)
- Cache static assets

---

## Sprint Plan with Small Tasks

### Sprint 1: Core Functionality (Week 1)
**Goal:** Unblock the critical user flow + Start analytics

**Day 1: Step 4 Part 1**
- Task 9.1: Ring size selector (0.5d)
- Task 9.2: Metal type selector (0.5d)

**Day 2: Step 4 Part 2**
- Task 10.1: Side stones config (0.5d)
- Task 10.2: Engraving options (0.5d)

**Day 3: Step 4 Part 3**
- Task 10.3: Preview panel (1d)

**Day 4: Step 4 Part 4**
- Task 10.4: Validation & navigation (0.5d)
- Task 10.5: Component layout (0.5d)

**Day 5: Analytics Foundation**
- Task 1.1: Create Analytics Service (1d)

**Deliverable:** Functional customization step + Analytics foundation

---

### Sprint 2: Cart Integration + Analytics (Week 2)
**Goal:** Enable add to cart (THE CRITICAL CONVERSION) + Track everything

**Day 1: Cart Integration Part 1**
- Task 6.1: Create CartService (0.5d)
- Task 6.2: Save configuration before cart (0.5d)

**Day 2: Cart Integration Part 2**
- Task 6.3: Create Shopify cart line item (0.5d)
- Task 6.4: Handle add to cart flow (0.5d)

**Day 3: Analytics Implementation**
- Task 1.2: Session management (0.5d)
- Task 1.3: Product view tracking (0.5d)

**Day 4: More Analytics**
- Task 1.4: Filter tracking (0.5d)
- Task 1.5: Configuration tracking (0.5d)

**Day 5: Lead Capture Tracking**
- Task 1.6: Lead capture tracking (0.5d)
- Task 1.8: Create lead management interface (0.5d)

**Deliverable:** Working "Add to Cart" + Full analytics tracking

---

### Sprint 3: Lead Capture Features (Week 3)
**Goal:** Enable all lead capture mechanisms

**Day 1: Save & Share Part 1**
- Task 21.1: Save configuration (0.5d)
- Task 21.2: SaveConfigModal (0.5d)

**Day 2: Save & Share Part 2**
- Task 21.3: Share functionality (0.5d)
- Task 21.4: Load saved config (0.5d)

**Day 3: Customer Engagement Modals**
- Task 4.1: Create InquiryModal (1d)

**Day 4: Wire Up Inquiry Buttons**
- Task 4.2: Drop A Hint (0.25d)
- Task 4.3: Request More Info (0.25d)
- Task 4.4: Schedule Viewing (0.25d)
- Task 4.5: Email A Friend (0.25d)

**Day 5: Inquiry API**
- Task 16.1: Send email to merchant (0.5d)
- Task 16.2: Send confirmation to customer (0.5d)

**Deliverable:** All lead capture features functional

---

### Sprint 4: Comparison + Discovery (Week 4)
**Goal:** Improve product discovery

**Day 1: Comparison Integration Part 1**
- Task 5.1: Add comparison state (0.5d)
- Task 5.2: Add checkboxes to cards (0.5d)

**Day 2: Comparison Integration Part 2**
- Task 5.3: Create floating button (0.5d)
- Task 5.4: Connect modal (0.5d)

**Day 3: Search & Discovery Part 1**
- Task 19.1: Create search bar (0.5d)
- Task 19.2: Search logic (0.5d)

**Day 4: Search & Discovery Part 2**
- Task 19.3: Autocomplete dropdown (0.5d)
- Task 19.4: Recently viewed (0.5d)

**Day 5: Analytics Dashboard**
- Task 1.7: Create merchant dashboard (1d)

**Deliverable:** Comparison + Search + Merchant dashboard

---

### Sprint 5: Polish & Launch Prep (Week 5)
**Goal:** Final touches and testing

**Day 1: Wishlist Feature**
- Task 20.1: Favorites state (0.5d)
- Task 20.2: Heart icons (0.5d)

**Day 2: Additional Features**
- Task 22.1: Ring size guide enhancement (0.5d)
- Task 23.1-23.3: SEO & meta tags (0.5d)

**Day 3: Performance Optimization**
- Task 24.1: Image lazy loading (0.5d)
- Task 24.2: Code splitting (0.5d)

**Day 4: Testing & Bug Fixes**
- Full regression testing
- Fix critical bugs
- Mobile testing

**Day 5: Final Testing & Deployment**
- Cross-browser testing
- Performance testing
- Deploy to production

**Deliverable:** Production-ready app

---

## Features Removed from Scope

These features were in the original analysis but removed to focus on core functionality and lead generation:

### Removed (Not Essential for MVP)

1. **Tutorial/Help System** ❌
   - Reason: Users understand step-based flow
   - Can add later if users struggle

2. **Session Timeout Handling** ❌
   - Reason: Auto-save handles this
   - Not critical for MVP

3. **Virtual Try-On** ❌
   - Reason: Too complex, requires camera/AR
   - Low ROI for development time

4. **Financing Calculator** ❌
   - Reason: Merchant can add financing at checkout
   - Not core to ring builder

5. **Price History Chart** ❌
   - Reason: Diamonds don't fluctuate much
   - Low value feature

6. **360° Product View** ❌
   - Reason: Requires specialized photography
   - Most merchants don't have this

7. **Virtual Ring Sizer** ❌
   - Reason: Too complex (camera, ML)
   - Printable sizer is sufficient

8. **Warranty/Insurance Information** ❌
   - Reason: Merchant can add to product description
   - Not core to builder

9. **Shipping Estimates** ❌
   - Reason: Shopify handles this at checkout
   - Don't need to duplicate

10. **Trade-In Program** ❌
    - Reason: Not applicable to all merchants
    - Can be custom feature later

### Kept (Essential for MVP)

✅ Step 4 (Customization) - CRITICAL BLOCKER
✅ Shopify Cart Integration - CRITICAL
✅ Analytics & Lead Tracking - CRITICAL for merchants
✅ Save & Share - Lead capture
✅ Comparison - Already built
✅ Customer Engagement Modals - Lead capture
✅ Wishlist/Favorites - User engagement
✅ Search & Discovery - UX improvement
✅ Ring Size Guide - Reduces support questions
✅ SEO & Meta Tags - For sharing
✅ Performance Optimization - User experience

---

## Summary & Immediate Next Steps

### This Week (MUST DO)

1. **Implement Step 4 (Customization)** - 3 days
   - Ring size, metal type, side stones, engraving, gift message
   - Preview panel with real-time price updates
   - Validation and navigation
   - **BLOCKER for cart integration**

2. **Analytics Foundation** - 1 day
   - Create Analytics Service
   - Session management
   - Start tracking basic events
   - **CRITICAL for lead generation**

3. **Testing** - 1 day
   - Test full flow end-to-end
   - Fix navigation issues
   - Fix price calculation bugs

### Next Week

4. **Cart Integration** - 2 days
   - Shopify API integration
   - Save configuration
   - Add to cart with properties
   - **CRITICAL for revenue**

5. **Complete Analytics** - 2 days
   - Track all events
   - Lead capture tracking
   - Merchant dashboard
   - **CRITICAL for merchants**

6. **Testing** - 1 day

### Week 3+

7. **Lead Capture Features** - 3 days (Save, Share, Inquiries)
8. **Comparison Integration** - 2 days
9. **Search & Discovery** - 2 days
10. **Polish & Testing** - 3 days

### Timeline

**MVP Ready:** 3-4 weeks
**Fully Polished:** 5 weeks
**Launch Date:** 5-6 weeks from now

### Success Metrics

**Conversion:**
- Add to cart rate
- Configuration completion rate
- Time to complete

**Lead Generation (MOST IMPORTANT):**
- Inquiry submissions
- Save/share events
- Abandoned configurations with contact info
- Email captures

**Engagement:**
- Feature usage (comparison, favorites)
- Product views
- Filter usage

---

**Document Version:** 2.0 (Revised for Shopify App focus)
**Last Updated:** October 22, 2025
**Next Review:** After Sprint 1 completion
