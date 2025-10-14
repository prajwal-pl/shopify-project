/**
 * Share Modal Component
 *
 * Phase 2.0: Share configuration via email or social media.
 *
 * Features:
 * - Email share form
 * - Copy link button
 * - Social sharing buttons (Facebook, Twitter, Pinterest)
 * - Success feedback
 */

import { useState } from "react";
import { copyToClipboard } from "~/utils/share-helpers";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareUrl: string;
  configurationId: string;
  onEmailShare: (
    recipientEmail: string,
    senderName: string,
    message: string,
  ) => Promise<void>;
}

export function ShareModal({
  isOpen,
  onClose,
  shareUrl,
  configurationId,
  onEmailShare,
}: ShareModalProps) {
  const [recipientEmail, setRecipientEmail] = useState("");
  const [senderName, setSenderName] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  const handleEmailShare = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!recipientEmail || !senderName) {
      setError("Please fill in all required fields");
      return;
    }

    setIsSending(true);
    try {
      await onEmailShare(recipientEmail, senderName, message);
      setSuccessMessage("Email sent successfully!");
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setError("Failed to send email. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  const handleCopyLink = async () => {
    const success = await copyToClipboard(shareUrl);
    if (success) {
      setSuccessMessage("Link copied to clipboard!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } else {
      setError("Failed to copy link");
    }
  };

  const handleSocialShare = (
    platform: "facebook" | "twitter" | "pinterest",
  ) => {
    const encodedUrl = encodeURIComponent(shareUrl);

    switch (platform) {
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
          "_blank",
          "width=600,height=400",
        );
        break;
      case "twitter":
        const tweet = encodeURIComponent(
          "Check out this beautiful ring I designed!",
        );
        window.open(
          `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${tweet}`,
          "_blank",
          "width=600,height=400",
        );
        break;
      case "pinterest":
        window.open(
          `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=Custom%20Ring%20Design`,
          "_blank",
          "width=600,height=400",
        );
        break;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="share-modal-overlay" onClick={onClose}>
      <div
        className="share-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>Share Your Ring</h2>
          <button className="close-button" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="modal-body">
          {/* Copy Link Section */}
          <div className="share-section">
            <h3>Share Link</h3>
            <div className="copy-link-container">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="share-url-input"
              />
              <button onClick={handleCopyLink} className="copy-button">
                📋 Copy
              </button>
            </div>
          </div>

          {/* Email Share Section */}
          <div className="share-section">
            <h3>Email to Someone</h3>
            <form onSubmit={handleEmailShare} className="email-form">
              <div className="form-group">
                <label htmlFor="recipientEmail">
                  Recipient Email <span className="required">*</span>
                </label>
                <input
                  id="recipientEmail"
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="friend@example.com"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="senderName">
                  Your Name <span className="required">*</span>
                </label>
                <input
                  id="senderName"
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="John Doe"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message (Optional)</label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="I thought you might love this ring!"
                  rows={3}
                />
              </div>

              <button
                type="submit"
                disabled={isSending}
                className="send-email-button"
              >
                {isSending ? "Sending..." : "Send Email"}
              </button>
            </form>
          </div>

          {/* Social Share Section */}
          <div className="share-section">
            <h3>Share on Social Media</h3>
            <div className="social-buttons">
              <button
                onClick={() => handleSocialShare("facebook")}
                className="social-button facebook"
              >
                Facebook
              </button>
              <button
                onClick={() => handleSocialShare("twitter")}
                className="social-button twitter"
              >
                Twitter
              </button>
              <button
                onClick={() => handleSocialShare("pinterest")}
                className="social-button pinterest"
              >
                Pinterest
              </button>
            </div>
          </div>

          {/* Success/Error Messages */}
          {successMessage && (
            <div className="success-message">{successMessage}</div>
          )}
          {error && <div className="error-message">{error}</div>}
        </div>

        <style>{`
          .share-modal-overlay {
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

          .share-modal-container {
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
          }

          .modal-body {
            padding: 1.5rem;
          }

          .share-section {
            margin-bottom: 2rem;
            padding-bottom: 2rem;
            border-bottom: 1px solid #f0f0f0;
          }

          .share-section:last-of-type {
            border-bottom: none;
          }

          .share-section h3 {
            margin: 0 0 1rem 0;
            font-size: 1.1rem;
            color: #333;
          }

          .copy-link-container {
            display: flex;
            gap: 0.5rem;
          }

          .share-url-input {
            flex: 1;
            padding: 0.75rem;
            border: 1px solid #e0e0e0;
            border-radius: 6px;
            font-size: 0.9rem;
            background: #f7f7f7;
          }

          .copy-button {
            padding: 0.75rem 1.5rem;
            background: #000;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
            white-space: nowrap;
          }

          .copy-button:hover {
            background: #333;
          }

          .email-form {
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }

          .form-group {
            display: flex;
            flex-direction: column;
          }

          .form-group label {
            margin-bottom: 0.5rem;
            font-weight: 500;
            color: #333;
          }

          .required {
            color: #dc3545;
          }

          .form-group input,
          .form-group textarea {
            padding: 0.75rem;
            border: 1px solid #e0e0e0;
            border-radius: 6px;
            font-size: 1rem;
            font-family: inherit;
          }

          .form-group input:focus,
          .form-group textarea:focus {
            outline: none;
            border-color: #6D2932;
            box-shadow: 0 0 0 3px rgba(109, 41, 50, 0.1);
          }

          .send-email-button {
            padding: 0.75rem 1.5rem;
            background: #6D2932;
            color: white;
            border: none;
            border-radius: 6px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
          }

          .send-email-button:hover:not(:disabled) {
            background: #5a1f28;
          }

          .send-email-button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }

          .social-buttons {
            display: flex;
            gap: 0.75rem;
            flex-wrap: wrap;
          }

          .social-button {
            flex: 1;
            min-width: 120px;
            padding: 0.75rem 1rem;
            border: none;
            border-radius: 6px;
            color: white;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
          }

          .social-button.facebook {
            background: #1877f2;
          }

          .social-button.facebook:hover {
            background: #165ed0;
          }

          .social-button.twitter {
            background: #1da1f2;
          }

          .social-button.twitter:hover {
            background: #1a8cd8;
          }

          .social-button.pinterest {
            background: #e60023;
          }

          .social-button.pinterest:hover {
            background: #cc001f;
          }

          .success-message {
            background: #e8f5e9;
            border: 1px solid #4caf50;
            color: #2e7d32;
            padding: 1rem;
            border-radius: 6px;
            margin-top: 1rem;
            text-align: center;
            font-weight: 500;
          }

          .error-message {
            background: #ffebee;
            border: 1px solid #f44336;
            color: #c62828;
            padding: 1rem;
            border-radius: 6px;
            margin-top: 1rem;
            text-align: center;
          }

          @media (max-width: 640px) {
            .social-buttons {
              flex-direction: column;
            }

            .social-button {
              min-width: auto;
            }
          }
        `}</style>
      </div>
    </div>
  );
}
