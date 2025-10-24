/**
 * Ring Builder MVP - Configuration Service
 *
 * Service for managing ring configurations (CRUD operations).
 * Ensures multi-tenant data isolation for all operations.
 */

import prisma from "~/db.server";
import type {
  Configuration,
  CreateConfigurationInput,
  UpdateConfigurationInput,
  ConfigurationSummary,
  SideStonesConfig,
} from "~/types/builder";
import type { ConfigurationStatus } from "@prisma/client";
import { validateShop, validateConfigurationId } from "~/utils/validators";
import { getSettingByProductId, getStoneByProductId } from "./product.server";

// ============================================================================
// CONFIGURATION ID GENERATION
// ============================================================================

/**
 * Generate unique configuration ID
 * Format: CONFIG-YYYYMMDD-RANDOM
 *
 * @returns Unique configuration ID
 */
export function generateConfigurationId(): string {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();

  return `CONFIG-${dateStr}-${random}`;
}

// ============================================================================
// CREATE CONFIGURATION
// ============================================================================

/**
 * Create a new configuration
 *
 * @param data - Configuration creation input
 * @param shop - Shop domain (for multi-tenant isolation)
 * @returns Created configuration
 */
export async function createConfiguration(
  data: Omit<CreateConfigurationInput, "shop" | "configurationId">,
  shop: string,
): Promise<Configuration> {
  validateShop(shop);

  // Generate unique configuration ID
  const configurationId = generateConfigurationId();

  // Prepare side stones config (stringify if provided)
  const sideStonesConfig = data.sideStonesConfig
    ? JSON.stringify(data.sideStonesConfig)
    : null;

  // Create configuration in database
  const configuration = await prisma.configuration.create({
    data: {
      shop,
      configurationId,
      customerId: data.customerId || null,
      customerEmail: data.customerEmail || null,
      settingId: data.settingId,
      stoneId: data.stoneId,
      metalType: data.metalType,
      ringSize: data.ringSize,
      sideStonesConfig,
      settingPrice: data.settingPrice,
      stonePrice: data.stonePrice,
      sideStonesPrice: data.sideStonesPrice || 0,
      totalPrice: data.totalPrice,
      status: data.status || "in_progress",
      cartItemId: data.cartItemId || null,
    },
  });

  return configuration;
}

// ============================================================================
// READ CONFIGURATION
// ============================================================================

/**
 * Get configuration by ID
 *
 * @param id - Configuration database ID
 * @param shop - Shop domain (for multi-tenant isolation)
 * @returns Configuration or null
 */
export async function getConfiguration(
  id: string,
  shop: string,
): Promise<Configuration | null> {
  validateShop(shop);

  const configuration = await prisma.configuration.findFirst({
    where: { id, shop },
  });

  return configuration;
}

/**
 * Get configuration by configuration ID (human-readable ID)
 *
 * @param configurationId - Configuration ID (e.g., CONFIG-20251012-ABC123)
 * @param shop - Shop domain (for multi-tenant isolation)
 * @returns Configuration or null
 */
export async function getConfigurationByConfigId(
  configurationId: string,
  shop: string,
): Promise<Configuration | null> {
  validateShop(shop);
  validateConfigurationId(configurationId);

  const configuration = await prisma.configuration.findFirst({
    where: { configurationId, shop },
  });

  return configuration;
}

/**
 * Get configuration summary with full details
 * Fetches related setting and stone information
 *
 * @param id - Configuration database ID
 * @param shop - Shop domain
 * @returns Configuration summary or null
 */
