# Complete Testing Guide - Ring Builder App

This comprehensive guide will walk you through testing all features of the Ring Builder Shopify app, including the new theme customization, onboarding flow, and embed functionality.

## Prerequisites

- Node.js 18+ and npm/bun installed
- Shopify Partner account
- Development store access
- PostgreSQL database (Neon or local)

## Part 1: Initial Setup & Installation

### 1.1 Environment Setup

1. **Clone and install dependencies**:
   ```bash
   cd /path/to/shopify-gem-finder
   bun install
   ```

2. **Configure environment variables**:
   ```bash
   cp .env.example .env
   ```

   Required variables in `.env`:
   ```
   DATABASE_URL=your-postgresql-connection-string
   SHOPIFY_API_KEY=your-api-key
   SHOPIFY_API_SECRET=your-api-secret
   SHOPIFY_APP_URL=https://your-app-url.com
   SCOPES=write_products,read_products,write_orders,read_orders,write_customers,read_customers,write_content,read_content,read_online_store_pages,write_online_store_navigation,read_online_store_navigation
   ```

3. **Initialize database**:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Start development server**:
   ```bash
   bun dev
   # or
   shopify app dev
   ```

### 1.2 Create a Development Store

1. Go to Shopify Partners Dashboard: https://partners.shopify.com
2. Click "Stores" → "Add store"
3. Select "Development store"
4. Fill in store details:
   - Store name: e.g., "Ring Builder Test Store"
   - Store type: "Developer Preview" or "Development"
5. Click "Create development store"
6. Save the store URL (e.g., `ring-builder-test.myshopify.com`)

### 1.3 Install App on Development Store

1. **Using Shopify CLI**:
   ```bash
   shopify app dev
   ```

2. Select your development store from the list
3. Browser will open with app installation prompt
4. Click "Install app"
5. Grant permissions when prompted

**Expected Result**: You should be redirected to the app's onboarding flow.

---

## Part 2: Testing Onboarding Flow

The app now features a 6-step onboarding process. Let's test each step.

### 2.1 Step 1 - Welcome

**Test Steps**:
1. After installing, you should see the Welcome screen
2. Verify the UI shows:
   - Welcome message "Welcome to Ring Builder! 💎"
   - List of benefits
   - "Get Started →" button
3. Click "Get Started"

**Expected Result**: Progress bar shows 1/6 complete, moves to Step 2.

### 2.2 Step 2 - Create Ring Builder Page

**Test Steps**:
1. Verify form fields are pre-filled:
   - Page Title: "Design Your Ring"
   - Page Handle: "design-your-ring"
2. Optionally change values (e.g., "Custom Ring Builder", "custom-rings")
3. Click "Create Page"

**Expected Result**:
- Button shows "Creating..." briefly
- Page reloads
- Progress bar shows 2/6 complete
- Button changes to "✓ Page Created"
- Moves to Step 3

**Verify in Shopify Admin**:
1. Go to: Shopify Admin → Online Store → Pages
2. Verify page was created with correct title
3. Open the page to verify iframe embed code is present

### 2.3 Step 3 - Add to Navigation Menu

**Test Steps**:
1. Verify menu handle field shows "main-menu"
2. Click "Add to Menu"

**Expected Result**:
- Button shows "Adding..." briefly
- Page reloads
- Button changes to "✓ Added to Menu"
- Progress bar shows 3/6 complete

**Alternative Test - Skip Menu**:
1. Click "Skip for Now" button
2. Should move to Step 4 without adding to menu

**Verify in Shopify Admin**:
1. Go to: Shopify Admin → Online Store → Navigation
2. Open "Main menu"
3. Verify "Design Your Ring" link is present

### 2.4 Step 4 - Customize Theme

**Test Steps**:
1. Review theme customization options listed
2. Click "Go to Theme Settings"

**Expected Result**:
- Navigates to `/app/builder/settings?tab=theme`
- Theme & Branding tab is active

