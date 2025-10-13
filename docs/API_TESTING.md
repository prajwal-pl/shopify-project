# API Testing Guide - Ring Builder MVP

**Purpose**: Test all API endpoints with curl commands  
**Last Updated**: October 12, 2025

---

## Setup

### Get Authentication Token (Admin Endpoints)

Admin endpoints require authentication. Get a session token by:

1. Installing the app on a development store
2. Logging into the admin
3. Extract session token from browser DevTools (Application → Cookies → `shopify_app_session`)

```bash
# Set your token
export TOKEN="your_session_token_here"
export SHOP="your-store.myshopify.com"
export BASE_URL="http://localhost:3000"
```

---

## Admin API Endpoints

### 1. List All Products

**Endpoint**: `GET /api/admin/products`

**Purpose**: Fetch all Shopify products for marking

```bash
curl -X GET "${BASE_URL}/api/admin/products" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json"
```

**Expected Response**:

```json
{
  "products": [
    {
      "id": "gid://shopify/Product/123",
      "title": "Classic Solitaire Ring",
      "price": "1200.00",
      "sku": "SET-001",
      "images": ["https://..."],
      "isMarkedSetting": false,
      "isMarkedStone": false
    }
  ],
  "hasNextPage": false
}
```

**Error Cases**:

```bash
# Unauthorized (invalid token)
# Should return 401

# Invalid shop
# Should return 403
```

---

### 2. Mark Product as Setting/Stone

**Endpoint**: `POST /api/admin/products/:id/mark`

**Purpose**: Mark a product as Setting or Stone

```bash
# Mark as Setting
curl -X POST "${BASE_URL}/api/admin/products/gid%3A%2F%2Fshopify%2FProduct%2F123/mark" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "setting"
  }'

# Mark as Stone
curl -X POST "${BASE_URL}/api/admin/products/gid%3A%2F%2Fshopify%2FProduct%2F456/mark" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "stone"
  }'
```

**Expected Response**:

```json
{
  "success": true,
  "message": "Product marked as setting",
  "metadata": {
    "id": "meta_123",
    "productId": "gid://shopify/Product/123",
    "type": "setting"
  }
}
```

**Error Cases**:

```bash
# Invalid type
curl -X POST "${BASE_URL}/api/admin/products/gid%3A%2F%2Fshopify%2FProduct%2F123/mark" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"type": "invalid"}'
# Should return 400 with validation error

# Product not found
# Should return 404
```

---

### 3. Update Product Metadata

**Endpoint**: `PUT /api/admin/products/:id/metadata`

**Purpose**: Update setting or stone metadata

```bash
# Update Setting Metadata
curl -X PUT "${BASE_URL}/api/admin/products/gid%3A%2F%2Fshopify%2FProduct%2F123/metadata" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "style": "solitaire",
    "settingHeight": "medium",
    "compatibleShapes": ["round", "cushion", "oval"],
    "basePrices": {
      "14k_white_gold": 1200,
      "14k_yellow_gold": 1250,
      "18k_rose_gold": 1400,
      "platinum": 1800
    },
    "featured": true
  }'

# Update Stone Metadata
curl -X PUT "${BASE_URL}/api/admin/products/gid%3A%2F%2Fshopify%2FProduct%2F456/metadata" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "stoneType": "diamond",
    "shape": "round",
    "carat": 1.5,
    "cut": "excellent",
    "color": "G",
    "clarity": "VS1",
    "certificate": "GIA",
    "certificateNumber": "2141234567",
    "certificateUrl": "https://gia.edu/report-check/2141234567",
    "measurements": "7.35 x 7.40 x 4.50",
    "tablePercent": 57,
    "depthPercent": 61.5,
    "polish": "excellent",
    "symmetry": "excellent",
    "fluorescence": "none",
    "price": 8999
  }'
```

**Expected Response**:

```json
{
  "success": true,
  "message": "Metadata updated successfully",
  "metadata": { ... }
}
```

**Error Cases**:

```bash
# Missing required fields
# Should return 400 with specific field errors

# Invalid values (e.g., negative price)
# Should return 400 with validation error
```

---

### 4. Import Stones via CSV

**Endpoint**: `POST /api/admin/import`

**Purpose**: Bulk import stone data

