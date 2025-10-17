/**
 * Shape Icon Selector Component
 *
 * Horizontal row of diamond shape icons for visual selection
 * Based on GemFind design with info icon
 */

import React from "react";
import type { StoneShape } from "~/types/builder";

interface ShapeIconSelectorProps {
  selectedShapes: StoneShape[];
  onChange: (shapes: StoneShape[]) => void;
  label?: string;
}

const SHAPES = [
  { value: "round" as StoneShape, label: "Round", icon: "⬤" },
  { value: "radiant" as StoneShape, label: "Radiant", icon: "◈" },
  { value: "princess" as StoneShape, label: "Princess", icon: "◆" },
  { value: "pear" as StoneShape, label: "Pear", icon: "◐" },
  { value: "oval" as StoneShape, label: "Oval", icon: "⬭" },
  { value: "marquise" as StoneShape, label: "Marquise", icon: "◇" },
  { value: "heart" as StoneShape, label: "Heart", icon: "♥" },
  { value: "emerald" as StoneShape, label: "Emerald", icon: "▭" },
  { value: "cushion" as StoneShape, label: "Cushion", icon: "▢" },
  { value: "asscher" as StoneShape, label: "Asscher", icon: "◻" },
] as const;

export function ShapeIconSelector({
  selectedShapes,
  onChange,
  label = "SHAPE"
}: ShapeIconSelectorProps) {
  const toggleShape = (shape: StoneShape) => {
    if (selectedShapes.includes(shape)) {
      onChange(selectedShapes.filter(s => s !== shape));
    } else {
      onChange([...selectedShapes, shape]);
    }
  };

  return (
    <div className="shape-icon-selector-container">
      <div className="selector-header">
        <span className="selector-label">{label}</span>
        <span className="info-icon" title="Select diamond shape">ⓘ</span>
      </div>

      <div className="shape-icon-selector">
        {SHAPES.map((shape) => {
          const isSelected = selectedShapes.includes(shape.value);

          return (
            <button
              key={shape.value}
              type="button"
              className={`shape-button ${isSelected ? "selected" : ""}`}
              onClick={() => toggleShape(shape.value)}
              title={shape.label}
            >
              <div className="shape-icon">{shape.icon}</div>
              <div className="shape-label">{shape.label}</div>
            </button>
          );
        })}
      </div>

      <style>{`
        .shape-icon-selector-container {
          margin-bottom: 24px;
        }

        .selector-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
        }

        .selector-label {
          font-size: 14px;
          font-weight: 700;
          color: #333;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .info-icon {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #7c2d5e;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          cursor: help;
          font-weight: bold;
        }

        .shape-icon-selector {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }

        .shape-button {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-width: 70px;
          padding: 12px 8px;
          background: white;
          border: 2px solid #e0e0e0;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .shape-button:hover {
          border-color: #7c2d5e;
          transform: translateY(-2px);
          box-shadow: 0 2px 8px rgba(124, 45, 94, 0.15);
        }

        .shape-button.selected {
          border-color: #7c2d5e;
          background: #7c2d5e;
        }

        .shape-icon {
          font-size: 28px;
          margin-bottom: 6px;
          transition: color 0.2s ease;
        }

        .shape-button.selected .shape-icon {
          color: white;
        }

        .shape-label {
          font-size: 11px;
          font-weight: 600;
          color: #666;
          text-align: center;
          line-height: 1.2;
        }

        .shape-button.selected .shape-label {
          color: white;
        }

        @media (max-width: 768px) {
          .shape-button {
            min-width: 60px;
            padding: 10px 6px;
          }

          .shape-icon {
            font-size: 24px;
          }

          .shape-label {
            font-size: 10px;
          }
        }
      `}</style>
    </div>
  );
}
