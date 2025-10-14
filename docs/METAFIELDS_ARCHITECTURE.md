# Metafields Architecture - Technical Documentation

**Phase 2.0: Metafields-First Architecture**

---

## Overview

Phase 2.0 implements a **dual-storage architecture** where Shopify metafields serve as the source of truth, while the app database acts as a performance cache.

```
┌─────────────────────────────────────────┐
│  SHOPIFY METAFIELDS (Source of Truth)  │
│  - Permanent storage                    │
│  - Survives app uninstall               │
│  - 21 metafield definitions             │
│  - Namespace: "ringbuilder"             │
└─────────────────┬───────────────────────┘
                  │ sync via webhooks
┌─────────────────▼───────────────────────┐
│  APP DATABASE (Performance Cache)       │
│  - Fast queries & filtering             │
│  - Complex search operations            │
│  - Pagination support                   │
└─────────────────────────────────────────┘
```

---

## Metafield Definitions

### Namespace

All ring builder metafields use namespace: **`ringbuilder`**

### Diamond/Stone Metafields (16 fields)

| Key                | Type                   | Required | Description                            |
| ------------------ | ---------------------- | -------- | -------------------------------------- |
| type               | single_line_text_field | Yes      | "diamond" or "gemstone"                |
| shape              | single_line_text_field | Yes      | Diamond shape                          |
| carat              | number_decimal         | Yes      | Carat weight                           |
| diamond_type       | single_line_text_field | Yes      | "mined", "lab_grown", or "fancy_color" |
| cut                | single_line_text_field | No       | Cut grade                              |
| color              | single_line_text_field | No       | Color grade                            |
| clarity            | single_line_text_field | No       | Clarity grade                          |
| certificate        | single_line_text_field | No       | Certificate type                       |
| certificate_number | single_line_text_field | No       | Certificate ID                         |
| certificate_url    | url                    | No       | PDF certificate link                   |
| measurements       | single_line_text_field | No       | Dimensions in mm                       |
| table_percent      | number_decimal         | No       | Table percentage                       |
| depth_percent      | number_decimal         | No       | Depth percentage                       |
| polish             | single_line_text_field | No       | Polish grade                           |
| symmetry           | single_line_text_field | No       | Symmetry grade                         |
| fluorescence       | single_line_text_field | No       | Fluorescence level                     |

### Setting Metafields (5 fields)

| Key               | Type                        | Required | Description                |
| ----------------- | --------------------------- | -------- | -------------------------- |
| type              | single_line_text_field      | Yes      | "setting"                  |
| style             | single_line_text_field      | Yes      | Setting style              |
| compatible_shapes | list.single_line_text_field | Yes      | Array of compatible shapes |
| metal_prices      | json                        | Yes      | Price object by metal type |
| setting_height    | single_line_text_field      | No       | "low", "medium", or "high" |

---

## Data Flow

### Write Flow (Product Save)

```
1. Merchant clicks "Save Diamond Specs" in admin UI
         ↓
2. POST /api/admin/products/:id/metadata
         ↓
3. Service validates data
         ↓
4. Write to Shopify metafields (via GraphQL)
         ├─ metafieldsSet mutation
         └─ Batch writes (25 per request)
         ↓
5. Write to app database (cache)
         ├─ prisma.stoneMetadata.upsert()
         └─ Same data for fast queries
         ↓
6. Return success to UI
```

### Read Flow (Customer Browse)

```
1. Customer applies filters in builder
         ↓
2. GET /api/builder/stones?diamondType=mined&shape=round
         ↓
3. Query app database (fast)
         ├─ WHERE shop = ? AND diamondType = ? AND shape = ?
         └─ Uses indexed columns
         ↓
4. Return results to customer
```

### Sync Flow (Product Update in Shopify)

```
1. Merchant updates product in Shopify (price, image, etc.)
         ↓
2. Shopify sends products/update webhook
         ↓
3. Webhook handler receives update
         ↓
4. Read metafields from webhook payload (future)
         OR
5. Sync price/images/availability from webhook
         ↓
6. Update app database cache
```

---

## Service Layer

### metafields.server.ts

**Core Functions:**

- `createMetafieldDefinitions()` - Sets up metafield schema
- `writeDiamondMetafields()` - Writes diamond data
- `writeSettingMetafields()` - Writes setting data
- `readProductMetafields()` - Reads from Shopify
- `deleteProductMetafields()` - Cleanup

**Features:**

- Batch operations (25 metafields per request)
- Error handling with detailed messages
- Idempotent operations
- Type-safe conversions

---

## GraphQL Mutations

### Create Metafield Definitions

```graphql
mutation CreateMetafieldDefinition($definition: MetafieldDefinitionInput!) {
  metafieldDefinitionCreate(definition: $definition) {
    createdDefinition {
      id
      name
      namespace
      key
      type {
        name
      }
    }
    userErrors {
      field
      message
    }
  }
}
```

