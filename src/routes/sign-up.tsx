import { authClient } from '#/auth/client'
import { AuthShell } from '#/components/AuthShell'
import { ArrowRight, LockKeyhole, Mail, UserRound } from 'lucide-react'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/sign-up')({ component: SignUpPage })

function SignUpPage() {
  const navigate = useNavigate({ from: Route.fullPath })
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const password = String(formData.get('password'))
    if (password !== String(formData.get('confirmPassword'))) {
      setError('Your passwords do not match.')
      return
    }
    setError(null)
    setIsSubmitting(true)
    const { error: signUpError } = await authClient.signUp.email({
      name: String(formData.get('name')),
      email: String(formData.get('email')),
      password,
    })
    setIsSubmitting(false)
    if (signUpError) {
      setError(
        signUpError.message ??
          'We could not create your account. Please try again.',
      )
      return
    }
    navigate({ to: '/app' })
  }
  return (
    <AuthShell>
      <div className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body p-6 sm:p-8">
          <h1 className="card-title text-3xl">Create your account</h1>
          <p className="text-base-content/70">
            Start building a resume for your next role today.
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
              <legend className="fieldset-legend">Full name</legend>
              <label className="input w-full">
                <UserRound size={17} aria-hidden="true" />
                <input
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Maya Chen"
                  required
                />
              </label>
            </fieldset>
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
                  autoComplete="new-password"
                  placeholder="At least 8 characters"
                  minLength={8}
                  required
                />
              </label>
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Confirm password</legend>
              <label className="input w-full">
                <LockKeyhole size={17} aria-hidden="true" />
                <input
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Repeat your password"
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
                  Create account <ArrowRight size={17} aria-hidden="true" />
                </>
              )}
            </button>
          </form>
          <p className="mt-5 text-center text-sm text-base-content/70">
            Already have an account?{' '}
            <Link to="/sign-in" className="link link-primary font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </AuthShell>
  )
}
