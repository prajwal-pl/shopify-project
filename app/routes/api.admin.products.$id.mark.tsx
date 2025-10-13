/**
 * Admin API: Mark Product as Setting/Stone
 *
 * Endpoint to mark a product as a ring setting or stone.
 */

import type { ActionFunctionArgs } from "react-router";
import { authenticate } from "~/shopify.server";
import prisma from "~/db.server";
import { validateShopifyGID } from "~/utils/validators";

export async function action({ request, params }: ActionFunctionArgs) {
  const { session } = await authenticate.admin(request);
  const { shop } = session;

  const productId = params.id;
  if (!productId) {
    return Response.json({ error: "Product ID is required" }, { status: 400 });
  }

  // Validate product ID
  try {
    validateShopifyGID(productId, "Product");
  } catch (error) {
    return Response.json({ error: "Invalid product ID" }, { status: 400 });
  }

  // Parse request body
  const formData = await request.formData();
  const type = formData.get("type") as string;

  if (!type || !["setting", "stone"].includes(type)) {
    return Response.json(
      { error: 'Type must be either "setting" or "stone"' },
      { status: 400 },
    );
  }

  try {
    if (type === "setting") {
      // Check if already marked as stone
      const existingStone = await prisma.stoneMetadata.findFirst({
        where: { productId, shop },
      });

      if (existingStone) {
        // Remove stone metadata
        await prisma.stoneMetadata.delete({
          where: { id: existingStone.id },
        });
      }

      // Create or update setting metadata
      const setting = await prisma.settingMetadata.upsert({
        where: {
          productId,
        },
        create: {
          shop,
          productId,
          style: "solitaire", // Default style
          compatibleShapes: JSON.stringify(["round"]), // Default shape
          basePrices: JSON.stringify({
            "14k_white_gold": 0,
            "14k_yellow_gold": 0,
            "18k_rose_gold": 0,
            platinum: 0,
          }),
        },
        update: {
          // Keep existing data if already exists
        },
      });

      return Response.json({
        success: true,
        type: "setting",
        metadata: setting,
      });
    } else {
      // type === "stone"
      // Check if already marked as setting
      const existingSetting = await prisma.settingMetadata.findFirst({
        where: { productId, shop },
      });

      if (existingSetting) {
        // Remove setting metadata
        await prisma.settingMetadata.delete({
          where: { id: existingSetting.id },
        });
      }

      // Create or update stone metadata
      const stone = await prisma.stoneMetadata.upsert({
        where: {
          productId,
        },
        create: {
          shop,
          productId,
          stoneType: "diamond",
          shape: "round",
          carat: 1.0,
          price: 0,
        },
        update: {
          // Keep existing data if already exists
        },
      });

      return Response.json({
        success: true,
        type: "stone",
        metadata: stone,
      });
    }
  } catch (error: any) {
    console.error("Error marking product:", error);
    return Response.json(
      { error: error.message || "Failed to mark product" },
      { status: 500 },
    );
  }
}
