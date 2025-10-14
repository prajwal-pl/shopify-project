/**
 * View Mode Toggle Component
 *
 * Phase 2.0: Toggle between Grid and List view.
 *
 * Features:
 * - Two modes: Grid, List
 * - Icons for each mode
 * - Persists preference to localStorage
 * - Smooth transitions
 */

import { useEffect } from "react";

type ViewMode = "grid" | "list";

interface ViewModeToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export function ViewModeToggle({
  viewMode,
  onViewModeChange,
}: ViewModeToggleProps) {
  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem("stoneViewMode", viewMode);
  }, [viewMode]);

  return (
    <div className="view-mode-toggle">
      <button
        type="button"
        className={`toggle-btn ${viewMode === "grid" ? "active" : ""}`}
        onClick={() => onViewModeChange("grid")}
        aria-label="Grid view"
        aria-pressed={viewMode === "grid"}
      >
        <span className="icon">▦</span>
        <span className="label">Grid</span>
      </button>

      <button
        type="button"
        className={`toggle-btn ${viewMode === "list" ? "active" : ""}`}
        onClick={() => onViewModeChange("list")}
        aria-label="List view"
        aria-pressed={viewMode === "list"}
      >
        <span className="icon">☰</span>
        <span className="label">List</span>
      </button>

      <style>{`
        .view-mode-toggle {
          display: flex;
          gap: 0.5rem;
          background: white;
          padding: 0.25rem;
          border-radius: 8px;
          border: 1px solid #e0e0e0;
        }

        .toggle-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: transparent;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 500;
          color: #666;
          transition: all 0.2s;
        }

        .toggle-btn:hover {
          background: #f7f7f7;
          color: #333;
        }

        .toggle-btn.active {
          background: #6D2932;
          color: white;
        }

        .toggle-btn .icon {
          font-size: 1.1rem;
        }

        @media (max-width: 640px) {
          .toggle-btn .label {
            display: none;
          }

          .toggle-btn {
            padding: 0.5rem 0.75rem;
          }
        }
      `}</style>
    </div>
  );
}
