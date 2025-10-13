/**
 * Step 4: Review
 *
 * Review configuration and add to cart.
 * (Phase 5.0 - Complete Implementation)
 */

import { useBuilder } from "../BuilderProvider";
import { RingPreview } from "../RingPreview";
import { ConfigurationSummary } from "../ConfigurationSummary";
import { PriceBreakdown } from "../PriceBreakdown";
import { AddToCartButton } from "../AddToCartButton";
import type { BuilderStep } from "~/types/builder";

interface ReviewProps {
  shop: string;
}

export function Review({ shop }: ReviewProps) {
  const {
    selectedSetting,
    selectedMetalType,
    selectedStone,
    ringSize,
    sideStones,
    priceBreakdown,
    goToStep,
  } = useBuilder();

  // Validation - ensure all required selections are made
  const isComplete =
    selectedSetting && selectedMetalType && selectedStone && ringSize;

  if (!isComplete) {
    return (
      <div className="review-step">
        <div className="incomplete-state">
          <div className="icon">⚠️</div>
          <h2>Incomplete Configuration</h2>
          <p>
            Please complete all previous steps to review your ring
            configuration.
          </p>
          <button onClick={() => goToStep(1)} className="btn-primary">
            Go to Step 1
          </button>
        </div>
        <style>{`
          .review-step {
            padding: 24px;
            max-width: 900px;
            margin: 0 auto;
          }

          .incomplete-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 80px 20px;
            text-align: center;
          }

          .icon {
            font-size: 64px;
            margin-bottom: 16px;
          }

          .incomplete-state h2 {
            font-size: 24px;
            font-weight: 700;
            color: #111827;
            margin: 0 0 8px;
          }

          .incomplete-state p {
            font-size: 16px;
            color: #6b7280;
            margin: 0 0 24px;
          }

          .btn-primary {
            padding: 12px 24px;
            background: #d4af37;
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.2s;
          }

          .btn-primary:hover {
            background: #c29d2f;
          }
        `}</style>
      </div>
    );
  }

  const handleEdit = (step: BuilderStep) => {
    goToStep(step);
  };

  const handleBack = () => {
    goToStep(3);
  };

  const handleAddToCartSuccess = () => {
    // Reset or redirect will be handled by AddToCartButton
    console.log("Successfully added to cart");
  };

  const handleAddToCartError = (errorMessage: string) => {
    // Error will be displayed by AddToCartButton
    console.error("Cart error:", errorMessage);
  };

  return (
    <div className="review-step">
      <div className="step-header">
        <h2>Step 4: Review Your Ring</h2>
        <p className="step-description">
          Review your selections and add your custom ring to cart
        </p>
      </div>

      <div className="review-content">
        {/* Ring Preview */}
        <RingPreview
          setting={selectedSetting}
          stone={selectedStone}
          metalType={selectedMetalType}
        />

        {/* Configuration Summary */}
        <ConfigurationSummary
          setting={selectedSetting}
          stone={selectedStone}
          metalType={selectedMetalType}
          ringSize={ringSize}
          sideStones={sideStones}
          onEdit={handleEdit}
        />

        {/* Price Breakdown */}
        <PriceBreakdown breakdown={priceBreakdown} expanded={true} />

        {/* Add to Cart Section */}
        <div className="cart-section">
          <AddToCartButton
            shop={shop}
            onSuccess={handleAddToCartSuccess}
            onError={handleAddToCartError}
          />
          <p className="cart-note">🔒 Secure checkout powered by Shopify</p>
        </div>

        {/* Back Button */}
        <div className="navigation-buttons">
          <button onClick={handleBack} className="btn-secondary">
            ← Back to Customization
          </button>
        </div>
      </div>

      <style>{`
        .review-step {
          padding: 24px;
          max-width: 900px;
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

        .review-content {
          /* All child components have their own styling */
        }

        .cart-section {
          background: white;
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .cart-note {
          text-align: center;
          font-size: 14px;
          color: #6b7280;
          margin: 16px 0 0;
        }

        .navigation-buttons {
          display: flex;
          justify-content: center;
          padding-top: 24px;
          border-top: 1px solid #e5e7eb;
        }

        .btn-secondary {
          padding: 12px 32px;
          background: white;
          color: #374151;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-secondary:hover {
          background: #f9fafb;
        }

        /* Mobile responsive */
        @media (max-width: 768px) {
          .review-step {
            padding: 16px;
          }

          .step-header h2 {
            font-size: 24px;
          }

          .step-description {
            font-size: 14px;
          }

          .cart-section {
            padding: 20px;
          }

          .navigation-buttons {
            margin-top: 20px;
          }

          .btn-secondary {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
