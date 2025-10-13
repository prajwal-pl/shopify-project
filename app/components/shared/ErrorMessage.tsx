/**
 * Error Message Component
 *
 * Display error messages with optional retry button.
 */

import React from "react";

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
      <div className="error-icon">⚠️</div>
      <h3>Oops! Something went wrong</h3>
      <p className="error-text">{message}</p>

      <div className="error-actions">
        {onRetry && (
          <button onClick={onRetry} className="retry-button">
            Try Again
          </button>
        )}
        {onGoBack && (
          <button onClick={onGoBack} className="back-button">
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
          font-size: 48px;
          margin-bottom: 16px;
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
        }

        .retry-button {
          background: #2c6ecb;
          color: white;
        }

        .retry-button:hover {
          background: #1f5199;
        }

        .back-button {
          background: white;
          color: #202223;
          border: 1px solid #c9cccf;
        }

        .back-button:hover {
          background: #f6f6f7;
        }
      `}</style>
    </div>
  );
}
