/**
 * PUBLIC STOREFRONT ROUTE - Diamond Detail Page
 *
 * Displays detailed information about a specific diamond/stone.
 * Accessible at: /builder/diamond/:id?shop=your-store.myshopify.com
 *
 * Features:
 * - Full diamond details with high-res images
 * - Complete 4Cs specifications
 * - Certificate information and viewer
 * - Measurements and advanced specs
 * - Action buttons (Drop Hint, Request Info, etc.)
 * - "Complete Your Ring" CTA
 * - SEO optimized with Open Graph tags
 */

import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { useLoaderData, useNavigate } from "react-router";
import { getStone } from "~/services/product.server";
import { formatPrice } from "~/utils/formatters";
import { useState } from "react";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop");
  const diamondId = params.id;

  if (!shop) {
    throw new Response("Shop parameter required", { status: 400 });
  }

  if (!diamondId) {
    throw new Response("Diamond ID required", { status: 400 });
  }

  const diamond = await getStone(diamondId, shop);

  if (!diamond) {
    throw new Response("Diamond not found", { status: 404 });
  }

  return {
    shop,
    diamond,
  };
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data || !data.diamond) {
    return [
      { title: "Diamond Not Found" },
      { name: "description", content: "This diamond could not be found." },
    ];
  }

  const { diamond } = data;
  const mainImage =
    diamond.images && diamond.images.length > 0 ? diamond.images[0] : "";
  const description = `${diamond.carat}ct ${diamond.shape} ${diamond.color} ${diamond.clarity} diamond. ${diamond.cut} cut. ${diamond.certificate || "Certified"}. ${formatPrice(diamond.price)}`;

  return [
    { title: `${diamond.carat}ct ${diamond.shape} Diamond - Build Your Ring` },
    { name: "description", content: description },

    // Open Graph tags for social sharing
    {
      property: "og:title",
      content: `${diamond.carat}ct ${diamond.shape} Diamond`,
    },
    { property: "og:description", content: description },
    { property: "og:image", content: mainImage },
    { property: "og:type", content: "product" },

    // Twitter Card tags
    { name: "twitter:card", content: "summary_large_image" },
    {
      name: "twitter:title",
      content: `${diamond.carat}ct ${diamond.shape} Diamond`,
    },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: mainImage },
  ];
};

