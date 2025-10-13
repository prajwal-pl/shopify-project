/**
 * Ring Builder MVP - Validators
 *
 * Validation functions for all user inputs and data.
 * All validators throw descriptive errors on failure.
 */

import {
  RING_SIZES,
  METAL_TYPES,
  STONE_SHAPES,
  CUT_GRADES,
  COLOR_GRADES,
  CLARITY_GRADES,
  CERTIFICATION_TYPES,
  SETTING_STYLES,
  SETTING_HEIGHTS,
  VALIDATION_LIMITS,
  type RingSize,
  type MetalType,
  type StoneShape,
  type CutGrade,
  type ColorGrade,
  type ClarityGrade,
  type CertificationType,
  type SettingStyle,
  type SettingHeight,
} from "./constants";

// ============================================================================
// CUSTOM ERROR CLASSES
// ============================================================================

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

// ============================================================================
// RING SIZE VALIDATION
// ============================================================================

/**
 * Validate ring size is a valid US standard size
 * @throws {ValidationError} If ring size is invalid
 */
export function validateRingSize(size: string): asserts size is RingSize {
  if (!RING_SIZES.includes(size as RingSize)) {
    throw new ValidationError(
      `Invalid ring size: "${size}". Must be one of: ${RING_SIZES.join(", ")}`,
    );
  }
}

// ============================================================================
// METAL TYPE VALIDATION
// ============================================================================

/**
 * Validate metal type is a valid option
 * @throws {ValidationError} If metal type is invalid
 */
export function validateMetalType(metal: string): asserts metal is MetalType {
  const validMetalTypes = METAL_TYPES.map((m) => m.value);
  if (!validMetalTypes.includes(metal as MetalType)) {
    throw new ValidationError(
      `Invalid metal type: "${metal}". Must be one of: ${validMetalTypes.join(", ")}`,
    );
  }
}

// ============================================================================
// STONE VALIDATION
// ============================================================================

/**
 * Validate stone shape
 * @throws {ValidationError} If stone shape is invalid
 */
export function validateStoneShape(shape: string): asserts shape is StoneShape {
  const validShapes = STONE_SHAPES.map((s) => s.value);
  if (!validShapes.includes(shape as StoneShape)) {
    throw new ValidationError(
      `Invalid stone shape: "${shape}". Must be one of: ${validShapes.join(", ")}`,
    );
  }
}

/**
 * Validate carat weight
 * @throws {ValidationError} If carat is invalid
 */
export function validateCarat(carat: number): boolean {
  if (typeof carat !== "number" || isNaN(carat)) {
    throw new ValidationError(`Carat must be a valid number`);
  }
  if (carat <= 0) {
    throw new ValidationError(`Carat must be greater than 0`);
  }
  if (carat > 50) {
    throw new ValidationError(`Carat must be less than 50`);
  }
  return true;
}

/**
 * Validate cut grade
 * @throws {ValidationError} If cut grade is invalid
 */
export function validateCutGrade(cut: string): asserts cut is CutGrade {
  const validCuts = CUT_GRADES.map((c) => c.value);
  if (!validCuts.includes(cut as CutGrade)) {
    throw new ValidationError(
      `Invalid cut grade: "${cut}". Must be one of: ${validCuts.join(", ")}`,
    );
  }
}

/**
 * Validate color grade
 * @throws {ValidationError} If color grade is invalid
 */
export function validateColorGrade(color: string): asserts color is ColorGrade {
  const validColors = COLOR_GRADES.map((c) => c.value);
  if (!validColors.includes(color as ColorGrade)) {
    throw new ValidationError(
      `Invalid color grade: "${color}". Must be one of: ${validColors.join(", ")}`,
    );
  }
}

/**
 * Validate clarity grade
 * @throws {ValidationError} If clarity grade is invalid
 */
export function validateClarityGrade(
  clarity: string,
): asserts clarity is ClarityGrade {
  const validClarities = CLARITY_GRADES.map((c) => c.value);
  if (!validClarities.includes(clarity as ClarityGrade)) {
    throw new ValidationError(
      `Invalid clarity grade: "${clarity}". Must be one of: ${validClarities.join(", ")}`,
    );
  }
}

/**
 * Validate certification type
 * @throws {ValidationError} If certification type is invalid
 */
export function validateCertification(
  cert: string,
): asserts cert is CertificationType {
  const validCerts = CERTIFICATION_TYPES.map((c) => c.value);
  if (!validCerts.includes(cert as CertificationType)) {
    throw new ValidationError(
      `Invalid certification: "${cert}". Must be one of: ${validCerts.join(", ")}`,
    );
  }
}

// ============================================================================
// SETTING VALIDATION
// ============================================================================

/**
 * Validate setting style
 * @throws {ValidationError} If setting style is invalid
 */
