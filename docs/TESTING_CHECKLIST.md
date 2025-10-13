# Feature Testing Checklist - Ring Builder MVP

**Purpose**: Comprehensive manual testing checklist for all features  
**Last Updated**: October 12, 2025  
**Use**: Check off items as you test each feature

---

## Pre-Testing Setup

- [ ] App installed on development Shopify store
- [ ] At least 10 products created in Shopify
- [ ] At least 3 products marked as Settings with metadata
- [ ] At least 10 products marked as Stones with metadata
- [ ] AppSettings configured with markup and side stones
- [ ] Test accounts created (merchant and customer)
- [ ] Browser DevTools open for debugging

---

## Admin Interface Testing

### Login & Navigation

- [ ] **Login to Admin**
  - Navigate to app in Shopify admin
  - App loads without errors
  - Polaris components render correctly
  - No console errors

- [ ] **Navigation Menu**
  - Click "Products" - navigates to products page
  - Click "Settings" - navigates to settings page
  - Click "Dashboard" - navigates to dashboard (if exists)
  - Navigation highlights active page

---

### Product Management (Task 2.0)

- [ ] **View Products List**
  - Products display in grid layout
  - Product images load correctly
  - Product title, price, SKU visible
  - Badges show "Setting" or "Stone" if marked
  - Search input filters by title
  - Pagination works (if > 50 products)

- [ ] **Mark Product as Setting**
  - Click "Mark as Setting" button
  - Success message appears
  - Badge updates to show "Setting"
  - Page refreshes to show metadata form

- [ ] **Mark Product as Stone**
  - Click "Mark as Stone" button
  - Success message appears
  - Badge updates to show "Stone"
  - Page refreshes to show metadata form

- [ ] **Edit Setting Metadata**
  - Navigate to product marked as Setting
  - Metadata form displays
  - Fill Style: Select "Solitaire"
  - Fill Setting Height: Select "Medium"
  - Select Compatible Shapes: Check "Round", "Cushion", "Oval"
  - Fill Base Prices: Enter 1200, 1250, 1400, 1800
  - Toggle Featured: ON
  - Click Save
  - Success message appears
  - Data persists on page reload

- [ ] **Edit Stone Metadata**
  - Navigate to product marked as Stone
  - Metadata form displays
  - Fill all required fields:
    - Stone Type: Diamond
    - Shape: Round
    - Carat: 1.5
    - Cut: Excellent
    - Color: G
    - Clarity: VS1
    - Certificate: GIA
    - Certificate Number: 2141234567
    - Price: 8999
  - Fill optional fields (Table %, Depth %, etc.)
  - Click Save
  - Success message appears
  - Data persists on page reload

- [ ] **Form Validation**
  - Try to save setting without required fields → Error shown
  - Try to save stone with negative carat → Error shown
  - Try to save with invalid data → Specific error messages
  - Fix errors → Save succeeds

- [ ] **CSV Import**
  - Click "Import CSV" button
  - Modal opens with upload interface
  - Click "Download Template" → CSV template downloads
  - Upload valid CSV file (10 stones)
  - Import processes successfully
  - Summary shows: "10 stones imported, 0 errors"
  - Check database: 10 new StoneMetadata records exist

- [ ] **CSV Import Error Handling**
  - Upload CSV with missing required fields
  - Summary shows errors: "5 stones imported, 5 errors"
  - Error details list specific issues per row
  - Can download error report

- [ ] **CSV Export**
  - Click "Export CSV" button
  - CSV file downloads
  - Open file: All metadata fields included
  - Verify data matches database

- [ ] **Unmark Product**
  - Navigate to marked product
  - Click "Unmark" or "Remove from Builder"
  - Metadata deleted
  - Product no longer shows badge
  - Product no longer appears in builder

---

### Settings Configuration (Task 3.0)

- [ ] **General Settings Tab**
  - Navigate to Settings page
  - General Settings tab is active by default
  - Enable/Disable Builder toggle works
  - Toggle OFF → Success message
  - Verify builder hidden on storefront (if applicable)
  - Toggle ON → Builder visible again

