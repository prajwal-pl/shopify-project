/**
 * Setting Card Component
 *
 * Display a ring setting with image, details, and selection.
 */

import React, { useState } from "react";
import { Settings, X, ChevronRight } from "lucide-react";
import { Icon } from "~/components/ui/Icon";
import type { Setting } from "~/types/builder";
import { useBuilder } from "./BuilderProvider";
import { formatPrice } from "~/utils/formatters";
import { METAL_TYPES } from "~/utils/constants";
import type { MetalType } from "~/utils/constants";
import { PREFERS_REDUCED_MOTION } from "~/utils/accessibility";

interface SettingCardProps {
  setting: Setting;
  onSelect?: () => void;
}

export function SettingCard({ setting, onSelect }: SettingCardProps) {
  const { selectSetting } = useBuilder();
  const [showModal, setShowModal] = useState(false);
  const [selectedMetal, setSelectedMetal] = useState<MetalType | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleSelect = () => {
    if (selectedMetal) {
      selectSetting(setting, selectedMetal);
      setShowModal(false);
    }
  };

  const primaryImage = setting.images[0] || "";
  const secondaryImage = setting.images[1] || primaryImage;
  const hasMultipleImages = setting.images.length > 1;

  return (
    <>
      <div
        className="setting-card"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="card-image">
          {primaryImage ? (
            <>
              <img
                src={primaryImage}
                alt={setting.name}
                className={`card-image-primary ${isHovered && hasMultipleImages ? "hidden" : "visible"}`}
              />
              {hasMultipleImages && (
                <img
                  src={secondaryImage}
                  alt={`${setting.name} alternate view`}
                  className={`card-image-secondary ${isHovered ? "visible" : "hidden"}`}
                />
              )}
            </>
          ) : (
            <div className="no-image">
              <Icon icon={Settings} size="xxl" />
            </div>
          )}
        </div>

        <div className="card-content">
          <h4 className="card-title">{setting.name}</h4>
          <p className="card-price">
            Starting at {formatPrice(setting.startingPrice)}
          </p>
          <p className="card-style">{setting.style}</p>

          <button
            onClick={() => {
              if (onSelect) {
                onSelect();
              } else {
                setShowModal(true);
              }
            }}
            className="view-button"
          >
            View Details
            <Icon icon={ChevronRight} size="xs" />
          </button>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{setting.name}</h3>
              <button
                onClick={() => setShowModal(false)}
                className="close-button"
                aria-label="Close modal"
              >
                <Icon icon={X} size="lg" />
              </button>
            </div>

            <div className="modal-body">
              <div className="modal-images">
                {setting.images.map((img, idx) => (
                  <img key={idx} src={img} alt={`${setting.name} ${idx + 1}`} />
                ))}
              </div>

              <div className="modal-details">
                <div className="detail-section">
                  <h4>Select Metal Type</h4>
                  <div className="metal-options">
                    {METAL_TYPES.map((metal) => {
                      const price = setting.basePrices[metal.value];
                      const isSelected = selectedMetal === metal.value;

                      return (
                        <label
                          key={metal.value}
                          className={`metal-option ${isSelected ? "selected" : ""}`}
                        >
                          <input
                            type="radio"
                            name="metal"
                            value={metal.value}
                            checked={isSelected}
                            onChange={() => setSelectedMetal(metal.value)}
                          />
                          <div className="metal-info">
                            <span className="metal-label">{metal.label}</span>
                            <span className="metal-price">
                              {formatPrice(price)}
                            </span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="detail-section">
                  <h4>Compatible Stone Shapes</h4>
                  <div className="compatible-shapes">
                    {setting.compatibleShapes.map((shape) => (
                      <span key={shape} className="shape-badge">
                        {shape}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                onClick={handleSelect}
                disabled={!selectedMetal}
                className="select-button"
              >
                Select This Setting
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .setting-card {
          background: white;
          border: 1px solid #e5e5e5;
          border-radius: 8px;
          overflow: hidden;
          transition: all 0.3s ease;
          cursor: pointer;
          will-change: transform;
        }

        .setting-card:hover {
          border-color: #d4af37;
          box-shadow: 0 12px 24px rgba(212, 175, 55, 0.2),
                      0 4px 12px rgba(0, 0, 0, 0.1);
          transform: translateY(-8px);
        }

        .card-image {
          width: 100%;
          height: 240px;
          background: #f6f6f7;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          position: relative;
        }

        .card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          position: absolute;
          top: 0;
          left: 0;
          transition: opacity 0.5s ease, transform 0.5s ease;
          will-change: opacity, transform;
        }

        .card-image-primary.visible,
        .card-image-secondary.visible {
          opacity: 1;
          transform: scale(1);
        }

        .card-image-primary.hidden,
        .card-image-secondary.hidden {
          opacity: 0;
          transform: scale(1.05);
        }

        .setting-card:hover .card-image img.visible {
          transform: scale(1.08);
        }

        .no-image {
          display: flex;
          align-items: center;
          justify-content: center;
          color: #999;
          opacity: 0.5;
        }

        .card-content {
          padding: 20px;
        }

        .card-title {
          font-size: 18px;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0 0 8px;
        }

        .card-price {
          font-size: 20px;
          font-weight: 700;
          color: #d4af37;
          margin: 0 0 4px;
        }

        .card-style {
          font-size: 14px;
          color: #6d7175;
          margin: 0 0 16px;
          text-transform: capitalize;
        }

        .view-button {
          width: 100%;
          padding: 12px;
          background: #000000;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          outline: none;
        }

        .view-button:hover {
          background: #333333;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .view-button:focus-visible {
          outline: 2px solid #d4af37;
          outline-offset: 2px;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal-content {
          background: white;
          border-radius: 12px;
          max-width: 800px;
          width: 100%;
          max-height: 90vh;
          overflow: auto;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px;
          border-bottom: 1px solid #e5e5e5;
        }

        .modal-header h3 {
          font-size: 24px;
          font-weight: 700;
          margin: 0;
        }

        .close-button {
          background: none;
          border: none;
          color: #6d7175;
          cursor: pointer;
          line-height: 1;
          padding: 0;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          border-radius: 4px;
          outline: none;
        }

        .close-button:hover {
          background: #f6f6f7;
          color: #1a1a1a;
        }

        .close-button:focus-visible {
          outline: 2px solid #d4af37;
          outline-offset: 2px;
        }

        .modal-body {
          padding: 24px;
        }

        .modal-images {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }

        .modal-images img {
          width: 100%;
          aspect-ratio: 1;
          object-fit: cover;
          border-radius: 8px;
        }

        .detail-section {
          margin-bottom: 24px;
        }

        .detail-section h4 {
          font-size: 16px;
          font-weight: 600;
          margin: 0 0 12px;
        }

        .metal-options {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .metal-option {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          border: 2px solid #e5e5e5;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .metal-option:hover {
          border-color: #d4af37;
        }

        .metal-option.selected {
          border-color: #d4af37;
          background: #fffbf0;
        }

        .metal-option input {
          cursor: pointer;
        }

        .metal-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex: 1;
        }

        .metal-label {
          font-weight: 500;
          color: #202223;
        }

        .metal-price {
          font-weight: 600;
          color: #d4af37;
        }

        .compatible-shapes {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .shape-badge {
          padding: 6px 12px;
          background: #f6f6f7;
          border: 1px solid #e5e5e5;
          border-radius: 4px;
          font-size: 13px;
          text-transform: capitalize;
        }

        .modal-footer {
          padding: 24px;
          border-top: 1px solid #e5e5e5;
          text-align: right;
        }

        .select-button {
          padding: 14px 32px;
          background: #d4af37;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s ease;
          outline: none;
        }

        .select-button:hover:not(:disabled) {
          background: #c29d2f;
        }

        .select-button:focus-visible {
          outline: 2px solid #1a1a1a;
          outline-offset: 2px;
        }

        .select-button:disabled {
          background: #c9cccf;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .modal-images {
            grid-template-columns: 1fr;
          }

          .metal-info {
            flex-direction: column;
            align-items: flex-start;
            gap: 4px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .setting-card,
          .card-image img,
          .view-button,
          .close-button,
          .metal-option,
          .select-button {
            transition-duration: 0.01ms !important;
          }

          .setting-card:hover {
            transform: none;
          }

          .setting-card:hover .card-image img.visible {
            transform: none;
          }

          .view-button:hover {
            transform: none;
          }
        }
      `}</style>
    </>
  );
}
