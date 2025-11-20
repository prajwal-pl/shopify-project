/**
 * Embed Code Generator - Admin Page
 *
 * Helps merchants embed Ring Builder on external sites (WordPress, custom HTML, etc.)
 * Provides iframe code, shortcodes, and setup instructions
 */

import { useState } from "react";
import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import { authenticate } from "~/shopify.server";
import prisma from "~/db.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const { session } = await authenticate.admin(request);
  const { shop } = session;

  // Get merchant tenant ID
  const merchant = await prisma.merchant.findUnique({
    where: { shop },
    select: { id: true, shop: true },
  });

  // Get app base URL from environment or request
  const url = new URL(request.url);
  const baseUrl = process.env.SHOPIFY_APP_URL || `${url.protocol}//${url.host}`;

  return {
    shop,
    tenantId: merchant?.id || null,
    embedUrl: baseUrl,
  };
}

export default function EmbedCodeGenerator() {
  const { shop, tenantId, embedUrl } = useLoaderData<typeof loader>();
  const [copied, setCopied] = useState<string | null>(null);
  const [iframeHeight, setIframeHeight] = useState(800);

  const embedParameter = tenantId ? `tenantId=${tenantId}` : `shop=${shop}`;
  const embedFullUrl = `${embedUrl}/embed/builder?${embedParameter}`;

  const iframeCode = `<!-- Ring Builder Embed Code -->
<iframe
  src="${embedFullUrl}"
  style="width: 100%; min-height: ${iframeHeight}px; border: none; border-radius: 8px;"
  title="Ring Builder"
  id="ring-builder-iframe"
  scrolling="no"
></iframe>

<script>
  // Auto-resize iframe based on content
  window.addEventListener('message', function(e) {
    if (e.data.type === 'ring-builder-resize') {
      const iframe = document.getElementById('ring-builder-iframe');
      if (iframe) {
        iframe.style.height = e.data.height + 'px';
      }
    }
  });
</script>`;

  const wordpressShortcode = `[ring_builder url="${embedFullUrl}"]`;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(label);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      {/* Header */}
      <div style={{ marginBottom: "30px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "600", marginBottom: "8px" }}>
          Embed Ring Builder
        </h1>
        <p style={{ color: "#6d7175", fontSize: "14px" }}>
          Add the Ring Builder to WordPress, custom websites, or any webpage
        </p>
      </div>

      {/* Live Preview */}
      <div style={{ marginBottom: "40px" }}>
        <h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "16px" }}>
          Live Preview
        </h2>
        <div
          style={{
            border: "2px solid #e1e3e5",
            borderRadius: "8px",
            overflow: "hidden",
            background: "#f6f6f7",
          }}
        >
          <iframe
            src={embedFullUrl}
            style={{
              width: "100%",
              height: "600px",
              border: "none",
            }}
            title="Ring Builder Preview"
          />
        </div>
      </div>

      {/* HTML/iFrame Code */}
      <div style={{ marginBottom: "40px" }}>
        <h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "16px" }}>
          HTML Embed Code
        </h2>
        <p style={{ color: "#6d7175", marginBottom: "12px", fontSize: "14px" }}>
          Copy this code and paste it into any HTML page:
        </p>

        <div
          style={{
            position: "relative",
            background: "#1e1e1e",
            color: "#d4d4d4",
            padding: "20px",
            borderRadius: "8px",
            marginBottom: "16px",
          }}
        >
          <pre
            style={{
              margin: 0,
              fontSize: "13px",
              fontFamily: "monospace",
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
            }}
          >
            {iframeCode}
          </pre>
          <button
            onClick={() => copyToClipboard(iframeCode, "iframe")}
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              background: copied === "iframe" ? "#00A67E" : "#2c6ecb",
              color: "white",
              border: "none",
              padding: "8px 16px",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: "500",
            }}
          >
            {copied === "iframe" ? "✓ Copied!" : "Copy Code"}
          </button>
        </div>

        {/* Customization Options */}
        <div style={{ marginBottom: "16px" }}>
          <label
            style={{
              display: "block",
              fontSize: "14px",
              fontWeight: "500",
              marginBottom: "6px",
            }}
          >
            Iframe Height (pixels)
          </label>
          <input
            type="number"
            value={iframeHeight}
            onChange={(e) => setIframeHeight(parseInt(e.target.value) || 800)}
            min="400"
            max="2000"
            step="50"
            style={{
              width: "150px",
              padding: "8px 12px",
              border: "1px solid #c9cccf",
              borderRadius: "6px",
              fontSize: "14px",
            }}
          />
          <p
            style={{
              color: "#6d7175",
              fontSize: "12px",
              marginTop: "4px",
            }}
          >
            Minimum recommended: 600px. Auto-resize script will adjust height dynamically.
          </p>
        </div>

        {/* HTML Instructions */}
        <div
          style={{
            background: "#f6f6f7",
            padding: "20px",
            borderRadius: "8px",
          }}
        >
          <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "12px" }}>
            🌐 For Custom HTML Sites
          </h3>
          <ol
            style={{
              margin: 0,
              paddingLeft: "20px",
              color: "#202223",
              fontSize: "14px",
              lineHeight: "1.8",
            }}
          >
            <li>Copy the HTML code above</li>
            <li>
              Open your HTML file or page editor where you want the Ring Builder
            </li>
            <li>Paste the code in the desired location</li>
            <li>Save and publish your page</li>
            <li>Test the page to ensure the Ring Builder loads correctly</li>
          </ol>
        </div>
      </div>

      {/* WordPress Integration */}
      <div style={{ marginBottom: "40px" }}>
        <h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "16px" }}>
          WordPress Integration
        </h2>
        <p style={{ color: "#6d7175", marginBottom: "12px", fontSize: "14px" }}>
          For WordPress sites, you have two options:
        </p>

        {/* Option 1: Custom HTML Block */}
        <div
          style={{
            background: "#f6f6f7",
            padding: "20px",
            borderRadius: "8px",
            marginBottom: "16px",
          }}
        >
          <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "12px" }}>
            📝 Option 1: Custom HTML Block (Recommended)
          </h3>
          <ol
            style={{
              margin: 0,
              paddingLeft: "20px",
              color: "#202223",
              fontSize: "14px",
              lineHeight: "1.8",
            }}
          >
            <li>Create a new page in WordPress (e.g., "Design Your Ring")</li>
            <li>Click the "+" button to add a block</li>
            <li>Search for and select "Custom HTML" block</li>
            <li>Paste the HTML embed code from above</li>
            <li>Click "Publish" or "Update"</li>
            <li>Add the page to your navigation menu</li>
          </ol>
        </div>

        {/* Option 2: Shortcode */}
        <div
          style={{
            background: "#f6f6f7",
            padding: "20px",
            borderRadius: "8px",
          }}
        >
          <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "12px" }}>
            ⚡ Option 2: Shortcode (Requires Plugin)
          </h3>
          <p style={{ color: "#6d7175", fontSize: "13px", marginBottom: "12px" }}>
            If you have a shortcode plugin installed:
          </p>

          <div
            style={{
              position: "relative",
              background: "#1e1e1e",
              color: "#d4d4d4",
              padding: "15px",
              borderRadius: "6px",
              marginBottom: "12px",
            }}
          >
            <pre
              style={{
                margin: 0,
                fontSize: "13px",
                fontFamily: "monospace",
              }}
            >
              {wordpressShortcode}
            </pre>
            <button
              onClick={() => copyToClipboard(wordpressShortcode, "shortcode")}
              style={{
                position: "absolute",
                top: "8px",
                right: "8px",
                background: copied === "shortcode" ? "#00A67E" : "#2c6ecb",
                color: "white",
                border: "none",
                padding: "6px 12px",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: "500",
              }}
            >
              {copied === "shortcode" ? "✓ Copied!" : "Copy"}
            </button>
          </div>

          <p style={{ color: "#6d7175", fontSize: "13px" }}>
            Note: You'll need to configure your shortcode plugin to accept and render
            iframe embeds.
          </p>
        </div>
      </div>

      {/* Technical Details */}
      <div
        style={{
          background: "#f0f7ff",
          border: "1px solid #b3d9ff",
          padding: "20px",
          borderRadius: "8px",
        }}
      >
        <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "12px" }}>
          📋 Technical Details
        </h3>
        <div style={{ fontSize: "13px", color: "#202223", lineHeight: "1.8" }}>
          <p>
            <strong>Embed URL:</strong>{" "}
            <code
              style={{
                background: "#e1e3e5",
                padding: "2px 6px",
                borderRadius: "3px",
                fontSize: "12px",
              }}
            >
              {embedFullUrl}
            </code>
          </p>
          <p>
            <strong>Tenant ID:</strong>{" "}
            <code
              style={{
                background: "#e1e3e5",
                padding: "2px 6px",
                borderRadius: "3px",
                fontSize: "12px",
              }}
            >
              {tenantId || "Using shop parameter"}
            </code>
          </p>
          <p>
            <strong>Auto-Resize:</strong> Enabled (iframe height adjusts to content)
          </p>
          <p>
            <strong>Theme:</strong> Uses your theme settings from the Settings page
          </p>
          <p>
            <strong>Cross-Origin:</strong> Enabled for embedding on any domain
          </p>
        </div>
      </div>

      <style>{`
        h1, h2, h3 {
          color: #202223;
        }

        code {
          font-family: 'Courier New', monospace;
        }

        button:hover {
          opacity: 0.9;
        }

        button:active {
          transform: translateY(1px);
        }
      `}</style>
    </div>
  );
}
