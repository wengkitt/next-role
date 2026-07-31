import { saveLandingToast } from '#/components/LandingToast'
import { ResumeDialog } from '#/components/resumes/ResumeDialogs'
import { profileSchema } from '#/data/resume-schemas'
import { saveResumeProfile } from '#/data/resumes'
import type { ProfileValues } from '#/data/resume-schemas'
import type { ResumeSummary } from '#/data/resumes'
import { Link, useRouter } from '@tanstack/react-router'
import {
  ArrowLeft,
  BriefcaseBusiness,
  ChevronRight,
  Eye,
  FileText,
  GraduationCap,
  Pencil,
  Save,
  Sparkles,
  UserRound,
} from 'lucide-react'
import { useState } from 'react'

const fields: { key: keyof ProfileValues; label: string; type?: string }[] = [
  { key: 'fullName', label: 'Full name' },
  { key: 'professionalTitle', label: 'Professional title' },
  { key: 'email', label: 'Email', type: 'email' },
  { key: 'phone', label: 'Phone', type: 'tel' },
  { key: 'location', label: 'Location' },
  { key: 'website', label: 'Website', type: 'url' },
  { key: 'linkedinUrl', label: 'LinkedIn', type: 'url' },
  { key: 'githubUrl', label: 'GitHub', type: 'url' },
]

