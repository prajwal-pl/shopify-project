/**
 * Admin API: Update Product Metadata
 *
 * Phase 2.0: Endpoint to update setting or stone metadata.
 * Now writes to BOTH Shopify metafields (source of truth) and app database (cache).
 */

import type { ActionFunctionArgs } from "react-router";
import { authenticate } from "~/shopify.server";
import prisma from "~/db.server";
import {
  validatePrice,
  validateCarat,
  validateShopifyGID,
  ValidationError,
} from "~/utils/validators";
import {
  writeSettingMetafields,
  writeDiamondMetafields,
} from "~/services/metafields.server";

export async function action({ request, params }: ActionFunctionArgs) {
  const { admin, session } = await authenticate.admin(request);
  const { shop } = session;

  const productId = params.id;
  if (!productId) {
    return Response.json({ error: "Product ID is required" }, { status: 400 });
  }

  try {
    validateShopifyGID(productId, "Product");
  } catch (error) {
    return Response.json({ error: "Invalid product ID" }, { status: 400 });
  }

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
      return await updateSettingMetadata(admin, productId, shop, formData);
    } else {
      return await updateStoneMetadata(admin, productId, shop, formData);
    }
  } catch (error: any) {
    if (error instanceof ValidationError) {
      return Response.json({ error: error.message }, { status: 400 });
    }
    console.error("Error updating metadata:", error);
    return Response.json(
      { error: "Failed to update metadata" },
      { status: 500 },
    );
  }
}

async function updateSettingMetadata(
  admin: any,
  productId: string,
  shop: string,
  formData: FormData,
) {
  // Parse form data
  const style = formData.get("style") as string;
  const settingHeight = formData.get("settingHeight") as string;
  const compatibleShapes = formData.get("compatibleShapes") as string;
  const basePrices = formData.get("basePrices") as string;
  const featured = formData.get("featured") === "true";

  // Validate required fields
  if (!style) {
    throw new ValidationError("Style is required");
  }

  // Parse and validate prices
  const prices = JSON.parse(basePrices || "{}");
  for (const [metal, price] of Object.entries(prices)) {
    validatePrice(Number(price));
  }

  // Parse compatible shapes
  const shapes = JSON.parse(compatibleShapes || "[]");
  if (!Array.isArray(shapes) || shapes.length === 0) {
    throw new ValidationError("At least one compatible shape is required");
  }

  // Phase 2.0: Write to Shopify metafields (source of truth)
  const metafieldsResult = await writeSettingMetafields(admin, productId, {
    type: "setting",
    style: style as any, // Validated above
    compatible_shapes: shapes as any,
    metal_prices: prices,
    setting_height: (settingHeight || undefined) as any,
  });

  if (!metafieldsResult.success) {
    console.error(
      "Warning: Failed to write some metafields:",
      metafieldsResult.errors,
    );
    // Continue anyway - metafields will sync later via webhook
  }

  // Update app database (cache)
  const metadata = await prisma.settingMetadata.upsert({
    where: { productId },
    create: {
      shop,
      productId,
      style,
      settingHeight: settingHeight || null,
      compatibleShapes: JSON.stringify(shapes),
      basePrices: JSON.stringify(prices),
      featured,
    },
    update: {
      style,
      settingHeight: settingHeight || null,
      compatibleShapes: JSON.stringify(shapes),
      basePrices: JSON.stringify(prices),
      featured,
    },
  });

  return Response.json({
    success: true,
    type: "setting",
    metadata,
    metafieldsWritten: metafieldsResult.success,
  });
}

