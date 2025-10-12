# Product Requirements Document (PRD)
# Ring Builder Shopify App

**Version:** 1.0  
**Date:** 2025-10-04  
**Status:** Approved for Development  
**Product Owner:** Gold Jewelers Team  

---

## 1. Introduction/Overview

### Problem Statement
Gold jewelry stores using Shopify need a way to offer custom ring building capabilities to their customers. Currently, there's no native Shopify solution that allows customers to:
- Select a ring setting from available inventory
- Choose a center stone (diamond/gemstone) with detailed specifications
- Customize the ring (size, metal type, engraving)
- See real-time pricing and visual preview
- Complete the purchase through Shopify checkout

This app will solve this problem by providing a complete ring builder solution that can be installed by any jewelry store on Shopify.

### Goal
Create a multi-tenant Shopify app that enables jewelry stores to offer an intuitive, step-by-step ring building experience to their customers, similar to high-end jewelers like Middleton Jewelers, Blue Nile, and James Allen.

### Success Metrics
- **Merchant Adoption**: 50+ active installations within 6 months
- **Customer Engagement**: 30%+ of visitors who start builder complete at least 2 steps
- **Conversion Rate**: 15%+ of completed configurations result in orders
- **Average Order Value**: 2-3x higher than standard product sales
- **Customer Satisfaction**: 4.5+ star rating on Shopify App Store

---

## 2. Goals

### Primary Goals
1. **Enable Custom Ring Building**: Allow customers to create custom rings through an intuitive multi-step process
2. **Real-Time Pricing**: Calculate and display accurate prices as customers make selections
3. **Inventory Integration**: Sync with Shopify products for settings and stones
4. **Seamless Checkout**: Create orders in Shopify with all configuration details
5. **Merchant Control**: Provide admin dashboard for managing products, settings, and analytics

### Secondary Goals
1. **Save & Share**: Allow customers to save configurations and share with others
2. **Mobile Experience**: Ensure full functionality on mobile devices
3. **Educational Content**: Help customers understand diamonds and settings
4. **Analytics**: Provide merchants with insights into customer behavior

---

## 3. User Stories

### Merchant (Store Owner) Stories

**US-M1**: As a jewelry store owner, I want to install the app on my Shopify store so that I can offer custom ring building to my customers.

**US-M2**: As a merchant, I want to mark existing Shopify products as "settings" or "stones" so that they appear in the ring builder.

**US-M3**: As a merchant, I want to set base prices for different metal types (14K white gold, 18K yellow gold, platinum) so that pricing is calculated correctly.

**US-M4**: As a merchant, I want to add diamond specifications (carat, cut, color, clarity) to my stone products so that customers can filter appropriately.

**US-M5**: As a merchant, I want to view all customer configurations (completed and in-progress) so that I can follow up with potential customers.

**US-M6**: As a merchant, I want to see analytics on configuration completion rates and popular combinations so that I can optimize my inventory.

**US-M7**: As a merchant, I want to customize the builder's appearance (colors, logo) so that it matches my store's branding.

**US-M8**: As a merchant, I want to receive email notifications when customers complete configurations so that I can provide personalized service.

### Customer Stories

**US-C1**: As a customer, I want to browse available ring settings filtered by style and metal type so that I can find a setting I like.

**US-C2**: As a customer, I want to see high-quality images of settings from multiple angles so that I can visualize the ring.

**US-C3**: As a customer, I want to select a diamond by filtering by the 4 Cs (carat, cut, color, clarity) so that I can find a stone within my budget and quality preferences.

**US-C4**: As a customer, I want to see the certificate information for diamonds so that I can verify authenticity.

**US-C5**: As a customer, I want to see the total price update in real-time as I make selections so that I stay within budget.

**US-C6**: As a customer, I want to choose my ring size and add custom engraving so that the ring is personalized.

**US-C7**: As a customer, I want to see a visual preview of my configured ring so that I can confirm it looks as expected.

**US-C8**: As a customer, I want to save my configuration and come back later so that I can take time to make a decision.

**US-C9**: As a customer, I want to share my configuration with my partner/friend so that I can get their opinion.

