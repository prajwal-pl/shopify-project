/**
 * Diamond Type Tabs Component
 *
 * Phase 2.0: Tab interface for diamond categorization.
 *
 * Features:
 * - Three tabs: Mined, Lab Grown, Fancy Color
 * - Count badges showing number of diamonds
 * - Active tab styling (burgundy #6D2932)
 * - Mobile-responsive (full-width)
 * - Smooth transitions
 */

import type { DiamondType } from "~/types/builder";

interface DiamondTypeTabsProps {
  activeType: DiamondType;
  onTypeChange: (type: DiamondType) => void;
  counts: {
    mined: number;
    lab_grown: number;
    fancy_color: number;
  };
}

interface Tab {
  type: DiamondType;
  label: string;
  icon: string;
}

const TABS: Tab[] = [
  { type: "mined", label: "Mined", icon: "💎" },
  { type: "lab_grown", label: "Lab Grown", icon: "🔬" },
  { type: "fancy_color", label: "Fancy Color", icon: "🌈" },
];

export function DiamondTypeTabs({
  activeType,
  onTypeChange,
  counts,
}: DiamondTypeTabsProps) {
  return (
    <div className="diamond-type-tabs">
      <div className="tabs-container">
        {TABS.map((tab) => {
          const isActive = activeType === tab.type;
          const count = counts[tab.type] || 0;

          return (
            <button
              key={tab.type}
              type="button"
              className={`tab-button ${isActive ? "active" : ""}`}
              onClick={() => onTypeChange(tab.type)}
              aria-label={`View ${tab.label} diamonds`}
              aria-selected={isActive}
              role="tab"
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
              <span className="tab-count">({count.toLocaleString()})</span>
            </button>
          );
        })}
      </div>

      <style>{`
        .diamond-type-tabs {
          margin-bottom: 2rem;
        }

        .tabs-container {
          display: flex;
          gap: 0.5rem;
          border-bottom: 2px solid #e0e0e0;
        }

        /* Mobile: Full-width stacked tabs */
        @media (max-width: 640px) {
          .tabs-container {
            flex-direction: column;
            gap: 0.25rem;
            border-bottom: none;
          }
        }

        .tab-button {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 1rem 1.5rem;
          background: white;
          border: 2px solid #e0e0e0;
          border-bottom: none;
          border-radius: 8px 8px 0 0;
          cursor: pointer;
          font-size: 1rem;
          font-weight: 500;
          color: #666;
          transition: all 0.25s ease;
          position: relative;
        }

        /* Mobile: Full width with bottom border */
        @media (max-width: 640px) {
          .tab-button {
            width: 100%;
            border-radius: 6px;
            border-bottom: 2px solid #e0e0e0;
          }
        }

        .tab-button:hover:not(.active) {
          background: #f7f7f7;
          border-color: #ccc;
          color: #333;
        }

        .tab-button.active {
          background: #6D2932;
          border-color: #6D2932;
          color: white;
          box-shadow: 0 4px 12px rgba(109, 41, 50, 0.2);
          z-index: 1;
        }

        .tab-button:focus {
          outline: 2px solid #6D2932;
          outline-offset: 2px;
        }

        .tab-icon {
          font-size: 1.25rem;
        }

        .tab-label {
          font-weight: 600;
        }

        .tab-count {
          font-size: 0.9rem;
          opacity: 0.8;
        }

        .tab-button.active .tab-count {
          opacity: 0.9;
          font-weight: 600;
        }

        /* Tablet: Slightly smaller */
        @media (min-width: 641px) and (max-width: 1023px) {
          .tab-button {
            padding: 0.75rem 1rem;
            font-size: 0.95rem;
          }

          .tab-icon {
            font-size: 1.1rem;
          }
        }

        /* Large desktop: More spacing */
        @media (min-width: 1280px) {
          .tab-button {
            padding: 1.25rem 2rem;
          }
        }
      `}</style>
    </div>
  );
}

/**
 * Get emoji icon for diamond types
 */
function getIconEmoji(value: string, type: "shape" | "style"): string {
  if (type === "shape") {
    const shapeEmojis: Record<string, string> = {
      round: "⚪",
      princess: "◆",
      oval: "⬭",
      pear: "💧",
      marquise: "🔶",
      heart: "♥️",
      emerald: "▭",
      cushion: "◻️",
      asscher: "▦",
      radiant: "◊",
    };
    return shapeEmojis[value] || "💎";
  }

  // Style emojis
  const styleEmojis: Record<string, string> = {
    halo: "⭕",
    solitaire: "💍",
    three_stone: "⚫",
    single_row: "═",
    trellis: "⚡",
    multirow: "≡",
    vintage: "🏛️",
    pave: "✨",
    bypass: "∞",
  };
  return styleEmojis[value] || "💍";
}
