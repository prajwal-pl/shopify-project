/**
 * Shopify Metafields Type Definitions
 *
 * Phase 2.0: Metafields-first architecture
 * Namespace: "ringbuilder"
 *
 * These types define the structure of metafields stored in Shopify
 * for ring builder products (diamonds/stones and settings).
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
  diamond_type: DiamondType; // Phase 2.0: Mined/Lab Grown/Fancy Color

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
 * Metafield definition structure for creating definitions
 */
export interface MetafieldDefinition {
  key: string;
  type: MetafieldType;
  namespace: string;
  name?: string;
  description?: string;
}

/**
 * Metafield definitions for diamonds
 */
export const DIAMOND_METAFIELD_DEFINITIONS: MetafieldDefinition[] = [
  {
    key: "type",
    type: "single_line_text_field",
    namespace: "ringbuilder",
    name: "Product Type",
    description: 'Type of product: "diamond" or "gemstone"',
  },
  {
    key: "shape",
    type: "single_line_text_field",
    namespace: "ringbuilder",
    name: "Diamond Shape",
    description: "Shape of the diamond (round, princess, oval, etc.)",
  },
  {
    key: "carat",
    type: "number_decimal",
    namespace: "ringbuilder",
    name: "Carat Weight",
    description: "Carat weight of the diamond",
  },
  {
    key: "diamond_type",
    type: "single_line_text_field",
    namespace: "ringbuilder",
    name: "Diamond Type",
    description: "Diamond type: mined, lab_grown, or fancy_color",
  },
  {
    key: "cut",
    type: "single_line_text_field",
    namespace: "ringbuilder",
    name: "Cut Grade",
    description: "Cut quality (excellent, very_good, good, fair, poor)",
  },
  {
    key: "color",
    type: "single_line_text_field",
    namespace: "ringbuilder",
    name: "Color Grade",
    description: "Color grade (d, e, f, g, h, i, j, k, l, m)",
  },
  {
    key: "clarity",
    type: "single_line_text_field",
    namespace: "ringbuilder",
    name: "Clarity Grade",
    description:
      "Clarity grade (fl, if, vvs1, vvs2, vs1, vs2, si1, si2, i1, i2, i3)",
  },
  {
    key: "certificate",
    type: "single_line_text_field",
    namespace: "ringbuilder",
    name: "Certificate Type",
    description: "Certification body (gia, ags, igi)",
  },
  {
    key: "certificate_number",
    type: "single_line_text_field",
    namespace: "ringbuilder",
    name: "Certificate Number",
    description: "Certificate identification number",
  },
  {
    key: "certificate_url",
    type: "url",
    namespace: "ringbuilder",
    name: "Certificate URL",
    description: "URL to the certificate PDF",
  },
  {
    key: "measurements",
    type: "single_line_text_field",
    namespace: "ringbuilder",
    name: "Measurements",
    description: 'Diamond measurements in mm (e.g., "7.35 x 7.40 x 4.50")',
  },
  {
    key: "table_percent",
    type: "number_decimal",
    namespace: "ringbuilder",
    name: "Table Percentage",
    description: "Table percentage of the diamond",
  },
  {
    key: "depth_percent",
    type: "number_decimal",
    namespace: "ringbuilder",
    name: "Depth Percentage",
    description: "Depth percentage of the diamond",
  },
  {
    key: "polish",
    type: "single_line_text_field",
    namespace: "ringbuilder",
    name: "Polish",
    description: "Polish quality",
  },
  {
    key: "symmetry",
    type: "single_line_text_field",
    namespace: "ringbuilder",
    name: "Symmetry",
    description: "Symmetry quality",
  },
  {
    key: "fluorescence",
    type: "single_line_text_field",
    namespace: "ringbuilder",
    name: "Fluorescence",
    description: "Fluorescence level",
  },
];

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
export const SETTING_METAFIELD_DEFINITIONS: MetafieldDefinition[] = [
  {
    key: "type",
    type: "single_line_text_field",
    namespace: "ringbuilder",
    name: "Product Type",
    description: 'Type of product: "setting"',
  },
  {
    key: "style",
    type: "single_line_text_field",
    namespace: "ringbuilder",
    name: "Setting Style",
    description: "Style of the setting (solitaire, halo, vintage, etc.)",
  },
  {
    key: "compatible_shapes",
    type: "list.single_line_text_field",
    namespace: "ringbuilder",
    name: "Compatible Shapes",
    description: "List of compatible diamond shapes for this setting",
  },
  {
    key: "metal_prices",
    type: "json",
    namespace: "ringbuilder",
    name: "Metal Prices",
    description: "Prices for different metal types (JSON object)",
  },
  {
    key: "setting_height",
    type: "single_line_text_field",
    namespace: "ringbuilder",
    name: "Setting Height",
    description: "Height of the setting (low, medium, high)",
  },
];

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
];

/**
 * Metafield namespace constant
 */
export const RINGBUILDER_NAMESPACE = "ringbuilder";

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Convert metafield value to typed format
 *
 * @param key - Metafield key
 * @param value - String value from Shopify
 * @param type - Metafield type
 * @returns Parsed value in appropriate type
 */
export function parseMetafieldValue(
  key: string,
  value: string,
  type: MetafieldType,
): any {
  switch (type) {
    case "number_decimal":
    case "number_integer":
      return Number(value);
    case "json":
      return JSON.parse(value);
    case "list.single_line_text_field":
      return JSON.parse(value);
    default:
      return value;
  }
}

/**
 * Convert typed value to metafield string format
 *
 * @param value - Typed value
 * @param type - Metafield type
 * @returns String value for Shopify
 */
export function stringifyMetafieldValue(
  value: any,
  type: MetafieldType,
): string {
  switch (type) {
    case "number_decimal":
    case "number_integer":
      return String(value);
    case "json":
    case "list.single_line_text_field":
      return JSON.stringify(value);
    default:
      return String(value);
  }
}
