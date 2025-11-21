/**
 * Ring Builder Preview - Admin Route
 *
 * Preview the customer-facing Ring Builder within the admin.
 * Access at: /app/builder/preview
 */

import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import { authenticate } from "~/shopify.server";
import { BuilderApp } from "~/components/builder/BuilderApp";
import { ThemeProvider } from "~/components/builder/ThemeProvider";
import { loadBuilderCatalog } from "~/services/builder-data.server";
import { getThemeForShop } from "~/services/theme.server";

export async function loader({ request }: LoaderFunctionArgs) {
  console.log("🔍 [PREVIEW] Loading builder preview...");

  const { session } = await authenticate.admin(request);
  console.log("✅ [PREVIEW] Authenticated for shop:", session.shop);

  const [catalog, theme] = await Promise.all([
    loadBuilderCatalog({
      settingsLimit: 12,
      diamondsLimit: 18,
    }),
    getThemeForShop(session.shop),
  ]);

  console.log("✅ [PREVIEW] Loaded catalog:", {
    settings: catalog.settings.length,
    diamonds: catalog.diamonds.length,
  });

  return {
    shop: session.shop,
    catalog,
    theme,
  };
}

export default function BuilderPreviewPage() {
  const { shop, catalog, theme } = useLoaderData<typeof loader>();

  console.log("🎨 [PREVIEW] Rendering BuilderApp with:", {
    shop,
    settingsCount: catalog.settings.length,
    diamondsCount: catalog.diamonds.length,
  });

  return (
    <div style={{ padding: "20px", background: "#f9fafb", minHeight: "100vh" }}>
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          background: "white",
          padding: "20px",
          borderRadius: "12px",
          marginBottom: "20px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        <h1 style={{ margin: "0 0 8px", fontSize: "24px", fontWeight: 700 }}>
          💍 Ring Builder - Customer Preview
        </h1>
        <p style={{ margin: 0, color: "#6b7280", fontSize: "14px" }}>
          This is how customers will experience the ring builder on your
          storefront. Make sure you have at least 1 Setting and 1 Stone marked
          with complete metadata!
        </p>
      </div>

      <ThemeProvider theme={theme}>
        <BuilderApp
          shop={shop}
          settings={catalog.settings}
          diamonds={catalog.diamonds}
        />
      </ThemeProvider>
    </div>
  );
}