async function updateStoneMetadata(
  admin: any,
  productId: string,
  shop: string,
  formData: FormData,
) {
  // Parse form data
  const stoneType = formData.get("stoneType") as string;
  const shape = formData.get("shape") as string;
  const carat = parseFloat(formData.get("carat") as string);
  const cut = formData.get("cut") as string;
  const color = formData.get("color") as string;
  const clarity = formData.get("clarity") as string;
  const price = parseFloat(formData.get("price") as string);

  // Phase 2.0: Diamond type (mined/lab_grown/fancy_color)
  const diamondType = (formData.get("diamondType") as string) || "mined";

  const certificate = formData.get("certificate") as string;
  const certificateNumber = formData.get("certificateNumber") as string;
  const certificateUrl = formData.get("certificateUrl") as string;

  const measurements = formData.get("measurements") as string;
  const tablePercent = formData.get("tablePercent")
    ? parseFloat(formData.get("tablePercent") as string)
    : null;
  const depthPercent = formData.get("depthPercent")
    ? parseFloat(formData.get("depthPercent") as string)
    : null;

  const polish = formData.get("polish") as string;
  const symmetry = formData.get("symmetry") as string;
  const fluorescence = formData.get("fluorescence") as string;
  const available = formData.get("available") !== "false";

  // Validate required fields
  if (!stoneType) {
    throw new ValidationError("Stone type is required");
  }
  if (!shape) {
    throw new ValidationError("Shape is required");
  }
  if (isNaN(carat)) {
    throw new ValidationError("Carat is required and must be a number");
  }
  if (isNaN(price)) {
    throw new ValidationError("Price is required and must be a number");
  }

  // Validate values
  validateCarat(carat);
  validatePrice(price);

  // Validate diamond type
  if (!["mined", "lab_grown", "fancy_color"].includes(diamondType)) {
    throw new ValidationError(
      "Diamond type must be one of: mined, lab_grown, fancy_color",
    );
  }

  // Phase 2.0: Write to Shopify metafields (source of truth)
  const metafieldsResult = await writeDiamondMetafields(admin, productId, {
    type: stoneType === "diamond" ? "diamond" : "gemstone",
    shape: shape as any, // Validated above
    carat,
    diamond_type: diamondType as any, // Validated above
    cut: (cut || undefined) as any,
    color: (color || undefined) as any,
    clarity: (clarity || undefined) as any,
    certificate: (certificate || undefined) as any,
    certificate_number: certificateNumber || undefined,
    certificate_url: certificateUrl || undefined,
    measurements: measurements || undefined,
    table_percent: tablePercent || undefined,
    depth_percent: depthPercent || undefined,
    polish: polish || undefined,
    symmetry: symmetry || undefined,
    fluorescence: fluorescence || undefined,
  });

  if (!metafieldsResult.success) {
    console.error(
      "Warning: Failed to write some metafields:",
      metafieldsResult.errors,
    );
    // Continue anyway - metafields will sync later via webhook
  }

  // Update app database (cache)
  const metadata = await prisma.stoneMetadata.upsert({
    where: { productId },
    create: {
      shop,
      productId,
      stoneType,
      shape,
      carat,
      cut: cut || null,
      color: color || null,
      clarity: clarity || null,
      diamondType, // Phase 2.0
      price,
      certificate: certificate || null,
      certificateNumber: certificateNumber || null,
      certificateUrl: certificateUrl || null,
      measurements: measurements || null,
      tablePercent,
      depthPercent,
      polish: polish || null,
      symmetry: symmetry || null,
      fluorescence: fluorescence || null,
      available,
    },
    update: {
      stoneType,
      shape,
      carat,
      cut: cut || null,
      color: color || null,
      clarity: clarity || null,
      diamondType, // Phase 2.0
      price,
      certificate: certificate || null,
      certificateNumber: certificateNumber || null,
      certificateUrl: certificateUrl || null,
      measurements: measurements || null,
      tablePercent,
      depthPercent,
      polish: polish || null,
      symmetry: symmetry || null,
      fluorescence: fluorescence || null,
      available,
    },
  });

  return Response.json({
    success: true,
    type: "stone",
    metadata,
    metafieldsWritten: metafieldsResult.success,
  });
}
