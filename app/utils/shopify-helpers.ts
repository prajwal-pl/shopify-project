/**
 * Ring Builder MVP - Shopify Helpers
 *
 * Helper functions for working with Shopify API, GIDs, and GraphQL queries.
 */

// ============================================================================
// SHOPIFY GID PARSING & BUILDING
// ============================================================================

/**
 * Parse Shopify GID to extract numeric ID
 * @param gid - Shopify Global ID (e.g., "gid://shopify/Product/1234567890")
 * @returns Numeric ID as string (e.g., "1234567890")
 * @throws Error if GID format is invalid
 */
export function parseShopifyGid(gid: string): string {
  if (!gid || typeof gid !== "string") {
    throw new Error("Invalid GID: GID must be a non-empty string");
  }

  // Expected format: gid://shopify/ResourceType/12345
  const match = gid.match(/^gid:\/\/shopify\/([A-Za-z]+)\/(\d+)$/);

  if (!match || !match[2]) {
    throw new Error(
      `Invalid Shopify GID format: "${gid}". Expected format: gid://shopify/Type/ID`,
    );
  }

  return match[2];
}

/**
 * Extract resource type from Shopify GID
 * @param gid - Shopify Global ID
 * @returns Resource type (e.g., "Product", "Variant")
 */
export function getGidResourceType(gid: string): string {
  if (!gid || typeof gid !== "string") {
    throw new Error("Invalid GID: GID must be a non-empty string");
  }

  const match = gid.match(/^gid:\/\/shopify\/([A-Za-z]+)\/\d+$/);

  if (!match || !match[1]) {
    throw new Error(
      `Invalid Shopify GID format: "${gid}". Expected format: gid://shopify/Type/ID`,
    );
  }

  return match[1];
}

/**
 * Build Shopify GID from resource type and numeric ID
 * @param type - Resource type (e.g., "Product", "Variant")
 * @param id - Numeric ID (string or number)
 * @returns Complete Shopify GID
 */
export function buildShopifyGid(type: string, id: string | number): string {
  if (!type || typeof type !== "string") {
    throw new Error("Resource type is required");
  }

  if (!id) {
    throw new Error("ID is required");
  }

  const numericId = typeof id === "number" ? id.toString() : id;

  // Validate numeric ID
  if (!/^\d+$/.test(numericId)) {
    throw new Error(`ID must be numeric, got: "${id}"`);
  }

  return `gid://shopify/${type}/${numericId}`;
}

/**
 * Check if a string is a valid Shopify GID
 */
export function isShopifyGid(value: string): boolean {
  if (!value || typeof value !== "string") {
    return false;
  }

  return /^gid:\/\/shopify\/[A-Za-z]+\/\d+$/.test(value);
}

// ============================================================================
// GRAPHQL QUERY BUILDERS
// ============================================================================

/**
 * Build GraphQL query for fetching products with metafields
 * @param first - Number of products to fetch (default: 50)
 * @param after - Cursor for pagination
 * @returns GraphQL query string
 */
export function buildProductQuery(first: number = 50, after?: string): string {
  const afterParam = after ? `, after: "${after}"` : "";

  return `
    query GetProducts {
      products(first: ${first}${afterParam}) {
        edges {
          cursor
          node {
            id
            title
            description
            handle
            status
            vendor
            productType
            tags
            createdAt
            updatedAt
            images(first: 5) {
              edges {
                node {
                  id
                  url
                  altText
                  width
                  height
                }
              }
            }
            variants(first: 10) {
              edges {
                node {
                  id
                  title
                  sku
                  price
                  compareAtPrice
                  inventoryQuantity
                  selectedOptions {
                    name
                    value
                  }
                }
              }
            }
            metafields(namespace: "builder", first: 20) {
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
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
      }
    }
  `;
}

/**
 * Build GraphQL query for fetching a single product
 * @param productId - Shopify Product GID
 * @returns GraphQL query string
 */
