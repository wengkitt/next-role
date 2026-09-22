import { useMemo, useState } from 'react'
import { ArrowUpRight, Files, Search, X } from 'lucide-react'
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
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('updated')
  const visible = useMemo(
    () =>
      resumes
        .filter((resume) =>
          resume.title.toLowerCase().includes(query.toLowerCase().trim()),
        )
        .sort((a, b) =>
          sort === 'name'
            ? a.title.localeCompare(b.title)
            : new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
        ),
    [resumes, query, sort],
  )
  return (
    <main className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 lg:px-12 lg:py-11">
      <header className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="mb-2 text-[10px] font-semibold tracking-[.18em] text-base-content/45 uppercase">
            Make your next move
          </p>
          <h1 className="text-3xl font-medium tracking-[-.035em] sm:text-4xl">
            My resumes<span className="text-base-content/35">.</span>
          </h1>
          <p className="mt-3 text-sm text-base-content/60">
            Your experience, ready for every opportunity.
          </p>
        </div>
        {resumes.length > 0 && (
          <CreateResumeButton className="self-start sm:self-auto" />
        )}
      </header>
      <section className="relative mt-9 flex items-center justify-between gap-6 overflow-hidden rounded-2xl border border-base-300 bg-secondary px-6 py-7 text-secondary-content sm:px-8">
        <div className="relative z-10">
          <p className="text-[10px] font-semibold tracking-[.15em] uppercase opacity-55">
            Your next chapter
          </p>
          <h2 className="mt-2 text-xl font-medium tracking-tight">
            A good resume opens a conversation.
          </h2>
          <p className="mt-2 max-w-lg text-xs leading-6 opacity-65">
            Start with what you’ve done. Shape it around where you want to go.
          </p>
        </div>
        <ArrowUpRight
          size={88}
          strokeWidth={0.7}
          className="shrink-0 opacity-25 max-sm:absolute max-sm:-right-4"
          aria-hidden="true"
        />
      </section>
      <div className="mt-10 mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h2 className="flex items-center gap-2.5 text-sm font-semibold">
          <Files
            size={17}
            className="text-base-content/50"
            aria-hidden="true"
          />{' '}
          All resumes{' '}
          <span className="badge badge-sm border-0 bg-base-300/60 text-base-content/60">
            {resumes.length}
          </span>
        </h2>
        {resumes.length > 0 && (
          <div className="flex gap-3">
            <label className="input input-sm h-10 min-w-0 flex-1 sm:w-56">
              <Search
                size={15}
                className="shrink-0 text-base-content/40"
                aria-hidden="true"
              />
              <input
                aria-label="Search resumes"
                placeholder="Search resumes…"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </label>
            <select
              className="select select-sm h-10 w-36 bg-base-100"
              aria-label="Sort resumes"
              value={sort}
              onChange={(event) => setSort(event.target.value)}
            >
              <option value="updated">Last updated</option>
              <option value="name">Name A–Z</option>
            </select>
          </div>
        )}
      </div>
      {resumes.length === 0 ? (
        <ResumeEmptyState />
      ) : visible.length > 0 ? (
        <ResumeGrid resumes={visible} />
      ) : (
        <section className="rounded-2xl border border-dashed border-base-300 py-16 text-center">
          <Search
            size={24}
            className="mx-auto mb-4 text-base-content/40"
            aria-hidden="true"
          />
          <h3 className="font-medium">No matching resumes</h3>
          <p className="mt-2 text-sm text-base-content/55">
            Try another name or clear your search.
          </p>
          <button
            className="btn btn-sm mt-5"
            type="button"
            onClick={() => setQuery('')}
          >
            Clear search
          </button>
        </section>
      )}
      <p className="mt-10 text-center text-[11px] text-base-content/40">
        Small steps. New possibilities.
      </p>
    </main>
  )
}

function ResumesError() {
  const router = useRouter()
  return <DashboardError onRetry={() => void router.invalidate()} />
}
