# Phase 2.0 Manual Testing Guide

**Version:** 1.0  
**Date:** October 14, 2025  
**Phase:** 2.0 - Metafields Architecture & GemFind Feature Parity  
**Prerequisites:** App installed, products added, migrations run

---

## 🎯 TESTING OVERVIEW

This guide covers manual testing for all Phase 2.0 features. Follow each section sequentially for complete validation.

**Total Testing Time:** ~2-3 hours  
**Required Setup:** Development environment OR staging deployment

---

## 📋 PRE-TESTING CHECKLIST

### Environment Setup

- [ ] App is running (`npm run dev` OR deployed to staging)
- [ ] Database migrations applied (`npx prisma migrate status`)
- [ ] At least 5 settings added via admin UI
- [ ] At least 20 stones added via admin UI (mix of diamond types)
- [ ] Shop parameter available for testing

### Test Data Requirements

**Minimum Products:**

- 5 settings (various styles: Solitaire, Halo, Vintage, etc.)
- 10 mined diamonds
- 5 lab grown diamonds
- 5 fancy color diamonds
- Mix of shapes (Round, Princess, Oval, etc.)
- Mix of carats (0.5 - 3.0 ct)

---

## 1️⃣ ADMIN: PRODUCT MANAGEMENT UI

### Test 1.1: Product Dashboard

**URL:** `/app/builder/products`

| Step | Action                           | Expected Result                               | Pass/Fail |
| ---- | -------------------------------- | --------------------------------------------- | --------- |
| 1    | Navigate to admin products page  | Dashboard loads with product list             | [ ]       |
| 2    | Check status indicators          | See ✓ (Active), ⚠ (Incomplete), ○ (Unmarked) | [ ]       |
| 3    | Verify product cards show        | Images 150x150px, title, SKU, status          | [ ]       |
| 4    | Check "Sync from Shopify" button | Button visible in header                      | [ ]       |
| 5    | Expand "Advanced Tools"          | CSV import visible inside section             | [ ]       |

### Test 1.2: Add Diamond Modal

**Action:** Click "Add as Diamond" on unmarked product

| Step | Action                          | Expected Result                        | Pass/Fail |
| ---- | ------------------------------- | -------------------------------------- | --------- |
| 1    | Click "Add as Diamond" button   | Modal opens with form                  | [ ]       |
| 2    | Verify product preview          | Shows image, title, price from Shopify | [ ]       |
| 3    | Check shape selector            | 10 icon buttons displayed              | [ ]       |
| 4    | Select shape (e.g., Round)      | Icon highlights with border            | [ ]       |
| 5    | Enter carat weight (e.g., 1.50) | Number input accepts decimals          | [ ]       |
| 6    | Select diamond type (Mined)     | Radio button selects                   | [ ]       |
| 7    | Select Cut, Color, Clarity      | Dropdowns work correctly               | [ ]       |
| 8    | Enter certificate info          | GIA, certificate number, URL accepted  | [ ]       |
| 9    | Click "Save Diamond Specs"      | Success message appears                | [ ]       |
| 10   | Verify product status changes   | Shows ✓ Active with diamond specs      | [ ]       |

**Test Validation:**

- [ ] Try saving without required fields → Shows validation errors
- [ ] Enter invalid carat (e.g., "abc") → Shows error
- [ ] Verify data saved to database (Prisma Studio)
- [ ] Verify metafields written to Shopify

### Test 1.3: Add Setting Modal

**Action:** Click "Add as Setting" on unmarked product

| Step | Action                        | Expected Result                   | Pass/Fail |
| ---- | ----------------------------- | --------------------------------- | --------- |
| 1    | Click "Add as Setting" button | Modal opens with form             | [ ]       |
| 2    | Select style from dropdown    | Solitaire, Halo, etc. available   | [ ]       |
| 3    | Select compatible shapes      | Multiple checkboxes with icons    | [ ]       |
| 4    | Check metal pricing table     | 7 rows (14K, 18K, Platinum)       | [ ]       |
| 5    | Enter prices for all metals   | Number inputs accept values       | [ ]       |
| 6    | Select setting height         | Low/Medium/High dropdown          | [ ]       |
| 7    | Click "Save Setting Specs"    | Success message appears           | [ ]       |
| 8    | Verify product status changes | Shows ✓ Active with setting specs | [ ]       |

**Test Validation:**

- [ ] Try saving without metal prices → Shows validation errors
- [ ] Try saving without compatible shapes → Shows error
- [ ] Verify data saved to database
- [ ] Verify metafields written to Shopify

