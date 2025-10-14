/**
 * Metal Pricing Table Component
 *
 * Phase 2.0: Input table for setting metal prices.
 * Used in AddSettingModal.
 *
 * Features:
 * - 7 metal types with visual indicators
 * - Currency input validation
 * - Color-coded metal labels
 * - Required field validation
 */

import type { MetalType } from "~/types/builder";

interface MetalPricingTableProps {
  prices: Record<MetalType, number>;
  onChange: (prices: Record<MetalType, number>) => void;
  errors?: Record<string, string>;
}

interface MetalOption {
  value: MetalType;
  label: string;
  color: string;
}

const METAL_OPTIONS: MetalOption[] = [
  { value: "14k_white_gold", label: "14K White Gold", color: "#F8F8F8" },
  { value: "14k_yellow_gold", label: "14K Yellow Gold", color: "#FFD700" },
  { value: "14k_rose_gold", label: "14K Rose Gold", color: "#E0BFB8" },
  { value: "18k_white_gold", label: "18K White Gold", color: "#F8F8F8" },
  { value: "18k_yellow_gold", label: "18K Yellow Gold", color: "#FFD700" },
  { value: "18k_rose_gold", label: "18K Rose Gold", color: "#E0BFB8" },
  { value: "platinum", label: "Platinum", color: "#E5E4E2" },
];

export function MetalPricingTable({
  prices,
  onChange,
  errors = {},
}: MetalPricingTableProps) {
  const handlePriceChange = (metal: MetalType, value: string) => {
    const numValue = parseFloat(value) || 0;
    onChange({
      ...prices,
      [metal]: numValue,
    });
  };

  return (
    <div className="metal-pricing-table">
      <table className="pricing-table">
        <thead>
          <tr>
            <th>Metal Type</th>
            <th>Price ($)</th>
          </tr>
        </thead>
        <tbody>
          {METAL_OPTIONS.map((metal) => (
            <tr key={metal.value}>
              <td>
                <div className="metal-label">
                  <div
                    className="metal-color-swatch"
                    style={{ background: metal.color }}
                  />
                  <span>{metal.label}</span>
                </div>
              </td>
              <td>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={prices[metal.value] || ""}
                  onChange={(e) =>
                    handlePriceChange(metal.value, e.target.value)
                  }
                  placeholder="0.00"
                  className={errors[metal.value] ? "error" : ""}
                />
                {errors[metal.value] && (
                  <p className="error-message">{errors[metal.value]}</p>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <style>{`
        .metal-pricing-table {
          margin: 1rem 0;
        }

        .pricing-table {
          width: 100%;
          border-collapse: collapse;
          background: white;
        }

        .pricing-table th {
          text-align: left;
          padding: 0.75rem;
          background: #f7f7f7;
          font-weight: 600;
          font-size: 0.9rem;
          color: #333;
          border-bottom: 2px solid #e0e0e0;
        }

        .pricing-table td {
          padding: 0.75rem;
          border-bottom: 1px solid #f0f0f0;
        }

        .metal-label {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .metal-color-swatch {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: 2px solid #333;
          box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.5);
        }

        .pricing-table input {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #e0e0e0;
          border-radius: 4px;
          font-size: 1rem;
        }

        .pricing-table input:focus {
          outline: none;
          border-color: #6D2932;
          box-shadow: 0 0 0 3px rgba(109, 41, 50, 0.1);
        }

        .pricing-table input.error {
          border-color: #dc3545;
        }

        .error-message {
          color: #dc3545;
          font-size: 0.75rem;
          margin: 0.25rem 0 0 0;
        }
      `}</style>
    </div>
  );
}
