import React, { createContext, useContext, useState, useCallback } from 'react'
import { Toast } from '../components/Toast'

type ToastType = 'success' | 'error' | 'info'

interface ToastConfig {
  message: string
  type?: ToastType
  duration?: number
  position?: 'top' | 'bottom'
}

interface ToastContextType {
  showToast: (config: ToastConfig) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastConfig | null>(null)

  const showToast = useCallback((config: ToastConfig) => {
    setToast(config)
  }, [])

  const hideToast = useCallback(() => {
    setToast(null)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && <Toast {...toast} onHide={hideToast} />}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

// Example usage:
// const { showToast } = useToast()
// showToast({
//   message: 'Article saved successfully!',
//   type: 'success',
//   duration: 3000,
//   position: 'top'
// })
