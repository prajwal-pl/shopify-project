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
import type { RingSize, SideStonesConfig, EngravingConfig, GiftMessageConfig } from "~/types/builder";
import type { MetalType } from "~/types/builder";

interface CustomizationProps {
  shop: string;
}

export function Customization(_props: CustomizationProps) {
  const {
    ringSize,
    updateRingSize,
    sideStones,
    updateSideStones,
    selectedMetalType,
    updateMetalType,
    engraving,
    updateEngraving,
    giftMessage,
    updateGiftMessage,
    goToStep,
    selectedSetting,
    selectedStone,
    priceBreakdown,
  } = useBuilder();

  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [sideStonesEnabled, setSideStonesEnabled] = useState(false);
  const [engravingEnabled, setEngravingEnabled] = useState(false);
  const [showMetalSelector, setShowMetalSelector] = useState(false);

  // Engraving fee constant
  const ENGRAVING_FEE = 50;

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
    // Show metal selector only if metal type hasn't been selected yet
    setShowMetalSelector(!selectedMetalType);
  }, [selectedMetalType]);

  const handleRingSizeSelect = (size: RingSize) => {
    updateRingSize(size);
    setValidationError(null);
  };

  const handleSideStonesChange = (config: SideStonesConfig) => {
    updateSideStones(config);
  };

  const handleMetalTypeSelect = (metal: MetalType) => {
    updateMetalType(metal);
    setValidationError(null);
  };

  const handleEngravingToggle = (enabled: boolean) => {
    setEngravingEnabled(enabled);
    if (enabled) {
      updateEngraving({
        enabled: true,
        text: engraving?.text || '',
        font: engraving?.font || 'script',
        position: engraving?.position || 'inside',
        price: ENGRAVING_FEE,
      });
    } else {
      updateEngraving({
        enabled: false,
        price: 0,
      });
    }
  };

  const handleEngravingChange = (field: keyof EngravingConfig, value: any) => {
    if (engraving) {
      updateEngraving({
        ...engraving,
        [field]: value,
      });
    }
  };

  const handleGiftMessageToggle = (enabled: boolean) => {
    updateGiftMessage({
      enabled,
      message: enabled ? (giftMessage?.message || '') : undefined,
    });
  };

  const handleGiftMessageChange = (message: string) => {
    updateGiftMessage({
      enabled: true,
      message,
    });
  };

  const handleContinue = () => {
    // Validation
    if (!ringSize) {
      setValidationError("Please select a ring size to continue");
      return;
    }

    if (showMetalSelector && !selectedMetalType) {
      setValidationError("Please select a metal type to continue");
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

    if (engravingEnabled && engraving?.text && engraving.text.length > 25) {
      setValidationError("Engraving text must be 25 characters or less");
      return;
    }

    if (giftMessage?.enabled && giftMessage.message && giftMessage.message.length > 250) {
      setValidationError("Gift message must be 250 characters or less");
      return;
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
        <div className="customization-form">
          {/* Metal Type Selector (only if not selected in step 1) */}
          {showMetalSelector && (
            <div className="customization-section">
              <h3>Metal Type</h3>
              <p className="section-description">Select your preferred metal type</p>
              <div className="metal-type-grid">
                {(['14k_white_gold', '14k_yellow_gold', '14k_rose_gold', '18k_white_gold', '18k_yellow_gold', '18k_rose_gold', 'platinum'] as MetalType[]).map((metal) => {
                  const isSelected = selectedMetalType === metal;
                  const metalLabel = metal.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
                  return (
                    <button
                      key={metal}
                      type="button"
                      className={`metal-type-button ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleMetalTypeSelect(metal)}
                    >
                      {metalLabel}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Ring Size Selector */}
          <div className="customization-section">
            <h3>Ring Size</h3>
            <RingSizeSelector
              selectedSize={ringSize}
              onSelect={handleRingSizeSelect}
              onShowGuide={() => setShowSizeGuide(true)}
            />
          </div>

          {/* Side Stones Selector (conditional) */}
          {sideStonesEnabled && (
            <div className="customization-section">
              <h3>Side Stones (Optional)</h3>
              <SideStonesSelector
                config={sideStones}
                onChange={handleSideStonesChange}
                qualityOptions={sideStoneSettings.qualityOptions}
                minQuantity={sideStoneSettings.minQuantity}
                maxQuantity={sideStoneSettings.maxQuantity}
                pricePerStone={sideStoneSettings.pricePerStone}
              />
            </div>
          )}

          {/* Engraving Options */}
          <div className="customization-section">
            <div className="section-header-with-toggle">
              <h3>Engraving (Optional)</h3>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={engravingEnabled}
                  onChange={(e) => handleEngravingToggle(e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
            {engravingEnabled && (
              <div className="engraving-options">
                <div className="form-group">
                  <label>Engraving Text (max 25 characters)</label>
                  <input
                    type="text"
                    maxLength={25}
                    value={engraving?.text || ''}
                    onChange={(e) => handleEngravingChange('text', e.target.value)}
                    placeholder="Enter text to engrave"
                    className="text-input"
                  />
                  <span className="char-counter">{engraving?.text?.length || 0}/25</span>
                </div>
                <div className="form-group">
                  <label>Font Style</label>
                  <select
                    value={engraving?.font || 'script'}
                    onChange={(e) => handleEngravingChange('font', e.target.value as 'script' | 'block' | 'italic')}
                    className="select-input"
                  >
                    <option value="script">Script</option>
                    <option value="block">Block</option>
                    <option value="italic">Italic</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Position</label>
                  <select
                    value={engraving?.position || 'inside'}
                    onChange={(e) => handleEngravingChange('position', e.target.value as 'inside' | 'outside')}
                    className="select-input"
                  >
                    <option value="inside">Inside Band</option>
                    <option value="outside">Outside Band</option>
                  </select>
                </div>
                <div className="engraving-fee">
                  Engraving Fee: ${ENGRAVING_FEE.toFixed(2)}
                </div>
              </div>
            )}
          </div>

          {/* Gift Message */}
          <div className="customization-section">
            <div className="section-header-with-toggle">
              <h3>Gift Message (Optional)</h3>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={giftMessage?.enabled || false}
                  onChange={(e) => handleGiftMessageToggle(e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
            {giftMessage?.enabled && (
              <div className="gift-message-options">
                <div className="form-group">
                  <label>Your Message (max 250 characters)</label>
                  <textarea
                    maxLength={250}
                    value={giftMessage.message || ''}
                    onChange={(e) => handleGiftMessageChange(e.target.value)}
                    placeholder="Add a special message..."
                    className="textarea-input"
                    rows={4}
                  />
                  <span className="char-counter">{giftMessage.message?.length || 0}/250</span>
                </div>
                <p className="gift-message-note">Free! Your message will be included with the ring.</p>
              </div>
            )}
          </div>

          {/* Validation Error */}
          {validationError && (
            <div className="validation-error" role="alert">
              ⚠️ {validationError}
            </div>
          )}
        </div>

        {/* Preview Panel */}
        <div className="preview-panel">
          <h3>Your Configuration</h3>
          <div className="preview-content">
            {selectedSetting && (
              <div className="preview-item">
                <img src={selectedSetting.images[0]} alt={selectedSetting.name} className="preview-image" />
              </div>
            )}
            <div className="preview-details">
              <div className="detail-row">
                <span className="detail-label">Setting:</span>
                <span className="detail-value">{selectedSetting?.name || 'Not selected'}</span>
              </div>
              {selectedMetalType && (
                <div className="detail-row">
                  <span className="detail-label">Metal:</span>
                  <span className="detail-value">{selectedMetalType.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</span>
                </div>
              )}
              <div className="detail-row">
                <span className="detail-label">Diamond:</span>
                <span className="detail-value">
                  {selectedStone ? `${selectedStone.carat}ct ${selectedStone.shape}` : 'Not selected'}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Ring Size:</span>
                <span className="detail-value">{ringSize || 'Not selected'}</span>
              </div>
              {sideStones?.quantity && (
                <div className="detail-row">
                  <span className="detail-label">Side Stones:</span>
                  <span className="detail-value">{sideStones.quantity} {sideStones.quality}</span>
                </div>
              )}
              {engravingEnabled && engraving?.text && (
                <div className="detail-row">
                  <span className="detail-label">Engraving:</span>
                  <span className="detail-value">"{engraving.text}"</span>
                </div>
              )}
            </div>

            <div className="price-breakdown">
              <div className="price-row">
                <span>Setting:</span>
                <span>${priceBreakdown.settingPrice.toLocaleString()}</span>
              </div>
              <div className="price-row">
                <span>Diamond:</span>
                <span>${priceBreakdown.stonePrice.toLocaleString()}</span>
              </div>
              {priceBreakdown.sideStonesPrice > 0 && (
                <div className="price-row">
                  <span>Side Stones:</span>
                  <span>${priceBreakdown.sideStonesPrice.toLocaleString()}</span>
                </div>
              )}
              {priceBreakdown.engravingPrice > 0 && (
                <div className="price-row">
                  <span>Engraving:</span>
                  <span>${priceBreakdown.engravingPrice.toLocaleString()}</span>
                </div>
              )}
              <div className="price-row total">
                <span>Total:</span>
                <span>${priceBreakdown.total.toLocaleString()}</span>
              </div>
            </div>
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
          max-width: 1400px;
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
          display: grid;
          grid-template-columns: 1fr 400px;
          gap: 24px;
          margin-bottom: 24px;
        }

        .customization-form {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .customization-section {
          margin-bottom: 32px;
          padding-bottom: 32px;
          border-bottom: 1px solid #e5e7eb;
        }

        .customization-section:last-child {
          border-bottom: none;
        }

        .customization-section h3 {
          font-size: 18px;
          font-weight: 600;
          color: #111827;
          margin: 0 0 16px;
        }

        .section-description {
          font-size: 14px;
          color: #6b7280;
          margin: 0 0 16px;
        }

        .section-header-with-toggle {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .toggle-switch {
          position: relative;
          display: inline-block;
          width: 48px;
          height: 24px;
        }

        .toggle-switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .toggle-slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #d1d5db;
          transition: 0.3s;
          border-radius: 24px;
        }

        .toggle-slider:before {
          position: absolute;
          content: "";
          height: 18px;
          width: 18px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: 0.3s;
          border-radius: 50%;
        }

        input:checked + .toggle-slider {
          background-color: #7c2d5e;
        }

        input:checked + .toggle-slider:before {
          transform: translateX(24px);
        }

        .metal-type-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .metal-type-button {
          padding: 12px 16px;
          background: white;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 14px;
          font-weight: 500;
          color: #333;
        }

        .metal-type-button:hover {
          border-color: #7c2d5e;
          transform: translateY(-2px);
        }

        .metal-type-button.selected {
          border-color: #7c2d5e;
          background: #7c2d5e;
          color: white;
        }

        .form-group {
          margin-bottom: 16px;
        }

        .form-group label {
          display: block;
          font-size: 14px;
          font-weight: 500;
          color: #374151;
          margin-bottom: 8px;
        }

        .text-input,
        .select-input,
        .textarea-input {
          width: 100%;
          padding: 10px 14px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          transition: border-color 0.2s;
        }

        .text-input:focus,
        .select-input:focus,
        .textarea-input:focus {
          outline: none;
          border-color: #7c2d5e;
        }

        .char-counter {
          display: block;
          text-align: right;
          font-size: 12px;
          color: #6b7280;
          margin-top: 4px;
        }

        .engraving-fee {
          padding: 12px 16px;
          background: #f9fafb;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 600;
          color: #7c2d5e;
          text-align: center;
        }

        .gift-message-note {
          font-size: 13px;
          color: #16a34a;
          margin: 8px 0 0;
          font-weight: 500;
        }

        .validation-error {
          padding: 12px 16px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 8px;
          color: #991b1b;
          font-size: 14px;
          margin: 20px 0 0;
        }

        .preview-panel {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          position: sticky;
          top: 24px;
          height: fit-content;
        }

        .preview-panel h3 {
          font-size: 18px;
          font-weight: 600;
          color: #111827;
          margin: 0 0 20px;
        }

        .preview-content {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .preview-image {
          width: 100%;
          height: auto;
          border-radius: 8px;
          margin-bottom: 16px;
        }

        .preview-details {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          padding-bottom: 8px;
          border-bottom: 1px solid #e5e7eb;
        }

        .detail-row:last-child {
          border-bottom: none;
        }

        .detail-label {
          font-size: 13px;
          color: #6b7280;
          font-weight: 500;
        }

        .detail-value {
          font-size: 13px;
          color: #111827;
          font-weight: 600;
          text-align: right;
        }

        .price-breakdown {
          margin-top: 20px;
          padding-top: 20px;
          border-top: 2px solid #e5e7eb;
        }

        .price-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
          font-size: 14px;
          color: #374151;
        }

        .price-row.total {
          margin-top: 12px;
          padding-top: 12px;
          border-top: 2px solid #e5e7eb;
          font-size: 18px;
          font-weight: 700;
          color: #111827;
        }

        .navigation-buttons {
          display: flex;
          gap: 16px;
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
          background: #7c2d5e;
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          background: #6b2551;
        }

        .btn-primary:disabled {
          background: #d1d5db;
          cursor: not-allowed;
        }

        /* Mobile responsive */
        @media (max-width: 1024px) {
          .customization-content {
            grid-template-columns: 1fr;
          }

          .preview-panel {
            position: relative;
            top: 0;
          }
        }

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

          .customization-form {
            padding: 20px;
          }

          .metal-type-grid {
            grid-template-columns: repeat(2, 1fr);
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
