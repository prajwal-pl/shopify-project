# Phase 2.0 Merchant Setup Guide

**Ring Builder for Shopify - Phase 2.0**  
**Setup Time:** 15-30 minutes  
**Level:** Beginner-friendly  
**Last Updated:** October 14, 2025

---

## 🎯 What You'll Accomplish

By the end of this guide, you'll have:

- ✅ Ring Builder app installed and configured
- ✅ Products set up with visual forms (not CSV!)
- ✅ Customer-facing builder ready to use
- ✅ All data safely stored in Shopify metafields

**No technical skills required!** Everything is visual and guided.

---

## 📋 Prerequisites

Before you start, make sure you have:

- [ ] Shopify store (any plan)
- [ ] At least 5 ring settings (products in Shopify)
- [ ] At least 10 diamonds/stones (products in Shopify)
- [ ] Product images uploaded to Shopify
- [ ] Basic product information (title, price, SKU)

---

## STEP 1: Install the App (5 minutes)

### 1.1 Install from Shopify App Store

1. Go to your Shopify Admin
2. Navigate to **Apps** → **Customize your store**
3. Search for "Ring Builder"
4. Click **Install**
5. Grant permissions when prompted

### 1.2 First Launch

After installation, you'll see:

- **Welcome screen** with setup wizard
- **Product Dashboard** (currently empty)
- **Navigation:** Dashboard, Products, Inquiries, Settings

---

## STEP 2: Set Up Products (15-20 minutes)

### 2.1 Add Your First Setting

**Goal:** Mark a Shopify product as a ring setting

1. Navigate to **Products** in Ring Builder admin
2. Find a ring setting product
3. Click **"Add as Setting"** button

**Fill the Visual Form:**

| Field                 | Description                | Example                              |
| --------------------- | -------------------------- | ------------------------------------ |
| **Style**             | Choose from dropdown       | Solitaire, Halo, Vintage, etc.       |
| **Compatible Shapes** | Click icon checkboxes      | ☑ Round, ☑ Princess, ☑ Oval       |
| **Metal Prices**      | Enter price for each metal | 14K White: $1,200, 18K White: $1,800 |
| **Setting Height**    | Optional dropdown          | Low, Medium, or High                 |
| **Featured**          | Checkbox                   | Check if this is a featured setting  |

4. Click **"Save Setting Specs"**
5. Success! Product now shows **✓ Active** status

**Repeat for 4-5 more settings** (mix of styles)

### 2.2 Add Your First Diamond

**Goal:** Mark a Shopify product as a diamond

1. Find a diamond product in the list
2. Click **"Add as Diamond"** button

**Fill the Visual Form:**

| Field               | Description         | Example                                |
| ------------------- | ------------------- | -------------------------------------- |
| **Shape**           | Click icon button   | 🔘 Round, ◆ Princess, ○ Oval           |
| **Carat Weight**    | Enter decimal       | 1.50                                   |
| **Diamond Type**    | Choose radio button | ● Mined, ○ Lab Grown, ○ Fancy Color    |
| **Cut**             | Dropdown            | Excellent, Very Good, Good             |
| **Color**           | Dropdown            | D, E, F, G, H, I, J, K, L, M           |
| **Clarity**         | Dropdown            | FL, IF, VVS1, VVS2, VS1, VS2, SI1, SI2 |
| **Certificate**     | Optional dropdown   | GIA, AGS, IGI, None                    |
| **Certificate #**   | Optional text       | 2141234567                             |
| **Certificate URL** | Optional link       | https://gia.edu/report/...             |

3. **Advanced Specs (Optional)** - Click to expand:
   - Measurements (e.g., "7.35 x 7.40 x 4.50")
   - Table % (e.g., 58%)
   - Depth % (e.g., 61.5%)
   - Polish (Excellent, Very Good, etc.)
   - Symmetry (Excellent, Very Good, etc.)
   - Fluorescence (None, Faint, Medium, Strong)

4. Click **"Save Diamond Specs"**
5. Success! Product now shows **✓ Active** with diamond details

**Repeat for 10-20 diamonds** (mix of shapes, carats, types)

### 2.3 Understanding Product Status

Your product dashboard shows 3 types of status:

| Icon | Status         | Meaning                  | Action Needed                              |
| ---- | -------------- | ------------------------ | ------------------------------------------ |
| ✓    | **Active**     | Complete builder product | None - ready to use!                       |
| ⚠   | **Incomplete** | Missing required data    | Click "Complete Setup"                     |
| ○    | **Unmarked**   | Regular product          | Click "Add as Diamond" or "Add as Setting" |

