/**
 * Loading Spinner Component
 *
 * Reusable loading indicator with lucide-react Loader2 icon.
 */

import React from "react";
import { Loader2 } from "lucide-react";
import { Icon } from "~/components/ui/Icon";

interface LoadingSpinnerProps {
  text?: string;
  size?: "small" | "medium" | "large";
  fullScreen?: boolean;
}

export function LoadingSpinner({ text, size = "medium", fullScreen = false }: LoadingSpinnerProps) {
  const iconSizes = {
    small: "sm" as const,
    medium: "xl" as const,
    large: "xxl" as const,
  };

  if (fullScreen) {
    return (
      <div className="loading-spinner-fullscreen">
        <div className="loading-spinner-container">
          <Icon icon={Loader2} size={iconSizes[size]} className="spinner" />
          {text && <p className="loading-text">{text}</p>}
        </div>

        <style>{`
          .loading-spinner-fullscreen {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(255, 255, 255, 0.95);
            z-index: 9999;
            animation: fadeIn 0.2s ease-in;
          }

          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          .loading-spinner-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 40px 20px;
          }

          .spinner {
            color: #d4af37;
            animation: spin 1s linear infinite;
          }

          .loading-text {
            margin-top: 16px;
            font-size: 14px;
            color: #6d7175;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="loading-spinner-container">
      <Icon icon={Loader2} size={iconSizes[size]} className="spinner" />
      {text && <p className="loading-text">{text}</p>}

      <style>{`
        .loading-spinner-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
        }

        .spinner {
          color: #d4af37;
          animation: spin 1s linear infinite;
        }

        .loading-text {
          margin-top: 16px;
          font-size: 14px;
          color: #6d7175;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
