/**
 * Records Per Page Selector Component
 *
 * Phase 2.0: Dropdown for selecting number of results per page.
 *
 * Features:
 * - Options: 12, 20, 50, 100
 * - Default: 20
 * - Persists to localStorage
 * - Updates pagination
 */

import { useEffect } from "react";

interface RecordsPerPageSelectorProps {
  perPage: number;
  onChange: (perPage: number) => void;
  totalCount: number;
}

const OPTIONS = [12, 20, 50, 100];

export function RecordsPerPageSelector({
  perPage,
  onChange,
  totalCount,
}: RecordsPerPageSelectorProps) {
  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem("stonesPerPage", perPage.toString());
  }, [perPage]);

  return (
    <div className="records-per-page-selector">
      <label htmlFor="perPage">Show:</label>
      <select
        id="perPage"
        value={perPage}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="per-page-select"
      >
        {OPTIONS.map((option) => (
          <option key={option} value={option}>
            {option} per page
          </option>
        ))}
      </select>
      <span className="total-info">
        of {totalCount.toLocaleString()} results
      </span>

      <style>{`
        .records-per-page-selector {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
        }

        .records-per-page-selector label {
          color: #666;
          font-weight: 500;
        }

        .per-page-select {
          padding: 0.5rem 0.75rem;
          border: 1px solid #e0e0e0;
          border-radius: 6px;
          background: white;
          cursor: pointer;
          font-size: 0.9rem;
        }

        .per-page-select:focus {
          outline: none;
          border-color: #6D2932;
          box-shadow: 0 0 0 3px rgba(109, 41, 50, 0.1);
        }

        .total-info {
          color: #999;
          font-size: 0.85rem;
        }

        @media (max-width: 640px) {
          .records-per-page-selector {
            flex-wrap: wrap;
            font-size: 0.85rem;
          }

          .total-info {
            width: 100%;
            text-align: center;
            margin-top: 0.25rem;
          }
        }
      `}</style>
    </div>
  );
}