**US-C10**: As a customer, I want to add my configured ring to cart and checkout normally so that I can complete my purchase.

---

## 4. Functional Requirements

### FR-1: Multi-Step Configuration Flow

**FR-1.1**: The builder MUST provide a step-by-step interface with the following steps:
- Step 1: Choose Setting
- Step 2: Choose Center Stone
- Step 3: Customize (Ring Size, Metal Type, Engraving)
- Step 4: Review & Add to Cart

**FR-1.2**: The system MUST allow customers to navigate back to previous steps to change selections.

**FR-1.3**: The system MUST persist configuration state as customers navigate between steps.

**FR-1.4**: The system MUST display progress indication showing current step and completed steps.

### FR-2: Setting Selection (Step 1)

**FR-2.1**: The system MUST display all products marked as "settings" in a grid or list view.

**FR-2.2**: The system MUST provide filters for:
- Style (Solitaire, Halo, Three-Stone, Vintage, etc.)
- Metal Type (14K White Gold, 14K Yellow Gold, 18K Rose Gold, Platinum)
- Price Range (slider)

**FR-2.3**: Each setting card MUST display:
- Primary image (thumbnail)
- Setting name
- Starting price
- Quick view icon

**FR-2.4**: The system MUST provide a detail modal showing:
- Multiple images
- Full description
- Available metal types and prices
- Compatible stone shapes
- Technical specifications

**FR-2.5**: The system MUST allow customers to select a setting, which advances to Step 2.

### FR-3: Stone Selection (Step 2)

**FR-3.1**: The system MUST display all products marked as "stones" that are compatible with the selected setting.

**FR-3.2**: The system MUST provide filters for:
- Shape (Round, Princess, Cushion, Emerald, Oval, etc.)
- Carat Weight (range slider, e.g., 0.5 - 3.0)
- Cut Grade (Excellent, Very Good, Good, Fair, Poor)
- Color Grade (D, E, F, G, H, I, J, K, L, M)
- Clarity Grade (FL, IF, VVS1, VVS2, VS1, VS2, SI1, SI2, I1)
- Price Range (slider)
- Certification (GIA, AGS, IGI, etc.)

**FR-3.3**: The system MUST display stones in a sortable table with columns:
- Image thumbnail
- Shape
- Carat
- Cut
- Color
- Clarity
- Price
- Certificate
- Select button

**FR-3.4**: The system MUST provide a details modal for each stone showing:
- High-resolution image/video
- Certificate number and link
- Detailed measurements
- Plot diagram (if available)
- Full specifications

**FR-3.5**: The system MUST allow customers to select a stone, which advances to Step 3.

### FR-4: Customization (Step 3)

**FR-4.1**: The system MUST allow customers to select ring size from standard US sizes (3-12, including half sizes).

**FR-4.2**: The system MUST allow customers to confirm or change the metal type for the setting.

**FR-4.3**: The system MUST allow customers to add optional engraving:
- Text input with character limit (25 characters)
- Display additional engraving fee

**FR-4.4**: The system MUST allow customers to add optional gift options:
- Gift wrapping (with fee)
- Gift message

**FR-4.5**: The system MUST update total price as customization options are changed.

### FR-5: Review & Cart (Step 4)

**FR-5.1**: The system MUST display a summary of the complete configuration:
- Visual preview (composite image of setting + stone)
- Setting details (name, SKU, metal type)
- Stone details (carat, shape, color, clarity, certificate)
- Customizations (ring size, engraving)
- Itemized price breakdown

**FR-5.2**: The system MUST allow customers to edit any step by clicking "Edit" buttons.

**FR-5.3**: The system MUST provide an "Add to Cart" button that:
- Creates a line item in Shopify cart
- Includes all configuration details as line item properties
- Saves configuration to database
- Redirects to cart or shows success message

**FR-5.4**: The system MUST provide a "Save Configuration" button that saves the configuration to the customer's account (if logged in) or generates a shareable link (if guest).

### FR-6: Pricing Engine

**FR-6.1**: The system MUST calculate total price as: `Setting Price (by metal type) + Stone Price + Engraving Fee + Gift Options`

