/**
 * Admin API: Manual Metafields Sync
 *
 * Phase 2.0: Manually trigger sync from database to Shopify metafields
 * or from Shopify metafields to database.
 *
 * Use cases:
 * - After Phase 1.0 → 2.0 migration
 * - When metafields get out of sync
 * - For bulk operations
 */

import type { LoaderFunctionArgs } from "react-router";
import { authenticate } from "~/shopify.server";
import prisma from "~/db.server";
import {
  writeSettingMetafields,
  writeDiamondMetafields,
  readProductMetafields,
  parseDiamondMetafields,
  parseSettingMetafields,
} from "~/services/metafields.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const { admin, session } = await authenticate.admin(request);
  const { shop } = session;

  const url = new URL(request.url);
  const direction = url.searchParams.get("direction") || "to_shopify";
  const limit = parseInt(url.searchParams.get("limit") || "50");

  console.log("=================================================");
  console.log("🔄 MANUAL METAFIELDS SYNC");
  console.log(`📍 Shop: ${shop}`);
  console.log(`📊 Direction: ${direction}`);
  console.log(`📦 Limit: ${limit}`);
  console.log("=================================================");

  try {
    if (direction === "to_shopify") {
      return await syncToShopify(admin, shop, limit);
    } else if (direction === "from_shopify") {
      return await syncFromShopify(admin, shop, limit);
    } else {
      return Response.json(
        {
          success: false,
          error: "Invalid direction. Use 'to_shopify' or 'from_shopify'",
        },
        { status: 400 },
      );
    }
  } catch (error: any) {
    console.error("❌ Error during sync:", error);
    return Response.json(
      {
        success: false,
        error: "Sync failed",
        details: error.message,
      },
      { status: 500 },
    );
  }
}

/**
 * Sync data from app database to Shopify metafields
 */
async function syncToShopify(admin: any, shop: string, limit: number) {
  const syncResults = {
    stonesProcessed: 0,
    stonesSuccess: 0,
    stonesFailed: 0,
    settingsProcessed: 0,
    settingsSuccess: 0,
    settingsFailed: 0,
    errors: [] as string[],
  };

  // Sync stones
  const stones = await prisma.stoneMetadata.findMany({
    where: { shop },
    take: limit,
  });

  for (const stone of stones) {
    syncResults.stonesProcessed++;

    try {
      const result = await writeDiamondMetafields(admin, stone.productId, {
        type: stone.stoneType === "diamond" ? "diamond" : "gemstone",
        shape: stone.shape as any,
        carat: stone.carat,
        diamond_type: stone.diamondType as any,
        cut: (stone.cut || undefined) as any,
        color: (stone.color || undefined) as any,
        clarity: (stone.clarity || undefined) as any,
        certificate: (stone.certificate || undefined) as any,
        certificate_number: stone.certificateNumber || undefined,
        certificate_url: stone.certificateUrl || undefined,
        measurements: stone.measurements || undefined,
        table_percent: stone.tablePercent || undefined,
        depth_percent: stone.depthPercent || undefined,
        polish: stone.polish || undefined,
        symmetry: stone.symmetry || undefined,
        fluorescence: stone.fluorescence || undefined,
      });

      if (result.success) {
        syncResults.stonesSuccess++;
      } else {
        syncResults.stonesFailed++;
        syncResults.errors.push(
          `Stone ${stone.productId}: ${result.errors.join(", ")}`,
        );
      }
    } catch (error: any) {
      syncResults.stonesFailed++;
      syncResults.errors.push(`Stone ${stone.productId}: ${error.message}`);
    }
  }

  // Sync settings
  const settings = await prisma.settingMetadata.findMany({
    where: { shop },
    take: limit,
  });

  for (const setting of settings) {
    syncResults.settingsProcessed++;

    try {
      const compatibleShapes = JSON.parse(setting.compatibleShapes);
      const basePrices = JSON.parse(setting.basePrices);

      const result = await writeSettingMetafields(admin, setting.productId, {
        type: "setting",
        style: setting.style as any,
        compatible_shapes: compatibleShapes as any,
        metal_prices: basePrices,
        setting_height: (setting.settingHeight || undefined) as any,
      });

      if (result.success) {
        syncResults.settingsSuccess++;
      } else {
        syncResults.settingsFailed++;
        syncResults.errors.push(
          `Setting ${setting.productId}: ${result.errors.join(", ")}`,
        );
      }
    } catch (error: any) {
      syncResults.settingsFailed++;
      syncResults.errors.push(`Setting ${setting.productId}: ${error.message}`);
    }
  }

  console.log("✅ Sync to Shopify complete:");
  console.log(
    `  Stones: ${syncResults.stonesSuccess}/${syncResults.stonesProcessed} success`,
  );
  console.log(
    `  Settings: ${syncResults.settingsSuccess}/${syncResults.settingsProcessed} success`,
  );

  return Response.json({
    success: syncResults.stonesFailed === 0 && syncResults.settingsFailed === 0,
    direction: "to_shopify",
    ...syncResults,
  });
}