export function validateSettingStyle(
  style: string,
): asserts style is SettingStyle {
  const validStyles = SETTING_STYLES.map((s) => s.value);
  if (!validStyles.includes(style as SettingStyle)) {
    throw new ValidationError(
      `Invalid setting style: "${style}". Must be one of: ${validStyles.join(", ")}`,
    );
  }
}

/**
 * Validate setting height
 * @throws {ValidationError} If setting height is invalid
 */
export function validateSettingHeight(
  height: string,
): asserts height is SettingHeight {
  const validHeights = SETTING_HEIGHTS.map((h) => h.value);
  if (!validHeights.includes(height as SettingHeight)) {
    throw new ValidationError(
      `Invalid setting height: "${height}". Must be one of: ${validHeights.join(", ")}`,
    );
  }
}

// ============================================================================
// PRICE VALIDATION
// ============================================================================

/**
 * Validate price is a positive number
 * @throws {ValidationError} If price is invalid
 */
export function validatePrice(price: number): boolean {
  if (typeof price !== "number" || isNaN(price)) {
    throw new ValidationError(`Price must be a valid number`);
  }
  if (price < 0) {
    throw new ValidationError(`Price cannot be negative`);
  }
  if (price > 10000000) {
    throw new ValidationError(`Price exceeds maximum allowed value`);
  }
  return true;
}

/**
 * Validate markup percentage
 * @throws {ValidationError} If markup is invalid
 */
export function validateMarkupPercent(markup: number): boolean {
  if (typeof markup !== "number" || isNaN(markup)) {
    throw new ValidationError(`Markup must be a valid number`);
  }
  if (markup < VALIDATION_LIMITS.MIN_MARKUP_PERCENT) {
    throw new ValidationError(
      `Markup cannot be less than ${VALIDATION_LIMITS.MIN_MARKUP_PERCENT}%`,
    );
  }
  if (markup > VALIDATION_LIMITS.MAX_MARKUP_PERCENT) {
    throw new ValidationError(
      `Markup cannot exceed ${VALIDATION_LIMITS.MAX_MARKUP_PERCENT}%`,
    );
  }
  return true;
}

// ============================================================================
// SHOP VALIDATION
// ============================================================================

/**
 * Validate shop domain format (for multi-tenant isolation)
 * @throws {ValidationError} If shop domain is invalid
 */
export function validateShop(shop: string): boolean {
  if (!shop || typeof shop !== "string") {
    throw new ValidationError("Shop domain is required");
  }

  // Basic shop domain format validation
  // Expected format: example.myshopify.com or custom-domain.com
  const shopDomainRegex =
    /^[a-z0-9][a-z0-9-]*\.([a-z0-9][a-z0-9-]*\.)*(myshopify\.com|[a-z]{2,})$/i;

  if (!shopDomainRegex.test(shop)) {
    throw new ValidationError(
      `Invalid shop domain format: "${shop}". Expected format: example.myshopify.com`,
    );
  }

  return true;
}

// ============================================================================
// ID VALIDATION
// ============================================================================

/**
 * Validate Shopify GID format
 * @throws {ValidationError} If GID is invalid
 */
export function validateShopifyGID(
  gid: string,
  expectedType?: string,
): boolean {
  if (!gid || typeof gid !== "string") {
    throw new ValidationError("Shopify GID is required");
  }

  // Shopify GID format: gid://shopify/Product/1234567890
  const gidRegex = /^gid:\/\/shopify\/([A-Za-z]+)\/(\d+)$/;
  const match = gid.match(gidRegex);

  if (!match) {
    throw new ValidationError(
      `Invalid Shopify GID format: "${gid}". Expected format: gid://shopify/Type/ID`,
    );
  }

  if (expectedType && match[1] !== expectedType) {
    throw new ValidationError(
      `Invalid GID type: expected "${expectedType}", got "${match[1]}"`,
    );
  }

  return true;
}

/**
 * Validate configuration ID format
 * @throws {ValidationError} If configuration ID is invalid
 */
export function validateConfigurationId(configId: string): boolean {
  if (!configId || typeof configId !== "string") {
    throw new ValidationError("Configuration ID is required");
  }

  // Expected format: CONFIG-20251012-ABC123
  const configIdRegex = /^CONFIG-\d{8,}-[A-Z0-9]+$/;

  if (!configIdRegex.test(configId)) {
    throw new ValidationError(
      `Invalid configuration ID format: "${configId}". Expected format: CONFIG-YYYYMMDD-ID`,
    );
  }

  return true;
}

// ============================================================================
// SIDE STONES VALIDATION
// ============================================================================

/**
 * Validate side stones quantity
 * @throws {ValidationError} If quantity is invalid
 */
