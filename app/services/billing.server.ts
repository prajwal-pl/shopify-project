/**
 * Billing Service - Shopify Subscription Management
 *
 * Handles subscription creation, updates, and management using Shopify Billing API.
 * Supports 3 pricing tiers: Starter ($29), Professional ($99), Enterprise ($299)
 */

import type { AdminApiContext } from "@shopify/shopify-app-react-router/server";
import prisma from "~/db.server";

// ============================================================================
// SUBSCRIPTION PLANS
// ============================================================================

export const SUBSCRIPTION_PLANS = {
  starter: {
    name: "Starter",
    price: 29,
    interval: "EVERY_30_DAYS" as const,
    trialDays: 14,
    features: {
      maxProducts: 100,
      inventoryFeeds: 0,
      analytics: false,
      customBranding: false,
      prioritySupport: false,
      apiAccess: false,
    },
    description: "Perfect for small jewelry stores getting started",
  },
  professional: {
    name: "Professional",
    price: 99,
    interval: "EVERY_30_DAYS" as const,
    trialDays: 14,
    features: {
      maxProducts: 1000,
      inventoryFeeds: 1,
      analytics: true,
      customBranding: true,
      prioritySupport: true,
      apiAccess: false,
    },
    description: "Most popular - Complete features for growing stores",
  },
  enterprise: {
    name: "Enterprise",
    price: 299,
    interval: "EVERY_30_DAYS" as const,
    trialDays: 30,
    features: {
      maxProducts: -1, // Unlimited
      inventoryFeeds: -1, // Unlimited
      analytics: true,
      customBranding: true,
      prioritySupport: true,
      apiAccess: true,
    },
    description: "Full-featured for high-volume jewelry retailers",
  },
} as const;

export type PlanName = keyof typeof SUBSCRIPTION_PLANS;

// ============================================================================
// TYPES
// ============================================================================

export interface BillingSubscription {
  id: string;
  name: string;
  status: "ACTIVE" | "CANCELLED" | "FROZEN" | "PENDING";
  currentPeriodEnd: Date;
  trialDays: number;
  test: boolean;
}

export interface CreateSubscriptionInput {
  shop: string;
  plan: PlanName;
  returnUrl: string;
}

export interface SubscriptionStatus {
  hasActiveSubscription: boolean;
  plan?: PlanName;
  status?: string;
  trialDaysRemaining?: number;
  currentPeriodEnd?: Date;
  features?: (typeof SUBSCRIPTION_PLANS)[PlanName]["features"];
}

// ============================================================================
// BILLING API FUNCTIONS
// ============================================================================

/**
 * Create a new subscription using Shopify Billing API
 */
export async function createSubscription(
  admin: AdminApiContext,
  input: CreateSubscriptionInput,
): Promise<{ confirmationUrl: string; subscriptionId: string }> {
  const plan = SUBSCRIPTION_PLANS[input.plan];

  const response = await admin.graphql(
    `#graphql
      mutation CreateSubscription($name: String!, $returnUrl: URL!, $trialDays: Int, $lineItems: [AppSubscriptionLineItemInput!]!) {
        appSubscriptionCreate(
          name: $name
          returnUrl: $returnUrl
          trialDays: $trialDays
          test: true
          lineItems: $lineItems
        ) {
          appSubscription {
            id
            name
            status
            currentPeriodEnd
            trialDays
          }
          confirmationUrl
          userErrors {
            field
            message
          }
        }
      }
    `,
    {
      variables: {
        name: `Ring Builder - ${plan.name}`,
        returnUrl: input.returnUrl,
        trialDays: plan.trialDays,
        lineItems: [
          {
            plan: {
              appRecurringPricingDetails: {
                price: { amount: plan.price, currencyCode: "USD" },
                interval: plan.interval,
              },
            },
          },
        ],
      },
    },
  );

  const data = await response.json();

  if (data.data.appSubscriptionCreate.userErrors.length > 0) {
    throw new Error(
      `Failed to create subscription: ${data.data.appSubscriptionCreate.userErrors[0].message}`,
    );
  }

  const subscription = data.data.appSubscriptionCreate.appSubscription;

  // Store subscription in database
  await prisma.subscription.create({
    data: {
      shop: input.shop,
      shopifySubscriptionId: subscription.id,
      plan: input.plan,
      status: subscription.status,
      trialDaysRemaining: subscription.trialDays || 0,
      currentPeriodEnd: subscription.currentPeriodEnd
        ? new Date(subscription.currentPeriodEnd)
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      features: JSON.stringify(plan.features),
    },
  });

  return {
    confirmationUrl: data.data.appSubscriptionCreate.confirmationUrl,
    subscriptionId: subscription.id,
  };
}

/**
 * Get current subscription status for a shop
 */
