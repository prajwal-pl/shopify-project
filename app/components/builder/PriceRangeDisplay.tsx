import React, { useState, useEffect } from "react";

interface PriceRangeDisplayProps {
  minPrice: number;
  maxPrice: number;
  onMinChange: (value: number) => void;
  onMaxChange: (value: number) => void;
  absoluteMin?: number;
  absoluteMax?: number;
  label?: string;
  step?: number;
}

export function PriceRangeDisplay({
  minPrice,
  maxPrice,
  onMinChange,
  onMaxChange,
  absoluteMin = 0,
  absoluteMax = 50000,
  label = "PRICE RANGE",
  step = 100
}: PriceRangeDisplayProps) {
  const [localMin, setLocalMin] = useState(minPrice);
  const [localMax, setLocalMax] = useState(maxPrice);

  useEffect(() => {
    setLocalMin(minPrice);
    setLocalMax(maxPrice);
  }, [minPrice, maxPrice]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

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
    if (localMin !== minPrice) {
      onMinChange(localMin);
    }
  };

  const handleMaxSliderRelease = () => {
    if (localMax !== maxPrice) {
      onMaxChange(localMax);
    }
  };

  const handleMinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (value <= localMax) {
      setLocalMin(value);
      onMinChange(value);
    }
  };

  const handleMaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (value >= localMin) {
      setLocalMax(value);
      onMaxChange(value);
    }
  };

  return (
    <div className="price-range-display-container">
      <div className="selector-header">
        <span className="selector-label">{label}</span>
        <span className="info-icon" title="Select price range">ⓘ</span>
      </div>

      <div className="price-range-content">
        <div className="price-inputs">
          <div className="price-input-group">
            <label className="price-label">Min</label>
            <input
              type="number"
              className="price-input"
              value={localMin}
              onChange={handleMinInputChange}
              min={absoluteMin}
              max={absoluteMax}
            />
            <span className="price-display">{formatPrice(localMin)}</span>
          </div>

          <span className="price-separator">—</span>

          <div className="price-input-group">
            <label className="price-label">Max</label>
            <input
              type="number"
              className="price-input"
              value={localMax}
              onChange={handleMaxInputChange}
              min={absoluteMin}
              max={absoluteMax}
            />
            <span className="price-display">{formatPrice(localMax)}</span>
          </div>
        </div>

        <div className="slider-container">
          <div className="visible-track"></div>
          <div
            className="track-fill"
            style={{
              left: `${((localMin - absoluteMin) / (absoluteMax - absoluteMin)) * 100}%`,
              width: `${((localMax - localMin) / (absoluteMax - absoluteMin)) * 100}%`
            }}
          ></div>
          <input
            type="range"
            className="price-slider min-slider"
            value={localMin}
            onChange={handleMinSliderChange}
            onMouseUp={handleMinSliderRelease}
            onTouchEnd={handleMinSliderRelease}
            min={absoluteMin}
            max={absoluteMax}
            step={step}
          />
          <input
            type="range"
            className="price-slider max-slider"
            value={localMax}
            onChange={handleMaxSliderChange}
            onMouseUp={handleMaxSliderRelease}
            onTouchEnd={handleMaxSliderRelease}
            min={absoluteMin}
            max={absoluteMax}
            step={step}
          />
        </div>
      </div>

      <style>{`
        .price-range-display-container {
          margin-bottom: 24px;
        }

        .selector-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
        }

        .selector-label {
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

        .price-range-content {
          background: white;
          border: 2px solid #e0e0e0;
          border-radius: 6px;
          padding: 20px;
        }

        .price-inputs {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          margin-bottom: 20px;
        }

        .price-input-group {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .price-label {
          font-size: 12px;
          font-weight: 600;
          color: #666;
          text-transform: uppercase;
        }

        .price-input {
          width: 120px;
          padding: 8px 12px;
          border: 1px solid #e0e0e0;
          border-radius: 4px;
          font-size: 14px;
          font-weight: 600;
          color: #333;
          text-align: center;
        }

        .price-input:focus {
          outline: none;
          border-color: #7c2d5e;
        }

        .price-display {
          font-size: 16px;
          font-weight: 700;
          color: #7c2d5e;
        }

        .price-separator {
          font-size: 24px;
          color: #666;
          margin: 0 10px;
        }

        .slider-container {
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

        .price-slider {
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

        .price-slider::-webkit-slider-track {
          height: 8px;
          background: transparent;
          border-radius: 4px;
        }

        .price-slider::-moz-range-track {
          height: 8px;
          background: transparent;
          border-radius: 4px;
        }

        .price-slider::-webkit-slider-thumb {
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

        .price-slider::-moz-range-thumb {
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

        .price-slider::-webkit-slider-thumb:hover {
          background: #5c1d3e;
          transform: scale(1.1);
        }

        .price-slider::-moz-range-thumb:hover {
          background: #5c1d3e;
          transform: scale(1.1);
        }

        .price-slider::-webkit-slider-thumb:active {
          cursor: grabbing;
          transform: scale(0.95);
        }

        .price-slider::-moz-range-thumb:active {
          cursor: grabbing;
          transform: scale(0.95);
        }

        @media (max-width: 768px) {
          .price-inputs {
            flex-direction: column;
            gap: 16px;
          }

          .price-separator {
            transform: rotate(90deg);
          }

          .price-input {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
