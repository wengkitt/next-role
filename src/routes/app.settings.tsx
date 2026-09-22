import { createFileRoute, getRouteApi } from '@tanstack/react-router'
import { Monitor, UserRound } from 'lucide-react'
import { ThemeSelector } from '#/components/ThemeSelector'

export const Route = createFileRoute('/app/settings')({
  component: SettingsPage,
})
const appRoute = getRouteApi('/app')

function SettingsPage() {
  const { session } = appRoute.useRouteContext()
  return (
    <main className="mx-auto max-w-4xl px-5 py-8 sm:px-8 lg:py-12">
      <p className="mb-2 text-[10px] font-semibold tracking-[.18em] uppercase text-base-content/45">
        Make yourself at home
      </p>
      <h1 className="text-3xl font-medium tracking-tight sm:text-4xl">
        Settings<span className="text-base-content/35">.</span>
      </h1>
      <p className="mt-3 text-sm text-base-content/60">
        Your account and a workspace that feels like you.
      </p>
      <section className="card mt-9 border border-base-300 bg-base-100">
        <div className="card-body p-6 sm:p-8">
          <h2 className="flex items-center gap-3 text-base font-semibold">
            <UserRound size={19} strokeWidth={1.5} aria-hidden="true" /> Account
            details
          </h2>
          <p className="text-xs text-base-content/50">
            The details connected to your NextRole account.
          </p>
          <dl className="mt-5 divide-y divide-base-300">
            <div className="grid gap-2 py-5 sm:grid-cols-[160px_1fr]">
              <dt className="text-sm text-base-content/55">Full name</dt>
              <dd className="text-sm font-medium">{session.user.name}</dd>
            </div>
            <div className="grid gap-2 py-5 sm:grid-cols-[160px_1fr]">
              <dt className="text-sm text-base-content/55">Email address</dt>
              <dd className="break-all text-sm font-medium">
                {session.user.email}
              </dd>
            </div>
          </dl>
        </div>
      </section>
      <section className="card mt-5 border border-base-300 bg-base-100">
        <div className="card-body p-6 sm:p-8">
          <h2 className="flex items-center gap-3 text-base font-semibold">
            <Monitor size={19} strokeWidth={1.5} aria-hidden="true" />{' '}
            Appearance
          </h2>
          <div className="mt-4 flex items-center justify-between gap-6">
            <div>
              <h3 className="text-sm font-medium">Color theme</h3>
              <p className="mt-1 text-xs leading-6 text-base-content/55">
                Choose the look you like. Saved on this device.
              </p>
            </div>
            <ThemeSelector />
          </div>
        </div>
      </section>
    </main>
  )
}