### Test 1.4: Edit Existing Product

| Step | Action                               | Expected Result                | Pass/Fail |
| ---- | ------------------------------------ | ------------------------------ | --------- |
| 1    | Click "Edit Specs" on active product | Modal opens with existing data | [ ]       |
| 2    | Verify all fields pre-filled         | Shows saved values             | [ ]       |
| 3    | Modify a field (e.g., change carat)  | Input updates                  | [ ]       |
| 4    | Save changes                         | Success message appears        | [ ]       |
| 5    | Verify updated data                  | Product shows new values       | [ ]       |

---

## 2️⃣ CUSTOMER: VISUAL ENHANCEMENTS

### Test 2.1: Diamond Type Tabs

**URL:** `/builder?shop=your-store.myshopify.com` → Step 2 (Stones)

| Step | Action                              | Expected Result                           | Pass/Fail |
| ---- | ----------------------------------- | ----------------------------------------- | --------- |
| 1    | Navigate to Stone Selector (Step 2) | See 3 tabs: Mined, Lab Grown, Fancy Color | [ ]       |
| 2    | Check tab badges                    | Each shows count (e.g., "Mined (10)")     | [ ]       |
| 3    | Verify "Mined" is default active    | Tab highlighted in burgundy #6D2932       | [ ]       |
| 4    | Click "Lab Grown" tab               | Tab activates, stone list filters         | [ ]       |
| 5    | Verify only lab grown stones show   | All visible stones have "Lab Grown" type  | [ ]       |
| 6    | Click "Fancy Color" tab             | Tab activates, shows fancy color diamonds | [ ]       |
| 7    | Click back to "Mined" tab           | Shows mined diamonds again                | [ ]       |

### Test 2.2: Icon-Based Filters

| Step | Action                | Expected Result                             | Pass/Fail |
| ---- | --------------------- | ------------------------------------------- | --------- |
| 1    | Check shape filters   | See 10 icon buttons (Round, Princess, etc.) | [ ]       |
| 2    | Click a shape icon    | Icon highlights with border + background    | [ ]       |
| 3    | Click multiple shapes | Multiple selections work (multi-select)     | [ ]       |
| 4    | Verify stones filter  | Only selected shapes shown                  | [ ]       |
| 5    | Unselect all shapes   | All stones shown again                      | [ ]       |

### Test 2.3: Grid View

| Step | Action                      | Expected Result                              | Pass/Fail |
| ---- | --------------------------- | -------------------------------------------- | --------- |
| 1    | Click Grid View toggle      | Stones display in grid cards                 | [ ]       |
| 2    | Check grid columns          | Desktop: 3-4 cols, Mobile: 1-2 cols          | [ ]       |
| 3    | Verify card info            | Image, shape, carat, 4Cs, price, certificate | [ ]       |
| 4    | Check comparison checkbox   | Checkbox visible on each card                | [ ]       |
| 5    | Click "View Details" button | Opens detail page (see Test 2.5)             | [ ]       |
| 6    | Toggle back to List View    | Table view displays                          | [ ]       |

### Test 2.4: Records Per Page

| Step | Action                 | Expected Result                    | Pass/Fail |
| ---- | ---------------------- | ---------------------------------- | --------- |
| 1    | Check records selector | Dropdown shows 12, 20, 50, 100     | [ ]       |
| 2    | Default is 20          | Shows 20 results per page          | [ ]       |
| 3    | Change to 50           | Shows 50 results per page          | [ ]       |
| 4    | Refresh page           | Preference persists (localStorage) | [ ]       |

### Test 2.5: SKU Search

| Step | Action                            | Expected Result                  | Pass/Fail |
| ---- | --------------------------------- | -------------------------------- | --------- |
| 1    | Type stock number in search field | Field accepts input              | [ ]       |
| 2    | Type 2+ characters                | Auto-search triggers after 300ms | [ ]       |
| 3    | Enter exact SKU and press Enter   | Shows matching stone(s)          | [ ]       |
| 4    | Type non-existent SKU             | Shows "No results" message       | [ ]       |
| 5    | Click clear button (X)            | Clears search, shows all stones  | [ ]       |

---

## 3️⃣ CUSTOMER: COMPARISON TOOL

### Test 3.1: Diamond Comparison

**URL:** `/builder?shop=your-store.myshopify.com` → Step 2 (Stones)

