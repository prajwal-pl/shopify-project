/**
 * Step Navigation Component
 *
 * Progress indicator showing current step and allowing navigation.
 */

import React from "react";
import { useBuilder } from "./BuilderProvider";

const STEPS = [
  { number: 1, label: "Choose Your", sublabel: "Setting", icon: "💍" },
  { number: 2, label: "Choose Your", sublabel: "Diamond", icon: "💎" },
  { number: 3, label: "Review", sublabel: "Complete Ring", icon: "✓" },
] as const;

export function StepNavigation() {
  const { currentStep, goToStep, selectedSetting, selectedStone, ringSize } =
    useBuilder();

  const canNavigateToStep = (step: number) => {
    if (step === 1) return true;
    if (step === 2) return true;
    if (step === 3) return true;
    return false;
  };

  return (
    <div className="step-navigation">
      {STEPS.map((step) => {
        const isActive = currentStep === step.number;
        const isCompleted = (step.number === 1 && currentStep > 1) ||
          (step.number === 2 && currentStep === 3);
        const canNavigate = canNavigateToStep(step.number);

        return (
          <div
            key={step.number}
            className={`chevron-step ${isActive ? "active" : ""} ${isCompleted ? "completed" : ""} ${canNavigate ? "clickable" : ""}`}
            onClick={() => canNavigate && goToStep(step.number as any)}
          >
            <div className="chevron-content">
              <div className="chevron-label">{step.label}</div>
              <div className="chevron-sublabel">{step.sublabel}</div>
            </div>
            <div className="chevron-icon">{step.icon}</div>
          </div>
        );
      })}

      <style>{`
        .step-navigation {
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 40px;
          max-width: 1200px;
          gap: 0;
        }

        .chevron-step {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 40px;
          position: relative;
          background: #f5f5f5;
          border: 2px solid #e0e0e0;
          transition: all 0.3s ease;
          clip-path: polygon(0 0, calc(100% - 25px) 0, 100% 50%, calc(100% - 25px) 100%, 0 100%, 25px 50%);
          margin-left: -15px;
          min-height: 80px;
        }

        .chevron-step:first-child {
          clip-path: polygon(0 0, calc(100% - 25px) 0, 100% 50%, calc(100% - 25px) 100%, 0 100%);
          margin-left: 0;
          padding-left: 30px;
        }

        .chevron-step:last-child {
          clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%, 25px 50%);
          padding-right: 30px;
        }

        .chevron-step.clickable {
          cursor: pointer;
        }

        .chevron-step.clickable:hover {
          background: #e8e8e8;
          transform: translateY(-2px);
        }

        .chevron-step.active.clickable:hover {
          background: #63244a;
          transform: translateY(-2px);
        }

        .chevron-step.active {
          background: #7c2d5e;
          border-color: #7c2d5e;
          z-index: 2;
        }

        .chevron-step.active .chevron-label,
        .chevron-step.active .chevron-sublabel {
          color: white;
        }

        .chevron-step.active .chevron-icon {
          color: white;
        }

        .chevron-step.completed {
          background: #e8e8e8;
          border-color: #c0c0c0;
        }

        .chevron-step.completed .chevron-label,
        .chevron-step.completed .chevron-sublabel {
          color: #333;
          font-weight: 600;
        }

        .chevron-step.completed .chevron-icon {
          color: #333;
        }

        .chevron-content {
          flex: 1;
          text-align: left;
          z-index: 1;
        }

        .chevron-label {
          font-size: 14px;
          color: #666;
          margin-bottom: 4px;
          font-weight: 400;
        }

        .chevron-sublabel {
          font-size: 18px;
          font-weight: 600;
          color: #333;
          line-height: 1.2;
        }

        .chevron-icon {
          font-size: 28px;
          margin-left: 16px;
          z-index: 1;
          flex-shrink: 0;
        }

        @media (max-width: 968px) {
          .step-navigation {
            flex-direction: column;
            gap: 0;
          }

          .chevron-step {
            width: 100%;
            clip-path: polygon(0 0, 100% 0, 100% calc(100% - 15px), 50% 100%, 0 calc(100% - 15px));
            margin-left: 0;
            margin-top: -10px;
            padding: 20px 30px;
          }

          .chevron-step:first-child {
            clip-path: polygon(0 0, 100% 0, 100% calc(100% - 15px), 50% 100%, 0 calc(100% - 15px));
            margin-top: 0;
          }

          .chevron-step:last-child {
            clip-path: polygon(0 0, 50% 15px, 100% 0, 100% 100%, 0 100%);
          }
        }
      `}</style>
    </div>
  );
}
