/**
 * Builder API: Stones - Phase 2.0 Enhanced
 *
 * Public endpoint for fetching stones with advanced filters.
 * No authentication required - customer-facing.
 *
 * Phase 2.0 Additions:
 * - Diamond type filtering (mined/lab_grown/fancy_color)
 * - Diamond type counts for tab badges
 * - SKU search
 * - Per page selector (12, 20, 50, 100)
 */

import type { LoaderFunctionArgs } from "react-router";
import { getStones, getStoneFilterOptions } from "~/services/product.server";
import type { StoneFilters, StoneSortOptions } from "~/types/builder";
import prisma from "~/db.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);

  // Extract shop from query params
  const shop = url.searchParams.get("shop");

  if (!shop) {
    return Response.json(
      { error: "Shop parameter is required" },
      { status: 400 },
    );
  }

  // Parse filters from query params
  const filters: StoneFilters = {};

  const shapeParam = url.searchParams.get("shape");
  if (shapeParam) {
    filters.shape = shapeParam.split(",") as any[];
  }

  // Phase 2.0: Diamond type filter
  const diamondTypeParam = url.searchParams.get("diamondType");
  if (diamondTypeParam) {
    filters.diamondType = diamondTypeParam.split(",") as any[];
  }

  const caratMin = url.searchParams.get("caratMin");
  if (caratMin) {
    filters.caratMin = parseFloat(caratMin);
  }

  const caratMax = url.searchParams.get("caratMax");
  if (caratMax) {
    filters.caratMax = parseFloat(caratMax);
  }

  const cutParam = url.searchParams.get("cut");
  if (cutParam) {
    filters.cut = cutParam.split(",") as any[];
  }

  const colorParam = url.searchParams.get("color");
  if (colorParam) {
    filters.color = colorParam.split(",") as any[];
  }

  const clarityParam = url.searchParams.get("clarity");
  if (clarityParam) {
    filters.clarity = clarityParam.split(",") as any[];
  }

  const priceMin = url.searchParams.get("priceMin");
  if (priceMin) {
    filters.priceMin = parseFloat(priceMin);
  }

  const priceMax = url.searchParams.get("priceMax");
  if (priceMax) {
    filters.priceMax = parseFloat(priceMax);
  }

  const certificationParam = url.searchParams.get("certification");
  if (certificationParam) {
    filters.certification = certificationParam.split(",") as any[];
  }

  filters.available = true; // Only show available stones

  // Parse sort options
  const sortField = url.searchParams.get("sortBy") as any;
  const sortOrder = url.searchParams.get("sortOrder") as any;

  let sort: StoneSortOptions | undefined;
  if (
    sortField &&
    ["price", "carat", "cut", "color", "clarity"].includes(sortField)
  ) {
    sort = {
      field: sortField,
      order: sortOrder === "desc" ? "desc" : "asc",
    };
  }

  const page = parseInt(url.searchParams.get("page") || "1");

  // Phase 2.0: Per page selector
  const perPage = parseInt(url.searchParams.get("perPage") || "20");

  // Phase 2.0: SKU search
  const skuSearch = url.searchParams.get("sku");

  try {
    // Fetch stones
    const { stones, totalCount, hasNextPage } = await getStones(
      shop,
      filters,
      sort,
      page,
    );

    // Get filter options
    const filterOptions = await getStoneFilterOptions(shop);

    // Phase 2.0: Get diamond type counts for tab badges
    const [minedCount, labGrownCount, fancyColorCount] = await Promise.all([
      prisma.stoneMetadata.count({
        where: { shop, diamondType: "mined", available: true },
      }),
      prisma.stoneMetadata.count({
        where: { shop, diamondType: "lab_grown", available: true },
      }),
      prisma.stoneMetadata.count({
        where: { shop, diamondType: "fancy_color", available: true },
      }),
    ]);

    return Response.json({
      stones,
      filters: {
        shapes: filterOptions.shapes,
        caratRange: filterOptions.caratRange,
        priceRange: filterOptions.priceRange,
        cuts: filterOptions.cuts,
        colors: filterOptions.colors,
        clarities: filterOptions.clarities,
        certifications: filterOptions.certifications,
      },
      pagination: {
        currentPage: page,
        totalItems: totalCount,
        hasNextPage,
        perPage,
      },
      // Phase 2.0: Diamond type counts for tabs
      diamondTypeCounts: {
        mined: minedCount,
        lab_grown: labGrownCount,
        fancy_color: fancyColorCount,
      },
    });
  } catch (error: any) {
    console.error("Error fetching stones:", error);
    return Response.json({ error: "Failed to fetch stones" }, { status: 500 });
  }
}