```bash
# Create test CSV file
cat > test-stones.csv << EOF
productId,stoneType,shape,carat,cut,color,clarity,certificate,certificateNumber,price
gid://shopify/Product/101,diamond,round,1.0,excellent,D,VVS1,GIA,1234567,12000
gid://shopify/Product/102,diamond,princess,1.5,very_good,E,VS1,GIA,9876543,15000
gid://shopify/Product/103,diamond,cushion,2.0,excellent,F,VS2,AGS,5551234,18000
EOF

# Upload CSV
curl -X POST "${BASE_URL}/api/admin/import" \
  -H "Authorization: Bearer ${TOKEN}" \
  -F "file=@test-stones.csv" \
  -F "type=stones"
```

**Expected Response**:

```json
{
  "success": true,
  "imported": 3,
  "errors": 0,
  "errorDetails": []
}
```

**Error Cases**:

```bash
# Invalid CSV format
# Should return partial success with error details

# Missing required columns
# Should return 400
```

---

### 5. Export Stones to CSV

**Endpoint**: `GET /api/admin/export`

**Purpose**: Download all stones as CSV

```bash
# Export stones
curl -X GET "${BASE_URL}/api/admin/export?type=stones" \
  -H "Authorization: Bearer ${TOKEN}" \
  -o exported-stones.csv

# View exported file
cat exported-stones.csv

# Export settings
curl -X GET "${BASE_URL}/api/admin/export?type=settings" \
  -H "Authorization: Bearer ${TOKEN}" \
  -o exported-settings.csv
```

**Expected Response**: CSV file download with headers

---

### 6. Get App Settings

**Endpoint**: `GET /api/admin/settings`

**Purpose**: Fetch merchant configuration

```bash
curl -X GET "${BASE_URL}/api/admin/settings" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json"
```

**Expected Response**:

```json
{
  "success": true,
  "settings": {
    "builderEnabled": true,
    "markupPercent": 5,
    "sideStones": {
      "enabled": true,
      "qualities": ["Good", "Better", "Best"],
      "prices": {
        "Good": 50,
        "Better": 75,
        "Best": 100
      },
      "minQuantity": 6,
      "maxQuantity": 24
    }
  }
}
```

---

### 7. Update App Settings

**Endpoint**: `PUT /api/admin/settings`

**Purpose**: Update merchant configuration

```bash
curl -X PUT "${BASE_URL}/api/admin/settings" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "builderEnabled": true,
    "markupPercent": 10,
    "sideStones": {
      "enabled": true,
      "qualities": ["Standard", "Premium", "Luxury"],
      "prices": {
        "Standard": 40,
        "Premium": 70,
        "Luxury": 120
      },
      "minQuantity": 8,
      "maxQuantity": 20
    }
  }'
```

**Expected Response**:

```json
{
  "success": true,
  "message": "Settings updated successfully",
  "settings": { ... }
}
```

**Error Cases**:

```bash
# Invalid markup (negative or > 100)
# Should return 400

# Invalid min/max (min > max)
# Should return 400
```

---

## Builder API Endpoints (Public)

### 8. Get Settings with Filters

**Endpoint**: `GET /api/builder/settings`

**Purpose**: Fetch settings for storefront builder

```bash
# Get all settings
curl "${BASE_URL}/api/builder/settings"

# Filter by style
curl "${BASE_URL}/api/builder/settings?style=solitaire"

# Filter by metal type
curl "${BASE_URL}/api/builder/settings?metalType=14k_white_gold"

# Filter by price range
curl "${BASE_URL}/api/builder/settings?priceMin=1000&priceMax=3000"

# Multiple filters
curl "${BASE_URL}/api/builder/settings?style=halo&metalType=platinum&priceMin=2000"

# Pagination
curl "${BASE_URL}/api/builder/settings?page=2"
```

**Expected Response**:

