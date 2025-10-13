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
      <div className="builder-header">
        <h1>💍 Build Your Perfect Ring</h1>
        <p>Create a custom ring in 4 easy steps</p>
      </div>

      <StepNavigation />

      <div className="builder-container">
        <div className="builder-main">
          {currentStep === 1 && <SettingSelector shop={shop} />}
          {currentStep === 2 && <StoneSelector shop={shop} />}
          {currentStep === 3 && <Customization shop={shop} />}
          {currentStep === 4 && <Review shop={shop} />}
        </div>

        <div className="builder-sidebar">
          <PriceSummary />
        </div>
      </div>

      <style>{`
        .ring-builder {
          max-width: 1400px;
          margin: 0 auto;
          padding: 40px 20px;
        }

        .builder-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .builder-header h1 {
          font-size: 36px;
          font-weight: 700;
          margin: 0 0 12px;
          color: #1a1a1a;
        }

        .builder-header p {
          font-size: 18px;
          color: #6d7175;
          margin: 0;
        }

        .builder-container {
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 32px;
          margin-top: 32px;
        }

        .builder-main {
          min-height: 600px;
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
          .builder-header h1 {
            font-size: 28px;
          }

          .builder-header p {
            font-size: 16px;
          }

          .ring-builder {
            padding: 20px 16px;
          }
        }
      `}</style>
    </div>
  );
}
