/**
 * Metafields Service
 *
 * Phase 2.0: Handles all Shopify metafield operations for ring builder data.
 *
 * This service provides:
 * - Creating metafield definitions on app install
 * - Writing product metafields (diamonds and settings)
 * - Reading product metafields
 * - Deleting product metafields
 */

import type {
  MetafieldDefinition,
  MetafieldInput,
  ShopifyMetafield,
  DiamondMetafields,
  SettingMetafields,
} from "~/types/metafields";
import {
  ALL_METAFIELD_DEFINITIONS,
  RINGBUILDER_NAMESPACE,
  stringifyMetafieldValue,
  parseMetafieldValue,
} from "~/types/metafields";

// ============================================================================
// METAFIELD DEFINITIONS SETUP
// ============================================================================

/**
 * Create all metafield definitions for ring builder
 *
 * This should be called once when the app is installed or first accessed.
 * It creates the metafield definitions in Shopify that allow us to store
 * structured data on products.
 *
 * @param admin - Shopify Admin API GraphQL client
 * @returns Success status and count of definitions created
 */
export async function createMetafieldDefinitions(
  admin: any,
): Promise<{ success: boolean; count: number; errors: string[] }> {
  const errors: string[] = [];
  let createdCount = 0;

  console.log(
    `🔧 Creating ${ALL_METAFIELD_DEFINITIONS.length} metafield definitions...`,
  );

  for (const definition of ALL_METAFIELD_DEFINITIONS) {
    try {
      // Check if definition already exists
      const existsQuery = `
        query CheckMetafieldDefinition($namespace: String!, $key: String!) {
          metafieldDefinitions(first: 1, namespace: $namespace, key: $key, ownerType: PRODUCT) {
            edges {
              node {
                id
                name
              }
            }
          }
        }
      `;

      const existsResponse = await admin.graphql(existsQuery, {
        variables: {
          namespace: definition.namespace,
          key: definition.key,
        },
      });

      const existsData = await existsResponse.json();
      const exists = existsData.data?.metafieldDefinitions?.edges?.length > 0;

      if (exists) {
        console.log(
          `  ✓ Metafield definition already exists: ${definition.namespace}.${definition.key}`,
        );
        continue;
      }

      // Create new metafield definition
      const createMutation = `
        mutation CreateMetafieldDefinition($definition: MetafieldDefinitionInput!) {
          metafieldDefinitionCreate(definition: $definition) {
            createdDefinition {
              id
              name
              namespace
              key
              type {
                name
              }
            }
            userErrors {
              field
              message
            }
          }
        }
      `;

      const createResponse = await admin.graphql(createMutation, {
        variables: {
          definition: {
            name: definition.name || definition.key,
            namespace: definition.namespace,
            key: definition.key,
            description: definition.description || "",
            type: definition.type,
            ownerType: "PRODUCT",
          },
        },
      });

      const createData = await createResponse.json();
      const userErrors =
        createData.data?.metafieldDefinitionCreate?.userErrors || [];

      if (userErrors.length > 0) {
        const errorMsg = `${definition.key}: ${userErrors.map((e: any) => e.message).join(", ")}`;
        errors.push(errorMsg);
        console.error(`  ✗ Error creating ${definition.key}:`, userErrors);
      } else {
        createdCount++;
        console.log(`  ✓ Created metafield definition: ${definition.key}`);
      }
    } catch (error: any) {
      const errorMsg = `${definition.key}: ${error.message}`;
      errors.push(errorMsg);
      console.error(`  ✗ Exception creating ${definition.key}:`, error);
    }
  }

  console.log(
    `✅ Metafield definitions setup complete: ${createdCount} created, ${errors.length} errors`,
  );

  return {
    success: errors.length === 0,
    count: createdCount,
    errors,
  };
}

// ============================================================================
// WRITE METAFIELDS
// ============================================================================

/**
 * Write diamond metafields to a product
 *
 * @param admin - Shopify Admin API GraphQL client
 * @param productId - Shopify Product GID
 * @param metafields - Diamond metafield data
 * @returns Success status
 */
