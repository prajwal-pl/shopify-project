# Phase 2.0 - Task 1.0 Deep Analysis

**Date:** October 13, 2025  
**Status:** Ready for Implementation  
**Task:** Database Schema & Metafields Foundation

---

## Executive Summary

Task 1.0 is the critical foundation for Phase 2.0's metafields architecture. This analysis covers:

- Current state assessment
- Gap analysis
- Implementation strategy for all 8 sub-tasks
- Risk mitigation
- Success criteria

---

## PRD Analysis Summary

### Phase 2.0 Goals

**Primary Objective:** Transform from CSV-based to metafields-first architecture

**Key Improvements:**

1. **Merchant Experience:** Visual UI replaces CSV confusion
2. **Data Architecture:** Shopify metafields as source of truth
3. **Customer UX:** GemFind feature parity (visual filters, comparison, engagement)
4. **Scalability:** Support 10,000+ products

### Critical Requirements for Task 1.0

From PRD Section 4 (Functional Requirements):

**FR-1.1:** Diamond metafields must include `diamond_type` field:

- Values: "mined" | "lab_grown" | "fancy_color"
- Required for FR-5 (Diamond Type Categorization with tabs)
- Enables filtering and tab badges

**FR-6:** Comparison tool requires:

- Ability to select 2-4 diamonds
- Persistent selection storage

**FR-7:** Save & Share requires:

- `shareToken` field (unique, 8-12 characters)
- `savedAt` timestamp
- `shareCount` tracking

**FR-8:** Customer inquiries require:

- New CustomerInquiry model
- Types: hint, info, viewing, email
- Status tracking: new, contacted, closed

**FR-8.6:** Merchant configuration requires:

- AppSettings extensions for engagement features
- customerEngagement, virtualTryOn, socialSharing JSON fields

---

## Current State Assessment

### Database Schema (prisma/schema.prisma)

**✅ Already Exists:**

- Configuration model (lines 46-84)
- StoneMetadata model (lines 119-166)
- SettingMetadata model (lines 87-116)
- AppSettings model (lines 169-195)
- AnalyticsEvent model (lines 198-217)

**❌ Missing for Phase 2.0:**

1. **StoneMetadata:**
   - `diamondType` field (critical for FR-5 tabs)
   - Index on `[shop, diamondType]` for performance

2. **Configuration:**
   - `shareToken` field exists (line 73) but marked as "future feature"
   - Missing `shareCount` field
   - Missing `savedAt` field
   - Missing index on `shareToken`

3. **CustomerInquiry:**
   - Entire model missing (required for FR-8)

4. **AppSettings:**
   - Missing `customerEngagement` field (JSON)
   - Missing `virtualTryOn` field (JSON)
   - Missing `socialSharing` field (JSON)

### TypeScript Types (app/types/builder.ts)

**✅ Comprehensive Phase 1.0 types:**

- 613 lines of well-documented types
- Configuration, Stone, Setting interfaces
- Filter, Sort, API response types
- Shopify integration types

**❌ Missing for Phase 2.0:**

1. **New Type Aliases:**
   - `DiamondType` = "mined" | "lab_grown" | "fancy_color"
   - `InquiryType` = "hint" | "info" | "viewing" | "email"
   - `InquiryStatus` = "new" | "contacted" | "closed"

2. **New Interfaces:**
   - `SavedConfiguration` - for shareable configs
   - `CustomerInquiry` - for inquiry tracking
   - `CustomerEngagementSettings` - for button config
   - `VirtualTryOnSettings` - for VTO config
   - `SocialSharingSettings` - for social config

3. **Updates to Existing Interfaces:**
   - `Stone` interface needs `diamondType` field
   - `StoneFilters` needs `diamondType` filter option
   - `Configuration` needs shareToken, shareCount, savedAt

4. **New File Required:**
   - `app/types/metafields.ts` - Shopify metafield type definitions

### Dependencies (package.json)

