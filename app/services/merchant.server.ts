/**
 * Merchant Service - Multi-Tenant Shop Management
 *
 * Handles merchant (shop) lifecycle, settings, and configuration.
 * Each merchant is a Shopify store that has installed the app.
 */

import prisma from "~/db.server";
import type { Merchant } from "@prisma/client";

// ============================================================================
// TYPES
// ============================================================================

export interface MerchantSettings {
  onboardingCompleted: boolean;
  onboardingStep?: number;
  businessName?: string;
  contactEmail?: string;
  contactPhone?: string;
  timezone?: string;
  currency?: string;
}

export interface CreateMerchantInput {
  shop: string;
  shopifyDomain: string;
  accessToken?: string;
  email?: string;
  name?: string;
}

// ============================================================================
// MERCHANT CRUD
// ============================================================================

/**
 * Create a new merchant record when app is installed
 */
export async function createMerchant(
  input: CreateMerchantInput,
): Promise<Merchant> {
  const merchant = await prisma.merchant.create({
    data: {
      shop: input.shop,
      shopifyDomain: input.shopifyDomain,
      accessToken: input.accessToken || "", // Will be encrypted in production
      email: input.email,
      name: input.name,
      status: "active",
      settings: JSON.stringify({
        onboardingCompleted: false,
        onboardingStep: 1,
      } as MerchantSettings),
      installedAt: new Date(),
    },
  });

  return merchant;
}

/**
 * Get merchant by shop domain
 */
export async function getMerchant(shop: string): Promise<Merchant | null> {
  return await prisma.merchant.findUnique({
    where: { shop },
  });
}

/**
 * Update merchant settings
 */
export async function updateMerchantSettings(
  shop: string,
  settings: Partial<MerchantSettings>,
): Promise<Merchant> {
  const merchant = await getMerchant(shop);

  if (!merchant) {
    throw new Error(`Merchant not found: ${shop}`);
  }

  const currentSettings = merchant.settings
    ? (JSON.parse(merchant.settings) as MerchantSettings)
    : {};

  const updatedSettings = {
    ...currentSettings,
    ...settings,
  };

  return await prisma.merchant.update({
    where: { shop },
    data: {
      settings: JSON.stringify(updatedSettings),
    },
  });
}

/**
 * Mark onboarding as complete
 */
export async function completeOnboarding(shop: string): Promise<Merchant> {
  return await updateMerchantSettings(shop, {
    onboardingCompleted: true,
    onboardingStep: undefined,
  });
}

/**
 * Get merchant settings
 */
export async function getMerchantSettings(
  shop: string,
): Promise<MerchantSettings> {
  const merchant = await getMerchant(shop);

  if (!merchant || !merchant.settings) {
    return {
      onboardingCompleted: false,
      onboardingStep: 1,
    };
  }

  return JSON.parse(merchant.settings) as MerchantSettings;
}

/**
 * Check if merchant has completed onboarding
 */
export async function hasCompletedOnboarding(shop: string): Promise<boolean> {
  const settings = await getMerchantSettings(shop);
  return settings.onboardingCompleted;
}

/**
 * Update merchant status (active, suspended, cancelled)
 */
export async function updateMerchantStatus(
  shop: string,
  status: "active" | "suspended" | "cancelled",
): Promise<Merchant> {
  return await prisma.merchant.update({
    where: { shop },
    data: { status },
  });
}

/**
 * Get or create merchant (upsert)
 */
export async function getOrCreateMerchant(
  input: CreateMerchantInput,
): Promise<Merchant> {
  const existing = await getMerchant(input.shop);

  if (existing) {
    // Update access token if changed and provided
    if (input.accessToken && existing.accessToken !== input.accessToken) {
      return await prisma.merchant.update({
        where: { shop: input.shop },
        data: { accessToken: input.accessToken },
      });
    }
    return existing;
  }

  return await createMerchant(input);
}

/**
 * Delete merchant and all associated data (GDPR compliance)
 */
export async function deleteMerchant(shop: string): Promise<void> {
  // Delete in order to respect foreign key constraints
  await Promise.all([
    prisma.customerInquiry.deleteMany({ where: { shop } }),
    prisma.configuration.deleteMany({ where: { shop } }),
    prisma.stoneMetadata.deleteMany({ where: { shop } }),
    prisma.settingMetadata.deleteMany({ where: { shop } }),
    prisma.analyticsEvent.deleteMany({ where: { shop } }),
    prisma.appSettings.deleteMany({ where: { shop } }),
    prisma.subscription.deleteMany({ where: { shop } }),
  ]);

  await prisma.merchant.delete({
    where: { shop },
  });
}

/**
 * Get merchant statistics
 */
export async function getMerchantStats(shop: string) {
  const [stoneCount, settingCount, configCount, inquiryCount, merchant] =
    await Promise.all([
      prisma.stoneMetadata.count({ where: { shop } }),
      prisma.settingMetadata.count({ where: { shop } }),
      prisma.configuration.count({ where: { shop } }),
      prisma.customerInquiry.count({ where: { shop } }),
      getMerchant(shop),
    ]);

  return {
    shop,
    installedAt: merchant?.installedAt,
    products: {
      stones: stoneCount,
      settings: settingCount,
      total: stoneCount + settingCount,
    },
    configurations: configCount,
    inquiries: inquiryCount,
    status: merchant?.status || "unknown",
  };
}

/**
 * List all merchants (admin use)
 */
export async function listMerchants(filters?: {
  status?: string;
  limit?: number;
  offset?: number;
}) {
  const where = filters?.status ? { status: filters.status } : {};

  const [merchants, total] = await Promise.all([
    prisma.merchant.findMany({
      where,
      take: filters?.limit || 50,
      skip: filters?.offset || 0,
      orderBy: { installedAt: "desc" },
    }),
    prisma.merchant.count({ where }),
  ]);

  return {
    merchants,
    total,
    limit: filters?.limit || 50,
    offset: filters?.offset || 0,
  };
}
