/**
 * Icon Shape Selector Component
 *
 * Phase 2.0: Visual icon-based selector for shapes and styles.
 * Used in admin product forms (diamonds and settings).
 *
 * Features:
 * - Single or multi-select mode
 * - Icon grid layout (responsive)
 * - Highlight selected items
 * - Mobile-friendly (2-5 columns)
 * - Accessible (keyboard navigation, aria-labels)
 */

import { useState } from "react";

export interface IconItem {
  value: string;
  label: string;
  icon?: string; // SVG path or icon name
}

interface IconShapeSelectorProps {
  items: IconItem[];
  selected: string | string[]; // Single string or array for multi-select
  onChange: (selected: string | string[]) => void;
  multiSelect?: boolean;
  label?: string;
  required?: boolean;
}

export function IconShapeSelector({
  items,
  selected,
  onChange,
  multiSelect = false,
  label,
  required = false,
}: IconShapeSelectorProps) {
  const isSelected = (value: string): boolean => {
    if (Array.isArray(selected)) {
      return selected.includes(value);
    }
    return selected === value;
  };

  const handleClick = (value: string) => {
    if (multiSelect && Array.isArray(selected)) {
      // Multi-select mode: toggle selection
      if (selected.includes(value)) {
        onChange(selected.filter((v) => v !== value));
      } else {
        onChange([...selected, value]);
      }
    } else {
      // Single-select mode: replace selection
      onChange(value);
    }
  };

  return (
    <div className="icon-shape-selector">
      {label && (
        <label className="selector-label">
          {label}
          {required && <span className="required-indicator"> *</span>}
        </label>
      )}

      <div className="icon-grid">
        {items.map((item) => {
          const itemSelected = isSelected(item.value);

          return (
            <button
              key={item.value}
              type="button"
              className={`icon-item ${itemSelected ? "selected" : ""}`}
              onClick={() => handleClick(item.value)}
              aria-label={`Select ${item.label}`}
              aria-pressed={itemSelected}
            >
              <div className="icon-container">
                {item.icon ? (
                  <img
                    src={item.icon}
                    alt={item.label}
                    className="shape-icon"
                  />
                ) : (
                  <div className="icon-placeholder">
                    {getShapeEmoji(item.value)}
                  </div>
                )}
              </div>
              <span className="icon-label">{item.label}</span>
            </button>
          );
        })}
      </div>

      <style>{`
        .icon-shape-selector {
          margin-bottom: 1.5rem;
        }

        .selector-label {
          display: block;
          font-weight: 600;
          font-size: 0.9rem;
          margin-bottom: 0.75rem;
          color: #333;
        }

        .required-indicator {
          color: #dc3545;
        }

        .icon-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 0.75rem;
        }

        /* Mobile: 2-3 columns */
        @media (max-width: 640px) {
          .icon-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        /* Tablet: 4-5 columns */
        @media (min-width: 641px) and (max-width: 1024px) {
          .icon-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        .icon-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 1rem 0.5rem;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          background: #ffffff;
          cursor: pointer;
          transition: all 0.2s ease;
          min-height: 100px;
        }

        .icon-item:hover {
          border-color: #6D2932;
          background: #f9f9f9;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .icon-item.selected {
          border-color: #6D2932;
          border-width: 3px;
          background: #FFF5F7;
          box-shadow: 0 4px 12px rgba(109, 41, 50, 0.2);
        }

        .icon-item:focus {
          outline: 2px solid #6D2932;
          outline-offset: 2px;
        }

        .icon-container {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          margin-bottom: 0.5rem;
        }

        .shape-icon {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }

        .icon-placeholder {
          font-size: 2rem;
        }

        .icon-label {
          font-size: 0.75rem;
          font-weight: 500;
          text-align: center;
          color: #333;
          line-height: 1.2;
        }

        .icon-item.selected .icon-label {
          color: #6D2932;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}

/**
 * Get emoji placeholder for shape (until SVG icons are created)
 */
function getShapeEmoji(shape: string): string {
  const emojiMap: Record<string, string> = {
    // Diamond shapes
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
    // Setting styles
    solitaire: "💍",
    halo: "⭕",
    three_stone: "⚫⚫⚫",
    vintage: "🏛️",
    modern: "🔲",
    pave: "✨",
    channel: "═",
    tension: "⚡",
  };

  return emojiMap[shape.toLowerCase()] || "💎";
}