**FR-6.2**: The system MUST display the running total prominently throughout the builder (e.g., sticky header/sidebar).

**FR-6.3**: The system MUST support merchant-configured markup percentages.

**FR-6.4**: The system MUST handle currency formatting based on store currency settings.

### FR-7: Admin Dashboard - Product Management

**FR-7.1**: The admin MUST provide a page to view all Shopify products.

**FR-7.2**: The admin MUST allow merchants to mark products as "Setting" or "Stone" via toggle or button.

**FR-7.3**: For products marked as "Setting", the admin MUST provide a form to input:
- Style (dropdown: Solitaire, Halo, Three-Stone, Vintage, Modern, etc.)
- Setting Height (Low, Medium, High)
- Compatible Stone Shapes (multi-select: Round, Princess, Cushion, etc.)
- Base Prices for each metal type:
  - 14K White Gold
  - 14K Yellow Gold
  - 18K Rose Gold
  - Platinum

**FR-7.4**: For products marked as "Stone", the admin MUST provide a form to input:
- Stone Type (Diamond, Sapphire, Ruby, Emerald, etc.)
- Shape (dropdown)
- Carat Weight (decimal input)
- Cut Grade (dropdown)
- Color Grade (dropdown)
- Clarity Grade (dropdown)
- Certificate Type (GIA, AGS, IGI, etc.)
- Certificate Number
- Certificate URL
- Measurements (e.g., "7.35 x 7.40 x 4.50")
- Table % (optional)
- Depth % (optional)
- Polish (optional)
- Symmetry (optional)
- Fluorescence (optional)

**FR-7.5**: The admin MUST allow bulk import of stones via CSV upload.

**FR-7.6**: The admin MUST allow bulk export of settings/stones to CSV.

### FR-8: Admin Dashboard - Configuration Management

**FR-8.1**: The admin MUST display a list of all customer configurations with columns:
- Configuration ID
- Customer Name/Email
- Setting Name
- Stone Details
- Total Price
- Status (In Progress, Completed, Ordered)
- Date Created

**FR-8.2**: The admin MUST allow filtering configurations by:
- Status
- Date range
- Price range

**FR-8.3**: The admin MUST allow viewing full configuration details.

**FR-8.4**: The admin MUST allow merchants to manually create an order from a saved configuration.

### FR-9: Admin Dashboard - Settings & Configuration

**FR-9.1**: The admin MUST provide a settings page with tabs:
- General Settings
- Pricing Rules
- Email Notifications
- Appearance

**FR-9.2**: General Settings MUST include:
- Enable/Disable Builder (toggle)
- Enable Side Stones Step (toggle, future feature)

**FR-9.3**: Pricing Rules MUST include:
- Engraving Fee (currency input)
- Gift Wrap Fee (currency input)
- Markup Percentage (percentage input)

**FR-9.4**: Email Notifications MUST include:
- Send notification to merchant on configuration save (toggle)
- Send notification to merchant on order (toggle)
- Notification email address (text input)

**FR-9.5**: Appearance MUST include:
- Primary Color (color picker)
- Accent Color (color picker)
- Logo Upload (file input)

### FR-10: Admin Dashboard - Analytics

**FR-10.1**: The admin MUST display key metrics:
- Total Configurations Created
- Configuration Completion Rate (% who reach Step 4)
- Conversion Rate (% of configurations that become orders)
- Average Order Value

**FR-10.2**: The admin MUST display a funnel chart showing drop-off at each step.

**FR-10.3**: The admin MUST display popular settings (top 10 by selection count).

**FR-10.4**: The admin MUST display popular stones (top 10 by selection count).

### FR-11: Save & Share

**FR-11.1**: The system MUST allow logged-in customers to save configurations to their account.

**FR-11.2**: The system MUST allow guest customers to save configurations by generating a unique shareable link.

**FR-11.3**: The system MUST allow customers to access saved configurations later via:
- Customer account page (if logged in)
- Direct link (for guests)

**FR-11.4**: The system MUST allow customers to share configurations via:
- Copy link button
- Email (optional, future feature)

### FR-12: Order Creation

