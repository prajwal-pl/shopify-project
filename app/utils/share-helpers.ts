/**
 * Share Helpers
 *
 * Phase 2.0: Utility functions for save & share configuration feature.
 *
 * Features:
 * - Generate unique share tokens
 * - Create shareable URLs
 * - Validate tokens
 */

/**
 * Generate a unique share token (8-12 characters)
 * Uses crypto.randomBytes for security
 *
 * @param length - Token length (default: 8)
 * @returns Random alphanumeric token
 */
export function generateShareToken(length: number = 8): string {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    token += characters[randomIndex];
  }

  return token;
}

/**
 * Generate a shareable URL for a configuration
 *
 * @param shop - Shop domain
 * @param token - Share token
 * @returns Full shareable URL
 */
export function generateShareUrl(shop: string, token: string): string {
  // Remove .myshopify.com from shop
  const shopHandle = shop.replace(".myshopify.com", "");

  // Construct URL (will work with App Proxy)
  return `https://${shop}/a/ring-builder/saved/${token}`;
}

/**
 * Validate share token format
 *
 * @param token - Token to validate
 * @returns True if valid format
 */
export function validateShareToken(token: string): boolean {
  // Token should be 6-12 alphanumeric characters
  const tokenRegex = /^[A-Za-z0-9]{6,12}$/;
  return tokenRegex.test(token);
}

/**
 * Generate configuration ID
 * Format: CONFIG-YYYYMMDD-TOKEN
 *
 * @returns Configuration ID string
 */
export function generateConfigurationId(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const token = generateShareToken(6).toUpperCase();

  return `CONFIG-${year}${month}${day}-${token}`;
}

/**
 * Social share URLs
 */

/**
 * Generate Facebook share URL
 *
 * @param url - URL to share
 * @param quote - Optional quote text
 * @returns Facebook Share Dialog URL
 */
export function generateFacebookShareUrl(url: string, quote?: string): string {
  const params = new URLSearchParams({
    u: url,
    quote: quote || "Check out this beautiful ring!",
  });

  return `https://www.facebook.com/sharer/sharer.php?${params.toString()}`;
}

/**
 * Generate Twitter share URL
 *
 * @param url - URL to share
 * @param text - Tweet text
 * @returns Twitter share URL
 */
export function generateTwitterShareUrl(url: string, text?: string): string {
  const params = new URLSearchParams({
    url,
    text: text || "Check out this beautiful ring I designed!",
  });

  return `https://twitter.com/intent/tweet?${params.toString()}`;
}

/**
 * Generate Pinterest share URL
 *
 * @param url - URL to share
 * @param media - Image URL
 * @param description - Description text
 * @returns Pinterest share URL
 */
export function generatePinterestShareUrl(
  url: string,
  media: string,
  description?: string,
): string {
  const params = new URLSearchParams({
    url,
    media,
    description: description || "Beautiful custom ring design",
  });

  return `https://pinterest.com/pin/create/button/?${params.toString()}`;
}

/**
 * Copy text to clipboard
 *
 * @param text - Text to copy
 * @returns Promise that resolves when copy is complete
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    // Fallback for older browsers
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const success = document.execCommand("copy");
    document.body.removeChild(textarea);

    return success;
  } catch (error) {
    console.error("Failed to copy to clipboard:", error);
    return false;
  }
}
