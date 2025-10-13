/**
 * Ring Builder MVP - Product Service
 *
 * Service for fetching and managing products from Shopify.
 * Handles settings and stones inventory with multi-tenant isolation.
 */

import prisma from "~/db.server";
import type {
  Setting,
  Stone,
  SettingFilters,
  StoneFilters,
  StoneSortOptions,
  ParsedSettingMetadata,
} from "~/types/builder";
import {
  parseShopifyGid,
  getProductImages,
  findMetafield,
} from "~/utils/shopify-helpers";
import { PAGINATION } from "~/utils/constants";

// ============================================================================
// SETTINGS
// ============================================================================

/**
 * Get all settings with optional filters
 *
 * @param shop - Shop domain (for multi-tenant isolation)
 * @param filters - Optional filters
 * @param page - Page number (default: 1)
 * @returns Array of settings and pagination info
 */
export async function getSettings(
  shop: string,
  filters?: SettingFilters,
  page: number = 1,
): Promise<{
  settings: Setting[];
  totalCount: number;
  hasNextPage: boolean;
}> {
  // Build where clause with filters
  const where: any = {
    shop,
  };

  if (filters?.style && filters.style.length > 0) {
    where.style = { in: filters.style };
  }

  if (filters?.featured !== undefined) {
    where.featured = filters.featured;
  }

  // Fetch from database
  const skip = (page - 1) * PAGINATION.SETTINGS_PER_PAGE;
  const take = PAGINATION.SETTINGS_PER_PAGE;

  const [metadataList, totalCount] = await Promise.all([
    prisma.settingMetadata.findMany({
      where,
      skip,
      take: take + 1, // Fetch one extra to check if there's a next page
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    }),
    prisma.settingMetadata.count({ where }),
  ]);

  const hasNextPage = metadataList.length > take;
  const settingsData = metadataList.slice(0, take);

  // Parse and transform to Setting type
  const settings: Setting[] = settingsData.map((metadata: any) => {
    const compatibleShapes = JSON.parse(metadata.compatibleShapes);
    const basePrices = JSON.parse(metadata.basePrices);
    const images = metadata.images ? JSON.parse(metadata.images) : [];

    // Calculate starting price (lowest base price)
    const startingPrice = Math.min(
      ...Object.values(basePrices as Record<string, number>),
    );

    return {
      id: metadata.id,
      productId: metadata.productId,
      name: `Setting ${metadata.id.slice(0, 8)}`, // TODO: Fetch from Shopify if needed
      style: metadata.style as any,
      settingHeight: metadata.settingHeight || undefined,
      compatibleShapes,
      basePrices,
      startingPrice,
      images,
      featured: metadata.featured,
    };
  });

  // Apply price filters (client-side for now, could optimize with DB query)
  let filteredSettings = settings;

  if (filters?.priceMin !== undefined) {
    filteredSettings = filteredSettings.filter(
      (s) => s.startingPrice >= filters.priceMin!,
    );
  }

  if (filters?.priceMax !== undefined) {
    filteredSettings = filteredSettings.filter(
      (s) => s.startingPrice <= filters.priceMax!,
    );
  }

  return {
    settings: filteredSettings,
    totalCount,
    hasNextPage,
  };
}

/**
 * Get a single setting by ID
 *
 * @param id - Setting metadata ID
 * @param shop - Shop domain (for multi-tenant isolation)
 * @returns Setting or null
 */
export async function getSetting(
  id: string,
  shop: string,
): Promise<Setting | null> {
  const metadata = await prisma.settingMetadata.findFirst({
    where: { id, shop },
  });

  if (!metadata) {
    return null;
  }

  const compatibleShapes = JSON.parse(metadata.compatibleShapes);
  const basePrices = JSON.parse(metadata.basePrices);
  const images = metadata.images ? JSON.parse(metadata.images) : [];
  const startingPrice = Math.min(
    ...Object.values(basePrices as Record<string, number>),
  );

  return {
    id: metadata.id,
    productId: metadata.productId,
    name: `Setting ${metadata.id.slice(0, 8)}`,
    style: metadata.style as any,
    settingHeight: metadata.settingHeight || undefined,
    compatibleShapes,
    basePrices,
    startingPrice,
    images,
    featured: metadata.featured,
  };
}

/**
 * Get setting by product ID
 *
 * @param productId - Shopify Product GID
 * @param shop - Shop domain
 * @returns Setting or null
 */
export async function getSettingByProductId(
  productId: string,
  shop: string,
): Promise<Setting | null> {
  const metadata = await prisma.settingMetadata.findFirst({
    where: { productId, shop },
  });

  if (!metadata) {
    return null;
  }

  const compatibleShapes = JSON.parse(metadata.compatibleShapes);
  const basePrices = JSON.parse(metadata.basePrices);
  const images = metadata.images ? JSON.parse(metadata.images) : [];
  const startingPrice = Math.min(
    ...Object.values(basePrices as Record<string, number>),
  );

  return {
    id: metadata.id,
    productId: metadata.productId,
    name: `Setting ${metadata.id.slice(0, 8)}`,
    style: metadata.style as any,
    settingHeight: metadata.settingHeight || undefined,
    compatibleShapes,
    basePrices,
    startingPrice,
    images,
    featured: metadata.featured,
  };
}