**FR-12.1**: When a customer adds a configured ring to cart, the system MUST:
- Save the complete configuration to the database
- Generate a unique configuration ID
- Add a product to the Shopify cart with line item properties containing:
  - Setting: [Name] - [Metal Type]
  - Setting SKU: [SKU]
  - Center Stone: [Carat]ct [Shape] [Color] [Clarity]
  - Stone SKU: [SKU]
  - Stone Certificate: [Type] [Number]
  - Ring Size: [Size]
  - Engraving: [Text]
  - Configuration ID: [ID]

**FR-12.2**: The system MUST use the setting product's variant corresponding to the selected metal type.

**FR-12.3**: The system MUST update inventory quantities for both setting and stone when order is placed.

### FR-13: Webhooks & Sync

**FR-13.1**: The system MUST register webhooks for:
- Product Update
- Product Delete
- Order Create

**FR-13.2**: When a product is updated via webhook, the system MUST update cached metadata in the database.

**FR-13.3**: When a product is deleted via webhook, the system MUST mark corresponding setting/stone as unavailable.

**FR-13.4**: When an order is created via webhook, the system MUST update the configuration status to "Ordered".

### FR-14: Mobile Responsiveness

**FR-14.1**: The entire builder interface MUST be fully functional on mobile devices (iOS and Android).

**FR-14.2**: On mobile, filters MUST be accessible via a slide-in drawer or collapsible panel.

**FR-14.3**: On mobile, stone table MUST convert to card-based layout for better usability.

**FR-14.4**: All images MUST be lazy-loaded and optimized for mobile bandwidth.

---

## 5. Non-Goals (Out of Scope)

The following features are explicitly OUT OF SCOPE for the MVP:

**NG-1**: 3D visualization / 360° ring rotation (may be added in future)

**NG-2**: Augmented Reality (AR) try-on feature

**NG-3**: Virtual appointment scheduling with jewelers

**NG-4**: Live chat integration

**NG-5**: Multi-language support (English only for MVP)

