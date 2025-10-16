/**
 * API Route: Create Subscription
 *
 * POST /api/admin/billing/subscribe
 *
 * Creates a new Shopify subscription for the merchant.
 * Returns confirmation URL for merchant to approve.
 */

import type { ActionFunctionArgs } from "react-router";
import { authenticate } from "~/shopify.server";
import { createSubscription, type PlanName } from "~/services/billing.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin, session } = await authenticate.admin(request);
  const shop = session.shop;

  try {
    const body = await request.json();
    const { plan, returnUrl } = body;

    if (!plan || !["starter", "professional", "enterprise"].includes(plan)) {
      return Response.json(
        { success: false, error: "Invalid plan selected" },
        { status: 400 },
      );
    }

    const result = await createSubscription(admin, {
      shop,
      plan: plan as PlanName,
      returnUrl: returnUrl || `${process.env.SHOPIFY_APP_URL}/app`,
    });

    return Response.json({
      success: true,
      confirmationUrl: result.confirmationUrl,
      subscriptionId: result.subscriptionId,
    });
  } catch (error) {
    console.error("Error creating subscription:", error);
    return Response.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to create subscription",
      },
      { status: 500 },
    );
  }
};
