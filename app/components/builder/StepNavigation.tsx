/**
 * Step Navigation Component
 *
 * Progress indicator showing current step and allowing navigation.
 */

import React from "react";
import { useBuilder } from "./BuilderProvider";

const STEPS = [
  { number: 1, label: "Choose Setting", icon: "⚙️" },
  { number: 2, label: "Select Stone", icon: "💎" },
  { number: 3, label: "Customize", icon: "✨" },
  { number: 4, label: "Review", icon: "✓" },
] as const;

export function StepNavigation() {
  const { currentStep, goToStep, selectedSetting, selectedStone, ringSize } =
    useBuilder();

  const canNavigateToStep = (step: number) => {
    if (step === 1) return true;
    if (step === 2) return !!selectedSetting;
    if (step === 3) return !!selectedStone;
    if (step === 4) return !!ringSize;
    return false;
  };

  return (
    <div className="step-navigation">
      {STEPS.map((step, index) => {
        const isActive = currentStep === step.number;
        const isCompleted = currentStep > step.number;
        const canNavigate = canNavigateToStep(step.number);

        return (
          <React.Fragment key={step.number}>
            <div
              className={`step ${isActive ? "active" : ""} ${isCompleted ? "completed" : ""} ${canNavigate ? "clickable" : ""}`}
              onClick={() => canNavigate && goToStep(step.number as any)}
            >
              <div className="step-icon">{isCompleted ? "✓" : step.icon}</div>
              <div className="step-content">
                <div className="step-number">Step {step.number}</div>
                <div className="step-label">{step.label}</div>
              </div>
            </div>
            {index < STEPS.length - 1 && (
              <div
                className={`step-connector ${isCompleted ? "completed" : ""}`}
              />
            )}
          </React.Fragment>
        );
      })}

      <style>{`
        .step-navigation {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0;
          margin: 0 auto 40px;
          max-width: 900px;
        }

        .step {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 20px;
          background: white;
          border: 2px solid #e5e5e5;
          border-radius: 8px;
          transition: all 0.3s ease;
          flex: 1;
          min-width: 0;
        }

        .step.clickable {
          cursor: pointer;
        }

        .step.clickable:hover {
          border-color: #d4af37;
          box-shadow: 0 2px 8px rgba(212, 175, 55, 0.2);
        }

        .step.active {
          border-color: #d4af37;
          background: #fffbf0;
        }

        .step.completed {
          border-color: #10b981;
          background: #f0fdf4;
        }

        .step-icon {
          font-size: 24px;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f6f6f7;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .step.active .step-icon {
          background: #d4af37;
          color: white;
        }

        .step.completed .step-icon {
          background: #10b981;
          color: white;
        }

        .step-content {
          flex: 1;
          min-width: 0;
        }

        .step-number {
          font-size: 12px;
          color: #6d7175;
          margin-bottom: 2px;
        }

        .step-label {
          font-size: 14px;
          font-weight: 600;
          color: #202223;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .step-connector {
          width: 40px;
          height: 2px;
          background: #e5e5e5;
          flex-shrink: 0;
        }

        .step-connector.completed {
          background: #10b981;
        }

        @media (max-width: 768px) {
          .step-navigation {
            flex-direction: column;
            gap: 12px;
          }

          .step {
            width: 100%;
          }

          .step-connector {
            width: 2px;
            height: 30px;
          }

          .step-label {
            white-space: normal;
          }
        }
      `}</style>
    </div>
  );
}
