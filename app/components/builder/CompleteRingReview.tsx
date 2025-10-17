import React, { useState } from "react";
import { useBuilder } from "./BuilderProvider";

export function CompleteRingReview() {
  const { selectedSetting, selectedStone, viewDetailSetting, viewDetailStone, priceBreakdown } = useBuilder();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const setting = selectedSetting || viewDetailSetting;
  const stone = selectedStone || viewDetailStone;

  if (!setting) {
    return (
      <div className="review-empty">
        <p>Please select a ring setting to continue.</p>
      </div>
    );
  }

  if (!stone) {
    return (
      <div className="review-empty">
        <p>Please select a diamond to complete your ring.</p>
      </div>
    );
  }

  const isRingProduct = "url" in setting;
  const settingImages = isRingProduct ? setting.thumbnails : setting.images;
  const settingTitle = isRingProduct ? setting.title : setting.name;
  const settingSku = isRingProduct ? setting.sku : setting.sku || "";
  const settingPrice = isRingProduct ? (setting.price || 0) : setting.startingPrice;
  const stonePrice = stone.price;
  const totalPrice = settingPrice + stonePrice;

  return (
    <div className="complete-ring-review">
      <div className="review-container">
        <div className="review-left">
          <div className="ring-preview">
            <img
              src={settingImages[currentImageIndex] || "/placeholder-ring.png"}
              alt={settingTitle}
              className="preview-image"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/placeholder-ring.png";
              }}
            />
          </div>

          {settingImages.length > 1 && (
            <div className="thumbnail-container">
              {settingImages.map((img, index) => (
                <button
                  key={index}
                  className={`thumbnail ${index === currentImageIndex ? "active" : ""}`}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <img
                    src={img}
                    alt={`View ${index + 1}`}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder-ring.png";
                    }}
                  />
                </button>
              ))}
            </div>
          )}

          <div className="sku-line">SKU# {settingSku}</div>

          <div className="note-text">
            NOTE: All metal color images may not be available.
          </div>
        </div>

        <div className="review-right">
          <div className="detail-header">
            <h1 className="detail-title">{settingTitle}</h1>
            <button className="spec-button">📋 Specification</button>
          </div>

          {!isRingProduct && setting.description && (
            <p className="detail-description">{setting.description}</p>
          )}

          <div className="setting-details">
            <div className="detail-row">
              <label>Metal Type</label>
              <span>14K White Gold</span>
            </div>
            <div className="detail-row">
              <label>Side Stone Quality</label>
              <span>[1] H-I</span>
            </div>
            <div className="detail-row">
              <label>Center Stone Size</label>
              <span>0.66 - 0.85</span>
            </div>
            <div className="detail-row">
              <label>Ring Size</label>
              <span>7</span>
            </div>
          </div>

          <div className="price-row">
            <span className="price-label">Setting Price:</span>
            <span className="price-value">${settingPrice.toLocaleString()}</span>
          </div>

          <div className="divider"></div>

          <div className="diamond-section">
            <h2 className="section-title">
              {stone.carat} Carat {stone.shape.charAt(0).toUpperCase() + stone.shape.slice(1)} Diamond
            </h2>

            <div className="diamond-sku">SKU# {stone.id}</div>

            <p className="diamond-description">
              This {stone.color} color, {stone.clarity} clarity diamond comes accompanied by a diamond grading report from {stone.certificate || "GIA"}.
            </p>

            <div className="diamond-specs">
              <div className="spec-row">
                <div className="spec-item">
                  <label>Report:</label>
                  <span>{stone.certificate || "GIA"}</span>
                </div>
                <div className="spec-item">
                  <label>Color:</label>
                  <span>{stone.color}</span>
                </div>
              </div>
              <div className="spec-row">
                <div className="spec-item">
                  <label>Cut:</label>
                  <span>{stone.cut}</span>
                </div>
                <div className="spec-item">
                  <label>Clarity:</label>
                  <span>{stone.clarity}</span>
                </div>
              </div>
            </div>

            <div className="price-row">
              <span className="price-label">Diamond Price:</span>
              <span className="price-value">${stonePrice.toLocaleString()}</span>
            </div>
          </div>

          <div className="action-buttons-grid">
            <button className="action-btn">
              ❓ Request More Info
            </button>
            <button className="action-btn">
              📅 Schedule Viewing
            </button>
          </div>

          <div className="total-section">
            <div className="total-price">
              <span className="total-label">Total:</span>
              <span className="total-value">${totalPrice.toLocaleString()}</span>
            </div>
          </div>

          <button className="add-to-cart-button">
            Add To Cart
          </button>
        </div>
      </div>

      <style>{`
        .complete-ring-review {
          width: 100%;
          padding: 20px;
        }

        .review-empty {
          text-align: center;
          padding: 60px 20px;
          font-size: 18px;
          color: #666;
        }

        .review-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .review-left {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .ring-preview {
          background: #f5f5f5;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 450px;
        }

        .preview-image {
          max-width: 100%;
          max-height: 500px;
          object-fit: contain;
        }

        .thumbnail-container {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .thumbnail {
          width: 70px;
          height: 70px;
          border: 2px solid #e0e0e0;
          border-radius: 6px;
          background: white;
          cursor: pointer;
          padding: 8px;
          transition: border-color 0.2s;
        }

        .thumbnail:hover {
          border-color: #7c2d5e;
        }

        .thumbnail.active {
          border-color: #7c2d5e;
          border-width: 3px;
        }

        .thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .sku-line {
          text-align: center;
          font-size: 16px;
          font-weight: 600;
          color: #333;
          padding: 12px;
          background: #f9f9f9;
          border-radius: 6px;
        }

        .note-text {
          font-size: 13px;
          color: #666;
          font-style: italic;
          text-align: center;
        }

        .review-right {
          display: flex;
          flex-direction: column;
          gap: 20px;
          padding-right: 40px;
        }

        .detail-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 20px;
        }

        .detail-title {
          font-size: 26px;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0;
          flex: 1;
        }

        .spec-button {
          background: white;
          border: 1px solid #7c2d5e;
          color: #7c2d5e;
          padding: 8px 16px;
          border-radius: 4px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          white-space: nowrap;
        }

        .spec-button:hover {
          background: #f9f4f7;
        }

        .detail-description {
          font-size: 15px;
          line-height: 1.6;
          color: #555;
          margin: 0;
        }

        .setting-details {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 16px 0;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .detail-row label {
          font-size: 15px;
          font-weight: 600;
          color: #333;
        }

        .detail-row span {
          font-size: 15px;
          color: #555;
        }

        .price-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
        }

        .price-label {
          font-size: 18px;
          font-weight: 600;
          color: #333;
        }

        .price-value {
          font-size: 20px;
          font-weight: 700;
          color: #1a1a1a;
        }

        .divider {
          height: 2px;
          background: #e0e0e0;
          margin: 16px 0;
        }

        .diamond-section {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .section-title {
          font-size: 22px;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0;
        }

        .diamond-sku {
          font-size: 14px;
          color: #666;
        }

        .diamond-description {
          font-size: 14px;
          line-height: 1.6;
          color: #555;
          margin: 0;
        }

        .diamond-specs {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .spec-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .spec-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px;
          background: #f9f9f9;
          border-radius: 4px;
        }

        .spec-item label {
          font-size: 14px;
          font-weight: 600;
          color: #333;
        }

        .spec-item span {
          font-size: 14px;
          color: #555;
        }

        .action-buttons-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-top: 8px;
        }

        .action-btn {
          padding: 10px 16px;
          border: 1px solid #7c2d5e;
          background: white;
          color: #7c2d5e;
          border-radius: 4px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          text-align: center;
        }

        .action-btn:hover {
          background: #f9f4f7;
        }

        .total-section {
          background: #f9f9f9;
          padding: 20px;
          border-radius: 6px;
          margin-top: 12px;
        }

        .total-price {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .total-label {
          font-size: 24px;
          font-weight: 700;
          color: #333;
        }

        .total-value {
          font-size: 32px;
          font-weight: 700;
          color: #7c2d5e;
        }

        .add-to-cart-button {
          width: 100%;
          padding: 18px 24px;
          background: #7c2d5e;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 18px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
          margin-top: 12px;
        }

        .add-to-cart-button:hover {
          background: #63244a;
        }

        @media (max-width: 1024px) {
          .review-container {
            grid-template-columns: 1fr;
            gap: 30px;
          }

          .review-right {
            padding-right: 20px;
          }

          .action-buttons-grid {
            grid-template-columns: 1fr;
          }

          .spec-row {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .review-right {
            padding-right: 0;
          }
        }
      `}</style>
    </div>
  );
}
