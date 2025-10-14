/**
 * Add Setting Modal Component
 *
 * Phase 2.0: Visual form for adding setting specifications to products.
 *
 * Features:
 * - Product preview
 * - Style dropdown
 * - Compatible shapes multi-select (with icons)
 * - Metal pricing table
 * - Setting height selection
 * - Form validation
 * - Save to metafields + database
 */

import { useState } from "react";
import { IconShapeSelector, type IconItem } from "./IconShapeSelector";
import { MetalPricingTable } from "./MetalPricingTable";
import type { MetalType, StoneShape, SettingStyle } from "~/types/builder";

interface AddSettingModalProps {
  product: {
    id: string;
    title: string;
    price: string;
    image?: string;
    sku?: string;
  };
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: SettingFormData) => Promise<void>;
}

export interface SettingFormData {
  style: SettingStyle;
  compatibleShapes: StoneShape[];
  basePrices: Record<MetalType, number>;
  settingHeight?: string;
  featured?: boolean;
}

const SETTING_STYLES = [
  "solitaire",
  "halo",
  "three_stone",
  "vintage",
  "modern",
  "pave",
  "channel",
  "tension",
];

const COMPATIBLE_SHAPES: IconItem[] = [
  { value: "round", label: "Round" },
  { value: "princess", label: "Princess" },
  { value: "oval", label: "Oval" },
  { value: "pear", label: "Pear" },
  { value: "marquise", label: "Marquise" },
  { value: "heart", label: "Heart" },
  { value: "emerald", label: "Emerald" },
  { value: "cushion", label: "Cushion" },
  { value: "asscher", label: "Asscher" },
  { value: "radiant", label: "Radiant" },
];

