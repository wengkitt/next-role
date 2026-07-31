import { formatValidationErrors, signUpSchema } from '#/auth/schemas'
import { authClient } from '#/auth/client'
import { AuthShell } from '#/components/AuthShell'
import { useForm } from '@tanstack/react-form'
import type { AnyFieldApi } from '@tanstack/react-form'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { ArrowRight, LockKeyhole, Mail, UserRound } from 'lucide-react'
import { useState } from 'react'
import type { ReactNode } from 'react'

export const Route = createFileRoute('/sign-up')({ component: SignUpPage })

function SignUpPage() {
  const navigate = useNavigate({ from: Route.fullPath })
  const [authError, setAuthError] = useState<string | null>(null)
  const form = useForm({
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
    validators: { onChange: signUpSchema },
    onSubmit: async ({ value }) => {
      setAuthError(null)
      const { error } = await authClient.signUp.email({
        name: value.name,
        email: value.email,
        password: value.password,
      })
      if (error) {
        setAuthError(
          error.message ??
            'We could not create your account. Please try again.',
        )
        return
      }
      navigate({ to: '/app' })
    },
  })

  return (
    <AuthShell>
      <div className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body p-6 sm:p-8">
          <h1 className="card-title text-3xl">Create your account</h1>
          <p className="text-base-content/70">
            Start building a resume for your next role today.
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
            <form.Field name="name">
              {(field) => (
                <TextField
                  field={field}
                  label="Full name"
                  icon={<UserRound size={17} aria-hidden="true" />}
                  type="text"
                  autoComplete="name"
                  placeholder="Maya Chen"
                  errorId="sign-up-name-error"
                />
              )}
            </form.Field>
            <form.Field name="email">
              {(field) => (
                <TextField
                  field={field}
                  label="Email address"
                  icon={<Mail size={17} aria-hidden="true" />}
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  errorId="sign-up-email-error"
                />
              )}
            </form.Field>
            <form.Field name="password">
              {(field) => (
                <TextField
                  field={field}
                  label="Password"
                  icon={<LockKeyhole size={17} aria-hidden="true" />}
                  type="password"
                  autoComplete="new-password"
                  placeholder="At least 8 characters"
                  errorId="sign-up-password-error"
                />
              )}
            </form.Field>
            <form.Field name="confirmPassword">
              {(field) => (
                <TextField
                  field={field}
                  label="Confirm password"
                  icon={<LockKeyhole size={17} aria-hidden="true" />}
                  type="password"
                  autoComplete="new-password"
                  placeholder="Repeat your password"
                  errorId="sign-up-confirm-password-error"
                />
              )}
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
                      Create account <ArrowRight size={17} aria-hidden="true" />
                    </>
                  )}
                </button>
              )}
            </form.Subscribe>
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

type TextFieldProps = {
  field: AnyFieldApi
  label: string
  icon: ReactNode
  type: 'email' | 'password' | 'text'
  autoComplete: string
  placeholder: string
  errorId: string
}

function TextField({
  field,
  label,
  icon,
  type,
  autoComplete,
  placeholder,
  errorId,
}: TextFieldProps) {
  const hasError = field.state.meta.isTouched && !field.state.meta.isValid
  return (
    <fieldset className="fieldset">
      <legend className="fieldset-legend">{label}</legend>
      <label className={`input w-full ${hasError ? 'input-error' : ''}`}>
        {icon}
        <input
          name={field.name}
          type={type}
          autoComplete={autoComplete}
          placeholder={placeholder}
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={(event) => field.handleChange(event.target.value)}
          aria-invalid={hasError}
          aria-describedby={hasError ? errorId : undefined}
        />
      </label>
      {hasError && (
        <p id={errorId} className="label text-error" role="alert">
          {formatValidationErrors(field.state.meta.errors)}
        </p>
      )}
    </fieldset>
  )
}
