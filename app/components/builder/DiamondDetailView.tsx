import React, { useState } from "react";
import { Video, Gem, Award, ClipboardList, Gift, HelpCircle, Mail, Printer, Calendar, Bookmark, Twitter, Facebook } from "lucide-react";
import { Icon } from "~/components/ui/Icon";
import type { Stone } from "~/types/builder";
import { useBuilder } from "./BuilderProvider";

interface DiamondDetailViewProps {
  stone: Stone;
}

export function DiamondDetailView({ stone }: DiamondDetailViewProps) {
  const { hideDetailViews, goToStep } = useBuilder();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleCompleteYourRing = () => {
    hideDetailViews();
    goToStep(3);
  };

  const handleBack = () => {
    hideDetailViews();
  };

  return (
    <div className="diamond-detail-view">
      <button className="back-button" onClick={handleBack}>
        ← Back to Diamonds
      </button>

      <div className="detail-container">
        <div className="detail-left">
          <div className="main-image-container">
            {stone.images.length > 0 ? (
              <>
                <img
                  src={stone.images[currentImageIndex]}
                  alt={`${stone.carat}ct ${stone.shape}`}
                  className="main-image"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder-diamond.png";
                  }}
                />
                <div className="image-thumbnails">
                  {stone.images.map((img, index) => (
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
                          target.src = "/placeholder-diamond.png";
                        }}
                      />
                    </button>
                  ))}
                  <button className="thumbnail video-thumb" aria-label="Video view">
                    <Icon icon={Video} size="md" />
                  </button>
                </div>
              </>
            ) : (
              <div className="placeholder-diamond">
                <Icon icon={Gem} size="xxl" style={{ opacity: 0.3 }} />
              </div>
            )}
          </div>

          <div className="sku-line">SKU# {stone.id}</div>

          <div className="grading-report">
            <div className="report-badge">
              <div className="badge-icon">
              <Icon icon={Award} size="xxl" style={{ color: "#d4af37" }} />
            </div>
              <div className="badge-text">
                <p>This {stone.color} color, {stone.clarity} clarity diamond</p>
                <p>comes accompanied by a diamond grading</p>
                <p>report from {stone.certificate || "GIA"}</p>
              </div>
            </div>
            {stone.certificateUrl && (
              <button className="view-report-btn">
                Diamond Grading Report View
              </button>
            )}
          </div>
        </div>

        <div className="detail-right">
          <div className="detail-header">
            <h1 className="detail-title">
              {stone.carat} Carat {stone.shape.charAt(0).toUpperCase() + stone.shape.slice(1)} Diamond
            </h1>
            <button className="spec-button" aria-label="View diamond specification">
              <Icon icon={ClipboardList} size="sm" />
              Diamond Specification
            </button>
          </div>

          <p className="detail-description">
            This {stone.color} color, {stone.clarity} clarity diamond comes accompanied by a diamond grading report from {stone.certificate || "GIA"}.
          </p>

          <div className="specs-grid">
            <div className="spec-item">
              <label>Report:</label>
              <span>{stone.certificate || "GIA"}</span>
            </div>
            <div className="spec-item">
              <label>Color:</label>
              <span>{stone.color}</span>
            </div>
            <div className="spec-item">
              <label>Cut:</label>
              <span>{stone.cut}</span>
            </div>
            <div className="spec-item">
              <label>Clarity:</label>
              <span>{stone.clarity}</span>
            </div>
          </div>

          <div className="action-buttons">
            <button className="action-btn secondary" aria-label="Drop a hint">
              <Icon icon={Gift} size="sm" />
              Drop A Hint
            </button>
            <button className="action-btn secondary" aria-label="Request more information">
              <Icon icon={HelpCircle} size="sm" />
              Request More Info
            </button>
            <button className="action-btn secondary" aria-label="Email to a friend">
              <Icon icon={Mail} size="sm" />
              E-Mail A Friend
            </button>
            <button className="action-btn secondary" aria-label="Print details">
              <Icon icon={Printer} size="sm" />
              Print Details
            </button>
            <button className="action-btn secondary" aria-label="Schedule viewing">
              <Icon icon={Calendar} size="sm" />
              Schedule Viewing
            </button>
          </div>

          <div className="price-section">
            <div className="detail-price">${stone.price.toLocaleString()}</div>
          </div>

          <div className="main-actions">
            <button className="add-to-cart-button">
              Add To Cart
            </button>
            <button className="primary-button" onClick={handleCompleteYourRing}>
              Complete Your Ring
            </button>
          </div>

          <div className="social-share">
            <button className="save-btn" aria-label="Save diamond">
              <Icon icon={Bookmark} size="xs" />
              Save
            </button>
            <button className="share-btn tweet" aria-label="Share on Twitter">
              <Icon icon={Twitter} size="xs" />
              Post
            </button>
            <button className="share-btn" aria-label="Share on Facebook">
              <Icon icon={Facebook} size="xs" />
              Share
            </button>
          </div>
        </div>
      </div>

      {stone.measurements && (
        <div className="similar-diamonds">
          <h3>Similar Diamonds | Compare Items (0)</h3>
        </div>
      )}

      <style>{`
        .diamond-detail-view {
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
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 20px;
          min-height: 400px;
        }

        .main-image {
          max-width: 100%;
          max-height: 350px;
          object-fit: contain;
        }

        .placeholder-diamond {
          display: flex;
          align-items: center;
          justify-content: center;
          color: #999;
        }

        .image-thumbnails {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .thumbnail {
          width: 60px;
          height: 60px;
          border: 2px solid #e0e0e0;
          border-radius: 6px;
          background: white;
          cursor: pointer;
          padding: 6px;
          transition: border-color 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
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

        .video-thumb {
          display: flex;
          align-items: center;
          justify-content: center;
          color: #7c2d5e;
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

        .grading-report {
          background: #f9f9f9;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .report-badge {
          display: flex;
          gap: 16px;
          align-items: center;
        }

        .badge-icon {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .badge-text {
          font-size: 13px;
          line-height: 1.5;
          color: #555;
        }

        .badge-text p {
          margin: 0;
        }

        .view-report-btn {
          padding: 10px 16px;
          background: white;
          border: 1px solid #7c2d5e;
          color: #7c2d5e;
          border-radius: 4px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          text-align: center;
        }

        .view-report-btn:hover {
          background: #f9f4f7;
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
          display: flex;
          align-items: center;
          gap: 6px;
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

        .specs-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          padding: 20px;
          background: #f9f9f9;
          border-radius: 6px;
        }

        .spec-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .spec-item label {
          font-size: 15px;
          font-weight: 600;
          color: #333;
        }

        .spec-item span {
          font-size: 15px;
          color: #555;
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
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
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

        .add-to-cart-button {
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

        .add-to-cart-button:hover {
          background: #63244a;
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

        .social-share {
          display: flex;
          gap: 12px;
          padding-top: 12px;
        }

        .save-btn {
          padding: 8px 16px;
          background: #dc3545;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 13px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .share-btn {
          padding: 8px 16px;
          background: #1877f2;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 13px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .share-btn.tweet {
          background: #1da1f2;
        }

        .similar-diamonds {
          margin-top: 40px;
          padding: 20px;
          border-top: 2px solid #e0e0e0;
        }

        .similar-diamonds h3 {
          font-size: 20px;
          font-weight: 600;
          color: #1a1a1a;
        }

        @media (max-width: 1024px) {
          .detail-container {
            grid-template-columns: 1fr;
            gap: 30px;
          }

          .detail-right {
            padding-right: 20px;
          }

          .action-buttons {
            grid-template-columns: 1fr;
          }

          .specs-grid {
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