---

## STEP 3: Configure App Settings (5 minutes)

### 3.1 Navigate to Settings

1. Click **"Settings"** in Ring Builder admin
2. You'll see configuration options

### 3.2 Basic Settings

**Pricing & Markup:**

- Set default markup percentage (e.g., 5-15%)
- Configure side stones pricing (if offering)

**Display Options:**

- Enable/disable grid view (recommended: ON)
- Enable/disable comparison tool (recommended: ON)
- Enable/disable save & share (recommended: ON)

**Customer Engagement:**

- Enable "Drop A Hint" feature
- Enable "Request More Info" feature
- Enable "Schedule Viewing" feature
- Set your notification email address

### 3.3 Email Configuration (Optional)

If you want email features (hints, inquiries, sharing):

1. Choose email provider (SendGrid recommended - 100/day free)
2. Enter API key in environment variables
3. Set "From" email address
4. Test email sending

**Note:** App works without email (features will be disabled)

---

## STEP 4: Test the Customer Builder (5 minutes)

### 4.1 Access the Builder

**Option A: Direct Link**

```
https://your-store.myshopify.com/builder?shop=your-store.myshopify.com
```

**Option B: Embed in Theme**
See [Storefront Setup Guide](./STOREFRONT_SETUP_GUIDE.md)

### 4.2 Test the 4-Step Flow

**Step 1: Select Setting**

- See your settings displayed
- Filter by style works
- Click a setting → Proceeds to Step 2

**Step 2: Select Diamond**

- See diamond type tabs (Mined/Lab/Fancy)
- Icon shape filters work
- Toggle Grid/List view
- Select a diamond → Proceeds to Step 3

**Step 3: Customize**

- Select ring size
- Configure side stones (if enabled)
- Price updates in real-time

**Step 4: Review & Add to Cart**

- See complete configuration
- View price breakdown
- Click "Add to Cart" → Goes to Shopify cart

✅ **Success!** Your Ring Builder is working!

---

## 🎨 OPTIONAL: Customize Look & Feel

### Brand Colors

Edit `app/components/builder/BuilderApp.tsx`:

```typescript
// Change accent color from gold to your brand color
--accent: #D4AF37; /* Default gold */
--accent: #YOUR_COLOR; /* Your brand color */
```

### Logo

1. Upload logo to `public/logo.png`
2. Update builder header to display logo

### Custom Text

Edit welcome messages, button labels, etc. in:

- `app/components/builder/steps/SettingSelector.tsx`
- `app/components/builder/steps/StoneSelector.tsx`

---

## 🔧 Advanced Features

### CSV Bulk Import (100+ Products)

If you have a large inventory:

1. Navigate to **Products** → **Advanced Tools**
2. Click **"CSV Import"**
3. Download template CSV
4. Fill with product data
5. Upload CSV file
6. Review import preview
7. Confirm import

**See:** [CSV Import Explained](../CSV_IMPORT_EXPLAINED.md)

### Custom Metafield Sync

Manually trigger sync from Shopify:

1. Make changes in Shopify Admin (product prices, images)
2. Go to Ring Builder admin → **Products**
3. Click **"Sync from Shopify"**
4. Wait for sync to complete
5. Verify updated data appears

---

## ❓ Common Questions

### Q: How do I edit a product's specs?

**A:** Click the **"Edit Specs"** button on any active product. The form will open with existing data pre-filled. Make changes and save.

### Q: What happens to my data if I uninstall the app?

**A:** With Phase 2.0, all your data is stored in **Shopify metafields**. Even if you uninstall the app, the data remains in Shopify. If you reinstall, everything will be there!

### Q: Can I have some products as both diamond AND setting?

**A:** No. Each product can only be marked as either a diamond OR a setting, not both.

### Q: How do I remove a product from the builder?

**A:** Click **"Remove"** button on the product card. This removes builder specs but keeps the Shopify product.

### Q: Do I need to configure all 7 metal types?

**A:** No! Only configure the metals you actually offer. Customers will only see metals with prices set.

### Q: How many diamonds should I add for best results?

**A:** Recommended: **Minimum 20 diamonds** for good selection. Ideal: 50-100+ for best customer experience.

### Q: What if I don't have GIA certificates?

**A:** Certificates are optional! Simply select "None" in the certificate dropdown. The builder works fine without certificates.

---

## 🚨 Troubleshooting

### Issue: Products don't appear in builder

**Solutions:**

1. Check product status in Shopify Admin (must be "Active")
2. Verify product has at least one variant
3. Click "Sync from Shopify" button
4. Check console for errors (F12 → Console tab)