**✅ Core Stack Ready:**

- React 18.2.0
- Prisma 6.2.1
- TypeScript 5.2.2
- Vite 6.2.2

**❌ Phase 2.0 Dependencies Missing:**

- `react-icons` - for icon components
- `@sendgrid/mail` - for email service
- `nanoid` - for share token generation
- `ical-generator` - for calendar invites
- `react-image-gallery` - for product image galleries

---

## Task 1.0 Sub-Tasks Breakdown

### 1.1: Add diamondType to StoneMetadata

**Purpose:** Enable diamond categorization (Mined/Lab Grown/Fancy Color)

**Implementation:**

```prisma
model StoneMetadata {
  // ... existing fields ...
  diamondType String @default("mined") // NEW: "mined" | "lab_grown" | "fancy_color"

  // ... existing indexes ...
  @@index([shop, diamondType]) // NEW: For tab filtering performance
}
```

**Migration Impact:**

- Adds new column to existing table
- Default value "mined" for existing records (safe assumption)
- New index improves query performance for tabs

**Validation:**

- Check existing records don't break
- Verify index created successfully
- Test query performance with diamondType filter

---

### 1.2: Update Configuration Model

**Purpose:** Enable save & share functionality (FR-7)

**Implementation:**

```prisma
model Configuration {
  // ... existing fields ...
  shareToken  String?   @unique  // Already exists, keep as-is
  shareCount  Int       @default(0)  // NEW: Track share analytics
  savedAt     DateTime? // NEW: When config was saved (vs completed)

  // ... existing indexes ...
  @@index([shareToken]) // NEW: Fast lookup for shareable URLs
}
```

**Migration Impact:**

- `shareToken` already exists, no change needed
- `shareCount` defaults to 0 (safe for existing records)
- `savedAt` is nullable (existing records = null, fine)

**Validation:**

- Verify unique constraint on shareToken works
- Test index performance for token lookups

---

### 1.3: Create CustomerInquiry Model

**Purpose:** Track customer engagement actions (FR-8)

**Implementation:**

```prisma
model CustomerInquiry {
  id               String   @id @default(cuid())
  shop             String   // Multi-tenant isolation

  // Inquiry details
  type             String   // "hint" | "info" | "viewing" | "email"
  configurationId  String?  // Related configuration (optional)
  productId        String?  // Related product (optional)

  // Customer information
  customerName     String?
  customerEmail    String   // Required
  customerPhone    String?
  message          String?

  // Scheduling (for viewing appointments)
  preferredDate    DateTime?
  preferredTime    String?  // Store as string (e.g., "2:00 PM")

  // Status tracking
  status           String   @default("new") // "new" | "contacted" | "closed"

  // Timestamps
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  // Indexes for admin dashboard queries
  @@index([shop, type])
  @@index([shop, status])
  @@index([shop, createdAt])
}
```

**Why This Design:**

- Flexible: Handles all 4 inquiry types
- Performant: Indexes on common query patterns
- Scalable: Supports multi-tenant isolation

**Validation:**

- Test all 4 inquiry types can be stored
- Verify indexes work for admin dashboard filters

---

### 1.4: Update AppSettings Model

**Purpose:** Store Phase 2.0 feature configuration (FR-8.6, FR-9.3)

**Implementation:**

```prisma
model AppSettings {
  // ... existing fields ...

  // Phase 2.0 feature settings (stored as JSON)
  customerEngagement String? // JSON: { dropHintEnabled, requestInfoEnabled, etc. }
  virtualTryOn       String? // JSON: { enabled, integrationType, apiKey, etc. }
  socialSharing      String? // JSON: { facebookAppId, enabledPlatforms, etc. }

  // ... existing timestamps ...
}
```

**JSON Structure Examples:**

