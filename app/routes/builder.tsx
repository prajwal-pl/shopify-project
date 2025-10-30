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
import { loadBuilderCatalog } from "~/services/builder-data.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop");

  const catalog = await loadBuilderCatalog({
    settingsLimit: 12,
    diamondsLimit: 18,
  });

  console.log("=================================================");
  console.log("💍 RING BUILDER - Storefront Page");
  console.log("   Shop:", shop);
  console.log("=================================================");

  if (!shop) {
    return {
      shop: "builder-store-103.myshopify.com",
      error: "No shop specified",
      catalog,
    };
  }

  return { shop, catalog };
}

// Add headers to allow iframe embedding
export function headers() {
  return {
    "X-Frame-Options": "ALLOWALL",
    "Content-Security-Policy": "frame-ancestors *",
  };
}

export default function BuilderStorefrontPage() {
  const { shop, catalog } = useLoaderData<typeof loader>();

  useIframeResizeSync();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <BuilderApp
        shop={shop}
        settings={catalog.settings}
        diamonds={catalog.diamonds}
      />
    </main>
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