- [ ] **Pricing Rules Tab**
  - Click "Pricing Rules" tab
  - Content switches to pricing form
  - Markup Percentage field visible
  - Enter 10 → Save → Success
  - Reload page → 10% displayed
  - Enter -5 → Validation error shown
  - Enter 150 → Validation error (max 100)

- [ ] **Side Stones Configuration Tab**
  - Click "Side Stones Configuration" tab
  - Enable Side Stones toggle OFF by default
  - Toggle ON → Additional fields appear
  - Enter qualities: "Good, Better, Best"
  - Enter prices: 50, 75, 100
  - Enter min quantity: 6
  - Enter max quantity: 24
  - Save → Success message
  - Reload → All values persist

- [ ] **Settings Validation**
  - Try min > max for side stones → Error
  - Try negative prices → Error
  - Try empty required fields → Error
  - Fix all errors → Save succeeds

- [ ] **Save Button Behavior**
  - No changes made → Save button disabled
  - Make changes → Save button enabled
  - Click Save → Loading spinner appears
  - Success → Toast notification shows
  - Error → Error banner shows with details

---

## Storefront Builder Testing

### Access Builder

- [ ] **Load Builder on Storefront**
  - Navigate to page with builder app block
  - Builder loads without errors
  - Step 1 (Choose Setting) displays by default
  - StepNavigation shows 4 steps
  - PriceSummary shows $0 or "Starting at..."
  - No console errors

---

### Step 1: Choose Setting (Task 4.0)

- [ ] **Display Settings**
  - Settings grid displays
  - All marked settings appear
  - Each card shows: image, title, starting price
  - Images load correctly (lazy loading)
  - At least 3 settings visible

- [ ] **Filter by Style**
  - FilterSidebar visible on left (desktop)
  - Click "Solitaire" checkbox
  - Settings update to show only solitaire
  - Count updates (e.g., "12 settings found")
  - Clear filter → All settings return

- [ ] **Filter by Metal Type**
  - Select "14K White Gold"
  - Settings with this metal show
  - Prices update to white gold price

- [ ] **Filter by Price Range**
  - Drag price range slider
  - Settings update in real-time (debounced)
  - Min/max values display correctly
  - Only settings in range show

- [ ] **Multiple Filters**
  - Select Style: Halo
  - Select Metal: Platinum
  - Set Price: $2000-$5000
  - Only settings matching all filters show
  - Clear All → All filters reset

- [ ] **Setting Card Actions**
  - Click "View Details" on a setting
  - Modal opens with large images
  - Description, SKU visible
  - Metal type options with prices shown
  - Compatible shapes listed
  - Close modal → Returns to grid

- [ ] **Select Setting**
  - Open setting modal
  - Select metal type: 14K White Gold
  - Click "Select" button
  - Modal closes
  - Setting is selected (visual confirmation)
  - Price updates in PriceSummary
  - Automatically advances to Step 2

- [ ] **Empty State**
  - Apply filters with no matches
  - "No settings found" message displays
  - "Clear filters" button available

- [ ] **Mobile - Step 1**
  - Resize to mobile (< 768px)
  - FilterSidebar becomes drawer/modal
  - "Filters" button visible in header
  - Click Filters → Drawer slides in
  - Select filters → Drawer closes on apply
  - Settings display in 1-2 column grid

---

### Step 2: Choose Stone (Task 4.0)

- [ ] **Display Stones**
  - After selecting setting in Step 1
  - Step 2 loads automatically
  - StoneTable displays (desktop) or StoneCardList (mobile)
  - Only stones with compatible shapes show
  - At least 5 stones visible
  - Pagination shows if > 50 stones

- [ ] **Filter by Shape**
  - Shape filter shows only compatible shapes
  - Select "Round"
  - Only round stones display
  - Clear filter → All compatible shapes return

- [ ] **Filter by Carat Range**
  - Drag carat slider: 1.0 - 2.0
  - Only stones in range display
  - Values update in real-time (debounced)

- [ ] **Filter by 4 Cs**
  - Cut: Select "Excellent", "Very Good"
  - Color: Select "F", "G", "H"
  - Clarity: Select "VS1", "VS2"
  - Only matching stones display
  - Count updates correctly

