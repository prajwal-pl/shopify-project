import { useEffect, useState } from "react";

export interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  duration?: number;
  onClose?: () => void;
}

export function Toast({ message, type = "success", duration = 4000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  const bgColor = {
    success: "#10b981",
    error: "#ef4444",
    info: "#3b82f6",
  }[type];

  const icon = {
    success: "✓",
    error: "✕",
    info: "ⓘ",
  }[type];

  return (
    <>
      <div className="toast-container">
        <div className="toast-content">
          <div className="toast-icon">{icon}</div>
          <p className="toast-message">{message}</p>
          <button
            className="toast-close"
            onClick={() => {
              setIsVisible(false);
              onClose?.();
            }}
          >
            ×
          </button>
        </div>
      </div>

      <style>{`
        .toast-container {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 9999;
          animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .toast-content {
          display: flex;
          align-items: center;
          gap: 12px;
          background: ${bgColor};
          color: white;
          padding: 16px 20px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          min-width: 300px;
          max-width: 500px;
        }

        .toast-icon {
          font-size: 20px;
          font-weight: bold;
          flex-shrink: 0;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
        }

        .toast-message {
          flex: 1;
          margin: 0;
          font-size: 14px;
          font-weight: 500;
          line-height: 1.4;
        }

        .toast-close {
          background: none;
          border: none;
          color: white;
          font-size: 24px;
          line-height: 1;
          cursor: pointer;
          padding: 0;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0.8;
          transition: opacity 0.2s;
          flex-shrink: 0;
        }

        .toast-close:hover {
          opacity: 1;
        }

        @media (max-width: 768px) {
          .toast-container {
            left: 20px;
            right: 20px;
            top: 20px;
          }

          .toast-content {
            min-width: auto;
            max-width: 100%;
          }
        }
      `}</style>
    </>
  );
}