```typescript
// customerEngagement
{
  dropHintEnabled: boolean,
  requestInfoEnabled: boolean,
  emailFriendEnabled: boolean,
  scheduleViewingEnabled: boolean,
  notificationEmail: string,
  responseTemplates: { [key: string]: string }
}

// virtualTryOn
{
  enabled: boolean,
  integrationType: "none" | "simple_upload" | "third_party" | "ar_quicklook",
  apiKey?: string,
  apiUrl?: string,
  buttonLabel?: string
}

// socialSharing
{
  facebookAppId?: string,
  enabledPlatforms: string[], // ["facebook", "twitter", "pinterest"]
  defaultMessage?: string
}
```

**Why JSON Fields:**

- Flexibility: Easy to add new settings without migrations
- Simplicity: Single query to get all feature settings
- Phase 1.0 Pattern: Follows existing `sideStones` JSON field

**Validation:**

- Test JSON parsing/serialization
- Verify backwards compatibility (nullable = Phase 1.0 apps still work)

---

### 1.5: Run Database Migrations

**Implementation:**

```bash
npx prisma migrate dev --name phase_2_foundation
```

**Migration File Will Include:**

1. ALTER TABLE StoneMetadata ADD COLUMN diamondType
2. CREATE INDEX on StoneMetadata(shop, diamondType)
3. ALTER TABLE Configuration ADD COLUMN shareCount, savedAt
4. CREATE INDEX on Configuration(shareToken)
5. CREATE TABLE CustomerInquiry
6. CREATE 3 INDEXES on CustomerInquiry
7. ALTER TABLE AppSettings ADD 3 JSON columns

**Risk Mitigation:**

- Test on development database first
- Backup production before running
- Verify rollback works
- Monitor migration execution time

**Validation:**

- Check `prisma studio` - all new fields/tables exist
- Verify data types are correct
- Confirm indexes are created
- Test rollback scenario

---

### 1.6: Update TypeScript Types (app/types/builder.ts)

**Additions Required:**

```typescript
// ============================================================================
// PHASE 2.0 ADDITIONS
// ============================================================================

/**
 * Diamond type categorization for tabs
 */
export type DiamondType = "mined" | "lab_grown" | "fancy_color";

/**
 * Customer inquiry types
 */
export type InquiryType = "hint" | "info" | "viewing" | "email";

/**
 * Inquiry status for tracking
 */
export type InquiryStatus = "new" | "contacted" | "closed";

/**
 * Saved configuration interface
 */
export interface SavedConfiguration extends Configuration {
  shareToken: string; // Required for saved configs
  savedAt: Date;
  shareCount: number;
}

/**
 * Customer inquiry data
 */
export interface CustomerInquiry {
  id: string;
  shop: string;
  type: InquiryType;
  configurationId?: string;
  productId?: string;
  customerName?: string;
  customerEmail: string;
  customerPhone?: string;
  message?: string;
  preferredDate?: Date;
  preferredTime?: string;
  status: InquiryStatus;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Customer engagement settings
 */
export interface CustomerEngagementSettings {
  dropHintEnabled: boolean;
  requestInfoEnabled: boolean;
  emailFriendEnabled: boolean;
  scheduleViewingEnabled: boolean;
  notificationEmail?: string;
  responseTemplates?: Record<string, string>;
}

/**
 * Virtual try-on settings
 */
export interface VirtualTryOnSettings {
  enabled: boolean;
  integrationType: "none" | "simple_upload" | "third_party" | "ar_quicklook";
  apiKey?: string;
  apiUrl?: string;
  buttonLabel?: string;
}

/**
 * Social sharing settings
 */
export interface SocialSharingSettings {
  facebookAppId?: string;
  enabledPlatforms: string[];
  defaultMessage?: string;
}

/**
 * Updated Stone interface with diamondType
 */
export interface Stone {
  // ... existing fields ...
  diamondType: DiamondType; // NEW
  // ... rest of fields ...
}

/**
 * Updated StoneFilters with diamondType
 */
export interface StoneFilters {
  // ... existing filters ...
  diamondType?: DiamondType[]; // NEW: Filter by diamond type
  // ... rest of filters ...
}

/**
 * Updated ParsedAppSettings with Phase 2.0 fields
 */
export interface ParsedAppSettings {
  // ... existing fields ...
  customerEngagement?: CustomerEngagementSettings; // NEW
  virtualTryOn?: VirtualTryOnSettings; // NEW
  socialSharing?: SocialSharingSettings; // NEW
  // ... rest of fields ...
}
```

