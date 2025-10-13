/**
 * Ring Builder MVP - Constants
 *
 * All enums, options, and constant values used throughout the application.
 * Based on PRD requirements for FR-2 through FR-4.
 */

// ============================================================================
// METAL TYPES
// ============================================================================

export const METAL_TYPES = [
  { value: "14k_white_gold", label: "14K White Gold" },
  { value: "14k_yellow_gold", label: "14K Yellow Gold" },
  { value: "18k_rose_gold", label: "18K Rose Gold" },
  { value: "platinum", label: "Platinum" },
] as const;

export type MetalType = (typeof METAL_TYPES)[number]["value"];

// ============================================================================
// STONE SHAPES
// ============================================================================

export const STONE_SHAPES = [
  { value: "round", label: "Round" },
  { value: "princess", label: "Princess" },
  { value: "cushion", label: "Cushion" },
  { value: "emerald", label: "Emerald" },
  { value: "oval", label: "Oval" },
  { value: "radiant", label: "Radiant" },
  { value: "asscher", label: "Asscher" },
  { value: "marquise", label: "Marquise" },
  { value: "pear", label: "Pear" },
  { value: "heart", label: "Heart" },
] as const;

export type StoneShape = (typeof STONE_SHAPES)[number]["value"];

// ============================================================================
// SETTING STYLES
// ============================================================================

export const SETTING_STYLES = [
  { value: "solitaire", label: "Solitaire" },
  { value: "halo", label: "Halo" },
  { value: "three_stone", label: "Three-Stone" },
  { value: "vintage", label: "Vintage" },
  { value: "modern", label: "Modern" },
  { value: "pave", label: "Pavé" },
  { value: "channel", label: "Channel" },
  { value: "tension", label: "Tension" },
] as const;

export type SettingStyle = (typeof SETTING_STYLES)[number]["value"];

// ============================================================================
// SETTING HEIGHT
// ============================================================================

export const SETTING_HEIGHTS = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
] as const;

export type SettingHeight = (typeof SETTING_HEIGHTS)[number]["value"];

// ============================================================================
// DIAMOND CUT GRADES
// ============================================================================

export const CUT_GRADES = [
  { value: "excellent", label: "Excellent", sortOrder: 1 },
  { value: "very_good", label: "Very Good", sortOrder: 2 },
  { value: "good", label: "Good", sortOrder: 3 },
  { value: "fair", label: "Fair", sortOrder: 4 },
  { value: "poor", label: "Poor", sortOrder: 5 },
] as const;

export type CutGrade = (typeof CUT_GRADES)[number]["value"];

// ============================================================================
// DIAMOND COLOR GRADES
// ============================================================================

export const COLOR_GRADES = [
  { value: "d", label: "D", sortOrder: 1 },
  { value: "e", label: "E", sortOrder: 2 },
  { value: "f", label: "F", sortOrder: 3 },
  { value: "g", label: "G", sortOrder: 4 },
  { value: "h", label: "H", sortOrder: 5 },
  { value: "i", label: "I", sortOrder: 6 },
  { value: "j", label: "J", sortOrder: 7 },
  { value: "k", label: "K", sortOrder: 8 },
  { value: "l", label: "L", sortOrder: 9 },
  { value: "m", label: "M", sortOrder: 10 },
] as const;

export type ColorGrade = (typeof COLOR_GRADES)[number]["value"];

// ============================================================================
// DIAMOND CLARITY GRADES
// ============================================================================

export const CLARITY_GRADES = [
  { value: "fl", label: "FL", sortOrder: 1 },
  { value: "if", label: "IF", sortOrder: 2 },
  { value: "vvs1", label: "VVS1", sortOrder: 3 },
  { value: "vvs2", label: "VVS2", sortOrder: 4 },
  { value: "vs1", label: "VS1", sortOrder: 5 },
  { value: "vs2", label: "VS2", sortOrder: 6 },
  { value: "si1", label: "SI1", sortOrder: 7 },
  { value: "si2", label: "SI2", sortOrder: 8 },
  { value: "i1", label: "I1", sortOrder: 9 },
  { value: "i2", label: "I2", sortOrder: 10 },
  { value: "i3", label: "I3", sortOrder: 11 },
] as const;

export type ClarityGrade = (typeof CLARITY_GRADES)[number]["value"];

// ============================================================================
// CERTIFICATION TYPES
// ============================================================================

export const CERTIFICATION_TYPES = [
  { value: "gia", label: "GIA" },
  { value: "ags", label: "AGS" },
  { value: "igi", label: "IGI" },
  { value: "egl", label: "EGL" },
  { value: "hrd", label: "HRD" },
  { value: "none", label: "No Certificate" },
] as const;

export type CertificationType = (typeof CERTIFICATION_TYPES)[number]["value"];

// ============================================================================
// POLISH & SYMMETRY GRADES
// ============================================================================

export const POLISH_GRADES = [
  { value: "excellent", label: "Excellent" },
  { value: "very_good", label: "Very Good" },
  { value: "good", label: "Good" },
  { value: "fair", label: "Fair" },
  { value: "poor", label: "Poor" },
] as const;

export const SYMMETRY_GRADES = [
  { value: "excellent", label: "Excellent" },
  { value: "very_good", label: "Very Good" },
  { value: "good", label: "Good" },
  { value: "fair", label: "Fair" },
  { value: "poor", label: "Poor" },
] as const;

