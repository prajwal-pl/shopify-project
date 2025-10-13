/**
 * Step 3: Customization
 *
 * Select ring size and optional side stones.
 * (Phase 5.0 - Complete Implementation)
 */

import { useState, useEffect } from "react";
import { useBuilder } from "../BuilderProvider";
import { RingSizeSelector } from "../RingSizeSelector";
import { RingSizeGuide } from "../RingSizeGuide";
import { SideStonesSelector } from "../SideStonesSelector";
import type { RingSize, SideStonesConfig } from "~/types/builder";

interface CustomizationProps {
  shop: string;
}

export function Customization(_props: CustomizationProps) {
  const {
    ringSize,
    updateRingSize,
    sideStones,
    updateSideStones,
    goToStep,
    selectedSetting,
    selectedStone,
  } = useBuilder();

  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [sideStonesEnabled, setSideStonesEnabled] = useState(false);

  // TODO: Fetch side stones settings from AppSettings
  // For now, using mock data
  const sideStoneSettings = {
    enabled: true,
    qualityOptions: ["Good", "Better", "Best", "Premium"],
    minQuantity: 8,
    maxQuantity: 24,
    pricePerStone: {
      Good: 50,
      Better: 75,
      Best: 100,
      Premium: 150,
    },
  };

  useEffect(() => {
    setSideStonesEnabled(sideStoneSettings.enabled);
  }, []);

  const handleRingSizeSelect = (size: RingSize) => {
    updateRingSize(size);
    setValidationError(null);
  };

  const handleSideStonesChange = (config: SideStonesConfig) => {
    updateSideStones(config);
  };

  const handleContinue = () => {
    // Validation
    if (!ringSize) {
      setValidationError("Please select a ring size to continue");
      return;
    }

    if (sideStonesEnabled && sideStones) {
      if (!sideStones.quality) {
        setValidationError("Please select side stone quality");
        return;
      }
      if (
        !sideStones.quantity ||
        sideStones.quantity < sideStoneSettings.minQuantity
      ) {
        setValidationError(
          `Minimum ${sideStoneSettings.minQuantity} side stones required`,
        );
        return;
      }
      if (sideStones.quantity > sideStoneSettings.maxQuantity) {
        setValidationError(
          `Maximum ${sideStoneSettings.maxQuantity} side stones allowed`,
        );
        return;
      }
    }

    setValidationError(null);
    goToStep(4);
  };

  const handleBack = () => {
    goToStep(2);
  };

  return (
    <div className="customization-step">
      <div className="step-header">
        <h2>Step 3: Customize Your Ring</h2>
        <p className="step-description">
          Select your ring size and add optional enhancements
        </p>
      </div>

      <div className="customization-content">
        {/* Ring Size Selector */}
        <RingSizeSelector
          selectedSize={ringSize}
          onSelect={handleRingSizeSelect}
          onShowGuide={() => setShowSizeGuide(true)}
        />

        {/* Side Stones Selector (conditional) */}
        {sideStonesEnabled && (
          <SideStonesSelector
            config={sideStones}
            onChange={handleSideStonesChange}
            qualityOptions={sideStoneSettings.qualityOptions}
            minQuantity={sideStoneSettings.minQuantity}
            maxQuantity={sideStoneSettings.maxQuantity}
            pricePerStone={sideStoneSettings.pricePerStone}
          />
        )}

        {/* Validation Error */}
        {validationError && (
          <div className="validation-error" role="alert">
            ⚠️ {validationError}
          </div>
        )}

        {/* Selection Summary */}
        <div className="selection-summary">
          <h3>Current Selection</h3>
          <div className="summary-grid">
            <div className="summary-item">
              <span className="summary-label">Setting:</span>
              <span className="summary-value">
                {selectedSetting?.name || "Not selected"}
              </span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Stone:</span>
              <span className="summary-value">
                {selectedStone
                  ? `${selectedStone.carat}ct ${selectedStone.shape}`
                  : "Not selected"}
              </span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Ring Size:</span>
              <span className="summary-value">
                {ringSize ? `Size ${ringSize}` : "Not selected"}
              </span>
            </div>
            {sideStonesEnabled && sideStones?.quantity && (
              <div className="summary-item">
                <span className="summary-label">Side Stones:</span>
                <span className="summary-value">
                  {sideStones.quantity} {sideStones.quality} stones
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="navigation-buttons">
        <button onClick={handleBack} className="btn-secondary">
          ← Back to Stones
        </button>
        <button
          onClick={handleContinue}
          className="btn-primary"
          disabled={!ringSize}
        >
          Continue to Review →
        </button>
      </div>

      {/* Ring Size Guide Modal */}
      <RingSizeGuide
        isOpen={showSizeGuide}
        onClose={() => setShowSizeGuide(false)}
      />

      <style>{`
        .customization-step {
          padding: 24px;
          max-width: 800px;
          margin: 0 auto;
        }

        .step-header {
          margin-bottom: 32px;
        }

        .step-header h2 {
          font-size: 28px;
          font-weight: 700;
          color: #111827;
          margin: 0 0 8px;
        }

        .step-description {
          font-size: 16px;
          color: #6b7280;
          margin: 0;
        }

        .customization-content {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .validation-error {
          padding: 12px 16px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 8px;
          color: #991b1b;
          font-size: 14px;
          margin: 20px 0;
        }

        .selection-summary {
          margin-top: 32px;
          padding: 20px;
          background: #f9fafb;
          border-radius: 8px;
        }

        .selection-summary h3 {
          font-size: 16px;
          font-weight: 600;
          color: #374151;
          margin: 0 0 16px;
        }

        .summary-grid {
          display: grid;
          gap: 12px;
        }

        .summary-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 8px;
          border-bottom: 1px solid #e5e7eb;
        }

        .summary-item:last-child {
          border-bottom: none;
        }

        .summary-label {
          font-size: 14px;
          color: #6b7280;
          font-weight: 500;
        }

        .summary-value {
          font-size: 14px;
          color: #111827;
          font-weight: 600;
        }

        .navigation-buttons {
          display: flex;
          gap: 16px;
          margin-top: 32px;
          padding-top: 24px;
          border-top: 1px solid #e5e7eb;
        }

        .btn-secondary,
        .btn-primary {
          flex: 1;
          padding: 14px 24px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
        }

        .btn-secondary {
          background: white;
          color: #374151;
          border: 1px solid #d1d5db;
        }

        .btn-secondary:hover {
          background: #f9fafb;
        }

        .btn-primary {
          background: #d4af37;
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          background: #c29d2f;
        }

        .btn-primary:disabled {
          background: #d1d5db;
          cursor: not-allowed;
        }

        /* Mobile responsive */
        @media (max-width: 768px) {
          .customization-step {
            padding: 16px;
          }

          .step-header h2 {
            font-size: 24px;
          }

          .step-description {
            font-size: 14px;
          }

          .customization-content {
            padding: 20px;
          }

          .navigation-buttons {
            flex-direction: column-reverse;
          }

          .btn-secondary,
          .btn-primary {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