export function validateSideStonesQuantity(quantity: number): boolean {
  if (
    typeof quantity !== "number" ||
    isNaN(quantity) ||
    !Number.isInteger(quantity)
  ) {
    throw new ValidationError(`Side stones quantity must be a valid integer`);
  }
  if (quantity < VALIDATION_LIMITS.MIN_SIDE_STONES_QUANTITY) {
    throw new ValidationError(
      `Side stones quantity cannot be less than ${VALIDATION_LIMITS.MIN_SIDE_STONES_QUANTITY}`,
    );
  }
  if (quantity > VALIDATION_LIMITS.MAX_SIDE_STONES_QUANTITY) {
    throw new ValidationError(
      `Side stones quantity cannot exceed ${VALIDATION_LIMITS.MAX_SIDE_STONES_QUANTITY}`,
    );
  }
  return true;
}

// ============================================================================
// EMAIL VALIDATION
// ============================================================================

/**
 * Validate email format
 * @throws {ValidationError} If email is invalid
 */
export function validateEmail(email: string): boolean {
  if (!email || typeof email !== "string") {
    throw new ValidationError("Email is required");
  }

  // Basic email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    throw new ValidationError(`Invalid email format: "${email}"`);
  }

  return true;
}

// ============================================================================
// STRING VALIDATION
// ============================================================================

/**
 * Validate required string field
 * @throws {ValidationError} If string is empty or invalid
 */
export function validateRequiredString(
  value: string,
  fieldName: string,
): boolean {
  if (!value || typeof value !== "string" || value.trim().length === 0) {
    throw new ValidationError(`${fieldName} is required and cannot be empty`);
  }
  return true;
}

/**
 * Validate string length
 * @throws {ValidationError} If string exceeds max length
 */
export function validateStringLength(
  value: string,
  maxLength: number,
  fieldName: string,
): boolean {
  if (value && value.length > maxLength) {
    throw new ValidationError(
      `${fieldName} cannot exceed ${maxLength} characters (current: ${value.length})`,
    );
  }
  return true;
}

// ============================================================================
// PERCENTAGE VALIDATION
// ============================================================================

/**
 * Validate percentage value (0-100)
 * @throws {ValidationError} If percentage is invalid
 */
export function validatePercentage(value: number, fieldName: string): boolean {
  if (typeof value !== "number" || isNaN(value)) {
    throw new ValidationError(`${fieldName} must be a valid number`);
  }
  if (value < 0 || value > 100) {
    throw new ValidationError(`${fieldName} must be between 0 and 100`);
  }
  return true;
}

// ============================================================================
// ARRAY VALIDATION
// ============================================================================

/**
 * Validate array is not empty
 * @throws {ValidationError} If array is empty or invalid
 */
export function validateNonEmptyArray<T>(arr: T[], fieldName: string): boolean {
  if (!Array.isArray(arr) || arr.length === 0) {
    throw new ValidationError(`${fieldName} must contain at least one item`);
  }
  return true;
}

// ============================================================================
// MEASUREMENTS VALIDATION
// ============================================================================

/**
 * Validate stone measurements format (e.g., "7.35 x 7.40 x 4.50")
 * @throws {ValidationError} If measurements format is invalid
 */
export function validateMeasurements(measurements: string): boolean {
  if (!measurements || typeof measurements !== "string") {
    throw new ValidationError("Measurements are required");
  }

  // Expected format: "X.XX x X.XX x X.XX" (three dimensions)
  const measurementRegex = /^\d+\.?\d*\s*x\s*\d+\.?\d*\s*x\s*\d+\.?\d*$/i;

  if (!measurementRegex.test(measurements.trim())) {
    throw new ValidationError(
      `Invalid measurements format: "${measurements}". Expected format: "7.35 x 7.40 x 4.50"`,
    );
  }

  return true;
}

// ============================================================================
// URL VALIDATION
// ============================================================================

/**
 * Validate URL format
 * @throws {ValidationError} If URL is invalid
 */
export function validateUrl(url: string, fieldName: string): boolean {
  if (!url || typeof url !== "string") {
    throw new ValidationError(`${fieldName} is required`);
  }

  try {
    new URL(url);
    return true;
  } catch {
    throw new ValidationError(`${fieldName} must be a valid URL: "${url}"`);
  }
}

// ============================================================================
// COMPOSITE VALIDATION
// ============================================================================

/**
 * Validate complete stone metadata
 * @throws {ValidationError} If any field is invalid
 */
export function validateStoneMetadata(data: {
  shape: string;
  carat: number;
  cut?: string;
  color?: string;
  clarity?: string;
  price: number;
}): boolean {
  validateStoneShape(data.shape);
  validateCarat(data.carat);
  validatePrice(data.price);

  if (data.cut) validateCutGrade(data.cut);
  if (data.color) validateColorGrade(data.color);
  if (data.clarity) validateClarityGrade(data.clarity);

  return true;
}

/**
 * Validate complete setting metadata
 * @throws {ValidationError} If any field is invalid
 */
export function validateSettingMetadata(data: {
  style: string;
  metalType: string;
  price: number;
}): boolean {
  validateSettingStyle(data.style);
  validateMetalType(data.metalType);
  validatePrice(data.price);

  return true;
}
