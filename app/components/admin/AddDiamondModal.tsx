/**
 * Add Diamond Modal Component
 *
 * Phase 2.0: Visual form for adding diamond specifications to products.
 *
 * Features:
 * - Product preview (image, title, price)
 * - Icon-based shape selector
 * - Diamond type radio buttons (Mined/Lab Grown/Fancy Color)
 * - All 4Cs (cut, color, clarity, carat)
 * - Certificate information
 * - Advanced specs (expandable)
 * - Form validation
 * - Save to metafields + database
 */

import { useState } from "react";
import { IconShapeSelector, type IconItem } from "./IconShapeSelector";
import type { DiamondType } from "~/types/builder";

interface AddDiamondModalProps {
  product: {
    id: string;
    title: string;
    price: string;
    image?: string;
    sku?: string;
  };
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: DiamondFormData) => Promise<void>;
}

export interface DiamondFormData {
  stoneType: string;
  shape: string;
  carat: number;
  diamondType: DiamondType;
  cut?: string;
  color?: string;
  clarity?: string;
  certificate?: string;
  certificateNumber?: string;
  certificateUrl?: string;
  measurements?: string;
  tablePercent?: number;
  depthPercent?: number;
  polish?: string;
  symmetry?: string;
  fluorescence?: string;
  price: number;
}