- [ ] **Filter by Price Range**
  - Set price range: $5000 - $15000
  - Only stones in range show
  - Combines with other filters correctly

- [ ] **Filter by Certification**
  - Select "GIA"
  - Only GIA certified stones show
  - Select "GIA" and "AGS"
  - Stones with either certification show

- [ ] **Sort Table**
  - Click "Price" column header → Sorts ascending
  - Click again → Sorts descending
  - Sort indicator (↑ ↓) shows
  - Click "Carat" → Sorts by carat
  - Click "Cut" → Sorts by cut grade
  - Sorting persists with filters

- [ ] **Stone Table Display (Desktop)**
  - All columns visible: Image, Shape, Carat, Cut, Color, Clarity, Price, Certificate, Actions
  - Images load correctly
  - Certificate number clickable (opens in new tab)
  - "Details" and "Select" buttons visible
  - Row highlights on hover

- [ ] **Stone Details Modal**
  - Click "Details" on any stone
  - Modal opens with high-res image
  - All specs displayed:
    - Shape, Carat, Cut, Color, Clarity
    - Certificate type and number (link)
    - Measurements
    - Table %, Depth % (if available)
    - Polish, Symmetry, Fluorescence
    - Price
  - "Select" button in modal
  - Close modal → Returns to table

- [ ] **Select Stone**
  - Click "Select" button on a stone
  - Stone is selected (visual confirmation)
  - Price updates in PriceSummary (adds stone price)
  - Automatically advances to Step 3

- [ ] **Pagination**
  - Page 1 shows first 50 stones
  - Click "Next" → Page 2 loads
  - Click "Previous" → Returns to Page 1
  - Page numbers display
  - Jump to specific page works

- [ ] **Mobile - Step 2**
  - Resize to mobile
  - Table becomes card list (1 column)
  - Filters in drawer
  - Cards show: image, carat, shape, price, 4Cs
  - "Details" and "Select" buttons work
  - "Load More" or infinite scroll works

---

### Step 3: Customize (Task 5.0)

- [ ] **Ring Size Selection**
  - After selecting stone in Step 2
  - Step 3 loads automatically
  - Ring size buttons display (3, 3.5, 4, ..., 12)
  - Click size "7" → Highlights
  - "Ring Size Guide" link visible

- [ ] **Ring Size Guide**
  - Click "Ring Size Guide"
  - Modal opens with sizing chart
  - Instructions visible
  - Close modal → Returns to customization

- [ ] **Side Stones (If Enabled)**
  - Side stone selector appears (if enabled in settings)
  - Quality dropdown shows merchant-defined options
  - Select "Premium"
  - Quantity input shows min/max from settings
  - Enter quantity: 12
  - Price per stone displays
  - Total side stones price displays
  - Updates PriceSummary in real-time

- [ ] **Side Stones (If Disabled)**
  - If side stones disabled in settings
  - Side stone selector not visible
  - Only ring size shown
  - Works correctly without side stones

- [ ] **Validation**
  - Try to continue without ring size → Error shown
  - "Continue to Review" button disabled
  - Select ring size → Button enabled
  - If side stones: try invalid quantity → Error shown

- [ ] **Navigation**
  - Click "Back" → Returns to Step 2 (state preserved)
  - Click "Continue to Review" → Advances to Step 4

---

### Step 4: Review & Cart (Task 5.0 & 6.0)

- [ ] **Configuration Summary Display**
  - All sections visible:
    - Setting details (name, SKU, metal, style, price)
    - Stone details (carat, shape, 4Cs, certificate, price)
    - Side stones details (if applicable)
    - Ring size
  - All data matches selections
  - Prices match PriceSummary

- [ ] **Visual Preview**
  - Setting image displays
  - Stone image displays
  - Images side-by-side with labels
  - Clear identification of each component
  - Images high quality

- [ ] **Price Breakdown**
  - Expandable section (collapsed by default)
  - Click to expand → Shows itemized costs:
    - Setting: $1,200
    - Stone: $8,999
    - Side Stones: $900 (if applicable)
    - Subtotal: $11,099
    - Markup (10%): $1,110
    - **Total: $12,209**
  - All calculations correct
  - Currency formatted properly