export default function DiamondDetailPage() {
  const { shop, diamond } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const [showCertificate, setShowCertificate] = useState(false);

  // Main image (first in array or placeholder)
  const mainImage =
    diamond.images && diamond.images.length > 0
      ? diamond.images[0]
      : "https://via.placeholder.com/600x600?text=Diamond";

  // Check if certificate is available
  const hasCertificate =
    diamond.certificate &&
    diamond.certificate !== "none" &&
    diamond.certificateUrl;

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
            background: #f9fafb;
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

          /* Certificate Badge */
          .certificate-badge {
            display: inline-block;
            padding: 6px 12px;
            background: #10b981;
            color: white;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            margin-top: 8px;
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

          .product-subtitle {
            font-size: 18px;
            color: #666;
            margin-bottom: 4px;
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

          .price-per-carat {
            font-size: 14px;
            color: #666;
            margin-top: 4px;
          }

          .diamond-type-badge {
            display: inline-block;
            padding: 8px 16px;
            background: #6D2932;
            color: white;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 600;
            text-transform: uppercase;
          }

          .diamond-type-badge.lab_grown {
            background: #10b981;
          }

          .diamond-type-badge.fancy_color {
            background: #8b5cf6;
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

          @media (max-width: 480px) {
            .specs-grid {
              grid-template-columns: 1fr;
            }
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

          .spec-value.excellent {
            color: #10b981;
          }

          .spec-value.very-good {
            color: #3b82f6;
          }

          /* Certificate Section */
          .certificate-section {
            border-top: 1px solid #e5e5e5;
            padding-top: 24px;
          }

          .certificate-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
          }

          .certificate-info {
            display: flex;
            flex-direction: column;
            gap: 4px;
          }

          .certificate-number {
            font-size: 14px;
            color: #666;
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

          .btn-certificate {
            background: #10b981;
            color: white;
          }

          .btn-certificate:hover {
            background: #059669;
          }

          /* Certificate Modal */
          .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            z-index: 1000;
            align-items: center;
            justify-content: center;
            padding: 20px;
          }

          .modal.show {
            display: flex;
          }

          .modal-content {
            background: white;
            border-radius: 8px;
            max-width: 900px;
            width: 100%;
            max-height: 90vh;
            overflow: auto;
            position: relative;
          }

          .modal-header {
            padding: 20px;
            border-bottom: 1px solid #e5e5e5;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .modal-title {
            font-size: 20px;
            font-weight: 600;
          }

          .modal-close {
            background: none;
            border: none;
            font-size: 28px;
            cursor: pointer;
            color: #666;
            padding: 0;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .modal-close:hover {
            color: #000;
          }

          .modal-body {
            padding: 20px;
          }

          .certificate-iframe {
            width: 100%;
            height: 70vh;
            border: none;
          }

          /* Availability Badge */
          .availability {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 6px 12px;
            border-radius: 4px;
            font-size: 13px;
            font-weight: 600;
          }

          .availability.available {
            background: #d1fae5;
            color: #065f46;
          }

          .availability.unavailable {
            background: #fee2e2;
            color: #991b1b;
          }

          .availability-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
          }

          .availability.available .availability-dot {
            background: #10b981;
          }

          .availability.unavailable .availability-dot {
            background: #ef4444;
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
                alt={`${diamond.carat}ct ${diamond.shape} diamond`}
                className="main-image"
                loading="eager"
              />

              {diamond.images && diamond.images.length > 1 && (
                <div className="thumbnail-strip">
                  {diamond.images.map((image: string, index: number) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Diamond view ${index + 1}`}
                      className={`thumbnail ${index === 0 ? "active" : ""}`}
                      loading="lazy"
                    />
                  ))}
                </div>
              )}

              {diamond.certificate && diamond.certificate !== "none" && (
                <div className="certificate-badge">
                  {diamond.certificate.toUpperCase()} Certified
                </div>
              )}
            </div>

            {/* Info Section */}
            <div className="info-section">
              <div>
                <h1 className="product-title">
                  {diamond.carat}ct {diamond.shape} Diamond
                </h1>
                <p className="product-subtitle">
                  {diamond.color} Color · {diamond.clarity} Clarity ·{" "}
                  {diamond.cut} Cut
                </p>
                <p className="product-sku">SKU: {diamond.id.slice(0, 12)}</p>
              </div>

              <div>
                <div
                  className={`availability ${diamond.available ? "available" : "unavailable"}`}
                >
                  <span className="availability-dot"></span>
                  {diamond.available ? "Available" : "Not Available"}
                </div>
              </div>

              <div>
                <div className="price">{formatPrice(diamond.price)}</div>
                <div className="price-per-carat">
                  {formatPrice(diamond.price / diamond.carat)} per carat
                </div>
              </div>

              <div>
                <span className={`diamond-type-badge ${diamond.diamondType}`}>
                  {diamond.diamondType === "lab_grown"
                    ? "Lab Grown"
                    : diamond.diamondType === "fancy_color"
                      ? "Fancy Color"
                      : "Natural Mined"}
                </span>
              </div>

              {/* The 4Cs Specifications */}
              <div className="specs-section">
                <h2 className="specs-title">The 4Cs</h2>
                <div className="specs-grid">
                  <div className="spec-item">
                    <span className="spec-label">Carat Weight</span>
                    <span className="spec-value">{diamond.carat} ct</span>
                  </div>

                  <div className="spec-item">
                    <span className="spec-label">Cut Grade</span>
                    <span
                      className={`spec-value ${diamond.cut === "excellent" ? "excellent" : diamond.cut === "very_good" ? "very-good" : ""}`}
                    >
                      {diamond.cut}
                    </span>
                  </div>

                  <div className="spec-item">
                    <span className="spec-label">Color</span>
                    <span className="spec-value">
                      {diamond.color?.toUpperCase() || "N/A"}
                    </span>
                  </div>

                  <div className="spec-item">
                    <span className="spec-label">Clarity</span>
                    <span className="spec-value">
                      {diamond.clarity?.toUpperCase() || "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Advanced Specifications */}
              <div className="specs-section">
                <h2 className="specs-title">Additional Details</h2>
                <div className="specs-grid">
                  <div className="spec-item">
                    <span className="spec-label">Shape</span>
                    <span className="spec-value">{diamond.shape}</span>
                  </div>

                  {diamond.measurements && (
                    <div className="spec-item">
                      <span className="spec-label">Measurements</span>
                      <span className="spec-value">{diamond.measurements}</span>
                    </div>
                  )}

                  {diamond.tablePercent && (
                    <div className="spec-item">
                      <span className="spec-label">Table %</span>
                      <span className="spec-value">
                        {diamond.tablePercent}%
                      </span>
                    </div>
                  )}

                  {diamond.depthPercent && (
                    <div className="spec-item">
                      <span className="spec-label">Depth %</span>
                      <span className="spec-value">
                        {diamond.depthPercent}%
                      </span>
                    </div>
                  )}

                  {diamond.polish && (
                    <div className="spec-item">
                      <span className="spec-label">Polish</span>
                      <span className="spec-value">{diamond.polish}</span>
                    </div>
                  )}

                  {diamond.symmetry && (
                    <div className="spec-item">
                      <span className="spec-label">Symmetry</span>
                      <span className="spec-value">{diamond.symmetry}</span>
                    </div>
                  )}

                  {diamond.fluorescence && (
                    <div className="spec-item">
                      <span className="spec-label">Fluorescence</span>
                      <span className="spec-value">{diamond.fluorescence}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Certificate Section */}
              {hasCertificate && (
                <div className="certificate-section">
                  <div className="certificate-header">
                    <div className="certificate-info">
                      <h3 className="specs-title" style={{ marginBottom: 0 }}>
                        Certificate
                      </h3>
                      {diamond.certificateNumber && (
                        <span className="certificate-number">
                          {diamond.certificate?.toUpperCase()} #
                          {diamond.certificateNumber}
                        </span>
                      )}
                    </div>
                    <button
                      className="btn btn-certificate"
                      onClick={() => setShowCertificate(true)}
                      style={{ padding: "10px 20px", fontSize: "14px" }}
                    >
                      View Certificate
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="button-group">
                {diamond.available && (
                  <button
                    className="btn btn-primary"
                    onClick={() =>
                      navigate(`/builder?shop=${shop}&stoneId=${diamond.id}`)
                    }
                  >
                    Complete Your Ring →
                  </button>
                )}

                <button
                  className="btn btn-secondary"
                  onClick={() => navigate(`/builder?shop=${shop}`)}
                >
                  View All Diamonds
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Certificate Modal */}
        {hasCertificate && (
          <div
            className={`modal ${showCertificate ? "show" : ""}`}
            onClick={() => setShowCertificate(false)}
          >
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">
                  {diamond.certificate?.toUpperCase()} Certificate
                  {diamond.certificateNumber &&
                    ` #${diamond.certificateNumber}`}
                </h2>
                <button
                  className="modal-close"
                  onClick={() => setShowCertificate(false)}
                >
                  ×
                </button>
              </div>
              <div className="modal-body">
                <iframe
                  src={diamond.certificateUrl}
                  className="certificate-iframe"
                  title="Diamond Certificate"
                />
              </div>
            </div>
          </div>
        )}
      </body>
    </html>
  );
}
