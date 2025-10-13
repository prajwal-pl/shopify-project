/**
 * Price Breakdown Component
 *
 * Expandable itemized price details for review step.
 */

import { useState } from "react";
import type { PriceBreakdown as PriceBreakdownType } from "~/types/builder";

interface PriceBreakdownProps {
  breakdown: PriceBreakdownType;
  expanded?: boolean;
}

export function PriceBreakdown({
  breakdown,
  expanded: defaultExpanded = false,
}: PriceBreakdownProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="price-breakdown">
      {/* Total Display (Always Visible) */}
      <div className="total-section">
        <div
          className="total-header"
          onClick={() => setIsExpanded(!isExpanded)}
          onKeyDown={(e) => e.key === "Enter" && setIsExpanded(!isExpanded)}
          role="button"
          tabIndex={0}
        >
          <h3>Total Price</h3>
          <button
            className="toggle-button"
            aria-label={isExpanded ? "Collapse details" : "Expand details"}
            aria-expanded={isExpanded}
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
          >
            {isExpanded ? "−" : "+"}
          </button>
        </div>
        <div className="total-amount">{formatPrice(breakdown.total)}</div>
      </div>

      {/* Itemized Breakdown (Expandable) */}
      {isExpanded && (
        <div className="breakdown-details">
          <div className="detail-row">
            <span className="detail-label">Ring Setting</span>
            <span className="detail-amount">
              {formatPrice(breakdown.settingPrice)}
            </span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Center Stone</span>
            <span className="detail-amount">
              {formatPrice(breakdown.stonePrice)}
            </span>
          </div>

          {breakdown.sideStonesPrice > 0 && (
            <div className="detail-row">
              <span className="detail-label">Side Stones</span>
              <span className="detail-amount">
                {formatPrice(breakdown.sideStonesPrice)}
              </span>
            </div>
          )}

          <div className="divider" />

          <div className="detail-row subtotal">
            <span className="detail-label">Subtotal</span>
            <span className="detail-amount">
              {formatPrice(breakdown.subtotal)}
            </span>
          </div>

          {breakdown.markup > 0 && (
            <div className="detail-row">
              <span className="detail-label">
                Markup ({breakdown.markupPercent}%)
              </span>
              <span className="detail-amount">
                {formatPrice(breakdown.markup)}
              </span>
            </div>
          )}

          <div className="divider bold" />

          <div className="detail-row total">
            <span className="detail-label">Total</span>
            <span className="detail-amount">
              {formatPrice(breakdown.total)}
            </span>
          </div>
        </div>
      )}

      <style>{`
        .price-breakdown {
          background: linear-gradient(135deg, #fff9e6 0%, #ffffff 100%);
          border: 2px solid #d4af37;
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 24px;
          box-shadow: 0 4px 6px rgba(212, 175, 55, 0.1);
        }

        .total-section {
          cursor: pointer;
        }

        .total-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .total-header h3 {
          font-size: 16px;
          font-weight: 600;
          color: #6b7280;
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .toggle-button {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: white;
          border: 1px solid #d4af37;
          border-radius: 6px;
          font-size: 20px;
          font-weight: 300;
          color: #d4af37;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .toggle-button:hover {
          background: #fff9e6;
        }

        .total-amount {
          font-size: 36px;
          font-weight: 700;
          color: #111827;
          line-height: 1;
        }

        .breakdown-details {
          margin-top: 20px;
          padding-top: 20px;
          border-top: 2px solid rgba(212, 175, 55, 0.2);
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 0;
        }

        .detail-label {
          font-size: 15px;
          color: #6b7280;
        }

        .detail-amount {
          font-size: 16px;
          font-weight: 600;
          color: #111827;
        }

        .detail-row.subtotal .detail-label,
        .detail-row.subtotal .detail-amount {
          font-weight: 600;
          color: #374151;
        }

        .detail-row.total .detail-label {
          font-size: 18px;
          font-weight: 700;
          color: #111827;
        }

        .detail-row.total .detail-amount {
          font-size: 20px;
          font-weight: 700;
          color: #d4af37;
        }

        .divider {
          height: 1px;
          background: #e5e7eb;
          margin: 8px 0;
        }

        .divider.bold {
          height: 2px;
          background: #d4af37;
          margin: 12px 0;
        }

        /* Mobile responsive */
        @media (max-width: 768px) {
          .price-breakdown {
            padding: 20px;
          }

          .total-amount {
            font-size: 32px;
          }

          .total-header h3 {
            font-size: 14px;
          }

          .detail-label {
            font-size: 14px;
          }

          .detail-amount {
            font-size: 15px;
          }

          .detail-row.total .detail-label {
            font-size: 16px;
          }

          .detail-row.total .detail-amount {
            font-size: 18px;
          }
        }
      `}</style>
    </div>
  );
}