export async function writeDiamondMetafields(
  admin: any,
  productId: string,
  metafields: Partial<DiamondMetafields>,
): Promise<{ success: boolean; errors: string[] }> {
  const inputs: MetafieldInput[] = [];

  // Convert metafields object to MetafieldInput array
  for (const [key, value] of Object.entries(metafields)) {
    if (value !== undefined && value !== null) {
      // Find the definition to get the type
      const definition = ALL_METAFIELD_DEFINITIONS.find(
        (d) => d.key === key || d.key === convertKeyToSnakeCase(key),
      );

      if (definition) {
        inputs.push({
          namespace: RINGBUILDER_NAMESPACE,
          key: definition.key,
          value: stringifyMetafieldValue(value, definition.type),
          type: definition.type,
        });
      }
    }
  }

  return await writeProductMetafields(admin, productId, inputs);
}

/**
 * Write setting metafields to a product
 *
 * @param admin - Shopify Admin API GraphQL client
 * @param productId - Shopify Product GID
 * @param metafields - Setting metafield data
 * @returns Success status
 */
export async function writeSettingMetafields(
  admin: any,
  productId: string,
  metafields: Partial<SettingMetafields>,
): Promise<{ success: boolean; errors: string[] }> {
  const inputs: MetafieldInput[] = [];

  // Convert metafields object to MetafieldInput array
  for (const [key, value] of Object.entries(metafields)) {
    if (value !== undefined && value !== null) {
      // Find the definition to get the type
      const definition = ALL_METAFIELD_DEFINITIONS.find(
        (d) => d.key === key || d.key === convertKeyToSnakeCase(key),
      );

      if (definition) {
        inputs.push({
          namespace: RINGBUILDER_NAMESPACE,
          key: definition.key,
          value: stringifyMetafieldValue(value, definition.type),
          type: definition.type,
        });
      }
    }
  }

  return await writeProductMetafields(admin, productId, inputs);
}

/**
 * Write metafields to a product (generic)
 *
 * @param admin - Shopify Admin API GraphQL client
 * @param productId - Shopify Product GID
 * @param metafields - Array of metafield inputs
 * @returns Success status
 */
export async function writeProductMetafields(
  admin: any,
  productId: string,
  metafields: MetafieldInput[],
): Promise<{ success: boolean; errors: string[] }> {
  if (metafields.length === 0) {
    return { success: true, errors: [] };
  }

  const errors: string[] = [];

  try {
    // Batch metafields into groups of 25 (Shopify limit)
    const batches = [];
    for (let i = 0; i < metafields.length; i += 25) {
      batches.push(metafields.slice(i, i + 25));
    }

    for (const batch of batches) {
      const mutation = `
        mutation UpdateProductMetafields($metafields: [MetafieldsSetInput!]!) {
          metafieldsSet(metafields: $metafields) {
            metafields {
              id
              namespace
              key
              value
            }
            userErrors {
              field
              message
            }
          }
        }
      `;

      const metafieldsInput = batch.map((m) => ({
        ownerId: productId,
        namespace: m.namespace,
        key: m.key,
        value: m.value,
        type: m.type,
      }));

      const response = await admin.graphql(mutation, {
        variables: { metafields: metafieldsInput },
      });

      const data = await response.json();
      const userErrors = data.data?.metafieldsSet?.userErrors || [];

      if (userErrors.length > 0) {
        userErrors.forEach((error: any) => {
          errors.push(`${error.field}: ${error.message}`);
        });
      }
    }

    console.log(
      `✅ Wrote ${metafields.length} metafields to product ${productId}`,
    );
  } catch (error: any) {
    console.error("Error writing metafields:", error);
    errors.push(error.message);
  }

  return {
    success: errors.length === 0,
    errors,
  };
}

// ============================================================================
// READ METAFIELDS
// ============================================================================

/**
 * Read all ring builder metafields from a product
 *
 * @param admin - Shopify Admin API GraphQL client
 * @param productId - Shopify Product GID
 * @returns Metafields data
 */
