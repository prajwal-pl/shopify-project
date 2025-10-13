/**
 * Price Summary Component
 *
 * Sticky component showing running total and price breakdown.
 */

import React, { useState } from "react";
import { useBuilder } from "./BuilderProvider";
import { formatPrice } from "~/utils/formatters";

export function PriceSummary() {
  const { priceBreakdown, selectedSetting, selectedStone, sideStones } =
    useBuilder();
  const [showBreakdown, setShowBreakdown] = useState(false);

  const hasSelection = selectedSetting || selectedStone;

  return (
    <div className="price-summary">
      <div className="summary-header">
        <h3>Your Ring</h3>
        <div className="total-price">{formatPrice(priceBreakdown.total)}</div>
      </div>

      {hasSelection && (
        <button
          type="button"
          onClick={() => setShowBreakdown(!showBreakdown)}
          className="breakdown-toggle"
        >
          {showBreakdown ? "Hide" : "Show"} Price Breakdown
        </button>
      )}

      {showBreakdown && (
        <div className="price-breakdown">
          {selectedSetting && (
            <div className="breakdown-row">
              <span>Setting</span>
              <span>{formatPrice(priceBreakdown.settingPrice)}</span>
            </div>
          )}

          {selectedStone && (
            <div className="breakdown-row">
              <span>Center Stone</span>
              <span>{formatPrice(priceBreakdown.stonePrice)}</span>
            </div>
          )}

          {sideStones && sideStones.quantity > 0 && (
            <div className="breakdown-row">
              <span>Side Stones ({sideStones.quantity})</span>
              <span>{formatPrice(priceBreakdown.sideStonesPrice)}</span>
            </div>
          )}

          {hasSelection && (
            <>
              <div className="breakdown-divider" />
              <div className="breakdown-row subtotal">
                <span>Subtotal</span>
                <span>{formatPrice(priceBreakdown.subtotal)}</span>
              </div>
            </>
          )}

          {priceBreakdown.markup > 0 && (
            <div className="breakdown-row">
              <span>Markup ({priceBreakdown.markupPercent}%)</span>
              <span>{formatPrice(priceBreakdown.markup)}</span>
            </div>
          )}
        </div>
      )}

      <style>{`
        .price-summary {
          background: white;
          border: 2px solid #d4af37;
          border-radius: 8px;
          padding: 24px;
        }

        .summary-header {
          text-align: center;
        }

        .summary-header h3 {
          font-size: 16px;
          font-weight: 600;
          color: #202223;
          margin: 0 0 12px;
        }

        .total-price {
          font-size: 32px;
          font-weight: 700;
          color: #d4af37;
          margin-bottom: 16px;
        }

        .breakdown-toggle {
          width: 100%;
          padding: 10px;
          background: #f6f6f7;
          border: 1px solid #e5e5e5;
          border-radius: 6px;
          font-size: 14px;
          color: #2c6ecb;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .breakdown-toggle:hover {
          background: #eeeff0;
        }

        .price-breakdown {
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid #e5e5e5;
        }

        .breakdown-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          font-size: 14px;
          color: #202223;
        }

        .breakdown-row.subtotal {
          font-weight: 600;
          font-size: 16px;
        }

        .breakdown-divider {
          height: 1px;
          background: #e5e5e5;
          margin: 12px 0;
        }

        @media (max-width: 1024px) {
          .price-summary {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 16px 20px;
            border-radius: 0;
            border-left: none;
            border-right: none;
            border-bottom: none;
          }

          .summary-header {
            text-align: left;
            display: flex;
            align-items: center;
            gap: 16px;
          }

          .summary-header h3 {
            margin: 0;
          }

          .total-price {
            font-size: 24px;
            margin: 0;
          }

          .breakdown-toggle {
            width: auto;
            min-width: 120px;
          }

          .price-breakdown {
            position: absolute;
            bottom: 100%;
            left: 0;
            right: 0;
            background: white;
            border-top: 1px solid #e5e5e5;
            padding: 16px 20px;
            box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1);
          }
        }
      `}</style>
    </div>
  );
}