- [ ] **Edit Buttons**
  - Click "Edit Setting" → Navigates to Step 1, preserves state
  - Change setting → Return to review → New setting shows
  - Click "Edit Stone" → Navigates to Step 2, preserves state
  - Click "Edit Customization" → Navigates to Step 3, preserves state

- [ ] **Add to Cart Button**
  - Click "Add to Cart"
  - Button shows loading spinner
  - Success message appears: "Ring added to cart!"
  - Redirects to /cart after 2 seconds

- [ ] **Verify in Shopify Cart**
  - Navigate to /cart
  - Configured ring appears in cart
  - Line item properties visible:
    - Setting: Classic Solitaire - 14K White Gold
    - Setting SKU: SET-001
    - Center Stone: 1.50ct Round G VS1
    - Stone SKU: DIA-456
    - Stone Certificate: GIA 2141234567
    - Side Stones: 12 stones, Premium quality (if applicable)
    - Ring Size: 7
    - Configuration ID: CONFIG-20251012-ABC123
  - Price matches configuration total
  - Can proceed to checkout

- [ ] **Add to Cart Error Handling**
  - Disconnect internet
  - Try to add to cart
  - Error message: "Unable to add to cart. Please check your connection."
  - "Retry" button appears
  - Reconnect → Click retry → Succeeds

- [ ] **Out of Stock Handling**
  - Mark stone as out of stock in Shopify
  - Try to add to cart
  - Error: "Sorry, this item is no longer available"
  - Cannot proceed

---

## Price Calculation Testing

- [ ] **Setting Price Updates**
  - Select setting with metal "14K White Gold" ($1,200)
  - PriceSummary shows $1,200
  - Change to "Platinum" ($1,800)
  - PriceSummary updates to $1,800
  - Calculation instant (< 100ms)

- [ ] **Stone Price Addition**
  - Select stone ($8,999)
  - PriceSummary adds stone price
  - Total = Setting + Stone
  - Breakdown shows both line items

- [ ] **Side Stones Price Calculation**
  - Enable side stones
  - Select quality "Premium" ($75 per stone)
  - Enter quantity 12
  - Price = 12 × $75 = $900
  - Total updates correctly

- [ ] **Markup Application**
  - Set markup to 10% in settings
  - Configure ring: Setting $1,200 + Stone $8,999 = $10,199
  - Markup: $10,199 × 10% = $1,020
  - **Total: $11,219**
  - Verify calculation matches

- [ ] **Backend Price Validation**
  - Open browser DevTools → Network tab
  - Add to cart
  - Check request payload (client price)
  - Check response (server price)
  - Verify server recalculated
  - If mismatch: Server price used

---

## Filtering & Search Testing

### Settings Filters

- [ ] **Style Filter**
  - No filter: All settings show
  - Filter "Solitaire": Only solitaire settings
  - Filter "Halo": Only halo settings
  - Clear: All settings return

- [ ] **Metal Type Filter**
  - Filter "14K White Gold": Settings with this option show
  - Filter "Platinum": Settings with platinum show
  - Multiple metals: Settings with any selected metal show

- [ ] **Price Range Filter**
  - Set min $1000, max $3000
  - Only settings with prices in range show
  - Drag to $2000 - $5000
  - Results update in real-time

### Stone Filters

- [ ] **Shape Filter**
  - Shows only compatible shapes from selected setting
  - Select "Round": Only round stones
  - Select multiple shapes: Stones with any selected shape
  - Clear: All compatible shapes

- [ ] **Carat Range**
  - Set 1.0 - 2.0 ct
  - Only stones in range show
  - Move slider: Updates in real-time
  - Shows current values

- [ ] **Cut Filter**
  - Select "Excellent": Only excellent cut
  - Select "Excellent" + "Very Good": Stones with either
  - Clear: All cuts return

- [ ] **Color Filter**
  - Select "F", "G", "H"
  - Only stones with these colors show
  - Results update correctly

- [ ] **Clarity Filter**
  - Select "VS1", "VS2"
  - Only stones with these clarities show

- [ ] **Multiple Filters Combined**
  - Shape: Round
  - Carat: 1.2 - 1.8
  - Cut: Excellent
  - Color: F, G
  - Clarity: VS1, VS2
  - Price: $8000 - $12000
  - Only stones matching ALL filters show
  - Count is accurate

