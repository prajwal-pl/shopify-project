/**
 * Builder API: Settings
 *
 * Public endpoint for fetching ring settings with filters.
 * No authentication required - customer-facing.
 */

import type { LoaderFunctionArgs } from "react-router";
import {
  getSettings,
  getSettingFilterOptions,
} from "~/services/product.server";
import type { SettingFilters } from "~/types/builder";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);

  // Extract shop from query params or headers
  // For MVP, we'll use a shop parameter
  const shop = url.searchParams.get("shop");

  console.log("=================================================");
  console.log("💍 RING BUILDER API - GET /api/builder/settings");
  console.log("   Shop:", shop);

  if (!shop) {
    console.error("❌ Missing shop parameter");
    console.log("=================================================");
    return Response.json(
      { error: "Shop parameter is required" },
      { status: 400 },
    );
  }

  // Parse filters from query params
  const filters: SettingFilters = {};

  const styleParam = url.searchParams.get("style");
  if (styleParam) {
    filters.style = styleParam.split(",") as any[];
  }

  const metalTypeParam = url.searchParams.get("metalType");
  if (metalTypeParam) {
    filters.metalType = metalTypeParam.split(",") as any[];
  }

  const priceMin = url.searchParams.get("priceMin");
  if (priceMin) {
    filters.priceMin = parseFloat(priceMin);
  }

  const priceMax = url.searchParams.get("priceMax");
  if (priceMax) {
    filters.priceMax = parseFloat(priceMax);
  }

  const featuredParam = url.searchParams.get("featured");
  if (featuredParam === "true") {
    filters.featured = true;
  }

  const page = parseInt(url.searchParams.get("page") || "1");

  try {
    // Fetch settings
    const { settings, totalCount, hasNextPage } = await getSettings(
      shop,
      filters,
      page,
    );

    // Get filter options
    const filterOptions = await getSettingFilterOptions(shop);

    console.log("✅ RING BUILDER API: Returning", settings.length, "settings");
    console.log("=================================================");

    return Response.json({
      settings,
      filters: {
        styles: filterOptions.styles,
        priceRange: filterOptions.priceRange,
      },
      pagination: {
        currentPage: page,
        totalItems: totalCount,
        hasNextPage,
      },
    });
  } catch (error: any) {
    console.error("❌ RING BUILDER API ERROR in settings:", error);
    console.error("=================================================");
    return Response.json(
      { error: "Failed to fetch settings" },
      { status: 500 },
    );
  }
}
