import { CheckCircle2, Info, XCircle } from 'lucide-react'
import { useEffect, useState } from 'react'

type Toast = { message: string; type: 'success' | 'error' | 'info' }
const toastStorageKey = 'nextrole-landing-toast'
const toastEventName = 'nextrole-toast'

export function saveLandingToast(toast: Toast) {
  window.sessionStorage.setItem(toastStorageKey, JSON.stringify(toast))
  window.dispatchEvent(
    new CustomEvent<Toast>(toastEventName, { detail: toast }),
  )
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
    const handleToast = (event: Event) =>
      setToast((event as CustomEvent<Toast>).detail)
    window.addEventListener(toastEventName, handleToast)
    return () => window.removeEventListener(toastEventName, handleToast)
  }, [])
  useEffect(() => {
    if (!toast) return
    const timeout = window.setTimeout(() => setToast(null), 5000)
    return () => window.clearTimeout(timeout)
  }, [toast])
  if (!toast) return null
  const alertClass =
    toast.type === 'success'
      ? 'alert-success'
      : toast.type === 'info'
        ? 'alert-info'
        : 'alert-error'
  return (
    <div
      className="toast toast-end toast-top z-50"
      role="status"
      aria-live="polite"
    >
      <div className={`alert shadow-lg ${alertClass}`}>
        {toast.type === 'success' ? (
          <CheckCircle2 aria-hidden="true" />
        ) : toast.type === 'info' ? (
          <Info aria-hidden="true" />
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
