import { Toaster, toast as sonnerToast } from "sonner"
import React, { createContext, useContext } from "react"

// Define ToastOptions type here since it's not exported from "sonner"
type ToastOptions = {
  className?: string;
  closeButton?: boolean;
  descriptionClassName?: string;
  style?: React.CSSProperties;
  cancelButtonStyle?: React.CSSProperties;
  actionButtonStyle?: React.CSSProperties;
  duration?: number;
  unstyled?: boolean;
  classNames?: Record<string, string>;
  closeButtonAriaLabel?: string;
};

interface ToastContextType {
  show: (message: string, options?: ToastOptions) => void
  success: (message: string, options?: ToastOptions) => void
  error: (message: string, options?: ToastOptions) => void
  info: (message: string, options?: ToastOptions) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const show = (message: string, options?: ToastOptions) => sonnerToast(message, options)
  const success = (message: string, options?: ToastOptions) => sonnerToast.success(message, options)
  const error = (message: string, options?: ToastOptions) => sonnerToast.error(message, options)
  const info = (message: string, options?: ToastOptions) => sonnerToast.info(message, options)

  return (
    <ToastContext.Provider value={{ show, success, error, info }}>
      {children}
      <Toaster richColors position="top-center" />
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error("useToast must be used within a ToastProvider")
  return ctx
} 