| Step | Action                         | Expected Result                                    | Pass/Fail |
| ---- | ------------------------------ | -------------------------------------------------- | --------- |
| 1    | Check comparison checkboxes    | Visible on each stone (grid/table)                 | [ ]       |
| 2    | Select 1 diamond checkbox      | Checkbox checked                                   | [ ]       |
| 3    | Verify no compare button yet   | Button hidden (need 2+)                            | [ ]       |
| 4    | Select 2nd diamond             | Floating "Compare Items (2)" button appears        | [ ]       |
| 5    | Select 3rd and 4th diamonds    | Count updates to (3), then (4)                     | [ ]       |
| 6    | Try selecting 5th diamond      | Disabled (max 4)                                   | [ ]       |
| 7    | Click "Compare Items" button   | Modal opens with comparison table                  | [ ]       |
| 8    | Check comparison table         | Side-by-side columns for all selected              | [ ]       |
| 9    | Verify differences highlighted | Yellow background on differing specs               | [ ]       |
| 10   | Check "Best Value" indicator   | Shows on lowest price/carat diamond                | [ ]       |
| 11   | Click "Select This Diamond"    | Modal closes, diamond selected, proceeds to Step 3 | [ ]       |
| 12   | Check localStorage persistence | Refresh page, selections still present             | [ ]       |

---

## 4️⃣ CUSTOMER: SAVE & SHARE

### Test 4.1: Save Configuration

**URL:** Complete full builder flow (Steps 1-4)

| Step | Action                        | Expected Result                         | Pass/Fail |
| ---- | ----------------------------- | --------------------------------------- | --------- |
| 1    | Complete all 4 steps          | Reach Review step                       | [ ]       |
| 2    | Look for "Save" button        | Visible on review page                  | [ ]       |
| 3    | Click "Save" button           | Success modal appears                   | [ ]       |
| 4    | Check shareable URL displayed | Format: `/builder/saved/XXXXXXXX`       | [ ]       |
| 5    | Click "Copy to Clipboard"     | URL copied (test paste)                 | [ ]       |
| 6    | Copy URL and open in new tab  | Configuration loads with all selections | [ ]       |
| 7    | Verify prices recalculated    | Current prices shown (not old)          | [ ]       |

### Test 4.2: Share Configuration

| Step | Action                         | Expected Result                             | Pass/Fail |
| ---- | ------------------------------ | ------------------------------------------- | --------- |
| 1    | Click "Share" button on review | Share modal opens                           | [ ]       |
| 2    | Check share options            | Email, Copy Link, Facebook, Twitter visible | [ ]       |
| 3    | Test "Copy Link" button        | URL copied successfully                     | [ ]       |
| 4    | Click Facebook button          | Opens Facebook Share Dialog                 | [ ]       |
| 5    | Click Twitter button           | Opens Twitter compose window                | [ ]       |
| 6    | Fill email share form          | Name, recipient email, message fields       | [ ]       |
| 7    | Submit email share             | Success message appears                     | [ ]       |
| 8    | Check recipient's inbox        | Email received with ring details            | [ ]       |

**Email Validation:**

- [ ] Email contains configuration image
- [ ] Email contains price breakdown
- [ ] Email contains shareable link
- [ ] Email is mobile-friendly
- [ ] Merchant logo/branding present

---

## 5️⃣ CUSTOMER: ENGAGEMENT FEATURES

### Test 5.1: Drop A Hint

| Step | Action                     | Expected Result                                   | Pass/Fail |
| ---- | -------------------------- | ------------------------------------------------- | --------- |
| 1    | Click "Drop A Hint" button | Inquiry modal opens                               | [ ]       |
| 2    | Check form fields          | Recipient email, your name, special date, message | [ ]       |
| 3    | Fill all fields            | Inputs accept data                                | [ ]       |
| 4    | Submit form                | Success message appears                           | [ ]       |
| 5    | Check recipient's email    | Hint email received                               | [ ]       |
| 6    | Verify NO pricing in email | Only shows ring image and hint message            | [ ]       |

### Test 5.2: Request More Info

| Step | Action                           | Expected Result                          | Pass/Fail |
| ---- | -------------------------------- | ---------------------------------------- | --------- |
| 1    | Click "Request More Info" button | Inquiry modal opens                      | [ ]       |
| 2    | Check form fields                | Name, email, phone, question             | [ ]       |
| 3    | Fill and submit                  | Success message appears                  | [ ]       |
| 4    | Check merchant's email           | Info request received                    | [ ]       |
| 5    | Verify email contains            | Customer contact + configuration details | [ ]       |

### Test 5.3: Email A Friend

