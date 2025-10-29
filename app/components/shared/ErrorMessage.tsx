/**
 * Error Message Component
 *
 * Display error messages with optional retry button.
 */

import React from "react";
import { AlertTriangle, RotateCcw, ArrowLeft } from "lucide-react";
import { Icon } from "~/components/ui/Icon";

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  onGoBack?: () => void;
}

export function ErrorMessage({
  message,
  onRetry,
  onGoBack,
}: ErrorMessageProps) {
  return (
    <div className="error-message-container">
      <div className="error-icon">
        <Icon icon={AlertTriangle} size="xxl" />
      </div>
      <h3>Oops! Something went wrong</h3>
      <p className="error-text">{message}</p>

      <div className="error-actions">
        {onRetry && (
          <button onClick={onRetry} className="retry-button">
            <Icon icon={RotateCcw} size="xs" />
            Try Again
          </button>
        )}
        {onGoBack && (
          <button onClick={onGoBack} className="back-button">
            <Icon icon={ArrowLeft} size="xs" />
            Go Back
          </button>
        )}
      </div>

      <style>{`
        .error-message-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          text-align: center;
        }

        .error-icon {
          margin-bottom: 16px;
          color: #f39c12;
          animation: errorShake 0.5s ease-in-out;
        }

        @keyframes errorShake {
          0%, 100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-10px);
          }
          75% {
            transform: translateX(10px);
          }
        }

        .error-message-container h3 {
          font-size: 20px;
          font-weight: 600;
          color: #202223;
          margin: 0 0 12px;
        }

        .error-text {
          font-size: 14px;
          color: #6d7175;
          margin: 0 0 24px;
          max-width: 400px;
        }

        .error-actions {
          display: flex;
          gap: 12px;
        }

        .retry-button,
        .back-button {
          padding: 10px 20px;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .retry-button {
          background: #2c6ecb;
          color: white;
        }

        .retry-button:hover {
          background: #1f5199;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(44, 110, 203, 0.3);
        }

        .back-button {
          background: white;
          color: #202223;
          border: 1px solid #c9cccf;
        }

        .back-button:hover {
          background: #f6f6f7;
          transform: translateY(-2px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
}
