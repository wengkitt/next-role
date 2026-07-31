import { authClient } from '#/auth/client'
import { saveLandingToast } from '#/components/LandingToast'
import { LogOut } from 'lucide-react'
import { useEffect, useState } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/app')({ component: AppPage })

function AppPage() {
  const navigate = useNavigate({ from: Route.fullPath })
  const { data: session, isPending } = authClient.useSession()
  const [isSigningOut, setIsSigningOut] = useState(false)
  useEffect(() => {
    if (!isPending && !session) navigate({ to: '/sign-in', replace: true })
  }, [isPending, navigate, session])
  async function handleSignOut() {
    setIsSigningOut(true)
    const { error } = await authClient.signOut()
    setIsSigningOut(false)
    if (error) {
      saveLandingToast({
        message:
          error.message ?? 'We could not sign you out. Please try again.',
        type: 'error',
      })
      navigate({ to: '/', replace: true })
      return
    }
    saveLandingToast({ message: 'You have been signed out.', type: 'success' })
    navigate({ to: '/', replace: true })
  }
  if (isPending || !session)
    return (
      <main className="grid min-h-screen place-items-center bg-base-200">
        <span
          className="loading loading-spinner loading-lg text-primary"
          aria-label="Loading your session"
        />
      </main>
    )
  return (
    <main className="grid min-h-screen place-items-center bg-base-200 p-4">
      <section className="card w-full max-w-lg border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body items-start">
          <div className="badge badge-soft badge-success">Signed in</div>
          <h1 className="card-title mt-2 text-3xl">
            Welcome, {session.user.name}
          </h1>
          <p className="text-base-content/70">
            This empty page confirms that Better Auth has created and restored
            your session.
          </p>
          <div className="card-actions mt-6 w-full justify-between">
            <Link to="/" className="btn btn-ghost">
              Back to home
            </Link>
            <button
              className="btn btn-outline"
              onClick={handleSignOut}
              disabled={isSigningOut}
            >
              {isSigningOut ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                <>
                  <LogOut size={17} aria-hidden="true" />
                  Sign out
                </>
              )}
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}
