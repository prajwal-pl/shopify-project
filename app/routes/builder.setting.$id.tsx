/**
 * PUBLIC STOREFRONT ROUTE - Setting Detail Page
 *
 * Displays detailed information about a specific ring setting.
 * Accessible at: /builder/setting/:id?shop=your-store.myshopify.com
 *
 * Features:
 * - Full product details with images
 * - Specifications panel
 * - Metal type selector
 * - Price display
 * - Action buttons (VTO, Share, Inquire)
 * - "Add Your Diamond" CTA
 * - SEO optimized with Open Graph tags
 */

import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { useLoaderData, useNavigate } from "react-router";
import { getSetting } from "~/services/product.server";
import { formatPrice } from "~/utils/formatters";
import { useState } from "react";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop");
  const settingId = params.id;

  if (!shop) {
    throw new Response("Shop parameter required", { status: 400 });
  }

  if (!settingId) {
    throw new Response("Setting ID required", { status: 400 });
  }

  const setting = await getSetting(settingId, shop);

  if (!setting) {
    throw new Response("Setting not found", { status: 404 });
  }

  return {
    shop,
    setting,
  };
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data || !data.setting) {
    return [
      { title: "Setting Not Found" },
      { name: "description", content: "This setting could not be found." },
    ];
  }

  const { setting } = data;
  const mainImage =
    setting.images && setting.images.length > 0 ? setting.images[0] : "";
  const description = `${setting.style} setting in multiple metals. Starting at ${formatPrice(setting.startingPrice)}`;

  return [
    { title: `${setting.style} Ring Setting - Build Your Ring` },
    { name: "description", content: description },

    // Open Graph tags for social sharing
    { property: "og:title", content: `${setting.style} Ring Setting` },
    { property: "og:description", content: description },
    { property: "og:image", content: mainImage },
    { property: "og:type", content: "product" },

    // Twitter Card tags
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: `${setting.style} Ring Setting` },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: mainImage },
  ];
};

