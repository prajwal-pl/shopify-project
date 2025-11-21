/**
 * PUBLIC STOREFRONT ROUTE - Ring Builder
 *
 * This is the customer-facing Ring Builder page.
 * Can be embedded in theme via iframe or accessed directly.
 * Access at: /builder?shop=your-store.myshopify.com
 */

import { useEffect } from "react";
import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";

import { BuilderApp } from "../components/builder/BuilderApp";
import { ThemeProvider } from "../components/builder/ThemeProvider";
import { loadBuilderCatalog } from "~/services/builder-data.server";
import { getThemeForShop, getDefaultTheme } from "~/services/theme.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop");

  console.log("=================================================");
  console.log("💍 RING BUILDER - Storefront Page");
  console.log("   Shop:", shop);
  console.log("=================================================");

  if (!shop) {
    const catalog = await loadBuilderCatalog({
      settingsLimit: 12,
      diamondsLimit: 18,
    });

    return {
      shop: "builder-store-103.myshopify.com",
      error: "No shop specified",
      catalog,
      theme: getDefaultTheme(),
    };
  }

  const [catalog, theme] = await Promise.all([
    loadBuilderCatalog({
      settingsLimit: 12,
      diamondsLimit: 18,
    }),
    getThemeForShop(shop),
  ]);

  return { shop, catalog, theme };
}

// Allow iframe embedding from Shopify stores
// DO NOT set X-Frame-Options as it conflicts with CSP and causes Firefox blocking
export function headers() {
  return {
    "Content-Security-Policy": "frame-ancestors https://*.myshopify.com https://admin.shopify.com",
  };
}

export default function BuilderStorefrontPage() {
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
