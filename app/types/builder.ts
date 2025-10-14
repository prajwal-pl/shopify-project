/**
 * Ring Builder MVP - TypeScript Types & Interfaces
 *
 * All type definitions for the Ring Builder application.
 */

import type {
  Configuration as PrismaConfiguration,
  SettingMetadata as PrismaSettingMetadata,
  StoneMetadata as PrismaStoneMetadata,
  AppSettings as PrismaAppSettings,
  AnalyticsEvent as PrismaAnalyticsEvent,
  ConfigurationStatus,
} from "@prisma/client";

import type {
  MetalType,
  StoneShape,
  SettingStyle,
  CutGrade,
  ColorGrade,
  ClarityGrade,
  CertificationType,
  RingSize,
} from "~/utils/constants";

// Re-export types for components
export type {
  MetalType,
  StoneShape,
  SettingStyle,
  CutGrade,
  ColorGrade,
  ClarityGrade,
  CertificationType,
  RingSize,
};

// ============================================================================
// PHASE 2.0 TYPE ADDITIONS
// ============================================================================

/**
 * Diamond type categorization for tabs (Phase 2.0)
 */
export type DiamondType = "mined" | "lab_grown" | "fancy_color";

/**
 * Customer inquiry types (Phase 2.0)
 */
export type InquiryType = "hint" | "info" | "viewing" | "email";

/**
 * Inquiry status for tracking (Phase 2.0)
 */
export type InquiryStatus = "new" | "contacted" | "closed";

// ============================================================================
// CONFIGURATION TYPES
// ============================================================================

/**
 * Ring configuration data
 */
export interface Configuration extends PrismaConfiguration {
  // Prisma model fields are already included
}

/**
 * Configuration creation input
 */
export interface CreateConfigurationInput {
  shop: string;
  customerId?: string;
  customerEmail?: string;
  settingId: string;
  stoneId: string;
  metalType: MetalType;
  ringSize: RingSize;
  sideStonesConfig?: SideStonesConfig;
  settingPrice: number;
  stonePrice: number;
  sideStonesPrice?: number;
  totalPrice: number;
  status?: ConfigurationStatus;
  configurationId: string;
  cartItemId?: string;
}

/**
 * Configuration update input
 */
export interface UpdateConfigurationInput {
  status?: ConfigurationStatus;
  cartItemId?: string;
}

/**
 * Saved configuration interface (Phase 2.0)
 * Used for shareable configurations with tokens
 */
export interface SavedConfiguration extends Configuration {
  shareToken: string; // Required for saved configs
  savedAt: Date;
  shareCount: number;
}

/**
 * Configuration summary for display
 */
export interface ConfigurationSummary {
  id: string;
  configurationId: string;
  setting: {
    id: string;
    name: string;
    sku: string;
    metalType: MetalType;
    style: string;
    price: number;
    image?: string;
  };
  stone: {
    id: string;
    carat: number;
    shape: StoneShape;
    cut?: CutGrade;
    color?: ColorGrade;
    clarity?: ClarityGrade;
    certificate?: CertificationType;
    certificateNumber?: string;
    price: number;
    image?: string;
  };
  sideStones?: {
    quality: string;
    quantity: number;
    price: number;
  };
  ringSize: RingSize;
  priceBreakdown: PriceBreakdown;
  status: ConfigurationStatus;
  createdAt: Date;
}

// ============================================================================
// SETTING TYPES
// ============================================================================

/**
 * Setting metadata
 */
export interface SettingMetadata extends PrismaSettingMetadata {
  // Prisma model fields are already included
}

/**
 * Parsed setting metadata with typed fields
 */
