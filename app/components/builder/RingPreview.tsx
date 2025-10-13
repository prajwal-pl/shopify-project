/**
 * Ring Preview Component
 *
 * Display setting and stone images side-by-side.
 * Simple approach for MVP - no image composition.
 */

import type { Setting, Stone } from "~/types/builder";

interface RingPreviewProps {
  setting: Setting;
  stone: Stone;
  metalType: string;
}

export function RingPreview({ setting, stone, metalType }: RingPreviewProps) {
  const metalTypeLabel =
    {
      "14k_white_gold": "14K White Gold",
      "14k_yellow_gold": "14K Yellow Gold",
      "18k_rose_gold": "18K Rose Gold",
      platinum: "Platinum",
    }[metalType] || metalType;

  return (
    <div className="ring-preview">
      <h3>Your Ring Preview</h3>
      <p className="preview-description">
        Your custom ring will be crafted with these beautiful components
      </p>

      <div className="preview-grid">
        {/* Setting Image */}
        <div className="preview-item">
          <div className="image-container">
            <img
              src={setting.images?.[0] || "/placeholder-setting.png"}
              alt={setting.name}
              loading="lazy"
              className="preview-image"
            />
          </div>
          <div className="item-label">
            <span className="label-title">Setting</span>
            <span className="label-text">{setting.name}</span>
            <span className="label-subtitle">{metalTypeLabel}</span>
          </div>
        </div>

        {/* Plus Icon */}
        <div className="plus-icon">+</div>

        {/* Stone Image */}
        <div className="preview-item">
          <div className="image-container">
            <img
              src={stone.images?.[0] || "/placeholder-stone.png"}
              alt={`${stone.carat}ct ${stone.shape} diamond`}
              loading="lazy"
              className="preview-image"
            />
          </div>
          <div className="item-label">
            <span className="label-title">Center Stone</span>
            <span className="label-text">
              {stone.carat}ct {stone.shape}
            </span>
            <span className="label-subtitle">
              {stone.color} {stone.clarity}
            </span>
          </div>
        </div>
      </div>

      <div className="preview-note">
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="info-icon"
        >
          <path d="M8 16A8 8 0 1 1 8 0a8 8 0 0 1 0 16zm1-8.577V12h-2V7.423h2zm-2-2.462v-2h2v2h-2z" />
        </svg>
        <span>
          This is a representation. Your ring will be professionally crafted and
          may vary slightly from this preview.
        </span>
      </div>

      <style>{`
        .ring-preview {
          background: white;
          border-radius: 12px;
          padding: 32px;
          margin-bottom: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .ring-preview h3 {
          font-size: 24px;
          font-weight: 700;
          color: #111827;
          margin: 0 0 8px;
          text-align: center;
        }

        .preview-description {
          font-size: 14px;
          color: #6b7280;
          text-align: center;
          margin: 0 0 32px;
        }

        .preview-grid {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          gap: 24px;
          align-items: center;
          margin-bottom: 24px;
        }

        .preview-item {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .image-container {
          width: 200px;
          height: 200px;
          background: #f9fafb;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          border: 2px solid #e5e7eb;
          transition: transform 0.3s ease;
        }

        .image-container:hover {
          transform: scale(1.05);
        }

        .preview-image {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }

        .item-label {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: 16px;
          text-align: center;
        }

        .label-title {
          font-size: 12px;
          font-weight: 600;
          color: #9ca3af;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 4px;
        }

        .label-text {
          font-size: 16px;
          font-weight: 600;
          color: #111827;
          margin-bottom: 2px;
        }

        .label-subtitle {
          font-size: 14px;
          color: #6b7280;
        }

        .plus-icon {
          font-size: 32px;
          color: #d4af37;
          font-weight: 300;
        }

        .preview-note {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 12px 16px;
          background: #f0f9ff;
          border: 1px solid #bae6fd;
          border-radius: 8px;
          font-size: 13px;
          color: #075985;
          line-height: 1.5;
        }

        .info-icon {
          flex-shrink: 0;
          margin-top: 2px;
        }

        /* Mobile responsive */
        @media (max-width: 768px) {
          .ring-preview {
            padding: 24px 16px;
          }

          .preview-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .plus-icon {
            font-size: 24px;
            transform: rotate(90deg);
          }

          .image-container {
            width: 160px;
            height: 160px;
          }

          .ring-preview h3 {
            font-size: 20px;
          }

          .label-text {
            font-size: 15px;
          }
        }
      `}</style>
    </div>
  );
}
