import { ResumeEditor } from '#/components/resumes/ResumeEditor'
import { getResumeEditorData } from '#/data/resumes'
import { createFileRoute, Link, useRouter } from '@tanstack/react-router'

export const Route = createFileRoute('/app/resumes/$resumeId/edit')({
  loader: ({ params }) =>
    getResumeEditorData({ data: { resumeId: params.resumeId } }),
  pendingComponent: EditorLoading,
  errorComponent: EditorError,
  component: EditorPage,
})

function EditorPage() {
  const data = Route.useLoaderData()
  if (!data) return <ResumeNotFound />
  return <ResumeEditor {...data} />
}

function EditorLoading() {
  return (
    <main className="p-6">
      <div className="skeleton h-10 w-80" />
      <div className="mt-8 grid gap-5 xl:grid-cols-3">
        <div className="skeleton h-72" />
        <div className="skeleton h-[520px]" />
        <div className="skeleton h-[620px]" />
      </div>
    </main>
  )
}
function EditorError() {
  const router = useRouter()
  return (
    <main className="grid min-h-96 place-items-center p-6">
      <section className="card w-full max-w-md border border-base-300 bg-base-100">
        <div className="card-body">
          <h2 className="card-title">We couldn’t load this resume</h2>
          <p className="text-base-content/70">Please try again in a moment.</p>
          <button className="btn mt-2" onClick={() => void router.invalidate()}>
            Try again
          </button>
        </div>
      </section>
    </main>
  )
}
function ResumeNotFound() {
  return (
    <main className="grid min-h-96 place-items-center p-6">
      <section className="card w-full max-w-md border border-base-300 bg-base-100">
        <div className="card-body">
          <h2 className="card-title">Resume not found</h2>
          <p className="text-base-content/70">
            The resume may have been deleted or you may not have permission to
            access it.
          </p>
          <Link to="/app/dashboard" className="btn mt-2">
            Back to Dashboard
          </Link>
        </div>
      </section>
    </main>
  )
}
