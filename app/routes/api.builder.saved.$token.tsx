/**
 * Builder API: Load Saved Configuration
 *
 * Phase 2.0: Load a saved configuration by share token.
 *
 * Features:
 * - Validates share token
 * - Fetches configuration from database
 * - Fetches full setting and stone data
 * - Recalculates prices (in case changed)
 * - Increments view count
 * - Handles expired/invalid tokens
 */

import type { LoaderFunctionArgs } from "react-router";
import prisma from "~/db.server";
import { validateShareToken } from "~/utils/share-helpers";
import {
  getStoneByProductId,
  getSettingByProductId,
} from "~/services/product.server";
import { calculateTotalPrice } from "~/services/pricing.server";

export async function loader({ params, request }: LoaderFunctionArgs) {
  const token = params.token;
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop");

  if (!token || !shop) {
    return Response.json(
      { success: false, error: "Missing token or shop parameter" },
      { status: 400 },
    );
  }

  // Validate token format
  if (!validateShareToken(token)) {
    return Response.json(
      { success: false, error: "Invalid share token format" },
      { status: 400 },
    );
  }

  try {
    // Find configuration by share token
    const configuration = await prisma.configuration.findFirst({
      where: {
        shop,
        shareToken: token,
      },
    });

    if (!configuration) {
      return Response.json(
        { success: false, error: "Configuration not found" },
        { status: 404 },
      );
    }

    // Check if expired (90 days from savedAt)
    if (configuration.savedAt) {
      const expirationDate = new Date(configuration.savedAt);
      expirationDate.setDate(expirationDate.getDate() + 90);

      if (new Date() > expirationDate) {
        return Response.json(
          { success: false, error: "Configuration has expired" },
          { status: 410 }, // 410 Gone
        );
      }
    }

    // Fetch full setting and stone data
    const [setting, stone] = await Promise.all([
      getSettingByProductId(configuration.settingId, shop),
      getStoneByProductId(configuration.stoneId, shop),
    ]);

    if (!setting || !stone) {
      return Response.json(
        {
          success: false,
          error: "Configuration products not found (may have been deleted)",
        },
        { status: 404 },
      );
    }

    // Recalculate price (in case prices changed)
    const priceBreakdown = await calculateTotalPrice({
      settingId: configuration.settingId,
      metalType: configuration.metalType as any,
      stoneId: configuration.stoneId,
      sideStones: configuration.sideStonesConfig
        ? JSON.parse(configuration.sideStonesConfig)
        : undefined,
      shop,
    });

    // Increment share count (view tracking)
    await prisma.configuration.update({
      where: { id: configuration.id },
      data: {
        shareCount: {
          increment: 1,
        },
      },
    });

    return Response.json({
      success: true,
      configuration: {
        configurationId: configuration.configurationId,
        settingId: configuration.settingId,
        stoneId: configuration.stoneId,
        metalType: configuration.metalType,
        ringSize: configuration.ringSize,
        sideStonesConfig: configuration.sideStonesConfig
          ? JSON.parse(configuration.sideStonesConfig)
          : null,
        totalPrice: configuration.totalPrice,
        currentPrice: priceBreakdown.total, // Recalculated price
        priceChanged: priceBreakdown.total !== configuration.totalPrice,
        createdAt: configuration.createdAt,
        savedAt: configuration.savedAt,
        shareCount: configuration.shareCount + 1, // Incremented
      },
      setting,
      stone,
    });
  } catch (error: any) {
    console.error("Error loading saved configuration:", error);
    return Response.json(
      {
        success: false,
        error: "Failed to load configuration",
        details: error.message,
      },
      { status: 500 },
    );
  }
}