**Validation:**

- Run `npm run typecheck` - no errors
- Verify autocomplete works in IDE
- Check no breaking changes to existing code

---

### 1.7: Create app/types/metafields.ts

**Purpose:** Define Shopify metafield structure for Task 2.0

**Implementation:**

```typescript
/**
 * Shopify Metafields Type Definitions
 *
 * Phase 2.0: Metafields-first architecture
 * Namespace: "ringbuilder"
 */

import type {
  StoneShape,
  SettingStyle,
  CutGrade,
  ColorGrade,
  ClarityGrade,
  CertificationType,
  MetalType,
  DiamondType,
} from "./builder";

// ============================================================================
// METAFIELD TYPE MAPPINGS
// ============================================================================

/**
 * Shopify metafield value types
 * See: https://shopify.dev/docs/apps/custom-data/metafields/types
 */
export type MetafieldType =
  | "single_line_text_field"
  | "multi_line_text_field"
  | "number_decimal"
  | "number_integer"
  | "url"
  | "json"
  | "list.single_line_text_field";

// ============================================================================
// DIAMOND METAFIELDS
// ============================================================================

/**
 * Diamond/Stone metafield structure
 */
export interface DiamondMetafields {
  // Required fields
  type: "diamond" | "gemstone"; // Product type
  shape: StoneShape; // Diamond shape
  carat: number; // Carat weight
  diamond_type: DiamondType; // NEW Phase 2.0: Mined/Lab Grown/Fancy

  // 4Cs
  cut?: CutGrade;
  color?: ColorGrade;
  clarity?: ClarityGrade;

  // Certification
  certificate?: CertificationType;
  certificate_number?: string;
  certificate_url?: string; // URL to PDF

  // Detailed specs
  measurements?: string; // "7.35 x 7.40 x 4.50"
  table_percent?: number;
  depth_percent?: number;
  polish?: string;
  symmetry?: string;
  fluorescence?: string;
}

/**
 * Metafield definitions for diamonds
 */
export const DIAMOND_METAFIELD_DEFINITIONS = [
  {
    key: "type",
    type: "single_line_text_field" as MetafieldType,
    namespace: "ringbuilder",
  },
  {
    key: "shape",
    type: "single_line_text_field" as MetafieldType,
    namespace: "ringbuilder",
  },
  {
    key: "carat",
    type: "number_decimal" as MetafieldType,
    namespace: "ringbuilder",
  },
  {
    key: "diamond_type",
    type: "single_line_text_field" as MetafieldType,
    namespace: "ringbuilder",
  },
  {
    key: "cut",
    type: "single_line_text_field" as MetafieldType,
    namespace: "ringbuilder",
  },
  {
    key: "color",
    type: "single_line_text_field" as MetafieldType,
    namespace: "ringbuilder",
  },
  {
    key: "clarity",
    type: "single_line_text_field" as MetafieldType,
    namespace: "ringbuilder",
  },
  {
    key: "certificate",
    type: "single_line_text_field" as MetafieldType,
    namespace: "ringbuilder",
  },
  {
    key: "certificate_number",
    type: "single_line_text_field" as MetafieldType,
    namespace: "ringbuilder",
  },
  {
    key: "certificate_url",
    type: "url" as MetafieldType,
    namespace: "ringbuilder",
  },
  {
    key: "measurements",
    type: "single_line_text_field" as MetafieldType,
    namespace: "ringbuilder",
  },
  {
    key: "table_percent",
    type: "number_decimal" as MetafieldType,
    namespace: "ringbuilder",
  },
  {
    key: "depth_percent",
    type: "number_decimal" as MetafieldType,
    namespace: "ringbuilder",
  },
  {
    key: "polish",
    type: "single_line_text_field" as MetafieldType,
    namespace: "ringbuilder",
  },
  {
    key: "symmetry",
    type: "single_line_text_field" as MetafieldType,
    namespace: "ringbuilder",
  },
  {
    key: "fluorescence",
    type: "single_line_text_field" as MetafieldType,
    namespace: "ringbuilder",
  },
] as const;

// ============================================================================
// SETTING METAFIELDS
// ============================================================================

/**
 * Setting metafield structure
 */
export interface SettingMetafields {
  // Required fields
  type: "setting";
  style: SettingStyle;
  compatible_shapes: StoneShape[]; // Array of compatible shapes

  // Pricing
  metal_prices: Record<MetalType, number>; // JSON object

  // Optional
  setting_height?: "low" | "medium" | "high";
}

/**
 * Metafield definitions for settings
 */
export const SETTING_METAFIELD_DEFINITIONS = [
  {
    key: "type",
    type: "single_line_text_field" as MetafieldType,
    namespace: "ringbuilder",
  },
  {
    key: "style",
    type: "single_line_text_field" as MetafieldType,
    namespace: "ringbuilder",
  },
  {
    key: "compatible_shapes",
    type: "list.single_line_text_field" as MetafieldType,
    namespace: "ringbuilder",
  },
  {
    key: "metal_prices",
    type: "json" as MetafieldType,
    namespace: "ringbuilder",
  },
  {
    key: "setting_height",
    type: "single_line_text_field" as MetafieldType,
    namespace: "ringbuilder",
  },
] as const;

// ============================================================================
// HELPER TYPES
// ============================================================================

/**
 * Shopify metafield object (from GraphQL API)
 */
export interface ShopifyMetafield {
  id: string;
  namespace: string;
  key: string;
  value: string;
  type: string;
}

/**
 * Metafield input for creating/updating
 */
export interface MetafieldInput {
  namespace: string;
  key: string;
  value: string;
  type: MetafieldType;
}

/**
 * All metafield definitions combined
 */
export const ALL_METAFIELD_DEFINITIONS = [
  ...DIAMOND_METAFIELD_DEFINITIONS,
  ...SETTING_METAFIELD_DEFINITIONS,
] as const;
```

