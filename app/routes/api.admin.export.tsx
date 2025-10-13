/**
 * Admin API: CSV Export
 *
 * Export settings or stones to CSV format.
 */

import type { LoaderFunctionArgs } from "react-router";
import { authenticate } from "~/shopify.server";
import prisma from "~/db.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const { session } = await authenticate.admin(request);
  const { shop } = session;

  const url = new URL(request.url);
  const type = url.searchParams.get("type") || "stones";

  let csv = "";

  if (type === "stones") {
    // Export stones
    const stones = await prisma.stoneMetadata.findMany({
      where: { shop },
      orderBy: { createdAt: "desc" },
    });

    // CSV header
    csv = [
      "productId",
      "stoneType",
      "shape",
      "carat",
      "cut",
      "color",
      "clarity",
      "price",
      "certificate",
      "certificateNumber",
      "certificateUrl",
      "measurements",
      "tablePercent",
      "depthPercent",
      "polish",
      "symmetry",
      "fluorescence",
      "available",
    ].join(",");

    csv += "\n";

    // CSV rows
    stones.forEach((stone) => {
      csv += [
        stone.productId,
        stone.stoneType,
        stone.shape,
        stone.carat,
        stone.cut || "",
        stone.color || "",
        stone.clarity || "",
        stone.price,
        stone.certificate || "",
        stone.certificateNumber || "",
        stone.certificateUrl || "",
        stone.measurements || "",
        stone.tablePercent || "",
        stone.depthPercent || "",
        stone.polish || "",
        stone.symmetry || "",
        stone.fluorescence || "",
        stone.available,
      ].join(",");
      csv += "\n";
    });
  } else {
    // Export settings
    const settings = await prisma.settingMetadata.findMany({
      where: { shop },
      orderBy: { createdAt: "desc" },
    });

    // CSV header
    csv = [
      "productId",
      "style",
      "settingHeight",
      "compatibleShapes",
      "basePrices",
      "featured",
    ].join(",");

    csv += "\n";

    // CSV rows
    settings.forEach((setting) => {
      csv += [
        setting.productId,
        setting.style,
        setting.settingHeight || "",
        `"${setting.compatibleShapes}"`,
        `"${setting.basePrices}"`,
        setting.featured,
      ].join(",");
      csv += "\n";
    });
  }

  return new Response(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="${type}-export-${Date.now()}.csv"`,
    },
  });
}
