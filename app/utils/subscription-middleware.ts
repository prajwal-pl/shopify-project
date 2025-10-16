/**
 * Subscription Middleware
 *
 * Checks if merchant has active subscription before allowing access to features.
 * Can be used in loaders to protect routes based on subscription status.
 */

import { redirect } from "react-router";
import {
  hasActiveSubscription,
  canAccessFeature,
  isWithinProductLimit,
} from "~/services/billing.server";
import type { SUBSCRIPTION_PLANS } from "~/services/billing.server";

/**
 * Require active subscription to access a route
 * Use in loader functions
 */
export async function requireSubscription(shop: string, redirectTo?: string) {
  const hasSubscription = await hasActiveSubscription(shop);

  if (!hasSubscription) {
    throw redirect(redirectTo || "/app/onboarding");
  }
}

/**
 * Require specific feature access
 */
export async function requireFeature(
  shop: string,
  feature: keyof typeof SUBSCRIPTION_PLANS.starter.features,
  redirectTo?: string,
) {
  const canAccess = await canAccessFeature(shop, feature);

  if (!canAccess) {
    throw redirect(redirectTo || "/app/upgrade");
  }
}

/**
 * Check if merchant can add more products
 */
export async function checkProductLimit(shop: string): Promise<{
  allowed: boolean;
  message?: string;
}> {
  const withinLimit = await isWithinProductLimit(shop);

  if (!withinLimit) {
    return {
      allowed: false,
      message:
        "You've reached your plan's product limit. Please upgrade to add more products.",
    };
  }

  return { allowed: true };
}

/**
 * Get trial status message
 */
export function getTrialMessage(trialDaysRemaining?: number): string | null {
  if (!trialDaysRemaining || trialDaysRemaining <= 0) {
    return null;
  }

  if (trialDaysRemaining === 1) {
    return "⏰ Your trial ends tomorrow. Choose a plan to continue using Ring Builder.";
  }

  if (trialDaysRemaining <= 3) {
    return `⏰ Your trial ends in ${trialDaysRemaining} days. Choose a plan to continue.`;
  }

  if (trialDaysRemaining <= 7) {
    return `✨ You have ${trialDaysRemaining} days left in your free trial.`;
  }

  return null;
}