export async function getConfigurationSummary(
  id: string,
  shop: string,
): Promise<ConfigurationSummary | null> {
  const configuration = await getConfiguration(id, shop);

  if (!configuration) {
    return null;
  }

  // Fetch setting details
  const setting = await getSettingByProductId(configuration.settingId, shop);
  if (!setting) {
    throw new Error("Setting not found");
  }

  // Fetch stone details
  const stone = await getStoneByProductId(configuration.stoneId, shop);
  if (!stone) {
    throw new Error("Stone not found");
  }

  // Parse side stones config
  const sideStonesData = configuration.sideStonesConfig
    ? (JSON.parse(configuration.sideStonesConfig) as SideStonesConfig)
    : undefined;

  // Build summary
  const summary: ConfigurationSummary = {
    id: configuration.id,
    configurationId: configuration.configurationId,
    setting: {
      id: setting.id,
      name: setting.name || "Setting",
      sku: "N/A", // TODO: Fetch from Shopify if needed
      metalType: configuration.metalType as any,
      style: setting.style,
      price: configuration.settingPrice,
      image: setting.images[0],
    },
    stone: {
      id: stone.id,
      carat: stone.carat,
      shape: stone.shape,
      cut: stone.cut,
      color: stone.color,
      clarity: stone.clarity,
      certificate: stone.certificate,
      certificateNumber: stone.certificateNumber,
      price: configuration.stonePrice,
      image: stone.images[0],
    },
    sideStones: sideStonesData
      ? {
          quality: sideStonesData.quality,
          quantity: sideStonesData.quantity,
          price: configuration.sideStonesPrice || 0,
        }
      : undefined,
    ringSize: configuration.ringSize as any,
    priceBreakdown: {
      settingPrice: configuration.settingPrice,
      stonePrice: configuration.stonePrice,
      sideStonesPrice: configuration.sideStonesPrice || 0,
      engravingPrice: 0,
      subtotal:
        configuration.settingPrice +
        configuration.stonePrice +
        (configuration.sideStonesPrice || 0),
      markup: 0, // Calculated from totalPrice - subtotal
      markupPercent: 0, // TODO: Fetch from app settings if needed
      total: configuration.totalPrice,
    },
    status: configuration.status,
    createdAt: configuration.createdAt,
  };

  // Calculate markup from the difference
  summary.priceBreakdown.markup =
    summary.priceBreakdown.total - summary.priceBreakdown.subtotal;

  return summary;
}

// ============================================================================
// UPDATE CONFIGURATION
// ============================================================================

/**
 * Update configuration
 *
 * @param id - Configuration database ID
 * @param data - Update data
 * @param shop - Shop domain (for multi-tenant isolation)
 * @returns Updated configuration or null
 */
export async function updateConfiguration(
  id: string,
  data: UpdateConfigurationInput,
  shop: string,
): Promise<Configuration | null> {
  validateShop(shop);

  // Check if configuration exists and belongs to shop
  const existing = await getConfiguration(id, shop);
  if (!existing) {
    return null;
  }

  // Update configuration
  const updated = await prisma.configuration.update({
    where: { id },
    data: {
      status: data.status,
      cartItemId: data.cartItemId || undefined,
      updatedAt: new Date(),
    },
  });

  return updated;
}

/**
 * Mark configuration as completed
 *
 * @param id - Configuration database ID
 * @param shop - Shop domain
 * @param cartItemId - Optional Shopify cart item ID
 * @returns Updated configuration
 */
export async function markConfigurationCompleted(
  id: string,
  shop: string,
  cartItemId?: string,
): Promise<Configuration | null> {
  return updateConfiguration(id, { status: "completed", cartItemId }, shop);
}

/**
 * Mark configuration as ordered
 *
 * @param id - Configuration database ID
 * @param shop - Shop domain
 * @returns Updated configuration
 */
export async function markConfigurationOrdered(
  id: string,
  shop: string,
): Promise<Configuration | null> {
  return updateConfiguration(id, { status: "ordered" }, shop);
}

// ============================================================================
// LIST CONFIGURATIONS
// ============================================================================

/**
 * List configurations with filters
 *
 * @param shop - Shop domain (for multi-tenant isolation)
 * @param filters - Optional filters
 * @returns Array of configurations
 */
export async function listConfigurations(
  shop: string,
  filters?: {
    customerId?: string;
    status?: ConfigurationStatus;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    offset?: number;
  },
): Promise<{ configurations: Configuration[]; total: number }> {
  validateShop(shop);

  const where: any = { shop };

  if (filters?.customerId) {
    where.customerId = filters.customerId;
  }

  if (filters?.status) {
    where.status = filters.status;
  }

  if (filters?.startDate || filters?.endDate) {
    where.createdAt = {};
    if (filters.startDate) {
      where.createdAt.gte = filters.startDate;
    }
    if (filters.endDate) {
      where.createdAt.lte = filters.endDate;
    }
  }

  const limit = filters?.limit || 50;
  const offset = filters?.offset || 0;

  const [configurations, total] = await Promise.all([
    prisma.configuration.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    }),
    prisma.configuration.count({ where }),
  ]);

  return { configurations, total };
}