export default function SettingDetailPage() {
  const { shop, setting } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const [selectedMetal, setSelectedMetal] = useState<string>("14k_white_gold");

  // Get current price for selected metal
  const currentPrice =
    (setting.basePrices as Record<string, number>)[selectedMetal] ||
    setting.startingPrice;

  // Main image (first in array or placeholder)
  const mainImage =
    setting.images && setting.images.length > 0
      ? setting.images[0]
      : "https://via.placeholder.com/600x600?text=No+Image";

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>{`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            background: #ffffff;
            color: #202223;
            line-height: 1.6;
          }

          .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
          }

          .breadcrumb {
            margin-bottom: 20px;
            font-size: 14px;
            color: #666;
          }

          .breadcrumb a {
            color: #d4af37;
            text-decoration: none;
          }

          .breadcrumb a:hover {
            text-decoration: underline;
          }

          .detail-layout {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
            margin-bottom: 40px;
          }

          @media (max-width: 768px) {
            .detail-layout {
              grid-template-columns: 1fr;
              gap: 20px;
            }
          }

          /* Image Section */
          .image-section {
            position: sticky;
            top: 20px;
            height: fit-content;
          }

          .main-image {
            width: 100%;
            height: auto;
            border-radius: 8px;
            border: 1px solid #e5e5e5;
            margin-bottom: 16px;
          }

          .thumbnail-strip {
            display: flex;
            gap: 8px;
            overflow-x: auto;
            padding-bottom: 8px;
          }

          .thumbnail {
            width: 80px;
            height: 80px;
            border-radius: 4px;
            border: 2px solid #e5e5e5;
            cursor: pointer;
            transition: border-color 0.2s;
            object-fit: cover;
            flex-shrink: 0;
          }

          .thumbnail:hover,
          .thumbnail.active {
            border-color: #d4af37;
          }

          /* Info Section */
          .info-section {
            display: flex;
            flex-direction: column;
            gap: 24px;
          }

          .product-title {
            font-size: 32px;
            font-weight: 600;
            color: #000000;
            margin-bottom: 8px;
          }

          .product-sku {
            font-size: 14px;
            color: #666;
          }

          .price {
            font-size: 36px;
            font-weight: 700;
            color: #d4af37;
          }

          .price-label {
            font-size: 14px;
            color: #666;
            margin-top: 4px;
          }

          /* Metal Selector */
          .selector-group {
            border-top: 1px solid #e5e5e5;
            padding-top: 24px;
          }

          .selector-label {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 12px;
            display: block;
          }

          .metal-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }

          @media (max-width: 480px) {
            .metal-grid {
              grid-template-columns: 1fr;
            }
          }

          .metal-option {
            padding: 12px 16px;
            border: 2px solid #e5e5e5;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.2s;
            background: #ffffff;
            text-align: center;
            font-size: 14px;
          }

          .metal-option:hover {
            border-color: #d4af37;
            background: #fff9e6;
          }

          .metal-option.selected {
            border-color: #d4af37;
            background: #fff9e6;
            font-weight: 600;
          }

          .metal-name {
            display: block;
            margin-bottom: 4px;
          }

          .metal-price {
            font-size: 12px;
            color: #666;
          }

          /* Specifications */
          .specs-section {
            border-top: 1px solid #e5e5e5;
            padding-top: 24px;
          }

          .specs-title {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 16px;
          }

          .specs-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
          }

          .spec-item {
            display: flex;
            flex-direction: column;
          }

          .spec-label {
            font-size: 12px;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 4px;
          }

          .spec-value {
            font-size: 15px;
            font-weight: 500;
            color: #000000;
          }

          /* Buttons */
          .button-group {
            display: flex;
            flex-direction: column;
            gap: 12px;
            border-top: 1px solid #e5e5e5;
            padding-top: 24px;
          }

          .btn {
            padding: 14px 24px;
            border-radius: 6px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            border: none;
            text-align: center;
            text-decoration: none;
            display: block;
          }

          .btn-primary {
            background: #d4af37;
            color: #000000;
          }

          .btn-primary:hover {
            background: #c29d2e;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
          }

          .btn-secondary {
            background: transparent;
            color: #000000;
            border: 2px solid #e5e5e5;
          }

          .btn-secondary:hover {
            border-color: #d4af37;
            background: #fff9e6;
          }

          .compatible-shapes {
            border-top: 1px solid #e5e5e5;
            padding-top: 24px;
          }

          .shapes-title {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 12px;
          }

          .shapes-list {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
          }

          .shape-badge {
            padding: 6px 12px;
            background: #f3f4f6;
            border-radius: 4px;
            font-size: 13px;
            text-transform: capitalize;
          }

          .description {
            font-size: 15px;
            line-height: 1.8;
            color: #333;
          }
        `}</style>
      </head>
      <body>
        <div className="container">
          {/* Breadcrumb */}
          <div className="breadcrumb">
            <a href={`/builder?shop=${shop}`}>← Back to Ring Builder</a>
          </div>

          {/* Main Layout */}
          <div className="detail-layout">
            {/* Image Section */}
            <div className="image-section">
              <img
                src={mainImage}
                alt={`${setting.style} setting`}
                className="main-image"
                loading="eager"
              />

              {setting.images && setting.images.length > 1 && (
                <div className="thumbnail-strip">
                  {setting.images.map((image: string, index: number) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${setting.style} view ${index + 1}`}
                      className={`thumbnail ${index === 0 ? "active" : ""}`}
                      loading="lazy"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Info Section */}
            <div className="info-section">
              <div>
                <h1 className="product-title">{setting.style} Setting</h1>
                <p className="product-sku">SKU: {setting.id.slice(0, 12)}</p>
              </div>

              <div>
                <div className="price">{formatPrice(currentPrice)}</div>
                <div className="price-label">
                  Starting price for{" "}
                  {selectedMetal
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </div>
              </div>

              {/* Metal Selector */}
              <div className="selector-group">
                <label className="selector-label">Select Metal Type:</label>
                <div className="metal-grid">
                  {Object.entries(setting.basePrices).map(
                    ([metalType, price]) => (
                      <div
                        key={metalType}
                        className={`metal-option ${selectedMetal === metalType ? "selected" : ""}`}
                        onClick={() => setSelectedMetal(metalType)}
                      >
                        <span className="metal-name">
                          {metalType
                            .replace(/_/g, " ")
                            .replace(/\b\w/g, (l: string) => l.toUpperCase())}
                        </span>
                        <span className="metal-price">
                          {formatPrice(price as number)}
                        </span>
                      </div>
                    ),
                  )}
                </div>
              </div>

              {/* Specifications */}
              <div className="specs-section">
                <h2 className="specs-title">Specifications</h2>
                <div className="specs-grid">
                  <div className="spec-item">
                    <span className="spec-label">Style</span>
                    <span className="spec-value">{setting.style}</span>
                  </div>

                  {setting.settingHeight && (
                    <div className="spec-item">
                      <span className="spec-label">Setting Height</span>
                      <span className="spec-value">
                        {setting.settingHeight}
                      </span>
                    </div>
                  )}

                  <div className="spec-item">
                    <span className="spec-label">Metal Options</span>
                    <span className="spec-value">
                      {Object.keys(setting.basePrices).length} metals
                    </span>
                  </div>

                  {setting.featured && (
                    <div className="spec-item">
                      <span className="spec-label">Collection</span>
                      <span className="spec-value">Featured</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Compatible Shapes */}
              <div className="compatible-shapes">
                <h3 className="shapes-title">Compatible Diamond Shapes</h3>
                <div className="shapes-list">
                  {setting.compatibleShapes.map((shape: string) => (
                    <span key={shape} className="shape-badge">
                      {shape}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="button-group">
                <button
                  className="btn btn-primary"
                  onClick={() =>
                    navigate(`/builder?shop=${shop}&settingId=${setting.id}`)
                  }
                >
                  Add Your Diamond →
                </button>

                <button
                  className="btn btn-secondary"
                  onClick={() => navigate(`/builder?shop=${shop}`)}
                >
                  View All Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
