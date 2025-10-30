/**
 * Ring Builder Preview - Admin Route
 *
 * Preview the customer-facing Ring Builder within the admin.
 * Access at: /app/builder/preview
 */

import type { LoaderFunctionArgs } from "react-router";
import { authenticate } from "~/shopify.server";
// import { BuilderApp } from "~/components/builder/BuilderApp";

export async function loader({ request }: LoaderFunctionArgs) {
  const { session } = await authenticate.admin(request);
  return { shop: session.shop };
}

export default function BuilderPreviewPage() {
  const shop = "builder-store-103.myshopify.com";

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

      <div style={{ padding: "40px", textAlign: "center", background: "white", borderRadius: "12px" }}>
        <h2>Ring Builder Preview - Under Reconstruction</h2>
        <p>Components are being rebuilt from scratch...</p>
      </div>
      {/* <BuilderApp shop={shop} /> */}
    </div>
  );
}
