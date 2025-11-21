/**
 * APP PROXY CATCH-ALL ROUTE
 *
 * Handles all proxied requests that don't match specific proxy routes
 * Customer URL: yourstore.com/apps/gem-finder/*
 * Proxied to: your-app.com/proxy/*
 */

import type { LoaderFunctionArgs } from "react-router";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const shop = request.headers.get("X-Shopify-Shop-Domain");
  const splat = params["*"];

  console.log("=================================================");
  console.log("🔄 APP PROXY - Catch-all");
  console.log("   Shop:", shop);
  console.log("   Path:", splat);
  console.log("   URL:", request.url);
  console.log("=================================================");

  // Return helpful error for unmapped proxy paths
  return new Response(
    `Ring Builder App - Path not found: /apps/gem-finder/${splat}\n\nAvailable paths:\n- /apps/gem-finder/builder - Ring Builder interface`,
    {
      status: 404,
      headers: {
        "Content-Type": "text/plain",
      },
    }
  );
}
