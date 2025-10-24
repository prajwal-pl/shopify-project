import { useState, useCallback } from "react";
import type { ToastProps } from "./Toast";

export function useToast() {
  const [toasts, setToasts] = useState<Array<ToastProps & { id: string }>>([]);

  const showToast = useCallback((toast: Omit<ToastProps, "onClose">) => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { ...toast, id, onClose: () => removeToast(id) }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, showToast, removeToast };
}