| Step | Action                         | Expected Result                                 | Pass/Fail |
| ---- | ------------------------------ | ----------------------------------------------- | --------- |
| 1    | Click "E-Mail A Friend" button | Inquiry modal opens                             | [ ]       |
| 2    | Fill friend's email + message  | Form accepts input                              | [ ]       |
| 3    | Submit                         | Success message appears                         | [ ]       |
| 4    | Check friend's email           | Email received with full ring details + pricing | [ ]       |

### Test 5.4: Schedule Viewing

| Step | Action                          | Expected Result                         | Pass/Fail |
| ---- | ------------------------------- | --------------------------------------- | --------- |
| 1    | Click "Schedule Viewing" button | Inquiry modal opens                     | [ ]       |
| 2    | Fill form                       | Name, email, phone, date, time, message | [ ]       |
| 3    | Select future date/time         | Date picker works                       | [ ]       |
| 4    | Submit                          | Success message appears                 | [ ]       |
| 5    | Check merchant's email          | Viewing request received                | [ ]       |
| 6    | Verify iCal attachment          | .ics file attached to email             | [ ]       |
| 7    | Open iCal file                  | Calendar event with details             | [ ]       |

### Test 5.5: Inquiry Dashboard (Admin)

**URL:** `/app/builder/inquiries`

| Step | Action                     | Expected Result                        | Pass/Fail |
| ---- | -------------------------- | -------------------------------------- | --------- |
| 1    | Navigate to inquiries page | List of all inquiries                  | [ ]       |
| 2    | Check inquiry cards        | Type icon, customer info, ring details | [ ]       |
| 3    | Filter by type             | Dropdown filters correctly             | [ ]       |
| 4    | Filter by status           | New/Contacted/Closed filters work      | [ ]       |
| 5    | Click "Mark as Contacted"  | Status updates                         | [ ]       |
| 6    | Click "Reply to Customer"  | Opens email client                     | [ ]       |

---

## 6️⃣ CUSTOMER: DETAIL PAGES

### Test 6.1: Setting Detail Page

**URL:** `/builder/setting/:id?shop=your-store.myshopify.com`

| Step | Action                          | Expected Result                             | Pass/Fail |
| ---- | ------------------------------- | ------------------------------------------- | --------- |
| 1    | Navigate to setting detail page | Page loads with full details                | [ ]       |
| 2    | Check main image                | Large image displays                        | [ ]       |
| 3    | Check thumbnail strip           | 4-6 thumbnails visible (if multiple images) | [ ]       |
| 4    | Click thumbnail                 | Main image changes                          | [ ]       |
| 5    | Check metal selector            | 7 metal options displayed                   | [ ]       |
| 6    | Click different metal           | Price updates dynamically                   | [ ]       |
| 7    | Check specifications panel      | All specs displayed                         | [ ]       |
| 8    | Check compatible shapes         | Badge list shows all shapes                 | [ ]       |
| 9    | Click "Add Your Diamond"        | Navigates to builder with setting selected  | [ ]       |
| 10   | Click breadcrumb "Back"         | Returns to builder                          | [ ]       |

**SEO Validation:**

- [ ] View page source → Check `<meta property="og:title">` exists
- [ ] View page source → Check `<meta property="og:image">` exists
- [ ] Share on Facebook → Preview shows correct image/title
- [ ] Share on Twitter → Preview shows correct card

### Test 6.2: Diamond Detail Page

**URL:** `/builder/diamond/:id?shop=your-store.myshopify.com`

| Step | Action                           | Expected Result                                      | Pass/Fail |
| ---- | -------------------------------- | ---------------------------------------------------- | --------- |
| 1    | Navigate to diamond detail page  | Page loads with full details                         | [ ]       |
| 2    | Check main image                 | Large diamond image displays                         | [ ]       |
| 3    | Check availability badge         | Shows "Available" or "Not Available"                 | [ ]       |
| 4    | Check diamond type badge         | Shows "Natural Mined", "Lab Grown", or "Fancy Color" | [ ]       |
| 5    | Check The 4Cs section            | Carat, Cut, Color, Clarity displayed                 | [ ]       |
| 6    | Check Additional Details         | Measurements, table %, depth %, etc.                 | [ ]       |
| 7    | Check price per carat            | Calculated correctly                                 | [ ]       |
| 8    | If has certificate, check button | "View Certificate" button visible                    | [ ]       |
| 9    | Click "View Certificate"         | Modal opens with PDF iframe                          | [ ]       |
| 10   | Close certificate modal          | Modal closes                                         | [ ]       |
| 11   | Click "Complete Your Ring"       | Navigates to builder with diamond selected           | [ ]       |

