/**
 * Configuration Summary Component
 *
 * Display complete configuration details with edit buttons.
 */

import { Circle, Gem, Sparkles, Edit2 } from "lucide-react";
import { Icon } from "~/components/ui/Icon";
import type {
  Setting,
  Stone,
  SideStonesConfig,
  BuilderStep,
} from "~/types/builder";

interface ConfigurationSummaryProps {
  setting: Setting;
  stone: Stone;
  metalType: string;
  ringSize: string;
  sideStones?: SideStonesConfig;
  onEdit: (step: BuilderStep) => void;
}

export function ConfigurationSummary({
  setting,
  stone,
  metalType,
  ringSize,
  sideStones,
  onEdit,
}: ConfigurationSummaryProps) {
  const metalTypeLabel =
    {
      "14k_white_gold": "14K White Gold",
      "14k_yellow_gold": "14K Yellow Gold",
      "18k_rose_gold": "18K Rose Gold",
      platinum: "Platinum",
    }[metalType] || metalType;

  const certificateDisplay = stone.certificate
    ? `${stone.certificate}${stone.certificateNumber ? ` ${stone.certificateNumber}` : ""}`
    : "Not certified";

  return (
    <div className="configuration-summary">
      <h3>Configuration Details</h3>

      {/* Setting Section */}
      <div className="config-section">
        <div className="section-header">
          <h4>
            <Icon icon={Circle} size="sm" className="section-icon" />
            Ring Setting
          </h4>
          <button
            onClick={() => onEdit(1)}
            className="edit-button"
            aria-label="Edit setting"
          >
            <Icon icon={Edit2} size="xs" />
            Edit
          </button>
        </div>
        <div className="detail-grid">
          <div className="detail-item">
            <span className="detail-label">Name:</span>
            <span className="detail-value">{setting.name}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Style:</span>
            <span className="detail-value">{setting.style}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Metal:</span>
            <span className="detail-value">{metalTypeLabel}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">SKU:</span>
            <span className="detail-value">{setting.sku || "N/A"}</span>
          </div>
        </div>
      </div>

      {/* Stone Section */}
      <div className="config-section">
        <div className="section-header">
          <h4>
            <Icon icon={Gem} size="sm" className="section-icon" />
            Center Stone
          </h4>
          <button
            onClick={() => onEdit(2)}
            className="edit-button"
            aria-label="Edit stone"
          >
            <Icon icon={Edit2} size="xs" />
            Edit
          </button>
        </div>
        <div className="detail-grid">
          <div className="detail-item">
            <span className="detail-label">Carat:</span>
            <span className="detail-value">{stone.carat} ct</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Shape:</span>
            <span className="detail-value">{stone.shape}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Cut:</span>
            <span className="detail-value">{stone.cut}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Color:</span>
            <span className="detail-value">{stone.color}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Clarity:</span>
            <span className="detail-value">{stone.clarity}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Certificate:</span>
            <span className="detail-value">{certificateDisplay}</span>
          </div>
          {stone.measurements && (
            <div className="detail-item">
              <span className="detail-label">Measurements:</span>
              <span className="detail-value">{stone.measurements}</span>
            </div>
          )}
        </div>
      </div>

      {/* Customization Section */}
      <div className="config-section">
        <div className="section-header">
          <h4>
            <Icon icon={Sparkles} size="sm" className="section-icon" />
            Customization
          </h4>
          <button
            onClick={() => onEdit(3)}
            className="edit-button"
            aria-label="Edit customization"
          >
            <Icon icon={Edit2} size="xs" />
            Edit
          </button>
        </div>
        <div className="detail-grid">
          <div className="detail-item">
            <span className="detail-label">Ring Size:</span>
            <span className="detail-value">US {ringSize}</span>
          </div>
          {sideStones?.quantity && (
            <>
              <div className="detail-item">
                <span className="detail-label">Side Stones:</span>
                <span className="detail-value">
                  {sideStones.quantity} stones
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Quality:</span>
                <span className="detail-value">{sideStones.quality}</span>
              </div>
            </>
          )}
        </div>
      </div>

      <style>{`
        .configuration-summary {
          background: white;
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .configuration-summary h3 {
          font-size: 20px;
          font-weight: 700;
          color: #111827;
          margin: 0 0 24px;
        }

        .config-section {
          padding: 20px;
          background: #f9fafb;
          border-radius: 8px;
          margin-bottom: 16px;
        }

        .config-section:last-child {
          margin-bottom: 0;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .section-header h4 {
          font-size: 16px;
          font-weight: 600;
          color: #374151;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .section-icon {
          color: #d4af37;
        }

        .edit-button {
          padding: 6px 16px;
          background: white;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          color: #374151;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .edit-button:hover {
          background: #f9fafb;
          border-color: #d4af37;
          color: #d4af37;
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(212, 175, 55, 0.2);
        }

        .detail-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 12px;
        }

        .detail-item {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #e5e7eb;
        }

        .detail-item:last-child {
          border-bottom: none;
        }

        .detail-label {
          font-size: 14px;
          color: #6b7280;
          font-weight: 500;
        }

        .detail-value {
          font-size: 14px;
          color: #111827;
          font-weight: 600;
          text-align: right;
        }

        /* Mobile responsive */
        @media (max-width: 768px) {
          .configuration-summary {
            padding: 20px;
          }

          .configuration-summary h3 {
            font-size: 18px;
          }

          .config-section {
            padding: 16px;
          }

          .section-header h4 {
            font-size: 15px;
          }

          .detail-grid {
            grid-template-columns: 1fr;
            gap: 8px;
          }

          .detail-item {
            flex-direction: column;
            gap: 4px;
            padding: 10px 0;
          }

          .detail-value {
            text-align: left;
          }

          .edit-button {
            font-size: 13px;
            padding: 5px 12px;
          }
        }
      `}</style>
    </div>
  );
}
