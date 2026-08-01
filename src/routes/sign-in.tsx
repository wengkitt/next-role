import { formatValidationErrors, signInSchema } from '#/auth/schemas'
import { getAuthSession } from '#/auth/session'
import { authClient } from '#/auth/client'
import { AuthShell } from '#/components/AuthShell'
import { useForm } from '@tanstack/react-form'
import {
  createFileRoute,
  Link,
  redirect,
  useNavigate,
} from '@tanstack/react-router'
import { ArrowRight, LockKeyhole, Mail } from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute('/sign-in')({
  beforeLoad: async () => {
    if (await getAuthSession()) throw redirect({ to: '/app/resumes' })
  },
  component: SignInPage,
})

function SignInPage() {
  const navigate = useNavigate({ from: Route.fullPath })
  const [authError, setAuthError] = useState<string | null>(null)
  const form = useForm({
    defaultValues: { email: '', password: '' },
    validators: { onChange: signInSchema },
    onSubmit: async ({ value }) => {
      setAuthError(null)
      const { error } = await authClient.signIn.email(value)
      if (error) {
        setAuthError(
          error.message ?? 'We could not sign you in. Please try again.',
        )
        return
      }
      navigate({ to: '/app/resumes' })
    },
  })

  return (
    <AuthShell>
      <div className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body p-6 sm:p-8">
          <h1 className="card-title text-3xl">Welcome back</h1>
          <p className="text-base-content/70">
            Sign in to continue building your next resume.
          </p>
          {authError && (
            <div
              role="alert"
              className="alert alert-error alert-soft mt-3 text-sm"
            >
              {authError}
            </div>
          )}
          <form
            className="mt-3 space-y-4"
            onSubmit={(event) => {
              event.preventDefault()
              void form.handleSubmit()
            }}
          >
            <form.Field name="email">
              {(field) => {
                const hasError =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <fieldset className="fieldset">
                    <legend className="fieldset-legend">Email address</legend>
                    <label
                      className={`input w-full ${hasError ? 'input-error' : ''}`}
                    >
                      <Mail size={17} aria-hidden="true" />
                      <input
                        name={field.name}
                        type="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(event) =>
                          field.handleChange(event.target.value)
                        }
                        aria-invalid={hasError}
                        aria-describedby={
                          hasError ? 'sign-in-email-error' : undefined
                        }
                      />
                    </label>
                    {hasError && (
                      <p
                        id="sign-in-email-error"
                        className="label text-error"
                        role="alert"
                      >
                        {formatValidationErrors(field.state.meta.errors)}
                      </p>
                    )}
                  </fieldset>
                )
              }}
            </form.Field>
            <form.Field name="password">
              {(field) => {
                const hasError =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <fieldset className="fieldset">
                    <legend className="fieldset-legend">Password</legend>
                    <label
                      className={`input w-full ${hasError ? 'input-error' : ''}`}
                    >
                      <LockKeyhole size={17} aria-hidden="true" />
                      <input
                        name={field.name}
                        type="password"
                        autoComplete="current-password"
                        placeholder="Enter your password"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(event) =>
                          field.handleChange(event.target.value)
                        }
                        aria-invalid={hasError}
                        aria-describedby={
                          hasError ? 'sign-in-password-error' : undefined
                        }
                      />
                    </label>
                    {hasError && (
                      <p
                        id="sign-in-password-error"
                        className="label text-error"
                        role="alert"
                      >
                        {formatValidationErrors(field.state.meta.errors)}
                      </p>
                    )}
                  </fieldset>
                )
              }}
            </form.Field>
            <form.Subscribe selector={(state) => state.isSubmitting}>
              {(isSubmitting) => (
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
              )}
            </form.Subscribe>
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
