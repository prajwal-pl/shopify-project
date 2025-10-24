/**
 * Ring Builder MVP - Pricing Service
 *
 * Service for calculating prices for ring configurations.
 * Handles setting prices, stone prices, side stones, and markup.
 */

import prisma from "~/db.server";
import type {
  PriceBreakdown,
  PricingInput,
  SideStonesConfig,
  ParsedAppSettings,
} from "~/types/builder";
import type { MetalType } from "~/utils/constants";
import { validatePrice, validateMarkupPercent } from "~/utils/validators";

// ============================================================================
// SETTING PRICE CALCULATION
// ============================================================================

/**
 * Calculate setting price based on selected metal type
 *
 * @param settingId - Setting metadata ID or product ID
 * @param metalType - Selected metal type
 * @param shop - Shop domain (for multi-tenant isolation)
 * @returns Setting price or null if not found
 */
export async function calculateSettingPrice(
  settingId: string,
  metalType: MetalType,
  shop: string,
): Promise<number | null> {
  // Find setting metadata
  const setting = await prisma.settingMetadata.findFirst({
    where: {
      OR: [
        { id: settingId, shop },
        { productId: settingId, shop },
      ],
    },
  });

  if (!setting) {
    return null;
  }

  // Parse base prices
  const basePrices = JSON.parse(setting.basePrices) as Record<
    MetalType,
    number
  >;

  // Get price for selected metal type
  const price = basePrices[metalType];

  if (price === undefined) {
    throw new Error(`Price not found for metal type: ${metalType}`);
  }

  validatePrice(price);

  return price;
}

// ============================================================================
// STONE PRICE CALCULATION
// ============================================================================

/**
 * Get stone price
 *
 * @param stoneId - Stone metadata ID or product ID
 * @param shop - Shop domain (for multi-tenant isolation)
 * @returns Stone price or null if not found
 */
export async function calculateStonePrice(
  stoneId: string,
  shop: string,
): Promise<number | null> {
  // Find stone metadata
  const stone = await prisma.stoneMetadata.findFirst({
    where: {
      OR: [
        { id: stoneId, shop },
        { productId: stoneId, shop },
      ],
    },
    select: { price: true, available: true },
  });

  if (!stone) {
    return null;
  }

  if (!stone.available) {
    throw new Error("Stone is not available");
  }

  validatePrice(stone.price);

  return stone.price;
}

// ============================================================================
// SIDE STONES CALCULATION
// ============================================================================

/**
 * Calculate side stones fee
 *
 * @param quality - Side stone quality level
 * @param quantity - Number of side stones
 * @param shop - Shop domain
 * @returns Side stones price
 */
export async function calculateSideStonesFee(
  quality: string,
  quantity: number,
  shop: string,
): Promise<number> {
  if (quantity === 0) {
    return 0;
  }

  // Get app settings
  const settings = await getAppSettings(shop);

  if (!settings.sideStones || !settings.sideStones.enabled) {
    throw new Error("Side stones are not enabled for this shop");
  }

  // Get pricing for the quality level
  const pricePerStone = settings.sideStones.pricing[quality];

  if (pricePerStone === undefined) {
    throw new Error(`Price not found for side stone quality: ${quality}`);
  }

  // Validate quantity is within allowed range
  if (
    quantity < settings.sideStones.minQuantity ||
    quantity > settings.sideStones.maxQuantity
  ) {
    throw new Error(
      `Side stone quantity must be between ${settings.sideStones.minQuantity} and ${settings.sideStones.maxQuantity}`,
    );
  }

  const totalPrice = pricePerStone * quantity;
  validatePrice(totalPrice);

  return totalPrice;
}

// ============================================================================
// MARKUP CALCULATION
// ============================================================================

/**
 * Apply markup percentage to price
 *
 * @param price - Base price
 * @param markupPercent - Markup percentage (e.g., 5 for 5%)
 * @returns Markup amount
 */
export function applyMarkup(price: number, markupPercent: number): number {
  validatePrice(price);
  validateMarkupPercent(markupPercent);

  return (price * markupPercent) / 100;
}

// ============================================================================
// TOTAL PRICE CALCULATION
// ============================================================================

/**
 * Calculate total price for a ring configuration
 *
 * @param config - Configuration pricing input
 * @returns Complete price breakdown
 */
export async function calculateTotalPrice(
  config: PricingInput,
): Promise<PriceBreakdown> {
  const { settingId, metalType, stoneId, sideStones, shop } = config;

  // Calculate individual prices
  const settingPrice = await calculateSettingPrice(settingId, metalType, shop);
  if (settingPrice === null) {
    throw new Error("Setting not found or price unavailable");
  }

  const stonePrice = await calculateStonePrice(stoneId, shop);
  if (stonePrice === null) {
    throw new Error("Stone not found or price unavailable");
  }

  let sideStonesPrice = 0;
  if (sideStones && sideStones.quantity > 0) {
    sideStonesPrice = await calculateSideStonesFee(
      sideStones.quality,
      sideStones.quantity,
      shop,
    );
  }

  // Calculate subtotal
  const subtotal = settingPrice + stonePrice + sideStonesPrice;

  // Get markup percentage from app settings
  const settings = await getAppSettings(shop);
  const markupAmount = applyMarkup(subtotal, settings.markupPercent);

  // Calculate total
  const total = subtotal + markupAmount;

  return {
    settingPrice,
    stonePrice,
    sideStonesPrice,
    engravingPrice: 0,
    subtotal,
    markup: markupAmount,
    markupPercent: settings.markupPercent,
    total,
  };
}

