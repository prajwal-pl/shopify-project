# Product Requirements Document (PRD)

# Ring Builder MVP - Shopify App

**Document Version:** 1.0  
**Date:** October 12, 2025  
**Status:** Approved for Development  
**Product Owner:** Gold Jewelers Team  
**Target Completion:** 12 weeks from start date

---

## 1. Introduction/Overview

### Problem Statement

Jewelry stores on Shopify lack a native solution to offer custom ring building capabilities. Currently, merchants must manually handle custom ring orders through emails, phone calls, or third-party solutions, leading to:

- Lost sales opportunities due to complexity
- Poor customer experience (no visualization, unclear pricing)
- Manual order processing overhead
- Inability to showcase ring customization options effectively

### Solution

Build a **multi-tenant Shopify embedded app** that enables jewelry stores to offer an intuitive, step-by-step ring building experience. The app will allow customers to:

1. Select a ring setting from available inventory
2. Choose a center stone (diamond/gemstone) with detailed specifications
3. Optionally select side stones (configurable by merchant)
4. See real-time pricing and simple visual preview
5. Add configured ring to cart and complete purchase through Shopify

### Goal

Create a production-ready MVP ring builder that delivers core functionality with accuracy and reliability. Focus on the essential path: **Setting → Stone → Review → Cart**, with no advanced features that could introduce scope creep.

### Reference Competitor

