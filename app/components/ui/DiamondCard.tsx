import React, { useState } from "react";
import { Gem, FileText, ChevronLeft, ChevronRight } from "lucide-react";
import { Icon } from "~/components/ui/Icon";
import type { Stone } from "~/types/builder";

interface DiamondCardProps {
  diamond: Stone;
  onSelect?: (diamond: Stone) => void;
}

export function DiamondCard({ diamond, onSelect }: DiamondCardProps) {
  const [imageError, setImageError] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (diamond.images.length > 1) {
      setCurrentImage((prev) => (prev + 1) % diamond.images.length);
    }
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (diamond.images.length > 1) {
      setCurrentImage((prev) => (prev - 1 + diamond.images.length) % diamond.images.length);
    }
  };

  const displayImage = diamond.images[currentImage] || diamond.images[0];

  return (
    <div className="diamond-card" onClick={() => onSelect?.(diamond)}>
      <div className="diamond-card-image-container">
        {!imageError ? (
          <>
            <img
              src={displayImage}
              alt={`${diamond.carat}ct ${diamond.shape} ${diamond.color} ${diamond.clarity}`}
              className="diamond-card-image"
              onError={handleImageError}
              loading="lazy"
            />
            {diamond.images.length > 1 && (
              <div className="image-nav">
                <button className="image-nav-btn prev" onClick={handlePrevImage} aria-label="Previous image">
                  <Icon icon={ChevronLeft} size="sm" />
                </button>
                <div className="image-dots">
                  {diamond.images.map((_, idx) => (
                    <span
                      key={idx}
                      className={`image-dot ${idx === currentImage ? "active" : ""}`}
                    />
                  ))}
                </div>
                <button className="image-nav-btn next" onClick={handleNextImage} aria-label="Next image">
                  <Icon icon={ChevronRight} size="sm" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="diamond-card-placeholder">
            <Icon icon={Gem} size="xxl" className="placeholder-icon" />
            <span className="placeholder-text">Image not available</span>
          </div>
        )}
        {diamond.diamondType === "lab_grown" && (
          <div className="diamond-type-badge">Lab Grown</div>
        )}
        {!diamond.available && (
          <div className="unavailable-badge">Sold</div>
        )}
      </div>

      <div className="diamond-card-content">
        <div className="diamond-card-header">
          <h3 className="diamond-card-carat">{diamond.carat} ct</h3>
          <div className="diamond-card-price">${diamond.price.toLocaleString()}</div>
        </div>

        <div className="diamond-card-specs">
          <div className="spec-row">
            <span className="spec-label">Shape:</span>
            <span className="spec-value capitalize">{diamond.shape}</span>
          </div>
          <div className="spec-row">
            <span className="spec-label">Cut:</span>
            <span className="spec-value">{diamond.cut || "N/A"}</span>
          </div>
          <div className="spec-row">
            <span className="spec-label">Color:</span>
            <span className="spec-value">{diamond.color || "N/A"}</span>
          </div>
          <div className="spec-row">
            <span className="spec-label">Clarity:</span>
            <span className="spec-value">{diamond.clarity || "N/A"}</span>
          </div>
        </div>

        {diamond.certificate && (
          <div className="diamond-card-cert">
            <Icon icon={FileText} size="xs" className="cert-icon" />
            <span className="cert-text">{diamond.certificate} Certified</span>
          </div>
        )}

        <button className="diamond-card-button" onClick={() => onSelect?.(diamond)}>
          View Details
        </button>
      </div>

      <style>{`
        .diamond-card {
          background: white;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          overflow: hidden;
          transition: all 0.3s ease;
          cursor: pointer;
          display: flex;
          flex-direction: column;
        }

        .diamond-card:hover {
          box-shadow: 0 4px 12px rgba(124, 45, 94, 0.15);
          border-color: #7c2d5e;
          transform: translateY(-2px);
        }

        .diamond-card-image-container {
          position: relative;
          width: 100%;
          height: 220px;
          background: #f9f9f9;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .diamond-card-image {
          width: 100%;
          height: 100%;
          object-fit: contain;
          transition: transform 0.3s ease;
          padding: 20px;
        }

        .diamond-card:hover .diamond-card-image {
          transform: scale(1.1);
        }

        .diamond-card-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          color: #999;
        }

        .placeholder-icon {
          opacity: 0.5;
          color: #999;
        }

        .placeholder-text {
          font-size: 12px;
          font-weight: 500;
        }

        .image-nav {
          position: absolute;
          bottom: 10px;
          left: 0;
          right: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .diamond-card:hover .image-nav {
          opacity: 1;
        }

        .image-nav-btn {
          background: rgba(0, 0, 0, 0.6);
          color: white;
          border: none;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          font-size: 20px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s ease;
        }

        .image-nav-btn:hover {
          background: rgba(124, 45, 94, 0.9);
        }

        .image-dots {
          display: flex;
          gap: 4px;
        }

        .image-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.5);
          transition: all 0.2s ease;
        }

        .image-dot.active {
          background: white;
          width: 8px;
          height: 8px;
        }

        .diamond-type-badge {
          position: absolute;
          top: 10px;
          left: 10px;
          background: #2196F3;
          color: white;
          padding: 4px 10px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .unavailable-badge {
          position: absolute;
          top: 10px;
          right: 10px;
          background: #e53935;
          color: white;
          padding: 4px 10px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .diamond-card-content {
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          flex: 1;
        }

        .diamond-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 12px;
          border-bottom: 1px solid #e0e0e0;
        }

        .diamond-card-carat {
          font-size: 20px;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0;
        }

        .diamond-card-price {
          font-size: 18px;
          font-weight: 700;
          color: #7c2d5e;
        }

        .diamond-card-specs {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .spec-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 13px;
        }

        .spec-label {
          color: #666;
          font-weight: 500;
        }

        .spec-value {
          color: #333;
          font-weight: 600;
        }

        .spec-value.capitalize {
          text-transform: capitalize;
        }

        .diamond-card-cert {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px;
          background: #f0e6ed;
          border-radius: 4px;
        }

        .cert-icon {
          color: #7c2d5e;
        }

        .cert-text {
          font-size: 12px;
          font-weight: 600;
          color: #7c2d5e;
        }

        .diamond-card-button {
          width: 100%;
          padding: 10px;
          background: #7c2d5e;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-top: auto;
        }

        .diamond-card-button:hover {
          background: #5c1d3e;
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .diamond-card-button:active {
          transform: translateY(0);
        }

        @media (max-width: 768px) {
          .diamond-card-image-container {
            height: 180px;
          }

          .diamond-card-carat {
            font-size: 18px;
          }

          .diamond-card-price {
            font-size: 16px;
          }
        }
      `}</style>
    </div>
  );
}
