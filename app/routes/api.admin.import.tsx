/**
 * Admin API: CSV Import
 *
 * Bulk import stones from CSV file.
 */

import type { ActionFunctionArgs } from "react-router";
import { authenticate } from "~/shopify.server";
import prisma from "~/db.server";
import {
  validateCarat,
  validatePrice,
  ValidationError,
} from "~/utils/validators";

interface CsvRow {
  productId: string;
  stoneType: string;
  shape: string;
  carat: string;
  cut?: string;
  color?: string;
  clarity?: string;
  price: string;
  certificate?: string;
  certificateNumber?: string;
  certificateUrl?: string;
  measurements?: string;
  tablePercent?: string;
  depthPercent?: string;
  polish?: string;
  symmetry?: string;
  fluorescence?: string;
}

export async function action({ request }: ActionFunctionArgs) {
  const { session } = await authenticate.admin(request);
  const { shop } = session;

  const formData = await request.formData();
  const csvContent = formData.get("csv") as string;

  if (!csvContent) {
    return Response.json({ error: "CSV content is required" }, { status: 400 });
  }

  // Parse CSV
  const lines = csvContent.trim().split("\n");
  const headers = lines[0].split(",").map((h) => h.trim());

  const results = {
    imported: 0,
    failed: 0,
    errors: [] as Array<{ row: number; error: string; data?: any }>,
  };

  // Process each row (skip header)
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const values = line.split(",").map((v) => v.trim());
    const row: any = {};

    headers.forEach((header, index) => {
      row[header] = values[index] || "";
    });

    try {
      // Validate required fields
      if (!row.productId) {
        throw new Error("productId is required");
      }
      if (!row.stoneType) {
        throw new Error("stoneType is required");
      }
      if (!row.shape) {
        throw new Error("shape is required");
      }
      if (!row.carat) {
        throw new Error("carat is required");
      }
      if (!row.price) {
        throw new Error("price is required");
      }

      const carat = parseFloat(row.carat);
      const price = parseFloat(row.price);

      if (isNaN(carat)) {
        throw new Error("carat must be a number");
      }
      if (isNaN(price)) {
        throw new Error("price must be a number");
      }

      // Validate values
      validateCarat(carat);
      validatePrice(price);

      // Parse optional numeric fields
      const tablePercent = row.tablePercent
        ? parseFloat(row.tablePercent)
        : null;
      const depthPercent = row.depthPercent
        ? parseFloat(row.depthPercent)
        : null;

      // Upsert stone metadata
      await prisma.stoneMetadata.upsert({
        where: { productId: row.productId },
        create: {
          shop,
          productId: row.productId,
          stoneType: row.stoneType,
          shape: row.shape,
          carat,
          cut: row.cut || null,
          color: row.color || null,
          clarity: row.clarity || null,
          price,
          certificate: row.certificate || null,
          certificateNumber: row.certificateNumber || null,
          certificateUrl: row.certificateUrl || null,
          measurements: row.measurements || null,
          tablePercent,
          depthPercent,
          polish: row.polish || null,
          symmetry: row.symmetry || null,
          fluorescence: row.fluorescence || null,
          available: true,
        },
        update: {
          stoneType: row.stoneType,
          shape: row.shape,
          carat,
          cut: row.cut || null,
          color: row.color || null,
          clarity: row.clarity || null,
          price,
          certificate: row.certificate || null,
          certificateNumber: row.certificateNumber || null,
          certificateUrl: row.certificateUrl || null,
          measurements: row.measurements || null,
          tablePercent,
          depthPercent,
          polish: row.polish || null,
          symmetry: row.symmetry || null,
          fluorescence: row.fluorescence || null,
        },
      });

      results.imported++;
    } catch (error: any) {
      results.failed++;
      results.errors.push({
        row: i + 1,
        error: error.message,
        data: row,
      });
    }
  }

  return Response.json({
    success: true,
    imported: results.imported,
    failed: results.failed,
    errors: results.errors,
  });
}
