/**
 * Builder API: Add to Cart
 *
 * Public endpoint for adding configured rings to Shopify cart.
 */

import type { ActionFunctionArgs } from "react-router";
import { createConfiguration } from "~/services/configuration.server";
import { validateConfigurationPrice } from "~/services/pricing.server";
import {
  getSettingByProductId,
  getStoneByProductId,
} from "~/services/product.server";
import {
  buildConfigurationLineItemProperties,
  validateConfigurationForCart,
} from "~/services/cart.server";
import {
  validateShopifyGID,
  validateRingSize,
  validateMetalType,
  ValidationError,
} from "~/utils/validators";
import type { MetalType, RingSize } from "~/utils/constants";
import type { SideStonesConfig } from "~/types/builder";

export async function action({ request }: ActionFunctionArgs) {
  try {
    const formData = await request.formData();

    // Parse configuration data
    const shop = formData.get("shop") as string;
    const settingId = formData.get("settingId") as string;
    const stoneId = formData.get("stoneId") as string;
    const metalType = formData.get("metalType") as string;
    const ringSize = formData.get("ringSize") as string;
    const customerEmail = formData.get("customerEmail") as string;
    const customerId = formData.get("customerId") as string;
    const totalPrice = parseFloat(formData.get("totalPrice") as string);

    // Parse side stones if provided
    const sideStonesData = formData.get("sideStones");
    let sideStonesConfig: SideStonesConfig | undefined;
    if (sideStonesData) {
      try {
        sideStonesConfig = JSON.parse(sideStonesData as string);
      } catch {
        return Response.json(
          { error: "Invalid side stones configuration" },
          { status: 400 },
        );
      }
    }

    // Validate required fields
    if (!shop) {
      return Response.json({ error: "Shop is required" }, { status: 400 });
    }

    if (!settingId || !stoneId) {
      return Response.json(
        { error: "Setting and stone selection required" },
        { status: 400 },
      );
    }

    if (!metalType || !ringSize) {
      return Response.json(
        { error: "Metal type and ring size are required" },
        { status: 400 },
      );
    }

    // Check if these are scraped products (special format: scraped:SKU)
    const isScrapedSetting = settingId.startsWith("scraped:");
    const isScrapedStone = stoneId.startsWith("scraped:");

    // Validate formats (skip Shopify GID validation for scraped products)
    try {
      if (!isScrapedSetting) {
        validateShopifyGID(settingId, "Product");
      }
      if (!isScrapedStone) {
        validateShopifyGID(stoneId, "Product");
      }
      validateMetalType(metalType);
      validateRingSize(ringSize);
    } catch (error: any) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    // Fetch setting and stone details (or create mock data for scraped products)
    let setting, stone;

    if (isScrapedSetting) {
      // Create mock setting for scraped product
      const sku = settingId.replace("scraped:", "");
      setting = {
        id: sku,
        productId: settingId,
        name: `Ring Setting ${sku}`,
        sku: sku,
        basePrices: {
          "14k_white_gold": 0,
          "14k_yellow_gold": 0,
          "14k_rose_gold": 0,
          "18k_white_gold": 0,
          "18k_yellow_gold": 0,
          "18k_rose_gold": 0,
          "platinum": 0,
        },
      };
    } else {
      setting = await getSettingByProductId(settingId, shop);
      if (!setting) {
        return Response.json({ error: "Setting not found" }, { status: 404 });
      }
    }

    if (isScrapedStone) {
      // Create mock stone for scraped product
      const sku = stoneId.replace("scraped:", "");
      stone = {
        id: sku,
        productId: stoneId,
        price: 0,
        available: true,
        carat: 0,
        shape: "round",
        color: "N/A",
        clarity: "N/A",
        certificate: "none",
        certificateNumber: "",
      };
    } else {
      stone = await getStoneByProductId(stoneId, shop);
      if (!stone) {
        return Response.json({ error: "Stone not found" }, { status: 404 });
      }
      // Check availability
      if (!stone.available) {
        return Response.json(
          { error: "Stone is no longer available" },
          { status: 400 },
        );
      }
    }

    console.log("=================================================");
    console.log("🛒 RING BUILDER - Add to Cart");
    console.log("   Shop:", shop);
    console.log("   Setting ID:", settingId);
    console.log("   Stone ID:", stoneId);
    console.log("   Metal Type:", metalType);
    console.log("   Ring Size:", ringSize);
    console.log("   Setting basePrices:", setting.basePrices);
    console.log("   Setting basePrices type:", typeof setting.basePrices);

    // Calculate and validate price on backend
    // Parse basePrices if it's a string
    let basePrices = setting.basePrices;
    if (typeof basePrices === "string") {
      try {
        basePrices = JSON.parse(basePrices);
        console.log("   Parsed basePrices:", basePrices);
      } catch (error) {
        console.error("❌ Failed to parse basePrices:", error);
        return Response.json(
          { error: "Invalid setting price configuration" },
          { status: 500 },
        );
      }
    }

    // Try to get price - handle different key formats
    let settingPrice = basePrices[metalType as MetalType];

    console.log("   Looking for price with key:", metalType);
    console.log("   All available keys:", Object.keys(basePrices));
    console.log("   Setting Price found:", settingPrice);

    if (!settingPrice && settingPrice !== 0) {
      console.error("❌ Price not found for metal type:", metalType);
      console.error(
        "   Full basePrices object:",
        JSON.stringify(basePrices, null, 2),
      );
      return Response.json(
        {
          error: `Price not found for metal type "${metalType}". Available: ${Object.keys(basePrices).join(", ")}`,
          debug: {
            requestedMetalType: metalType,
            availableKeys: Object.keys(basePrices),
            basePricesData: basePrices,
          },
        },
        { status: 400 },
      );
    }

    console.log("✅ Setting price:", settingPrice);

    const stonePrice = stone.price;
    let sideStonesPrice = 0;

    if (sideStonesConfig && sideStonesConfig.quantity > 0) {
      sideStonesPrice = sideStonesConfig.price;
    }

    // Calculate total (without markup for now - will add in future)
    const calculatedTotal = settingPrice + stonePrice + sideStonesPrice;

    // Validate price (allow small rounding differences)
    const priceDifference = Math.abs(calculatedTotal - totalPrice);
    if (priceDifference > 0.02) {
      console.warn(
        `Price mismatch: calculated ${calculatedTotal}, received ${totalPrice}`,
      );
      // Use backend calculation
    }

    // Create configuration record
    const configuration = await createConfiguration(
      {
        customerId: customerId || undefined,
        customerEmail: customerEmail || undefined,
        settingId,
        stoneId,
        metalType: metalType as MetalType,
        ringSize: ringSize as RingSize,
        sideStonesConfig,
        settingPrice,
        stonePrice,
        sideStonesPrice,
        totalPrice: calculatedTotal,
        status: "completed",
      },
      shop,
    );

    // Build line item properties for Shopify cart
    const properties = buildConfigurationLineItemProperties(
      {
        configurationId: configuration.configurationId,
        metalType: metalType as MetalType,
        ringSize: ringSize as RingSize,
        sideStonesConfig: sideStonesConfig
          ? JSON.stringify(sideStonesConfig)
          : null,
      },
      {
        name: setting.name || "Custom Ring Setting",
        sku: setting.sku || "SETTING",
      },
      {
        carat: stone.carat,
        shape: stone.shape,
        color: stone.color,
        clarity: stone.clarity,
        certificate: stone.certificate,
        certificateNumber: stone.certificateNumber,
        sku: "STONE",
      },
    );

    // For MVP, we'll return the cart data
    // The frontend will handle actual Shopify Ajax Cart API call
    // This keeps the API simple and works with theme extensions

    return Response.json({
      success: true,
      configurationId: configuration.configurationId,
      isScrapedProduct: isScrapedSetting || isScrapedStone,
      cartData: {
        id: settingId, // Use setting product ID
        quantity: 1,
        properties,
      },
      redirectUrl: "/cart",
    });
  } catch (error: any) {
    console.error("Error adding to cart:", error);

    if (error instanceof ValidationError) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    return Response.json(
      { error: "Failed to add to cart. Please try again." },
      { status: 500 },
    );
  }
}
