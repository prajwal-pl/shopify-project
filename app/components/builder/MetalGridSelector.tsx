/**
 * Metal Grid Selector Component
 *
 * 2-row button grid for metal type selection
 * Based on GemFind design with info icon
 */

import React from "react";
import type { MetalType } from "~/types/builder";

interface MetalGridSelectorProps {
  selectedMetals: MetalType[];
  onChange: (metals: MetalType[]) => void;
  label?: string;
}

const METAL_TYPES = [
  { value: "14k_white_gold" as MetalType, label: "14K", sublabel: "WhiteGold" },
  { value: "14k_yellow_gold" as MetalType, label: "14K", sublabel: "YellowGold" },
  { value: "14k_rose_gold" as MetalType, label: "14K", sublabel: "RoseGold" },
  { value: "18k_white_gold" as MetalType, label: "18K", sublabel: "WhiteGold" },
  { value: "18k_yellow_gold" as MetalType, label: "18K", sublabel: "YellowGold" },
  { value: "18k_rose_gold" as MetalType, label: "18K", sublabel: "RoseGold" },
  { value: "platinum" as MetalType, label: "PT", sublabel: "Platinum", fullWidth: true },
] as const;

export function MetalGridSelector({
  selectedMetals,
  onChange,
  label = "METAL"
}: MetalGridSelectorProps) {
  const toggleMetal = (metal: MetalType) => {
    if (selectedMetals.includes(metal)) {
      onChange(selectedMetals.filter(m => m !== metal));
    } else {
      onChange([...selectedMetals, metal]);
    }
  };

  const row1 = METAL_TYPES.slice(0, 3);
  const row2 = METAL_TYPES.slice(3, 6);
  const platinum = METAL_TYPES[6];

  return (
    <div className="metal-grid-selector-container">
      <div className="selector-header">
        <span className="selector-label">{label}</span>
        <span className="info-icon" title="Select metal type">ⓘ</span>
      </div>

      <div className="metal-grid">
        <div className="metal-row">
          {row1.map((metal) => {
            const isSelected = selectedMetals.includes(metal.value);
            return (
              <button
                key={metal.value}
                type="button"
                className={`metal-button ${isSelected ? "selected" : ""}`}
                onClick={() => toggleMetal(metal.value)}
              >
                <span className="metal-label">{metal.label}</span>
                <span className="metal-sublabel">{metal.sublabel}</span>
              </button>
            );
          })}
        </div>

        <div className="metal-row">
          {row2.map((metal) => {
            const isSelected = selectedMetals.includes(metal.value);
            return (
              <button
                key={metal.value}
                type="button"
                className={`metal-button ${isSelected ? "selected" : ""}`}
                onClick={() => toggleMetal(metal.value)}
              >
                <span className="metal-label">{metal.label}</span>
                <span className="metal-sublabel">{metal.sublabel}</span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          className={`metal-button platinum ${selectedMetals.includes(platinum.value) ? "selected" : ""}`}
          onClick={() => toggleMetal(platinum.value)}
        >
          <span className="metal-label">{platinum.label}</span>
          <span className="metal-sublabel">{platinum.sublabel}</span>
        </button>
      </div>

      <style>{`
        .metal-grid-selector-container {
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

        .metal-grid {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .metal-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .metal-button {
          padding: 12px 16px;
          background: white;
          border: 2px solid #e0e0e0;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 60px;
        }

        .metal-button:hover {
          border-color: #7c2d5e;
          transform: translateY(-2px);
          box-shadow: 0 2px 8px rgba(124, 45, 94, 0.15);
        }

        .metal-button.selected {
          border-color: #7c2d5e;
          background: #7c2d5e;
        }

        .metal-button.platinum {
          width: 100%;
        }

        .metal-label {
          font-size: 16px;
          font-weight: 700;
          color: #333;
          line-height: 1;
          margin-bottom: 4px;
        }

        .metal-button.selected .metal-label {
          color: white;
        }

        .metal-sublabel {
          font-size: 12px;
          font-weight: 500;
          color: #666;
          line-height: 1;
        }

        .metal-button.selected .metal-sublabel {
          color: white;
        }

        @media (max-width: 768px) {
          .metal-row {
            grid-template-columns: repeat(2, 1fr);
          }

          .metal-button {
            padding: 10px 12px;
            min-height: 50px;
          }

          .metal-label {
            font-size: 14px;
          }

          .metal-sublabel {
            font-size: 11px;
          }
        }
      `}</style>
    </div>
  );
}