export function AddSettingModal({
  product,
  isOpen,
  onClose,
  onSave,
}: AddSettingModalProps) {
  const [formData, setFormData] = useState<SettingFormData>({
    style: "solitaire" as SettingStyle,
    compatibleShapes: [],
    basePrices: {
      "14k_white_gold": 0,
      "14k_yellow_gold": 0,
      "14k_rose_gold": 0,
      "18k_white_gold": 0,
      "18k_yellow_gold": 0,
      "18k_rose_gold": 0,
      platinum: 0,
    },
    settingHeight: "",
    featured: false,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.style) {
      newErrors.style = "Style is required";
    }

    if (formData.compatibleShapes.length === 0) {
      newErrors.compatibleShapes = "Select at least one compatible shape";
    }

    // Validate at least one metal price is set
    const hasPrices = Object.values(formData.basePrices).some(
      (price) => price > 0,
    );
    if (!hasPrices) {
      newErrors.basePrices = "Set at least one metal price";
    }

    // Validate all prices are >= 0
    for (const [metal, price] of Object.entries(formData.basePrices)) {
      if (price < 0) {
        newErrors[metal] = "Price cannot be negative";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error("Error saving setting:", error);
      setErrors({ submit: "Failed to save setting specifications" });
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add Setting Specifications</h2>
          <button className="close-button" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="modal-body">
          {/* Product Preview */}
          <div className="product-preview">
            {product.image && (
              <img
                src={product.image}
                alt={product.title}
                className="preview-image"
              />
            )}
            <div className="preview-info">
              <h3>{product.title}</h3>
              <p className="preview-meta">
                ${product.price} {product.sku && `| SKU: ${product.sku}`}
              </p>
              <p className="preview-source">From: Shopify</p>
            </div>
          </div>

          <div className="form-divider" />

          {/* Setting Specifications */}
          <div className="form-section">
            <h3 className="section-title">Setting Specifications</h3>

            {/* Style Dropdown */}
            <div className="form-group">
              <label htmlFor="style">
                Setting Style <span className="required-indicator">*</span>
              </label>
              <select
                id="style"
                value={formData.style}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    style: e.target.value as SettingStyle,
                  })
                }
                className={errors.style ? "error" : ""}
              >
                {SETTING_STYLES.map((style) => (
                  <option key={style} value={style}>
                    {style
                      .split("_")
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1),
                      )
                      .join(" ")}
                  </option>
                ))}
              </select>
              {errors.style && <p className="error-message">{errors.style}</p>}
            </div>

            {/* Compatible Shapes Multi-Select */}
            <IconShapeSelector
              items={COMPATIBLE_SHAPES}
              selected={formData.compatibleShapes}
              onChange={(shapes) =>
                setFormData({
                  ...formData,
                  compatibleShapes: shapes as StoneShape[],
                })
              }
              multiSelect
              label="Compatible Diamond Shapes"
              required
            />
            {errors.compatibleShapes && (
              <p className="error-message">{errors.compatibleShapes}</p>
            )}

            {/* Setting Height */}
            <div className="form-group">
              <label htmlFor="settingHeight">Setting Height (Optional)</label>
              <select
                id="settingHeight"
                value={formData.settingHeight || ""}
                onChange={(e) =>
                  setFormData({ ...formData, settingHeight: e.target.value })
                }
              >
                <option value="">Not specified</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            {/* Metal Pricing Table */}
            <div className="form-group">
              <label>
                Metal Type Pricing <span className="required-indicator">*</span>
              </label>
              <p className="helper-text">
                Set the base price for each metal type. At least one is
                required.
              </p>
              <MetalPricingTable
                prices={formData.basePrices}
                onChange={(prices) =>
                  setFormData({ ...formData, basePrices: prices })
                }
                errors={errors}
              />
              {errors.basePrices && (
                <p className="error-message">{errors.basePrices}</p>
              )}
            </div>

            {/* Featured Checkbox */}
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) =>
                    setFormData({ ...formData, featured: e.target.checked })
                  }
                />
                <span>Mark as Featured (show in top results)</span>
              </label>
            </div>
          </div>

          {/* Info Box */}
          <div className="info-box">
            <p className="info-title">✓ What happens when you click Save:</p>
            <ul className="info-list">
              <li>Specs written to Shopify metafields (permanent)</li>
              <li>Cached in app database (fast searching)</li>
              <li>Product appears in ring builder immediately</li>
            </ul>
          </div>

          {errors.submit && (
            <p className="error-message submit-error">{errors.submit}</p>
          )}
        </div>

        <div className="modal-footer">
          <button type="button" onClick={onClose} className="button-secondary">
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="button-primary"
          >
            {isSaving ? "Saving..." : "Save Setting Specs"}
          </button>
        </div>

        <style>{`
          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            padding: 1rem;
          }

          .modal-container {
            background: white;
            border-radius: 12px;
            max-width: 900px;
            width: 100%;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          }

          .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1.5rem;
            border-bottom: 1px solid #e0e0e0;
          }

          .modal-header h2 {
            margin: 0;
            font-size: 1.5rem;
            color: #333;
          }

          .close-button {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: #666;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
          }

          .close-button:hover {
            background: #f0f0f0;
            color: #333;
          }

          .modal-body {
            padding: 1.5rem;
          }

          .product-preview {
            display: flex;
            gap: 1rem;
            padding: 1rem;
            background: #f7f7f7;
            border-radius: 8px;
            margin-bottom: 1.5rem;
          }

          .preview-image {
            width: 120px;
            height: 120px;
            object-fit: cover;
            border-radius: 8px;
            border: 1px solid #e0e0e0;
          }

          .preview-info h3 {
            margin: 0 0 0.5rem 0;
            font-size: 1.1rem;
            color: #333;
          }

          .preview-meta {
            font-size: 0.9rem;
            color: #666;
            margin: 0.25rem 0;
          }

          .preview-source {
            font-size: 0.85rem;
            color: #999;
            margin: 0.25rem 0;
          }

          .form-divider {
            height: 1px;
            background: #e0e0e0;
            margin: 1.5rem 0;
          }

          .form-section {
            margin-bottom: 1.5rem;
          }

          .section-title {
            font-size: 1.1rem;
            font-weight: 600;
            color: #333;
            margin: 0 0 1rem 0;
          }

          .form-group {
            margin-bottom: 1.5rem;
          }

          .form-group label {
            display: block;
            font-weight: 500;
            font-size: 0.9rem;
            margin-bottom: 0.5rem;
            color: #333;
          }

          .form-group select,
          .form-group input {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #e0e0e0;
            border-radius: 6px;
            font-size: 1rem;
            transition: border-color 0.2s;
          }

          .form-group select:focus,
          .form-group input:focus {
            outline: none;
            border-color: #6D2932;
            box-shadow: 0 0 0 3px rgba(109, 41, 50, 0.1);
          }

          .form-group select.error,
          .form-group input.error {
            border-color: #dc3545;
          }

          .required-indicator {
            color: #dc3545;
          }

          .helper-text {
            font-size: 0.85rem;
            color: #666;
            margin: 0.5rem 0;
          }

          .checkbox-label {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            cursor: pointer;
            padding: 0.75rem;
            border: 1px solid #e0e0e0;
            border-radius: 6px;
            transition: all 0.2s;
          }

          .checkbox-label:hover {
            border-color: #6D2932;
            background: #fff5f7;
          }

          .checkbox-label input[type="checkbox"] {
            width: auto;
            margin: 0;
          }

          .info-box {
            background: #e8f5e9;
            border: 1px solid #4caf50;
            border-radius: 8px;
            padding: 1rem;
            margin-top: 1.5rem;
          }

          .info-title {
            font-weight: 600;
            color: #2e7d32;
            margin: 0 0 0.5rem 0;
          }

          .info-list {
            margin: 0.5rem 0 0 1.5rem;
            color: #2e7d32;
          }

          .info-list li {
            margin: 0.25rem 0;
          }

          .error-message {
            color: #dc3545;
            font-size: 0.85rem;
            margin: 0.5rem 0 0 0;
          }

          .submit-error {
            background: #fee;
            border: 1px solid #dc3545;
            padding: 0.75rem;
            border-radius: 6px;
            margin-top: 1rem;
          }

          .modal-footer {
            display: flex;
            justify-content: flex-end;
            gap: 1rem;
            padding: 1.5rem;
            border-top: 1px solid #e0e0e0;
          }

          .button-secondary {
            padding: 0.75rem 1.5rem;
            border: 1px solid #e0e0e0;
            background: white;
            color: #333;
            font-weight: 500;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.2s;
          }

          .button-secondary:hover {
            background: #f7f7f7;
            border-color: #ccc;
          }

          .button-primary {
            padding: 0.75rem 1.5rem;
            border: none;
            background: #6D2932;
            color: white;
            font-weight: 500;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.2s;
          }

          .button-primary:hover:not(:disabled) {
            background: #5a1f28;
            box-shadow: 0 4px 12px rgba(109, 41, 50, 0.3);
          }

          .button-primary:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }
        `}</style>
      </div>
    </div>
  );
}