### Write Metafields

```graphql
mutation UpdateProductMetafields($metafields: [MetafieldsSetInput!]!) {
  metafieldsSet(metafields: $metafields) {
    metafields {
      id
      namespace
      key
      value
    }
    userErrors {
      field
      message
    }
  }
}
```

### Read Metafields

```graphql
query GetProductMetafields($id: ID!) {
  product(id: $id) {
    metafields(first: 50, namespace: "ringbuilder") {
      edges {
        node {
          id
          namespace
          key
          value
          type
        }
      }
    }
  }
}
```

---

## API Endpoints

### Setup Metafield Definitions

**POST** `/api/admin/metafields/setup`

Creates all 21 metafield definitions. Idempotent (safe to call multiple times).

**Response:**

```json
{
  "success": true,
  "count": 21,
  "message": "Metafield definitions created successfully"
}
```

### Sync Data

**GET** `/api/admin/metafields/sync?direction=to_shopify&limit=50`

**Directions:**

- `to_shopify` - Write database → metafields
- `from_shopify` - Read metafields → database

**Response:**

```json
{
  "success": true,
  "direction": "to_shopify",
  "stonesProcessed": 15,
  "stonesSuccess": 15,
  "settingsProcessed": 8,
  "settingsSuccess": 8,
  "errors": []
}
```

### Save Product Metadata

**POST** `/api/admin/products/:id/metadata`

Saves to BOTH metafields and database.

---

## Database Schema

### StoneMetadata (Enhanced)

```prisma
model StoneMetadata {
  // ... existing fields ...
  diamondType String @default("mined") // NEW: Phase 2.0

  // Indexes
  @@index([shop, diamondType]) // NEW: For tab filtering
}
```

### Configuration (Enhanced)

```prisma
model Configuration {
  // ... existing fields ...
  shareToken  String?   @unique    // NEW: For shareable URLs
  shareCount  Int       @default(0) // NEW: Track shares
  savedAt     DateTime?            // NEW: Save timestamp

  @@index([shareToken]) // NEW
}
```

### CustomerInquiry (NEW)

```prisma
model CustomerInquiry {
  id              String   @id @default(cuid())
  shop            String
  type            String   // "hint" | "info" | "viewing" | "email"
  customerEmail   String
  status          String   @default("new")
  // ... more fields ...

  @@index([shop, type])
  @@index([shop, status])
}
```

---

## Performance Considerations

### Why Dual Storage?

**Shopify Metafields:**

- ✅ Permanent (survives app uninstall)
- ✅ Native Shopify integration
- ❌ Slower queries (GraphQL API)
- ❌ No complex filtering

**App Database:**

- ✅ Fast queries (< 50ms)
- ✅ Complex filtering (price ranges, multi-field)
- ✅ Pagination support
- ❌ Lost if app uninstalled (without backup)

**Solution:** Use BOTH!

- Metafields = Source of truth
- Database = Performance cache

### Indexes

**StoneMetadata:**

- `[shop, diamondType]` - Diamond type tab filtering
- `[shop, shape, carat]` - Common filter combo
- `[shop, available]` - Availability filtering
- `[shop, price]` - Price sorting

**Performance:**

- Filtering 10,000 diamonds: < 100ms ✅
- Diamond type counts: < 50ms ✅
- Complex queries: < 200ms ✅

---

## Error Handling

### Graceful Degradation

If metafields write fails:

1. ✅ Database still saves (app continues working)
2. ⚠️ Warning logged
3. 🔄 Webhook will sync later
4. 🛠️ Manual sync available

### Retry Strategy

- Failed metafield writes don't block
- Manual sync endpoint for recovery
- Admin can trigger sync anytime

---

## Security

### Multi-Tenant Isolation

All queries filtered by `shop`:

```typescript
where: { shop, ... }
```

### Authentication

- Admin endpoints: `authenticate.admin(request)`
- Customer endpoints: No auth (public data)
- Metafields: Admin API only

---

## Troubleshooting

### Metafields Not Showing in Shopify

1. Check setup: `GET /api/admin/metafields/setup`
2. Create definitions: `POST /api/admin/metafields/setup`
3. Sync data: `GET /api/admin/metafields/sync?direction=to_shopify`

### Data Out of Sync

1. Manual sync: Click "Sync from Shopify" in admin
2. OR API: `GET /api/admin/metafields/sync`

### Performance Issues

1. Check database indexes: `npx prisma studio`
2. Monitor query times in logs
3. Consider pagination limits

---

## Future Enhancements

### Planned

1. Full webhook metafield sync (currently price/images only)
2. Metafield conflict resolution
3. Bulk metafield operations
4. Metafield validation before write
5. Admin UI to view metafield status

### Considerations

1. Rate limiting for API calls
2. Caching layer (Redis)
3. Background job queue
4. Real-time sync notifications

---

**Version:** 2.0  
**Last Updated:** October 13, 2025
