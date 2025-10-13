/**
 * Webhook Helper Utilities
 *
 * HMAC verification and webhook processing utilities.
 */

import crypto from "crypto";

/**
 * Verify Shopify webhook HMAC signature
 *
 * @param body - Raw webhook body (string)
 * @param hmacHeader - HMAC header from request (X-Shopify-Hmac-SHA256)
 * @param secret - Shopify webhook secret
 * @returns true if signature is valid, false otherwise
 */
export function verifyWebhookHmac(
  body: string,
  hmacHeader: string,
  secret: string,
): boolean {
  try {
    const hash = crypto
      .createHmac("sha256", secret)
      .update(body, "utf8")
      .digest("base64");

    return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(hmacHeader));
  } catch (error) {
    console.error("HMAC verification error:", error);
    return false;
  }
}

/**
 * Log webhook receipt
 *
 * @param topic - Webhook topic
 * @param shop - Shop domain
 * @param webhookId - Webhook ID (for idempotency)
 */
export function logWebhookReceipt(
  topic: string,
  shop: string,
  webhookId?: string,
): void {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] Webhook received:`, {
    topic,
    shop,
    webhookId: webhookId || "N/A",
  });
}

/**
 * Log webhook error
 *
 * @param topic - Webhook topic
 * @param shop - Shop domain
 * @param error - Error object or message
 */
export function logWebhookError(
  topic: string,
  shop: string,
  error: unknown,
): void {
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] Webhook error:`, {
    topic,
    shop,
    error: error instanceof Error ? error.message : String(error),
  });
}

/**
 * Check if webhook was already processed (idempotency)
 *
 * Uses a simple in-memory cache for MVP.
 * In production, use Redis or database.
 *
 * @param webhookId - Unique webhook ID
 * @returns true if already processed, false otherwise
 */
const processedWebhooks = new Map<string, number>();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

export function isWebhookProcessed(webhookId: string): boolean {
  const processed = processedWebhooks.get(webhookId);
  if (!processed) {
    return false;
  }

  // Check if entry is still valid (within TTL)
  if (Date.now() - processed > CACHE_TTL) {
    processedWebhooks.delete(webhookId);
    return false;
  }

  return true;
}

/**
 * Mark webhook as processed
 *
 * @param webhookId - Unique webhook ID
 */
export function markWebhookProcessed(webhookId: string): void {
  processedWebhooks.set(webhookId, Date.now());

  // Clean up old entries periodically
  if (processedWebhooks.size > 10000) {
    const now = Date.now();
    for (const [id, timestamp] of processedWebhooks.entries()) {
      if (now - timestamp > CACHE_TTL) {
        processedWebhooks.delete(id);
      }
    }
  }
}

/**
 * Extract product GID from webhook payload
 *
 * @param product - Product object from webhook
 * @returns Shopify GID format string
 */
export function extractProductGid(product: { id: number }): string {
  return `gid://shopify/Product/${product.id}`;
}
