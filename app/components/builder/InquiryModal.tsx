/**
 * Inquiry Modal Component
 *
 * Phase 2.0: Multi-purpose inquiry form for customer engagement.
 *
 * Types:
 * - hint: Drop a hint (no pricing, to recipient)
 * - info: Request more info (to merchant)
 * - email: Email a friend (to friend with pricing)
 * - viewing: Schedule viewing (to merchant with date/time)
 */

import { useState } from "react";
import type { InquiryType } from "~/types/builder";

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  inquiryType: InquiryType;
  configurationId?: string;
  productId?: string;
  onSubmit: (data: InquiryFormData) => Promise<void>;
}

export interface InquiryFormData {
  type: InquiryType;
  recipientEmail?: string; // For hint, email
  senderName?: string; // For hint, email
  customerName?: string; // For info, viewing
  customerEmail?: string; // For info, viewing
  customerPhone?: string;
  message?: string;
  question?: string; // For info requests
  specialDate?: string; // For hints
  preferredDate?: string; // For viewing
  preferredTime?: string; // For viewing
}

const INQUIRY_CONFIG = {
  hint: {
    title: "Drop A Hint 💌",
    subtitle: "Let someone special know you love this ring",
    icon: "💍",
  },
  info: {
    title: "Request More Info 📧",
    subtitle: "Ask us a question about this ring",
    icon: "ℹ️",
  },
  email: {
    title: "E-Mail A Friend ✉️",
    subtitle: "Share this ring with someone you know",
    icon: "📨",
  },
  viewing: {
    title: "Schedule Viewing 📅",
    subtitle: "See this ring in person at our store",
    icon: "🏪",
  },
};