export type PolishGrade = (typeof POLISH_GRADES)[number]["value"];
export type SymmetryGrade = (typeof SYMMETRY_GRADES)[number]["value"];

// ============================================================================
// FLUORESCENCE
// ============================================================================

export const FLUORESCENCE_LEVELS = [
  { value: "none", label: "None" },
  { value: "faint", label: "Faint" },
  { value: "medium", label: "Medium" },
  { value: "strong", label: "Strong" },
  { value: "very_strong", label: "Very Strong" },
] as const;

export type FluorescenceLevel = (typeof FLUORESCENCE_LEVELS)[number]["value"];

// ============================================================================
// STONE TYPES
// ============================================================================

export const STONE_TYPES = [
  { value: "diamond", label: "Diamond" },
  { value: "sapphire", label: "Sapphire" },
  { value: "ruby", label: "Ruby" },
  { value: "emerald", label: "Emerald" },
  { value: "other", label: "Other" },
] as const;

export type StoneType = (typeof STONE_TYPES)[number]["value"];

// ============================================================================
// RING SIZES (US Standard)
// ============================================================================

export const RING_SIZES = [
  "3",
  "3.5",
  "4",
  "4.5",
  "5",
  "5.5",
  "6",
  "6.5",
  "7",
  "7.5",
  "8",
  "8.5",
  "9",
  "9.5",
  "10",
  "10.5",
  "11",
  "11.5",
  "12",
] as const;

export type RingSize = (typeof RING_SIZES)[number];

// ============================================================================
// CONFIGURATION STATUS
// ============================================================================

export enum ConfigurationStatus {
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  ORDERED = "ordered",
}

// ============================================================================
// PRODUCT TYPES
// ============================================================================

export enum ProductType {
  SETTING = "setting",
  STONE = "stone",
}

// ============================================================================
// PAGINATION
// ============================================================================

export const PAGINATION = {
  SETTINGS_PER_PAGE: 24,
  STONES_PER_PAGE: 50,
  ADMIN_PRODUCTS_PER_PAGE: 50,
} as const;

// ============================================================================
// FILTER RANGES
// ============================================================================

export const CARAT_RANGE = {
  MIN: 0.1,
  MAX: 10.0,
  STEP: 0.1,
} as const;

export const PRICE_RANGE = {
  MIN: 0,
  MAX: 100000,
  STEP: 100,
} as const;

// ============================================================================
// VALIDATION LIMITS
// ============================================================================

export const VALIDATION_LIMITS = {
  MAX_MARKUP_PERCENT: 100,
  MIN_MARKUP_PERCENT: 0,
  MAX_SIDE_STONES_QUANTITY: 50,
  MIN_SIDE_STONES_QUANTITY: 0,
  MAX_LINE_ITEM_PROPERTY_LENGTH: 255, // Shopify limit
} as const;

// ============================================================================
// DEBOUNCE TIMING
// ============================================================================

export const DEBOUNCE_MS = 300; // For filter changes

// ============================================================================
// API RATE LIMITS
// ============================================================================

export const SHOPIFY_RATE_LIMIT = {
  REQUESTS_PER_SECOND: 2,
  MAX_RETRIES: 3,
  RETRY_DELAY_MS: 1000,
} as const;

// ============================================================================
// DEFAULT COLORS (from PRD Design Considerations)
// ============================================================================

export const DEFAULT_COLORS = {
  PRIMARY: "#000000",
  ACCENT: "#D4AF37",
  BACKGROUND: "#FFFFFF",
  TEXT: "#1A1A1A",
  BORDER: "#E5E5E5",
  SUCCESS: "#10B981",
  ERROR: "#EF4444",
} as const;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get label for a metal type value
 */
export function getMetalTypeLabel(value: string): string {
  return METAL_TYPES.find((m) => m.value === value)?.label || value;
}

/**
 * Get label for a stone shape value
 */
export function getStoneShapeLabel(value: string): string {
  return STONE_SHAPES.find((s) => s.value === value)?.label || value;
}

/**
 * Get label for a setting style value
 */
export function getSettingStyleLabel(value: string): string {
  return SETTING_STYLES.find((s) => s.value === value)?.label || value;
}

/**
 * Get label for a cut grade value
 */
export function getCutGradeLabel(value: string): string {
  return CUT_GRADES.find((c) => c.value === value)?.label || value;
}

/**
 * Get label for a color grade value
 */
export function getColorGradeLabel(value: string): string {
  return (
    COLOR_GRADES.find((c) => c.value === value)?.label || value.toUpperCase()
  );
}

/**
 * Get label for a clarity grade value
 */
export function getClarityGradeLabel(value: string): string {
  return (
    CLARITY_GRADES.find((c) => c.value === value)?.label || value.toUpperCase()
  );
}

/**
 * Get label for a certification type value
 */
export function getCertificationLabel(value: string): string {
  return (
    CERTIFICATION_TYPES.find((c) => c.value === value)?.label ||
    value.toUpperCase()
  );
}

/**
 * Check if a value is a valid metal type
 */
export function isValidMetalType(value: string): value is MetalType {
  return METAL_TYPES.some((m) => m.value === value);
}

/**
 * Check if a value is a valid stone shape
 */
export function isValidStoneShape(value: string): value is StoneShape {
  return STONE_SHAPES.some((s) => s.value === value);
}

/**
 * Check if a value is a valid ring size
 */
export function isValidRingSize(value: string): value is RingSize {
  return RING_SIZES.includes(value as RingSize);
}