**Theme Customization Test**:
1. Change Primary Color (e.g., #0066CC)
2. Change Accent Color (e.g., #FFD700)
3. Adjust Border Radius slider (e.g., 12px)
4. Change Font Family (e.g., "Playfair Display")
5. Select Button Style (e.g., "Pill")
6. Toggle Dark Mode on
7. Click "Save Settings"

**Expected Result**: Success message appears.

**Return to Onboarding**:
1. Navigate back to `/app/onboarding`
2. Click "Skip for Now" or manually mark as configured
3. Should move to Step 5

### 2.5 Step 5 - Test Builder

**Test Steps**:
1. Click "Open Ring Builder"

**Expected Result**:
- New tab opens with the Ring Builder page
- URL should be your store's page URL (e.g., `yourstore.com/pages/design-your-ring`)
- Builder loads with theme colors applied

**Builder Functional Test**:
1. Verify theme colors are applied (primary, accent)
2. Test browsing ring settings (if products exist)
3. Test browsing diamonds (if products exist)
4. Check mobile responsiveness

**Mark as Tested**:
1. Return to onboarding tab
2. Click "Mark as Tested"
3. Should move to Step 6

### 2.6 Step 6 - Complete

**Test Steps**:
1. Review completion screen
2. Read "Next Steps" list
3. Click "Go to Dashboard →"

**Expected Result**:
- Redirects to `/app` (main dashboard)
- Onboarding is marked complete
- If you navigate back to `/app/onboarding`, should redirect to dashboard

---

## Part 3: Testing Theme Customization

Navigate to `/app/builder/settings?tab=theme`

### 3.1 Color Customization

**Test Each Color Picker**:
1. **Primary Color**:
   - Click color picker
   - Select a color (e.g., #663399)
   - Verify hex input updates
   - Type a hex value directly (e.g., #FF5733)
   - Verify color picker updates

2. **Accent Color**: Repeat above
3. **Background Color**: Repeat above
4. **Text Color**: Repeat above

**Test Live Preview**:
- Verify preview panel updates in real-time as you change colors
- Check preview buttons show correct colors

### 3.2 Button Styles

**Test Each Button Style**:
1. Click "Rounded" → Verify preview shows rounded corners
2. Click "Square" → Verify preview shows sharp corners
3. Click "Pill" → Verify preview shows fully rounded buttons

### 3.3 Border Radius

**Test Slider**:
1. Drag slider from 0 to 24
2. Verify preview card corners update in real-time
3. Verify number displays current value

### 3.4 Font Family

**Test Font Dropdown**:
1. Select "Inter" → Verify preview text changes
2. Select "Playfair Display" → Verify serif font applies
3. Select "Roboto Mono" → Verify monospace applies

### 3.5 Dark Mode

**Test Toggle**:
1. Toggle "Enable Dark Mode" ON
2. Verify preview background turns dark
3. Verify text colors invert
4. Toggle OFF
5. Verify returns to light mode

### 3.6 Custom CSS

**Test Custom CSS Input**:
1. Enter custom CSS:
   ```css
   .builder-app button {
     box-shadow: 0 4px 6px rgba(0,0,0,0.1);
     font-weight: bold;
   }
   ```
2. Click "Save Settings"
3. Verify settings save successfully

### 3.7 Save & Persistence

**Test Save Functionality**:
1. Make multiple changes (colors, fonts, etc.)
2. Click "Save Settings"
3. Wait for success message
4. Refresh the page
5. Verify all settings persist

---

## Part 4: Testing Public Builder Route

Test the customer-facing Ring Builder.

### 4.1 Access Builder Page

**Via Onboarding-Created Page**:
1. Go to your store: `yourstore.myshopify.com/pages/design-your-ring`
2. Verify page loads with iframe
3. Verify builder loads inside iframe

**Direct Route Access**:
1. Navigate to: `https://your-app-url.com/builder?shop=yourstore.myshopify.com`
2. Verify builder loads directly
3. Verify theme colors are applied

### 4.2 Theme Application Test

**Verify Theme is Applied**:
1. Check primary color appears on main buttons
2. Check accent color appears on secondary elements
3. Check background color is correct
4. Check text color is legible
5. Check border radius matches settings
6. Check font family matches settings

### 4.3 Responsive Design

**Test on Different Screen Sizes**:
1. Desktop (1920x1080)
2. Tablet (768x1024)
3. Mobile (375x667)

**Verification**:
- Layout adapts appropriately
- Text remains readable
- Buttons are easily clickable
- No horizontal scrolling

---

## Part 5: Testing Embed Functionality

Test the iframe embed system for external sites.

### 5.1 Access Embed Code Generator

**Navigate to Embed Page**:
1. In app, navigate to: `/app/builder/embed`
2. Verify page loads with:
   - Live Preview section
   - HTML Embed Code section
   - WordPress Integration section
   - Technical Details

### 5.2 Live Preview Test

**Test Embedded Builder**:
1. Verify live preview iframe loads
2. Verify builder is functional in preview
3. Verify theme colors are applied

### 5.3 Copy Embed Code

**Test Copy Functionality**:
1. Click "Copy Code" button on HTML embed section
2. Verify button changes to "✓ Copied!"
3. Paste into a text editor
4. Verify code contains:
   - Iframe with correct src URL
   - Auto-resize script
   - Proper styling

### 5.4 Customization Options

**Test Iframe Height**:
1. Change iframe height slider (e.g., 1000px)
2. Verify embed code updates
3. Copy code and verify new height is included

### 5.5 External Embedding Test

**Create Test HTML File**:

1. Create a file `test-embed.html`:
   ```html
   <!DOCTYPE html>
   <html lang="en">
   <head>
     <meta charset="UTF-8">
     <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <title>Ring Builder Embed Test</title>
   </head>
   <body>
     <h1>My Custom Ring Builder</h1>

     <!-- Paste your copied embed code here -->

   </body>
   </html>
   ```

2. Paste your copied embed code
3. Open file in browser
4. **Verify**:
   - Iframe loads
   - Builder is functional
   - Auto-resize works (check browser console for postMessage events)
   - Theme is applied

### 5.6 WordPress Simulation

**Test WordPress Instructions**:
1. Read WordPress integration instructions
2. Copy WordPress shortcode
3. Verify shortcode format: `[ring_builder url="..."]`

**Note**: Actual WordPress testing requires a WordPress site with shortcode plugin.

---

## Part 6: Testing Embed Route (Public Embeddable)

Test the public embed route directly.

### 6.1 Access Embed Route

**With Shop Parameter**:
1. Navigate to: `https://your-app-url.com/embed/builder?shop=yourstore.myshopify.com`
2. Verify builder loads
3. Verify theme is applied

**With Tenant ID** (if you have merchant in DB):
1. Get merchant ID from database
2. Navigate to: `https://your-app-url.com/embed/builder?tenantId=your-tenant-id`
3. Verify builder loads with correct tenant's theme

### 6.2 CORS & Iframe Headers Test

**Check Headers**:
1. Open browser DevTools → Network tab
2. Refresh embed route
3. Click on the document request
4. Verify headers include:
   - `X-Frame-Options: ALLOWALL`
   - `Content-Security-Policy: frame-ancestors *`
   - `Access-Control-Allow-Origin: *`

### 6.3 Auto-Resize Test

**Test Iframe Communication**:
1. Open embed route in browser
2. Open DevTools → Console
3. Look for postMessage events
4. Verify messages contain:
   - `type: "ring-builder-resize"`
   - `height: <number>`
   - `tenantId: <string>`

---

## Part 7: Testing Shopify Pages Service

Test the page creation and menu management functions.

### 7.1 Manual Page Creation Test

**Using Admin API Directly**:

1. Navigate to `/app/builder/settings` or any admin page
2. Open browser console
3. Run this test (replace with actual values):

```javascript
// Test page creation
fetch('/api/admin/test-page-creation', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Test Ring Builder Page',
    handle: 'test-ring-builder',
  }),
}).then(r => r.json()).then(console.log);
```

**Expected Result**: Page is created in Shopify admin.

### 7.2 Menu Addition Test

**Verify Menu Linking**:
1. Complete onboarding (or re-run Step 3)
2. Go to Shopify Admin → Navigation → Main Menu
3. Verify Ring Builder page link exists
4. Click link to verify it points to correct page

---

## Part 8: Testing Onboarding Service

Test the onboarding state management.

### 8.1 Check Onboarding State

**View Current State**:
1. Open browser DevTools
2. Navigate to `/app/onboarding`
3. In console, check loader data:

```javascript
// This will show the onboarding state
console.log(window.__remixContext.state.loaderData['routes/app.onboarding']);
```

**Verify State Object**:
- `completed`: boolean
- `currentStep`: 1-6
- `steps`: object with welcome, pageCreated, menuAdded, themeConfigured, tested
- `builderPageId`: GID if page created
- `builderPageHandle`: string if page created

### 8.2 Reset Onboarding (Testing)

**Use Reset Script**:
```bash
# Create reset script if not exists
node scripts/reset-onboarding.ts
```

Or manually in console on `/app/onboarding`:
```javascript
// Reset onboarding for current shop
fetch('/api/admin/reset-onboarding', {
  method: 'POST',
}).then(r => r.json()).then(console.log);
```

**Expected Result**:
- Onboarding resets to Step 1
- All steps marked incomplete
- Can go through onboarding again

---

## Part 9: Integration Testing

Test complete user workflows.

### 9.1 Complete New Merchant Flow

**Simulate New Merchant**:
1. Uninstall and reinstall app
2. Complete full onboarding (Steps 1-6)
3. Customize theme
4. Add test products
5. Test builder on storefront
6. Get embed code
7. Test embed on external HTML page

**Expected Result**: Entire flow works smoothly without errors.

### 9.2 Theme Changes Propagation

**Test Theme Updates Across Routes**:
1. Set theme colors in Settings
2. Verify colors appear on:
   - `/builder?shop=...` (public builder)
   - `/embed/builder?shop=...` (embed route)
   - Store page created during onboarding
3. Change theme colors
4. Refresh all routes
5. Verify new colors appear everywhere

### 9.3 Multi-Tenant Test

**If you have multiple stores**:
1. Install app on Store A
2. Install app on Store B
3. Customize theme differently for each
4. Access builders for both:
   - `/builder?shop=store-a.myshopify.com`
   - `/builder?shop=store-b.myshopify.com`
5. Verify each shows their own theme

---

## Part 10: Error Handling & Edge Cases

### 10.1 Invalid Shop Parameter

**Test**:
1. Navigate to: `/builder?shop=invalid-shop.myshopify.com`
2. **Expected**: Error message or default catalog

### 10.2 Missing Tenant ID

**Test**:
1. Navigate to: `/embed/builder?tenantId=nonexistent-id`
2. **Expected**: 404 error or "Merchant not found"

### 10.3 Page Already Exists

**Test**:
1. Complete onboarding Step 2 (create page)
2. Try to create another page with same handle
3. **Expected**: Error message "Page already exists with this handle"

### 10.4 Invalid Menu Handle

**Test**:
1. In Step 3, enter invalid menu handle (e.g., "nonexistent-menu")
2. Click "Add to Menu"
3. **Expected**: Error message "Menu with handle 'nonexistent-menu' not found"

---

## Part 11: Performance Testing

### 11.1 Builder Load Time

**Test**:
1. Open `/builder?shop=...` in incognito
2. Open DevTools → Network tab
3. Record page load time
4. **Target**: < 3 seconds for initial load

### 11.2 Theme Save Performance

**Test**:
1. Make multiple theme changes
2. Click Save
3. Time the save operation
4. **Target**: < 1 second for save

### 11.3 Embed Route Performance

**Test**:
1. Load `/embed/builder?shop=...`
2. Check load time
3. **Target**: < 2 seconds

---

## Part 12: Database Verification

### 12.1 Check AppSettings

**Query Database**:
```sql
SELECT
  shop,
  primaryColor,
  accentColor,
  backgroundColor,
  textColor,
  borderRadius,
  fontFamily,
  buttonStyle,
  darkMode,
  customCSS
FROM "AppSettings"
WHERE shop = 'yourstore.myshopify.com';
```

**Verify**:
- All theme fields have correct values
- Values match what you set in Settings

### 12.2 Check Merchant Onboarding State

**Query Database**:
```sql
SELECT
  shop,
  settings
FROM "Merchant"
WHERE shop = 'yourstore.myshopify.com';
```

**Verify**:
- `settings` JSON contains `onboarding` object
- `onboarding.completed` is true after finishing
- `onboarding.builderPageId` is set
- `onboarding.builderPageHandle` is set

---

## Part 13: Browser Compatibility

Test on multiple browsers:

### 13.1 Desktop Browsers
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)

### 13.2 Mobile Browsers
- ✅ Chrome Mobile (Android)
- ✅ Safari Mobile (iOS)

**Test on Each**:
1. Load builder
2. Test theme customization
3. Test embed code
4. Verify no console errors

---

## Part 14: Security Testing

### 14.1 CORS Policy

**Test**:
1. Try to load embed from different domain
2. **Expected**: Works due to `Access-Control-Allow-Origin: *`

### 14.2 XSS Prevention

**Test**:
1. Try to inject script in page title during onboarding:
   ```
   <script>alert('XSS')</script>
   ```
2. **Expected**: Script is escaped, not executed

### 14.3 CSRF Protection

**Test**:
1. Verify all POST requests include CSRF token
2. Try to make POST request without token
3. **Expected**: Request is rejected

---

## Part 15: Cleanup & Maintenance

### 15.1 Reset Test Data

**Clean up test pages**:
1. Go to Shopify Admin → Pages
2. Delete test pages created during testing
3. Go to Navigation → Main Menu
4. Remove test menu items

### 15.2 Reset Onboarding

```bash
node scripts/reset-onboarding.ts
```

### 15.3 Clear Database Test Data

```sql
-- Reset onboarding for a shop
UPDATE "Merchant"
SET settings = NULL
WHERE shop = 'yourstore.myshopify.com';

-- Reset app settings
UPDATE "AppSettings"
SET
  primaryColor = '#6B2C3E',
  accentColor = '#D4AF37',
  backgroundColor = '#FFFFFF',
  textColor = '#000000',
  borderRadius = 8,
  fontFamily = 'system-ui',
  buttonStyle = 'rounded',
  darkMode = false,
  customCSS = NULL
WHERE shop = 'yourstore.myshopify.com';
```

---

## Common Issues & Troubleshooting

### Issue: "These scopes are invalid"
**Solution**: Verify `shopify.app.toml` has correct scopes:
```toml
scopes = "write_products,read_products,write_orders,read_orders,write_customers,read_customers,write_content,read_content,read_online_store_pages,write_online_store_navigation,read_online_store_navigation"
```

### Issue: Theme not applying
**Solution**:
1. Check AppSettings record exists in database
2. Verify theme service is loading correctly
3. Check browser console for errors
4. Verify ThemeProvider is wrapping BuilderApp

### Issue: Page creation fails
**Solution**:
1. Verify shop has correct API permissions
2. Check Shopify API scopes include `write_content`
3. Verify page handle doesn't already exist

### Issue: Embed iframe not loading
**Solution**:
1. Check CORS headers are set
2. Verify embed URL is correct
3. Check browser console for CSP errors
4. Verify `X-Frame-Options` header allows embedding

---

## Test Checklist Summary

Use this checklist to track your testing progress:

- [ ] Environment setup complete
- [ ] Development store created
- [ ] App installed successfully
- [ ] Onboarding Step 1 - Welcome
- [ ] Onboarding Step 2 - Create Page
- [ ] Onboarding Step 3 - Add to Menu
- [ ] Onboarding Step 4 - Theme Customization
- [ ] Onboarding Step 5 - Test Builder
- [ ] Onboarding Step 6 - Complete
- [ ] Theme colors customization
- [ ] Button styles customization
- [ ] Font family customization
- [ ] Dark mode toggle
- [ ] Custom CSS functionality
- [ ] Public builder route (`/builder?shop=...`)
- [ ] Embed code generator
- [ ] Live preview in embed page
- [ ] External HTML embedding test
- [ ] Embed route (`/embed/builder?shop=...`)
- [ ] Auto-resize iframe functionality
- [ ] CORS headers verification
- [ ] Theme persistence across routes
- [ ] Multi-tenant theme isolation
- [ ] Error handling (invalid shop, tenant ID)
- [ ] Performance benchmarks
- [ ] Database verification
- [ ] Browser compatibility (Chrome, Firefox, Safari, Edge)
- [ ] Mobile responsiveness
- [ ] Security testing (XSS, CSRF)

---

## Next Steps After Testing

Once all tests pass:

1. **Deploy to Production**:
   - Set up production environment variables
   - Deploy to Vercel/hosting platform
   - Update `SHOPIFY_APP_URL` in Shopify Partners

2. **Submit to Shopify App Store**:
   - Complete app listing
   - Add screenshots and demo video
   - Submit for review

3. **Monitor**:
   - Set up error tracking (Sentry, etc.)
   - Monitor performance
   - Track user onboarding completion rates

4. **Documentation**:
   - Create merchant-facing setup guide
   - Create video tutorial
   - Update support documentation

---

## Support & Resources

- Shopify Admin API Docs: https://shopify.dev/docs/api/admin-graphql
- React Router v7 Docs: https://reactrouter.com/
- Prisma Docs: https://www.prisma.io/docs
- Shopify App CLI: https://shopify.dev/docs/apps/tools/cli

---

**Testing Complete!** 🎉

If all tests pass, your Ring Builder app is ready for production deployment and Shopify App Store submission.
