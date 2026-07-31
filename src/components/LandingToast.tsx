import { CheckCircle2, XCircle } from 'lucide-react'
import { useEffect, useState } from 'react'

type Toast = { message: string; type: 'success' | 'error' }
const toastStorageKey = 'nextrole-landing-toast'

export function saveLandingToast(toast: Toast) {
  window.sessionStorage.setItem(toastStorageKey, JSON.stringify(toast))
}

export function LandingToast() {
  const [toast, setToast] = useState<Toast | null>(null)
  useEffect(() => {
    const savedToast = window.sessionStorage.getItem(toastStorageKey)
    if (!savedToast) return
    window.sessionStorage.removeItem(toastStorageKey)
    try {
      setToast(JSON.parse(savedToast) as Toast)
    } catch {
      /* Ignore malformed browser storage. */
    }
  }, [])
  useEffect(() => {
    if (!toast) return
    const timeout = window.setTimeout(() => setToast(null), 5000)
    return () => window.clearTimeout(timeout)
  }, [toast])
  if (!toast) return null
  const isSuccess = toast.type === 'success'
  return (
    <div
      className="toast toast-end toast-top z-50"
      role="status"
      aria-live="polite"
    >
      <div
        className={`alert shadow-lg ${isSuccess ? 'alert-success' : 'alert-error'}`}
      >
        {isSuccess ? (
          <CheckCircle2 aria-hidden="true" />
        ) : (
          <XCircle aria-hidden="true" />
        )}
        <span>{toast.message}</span>
        <button
          className="btn btn-ghost btn-xs"
          onClick={() => setToast(null)}
          aria-label="Dismiss notification"
        >
          Dismiss
        </button>
      </div>
    </div>
  )
}