**SEO Validation:**

- [ ] View page source → Check all OG tags
- [ ] Share on social media → Preview correct

---

## 7️⃣ METAFIELDS INTEGRATION

### Test 7.1: Metafield Setup

**URL:** `/app/builder/products` (or trigger manually)

| Step | Action                                      | Expected Result                                       | Pass/Fail |
| ---- | ------------------------------------------- | ----------------------------------------------------- | --------- |
| 1    | Open Shopify Admin → Settings → Custom Data | Metafields section loads                              | [ ]       |
| 2    | Navigate to Products                        | See "ringbuilder" namespace                           | [ ]       |
| 3    | Check metafield definitions                 | 21 definitions created                                | [ ]       |
| 4    | Verify diamond metafields                   | shape, carat, cut, color, clarity, diamond_type, etc. | [ ]       |
| 5    | Verify setting metafields                   | style, compatible_shapes, metal_prices, etc.          | [ ]       |

### Test 7.2: Metafield Sync (Write)

| Step | Action                         | Expected Result                      | Pass/Fail |
| ---- | ------------------------------ | ------------------------------------ | --------- |
| 1    | Add diamond specs via admin UI | Form saves successfully              | [ ]       |
| 2    | Open Shopify Admin → Products  | Navigate to that product             | [ ]       |
| 3    | Scroll to Metafields section   | See "ringbuilder" metafields         | [ ]       |
| 4    | Verify all specs written       | shape, carat, cut, color, etc. match | [ ]       |
| 5    | Edit specs in admin UI         | Update carat weight                  | [ ]       |
| 6    | Check Shopify metafields again | Updated value reflected              | [ ]       |

### Test 7.3: Metafield Sync (Read via Webhook)

| Step | Action                             | Expected Result            | Pass/Fail |
| ---- | ---------------------------------- | -------------------------- | --------- |
| 1    | Open Shopify Admin → Products      | Find a builder product     | [ ]       |
| 2    | Edit product price                 | Change first variant price | [ ]       |
| 3    | Save product                       | Webhook triggers           | [ ]       |
| 4    | Check app database (Prisma Studio) | Stone price updated        | [ ]       |
| 5    | Check app builder                  | New price visible          | [ ]       |

**Manual Webhook Test:**

```bash
npm run dev
# In another terminal:
shopify webhook trigger --topic products/update
```

- [ ] Webhook received (check console logs)
- [ ] Database updated (if builder product)
- [ ] Returns 200 OK

---

## 8️⃣ PERFORMANCE TESTING

### Test 8.1: Build Performance

```bash
npm run build
```

| Metric               | Target   | Actual   | Pass/Fail |
| -------------------- | -------- | -------- | --------- |
| Build time           | < 3s     | 1.67s    | [ ] ✅    |
| Client bundle (gzip) | < 200 KB | 46.67 KB | [ ] ✅    |
| TypeScript errors    | 0        | 0        | [ ] ✅    |

### Test 8.2: Runtime Performance

| Test             | Action           | Target  | Pass/Fail |
| ---------------- | ---------------- | ------- | --------- |
| Page load time   | Open `/builder`  | < 3s    | [ ]       |
| API response     | Fetch stones     | < 500ms | [ ]       |
| Grid view render | Switch to grid   | < 1s    | [ ]       |
| Comparison modal | Open comparison  | < 500ms | [ ]       |
| Detail page load | Open detail page | < 2s    | [ ]       |

### Test 8.3: Large Catalog Performance

**Setup:** Add 100+ stones via CSV import

| Test                       | Expected Result           | Pass/Fail |
| -------------------------- | ------------------------- | --------- |
| Stone selector loads       | No lag or freezing        | [ ]       |
| Filtering works smoothly   | Results update < 1s       | [ ]       |
| Grid view scrolls smoothly | No jank                   | [ ]       |
| Comparison works           | Handles 4 diamonds easily | [ ]       |

---

## 9️⃣ MOBILE TESTING

### Test 9.1: Mobile Responsive Design

**Devices to Test:**

- iPhone (Safari)
- Android (Chrome)
- Tablet (iPad)

