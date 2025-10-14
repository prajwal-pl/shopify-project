/**
 * Builder API: Save Configuration
 *
 * Phase 2.0: Save ring configuration with shareable URL.
 *
 * Features:
 * - Validates complete configuration
 * - Generates unique share token
 * - Saves to database with status: "saved"
 * - Returns shareable URL
 */

import type { ActionFunctionArgs } from "react-router";
import prisma from "~/db.server";
import {
  generateShareToken,
  generateShareUrl,
  generateConfigurationId,
} from "~/utils/share-helpers";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  // Parse configuration data
  const shop = formData.get("shop") as string;
  const settingId = formData.get("settingId") as string;
  const stoneId = formData.get("stoneId") as string;
  const metalType = formData.get("metalType") as string;
  const ringSize = formData.get("ringSize") as string;
  const totalPrice = parseFloat(formData.get("totalPrice") as string);

  // Optional fields
  const customerId = formData.get("customerId") as string | null;
  const customerEmail = formData.get("customerEmail") as string | null;
  const sideStonesConfig = formData.get("sideStonesConfig") as string | null;
  const settingPrice = parseFloat(formData.get("settingPrice") as string);
  const stonePrice = parseFloat(formData.get("stonePrice") as string);
  const sideStonesPrice = formData.get("sideStonesPrice")
    ? parseFloat(formData.get("sideStonesPrice") as string)
    : null;

  // Validate required fields
  if (
    !shop ||
    !settingId ||
    !stoneId ||
    !metalType ||
    !ringSize ||
    !totalPrice
  ) {
    return Response.json(
      {
        success: false,
        error: "Missing required fields",
      },
      { status: 400 },
    );
  }

  try {
    // Generate unique share token
    let shareToken = generateShareToken(8);
    let attempts = 0;
    const maxAttempts = 5;

    // Ensure token is unique
    while (attempts < maxAttempts) {
      const existing = await prisma.configuration.findFirst({
        where: { shareToken },
      });

      if (!existing) break;

      shareToken = generateShareToken(8);
      attempts++;
    }

    if (attempts === maxAttempts) {
      return Response.json(
        {
          success: false,
          error: "Failed to generate unique share token",
        },
        { status: 500 },
      );
    }

    // Generate configuration ID if not provided
    const configurationId = generateConfigurationId();

    // Save configuration
    const configuration = await prisma.configuration.create({
      data: {
        shop,
        customerId: customerId || undefined,
        customerEmail: customerEmail || undefined,
        settingId,
        stoneId,
        metalType,
        ringSize,
        sideStonesConfig: sideStonesConfig || undefined,
        settingPrice,
        stonePrice,
        sideStonesPrice,
        totalPrice,
        status: "in_progress",
        configurationId,
        shareToken,
        shareCount: 0,
        savedAt: new Date(),
      },
    });

    // Generate shareable URL
    const shareUrl = generateShareUrl(shop, shareToken);

    // Calculate expiration (90 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 90);

    return Response.json({
      success: true,
      configurationId: configuration.configurationId,
      shareToken,
      shareUrl,
      expiresAt: expiresAt.toISOString(),
    });
  } catch (error: any) {
    console.error("Error saving configuration:", error);
    return Response.json(
      {
        success: false,
        error: "Failed to save configuration",
        details: error.message,
      },
      { status: 500 },
    );
  }
}
