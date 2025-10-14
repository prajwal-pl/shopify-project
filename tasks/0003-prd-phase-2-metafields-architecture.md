# Product Requirements Document (PRD)

# Ring Builder Phase 2.0 - Metafields Architecture & GemFind Feature Parity

**Document Version:** 1.0  
**Date:** October 13, 2025  
**Status:** Ready for Development  
**Product Owner:** Gold Jewelers Team  
**Target Completion:** 8 weeks from start date  
**Previous Phase:** Phase 1.0 MVP (100% Complete)

---

## 1. Introduction/Overview

### Current State

Phase 1.0 MVP is complete with CSV-based product management. While functional, it has key limitations:

- CSV import is confusing for merchants
- No visual admin interface for product setup
- Missing GemFind's advanced UX features
- Data not stored in Shopify metafields (portability issue)

### Problem Statement

1. **Merchant Pain Points:**
   - CSV import is technical and error-prone
   - No visual way to manage products
   - Unclear what data is needed
   - Risk of data loss if app uninstalled

2. **Customer Experience Gaps:**
   - Basic text filters vs GemFind's icon-based interface
   - No diamond categorization (Mined/Lab Grown/Fancy)
   - Missing engagement features (save, share, compare)
   - No virtual try-on capability

3. **Technical Limitations:**
   - Product data only in app database
   - Not leveraging Shopify metafields
   - No automatic sync with product updates

### Solution

Implement a **metafields-first architecture** with:

- Beautiful admin UI for product management
- Shopify metafields as source of truth
- App database as performance cache
- GemFind feature parity for customers

### Goal

Create a **best-in-class** ring builder that:

- Takes 30 seconds per product to set up
- Rivals GemFind's customer experience
- Uses Shopify-native architecture
- Is maintainable and scalable

---

## 2. Goals

### Primary Goals

1. **Merchant Experience:** Transform product setup from CSV confusion to visual, guided experience
2. **Data Architecture:** Migrate to Shopify metafields as permanent data store
3. **Customer UX:** Match or exceed GemFind's visual and engagement features
4. **Scalability:** Build foundation for 10,000+ product catalogs

### Secondary Goals

1. Maintain Phase 1.0 functionality (backward compatible)
2. Improve performance (faster filtering and search)
3. Mobile-first design continues
4. Prepare for Phase 3.0 advanced features

### Success Metrics

**Merchant Metrics:**

- Product setup time: < 30 seconds per item (vs 2+ minutes with CSV)
- Setup error rate: < 5% (vs 30%+ with CSV)
- Merchant satisfaction: 4.5+ stars

**Customer Metrics:**

- Configuration completion rate: 40%+ (from 30%)
- Time to decision: < 8.5 minutes (from 10 min)
- Feature engagement: 20%+ use new features

**Technical Metrics:**

- API response time: < 500ms
- Page load time: < 3s
- Data sync accuracy: 99.9%+

---

## 3. User Stories

### Merchant Stories

**US-M1:** As a merchant, I want to select existing Shopify products and add ring builder specs via a visual form, so I don't have to deal with CSV files.

**US-M2:** As a merchant, I want my product data stored in Shopify metafields, so it's safe even if I uninstall the app.

**US-M3:** As a merchant, I want to see all my products in one dashboard with clear status indicators, so I know which products are ready for the ring builder.

**US-M4:** As a merchant, I want icon-based selectors for shapes and styles, so setup is faster and error-free.

**US-M5:** As a merchant, I want the app to automatically sync when I update product prices in Shopify, so everything stays accurate.

**US-M6:** As a merchant, I want to bulk import via CSV as an advanced option, so I can handle large inventories when needed.

### Customer Stories

**US-C1:** As a customer, I want to see visual icons for ring styles and diamond shapes, so I can quickly find what I like.

**US-C2:** As a customer, I want to filter diamonds by type (Mined/Lab Grown/Fancy Color), so I can match my values and budget.

**US-C3:** As a customer, I want to compare 2-4 diamonds side-by-side, so I can make an informed decision.

**US-C4:** As a customer, I want to save my configuration and share it with friends/family, so I can get their opinion.

**US-C5:** As a customer, I want to drop a hint to someone about a ring I love, so they know what to get me.

**US-C6:** As a customer, I want to virtually try on a ring, so I can see how it looks before buying.

**US-C7:** As a customer, I want to toggle between grid and list views, so I can browse in my preferred way.

---

## 4. Functional Requirements

### FR-1: Shopify Metafields Integration

**FR-1.1:** The system MUST define metafield definitions for all ring builder data:

```
Diamond/Stone Metafields (namespace: "ringbuilder"):
├─ type: "diamond" | "setting"
├─ shape: "round" | "princess" | "oval" | ...
├─ carat: number (decimal)
├─ cut: "excellent" | "very_good" | "good" | ...
├─ color: "d" | "e" | "f" | "g" | ...
├─ clarity: "fl" | "if" | "vvs1" | ...
├─ diamond_type: "mined" | "lab_grown" | "fancy_color"
├─ certificate: "gia" | "ags" | "igi"
├─ certificate_number: string
└─ certificate_url: string (URL)

Setting Metafields (namespace: "ringbuilder"):
├─ type: "setting"
├─ style: "solitaire" | "halo" | "vintage" | ...
├─ compatible_shapes: array of strings
├─ metal_prices: JSON object
└─ setting_height: "low" | "medium" | "high"
```

**FR-1.2:** The system MUST create metafield definitions on app installation via GraphQL API.

**FR-1.3:** All product data MUST be written to Shopify metafields (source of truth).

**FR-1.4:** The system MUST cache metafield data in app database for fast queries.

**FR-1.5:** Webhook handlers MUST sync metafield changes automatically:

- `products/update` → Sync metafields to database
- `products/delete` → Remove from database cache

---

### FR-2: Admin Product Management UI

**FR-2.1:** The admin dashboard MUST display all Shopify products with status indicators:

```
Product Status:
├─ ✓ Ring Builder Product (has metafields)
├─ ⚠ Incomplete Setup (missing required fields)
└─ ○ Regular Product (no ring builder data)
```

**FR-2.2:** The system MUST provide "Add as Diamond" and "Add as Setting" buttons for each product.

**FR-2.3:** Clicking "Add as Diamond" MUST open a modal/form with:

- Product preview (image, title, price from Shopify)
- Visual shape selector (10 icon buttons: Round, Princess, Oval, etc.)
- Carat weight input (number, decimal)
- Cut dropdown (Excellent, Very Good, Good, Fair, Poor)
- Color dropdown (D, E, F, G, H, I, J, K, L, M)
- Clarity dropdown (FL, IF, VVS1, VVS2, VS1, VS2, SI1, SI2, I1, I2, I3)
- Diamond Type radio buttons (Mined, Lab Grown, Fancy Color)
- Certificate dropdown (GIA, AGS, IGI, None)
- Certificate number input
- Certificate URL input (optional)
- Save button

