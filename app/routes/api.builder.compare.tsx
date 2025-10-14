/**
 * Builder API: Diamond Comparison
 *
 * Phase 2.0: Compare multiple diamonds side-by-side.
 *
 * Features:
 * - Compare 2-4 diamonds
 * - Detect differences
 * - Calculate best value
 * - Return comparison data
 */

import type { ActionFunctionArgs } from "react-router";
import { getStone } from "~/services/product.server";
import { formatComparisonData } from "~/utils/comparison-helpers";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const shop = formData.get("shop") as string;
  const stoneIdsParam = formData.get("stoneIds") as string;

  if (!shop) {
    return Response.json(
      { success: false, error: "Shop parameter is required" },
      { status: 400 },
    );
  }

  if (!stoneIdsParam) {
    return Response.json(
      { success: false, error: "stoneIds parameter is required" },
      { status: 400 },
    );
  }

  try {
    // Parse stone IDs
    const stoneIds = JSON.parse(stoneIdsParam);

    if (!Array.isArray(stoneIds)) {
      return Response.json(
        { success: false, error: "stoneIds must be an array" },
        { status: 400 },
      );
    }

    if (stoneIds.length < 2) {
      return Response.json(
        { success: false, error: "At least 2 stones required for comparison" },
        { status: 400 },
      );
    }

    if (stoneIds.length > 4) {
      return Response.json(
        { success: false, error: "Maximum 4 stones can be compared" },
        { status: 400 },
      );
    }

    // Fetch all stones
    const stones = await Promise.all(
      stoneIds.map((id: string) => getStone(id, shop)),
    );

    // Filter out null results
    const validStones = stones.filter((s) => s !== null);

    if (validStones.length === 0) {
      return Response.json(
        { success: false, error: "No valid stones found" },
        { status: 404 },
      );
    }

    if (validStones.length !== stoneIds.length) {
      console.warn(
        `Some stones not found. Requested: ${stoneIds.length}, Found: ${validStones.length}`,
      );
    }

    // Generate comparison data
    const comparisonData = formatComparisonData(validStones);

    return Response.json({
      success: true,
      ...comparisonData,
    });
  } catch (error: any) {
    console.error("Error comparing stones:", error);
    return Response.json(
      {
        success: false,
        error: "Failed to compare stones",
        details: error.message,
      },
      { status: 500 },
    );
  }
}
