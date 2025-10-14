/**
 * Stone Grid View Component
 *
 * Phase 2.0: Grid layout for browsing diamonds.
 * Alternative to table view for better visual browsing.
 *
 * Features:
 * - Responsive grid (1-4 columns)
 * - Stone cards with images
 * - Comparison checkboxes
 * - Certificate badges
 * - Lazy loading images
 * - Hover effects
 * - React.memo optimization for performance
 */

import { memo } from "react";
import type { Stone } from "~/types/builder";

interface StoneGridViewProps {
  stones: Stone[];
  onSelect: (stone: Stone) => void;
  selectedForComparison?: string[];
  onComparisonToggle?: (stoneId: string) => void;
  maxComparison?: number;
}

export function StoneGridView({
  stones,
  onSelect,
  selectedForComparison = [],
  onComparisonToggle,
  maxComparison = 4,
}: StoneGridViewProps) {
  const isSelectedForComparison = (stoneId: string) =>
    selectedForComparison.includes(stoneId);

  const canAddToComparison = selectedForComparison.length < maxComparison;

  return (
    <div className="stone-grid-view">
      <div className="grid-container">
        {stones.map((stone) => (
          <StoneCard
            key={stone.id}
            stone={stone}
            onSelect={() => onSelect(stone)}
            isSelectedForComparison={isSelectedForComparison(stone.id)}
            onComparisonToggle={
              onComparisonToggle
                ? () => onComparisonToggle(stone.id)
                : undefined
            }
            canAddToComparison={
              canAddToComparison || isSelectedForComparison(stone.id)
            }
          />
        ))}
      </div>

      <style>{`
        .stone-grid-view {
          margin: 2rem 0;
        }

        .grid-container {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
        }

        /* Mobile: 1 column */
        @media (max-width: 640px) {
          .grid-container {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
        }

        /* Tablet: 2 columns */
        @media (min-width: 641px) and (max-width: 1023px) {
          .grid-container {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        /* Desktop: 3 columns */
        @media (min-width: 1024px) and (max-width: 1279px) {
          .grid-container {
            grid-template-columns: repeat(3, 1fr);
          }
        }
      `}</style>
    </div>
  );
}

/**
 * Stone Card Component
 */
interface StoneCardProps {
  stone: Stone;
  onSelect: () => void;
  isSelectedForComparison: boolean;
  onComparisonToggle?: () => void;
  canAddToComparison: boolean;
}

const StoneCard = memo(function StoneCard({
  stone,
  onSelect,
  isSelectedForComparison,
  onComparisonToggle,
  canAddToComparison,
}: StoneCardProps) {
  const image =
    stone.images && stone.images.length > 0 ? stone.images[0] : null;

  return (
    <div className="stone-card">
      {/* Comparison Checkbox */}
      {onComparisonToggle && (
        <div className="comparison-checkbox">
          <label>
            <input
              type="checkbox"
              checked={isSelectedForComparison}
              onChange={onComparisonToggle}
              disabled={!canAddToComparison && !isSelectedForComparison}
              aria-label="Add to comparison"
            />
          </label>
        </div>
      )}

      {/* Image */}
      <div className="stone-image-container" onClick={onSelect}>
        {image ? (
          <img
            src={image}
            alt={`${stone.carat}ct ${stone.shape} diamond`}
            className="stone-image"
            loading="lazy"
          />
        ) : (
          <div className="stone-image-placeholder">
            <span className="placeholder-icon">💎</span>
          </div>
        )}

        {/* Certificate Badge */}
        {stone.certificate && stone.certificate !== "none" && (
          <div className="certificate-badge">
            {stone.certificate.toUpperCase()}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="stone-info" onClick={onSelect}>
        <div className="shape-badge">{stone.shape}</div>

        <div className="stone-specs">
          <div className="carat-weight">{stone.carat.toFixed(2)} ct</div>

          <div className="quality-summary">
            {stone.cut && (
              <span className="spec-item">{formatGrade(stone.cut)}</span>
            )}
            {stone.color && (
              <span className="spec-item">{stone.color.toUpperCase()}</span>
            )}
            {stone.clarity && (
              <span className="spec-item">{stone.clarity.toUpperCase()}</span>
            )}
          </div>
        </div>

        <div className="stone-price">${stone.price.toLocaleString()}</div>

        <button type="button" className="view-details-btn" onClick={onSelect}>
          View Details
        </button>
      </div>

      <style>{`
        .stone-card {
          background: white;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          overflow: hidden;
          transition: all 0.3s ease;
          cursor: pointer;
          position: relative;
        }

        .stone-card:hover {
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
          transform: translateY(-4px);
          border-color: #6D2932;
        }

        .comparison-checkbox {
          position: absolute;
          top: 0.75rem;
          left: 0.75rem;
          z-index: 10;
        }

        .comparison-checkbox input[type="checkbox"] {
          width: 20px;
          height: 20px;
          cursor: pointer;
        }

        .stone-image-container {
          position: relative;
          width: 100%;
          padding-top: 100%; /* Square aspect ratio */
          background: #f7f7f7;
          overflow: hidden;
        }

        .stone-image {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .stone-card:hover .stone-image {
          transform: scale(1.05);
        }

        .stone-image-placeholder {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .placeholder-icon {
          font-size: 4rem;
          opacity: 0.3;
        }

        .certificate-badge {
          position: absolute;
          bottom: 0.5rem;
          right: 0.5rem;
          background: #6D2932;
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .stone-info {
          padding: 1rem;
        }

        .shape-badge {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          background: #f7f7f7;
          border: 1px solid #e0e0e0;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 600;
          color: #666;
          text-transform: capitalize;
          margin-bottom: 0.75rem;
        }

        .stone-specs {
          margin-bottom: 0.75rem;
        }

        .carat-weight {
          font-size: 1.1rem;
          font-weight: 700;
          color: #333;
          margin-bottom: 0.5rem;
        }

        .quality-summary {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .spec-item {
          font-size: 0.85rem;
          color: #666;
          padding: 0.2rem 0.5rem;
          background: #f7f7f7;
          border-radius: 4px;
        }

        .stone-price {
          font-size: 1.25rem;
          font-weight: 700;
          color: #6D2932;
          margin: 0.75rem 0;
        }

        .view-details-btn {
          width: 100%;
          padding: 0.75rem;
          background: #000;
          color: white;
          border: none;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .view-details-btn:hover {
          background: #333;
        }
      `}</style>
    </div>
  );
});

/**
 * Format grade for display (capitalize first letter)
 */
function formatGrade(grade: string): string {
  return grade
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