/**
 * Get configurations by customer ID
 *
 * @param customerId - Shopify Customer GID
 * @param shop - Shop domain
 * @param limit - Max number of configurations
 * @returns Array of configurations
 */
export async function getCustomerConfigurations(
  customerId: string,
  shop: string,
  limit: number = 10,
): Promise<Configuration[]> {
  validateShop(shop);

  return prisma.configuration.findMany({
    where: { customerId, shop },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

// ============================================================================
// DELETE CONFIGURATION
// ============================================================================

/**
 * Delete configuration
 * Note: For MVP, we don't actually delete, just mark as cancelled
 *
 * @param id - Configuration database ID
 * @param shop - Shop domain (for multi-tenant isolation)
 * @returns True if deleted
 */
export async function deleteConfiguration(
  id: string,
  shop: string,
): Promise<boolean> {
  validateShop(shop);

  // Check if configuration exists and belongs to shop
  const existing = await getConfiguration(id, shop);
  if (!existing) {
    return false;
  }

  // For MVP, we could add a "cancelled" status instead of deleting
  // Or actually delete:
  await prisma.configuration.delete({
    where: { id },
  });

  return true;
}

// ============================================================================
// STATISTICS
// ============================================================================

/**
 * Get configuration statistics for a shop
 *
 * @param shop - Shop domain
 * @param startDate - Optional start date filter
 * @param endDate - Optional end date filter
 * @returns Statistics object
 */
export async function getConfigurationStats(
  shop: string,
  startDate?: Date,
  endDate?: Date,
): Promise<{
  total: number;
  inProgress: number;
  completed: number;
  ordered: number;
  averagePrice: number;
  totalRevenue: number;
}> {
  validateShop(shop);

  const where: any = { shop };

  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) where.createdAt.gte = startDate;
    if (endDate) where.createdAt.lte = endDate;
  }

  const [total, inProgress, completed, ordered, allConfigs] = await Promise.all(
    [
      prisma.configuration.count({ where }),
      prisma.configuration.count({
        where: { ...where, status: "in_progress" },
      }),
      prisma.configuration.count({ where: { ...where, status: "completed" } }),
      prisma.configuration.count({ where: { ...where, status: "ordered" } }),
      prisma.configuration.findMany({
        where,
        select: { totalPrice: true },
      }),
    ],
  );

  const totalRevenue = allConfigs.reduce(
    (sum: number, c: { totalPrice: number }) => sum + c.totalPrice,
    0,
  );
  const averagePrice = total > 0 ? totalRevenue / total : 0;

  return {
    total,
    inProgress,
    completed,
    ordered,
    averagePrice,
    totalRevenue,
  };
}

// ============================================================================
// SEARCH
// ============================================================================

/**
 * Search configurations by configuration ID or customer email
 *
 * @param query - Search query
 * @param shop - Shop domain
 * @param limit - Max results
 * @returns Array of configurations
 */
export async function searchConfigurations(
  query: string,
  shop: string,
  limit: number = 20,
): Promise<Configuration[]> {
  validateShop(shop);

  return prisma.configuration.findMany({
    where: {
      shop,
      OR: [
        { configurationId: { contains: query } },
        { customerEmail: { contains: query } },
      ],
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

// ============================================================================
// CLEANUP
// ============================================================================

/**
 * Delete old in-progress configurations (cleanup job)
 * Removes configurations that haven't been completed after X days
 *
 * @param shop - Shop domain
 * @param daysOld - Number of days (default: 30)
 * @returns Number of deleted configurations
 */
export async function cleanupOldConfigurations(
  shop: string,
  daysOld: number = 30,
): Promise<number> {
  validateShop(shop);

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);

  const result = await prisma.configuration.deleteMany({
    where: {
      shop,
      status: "in_progress",
      createdAt: {
        lte: cutoffDate,
      },
    },
  });

  return result.count;
}
