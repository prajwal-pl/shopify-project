/**
 * Side Stones Selector Component
 *
 * Optional configuration for side stones (quality and quantity).
 * Only displayed if side stones are enabled in merchant settings.
 */

import type { SideStonesConfig } from "~/types/builder";

interface SideStonesSelectorProps {
  config?: SideStonesConfig;
  onChange: (config: SideStonesConfig) => void;
  qualityOptions: string[]; // From merchant settings
  minQuantity: number;
  maxQuantity: number;
  pricePerStone: Record<string, number>; // Price per quality
}

export function SideStonesSelector({
  config,
  onChange,
  qualityOptions,
  minQuantity,
  maxQuantity,
  pricePerStone,
}: SideStonesSelectorProps) {
  const selectedQuality = config?.quality || qualityOptions[0];
  const selectedQuantity = config?.quantity || minQuantity;

  const handleQualityChange = (quality: string) => {
    onChange({
      quality,
      quantity: selectedQuantity,
      price: (pricePerStone[quality] || 0) * selectedQuantity,
    });
  };

  const handleQuantityChange = (quantity: number) => {
    onChange({
      quality: selectedQuality,
      quantity,
      price: (pricePerStone[selectedQuality] || 0) * quantity,
    });
  };

  const currentPricePerStone = pricePerStone[selectedQuality] || 0;
  const totalPrice = currentPricePerStone * selectedQuantity;

  return (
    <div className="side-stones-selector">
      <h3>Side Stones (Optional)</h3>
      <p className="description">
        Add accent diamonds to enhance your ring&apos;s brilliance.
      </p>

      <div className="selector-grid">
        <div className="form-group">
          <label htmlFor="quality">Quality</label>
          <select
            id="quality"
            value={selectedQuality}
            onChange={(e) => handleQualityChange(e.target.value)}
            className="select-input"
          >
            {qualityOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <span className="price-info">
            ${currentPricePerStone.toFixed(2)} per stone
          </span>
        </div>

        <div className="form-group">
          <label htmlFor="quantity">Quantity</label>
          <input
            id="quantity"
            type="number"
            min={minQuantity}
            max={maxQuantity}
            value={selectedQuantity}
            onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
            className="number-input"
          />
          <span className="price-info">
            {minQuantity} - {maxQuantity} stones
          </span>
        </div>
      </div>

      <div className="total-display">
        <span className="total-label">Side Stones Total:</span>
        <span className="total-price">${totalPrice.toFixed(2)}</span>
      </div>

      <style>{`
        .side-stones-selector {
          margin: 32px 0;
          padding: 24px;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
        }

        .side-stones-selector h3 {
          font-size: 18px;
          font-weight: 600;
          color: #111827;
          margin: 0 0 8px;
        }

        .description {
          font-size: 14px;
          color: #6b7280;
          margin: 0 0 20px;
        }

        .selector-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-group label {
          font-size: 14px;
          font-weight: 500;
          color: #374151;
          margin-bottom: 8px;
        }

        .select-input,
        .number-input {
          padding: 10px 12px;
          font-size: 15px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          background: white;
          color: #111827;
          transition: border-color 0.2s;
        }

        .select-input:focus,
        .number-input:focus {
          outline: none;
          border-color: #d4af37;
          box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
        }

        .price-info {
          font-size: 12px;
          color: #6b7280;
          margin-top: 6px;
        }

        .total-display {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          background: white;
          border: 2px solid #d4af37;
          border-radius: 8px;
        }

        .total-label {
          font-size: 16px;
          font-weight: 500;
          color: #374151;
        }

        .total-price {
          font-size: 20px;
          font-weight: 700;
          color: #d4af37;
        }

        /* Mobile responsive */
        @media (max-width: 768px) {
          .side-stones-selector {
            padding: 20px;
          }

          .selector-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .side-stones-selector h3 {
            font-size: 16px;
          }

          .total-display {
            flex-direction: column;
            gap: 8px;
            text-align: center;
          }

          .total-label {
            font-size: 14px;
          }

          .total-price {
            font-size: 18px;
          }
        }
      `}</style>
    </div>
  );
}
