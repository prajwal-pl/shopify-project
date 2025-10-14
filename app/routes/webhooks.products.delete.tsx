/**
 * Webhook: products/delete
 *
 * Phase 2.0: Handles product deletion events from Shopify.
 * Removes SettingMetadata or StoneMetadata when products are deleted.
 *
 * Note: Metafields are automatically deleted by Shopify when a product
 * is deleted, so we only need to clean up our app database cache.
 */

import type { ActionFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";
import db from "../db.server";
import {
  logWebhookReceipt,
  logWebhookError,
  isWebhookProcessed,
  markWebhookProcessed,
  extractProductGid,
} from "~/utils/webhook-helpers";

interface ProductDeletePayload {
  id: number;
}

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    // Authenticate webhook with Shopify
    const { shop, topic, payload } = await authenticate.webhook(request);

    const webhookId = request.headers.get("X-Shopify-Webhook-Id") || "";

    // Log receipt
    logWebhookReceipt(topic, shop, webhookId);

    // Check idempotency - prevent duplicate processing
    if (webhookId && isWebhookProcessed(webhookId)) {
      console.log(`Webhook ${webhookId} already processed, skipping`);
      return new Response(null, { status: 200 });
    }

    // Parse payload
    const product = payload as ProductDeletePayload;
    const productGid = extractProductGid(product);

    console.log(`Processing product deletion: ${productGid}`);

    // Try to delete SettingMetadata
    const deletedSetting = await db.settingMetadata.deleteMany({
      where: {
        shop,
        productId: productGid,
      },
    });

    if (deletedSetting.count > 0) {
      console.log(
        `✅ Deleted ${deletedSetting.count} SettingMetadata record(s) for ${productGid}`,
      );
    }

    // Try to delete StoneMetadata
    const deletedStone = await db.stoneMetadata.deleteMany({
      where: {
        shop,
        productId: productGid,
      },
    });

    if (deletedStone.count > 0) {
      console.log(
        `✅ Deleted ${deletedStone.count} StoneMetadata record(s) for ${productGid}`,
      );
    }

    if (deletedSetting.count === 0 && deletedStone.count === 0) {
      console.log(
        `Product ${productGid} was not a builder product, no metadata to delete`,
      );
    }

    // Mark as processed
    if (webhookId) {
      markWebhookProcessed(webhookId);
    }

    // Always return 200 OK to acknowledge receipt
    return new Response(null, { status: 200 });
  } catch (error) {
    // Log error but still return 200 to prevent retries
    const shop = request.headers.get("X-Shopify-Shop-Domain") || "unknown";
    logWebhookError("products/delete", shop, error);

    return new Response(null, { status: 200 });
  }
};
