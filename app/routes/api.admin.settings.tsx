/**
 * Admin API: App Settings
 *
 * Get and update Ring Builder configuration settings.
 */

import type { LoaderFunctionArgs, ActionFunctionArgs } from "react-router";
import { authenticate } from "~/shopify.server";
import prisma from "~/db.server";
import { validateMarkupPercent, ValidationError } from "~/utils/validators";

// GET: Fetch settings
export async function loader({ request }: LoaderFunctionArgs) {
  const { session } = await authenticate.admin(request);
  const { shop } = session;

  // Get or create settings
  let settings = await prisma.appSettings.findUnique({
    where: { shop },
  });

  // Create default settings if not found
  if (!settings) {
    settings = await prisma.appSettings.create({
      data: {
        shop,
        builderEnabled: true,
        markupPercent: 0,
        notifyOnConfig: false,
      },
    });
  }

  // Parse JSON fields
  const sideStones = settings.sideStones
    ? JSON.parse(settings.sideStones)
    : {
        enabled: false,
        qualities: [],
        pricing: {},
        minQuantity: 0,
        maxQuantity: 50,
      };

  return Response.json({
    id: settings.id,
    shop: settings.shop,
    builderEnabled: settings.builderEnabled,
    sideStones,
    markupPercent: settings.markupPercent,
    notifyOnConfig: settings.notifyOnConfig,
    notificationEmail: settings.notificationEmail,
    primaryColor: settings.primaryColor,
    accentColor: settings.accentColor,
  });
}

// PUT: Update settings
export async function action({ request }: ActionFunctionArgs) {
  const { session } = await authenticate.admin(request);
  const { shop } = session;

  const formData = await request.formData();

  try {
    // Parse form data
    const builderEnabled = formData.get("builderEnabled") === "true";
    const markupPercent = parseFloat(formData.get("markupPercent") as string);
    const notifyOnConfig = formData.get("notifyOnConfig") === "true";
    const notificationEmail = formData.get("notificationEmail") as string;
    const primaryColor = formData.get("primaryColor") as string;
    const accentColor = formData.get("accentColor") as string;

    // Parse side stones config
    const sideStones = formData.get("sideStones")
      ? JSON.parse(formData.get("sideStones") as string)
      : null;

    // Validate markup percentage
    if (!isNaN(markupPercent)) {
      validateMarkupPercent(markupPercent);
    }

    // Validate side stones config
    if (sideStones?.enabled) {
      if (
        !Array.isArray(sideStones.qualities) ||
        sideStones.qualities.length === 0
      ) {
        throw new ValidationError(
          "At least one side stone quality is required when side stones are enabled",
        );
      }

      if (sideStones.minQuantity < 0) {
        throw new ValidationError("Minimum quantity cannot be negative");
      }

      if (sideStones.maxQuantity < sideStones.minQuantity) {
        throw new ValidationError(
          "Maximum quantity must be greater than minimum",
        );
      }

      // Validate pricing for each quality
      for (const quality of sideStones.qualities) {
        const price = sideStones.pricing[quality];
        if (price === undefined || price < 0) {
          throw new ValidationError(
            `Price for quality "${quality}" must be a positive number`,
          );
        }
      }
    }

    // Update or create settings
    const updated = await prisma.appSettings.upsert({
      where: { shop },
      create: {
        shop,
        builderEnabled,
        markupPercent: isNaN(markupPercent) ? 0 : markupPercent,
        sideStones: sideStones ? JSON.stringify(sideStones) : null,
        notifyOnConfig,
        notificationEmail: notificationEmail || null,
        primaryColor: primaryColor || null,
        accentColor: accentColor || null,
      },
      update: {
        builderEnabled,
        markupPercent: isNaN(markupPercent) ? 0 : markupPercent,
        sideStones: sideStones ? JSON.stringify(sideStones) : null,
        notifyOnConfig,
        notificationEmail: notificationEmail || null,
        primaryColor: primaryColor || null,
        accentColor: accentColor || null,
      },
    });

    // Return parsed response
    const responseSideStones = updated.sideStones
      ? JSON.parse(updated.sideStones)
      : null;

    return Response.json({
      success: true,
      settings: {
        id: updated.id,
        shop: updated.shop,
        builderEnabled: updated.builderEnabled,
        sideStones: responseSideStones,
        markupPercent: updated.markupPercent,
        notifyOnConfig: updated.notifyOnConfig,
        notificationEmail: updated.notificationEmail,
        primaryColor: updated.primaryColor,
        accentColor: updated.accentColor,
      },
    });
  } catch (error: any) {
    if (error instanceof ValidationError) {
      return Response.json({ error: error.message }, { status: 400 });
    }
    console.error("Error updating settings:", error);
    return Response.json(
      { error: "Failed to update settings" },
      { status: 500 },
    );
  }
}
