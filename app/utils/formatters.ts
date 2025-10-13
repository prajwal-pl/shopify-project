/**
 * Ring Builder MVP - Formatters
 *
 * Formatting functions for prices, dates, text, and other display values.
 */

import {
  getMetalTypeLabel,
  getStoneShapeLabel,
  getCutGradeLabel,
  getColorGradeLabel,
  getClarityGradeLabel,
  getCertificationLabel,
} from "./constants";

// ============================================================================
// PRICE FORMATTING
// ============================================================================

/**
 * Format price with currency symbol and locale-specific formatting
 * @param amount - Price amount (in smallest currency unit, e.g., cents)
 * @param currency - Currency code (default: USD)
 * @param locale - Locale for formatting (default: en-US)
 * @returns Formatted price string (e.g., "$1,234.56")
 */
export function formatPrice(
  amount: number,
  currency: string = "USD",
  locale: string = "en-US",
): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return "$0.00";
  }

  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (error) {
    // Fallback if Intl.NumberFormat fails
    return `$${amount.toFixed(2)}`;
  }
}

/**
 * Format price range (e.g., "$1,000 - $5,000")
 */
export function formatPriceRange(
  min: number,
  max: number,
  currency: string = "USD",
  locale: string = "en-US",
): string {
  const formattedMin = formatPrice(min, currency, locale);
  const formattedMax = formatPrice(max, currency, locale);
  return `${formattedMin} - ${formattedMax}`;
}

/**
 * Parse price string to number (remove currency symbols and formatting)
 */
export function parsePrice(priceString: string): number {
  if (!priceString || typeof priceString !== "string") {
    return 0;
  }

  // Remove all non-numeric characters except decimal point
  const cleaned = priceString.replace(/[^0-9.-]/g, "");
  const parsed = parseFloat(cleaned);

  return isNaN(parsed) ? 0 : parsed;
}

// ============================================================================
// CARAT FORMATTING
// ============================================================================

/**
 * Format carat weight (e.g., "1.50 ct")
 * @param carat - Carat weight
 * @returns Formatted carat string
 */
export function formatCarat(carat: number): string {
  if (carat === null || carat === undefined || isNaN(carat)) {
    return "0.00 ct";
  }

  return `${carat.toFixed(2)} ct`;
}

/**
 * Format carat range (e.g., "1.00 - 2.00 ct")
 */
export function formatCaratRange(min: number, max: number): string {
  return `${min.toFixed(2)} - ${max.toFixed(2)} ct`;
}

// ============================================================================
// STONE TITLE FORMATTING
// ============================================================================

/**
 * Format complete stone title (e.g., "1.50ct Round G VS1")
 */
export function formatStoneTitle(stone: {
  carat: number;
  shape: string;
  color?: string;
  clarity?: string;
}): string {
  const parts: string[] = [];

  // Carat (without "ct" suffix for title)
  parts.push(`${stone.carat.toFixed(2)}ct`);

  // Shape
  parts.push(getStoneShapeLabel(stone.shape));

  // Color (if available)
  if (stone.color) {
    parts.push(getColorGradeLabel(stone.color));
  }

  // Clarity (if available)
  if (stone.clarity) {
    parts.push(getClarityGradeLabel(stone.clarity));
  }

  return parts.join(" ");
}

/**
 * Format stone summary for display (e.g., "1.50ct Round, G color, VS1 clarity")
 */
export function formatStoneSummary(stone: {
  carat: number;
  shape: string;
  cut?: string;
  color?: string;
  clarity?: string;
  certificate?: string;
  certificateNumber?: string;
}): string {
  const parts: string[] = [];

  // Carat and shape
  parts.push(`${stone.carat.toFixed(2)}ct ${getStoneShapeLabel(stone.shape)}`);

  // 4 Cs
  if (stone.cut) {
    parts.push(`${getCutGradeLabel(stone.cut)} cut`);
  }
  if (stone.color) {
    parts.push(`${getColorGradeLabel(stone.color)} color`);
  }
  if (stone.clarity) {
    parts.push(`${getClarityGradeLabel(stone.clarity)} clarity`);
  }

  // Certificate
  if (stone.certificate && stone.certificate !== "none") {
    parts.push(`${getCertificationLabel(stone.certificate)} certified`);
  }

  return parts.join(", ");
}

// ============================================================================
// SETTING TITLE FORMATTING
// ============================================================================

/**
 * Format setting title with metal type (e.g., "Classic Solitaire - 14K White Gold")
 */
export function formatSettingTitle(name: string, metalType: string): string {
  return `${name} - ${getMetalTypeLabel(metalType)}`;
}

// ============================================================================
// CONFIGURATION TITLE FORMATTING
// ============================================================================

/**
 * Format complete configuration title
 */
export function formatConfigurationTitle(config: {
  settingName: string;
  metalType: string;
  stoneCarat: number;
  stoneShape: string;
}): string {
  return `${config.settingName} (${getMetalTypeLabel(config.metalType)}) with ${config.stoneCarat.toFixed(2)}ct ${getStoneShapeLabel(config.stoneShape)}`;
}

// ============================================================================
// DATE FORMATTING
// ============================================================================

/**
 * Format date to readable string (e.g., "Oct 12, 2025")
 */
export function formatDate(
  date: Date | string,
  locale: string = "en-US",
): string {
  if (!date) {
    return "";
  }

  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return "";
  }

  try {
    return new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(dateObj);
  } catch (error) {
    return dateObj.toLocaleDateString();
  }
}

