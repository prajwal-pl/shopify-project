/**
 * Stone Card List Component
 *
 * Mobile card view for stones.
 */

import React, { useState } from "react";
import type { Stone } from "~/types/builder";
import { useBuilder } from "./BuilderProvider";
import {
  formatPrice,
  formatCarat,
  formatCertificate,
  formatStoneSummary,
} from "~/utils/formatters";
import { getStoneShapeLabel } from "~/utils/constants";

export function StoneCardList({ stones }: { stones: Stone[] }) {
  const { selectStone } = useBuilder();

  return (
    <div className="stone-card-list">
      {stones.map((stone) => (
        <div key={stone.id} className="stone-card">
          <div className="card-image">
            {stone.images[0] ? (
              <img src={stone.images[0]} alt="Stone" />
            ) : (
              <div className="no-image">💎</div>
            )}
          </div>

          <div className="card-details">
            <h4>
              {formatCarat(stone.carat)} {getStoneShapeLabel(stone.shape)}
            </h4>
            <p className="stone-price">{formatPrice(stone.price)}</p>

            <div className="stone-specs">
              {stone.cut && (
                <span className="spec-badge">Cut: {stone.cut}</span>
              )}
              {stone.color && (
                <span className="spec-badge">
                  Color: {stone.color.toUpperCase()}
                </span>
              )}
              {stone.clarity && (
                <span className="spec-badge">
                  Clarity: {stone.clarity.toUpperCase()}
                </span>
              )}
            </div>

            {stone.certificate && (
              <p className="certificate-info">
                {formatCertificate(
                  stone.certificate,
                  stone.certificateNumber || "",
                )}
              </p>
            )}

            <button
              onClick={() => selectStone(stone)}
              className="select-button"
            >
              Select This Stone
            </button>
          </div>

          <style>{`
            .stone-card-list {
              display: flex;
              flex-direction: column;
              gap: 16px;
            }

            .stone-card {
              background: white;
              border: 1px solid #e5e5e5;
              border-radius: 8px;
              display: flex;
              gap: 16px;
              padding: 16px;
              transition: all 0.2s ease;
            }

            .stone-card:hover {
              border-color: #d4af37;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            }

            .card-image {
              width: 100px;
              height: 100px;
              background: #f6f6f7;
              border-radius: 6px;
              flex-shrink: 0;
              display: flex;
              align-items: center;
              justify-content: center;
              overflow: hidden;
            }

            .card-image img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }

            .no-image {
              font-size: 40px;
            }

            .card-details {
              flex: 1;
              display: flex;
              flex-direction: column;
            }

            .card-details h4 {
              font-size: 18px;
              font-weight: 600;
              margin: 0 0 8px;
              color: #1a1a1a;
            }

            .stone-price {
              font-size: 20px;
              font-weight: 700;
              color: #d4af37;
              margin: 0 0 12px;
            }

            .stone-specs {
              display: flex;
              flex-wrap: wrap;
              gap: 8px;
              margin-bottom: 12px;
            }

            .spec-badge {
              padding: 4px 8px;
              background: #f6f6f7;
              border-radius: 4px;
              font-size: 12px;
              color: #202223;
            }

            .certificate-info {
              font-size: 12px;
              color: #6d7175;
              margin: 0 0 12px;
            }

            .select-button {
              padding: 10px 16px;
              background: #d4af37;
              color: white;
              border: none;
              border-radius: 6px;
              font-size: 14px;
              font-weight: 600;
              cursor: pointer;
              transition: background 0.2s ease;
              align-self: flex-start;
            }

            .select-button:hover {
              background: #c29d2f;
            }
          `}</style>
        </div>
      ))}
    </div>
  );
}
