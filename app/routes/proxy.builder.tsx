/**
 * APP PROXY ROUTE - Ring Builder
 *
 * Handles requests proxied through Shopify's App Proxy
 * Customer URL: yourstore.com/apps/gem-finder/builder
 * Proxied to: your-app.com/proxy/builder
 *
 * Shopify adds these headers to proxy requests:
 * - X-Shopify-Shop-Domain: store.myshopify.com
 * - X-Shopify-Customer-Id: customer ID (if logged in)
 * - X-Shopify-Hmac: HMAC signature for verification
 */

import { useEffect } from "react";
import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";

import { BuilderApp } from "../components/builder/BuilderApp";
import { ThemeProvider } from "../components/builder/ThemeProvider";
import { loadBuilderCatalog } from "~/services/builder-data.server";
import { getThemeForShop, getDefaultTheme } from "~/services/theme.server";

export async function loader({ request }: LoaderFunctionArgs) {
  // Get shop from Shopify proxy headers or query parameter as fallback
  let shop = request.headers.get("X-Shopify-Shop-Domain");

  const url = new URL(request.url);
  const shopParam = url.searchParams.get("shop");

  console.log("=================================================");
  console.log("🔄 APP PROXY - Ring Builder");
  console.log("   Shop Header:", shop);
  console.log("   Shop Param:", shopParam);
  console.log("   URL:", request.url);
  console.log("   All Headers:", Object.fromEntries(request.headers.entries()));
  console.log("=================================================");

  // Fallback to shop parameter if header not present (for direct access during dev)
  if (!shop && shopParam) {
    shop = shopParam;
    console.log("⚠️  Using shop from query parameter (proxy not active yet)");
  }

  if (!shop) {
    throw new Response("Missing shop domain. Access this through: yourstore.myshopify.com/apps/gem-finder/builder or add ?shop=yourstore.myshopify.com", {
      status: 400,
    });
  }

  const [catalog, theme] = await Promise.all([
    loadBuilderCatalog({
      settingsLimit: 12,
      diamondsLimit: 18,
    }),
    getThemeForShop(shop),
  ]);

  return {
    shop,
    catalog,
    theme,
  };
}

// Allow iframe embedding from any origin (needed for theme extension fallback)
export function headers() {
  return {
    "X-Frame-Options": "ALLOW",
    "Content-Security-Policy": "frame-ancestors *",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Shopify-Shop-Domain",
  };
}

export default function ProxyBuilderPage() {
  const { shop, catalog, theme } = useLoaderData<typeof loader>();

  useIframeResizeSync();

  return (
    <ThemeProvider theme={theme}>
      <main className="min-h-screen bg-background text-foreground">
        <BuilderApp
          shop={shop}
          settings={catalog.settings}
          diamonds={catalog.diamonds}
        />
      </main>
    </ThemeProvider>
  );
}

function useIframeResizeSync() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const sendHeightToParent = () => {
      const height = document.documentElement.scrollHeight;
      if (window.parent !== window) {
        window.parent.postMessage(
          {
            type: "ring-builder-resize",
            height,
          },
          "*"
        );
      }
    };

    sendHeightToParent();
    window.addEventListener("load", sendHeightToParent);
    window.addEventListener("resize", sendHeightToParent);

    const observer = new MutationObserver(sendHeightToParent);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
    });

    return () => {
      window.removeEventListener("load", sendHeightToParent);
      window.removeEventListener("resize", sendHeightToParent);
      observer.disconnect();
    };
  }, []);
}
