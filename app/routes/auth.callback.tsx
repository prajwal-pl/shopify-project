/**
 * OAuth Callback Handler
 *
 * Handles the OAuth callback after merchant installs the app.
 * Creates merchant record and initiates onboarding flow.
 */

import type { LoaderFunctionArgs } from "react-router";
import { redirect } from "react-router";
import { authenticate } from "~/shopify.server";
import { getOrCreateMerchant } from "~/services/merchant.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;

  try {
    // Create or update merchant record
    const merchant = await getOrCreateMerchant({
      shop,
      shopifyDomain: shop,
      accessToken: session.accessToken,
      email: (session as any).email || "",
      name: "", // Will be fetched from Shopify later
    });

    const settings = merchant.settings ? JSON.parse(merchant.settings) : {};

    // Redirect to onboarding if not completed
    if (!settings.onboardingCompleted) {
      return redirect("/app/onboarding");
    }

    // Redirect to main app
    return redirect("/app/builder/products");
  } catch (error) {
    console.error("Error in auth callback:", error);
    return redirect("/app");
  }
};