**FR-2.4:** Clicking "Add as Setting" MUST open a modal/form with:

- Product preview
- Style dropdown (Solitaire, Halo, Three Stone, Vintage, etc.)
- Compatible shapes multi-select (checkboxes with icons)
- Setting height dropdown (Low, Medium, High)
- Metal type pricing table:
  - 14K White Gold: $\_\_\_
  - 14K Yellow Gold: $\_\_\_
  - 14K Rose Gold: $\_\_\_
  - 18K White Gold: $\_\_\_
  - 18K Yellow Gold: $\_\_\_
  - 18K Rose Gold: $\_\_\_
  - Platinum: $\_\_\_
- Save button

**FR-2.5:** On save, the system MUST:

1. Write all data to Shopify metafields via GraphQL
2. Save to app database (StoneMetadata or SettingMetadata table)
3. Show success message
4. Update product status indicator

**FR-2.6:** The system MUST provide edit functionality:

- Click product → Opens form with existing data pre-filled
- Modify fields
- Save → Updates metafields + database

**FR-2.7:** The system MUST validate required fields before saving:

- Diamond: shape, carat, diamond_type required
- Setting: style, compatible_shapes, metal_prices required

---

### FR-3: CSV Import (Optional Advanced Feature)

**FR-3.1:** CSV import MUST be hidden in "Advanced Tools" section (not default workflow).

**FR-3.2:** CSV import MUST support same fields as admin UI.

**FR-3.3:** CSV import MUST write to metafields + database (same as UI).

**FR-3.4:** CSV import MUST provide validation and preview before final import.

---

### FR-4: Visual Icon-Based Filters (Customer-Facing)

**FR-4.1:** The system MUST replace text filters with icon-based visual filters:

**Setting Styles** (9 icons):

- Halo, Solitaire, Three Stone, Single Row, Trellis, MultiRow, Vintage, Pave, Bypass

**Stone Shapes** (10 icons):

- Round, Princess, Oval, Pear, Marquise, Heart, Emerald, Cushion, Asscher, Radiant

**Metal Types** (7 options):

- 14K White Gold, 14K Yellow Gold, 14K Rose Gold
- 18K White Gold, 18K Yellow Gold, 18K Rose Gold
- Platinum

**FR-4.2:** Each icon MUST:

- Be clickable (44px min touch target on mobile)
- Show label below icon
- Highlight when selected (border + color change)
- Support multi-select for shapes
- Support single-select for styles and metals

**FR-4.3:** The system MUST provide default SVG icon set (optimized, < 10KB each).

---

### FR-5: Diamond Type Categorization

**FR-5.1:** The Stone Selector (Step 2) MUST display 3 tabs:

- Tab 1: **Mined** (natural diamonds) - default active
- Tab 2: **Lab Grown** (lab-created diamonds)
- Tab 3: **Fancy Color** (colored diamonds)

**FR-5.2:** Each tab MUST show count badge (e.g., "Mined (6,869)").

**FR-5.3:** Clicking tab MUST filter stones by `diamond_type` metafield automatically.

