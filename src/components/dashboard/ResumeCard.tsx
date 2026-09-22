import {
  ArrowUpRight,
  MoreHorizontal,
  Pencil,
  Copy,
  Trash2,
} from 'lucide-react'

import { saveLandingToast } from '#/components/LandingToast'
import { duplicateResume } from '#/data/resumes'
import { ResumeDialog } from '#/components/resumes/ResumeDialogs'
import { Link, useNavigate, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import type { ResumeSummary } from '#/data/resumes'

type ResumeCardProps = {
  resume: ResumeSummary
}

export function ResumeCard({ resume }: ResumeCardProps) {
  const router = useRouter()
  const navigate = useNavigate()
  const [dialog, setDialog] = useState<'rename' | 'delete' | null>(null)
  const [isDuplicating, setIsDuplicating] = useState(false)
  async function duplicate() {
    if (isDuplicating) return
    setIsDuplicating(true)
    try {
      const copy = await duplicateResume({ data: { resumeId: resume.id } })
      await router.invalidate()
      saveLandingToast({ message: 'Resume duplicated.', type: 'success' })
      await navigate({
        to: '/app/resumes/$resumeId/edit',
        params: { resumeId: copy.id },
      })
    } catch {
      saveLandingToast({
        message: 'We could not duplicate your resume. Please try again.',
        type: 'error',
      })
    } finally {
      setIsDuplicating(false)
    }
  }

  return (
    <article className="card group border border-base-300 bg-base-100 transition-shadow motion-reduce:transition-none hover:shadow-lg hover:shadow-neutral/5">
      <div className="card-body gap-4 p-5">
        <div className="relative flex items-start justify-between gap-3 rounded-xl bg-base-200 p-5">
          <Link
            className="mx-auto block h-44 w-36 overflow-hidden rounded-sm border border-base-300 bg-base-100 p-4 shadow-sm transition-transform motion-reduce:transition-none group-hover:-translate-y-1"
            aria-label={`Edit ${resume.title}`}
            to="/app/resumes/$resumeId/edit"
            params={{ resumeId: resume.id }}
          >
            <div aria-hidden="true">
              <div className="h-2 w-14 rounded-sm bg-base-content/60" />
              <div className="mt-2 h-1 w-20 bg-base-content/20" />
              <div className="my-3 border-b border-base-content/30" />
              {[0, 1, 2].map((section) => (
                <div className="mt-3" key={section}>
                  <div className="mb-2 h-1 w-10 bg-base-content/35" />
                  <div className="h-0.5 w-full bg-base-content/15" />
                  <div className="mt-1 h-0.5 w-full bg-base-content/15" />
                  <div className="mt-1 h-0.5 w-3/4 bg-base-content/15" />
                </div>
              ))}
            </div>
          </Link>
          <details className="dropdown dropdown-end absolute top-2 right-2">
            <summary
              className="btn btn-ghost btn-sm btn-square bg-base-100/80"
              aria-label={`Actions for ${resume.title}`}
            >
              <MoreHorizontal size={18} aria-hidden="true" />
            </summary>
            <ul className="dropdown-content menu z-40 w-40 rounded-box border border-base-300 bg-base-100 p-2 shadow-lg">
              <li>
                <button type="button" onClick={() => setDialog('rename')}>
                  <Pencil size={15} aria-hidden="true" />
                  Rename
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => void duplicate()}
                  disabled={isDuplicating}
                >
                  <Copy size={15} aria-hidden="true" />
                  Duplicate
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="text-error"
                  onClick={() => setDialog('delete')}
                >
                  <Trash2 size={15} aria-hidden="true" />
                  Delete
                </button>
              </li>
            </ul>
          </details>
        </div>
        <div className="min-w-0">
          <h3 className="truncate font-semibold" title={resume.title}>
            <Link
              className="focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
              to="/app/resumes/$resumeId/edit"
              params={{ resumeId: resume.id }}
            >
              {resume.title}
            </Link>
          </h3>
          <p className="mt-1 text-sm text-base-content/60">
            Updated {formatRelativeDate(resume.updatedAt)}
          </p>
        </div>
        <div className="card-actions items-center justify-between">
          <span className="badge badge-sm border-base-300 bg-base-200 text-base-content/60">
            {resume.status}
          </span>
          <Link
            className="btn btn-ghost btn-sm -mr-2"
            to="/app/resumes/$resumeId/edit"
            params={{ resumeId: resume.id }}
          >
            Edit resume <ArrowUpRight size={15} aria-hidden="true" />
          </Link>
        </div>
      </div>
      {dialog && (
        <ResumeDialog
          mode={dialog}
          resume={resume}
          onClose={() => setDialog(null)}
          onSuccess={() => {
            setDialog(null)
            void router.invalidate()
            saveLandingToast({
              message:
                dialog === 'rename' ? 'Resume renamed.' : 'Resume deleted.',
              type: 'success',
            })
          }}
        />
      )}
    </article>
  )
}

function formatRelativeDate(value: string) {
  const seconds = Math.max(
    0,
    Math.round((Date.now() - new Date(value).getTime()) / 1000),
  )
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`
  const days = Math.floor(minutes / 1440)
  if (days === 1) return 'yesterday'
  return `${days} days ago`
}
