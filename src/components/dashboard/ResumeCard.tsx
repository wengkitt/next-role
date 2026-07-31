import { FileText, MoreHorizontal, Pencil, Copy, Trash2 } from 'lucide-react'

import { saveLandingToast } from '#/components/LandingToast'
import type { ResumeSummary } from '#/data/resumes'

type ResumeCardProps = {
  resume: ResumeSummary
}

export function ResumeCard({ resume }: ResumeCardProps) {
  function showUnavailable(action: string) {
    saveLandingToast({
      message: `${action} will be available when resume management is connected.`,
      type: 'info',
    })
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
                <button type="button" onClick={() => showUnavailable('Rename')}>
                  <Pencil size={15} aria-hidden="true" />
                  Rename
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => showUnavailable('Duplicate')}
                >
                  <Copy size={15} aria-hidden="true" />
                  Duplicate
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="text-error"
                  onClick={() => showUnavailable('Delete')}
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
            Updated {resume.updatedAt}
          </p>
        </div>
        <div className="card-actions items-center justify-between">
          <span className="badge badge-soft badge-warning">
            {resume.status}
          </span>
          <button
            className="btn btn-sm"
            type="button"
            onClick={() => showUnavailable('Editing')}
          >
            Continue editing
          </button>
        </div>
      </div>
    </article>
  )
}
