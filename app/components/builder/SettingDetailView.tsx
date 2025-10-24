import React, { useState } from "react";
import type { Setting, RingProduct } from "~/types/builder";
import { useBuilder } from "./BuilderProvider";
import type { MetalType } from "~/utils/constants";

interface SettingDetailViewProps {
  setting: Setting | RingProduct;
}

export function SettingDetailView({ setting }: SettingDetailViewProps) {
  const { hideDetailViews, goToStep, selectSetting } = useBuilder();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedMetalType, setSelectedMetalType] = useState<string>("14k_white_gold");

  const isRingProduct = "url" in setting;
  const images = isRingProduct ? setting.thumbnails : setting.images;
  const title = isRingProduct ? setting.title : setting.name;
  const sku = isRingProduct ? setting.sku : setting.sku || "";
  const description = isRingProduct ? setting.description : setting.description || "";
  const price = isRingProduct ? setting.price : setting.startingPrice;

  const handleAddYourDiamond = () => {
    const metalTypeMap: Record<string, string> = {
      "14K White Gold": "14k_white_gold",
      "14K Yellow Gold": "14k_yellow_gold",
      "14K Rose Gold": "14k_rose_gold",
      "18K White Gold": "18k_white_gold",
      "Platinum": "platinum",
    };
    const metalType = metalTypeMap[selectedMetalType] || "14k_white_gold";

    if (isRingProduct) {
      const convertedSetting: Setting = {
        id: setting.sku || setting.id,
        productId: setting.id,
        name: setting.title,
        description: setting.description || "",
        images: setting.thumbnails || [],
        sku: setting.sku,
        metalTypes: [metalType as any],
        basePrices: {
          "14k_white_gold": setting.price || 0,
          "14k_yellow_gold": setting.price || 0,
          "14k_rose_gold": setting.price || 0,
          "18k_white_gold": setting.price || 0,
          "18k_yellow_gold": setting.price || 0,
          "18k_rose_gold": setting.price || 0,
          "platinum": setting.price || 0,
        },
        startingPrice: setting.price || 0,
        available: true,
      };
      selectSetting(convertedSetting, metalType as any);
    } else {
      selectSetting(setting as Setting, metalType as any);
    }
    hideDetailViews();
  };

  const handleBack = () => {
    hideDetailViews();
  };

  return (
    <div className="setting-detail-view">
      <button className="back-button" onClick={handleBack}>
        ← Back to Settings
      </button>

      <div className="detail-container">
        <div className="detail-left">
          <div className="main-image-container">
            <img
              src={images[currentImageIndex] || "/placeholder-ring.png"}
              alt={title}
              className="main-image"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/placeholder-ring.png";
              }}
            />
          </div>

          {images.length > 1 && (
            <div className="thumbnail-container">
              {images.map((img, index) => (
                <button
                  key={index}
                  className={`thumbnail ${index === currentImageIndex ? "active" : ""}`}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <img
                    src={img}
                    alt={`${title} view ${index + 1}`}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder-ring.png";
                    }}
                  />
                </button>
              ))}
            </div>
          )}

          <div className="sku-line">SKU# {sku}</div>
        </div>

        <div className="detail-right">
          <div className="detail-header">
            <h1 className="detail-title">{title}</h1>
            <button className="spec-button">📋 Ring Specification</button>
          </div>

          {description && <p className="detail-description">{description}</p>}

          <div className="detail-options">
            <div className="option-row">
              <label>Metal Type</label>
              <select
                className="option-select"
                value={selectedMetalType}
                onChange={(e) => setSelectedMetalType(e.target.value)}
              >
                <option>14K White Gold</option>
                <option>14K Yellow Gold</option>
                <option>14K Rose Gold</option>
                <option>18K White Gold</option>
                <option>Platinum</option>
              </select>
            </div>

            <div className="option-row">
              <label>Side Stone Quality</label>
              <select className="option-select">
                <option>[1] H-I</option>
                <option>[2] G-H</option>
                <option>[3] F-G</option>
              </select>
            </div>

            <div className="option-row">
              <label>Center Stone Size</label>
              <select className="option-select">
                <option>0.75</option>
                <option>1.00</option>
                <option>1.25</option>
                <option>1.50</option>
              </select>
            </div>

            <div className="option-row">
              <label>Ring Size</label>
              <select className="option-select">
                <option>7 3/4</option>
                <option>6</option>
                <option>6 1/2</option>
                <option>7</option>
                <option>8</option>
              </select>
            </div>
          </div>

          <div className="note-text">
            NOTE: All metal color images may not be available.
          </div>

          <div className="action-buttons">
            <button className="action-btn secondary">
              🎁 Drop A Hint
            </button>
            <button className="action-btn secondary">
              ❓ Request More Info
            </button>
            <button className="action-btn secondary">
              ✉️ E-Mail A Friend
            </button>
            <button className="action-btn secondary">
              📅 Schedule Viewing
            </button>
          </div>

          <div className="price-section">
            {price !== null && <div className="detail-price">${price.toLocaleString()}</div>}
          </div>

          <div className="main-actions">
            <button className="primary-button" onClick={handleAddYourDiamond}>
              Add Your Diamond
            </button>
            <button className="secondary-button">
              Virtual Try On
            </button>
          </div>

          <div className="social-share">
            <button className="save-btn">💾 Save</button>
            <button className="share-btn">✖ Post</button>
            <button className="share-btn">📘 Share</button>
            <button className="share-btn">👍 Like</button>
          </div>
        </div>
      </div>

      <style>{`
        .setting-detail-view {
          width: 100%;
          padding: 20px;
        }

        .back-button {
          background: none;
          border: none;
          color: #7c2d5e;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          padding: 10px 0;
          margin-bottom: 20px;
        }

        .back-button:hover {
          text-decoration: underline;
        }

        .detail-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .detail-left {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .main-image-container {
          background: #f5f5f5;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 400px;
        }

        .main-image {
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

        .detail-right {
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

        .detail-options {
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding: 20px 0;
          border-top: 1px solid #e0e0e0;
          border-bottom: 1px solid #e0e0e0;
        }

        .option-row {
          display: grid;
          grid-template-columns: 180px 1fr;
          align-items: center;
          gap: 16px;
        }

        .option-row label {
          font-size: 15px;
          font-weight: 600;
          color: #333;
        }

        .option-select {
          padding: 10px 12px;
          border: 1px solid #d0d0d0;
          border-radius: 4px;
          font-size: 14px;
          background: white;
          cursor: pointer;
        }

        .option-select:focus {
          outline: none;
          border-color: #7c2d5e;
        }

        .note-text {
          font-size: 13px;
          color: #666;
          font-style: italic;
        }

        .action-buttons {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
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

        .price-section {
          padding: 16px 0;
        }

        .detail-price {
          font-size: 32px;
          font-weight: 700;
          color: #1a1a1a;
        }

        .main-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .primary-button {
          padding: 16px 24px;
          background: #7c2d5e;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        .primary-button:hover {
          background: #63244a;
        }

        .secondary-button {
          padding: 16px 24px;
          background: #9c5080;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        .secondary-button:hover {
          background: #7c4066;
        }

        .social-share {
          display: flex;
          gap: 12px;
          padding-top: 12px;
        }

        .save-btn, .share-btn {
          padding: 8px 16px;
          background: #dc3545;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 13px;
          cursor: pointer;
        }

        .share-btn {
          background: #1877f2;
        }

        @media (max-width: 1024px) {
          .detail-container {
            grid-template-columns: 1fr;
            gap: 30px;
          }

          .detail-right {
            padding-right: 20px;
          }

          .option-row {
            grid-template-columns: 1fr;
          }

          .action-buttons {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .detail-right {
            padding-right: 0;
          }
        }
      `}</style>
    </div>
  );
}
