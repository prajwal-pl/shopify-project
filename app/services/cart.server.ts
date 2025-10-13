/**
 * Ring Builder MVP - Cart Service
 *
 * Service for adding configured rings to Shopify cart.
 * Handles line item properties and cart integration.
 */

import type {
  Configuration,
  LineItemProperties,
  SideStonesConfig,
} from "~/types/builder";
import type { MetalType } from "~/utils/constants";
import {
  formatStoneTitle,
  formatCertificate,
  formatSideStones,
} from "~/utils/formatters";
import {
  buildLineItemProperties,
  findVariantByOption,
} from "~/utils/shopify-helpers";
import { validateShopifyGID, validateRingSize } from "~/utils/validators";
import { VALIDATION_LIMITS } from "~/utils/constants";

// ============================================================================
// LINE ITEM PROPERTIES
// ============================================================================

/**
 * Build line item properties for Shopify cart
 *
 * @param configuration - Ring configuration data
 * @param settingData - Setting details (name, SKU)
 * @param stoneData - Stone details (carat, shape, color, clarity, certificate)
 * @returns Line item properties object
 */
export function buildConfigurationLineItemProperties(
  configuration: {
    configurationId: string;
    metalType: MetalType;
    ringSize: string;
    sideStonesConfig?: string | null;
  },
  settingData: {
    name: string;
    sku: string;
  },
  stoneData: {
    carat: number;
    shape: string;
    color?: string;
    clarity?: string;
    certificate?: string;
    certificateNumber?: string;
    sku: string;
  },
): Record<string, string> {
  // Parse side stones if provided
  const sideStones = configuration.sideStonesConfig
    ? (JSON.parse(configuration.sideStonesConfig) as SideStonesConfig)
    : undefined;

  // Build properties object
  const properties: Record<string, string> = {
    Setting: `${settingData.name} - ${configuration.metalType.replace(/_/g, " ").toUpperCase()}`,
    "Setting SKU": settingData.sku,
    "Center Stone": formatStoneTitle({
      carat: stoneData.carat,
      shape: stoneData.shape,
      color: stoneData.color,
      clarity: stoneData.clarity,
    }),
    "Stone SKU": stoneData.sku,
    "Stone Certificate": formatCertificate(
      stoneData.certificate || "none",
      stoneData.certificateNumber || "",
    ),
    "Ring Size": configuration.ringSize,
    "Configuration ID": configuration.configurationId,
  };

  // Add side stones if applicable
  if (sideStones && sideStones.quantity > 0) {
    properties["Side Stones"] = formatSideStones(
      sideStones.quantity,
      sideStones.quality,
    );
  }

  // Validate property lengths (Shopify limit: 255 characters per value)
  for (const [key, value] of Object.entries(properties)) {
    if (value.length > VALIDATION_LIMITS.MAX_LINE_ITEM_PROPERTY_LENGTH) {
      properties[key] =
        value.slice(0, VALIDATION_LIMITS.MAX_LINE_ITEM_PROPERTY_LENGTH - 3) +
        "...";
    }
  }

  return properties;
}

// ============================================================================
// VARIANT FINDING
// ============================================================================

/**
 * Find the correct product variant ID based on selected metal type
 *
 * @param shopifyProduct - Shopify product data
 * @param metalType - Selected metal type
 * @returns Variant ID (GID) or null if not found
 */
export function findVariantForMetalType(
  shopifyProduct: {
    id: string;
    variants: Array<{
      id: string;
      title: string;
      selectedOptions: Array<{ name: string; value: string }>;
    }>;
  },
  metalType: MetalType,
): string | null {
  // Convert metal type to display format (e.g., "14k_white_gold" -> "14K White Gold")
  const metalLabel = metalType
    .split("_")
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
    .toUpperCase();

  // Try to find variant by option value matching metal type
  for (const variant of shopifyProduct.variants) {
    // Check if any option matches the metal type
    const hasMatchingOption = variant.selectedOptions.some(
      (opt) =>
        opt.name.toLowerCase().includes("metal") &&
        opt.value.toLowerCase().includes(metalLabel.toLowerCase()),
    );

    if (hasMatchingOption) {
      return variant.id;
    }

    // Also try matching by variant title
    if (variant.title.toLowerCase().includes(metalLabel.toLowerCase())) {
      return variant.id;
    }
  }

  // Fallback: return first variant (default)
  if (shopifyProduct.variants.length > 0) {
    console.warn(
      `No matching variant found for metal type ${metalType}, using default variant`,
    );
    return shopifyProduct.variants[0].id;
  }

  return null;
}

// ============================================================================
// CART ADDITION
// ============================================================================

/**
 * Prepare cart item data for Shopify Ajax Cart API
 *
 * @param variantId - Shopify Product Variant GID
 * @param properties - Line item properties
 * @param quantity - Quantity (default: 1)
 * @returns Cart item payload for Shopify API
 */
export function buildCartItemPayload(
  variantId: string,
  properties: Record<string, string>,
  quantity: number = 1,
): {
  id: string;
  quantity: number;
  properties: Record<string, string>;
} {
  validateShopifyGID(variantId, "ProductVariant");

  return {
    id: variantId,
    quantity,
    properties,
  };
}

/**
 * Add configuration to Shopify cart
 * Note: This function prepares the data. Actual API call happens on frontend.
 *
 * @param configuration - Complete configuration
 * @param variantId - Shopify variant ID
 * @param settingData - Setting details
 * @param stoneData - Stone details
 * @returns Cart add payload
 */