export function ResumeEditor({
  resume,
  profile,
}: {
  resume: ResumeSummary
  profile: ProfileValues
}) {
  const router = useRouter()
  const [values, setValues] = useState<ProfileValues>(profile)
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [renameOpen, setRenameOpen] = useState(false)
  const [updatedAt, setUpdatedAt] = useState(resume.updatedAt)

  async function save() {
    if (isSaving) return
    const parsed = profileSchema.safeParse({ resumeId: resume.id, ...values })
    if (!parsed.success) {
      setError(
        parsed.error.issues[0]?.message ??
          'Please correct the highlighted fields.',
      )
      return
    }
    setError(null)
    setIsSaving(true)
    try {
      const saved = await saveResumeProfile({ data: parsed.data })
      const { updatedAt: savedAt, ...savedValues } = saved
      setValues((current) => ({ ...current, ...savedValues }))
      setUpdatedAt(savedAt)
      saveLandingToast({
        message: 'Personal information saved.',
        type: 'success',
      })
      await router.invalidate()
    } catch {
      setError('We could not save your changes. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1600px]">
        <header className="mb-6 flex flex-col gap-4 border-b border-base-300 pb-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <Link to="/app/dashboard" className="btn btn-ghost btn-sm -ml-3">
              <ArrowLeft size={16} aria-hidden="true" />
              Back to resumes
            </Link>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <h2 className="truncate text-2xl font-bold sm:text-3xl">
                {resume.title}
              </h2>
              <span className="badge badge-soft badge-warning">Draft</span>
            </div>
            <p className="mt-1 text-sm text-base-content/65">
              Saved {relativeTime(updatedAt)}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              className="btn btn-sm"
              type="button"
              onClick={() => setRenameOpen(true)}
            >
              <Pencil size={15} aria-hidden="true" />
              Rename
            </button>
            <button
              className="btn btn-sm lg:hidden"
              type="button"
              onClick={() => setShowPreview((value) => !value)}
            >
              <Eye size={15} aria-hidden="true" />
              {showPreview ? 'Edit' : 'Preview'}
            </button>
            <button
              className="btn btn-sm"
              type="button"
              disabled
              title="PDF export is not available yet"
            >
              Export
            </button>
          </div>
        </header>
        <div className="grid gap-5 xl:grid-cols-[220px_minmax(0,1fr)_minmax(360px,0.9fr)]">
          <SectionNavigation />
          <section
            className={`card border border-base-300 bg-base-100 ${showPreview ? 'hidden lg:block' : ''}`}
            aria-labelledby="personal-info-heading"
          >
            <div className="card-body p-5 sm:p-6">
              <div>
                <h3 id="personal-info-heading" className="card-title text-xl">
                  Personal Information
                </h3>
                <p className="text-sm text-base-content/65">
                  Start with the details employers use to contact you.
                </p>
              </div>
              {error && (
                <div
                  className="alert alert-error alert-soft mt-2 text-sm"
                  role="alert"
                >
                  {error}
                </div>
              )}
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                {fields.map((field) => (
                  <fieldset className="fieldset" key={field.key}>
                    <legend className="fieldset-legend">{field.label}</legend>
                    <input
                      className="input w-full"
                      type={field.type ?? 'text'}
                      value={values[field.key]}
                      onChange={(event) =>
                        setValues((current) => ({
                          ...current,
                          [field.key]: event.target.value,
                        }))
                      }
                    />
                  </fieldset>
                ))}
              </div>
              <div className="card-actions mt-5 justify-end">
                <button
                  className="btn btn-primary"
                  type="button"
                  disabled={isSaving}
                  onClick={() => void save()}
                >
                  {isSaving ? (
                    <span className="loading loading-spinner loading-sm" />
                  ) : (
                    <Save size={16} aria-hidden="true" />
                  )}
                  {isSaving ? 'Saving' : 'Save changes'}
                </button>
              </div>
            </div>
          </section>
          <section
            className={`${showPreview ? '' : 'hidden'} xl:block`}
            aria-label="Resume preview"
          >
            <ResumePreview title={resume.title} values={values} />
          </section>
        </div>
      </div>
      {renameOpen && (
        <ResumeDialog
          mode="rename"
          resume={resume}
          onClose={() => setRenameOpen(false)}
          onSuccess={() => {
            setRenameOpen(false)
            saveLandingToast({ message: 'Resume renamed.', type: 'success' })
            void router.invalidate()
          }}
        />
      )}
    </main>
  )
}

function SectionNavigation() {
  const sections = [
    [UserRound, 'Personal Information'],
    [Sparkles, 'Professional Summary'],
    [BriefcaseBusiness, 'Work Experience'],
    [GraduationCap, 'Education'],
    [FileText, 'Skills'],
    [ChevronRight, 'Projects'],
  ] as const
  return (
    <aside className="card h-fit border border-base-300 bg-base-100">
      <div className="card-body p-3">
        <p className="px-2 text-xs font-semibold tracking-widest text-base-content/55 uppercase">
          Resume sections
        </p>
        <nav aria-label="Resume sections">
          <ul className="menu w-full p-0">
            {sections.map(([Icon, label], index) => (
              <li key={label}>
                <button
                  type="button"
                  className={index === 0 ? 'menu-active' : undefined}
                  disabled={index !== 0}
                  aria-current={index === 0 ? 'page' : undefined}
                >
                  <Icon size={17} aria-hidden="true" />
                  {label}
                  {index !== 0 && (
                    <span className="ml-auto text-xs font-normal opacity-60">
                      Next
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  )
}

function ResumePreview({
  title,
  values,
}: {
  title: string
  values: ProfileValues
}) {
  const contact = [values.email, values.phone, values.location].filter(Boolean)
  const links = [values.website, values.linkedinUrl, values.githubUrl].filter(
    Boolean,
  )
  return (
    <div className="rounded-box border border-base-300 bg-base-300 p-4 sm:p-6">
      <article className="mx-auto aspect-[1/1.414] w-full max-w-[595px] bg-white p-7 text-slate-800 shadow-xl sm:p-10">
        <header className="border-b-2 border-slate-700 pb-4">
          <h3 className="text-2xl font-bold tracking-tight">
            {values.fullName || title}
          </h3>
          {values.professionalTitle && (
            <p className="mt-1 font-semibold text-slate-600">
              {values.professionalTitle}
            </p>
          )}
          {contact.length > 0 && (
            <p className="mt-2 text-xs text-slate-600">{contact.join(' · ')}</p>
          )}
          {links.length > 0 && (
            <p className="mt-1 text-xs text-slate-600">{links.join(' · ')}</p>
          )}
        </header>
        {!values.fullName && !values.professionalTitle && (
          <p className="mt-8 text-sm leading-6 text-slate-500">
            Your personal details will appear here as you add them.
          </p>
        )}
      </article>
    </div>
  )
}

function relativeTime(value: string) {
  const minutes = Math.floor((Date.now() - new Date(value).getTime()) / 60000)
  return minutes < 1
    ? 'just now'
    : minutes < 60
      ? `${minutes} minutes ago`
      : 'recently'
}
