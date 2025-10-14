# 🎯 ADD RING BUILDER TO YOUR STOREFRONT

**Goal:** Make the Ring Builder accessible to customers on your Shopify store  
**Time:** 10-15 minutes  
**Result:** Customers can visit a dedicated page to build custom rings

---

## 🚀 QUICK SETUP (3 Options)

### Option 1: Using App Proxy (RECOMMENDED - Easiest!)

**This creates a page at:** `yourstore.com/apps/ring-builder`

**Steps:**

1. **Deploy your app extension:**

   ```bash
   npm run deploy
   ```

2. **In Shopify Partner Dashboard:**
   - Go to your app → App setup
   - Scroll to "App proxy"
   - Click "Set up app proxy"
   - Set:
     - Subpath prefix: `apps`
     - Subpath: `ring-builder`
     - Proxy URL: `https://your-app-url.com/builder`
   - Save

3. **Create a menu link:**
   - Shopify Admin → Online Store → Navigation
   - Add menu item: "Build a Ring"
   - Link to: `/apps/ring-builder`
   - Save

4. **Done!** Customers can visit: `yourstore.com/apps/ring-builder`

---

### Option 2: Using Theme App Extension (What I Just Created!)

**This adds a block to your theme that you can place on any page.**

**Steps:**

1. **Deploy the extension:**

   ```bash
   cd /Users/samarthgugnani/Projects/prashant/gold-jwellers-shopify-v2/builder-mvp-app
   npm run deploy
   ```

   Wait for deployment to complete (~2 minutes)

2. **In Shopify Admin:**
   - Go to **Online Store → Themes**
   - Click **"Customize"** on your active theme
   - You should be in the theme editor now

3. **Create a new page for the builder:**
   - Click "Pages" dropdown at top
   - Select "Add page" or choose existing page
   - Recommended: Create "Build a Ring" page

4. **Add the Ring Builder block:**
   - Click "Add section" button
   - Look for **"Apps"** category
   - Find **"Ring Builder"**
   - Click to add it
5. **Configure the block (optional):**
   - Toggle "Show Heading" on/off
   - Edit heading text: "Build Your Dream Ring"
   - Adjust positioning

6. **Save and publish:**
   - Click "Save" button (top right)
   - Exit theme editor

7. **Create navigation link:**
   - Go to **Online Store → Navigation**
   - Choose "Main menu"
   - Click "Add menu item"
   - Name: "Build a Ring"
   - Link: Select the page you created
   - Save menu

8. **Done!** Visit your storefront and click "Build a Ring"

---

### Option 3: Direct Link (Simplest for Testing!)

**Just link directly to the builder route.**

**URL:**

```
https://fine-parcel-sodium-bills.trycloudflare.com/builder?shop=builder-store-103.myshopify.com
```

**For production:**

```
https://your-app-domain.com/builder?shop=yourstore.myshopify.com
```

**Add this link anywhere:**

- Navigation menu
- Homepage button
- Collection page
- Anywhere!

---

## 🎯 RECOMMENDED APPROACH FOR YOU

Since you're testing right now, I recommend:

### STEP 1: Test Direct Link First (2 minutes)

**Just open this URL:**

```
http://localhost:51077/builder?shop=builder-store-103.myshopify.com
```

**This is the public builder route!**

- See if it loads
- Test the 4 steps
- Verify it works

### STEP 2: Deploy Extension (5 minutes)

**Run:**

```bash
npm run deploy
```

This pushes your theme extension to Shopify.

### STEP 3: Add to Your Theme (5 minutes)

Follow Option 2 above to add the block to your theme.

---

## 📋 CURRENT STATUS

### What's Ready:

- ✅ Builder route created: `/builder`
- ✅ Theme extension files created
- ✅ Liquid template created
- ✅ Ready to deploy!

### What You Need to Do:

1. **First: Test the direct route**

   ```
   http://localhost:51077/builder?shop=builder-store-103.myshopify.com
   ```

2. **Then: Deploy extension**

   ```bash
   npm run deploy
   ```

3. **Finally: Add to theme**
   - Follow Option 2 steps above

---

## 🚀 LET'S START!

### RIGHT NOW: Test the Direct Route

**Open this URL in your browser:**

```
http://localhost:51077/builder?shop=builder-store-103.myshopify.com
```

**You should see:**

- The complete 4-step Ring Builder
- Without the admin interface around it
- Clean, customer-facing design

**Tell me what you see!**

If it works, we'll proceed to deploy the theme extension! 🎯💍