```json
{
  "settings": [
    {
      "id": "gid://shopify/Product/123",
      "title": "Classic Solitaire Ring",
      "image": "https://...",
      "style": "solitaire",
      "basePrices": {
        "14k_white_gold": 1200,
        "14k_yellow_gold": 1250,
        "18k_rose_gold": 1400,
        "platinum": 1800
      },
      "compatibleShapes": ["round", "cushion", "oval"],
      "startingPrice": 1200
    }
  ],
  "filters": {
    "styles": ["solitaire", "halo", "three_stone"],
    "metals": [
      "14k_white_gold",
      "14k_yellow_gold",
      "18k_rose_gold",
      "platinum"
    ],
    "priceRange": { "min": 800, "max": 5000 }
  },
  "pagination": {
    "page": 1,
    "totalPages": 3,
    "totalItems": 67
  }
}
```

---

### 9. Get Stones with Filters

**Endpoint**: `GET /api/builder/stones`

**Purpose**: Fetch stones for storefront builder

```bash
# Get all stones
curl "${BASE_URL}/api/builder/stones"

# Filter by shape
curl "${BASE_URL}/api/builder/stones?shape=round"

# Filter by carat range
curl "${BASE_URL}/api/builder/stones?caratMin=1&caratMax=2"

# Filter by 4 Cs
curl "${BASE_URL}/api/builder/stones?cut=excellent&color=G&clarity=VS1"

# Filter by price range
curl "${BASE_URL}/api/builder/stones?priceMin=5000&priceMax=15000"

# Filter by certification
curl "${BASE_URL}/api/builder/stones?certification=GIA"

# Complex filter (typical customer search)
curl "${BASE_URL}/api/builder/stones?shape=round&caratMin=1.2&caratMax=1.8&cut=excellent,very_good&color=F,G,H&clarity=VS1,VS2&priceMax=12000&certification=GIA,AGS"

# Sorting
curl "${BASE_URL}/api/builder/stones?shape=round&sort=price_asc"
curl "${BASE_URL}/api/builder/stones?shape=round&sort=carat_desc"

# Pagination
curl "${BASE_URL}/api/builder/stones?page=3"
```

**Expected Response**:

```json
{
  "stones": [
    {
      "id": "gid://shopify/Product/456",
      "image": "https://...",
      "shape": "round",
      "carat": 1.5,
      "cut": "excellent",
      "color": "G",
      "clarity": "VS1",
      "certificate": "GIA",
      "certificateNumber": "2141234567",
      "certificateUrl": "https://...",
      "price": 8999,
      "sku": "DIA-456"
    }
  ],
  "pagination": {
    "page": 1,
    "totalPages": 15,
    "totalItems": 743
  }
}
```

---

### 10. Add Configuration to Cart

**Endpoint**: `POST /api/builder/cart`

**Purpose**: Add configured ring to Shopify cart

```bash
# Minimal configuration (no side stones)
curl -X POST "${BASE_URL}/api/builder/cart" \
  -H "Content-Type: application/json" \
  -d '{
    "settingId": "gid://shopify/Product/123",
    "stoneId": "gid://shopify/Product/456",
    "metalType": "14k_white_gold",
    "ringSize": "7",
    "customerId": null,
    "customerEmail": "customer@example.com"
  }'

# With side stones
curl -X POST "${BASE_URL}/api/builder/cart" \
  -H "Content-Type: application/json" \
  -d '{
    "settingId": "gid://shopify/Product/123",
    "stoneId": "gid://shopify/Product/456",
    "metalType": "platinum",
    "ringSize": "6.5",
    "sideStones": {
      "quality": "Premium",
      "quantity": 12
    },
    "customerId": "gid://shopify/Customer/789",
    "customerEmail": "customer@example.com"
  }'
```

**Expected Response**:

```json
{
  "success": true,
  "message": "Ring added to cart successfully",
  "configurationId": "CONFIG-20251012-ABC123",
  "cartItemId": "cart_item_xyz",
  "totalPrice": 10249.0,
  "redirectUrl": "/cart"
}
```

**Error Cases**:

```bash
# Missing required field (no ring size)
curl -X POST "${BASE_URL}/api/builder/cart" \
  -H "Content-Type: application/json" \
  -d '{
    "settingId": "gid://shopify/Product/123",
    "stoneId": "gid://shopify/Product/456",
    "metalType": "14k_white_gold"
  }'
# Should return 400: "Ring size is required"

# Out of stock product
# Should return 400: "Sorry, this item is no longer available"

# Invalid product ID
# Should return 404: "Product not found"

# Price mismatch (client calculation wrong)
curl -X POST "${BASE_URL}/api/builder/cart" \
  -H "Content-Type: application/json" \
  -d '{
    "settingId": "gid://shopify/Product/123",
    "stoneId": "gid://shopify/Product/456",
    "metalType": "14k_white_gold",
    "ringSize": "7",
    "clientCalculatedPrice": 9999.00
  }'
# Backend recalculates, if mismatch: returns correct price
```

