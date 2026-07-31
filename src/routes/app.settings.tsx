import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/settings')({
  component: SettingsPage,
})

function SettingsPage() {
  return (
    <main className="mx-auto w-full max-w-6xl p-4 sm:p-6 lg:p-8">
      <section className="card border border-base-300 bg-base-100">
        <div className="card-body">
          <h2 className="card-title">Settings</h2>
          <p className="text-base-content/70">
            Account settings will appear here.
          </p>
        </div>
      </section>
    </main>
  )
}
