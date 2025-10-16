/**
 * API Route: Cancel Subscription
 * 
 * POST /api/admin/billing/cancel
 * 
 * Cancels the current active subscription.
 */

import type { ActionFunctionArgs } from "react-router";
import { authenticate } from "~/shopify.server";
import { cancelSubscription } from "~/services/billing.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin, session } = await authenticate.admin(request);
  const shop = session.shop;

  try {
    await cancelSubscription(admin, shop);

    return Response.json({
      success: true,
      message: "Subscription cancelled successfully",
    });
  } catch (error) {
    console.error("Error cancelling subscription:", error);
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to cancel subscription",
      },
      { status: 500 }
    );
  }
};

