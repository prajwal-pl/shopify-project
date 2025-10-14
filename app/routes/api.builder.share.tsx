/**
 * Builder API: Share Configuration
 *
 * Phase 2.0: Share configuration via email or track social shares.
 *
 * Features:
 * - Email sharing
 * - Social share tracking
 * - Increments share count
 */

import type { ActionFunctionArgs } from "react-router";
import prisma from "~/db.server";
import { sendShareEmail } from "~/services/email.server";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const shop = formData.get("shop") as string;
  const configurationId = formData.get("configurationId") as string;
  const shareMethod = formData.get("method") as string; // "email" | "facebook" | "twitter" | "pinterest"

  if (!shop || !configurationId) {
    return Response.json(
      { success: false, error: "Missing required parameters" },
      { status: 400 },
    );
  }

  try {
    // Find configuration
    const configuration = await prisma.configuration.findFirst({
      where: {
        shop,
        configurationId,
      },
    });

    if (!configuration) {
      return Response.json(
        { success: false, error: "Configuration not found" },
        { status: 404 },
      );
    }

    // Handle email share
    if (shareMethod === "email") {
      const recipientEmail = formData.get("recipientEmail") as string;
      const senderName = formData.get("senderName") as string;
      const message = formData.get("message") as string;

      if (!recipientEmail || !senderName) {
        return Response.json(
          { success: false, error: "Missing email or sender name" },
          { status: 400 },
        );
      }

      // Fetch setting and stone details
      const [setting, stone] = await Promise.all([
        prisma.settingMetadata.findFirst({
          where: { shop, productId: configuration.settingId },
        }),
        prisma.stoneMetadata.findFirst({
          where: { shop, productId: configuration.stoneId },
        }),
      ]);

      // Generate share URL
      const shareUrl = configuration.shareToken
        ? `https://${shop}/a/ring-builder/saved/${configuration.shareToken}`
        : `https://${shop}/builder?config=${configurationId}`;

      // Send email
      const emailResult = await sendShareEmail(
        recipientEmail,
        senderName,
        message || "",
        shareUrl,
        {
          settingName: "Ring Setting", // TODO: Get actual setting name from Shopify
          stoneCarat: stone?.carat || 1.0,
          stoneShape: stone?.shape || "round",
          metalType: configuration.metalType,
          totalPrice: configuration.totalPrice,
        },
      );

      if (!emailResult.success) {
        return Response.json(
          { success: false, error: "Failed to send email" },
          { status: 500 },
        );
      }
    }

    // Increment share count for all share methods
    await prisma.configuration.update({
      where: { id: configuration.id },
      data: {
        shareCount: {
          increment: 1,
        },
      },
    });

    // Log share event (analytics)
    await prisma.analyticsEvent.create({
      data: {
        shop,
        eventType: "configuration_shared",
        configurationId,
        eventData: JSON.stringify({
          method: shareMethod,
        }),
      },
    });

    return Response.json({
      success: true,
      message: "Configuration shared successfully",
      shareMethod,
    });
  } catch (error: any) {
    console.error("Error sharing configuration:", error);
    return Response.json(
      {
        success: false,
        error: "Failed to share configuration",
        details: error.message,
      },
      { status: 500 },
    );
  }
}