**NG-6**: Multi-currency support (uses store's default currency)

**NG-7**: Integration with third-party diamond supplier APIs

**NG-8**: AI-powered recommendations

**NG-9**: Side stones / accent stones selection (saved for v2)

**NG-10**: Comparison feature (compare multiple stones side-by-side)

**NG-11**: Payment installment options

**NG-12**: Custom metal alloy options beyond standard types

---

## 6. Design Considerations

### UI/UX Guidelines

**Design Principle 1: Progressive Disclosure**
- Show only relevant information at each step
- Use modals for detailed information
- Minimize cognitive load

**Design Principle 2: Visual Hierarchy**
- Use clear headings and section divisions
- Highlight primary actions (Next, Add to Cart)
- De-emphasize secondary actions (Back, Edit)

**Design Principle 3: Trust & Transparency**
- Display certificate information prominently
- Show itemized pricing breakdown
- Include high-quality images

**Design Principle 4: Mobile-First**
- Design for mobile screens first
- Progressive enhancement for desktop
- Touch-friendly interactions (44px minimum touch targets)

### Component Design

**Color Scheme**:
- Primary: Merchant-configurable (default: #000000)
- Accent: Merchant-configurable (default: #D4AF37 - gold)
- Background: #FFFFFF
- Text: #1A1A1A
- Border: #E5E5E5
- Success: #10B981
- Error: #EF4444

**Typography**:
- Use Shopify's default font stack or merchant's theme fonts
- Headings: 24px-32px, bold
- Body: 14px-16px, regular
- Small text: 12px-14px

**Spacing**:
- Use consistent spacing scale: 4px, 8px, 16px, 24px, 32px, 48px

**Components to Use**:
- Buttons: Polaris-style buttons with variants (primary, secondary, tertiary)
- Cards: For product displays
- Tables: For stone listings (desktop)
- Modals: For details and confirmations
- Progress Indicators: Step navigation
- Form Inputs: Polaris form components

### Admin Interface

- Use Shopify Polaris Web Components exclusively for admin UI
- Follow Shopify's design guidelines
- Maintain consistency with Shopify admin experience

### Storefront Interface

- Match merchant's theme styling where possible
- Provide CSS customization options
- Ensure high contrast and accessibility

---

## 7. Technical Considerations

### Technology Stack

**Frontend**:
- React (for storefront builder)
- Polaris Web Components (for admin)
- CSS Modules or Tailwind CSS

**Backend**:
- Node.js
- React Router (existing template)
- Prisma ORM
- SQLite (dev) / PostgreSQL (production)

**Shopify Integration**:
- Admin GraphQL API
- Theme App Extension
- Webhooks
- OAuth 2.0 Authentication

### Database

**Database Choice**:
- Development: SQLite (current)
- Production: PostgreSQL (required for scaling)

**Key Models**:
- Configuration
- SettingMetadata
- StoneMetadata
- AppSettings
- AnalyticsEvent

### API Design

**RESTful Endpoints**:
- `GET /api/builder/settings` - Fetch settings with filters
- `GET /api/builder/stones` - Fetch stones with filters
- `POST /api/builder/configure` - Save configuration
- `GET /api/builder/configuration/:id` - Get configuration
- `POST /api/builder/cart` - Add to cart
- `POST /api/builder/share` - Generate share link

### Performance Considerations

**Optimization Strategies**:
1. Implement database indexing on frequently queried fields
2. Use pagination for large datasets (stones)
3. Cache product data to reduce Shopify API calls
4. Lazy load images
5. Implement debouncing on filter changes
6. Use CDN for static assets

### Security Considerations

**Security Measures**:
1. Validate all user inputs on backend
2. Sanitize engraving text input
3. Implement rate limiting on API endpoints
4. Use Shopify session tokens for authentication
5. Implement CSRF protection
6. Store sensitive data encrypted
7. Ensure proper multi-tenant data isolation (always filter by shop)

### Scalability

**Scaling Strategy**:
1. Horizontal scaling via containerization (Docker)
2. Database connection pooling
3. Caching layer (Redis, future)
4. CDN for images and static assets
5. Queue system for heavy operations (future)

---

## 8. Success Metrics

### Merchant Metrics

**Primary Metrics**:
- **Active Installations**: Number of stores with app installed and active
- **Monthly Active Stores**: Stores with at least 1 configuration in past 30 days
- **Retention Rate**: % of stores still active after 3 months
- **Revenue per Store**: Average monthly order value generated per store

**Secondary Metrics**:
- **App Store Rating**: Average rating and reviews
- **Support Tickets**: Number and type of support requests
- **Feature Adoption**: % of stores using advanced features

### Customer Metrics

**Engagement Metrics**:
- **Builder Starts**: Number of times builder is opened
- **Step Completion Rate**: % completing each step
  - Target: 70% complete Step 1, 50% complete Step 2, 30% reach Step 4
- **Configuration Save Rate**: % who save configuration
- **Share Rate**: % who share configuration

**Conversion Metrics**:
- **Add to Cart Rate**: % of completed configurations added to cart
  - Target: 40%
- **Purchase Conversion**: % of cart adds that complete checkout
  - Target: 35%
- **Overall Conversion**: % of builder starts that result in orders
  - Target: 15%

**Value Metrics**:
- **Average Order Value**: Average price of configured rings
  - Target: $8,000 - $12,000
- **AOV Uplift**: Comparison to standard product AOV
  - Target: 2-3x higher

### Technical Metrics

**Performance Metrics**:
- **Page Load Time**: Time to interactive for builder
  - Target: < 3 seconds
- **API Response Time**: Average API response time
  - Target: < 500ms
- **Error Rate**: % of requests resulting in errors
  - Target: < 1%
- **Uptime**: App availability
  - Target: 99.9%

---

## 9. Open Questions

**Q1**: Should we support custom stone shapes uploaded by merchants, or limit to predefined shapes?
- **Decision Needed**: Define complete list of supported shapes

**Q2**: How should we handle pricing for stones? Fixed price per product, or formula-based (e.g., price per carat)?
- **Decision Needed**: Support both or just fixed pricing for MVP?

**Q3**: Should merchants be able to offer financing/installment payments through the builder?
- **Decision**: Out of scope for MVP (NG-11)

**Q4**: How should we handle inventory management? Should adding to cart reserve the items?
- **Decision Needed**: Reservation logic or first-come-first-served?

**Q5**: Should we support bands/wedding rings in addition to engagement rings?
- **Decision Needed**: Scope for MVP or future feature?

**Q6**: What happens if a stone or setting becomes unavailable after customer has saved a configuration?
- **Decision Needed**: Show "unavailable" message, suggest alternatives, or hide the configuration?

**Q7**: Should we integrate with email marketing platforms (Klaviyo, Mailchimp) for abandoned configuration follow-ups?
- **Decision**: Out of scope for MVP, future feature

**Q8**: Should customers be able to request custom quotes for configurations outside the builder?
- **Decision Needed**: Include basic "Request Quote" button or not?

---

## 10. Dependencies & Constraints

### Dependencies

**Technical Dependencies**:
- Shopify store with online store 2.0 theme (for theme app extensions)
- Shopify plan that supports app installations
- Node.js 20.10+ runtime
- PostgreSQL for production deployment

**External Dependencies**:
- Shopify Admin API availability
- Shopify App Store approval (if listing publicly)
- SSL certificate for production hosting

### Constraints

**Platform Constraints**:
- Shopify API rate limits (2 requests per second per shop)
- Theme app extension limitations (no access to checkout page)
- Line item property character limits (255 characters per property)

**Business Constraints**:
- Must work with existing Shopify products (can't create separate product catalog)
- Must use Shopify's cart and checkout (can't custom checkout for Plus stores in MVP)
- Must be multi-tenant (can't be single-store solution)

**Technical Constraints**:
- Must maintain session storage for each shop
- Must handle multiple concurrent users per shop
- Must work in iframe (embedded app)

---

## 11. Timeline & Milestones

### Development Phases

**Phase 1: Foundation (Weeks 1-2)**
- Database schema implementation
- Authentication and session management
- Basic admin dashboard structure
- Milestone: Admin can log in and view dashboard

**Phase 2: Product Management (Weeks 3-4)**
- Product marking (Setting/Stone)
- Metadata input forms
- CSV import/export
- Milestone: Admin can manage settings and stones

**Phase 3: Core Builder (Weeks 5-7)**
- Storefront builder interface
- Step 1 & 2 implementation
- Step 3 & 4 implementation
- Pricing engine
- Milestone: Complete builder flow functional

**Phase 4: Order Integration (Week 8)**
- Add to cart functionality
- Order creation
- Configuration tracking
- Milestone: Orders can be placed through builder

**Phase 5: Polish & Features (Weeks 9-10)**
- Save & share functionality
- Mobile optimization
- Analytics dashboard
- Email notifications
- Milestone: MVP feature complete

**Phase 6: Testing & Launch (Weeks 11-12)**
- End-to-end testing
- Bug fixes
- Documentation
- Deployment
- Milestone: Production launch

---

## 12. Acceptance Criteria

### Definition of Done

A feature is considered "done" when:

1. ✅ Code is written and passes all unit tests
2. ✅ Feature is reviewed and approved in code review
3. ✅ Feature works on desktop and mobile
4. ✅ Feature is tested by QA/Product Owner
5. ✅ Documentation is updated
6. ✅ No critical or high-priority bugs
7. ✅ Performance meets targets
8. ✅ Accessibility requirements met (WCAG 2.1 AA minimum)

### Launch Criteria

The app is ready to launch when:

1. ✅ All FR-1 through FR-14 are implemented and tested
2. ✅ Admin can successfully mark products and manage settings
3. ✅ Customers can complete full builder flow and checkout
4. ✅ Orders are created correctly in Shopify with all details
5. ✅ Analytics dashboard displays accurate data
6. ✅ Mobile experience is fully functional
7. ✅ App passes Shopify app review requirements
8. ✅ Documentation is complete (merchant guide, API docs)
9. ✅ Production infrastructure is set up and tested
10. ✅ At least 3 beta merchants have successfully tested

---

## 13. Approval

**Product Owner**: _______________ Date: _______________

**Tech Lead**: _______________ Date: _______________

**Stakeholders**: _______________ Date: _______________

---

**End of PRD**
