/**
 * Loading Spinner Component
 *
 * Reusable loading indicator.
 */

import React from "react";

interface LoadingSpinnerProps {
  text?: string;
  size?: "small" | "medium" | "large";
}

export function LoadingSpinner({ text, size = "medium" }: LoadingSpinnerProps) {
  const sizes = {
    small: "20px",
    medium: "40px",
    large: "60px",
  };

  return (
    <div className="loading-spinner-container">
      <div
        className="spinner"
        style={{ width: sizes[size], height: sizes[size] }}
      />
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
          border: 3px solid #f3f3f3;
          border-top: 3px solid #d4af37;
          border-radius: 50%;
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
