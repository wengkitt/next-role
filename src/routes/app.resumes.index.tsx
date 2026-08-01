import {
  CreateResumeButton,
  DashboardError,
  DashboardLoading,
  ResumeEmptyState,
  ResumeGrid,
} from '#/components/dashboard/DashboardStates'
import { getResumeSummaries } from '#/data/resumes'
import { createFileRoute, useRouter } from '@tanstack/react-router'

export const Route = createFileRoute('/app/resumes/')({
  loader: async () => ({ resumes: await getResumeSummaries() }),
  pendingComponent: DashboardLoading,
  errorComponent: ResumesError,
  component: ResumesPage,
})

function ResumesPage() {
  const { resumes } = Route.useLoaderData()
  return (
    <main className="mx-auto w-full max-w-6xl space-y-6 p-4 sm:p-6 lg:p-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Your Resumes</h2>
          <p className="mt-2 text-base-content/70">
            Open a resume to continue editing, or start a new one.
          </p>
        </div>
        <CreateResumeButton className="shrink-0" />
      </header>
      {resumes.length ? <ResumeGrid resumes={resumes} /> : <ResumeEmptyState />}
    </main>
  )
}

function ResumesError() {
  const router = useRouter()
  return <DashboardError onRetry={() => void router.invalidate()} />
}