[Middleton Jewelers](https://middletonjewelers.app/) offers a ring builder with custom design capabilities. Our MVP will provide similar core functionality tailored for any Shopify jewelry store.

---

## 2. Goals

### Primary Goals

1. **Core Builder Flow**: Implement a functional 3-4 step ring configuration process
2. **Real-Time Pricing**: Calculate and display accurate prices as customers make selections
3. **Inventory Integration**: Sync with Shopify products using metadata for settings and stones
4. **Seamless Checkout**: Create orders in Shopify with complete configuration details
5. **Merchant Control**: Provide admin interface for product management and basic settings

### Secondary Goals

1. **Performance**: Fast loading and filtering with 200-1,000 stones
2. **Data Accuracy**: Zero pricing errors, correct inventory sync
3. **Multi-Tenant**: Support multiple stores with complete data isolation
4. **Scalability**: Architecture that can grow with future features

### Success Metrics

**Primary Metrics** (as defined by stakeholder):

- **Configuration Completion Rate**: Track % of users who complete all steps
- **Customer Satisfaction**: Monitor through reviews and feedback
- **Time to Complete**: Measure average time for full configuration

**Launch Threshold**:

- Minimum 50+ configurations created across beta merchants
- 3+ beta merchants testing successfully

---

## 3. User Stories

### Merchant (Store Owner) Stories

**US-M1**: As a jewelry store owner, I want to install the ring builder app on my Shopify store so I can offer custom ring building to customers.

**US-M2**: As a merchant, I want to mark existing Shopify products as "Settings" or "Stones" so they appear in the builder with correct attributes.

**US-M3**: As a merchant, I want to add setting metadata (style, metal types, base prices, compatible stone shapes) so customers can filter and see accurate pricing.

**US-M4**: As a merchant, I want to add stone specifications (carat, cut, color, clarity, certificate info) so customers can make informed decisions.

**US-M5**: As a merchant, I want to bulk import stone data via CSV so I don't have to manually enter hundreds of stones.

**US-M6**: As a merchant, I want to optionally enable/disable side stones so I can control my builder's complexity.

**US-M7**: As a merchant, I want configured rings to appear as orders in Shopify with all details so I can fulfill them correctly.

**US-M8**: As a merchant, I want to set markup percentages and fees so I control my profit margins.

### Customer Stories

**US-C1**: As a customer, I want to browse available ring settings filtered by style and metal type so I can find a design I like.

**US-C2**: As a customer, I want to see clear images of settings so I can visualize the ring.

**US-C3**: As a customer, I want to select a diamond by filtering by carat, cut, color, and clarity so I can find a stone within my budget.

**US-C4**: As a customer, I want to see certificate information for diamonds so I trust the quality.

**US-C5**: As a customer, I want to see the total price update in real-time so I stay within budget.

**US-C6**: As a customer, I want to choose my ring size so the ring fits correctly.

**US-C7**: As a customer, I want to review my complete configuration before adding to cart so I can confirm everything is correct.

**US-C8**: As a customer, I want to add my configured ring to cart and checkout normally so I can complete my purchase.

---

## 4. Functional Requirements

### FR-1: Multi-Step Configuration Flow

**FR-1.1**: The builder MUST provide a 3-4 step interface:

- **Step 1**: Choose Setting
- **Step 2**: Choose Center Stone
- **Step 3**: Customize (Ring Size + Optional Side Stones if enabled)
- **Step 4**: Review & Add to Cart

**FR-1.2**: The system MUST allow customers to navigate back to previous steps to change selections.

**FR-1.3**: The system MUST persist configuration state as customers navigate between steps (client-side state management).

**FR-1.4**: The system MUST display progress indication showing current step and completed steps.

**FR-1.5**: The system MUST validate that required selections are made before allowing progression to next step.

---

### FR-2: Setting Selection (Step 1)

**FR-2.1**: The system MUST display all products marked as "Settings" in a responsive grid layout.

**FR-2.2**: The system MUST provide filters for:

- **Style**: (Solitaire, Halo, Three-Stone, Vintage, Modern, Pavé, Channel, Tension)
- **Metal Type**: (14K White Gold, 14K Yellow Gold, 18K Rose Gold, Platinum)
- **Price Range**: Slider with min/max from inventory

**FR-2.3**: Each setting card MUST display:

- Primary image (from Shopify product)
- Setting name
- Starting price (lowest metal type price)
- "View Details" or "Select" button

**FR-2.4**: The system MUST provide a detail modal showing:

- Multiple images (all product images)
- Full description
- Available metal types with individual prices
- Compatible stone shapes
- SKU

**FR-2.5**: The system MUST allow customers to select a metal type and setting, which advances to Step 2.

**FR-2.6**: The system MUST update total price when setting and metal type are selected.

---

### FR-3: Stone Selection (Step 2)

**FR-3.1**: The system MUST display all products marked as "Stones" that are compatible with the selected setting's allowed shapes.

**FR-3.2**: The system MUST provide filters for:

- **Shape**: (Round, Princess, Cushion, Emerald, Oval, Radiant, Asscher, Marquise, Pear, Heart)
- **Carat Weight**: Range slider (min/max from inventory)
- **Cut Grade**: (Excellent, Very Good, Good, Fair, Poor)
- **Color Grade**: (D, E, F, G, H, I, J, K, L, M)
- **Clarity Grade**: (FL, IF, VVS1, VVS2, VS1, VS2, SI1, SI2, I1, I2, I3)
- **Price Range**: Slider
- **Certification**: (GIA, AGS, IGI, EGL, HRD, None)

**FR-3.3**: The system MUST display stones in a table format (desktop) with columns:

- Image thumbnail
- Shape
- Carat
- Cut
- Color
- Clarity
- Price
- Certificate (type + number)
- "Details" button
- "Select" button

**FR-3.4**: The system MUST display stones in a card format (mobile) with key information visible.

**FR-3.5**: The system MUST provide a sortable table (sort by: Price, Carat, Cut, Color, Clarity).

**FR-3.6**: The system MUST provide a details modal for each stone showing:

- High-resolution image
- Certificate number and link (if available)
- Detailed measurements (length x width x depth)
- All specifications (table %, depth %, polish, symmetry, fluorescence)
- Price

**FR-3.7**: The system MUST allow customers to select a stone, which advances to Step 3.

**FR-3.8**: The system MUST update total price when stone is selected.

**FR-3.9**: The system MUST paginate stone results (50 stones per page) for performance.

---

### FR-4: Customization (Step 3)

**FR-4.1**: The system MUST allow customers to select ring size from standard US sizes (3, 3.5, 4, ..., 12).

**FR-4.2**: The system MUST display a ring size guide (static image/chart) accessible via a link or icon.

**FR-4.3**: If merchant has enabled side stones:

- The system MUST show side stone selector
- The system MUST allow selecting side stone quality (merchant-defined options)
- The system MUST allow selecting side stone quantity (merchant-defined min/max)
- The system MUST calculate and display side stone pricing
- The system MUST update total price in real-time

**FR-4.4**: If merchant has NOT enabled side stones:

- The system MUST skip side stone options entirely

**FR-4.5**: The system MUST validate that ring size is selected before allowing progression to Step 4.

---

### FR-5: Review & Cart (Step 4)

**FR-5.1**: The system MUST display a complete configuration summary:

- **Setting Details**: Name, SKU, Metal Type, Style, Price
- **Stone Details**: Carat, Shape, Cut, Color, Clarity, Certificate, Price
- **Side Stones Details**: (if applicable) Quality, Quantity, Price
- **Ring Size**: Selected size
- **Total Price**: Itemized breakdown and total

**FR-5.2**: The system MUST display a visual preview showing:

- **Simple approach**: Setting image and stone image side-by-side (no composition)
- Clear labels identifying each component

**FR-5.3**: The system MUST provide "Edit" buttons for each section that navigate back to the relevant step.

**FR-5.4**: The system MUST provide an "Add to Cart" button that:

- Creates a configuration record in the app database
- Generates a unique configuration ID
- Adds the setting product to Shopify cart with line item properties:
  ```
  Setting: [Name] - [Metal Type]
  Setting SKU: [SKU]
  Center Stone: [Carat]ct [Shape] [Color] [Clarity]
  Stone SKU: [SKU]
  Stone Certificate: [Type] [Number]
  Side Stones: [Quantity] stones, [Quality] (if applicable)
  Ring Size: [Size]
  Configuration ID: [Unique ID]
  Total Price: $[Amount]
  ```
- Uses the setting product's variant corresponding to the selected metal type
- Calculates the correct total price including all components

**FR-5.5**: The system MUST redirect to the Shopify cart page after successful "Add to Cart" operation.

**FR-5.6**: The system MUST show error message if adding to cart fails, with retry option.

---

### FR-6: Pricing Engine

**FR-6.1**: The system MUST calculate total price as:

```
Total = Setting Price (by selected metal type)
      + Stone Price
      + Side Stones Price (if applicable)
      + (Total * Markup Percentage)
```

**FR-6.2**: The system MUST display the running total prominently in a fixed/sticky component visible at all times.

**FR-6.3**: The system MUST recalculate price in real-time when any selection changes.

**FR-6.4**: The system MUST validate all prices on the backend before creating the cart item (don't trust client calculation).

**FR-6.5**: The system MUST handle currency formatting based on the store's currency settings from Shopify.

**FR-6.6**: The system MUST support merchant-configured markup percentage (default: 0%).

---

### FR-7: Admin Dashboard - Product Management

**FR-7.1**: The admin MUST provide a page to view all Shopify products with search and pagination.

**FR-7.2**: The admin MUST allow merchants to mark products as "Setting" or "Stone" via action buttons.

**FR-7.3**: For products marked as "Setting", the admin MUST provide a form to input:

- **Style**: Dropdown (Solitaire, Halo, Three-Stone, Vintage, Modern, Pavé, Channel, Tension)
- **Setting Height**: Dropdown (Low, Medium, High)
- **Compatible Stone Shapes**: Multi-select checkboxes (Round, Princess, Cushion, etc.)
- **Base Prices by Metal Type**: Currency inputs for:
  - 14K White Gold
  - 14K Yellow Gold
  - 18K Rose Gold
  - Platinum

**FR-7.4**: For products marked as "Stone", the admin MUST provide a form to input:

- **Stone Type**: Dropdown (Diamond, Sapphire, Ruby, Emerald, Other)
- **Shape**: Dropdown (Round, Princess, Cushion, Emerald, Oval, etc.)
- **Carat Weight**: Decimal input (e.g., 1.50)
- **Cut Grade**: Dropdown (Excellent, Very Good, Good, Fair, Poor)
- **Color Grade**: Dropdown (D, E, F, G, H, I, J, K, L, M)
- **Clarity Grade**: Dropdown (FL, IF, VVS1, VVS2, VS1, VS2, SI1, SI2, I1, I2, I3)
- **Certificate Type**: Dropdown (GIA, AGS, IGI, EGL, HRD, None)
- **Certificate Number**: Text input
- **Certificate URL**: Text input (optional)
- **Measurements**: Text input (format: "7.35 x 7.40 x 4.50")
- **Table %**: Number input (optional)
- **Depth %**: Number input (optional)
- **Polish**: Dropdown (optional)
- **Symmetry**: Dropdown (optional)
- **Fluorescence**: Dropdown (None, Faint, Medium, Strong, Very Strong)

**FR-7.5**: The admin MUST allow bulk import of stones via CSV upload with:

- File upload interface
- CSV template download link
- Validation of CSV format and required fields
- Error reporting for failed rows
- Success summary showing: X stones imported, Y errors

**FR-7.6**: The admin MUST allow bulk export of settings or stones to CSV format.

**FR-7.7**: The admin MUST display clear indicators showing which products are marked as Setting or Stone (badges/tags).

**FR-7.8**: The admin MUST allow "unmarking" a product (removing it from builder inventory).

---

### FR-8: Admin Dashboard - Builder Settings

**FR-8.1**: The admin MUST provide a settings page with sections:

- **General Settings**
- **Pricing Rules**
- **Side Stones Configuration**

**FR-8.2**: General Settings MUST include:

- **Enable/Disable Builder**: Toggle switch (when disabled, builder is hidden from storefront)
- **Builder Page URL**: Display the app block URL/instructions

**FR-8.3**: Pricing Rules MUST include:

- **Markup Percentage**: Number input (e.g., 5 for 5% markup)
- **Side Stones Fee per Stone**: Currency input (if side stones enabled)

**FR-8.4**: Side Stones Configuration MUST include:

- **Enable Side Stones**: Toggle switch
- **Side Stone Quality Options**: Text input (comma-separated, e.g., "Good, Better, Best")
- **Side Stone Pricing**: Currency input per quality level
- **Min/Max Quantity**: Number inputs

**FR-8.5**: The admin MUST save settings per shop (multi-tenant isolation).

**FR-8.6**: The admin MUST show success/error messages after saving settings.

---

### FR-9: Order Creation & Shopify Integration

**FR-9.1**: When customer clicks "Add to Cart", the system MUST:

- Save complete configuration to app database (Configuration model)
- Generate unique configuration ID (format: CONFIG-[timestamp]-[random])
- Calculate final price on backend (validate against client calculation)
- Find the correct product variant ID based on selected metal type
- Call Shopify Ajax Cart API to add item with line item properties
- Return success/failure response

**FR-9.2**: The line item properties MUST include:

```json
{
  "Setting": "Classic Solitaire - 14K White Gold",
  "Setting SKU": "SET-123",
  "Center Stone": "1.50ct Round G VS1",
  "Stone SKU": "DIA-456",
  "Stone Certificate": "GIA 2141234567",
  "Side Stones": "12 stones, Premium quality",
  "Ring Size": "7",
  "Configuration ID": "CONFIG-20251012-ABC123"
}
```

**FR-9.3**: The Configuration database record MUST store:

- Shop domain (for multi-tenant isolation)
- Customer ID (if logged in, null if guest)
- Customer email (if available)
- Setting product ID (Shopify GID)
- Stone product ID (Shopify GID)
- Selected metal type
- Ring size
- Side stones selection (if applicable)
- Individual prices (setting, stone, side stones)
- Total price
- Status: "completed" (once added to cart)
- Cart item ID (from Shopify response)
- Created timestamp
- Configuration ID (unique identifier)

**FR-9.4**: The system MUST handle errors gracefully:

- Out of stock products: Show error message
- API failures: Show retry option
- Invalid data: Show specific validation errors

**FR-9.5**: The system MUST verify product availability before adding to cart (check Shopify inventory).

---

### FR-10: Webhooks & Data Sync

**FR-10.1**: The system MUST register webhooks for:

- `products/update`: When merchant updates product in Shopify
- `products/delete`: When merchant deletes product in Shopify

**FR-10.2**: On `products/update` webhook:

- The system MUST check if product has builder metadata
- If yes, update the corresponding SettingMetadata or StoneMetadata record in database
- If no, ignore the webhook

**FR-10.3**: On `products/delete` webhook:

- The system MUST find corresponding metadata record
- Mark as deleted or remove from database
- Ensure product no longer appears in builder

**FR-10.4**: All webhooks MUST verify HMAC signature for security.

**FR-10.5**: All webhooks MUST be idempotent (safe to process multiple times).

---

### FR-11: Mobile Responsiveness

**FR-11.1**: The entire builder interface MUST be functional on mobile devices (iOS and Android).

**FR-11.2**: On mobile (screens < 768px):

- Filters MUST be accessible via a slide-out drawer/modal (not always visible)
- Stone table MUST convert to card-based layout
- Images MUST be optimized and lazy-loaded
- Touch targets MUST be minimum 44px (Apple guideline)

**FR-11.3**: On desktop:

- Filters MUST be displayed in a fixed sidebar
- Stone table MUST use full table layout with sorting

**FR-11.4**: The interface MUST be tested on:

- iOS Safari (iPhone)
- Android Chrome
- Desktop Chrome, Firefox, Safari

---

### FR-12: Data & Security

**FR-12.1**: All database queries MUST filter by shop domain to ensure multi-tenant data isolation.

**FR-12.2**: All admin routes MUST authenticate using Shopify session tokens.

**FR-12.3**: The system MUST NEVER expose one merchant's data to another merchant.

**FR-12.4**: All user inputs MUST be validated and sanitized on the backend.

**FR-12.5**: Price calculations MUST be performed on the backend (client calculations are for UX only).

**FR-12.6**: All Shopify API calls MUST include proper error handling and rate limiting awareness.

---

## 5. Non-Goals (Out of Scope for MVP)

The following features are **explicitly OUT OF SCOPE** for MVP to prevent scope creep:

**NG-1**: ❌ Save & Share Configurations

- No "save for later" functionality
- No shareable configuration links
- No email configuration feature

**NG-2**: ❌ Analytics Dashboard

- No merchant analytics/reports
- No funnel visualization
- No popular items tracking
- Track only minimum data needed for functionality

**NG-3**: ❌ Email Notifications

- No email to merchants on configuration save
- No email to customers on order
- No automated emails of any kind

**NG-4**: ❌ Engraving Customization

- No engraving text input
- No engraving preview
- No engraving fees

**NG-5**: ❌ Gift Options

- No gift wrapping option
- No gift message
- No special packaging

**NG-6**: ❌ Customer Account Integration

- No viewing saved configurations in customer account
- No configuration history page

**NG-7**: ❌ Advanced Image Features

- No 3D visualization
- No 360° views
- No AR try-on
- No server-side image composition
- Only simple side-by-side image display

**NG-8**: ❌ Education Content

- No diamond education guides
- No ring size guide (beyond simple chart)
- No style guides
- No help articles

**NG-9**: ❌ Comparison Features

- No side-by-side stone comparison
- No configuration comparison

**NG-10**: ❌ Advanced Search

- No AI-powered recommendations
- No "similar stones" suggestions
- No recently viewed tracking

**NG-11**: ❌ Multi-language/Multi-currency

- English only
- Store's default currency only

**NG-12**: ❌ Third-Party Integrations

- No supplier API integration
- No live chat integration
- No payment installment options

**NG-13**: ❌ Advanced Admin Features

- No manual order creation from configurations
- No work order generation for jewelers
- No fulfillment tracking
- No order status updates

**CRITICAL**: Any request for features listed in NG-1 through NG-13 MUST be deferred to post-MVP phases.

---

## 6. Design Considerations

### UI/UX Guidelines

**Design Principle 1: Simplicity**

- Clear, linear flow with obvious next steps
- Minimal cognitive load at each step
- Progressive disclosure of information

**Design Principle 2: Trust & Transparency**

- Display certificate information prominently
- Show itemized pricing breakdown
- Use high-quality product images from Shopify

**Design Principle 3: Performance**

- Fast loading times (< 3 seconds)
- Smooth filtering and sorting
- Optimized image loading

**Design Principle 4: Desktop-First, Mobile-Friendly**

- Design for desktop experience first
- Adapt for mobile (functional, not necessarily perfect)
- Touch-friendly interactions on mobile

### Component Design

**Admin Interface**:

- Use **Shopify Polaris Web Components** exclusively (`<s-card>`, `<s-button>`, `<s-text-field>`, etc.)
- Follow Shopify's design guidelines
- Maintain consistency with Shopify admin experience

**Storefront Interface**:

- Custom React components
- Match merchant's theme colors (use CSS variables for customization)
- Clean, professional aesthetic suitable for jewelry
- High contrast and accessibility (WCAG 2.1 AA minimum)

**Color Scheme (Default)**:

- Primary: #000000 (Black)
- Accent: #D4AF37 (Gold)
- Background: #FFFFFF (White)
- Text: #1A1A1A (Near Black)
- Border: #E5E5E5 (Light Gray)
- Success: #10B981 (Green)
- Error: #EF4444 (Red)

**Typography**:

- Use merchant's theme fonts or Shopify default
- Headings: 24px-32px, bold
- Body: 14px-16px, regular
- Small text: 12px-14px

---

## 7. Technical Considerations

### Technology Stack (Current)

**Frontend**:

- React Router v7.9.1 (server-side rendering)
- React 18.2.0 (client-side)
- Polaris Web Components (admin)
- CSS Modules (styling)

**Backend**:

- Node.js (runtime)
- React Router (framework)
- Prisma ORM (database)
- SQLite (development), PostgreSQL ready (production)

**Shopify Integration**:

- Admin GraphQL API v2026-01
- Shopify OAuth 2.0
- Theme App Extension
- Webhooks

**Image Storage**:

- Shopify Files (built-in, no external CDN for MVP)

### Database Schema

The app requires **5 new Prisma models**:

1. **Configuration**: Stores customer ring configurations
2. **SettingMetadata**: Stores ring setting attributes (style, prices, compatible shapes)
3. **StoneMetadata**: Stores diamond/gemstone specifications (4 Cs, certificate info)
4. **AppSettings**: Stores merchant configuration (markup, side stones settings)
5. **AnalyticsEvent**: (Optional for MVP, minimal usage) Stores basic tracking events

_See RING_BUILDER_RESEARCH.md section "Database Schema Design" for detailed schema._

### API Architecture

**Public API (Storefront)**:

- `GET /api/builder/settings` - Fetch settings with filters (public)
- `GET /api/builder/stones` - Fetch stones with filters (public)
- `POST /api/builder/cart` - Add configuration to cart (public)

**Admin API (Authenticated)**:

- `GET /api/admin/products` - List products for marking
- `POST /api/admin/products/:id/mark` - Mark product as Setting/Stone
- `PUT /api/admin/products/:id/metadata` - Update metadata
- `POST /api/admin/import` - CSV import
- `GET /api/admin/export` - CSV export
- `GET /api/admin/settings` - Get app settings
- `PUT /api/admin/settings` - Update app settings

### Required Shopify Scopes

```toml
scopes = "write_products,read_products,write_orders,read_orders,write_customers,read_customers"
```

**Justification**:

- `write_products, read_products`: Manage products and metafields
- `write_orders, read_orders`: Create orders from configurations
- `write_customers, read_customers`: Track customer configurations (if logged in)

### Performance Considerations

**Optimization Strategies**:

1. Database indexing on commonly queried fields (shape, carat, price, shop)
2. Pagination for stone listings (50 per page)
3. Client-side caching of product data (React Context)
4. Lazy loading of images
5. Debouncing on filter changes (300ms)

**Performance Targets**:

- Page load: < 3 seconds
- Filter application: < 500ms
- Add to cart: < 1 second

### Security Measures

1. Validate all user inputs on backend
2. Implement rate limiting on public API endpoints
3. Use Shopify session tokens for admin authentication
4. Always filter database queries by shop (multi-tenant isolation)
5. Verify webhook HMAC signatures
6. Sanitize line item properties before sending to Shopify

---

## 8. Success Metrics

### Primary Metrics (As Specified)

1. **Configuration Completion Rate**
   - Track: Users who start builder vs. users who complete Step 4
   - Target: 30%+ completion rate
   - Measurement: AnalyticsEvent tracking or Configuration records

2. **Customer Satisfaction**
   - Track: Through post-purchase surveys, app store reviews
   - Target: 4.5+ stars (when applicable)
   - Measurement: Feedback forms, review aggregation

3. **Time to Complete Configuration**
   - Track: Time from builder start to cart addition
   - Target: < 10 minutes average
   - Measurement: Timestamp differences in Configuration records

### Launch Criteria

**Minimum Threshold**: 50+ configurations created across beta merchants

**Additional Launch Requirements**:

- 3+ beta merchants successfully testing
- Zero critical bugs
- All FR-1 through FR-12 implemented and tested
- Mobile experience is functional (not necessarily perfect)
- Documentation complete (merchant setup guide)

### Technical Metrics

- **API Response Time**: < 500ms average
- **Error Rate**: < 1%
- **Uptime**: 99%+ during business hours

---

## 9. Open Questions

**Q1**: Should we support custom ring sizes outside the standard range (e.g., size 2, size 13)?

- **Decision Needed**: Yes/No, and how to handle (text input vs. "Contact Us")

**Q2**: What happens if a setting or stone becomes unavailable after customer has started configuration?

- **Decision Needed**: Show error message, remove from selection, or allow with warning?

**Q3**: Should customers be able to add multiple configured rings to cart in one session?

- **Decision Needed**: Yes (cart allows multiple) or No (redirect immediately)?

**Q4**: How should we handle price discrepancies between client and server calculations?

- **Decision Needed**: Always use server price, show warning to user, or reject cart addition?

**Q5**: Should we track partial configurations (abandoned at Step 1 or 2) for future analytics?

- **Decision Needed**: Yes (even though no analytics dashboard in MVP) or No (only complete configs)?

**Q6**: What's the behavior if merchant updates product price after configuration is created but before checkout?

- **Decision Needed**: Lock price at configuration time, or update to current price?

**Q7**: Should the CSV import completely replace existing stone data or append to it?

- **Decision Needed**: Replace, Append, or User selects per import?

**Q8**: How do we handle stones without certificates (non-certified diamonds)?

- **Decision Needed**: Allow with "No Certificate", require certificate, or merchant decides?

---

## 10. Dependencies & Constraints

### Dependencies

**Technical Dependencies**:

- Shopify store with Online Store 2.0 theme (for Theme App Extension support)
- Node.js 20.10+ runtime environment
- PostgreSQL for production deployment (SQLite acceptable for development)
- Shopify Partner account for app development and testing

**External Dependencies**:

- Shopify Admin API availability (SLA: 99.9%)
- Shopify Ajax Cart API (for cart additions)
- Shopify Files for image hosting

### Constraints

**Platform Constraints**:

- Shopify API rate limits: 2 requests per second per shop (must implement queuing/throttling)
- Theme app extension limitations: No access to checkout page customization
- Line item properties: 255 characters max per property value

**Business Constraints**:

- Must work with existing Shopify products (can't create separate product catalog)
- Must use Shopify's native cart and checkout (can't replace)
- Must be multi-tenant (support multiple stores from single app instance)

**Technical Constraints**:

- Must maintain session storage per shop (handled by Shopify app template)
- Must handle concurrent users per shop (multiple customers building rings simultaneously)
- Must work in iframe (embedded admin app)

**Timeline Constraint**:

- Realistic MVP completion: **12 weeks** with 2-3 developers
- Phases: Foundation (2 weeks) → Admin (2 weeks) → Storefront (4 weeks) → Integration (2 weeks) → Polish & Testing (2 weeks)

---

## 11. Timeline & Milestones

### Realistic Development Timeline: 12 Weeks

**Phase 1: Foundation (Weeks 1-2)**

- Database schema implementation (Configuration, SettingMetadata, StoneMetadata, AppSettings)
- Prisma migrations
- Update Shopify scopes in config
- Basic admin layout structure
- **Milestone**: Database ready, admin accessible

**Phase 2: Admin Product Management (Weeks 3-4)**

- Product listing page with search/pagination
- Mark as Setting/Stone functionality
- Setting metadata form and validation
- Stone metadata form and validation
- CSV import/export for stones
- **Milestone**: Merchants can manage product metadata

**Phase 3: Admin Settings (Week 5)**

- Settings page with three sections (General, Pricing, Side Stones)
- Save/load settings per shop
- Validation for all settings
- **Milestone**: Merchants can configure builder behavior

**Phase 4: Storefront Builder - Step 1 & 2 (Weeks 6-7)**

- Theme App Extension setup
- Builder state management (React Context)
- Step 1: Setting Selector with filters
- Step 2: Stone Selector with advanced filters and table
- API endpoints: /api/builder/settings and /api/builder/stones
- Real-time price calculation (client-side)
- **Milestone**: Customers can select settings and stones

**Phase 5: Storefront Builder - Step 3 & 4 (Weeks 8-9)**

- Step 3: Customization (ring size, optional side stones)
- Step 4: Review with simple side-by-side preview
- Price summary component (sticky)
- Validation and error handling
- **Milestone**: Complete builder flow functional

**Phase 6: Cart Integration (Week 10)**

- Add to cart API endpoint
- Configuration save to database
- Line item properties generation
- Shopify Ajax Cart API integration
- Error handling (out of stock, API failures)
- **Milestone**: Configured rings can be purchased

**Phase 7: Webhooks & Sync (Week 10)**

- Register product webhooks (update, delete)
- Webhook handlers for product sync
- HMAC signature verification
- **Milestone**: Product data stays synchronized

**Phase 8: Testing & Polish (Weeks 11-12)**

- Mobile responsive testing and fixes
- Cross-browser testing
- Performance optimization (database queries, image loading)
- Bug fixes
- Merchant documentation
- Beta merchant testing
- **Milestone**: MVP ready for production

---

## 12. Acceptance Criteria

### Definition of Done

A feature is considered "done" when:

1. ✅ Code is written and follows project conventions
2. ✅ All functional requirements are implemented
3. ✅ Feature works on desktop (Chrome, Firefox, Safari)
4. ✅ Feature is functional on mobile (iOS and Android)
5. ✅ All edge cases are handled with appropriate error messages
6. ✅ Database queries include shop filtering (multi-tenant isolation)
7. ✅ No critical or high-priority bugs
8. ✅ Manual testing completed successfully

### MVP Launch Criteria

The app is ready to launch when:

1. ✅ All FR-1 through FR-12 are implemented and tested
2. ✅ Merchants can mark products and set metadata
3. ✅ Customers can complete the full 3-4 step builder flow
4. ✅ Configured rings are added to cart with correct details and pricing
5. ✅ Orders appear in Shopify with line item properties
6. ✅ Webhooks are registered and handling product updates
7. ✅ Mobile experience is functional (core features work)
8. ✅ Multi-tenant data isolation is verified (no data leaks between shops)
9. ✅ At least 3 beta merchants have tested successfully
10. ✅ 50+ configurations have been created in testing
11. ✅ Basic merchant setup guide is complete
12. ✅ All scope creep features (NG-1 through NG-13) are confirmed excluded

---

## 13. Risk Assessment

### High Risk Items

**Risk 1: Timeline/Scope Creep**

- **Impact**: High
- **Probability**: High (stakeholder concern)
- **Mitigation**: Strict adherence to Non-Goals section, weekly scope review, no feature additions mid-development

**Risk 2: Complex Stone Filtering Performance**

- **Impact**: High (core UX)
- **Probability**: Medium
- **Mitigation**: Database indexing, pagination, server-side filtering, early performance testing with 1,000 stones

**Risk 3: Multi-Tenant Data Isolation Bug**

- **Impact**: Critical (data security)
- **Probability**: Low
- **Mitigation**: Mandatory shop filtering in all queries, code review checklist, dedicated security testing

### Medium Risk Items

**Risk 4: Shopify API Rate Limits**

- **Impact**: Medium
- **Probability**: Medium
- **Mitigation**: Implement caching, batch requests where possible, graceful rate limit handling

**Risk 5: Mobile Experience Gaps**

- **Impact**: Medium
- **Probability**: Medium (desktop-first approach)
- **Mitigation**: Early mobile testing, responsive design from start, accept "functional" over "perfect" for MVP

**Risk 6: CSV Import Data Quality**

- **Impact**: Medium
- **Probability**: Medium
- **Mitigation**: Strong validation, detailed error reporting, CSV template with examples

---

## 14. Approval

**Product Owner**: **\*\***\_\_\_**\*\*** Date: **\*\***\_\_\_**\*\***

**Tech Lead**: **\*\***\_\_\_**\*\*** Date: **\*\***\_\_\_**\*\***

**Stakeholders**: **\*\***\_\_\_**\*\*** Date: **\*\***\_\_\_**\*\***

---

## Appendix A: Reference Materials

- **Competitor Research**: [Middleton Jewelers Ring Builder](https://middletonjewelers.app/)
- **Technical Deep Dive**: `RING_BUILDER_RESEARCH.md`
- **Task Breakdown**: `tasks-ring-builder-app.md` (180+ detailed tasks)
- **Shopify Admin API**: https://shopify.dev/docs/api/admin-graphql
- **Polaris Components**: https://shopify.dev/docs/api/app-home

---

## Appendix B: Glossary

- **Setting**: The ring band/mount that holds the center stone
- **Center Stone**: The main diamond or gemstone in the ring
- **Side Stones**: Smaller accent stones on the band (optional)
- **4 Cs**: Carat, Cut, Color, Clarity (diamond quality metrics)
- **GID**: Global ID (Shopify's unique identifier format, e.g., `gid://shopify/Product/123`)
- **Line Item Properties**: Custom key-value pairs attached to cart items in Shopify
- **Theme App Extension**: Shopify's method for embedding app UI into store themes
- **Multi-Tenant**: Single app instance serving multiple stores with data isolation

---

**End of PRD**

**Document Version**: 1.0  
**Last Updated**: October 12, 2025  
**Next Review**: Upon development start  
**Status**: Ready for Implementation Planning