export interface ParsedSettingMetadata {
  id: string;
  shop: string;
  productId: string;
  style: SettingStyle;
  settingHeight?: string;
  compatibleShapes: StoneShape[];
  basePrices: Record<MetalType, number>;
  images: string[];
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Setting for display in builder
 */
export interface Setting {
  id: string;
  productId: string;
  name: string;
  description?: string;
  sku?: string;
  style: SettingStyle;
  settingHeight?: string;
  compatibleShapes: StoneShape[];
  basePrices: Record<MetalType, number>;
  startingPrice: number; // Lowest base price
  images: string[];
  featured: boolean;
}

/**
 * Setting filter options
 */
export interface SettingFilters {
  style?: SettingStyle[];
  metalType?: MetalType[];
  priceMin?: number;
  priceMax?: number;
  featured?: boolean;
}

// ============================================================================
// STONE TYPES
// ============================================================================

/**
 * Stone metadata
 */
export interface StoneMetadata extends PrismaStoneMetadata {
  // Prisma model fields are already included
}

/**
 * Stone for display in builder
 */
export interface Stone {
  id: string;
  productId: string;
  stoneType: string;
  shape: StoneShape;
  carat: number;
  cut?: CutGrade;
  color?: ColorGrade;
  clarity?: ClarityGrade;
  diamondType: DiamondType; // Phase 2.0: Mined/Lab Grown/Fancy Color
  certificate?: CertificationType;
  certificateNumber?: string;
  certificateUrl?: string;
  measurements?: string;
  tablePercent?: number;
  depthPercent?: number;
  polish?: string;
  symmetry?: string;
  fluorescence?: string;
  images: string[];
  price: number;
  available: boolean;
}

/**
 * Stone filter options
 */
export interface StoneFilters {
  shape?: StoneShape[];
  caratMin?: number;
  caratMax?: number;
  cut?: CutGrade[];
  color?: ColorGrade[];
  clarity?: ClarityGrade[];
  priceMin?: number;
  priceMax?: number;
  certification?: CertificationType[];
  available?: boolean;
  diamondType?: DiamondType[]; // Phase 2.0: Filter by diamond type
}

/**
 * Stone sort options
 */
export type StoneSortField = "price" | "carat" | "cut" | "color" | "clarity";
export type SortOrder = "asc" | "desc";

export interface StoneSortOptions {
  field: StoneSortField;
  order: SortOrder;
}

// ============================================================================
// APP SETTINGS TYPES
// ============================================================================

/**
 * App settings
 */
export interface AppSettings extends PrismaAppSettings {
  // Prisma model fields are already included
}

/**
 * Parsed app settings with typed fields
 */
export interface ParsedAppSettings {
  id: string;
  shop: string;
  builderEnabled: boolean;
  sideStones?: SideStonesSettings;
  engravingFee?: number;
  markupPercent: number;
  notifyOnConfig: boolean;
  notificationEmail?: string;
  primaryColor?: string;
  accentColor?: string;
  // Phase 2.0 feature settings
  customerEngagement?: CustomerEngagementSettings;
  virtualTryOn?: VirtualTryOnSettings;
  socialSharing?: SocialSharingSettings;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Customer engagement settings (Phase 2.0)
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
 * Virtual try-on settings (Phase 2.0)
 */
export interface VirtualTryOnSettings {
  enabled: boolean;
  integrationType: "none" | "simple_upload" | "third_party" | "ar_quicklook";
  apiKey?: string;
  apiUrl?: string;
  buttonLabel?: string;
}

/**
 * Social sharing settings (Phase 2.0)
 */
export interface SocialSharingSettings {
  facebookAppId?: string;
  enabledPlatforms: string[]; // ["facebook", "twitter", "pinterest"]
  defaultMessage?: string;
}

/**
 * Side stones settings
 */
export interface SideStonesSettings {
  enabled: boolean;
  qualities: string[];
  pricing: Record<string, number>;
  minQuantity: number;
  maxQuantity: number;
}

/**
 * Side stones configuration in a ring configuration
 */
export interface SideStonesConfig {
  quality: string;
  quantity: number;
  price: number;
}

// ============================================================================
// ANALYTICS TYPES
// ============================================================================

/**
 * Analytics event
 */
export interface AnalyticsEvent extends PrismaAnalyticsEvent {
  // Prisma model fields are already included
}

/**
 * Analytics event types
 */
export type AnalyticsEventType =
  | "builder_started"
  | "setting_selected"
  | "stone_selected"
  | "customization_completed"
  | "review_viewed"
  | "cart_added"
  | "cart_failed"
  | "configuration_saved"
  | "configuration_shared";

/**
 * Analytics event data (varies by event type)
 */
export interface AnalyticsEventData {
  step?: number;
  settingId?: string;
  stoneId?: string;
  configurationId?: string;
  error?: string;
  [key: string]: any;
}

// ============================================================================
// CUSTOMER INQUIRY TYPES (PHASE 2.0)
// ============================================================================

/**
 * Customer inquiry data (Phase 2.0)
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

// ============================================================================
// PRICING TYPES
// ============================================================================

/**
 * Price breakdown for a configuration
 */
export interface PriceBreakdown {
  settingPrice: number;
  stonePrice: number;
  sideStonesPrice: number;
  subtotal: number;
  markup: number;
  markupPercent: number;
  total: number;
}

/**
 * Pricing calculation input
 */
export interface PricingInput {
  settingId: string;
  metalType: MetalType;
  stoneId: string;
  sideStones?: {
    quality: string;
    quantity: number;
  };
  shop: string;
}

// ============================================================================
// BUILDER STATE TYPES
// ============================================================================

/**
 * Builder step numbers
 */
export type BuilderStep = 1 | 2 | 3 | 4;

/**
 * Builder state (for React Context)
 */
export interface BuilderState {
  currentStep: BuilderStep;
  selectedSetting?: Setting;
  selectedMetalType?: MetalType;
  selectedStone?: Stone;
  ringSize?: RingSize;
  sideStones?: SideStonesConfig;
  priceBreakdown: PriceBreakdown;
}

/**
 * Builder actions (for React Context)
 */
export interface BuilderActions {
  selectSetting: (setting: Setting, metalType: MetalType) => void;
  selectStone: (stone: Stone) => void;
  updateMetalType: (metalType: MetalType) => void;
  updateRingSize: (size: RingSize) => void;
  updateSideStones: (config: SideStonesConfig) => void;
  goToStep: (step: BuilderStep) => void;
  resetBuilder: () => void;
  calculatePrice: () => void;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

/**
 * API response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  errors?: string[];
}

/**
 * Settings API response
 */
export interface SettingsApiResponse {
  settings: Setting[];
  filters: {
    styles: SettingStyle[];
    metalTypes: MetalType[];
    priceRange: { min: number; max: number };
  };
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNextPage: boolean;
  };
}

/**
 * Stones API response
 */
export interface StonesApiResponse {
  stones: Stone[];
  filters: {
    shapes: StoneShape[];
    caratRange: { min: number; max: number };
    priceRange: { min: number; max: number };
    cuts: CutGrade[];
    colors: ColorGrade[];
    clarities: ClarityGrade[];
    certifications: CertificationType[];
  };
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNextPage: boolean;
  };
}

/**
 * Cart add response
 */
export interface CartAddResponse {
  success: boolean;
  configurationId: string;
  cartItemId?: string;
  redirectUrl: string;
  error?: string;
}

// ============================================================================
// SHOPIFY TYPES
// ============================================================================

/**
 * Shopify product variant
 */
export interface ShopifyVariant {
  id: string;
  title: string;
  sku: string;
  price: string;
  compareAtPrice?: string;
  inventoryQuantity: number;
  availableForSale: boolean;
  selectedOptions: Array<{
    name: string;
    value: string;
  }>;
}

/**
 * Shopify product
 */
export interface ShopifyProduct {
  id: string;
  title: string;
  description: string;
  handle: string;
  status: string;
  vendor: string;
  productType: string;
  tags: string[];
  images: Array<{
    id: string;
    url: string;
    altText?: string;
  }>;
  variants: ShopifyVariant[];
  metafields: Array<{
    id: string;
    namespace: string;
    key: string;
    value: string;
    type: string;
  }>;
}

/**
 * Line item properties for Shopify cart
 */
export interface LineItemProperties {
  Setting: string;
  "Setting SKU": string;
  "Center Stone": string;
  "Stone SKU": string;
  "Stone Certificate": string;
  "Side Stones"?: string;
  "Ring Size": string;
  "Configuration ID": string;
}

// ============================================================================
// CSV IMPORT/EXPORT TYPES
// ============================================================================

/**
 * CSV import result
 */
export interface CsvImportResult {
  imported: number;
  failed: number;
  errors: Array<{
    row: number;
    error: string;
    data?: any;
  }>;
}

/**
 * Stone CSV row
 */
export interface StoneCsvRow {
  productId: string;
  stoneType: string;
  shape: StoneShape;
  carat: number;
  cut?: CutGrade;
  color?: ColorGrade;
  clarity?: ClarityGrade;
  certificate?: CertificationType;
  certificateNumber?: string;
  certificateUrl?: string;
  measurements?: string;
  tablePercent?: number;
  depthPercent?: number;
  polish?: string;
  symmetry?: string;
  fluorescence?: string;
  price: number;
}

// ============================================================================
// VALIDATION TYPES
// ============================================================================

/**
 * Validation result
 */
export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

/**
 * Validation error
 */
export interface ValidationError {
  field: string;
  message: string;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Extract keys of T where the value type is V
 */
export type KeysOfType<T, V> = {
  [K in keyof T]: T[K] extends V ? K : never;
}[keyof T];

/**
 * Make specified keys optional
 */
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Make specified keys required
 */
export type Required<T, K extends keyof T> = T & { [P in K]-?: T[P] };
