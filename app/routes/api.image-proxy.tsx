/**
 * Image Proxy API
 *
 * Proxies external images to work around CSP restrictions in Shopify admin
 * Usage: /api/image-proxy?url=https://example.com/image.jpg
 */

import type { LoaderFunctionArgs } from "react-router";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const imageUrl = url.searchParams.get("url");

  if (!imageUrl) {
    return new Response("Missing url parameter", { status: 400 });
  }

  try {
    const imageResponse = await fetch(imageUrl, {
      headers: {
        "User-Agent": "ShopifyApp/1.0",
      },
    });

    if (!imageResponse.ok) {
      return new Response("Failed to fetch image", { status: imageResponse.status });
    }

    const imageBuffer = await imageResponse.arrayBuffer();
    const contentType = imageResponse.headers.get("content-type") || "image/jpeg";

    return new Response(imageBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400", // Cache for 24 hours
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Image proxy error:", error);
    return new Response("Error fetching image", { status: 500 });
  }
}
