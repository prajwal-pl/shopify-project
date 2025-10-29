import React, { useState } from "react";
import { Circle, ChevronLeft, ChevronRight } from "lucide-react";
import { Icon } from "~/components/ui/Icon";
import type { RingProduct } from "~/types/ring-product";

interface RingCardProps {
  product: RingProduct;
  onSelect?: (product: RingProduct) => void;
}

export function RingCard({ product, onSelect }: RingCardProps) {
  const [imageError, setImageError] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.thumbnails.length > 1) {
      setCurrentImage((prev) => (prev + 1) % product.thumbnails.length);
    }
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.thumbnails.length > 1) {
      setCurrentImage((prev) => (prev - 1 + product.thumbnails.length) % product.thumbnails.length);
    }
  };

  const displayImage = product.thumbnails[currentImage] || product.mainImage;

  return (
    <div className="ring-card" onClick={() => onSelect?.(product)}>
      <div className="ring-card-image-container">
        {!imageError ? (
          <>
            <img
              src={displayImage}
              alt={product.title}
              className="ring-card-image"
              onError={handleImageError}
              loading="lazy"
            />
            {product.thumbnails.length > 1 && (
              <div className="image-nav">
                <button className="image-nav-btn prev" onClick={handlePrevImage} aria-label="Previous image">
                  <Icon icon={ChevronLeft} size="sm" />
                </button>
                <div className="image-dots">
                  {product.thumbnails.map((_, idx) => (
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
          <div className="ring-card-placeholder">
            <Icon icon={Circle} size="xxl" className="placeholder-icon" />
            <span className="placeholder-text">Image not available</span>
          </div>
        )}
        {product.availability && product.availability !== "Unknown" && (
          <div className="availability-badge">{product.availability}</div>
        )}
      </div>

      <div className="ring-card-content">
        <h3 className="ring-card-title">{product.title}</h3>
        <p className="ring-card-sku">SKU: {product.sku}</p>

        <div className="ring-card-details">
          {product.category && product.category !== "Uncategorized" && (
            <span className="detail-tag category">{product.category}</span>
          )}
          {product.collection && product.collection !== "N/A" && (
            <span className="detail-tag collection">{product.collection}</span>
          )}
        </div>

        {product.metalType && product.metalType !== "N/A" && (
          <div className="ring-card-metal">
            <span className="metal-label">Metal:</span>
            <span className="metal-value">{product.metalType}</span>
          </div>
        )}

        {product.price && (
          <div className="ring-card-price">${product.price.toLocaleString()}</div>
        )}

        <button className="ring-card-button" onClick={() => onSelect?.(product)}>
          View Details
        </button>
      </div>

      <style>{`
        .ring-card {
          background: white;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          overflow: hidden;
          transition: all 0.3s ease;
          cursor: pointer;
          display: flex;
          flex-direction: column;
        }

        .ring-card:hover {
          box-shadow: 0 4px 12px rgba(124, 45, 94, 0.15);
          border-color: #7c2d5e;
          transform: translateY(-2px);
        }

        .ring-card-image-container {
          position: relative;
          width: 100%;
          height: 250px;
          background: #f9f9f9;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .ring-card-image {
          width: 100%;
          height: 100%;
          object-fit: contain;
          transition: transform 0.3s ease;
        }

        .ring-card:hover .ring-card-image {
          transform: scale(1.05);
        }

        .ring-card-placeholder {
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

        .ring-card:hover .image-nav {
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

        .availability-badge {
          position: absolute;
          top: 10px;
          right: 10px;
          background: #7c2d5e;
          color: white;
          padding: 4px 12px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .ring-card-content {
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex: 1;
        }

        .ring-card-title {
          font-size: 16px;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0;
          line-height: 1.3;
          min-height: 42px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .ring-card-sku {
          font-size: 12px;
          color: #666;
          margin: 0;
          font-weight: 500;
        }

        .ring-card-details {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin: 4px 0;
        }

        .detail-tag {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 500;
          text-transform: capitalize;
        }

        .detail-tag.category {
          background: #f0e6ed;
          color: #7c2d5e;
        }

        .detail-tag.collection {
          background: #e6f0ed;
          color: #2d5e4d;
        }

        .ring-card-metal {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
        }

        .metal-label {
          color: #666;
          font-weight: 500;
        }

        .metal-value {
          color: #333;
          font-weight: 600;
        }

        .ring-card-price {
          font-size: 20px;
          font-weight: 700;
          color: #7c2d5e;
          margin-top: auto;
        }

        .ring-card-button {
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
          margin-top: 8px;
        }

        .ring-card-button:hover {
          background: #5c1d3e;
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .ring-card-button:active {
          transform: translateY(0);
        }

        @media (max-width: 768px) {
          .ring-card-image-container {
            height: 200px;
          }

          .ring-card-title {
            font-size: 14px;
            min-height: 38px;
          }

          .ring-card-price {
            font-size: 18px;
          }
        }
      `}</style>
    </div>
  );
}