- [ ] **Clear All Filters**
  - Apply multiple filters
  - Click "Clear All"
  - All filters reset
  - All stones return

---

## Mobile Responsiveness Testing

### Desktop (> 768px)

- [ ] **Layout**
  - Sidebar filters visible and fixed
  - Content area uses remaining space
  - Table layout for stones
  - All columns visible

### Tablet (768px)

- [ ] **Layout Adaptation**
  - Filters may become togglable
  - Content adjusts width
  - Touch targets adequate

### Mobile (< 768px)

- [ ] **Navigation**
  - StepNavigation displays vertically or compactly
  - Step labels may abbreviate
  - Touch targets ≥ 44px

- [ ] **Filters (Step 1)**
  - Filters hidden by default
  - "Filters" button in header
  - Click → Drawer slides in from left or bottom
  - Select filters → Click "Apply"
  - Drawer closes → Settings update

- [ ] **Settings Grid**
  - 1-2 columns on mobile
  - Cards stack vertically
  - Images responsive
  - Touch-friendly buttons

- [ ] **Filters (Step 2)**
  - Same drawer behavior
  - All filters accessible
  - Can scroll within drawer

- [ ] **Stone Display**
  - Table becomes card list
  - 1 column of cards
  - Key info visible: image, carat, price, 4Cs
  - "Details" and "Select" buttons work
  - Cards are touch-friendly

- [ ] **Price Summary**
  - Sticky at bottom on mobile
  - Collapsible to save space
  - Total always visible
  - Expand to see breakdown

- [ ] **Touch Interactions**
  - All buttons tappable (44px min)
  - No accidental double-taps
  - Smooth scrolling
  - Modals slide in smoothly
  - No horizontal scroll (except intended)

---

## State Persistence Testing

- [ ] **LocalStorage Persistence**
  - Select setting in Step 1
  - Refresh page (F5)
  - Builder restores to Step 1 with selection preserved
  - Select stone in Step 2
  - Refresh page
  - Both setting and stone preserved
  - Complete configuration
  - Close browser tab
  - Reopen → Configuration still there (if not added to cart)

- [ ] **Navigation Persistence**
  - Select setting → Go to Step 2
  - Click "Back" → Returns to Step 1
  - Previously selected setting still selected
  - Click "Next" → Returns to Step 2
  - Previously selected stone (if any) still selected

---

## Error Handling Testing

- [ ] **Network Errors**
  - Disconnect internet
  - Try to load settings
  - Error message: "Unable to load settings. Please check your connection."
  - "Retry" button appears
  - Reconnect → Click Retry → Loads successfully

- [ ] **API Errors**
  - Simulate 500 error from API
  - Error message: "Something went wrong. Please try again."
  - Doesn't crash app
  - User can retry or go back

- [ ] **Empty Results**
  - Apply filters with no matches
  - "No results found" message
  - Suggestion to "clear filters" or "try different filters"
  - No crashes

- [ ] **Invalid Data**
  - Corrupt localStorage data
  - App handles gracefully (clears invalid data)
  - Doesn't crash
  - Starts fresh

---

## Webhook Testing

- [ ] **Product Update Webhook**
  - Mark product as Stone in app
  - Update product price in Shopify admin: $8,999 → $9,500
  - Wait 5 seconds
  - Check app database (Prisma Studio)
  - StoneMetadata price updated to $9,500
  - Check webhook logs: Webhook received and processed

- [ ] **Product Delete Webhook**
  - Mark product as Setting in app
  - Delete product in Shopify admin
  - Wait 5 seconds
  - Check app database
  - SettingMetadata removed or marked deleted
  - Setting no longer appears in builder

- [ ] **HMAC Verification**
  - Send webhook with invalid HMAC (use curl)
  - Should return 401 Unauthorized
  - Webhook not processed
  - Check logs: HMAC verification failed

- [ ] **Webhook Idempotency**
  - Trigger same webhook twice
  - Both return 200 OK
  - Database only updated once
  - No duplicate processing

---

## Performance Testing