const DIAMOND_SHAPES: IconItem[] = [
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

export function AddDiamondModal({
  product,
  isOpen,
  onClose,
  onSave,
}: AddDiamondModalProps) {
  const [formData, setFormData] = useState<DiamondFormData>({
    stoneType: "diamond",
    shape: "",
    carat: 0,
    diamondType: "mined",
    price: parseFloat(product.price) || 0,
  });

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.shape) {
      newErrors.shape = "Shape is required";
    }
    if (!formData.carat || formData.carat <= 0) {
      newErrors.carat = "Carat must be greater than 0";
    }
    if (formData.carat > 50) {
      newErrors.carat = "Carat must be 50 or less";
    }
    if (!formData.price || formData.price <= 0) {
      newErrors.price = "Price must be greater than 0";
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
      console.error("Error saving diamond:", error);
      setErrors({ submit: "Failed to save diamond specifications" });
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add Diamond Specifications</h2>
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

          {/* Diamond Specifications */}
          <div className="form-section">
            <h3 className="section-title">Diamond Specifications</h3>

            {/* Shape Selector */}
            <IconShapeSelector
              items={DIAMOND_SHAPES}
              selected={formData.shape}
              onChange={(shape) =>
                setFormData({ ...formData, shape: shape as string })
              }
              label="Shape"
              required
            />
            {errors.shape && <p className="error-message">{errors.shape}</p>}

            {/* Carat and Diamond Type */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="carat">
                  Carat Weight <span className="required-indicator">*</span>
                </label>
                <input
                  id="carat"
                  type="number"
                  step="0.01"
                  min="0.01"
                  max="50"
                  value={formData.carat || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      carat: parseFloat(e.target.value),
                    })
                  }
                  className={errors.carat ? "error" : ""}
                />
                {errors.carat && (
                  <p className="error-message">{errors.carat}</p>
                )}
              </div>

              <div className="form-group">
                <label>
                  Diamond Type <span className="required-indicator">*</span>
                </label>
                <div className="radio-group">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="diamondType"
                      value="mined"
                      checked={formData.diamondType === "mined"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          diamondType: e.target.value as DiamondType,
                        })
                      }
                    />
                    <span>Mined</span>
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="diamondType"
                      value="lab_grown"
                      checked={formData.diamondType === "lab_grown"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          diamondType: e.target.value as DiamondType,
                        })
                      }
                    />
                    <span>Lab Grown</span>
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="diamondType"
                      value="fancy_color"
                      checked={formData.diamondType === "fancy_color"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          diamondType: e.target.value as DiamondType,
                        })
                      }
                    />
                    <span>Fancy Color</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Cut and Color */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="cut">Cut Grade</label>
                <select
                  id="cut"
                  value={formData.cut || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, cut: e.target.value })
                  }
                >
                  <option value="">Select Cut</option>
                  <option value="excellent">Excellent</option>
                  <option value="very_good">Very Good</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="poor">Poor</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="color">Color Grade</label>
                <select
                  id="color"
                  value={formData.color || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, color: e.target.value })
                  }
                >
                  <option value="">Select Color</option>
                  <optgroup label="Colorless">
                    <option value="d">D</option>
                    <option value="e">E</option>
                    <option value="f">F</option>
                  </optgroup>
                  <optgroup label="Near Colorless">
                    <option value="g">G</option>
                    <option value="h">H</option>
                    <option value="i">I</option>
                    <option value="j">J</option>
                  </optgroup>
                  <optgroup label="Faint">
                    <option value="k">K</option>
                    <option value="l">L</option>
                    <option value="m">M</option>
                  </optgroup>
                </select>
              </div>
            </div>

            {/* Clarity and Certificate */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="clarity">Clarity</label>
                <select
                  id="clarity"
                  value={formData.clarity || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, clarity: e.target.value })
                  }
                >
                  <option value="">Select Clarity</option>
                  <option value="fl">FL (Flawless)</option>
                  <option value="if">IF (Internally Flawless)</option>
                  <option value="vvs1">VVS1</option>
                  <option value="vvs2">VVS2</option>
                  <option value="vs1">VS1</option>
                  <option value="vs2">VS2</option>
                  <option value="si1">SI1</option>
                  <option value="si2">SI2</option>
                  <option value="i1">I1</option>
                  <option value="i2">I2</option>
                  <option value="i3">I3</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="certificate">Certificate</label>
                <select
                  id="certificate"
                  value={formData.certificate || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, certificate: e.target.value })
                  }
                >
                  <option value="">None</option>
                  <option value="gia">GIA (Gemological Institute)</option>
                  <option value="ags">AGS (American Gem Society)</option>
                  <option value="igi">IGI (International Gemological)</option>
                  <option value="egl">EGL (European Gemological)</option>
                  <option value="hrd">HRD (Diamond High Council)</option>
                </select>
              </div>
            </div>

            {/* Certificate Number and URL */}
            {formData.certificate && formData.certificate !== "none" && (
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="certificateNumber">Certificate Number</label>
                  <input
                    id="certificateNumber"
                    type="text"
                    value={formData.certificateNumber || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        certificateNumber: e.target.value,
                      })
                    }
                    placeholder="e.g., 2141234567"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="certificateUrl">Certificate URL</label>
                  <input
                    id="certificateUrl"
                    type="url"
                    value={formData.certificateUrl || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        certificateUrl: e.target.value,
                      })
                    }
                    placeholder="https://..."
                  />
                </div>
              </div>
            )}

            {/* Price */}
            <div className="form-group">
              <label htmlFor="price">
                Price <span className="required-indicator">*</span>
              </label>
              <input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    price: parseFloat(e.target.value),
                  })
                }
                className={errors.price ? "error" : ""}
              />
              {errors.price && <p className="error-message">{errors.price}</p>}
            </div>

            {/* Advanced Specs (Collapsible) */}
            <div className="advanced-section">
              <button
                type="button"
                className="toggle-advanced"
                onClick={() => setShowAdvanced(!showAdvanced)}
              >
                {showAdvanced ? "▼" : "▶"} Advanced Specifications (Optional)
              </button>

              {showAdvanced && (
                <div className="advanced-fields">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="measurements">Measurements (mm)</label>
                      <input
                        id="measurements"
                        type="text"
                        value={formData.measurements || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            measurements: e.target.value,
                          })
                        }
                        placeholder="7.35 x 7.40 x 4.50"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="tablePercent">Table %</label>
                      <input
                        id="tablePercent"
                        type="number"
                        step="0.1"
                        min="0"
                        max="100"
                        value={formData.tablePercent || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            tablePercent: parseFloat(e.target.value),
                          })
                        }
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="depthPercent">Depth %</label>
                      <input
                        id="depthPercent"
                        type="number"
                        step="0.1"
                        min="0"
                        max="100"
                        value={formData.depthPercent || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            depthPercent: parseFloat(e.target.value),
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="polish">Polish</label>
                      <select
                        id="polish"
                        value={formData.polish || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, polish: e.target.value })
                        }
                      >
                        <option value="">Select Polish</option>
                        <option value="excellent">Excellent</option>
                        <option value="very_good">Very Good</option>
                        <option value="good">Good</option>
                        <option value="fair">Fair</option>
                        <option value="poor">Poor</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="symmetry">Symmetry</label>
                      <select
                        id="symmetry"
                        value={formData.symmetry || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, symmetry: e.target.value })
                        }
                      >
                        <option value="">Select Symmetry</option>
                        <option value="excellent">Excellent</option>
                        <option value="very_good">Very Good</option>
                        <option value="good">Good</option>
                        <option value="fair">Fair</option>
                        <option value="poor">Poor</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="fluorescence">Fluorescence</label>
                      <select
                        id="fluorescence"
                        value={formData.fluorescence || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            fluorescence: e.target.value,
                          })
                        }
                      >
                        <option value="">Select Fluorescence</option>
                        <option value="none">None</option>
                        <option value="faint">Faint</option>
                        <option value="medium">Medium</option>
                        <option value="strong">Strong</option>
                        <option value="very_strong">Very Strong</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
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
            {isSaving ? "Saving..." : "Save Diamond Specs"}
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
            max-width: 800px;
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

          .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
            margin-bottom: 1rem;
          }

          @media (max-width: 640px) {
            .form-row {
              grid-template-columns: 1fr;
            }
          }

          .form-group {
            display: flex;
            flex-direction: column;
          }

          .form-group label {
            font-weight: 500;
            font-size: 0.9rem;
            margin-bottom: 0.5rem;
            color: #333;
          }

          .form-group input,
          .form-group select {
            padding: 0.75rem;
            border: 1px solid #e0e0e0;
            border-radius: 6px;
            font-size: 1rem;
            transition: border-color 0.2s;
          }

          .form-group input:focus,
          .form-group select:focus {
            outline: none;
            border-color: #6D2932;
            box-shadow: 0 0 0 3px rgba(109, 41, 50, 0.1);
          }

          .form-group input.error {
            border-color: #dc3545;
          }

          .required-indicator {
            color: #dc3545;
          }

          .radio-group {
            display: flex;
            gap: 1rem;
            flex-wrap: wrap;
          }

          .radio-label {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            cursor: pointer;
            padding: 0.5rem 1rem;
            border: 1px solid #e0e0e0;
            border-radius: 6px;
            transition: all 0.2s;
          }

          .radio-label:hover {
            border-color: #6D2932;
            background: #fff5f7;
          }

          .radio-label input[type="radio"]:checked + span {
            font-weight: 600;
            color: #6D2932;
          }

          .advanced-section {
            margin-top: 1.5rem;
          }

          .toggle-advanced {
            background: none;
            border: none;
            color: #6D2932;
            font-weight: 500;
            cursor: pointer;
            padding: 0.5rem 0;
            font-size: 0.95rem;
          }

          .toggle-advanced:hover {
            text-decoration: underline;
          }

          .advanced-fields {
            margin-top: 1rem;
            padding-top: 1rem;
            border-top: 1px dashed #e0e0e0;
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