// ============================================================================
// STONES
// ============================================================================

/**
 * Get all stones with optional filters
 *
 * @param shop - Shop domain (for multi-tenant isolation)
 * @param filters - Optional filters
 * @param sort - Sort options
 * @param page - Page number (default: 1)
 * @returns Array of stones and pagination info
 */
export async function getStones(
  shop: string,
  filters?: StoneFilters,
  sort?: StoneSortOptions,
  page: number = 1,
): Promise<{
  stones: Stone[];
  totalCount: number;
  hasNextPage: boolean;
}> {
  // Build where clause with filters
  const where: any = {
    shop,
  };

  if (filters?.shape && filters.shape.length > 0) {
    where.shape = { in: filters.shape };
  }

  if (filters?.caratMin !== undefined || filters?.caratMax !== undefined) {
    where.carat = {};
    if (filters.caratMin !== undefined) {
      where.carat.gte = filters.caratMin;
    }
    if (filters.caratMax !== undefined) {
      where.carat.lte = filters.caratMax;
    }
  }

  if (filters?.cut && filters.cut.length > 0) {
    where.cut = { in: filters.cut };
  }

  if (filters?.color && filters.color.length > 0) {
    where.color = { in: filters.color };
  }

  if (filters?.clarity && filters.clarity.length > 0) {
    where.clarity = { in: filters.clarity };
  }

  if (filters?.priceMin !== undefined || filters?.priceMax !== undefined) {
    where.price = {};
    if (filters.priceMin !== undefined) {
      where.price.gte = filters.priceMin;
    }
    if (filters.priceMax !== undefined) {
      where.price.lte = filters.priceMax;
    }
  }

  if (filters?.certification && filters.certification.length > 0) {
    where.certificate = { in: filters.certification };
  }

  if (filters?.available !== undefined) {
    where.available = filters.available;
  }

  // Build orderBy clause
  const orderBy: any = [];
  if (sort) {
    orderBy.push({ [sort.field]: sort.order });
  } else {
    // Default sort: featured first, then by carat
    orderBy.push({ carat: "desc" });
  }

  // Fetch from database
  const skip = (page - 1) * PAGINATION.STONES_PER_PAGE;
  const take = PAGINATION.STONES_PER_PAGE;

  const [metadataList, totalCount] = await Promise.all([
    prisma.stoneMetadata.findMany({
      where,
      skip,
      take: take + 1, // Fetch one extra to check if there's a next page
      orderBy,
    }),
    prisma.stoneMetadata.count({ where }),
  ]);

  const hasNextPage = metadataList.length > take;
  const stonesData = metadataList.slice(0, take);

  // Transform to Stone type
  const stones: Stone[] = stonesData.map((metadata: any) => {
    const images = metadata.images ? JSON.parse(metadata.images) : [];

    return {
      id: metadata.id,
      productId: metadata.productId,
      stoneType: metadata.stoneType,
      shape: metadata.shape as any,
      carat: metadata.carat,
      cut: metadata.cut as any,
      color: metadata.color as any,
      clarity: metadata.clarity as any,
      certificate: metadata.certificate as any,
      certificateNumber: metadata.certificateNumber || undefined,
      certificateUrl: metadata.certificateUrl || undefined,
      measurements: metadata.measurements || undefined,
      tablePercent: metadata.tablePercent || undefined,
      depthPercent: metadata.depthPercent || undefined,
      polish: metadata.polish || undefined,
      symmetry: metadata.symmetry || undefined,
      fluorescence: metadata.fluorescence || undefined,
      images,
      price: metadata.price,
      available: metadata.available,
    };
  });

  return {
    stones,
    totalCount,
    hasNextPage,
  };
}

/**
 * Get a single stone by ID
 *
 * @param id - Stone metadata ID
 * @param shop - Shop domain (for multi-tenant isolation)
 * @returns Stone or null
 */
export async function getStone(
  id: string,
  shop: string,
): Promise<Stone | null> {
  const metadata = await prisma.stoneMetadata.findFirst({
    where: { id, shop },
  });

  if (!metadata) {
    return null;
  }

  const images = metadata.images ? JSON.parse(metadata.images) : [];

  return {
    id: metadata.id,
    productId: metadata.productId,
    stoneType: metadata.stoneType,
    shape: metadata.shape as any,
    carat: metadata.carat,
    cut: metadata.cut as any,
    color: metadata.color as any,
    clarity: metadata.clarity as any,
    certificate: metadata.certificate as any,
    certificateNumber: metadata.certificateNumber || undefined,
    certificateUrl: metadata.certificateUrl || undefined,
    measurements: metadata.measurements || undefined,
    tablePercent: metadata.tablePercent || undefined,
    depthPercent: metadata.depthPercent || undefined,
    polish: metadata.polish || undefined,
    symmetry: metadata.symmetry || undefined,
    fluorescence: metadata.fluorescence || undefined,
    images,
    price: metadata.price,
    available: metadata.available,
  };
}

