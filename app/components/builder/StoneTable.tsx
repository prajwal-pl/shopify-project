/**
 * Stone Table Component
 *
 * Desktop table view for stones with sorting.
 */

import React, { useState } from "react";
import type { Stone } from "~/types/builder";
import { useBuilder } from "./BuilderProvider";
import {
  formatPrice,
  formatCarat,
  formatCertificate,
} from "~/utils/formatters";
import {
  getStoneShapeLabel,
  getCutGradeLabel,
  getColorGradeLabel,
  getClarityGradeLabel,
} from "~/utils/constants";

interface StoneTableProps {
  stones: Stone[];
  sortBy: { field: string; order: "asc" | "desc" };
  onSortChange: (sort: { field: string; order: "asc" | "desc" }) => void;
}

export function StoneTable({ stones, sortBy, onSortChange }: StoneTableProps) {
  const { selectStone } = useBuilder();
  const [selectedStoneForModal, setSelectedStoneForModal] =
    useState<Stone | null>(null);

  const handleSort = (field: string) => {
    if (sortBy.field === field) {
      // Toggle order
      onSortChange({ field, order: sortBy.order === "asc" ? "desc" : "asc" });
    } else {
      // New field, default to asc
      onSortChange({ field, order: "asc" });
    }
  };

  const getSortIcon = (field: string) => {
    if (sortBy.field !== field) return "↕";
    return sortBy.order === "asc" ? "↑" : "↓";
  };

  return (
    <div className="stone-table-container">
      <table className="stone-table">
        <thead>
          <tr>
            <th>Image</th>
            <th onClick={() => handleSort("shape")} className="sortable">
              Shape {getSortIcon("shape")}
            </th>
            <th onClick={() => handleSort("carat")} className="sortable">
              Carat {getSortIcon("carat")}
            </th>
            <th onClick={() => handleSort("cut")} className="sortable">
              Cut {getSortIcon("cut")}
            </th>
            <th onClick={() => handleSort("color")} className="sortable">
              Color {getSortIcon("color")}
            </th>
            <th onClick={() => handleSort("clarity")} className="sortable">
              Clarity {getSortIcon("clarity")}
            </th>
            <th onClick={() => handleSort("price")} className="sortable">
              Price {getSortIcon("price")}
            </th>
            <th>Certificate</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {stones.map((stone) => (
            <tr key={stone.id} className="stone-row">
              <td>
                <div className="stone-image">
                  {stone.images[0] ? (
                    <img src={stone.images[0]} alt="Stone" />
                  ) : (
                    <div className="no-image">💎</div>
                  )}
                </div>
              </td>
              <td>{getStoneShapeLabel(stone.shape)}</td>
              <td>{formatCarat(stone.carat)}</td>
              <td>{stone.cut ? getCutGradeLabel(stone.cut) : "-"}</td>
              <td>{stone.color ? getColorGradeLabel(stone.color) : "-"}</td>
              <td>
                {stone.clarity ? getClarityGradeLabel(stone.clarity) : "-"}
              </td>
              <td className="price-cell">{formatPrice(stone.price)}</td>
              <td className="cert-cell">
                {stone.certificate
                  ? formatCertificate(
                      stone.certificate,
                      stone.certificateNumber || "",
                    )
                  : "-"}
              </td>
              <td>
                <div className="action-buttons">
                  <button
                    onClick={() => setSelectedStoneForModal(stone)}
                    className="details-button"
                  >
                    Details
                  </button>
                  <button
                    onClick={() => selectStone(stone)}
                    className="select-button"
                  >
                    Select
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedStoneForModal && (
        <StoneModal
          stone={selectedStoneForModal}
          onClose={() => setSelectedStoneForModal(null)}
          onSelect={() => {
            selectStone(selectedStoneForModal);
            setSelectedStoneForModal(null);
          }}
        />
      )}

      <style>{`
        .stone-table-container {
          background: white;
          border: 1px solid #e5e5e5;
          border-radius: 8px;
          overflow: auto;
        }

        .stone-table {
          width: 100%;
          border-collapse: collapse;
        }

        .stone-table thead {
          background: #f6f6f7;
          border-bottom: 2px solid #e5e5e5;
        }

        .stone-table th {
          padding: 16px 12px;
          text-align: left;
          font-size: 13px;
          font-weight: 600;
          color: #202223;
          white-space: nowrap;
        }

        .stone-table th.sortable {
          cursor: pointer;
          user-select: none;
        }

        .stone-table th.sortable:hover {
          background: #eeeff0;
        }

        .stone-table td {
          padding: 16px 12px;
          font-size: 14px;
          color: #202223;
          border-bottom: 1px solid #e5e5e5;
        }

        .stone-row:hover {
          background: #f9f9f9;
        }

        .stone-image {
          width: 60px;
          height: 60px;
          background: #f6f6f7;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .stone-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .no-image {
          font-size: 24px;
        }

        .price-cell {
          font-weight: 600;
          color: #d4af37;
        }

        .cert-cell {
          font-size: 12px;
        }

        .action-buttons {
          display: flex;
          gap: 8px;
        }

        .details-button,
        .select-button {
          padding: 6px 12px;
          border: none;
          border-radius: 4px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .details-button {
          background: white;
          color: #2c6ecb;
          border: 1px solid #2c6ecb;
        }

        .details-button:hover {
          background: #f0f5ff;
        }

        .select-button {
          background: #d4af37;
          color: white;
        }

        .select-button:hover {
          background: #c29d2f;
        }
      `}</style>
    </div>
  );
}

function StoneModal({
  stone,
  onClose,
  onSelect,
}: {
  stone: Stone;
  onClose: () => void;
  onSelect: () => void;
}) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Stone Details</h3>
          <button onClick={onClose} className="close-button">
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="stone-detail-grid">
            <div className="detail-images">
              {stone.images[0] ? (
                <img src={stone.images[0]} alt="Stone" className="main-image" />
              ) : (
                <div className="no-image-large">💎</div>
              )}
            </div>

            <div className="detail-specs">
              <h4>
                {formatCarat(stone.carat)} {getStoneShapeLabel(stone.shape)}
              </h4>
              <div className="spec-price">{formatPrice(stone.price)}</div>

              <div className="specs-table">
                <div className="spec-row">
                  <span>Cut:</span>
                  <span>{stone.cut ? getCutGradeLabel(stone.cut) : "-"}</span>
                </div>
                <div className="spec-row">
                  <span>Color:</span>
                  <span>
                    {stone.color ? getColorGradeLabel(stone.color) : "-"}
                  </span>
                </div>
                <div className="spec-row">
                  <span>Clarity:</span>
                  <span>
                    {stone.clarity ? getClarityGradeLabel(stone.clarity) : "-"}
                  </span>
                </div>
                {stone.certificate && (
                  <div className="spec-row">
                    <span>Certificate:</span>
                    <span>
                      {formatCertificate(
                        stone.certificate,
                        stone.certificateNumber || "",
                      )}
                    </span>
                  </div>
                )}
                {stone.measurements && (
                  <div className="spec-row">
                    <span>Measurements:</span>
                    <span>{stone.measurements}</span>
                  </div>
                )}
                {stone.tablePercent && (
                  <div className="spec-row">
                    <span>Table %:</span>
                    <span>{stone.tablePercent}%</span>
                  </div>
                )}
                {stone.depthPercent && (
                  <div className="spec-row">
                    <span>Depth %:</span>
                    <span>{stone.depthPercent}%</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={onSelect} className="select-button-modal">
            Select This Stone
          </button>
        </div>

        <style>{`
          .stone-detail-grid {
            display: grid;
            grid-template-columns: 300px 1fr;
            gap: 32px;
          }

          .detail-images {
            width: 100%;
          }

          .main-image {
            width: 100%;
            aspect-ratio: 1;
            object-fit: cover;
            border-radius: 8px;
          }

          .no-image-large {
            width: 100%;
            aspect-ratio: 1;
            background: #f6f6f7;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 80px;
          }

          .detail-specs h4 {
            font-size: 24px;
            font-weight: 700;
            margin: 0 0 12px;
          }

          .spec-price {
            font-size: 28px;
            font-weight: 700;
            color: #d4af37;
            margin-bottom: 24px;
          }

          .specs-table {
            display: flex;
            flex-direction: column;
            gap: 12px;
          }

          .spec-row {
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            border-bottom: 1px solid #e5e5e5;
          }

          .spec-row span:first-child {
            font-weight: 500;
            color: #6d7175;
          }

          .spec-row span:last-child {
            font-weight: 600;
            color: #202223;
          }

          .select-button-modal {
            width: 100%;
            padding: 14px 32px;
            background: #d4af37;
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
          }

          .select-button-modal:hover {
            background: #c29d2f;
          }

          @media (max-width: 768px) {
            .stone-detail-grid {
              grid-template-columns: 1fr;
            }
          }
        `}</style>
      </div>
    </div>
  );
}