| Feature          | Test                         | Pass/Fail |
| ---------------- | ---------------------------- | --------- |
| Diamond tabs     | Tabs fit on screen, tappable | [ ]       |
| Icon filters     | 2-3 columns on mobile        | [ ]       |
| Grid view        | 1-2 columns on mobile        | [ ]       |
| Detail pages     | Single column layout         | [ ]       |
| Metal selector   | Full-width buttons           | [ ]       |
| Comparison modal | Horizontal scroll works      | [ ]       |
| Modals (all)     | Fit on screen, closeable     | [ ]       |
| Touch targets    | Min 44x44px                  | [ ]       |

### Test 9.2: Mobile Gestures

| Gesture | Feature          | Expected Result             | Pass/Fail |
| ------- | ---------------- | --------------------------- | --------- |
| Swipe   | Image gallery    | Swipe between images        | [ ]       |
| Pinch   | Product image    | Zoom works (if implemented) | [ ]       |
| Tap     | Buttons/links    | All tappable                | [ ]       |
| Scroll  | Comparison table | Horizontal scroll smooth    | [ ]       |

---

## 🔟 ACCESSIBILITY TESTING

### Test 10.1: Keyboard Navigation

| Test            | Action                           | Expected Result       | Pass/Fail |
| --------------- | -------------------------------- | --------------------- | --------- |
| Tab navigation  | Press Tab key                    | Focus moves logically | [ ]       |
| Icon selection  | Tab to icon, press Space/Enter   | Selects icon          | [ ]       |
| Modal close     | Tab to close button, press Enter | Closes modal          | [ ]       |
| Form fields     | Tab through all inputs           | All focusable         | [ ]       |
| Skip to content | Tab from start                   | Can bypass navigation | [ ]       |

### Test 10.2: Screen Reader

**Tool:** VoiceOver (Mac) or NVDA (Windows)

| Test           | Expected Result             | Pass/Fail |
| -------------- | --------------------------- | --------- |
| Product images | Alt text announced          | [ ]       |
| Icon filters   | aria-label announced        | [ ]       |
| Buttons        | Button labels clear         | [ ]       |
| Form fields    | Labels associated correctly | [ ]       |
| Error messages | Errors announced            | [ ]       |

### Test 10.3: Color Contrast

**Tool:** Browser DevTools → Accessibility Panel

| Element           | Ratio  | Target  | Pass/Fail |
| ----------------- | ------ | ------- | --------- |
| Body text         | 4.5:1+ | WCAG AA | [ ]       |
| Button text       | 4.5:1+ | WCAG AA | [ ]       |
| Links             | 4.5:1+ | WCAG AA | [ ]       |
| Icons with labels | 3:1+   | WCAG AA | [ ]       |

---

## 1️⃣1️⃣ END-TO-END TESTING

### E2E Test 1: Complete Builder Flow (Happy Path)

| Step | Action                             | Expected Result                   | Pass/Fail |
| ---- | ---------------------------------- | --------------------------------- | --------- |
| 1    | Open `/builder?shop=...`           | Step 1 loads (Select Setting)     | [ ]       |
| 2    | Filter by style (Solitaire)        | Settings filter                   | [ ]       |
| 3    | Select a setting                   | Step 2 loads (Select Diamond)     | [ ]       |
| 4    | Click "Mined" tab                  | Mined diamonds shown              | [ ]       |
| 5    | Filter by shape (Round)            | Filters apply                     | [ ]       |
| 6    | Toggle to Grid View                | Grid displays                     | [ ]       |
| 7    | Click 2 comparison checkboxes      | Compare button appears            | [ ]       |
| 8    | Open comparison modal              | Modal shows diamonds              | [ ]       |
| 9    | Select a diamond                   | Modal closes, diamond selected    | [ ]       |
| 10   | Proceed to Step 3                  | Customization page loads          | [ ]       |
| 11   | Select ring size                   | Size selected                     | [ ]       |
| 12   | Configure side stones (if enabled) | Options set                       | [ ]       |
| 13   | Proceed to Step 4                  | Review page loads                 | [ ]       |
| 14   | Verify all selections shown        | Setting, stone, metal, size, etc. | [ ]       |
| 15   | Check price breakdown              | All itemized correctly            | [ ]       |
| 16   | Click "Save" button                | Shareable URL generated           | [ ]       |
| 17   | Click "Share" button               | Share modal opens                 | [ ]       |
| 18   | Click "Drop A Hint"                | Hint modal opens                  | [ ]       |
| 19   | Click "Add to Cart"                | Success, redirects to cart        | [ ]       |
| 20   | Check Shopify cart                 | Line item with all properties     | [ ]       |

### E2E Test 2: Admin Product Setup Flow