/**
 * Format date and time (e.g., "Oct 12, 2025 at 3:45 PM")
 */
export function formatDateTime(
  date: Date | string,
  locale: string = "en-US",
): string {
  if (!date) {
    return "";
  }

  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return "";
  }

  try {
    return new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(dateObj);
  } catch (error) {
    return dateObj.toLocaleString();
  }
}

/**
 * Format relative time (e.g., "2 hours ago", "just now")
 */
export function formatRelativeTime(date: Date | string): string {
  if (!date) {
    return "";
  }

  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return "";
  }

  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 10) {
    return "just now";
  } else if (diffSec < 60) {
    return `${diffSec} seconds ago`;
  } else if (diffMin < 60) {
    return `${diffMin} ${diffMin === 1 ? "minute" : "minutes"} ago`;
  } else if (diffHour < 24) {
    return `${diffHour} ${diffHour === 1 ? "hour" : "hours"} ago`;
  } else if (diffDay < 7) {
    return `${diffDay} ${diffDay === 1 ? "day" : "days"} ago`;
  } else {
    return formatDate(dateObj);
  }
}

// ============================================================================
// TEXT FORMATTING
// ============================================================================

/**
 * Truncate text to specified length with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) {
    return text;
  }

  return text.slice(0, maxLength - 3) + "...";
}

/**
 * Capitalize first letter of each word
 */
export function toTitleCase(text: string): string {
  if (!text) {
    return "";
  }

  return text
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Convert snake_case to Title Case
 */
export function snakeToTitle(text: string): string {
  if (!text) {
    return "";
  }

  return text
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Pluralize word based on count
 */
export function pluralize(word: string, count: number): string {
  if (count === 1) {
    return word;
  }

  // Simple pluralization (add 's')
  // For more complex rules, use a library like 'pluralize'
  if (word.endsWith("y")) {
    return word.slice(0, -1) + "ies";
  } else if (word.endsWith("s") || word.endsWith("x") || word.endsWith("z")) {
    return word + "es";
  } else {
    return word + "s";
  }
}

// ============================================================================
// NUMBER FORMATTING
// ============================================================================

/**
 * Format number with thousands separators (e.g., "1,234,567")
 */
export function formatNumber(num: number, locale: string = "en-US"): string {
  if (num === null || num === undefined || isNaN(num)) {
    return "0";
  }

  try {
    return new Intl.NumberFormat(locale).format(num);
  } catch (error) {
    return num.toString();
  }
}

/**
 * Format percentage (e.g., "15.5%")
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  if (value === null || value === undefined || isNaN(value)) {
    return "0%";
  }

  return `${value.toFixed(decimals)}%`;
}

// ============================================================================
// MEASUREMENT FORMATTING
// ============================================================================

/**
 * Format stone measurements (e.g., "7.35 x 7.40 x 4.50 mm")
 */
export function formatMeasurements(measurements: string): string {
  if (!measurements) {
    return "";
  }

  // Add "mm" suffix if not present
  if (!measurements.toLowerCase().includes("mm")) {
    return `${measurements} mm`;
  }

  return measurements;
}

/**
 * Format table or depth percentage (e.g., "58.5%")
 */
export function formatTableDepth(value: number): string {
  if (value === null || value === undefined || isNaN(value)) {
    return "";
  }

  return `${value.toFixed(1)}%`;
}

// ============================================================================
// SKU FORMATTING
// ============================================================================

/**
 * Format SKU for display (uppercase, trim)
 */
export function formatSku(sku: string): string {
  if (!sku) {
    return "";
  }

  return sku.trim().toUpperCase();
}

// ============================================================================
// CERTIFICATE FORMATTING
// ============================================================================

/**
 * Format certificate info (e.g., "GIA 2141234567")
 */
export function formatCertificate(type: string, number: string): string {
  if (!type || type === "none") {
    return "No Certificate";
  }

  const label = getCertificationLabel(type);

  if (!number) {
    return label;
  }

  return `${label} ${number}`;
}

// ============================================================================
// SIDE STONES FORMATTING
// ============================================================================

/**
 * Format side stones info (e.g., "12 Premium stones")
 */
export function formatSideStones(quantity: number, quality: string): string {
  if (!quantity || quantity === 0) {
    return "No side stones";
  }

  const stoneWord = pluralize("stone", quantity);

  if (quality) {
    return `${quantity} ${quality} ${stoneWord}`;
  }

  return `${quantity} ${stoneWord}`;
}

// ============================================================================
// PHONE NUMBER FORMATTING
// ============================================================================

/**
 * Format phone number (basic US format)
 */
export function formatPhoneNumber(phone: string): string {
  if (!phone) {
    return "";
  }

  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, "");

  // Format as (XXX) XXX-XXXX
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }

  // Return original if not 10 digits
  return phone;
}

// ============================================================================
// FILE SIZE FORMATTING
// ============================================================================

/**
 * Format file size in bytes to human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

// ============================================================================
// SHOPIFY GID FORMATTING
// ============================================================================

/**
 * Format Shopify GID for display (show only the numeric ID)
 */
export function formatGidForDisplay(gid: string): string {
  if (!gid) {
    return "";
  }

  // Extract numeric ID from GID (e.g., "gid://shopify/Product/1234567890" -> "1234567890")
  const match = gid.match(/\/(\d+)$/);

  if (match && match[1]) {
    return match[1];
  }

  return gid;
}