### Issue: Metafields not saving

**Solutions:**

1. Check app permissions (should have product write access)
2. Go to Ring Builder admin → **Products** → Click product
3. Verify error message shows specific issue
4. Contact support if persists

### Issue: Customer builder shows "No products found"

**Solutions:**

1. Verify you've added at least 1 setting and 1 diamond
2. Check that products are marked as "available"
3. Verify shop parameter in URL: `?shop=your-store.myshopify.com`
4. Click "Sync from Shopify" in admin

### Issue: Images not displaying

**Solutions:**

1. Verify products have images in Shopify Admin
2. Check image URLs are valid
3. Click "Sync from Shopify" to refresh images
4. Clear browser cache

### Issue: Email features not working

**Solutions:**

1. Check environment variables are set (EMAIL_FROM_ADDRESS, etc.)
2. Verify email API credentials are correct
3. Check merchant email in settings
4. Test email service separately

---

## 📊 Success Metrics

### You'll know it's working when:

- ✅ Product setup takes < 30 seconds per item
- ✅ Customers can complete full builder flow
- ✅ Configurations appear in Shopify cart with all properties
- ✅ Metafields visible in Shopify Admin → Products → Metafields
- ✅ No console errors in browser
- ✅ Mobile works smoothly

### Expected Performance:

- **Product Setup:** 30 seconds per item (vs 2+ minutes with CSV)
- **Customer Completion:** 40%+ complete configurations
- **Page Load Time:** < 3 seconds
- **Cart Integration:** Seamless

---

## 🎓 Next Steps

### After Initial Setup:

1. **Test the customer experience yourself**
   - Complete a full build (4 steps)
   - Test on mobile device
   - Try save & share features

2. **Configure email notifications**
   - Set up SendGrid or email provider
   - Test hint, inquiry, and viewing emails

3. **Customize for your brand**
   - Add your logo
   - Adjust colors to match your brand
   - Customize welcome messages

4. **Add more inventory**
   - Target: 50+ diamonds, 10+ settings
   - Mix of diamond types (mined, lab, fancy)
   - Range of carats, shapes, prices

5. **Embed in theme** (optional)
   - Add builder link to navigation
   - Embed builder iframe on custom page
   - See [Storefront Setup Guide](./STOREFRONT_SETUP_GUIDE.md)

6. **Monitor inquiries**
   - Check **Inquiries** page daily
   - Respond to customer requests promptly
   - Track which products get most interest

---

## 📞 Support

### Documentation

- [Manual Testing Guide](./PHASE_2_MANUAL_TESTING.md) - Complete feature testing
- [Metafields Architecture](./METAFIELDS_ARCHITECTURE.md) - Technical details
- [API Testing](./API_TESTING.md) - For developers

### Need Help?

- Email: support@your-app.com
- Documentation: [Full docs link]
- Video Tutorials: [YouTube link]

---

## 🎉 Congratulations!

You've successfully set up Phase 2.0 of the Ring Builder!

**Your customers can now:**

- Build custom rings visually
- Compare diamonds side-by-side
- Save and share configurations
- Drop hints and request information
- View detailed product pages

**You can now:**

- Manage products with easy visual forms
- Track customer inquiries
- Have data safely stored in Shopify
- Sell more custom rings!

---

## 📈 Best Practices

### Product Setup Tips

1. **Start Small:** Add 5 settings + 10 diamonds first, then expand
2. **High-Quality Images:** Use clear, well-lit photos
3. **Complete Data:** Fill all fields for best customer experience
4. **Regular Updates:** Keep inventory and prices current
5. **Monitor Inquiries:** Respond quickly to customer requests

### Customer Experience Tips

1. **Promote the Builder:** Add link to navigation, home page
2. **Test Regularly:** Use the builder yourself to understand customer experience
3. **Encourage Sharing:** Customers sharing = free marketing!
4. **Use Inquiries:** Follow up on hints and viewing requests
5. **Track Popular Items:** See which diamonds get compared most

### Inventory Management

1. **Balance:** Aim for 5:1 ratio (diamonds:settings)
2. **Variety:** Mix of shapes, carats, price points
3. **Diamond Types:** Include mined, lab grown, and fancy color
4. **Price Range:** Low ($1K), mid ($5K), high ($10K+)
5. **Featured Settings:** Mark 2-3 settings as "featured"

---

**You're all set! Start selling custom rings!** 💍✨

---

**Questions?** See [Troubleshooting](#-troubleshooting) section above or contact support.
