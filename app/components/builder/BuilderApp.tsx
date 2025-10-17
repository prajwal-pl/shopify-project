/**
 * Builder App - Root Component
 *
 * Main ring builder application with step management.
 */

import React from "react";
import { BuilderProvider, useBuilder } from "./BuilderProvider";
import { StepNavigation } from "./StepNavigation";
import { PriceSummary } from "./PriceSummary";
import { SettingSelector } from "./steps/SettingSelector";
import { StoneSelector } from "./steps/StoneSelector";
import { Customization } from "./steps/Customization";
import { Review } from "./steps/Review";

interface BuilderAppProps {
  shop: string;
}

export function BuilderApp({ shop }: BuilderAppProps) {
  return (
    <BuilderProvider shop={shop}>
      <BuilderContent shop={shop} />
    </BuilderProvider>
  );
}

function BuilderContent({ shop }: { shop: string }) {
  const { currentStep } = useBuilder();

  return (
    <div className="ring-builder">
      <StepNavigation />

      <div className="builder-container">
        <div className="builder-main">
          {currentStep === 1 && <SettingSelector shop={shop} />}
          {(currentStep === 2 || currentStep === 3 || currentStep === 4) && <StoneSelector shop={shop} />}
          {currentStep === 3 && <Review shop={shop} />}
        </div>

        {(currentStep === 1 || currentStep === 2) && (
          <div className="builder-sidebar">
            <PriceSummary />
          </div>
        )}
      </div>

      <style>{`
        .ring-builder {
          max-width: 1400px;
          margin: 0 auto;
          padding: 20px;
          background: #f9f9f9;
        }

        .builder-container {
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 32px;
          margin-top: 24px;
        }

        .builder-main {
          min-height: 600px;
          background: white;
          border-radius: 8px;
          padding: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .builder-sidebar {
          position: sticky;
          top: 20px;
          height: fit-content;
        }

        @media (max-width: 1024px) {
          .builder-container {
            grid-template-columns: 1fr;
          }

          .builder-sidebar {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            top: auto;
            z-index: 100;
            box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1);
          }
        }

        @media (max-width: 768px) {
          .ring-builder {
            padding: 16px;
          }

          .builder-main {
            padding: 16px;
          }
        }
      `}</style>
    </div>
  );
}
