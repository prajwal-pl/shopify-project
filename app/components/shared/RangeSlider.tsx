/**
 * Range Slider Component
 *
 * Double-ended slider for min/max value selection.
 * Enhanced with premium gold styling and smooth animations.
 */

import React from "react";
import { DollarSign } from "lucide-react";
import { Icon } from "~/components/ui/Icon";
import { formatPrice, formatCarat } from "~/utils/formatters";
import { PREFERS_REDUCED_MOTION } from "~/utils/accessibility";

interface RangeSliderProps {
  min: number;
  max: number;
  valueMin: number;
  valueMax: number;
  onChange: (min: number, max: number) => void;
  step?: number;
  formatValue?: (value: number) => string;
  label?: string;
}

export function RangeSlider({
  min,
  max,
  valueMin,
  valueMax,
  onChange,
  step = 1,
  formatValue = (v) => v.toString(),
  label,
}: RangeSliderProps) {
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = parseFloat(e.target.value);
    if (newMin <= valueMax) {
      onChange(newMin, valueMax);
    }
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = parseFloat(e.target.value);
    if (newMax >= valueMin) {
      onChange(valueMin, newMax);
    }
  };

  return (
    <div className="range-slider">
      {label && (
        <div className="range-label-wrapper">
          <label className="range-label">
            <Icon icon={DollarSign} size="xs" className="label-icon" />
            {label}
          </label>
        </div>
      )}

      <div className="range-values">
        <span>{formatValue(valueMin)}</span>
        <span>—</span>
        <span>{formatValue(valueMax)}</span>
      </div>

      <div className="range-inputs" role="group" aria-label={label ? `${label} range slider` : "Range slider"}>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={valueMin}
          onChange={handleMinChange}
          className="range-input range-min"
          aria-label={label ? `${label} minimum value` : "Minimum value"}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={valueMin}
          aria-valuetext={formatValue(valueMin)}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={valueMax}
          onChange={handleMaxChange}
          className="range-input range-max"
          aria-label={label ? `${label} maximum value` : "Maximum value"}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={valueMax}
          aria-valuetext={formatValue(valueMax)}
        />
      </div>

      <style>{`
        .range-slider {
          margin-bottom: 20px;
        }

        .range-label-wrapper {
          margin-bottom: 12px;
        }

        .range-label {
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

        .range-values {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 15px;
          font-weight: 700;
          color: #d4af37;
          margin-bottom: 16px;
          padding: 8px 12px;
          background: #fffbf0;
          border-radius: 6px;
          border: 1px solid #f0e6d2;
        }

        .range-inputs {
          position: relative;
          height: 40px;
        }

        .range-input {
          position: absolute;
          width: 100%;
          height: 6px;
          background: transparent;
          pointer-events: none;
          -webkit-appearance: none;
          appearance: none;
          outline: none;
        }

        .range-input::-webkit-slider-runnable-track {
          width: 100%;
          height: 6px;
          background: linear-gradient(to right, #f0e6d2 0%, #d4af37 var(--progress), #e5e5e5 var(--progress));
          border-radius: 3px;
        }

        .range-input::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 22px;
          height: 22px;
          background: #d4af37;
          border: 3px solid white;
          border-radius: 50%;
          cursor: grab;
          pointer-events: all;
          box-shadow: 0 2px 8px rgba(212, 175, 55, 0.4);
          transition: all 0.2s ease;
          margin-top: -8px;
        }

        .range-input::-webkit-slider-thumb:active {
          cursor: grabbing;
          transform: scale(1.1);
          box-shadow: 0 3px 12px rgba(212, 175, 55, 0.6);
        }

        .range-input:focus-visible::-webkit-slider-thumb {
          outline: 2px solid #d4af37;
          outline-offset: 2px;
        }

        .range-input::-moz-range-track {
          width: 100%;
          height: 6px;
          background: #e5e5e5;
          border-radius: 3px;
        }

        .range-input::-moz-range-thumb {
          width: 22px;
          height: 22px;
          background: #d4af37;
          border: 3px solid white;
          border-radius: 50%;
          cursor: grab;
          pointer-events: all;
          box-shadow: 0 2px 8px rgba(212, 175, 55, 0.4);
          transition: all 0.2s ease;
        }

        .range-input::-moz-range-thumb:active {
          cursor: grabbing;
          transform: scale(1.1);
          box-shadow: 0 3px 12px rgba(212, 175, 55, 0.6);
        }

        .range-input:focus-visible::-moz-range-thumb {
          outline: 2px solid #d4af37;
          outline-offset: 2px;
        }

        .range-input:hover::-webkit-slider-thumb {
          transform: scale(1.05);
          box-shadow: 0 3px 10px rgba(212, 175, 55, 0.5);
        }

        .range-input:hover::-moz-range-thumb {
          transform: scale(1.05);
          box-shadow: 0 3px 10px rgba(212, 175, 55, 0.5);
        }

        @media (max-width: 768px) {
          .range-input::-webkit-slider-thumb,
          .range-input::-moz-range-thumb {
            width: 26px;
            height: 26px;
          }

          .range-values {
            font-size: 14px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .range-input::-webkit-slider-thumb,
          .range-input::-moz-range-thumb {
            transition-duration: 0.01ms !important;
          }

          .range-input::-webkit-slider-thumb:active,
          .range-input::-moz-range-thumb:active,
          .range-input:hover::-webkit-slider-thumb,
          .range-input:hover::-moz-range-thumb {
            transform: none;
          }
        }
      `}</style>
    </div>
  );
}
