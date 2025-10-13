# 📊 How to Use CSV Import - IMPORTANT!

## ⚠️ CRITICAL: CSV Does NOT Create Products!

### What CSV Import Does:

✅ **ADDS metadata to EXISTING Shopify products**  
❌ **DOES NOT create new products**

Think of it like this:

1. First: You have products in Shopify (snowboards, rings, etc.)
2. Then: CSV adds Ring Builder data to those products (4Cs, specs, etc.)

---

## 🎯 CORRECT WORKFLOW

### Step 1: You MUST Have Products in Shopify First

**Option A: Use Your Existing Products**

- You already have 4 products (Snowboards, Gift Card)
- These can be used for testing!

**Option B: Create New Ring Products**

1. Go to Shopify Admin → Products → Add product
2. Create products like:
   - "1.50ct Round Diamond"
   - "Classic Solitaire Setting"
   - etc.
3. Add images, set price
4. Save each product

### Step 2: Get the Product IDs

**From the Products you see:**

Looking at your screenshot, you have:

- "The Inventory Not Tracked Snowboard" - $249.95
- "Gift Card" - $10.00
- "The Draft Snowboard" - $2629.95 (with "Setting" badge - already marked!)
- "The Out of Stock Snowboard" - $885.95

**To get their IDs:**

**Method 1: Check Terminal Logs**

When you loaded the Products page, your terminal should show:

```
📦 Products fetched from Shopify: 4
```

Let me add a feature to SHOW the product IDs on the page!

**Method 2: Use GraphiQL**

1. Open: http://localhost:51076
2. Run this query:

```graphql
{
  products(first: 10) {
    edges {
      node {
        id
        title
      }
    }
  }
}
```

3. Copy the `id` values!

### Step 3: Create CSV with Real IDs

**Example with YOUR products:**

```csv
productId,stoneType,shape,carat,cut,color,clarity,price,certificate,certificateNumber
gid://shopify/Product/7427974463586,diamond,round,1.50,excellent,g,vs1,5000,gia,2141234567
gid://shopify/Product/ANOTHER_REAL_ID,diamond,princess,1.25,very_good,f,vvs2,7500,gia,2141234568
```

Replace `7427974463586` with YOUR actual product IDs!

### Step 4: Import the CSV

1. Click "Import CSV"
2. Upload your CSV with real IDs
3. Success!

---

## 🛠️ LET ME ADD PRODUCT ID DISPLAY

I'll update the Products page to SHOW the product IDs so you can easily copy them!
