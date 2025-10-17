/**
 * Action Bar Component
 *
 * Horizontal bar with Save Search and Reset buttons
 * Appears below step navigation
 */

import React from "react";

interface ActionBarProps {
  onSaveSearch?: () => void;
  onReset?: () => void;
  showSave?: boolean;
  showReset?: boolean;
}

export function ActionBar({
  onSaveSearch,
  onReset,
  showSave = true,
  showReset = true
}: ActionBarProps) {
  return (
    <div className="action-bar">
      {showSave && (
        <button
          type="button"
          className="action-button save-button"
          onClick={onSaveSearch}
        >
          💾 Save Search
        </button>
      )}

      {showReset && (
        <button
          type="button"
          className="action-button reset-button"
          onClick={onReset}
        >
          🔄 Reset
        </button>
      )}

      <style>{`
        .action-bar {
          background: #7c2d5e;
          padding: 12px 20px;
          display: flex;
          justify-content: flex-end;
          gap: 16px;
          margin-bottom: 24px;
          border-radius: 4px;
        }

        .action-button {
          background: transparent;
          border: 1px solid white;
          color: white;
          padding: 8px 20px;
          border-radius: 4px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .action-button:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateY(-1px);
        }

        .action-button:active {
          transform: translateY(0);
        }

        @media (max-width: 768px) {
          .action-bar {
            flex-wrap: wrap;
          }

          .action-button {
            flex: 1;
            min-width: 140px;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}
