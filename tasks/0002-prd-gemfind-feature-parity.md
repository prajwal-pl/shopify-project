# Product Requirements Document (PRD)

# Ring Builder Phase 2.0 - GemFind Feature Parity

**Document Version:** 2.0  
**Date:** October 13, 2025  
**Status:** Ready for Development  
**Product Owner:** Gold Jewelers Team  
**Target Completion:** 8 weeks from start date  
**Previous Phase:** Phase 1.0 MVP (100% Complete)

---

## 1. Introduction/Overview

### Current State

The Ring Builder MVP (Phase 1.0) is 100% complete and production-ready with:

- ✅ Complete 4-step builder flow (Setting → Stone → Customize → Review)
- ✅ Full admin interface with product management
- ✅ CSV import/export functionality
- ✅ Real-time pricing engine
- ✅ Mobile responsive design
- ✅ Webhook synchronization
- ✅ Shopify cart integration

**Lines of Code:** 14,413 | **Components:** 29 | **API Endpoints:** 13 | **Status:** ✅ LAUNCH READY

### Problem Statement

While the MVP provides core ring building functionality, it lacks the advanced user experience features that industry leaders like GemFind offer. Current gaps include:

1. **Limited Visual Engagement**
   - Basic text filters vs. icon-based visual filters
   - No virtual try-on capabilities
   - Simple product views without interactive elements

2. **Missing Customer Engagement Features**
   - No "Save & Share" functionality
   - No social sharing (Save, Facebook, Twitter)
   - No inquiry tools (Drop A Hint, Email Friend, Schedule Viewing)
   - No product comparison capability

3. **Limited Browse Experience**
   - No Mined vs Lab Grown vs Fancy Color diamond categorization
   - No view mode toggle (Grid/List)
   - Fixed pagination (50 items) vs customizable (12, 20, 50, 100)
   - No SKU/Stock# search

4. **Basic Product Details**
   - Simple detail modals vs rich product pages
   - No integrated GIA certificate viewer
   - Limited product specifications display

### Solution

Enhance the existing MVP to match or exceed GemFind's feature set while maintaining the clean architecture and performance standards established in Phase 1.0.

### Goal

Create a **best-in-class** ring builder experience that rivals or exceeds GemFind by adding:

- Visual, icon-based filtering
- Virtual try-on integration
- Customer engagement tools
- Advanced browsing capabilities
- Rich product detail pages
- Social and inquiry features

### Reference

