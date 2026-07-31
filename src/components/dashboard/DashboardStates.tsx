import { FilePlus2, FileText, Plus, RefreshCw } from 'lucide-react'

import { saveLandingToast } from '#/components/LandingToast'
import type { ResumeSummary } from '#/data/resumes'

import { ResumeCard } from './ResumeCard'
import { ResumeDialog } from '#/components/resumes/ResumeDialogs'
import { useNavigate, useRouter } from '@tanstack/react-router'
import { useRef, useState } from 'react'

type CreateResumeButtonProps = { className?: string }

export function CreateResumeButton({ className }: CreateResumeButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const navigate = useNavigate()
  const router = useRouter()
  function close() {
    setIsOpen(false)
    window.setTimeout(() => triggerRef.current?.focus(), 0)
  }
  return (
    <>
      <button
        ref={triggerRef}
        className={`btn btn-primary ${className ?? ''}`}
        type="button"
        onClick={() => setIsOpen(true)}
      >
        <Plus size={18} aria-hidden="true" />
        Create Resume
      </button>
      {isOpen && (
        <ResumeDialog
          mode="create"
          onClose={close}
          onSuccess={(resume) => {
            close()
            saveLandingToast({ message: 'Resume created.', type: 'success' })
            void router.invalidate()
            if (resume)
              void navigate({
                to: '/app/resumes/$resumeId/edit',
                params: { resumeId: resume.id },
              })
          }}
        />
      )}
    </>
  )
}

export function ResumeGrid({ resumes }: { resumes: ResumeSummary[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {resumes.map((resume) => (
        <ResumeCard key={resume.id} resume={resume} />
      ))}
    </div>
  )
}

export function ResumeEmptyState() {
  return (
    <section className="card border border-dashed border-base-300 bg-base-100">
      <div className="card-body items-center py-12 text-center sm:py-16">
        <div className="grid size-14 place-items-center rounded-full bg-base-200 text-primary">
          <FilePlus2 size={28} aria-hidden="true" />
        </div>
        <h3 className="card-title mt-3 text-xl">Create your first resume</h3>
        <p className="max-w-lg text-base-content/70">
          Start building a professional resume that you can customize, export,
          and tailor for different job applications.
        </p>
        <CreateResumeButton className="mt-3" />
      </div>
    </section>
  )
}

export function DashboardLoading() {
  return (
    <main
      className="mx-auto w-full max-w-6xl space-y-8 p-4 sm:p-6 lg:p-8"
      aria-label="Loading dashboard"
    >
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div className="space-y-3">
          <div className="skeleton h-8 w-52" />
          <div className="skeleton h-4 w-80 max-w-full" />
        </div>
        <div className="skeleton h-11 w-40" />
      </div>
      <section className="space-y-4">
        <div className="skeleton h-7 w-36" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((index) => (
            <div className="card h-72 border border-base-300 p-5" key={index}>
              <div className="skeleton h-28 w-20" />
              <div className="mt-4 skeleton h-5 w-3/4" />
              <div className="mt-2 skeleton h-4 w-1/2" />
              <div className="mt-6 skeleton h-9 w-32" />
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}

export function DashboardError({ onRetry }: { onRetry: () => void }) {
  return (
    <main className="mx-auto grid min-h-96 w-full max-w-6xl place-items-center p-4 sm:p-6 lg:p-8">
      <section className="card w-full max-w-lg border border-base-300 bg-base-100 text-center">
        <div className="card-body items-center">
          <FileText
            size={32}
            className="text-base-content/60"
            aria-hidden="true"
          />
          <h2 className="card-title">We couldn’t load your resumes</h2>
          <p className="text-base-content/70">Please try again in a moment.</p>
          <button className="btn mt-2" type="button" onClick={onRetry}>
            <RefreshCw size={17} aria-hidden="true" />
            Try again
          </button>
        </div>
      </section>
    </main>
  )
}