export function prepareCartAddition(
  configuration: Configuration,
  variantId: string,
  settingData: { name: string; sku: string },
  stoneData: {
    carat: number;
    shape: string;
    color?: string;
    clarity?: string;
    certificate?: string;
    certificateNumber?: string;
    sku: string;
  },
): {
  items: Array<{
    id: string;
    quantity: number;
    properties: Record<string, string>;
  }>;
} {
  // Build line item properties
  const properties = buildConfigurationLineItemProperties(
    {
      configurationId: configuration.configurationId,
      metalType: configuration.metalType as MetalType,
      ringSize: configuration.ringSize,
      sideStonesConfig: configuration.sideStonesConfig,
    },
    settingData,
    stoneData,
  );

  // Build cart item
  const cartItem = buildCartItemPayload(variantId, properties, 1);

  return {
    items: [cartItem],
  };
}

// ============================================================================
// CART VALIDATION
// ============================================================================

/**
 * Validate configuration before adding to cart
 *
 * @param configuration - Configuration to validate
 * @returns Validation result with errors
 */
export function validateConfigurationForCart(configuration: Configuration): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Check required fields
  if (!configuration.settingId) {
    errors.push("Setting is required");
  }

  if (!configuration.stoneId) {
    errors.push("Stone is required");
  }

  if (!configuration.metalType) {
    errors.push("Metal type is required");
  }

  if (!configuration.ringSize) {
    errors.push("Ring size is required");
  }

  // Validate ring size format
  try {
    validateRingSize(configuration.ringSize);
  } catch (error) {
    errors.push(`Invalid ring size: ${configuration.ringSize}`);
  }

  // Validate prices
  if (configuration.settingPrice <= 0) {
    errors.push("Setting price must be greater than 0");
  }

  if (configuration.stonePrice <= 0) {
    errors.push("Stone price must be greater than 0");
  }

  if (configuration.totalPrice <= 0) {
    errors.push("Total price must be greater than 0");
  }

  // Validate side stones if present
  if (configuration.sideStonesConfig) {
    try {
      const sideStones = JSON.parse(
        configuration.sideStonesConfig,
      ) as SideStonesConfig;

      if (sideStones.quantity < 0) {
        errors.push("Side stones quantity cannot be negative");
      }

      if (sideStones.quantity > 0 && !sideStones.quality) {
        errors.push("Side stones quality is required when quantity > 0");
      }
    } catch (error) {
      errors.push("Invalid side stones configuration");
    }
  }

  // Validate GIDs
  try {
    validateShopifyGID(configuration.settingId, "Product");
    validateShopifyGID(configuration.stoneId, "Product");
  } catch (error) {
    errors.push("Invalid product IDs");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// ============================================================================
// CART ERROR HANDLING
// ============================================================================

/**
 * Parse error from Shopify Cart API response
 *
 * @param error - Error object from API
 * @returns User-friendly error message
 */
export function parseCartError(error: any): string {
  if (!error) {
    return "An unknown error occurred";
  }

  // Check for common Shopify cart errors
  const message = error.message || error.description || error.toString();

  if (message.includes("out of stock") || message.includes("inventory")) {
    return "This item is currently out of stock";
  }

  if (message.includes("variant") || message.includes("not found")) {
    return "Product variant not found. Please contact support.";
  }

  if (message.includes("price")) {
    return "There was an issue with the price. Please refresh and try again.";
  }

  if (message.includes("cart")) {
    return "Unable to add to cart. Please try again.";
  }

  // Default error
  return "An error occurred while adding to cart. Please try again.";
}

// ============================================================================
// CART UTILITIES
// ============================================================================

/**
 * Generate Shopify Ajax Cart API URL
 *
 * @param shop - Shop domain
 * @returns Cart API endpoint URL
 */
export function getCartApiUrl(shop: string): string {
  // For embedded apps, the cart API is relative
  // For standalone, it would be: https://${shop}/cart/add.js
  return "/cart/add.js";
}

/**
 * Build redirect URL to cart page
 *
 * @param shop - Shop domain
 * @returns Cart page URL
 */
export function getCartPageUrl(shop: string): string {
  return "/cart";
}

/**
 * Extract cart item ID from Shopify response
 *
 * @param response - Shopify cart add response
 * @returns Cart item ID or null
 */
export function extractCartItemId(response: any): string | null {
  if (!response) {
    return null;
  }

  // Shopify cart API returns different formats
  // Single item: { id: "123", ... }
  // Multiple items: { items: [{ id: "123", ... }] }

  if (response.id) {
    return response.id.toString();
  }

  if (response.items && response.items.length > 0) {
    return response.items[0].id.toString();
  }

  return null;
}

// ============================================================================
// QUANTITY MANAGEMENT
// ============================================================================

/**
 * Calculate quantity for cart (always 1 for custom rings)
 *
 * @returns Quantity (always 1 for MVP)
 */
export function getConfigurationQuantity(): number {
  // For MVP, each configured ring is quantity 1
  // Future: Could support multiple quantities of same configuration
  return 1;
}

// ============================================================================
// PRICE DISPLAY
// ============================================================================

/**
 * Format price for cart display
 * Note: Shopify expects price in cents for some APIs
 *
 * @param price - Price in dollars
 * @param inCents - Whether to return in cents
 * @returns Formatted price
 */
export function formatCartPrice(
  price: number,
  inCents: boolean = false,
): number {
  if (inCents) {
    return Math.round(price * 100);
  }
  return Math.round(price * 100) / 100;
}
