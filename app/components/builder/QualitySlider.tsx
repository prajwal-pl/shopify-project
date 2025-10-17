import React, { useState, useEffect } from "react";

interface QualitySliderProps {
  label: string;
  options: string[];
  minValue: number;
  maxValue: number;
  onMinChange: (value: number) => void;
  onMaxChange: (value: number) => void;
}

export function QualitySlider({
  label,
  options,
  minValue,
  maxValue,
  onMinChange,
  onMaxChange
}: QualitySliderProps) {
  const [localMin, setLocalMin] = useState(minValue);
  const [localMax, setLocalMax] = useState(maxValue);

  useEffect(() => {
    setLocalMin(minValue);
    setLocalMax(maxValue);
  }, [minValue, maxValue]);

  const handleMinSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (value <= localMax) {
      setLocalMin(value);
    }
  };

  const handleMaxSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (value >= localMin) {
      setLocalMax(value);
    }
  };

  const handleMinSliderRelease = () => {
    if (localMin !== minValue) {
      onMinChange(localMin);
    }
  };

  const handleMaxSliderRelease = () => {
    if (localMax !== maxValue) {
      onMaxChange(localMax);
    }
  };

  const maxIndex = options.length - 1;

  return (
    <div className="quality-slider-container">
      <div className="slider-header">
        <span className="slider-label">{label}</span>
        <span className="info-icon" title={`Select ${label.toLowerCase()} range`}>�</span>
      </div>

      <div className="slider-content">
        <div className="slider-labels">
          {options.map((option, index) => (
            <span
              key={index}
              className={`label-item ${index >= localMin && index <= localMax ? "active" : ""}`}
            >
              {option}
            </span>
          ))}
        </div>

        <div className="slider-track-container">
          <div className="visible-track"></div>
          <div
            className="track-fill"
            style={{
              left: `${(localMin / maxIndex) * 100}%`,
              width: `${((localMax - localMin) / maxIndex) * 100}%`
            }}
          ></div>
          <input
            type="range"
            className="range-slider min-slider"
            value={localMin}
            onChange={handleMinSliderChange}
            onMouseUp={handleMinSliderRelease}
            onTouchEnd={handleMinSliderRelease}
            min={0}
            max={maxIndex}
            step={1}
          />
          <input
            type="range"
            className="range-slider max-slider"
            value={localMax}
            onChange={handleMaxSliderChange}
            onMouseUp={handleMaxSliderRelease}
            onTouchEnd={handleMaxSliderRelease}
            min={0}
            max={maxIndex}
            step={1}
          />
        </div>
      </div>

      <style>{`
        .quality-slider-container {
          margin-bottom: 20px;
        }

        .slider-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
        }

        .slider-label {
          font-size: 14px;
          font-weight: 700;
          color: #333;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .info-icon {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #7c2d5e;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          cursor: help;
          font-weight: bold;
        }

        .slider-content {
          background: white;
          border: 2px solid #e0e0e0;
          border-radius: 6px;
          padding: 16px;
        }

        .slider-labels {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
          padding: 0 4px;
        }

        .label-item {
          font-size: 12px;
          font-weight: 600;
          color: #999;
          transition: all 0.2s ease;
          text-align: center;
          min-width: 40px;
        }

        .label-item.active {
          color: #7c2d5e;
          font-weight: 700;
        }

        .slider-track-container {
          position: relative;
          height: 50px;
          display: flex;
          align-items: center;
          padding: 10px 0;
        }

        .visible-track {
          position: absolute;
          width: 100%;
          height: 8px;
          background: #d8d8d8;
          border-radius: 4px;
          border: 1px solid #b0b0b0;
          z-index: 1;
        }

        .track-fill {
          position: absolute;
          height: 8px;
          background: #9c5080;
          border-radius: 4px;
          z-index: 2;
          transition: left 0.05s ease, width 0.05s ease;
        }

        .range-slider {
          position: absolute;
          width: 100%;
          height: 8px;
          background: transparent;
          pointer-events: none;
          -webkit-appearance: none;
          appearance: none;
          margin: 0;
          z-index: 3;
        }

        .range-slider::-webkit-slider-track {
          height: 8px;
          background: transparent;
          border-radius: 4px;
        }

        .range-slider::-moz-range-track {
          height: 8px;
          background: transparent;
          border-radius: 4px;
        }

        .range-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 28px;
          height: 28px;
          background: #7c2d5e;
          border-radius: 50%;
          cursor: grab;
          pointer-events: all;
          border: 4px solid white;
          box-shadow: 0 3px 8px rgba(0, 0, 0, 0.4);
          margin-top: -10px;
          position: relative;
          z-index: 4;
        }

        .range-slider::-moz-range-thumb {
          width: 28px;
          height: 28px;
          background: #7c2d5e;
          border-radius: 50%;
          cursor: grab;
          pointer-events: all;
          border: 4px solid white;
          box-shadow: 0 3px 8px rgba(0, 0, 0, 0.4);
          position: relative;
          z-index: 4;
        }

        .range-slider::-webkit-slider-thumb:hover {
          background: #5c1d3e;
          transform: scale(1.1);
        }

        .range-slider::-moz-range-thumb:hover {
          background: #5c1d3e;
          transform: scale(1.1);
        }

        .range-slider::-webkit-slider-thumb:active {
          cursor: grabbing;
          transform: scale(0.95);
        }

        .range-slider::-moz-range-thumb:active {
          cursor: grabbing;
          transform: scale(0.95);
        }

        @media (max-width: 768px) {
          .label-item {
            font-size: 10px;
            min-width: 30px;
          }

          .slider-content {
            padding: 12px;
          }
        }
      `}</style>
    </div>
  );
}