---

## Webhook Testing

### 11. Trigger Product Update Webhook

**Endpoint**: `POST /webhooks/products/update`

**Purpose**: Handle product updates from Shopify

```bash
# Using Shopify CLI
shopify webhook trigger --topic products/update

# Manual simulation (for testing HMAC)
# Note: HMAC must be calculated correctly
PAYLOAD='{"id":123,"title":"Updated Product"}'
HMAC=$(echo -n "$PAYLOAD" | openssl dgst -sha256 -hmac "$SHOPIFY_API_SECRET" -binary | base64)

curl -X POST "${BASE_URL}/webhooks/products/update" \
  -H "X-Shopify-Topic: products/update" \
  -H "X-Shopify-Hmac-Sha256: ${HMAC}" \
  -H "X-Shopify-Shop-Domain: ${SHOP}" \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD"
```

**Expected Response**: `200 OK` (empty body or minimal JSON)

**What to Verify**:

- Check database: Verify SettingMetadata or StoneMetadata updated
- Check logs: Verify webhook processed successfully
- Check HMAC rejection: Send invalid HMAC, should return 401

---

### 12. Trigger Product Delete Webhook

**Endpoint**: `POST /webhooks/products/delete`

```bash
# Using Shopify CLI
shopify webhook trigger --topic products/delete

# Manual
PAYLOAD='{"id":123}'
HMAC=$(echo -n "$PAYLOAD" | openssl dgst -sha256 -hmac "$SHOPIFY_API_SECRET" -binary | base64)

curl -X POST "${BASE_URL}/webhooks/products/delete" \
  -H "X-Shopify-Topic: products/delete" \
  -H "X-Shopify-Hmac-Sha256: ${HMAC}" \
  -H "X-Shopify-Shop-Domain: ${SHOP}" \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD"
```

**What to Verify**:

- Check database: Verify metadata removed or marked deleted
- Check builder: Product no longer appears in settings/stones list

---

## Testing Workflows

### Complete Admin Workflow Test

```bash
# 1. Get products
curl -X GET "${BASE_URL}/api/admin/products" -H "Authorization: Bearer ${TOKEN}"

# 2. Mark product as setting
curl -X POST "${BASE_URL}/api/admin/products/gid%3A%2F%2Fshopify%2FProduct%2F123/mark" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"type": "setting"}'

# 3. Add setting metadata
curl -X PUT "${BASE_URL}/api/admin/products/gid%3A%2F%2Fshopify%2FProduct%2F123/metadata" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{...metadata...}'

# 4. Import stones
curl -X POST "${BASE_URL}/api/admin/import" \
  -H "Authorization: Bearer ${TOKEN}" \
  -F "file=@stones.csv"

# 5. Update settings
curl -X PUT "${BASE_URL}/api/admin/settings" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{...settings...}'

# 6. Export stones
curl -X GET "${BASE_URL}/api/admin/export?type=stones" \
  -H "Authorization: Bearer ${TOKEN}" \
  -o export.csv
```

---

### Complete Builder Workflow Test

```bash
# 1. Get settings
curl "${BASE_URL}/api/builder/settings?style=solitaire"

# 2. Get stones (for selected setting)
curl "${BASE_URL}/api/builder/stones?shape=round&caratMin=1&caratMax=2"

# 3. Add to cart
curl -X POST "${BASE_URL}/api/builder/cart" \
  -H "Content-Type: application/json" \
  -d '{
    "settingId": "gid://shopify/Product/123",
    "stoneId": "gid://shopify/Product/456",
    "metalType": "14k_white_gold",
    "ringSize": "7"
  }'

# 4. Verify in Shopify cart (visit /cart in browser)
```

---

## Performance Testing

### Load Testing

```bash
# Test with multiple concurrent requests
for i in {1..10}; do
  curl "${BASE_URL}/api/builder/stones?shape=round" &
done
wait

# Should all complete successfully without rate limit errors
```

