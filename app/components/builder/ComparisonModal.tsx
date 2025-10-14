/**
 * Comparison Modal Component
 *
 * Phase 2.0: Side-by-side diamond comparison interface.
 *
 * Features:
 * - Compare 2-4 diamonds
 * - Side-by-side columns
 * - Highlight differences (yellow background)
 * - "Best Value" indicator
 * - "Select This Diamond" buttons
 * - Mobile-responsive (horizontal scroll)
 * - Remove from comparison
 * - React.memo optimization for performance
 */

import { memo } from "react";
import type { Stone } from "~/types/builder";
import {
  COMPARISON_FIELDS,
  formatComparisonValue,
  getComparisonValue,
  type ComparisonResult,
} from "~/utils/comparison-helpers";

interface ComparisonModalProps {
  comparisonData: ComparisonResult;
  isOpen: boolean;
  onClose: () => void;
  onSelectStone: (stone: Stone) => void;
  onRemoveStone: (stoneId: string) => void;
}

export const ComparisonModal = memo(function ComparisonModal({
  comparisonData,
  isOpen,
  onClose,
  onSelectStone,
  onRemoveStone,
}: ComparisonModalProps) {
  if (!isOpen || comparisonData.stones.length < 2) return null;

  const { stones, differences, bestValue, pricesPerCarat } = comparisonData;

  return (
    <div className="comparison-modal-overlay" onClick={onClose}>
      <div
        className="comparison-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>Compare Diamonds</h2>
          <button className="close-button" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div className="comparison-table-wrapper">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th className="field-header">Specification</th>
                  {stones.map((stone) => (
                    <th key={stone.id} className="stone-header">
                      <div className="stone-header-content">
                        <div className="header-image">
                          {stone.images?.[0] ? (
                            <img
                              src={stone.images[0]}
                              alt={`${stone.carat}ct ${stone.shape}`}
                            />
                          ) : (
                            <div className="image-placeholder">💎</div>
                          )}
                        </div>
                        <div className="header-info">
                          <div className="header-title">
                            {stone.carat.toFixed(2)}ct {stone.shape}
                          </div>
                          {bestValue === stone.id && (
                            <div className="best-value-badge">Best Value</div>
                          )}
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {COMPARISON_FIELDS.map((field) => {
                  const isDifferent = differences[field.key];

                  return (
                    <tr
                      key={field.key}
                      className={isDifferent ? "different-row" : ""}
                    >
                      <td className="field-label">{field.label}</td>
                      {stones.map((stone) => {
                        const value = getComparisonValue(stone, field.key);

                        if (field.type === "image") {
                          // Image already shown in header, skip
                          return <td key={stone.id}>—</td>;
                        }

                        const formattedValue = formatComparisonValue(
                          value,
                          field.type,
                        );

                        // Special handling for price per carat row
                        if (field.key === "pricePerCarat") {
                          return (
                            <td key={stone.id} className="price-cell">
                              {formattedValue}
                              {bestValue === stone.id && (
                                <span className="best-indicator"> ⭐</span>
                              )}
                            </td>
                          );
                        }

                        return <td key={stone.id}>{formattedValue}</td>;
                      })}
                    </tr>
                  );
                })}
              </tbody>

              <tfoot>
                <tr>
                  <td className="actions-label">Actions</td>
                  {stones.map((stone) => (
                    <td key={stone.id} className="actions-cell">
                      <button
                        className="select-button"
                        onClick={() => onSelectStone(stone)}
                      >
                        Select This Diamond
                      </button>
                      <button
                        className="remove-button"
                        onClick={() => onRemoveStone(stone.id)}
                      >
                        Remove
                      </button>
                    </td>
                  ))}
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <style>{`
          .comparison-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
            padding: 1rem;
          }

          .comparison-modal-container {
            background: white;
            border-radius: 12px;
            max-width: 95vw;
            max-height: 90vh;
            width: 100%;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            display: flex;
            flex-direction: column;
          }

          .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1.5rem;
            border-bottom: 1px solid #e0e0e0;
            flex-shrink: 0;
          }

          .modal-header h2 {
            margin: 0;
            font-size: 1.5rem;
            color: #333;
          }

          .close-button {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: #666;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
          }

          .close-button:hover {
            background: #f0f0f0;
            color: #333;
          }

          .modal-body {
            flex: 1;
            overflow-y: auto;
            padding: 1.5rem;
          }

          .comparison-table-wrapper {
            overflow-x: auto;
          }

          .comparison-table {
            width: 100%;
            border-collapse: collapse;
            background: white;
          }

          .comparison-table th,
          .comparison-table td {
            padding: 1rem;
            border: 1px solid #e0e0e0;
            text-align: center;
            min-width: 200px;
          }

          .field-header,
          .field-label {
            background: #f7f7f7;
            font-weight: 600;
            color: #333;
            text-align: left;
            position: sticky;
            left: 0;
            z-index: 1;
          }

          .stone-header {
            background: #fff;
            vertical-align: top;
          }

          .stone-header-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.75rem;
          }

          .header-image {
            width: 120px;
            height: 120px;
            border-radius: 8px;
            overflow: hidden;
            border: 1px solid #e0e0e0;
          }

          .header-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .image-placeholder {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f7f7f7;
            font-size: 3rem;
          }

          .header-info {
            text-align: center;
          }

          .header-title {
            font-weight: 600;
            font-size: 1rem;
            color: #333;
            margin-bottom: 0.5rem;
          }

          .best-value-badge {
            display: inline-block;
            padding: 0.3rem 0.75rem;
            background: #ffc107;
            color: #333;
            border-radius: 4px;
            font-size: 0.75rem;
            font-weight: 700;
            text-transform: uppercase;
          }

          .different-row {
            background: #fffbea;
          }

          .different-row td {
            font-weight: 600;
            color: #333;
          }

          .price-cell {
            font-weight: 700;
            color: #6D2932;
            font-size: 1.1rem;
          }

          .best-indicator {
            color: #ffc107;
            font-size: 1.2rem;
          }

          .actions-label {
            background: #f7f7f7;
            font-weight: 600;
          }

          .actions-cell {
            padding: 1.5rem 1rem;
          }

          .select-button,
          .remove-button {
            width: 100%;
            padding: 0.75rem;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.2s;
            margin-bottom: 0.5rem;
          }

          .select-button {
            background: #6D2932;
            color: white;
          }

          .select-button:hover {
            background: #5a1f28;
          }

          .remove-button {
            background: white;
            color: #dc3545;
            border: 1px solid #dc3545;
          }

          .remove-button:hover {
            background: #dc3545;
            color: white;
          }

          /* Mobile: Reduce padding */
          @media (max-width: 640px) {
            .comparison-table th,
            .comparison-table td {
              padding: 0.75rem 0.5rem;
              min-width: 150px;
              font-size: 0.9rem;
            }

            .header-image {
              width: 80px;
              height: 80px;
            }
          }
        `}</style>
      </div>
    </div>
  );
});