**GemFind Ring Builder:** [Middleton Jewelers Implementation](https://middletonjewelers.app/)

Screenshots analyzed:

- Settings page with style icons
- Diamond listing with tabs (Mined/Lab Grown/Fancy Color)
- Advanced filtering with sliders and icons
- Product detail page with action buttons
- Virtual Try-On integration
- Social sharing buttons

---

## 2. Goals

### Primary Goals

1. **Visual Excellence**: Transform text-based filters into icon-driven, visually engaging interfaces
2. **Customer Engagement**: Add Save, Share, and inquiry tools (Drop A Hint, Email, Schedule)
3. **Diamond Categorization**: Implement Mined vs Lab Grown vs Fancy Color tabs
4. **Product Comparison**: Enable side-by-side diamond comparison (up to 4 items)
5. **Virtual Try-On**: Integrate third-party virtual try-on solution
6. **Advanced Browsing**: Add view toggles, customizable pagination, SKU search
7. **Rich Product Pages**: Enhance detail pages with comprehensive specifications and actions

### Secondary Goals

1. **Maintain Performance**: No degradation from Phase 1.0 benchmarks
2. **Preserve Architecture**: Build on existing clean code foundation
3. **Mobile Excellence**: Ensure all new features work beautifully on mobile
4. **Backward Compatibility**: Existing merchants continue working without changes

### Success Metrics

**User Engagement** (New):

- "Save for Later" usage: Track % of users saving configurations
- Share feature usage: Track shares via email and social
- Virtual Try-On engagement: Track % of users trying virtual try-on
- Comparison tool usage: Track % using comparison feature

**Conversion Improvements** (Enhanced):

- Configuration completion rate increase: Target +10% (from 30% to 40%+)
- Time to decision decrease: Target -15% (from 10 min to <8.5 min)
- Customer inquiries increase: Track hint drops, emails, viewing requests

**Feature Adoption**:

- 40%+ users interact with new visual filters
- 20%+ users save or share configurations
- 15%+ users use comparison feature
- 10%+ users try virtual try-on

---

## 3. User Stories

### Merchant (Store Owner) Stories

**US-M9**: As a merchant, I want to offer virtual try-on so customers can visualize rings on their hand.

**US-M10**: As a merchant, I want to categorize diamonds as Mined, Lab Grown, or Fancy Color so customers can browse by preference.

**US-M11**: As a merchant, I want customers to share configurations via email/social media so I get more referrals.

**US-M12**: As a merchant, I want to receive inquiry notifications (hints, viewing requests) so I can follow up with interested customers.

**US-M13**: As a merchant, I want to customize which action buttons appear (Drop A Hint, Request Info, etc.) so I can match my business processes.

**US-M14**: As a merchant, I want to upload custom filter icons so my builder matches my brand aesthetics.

### Customer Stories

**US-C9**: As a customer, I want to see visual icons for ring styles (not just text) so I can quickly identify designs I like.

**US-C10**: As a customer, I want to filter diamonds by Mined vs Lab Grown so I can match my values/budget.

**US-C11**: As a customer, I want to compare multiple diamonds side-by-side so I can make an informed decision.

**US-C12**: As a customer, I want to virtually try on a ring so I can see how it looks on my hand before buying.

**US-C13**: As a customer, I want to save my configuration and return later so I don't have to start over.

**US-C14**: As a customer, I want to share my ring with friends/family via email or social media so I can get their opinion.

**US-C15**: As a customer, I want to drop a hint to someone so they know what ring I want (engagement/gift scenario).

**US-C16**: As a customer, I want to request more information about a diamond so a jeweler can answer my questions.

**US-C17**: As a customer, I want to schedule an in-store viewing so I can see the ring in person.

**US-C18**: As a customer, I want to search for a specific diamond by its stock number so I can quickly find it.

**US-C19**: As a customer, I want to view diamonds in grid or list format so I can browse in my preferred way.

**US-C20**: As a customer, I want to control how many items show per page so I can browse efficiently.

**US-C21**: As a customer, I want to view detailed GIA certificates directly in the builder so I trust the diamond quality.

---

## 4. Functional Requirements

### FR-13: Visual Icon-Based Filters

**FR-13.1**: The system MUST replace text-only filters with icon-based visual filters for:

- **Setting Styles**: 9 icons (Halo, Solitaire, Three Stone, Single Row, Trellis, MultiRow, Vintage, Pave, Bypass)
- **Stone Shapes**: 10 icons (Round, Radiant, Princess, Pear, Oval, Marquise, Heart, Emerald, Cushion, Asscher)
- **Metal Types**: 7 options (14K White Gold, 14K Yellow Gold, 14K Rose Gold, 18K White Gold, 18K Yellow Gold, 18K Rose Gold, Platinum)

**FR-13.2**: Each icon filter MUST:

- Display as a clickable image/icon (not just text)
- Show label below icon
- Highlight when selected (border, shadow, or color change)
- Support multi-select
- Work on mobile (touch-friendly, min 44px)

**FR-13.3**: The system MUST provide default icon sets for all filter types.

**FR-13.4**: Merchants MUST be able to upload custom icons via admin interface (optional).

**FR-13.5**: Icons MUST be served optimized (WebP format, < 10KB each).

---

### FR-14: Diamond Type Categorization (Mined / Lab Grown / Fancy Color)

**FR-14.1**: The system MUST add a diamond type classification to StoneMetadata model:

- **Mined** (natural diamonds)
- **Lab Grown** (lab-created diamonds)
- **Fancy Color** (colored diamonds - pink, yellow, blue, etc.)

**FR-14.2**: The Stone Selector (Step 2) MUST display **3 tabs**:

- Tab 1: **Mined** (default active)
- Tab 2: **Lab Grown**
- Tab 3: **Fancy Color**

**FR-14.3**: The system MUST filter stones based on active tab automatically.

**FR-14.4**: The system MUST display a count badge on each tab (e.g., "Mined (6,869)", "Lab Grown (2,450)").

**FR-14.5**: Tab styling MUST match GemFind reference:

- Burgundy/wine color (#6D2932 or similar) for active tab
- White/light background for inactive tabs
- Smooth transition on tab change

**FR-14.6**: The admin product metadata form MUST include a "Diamond Type" dropdown:

- Options: Mined, Lab Grown, Fancy Color
- Required field for stones
- Default: Mined

**FR-14.7**: CSV import MUST support diamond_type column (mined, lab_grown, fancy_color).

---

### FR-15: Diamond Comparison Tool

**FR-15.1**: The system MUST add a "Compare" checkbox to each stone in the table/card view.

**FR-15.2**: The system MUST display a floating "Compare Items" button when 2+ stones are selected.

**FR-15.3**: The "Compare Items" button MUST show count (e.g., "Compare Items (3)").

**FR-15.4**: The system MUST allow comparison of **2-4 diamonds** simultaneously.

**FR-15.5**: Clicking "Compare Items" MUST open a comparison modal/page showing:

- **Side-by-side comparison table**
- **Columns**: Each selected diamond
- **Rows**:
  - Image
  - Shape
  - Carat
  - Cut
  - Color
  - Clarity
  - Price
  - Certificate Type & Number
  - Measurements
  - Table %
  - Depth %
  - Polish
  - Symmetry
  - Fluorescence
  - "View Details" button
  - "Select This Diamond" button

**FR-15.6**: The comparison view MUST:

- Highlight differences (e.g., different values in yellow/light color)
- Show "best value" indicator for lowest price per carat
- Allow removing individual diamonds from comparison
- Persist comparison across page refreshes (session storage)

**FR-15.7**: Clicking "Select This Diamond" MUST close comparison and select that stone in the builder.

---

### FR-16: Save & Share Configuration

**FR-16.1**: The system MUST add a "Save Search" button (persistent, visible throughout builder).

**FR-16.2**: Clicking "Save Search" MUST:

- Create a unique shareable URL (e.g., `/builder/saved/ABC123`)
- Save configuration to database with status `saved`
- Generate a short URL slug (8-12 characters, alphanumeric)
- Show success message with copy-to-clipboard button

**FR-16.3**: The system MUST add a "Share" button on Step 4 (Review page).

**FR-16.4**: Clicking "Share" MUST open a modal with options:

- **Email**: Send configuration via email
- **Copy Link**: Copy shareable URL to clipboard
- **Facebook**: Share on Facebook (uses Facebook Share Dialog)
- **Twitter/X**: Share on Twitter (opens Twitter post dialog)
- **Pinterest**: Share on Pinterest (optional)

**FR-16.5**: The "Email" share option MUST:

- Display email form with fields:
  - Recipient Email (required)
  - Your Name (optional)
  - Message (optional, 500 char max)
- Send email with:
  - Configuration images (setting + stone)
  - Price breakdown
  - Link to view full configuration
  - Merchant branding/logo

**FR-16.6**: Saved configurations MUST be retrievable via unique URL:

- Loads saved configuration into builder
- All selections pre-filled (setting, stone, customization)
- Price recalculated (in case prices changed)
- Customer can modify and checkout or save again

**FR-16.7**: The system MUST provide admin interface to:

- View all saved configurations
- Filter by date, status (saved, shared, abandoned)
- Track which configurations were shared and via what channel

---

### FR-17: Customer Inquiry & Action Buttons

**FR-17.1**: The system MUST add **4 action buttons** to product detail modals and Step 4 (Review):

- **Drop A Hint** (gift/engagement hint)
- **Request More Info** (ask jeweler)
- **E-Mail A Friend** (share with someone)
- **Schedule Viewing** (book in-store appointment)

**FR-17.2**: Each action button MUST:

- Display with icon + label
- Be styled consistently (burgundy/wine theme)
- Work on mobile (full-width stacked buttons)

**FR-17.3**: The **Drop A Hint** feature MUST:

- Open modal with form:
  - Recipient Email (required)
  - Your Name (optional)
  - Special Date (optional, e.g., anniversary, birthday)
  - Message (optional)
- Send email to recipient with:
  - Ring images
  - "Someone has dropped you a hint about this ring!"
  - Link to view ring
  - No pricing information (hint, not proposal)
- Notify merchant (optional, configurable)

**FR-17.4**: The **Request More Info** feature MUST:

- Open modal with form:
  - Your Name (required)
  - Your Email (required)
  - Phone Number (optional)
  - Question/Message (required, 1000 char max)
- Send email to merchant with:
  - Customer contact info
  - Configuration details (setting, stone, SKU)
  - Customer question
  - Link to configuration

**FR-17.5**: The **E-Mail A Friend** feature MUST:

- Reuse FR-16.5 email share functionality
- Pre-populate subject line: "Check out this ring!"

**FR-17.6**: The **Schedule Viewing** feature MUST:

- Open modal with form:
  - Your Name (required)
  - Your Email (required)
  - Phone Number (required)
  - Preferred Date (date picker, required)
  - Preferred Time (time picker, optional)
  - Message (optional, 500 char)
- Send email to merchant with:
  - Customer contact info
  - Viewing request details
  - Configuration details
  - Link to add to merchant's calendar (iCal format)

**FR-17.7**: Merchants MUST be able to configure:

- Which action buttons are visible (enable/disable each)
- Notification email address for inquiries
- Custom response message templates

---

### FR-18: Virtual Try-On Integration

**FR-18.1**: The system MUST add a "Virtual Try On" button to:

- Product detail modals (for settings)
- Step 4 (Review page) for complete ring

**FR-18.2**: The system MUST support **one of the following integration options** (merchant chooses):

**Option A: Third-Party API Integration**

- Integrate with Dor Technologies, GemFind VTO, or similar
- Pass product image URL and SKU to VTO service
- Display VTO experience in modal/iframe
- No customer data storage required

**Option B: Simple Image Upload**

- Customer uploads photo of their hand
- System displays ring image overlaid on hand photo (CSS positioning)
- Download composed image
- Basic "DIY" try-on experience

**Option C: AR Quick Look (iOS only)**

- Generate USDZ 3D model (if available)
- Use Apple AR Quick Look
- Display ring in real-world via iPhone camera
- Advanced but requires 3D models

**FR-18.3**: Merchant MUST be able to configure:

- Enable/disable Virtual Try-On
- Choose integration option (A, B, or C)
- API credentials (for Option A)
- Custom CTA button text

**FR-18.4**: The system MUST track VTO usage:

- How many customers clicked "Virtual Try On"
- How many completed VTO experience
- Correlation with conversion (optional analytics)

**FR-18.5**: If VTO is disabled, button MUST not appear.

---

### FR-19: Advanced Browsing Features

**FR-19.1**: The system MUST add a **View Mode Toggle** for stones:

- **Grid View**: Cards with images (2-4 columns depending on screen size)
- **List View**: Table format (existing StoneTable component)
- Toggle button with icons (grid icon / list icon)
- Persist user preference in localStorage

**FR-19.2**: Grid View MUST display:

- Stone image (if available, else placeholder)
- Shape badge
- Carat weight
- "Cut, Color, Clarity" (e.g., "Excellent G VS2")
- Price
- Certificate badge (e.g., "GIA")
- "View Details" button
- Checkbox for comparison

**FR-19.3**: The system MUST add a **Records Per Page** selector:

- Dropdown options: 12, 20, 50, 100
- Default: 20
- Applies to both Grid and List views
- Persist user preference in localStorage

**FR-19.4**: The system MUST add a **Search by Stock# / SKU** field:

- Text input: "Search Diamond Stock #" (placeholder)
- Search icon button
- Searches StoneMetadata.productId (SKU from Shopify)
- Displays matching stones or "No results found"
- Clears other filters when searching by SKU

**FR-19.5**: The system MUST display a **Results Summary**:

- "6,869 Similar Diamonds | Compare Items (1)" (format)
- Updates dynamically as filters change

---

### FR-20: Enhanced Product Detail Pages

**FR-20.1**: The system MUST convert product detail modals into **full detail pages** (accessible via dedicated routes):

- Route: `/builder/setting/:id`
- Route: `/builder/diamond/:id`

**FR-20.2**: Setting detail page MUST display:

- **Left Side**: Image gallery (main image + thumbnails, 360° if available)
- **Right Side**:
  - Setting name and SKU
  - Description
  - Ring Specification panel:
    - Metal Type (dropdown selector)
    - Center Stone Size (dropdown: 0.50ct, 0.75ct, 1.00ct, etc.)
    - Ring Size (dropdown: 3-12)
  - Price (updates based on selections)
  - Action buttons:
    - "Add Your Diamond" (proceeds to Step 2)
    - "Virtual Try On"
    - "Request More Info"
    - "E-Mail A Friend"
  - Social sharing buttons (Save, Facebook, Twitter)
  - "NOTE: All metal color images may not be available" (disclaimer)

**FR-20.3**: Diamond detail page MUST display:

- **Left Side**:
  - Diamond image (high-res, zoom enabled)
  - Certificate badge (e.g., "GIA Certified")
  - "Diamond Grading Report" with "View" link (opens certificate PDF)
  - "Internal use Only: Click Here" (merchant-only link, optional)
- **Right Side**:
  - Diamond title (e.g., "0.66 Carat Round Diamond")
  - "This Excellent cut, J color, VS2 clarity diamond comes accompanied by a diamond grading report from GIA"
  - Specifications table:
    - Report: GIA
    - Color: J
    - Cut: Excellent
    - Clarity: VS2
    - Certificate Number (with link)
    - Measurements
    - Table %
    - Depth %
    - Etc.
  - Price
  - Action buttons:
    - "Add To Cart" (if buying diamond only)
    - "Complete Your Ring" (if coming from builder)
    - "Drop A Hint"
    - "Request More Info"
    - "E-Mail A Friend"
    - "Print Details"
    - "Schedule Viewing"
  - Social sharing (Save, Tweet, Facebook Share, Like)

**FR-20.4**: The system MUST support **GIA Certificate Viewer Integration**:

- If certificate URL is provided, display "View" link
- Opens certificate PDF in modal/new tab
- If no certificate URL, display certificate number only

**FR-20.5**: Product detail pages MUST:

- Be shareable (unique URL)
- Work when accessed directly (not just from builder)
- Maintain builder state (if accessed from builder)
- Be mobile responsive

---

### FR-21: Social Sharing Integration

**FR-21.1**: The system MUST implement social sharing buttons:

- **Save**: Save configuration to customer account (localStorage + DB)
- **Facebook Share**: Uses Facebook Share Dialog API
- **Twitter/X Post**: Opens Twitter compose with pre-filled text
- **Pinterest**: Pins configuration image (optional)

**FR-21.2**: Shared content MUST include:

- Open Graph meta tags for rich previews
- Configuration image (composite or setting image)
- Title: "[Setting Name] with [Carat] [Shape] Diamond"
- Description: Price and key specs
- Canonical URL to saved configuration

**FR-21.3**: The system MUST track social shares:

- Count shares by platform (Facebook, Twitter, Pinterest)
- Store in AnalyticsEvent model (optional)
- Display in admin analytics (future feature)

---

### FR-22: Admin Configuration for New Features

**FR-22.1**: The Admin Settings page MUST add a new **"Customer Engagement"** tab with:

**Action Buttons Settings:**

- Enable/Disable each button:
  - [x] Drop A Hint
  - [x] Request More Info
  - [x] E-Mail A Friend
  - [x] Schedule Viewing
- Notification Email (where inquiries are sent)
- Custom button labels (optional)

**Virtual Try-On Settings:**

- Enable/Disable Virtual Try-On
- Integration Type: (None / Third-Party API / Simple Upload / AR Quick Look)
- API Credentials (if third-party)
- Custom button label

**Save & Share Settings:**

- Enable/Disable Save functionality
- Enable/Disable Social sharing
- Shareable URL format: (domain.com/builder/saved/ vs custom)

**FR-22.2**: The Admin Settings page MUST add **"Appearance"** tab enhancements:

- Upload custom filter icons (for styles, shapes)
- Primary color customization (buttons, highlights)
- Secondary color customization (accents)
- Logo upload (for emails, branding)

**FR-22.3**: The Admin Product Management MUST add:

- "Diamond Type" field to stone metadata form (Mined / Lab Grown / Fancy Color)
- Certificate URL field (for GIA/AGS certificate PDF)
- "Featured" checkbox (to highlight certain products)

---

### FR-23: Performance & Optimization

**FR-23.1**: The system MUST maintain Phase 1.0 performance benchmarks:

- Page load: < 3 seconds
- API response: < 500ms
- Build time: < 2s

**FR-23.2**: New features MUST be optimized:

- Icon images: WebP format, < 10KB each
- Lazy load comparison modal (don't load until opened)
- Debounce search inputs (300ms)
- Virtualize long lists (if > 100 items in grid view)

**FR-23.3**: The system MUST implement caching:

- Cache filter options (shapes, colors, etc.) in localStorage
- Cache product images in browser
- Use React.memo for expensive components

---

## 5. Non-Goals (Out of Scope for Phase 2.0)

**NG-14**: ❌ Customer Accounts / Login System

- No user registration or login
- Save functionality uses anonymous sessions + shareable URLs
- Out of scope to avoid complexity

**NG-15**: ❌ Advanced Analytics Dashboard

- Basic tracking only (save/share/inquiry counts)
- No funnel visualization, heat maps, etc.
- Defer to Phase 3.0

**NG-16**: ❌ In-App Appointment Scheduling

- "Schedule Viewing" sends email to merchant
- No calendar integration, availability checking, or booking confirmation
- Merchant handles scheduling manually

**NG-17**: ❌ Live Chat Integration

- No live chat, chatbot, or real-time support
- Defer to future phases

**NG-18**: ❌ 3D Rendering / Advanced AR

- Simple virtual try-on only (image overlay or third-party API)
- No custom 3D model rendering
- No advanced AR features

**NG-19**: ❌ Financing / Payment Plans

- No Affirm, Klarna, or installment payment options
- Defer to Shopify checkout extensions

**NG-20**: ❌ Multi-Language / Multi-Currency

- English and store's default currency only
- Defer to Phase 3.0+

**NG-21**: ❌ AI-Powered Recommendations

- No "You may also like" or AI suggestions
- Basic filtering only

**NG-22**: ❌ Order Tracking / Fulfillment

- Handled entirely by Shopify
- No in-app order status updates

---

## 6. Design Considerations

### UI/UX Guidelines

**Design Evolution from Phase 1.0:**

- Maintain clean, professional aesthetic
- Add more visual elements (icons, tabs, badges)
- Introduce burgundy/wine accent color (#6D2932) to match GemFind
- Increase white space for premium feel

**GemFind Design Patterns to Adopt:**

1. **Tabs with badges**: Mined (6,869), Lab Grown (2,450), Fancy Color (42)
2. **Icon-first filters**: Visual before text
3. **Floating action buttons**: Compare Items, Save Search
4. **Rich product cards**: More information density
5. **Modal over page**: Detail views as modals (mobile) or pages (desktop)

### Component Design

**New Components Needed:**

```
IconFilter (new)
├── Icon (image)
├── Label (text)
└── SelectionState (border/highlight)

DiamondTypeTabs (new)
├── Tab: Mined
├── Tab: Lab Grown
├── Tab: Fancy Color
└── Count badges

ComparisonModal (new)
├── ComparisonTable
├── DiamondColumn (x4)
└── HighlightDifferences

ShareModal (new)
├── EmailForm
├── SocialButtons (FB, Twitter, Pinterest)
└── CopyLinkButton

ActionButtonGroup (new)
├── DropAHintButton
├── RequestInfoButton
├── EmailFriendButton
├── ScheduleViewingButton
└── VirtualTryOnButton (conditional)

ProductDetailPage (new route)
├── ImageGallery (left)
└── ProductInfo (right)
    ├── SpecificationPanel
    ├── ActionButtons
    └── SocialSharing

InquiryModal (shared)
├── FormFields (dynamic based on action type)
└── SubmitButton
```

### Color Scheme Updates

**Phase 1.0 Colors:**

- Primary: #000000 (Black)
- Accent: #D4AF37 (Gold)

**Phase 2.0 Enhancements:**

- Primary: #000000 (Black) - maintain
- Accent: #D4AF37 (Gold) - maintain
- **NEW Accent 2**: #6D2932 (Burgundy/Wine) - tabs, buttons
- **NEW Accent 3**: #8B4789 (Purple) - highlights, hover states
- Background: #FFFFFF (White)
- Secondary BG: #F7F7F7 (Light Gray) - cards, panels

---

## 7. Technical Considerations

### Technology Stack (No Changes)

**Frontend, Backend, Database:** Same as Phase 1.0

**New Dependencies:**

- `react-icons` or custom SVG icon library
- `react-image-gallery` (for product image galleries)
- Facebook SDK (for Share Dialog)
- Email service (SendGrid, AWS SES, or Postmark)

### Database Schema Changes

**New Fields in Existing Models:**

```prisma
model StoneMetadata {
  // NEW FIELDS
  diamondType       String   // "mined", "lab_grown", "fancy_color"
  certificateUrl    String?  // URL to PDF certificate
  featured          Boolean  @default(false) // Already exists

  // Existing fields...
}

model Configuration {
  // NEW FIELDS
  shareToken        String?  @unique // For shareable URLs
  shareCount        Int      @default(0) // Track shares
  savedAt           DateTime? // When saved (vs completed)

  // Existing fields...
}

model AppSettings {
  // NEW FIELDS (stored as JSON)
  customerEngagement String? // JSON: { dropAHint: true, requestInfo: true, ... }
  virtualTryOn       String? // JSON: { enabled: true, provider: "dor", apiKey: "..." }
  socialSharing      String? // JSON: { facebook: true, twitter: true, ... }
  customIcons        String? // JSON: { styles: {...}, shapes: {...} }

  // Existing fields...
}
```

**New Models:**

```prisma
model SavedConfiguration {
  id               String   @id @default(cuid())
  configurationId  String   @unique // References Configuration
  shareToken       String   @unique // Short slug for URL
  views            Int      @default(0)
  createdAt        DateTime @default(now())
  expiresAt        DateTime? // Optional expiration (90 days default)

  @@index([shareToken])
}

model CustomerInquiry {
  id               String   @id @default(cuid())
  shop             String   // Multi-tenant
  type             String   // "hint", "info", "viewing", "email"
  configurationId  String?  // Optional reference
  productId        String?  // Setting or Stone ID

  // Customer info
  customerName     String?
  customerEmail    String
  customerPhone    String?

  // Inquiry details
  message          String?
  preferredDate    DateTime?
  preferredTime    String?

  // Tracking
  status           String   @default("new") // "new", "contacted", "closed"
  createdAt        DateTime @default(now())

  @@index([shop, type])
  @@index([shop, status])
  @@index([createdAt])
}
```

### API Architecture

**New Public API Endpoints:**

```
POST /api/builder/save           - Save configuration and generate share URL
GET  /api/builder/saved/:token   - Load saved configuration
POST /api/builder/share          - Share configuration (email, social)
POST /api/builder/inquiry        - Submit customer inquiry
GET  /api/builder/product/:id    - Get detailed product info
POST /api/builder/compare        - Get comparison data for multiple diamonds
POST /api/builder/virtual-try-on - Proxy to VTO service (if applicable)
```

**New Admin API Endpoints:**

```
GET  /api/admin/inquiries        - List customer inquiries
PUT  /api/admin/inquiries/:id    - Update inquiry status
GET  /api/admin/saved-configs    - List saved configurations
POST /api/admin/icons/upload     - Upload custom filter icons
```

### Email Templates Required

1. **Share Configuration Email**
   - Subject: "[Name] wants to share a ring with you!"
   - Content: Images, price, specs, CTA link

2. **Drop A Hint Email**
   - Subject: "Someone has dropped you a hint!"
   - Content: Ring images, romantic messaging, NO PRICE, link

3. **Request More Info Email** (to merchant)
   - Subject: "Customer inquiry about [Product]"
   - Content: Customer contact info, question, configuration details

4. **Schedule Viewing Email** (to merchant)
   - Subject: "Viewing request from [Customer Name]"
   - Content: Contact info, preferred date/time, configuration, iCal attachment

### Third-Party Integrations

**Option 1: Virtual Try-On API** (if chosen)

- Dor Technologies API
- GemFind Virtual Try-On
- Jewelry AR (custom solution)
- Requirements: API key, product image URLs, callback handling

**Option 2: Social Sharing**

- Facebook Share Dialog (requires App ID)
- Twitter Web Intent (no API key needed)
- Pinterest Pin It button (no API key needed)

**Option 3: Email Service**

- SendGrid (free tier: 100 emails/day)
- AWS SES (pay-as-you-go)
- Postmark (free tier: 100 emails/month)
- Requirement: SMTP credentials, email templates

---

## 8. Success Metrics

### Feature Adoption Metrics

**Save & Share:**

- Target: 20%+ of users save configuration
- Target: 10%+ share via email or social
- Track: Save rate, share by platform

**Comparison Tool:**

- Target: 15%+ use comparison feature
- Target: Average 2.5 diamonds compared per session
- Track: Comparison opens, items compared

**Virtual Try-On:**

- Target: 10%+ engage with VTO
- Target: 5%+ complete VTO experience
- Track: VTO button clicks, completions

**Customer Inquiries:**

- Target: 5%+ submit an inquiry (hint, info, viewing)
- Track: Inquiry type breakdown, response rate (if implemented)

**Visual Filters:**

- Target: 40%+ interact with icon filters
- Track: Filter usage by type (style, shape)

### Conversion Improvements

**Baseline (Phase 1.0):**

- Configuration completion rate: 30%
- Time to complete: 10 minutes
- Cart addition rate: 25%

**Phase 2.0 Targets:**

- Configuration completion rate: 40% (+10 percentage points)
- Time to complete: 8.5 minutes (-15%)
- Cart addition rate: 30% (+5 percentage points)
- Inquiry-to-order conversion: 20% (new metric)

### Technical Metrics

**Performance (maintain Phase 1.0 benchmarks):**

- API response time: < 500ms
- Page load time: < 3s
- Build time: < 2s

**Reliability:**

- Uptime: 99.5%+
- Error rate: < 1%
- Email delivery rate: > 95%

---

## 9. Open Questions

**Q1**: Which Virtual Try-On provider should we integrate with?

- **Options**: Dor Technologies (enterprise), DIY image overlay (simple), Apple AR Quick Look (advanced)
- **Decision Needed**: Based on budget, complexity, merchant feedback

**Q2**: Should saved configurations expire after X days?

- **Options**: No expiration, 90 days, 30 days
- **Decision Needed**: Balance database growth vs user experience

**Q3**: How should we handle diamond type for existing stones (migration)?

- **Options**: Default all to "Mined", require merchant to categorize, infer from metadata
- **Decision Needed**: Migration strategy for Phase 1.0 merchants

**Q4**: Should we limit the number of saved configurations per session/user?

- **Options**: Unlimited, 10 per session, 5 per email address
- **Decision Needed**: Prevent spam/abuse while allowing legitimate use

**Q5**: What email templates should be customizable by merchants?

- **Options**: All templates, none (fixed branding), only logo and colors
- **Decision Needed**: Balance flexibility vs complexity

**Q6**: Should comparison work across diamond types (compare mined vs lab grown)?

- **Options**: Yes (any 2-4 diamonds), No (only within same type), Merchant configurable
- **Decision Needed**: User experience consideration

---

## 10. Dependencies & Constraints

### Dependencies

**Technical Dependencies:**

- All Phase 1.0 dependencies (maintained)
- Email service provider (SendGrid, AWS SES, or Postmark)
- Facebook App ID (for Share Dialog)
- Virtual Try-On API credentials (if third-party integration chosen)

**Content Dependencies:**

- Filter icon set (default provided, custom optional)
- Email templates (will be created)
- Sample product data with diamond type classifications

### Constraints

**Platform Constraints:**

- Same Shopify constraints as Phase 1.0
- Email sending limits (100-1000/day depending on provider)
- Facebook API rate limits (for sharing)

**Business Constraints:**

- Must not break existing Phase 1.0 functionality
- Existing merchants must continue working without forced migration
- All new features must be opt-in via admin settings

**Technical Constraints:**

- Maintain clean architecture from Phase 1.0
- No performance degradation
- Mobile-first design continues

**Timeline Constraint:**

- Realistic Phase 2.0 completion: **8 weeks** with 2-3 developers
- Parallel work possible (different developers on different features)

---

## 11. Timeline & Milestones

### Phase 2.0 Development Timeline: 8 Weeks

**Phase 2.1: Visual Enhancements (Weeks 1-2)**

- Icon-based filters (styles, shapes, metals)
- Diamond type tabs (Mined/Lab Grown/Fancy Color)
- View mode toggle (Grid/List)
- Records per page selector
- Search by SKU
- Database migrations for new fields
- **Milestone**: Visual browsing experience matches GemFind

**Phase 2.2: Comparison & Detail Pages (Weeks 3-4)**

- Comparison tool (select, compare modal, highlight differences)
- Enhanced product detail pages (settings & diamonds)
- GIA certificate viewer integration
- Image gallery components
- **Milestone**: Rich product exploration ready

**Phase 2.3: Save & Share (Week 5)**

- Save configuration functionality
- Shareable URL generation
- Share modal (email, social)
- Email integration setup
- Social sharing buttons (FB, Twitter, Pinterest)
- **Milestone**: Configuration sharing working

**Phase 2.4: Customer Engagement (Weeks 6-7)**

- Action buttons (Drop A Hint, Request Info, Email Friend, Schedule Viewing)
- Inquiry forms and modals
- Email templates (all 4 types)
- CustomerInquiry model and admin views
- Notification system to merchants
- **Milestone**: Full customer engagement tools live

**Phase 2.5: Virtual Try-On & Polish (Week 7)**

- Virtual Try-On integration (chosen provider)
- VTO button placement
- API integration and testing
- **Milestone**: VTO functional

**Phase 2.6: Admin Enhancements (Week 8)**

- New admin settings tabs (Customer Engagement, VTO, Appearance)
- Custom icon upload
- Inquiry management interface
- Saved configurations admin view
- **Milestone**: Merchants can configure all new features

**Phase 2.7: Testing & Launch Prep (Week 8)**

- End-to-end testing of all new features
- Performance testing and optimization
- Mobile testing (all new features)
- Documentation updates
- Migration guide for Phase 1.0 merchants
- **Milestone**: Phase 2.0 ready to launch

---

## 12. Acceptance Criteria

### Feature Completeness

**Visual Enhancements:**

- [x] Icon filters for styles, shapes, metals implemented
- [x] Diamond type tabs (3 tabs) with counts working
- [x] Grid/List view toggle functional
- [x] Records per page selector (12, 20, 50, 100)
- [x] SKU search working
- [x] All responsive on mobile

**Comparison Tool:**

- [x] Checkbox selection in table/grid
- [x] Compare button appears when 2+ selected
- [x] Comparison modal shows 2-4 diamonds
- [x] Highlight differences
- [x] "Select This Diamond" works

**Save & Share:**

- [x] Save button generates shareable URL
- [x] Share modal with email + social options
- [x] Email sharing sends email with configuration
- [x] Social sharing opens respective platforms
- [x] Saved configs load via URL

**Customer Engagement:**

- [x] 4 action buttons appear on detail pages & review
- [x] Each button opens correct modal/form
- [x] Forms submit and send emails
- [x] Merchant receives inquiries
- [x] Admin can view inquiries

**Virtual Try-On:**

- [x] VTO button appears (if enabled)
- [x] VTO experience works (chosen integration)
- [x] Tracking implemented

**Admin:**

- [x] New settings tabs added
- [x] Merchants can enable/disable features
- [x] Custom icons uploadable
- [x] Diamond type field in metadata form
- [x] Certificate URL field in metadata form

### Quality Standards

- [x] Zero TypeScript errors
- [x] Zero build errors
- [x] All new features work on mobile
- [x] Performance benchmarks maintained
- [x] Multi-tenant isolation maintained
- [x] Email delivery > 95%

### Launch Criteria

1. ✅ All FR-13 through FR-23 implemented and tested
2. ✅ All acceptance criteria met
3. ✅ Phase 1.0 functionality still works (backward compatibility)
4. ✅ Migration path tested (Phase 1.0 → Phase 2.0)
5. ✅ Email templates tested and delivered successfully
6. ✅ Social sharing tested on all platforms
7. ✅ Mobile experience excellent
8. ✅ Documentation updated
9. ✅ At least 2 beta merchants test successfully
10. ✅ Performance and security audits passed

---

## 13. Risk Assessment

### High Risk Items

**Risk 1: Third-Party Integration Complexity (VTO)**

- **Impact**: High
- **Probability**: Medium
- **Mitigation**: Start with simple DIY option, add API integration later if needed, have fallback plan

**Risk 2: Email Deliverability**

- **Impact**: High (core feature failure)
- **Probability**: Medium (spam filters, config issues)
- **Mitigation**: Use reputable service (SendGrid), proper SPF/DKIM setup, monitor bounce rates, test thoroughly

**Risk 3: Scope Creep into Customer Accounts**

- **Impact**: High (timeline explosion)
- **Probability**: Medium
- **Mitigation**: Strict adherence to NG-14, anonymous save/share only, no login system

### Medium Risk Items

**Risk 4: Social API Changes**

- **Impact**: Medium
- **Probability**: Low
- **Mitigation**: Use stable APIs (Facebook Share Dialog is mature), have fallbacks (copy link always works)

**Risk 5: Icon Design Consistency**

- **Impact**: Medium (UX/branding)
- **Probability**: Low
- **Mitigation**: Provide high-quality default icon set, clear upload guidelines for custom icons

**Risk 6: Comparison Performance**

- **Impact**: Medium
- **Probability**: Low
- **Mitigation**: Limit to 4 diamonds max, lazy load comparison data, optimize queries

---

## 14. Migration Strategy (Phase 1.0 → Phase 2.0)

### For Existing Merchants

**Automatic Migration:**

1. All Phase 1.0 features continue working without changes
2. Database migrations add new fields with defaults:
   - `diamondType`: defaults to "mined"
   - `certificateUrl`: defaults to null
   - New AppSettings fields: defaults to disabled

**Optional Opt-In:** 3. Merchants see "New Features Available" banner in admin 4. Admin settings show new tabs (disabled by default) 5. Merchants enable features one-by-one as desired

**Data Migration:** 6. Existing StoneMetadata records get `diamondType = "mined"` by default 7. Merchants can bulk update via CSV re-import or manual editing 8. No data loss, all existing configurations preserved

**Rollout Plan:**

- Week 1: Deploy to staging, internal testing
- Week 2: Beta merchants (2-3 stores) test with new features enabled
- Week 3: General availability, all merchants can opt-in
- Week 4+: Ongoing support and iteration

---

## 15. Approval

**Product Owner**: **\*\***\_\_\_**\*\*** Date: **\*\***\_\_\_**\*\***

**Tech Lead**: **\*\***\_\_\_**\*\*** Date: **\*\***\_\_\_**\*\***

**Stakeholders**: **\*\***\_\_\_**\*\*** Date: **\*\***\_\_\_**\*\***

---

## Appendix A: GemFind Feature Comparison Matrix

| Feature                          | GemFind | Phase 1.0 MVP  | Phase 2.0 Target   |
| -------------------------------- | ------- | -------------- | ------------------ |
| 4-step builder flow              | ✅      | ✅             | ✅                 |
| Icon-based filters (visual)      | ✅      | ❌             | ✅                 |
| Mined/Lab Grown/Fancy Color tabs | ✅      | ❌             | ✅                 |
| Comparison tool                  | ✅      | ❌             | ✅                 |
| Save & Share                     | ✅      | ❌             | ✅                 |
| Drop A Hint                      | ✅      | ❌             | ✅                 |
| Request More Info                | ✅      | ❌             | ✅                 |
| Email A Friend                   | ✅      | ❌             | ✅                 |
| Schedule Viewing                 | ✅      | ❌             | ✅                 |
| Virtual Try-On                   | ✅      | ❌             | ✅                 |
| Social Sharing (FB, Twitter)     | ✅      | ❌             | ✅                 |
| Grid/List view toggle            | ✅      | ❌ (list only) | ✅                 |
| Records per page selector        | ✅      | ❌ (fixed 50)  | ✅                 |
| Search by Stock#                 | ✅      | ❌             | ✅                 |
| Rich product detail pages        | ✅      | 🟡 (basic)     | ✅                 |
| GIA certificate viewer           | ✅      | ❌             | ✅                 |
| Powered By branding              | ✅      | ❌             | 🟡 (merchant logo) |
| Mobile responsive                | ✅      | ✅             | ✅                 |
| Real-time pricing                | ✅      | ✅             | ✅                 |
| CSV import/export                | ❓      | ✅             | ✅                 |
| Multi-tenant                     | ❓      | ✅             | ✅                 |
| Shopify native integration       | ❌      | ✅             | ✅                 |

**Result:** Phase 2.0 achieves **feature parity** with GemFind and exceeds in some areas (Shopify native, multi-tenant, CSV import).

---

## Appendix B: Icon Requirements

### Default Icon Set Specifications

**Setting Style Icons (9 total):**

- Halo, Solitaire, Three Stone, Single Row, Trellis, MultiRow, Vintage, Pave, Bypass
- Format: SVG (preferred) or PNG
- Size: 64x64px (display size), 128x128px (retina)
- Color: Black line art on transparent background
- Style: Clean, minimalist, recognizable

**Stone Shape Icons (10 total):**

- Round, Radiant, Princess, Pear, Oval, Marquise, Heart, Emerald, Cushion, Asscher
- Format: SVG (preferred) or PNG
- Size: 64x64px (display size), 128x128px (retina)
- Color: Black line art on transparent background
- Style: Geometric, accurate shape representation

**Metal Type Icons (optional visual indicators):**

- Can be text-based or simple color swatches
- Format: CSS-based or SVG
- Colors: White (#FFFFFF), Yellow (#FFD700), Rose (#E0BFB8)

---

## Appendix C: Email Template Wireframes

### 1. Share Configuration Email

```
Subject: [Sender Name] wants to share a ring with you!

Hi [Recipient Name],

[Sender Name] found a beautiful ring and wanted to share it with you!

[IMAGE: Ring (setting + stone composite or setting alone)]

Ring Details:
- Setting: [Setting Name] - [Metal Type]
- Diamond: [Carat] [Shape] [Color] [Clarity]
- Price: $[Total Price]

[Button: View Full Details]

This ring was designed using [Merchant Name]'s Ring Builder.

[Merchant Logo & Contact Info]
```

### 2. Drop A Hint Email

```
Subject: Someone has dropped you a hint! 💍

Hi [Recipient Name],

Someone special has dropped you a hint about a ring they love!

[IMAGE: Ring]

"I love this ring and would be thrilled to receive it as a gift!"

[Button: View This Ring]

Special Note: [Custom Message from Sender]
Special Date: [Date] (if provided)

From: [Anonymous or Name] (optional)

[Merchant Logo & Contact Info]
```

### 3. Request More Info Email (to Merchant)

```
Subject: Customer Inquiry about [Product Name]

Hi [Merchant Name],

You have a new inquiry from a potential customer!

Customer Information:
- Name: [Customer Name]
- Email: [Customer Email]
- Phone: [Customer Phone] (if provided)

Product Details:
- Setting: [Setting Name] - SKU [SKU]
- Diamond: [Diamond Specs] - SKU [SKU]

Customer's Question:
"[Customer Message]"

[Button: View Configuration] [Button: Reply to Customer]

Inquiry submitted on [Date & Time]
```

### 4. Schedule Viewing Email (to Merchant)

```
Subject: Viewing Request from [Customer Name]

Hi [Merchant Name],

[Customer Name] would like to schedule an in-store viewing!

Customer Information:
- Name: [Customer Name]
- Email: [Customer Email]
- Phone: [Customer Phone]

Preferred Date: [Date]
Preferred Time: [Time]

Product They Want to See:
- Setting: [Setting Name]
- Diamond: [Diamond Specs]
[IMAGE: Ring]

[Button: Add to Calendar] [Button: Confirm Appointment]

Note from Customer:
"[Customer Message]"

[iCal Attachment]
```

---

## Appendix D: API Request/Response Examples

### Save Configuration

```http
POST /api/builder/save
Content-Type: application/json

{
  "configurationId": "CONFIG-20251013-ABC123",
  "shop": "merchant-store.myshopify.com"
}

Response 200 OK:
{
  "success": true,
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
    "settingId": "gid://shopify/Product/123",
    "stoneId": "gid://shopify/Product/456",
    "metalType": "14k_white_gold",
    "ringSize": "7",
    "sideStonesConfig": {...},
    "totalPrice": 8500
  },
  "setting": {
    "id": "gid://shopify/Product/123",
    "title": "Classic Solitaire",
    "images": [...],
    ...
  },
  "stone": {
    "id": "gid://shopify/Product/456",
    "carat": 1.5,
    "shape": "round",
    ...
  }
}
```

### Submit Inquiry

```http
POST /api/builder/inquiry
Content-Type: application/json

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
  "message": "Your hint has been sent!"
}
```

### Compare Diamonds

```http
POST /api/builder/compare
Content-Type: application/json

{
  "shop": "merchant-store.myshopify.com",
  "stoneIds": [
    "gid://shopify/Product/456",
    "gid://shopify/Product/457",
    "gid://shopify/Product/458"
  ]
}

Response 200 OK:
{
  "stones": [
    {
      "id": "gid://shopify/Product/456",
      "carat": 1.5,
      "shape": "round",
      "cut": "excellent",
      "color": "G",
      "clarity": "VS2",
      "price": 8500,
      ...
    },
    ...
  ],
  "differences": {
    "carat": [1.5, 1.45, 1.52],
    "price": [8500, 7900, 9200]
  },
  "bestValue": "gid://shopify/Product/457"
}
```

---

## Appendix E: Testing Checklist

### Visual Enhancements

- [ ] Icon filters display correctly (desktop & mobile)
- [ ] Icon selection state works (border/highlight)
- [ ] Diamond type tabs show correct counts
- [ ] Tab switching filters diamonds correctly
- [ ] Grid view displays stone cards properly
- [ ] List view (table) still works
- [ ] View toggle persists in localStorage
- [ ] Records per page selector changes pagination
- [ ] SKU search finds exact matches
- [ ] Results summary updates dynamically

### Comparison Tool

- [ ] Checkboxes appear on stone cards/table rows
- [ ] Compare button shows when 2+ selected
- [ ] Compare button shows correct count
- [ ] Comparison modal opens with selected stones
- [ ] Comparison table displays all specs
- [ ] Differences are highlighted
- [ ] "Best value" indicator appears
- [ ] "Select This Diamond" closes modal and selects stone
- [ ] Comparison persists across page refreshes

### Save & Share

- [ ] "Save Search" button works throughout builder
- [ ] Save generates unique shareable URL
- [ ] Copy to clipboard works
- [ ] Share modal opens on Step 4
- [ ] Email share form submits successfully
- [ ] Email is received with correct content
- [ ] Facebook share opens Share Dialog
- [ ] Twitter share opens compose dialog
- [ ] Saved configuration loads from URL
- [ ] Loaded config has all selections pre-filled

### Customer Engagement

- [ ] 4 action buttons appear on detail pages
- [ ] 4 action buttons appear on Step 4 (Review)
- [ ] Each button opens correct modal
- [ ] Drop A Hint form submits and sends email
- [ ] Request Info form submits and sends email to merchant
- [ ] Email A Friend form submits and sends email
- [ ] Schedule Viewing form submits and sends email
- [ ] Merchant receives inquiry emails
- [ ] Admin can view inquiries
- [ ] Admin can update inquiry status

### Virtual Try-On

- [ ] VTO button appears (if enabled in settings)
- [ ] VTO button launches VTO experience
- [ ] VTO integration works (chosen provider)
- [ ] VTO tracking records usage

### Product Detail Pages

- [ ] Setting detail page (/builder/setting/:id) loads
- [ ] Diamond detail page (/builder/diamond/:id) loads
- [ ] Image galleries work
- [ ] Specification panels display correctly
- [ ] Action buttons work on detail pages
- [ ] Social sharing buttons work on detail pages
- [ ] GIA certificate viewer opens PDF (if URL provided)
- [ ] Detail pages are shareable (direct URL access)

### Admin

- [ ] New settings tabs appear (Customer Engagement, VTO, Appearance)
- [ ] Merchants can enable/disable each feature
- [ ] Custom icon upload works
- [ ] Diamond type field appears in stone metadata form
- [ ] Certificate URL field appears in stone metadata form
- [ ] CSV import supports new fields (diamondType, certificateUrl)
- [ ] Inquiry management page shows inquiries
- [ ] Saved configurations admin view shows saved configs

### Performance

- [ ] Page load time < 3s
- [ ] API response time < 500ms
- [ ] Build time < 2s
- [ ] Email delivery rate > 95%

### Backward Compatibility

- [ ] Phase 1.0 functionality still works
- [ ] Existing configurations load correctly
- [ ] No breaking changes for existing merchants

---

**End of PRD**

**Document Version**: 2.0  
**Last Updated**: October 13, 2025  
**Next Review**: Upon development start  
**Status**: Ready for Implementation Planning

**Phase 2.0 Scope:** 13 new functional requirements (FR-13 to FR-25), 8 new non-goals (NG-14 to NG-21), 8-week timeline, GemFind feature parity achieved.
