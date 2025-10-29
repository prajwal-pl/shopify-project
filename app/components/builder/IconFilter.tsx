/**
 * Icon Filter Component
 *
 * Phase 2.0: Reusable icon-based filter for customer-facing builder.
 * Similar to admin IconShapeSelector but optimized for customer UX.
 *
 * Features:
 * - Visual icon grid
 * - Single or multi-select
 * - Mobile-responsive (2-5 columns)
 * - Smooth animations
 * - Accessibility (WCAG AA)
 * - Touch-friendly (44px min target)
 */

import { Circle, Square, Diamond, Heart, Sparkles, Gem } from "lucide-react";
import { Icon } from "~/components/ui/Icon";
import type { StoneShape, SettingStyle } from "~/types/builder";

export interface IconFilterItem {
  value: string;
  label: string;
  icon?: string;
  count?: number; // Optional: show count badge
}

interface IconFilterProps {
  items: IconFilterItem[];
  selected: string | string[];
  onChange: (selected: string | string[]) => void;
  multiSelect?: boolean;
  label?: string;
  iconType?: "shape" | "style";
}

export function IconFilter({
  items,
  selected,
  onChange,
  multiSelect = false,
  label,
  iconType = "shape",
}: IconFilterProps) {
  const isSelected = (value: string): boolean => {
    if (Array.isArray(selected)) {
      return selected.includes(value);
    }
    return selected === value;
  };

  const handleClick = (value: string) => {
    if (multiSelect && Array.isArray(selected)) {
      // Multi-select: toggle
      if (selected.includes(value)) {
        onChange(selected.filter((v) => v !== value));
      } else {
        onChange([...selected, value]);
      }
    } else {
      // Single-select: replace
      onChange(value);
    }
  };

  return (
    <div className="icon-filter">
      {label && <h3 className="filter-label">{label}</h3>}

      <div className="icon-filter-grid">
        {items.map((item) => {
          const itemSelected = isSelected(item.value);

          return (
            <button
              key={item.value}
              type="button"
              className={`icon-filter-item ${itemSelected ? "selected" : ""}`}
              onClick={() => handleClick(item.value)}
              aria-label={`Filter by ${item.label}`}
              aria-pressed={itemSelected}
            >
              <div className="icon-wrapper">
                {item.icon ? (
                  <img src={item.icon} alt="" className="filter-icon" />
                ) : (
                  <Icon icon={getIconComponent(item.value, iconType)} size="lg" className="filter-icon-svg" />
                )}
              </div>
              <span className="filter-label-text">{item.label}</span>
              {item.count !== undefined && (
                <span className="count-badge">{item.count}</span>
              )}
            </button>
          );
        })}
      </div>

      <style>{`
        .icon-filter {
          margin-bottom: 2rem;
        }

        .filter-label {
          font-size: 1rem;
          font-weight: 600;
          color: #333;
          margin: 0 0 1rem 0;
        }

        .icon-filter-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 1rem;
        }

        /* Mobile: 2-3 columns */
        @media (max-width: 640px) {
          .icon-filter-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 0.75rem;
          }
        }

        /* Small tablets: 3-4 columns */
        @media (min-width: 641px) and (max-width: 1023px) {
          .icon-filter-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        /* Desktop: 5 columns */
        @media (min-width: 1024px) {
          .icon-filter-grid {
            grid-template-columns: repeat(5, 1fr);
          }
        }

        .icon-filter-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 1rem 0.5rem;
          min-height: 110px;
          background: white;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
        }

        /* Touch-friendly: 44px minimum */
        @media (max-width: 640px) {
          .icon-filter-item {
            min-height: 88px;
            padding: 0.75rem 0.25rem;
          }
        }

        .icon-filter-item:hover {
          border-color: #6D2932;
          background: #fff5f7;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(109, 41, 50, 0.15);
        }

        .icon-filter-item.selected {
          border-color: #6D2932;
          border-width: 3px;
          background: linear-gradient(135deg, #fff5f7 0%, #ffe8ed 100%);
          box-shadow: 0 4px 16px rgba(109, 41, 50, 0.25);
        }

        .icon-filter-item:focus {
          outline: 2px solid #6D2932;
          outline-offset: 2px;
        }

        .icon-wrapper {
          width: 56px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.5rem;
        }

        @media (max-width: 640px) {
          .icon-wrapper {
            width: 40px;
            height: 40px;
          }
        }

        .filter-icon {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }

        .filter-icon-svg {
          color: #666;
          transition: color 0.2s ease;
        }

        .icon-filter-item.selected .filter-icon-svg {
          color: #6D2932;
        }

        .icon-filter-item:hover .filter-icon-svg {
          color: #6D2932;
        }

        .filter-label-text {
          font-size: 0.85rem;
          font-weight: 500;
          text-align: center;
          color: #666;
          line-height: 1.3;
        }

        .icon-filter-item.selected .filter-label-text {
          color: #6D2932;
          font-weight: 600;
        }

        .count-badge {
          position: absolute;
          top: 8px;
          right: 8px;
          background: #6D2932;
          color: white;
          font-size: 0.7rem;
          font-weight: 600;
          padding: 0.2rem 0.5rem;
          border-radius: 10px;
          min-width: 20px;
          text-align: center;
        }
      `}</style>
    </div>
  );
}

/**
 * Get lucide-react icon component for shapes and styles
 */
function getIconComponent(value: string, type: "shape" | "style") {
  if (type === "shape") {
    const shapeIcons: Record<string, any> = {
      round: Circle,
      princess: Square,
      oval: Circle,
      pear: Diamond,
      marquise: Diamond,
      heart: Heart,
      emerald: Square,
      cushion: Square,
      asscher: Square,
      radiant: Diamond,
    };
    return shapeIcons[value.toLowerCase()] || Gem;
  }

  // Style icons
  const styleIcons: Record<string, any> = {
    halo: Circle,
    solitaire: Circle,
    three_stone: Circle,
    single_row: Circle,
    trellis: Diamond,
    multirow: Circle,
    vintage: Sparkles,
    pave: Sparkles,
    bypass: Circle,
  };
  return styleIcons[value.toLowerCase()] || Circle;
}