- [ ] **Page Load Time**
  - Clear cache
  - Load builder
  - Measure time to interactive (DevTools Performance tab)
  - Should be < 3 seconds

- [ ] **Filter Response Time**
  - Apply filter
  - Measure time to see results
  - Should be < 500ms (including debounce)

- [ ] **Stone Query with 1000 Stones**
  - Import 1000 stones
  - Apply complex filter
  - Response should be < 500ms
  - Pagination should work smoothly

- [ ] **Add to Cart Time**
  - Click "Add to Cart"
  - Measure time to redirect
  - Should be < 1 second (excluding network)

- [ ] **Lighthouse Audit**
  - Run Lighthouse on builder page
  - Performance score > 80
  - Accessibility score > 90
  - Best Practices score > 90
  - SEO score > 80

---

## Security Testing

- [ ] **Multi-Tenant Isolation**
  - Install app on 2 different stores (Shop A, Shop B)
  - Create configuration in Shop A
  - Log in to Shop B admin
  - Try to access Shop A's configuration via API
  - Should return 404 or empty (not Shop A's data)

- [ ] **Input Validation**
  - Try to submit negative prices → Rejected
  - Try to submit invalid ring size → Rejected
  - Try to submit SQL injection in text fields → Escaped
  - Try to submit XSS script tags → Escaped

- [ ] **Authentication**
  - Try to access admin API without token → 401
  - Try to access admin with expired token → 401
  - Try to access admin with wrong shop token → 403

---

## Edge Cases Testing

- [ ] **No Settings Marked**
  - Fresh install, no products marked
  - Builder loads
  - Shows "No settings available" message
  - Suggests contacting merchant

- [ ] **No Stones Marked**
  - Settings exist, no stones
  - Step 1 works
  - Step 2 shows "No stones available"

- [ ] **Product Deleted Mid-Configuration**
  - Select setting and stone
  - Delete stone product in Shopify
  - Try to add to cart
  - Error: "Product no longer available"

- [ ] **Price Change Mid-Configuration**
  - Select setting ($1,200)
  - Merchant updates price to $1,500 in admin
  - Complete configuration
  - Backend uses latest price ($1,500)
  - User sees updated price in cart

- [ ] **Variant Not Found**
  - Setting product missing variant for selected metal
  - Try to add to cart
  - Error: "This metal type is unavailable"

- [ ] **Very Long Product Names**
  - Product with 200+ character name
  - Displays correctly (truncated if needed)
  - Doesn't break layout

- [ ] **Missing Images**
  - Product with no images
  - Placeholder image shows
  - Doesn't crash

- [ ] **Decimal Ring Sizes**
  - Select half size (e.g., 7.5)
  - Works correctly
  - Saved and displayed properly

---

## Regression Testing (After Bug Fixes)

After fixing bugs, re-test:

- [ ] Complete admin workflow (mark, metadata, settings)
- [ ] Complete builder workflow (all 4 steps)
- [ ] Add to cart and checkout
- [ ] Webhooks still working
- [ ] No new bugs introduced
- [ ] All acceptance criteria still met

---

## Final Pre-Launch Checklist

- [ ] All FR-1 through FR-12 implemented
- [ ] All tests above passed
- [ ] No critical bugs (P0/P1)
- [ ] High-priority bugs fixed or documented
- [ ] TypeScript has no errors (`npm run typecheck`)
- [ ] Build succeeds (`npm run build`)
- [ ] Linter passes (`npm run lint`)
- [ ] 3+ beta merchants tested
- [ ] 50+ configurations created
- [ ] Merchant setup guide complete
- [ ] API documentation complete
- [ ] All scope creep features (NG-1 to NG-13) excluded
- [ ] Ready for production deployment

---

**Testing Status**:

- [ ] All Admin tests passed
- [ ] All Storefront tests passed
- [ ] All API tests passed (curl)
- [ ] All Mobile tests passed
- [ ] All Performance tests passed
- [ ] All Security tests passed
- [ ] All Edge cases handled
- [ ] Regression tests passed
- [ ] Final checklist complete

**Sign-off**: **\*\***\_\_\_**\*\*** Date: **\*\***\_\_\_**\*\***

---

**End of Testing Checklist**
