/**
 * PUBLIC EMBEDDABLE ROUTE - Ring Builder
 *
 * This route is designed for embedding on external sites (WordPress, custom HTML, etc.)
 * Access: /embed/builder?tenantId=XXX or /embed/builder?shop=store.myshopify.com
 *
 * Features:
 * - No Shopify session required
 * - Theme customization applied
 * - Auto-resize iframe support
 * - CORS headers for cross-origin embedding
 */

import { useEffect } from "react";
import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";

import { BuilderApp } from "../components/builder/BuilderApp";
import { ThemeProvider } from "../components/builder/ThemeProvider";
import { loadBuilderCatalog } from "~/services/builder-data.server";
import { getThemeForShop, getThemeForTenant, getDefaultTheme } from "~/services/theme.server";
import prisma from "~/db.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);

  // Support both shop and tenantId params
  const shop = url.searchParams.get("shop");
  const tenantId = url.searchParams.get("tenantId");

  console.log("=================================================");
  console.log("🌐 EMBED BUILDER - Public Route");
  console.log("   Shop:", shop);
  console.log("   TenantId:", tenantId);
  console.log("=================================================");

  if (!shop && !tenantId) {
    throw new Response("Missing shop or tenantId parameter. Use ?shop=yourstore.myshopify.com or ?tenantId=xxx", {
      status: 400,
    });
  }

  // Get merchant from either shop or tenantId
  let merchantShop: string;

  if (tenantId) {
    const merchant = await prisma.merchant.findUnique({
      where: { id: tenantId },
      select: { shop: true },
    });

    if (!merchant) {
      throw new Response("Merchant not found for tenantId", { status: 404 });
    }

    merchantShop = merchant.shop;
  } else {
    merchantShop = shop!;
  }

  // Load catalog and theme in parallel
  const [catalog, theme] = await Promise.all([
    loadBuilderCatalog({
      settingsLimit: 24,
      diamondsLimit: 48,
    }),
    tenantId ? getThemeForTenant(tenantId) : getThemeForShop(merchantShop),
  ]);

  return {
    shop: merchantShop,
    tenantId: tenantId || null,
    catalog,
    theme,
    embedMode: true,
  };
}

// Allow iframe embedding from any origin (external sites like WordPress)
// DO NOT set X-Frame-Options as it conflicts with CSP and causes Firefox blocking
export function headers() {
  return {
    "Content-Security-Policy": "frame-ancestors *",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

export default function EmbedBuilder() {
  const { shop, tenantId, catalog, theme } = useLoaderData<typeof loader>();

  // Auto-resize iframe communication
  useIframeResize(tenantId);

  return (
    <ThemeProvider theme={theme}>
      <div
        className="embed-builder"
        data-tenant-id={tenantId || ""}
        data-shop={shop}
      >
        <BuilderApp
          shop={shop}
          settings={catalog.settings}
          diamonds={catalog.diamonds}
        />
      </div>

      <style>{`
        /* Embed-specific styles */
        body {
          margin: 0;
          padding: 0;
          background: var(--background-color, #ffffff);
          color: var(--text-color, #000000);
          font-family: var(--font-family, system-ui);
        }

        .embed-builder {
          min-height: 100vh;
          width: 100%;
        }

        /* Apply theme colors to builder components */
        .builder-app button.primary,
        .builder-app .btn-primary {
          background: var(--primary-color, #6B2C3E) !important;
          color: var(--background-color, #ffffff) !important;
          border-radius: var(--button-border-radius, 8px) !important;
        }

        .builder-app button.accent,
        .builder-app .btn-accent {
          background: var(--accent-color, #D4AF37) !important;
          color: var(--text-color, #000000) !important;
          border-radius: var(--button-border-radius, 8px) !important;
        }

        .builder-app .card,
        .builder-app .panel {
          border-radius: var(--border-radius, 8px) !important;
        }

        /* Dark mode support */
        .dark-mode .embed-builder {
          background: var(--background-color, #1a1a1a);
          color: var(--text-color, #ffffff);
        }

        /* Responsive adjustments for embed */
        @media (max-width: 768px) {
          .embed-builder {
            padding: 10px;
          }
        }
      `}</style>
    </ThemeProvider>
  );
}

/**
 * Hook to handle iframe resizing
 * Posts height updates to parent window
 */
function useIframeResize(tenantId: string | null) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const sendHeightToParent = () => {
      const height = document.documentElement.scrollHeight;

      // Check if we're in an iframe
      if (window.parent !== window) {
        window.parent.postMessage(
          {
            type: "ring-builder-resize",
            height,
            tenantId: tenantId || undefined,
            timestamp: Date.now(),
          },
          "*" // Allow any parent origin
        );
      }
    };

    // Send initial height
    sendHeightToParent();

    // Send on window events
    window.addEventListener("load", sendHeightToParent);
    window.addEventListener("resize", sendHeightToParent);

    // Observe DOM changes
    const observer = new MutationObserver(sendHeightToParent);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
    });

    // Poll for height changes (fallback)
    const interval = setInterval(sendHeightToParent, 1000);

    return () => {
      window.removeEventListener("load", sendHeightToParent);
      window.removeEventListener("resize", sendHeightToParent);
      observer.disconnect();
      clearInterval(interval);
    };
  }, [tenantId]);
}
