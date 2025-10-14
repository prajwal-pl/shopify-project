/**
 * Admin API: Metafield Definitions Setup
 *
 * Phase 2.0: Creates metafield definitions in Shopify for ring builder data.
 *
 * This endpoint should be called:
 * - On app installation
 * - On first admin access
 * - When metafield definitions need to be recreated
 *
 * It's idempotent - can be called multiple times safely.
 */

import type { ActionFunctionArgs } from "react-router";
import { authenticate } from "~/shopify.server";
import { createMetafieldDefinitions } from "~/services/metafields.server";

export async function action({ request }: ActionFunctionArgs) {
  // Authenticate as admin
  const { admin, session } = await authenticate.admin(request);
  const { shop } = session;

  console.log("=================================================");
  console.log("🔧 METAFIELD DEFINITIONS SETUP");
  console.log(`📍 Shop: ${shop}`);
  console.log("=================================================");

  try {
    // Create all metafield definitions
    const result = await createMetafieldDefinitions(admin);

    if (result.success) {
      console.log("✅ All metafield definitions created successfully");
      return Response.json({
        success: true,
        message: "Metafield definitions created successfully",
        count: result.count,
      });
    } else {
      console.error("⚠️ Some metafield definitions failed:", result.errors);
      return Response.json(
        {
          success: false,
          message: "Some metafield definitions failed to create",
          count: result.count,
          errors: result.errors,
        },
        { status: 207 }, // Multi-Status
      );
    }
  } catch (error: any) {
    console.error("❌ Error setting up metafield definitions:", error);
    return Response.json(
      {
        success: false,
        error: "Failed to setup metafield definitions",
        details: error.message,
      },
      { status: 500 },
    );
  }
}

/**
 * GET handler for checking setup status
 */
export async function loader({ request }: ActionFunctionArgs) {
  const { admin, session } = await authenticate.admin(request);
  const { shop } = session;

  try {
    // Check if metafield definitions exist
    const query = `
      query CheckMetafieldDefinitions {
        metafieldDefinitions(first: 50, namespace: "ringbuilder", ownerType: PRODUCT) {
          edges {
            node {
              id
              name
              namespace
              key
              type {
                name
              }
            }
          }
        }
      }
    `;

    const response = await admin.graphql(query);
    const data = await response.json();

    const definitions = data.data?.metafieldDefinitions?.edges || [];

    return Response.json({
      success: true,
      shop,
      definitionsCount: definitions.length,
      definitions: definitions.map((edge: any) => edge.node),
    });
  } catch (error: any) {
    console.error("Error checking metafield definitions:", error);
    return Response.json(
      {
        success: false,
        error: "Failed to check metafield definitions",
        details: error.message,
      },
      { status: 500 },
    );
  }
}
