import { FileText, MoreHorizontal, Pencil, Copy, Trash2 } from 'lucide-react'

import { saveLandingToast } from '#/components/LandingToast'
import { duplicateResume } from '#/data/resumes'
import { ResumeDialog } from '#/components/resumes/ResumeDialogs'
import { Link, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import type { ResumeSummary } from '#/data/resumes'

type ResumeCardProps = {
  resume: ResumeSummary
}

export function ResumeCard({ resume }: ResumeCardProps) {
  const router = useRouter()
  const [dialog, setDialog] = useState<'rename' | 'delete' | null>(null)
  const [isDuplicating, setIsDuplicating] = useState(false)
  async function duplicate() {
    if (isDuplicating) return
    setIsDuplicating(true)
    try {
      await duplicateResume({ data: { resumeId: resume.id } })
      await router.invalidate()
      saveLandingToast({ message: 'Resume duplicated.', type: 'success' })
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
    <article className="card border border-base-300 bg-base-100 transition-shadow motion-reduce:transition-none hover:shadow-md">
      <div className="card-body gap-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div
            className="grid h-28 w-20 shrink-0 place-items-center rounded-field border border-base-300 bg-base-200 text-base-content/50"
            aria-label="Resume preview unavailable"
          >
            <FileText size={28} aria-hidden="true" />
          </div>
          <details className="dropdown dropdown-end">
            <summary
              className="btn btn-ghost btn-sm btn-square"
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
            {resume.title}
          </h3>
          <p className="mt-1 text-sm text-base-content/60">
            Updated {formatRelativeDate(resume.updatedAt)}
          </p>
        </div>
        <div className="card-actions items-center justify-between">
          <span className="badge badge-soft badge-warning">
            {resume.status}
          </span>
          <Link
            className="btn btn-sm"
            to="/app/resumes/$resumeId/edit"
            params={{ resumeId: resume.id }}
          >
            Continue editing
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
  const days = Math.floor(minutes / 1440)
  if (days === 1) return 'yesterday'
  return `${days} days ago`
}
