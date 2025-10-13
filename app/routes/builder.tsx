/**
 * PUBLIC STOREFRONT ROUTE - Ring Builder
 *
 * This is the customer-facing Ring Builder page.
 * Can be embedded in theme via iframe or accessed directly.
 * Access at: /builder?shop=your-store.myshopify.com
 */

import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import { BuilderApp } from "~/components/builder/BuilderApp";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop");

  console.log("=================================================");
  console.log("💍 RING BUILDER - Storefront Page");
  console.log("   Shop:", shop);
  console.log("=================================================");

  if (!shop) {
    return {
      shop: "builder-store-103.myshopify.com", // Default for testing
      error: "No shop specified",
    };
  }

  return { shop };
}

// Add headers to allow iframe embedding
export function headers() {
  return {
    "X-Frame-Options": "ALLOWALL",
    "Content-Security-Policy": "frame-ancestors *",
  };
}

export default function BuilderStorefrontPage() {
  const { shop } = useLoaderData<typeof loader>();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Build Your Dream Ring</title>
        <style>{`
          body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            background: #f9fafb;
          }
        `}</style>
      </head>
      <body>
        <BuilderApp shop={shop} />

        <script>{`
          // Send height updates to parent frame (for iframe embedding)
          function sendHeightToParent() {
            const height = document.documentElement.scrollHeight;
            if (window.parent !== window) {
              window.parent.postMessage({
                type: 'ring-builder-resize',
                height: height
              }, '*');
            }
          }

          // Send height on load and resize
          window.addEventListener('load', sendHeightToParent);
          window.addEventListener('resize', sendHeightToParent);

          // Send height when DOM changes (for dynamic content)
          const observer = new MutationObserver(sendHeightToParent);
          observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true
          });
        `}</script>
      </body>
    </html>
  );
}
