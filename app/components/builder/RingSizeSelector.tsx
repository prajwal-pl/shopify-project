/**
 * Ring Size Selector Component
 *
 * Visual button grid for selecting ring size (US standard 3-12).
 */

import { Ruler } from "lucide-react";
import { Icon } from "~/components/ui/Icon";
import { RING_SIZES, type RingSize } from "~/utils/constants";

interface RingSizeSelectorProps {
  selectedSize?: RingSize;
  onSelect: (size: RingSize) => void;
  onShowGuide: () => void;
}

export function RingSizeSelector({
  selectedSize,
  onSelect,
  onShowGuide,
}: RingSizeSelectorProps) {
  return (
    <div className="ring-size-selector">
      <div className="selector-header">
        <h3>Select Ring Size</h3>
        <button onClick={onShowGuide} className="guide-link" type="button" aria-label="Show ring size guide">
          <Icon icon={Ruler} size="sm" />
          Size Guide
        </button>
      </div>

      <div className="size-grid">
        {RING_SIZES.map((size) => (
          <button
            key={size}
            type="button"
            onClick={() => onSelect(size as RingSize)}
            className={`size-button ${selectedSize === size ? "selected" : ""}`}
            aria-label={`Ring size ${size}`}
          >
            {size}
          </button>
        ))}
      </div>

      {!selectedSize && (
        <p className="hint-text">Select a ring size to continue</p>
      )}

      <style>{`
        .ring-size-selector {
          margin: 24px 0;
        }

        .selector-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .selector-header h3 {
          font-size: 18px;
          font-weight: 600;
          color: #202223;
          margin: 0;
        }

        .guide-link {
          background: none;
          border: none;
          color: #2c6ecb;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          padding: 6px 12px;
          border-radius: 4px;
          transition: background 0.2s;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .guide-link:hover {
          background: #f1f5f9;
        }

        .size-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
          gap: 12px;
          margin-bottom: 12px;
        }

        .size-button {
          width: 100%;
          height: 56px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          background: white;
          font-size: 16px;
          font-weight: 500;
          color: #374151;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .size-button:hover {
          border-color: #d4af37;
          background: #fffbf0;
        }

        .size-button.selected {
          border-color: #d4af37;
          background: #fff9e6;
          color: #000000;
          font-weight: 600;
          box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
        }

        .hint-text {
          font-size: 14px;
          color: #6b7280;
          text-align: center;
          margin: 8px 0 0;
        }

        /* Mobile responsive */
        @media (max-width: 768px) {
          .size-grid {
            grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));
            gap: 8px;
          }

          .size-button {
            height: 48px;
            font-size: 14px;
          }

          .selector-header h3 {
            font-size: 16px;
          }

          .guide-link {
            font-size: 13px;
            padding: 4px 8px;
          }
        }

        /* Touch targets for mobile */
        @media (hover: none) {
          .size-button {
            min-height: 44px;
            min-width: 44px;
          }
        }
      `}</style>
    </div>
  );
}
