/**
 * Builder API: Get Cart
 *
 * Fetch cart contents from database (saved configurations).
 * In development/admin: Shows saved configurations
 * On storefront: Merges with Shopify cart data
 */

import type { LoaderFunctionArgs } from "react-router";
import prisma from "~/db.server";
import { getSettingByProductId, getStoneByProductId } from "~/services/product.server";

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const url = new URL(request.url);
    const shop = url.searchParams.get("shop");
    const customerId = url.searchParams.get("customerId");

    if (!shop) {
      return Response.json({ error: "Shop is required" }, { status: 400 });
    }

    const isAdminContext =
      request.headers.get("referer")?.includes("admin.shopify.com") ||
      request.headers.get("referer")?.includes("/app/builder") ||
      request.headers.get("referer")?.includes("localhost");

    // Fetch saved configurations from database (last 24 hours, completed status)
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const configurations = await prisma.configuration.findMany({
      where: {
        shop,
        status: "completed",
        createdAt: {
          gte: twentyFourHoursAgo,
        },
        ...(customerId && { customerId }),
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
    });

    console.log(`📦 Found ${configurations.length} configurations for cart`);

    // Enrich configurations with product details
    const items = await Promise.all(
      configurations.map(async (config) => {
        // Check if scraped product
        const isScrapedSetting = config.settingId.startsWith("scraped:");
        const isScrapedStone = config.stoneId.startsWith("scraped:");

        let settingTitle = "Ring Setting";
        let stoneTitle = "Diamond";
        let stoneDetails: any = {};

        // Get setting details
        if (!isScrapedSetting) {
          try {
            const setting = await getSettingByProductId(config.settingId, shop);
            if (setting) {
              settingTitle = setting.name || "Ring Setting";
            }
          } catch (error) {
            console.error("Error fetching setting:", error);
          }
        } else {
          settingTitle = `Sample Setting ${config.settingId.replace("scraped:", "")}`;
        }

        // Get stone details
        if (!isScrapedStone) {
          try {
            const stone = await getStoneByProductId(config.stoneId, shop);
            if (stone) {
              stoneDetails = {
                carat: stone.carat,
                shape: stone.shape,
                color: stone.color,
                clarity: stone.clarity,
                certificate: stone.certificate,
              };
              stoneTitle = `${stone.carat}ct ${stone.shape} Diamond`;
            }
          } catch (error) {
            console.error("Error fetching stone:", error);
          }
        } else {
          stoneDetails = {
            carat: 1.0,
            shape: "Round",
            color: "G",
            clarity: "VS2",
          };
          stoneTitle = "Sample Diamond";
        }

        // Parse side stones if present
        let sideStonesData = null;
        if (config.sideStonesConfig) {
          try {
            sideStonesData = JSON.parse(config.sideStonesConfig);
          } catch (e) {
            console.error("Error parsing side stones:", e);
          }
        }

        // Build cart item
        return {
          id: config.id,
          configuration_id: config.configurationId,
          variant_id: 0, // Not used for database items
          product_id: config.settingId,
          title: `${settingTitle} with ${stoneTitle}`,
          price: Math.round(config.totalPrice * 100), // Convert to cents
          quantity: 1,
          properties: {
            "Configuration ID": config.configurationId,
            "Metal Type": config.metalType.replace(/_/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase()),
            "Ring Size": config.ringSize,
            "Stone Carat": stoneDetails.carat?.toString() || "",
            "Stone Shape": stoneDetails.shape || "",
            "Stone Color": stoneDetails.color || "",
            "Stone Clarity": stoneDetails.clarity || "",
            ...(sideStonesData && {
              "Side Stones": `${sideStonesData.quantity} stones`,
            }),
          },
          image: null,
          vendor: "Ring Builder",
          line_price: Math.round(config.totalPrice * 100),
          is_from_database: true,
          created_at: config.createdAt.toISOString(),
        };
      })
    );

    // Calculate total
    const total_price = items.reduce((sum, item) => sum + item.price, 0);

    console.log(`✅ Returning ${items.length} cart items (total: $${total_price / 100})`);

    return Response.json({
      items,
      item_count: items.length,
      total_price,
      currency: "USD",
      isAdminContext,
      configurations: true, // Flag to indicate these are from database
    });
  } catch (error: any) {
    console.error("❌ Error fetching cart:", error);

    return Response.json({
      items: [],
      item_count: 0,
      total_price: 0,
      currency: "USD",
      error: error.message || "Failed to fetch cart",
    });
  }
}
