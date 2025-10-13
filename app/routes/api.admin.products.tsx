/**
 * Admin API: Products List
 *
 * Fetch products from Shopify with Ring Builder metadata.
 */

import type { LoaderFunctionArgs } from "react-router";
import { authenticate } from "~/shopify.server";
import prisma from "~/db.server";

interface ShopifyProduct {
  id: string;
  title: string;
  description: string;
  handle: string;
  status: string;
  images: Array<{
    id: string;
    url: string;
    altText?: string;
  }>;
  variants: Array<{
    id: string;
    title: string;
    sku: string;
    price: string;
  }>;
}

export async function loader({ request }: LoaderFunctionArgs) {
  const { admin, session } = await authenticate.admin(request);
  const { shop } = session;

  const url = new URL(request.url);
  const cursor = url.searchParams.get("cursor");
  const limit = 50;

  // Build GraphQL query
  const query = `
    query GetProducts($first: Int!, $after: String) {
      products(first: $first, after: $after) {
        edges {
          cursor
          node {
            id
            title
            description
            handle
            status
            images(first: 1) {
              edges {
                node {
                  id
                  url
                  altText
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
                }
              }
            }
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  `;

  // Fetch products from Shopify
  try {
    const response = await admin.graphql(query, {
      variables: {
        first: limit,
        after: cursor,
      },
    });

    const data = await response.json();

    console.log("=================================================");
    console.log("🔶 RING BUILDER API - /api/admin/products");
    console.log("=================================================");
    console.log(
      "📦 Shopify products:",
      data.data?.products?.edges?.length || 0,
    );

    const productsData = data.data?.products;

    if (!productsData) {
      console.warn("⚠️ RING BUILDER API: No products data in GraphQL response");
      return Response.json({
        products: [],
        pageInfo: { hasNextPage: false, endCursor: null },
      });
    }

    // Transform products
    const products: ShopifyProduct[] = productsData.edges.map((edge: any) => ({
      id: edge.node.id,
      title: edge.node.title,
      description: edge.node.description || "",
      handle: edge.node.handle,
      status: edge.node.status,
      images: edge.node.images.edges.map((imgEdge: any) => ({
        id: imgEdge.node.id,
        url: imgEdge.node.url,
        altText: imgEdge.node.altText,
      })),
      variants: edge.node.variants.edges.map((varEdge: any) => ({
        id: varEdge.node.id,
        title: varEdge.node.title,
        sku: varEdge.node.sku || "",
        price: varEdge.node.price,
      })),
    }));

    // Get product IDs
    const productIds = products.map((p) => p.id);

    // Fetch Ring Builder metadata
    const [settings, stones] = await Promise.all([
      prisma.settingMetadata.findMany({
        where: {
          shop,
          productId: { in: productIds },
        },
      }),
      prisma.stoneMetadata.findMany({
        where: {
          shop,
          productId: { in: productIds },
        },
      }),
    ]);

    // Create metadata maps
    const settingsMap = new Map(settings.map((s) => [s.productId, s]));
    const stonesMap = new Map(stones.map((s) => [s.productId, s]));

    // Merge metadata with products
    const productsWithMetadata = products.map((product) => ({
      ...product,
      builderType: settingsMap.has(product.id)
        ? "setting"
        : stonesMap.has(product.id)
          ? "stone"
          : null,
      metadata:
        settingsMap.get(product.id) || stonesMap.get(product.id) || null,
    }));

    console.log(
      "✅ RING BUILDER API: Returning",
      productsWithMetadata.length,
      "products",
    );
    console.log("=================================================");

    return Response.json({
      products: productsWithMetadata,
      pageInfo: {
        hasNextPage: productsData.pageInfo.hasNextPage,
        endCursor: productsData.pageInfo.endCursor,
      },
    });
  } catch (error) {
    console.error("❌ RING BUILDER API ERROR in admin products:", error);
    console.error("=================================================");
    return Response.json({
      products: [],
      pageInfo: { hasNextPage: false, endCursor: null },
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
