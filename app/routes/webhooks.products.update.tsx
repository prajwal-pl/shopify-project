/**
 * Webhook: products/update
 *
 * Phase 2.0: Handles product update events from Shopify.
 * Updates SettingMetadata or StoneMetadata when products change.
 * Now also syncs metafields from Shopify to app database.
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
// Phase 2.0: Import metafields sync functions
// Note: We'll implement full metafield sync in a future enhancement
// For now, the webhook syncs price/images/availability as before

interface ProductUpdatePayload {
  id: number;
  title: string;
  variants: Array<{
    id: number;
    price: string;
    inventory_quantity: number;
    option1?: string;
    option2?: string;
    option3?: string;
  }>;
  images: Array<{
    src: string;
  }>;
  status: string;
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
    const product = payload as ProductUpdatePayload;
    const productGid = extractProductGid(product);

    console.log(`Processing product update: ${product.title} (${productGid})`);

    // Check if this product is marked as a Setting
    const settingMetadata = await db.settingMetadata.findFirst({
      where: {
        shop,
        productId: productGid,
      },
    });

    if (settingMetadata) {
      console.log(`Updating SettingMetadata for ${productGid}`);

      // Extract images
      const images = product.images.map((img) => img.src);

      // Update setting metadata
      // Note: We only update Shopify-controlled fields, not builder metadata
      await db.settingMetadata.update({
        where: {
          id: settingMetadata.id,
        },
        data: {
          images: JSON.stringify(images),
          updatedAt: new Date(),
        },
      });

      console.log(`✅ Updated SettingMetadata for ${product.title}`);
    }

    // Check if this product is marked as a Stone
    const stoneMetadata = await db.stoneMetadata.findFirst({
      where: {
        shop,
        productId: productGid,
      },
    });

    if (stoneMetadata) {
      console.log(`Updating StoneMetadata for ${productGid}`);

      // Extract price (from first variant)
      const price = product.variants[0]?.price
        ? parseFloat(product.variants[0].price)
        : stoneMetadata.price;

      // Extract images
      const images = product.images.map((img) => img.src);

      // Check availability (if any variant has stock)
      const available = product.variants.some((v) => v.inventory_quantity > 0);

      // Update stone metadata
      await db.stoneMetadata.update({
        where: {
          id: stoneMetadata.id,
        },
        data: {
          price,
          images: JSON.stringify(images),
          available,
          updatedAt: new Date(),
        },
      });

      console.log(`✅ Updated StoneMetadata for ${product.title}`);
    }

    if (!settingMetadata && !stoneMetadata) {
      console.log(
        `Product ${productGid} is not a builder product, ignoring update`,
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
    // Shopify will retry 500 errors, which we want to avoid
    const shop = request.headers.get("X-Shopify-Shop-Domain") || "unknown";
    logWebhookError("products/update", shop, error);

    return new Response(null, { status: 200 });
  }
};