**Why This Structure:**

- **Namespace isolation**: All ring builder data in "ringbuilder" namespace
- **Type safety**: Full TypeScript support for metafield operations
- **Documentation**: Clear definitions for Task 2.0 implementation
- **Extensibility**: Easy to add new metafield types

**Validation:**

- Import in Task 2.0 metafields service
- Verify type checking works
- Confirm metafield definitions are complete

---

### 1.8: Validation Checklist

**Build & Type Checks:**

- [ ] `npm run typecheck` passes (no TypeScript errors)
- [ ] `npm run lint` passes (no ESLint errors)
- [ ] `npm run build` succeeds (production build works)

**Database Validation:**

- [ ] Migrations applied successfully
- [ ] Open `npx prisma studio`:
  - [ ] StoneMetadata has `diamondType` column (default "mined")
  - [ ] StoneMetadata has index on `[shop, diamondType]`
  - [ ] Configuration has `shareCount` column (default 0)
  - [ ] Configuration has `savedAt` column (nullable)
  - [ ] Configuration has index on `shareToken`
  - [ ] CustomerInquiry table exists with all fields
  - [ ] CustomerInquiry has 3 indexes
  - [ ] AppSettings has 3 new JSON columns

**Type System Validation:**

- [ ] New types import successfully
- [ ] IDE autocomplete works for new types
- [ ] No breaking changes to existing code
- [ ] metafields.ts exports correctly

**Rollback Test:**

- [ ] Test migration rollback scenario
- [ ] Verify database returns to previous state
- [ ] No data loss on rollback