export async function readProductMetafields(
  admin: any,
  productId: string,
): Promise<ShopifyMetafield[]> {
  try {
    const query = `
      query GetProductMetafields($id: ID!) {
        product(id: $id) {
          metafields(first: 50, namespace: "${RINGBUILDER_NAMESPACE}") {
            edges {
              node {
                id
                namespace
                key
                value
                type
              }
            }
          }
        }
      }
    `;

    const response = await admin.graphql(query, {
      variables: { id: productId },
    });

    const data = await response.json();
    const edges = data.data?.product?.metafields?.edges || [];

    return edges.map((edge: any) => edge.node);
  } catch (error) {
    console.error("Error reading metafields:", error);
    return [];
  }
}

/**
 * Parse diamond metafields from Shopify format
 *
 * @param metafields - Array of Shopify metafields
 * @returns Parsed diamond metafields object
 */
export function parseDiamondMetafields(
  metafields: ShopifyMetafield[],
): Partial<DiamondMetafields> {
  const result: any = {};

  for (const metafield of metafields) {
    const definition = ALL_METAFIELD_DEFINITIONS.find(
      (d) => d.key === metafield.key,
    );

    if (definition) {
      const camelKey = convertKeyToCamelCase(metafield.key);
      result[camelKey] = parseMetafieldValue(
        metafield.key,
        metafield.value,
        definition.type,
      );
    }
  }

  return result;
}

/**
 * Parse setting metafields from Shopify format
 *
 * @param metafields - Array of Shopify metafields
 * @returns Parsed setting metafields object
 */
export function parseSettingMetafields(
  metafields: ShopifyMetafield[],
): Partial<SettingMetafields> {
  const result: any = {};

  for (const metafield of metafields) {
    const definition = ALL_METAFIELD_DEFINITIONS.find(
      (d) => d.key === metafield.key,
    );

    if (definition) {
      const camelKey = convertKeyToCamelCase(metafield.key);
      result[camelKey] = parseMetafieldValue(
        metafield.key,
        metafield.value,
        definition.type,
      );
    }
  }

  return result;
}

// ============================================================================
// DELETE METAFIELDS
// ============================================================================

/**
 * Delete all ring builder metafields from a product
 *
 * @param admin - Shopify Admin API GraphQL client
 * @param productId - Shopify Product GID
 * @returns Success status
 */
export async function deleteProductMetafields(
  admin: any,
  productId: string,
): Promise<{ success: boolean; errors: string[] }> {
  const errors: string[] = [];

  try {
    // First, read existing metafields to get their IDs
    const metafields = await readProductMetafields(admin, productId);

    if (metafields.length === 0) {
      return { success: true, errors: [] };
    }

    // Delete metafields in batches of 25
    const batches = [];
    for (let i = 0; i < metafields.length; i += 25) {
      batches.push(metafields.slice(i, i + 25));
    }

    for (const batch of batches) {
      const mutation = `
        mutation DeleteMetafields($metafields: [MetafieldDeleteInput!]!) {
          metafieldsDelete(metafields: $metafields) {
            deletedMetafields {
              id
            }
            userErrors {
              field
              message
            }
          }
        }
      `;

      const metafieldsInput = batch.map((m) => ({
        ownerId: productId,
        key: m.key,
        namespace: m.namespace,
      }));

      const response = await admin.graphql(mutation, {
        variables: { metafields: metafieldsInput },
      });

      const data = await response.json();
      const userErrors = data.data?.metafieldsDelete?.userErrors || [];

      if (userErrors.length > 0) {
        userErrors.forEach((error: any) => {
          errors.push(`${error.field}: ${error.message}`);
        });
      }
    }

    console.log(
      `✅ Deleted ${metafields.length} metafields from product ${productId}`,
    );
  } catch (error: any) {
    console.error("Error deleting metafields:", error);
    errors.push(error.message);
  }

  return {
    success: errors.length === 0,
    errors,
  };
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Convert camelCase to snake_case
 */
function convertKeyToSnakeCase(key: string): string {
  return key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

/**
 * Convert snake_case to camelCase
 */
function convertKeyToCamelCase(key: string): string {
  return key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}