### Response Time Testing

```bash
# Measure API response time
time curl -o /dev/null -s -w "Time: %{time_total}s\n" \
  "${BASE_URL}/api/builder/stones?shape=round"

# Should be < 0.5s
```

---

## Database Verification

### Verify Configurations Saved

```bash
# After adding to cart, check database
npx prisma studio

# Query in Prisma Studio:
# - Open Configuration table
# - Verify record exists with correct data
# - Check shop field matches
# - Check status is "completed"
# - Check all prices are correct
```

### Verify Metadata Saved

```bash
# After marking product and adding metadata
npx prisma studio

# Query SettingMetadata or StoneMetadata
# - Verify record exists
# - Check all fields populated
# - Check indexes created
```

---

## Security Testing

### Multi-Tenant Isolation Test

```bash
# 1. Create configuration for Shop A (shop-a.myshopify.com)
export SHOP_A_TOKEN="token_a"
curl -X POST "${BASE_URL}/api/builder/cart" \
  -H "Authorization: Bearer ${SHOP_A_TOKEN}" \
  -d '{...config data...}'
# Note the configurationId returned

# 2. Try to access it from Shop B (shop-b.myshopify.com)
export SHOP_B_TOKEN="token_b"
curl -X GET "${BASE_URL}/api/admin/configurations/${CONFIG_ID}" \
  -H "Authorization: Bearer ${SHOP_B_TOKEN}"

# Should return 404 or empty (can't access other shop's data)
```

### HMAC Verification Test

```bash
# Send webhook with invalid HMAC
curl -X POST "${BASE_URL}/webhooks/products/update" \
  -H "X-Shopify-Topic: products/update" \
  -H "X-Shopify-Hmac-Sha256: INVALID_HMAC" \
  -H "X-Shopify-Shop-Domain: ${SHOP}" \
  -H "Content-Type: application/json" \
  -d '{"id":123}'

# Should return 401 Unauthorized
```

---

## Troubleshooting

### Common Issues

**401 Unauthorized**:

- Verify token is valid
- Check if app is installed on the store
- Ensure session hasn't expired

**400 Bad Request**:

- Check request body format (valid JSON)
- Verify all required fields included
- Check validation rules (e.g., positive prices)

**404 Not Found**:

- Verify product ID is correct GID format
- Check if product exists in Shopify
- Verify metadata record exists in database

**500 Internal Server Error**:

- Check server logs for detailed error
- Verify database connection
- Check Shopify API status

---

## Test Data Templates

### Sample Setting Metadata

```json
{
  "style": "solitaire",
  "settingHeight": "medium",
  "compatibleShapes": ["round", "cushion", "oval"],
  "basePrices": {
    "14k_white_gold": 1200,
    "14k_yellow_gold": 1250,
    "18k_rose_gold": 1400,
    "platinum": 1800
  },
  "featured": true
}
```

### Sample Stone Metadata

```json
{
  "stoneType": "diamond",
  "shape": "round",
  "carat": 1.5,
  "cut": "excellent",
  "color": "G",
  "clarity": "VS1",
  "certificate": "GIA",
  "certificateNumber": "2141234567",
  "certificateUrl": "https://gia.edu/report-check/2141234567",
  "measurements": "7.35 x 7.40 x 4.50",
  "tablePercent": 57,
  "depthPercent": 61.5,
  "polish": "excellent",
  "symmetry": "excellent",
  "fluorescence": "none",
  "price": 8999
}
```

### Sample CSV Import

```csv
productId,stoneType,shape,carat,cut,color,clarity,certificate,certificateNumber,price,measurements
gid://shopify/Product/101,diamond,round,1.0,excellent,D,VVS1,GIA,1234567,12000,6.50 x 6.55 x 4.02
gid://shopify/Product/102,diamond,princess,1.5,very_good,E,VS1,GIA,9876543,15000,7.10 x 7.05 x 4.95
gid://shopify/Product/103,diamond,cushion,2.0,excellent,F,VS2,AGS,5551234,18000,8.05 x 7.98 x 5.12
```

---

**End of API Testing Guide**

**Next**: See `TESTING_CHECKLIST.md` for manual feature testing
