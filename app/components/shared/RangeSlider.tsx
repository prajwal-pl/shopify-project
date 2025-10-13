/**
 * Range Slider Component
 *
 * Double-ended slider for min/max value selection.
 */

import React from "react";
import { formatPrice, formatCarat } from "~/utils/formatters";

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
      {label && <label className="range-label">{label}</label>}

      <div className="range-values">
        <span>{formatValue(valueMin)}</span>
        <span>—</span>
        <span>{formatValue(valueMax)}</span>
      </div>

      <div className="range-inputs">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={valueMin}
          onChange={handleMinChange}
          className="range-input range-min"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={valueMax}
          onChange={handleMaxChange}
          className="range-input range-max"
        />
      </div>

      <style>{`
        .range-slider {
          margin-bottom: 20px;
        }

        .range-label {
          display: block;
          font-size: 14px;
          font-weight: 500;
          color: #202223;
          margin-bottom: 12px;
        }

        .range-values {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 14px;
          font-weight: 500;
          color: #202223;
          margin-bottom: 12px;
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
        }

        .range-input::-webkit-slider-runnable-track {
          width: 100%;
          height: 6px;
          background: #e5e5e5;
          border-radius: 3px;
        }

        .range-input::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          background: #d4af37;
          border: 2px solid white;
          border-radius: 50%;
          cursor: pointer;
          pointer-events: all;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .range-input::-moz-range-track {
          width: 100%;
          height: 6px;
          background: #e5e5e5;
          border-radius: 3px;
        }

        .range-input::-moz-range-thumb {
          width: 18px;
          height: 18px;
          background: #d4af37;
          border: 2px solid white;
          border-radius: 50%;
          cursor: pointer;
          pointer-events: all;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .range-input:hover::-webkit-slider-thumb {
          background: #c29d2f;
        }

        .range-input:hover::-moz-range-thumb {
          background: #c29d2f;
        }
      `}</style>
    </div>
  );
}
