import React from "react";

interface ResultsControlBarProps {
  totalResults: number;
  compareCount?: number;
  perPage: number;
  onPerPageChange: (value: number) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
}

const PER_PAGE_OPTIONS = [10, 20, 50, 100];

export function ResultsControlBar({
  totalResults,
  compareCount = 0,
  perPage,
  onPerPageChange,
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange
}: ResultsControlBarProps) {
  return (
    <div className="results-control-bar">
      <div className="results-info">
        <span className="results-count">{totalResults} Similar Diamonds</span>
        {compareCount > 0 && (
          <>
            <span className="separator">|</span>
            <span className="compare-count">Compare Items ({compareCount})</span>
          </>
        )}
      </div>

      <div className="control-section">
        <div className="per-page-control">
          <label htmlFor="per-page-select" className="control-label">Per Page</label>
          <select
            id="per-page-select"
            className="per-page-select"
            value={perPage}
            onChange={(e) => onPerPageChange(Number(e.target.value))}
          >
            {PER_PAGE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="view-toggle">
          <button
            type="button"
            className={`view-button ${viewMode === "grid" ? "active" : ""}`}
            onClick={() => onViewModeChange("grid")}
            title="Grid view"
          >
            ž
          </button>
          <button
            type="button"
            className={`view-button ${viewMode === "list" ? "active" : ""}`}
            onClick={() => onViewModeChange("list")}
            title="List view"
          >
            0
          </button>
        </div>

        <div className="search-control">
          <input
            type="text"
            className="search-input"
            placeholder="Search Diamond Stock #"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <button type="button" className="search-button">
            =
          </button>
        </div>
      </div>

      <style>{`
        .results-control-bar {
          background: white;
          border: 1px solid #e0e0e0;
          padding: 16px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          border-radius: 4px;
        }

        .results-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .results-count {
          font-size: 16px;
          font-weight: 700;
          color: #333;
        }

        .separator {
          color: #ccc;
          font-size: 16px;
        }

        .compare-count {
          font-size: 14px;
          font-weight: 600;
          color: #666;
        }

        .control-section {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .per-page-control {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .control-label {
          font-size: 14px;
          font-weight: 600;
          color: #666;
        }

        .per-page-select {
          padding: 6px 12px;
          border: 1px solid #e0e0e0;
          border-radius: 4px;
          font-size: 14px;
          font-weight: 600;
          color: #333;
          background: white;
          cursor: pointer;
        }

        .per-page-select:focus {
          outline: none;
          border-color: #7c2d5e;
        }

        .view-toggle {
          display: flex;
          gap: 4px;
          border: 1px solid #e0e0e0;
          border-radius: 4px;
          overflow: hidden;
        }

        .view-button {
          padding: 8px 12px;
          background: white;
          border: none;
          font-size: 18px;
          color: #666;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .view-button:hover {
          background: #f5f5f5;
        }

        .view-button.active {
          background: #7c2d5e;
          color: white;
        }

        .search-control {
          display: flex;
          gap: 0;
          border: 1px solid #e0e0e0;
          border-radius: 4px;
          overflow: hidden;
        }

        .search-input {
          padding: 8px 12px;
          border: none;
          font-size: 14px;
          color: #333;
          width: 200px;
        }

        .search-input:focus {
          outline: none;
        }

        .search-button {
          padding: 8px 12px;
          background: #7c2d5e;
          border: none;
          color: white;
          font-size: 16px;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .search-button:hover {
          background: #5c1d3e;
        }

        @media (max-width: 1024px) {
          .results-control-bar {
            flex-direction: column;
            gap: 16px;
            align-items: flex-start;
          }

          .control-section {
            width: 100%;
            justify-content: space-between;
          }
        }

        @media (max-width: 768px) {
          .control-section {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }

          .search-input {
            width: 100%;
          }

          .search-control {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