/**
 * Recalculate and validate configuration price
 * Used on the backend to verify client-side calculations
 *
 * @param configData - Configuration data with pricing
 * @param shop - Shop domain
 * @returns True if prices match, throws error if mismatch
 */
export async function validateConfigurationPrice(
  configData: {
    settingId: string;
    metalType: MetalType;
    stoneId: string;
    sideStones?: SideStonesConfig;
    totalPrice: number;
  },
  shop: string,
): Promise<boolean> {
  // Recalculate price on backend
  const recalculated = await calculateTotalPrice({
    settingId: configData.settingId,
    metalType: configData.metalType,
    stoneId: configData.stoneId,
    sideStones: configData.sideStones,
    shop,
  });

  // Allow small rounding differences (within $0.01)
  const difference = Math.abs(recalculated.total - configData.totalPrice);

  if (difference > 0.01) {
    throw new Error(
      `Price mismatch: calculated $${recalculated.total.toFixed(2)}, received $${configData.totalPrice.toFixed(2)}`,
    );
  }

  return true;
}

// ============================================================================
// APP SETTINGS HELPER
// ============================================================================

/**
 * Get parsed app settings for a shop
 *
 * @param shop - Shop domain
 * @returns Parsed app settings
 */
async function getAppSettings(shop: string): Promise<ParsedAppSettings> {
  let settings = await prisma.appSettings.findUnique({
    where: { shop },
  });

  // Create default settings if not found
  if (!settings) {
    settings = await prisma.appSettings.create({
      data: {
        shop,
        builderEnabled: true,
        markupPercent: 0,
        notifyOnConfig: false,
      },
    });
  }

  // Parse JSON fields
  const sideStones = settings.sideStones
    ? JSON.parse(settings.sideStones)
    : undefined;

  return {
    id: settings.id,
    shop: settings.shop,
    builderEnabled: settings.builderEnabled,
    sideStones,
    engravingFee: settings.engravingFee || undefined,
    markupPercent: settings.markupPercent,
    notifyOnConfig: settings.notifyOnConfig,
    notificationEmail: settings.notificationEmail || undefined,
    primaryColor: settings.primaryColor || undefined,
    accentColor: settings.accentColor || undefined,
    createdAt: settings.createdAt,
    updatedAt: settings.updatedAt,
  };
}

// ============================================================================
// PRICE COMPARISON
// ============================================================================

/**
 * Compare two prices with tolerance for rounding errors
 *
 * @param price1 - First price
 * @param price2 - Second price
 * @param tolerance - Max difference allowed (default: 0.01)
 * @returns True if prices are equal within tolerance
 */
export function comparePrices(
  price1: number,
  price2: number,
  tolerance: number = 0.01,
): boolean {
  return Math.abs(price1 - price2) <= tolerance;
}

// ============================================================================
// PRICE FORMATTING FOR STORAGE
// ============================================================================

/**
 * Round price to 2 decimal places for storage
 *
 * @param price - Price to round
 * @returns Rounded price
 */
export function roundPrice(price: number): number {
  return Math.round(price * 100) / 100;
}

// ============================================================================
// BULK PRICE CALCULATIONS
// ============================================================================

/**
 * Calculate prices for multiple configurations
 * Useful for displaying prices in lists
 *
 * @param configs - Array of pricing inputs
 * @returns Array of price breakdowns
 */
export async function calculateBulkPrices(
  configs: PricingInput[],
): Promise<PriceBreakdown[]> {
  return Promise.all(configs.map((config) => calculateTotalPrice(config)));
}

// ============================================================================
// PRICE RANGE CALCULATION
// ============================================================================

/**
 * Calculate price range for a setting with all metal types
 *
 * @param settingId - Setting metadata ID or product ID
 * @param shop - Shop domain
 * @returns Price range { min, max } or null if not found
 */
export async function getSettingPriceRange(
  settingId: string,
  shop: string,
): Promise<{ min: number; max: number } | null> {
  const setting = await prisma.settingMetadata.findFirst({
    where: {
      OR: [
        { id: settingId, shop },
        { productId: settingId, shop },
      ],
    },
  });

  if (!setting) {
    return null;
  }

  const basePrices = JSON.parse(setting.basePrices) as Record<
    MetalType,
    number
  >;
  const prices = Object.values(basePrices);

  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
  };
}

// ============================================================================
// DISCOUNT CALCULATION (Future Feature)
// ============================================================================

/**
 * Apply discount to price
 * Note: Not used in MVP, prepared for future feature
 *
 * @param price - Base price
 * @param discountPercent - Discount percentage
 * @returns Discounted price
 */
export function applyDiscount(price: number, discountPercent: number): number {
  validatePrice(price);

  if (discountPercent < 0 || discountPercent > 100) {
    throw new Error("Discount percent must be between 0 and 100");
  }

  const discountAmount = (price * discountPercent) / 100;
  return price - discountAmount;
}