/**
 * Sync data from Shopify metafields to app database
 */
async function syncFromShopify(admin: any, shop: string, limit: number) {
  const syncResults = {
    productsProcessed: 0,
    productsSuccess: 0,
    productsFailed: 0,
    errors: [] as string[],
  };

  // Get all products with ring builder metadata
  const allMetadata = await prisma.stoneMetadata.findMany({
    where: { shop },
    select: { productId: true },
    take: limit,
  });

  const settingMetadata = await prisma.settingMetadata.findMany({
    where: { shop },
    select: { productId: true },
    take: limit,
  });

  const allProductIds = [
    ...allMetadata.map((m) => m.productId),
    ...settingMetadata.map((m) => m.productId),
  ];

  for (const productId of allProductIds) {
    syncResults.productsProcessed++;

    try {
      const metafields = await readProductMetafields(admin, productId);

      if (metafields.length === 0) {
        continue; // No metafields to sync
      }

      // Determine if this is a stone or setting based on "type" metafield
      const typeMetafield = metafields.find((m) => m.key === "type");

      if (typeMetafield?.value === "setting") {
        const parsed = parseSettingMetafields(metafields);

        await prisma.settingMetadata.update({
          where: { productId },
          data: {
            style: parsed.style || "solitaire",
            settingHeight: parsed.setting_height || null,
            compatibleShapes: JSON.stringify(parsed.compatible_shapes || []),
            basePrices: JSON.stringify(parsed.metal_prices || {}),
          },
        });
      } else if (
        typeMetafield?.value === "diamond" ||
        typeMetafield?.value === "gemstone"
      ) {
        const parsed = parseDiamondMetafields(metafields);

        await prisma.stoneMetadata.update({
          where: { productId },
          data: {
            stoneType: parsed.type === "diamond" ? "diamond" : "gemstone",
            shape: parsed.shape || "round",
            carat: parsed.carat || 1.0,
            diamondType: parsed.diamond_type || "mined",
            cut: parsed.cut || null,
            color: parsed.color || null,
            clarity: parsed.clarity || null,
            certificate: parsed.certificate || null,
            certificateNumber: parsed.certificate_number || null,
            certificateUrl: parsed.certificate_url || null,
            measurements: parsed.measurements || null,
            tablePercent: parsed.table_percent || null,
            depthPercent: parsed.depth_percent || null,
            polish: parsed.polish || null,
            symmetry: parsed.symmetry || null,
            fluorescence: parsed.fluorescence || null,
          },
        });
      }

      syncResults.productsSuccess++;
    } catch (error: any) {
      syncResults.productsFailed++;
      syncResults.errors.push(`Product ${productId}: ${error.message}`);
    }
  }

  console.log("✅ Sync from Shopify complete:");
  console.log(
    `  Products: ${syncResults.productsSuccess}/${syncResults.productsProcessed} success`,
  );

  return Response.json({
    success: syncResults.productsFailed === 0,
    direction: "from_shopify",
    ...syncResults,
  });
}
