/**
 * API Route: Get Subscription Status
 * 
 * GET /api/admin/billing/status
 * 
 * Returns current subscription status, plan, and feature access.
 */

import type { LoaderFunctionArgs } from "react-router";
import { authenticate } from "~/shopify.server";
import { getSubscriptionStatus, getUsageStats } from "~/services/billing.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;

  try {
    const [status, usage] = await Promise.all([
      getSubscriptionStatus(shop),
      getUsageStats(shop),
    ]);

    return Response.json({
      success: true,
      subscription: status,
      usage,
    });
  } catch (error) {
    console.error("Error getting subscription status:", error);
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to get subscription status",
      },
      { status: 500 }
    );
  }
};