export async function getSubscriptionStatus(
  shop: string,
): Promise<SubscriptionStatus> {
  const subscription = await prisma.subscription.findFirst({
    where: {
      shop,
      status: { in: ["ACTIVE", "PENDING"] },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!subscription) {
    return { hasActiveSubscription: false };
  }

  const plan = SUBSCRIPTION_PLANS[subscription.plan as PlanName];

  return {
    hasActiveSubscription: subscription.status === "ACTIVE",
    plan: subscription.plan as PlanName,
    status: subscription.status,
    trialDaysRemaining: subscription.trialDaysRemaining,
    currentPeriodEnd: subscription.currentPeriodEnd,
    features: plan.features,
  };
}

/**
 * Check if shop has active subscription
 */
export async function hasActiveSubscription(shop: string): Promise<boolean> {
  const status = await getSubscriptionStatus(shop);
  return status.hasActiveSubscription;
}

/**
 * Cancel a subscription
 */
export async function cancelSubscription(
  admin: AdminApiContext,
  shop: string,
): Promise<void> {
  const subscription = await prisma.subscription.findFirst({
    where: { shop, status: "ACTIVE" },
    orderBy: { createdAt: "desc" },
  });

  if (!subscription) {
    throw new Error("No active subscription found");
  }

  const response = await admin.graphql(
    `#graphql
      mutation CancelSubscription($id: ID!) {
        appSubscriptionCancel(id: $id) {
          appSubscription {
            id
            status
          }
          userErrors {
            field
            message
          }
        }
      }
    `,
    {
      variables: {
        id: subscription.shopifySubscriptionId,
      },
    },
  );

  const data = await response.json();

  if (data.data.appSubscriptionCancel.userErrors.length > 0) {
    throw new Error(
      `Failed to cancel subscription: ${data.data.appSubscriptionCancel.userErrors[0].message}`,
    );
  }

  // Update status in database
  await prisma.subscription.update({
    where: { id: subscription.id },
    data: { status: "CANCELLED" },
  });
}

/**
 * Get current active subscription for a shop
 */
export async function getCurrentSubscription(admin: AdminApiContext) {
  const response = await admin.graphql(
    `#graphql
      query GetCurrentSubscription {
        currentAppInstallation {
          activeSubscriptions {
            id
            name
            status
            currentPeriodEnd
            trialDays
            test
            lineItems {
              id
              plan {
                pricingDetails {
                  ... on AppRecurringPricing {
                    price {
                      amount
                      currencyCode
                    }
                    interval
                  }
                }
              }
            }
          }
        }
      }
    `,
  );

  const data = await response.json();
  const subscriptions =
    data.data?.currentAppInstallation?.activeSubscriptions || [];

  return subscriptions[0] || null;
}

/**
 * Check if shop can access feature based on plan
 */
export async function canAccessFeature(
  shop: string,
  feature: keyof typeof SUBSCRIPTION_PLANS.starter.features,
): Promise<boolean> {
  const status = await getSubscriptionStatus(shop);

  if (!status.hasActiveSubscription) {
    return false;
  }

  const features = status.features;
  if (!features) {
    return false;
  }

  return features[feature] === true || features[feature] === -1;
}

/**
 * Check if shop is within product limit
 */
export async function isWithinProductLimit(shop: string): Promise<boolean> {
  const status = await getSubscriptionStatus(shop);

  if (!status.hasActiveSubscription || !status.features) {
    return false;
  }

  const maxProducts = status.features.maxProducts;

  // -1 means unlimited
  if (maxProducts === -1) {
    return true;
  }

  // Count current products
  const [stoneCount, settingCount] = await Promise.all([
    prisma.stoneMetadata.count({ where: { shop } }),
    prisma.settingMetadata.count({ where: { shop } }),
  ]);

  const totalProducts = stoneCount + settingCount;

  return totalProducts < maxProducts;
}

/**
 * Get usage stats for a shop
 */
export async function getUsageStats(shop: string) {
  const [stoneCount, settingCount, configCount, inquiryCount] =
    await Promise.all([
      prisma.stoneMetadata.count({ where: { shop } }),
      prisma.settingMetadata.count({ where: { shop } }),
      prisma.configuration.count({ where: { shop } }),
      prisma.customerInquiry.count({ where: { shop } }),
    ]);

  const status = await getSubscriptionStatus(shop);
  const maxProducts = status.features?.maxProducts || 100;

  return {
    products: {
      current: stoneCount + settingCount,
      limit: maxProducts === -1 ? "Unlimited" : maxProducts,
      stones: stoneCount,
      settings: settingCount,
    },
    configurations: configCount,
    inquiries: inquiryCount,
    percentUsed:
      maxProducts === -1
        ? 0
        : ((stoneCount + settingCount) / maxProducts) * 100,
  };
}