| Step | Action                    | Expected Result                      | Pass/Fail |
| ---- | ------------------------- | ------------------------------------ | --------- |
| 1    | Login to admin            | `/app` loads                         | [ ]       |
| 2    | Navigate to Products      | Product dashboard loads              | [ ]       |
| 3    | Click "Sync from Shopify" | Products refresh                     | [ ]       |
| 4    | Find unmarked product     | Shows ○ Regular Product              | [ ]       |
| 5    | Click "Add as Diamond"    | Modal opens                          | [ ]       |
| 6    | Fill all required fields  | Form accepts data                    | [ ]       |
| 7    | Save                      | Success message, status changes to ✓ | [ ]       |
| 8    | Verify in Shopify Admin   | Metafields written                   | [ ]       |
| 9    | Edit specs in app admin   | Modal pre-filled                     | [ ]       |
| 10   | Update a field            | Save successful                      | [ ]       |
| 11   | Verify update in Shopify  | Metafield updated                    | [ ]       |

### E2E Test 3: Saved Configuration Loading

| Step | Action                           | Expected Result             | Pass/Fail |
| ---- | -------------------------------- | --------------------------- | --------- |
| 1    | Complete builder, save config    | Get shareable URL           | [ ]       |
| 2    | Copy URL                         | URL copied                  | [ ]       |
| 3    | Open in incognito/private window | Loads without login         | [ ]       |
| 4    | Verify all selections pre-filled | Setting, stone, metal, size | [ ]       |
| 5    | Verify prices current            | Not old cached prices       | [ ]       |
| 6    | Can modify and checkout          | Full builder functionality  | [ ]       |

---

## 1️⃣2️⃣ BROWSER COMPATIBILITY

### Desktop Browsers

| Browser | Version | Load | Features | Styling | Pass/Fail |
| ------- | ------- | ---- | -------- | ------- | --------- |
| Chrome  | Latest  | [ ]  | [ ]      | [ ]     | [ ]       |
| Firefox | Latest  | [ ]  | [ ]      | [ ]     | [ ]       |
| Safari  | Latest  | [ ]  | [ ]      | [ ]     | [ ]       |
| Edge    | Latest  | [ ]  | [ ]      | [ ]     | [ ]       |

### Mobile Browsers

| Platform | Browser | Version | Pass/Fail |
| -------- | ------- | ------- | --------- |
| iOS      | Safari  | Latest  | [ ]       |
| iOS      | Chrome  | Latest  | [ ]       |
| Android  | Chrome  | Latest  | [ ]       |
| Android  | Firefox | Latest  | [ ]       |

---

## 1️⃣3️⃣ SECURITY TESTING

### Test 13.1: Authentication

| Test                      | Expected Result       | Pass/Fail |
| ------------------------- | --------------------- | --------- |
| Admin routes without auth | Redirect to login     | [ ]       |
| Public routes (builder)   | Load without auth     | [ ]       |
| API routes (admin)        | Require valid session | [ ]       |
| API routes (builder)      | No auth required      | [ ]       |

### Test 13.2: Input Validation

| Input           | Test                  | Expected Result        | Pass/Fail |
| --------------- | --------------------- | ---------------------- | --------- |
| Email fields    | Enter invalid email   | Shows validation error | [ ]       |
| Carat weight    | Enter negative number | Prevents input         | [ ]       |
| Carat weight    | Enter "abc"           | Shows error            | [ ]       |
| Phone number    | Enter letters         | Validation error       | [ ]       |
| Required fields | Submit empty form     | Shows all errors       | [ ]       |

### Test 13.3: SQL Injection Prevention

| Test        | Input                 | Expected Result                | Pass/Fail |
| ----------- | --------------------- | ------------------------------ | --------- |
| SKU search  | `' OR '1'='1`         | No SQL error, treats as string | [ ]       |
| Share token | `../../../etc/passwd` | 404, no path traversal         | [ ]       |

### Test 13.4: Rate Limiting

| Test               | Action                  | Expected Result      | Pass/Fail |
| ------------------ | ----------------------- | -------------------- | --------- |
| Inquiry submission | Submit 10 times quickly | Rate limit after 5?  | [ ]       |
| Email sending      | Send 20 emails          | Rate limit triggers? | [ ]       |

---

## 1️⃣4️⃣ ERROR HANDLING

### Test 14.1: Network Errors