/**
 * Get stone by product ID
 *
 * @param productId - Shopify Product GID
 * @param shop - Shop domain
 * @returns Stone or null
 */
export async function getStoneByProductId(
  productId: string,
  shop: string,
): Promise<Stone | null> {
  const metadata = await prisma.stoneMetadata.findFirst({
    where: { productId, shop },
  });

  if (!metadata) {
    return null;
  }

  const images = metadata.images ? JSON.parse(metadata.images) : [];

  return {
    id: metadata.id,
    productId: metadata.productId,
    stoneType: metadata.stoneType,
    shape: metadata.shape as any,
    carat: metadata.carat,
    cut: metadata.cut as any,
    color: metadata.color as any,
    clarity: metadata.clarity as any,
    certificate: metadata.certificate as any,
    certificateNumber: metadata.certificateNumber || undefined,
    certificateUrl: metadata.certificateUrl || undefined,
    measurements: metadata.measurements || undefined,
    tablePercent: metadata.tablePercent || undefined,
    depthPercent: metadata.depthPercent || undefined,
    polish: metadata.polish || undefined,
    symmetry: metadata.symmetry || undefined,
    fluorescence: metadata.fluorescence || undefined,
    images,
    price: metadata.price,
    available: metadata.available,
  };
}

// ============================================================================
// PRODUCT AVAILABILITY
// ============================================================================

/**
 * Check if a product is available (in stock)
 * Note: For MVP, we rely on the `available` flag in metadata
 * In production, this should query Shopify's inventory
 *
 * @param productId - Shopify Product GID
 * @param shop - Shop domain
 * @returns True if available
 */
export async function isProductAvailable(
  productId: string,
  shop: string,
): Promise<boolean> {
  // Check if it's a stone
  const stone = await prisma.stoneMetadata.findFirst({
    where: { productId, shop },
    select: { available: true },
  });

  if (stone) {
    return stone.available;
  }

  // Check if it's a setting (settings are always available for MVP)
  const setting = await prisma.settingMetadata.findFirst({
    where: { productId, shop },
    select: { id: true },
  });

  return !!setting;
}

// ============================================================================
// FILTER METADATA
// ============================================================================

/**
 * Get available filter options for settings
 *
 * @param shop - Shop domain
 * @returns Filter metadata
 */
export async function getSettingFilterOptions(shop: string): Promise<{
  styles: string[];
  priceRange: { min: number; max: number };
}> {
  const metadata = await prisma.settingMetadata.findMany({
    where: { shop },
    select: { style: true, basePrices: true },
  });

  const styles = [...new Set(metadata.map((m: any) => m.style))] as string[];

  // Calculate price range
  let minPrice = Infinity;
  let maxPrice = 0;

  for (const item of metadata) {
    const prices = Object.values(
      JSON.parse(item.basePrices) as Record<string, number>,
    );
    const itemMin = Math.min(...prices);
    const itemMax = Math.max(...prices);

    if (itemMin < minPrice) minPrice = itemMin;
    if (itemMax > maxPrice) maxPrice = itemMax;
  }

  return {
    styles,
    priceRange: {
      min: minPrice === Infinity ? 0 : minPrice,
      max: maxPrice,
    },
  };
}

/**
 * Get available filter options for stones
 *
 * @param shop - Shop domain
 * @returns Filter metadata
 */
export async function getStoneFilterOptions(shop: string): Promise<{
  shapes: string[];
  caratRange: { min: number; max: number };
  priceRange: { min: number; max: number };
  cuts: string[];
  colors: string[];
  clarities: string[];
  certifications: string[];
}> {
  const metadata = await prisma.stoneMetadata.findMany({
    where: { shop, available: true },
    select: {
      shape: true,
      carat: true,
      price: true,
      cut: true,
      color: true,
      clarity: true,
      certificate: true,
    },
  });

  const shapes = [...new Set(metadata.map((m: any) => m.shape))] as string[];
  const cuts = [
    ...new Set(metadata.map((m: any) => m.cut).filter(Boolean)),
  ] as string[];
  const colors = [
    ...new Set(metadata.map((m: any) => m.color).filter(Boolean)),
  ] as string[];
  const clarities = [
    ...new Set(metadata.map((m: any) => m.clarity).filter(Boolean)),
  ] as string[];
  const certifications = [
    ...new Set(metadata.map((m: any) => m.certificate).filter(Boolean)),
  ] as string[];

  const carats = metadata.map((m: any) => m.carat);
  const prices = metadata.map((m: any) => m.price);

  return {
    shapes,
    caratRange: {
      min: Math.min(...carats),
      max: Math.max(...carats),
    },
    priceRange: {
      min: Math.min(...prices),
      max: Math.max(...prices),
    },
    cuts,
    colors,
    clarities,
    certifications,
  };
}
