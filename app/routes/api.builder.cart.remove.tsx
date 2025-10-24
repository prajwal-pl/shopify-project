/**
 * Builder API: Remove from Cart
 *
 * Remove a configuration from cart (delete from database).
 */

import type { ActionFunctionArgs } from "react-router";
import prisma from "~/db.server";

export async function action({ request }: ActionFunctionArgs) {
  try {
    const formData = await request.formData();
    const configurationId = formData.get("configurationId") as string;
    const shop = formData.get("shop") as string;

    if (!configurationId || !shop) {
      return Response.json(
        { error: "Configuration ID and shop are required" },
        { status: 400 }
      );
    }

    console.log(`🗑️ Removing configuration: ${configurationId}`);

    // Delete the configuration
    const deleted = await prisma.configuration.delete({
      where: {
        id: configurationId,
        shop, // Ensure tenant isolation
      },
    });

    console.log(`✅ Successfully removed configuration: ${deleted.configurationId}`);

    return Response.json({
      success: true,
      message: "Item removed from cart",
    });
  } catch (error: any) {
    console.error("❌ Error removing from cart:", error);

    return Response.json(
      {
        error: error.message || "Failed to remove item from cart",
      },
      { status: 500 }
    );
  }
}
