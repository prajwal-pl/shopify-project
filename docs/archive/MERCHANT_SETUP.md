# Merchant Setup Guide - Ring Builder App

**Welcome to the Ring Builder App!**  
**Setup Time:** 30-60 minutes  
**Last Updated:** October 12, 2025

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Initial Configuration](#initial-configuration)
4. [Adding Ring Settings](#adding-ring-settings)
5. [Adding Stones](#adding-stones)
6. [Bulk Import (CSV)](#bulk-import-csv)
7. [Configuring Builder Settings](#configuring-builder-settings)
8. [Adding Builder to Your Storefront](#adding-builder-to-your-storefront)
9. [Testing Your Setup](#testing-your-setup)
10. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before installing the Ring Builder app, ensure you have:

- ✅ A Shopify store on a paid plan (or development store)
- ✅ Online Store 2.0 compatible theme
- ✅ Admin access to your Shopify store
- ✅ At least 5-10 products ready to mark as settings or stones
- ✅ Product images uploaded to Shopify
- ✅ Basic understanding of your inventory (settings vs. stones)

---

## Installation

### Step 1: Install the App

1. Navigate to the Shopify App Store or use the installation link provided
2. Click **"Add app"**
3. Review the permissions requested:
   - Read and write products
   - Read and write orders
   - Read and write customers
4. Click **"Install app"**
5. Wait for installation to complete (30-60 seconds)

### Step 2: First Launch

1. After installation, you'll be redirected to the app dashboard
2. You should see the Ring Builder admin interface
3. Navigation menu: **Products**, **Settings**, **Dashboard**

**✅ Installation Complete!**

---

## Initial Configuration

### Step 3: Configure Builder Settings

Before adding products, configure your builder preferences:

1. Click **"Settings"** in the navigation menu
2. You'll see 3 tabs: **General**, **Pricing Rules**, **Side Stones**

**General Settings Tab:**
- **Enable Builder**: Toggle ON (enabled by default)
- Note the app block URL for storefront integration (later step)

**Pricing Rules Tab:**
- **Markup Percentage**: Enter your desired markup (e.g., 5 for 5%)
  - This applies to the total (setting + stone + side stones)
  - Example: If total is $6,000 and markup is 5%, customer pays $6,300

**Side Stones Configuration Tab:**
- **Enable Side Stones**: Toggle ON if you offer side stones
- **Quality Options**: Enter comma-separated options (e.g., "Good, Better, Best, Premium")
- **Pricing**: Enter price per stone for each quality level
- **Min/Max Quantity**: Set minimum and maximum side stones allowed

3. Click **"Save Settings"**
4. Success message should appear

**✅ Configuration Complete!**

---

## Adding Ring Settings

### Step 4: Mark Products as Settings

**Settings** are the ring bands/mounts that hold the center stone.

1. Navigate to **Products** page
2. Find a product you want to use as a ring setting
3. Click **"Mark as Setting"** button on the product card
4. The product page will reload with a metadata form

### Step 5: Add Setting Metadata

Fill in the following fields:

**Required Fields:**

- **Style**: Select from dropdown (Solitaire, Halo, Three-Stone, Vintage, Modern, Pavé, Channel, Tension)
- **Setting Height**: Select Low, Medium, or High
- **Compatible Stone Shapes**: Check all shapes that fit this setting
  - Example: A solitaire might accept Round, Cushion, Oval
- **Base Prices by Metal Type**: Enter prices for each metal
  - 14K White Gold: $1,200
  - 14K Yellow Gold: $1,250
  - 18K Rose Gold: $1,400
  - Platinum: $1,800

**Optional Fields:**

- **Featured**: Toggle ON to feature this setting prominently

**Example:**

```
Product: "Classic Solitaire Ring"
Style: Solitaire
Height: Medium
Compatible Shapes: ✓ Round ✓ Cushion ✓ Oval
Prices:
  14K White Gold: $1,200
  14K Yellow Gold: $1,250
  18K Rose Gold: $1,400
  Platinum: $1,800
Featured: ON
```

3. Click **"Save Metadata"**
4. Success message appears
5. Product now shows "Setting" badge

**Repeat** for all setting products (recommend at least 3-5 settings).

**✅ Settings Added!**

---

## Adding Stones

### Step 6: Mark Products as Stones

**Stones** are the center diamonds/gemstones for the rings.

1. Navigate to **Products** page
2. Find a product you want to use as a stone
3. Click **"Mark as Stone"** button
4. The product page will reload with a metadata form

### Step 7: Add Stone Metadata

Fill in the following fields:

**Required Fields:**

- **Stone Type**: Diamond, Sapphire, Ruby, Emerald, Other
- **Shape**: Round, Princess, Cushion, Emerald, Oval, etc.
- **Carat Weight**: Enter decimal (e.g., 1.50)
- **Cut Grade**: Excellent, Very Good, Good, Fair, Poor
- **Color Grade**: D, E, F, G, H, I, J, K, L, M
- **Clarity Grade**: FL, IF, VVS1, VVS2, VS1, VS2, SI1, SI2, I1, I2, I3
- **Certificate Type**: GIA, AGS, IGI, EGL, HRD, None
- **Certificate Number**: Enter certificate number (if available)
- **Price**: Enter stone price (e.g., 8999.00)

**Optional Fields:**

- **Certificate URL**: Link to certificate (if available)
- **Measurements**: Dimensions in mm (e.g., "7.35 x 7.40 x 4.50")
- **Table %**: Percentage (e.g., 57)
- **Depth %**: Percentage (e.g., 61.5)
- **Polish**: Excellent, Very Good, Good, Fair
- **Symmetry**: Excellent, Very Good, Good, Fair
- **Fluorescence**: None, Faint, Medium, Strong, Very Strong

**Example:**

```
Product: "1.50ct Round Diamond - G VS1"
Stone Type: Diamond
Shape: Round
Carat: 1.50
Cut: Excellent
Color: G
Clarity: VS1
Certificate: GIA
Certificate Number: 2141234567
Certificate URL: https://gia.edu/report-check?reportno=2141234567
Price: 8999.00
Measurements: 7.35 x 7.40 x 4.50
Table %: 57
Depth %: 61.5
Polish: Excellent
Symmetry: Excellent
Fluorescence: None
```

3. Click **"Save Metadata"**
4. Success message appears
5. Product now shows "Stone" badge

**For a few stones:** Repeat this process for 3-5 stones manually.

**For many stones:** Use bulk import (next section).

**✅ Stones Added!**

---

## Bulk Import (CSV)

### Step 8: Prepare CSV File

If you have many stones to import, use the CSV bulk import feature.

1. Click **"Import CSV"** button on the Products page
2. Click **"Download Template"** to get the CSV template
3. Open the template in Excel or Google Sheets

**Template Columns:**

```csv
productId,stoneType,shape,carat,cut,color,clarity,certificate,certificateNumber,certificateUrl,measurements,tablePercent,depthPercent,polish,symmetry,fluorescence,price,available
gid://shopify/Product/123,Diamond,Round,1.50,excellent,G,VS1,GIA,2141234567,https://gia.edu/...,7.35 x 7.40 x 4.50,57,61.5,Excellent,Excellent,None,8999.00,true
gid://shopify/Product/456,Diamond,Princess,1.20,very_good,F,VVS2,GIA,2141234568,https://gia.edu/...,5.50 x 5.55 x 3.80,58,62,Very Good,Excellent,Faint,7500.00,true
```

**Tips:**
- Product ID must be the full Shopify GID: `gid://shopify/Product/[ID]`
- Use lowercase_with_underscores for: shape, cut, color, clarity, certificate
- Carat as decimal: 1.50 (not "1.50ct")
- Price as number: 8999.00 (no currency symbol)
- Available: true or false

### Step 9: Import CSV

1. Save your CSV file
2. Click **"Choose File"** in the import modal
3. Select your CSV file
4. Click **"Import"**
5. Wait for processing (large files may take 1-2 minutes)
6. Review import summary:
   - ✅ "45 stones imported successfully"
   - ⚠️ "5 errors" (if any)
7. If errors, expand error details to see which rows failed
8. Fix errors in CSV and re-import failed rows

**✅ Bulk Import Complete!**

---

## Configuring Builder Settings

### Step 10: Review and Adjust Settings

Return to **Settings** page to fine-tune your configuration:

**General Settings:**
- Ensure **Enable Builder** is ON
- Copy the app block URL/instructions for storefront integration

**Pricing Rules:**
- Adjust **Markup Percentage** if needed
- Higher markup = higher customer prices

**Side Stones:**
- Enable/disable based on your inventory
- Adjust quality options and pricing
- Set realistic min/max quantities

**Save** any changes.

**✅ Builder Configuration Complete!**

---

## Adding Builder to Your Storefront

### Step 11: Add Theme App Extension (Online Store 2.0)

1. Navigate to **Shopify Admin → Online Store → Themes**
2. Click **"Customize"** on your active theme
3. In the theme editor, navigate to the page where you want the builder
   - Recommended: Create a dedicated page (e.g., "/pages/build-a-ring")
4. Click **"Add section"** or **"Add block"**
5. Look for **"Apps"** category
6. Find **"Ring Builder"** app block
7. Click to add it to the page
8. Position the block where desired
9. Click **"Save"**
10. Click **"Publish"** to make it live

### Step 12: Create Navigation Link (Optional)

1. Navigate to **Shopify Admin → Online Store → Navigation**
2. Choose a menu (e.g., Main menu)
3. Click **"Add menu item"**
4. Name: "Build a Ring" or "Custom Rings"
5. Link: Select the page with the builder
6. Click **"Save menu"**

**✅ Builder is Live on Your Storefront!**

---

## Testing Your Setup

### Step 13: Test the Complete Flow

1. **Visit your storefront** as a customer
2. Navigate to the builder page
3. **Step 1: Choose Setting**
   - Do you see your settings displayed?
   - Try filtering by style and metal type
   - Select a setting
4. **Step 2: Select Stone**
   - Do you see stones compatible with your setting?
   - Try filtering by carat, cut, color, clarity
   - Select a stone
5. **Step 3: Customize**
   - Select a ring size
   - Configure side stones (if enabled)
6. **Step 4: Review**
   - Review configuration
   - Check price calculation
   - Click "Add to Cart"
7. **Checkout**
   - View cart
   - Verify line item properties show all details
   - Complete checkout (test order)

**Verify:**
- ✅ All steps work smoothly
- ✅ Prices calculate correctly
- ✅ Images load properly
- ✅ Mobile experience works
- ✅ Cart shows configuration details
- ✅ Order appears in Shopify admin

**✅ Setup Validated!**

---

## Common Configuration Examples

### Example 1: Simple Setup (Minimal)

**Settings:** 3 solitaire settings  
**Stones:** 10-20 diamonds (various sizes)  
**Side Stones:** Disabled  
**Markup:** 0%

**Best For:**
- Getting started quickly
- Testing the app
- Simple inventory

### Example 2: Standard Setup (Recommended)

**Settings:** 5-10 settings (various styles)  
**Stones:** 50-100 diamonds  
**Side Stones:** Enabled with 3 quality levels  
**Markup:** 5-10%

**Best For:**
- Most jewelry stores
- Balanced configuration
- Good customer choice

### Example 3: Premium Setup (Advanced)

**Settings:** 15-20 settings (all styles)  
**Stones:** 200-500 diamonds  
**Side Stones:** Enabled with 4+ quality levels  
**Markup:** 10-15%

**Best For:**
- Established jewelers
- Large inventory
- Premium pricing

---

## Troubleshooting

### Issue: Products Don't Appear in Builder

**Cause:** Products not marked or metadata missing

**Solution:**
1. Go to **Products** page in app admin
2. Verify products have "Setting" or "Stone" badge
3. If missing, mark the product
4. Verify metadata is filled correctly
5. Save metadata

### Issue: Prices Don't Match

**Cause:** Incorrect base prices or markup

**Solution:**
1. Check **Settings → Pricing Rules** for markup %
2. Go to product edit page
3. Verify base prices for settings
4. Verify stone prices
5. Recalculate expected total: (Setting + Stone + Side Stones) × (1 + Markup %)

### Issue: Stones Don't Show in Step 2

**Cause:** Shape incompatibility

**Solution:**
1. Edit the setting metadata
2. Check **Compatible Shapes** checkboxes
3. Ensure stone shapes match compatible shapes
4. Save and test again

### Issue: Builder Not Showing on Storefront

**Cause:** Theme app block not added

**Solution:**
1. Go to **Online Store → Themes → Customize**
2. Navigate to the target page
3. Add **"Ring Builder"** app block
4. Save and publish

### Issue: CSV Import Fails

**Cause:** Invalid data format or GIDs

**Solution:**
1. Download the template again
2. Verify product IDs are full GIDs: `gid://shopify/Product/[ID]`
3. Check for typos in cut/color/clarity values
4. Ensure price is a number (no $ symbol)
5. Re-import with corrected data

### Issue: Images Not Showing

**Cause:** No images on Shopify product

**Solution:**
1. Go to Shopify admin → Products
2. Open the product
3. Add at least one high-quality image
4. Save product
5. Webhook will automatically sync image (wait 1-2 minutes)
6. Refresh builder to see image

---

## Best Practices

### Product Setup

1. **Use High-Quality Images**
   - Minimum 800x800px
   - White or neutral background
   - Multiple angles for settings

2. **Write Clear Descriptions**
   - Highlight unique features
   - Mention metal type, style
   - Include care instructions

3. **Set Realistic Prices**
   - Research competitor pricing
   - Factor in your markup
   - Include labor and overhead

4. **Organize with Collections**
   - Create Shopify collections for settings and stones
   - Use tags for easier management

### Inventory Management

1. **Start Small**
   - Begin with 5 settings, 20 stones
   - Expand as you learn customer preferences

2. **Update Regularly**
   - Check availability monthly
   - Update prices as costs change
   - Add new products seasonally

3. **Use CSV for Bulk Updates**
   - Export current data
   - Make changes in spreadsheet
   - Re-import to update

### Customer Experience

1. **Offer Variety**
   - Multiple styles (solitaire, halo, vintage)
   - Range of carat weights (0.5ct - 3ct+)
   - Various price points

2. **Quality Certificates**
   - Prioritize GIA or AGS certified stones
   - Add certificate numbers for trust
   - Include certificate URLs when possible

3. **Clear Photography**
   - Use consistent lighting
   - Show scale (with ring sizer)
   - Display multiple angles

---

## Pricing Strategy

### Understanding Total Price Calculation

```
Customer Price = (Setting + Stone + Side Stones) × (1 + Markup %)
```

**Example:**
- Setting (14K White Gold): $1,200
- Stone (1.50ct G VS1): $8,000
- Side Stones (12 Premium): $1,800
- Subtotal: $11,000
- Markup (5%): $550
- **Total: $11,550**

### Recommended Markup Levels

- **0-3%**: Competitive pricing, high volume
- **5-10%**: Standard retail markup
- **10-15%**: Premium positioning
- **15%+**: Luxury/boutique pricing

Choose based on your market positioning and overhead costs.

---

## Maintenance

### Weekly Tasks

- [ ] Check for new orders with ring configurations
- [ ] Verify all stone products are in stock
- [ ] Respond to any customer questions

### Monthly Tasks

- [ ] Review popular settings and stones
- [ ] Update prices if costs changed
- [ ] Add new products to inventory
- [ ] Export data for backup

### Quarterly Tasks

- [ ] Audit product metadata for accuracy
- [ ] Review and adjust markup percentage
- [ ] Analyze conversion rates
- [ ] Plan inventory expansion

---

## Getting Help

### Support Resources

- **Documentation**: `docs/` folder in app
- **API Testing**: `docs/API_TESTING.md`
- **Testing Checklist**: `docs/TESTING_CHECKLIST.md`

### Common Questions

**Q: Can I use existing product images?**  
A: Yes! The app uses your existing Shopify product images automatically.

**Q: How many stones can I add?**  
A: No limit! The app is optimized for 200-1,000+ stones.

**Q: Can customers save configurations?**  
A: Not in MVP. State persists in browser, but no account saving yet.

**Q: What happens if I update a product price in Shopify?**  
A: The builder automatically syncs within 1-2 minutes via webhooks.

**Q: Can I customize the builder colors?**  
A: Future feature. Currently uses default theme (black/gold).

**Q: Do I need to create new products for the builder?**  
A: No! Use your existing Shopify products - just mark them and add metadata.

---

## Next Steps After Setup

1. **Test Thoroughly**
   - Create test configurations
   - Complete test orders
   - Verify pricing accuracy

2. **Train Your Team**
   - Show staff how to add products
   - Explain metadata fields
   - Practice CSV import

3. **Market the Builder**
   - Add to navigation menu
   - Feature on homepage
   - Promote in marketing materials

4. **Monitor Performance**
   - Track configuration completion rate
   - Watch for common drop-off points
   - Collect customer feedback

5. **Expand Inventory**
   - Add more settings based on demand
   - Expand stone selection
   - Offer seasonal specials

---

## Success Checklist

Before going live to customers:

- [ ] At least 3 settings marked with complete metadata
- [ ] At least 10 stones marked with complete metadata
- [ ] Builder settings configured (markup, side stones)
- [ ] Builder added to storefront
- [ ] Complete test order placed successfully
- [ ] Order appears in Shopify admin with correct details
- [ ] Pricing calculations verified accurate
- [ ] Mobile experience tested
- [ ] Team trained on product management

**All checked?** ✅ **You're ready to launch!** 🚀

---

## Congratulations! 🎉

Your Ring Builder is now set up and ready to help customers create their dream rings!

**Need Help?** Refer to the comprehensive documentation in the `docs/` folder or contact support.

---

**End of Merchant Setup Guide**  
**Version:** 1.0  
**Last Updated:** October 12, 2025

