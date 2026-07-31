import { authClient } from '#/auth/client'
import { AuthShell } from '#/components/AuthShell'
import { ArrowRight, LockKeyhole, Mail } from 'lucide-react'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/sign-in')({ component: SignInPage })

function SignInPage() {
  const navigate = useNavigate({ from: Route.fullPath })
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    setError(null)
    setIsSubmitting(true)
    const { error: signInError } = await authClient.signIn.email({
      email: String(formData.get('email')),
      password: String(formData.get('password')),
    })
    setIsSubmitting(false)
    if (signInError) {
      setError(
        signInError.message ?? 'We could not sign you in. Please try again.',
      )
      return
    }
    navigate({ to: '/app' })
  }
  return (
    <AuthShell>
      <div className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body p-6 sm:p-8">
          <h1 className="card-title text-3xl">Welcome back</h1>
          <p className="text-base-content/70">
            Sign in to continue building your next resume.
          </p>
          {error && (
            <div
              role="alert"
              className="alert alert-error alert-soft mt-3 text-sm"
            >
              {error}
            </div>
          )}
          <form className="mt-3 space-y-4" onSubmit={handleSubmit}>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Email address</legend>
              <label className="input w-full">
                <Mail size={17} aria-hidden="true" />
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  required
                />
              </label>
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Password</legend>
              <label className="input w-full">
                <LockKeyhole size={17} aria-hidden="true" />
                <input
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  minLength={8}
                  required
                />
              </label>
            </fieldset>
            <button
              className="btn btn-primary btn-block mt-3"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                <>
                  Sign in <ArrowRight size={17} aria-hidden="true" />
                </>
              )}
            </button>
          </form>
          <p className="mt-5 text-center text-sm text-base-content/70">
            New to NextRole?{' '}
            <Link to="/sign-up" className="link link-primary font-medium">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </AuthShell>
  )
}