**FR-5.4:** Tab styling: burgundy/wine (#6D2932) for active, light gray for inactive.

---

### FR-6: Diamond Comparison Tool

**FR-6.1:** The system MUST add checkbox to each stone in table/grid view.

**FR-6.2:** The system MUST display floating "Compare Items (n)" button when 2+ selected.

**FR-6.3:** The system MUST allow comparison of 2-4 diamonds simultaneously.

**FR-6.4:** Clicking "Compare Items" MUST open modal showing:

- Side-by-side comparison table
- Rows: Image, Shape, Carat, Cut, Color, Clarity, Price, Certificate, Measurements, Table %, Depth %, Polish, Symmetry, Fluorescence
- "Select This Diamond" button for each
- Differences highlighted (yellow background)
- "Best Value" indicator for lowest price per carat

**FR-6.5:** Comparison selection MUST persist in sessionStorage across page refreshes.

---

### FR-7: Save & Share Configuration

**FR-7.1:** The system MUST add "Save Search" button (visible throughout builder).

**FR-7.2:** Clicking "Save Search" MUST:

- Create unique shareable URL (e.g., `/builder/saved/ABC123`)
- Save configuration to database with `status: "saved"`
- Generate short URL slug (8-12 characters, alphanumeric)
- Show success modal with copy-to-clipboard button

**FR-7.3:** The system MUST add "Share" button on Step 4 (Review page).

**FR-7.4:** Clicking "Share" MUST open modal with options:

- Email: Send via email form
- Copy Link: Copy URL to clipboard
- Facebook: Open Facebook Share Dialog
- Twitter: Open Twitter post dialog

**FR-7.5:** Email share MUST include:

- Configuration images (setting + stone)
- Price breakdown
- Link to view full configuration
- Merchant branding/logo

**FR-7.6:** Saved configurations MUST be retrievable via URL:

- Load configuration from database
- Pre-fill all selections
- Recalculate prices (in case changed)
- Allow modification and checkout

---

### FR-8: Customer Inquiry & Action Buttons

**FR-8.1:** The system MUST add 4 action buttons to product detail and Step 4:

- Drop A Hint
- Request More Info
- E-Mail A Friend
- Schedule Viewing

**FR-8.2:** **Drop A Hint** MUST:

- Open modal with form (Recipient Email, Your Name, Special Date, Message)
- Send email to recipient with ring images and hint message
- NO pricing information in email (hint only)
- Optional merchant notification

**FR-8.3:** **Request More Info** MUST:

- Open modal with form (Name, Email, Phone, Question)
- Send email to merchant with customer contact and question
- Include configuration details and link

**FR-8.4:** **E-Mail A Friend** MUST:

- Reuse share email functionality
- Pre-populate subject: "Check out this ring!"

**FR-8.5:** **Schedule Viewing** MUST:

- Open modal with form (Name, Email, Phone, Preferred Date/Time, Message)
- Send email to merchant with viewing request
- Include iCal attachment for merchant's calendar

**FR-8.6:** Merchants MUST be able to configure:

- Which buttons are visible (enable/disable each)
- Notification email address
- Custom response templates

---

### FR-9: Virtual Try-On Integration

**FR-9.1:** The system MUST add "Virtual Try On" button to:

- Product detail modals (settings)
- Step 4 (Review page)

**FR-9.2:** The system MUST support one integration option (merchant chooses):

**Option A:** Third-Party API (Dor Technologies, GemFind VTO, etc.)

- Pass product image URL and SKU to VTO service
- Display VTO in modal/iframe

**Option B:** Simple Image Upload

- Customer uploads hand photo
- System overlays ring image (CSS positioning)
- Download composed image

**Option C:** Apple AR Quick Look (iOS only)

- Generate USDZ 3D model (if available)
- Use AR Quick Look API

**FR-9.3:** Merchants MUST configure: Enable/disable, choose option, API credentials.

**FR-9.4:** The system MUST track VTO usage analytics.

---

### FR-10: Advanced Browsing Features

**FR-10.1:** The system MUST add View Mode Toggle:

- Grid View: Cards with images (2-4 columns responsive)
- List View: Table format (existing StoneTable component)
- Toggle button with icons
- Persist preference in localStorage

**FR-10.2:** Grid View MUST display:

- Stone image (or placeholder)
- Shape badge
- Carat weight
- Cut, Color, Clarity summary
- Price
- Certificate badge
- "View Details" button
- Checkbox for comparison

**FR-10.3:** The system MUST add Records Per Page selector:

- Dropdown: 12, 20, 50, 100
- Default: 20
- Persist preference in localStorage

**FR-10.4:** The system MUST add SKU/Stock# search field:

- Text input with search button
- Searches `productId` SKU from Shopify
- Displays matching stones or "No results"

**FR-10.5:** The system MUST display Results Summary:

- Format: "6,869 Similar Diamonds | Compare Items (1)"
- Updates dynamically with filters

---

### FR-11: Enhanced Product Detail Pages

**FR-11.1:** The system MUST create dedicated detail page routes:

- `/builder/setting/:id`
- `/builder/diamond/:id`

**FR-11.2:** Setting detail page MUST display:

- Image gallery (main + thumbnails, 360° if available)
- Setting name and SKU
- Description
- Ring Specification panel (Metal Type, Center Stone Size, Ring Size dropdowns)
- Price (updates with selections)
- Action buttons (Add Your Diamond, Virtual Try On, Request Info, Email Friend)
- Social sharing buttons

**FR-11.3:** Diamond detail page MUST display:

- Diamond image (high-res, zoom)
- Certificate badge with "View" link
- Title and description
- Specifications table (all 4Cs, measurements, etc.)
- Price
- Action buttons (Add to Cart, Complete Your Ring, Drop A Hint, Request Info, Email Friend, Schedule Viewing)
- Social sharing buttons

**FR-11.4:** The system MUST support GIA Certificate Viewer:

- If `certificate_url` metafield exists, display "View Certificate" link
- Opens PDF in modal or new tab

**FR-11.5:** Detail pages MUST:

- Be shareable (unique URL)
- Work when accessed directly (not just from builder)
- Maintain builder state (if accessed from builder)
- Be mobile responsive

---

## 5. Non-Goals (Out of Scope)

**NG-1:** ❌ Customer accounts/login system (anonymous sessions only)

**NG-2:** ❌ Advanced analytics dashboard (basic tracking only)

**NG-3:** ❌ In-app appointment scheduling (email to merchant only)

**NG-4:** ❌ Live chat integration

**NG-5:** ❌ 3D rendering / advanced AR

**NG-6:** ❌ Financing / payment plans

**NG-7:** ❌ Multi-language / multi-currency

**NG-8:** ❌ AI-powered recommendations

**NG-9:** ❌ Custom 3D model generation

---

## 6. Design Considerations

### UI/UX Guidelines

**Design Evolution from Phase 1.0:**

- Maintain clean, professional aesthetic
- Add more visual elements (icons, tabs, badges)
- Introduce burgundy/wine accent color (#6D2932) to match GemFind
- Increase white space for premium feel
- Mobile-first responsive design

**GemFind Design Patterns to Adopt:**

1. **Tabs with badges**: Mined (6,869), Lab Grown (2,450), Fancy Color (42)
2. **Icon-first filters**: Visual before text
3. **Floating action buttons**: Compare Items, Save Search
4. **Rich product cards**: More information density
5. **Modal over page**: Detail views as modals (mobile) or pages (desktop)

### Component Architecture

**New Components Required:**

```
IconFilter (new)
├── Icon (SVG/image)
├── Label (text below icon)
└── SelectionState (border/highlight animation)

DiamondTypeTabs (new)
├── Tab: Mined (with count badge)
├── Tab: Lab Grown (with count badge)
├── Tab: Fancy Color (with count badge)
└── Active state styling (#6D2932)

ComparisonModal (new)
├── ComparisonTable (responsive)
├── DiamondColumn (up to 4 columns)
├── HighlightDifferences (yellow background)
└── BestValueIndicator

ShareModal (new)
├── EmailForm (recipient, message)
├── SocialButtons (FB, Twitter, Pinterest)
├── CopyLinkButton (with success feedback)
└── CloseButton

ActionButtonGroup (new)
├── DropAHintButton
├── RequestInfoButton
├── EmailFriendButton
├── ScheduleViewingButton
└── VirtualTryOnButton (conditional)

ProductDetailPage (new route)
├── ImageGallery (left column)
│   ├── MainImage (zoomable)
│   ├── ThumbnailRow (4-6 thumbnails)
│   └── 360° viewer (if available)
└── ProductInfo (right column)
    ├── Title & SKU
    ├── SpecificationPanel
    ├── PriceDisplay (updates live)
    ├── ActionButtons
    └── SocialSharing

InquiryModal (shared)
├── FormFields (dynamic based on type)
├── ValidationMessages
├── SubmitButton (with loading state)
└── SuccessMessage
```

### Color Scheme

**Phase 1.0 Colors (Maintained):**

- Primary: #000000 (Black)
- Accent: #D4AF37 (Gold)

**Phase 2.0 Additions:**

- **Accent 2**: #6D2932 (Burgundy/Wine) - tabs, active states, CTAs
- **Accent 3**: #8B4789 (Purple) - highlights, hover states
- Background: #FFFFFF (White)
- Secondary BG: #F7F7F7 (Light Gray) - cards, panels
- Border: #E0E0E0 (Light Gray) - dividers, card borders
- Text: #333333 (Dark Gray) - body text
- Text Secondary: #666666 (Medium Gray) - labels, descriptions
- Success: #28A745 (Green) - success messages
- Warning: #FFC107 (Amber) - warnings
- Error: #DC3545 (Red) - errors

### Icon Specifications

**Setting Style Icons (9 total):**

- **Styles**: Halo, Solitaire, Three Stone, Single Row, Trellis, MultiRow, Vintage, Pave, Bypass
- **Format**: SVG (preferred) or PNG with 2x retina support
- **Size**: 64x64px (display), 128x128px (retina)
- **Color**: Black line art (#000000) on transparent background
- **Style**: Clean, minimalist, easily recognizable at small sizes
- **File naming**: `icon-style-{name}.svg` (e.g., `icon-style-halo.svg`)

**Stone Shape Icons (10 total):**

- **Shapes**: Round, Princess, Oval, Pear, Marquise, Heart, Emerald, Cushion, Asscher, Radiant
- **Format**: SVG (preferred) or PNG with 2x retina support
- **Size**: 64x64px (display), 128x128px (retina)
- **Color**: Black line art (#000000) on transparent background
- **Style**: Geometric, accurate shape representation from top-down view
- **File naming**: `icon-shape-{name}.svg` (e.g., `icon-shape-round.svg`)

**Metal Type Visual Indicators:**

- Can be text-based labels or color swatches
- **Format**: CSS-based or SVG
- **Colors**:
  - White Gold: #F8F8F8 (light silver)
  - Yellow Gold: #FFD700
  - Rose Gold: #E0BFB8 (pink-champagne)
  - Platinum: #E5E4E2 (platinum gray)

### Email Template Design

**Brand Guidelines:**

- Use merchant's logo (max height: 60px)
- Primary color: Merchant's brand color or #6D2932
- Font: System fonts (Arial, Helvetica, sans-serif) for email compatibility
- Max width: 600px (mobile-friendly)
- Responsive design with mobile breakpoints

**Template 1: Share Configuration Email**

```
Subject: [Sender Name] wants to share a ring with you!

Header: [Merchant Logo]

Hi [Recipient Name],

[Sender Name] found a beautiful ring and wanted to share it with you!

[IMAGE: Ring composite - 400x400px]

┌─────────────────────────────────┐
│ Ring Details                    │
├─────────────────────────────────┤
│ Setting: [Setting Name]         │
│ Metal: [Metal Type]             │
│ Diamond: [Carat] [Shape]        │
│ Quality: [Color] [Clarity]      │
│ Cut: [Cut Grade]                │
│ Price: $[Total Price]           │
└─────────────────────────────────┘

[Button: View Full Details] (burgundy #6D2932)

This ring was designed using [Merchant Name]'s Ring Builder.

Footer:
[Merchant Name] | [Address] | [Phone]
[Social Media Icons]
```

**Template 2: Drop A Hint Email**

```
Subject: Someone has dropped you a hint! 💍

Header: [Merchant Logo]

Hi [Recipient Name],

Someone special has dropped you a hint about a ring they love!

[IMAGE: Ring composite - 400x400px]

💕 "I love this ring and would be thrilled to receive it as a gift!"

[Button: View This Ring] (burgundy #6D2932)

Special Note: [Custom Message from Sender]
Special Date: [Date] (if provided)

From: [Anonymous or Name] (optional)

NOTE: Price information hidden (hint only, not full details)

Footer:
[Merchant Name] | [Address] | [Phone]
```

**Template 3: Request More Info (to Merchant)**

```
Subject: 🔔 Customer Inquiry about [Product Name]

Header: [Ring Builder Admin]

Hi [Merchant Name],

You have a new inquiry from a potential customer!

┌─────────────────────────────────┐
│ Customer Information            │
├─────────────────────────────────┤
│ Name: [Customer Name]           │
│ Email: [Customer Email]         │
│ Phone: [Customer Phone]         │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ Product Details                 │
├─────────────────────────────────┤
│ Config ID: CONFIG-20251013-ABC  │
│ Setting: [Name] - SKU [SKU]     │
│ Diamond: [Specs] - SKU [SKU]    │
│ Total Price: $[Price]           │
└─────────────────────────────────┘

Customer's Question:
"[Customer Message]"

[Button: View Configuration] [Button: Reply to Customer]

Inquiry submitted: [Date & Time]
```

**Template 4: Schedule Viewing (to Merchant)**

```
Subject: 📅 Viewing Request from [Customer Name]

Header: [Ring Builder Admin]

Hi [Merchant Name],

[Customer Name] would like to schedule an in-store viewing!

┌─────────────────────────────────┐
│ Customer Information            │
├─────────────────────────────────┤
│ Name: [Customer Name]           │
│ Email: [Customer Email]         │
│ Phone: [Customer Phone]         │
├─────────────────────────────────┤
│ Preferred Date: [Date]          │
│ Preferred Time: [Time]          │
└─────────────────────────────────┘

[IMAGE: Ring composite - 300x300px]

Product Details:
- Config ID: CONFIG-20251013-ABC
- Setting: [Setting Name]
- Diamond: [Diamond Specs]
- Total: $[Price]

Note from Customer:
"[Customer Message]"

[Button: Add to Calendar] [Button: Confirm Appointment]

[iCal Attachment: appointment.ics]
```

### Responsive Design Breakpoints

```css
/* Mobile First Approach */

/* Small phones */
@media (max-width: 375px) {
  - Icon filters: 2 columns
  - Product grid: 1 column
  - Font size: 14px base
}

/* Phones */
@media (min-width: 376px) and (max-width: 767px) {
  - Icon filters: 3 columns
  - Product grid: 2 columns
  - Font size: 15px base
}

/* Tablets */
@media (min-width: 768px) and (max-width: 1023px) {
  - Icon filters: 5 columns
  - Product grid: 2-3 columns
  - Font size: 16px base
}

/* Desktop */
@media (min-width: 1024px) {
  - Icon filters: full row (9-10 items)
  - Product grid: 3-4 columns
  - Font size: 16px base
}
```

### Accessibility Requirements

- All icons MUST have `aria-label` attributes
- Color contrast ratio: WCAG AA compliance (4.5:1 minimum)
- Keyboard navigation: Tab order logical, Enter/Space activates
- Focus indicators: Visible outline (2px solid #6D2932)
- Screen reader support: Semantic HTML, ARIA labels
- Touch targets: Minimum 44x44px (mobile)
- Form validation: Clear error messages, inline validation

---

## 7. Technical Considerations

### Architecture

```
┌─────────────────────────────────────┐
│  SHOPIFY (Source of Truth)         │
│  ├─ Products (title, price, image) │
│  └─ Metafields (ring builder data) │
└─────────────────────────────────────┘
            ↓ sync via webhooks
┌─────────────────────────────────────┐
│  YOUR APP DATABASE (Performance)    │
│  ├─ StoneMetadata (cached)         │
│  ├─ SettingMetadata (cached)       │
│  └─ Configurations                 │
└─────────────────────────────────────┘
            ↓ fast queries
┌─────────────────────────────────────┐
│  CUSTOMER (Ring Builder UI)         │
│  └─ Filters, searches, builds       │
└─────────────────────────────────────┘
```

### Technology Stack

**Frontend, Backend, Database:** Same as Phase 1.0 (Remix, React, Prisma, SQLite)

**New Dependencies:**

```json
{
  "dependencies": {
    "react-icons": "^4.11.0", // Icon library
    "react-image-gallery": "^1.3.0", // Product image galleries
    "@sendgrid/mail": "^7.7.0", // Email service (or AWS SES/Postmark)
    "nanoid": "^5.0.0", // Short URL generation
    "ical-generator": "^5.0.0" // iCal calendar invites
  }
}
```

**Optional Third-Party Services:**

- **Email**: SendGrid (100 emails/day free) OR AWS SES OR Postmark
- **Social Sharing**: Facebook App ID (for Share Dialog)
- **Virtual Try-On**: Dor Technologies API OR DIY solution

### Database Schema Changes

```prisma
model StoneMetadata {
  // Existing fields...
  diamondType       String   // "mined", "lab_grown", "fancy_color"
  certificateUrl    String?  // URL to PDF certificate

  // Add indexes
  @@index([shop, diamondType])
}

model Configuration {
  // Existing fields...
  shareToken        String?  @unique // For shareable URLs
  shareCount        Int      @default(0)
  savedAt           DateTime?

  @@index([shareToken])
}

model CustomerInquiry {
  id               String   @id @default(cuid())
  shop             String
  type             String   // "hint", "info", "viewing", "email"
  configurationId  String?
  productId        String?
  customerName     String?
  customerEmail    String
  customerPhone    String?
  message          String?
  preferredDate    DateTime?
  status           String   @default("new")
  createdAt        DateTime @default(now())

  @@index([shop, type])
  @@index([shop, status])
}

model AppSettings {
  // Existing fields...
  customerEngagement String? // JSON: action button settings
  virtualTryOn       String? // JSON: VTO settings
  socialSharing      String? // JSON: social settings
}
```

### API Endpoints

```
New Public API:
├─ POST /api/builder/save           - Save configuration
├─ GET  /api/builder/saved/:token   - Load saved config
├─ POST /api/builder/share          - Share configuration
├─ POST /api/builder/inquiry        - Submit inquiry
├─ POST /api/builder/compare        - Compare diamonds
└─ GET  /api/builder/product/:id    - Get product detail

New Admin API:
├─ POST /api/admin/products/:id/mark-as-diamond  - Add diamond specs
├─ POST /api/admin/products/:id/mark-as-setting  - Add setting specs
├─ GET  /api/admin/inquiries        - List inquiries
├─ PUT  /api/admin/inquiries/:id    - Update inquiry
└─ GET  /api/admin/metafields/sync  - Manual sync trigger
```

### Email Service

Required for Phase 2.0:

- SendGrid, AWS SES, or Postmark
- 4 email templates (Share, Hint, Info Request, Schedule)
- Transactional email tracking

---

## 7. Success Metrics

### Merchant Metrics

- Product setup time: < 30 seconds per item
- Setup completion rate: 95%+ (vs 70% with CSV)
- Error rate: < 5%
- Merchant NPS: 8+

### Customer Metrics

- Configuration completion: 40%+ (from 30%)
- Feature engagement: 20%+ use save/share/compare
- Time to decision: < 8.5 min (from 10 min)
- Virtual try-on usage: 10%+

### Technical Metrics

- API response time: < 500ms
- Page load time: < 3s
- Data sync accuracy: 99.9%
- Uptime: 99.5%+

---

## 8. Timeline & Milestones

### 8-Week Development Plan

**Phase 2.1: Foundation (Weeks 1-2)**

- Metafield definitions setup
- Admin product management UI
- Webhook sync system
- Database migrations
- **Milestone:** Merchants can add products via UI

**Phase 2.2: Visual Enhancements (Weeks 3-4)**

- Icon-based filters
- Diamond type tabs
- Grid/List toggle
- Records per page
- SKU search
- **Milestone:** Customer UX matches GemFind visually

**Phase 2.3: Engagement Features (Weeks 5-6)**

- Comparison tool
- Save & Share
- Customer inquiry forms
- Email templates and delivery
- **Milestone:** All engagement tools working

**Phase 2.4: Advanced Features (Week 7)**

- Virtual Try-On integration
- Enhanced detail pages
- GIA certificate viewer
- **Milestone:** Feature parity with GemFind

**Phase 2.5: Polish & Launch (Week 8)**

- Performance optimization
- Mobile testing
- Documentation
- Migration from Phase 1.0
- **Milestone:** Production ready

---

## 9. Migration Strategy

### Phase 1.0 → Phase 2.0 Migration

**For Existing Merchants:**

1. **Automatic Database Migration:**
   - Add `diamondType` column (default: "mined")
   - Add `certificateUrl` column (default: null)
   - Add new AppSettings fields (default: disabled)

2. **Metafields Population:**
   - Run migration script to write existing database data to Shopify metafields
   - Creates metafield definitions
   - Writes all StoneMetadata → product metafields
   - Writes all SettingMetadata → product metafields

3. **Backward Compatibility:**
   - Phase 1.0 features continue working
   - CSV import still available (as advanced feature)
   - No breaking changes to existing configurations
   - Gradual merchant onboarding to new UI

4. **Rollout Plan:**
   - Week 1: Deploy to staging, internal testing
   - Week 2: Beta with 2-3 merchants, gather feedback
   - Week 3: General availability, gradual rollout
   - Week 4+: Full adoption, deprecate old CSV-first flow

---

## 10. Open Questions

**Q1:** Which Virtual Try-On provider to integrate?

- Decision needed based on budget and requirements

**Q2:** Should saved configurations expire?

- Recommendation: 90 days for anonymous saves

**Q3:** How to handle diamond type for existing stones during migration?

- Recommendation: Default all to "mined", allow bulk update

**Q4:** Email template customization level?

- Recommendation: Logo + colors only (not full templates)

**Q5:** Comparison across diamond types (mined vs lab grown)?

- Recommendation: Allow any diamonds to be compared

---

## 11. Acceptance Criteria

### Phase 2.0 is Complete When:

**Merchant Admin:**

- [x] Merchant can select Shopify product and add diamond/setting specs via UI
- [x] Data is written to Shopify metafields + app database
- [x] Product changes in Shopify auto-sync to app
- [x] Dashboard shows clear product status
- [x] Setup takes < 30 seconds per product

**Customer Experience:**

- [x] Icon-based filters work on all devices
- [x] Diamond type tabs filter correctly
- [x] Comparison tool works for 2-4 diamonds
- [x] Save & Share generates working URLs
- [x] All inquiry forms send emails
- [x] Virtual Try-On launches (if enabled)
- [x] Grid/List toggle and pagination work
- [x] Detail pages are accessible and shareable

**Technical:**

- [x] All metafields sync correctly
- [x] Webhooks handle product updates
- [x] API response times < 500ms
- [x] Mobile responsive on all new features
- [x] Email delivery rate > 95%
- [x] Zero TypeScript errors
- [x] Phase 1.0 functionality preserved

**Migration:**

- [x] Existing data migrated to metafields
- [x] No data loss during migration
- [x] Backward compatible
- [x] Documentation updated

---

## 12. Approval

**Product Owner:** **\*\*\*\***\_**\*\*\*\*** Date: **\*\*\*\***\_**\*\*\*\***

**Tech Lead:** **\*\*\*\***\_**\*\*\*\*** Date: **\*\*\*\***\_**\*\*\*\***

**Stakeholders:** **\*\*\*\***\_**\*\*\*\*** Date: **\*\*\*\***\_**\*\*\*\***

---

**END OF PRD**

**Document Version:** 1.0  
**Last Updated:** October 13, 2025  
**Next Review:** Upon development start  
**Status:** ✅ Ready for Implementation

---

## Appendix A: Metafields Schema Reference

```typescript
// Diamond/Stone Metafields
namespace: "ringbuilder";

metafields: {
  type: "single_line_text_field"; // "diamond" or "setting"
  shape: "single_line_text_field"; // "round", "princess", etc.
  carat: "number_decimal"; // 1.50
  cut: "single_line_text_field"; // "excellent", "very_good", etc.
  color: "single_line_text_field"; // "d", "e", "f", etc.
  clarity: "single_line_text_field"; // "fl", "if", "vvs1", etc.
  diamond_type: "single_line_text_field"; // "mined", "lab_grown", "fancy_color"
  certificate: "single_line_text_field"; // "gia", "ags", "igi"
  certificate_number: "single_line_text_field";
  certificate_url: "url";
  measurements: "single_line_text_field"; // "7.35 x 7.40 x 4.50"
  table_percent: "number_decimal";
  depth_percent: "number_decimal";
  polish: "single_line_text_field";
  symmetry: "single_line_text_field";
  fluorescence: "single_line_text_field";
}

// Setting Metafields
namespace: "ringbuilder";

metafields: {
  type: "single_line_text_field"; // "setting"
  style: "single_line_text_field"; // "solitaire", "halo", etc.
  compatible_shapes: "list.single_line_text_field"; // ["round", "princess"]
  metal_prices: "json"; // {"14k_white": 1200, "14k_yellow": 1250, ...}
  setting_height: "single_line_text_field"; // "low", "medium", "high"
}
```

---

## Appendix B: Admin UI Mockup

```
┌──────────────────────────────────────────────────────┐
│ Ring Builder Admin                                   │
├──────────────────────────────────────────────────────┤
│ [Dashboard] [Products] [Inquiries] [Settings]        │
│                                                      │
│ Products (47)                     [Sync from Shopify]│
│                                                      │
│ ┌────────────────────────────────────────────────┐  │
│ │ [Image] 1.50ct Round Diamond                  │  │
│ │         $5,000 | SKU: DIA-001                 │  │
│ │         ✓ Diamond (Mined, Round, 1.50ct)     │  │
│ │         [Edit] [Remove]                       │  │
│ └────────────────────────────────────────────────┘  │
│                                                      │
│ ┌────────────────────────────────────────────────┐  │
│ │ [Image] Classic Solitaire Setting             │  │
│ │         $1,200 | SKU: SET-001                 │  │
│ │         ⚠ Incomplete (missing metal prices)   │  │
│ │         [Complete Setup →]                    │  │
│ └────────────────────────────────────────────────┘  │
│                                                      │
│ ┌────────────────────────────────────────────────┐  │
│ │ [Image] Gold Chain Necklace                   │  │
│ │         $800 | SKU: CHAIN-001                 │  │
│ │         ○ Regular Product                     │  │
│ │         [Add as Diamond] [Add as Setting]     │  │
│ └────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────┘
```

---

## Appendix C: Data Flow Diagram

```
MERCHANT SETUP:
1. Create product in Shopify → Product exists
2. Open Ring Builder app → Sees product list
3. Click "Add as Diamond" → Opens form
4. Fill specs → Click Save
5. App writes to:
   ├─ Shopify metafields (permanent)
   └─ App database (cache)
6. Done!

CUSTOMER SHOPPING:
1. Opens ring builder → Step 1: Settings
2. Filters by style → API queries database
3. Selects setting → Step 2: Diamonds
4. Filters by tabs (Mined) → Database filtered
5. Compares 3 diamonds → Comparison modal
6. Selects diamond → Step 3: Customize
7. Reviews → Step 4: Review
8. Clicks Save → Generates shareable URL
9. Clicks Share → Sends email with link
10. Adds to cart → Shopify cart with properties
11. Checks out → Order created

MERCHANT FULFILLMENT:
1. Receives order → Opens Shopify admin
2. Sees line item properties → All specs visible
3. Fulfills order → Uses SKUs and specs
4. Ships to customer → Complete!
```

---

## Appendix D: API Request/Response Examples

### Mark Product as Diamond (Admin)

```http
POST /api/admin/products/gid:__shopify__Product__123456/mark-as-diamond
Content-Type: application/json
Authorization: Bearer {session_token}

Request Body:
{
  "shape": "round",
  "carat": 1.50,
  "cut": "excellent",
  "color": "g",
  "clarity": "vs1",
  "diamondType": "mined",
  "certificate": "gia",
  "certificateNumber": "2141234567",
  "certificateUrl": "https://gia.edu/report/2141234567"
}

Response 200 OK:
{
  "success": true,
  "productId": "gid://shopify/Product/123456",
  "metafieldsCreated": 9,
  "databaseUpdated": true,
  "message": "Diamond specs saved successfully"
}
```

### Save Configuration

```http
POST /api/builder/save
Content-Type: application/json

Request Body:
{
  "shop": "merchant-store.myshopify.com",
  "settingId": "gid://shopify/Product/111",
  "stoneId": "gid://shopify/Product/123",
  "metalType": "14k_white_gold",
  "ringSize": "7",
  "sideStonesConfig": { "quality": "Premium", "price": 500 },
  "totalPrice": 7035
}

Response 200 OK:
{
  "success": true,
  "configurationId": "CONFIG-20251013-ABC123",
  "shareToken": "XyZ9pQ2m",
  "shareUrl": "https://merchant-store.com/builder/saved/XyZ9pQ2m",
  "expiresAt": "2026-01-13T00:00:00Z"
}
```

### Load Saved Configuration

```http
GET /api/builder/saved/XyZ9pQ2m?shop=merchant-store.myshopify.com

Response 200 OK:
{
  "configuration": {
    "configurationId": "CONFIG-20251013-ABC123",
    "settingId": "gid://shopify/Product/111",
    "stoneId": "gid://shopify/Product/123",
    "metalType": "14k_white_gold",
    "ringSize": "7",
    "sideStonesConfig": { "quality": "Premium", "price": 500 },
    "totalPrice": 7035,
    "createdAt": "2025-10-13T14:30:00Z"
  },
  "setting": {
    "id": "meta_abc",
    "productId": "gid://shopify/Product/111",
    "title": "Classic Solitaire",
    "style": "solitaire",
    "images": ["https://cdn.shopify.com/..."],
    "basePrices": { "14k_white_gold": 1200, ... }
  },
  "stone": {
    "id": "meta_xyz",
    "productId": "gid://shopify/Product/123",
    "carat": 1.50,
    "shape": "round",
    "cut": "excellent",
    "color": "g",
    "clarity": "vs1",
    "diamondType": "mined",
    "certificate": "gia",
    "certificateNumber": "2141234567",
    "price": 5000
  }
}
```

### Compare Diamonds

```http
POST /api/builder/compare
Content-Type: application/json

Request Body:
{
  "shop": "merchant-store.myshopify.com",
  "stoneIds": [
    "gid://shopify/Product/123",
    "gid://shopify/Product/456",
    "gid://shopify/Product/789"
  ]
}

Response 200 OK:
{
  "stones": [
    {
      "id": "meta_xyz",
      "productId": "gid://shopify/Product/123",
      "carat": 1.50,
      "shape": "round",
      "cut": "excellent",
      "color": "g",
      "clarity": "vs1",
      "price": 5000,
      "pricePerCarat": 3333,
      "certificate": "gia",
      "certificateNumber": "2141234567"
    },
    {
      "id": "meta_def",
      "productId": "gid://shopify/Product/456",
      "carat": 1.45,
      "shape": "round",
      "cut": "excellent",
      "color": "g",
      "clarity": "vs2",
      "price": 4500,
      "pricePerCarat": 3103,
      "certificate": "gia",
      "certificateNumber": "2141234568"
    }
  ],
  "differences": {
    "carat": true,
    "clarity": true,
    "price": true
  },
  "bestValue": "gid://shopify/Product/456"
}
```

### Submit Customer Inquiry

```http
POST /api/builder/inquiry
Content-Type: application/json

Request Body:
{
  "shop": "merchant-store.myshopify.com",
  "type": "drop_a_hint",
  "configurationId": "CONFIG-20251013-ABC123",
  "recipientEmail": "recipient@example.com",
  "senderName": "Anonymous",
  "message": "I love this ring!",
  "specialDate": "2026-06-15"
}

Response 200 OK:
{
  "success": true,
  "inquiryId": "INQ-20251013-XYZ789",
  "emailSent": true,
  "message": "Your hint has been sent!"
}
```

---

## Appendix E: Testing Checklist

### Metafields Integration

- [ ] Metafield definitions created on app install
- [ ] Admin UI writes to Shopify metafields correctly
- [ ] Database cache syncs with metafields
- [ ] Webhooks update cache when product changes
- [ ] Metafields survive app uninstall (data persistence)

### Admin Product Management

- [ ] Product list shows all Shopify products
- [ ] Status indicators display correctly (✓, ⚠, ○)
- [ ] "Add as Diamond" form opens with all fields
- [ ] "Add as Setting" form opens with all fields
- [ ] Icon selectors work (shape, style)
- [ ] Form validation prevents invalid data
- [ ] Save writes to metafields + database
- [ ] Edit functionality pre-fills existing data
- [ ] Product setup takes < 30 seconds

### Visual Enhancements (Customer)

- [ ] Icon filters display correctly (desktop & mobile)
- [ ] Icon selection states work (border/highlight)
- [ ] Diamond type tabs show correct counts
- [ ] Tab switching filters correctly
- [ ] Grid view displays properly (2-4 columns responsive)
- [ ] List view works
- [ ] View toggle persists in localStorage
- [ ] Records per page selector works (12, 20, 50, 100)
- [ ] SKU search finds exact matches
- [ ] Results summary updates dynamically

### Comparison Tool

- [ ] Checkboxes appear on stone cards/table
- [ ] Compare button shows when 2+ selected
- [ ] Comparison modal opens with selected stones
- [ ] All specs displayed in table format
- [ ] Differences highlighted (yellow background)
- [ ] "Best value" indicator appears
- [ ] "Select This Diamond" closes modal and proceeds
- [ ] Comparison persists in sessionStorage

### Save & Share

- [ ] "Save Search" button works
- [ ] Shareable URL generated correctly
- [ ] Copy to clipboard works
- [ ] Share modal opens
- [ ] Email share form submits
- [ ] Email received with correct content
- [ ] Facebook share opens Share Dialog
- [ ] Twitter share opens compose dialog
- [ ] Saved config loads from URL
- [ ] All selections pre-filled correctly

### Customer Engagement

- [ ] 4 action buttons appear on detail pages
- [ ] Each button opens correct modal
- [ ] Drop A Hint form submits and sends email
- [ ] Request Info sends to merchant email
- [ ] Email A Friend sends correctly
- [ ] Schedule Viewing sends with iCal attachment
- [ ] Merchant receives all inquiry emails
- [ ] Admin inquiry management shows all inquiries

### Virtual Try-On

- [ ] VTO button appears (if enabled in settings)
- [ ] VTO launches chosen integration
- [ ] VTO tracking records usage
- [ ] VTO disabled state works correctly

### Performance & Quality

- [ ] Page load time < 3s
- [ ] API response time < 500ms
- [ ] Email delivery rate > 95%
- [ ] Mobile responsive on all new features
- [ ] Zero TypeScript errors
- [ ] Zero build errors
- [ ] Accessibility (WCAG AA)
- [ ] Phase 1.0 functionality preserved

---

## Appendix F: Admin UI Detailed Mockups

### Product Dashboard

```
┌──────────────────────────────────────────────────────────────┐
│ Ring Builder Admin - Products                                │
├──────────────────────────────────────────────────────────────┤
│ [Dashboard] [Products] [Inquiries] [Settings] [Help]         │
│                                                              │
│ Products (47)                          [🔄 Sync from Shopify]│
│ [Search: _____________________] [Filter: All ▼] [+ Add New] │
│                                                              │
│ Status Filter: [All] [✓ Active] [⚠ Incomplete] [○ Unused]   │
│                                                              │
│ ┌──────────────────────────────────────────────────────┐    │
│ │ [Diamond Photo] 1.50ct Round Diamond G VS1           │    │
│ │ 150x150px       $5,000 | SKU: DIA-001               │    │
│ │                 ✓ Diamond (Mined, Round, 1.50ct)    │    │
│ │                 Certificate: GIA #2141234567        │    │
│ │                 [Edit Specs] [View Product] [Remove]│    │
│ └──────────────────────────────────────────────────────┘    │
│                                                              │
│ ┌──────────────────────────────────────────────────────┐    │
│ │ [Setting Photo] Classic Solitaire Setting            │    │
│ │ 150x150px       $1,200 | SKU: SET-001               │    │
│ │                 ⚠ Incomplete (Add metal prices)     │    │
│ │                 [Complete Setup →] [View Product]    │    │
│ └──────────────────────────────────────────────────────┘    │
│                                                              │
│ ┌──────────────────────────────────────────────────────┐    │
│ │ [Chain Photo]   Gold Chain Necklace                  │    │
│ │ 150x150px       $800 | SKU: CHAIN-001               │    │
│ │                 ○ Regular Product (not in builder)  │    │
│ │                 [Add as Diamond] [Add as Setting]    │    │
│ └──────────────────────────────────────────────────────┘    │
│                                                              │
│ Showing 1-3 of 47 products                    [1] 2 3 ... 16│
│                                                              │
│ Advanced Tools: [CSV Import] [Bulk Edit] [Export Data]      │
└──────────────────────────────────────────────────────────────┘
```

### "Add as Diamond" Modal

```
┌──────────────────────────────────────────────────────────────┐
│ Add Diamond Specifications                            [X]    │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ Product Preview:                                            │
│ ┌────────────────────────────────────────┐                  │
│ │ [Diamond Photo] 1.50ct Round Diamond   │                  │
│ │ 120x120px       $5,000 | DIA-001      │                  │
│ │                 From: Shopify          │                  │
│ └────────────────────────────────────────┘                  │
│                                                              │
│ ───────────────────────────────────────────────────────── │
│                                                              │
│ Diamond Specifications:                                     │
│                                                              │
│ Shape: * (Select one)                                       │
│ ┌──────────────────────────────────────────────────────┐   │
│ │ [●Round] [◆Princess] [○Oval] [◇Pear] [⬭Marquise]   │   │
│ │ [♥Heart] [▭Emerald] [◻Cushion] [▦Asscher] [◊Radiant]│   │
│ └──────────────────────────────────────────────────────┘   │
│                                                              │
│ Carat Weight: *     Diamond Type: *                         │
│ [1.50_____] ct      [●Mined] [○Lab Grown] [○Fancy Color]   │
│                                                              │
│ Cut Grade: *        Color Grade: *                          │
│ [Excellent ▼]       [G ▼]                                   │
│   ├─ Excellent        ├─ D (Colorless)                      │
│   ├─ Very Good        ├─ E                                  │
│   ├─ Good             ├─ F                                  │
│   ├─ Fair             ├─ G (Near Colorless)                 │
│   └─ Poor             ├─ H...M                              │
│                                                              │
│ Clarity: *          Certificate:                            │
│ [VS1 ▼]             [GIA ▼]                                │
│   ├─ FL                ├─ GIA (Gemological Institute)       │
│   ├─ IF                ├─ AGS                               │
│   ├─ VVS1/VVS2         ├─ IGI                               │
│   ├─ VS1/VS2           └─ None                              │
│   └─ SI1/SI2/I1/I2                                          │
│                                                              │
│ Certificate Number:  Certificate URL: (optional)            │
│ [2141234567____]     [Upload PDF ▼] or [Paste URL______]   │
│                                                              │
│ Advanced Specs: (Optional - click to expand)                │
│ ▼ [Measurements, Table %, Depth %, Polish, Symmetry...]    │
│                                                              │
│ * = Required fields                                         │
│                                                              │
│ ───────────────────────────────────────────────────────── │
│                                                              │
│ What happens when you click Save:                          │
│ ✓ Specs written to Shopify metafields (permanent)          │
│ ✓ Cached in app database (fast searching)                  │
│ ✓ Product appears in ring builder immediately              │
│                                                              │
│ [Cancel]                              [Save Diamond Specs] ✓│
└──────────────────────────────────────────────────────────────┘
```

### Customer Inquiry Dashboard (Admin)

```
┌──────────────────────────────────────────────────────────────┐
│ Ring Builder Admin - Customer Inquiries                      │
├──────────────────────────────────────────────────────────────┤
│ [Dashboard] [Products] [Inquiries] [Settings]                │
│                                                              │
│ Inquiries (12 new, 45 total)                                │
│ [Filter: All ▼] [Sort: Newest ▼]                           │
│                                                              │
│ ┌──────────────────────────────────────────────────────┐    │
│ │ 💌 Drop A Hint | New | Oct 13, 2:30 PM              │    │
│ │ From: Anonymous                                      │    │
│ │ Ring: 1.50ct Round + Solitaire ($7,035)            │    │
│ │ Recipient: recipient@example.com                    │    │
│ │ [View Details] [Mark Read]                          │    │
│ └──────────────────────────────────────────────────────┘    │
│                                                              │
│ ┌──────────────────────────────────────────────────────┐    │
│ │ 📧 Request Info | New | Oct 13, 1:15 PM             │    │
│ │ From: John Smith (john@example.com)                │    │
│ │ Question: "Is this diamond GIA certified?"          │    │
│ │ Ring: 2.00ct Princess + Halo ($15,000)             │    │
│ │ [Reply to Customer] [View Details] [Mark Contacted] │    │
│ └──────────────────────────────────────────────────────┘    │
│                                                              │
│ ┌──────────────────────────────────────────────────────┐    │
│ │ 📅 Schedule Viewing | Contacted | Oct 12, 4:00 PM   │    │
│ │ From: Sarah Johnson (555-1234)                      │    │
│ │ Preferred: Oct 20, 2025 at 3:00 PM                 │    │
│ │ Ring: 1.75ct Oval + Vintage ($12,500)              │    │
│ │ [Mark Completed] [View Details]                     │    │
│ └──────────────────────────────────────────────────────┘    │
│                                                              │
│ Showing 1-3 of 12 new inquiries               [1] 2 3 ... 5 │
└──────────────────────────────────────────────────────────────┘
```

---

## Appendix G: Performance Optimization Strategy

### Caching Strategy

```javascript
// 1. Browser-level caching
localStorage:
  ├─ Filter options (shapes, colors, etc.) - 24 hours
  ├─ User preferences (view mode, records per page) - permanent
  └─ Comparison selections - session only

sessionStorage:
  ├─ Current configuration state
  ├─ Selected diamonds for comparison
  └─ Form progress (inquiry forms)

// 2. App-level caching
Database cache:
  ├─ Product metadata (synced via webhooks)
  ├─ Filter aggregations (updated on product changes)
  └─ Popular searches (analytics)

// 3. CDN caching
Shopify CDN:
  ├─ Product images (automatic)
  ├─ Icon SVG files
  └─ Static assets
```

### Query Optimization

```prisma
// Ensure proper indexes
model StoneMetadata {
  @@index([shop, diamondType])        // For tab filtering
  @@index([shop, shape, carat])       // For common filters
  @@index([shop, available, price])   // For sorting
  @@index([productId])                // For lookups
}

model SettingMetadata {
  @@index([shop, style])              // For style filtering
  @@index([shop, featured])           // For featured products
}
```

### Bundle Size Targets

```
Initial page load:
├─ HTML/CSS/JS: < 200KB (gzipped)
├─ Images (lazy loaded): < 500KB
└─ Total First Contentful Paint: < 1.5s

Dynamic chunks:
├─ Comparison modal: < 50KB
├─ Share modal: < 30KB
├─ Virtual Try-On: < 100KB
└─ Product detail page: < 150KB
```

---

**END OF ENHANCED PRD**

**Total Pages:** ~50 pages  
**Functional Requirements:** 11 major sections  
**Appendices:** 7 sections (A-G)  
**Status:** ✅ Complete and Ready for Task Breakdown
