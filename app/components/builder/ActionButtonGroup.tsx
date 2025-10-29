/**
 * Action Button Group Component
 *
 * Phase 2.0: Customer engagement action buttons.
 *
 * Features:
 * - Drop A Hint
 * - Request More Info
 * - E-Mail A Friend
 * - Schedule Viewing
 * - Optional: Virtual Try-On
 *
 * Responsive layout (stacked on mobile, grid on desktop)
 */

import { Heart, Mail, Send, Calendar, Camera } from "lucide-react";
import { Icon } from "~/components/ui/Icon";

export interface ActionButtonGroupProps {
  onDropHint: () => void;
  onRequestInfo: () => void;
  onEmailFriend: () => void;
  onScheduleViewing: () => void;
  onVirtualTryOn?: () => void;
  vtoEnabled?: boolean;
}

export function ActionButtonGroup({
  onDropHint,
  onRequestInfo,
  onEmailFriend,
  onScheduleViewing,
  onVirtualTryOn,
  vtoEnabled = false,
}: ActionButtonGroupProps) {
  return (
    <div className="action-button-group">
      <h3 className="section-title">Need Help?</h3>

      <div className="buttons-grid">
        <button
          type="button"
          className="action-btn hint"
          onClick={onDropHint}
          aria-label="Drop a hint about this ring"
        >
          <Icon icon={Heart} size="lg" className="btn-icon" />
          <span className="btn-text">
            <span className="btn-title">Drop A Hint</span>
            <span className="btn-subtitle">
              Let someone know you love this ring
            </span>
          </span>
        </button>

        <button
          type="button"
          className="action-btn info"
          onClick={onRequestInfo}
          aria-label="Request more information"
        >
          <Icon icon={Mail} size="lg" className="btn-icon" />
          <span className="btn-text">
            <span className="btn-title">Request More Info</span>
            <span className="btn-subtitle">Ask us a question</span>
          </span>
        </button>

        <button
          type="button"
          className="action-btn email"
          onClick={onEmailFriend}
          aria-label="Email this ring to a friend"
        >
          <Icon icon={Send} size="lg" className="btn-icon" />
          <span className="btn-text">
            <span className="btn-title">E-Mail A Friend</span>
            <span className="btn-subtitle">Share with someone you know</span>
          </span>
        </button>

        <button
          type="button"
          className="action-btn viewing"
          onClick={onScheduleViewing}
          aria-label="Schedule an in-store viewing"
        >
          <Icon icon={Calendar} size="lg" className="btn-icon" />
          <span className="btn-text">
            <span className="btn-title">Schedule Viewing</span>
            <span className="btn-subtitle">See it in person</span>
          </span>
        </button>

        {vtoEnabled && onVirtualTryOn && (
          <button
            type="button"
            className="action-btn vto"
            onClick={onVirtualTryOn}
            aria-label="Virtual try-on"
          >
            <Icon icon={Camera} size="lg" className="btn-icon" />
            <span className="btn-text">
              <span className="btn-title">Virtual Try-On</span>
              <span className="btn-subtitle">See how it looks</span>
            </span>
          </button>
        )}
      </div>

      <style>{`
        .action-button-group {
          margin: 2rem 0;
          padding: 2rem;
          background: white;
          border: 1px solid #e0e0e0;
          border-radius: 12px;
        }

        .section-title {
          margin: 0 0 1.5rem 0;
          font-size: 1.25rem;
          font-weight: 700;
          color: #333;
        }

        .buttons-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }

        /* Mobile: 1 column */
        @media (max-width: 640px) {
          .buttons-grid {
            grid-template-columns: 1fr;
          }
        }

        /* Large desktop: 4 columns if no VTO, 3 if VTO */
        @media (min-width: 1280px) {
          .buttons-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .action-btn {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.25rem;
          background: white;
          border: 2px solid #e0e0e0;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.25s ease;
          text-align: left;
          min-height: 90px;
        }

        .action-btn:hover {
          border-color: #6D2932;
          background: #fff5f7;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(109, 41, 50, 0.15);
        }

        .action-btn:active {
          transform: translateY(0);
        }

        .action-btn:focus {
          outline: 2px solid #6D2932;
          outline-offset: 2px;
        }

        .btn-icon {
          flex-shrink: 0;
          color: #6D2932;
        }

        .btn-text {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          flex: 1;
        }

        .btn-title {
          font-size: 1rem;
          font-weight: 600;
          color: #333;
        }

        .btn-subtitle {
          font-size: 0.85rem;
          color: #666;
        }

        /* Specific button colors on hover */
        .action-btn.hint:hover {
          border-color: #e91e63;
        }

        .action-btn.info:hover {
          border-color: #2196f3;
        }

        .action-btn.email:hover {
          border-color: #4caf50;
        }

        .action-btn.viewing:hover {
          border-color: #ff9800;
        }

        .action-btn.vto:hover {
          border-color: #9c27b0;
        }

        /* Mobile: Larger touch targets */
        @media (max-width: 640px) {
          .action-btn {
            min-height: 100px;
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}
