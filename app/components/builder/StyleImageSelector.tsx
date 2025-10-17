/**
 * Style Image Selector Component
 *
 * Horizontal row of ring style images for visual selection
 * Based on GemFind design
 */

import React from "react";
import type { SettingStyle } from "~/types/builder";

interface StyleImageSelectorProps {
  selectedStyles: string[];
  onChange: (styles: string[]) => void;
}

const STYLES = [
  { value: "halo", label: "Halo" },
  { value: "solitaire", label: "Solitaire" },
  { value: "three_stone", label: "Three Stone" },
  { value: "vintage", label: "Single Row" },
  { value: "modern", label: "Trellis" },
  { value: "pave", label: "MultiRow" },
  { value: "channel", label: "Vintage" },
  { value: "tension", label: "Pave" },
] as const;

export function StyleImageSelector({
  selectedStyles,
  onChange
}: StyleImageSelectorProps) {
  const toggleStyle = (style: string) => {
    if (selectedStyles.includes(style)) {
      onChange(selectedStyles.filter(s => s !== style));
    } else {
      onChange([...selectedStyles, style]);
    }
  };

  return (
    <div className="style-image-selector">
      {STYLES.map((style) => {
        const isSelected = selectedStyles.includes(style.value);

        return (
          <div
            key={style.value}
            className={`style-item ${isSelected ? "selected" : ""}`}
            onClick={() => toggleStyle(style.value)}
          >
            {/* Placeholder image - will be replaced with actual ring images */}
            <div className="style-image-placeholder">
              💍
            </div>
            <div className="style-label">{style.label}</div>
          </div>
        );
      })}

      <style>{`
        .style-image-selector {
          display: flex;
          gap: 16px;
          overflow-x: auto;
          padding: 16px 0;
          margin-bottom: 24px;
        }

        .style-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 90px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .style-item:hover {
          transform: translateY(-2px);
        }

        .style-image-placeholder {
          width: 80px;
          height: 80px;
          background: #f5f5f5;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          transition: all 0.2s ease;
        }

        .style-item.selected .style-image-placeholder {
          border-color: #7c2d5e;
          background: #f9f0f5;
          box-shadow: 0 2px 8px rgba(124, 45, 94, 0.2);
        }

        .style-label {
          margin-top: 8px;
          font-size: 13px;
          font-weight: 500;
          color: #333;
          text-align: center;
          line-height: 1.2;
        }

        .style-item.selected .style-label {
          color: #7c2d5e;
          font-weight: 600;
        }

        /* Scrollbar styling */
        .style-image-selector::-webkit-scrollbar {
          height: 6px;
        }

        .style-image-selector::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }

        .style-image-selector::-webkit-scrollbar-thumb {
          background: #7c2d5e;
          border-radius: 3px;
        }

        @media (max-width: 768px) {
          .style-item {
            min-width: 70px;
          }

          .style-image-placeholder {
            width: 60px;
            height: 60px;
            font-size: 24px;
          }

          .style-label {
            font-size: 11px;
          }
        }
      `}</style>
    </div>
  );
}