| Scenario    | Action                           | Expected Result                           | Pass/Fail |
| ----------- | -------------------------------- | ----------------------------------------- | --------- |
| Offline     | Disconnect internet, submit form | Shows "Network error" message             | [ ]       |
| API timeout | Slow connection                  | Shows loading state, then timeout message | [ ]       |
| 500 error   | Trigger server error             | Shows user-friendly error                 | [ ]       |

### Test 14.2: Missing Data

| Scenario                | Expected Result            | Pass/Fail |
| ----------------------- | -------------------------- | --------- |
| Product not found (404) | Shows "Not found" message  | [ ]       |
| Invalid share token     | 404 page or redirect       | [ ]       |
| Missing image           | Shows placeholder          | [ ]       |
| Missing certificate     | Certificate section hidden | [ ]       |

---

## 1️⃣5️⃣ BACKWARD COMPATIBILITY

### Test 15.1: Phase 1.0 Features Still Work

| Feature                 | Test                          | Expected Result               | Pass/Fail |
| ----------------------- | ----------------------------- | ----------------------------- | --------- |
| CSV Import              | Upload CSV                    | Still works in Advanced Tools | [ ]       |
| Existing configurations | Load old config               | Displays correctly            | [ ]       |
| Cart functionality      | Add to cart (Phase 1 product) | Works normally                | [ ]       |
| Settings management     | Admin settings page           | No regression                 | [ ]       |

---

## 1️⃣6️⃣ MIGRATION TESTING

### Test 16.1: Validation Script

```bash
npx ts-node prisma/scripts/migrate-to-phase-2.ts
```

| Step                       | Expected Result                 | Pass/Fail |
| -------------------------- | ------------------------------- | --------- |
| Script runs without errors | Exits with code 0               | [ ]       |
| Shows database stats       | Total stones, settings, configs | [ ]       |
| Validates diamondType      | All stones have default value   | [ ]       |
| Shows Phase 2 features     | Saved configs, inquiries counts | [ ]       |
| Prints summary             | No errors reported              | [ ]       |

### Test 16.2: Shop-Specific Validation

```bash
npx ts-node prisma/scripts/migrate-to-phase-2.ts --shop=store.myshopify.com
```

| Step                   | Expected Result              | Pass/Fail |
| ---------------------- | ---------------------------- | --------- |
| Script filters by shop | Only shows that shop's data  | [ ]       |
| Statistics accurate    | Matches Prisma Studio counts | [ ]       |

---

## ✅ TESTING SIGN-OFF

### Critical Tests (Must Pass)

- [ ] All admin forms save correctly
- [ ] All customer features functional
- [ ] Detail pages load and are shareable
- [ ] Performance meets targets (< 3s page load, < 500ms API)
- [ ] Mobile responsive on all features
- [ ] TypeScript: 0 errors
- [ ] Build: Success
- [ ] No console errors

### Quality Tests (Should Pass)

- [ ] SEO meta tags complete
- [ ] Accessibility (keyboard nav, screen reader)
- [ ] Browser compatibility (Chrome, Firefox, Safari)
- [ ] Error handling comprehensive
- [ ] Security validation (auth, input sanitization)

### Optional Tests (Nice to Have)

- [ ] Lighthouse audit (90+ score)
- [ ] Performance with 1000+ products
- [ ] Load testing (concurrent users)

---

## 📊 TEST RESULTS SUMMARY

**Date Tested:** **\*\***\_\_\_\_**\*\***  
**Tested By:** **\*\***\_\_\_\_**\*\***  
**Environment:** **\*\***\_\_\_\_**\*\***

**Results:**

- Total Tests: **\_** / **\_**
- Passed: **\_**
- Failed: **\_**
- Skipped: **\_**

**Critical Issues Found:**

1. ***
2. ***

**Minor Issues:**

1. ***
2. ***

**Overall Status:** [ ] PASS [ ] FAIL [ ] NEEDS WORK

---

## 🚀 PRODUCTION GO/NO-GO

### Criteria for Production Deployment

- [ ] All critical tests passed
- [ ] No blocker issues found
- [ ] Performance targets met
- [ ] Security audit completed
- [ ] Documentation complete
- [ ] Migration script tested
- [ ] Backward compatibility verified

**Decision:** [ ] ✅ GO [ ] ❌ NO-GO [ ] ⏳ NEEDS MORE WORK

**Sign-off:** **\*\***\_\_\_\_**\*\*** Date: **\*\***\_\_\_\_**\*\***

---

**End of Manual Testing Guide**

For automated testing setup, see: `docs/API_TESTING.md`  
For quick testing checklist, see: `docs/QUICK_TEST_GUIDE.md`