export function buildSingleProductQuery(productId: string): string {
  return `
    query GetProduct {
      product(id: "${productId}") {
        id
        title
        description
        handle
        status
        vendor
        productType
        tags
        createdAt
        updatedAt
        images(first: 10) {
          edges {
            node {
              id
              url
              altText
              width
              height
            }
          }
        }
        variants(first: 20) {
          edges {
            node {
              id
              title
              sku
              price
              compareAtPrice
              inventoryQuantity
              availableForSale
              selectedOptions {
                name
                value
              }
            }
          }
        }
        metafields(namespace: "builder", first: 50) {
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
}

/**
 * Build GraphQL mutation for creating/updating metafields
 * @param ownerId - Product/Variant GID
 * @param namespace - Metafield namespace
 * @param key - Metafield key
 * @param value - Metafield value (will be JSON stringified)
 * @param type - Metafield type (default: json)
 * @returns GraphQL mutation string
 */
export function buildMetafieldMutation(
  ownerId: string,
  namespace: string,
  key: string,
  value: any,
  type: string = "json",
): string {
  const jsonValue = typeof value === "string" ? value : JSON.stringify(value);
  const escapedValue = jsonValue.replace(/"/g, '\\"');

  return `
    mutation SetMetafield {
      metafieldsSet(metafields: [{
        ownerId: "${ownerId}",
        namespace: "${namespace}",
        key: "${key}",
        value: "${escapedValue}",
        type: "${type}"
      }]) {
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
}

/**
 * Build metafield input object for mutations
 * @param namespace - Metafield namespace
 * @param key - Metafield key
 * @param value - Metafield value
 * @param type - Metafield type
 * @returns Metafield input object
 */
export function buildMetafieldInput(
  namespace: string,
  key: string,
  value: any,
  type: string = "json",
): object {
  return {
    namespace,
    key,
    value: typeof value === "string" ? value : JSON.stringify(value),
    type,
  };
}

/**
 * Build GraphQL query for fetching variant by ID
 * @param variantId - Variant GID
 * @returns GraphQL query string
 */
export function buildVariantQuery(variantId: string): string {
  return `
    query GetVariant {
      productVariant(id: "${variantId}") {
        id
        title
        sku
        price
        compareAtPrice
        inventoryQuantity
        availableForSale
        selectedOptions {
          name
          value
        }
        product {
          id
          title
        }
      }
    }
  `;
}

// ============================================================================
// PRODUCT VARIANT HELPERS
// ============================================================================

/**
 * Find variant ID by option value (e.g., find variant for "14K White Gold")
 * @param product - Product data from Shopify API
 * @param optionName - Option name (e.g., "Metal")
 * @param optionValue - Option value (e.g., "14K White Gold")
 * @returns Variant GID or null if not found
 */
export function findVariantByOption(
  product: any,
  optionName: string,
  optionValue: string,
): string | null {
  if (!product?.variants?.edges) {
    return null;
  }

  for (const edge of product.variants.edges) {
    const variant = edge.node;
    const option = variant.selectedOptions?.find(
      (opt: any) => opt.name === optionName && opt.value === optionValue,
    );

    if (option) {
      return variant.id;
    }
  }

  return null;
}

/**
 * Get default variant ID (first variant)
 * @param product - Product data from Shopify API
 * @returns Variant GID or null if no variants
 */
export function getDefaultVariantId(product: any): string | null {
  if (!product?.variants?.edges || product.variants.edges.length === 0) {
    return null;
  }

  return product.variants.edges[0].node.id;
}

/**
 * Check if variant is in stock
 * @param variant - Variant data from Shopify API
 * @returns True if in stock
 */
export function isVariantInStock(variant: any): boolean {
  if (!variant) {
    return false;
  }

  // Check availableForSale first
  if (variant.availableForSale === false) {
    return false;
  }

  // Check inventory quantity (if tracking)
  if (typeof variant.inventoryQuantity === "number") {
    return variant.inventoryQuantity > 0;
  }

  // Default to true if no inventory tracking
  return true;
}

// ============================================================================
// IMAGE HELPERS
// ============================================================================

/**
 * Get product images as array of URLs
 * @param product - Product data from Shopify API
 * @returns Array of image URLs
 */
export function getProductImages(product: any): string[] {
  if (!product?.images?.edges) {
    return [];
  }

  return product.images.edges.map((edge: any) => edge.node.url);
}

/**
 * Get first product image URL
 * @param product - Product data from Shopify API
 * @returns Image URL or null
 */
export function getProductPrimaryImage(product: any): string | null {
  const images = getProductImages(product);
  return images.length > 0 ? images[0] : null;
}

/**
 * Transform Shopify image URL with size parameters
 * @param url - Original image URL
 * @param size - Size parameter (e.g., "200x200", "large", "medium")
 * @returns Transformed image URL
 */
export function transformImageUrl(url: string, size: string): string {
  if (!url) {
    return url;
  }

  // Shopify CDN image transformation
  // Example: https://cdn.shopify.com/...image.jpg -> ...image_200x200.jpg
  const extension = url.substring(url.lastIndexOf("."));
  const baseUrl = url.substring(0, url.lastIndexOf("."));

  return `${baseUrl}_${size}${extension}`;
}

// ============================================================================
// METAFIELD HELPERS
// ============================================================================

/**
 * Parse metafield value (handles JSON and string types)
 * @param metafield - Metafield data from Shopify API
 * @returns Parsed value
 */
export function parseMetafieldValue(metafield: any): any {
  if (!metafield?.value) {
    return null;
  }

  const { value, type } = metafield;

  // Handle JSON type
  if (type === "json") {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }

  // Handle number types
  if (type === "number_integer" || type === "number_decimal") {
    return parseFloat(value);
  }

  // Handle boolean
  if (type === "boolean") {
    return value === "true" || value === true;
  }

  // Default: return as string
  return value;
}

/**
 * Find metafield by key in metafields array
 * @param metafields - Metafields edges from Shopify API
 * @param key - Metafield key to find
 * @param namespace - Metafield namespace (default: "builder")
 * @returns Parsed metafield value or null
 */
export function findMetafield(
  metafields: any,
  key: string,
  namespace: string = "builder",
): any {
  if (!metafields?.edges) {
    return null;
  }

  for (const edge of metafields.edges) {
    const metafield = edge.node;
    if (metafield.namespace === namespace && metafield.key === key) {
      return parseMetafieldValue(metafield);
    }
  }

  return null;
}

// ============================================================================
// CART HELPERS
// ============================================================================

/**
 * Build line item properties object for cart
 * @param properties - Key-value pairs of properties
 * @returns Formatted properties object for Shopify Cart API
 */
export function buildLineItemProperties(
  properties: Record<string, string>,
): object {
  // Shopify Cart API expects properties as key-value pairs
  // Each value must be a string and max 255 characters
  const formatted: Record<string, string> = {};

  for (const [key, value] of Object.entries(properties)) {
    // Ensure value is string and truncate if needed
    const stringValue = String(value);
    formatted[key] =
      stringValue.length > 255
        ? stringValue.slice(0, 252) + "..."
        : stringValue;
  }

  return formatted;
}

// ============================================================================
// ERROR HANDLING
// ============================================================================

/**
 * Parse GraphQL errors from response
 * @param response - GraphQL API response
 * @returns Array of error messages
 */
export function parseGraphQLErrors(response: any): string[] {
  const errors: string[] = [];

  // Check for top-level errors
  if (response.errors && Array.isArray(response.errors)) {
    errors.push(...response.errors.map((e: any) => e.message));
  }

  // Check for userErrors in mutations
  if (response.data) {
    for (const key of Object.keys(response.data)) {
      const operation = response.data[key];
      if (operation?.userErrors && Array.isArray(operation.userErrors)) {
        errors.push(...operation.userErrors.map((e: any) => e.message));
      }
    }
  }

  return errors;
}

/**
 * Check if GraphQL response has errors
 * @param response - GraphQL API response
 * @returns True if response has errors
 */
export function hasGraphQLErrors(response: any): boolean {
  return parseGraphQLErrors(response).length > 0;
}

// ============================================================================
// PAGINATION HELPERS
// ============================================================================

/**
 * Build pagination info from Shopify connection
 * @param connection - Shopify connection object with pageInfo
 * @returns Pagination metadata
 */
export function buildPaginationInfo(connection: any): {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
  endCursor: string | null;
} {
  const pageInfo = connection?.pageInfo || {};

  return {
    hasNextPage: pageInfo.hasNextPage || false,
    hasPreviousPage: pageInfo.hasPreviousPage || false,
    startCursor: pageInfo.startCursor || null,
    endCursor: pageInfo.endCursor || null,
  };
}

// ============================================================================
// RATE LIMITING
// ============================================================================

/**
 * Sleep/delay utility for rate limiting
 * @param ms - Milliseconds to sleep
 * @returns Promise that resolves after delay
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Check if error is a rate limit error
 * @param error - Error object
 * @returns True if rate limit error
 */
export function isRateLimitError(error: any): boolean {
  if (!error) {
    return false;
  }

  const message = error.message || error.toString();

  return (
    message.includes("throttle") ||
    message.includes("rate limit") ||
    error.status === 429
  );
}
