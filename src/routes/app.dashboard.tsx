import {
  DashboardError,
  DashboardLoading,
  CreateResumeButton,
  ResumeEmptyState,
  ResumeGrid,
} from '#/components/dashboard/DashboardStates'
import { getResumeSummaries } from '#/data/resumes'
import { createFileRoute, useRouter } from '@tanstack/react-router'

export const Route = createFileRoute('/app/dashboard')({
  loader: async () => ({ resumes: await getResumeSummaries() }),
  pendingComponent: DashboardLoading,
  errorComponent: DashboardRouteError,
  component: DashboardPage,
})

function DashboardPage() {
  const { session } = Route.useRouteContext()
  const { resumes } = Route.useLoaderData()
  const firstName = session.user.name.trim().split(/\s+/)[0]

  return (
    <main className="mx-auto w-full max-w-6xl space-y-8 p-4 sm:p-6 lg:p-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            {firstName ? `Welcome back, ${firstName}` : 'Welcome back'}
          </h2>
          <p className="mt-2 text-base-content/70">
            Continue working on your resumes or create a new one.
          </p>
        </div>
        <CreateResumeButton className="shrink-0" />
      </header>

      <section aria-labelledby="your-resumes-heading">
        <h2 id="your-resumes-heading" className="mb-4 text-xl font-semibold">
          Your Resumes
        </h2>
        {resumes.length === 0 ? (
          <ResumeEmptyState />
        ) : (
          <ResumeGrid resumes={resumes} />
        )}
      </section>

      <section
        className="card border border-base-300 bg-base-100"
        aria-labelledby="recent-activity-heading"
      >
        <div className="card-body">
          <h2 id="recent-activity-heading" className="card-title text-xl">
            Recent Activity
          </h2>
          <p className="text-base-content/70">
            Your recent resume activity will appear here.
          </p>
        </div>
      </section>
    </main>
  )
}

function DashboardRouteError() {
  const router = useRouter()
  return <DashboardError onRetry={() => void router.invalidate()} />
}