export function InquiryModal({
  isOpen,
  onClose,
  inquiryType,
  configurationId,
  productId,
  onSubmit,
}: InquiryModalProps) {
  const config = INQUIRY_CONFIG[inquiryType];

  const [formData, setFormData] = useState<InquiryFormData>({
    type: inquiryType,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (inquiryType === "hint") {
      if (!formData.recipientEmail) {
        newErrors.recipientEmail = "Recipient email is required";
      }
      if (!formData.senderName) {
        newErrors.senderName = "Your name is required";
      }
    }

    if (inquiryType === "info" || inquiryType === "viewing") {
      if (!formData.customerName) {
        newErrors.customerName = "Your name is required";
      }
      if (!formData.customerEmail) {
        newErrors.customerEmail = "Your email is required";
      }
    }

    if (inquiryType === "email") {
      if (!formData.recipientEmail) {
        newErrors.recipientEmail = "Friend's email is required";
      }
      if (!formData.senderName) {
        newErrors.senderName = "Your name is required";
      }
    }

    if (inquiryType === "viewing") {
      if (!formData.preferredDate) {
        newErrors.preferredDate = "Preferred date is required";
      }
      if (!formData.preferredTime) {
        newErrors.preferredTime = "Preferred time is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      setFormData({ type: inquiryType }); // Reset form
      onClose();
    } catch (error) {
      setErrors({ submit: "Failed to submit inquiry. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="inquiry-modal-overlay" onClick={onClose}>
      <div
        className="inquiry-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="header-content">
            <span className="header-icon">{config.icon}</span>
            <div>
              <h2>{config.title}</h2>
              <p className="subtitle">{config.subtitle}</p>
            </div>
          </div>
          <button className="close-button" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {/* Drop A Hint Form */}
          {inquiryType === "hint" && (
            <>
              <div className="form-group">
                <label htmlFor="recipientEmail">
                  Recipient Email <span className="required">*</span>
                </label>
                <input
                  id="recipientEmail"
                  type="email"
                  value={formData.recipientEmail || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, recipientEmail: e.target.value })
                  }
                  placeholder="someone@example.com"
                  className={errors.recipientEmail ? "error" : ""}
                />
                {errors.recipientEmail && (
                  <p className="error-message">{errors.recipientEmail}</p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="senderName">
                  Your Name <span className="required">*</span>
                </label>
                <input
                  id="senderName"
                  type="text"
                  value={formData.senderName || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, senderName: e.target.value })
                  }
                  placeholder="Or stay anonymous"
                />
              </div>

              <div className="form-group">
                <label htmlFor="specialDate">Special Date (Optional)</label>
                <input
                  id="specialDate"
                  type="date"
                  value={formData.specialDate || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, specialDate: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message (Optional)</label>
                <textarea
                  id="message"
                  value={formData.message || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  placeholder="Add a personal note..."
                  rows={3}
                />
              </div>
            </>
          )}

          {/* Request Info Form */}
          {inquiryType === "info" && (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="customerName">
                    Your Name <span className="required">*</span>
                  </label>
                  <input
                    id="customerName"
                    type="text"
                    value={formData.customerName || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, customerName: e.target.value })
                    }
                    placeholder="John Doe"
                    className={errors.customerName ? "error" : ""}
                  />
                  {errors.customerName && (
                    <p className="error-message">{errors.customerName}</p>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="customerEmail">
                    Your Email <span className="required">*</span>
                  </label>
                  <input
                    id="customerEmail"
                    type="email"
                    value={formData.customerEmail || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        customerEmail: e.target.value,
                      })
                    }
                    placeholder="you@example.com"
                    className={errors.customerEmail ? "error" : ""}
                  />
                  {errors.customerEmail && (
                    <p className="error-message">{errors.customerEmail}</p>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="customerPhone">Phone (Optional)</label>
                <input
                  id="customerPhone"
                  type="tel"
                  value={formData.customerPhone || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, customerPhone: e.target.value })
                  }
                  placeholder="(555) 123-4567"
                />
              </div>

              <div className="form-group">
                <label htmlFor="question">
                  Your Question <span className="required">*</span>
                </label>
                <textarea
                  id="question"
                  value={formData.question || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, question: e.target.value })
                  }
                  placeholder="What would you like to know about this ring?"
                  rows={4}
                  className={errors.question ? "error" : ""}
                />
                {errors.question && (
                  <p className="error-message">{errors.question}</p>
                )}
              </div>
            </>
          )}

          {/* Email Friend Form */}
          {inquiryType === "email" && (
            <>
              <div className="form-group">
                <label htmlFor="recipientEmail">
                  Friend's Email <span className="required">*</span>
                </label>
                <input
                  id="recipientEmail"
                  type="email"
                  value={formData.recipientEmail || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, recipientEmail: e.target.value })
                  }
                  placeholder="friend@example.com"
                  className={errors.recipientEmail ? "error" : ""}
                />
                {errors.recipientEmail && (
                  <p className="error-message">{errors.recipientEmail}</p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="senderName">
                  Your Name <span className="required">*</span>
                </label>
                <input
                  id="senderName"
                  type="text"
                  value={formData.senderName || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, senderName: e.target.value })
                  }
                  placeholder="Your name"
                  className={errors.senderName ? "error" : ""}
                />
                {errors.senderName && (
                  <p className="error-message">{errors.senderName}</p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="message">Message (Optional)</label>
                <textarea
                  id="message"
                  value={formData.message || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  placeholder="Check out this beautiful ring!"
                  rows={3}
                />
              </div>
            </>
          )}

          {/* Schedule Viewing Form */}
          {inquiryType === "viewing" && (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="customerName">
                    Your Name <span className="required">*</span>
                  </label>
                  <input
                    id="customerName"
                    type="text"
                    value={formData.customerName || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, customerName: e.target.value })
                    }
                    placeholder="John Doe"
                    className={errors.customerName ? "error" : ""}
                  />
                  {errors.customerName && (
                    <p className="error-message">{errors.customerName}</p>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="customerEmail">
                    Your Email <span className="required">*</span>
                  </label>
                  <input
                    id="customerEmail"
                    type="email"
                    value={formData.customerEmail || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        customerEmail: e.target.value,
                      })
                    }
                    placeholder="you@example.com"
                    className={errors.customerEmail ? "error" : ""}
                  />
                  {errors.customerEmail && (
                    <p className="error-message">{errors.customerEmail}</p>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="customerPhone">Phone (Optional)</label>
                <input
                  id="customerPhone"
                  type="tel"
                  value={formData.customerPhone || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, customerPhone: e.target.value })
                  }
                  placeholder="(555) 123-4567"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="preferredDate">
                    Preferred Date <span className="required">*</span>
                  </label>
                  <input
                    id="preferredDate"
                    type="date"
                    value={formData.preferredDate || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        preferredDate: e.target.value,
                      })
                    }
                    min={new Date().toISOString().split("T")[0]}
                    className={errors.preferredDate ? "error" : ""}
                  />
                  {errors.preferredDate && (
                    <p className="error-message">{errors.preferredDate}</p>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="preferredTime">
                    Preferred Time <span className="required">*</span>
                  </label>
                  <select
                    id="preferredTime"
                    value={formData.preferredTime || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        preferredTime: e.target.value,
                      })
                    }
                    className={errors.preferredTime ? "error" : ""}
                  >
                    <option value="">Select time</option>
                    <option value="9:00 AM">9:00 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="12:00 PM">12:00 PM</option>
                    <option value="1:00 PM">1:00 PM</option>
                    <option value="2:00 PM">2:00 PM</option>
                    <option value="3:00 PM">3:00 PM</option>
                    <option value="4:00 PM">4:00 PM</option>
                    <option value="5:00 PM">5:00 PM</option>
                    <option value="6:00 PM">6:00 PM</option>
                  </select>
                  {errors.preferredTime && (
                    <p className="error-message">{errors.preferredTime}</p>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="message">Message (Optional)</label>
                <textarea
                  id="message"
                  value={formData.message || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  placeholder="Any special requests or questions?"
                  rows={3}
                />
              </div>
            </>
          )}

          {errors.submit && (
            <p className="error-message submit-error">{errors.submit}</p>
          )}

          <div className="form-actions">
            <button
              type="button"
              onClick={onClose}
              className="button-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="button-primary"
            >
              {isSubmitting ? "Sending..." : "Send"}
            </button>
          </div>
        </form>

        <style>{`
          .inquiry-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.6);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
            padding: 1rem;
          }

          .inquiry-modal-container {
            background: white;
            border-radius: 12px;
            max-width: 600px;
            width: 100%;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          }

          .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            padding: 1.5rem;
            border-bottom: 1px solid #e0e0e0;
          }

          .header-content {
            display: flex;
            align-items: center;
            gap: 1rem;
          }

          .header-icon {
            font-size: 2.5rem;
          }

          .modal-header h2 {
            margin: 0 0 0.25rem 0;
            font-size: 1.5rem;
            color: #333;
          }

          .subtitle {
            margin: 0;
            font-size: 0.9rem;
            color: #666;
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
            flex-shrink: 0;
          }

          .close-button:hover {
            background: #f0f0f0;
          }

          .modal-body {
            padding: 1.5rem;
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
            margin-bottom: 1rem;
          }

          .form-group label {
            display: block;
            font-weight: 500;
            margin-bottom: 0.5rem;
            color: #333;
          }

          .required {
            color: #dc3545;
          }

          .form-group input,
          .form-group textarea,
          .form-group select {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #e0e0e0;
            border-radius: 6px;
            font-size: 1rem;
            font-family: inherit;
            transition: border-color 0.2s;
          }

          .form-group input:focus,
          .form-group textarea:focus,
          .form-group select:focus {
            outline: none;
            border-color: #6D2932;
            box-shadow: 0 0 0 3px rgba(109, 41, 50, 0.1);
          }

          .form-group input.error,
          .form-group textarea.error,
          .form-group select.error {
            border-color: #dc3545;
          }

          .error-message {
            color: #dc3545;
            font-size: 0.85rem;
            margin: 0.5rem 0 0 0;
          }

          .submit-error {
            background: #ffebee;
            border: 1px solid #dc3545;
            padding: 0.75rem;
            border-radius: 6px;
            margin-bottom: 1rem;
          }

          .form-actions {
            display: flex;
            justify-content: flex-end;
            gap: 1rem;
            margin-top: 1.5rem;
            padding-top: 1.5rem;
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
