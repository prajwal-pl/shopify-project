/**
 * Comparison Floating Button Component
 *
 * Phase 2.0: Floating action button for comparison feature.
 *
 * Features:
 * - Fixed position (bottom-right)
 * - Shows count: "Compare Items (3)"
 * - Only visible when 2+ diamonds selected
 * - Animated entrance/exit
 * - Mobile-optimized position
 */

interface ComparisonFloatingButtonProps {
  count: number;
  onClick: () => void;
  maxCount?: number;
}

export function ComparisonFloatingButton({
  count,
  onClick,
  maxCount = 4,
}: ComparisonFloatingButtonProps) {
  if (count < 2) return null;

  return (
    <button
      type="button"
      className="comparison-floating-button"
      onClick={onClick}
      aria-label={`Compare ${count} diamonds`}
    >
      <span className="compare-icon">⚖️</span>
      <span className="compare-text">
        Compare Items ({count}/{maxCount})
      </span>

      <style>{`
        .comparison-floating-button {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          padding: 1rem 1.5rem;
          background: #6D2932;
          color: white;
          border: none;
          border-radius: 50px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 8px 24px rgba(109, 41, 50, 0.4);
          display: flex;
          align-items: center;
          gap: 0.75rem;
          z-index: 100;
          animation: slideIn 0.3s ease;
          transition: all 0.2s;
        }

        .comparison-floating-button:hover {
          background: #5a1f28;
          box-shadow: 0 12px 32px rgba(109, 41, 50, 0.5);
          transform: translateY(-2px);
        }

        .comparison-floating-button:active {
          transform: translateY(0);
        }

        .compare-icon {
          font-size: 1.5rem;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(100px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Mobile positioning */
        @media (max-width: 640px) {
          .comparison-floating-button {
            bottom: 1rem;
            right: 1rem;
            left: 1rem;
            justify-content: center;
            border-radius: 12px;
          }
        }

        /* Tablet */
        @media (min-width: 641px) and (max-width: 1023px) {
          .comparison-floating-button {
            bottom: 1.5rem;
            right: 1.5rem;
          }
        }
      `}</style>
    </button>
  );
}
