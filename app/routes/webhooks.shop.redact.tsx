/**
 * GDPR Webhook: Shop Redact
 *
 * Handles shop data deletion after app uninstall (48 hours after uninstall).
 * Must delete all shop data.
 */

import type { ActionFunctionArgs } from "react-router";
import { authenticate } from "~/shopify.server";
import { deleteMerchant } from "~/services/merchant.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { shop } = await authenticate.webhook(request);

  console.log("Received shop/redact webhook for", shop);

  try {
    // Delete all merchant data (cascades to all related data)
    await deleteMerchant(shop);

    console.log("Shop data deleted:", shop);

    return new Response("Shop data deleted", { status: 200 });
  } catch (error) {
    console.error("Error deleting shop data:", error);
    return new Response("Error deleting data", { status: 500 });
  }
};
