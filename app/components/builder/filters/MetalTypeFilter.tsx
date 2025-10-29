/**
 * Metal Type Filter Component
 *
 * Visual filter with color swatches for metal selection.
 * Enhanced UX with realistic metal colors and smooth animations.
 */

import { Check, Circle } from "lucide-react";
import { Icon } from "~/components/ui/Icon";
import type { MetalType } from "~/utils/constants";
import { PREFERS_REDUCED_MOTION } from "~/utils/accessibility";

interface MetalOption {
  value: MetalType;
  label: string;
  color: string;
  gradient: string;
}

const METAL_OPTIONS: MetalOption[] = [
  {
    value: "14k_white_gold",
    label: "14K White Gold",
    color: "#E5E4E2",
    gradient: "linear-gradient(135deg, #E5E4E2 0%, #C0C0C0 100%)",
  },
  {
    value: "14k_yellow_gold",
    label: "14K Yellow Gold",
    color: "#FFD700",
    gradient: "linear-gradient(135deg, #FFD700 0%, #FFC700 100%)",
  },
  {
    value: "14k_rose_gold",
    label: "14K Rose Gold",
    color: "#B76E79",
    gradient: "linear-gradient(135deg, #B76E79 0%, #A85A64 100%)",
  },
  {
    value: "18k_white_gold",
    label: "18K White Gold",
    color: "#E8E8E8",
    gradient: "linear-gradient(135deg, #E8E8E8 0%, #C5C5C5 100%)",
  },
  {
    value: "18k_yellow_gold",
    label: "18K Yellow Gold",
    color: "#FFDF00",
    gradient: "linear-gradient(135deg, #FFDF00 0%, #FFD000 100%)",
  },
  {
    value: "18k_rose_gold",
    label: "18K Rose Gold",
    color: "#C07080",
    gradient: "linear-gradient(135deg, #C07080 0%, #B06070 100%)",
  },
  {
    value: "platinum",
    label: "Platinum",
    color: "#E5E4E2",
    gradient: "linear-gradient(135deg, #E5E4E2 0%, #A8A8A8 100%)",
  },
];

interface MetalTypeFilterProps {
  selected: string[];
  onChange: (selected: string[]) => void;
  multiSelect?: boolean;
}

export function MetalTypeFilter({
  selected,
  onChange,
  multiSelect = true,
}: MetalTypeFilterProps) {
  const isSelected = (value: string) => selected.includes(value);

  const handleClick = (value: string) => {
    if (multiSelect) {
      if (isSelected(value)) {
        onChange(selected.filter((v) => v !== value));
      } else {
        onChange([...selected, value]);
      }
    } else {
      onChange([value]);
    }
  };

  return (
    <div className="metal-type-filter" role="group" aria-labelledby="metal-type-filter-label">
      <div className="filter-label-wrapper">
        <label className="filter-label" id="metal-type-filter-label">
          <Icon icon={Circle} size="xs" className="label-icon" aria-hidden="true" />
          Metal Type
        </label>
      </div>

      <div className="metal-options" role="list">
        {METAL_OPTIONS.map((metal) => {
          const itemSelected = isSelected(metal.value);

          return (
            <button
              key={metal.value}
              type="button"
              className={`metal-option ${itemSelected ? "selected" : ""}`}
              onClick={() => handleClick(metal.value)}
              aria-label={`Filter by ${metal.label}`}
              aria-pressed={itemSelected}
            >
              <div
                className="metal-swatch"
                style={{
                  background: metal.gradient,
                }}
              >
                {itemSelected && (
                  <Icon icon={Check} size="xs" color="white" strokeWidth={3} />
                )}
              </div>
              <span className="metal-label">{metal.label}</span>
            </button>
          );
        })}
      </div>

      <style>{`
        .metal-type-filter {
          margin-bottom: 24px;
          padding-bottom: 24px;
          border-bottom: 1px solid #e5e5e5;
        }

        .filter-label-wrapper {
          margin-bottom: 12px;
        }

        .filter-label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          font-weight: 600;
          color: #202223;
        }

        .label-icon {
          color: #d4af37;
        }

        .metal-options {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
        }

        .metal-option {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          border: 2px solid #e5e5e5;
          border-radius: 8px;
          background: white;
          cursor: pointer;
          transition: all 0.2s ease;
          outline: none;
        }

        .metal-option:hover {
          border-color: #d4af37;
          background: #fffbf0;
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(212, 175, 55, 0.15);
        }

        .metal-option:focus-visible {
          outline: 2px solid #d4af37;
          outline-offset: 2px;
          border-color: #d4af37;
          background: #fffbf0;
        }

        .metal-option.selected {
          border-color: #d4af37;
          background: #fffbf0;
          box-shadow: 0 0 0 1px #d4af37;
        }

        .metal-swatch {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 2px solid rgba(0, 0, 0, 0.1);
          flex-shrink: 0;
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          will-change: transform;
        }

        .metal-option:hover .metal-swatch {
          transform: scale(1.1);
        }

        .metal-option.selected .metal-swatch {
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2),
                      0 0 0 2px white,
                      0 0 0 4px #d4af37;
          animation: swatchPop 0.3s ease-out;
        }

        @keyframes swatchPop {
          0% {
            transform: scale(0.8);
          }
          50% {
            transform: scale(1.15);
          }
          100% {
            transform: scale(1);
          }
        }

        .metal-label {
          font-size: 0.875rem;
          font-weight: 500;
          color: #202223;
          transition: color 0.2s ease;
        }

        .metal-option.selected .metal-label {
          color: #d4af37;
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .metal-options {
            grid-template-columns: 1fr;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .metal-option,
          .metal-swatch,
          .metal-label {
            transition-duration: 0.01ms !important;
          }

          .metal-option:hover,
          .metal-option:hover .metal-swatch {
            transform: none;
          }

          .metal-option.selected .metal-swatch {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