**Review Checklist:**

- [ ] All 1.x sub-tasks completed ✅
- [ ] Documentation updated (inline comments)
- [ ] Git commit with clear message
- [ ] Ready for Task 2.0 (metafields service)

---

## Risk Analysis

### High Risk Items

**1. Database Migration on Production**

- **Risk:** Data loss, downtime, broken app
- **Mitigation:**
  - Test thoroughly on staging
  - Backup production database before migration
  - Run migration during low-traffic window
  - Have rollback plan ready
  - Monitor application after migration

**2. Breaking Changes to Existing Code**

- **Risk:** Phase 1.0 functionality breaks
- **Mitigation:**
  - All new fields are nullable or have defaults
  - No changes to existing fields
  - Run full regression test suite
  - Beta test with 1-2 merchants first

**3. Type System Conflicts**

- **Risk:** TypeScript errors cascade across codebase
- **Mitigation:**
  - Careful type updates (non-breaking)
  - Use optional properties where appropriate
  - Run typecheck after each change
  - Test in IDE for autocomplete issues

### Medium Risk Items

**4. Index Performance Impact**

- **Risk:** New indexes slow down writes
- **Mitigation:**
  - Indexes are on read-heavy tables
  - Test with 1000+ records
  - Monitor query performance
  - Optimize if needed in Task 10.0

**5. JSON Field Parsing**

- **Risk:** Invalid JSON breaks application
- **Mitigation:**
  - Validate JSON on write
  - Handle parse errors gracefully
  - Provide defaults for missing fields
  - Test with malformed data

---

## Success Criteria

Task 1.0 is complete when:

✅ **Code Quality:**

- [ ] Zero TypeScript errors
- [ ] Zero ESLint warnings
- [ ] Zero build errors
- [ ] All types properly documented

✅ **Database:**

- [ ] All 4 models updated correctly
- [ ] All indexes created successfully
- [ ] Migrations run without errors
- [ ] Rollback tested and works

✅ **Testing:**

- [ ] Manual validation in Prisma Studio
- [ ] Existing data not corrupted
- [ ] New fields accessible
- [ ] Queries with new filters work

✅ **Documentation:**

- [ ] Inline code comments added
- [ ] Analysis document complete (this file)
- [ ] Next steps clear (Task 2.0 ready)

---

## Dependencies for Next Tasks

**Task 1.0 Enables:**

- **Task 2.0:** Metafields service (uses metafields.ts)
- **Task 3.0:** Admin UI (uses CustomerInquiry model)
- **Task 4.0:** Diamond type tabs (uses diamondType field)
- **Task 5.0:** Comparison (uses database structure)
- **Task 6.0:** Save & Share (uses shareToken fields)
- **Task 7.0:** Inquiry forms (uses CustomerInquiry model)

**Blocking Issues:** None (Task 1.0 is foundational)

---

## Time Estimate

**Actual Implementation Time:**

- Sub-tasks 1.1-1.4: 2 hours (schema updates)
- Sub-task 1.5: 30 minutes (run migrations)
- Sub-task 1.6: 1.5 hours (TypeScript types)
- Sub-task 1.7: 1 hour (metafields.ts)
- Sub-task 1.8: 1 hour (validation and testing)

**Total: 6 hours** (conservative estimate: 8 hours including documentation)

---

## Next Steps After Task 1.0

1. **Install Phase 2.0 Dependencies**

   ```bash
   npm install react-icons @sendgrid/mail nanoid ical-generator react-image-gallery
   ```

2. **Proceed to Task 2.0: Shopify Metafields Integration**
   - Create metafields.server.ts service
   - Implement CRUD operations for metafields
   - Set up webhook sync system

3. **Update README with Phase 2.0 info**

---

**Status:** ✅ Analysis Complete - Ready for Implementation

**Next Action:** Begin Sub-task 1.1 - Create Prisma migration for diamondType field
