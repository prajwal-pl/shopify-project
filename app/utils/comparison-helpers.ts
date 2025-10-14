/**
 * Comparison Helpers
 *
 * Phase 2.0: Utility functions for diamond comparison tool.
 *
 * Features:
 * - Detect differences between diamonds
 * - Calculate best value (price per carat)
 * - Format comparison data for display
 */

import type { Stone } from "~/types/builder";

/**
 * Fields to compare in the comparison table
 */
export const COMPARISON_FIELDS = [
  { key: "image", label: "Image", type: "image" },
  { key: "shape", label: "Shape", type: "text" },
  { key: "carat", label: "Carat Weight", type: "number" },
  { key: "cut", label: "Cut", type: "text" },
  { key: "color", label: "Color", type: "text" },
  { key: "clarity", label: "Clarity", type: "text" },
  { key: "price", label: "Price", type: "currency" },
  { key: "pricePerCarat", label: "Price per Carat", type: "currency" },
  { key: "certificate", label: "Certificate", type: "text" },
  { key: "certificateNumber", label: "Certificate #", type: "text" },
  { key: "measurements", label: "Measurements", type: "text" },
  { key: "tablePercent", label: "Table %", type: "percentage" },
  { key: "depthPercent", label: "Depth %", type: "percentage" },
  { key: "polish", label: "Polish", type: "text" },
  { key: "symmetry", label: "Symmetry", type: "text" },
  { key: "fluorescence", label: "Fluorescence", type: "text" },
] as const;

export interface ComparisonResult {
  stones: Stone[];
  differences: Record<string, boolean>;
  bestValue: string | null; // Stone ID with best price per carat
  pricesPerCarat: Record<string, number>;
}

/**
 * Detect differences between stones
 *
 * @param stones - Array of stones to compare (2-4)
 * @returns Object with field names as keys, true if values differ
 */
export function detectDifferences(stones: Stone[]): Record<string, boolean> {
  const differences: Record<string, boolean> = {};

  if (stones.length < 2) {
    return differences;
  }

  // Check each field
  COMPARISON_FIELDS.forEach((field) => {
    const values = stones.map((stone) => {
      if (field.key === "pricePerCarat") {
        return calculatePricePerCarat(stone);
      }
      return stone[field.key as keyof Stone];
    });

    // Remove undefined/null values
    const definedValues = values.filter((v) => v !== null && v !== undefined);

    if (definedValues.length > 0) {
      // Check if all values are the same
      const firstValue = JSON.stringify(definedValues[0]);
      const allSame = definedValues.every(
        (v) => JSON.stringify(v) === firstValue,
      );

      differences[field.key] = !allSame;
    }
  });

  return differences;
}

/**
 * Calculate price per carat for a stone
 *
 * @param stone - Stone object
 * @returns Price per carat (rounded to nearest dollar)
 */
export function calculatePricePerCarat(stone: Stone): number {
  if (stone.carat <= 0) return 0;
  return Math.round(stone.price / stone.carat);
}

/**
 * Find the best value stone (lowest price per carat)
 *
 * @param stones - Array of stones to compare
 * @returns Stone ID of best value, or null if none
 */
export function calculateBestValue(stones: Stone[]): string | null {
  if (stones.length === 0) return null;

  const pricesPerCarat = stones.map((stone) => ({
    id: stone.id,
    pricePerCarat: calculatePricePerCarat(stone),
  }));

  // Find minimum price per carat
  const best = pricesPerCarat.reduce((prev, current) =>
    current.pricePerCarat < prev.pricePerCarat ? current : prev,
  );

  return best.id;
}

/**
 * Format comparison data for display
 *
 * @param stones - Array of stones to compare
 * @returns Formatted comparison result
 */
export function formatComparisonData(stones: Stone[]): ComparisonResult {
  const differences = detectDifferences(stones);
  const bestValue = calculateBestValue(stones);

  const pricesPerCarat: Record<string, number> = {};
  stones.forEach((stone) => {
    pricesPerCarat[stone.id] = calculatePricePerCarat(stone);
  });

  return {
    stones,
    differences,
    bestValue,
    pricesPerCarat,
  };
}

/**
 * Get value for a comparison field
 *
 * @param stone - Stone object
 * @param fieldKey - Field key to extract
 * @returns Formatted value
 */
export function getComparisonValue(
  stone: Stone,
  fieldKey: string,
): string | number | undefined {
  if (fieldKey === "image") {
    return stone.images?.[0];
  }

  if (fieldKey === "pricePerCarat") {
    return calculatePricePerCarat(stone);
  }

  return stone[fieldKey as keyof Stone] as any;
}

/**
 * Format value for display in comparison table
 *
 * @param value - Value to format
 * @param type - Value type (currency, percentage, etc.)
 * @returns Formatted string
 */
export function formatComparisonValue(value: any, type: string): string {
  if (value === null || value === undefined) {
    return "—";
  }

  switch (type) {
    case "currency":
      return `$${Number(value).toLocaleString()}`;
    case "percentage":
      return `${Number(value).toFixed(1)}%`;
    case "number":
      return Number(value).toFixed(2);
    case "text":
      return String(value).toUpperCase();
    default:
      return String(value);
  }
}

/**
 * sessionStorage key for comparison selections
 */
export const COMPARISON_STORAGE_KEY = "ringbuilder_comparison_selection";

/**
 * Save comparison selection to sessionStorage
 */
export function saveComparisonSelection(stoneIds: string[]): void {
  sessionStorage.setItem(COMPARISON_STORAGE_KEY, JSON.stringify(stoneIds));
}

/**
 * Load comparison selection from sessionStorage
 */
export function loadComparisonSelection(): string[] {
  const stored = sessionStorage.getItem(COMPARISON_STORAGE_KEY);
  if (!stored) return [];

  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

/**
 * Clear comparison selection
 */
export function clearComparisonSelection(): void {
  sessionStorage.removeItem(COMPARISON_STORAGE_KEY);
}
