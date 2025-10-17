import React from "react";
import type { DiamondType } from "~/types/builder";

interface DiamondTypeTabsProps {
  selectedType: DiamondType;
  onChange: (type: DiamondType) => void;
  onSaveSearch?: () => void;
  onReset?: () => void;
  compareCount?: number;
}

const DIAMOND_TYPES: { value: DiamondType; label: string }[] = [
  { value: "mined", label: "Mined" },
  { value: "lab_grown", label: "Lab Grown" },
  { value: "fancy_color", label: "Fancy Color" },
];

export function DiamondTypeTabs({
  selectedType,
  onChange,
  onSaveSearch,
  onReset,
  compareCount = 0
}: DiamondTypeTabsProps) {
  return (
    <div className="diamond-type-tabs-container">
      <div className="tabs-section">
        {DIAMOND_TYPES.map((type) => (
          <button
            key={type.value}
            type="button"
            className={`tab-button ${selectedType === type.value ? "active" : ""}`}
            onClick={() => onChange(type.value)}
          >
            <span className="tab-label">{type.label}</span>
            <span className="info-icon" title={`Select ${type.label} diamonds`}>ⓘ</span>
          </button>
        ))}

        <button
          type="button"
          className="tab-button compare-tab"
          disabled={compareCount === 0}
        >
          <span className="tab-label">Compare</span>
        </button>
      </div>

      <div className="actions-section">
        {onSaveSearch && (
          <button
            type="button"
            className="action-button"
            onClick={onSaveSearch}
          >
            <span>💾 Save Search</span>
          </button>
        )}

        {onReset && (
          <button
            type="button"
            className="action-button"
            onClick={onReset}
          >
            <span>🔄 Reset</span>
          </button>
        )}
      </div>

      <style>{`
        .diamond-type-tabs-container {
          background: #7c2d5e;
          padding: 12px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          border-radius: 4px;
        }

        .tabs-section {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .tab-button {
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: white;
          padding: 8px 16px;
          border-radius: 4px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .tab-button:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.3);
        }

        .tab-button.active {
          background: white;
          color: #7c2d5e;
          border-color: white;
        }

        .tab-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .tab-label {
          white-space: nowrap;
        }

        .info-icon {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: bold;
        }

        .tab-button.active .info-icon {
          background: #7c2d5e;
          color: white;
        }

        .compare-tab {
          margin-left: 16px;
        }

        .actions-section {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .action-button {
          background: transparent;
          border: 1px solid white;
          color: white;
          padding: 8px 16px;
          border-radius: 4px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .action-button:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        @media (max-width: 768px) {
          .diamond-type-tabs-container {
            flex-direction: column;
            gap: 12px;
          }

          .tabs-section {
            width: 100%;
            justify-content: center;
            flex-wrap: wrap;
          }

          .actions-section {
            width: 100%;
            justify-content: center;
          }

          .tab-button {
            flex: 1;
            min-width: 100px;
            justify-content: center;
          }

          .compare-tab {
            margin-left: 0;
          }
        }
      `}</style>
    </div>
  );
}
