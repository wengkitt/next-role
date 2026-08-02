import { Link } from '@tanstack/react-router'
import { ArrowRight, Copy, FileText } from 'lucide-react'

export function ResumeVersionsSection() {
  const roles = [
    'Frontend Developer Resume',
    'Backend Developer Resume',
    'Full Stack Developer Resume',
  ]
  return (
    <section className="bg-base-100 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
        <div>
          <p className="mb-3 text-sm font-semibold tracking-widest text-primary uppercase">
            Tailor every application
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            Keep one clear story. Make every version fit the role.
          </h2>
          <p className="mt-5 max-w-xl leading-7 text-base-content/70">
            Duplicate a resume, adjust the emphasis, and keep focused versions
            ready for the different opportunities you want to pursue.
          </p>
          <Link to="/sign-up" className="btn btn-outline mt-7">
            Create your first resume <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>
        <div className="card card-border bg-base-200 shadow-sm">
          <div className="card-body p-5 sm:p-7">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold tracking-widest text-base-content/55 uppercase">
                  Resume library
                </p>
                <h3 className="mt-1 text-lg font-semibold">
                  Your versions, in one place
                </h3>
              </div>
              <Copy className="text-primary" size={20} aria-hidden="true" />
            </div>
            <div className="mt-5 space-y-3">
              {roles.map((role, index) => (
                <div
                  className={`flex items-center gap-3 rounded-box border p-3 text-left shadow-sm ${index === 0 ? 'border-primary/40 bg-base-100' : 'border-base-300 bg-base-100/70'}`}
                  key={role}
                >
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-box bg-base-200">
                    <FileText
                      className="text-primary"
                      size={17}
                      aria-hidden="true"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{role}</p>
                    <p className="text-xs text-base-content/55">
                      {index === 0 ? 'Original draft' : 'Tailored version'}
                    </p>
                  </div>
                  {index === 0 && (
                    <span className="badge badge-success badge-soft badge-sm">
                      Saved
                    </span>
                  )}
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm leading-6 text-base-content/60">
              Duplicate a resume when a new opportunity calls for a different
              emphasis.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
