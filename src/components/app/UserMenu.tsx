import { authClient } from '#/auth/client'
import { saveLandingToast } from '#/components/LandingToast'
import { LogOut } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'

type UserMenuProps = {
  name: string
  email: string
  image?: string | null
}

const initialsFor = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase() || 'U'

export function UserMenu({ name, email, image }: UserMenuProps) {
  const navigate = useNavigate()
  const [isSigningOut, setIsSigningOut] = useState(false)

  async function handleSignOut() {
    setIsSigningOut(true)
    const { error } = await authClient.signOut()
    if (error) {
      setIsSigningOut(false)
      saveLandingToast({
        message:
          error.message ?? 'We could not sign you out. Please try again.',
        type: 'error',
      })
      return
    }

    saveLandingToast({ message: 'You have been signed out.', type: 'success' })
    navigate({ to: '/sign-in', replace: true })
  }

  return (
    <div className="flex min-w-0 items-center gap-2 px-2 py-2">
      <div className="avatar avatar-placeholder">
        <div className="size-8 rounded-full bg-neutral text-xs text-neutral-content">
          {image ? (
            <img src={image} alt="" />
          ) : (
            <span>{initialsFor(name)}</span>
          )}
        </div>
      </div>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium">{name}</span>
        <span className="block truncate text-xs text-base-content/60">
          {email}
        </span>
      </span>
      <button
        className="btn btn-ghost btn-sm btn-square shrink-0"
        type="button"
        onClick={handleSignOut}
        disabled={isSigningOut}
        aria-label="Sign out"
        title="Sign out"
      >
        {isSigningOut ? (
          <span
            className="loading loading-spinner loading-sm"
            aria-label="Signing out"
          />
        ) : (
          <LogOut size={17} aria-hidden="true" />
        )}
      </button>
    </div>
  )
}
