import type {
  ResumeQualityCheck,
  ResumeQualityReport,
  ResumeQualitySection,
} from '#/lib/resume-quality'
import { AlertTriangle, CheckCircle2, Lightbulb } from 'lucide-react'

const sectionLabels: Record<ResumeQualitySection, string> = {
  profile: 'Personal information',
  summary: 'Professional summary',
  work: 'Work experience',
  education: 'Education',
  skills: 'Skills',
  projects: 'Projects',
  certifications: 'Certifications',
  languages: 'Languages',
  awards: 'Awards',
  volunteer: 'Volunteer work',
  settings: 'Resume settings',
}

function CheckIcon({ check }: { check: ResumeQualityCheck }) {
  if (check.severity === 'success')
    return <CheckCircle2 className="text-success" size={16} />
  if (check.severity === 'tip')
    return <Lightbulb className="text-info" size={16} />
  return <AlertTriangle className="text-warning" size={16} />
}

export function ResumeQualityPanel({
  report,
  onFix,
}: {
  report: ResumeQualityReport
  onFix: (section: ResumeQualitySection) => void
}) {
  const warnings = report.checks.filter((check) => check.severity === 'warning')
  const tips = report.checks.filter((check) => check.severity === 'tip')
  return (
    <section className="card border border-base-300 bg-base-100">
      <div className="card-body gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-semibold">Resume readiness</h3>
            <p className="mt-1 text-xs text-base-content/60">
              Advisory checks to help you prepare. Nothing here blocks editing
              or export.
            </p>
          </div>
          <span className="badge badge-primary badge-outline">
            {report.progress}%
          </span>
        </div>
        <progress
          className="progress progress-primary w-full"
          value={report.progress}
          max="100"
          aria-label="Resume readiness progress"
        />
        <p className="text-xs text-base-content/60">
          {report.completed} of {report.total} core checks complete
          {report.pageCount ? ` · ${report.pageCount}-page document` : ''}
        </p>
        {warnings.length === 0 && tips.length === 0 ? (
          <div className="alert alert-success alert-soft py-2 text-sm">
            Your resume passes the current readiness checks.
          </div>
        ) : (
          <div className="grid gap-2" role="list">
            {[...warnings, ...tips].slice(0, 8).map((check) => (
              <div
                className="flex items-start gap-2 rounded-box border border-base-300 p-2.5"
                key={check.id}
                role="listitem"
              >
                <span className="mt-0.5 shrink-0">
                  <CheckIcon check={check} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm leading-5">{check.message}</p>
                  <p className="mt-0.5 text-xs text-base-content/55">
                    {sectionLabels[check.section]}
                  </p>
                </div>
                {check.severity !== 'success' && (
                  <button
                    className="btn btn-ghost btn-xs shrink-0"
                    onClick={() => onFix(check.section)}
                  >
                    Fix this
                  </button>
                )}
              </div>
            ))}
            {warnings.length + tips.length > 8 && (
              <p className="text-center text-xs text-base-content/55">
                Showing the eight most useful suggestions. Keep refining as you
                go.
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
