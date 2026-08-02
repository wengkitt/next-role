import { saveLandingToast } from '#/components/LandingToast'
import { ResumeDialog } from '#/components/resumes/ResumeDialogs'
import {
  Entries,
  Profile,
  Settings,
  Skills,
  Summary,
} from '#/components/resumes/ResumeEditorSections'
import { ResumePdfPreview } from '#/components/resumes/ResumePdfPreview'
import { ResumeQualityPanel } from '#/components/resumes/ResumeQualityPanel'
import { useResumeEditorState } from '#/components/resumes/useResumeEditorState'
import type { EditorSection } from '#/components/resumes/useResumeEditorState'
import { profileSchema, summarySchema } from '#/data/resume-schemas'
import {
  saveProfessionalSummary,
  saveResumeProfile,
  saveResumeSectionPreferences,
  saveResumeTemplate,
} from '#/data/resumes'
import type {
  EducationEntry,
  ResumeAward,
  ResumeCertification,
  ResumeLanguage,
  ResumeProfile,
  ResumeProject,
  ResumeSectionPreferences,
  ResumeSkill,
  ResumeSummary,
  ResumeVolunteer,
  WorkExperience,
} from '#/data/resumes'
import type { ProfileValues } from '#/data/resume-schemas'
import { normalizeResumeDocument } from '#/lib/resume-document'
import type {
  ResumeDocumentData,
  ResumeDocumentSection,
} from '#/lib/resume-document'
import { getResumeQualityReport } from '#/lib/resume-quality'
import type { ResumeQualitySection } from '#/lib/resume-quality'
import { userFacingError } from '#/lib/user-facing-error'
import type { TemplateId } from '#/resume-templates/registry'
import { Link, useRouter } from '@tanstack/react-router'
import {
  ArrowLeft,
  Award,
  BriefcaseBusiness,
  Check,
  Eye,
  FileBadge,
  FileText,
  FolderKanban,
  GraduationCap,
  Languages,
  Pencil,
  Save,
  Settings2,
  Sparkles,
  UserRound,
  UsersRound,
} from 'lucide-react'
import { useMemo, useState } from 'react'

type ResumeEditorProps = {
  resume: ResumeSummary
  profile: ProfileValues
  summary: { content: string }
  workExperiences: WorkExperience[]
  educationEntries: EducationEntry[]
  skills: ResumeSkill[]
  projects: ResumeProject[]
  certifications?: ResumeCertification[]
  languages?: ResumeLanguage[]
  awards?: ResumeAward[]
  volunteer?: ResumeVolunteer[]
  sectionPreferences?: ResumeSectionPreferences
}

const defaultSectionOrder: ResumeDocumentSection[] = [
  'summary',
  'experience',
  'skills',
  'projects',
  'education',
  'certifications',
  'languages',
  'awards',
  'volunteer',
]

const defaultPreferences: ResumeSectionPreferences = {
  order: defaultSectionOrder,
  hidden: [],
}

const labels: Record<EditorSection, string> = {
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
  settings: 'Document settings',
}

export function ResumeEditor(props: ResumeEditorProps) {
  const router = useRouter()
  const state = useResumeEditorState({
    profile: props.profile,
    summary: props.summary,
    work: props.workExperiences,
    education: props.educationEntries,
    skills: props.skills,
    projects: props.projects,
    certifications: props.certifications ?? [],
    languages: props.languages ?? [],
    awards: props.awards ?? [],
    volunteer: props.volunteer ?? [],
    sectionPreferences: props.sectionPreferences ?? defaultPreferences,
  })
  const [showPreview, setShowPreview] = useState(false)
  const [error, setError] = useState('')
  const [renameOpen, setRenameOpen] = useState(false)
  const [templateId, setTemplateId] = useState<TemplateId>(
    props.resume.templateId,
  )
  const [pageCount, setPageCount] = useState<number | undefined>()

  const documentData = useMemo<ResumeDocumentData>(
    () =>
      normalizeResumeDocument({
        resume: { title: props.resume.title },
        profile: state.profile as ResumeProfile,
        summary: state.summaryText,
        work: state.work,
        education: state.education,
        skills: state.skills,
        projects: state.projects,
        certifications: state.certifications,
        languages: state.languages,
        awards: state.awards,
        volunteer: state.volunteer,
        sectionPreferences: state.sectionPreferences,
      }),
    [
      props.resume.title,
      state.profile,
      state.summaryText,
      state.work,
      state.education,
      state.skills,
      state.projects,
      state.certifications,
      state.languages,
      state.awards,
      state.volunteer,
      state.sectionPreferences,
    ],
  )
  const qualityReport = useMemo(
    () => getResumeQualityReport(documentData, pageCount),
    [documentData, pageCount],
  )
  const hasUnsavedChanges = Object.values(state.dirtySections).some(Boolean)

  function showError(message: string) {
    setError(message)
  }
  function success(message: string) {
    setError('')
    saveLandingToast({ message, type: 'success' })
  }

  async function profileSave() {
    const parsed = profileSchema.safeParse({
      resumeId: props.resume.id,
      ...state.profile,
    })
    if (!parsed.success) {
      showError(parsed.error.issues[0]?.message ?? 'Check your details.')
      return
    }
    state.setSavingSection('profile')
    try {
      await saveResumeProfile({ data: parsed.data })
      state.markSaved('profile')
      success('Personal information saved.')
    } catch (saveError) {
      showError(userFacingError(saveError, 'Unable to save changes.'))
    } finally {
      state.setSavingSection(null)
    }
  }

  async function summarySave() {
    const parsed = summarySchema.safeParse({
      resumeId: props.resume.id,
      content: state.summaryText,
    })
    if (!parsed.success) {
      showError(parsed.error.issues[0]?.message ?? 'Check your summary.')
      return
    }
    state.setSavingSection('summary')
    try {
      await saveProfessionalSummary({ data: parsed.data })
      state.markSaved('summary')
      success('Summary saved.')
    } catch (saveError) {
      showError(userFacingError(saveError, 'Unable to save summary.'))
    } finally {
      state.setSavingSection(null)
    }
  }

  async function chooseTemplate(nextTemplateId: TemplateId) {
    if (nextTemplateId === templateId) return
    const previous = templateId
    setTemplateId(nextTemplateId)
    try {
      await saveResumeTemplate({
        data: { resumeId: props.resume.id, templateId: nextTemplateId },
      })
      state.markSaved('settings')
      success('Template selected.')
    } catch (saveError) {
      setTemplateId(previous)
      showError(userFacingError(saveError, 'Unable to save the template.'))
    }
  }

  async function savePreferences() {
    state.setSavingSection('settings')
    try {
      await saveResumeSectionPreferences({
        data: {
          resumeId: props.resume.id,
          order: state.sectionPreferences.order,
          hidden: state.sectionPreferences.hidden,
        },
      })
      state.markSaved('settings')
      success('Document settings saved.')
    } catch (saveError) {
      showError(userFacingError(saveError, 'Unable to save document settings.'))
    } finally {
      state.setSavingSection(null)
    }
  }

  function contentForSection() {
    switch (state.section) {
      case 'profile':
        return (
          <Profile values={state.profile} setValues={state.updateProfile} />
        )
      case 'summary':
        return (
          <Summary text={state.summaryText} setText={state.updateSummary} />
        )
      case 'skills':
        return (
          <Skills
            resumeId={props.resume.id}
            items={state.skills}
            setItems={state.setSkills}
            onSaved={() => state.markSaved('skills')}
            fail={showError}
          />
        )
      case 'work':
      case 'education':
      case 'projects':
        return (
          <Entries
            kind={state.section}
            resumeId={props.resume.id}
            items={
              state.section === 'work'
                ? state.work
                : state.section === 'education'
                  ? state.education
                  : state.projects
            }
            setItems={
              state.section === 'work'
                ? state.setWork
                : state.section === 'education'
                  ? state.setEducation
                  : state.setProjects
            }
            onSaved={() => state.markSaved(state.section)}
            fail={showError}
          />
        )
      case 'certifications':
      case 'languages':
      case 'awards':
      case 'volunteer': {
        const optionalSection = state.section as
          | 'certifications'
          | 'languages'
          | 'awards'
          | 'volunteer'
        const optionalState = {
          certifications: {
            items: state.certifications,
            setItems: state.setCertifications,
          },
          languages: { items: state.languages, setItems: state.setLanguages },
          awards: { items: state.awards, setItems: state.setAwards },
          volunteer: { items: state.volunteer, setItems: state.setVolunteer },
        }[optionalSection]
        return (
          <Entries
            kind={optionalSection}
            resumeId={props.resume.id}
            items={optionalState.items}
            setItems={optionalState.setItems}
            onSaved={() => state.markSaved(optionalSection)}
            fail={showError}
          />
        )
      }
      case 'settings':
        return (
          <Settings
            activeTemplate={templateId}
            onTemplateSelect={(next) => void chooseTemplate(next)}
            preferences={state.sectionPreferences}
            setPreferences={state.setSectionPreferences}
          />
        )
    }
  }

  const needsSave =
    state.section === 'profile' ||
    state.section === 'summary' ||
    state.section === 'settings'
  const saveLabel =
    state.section === 'profile'
      ? 'Save personal information'
      : state.section === 'summary'
        ? 'Save summary'
        : 'Save document settings'

  return (
    <main className="resume-editor-main min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1700px]">
        <header className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-base-300 pb-5">
          <div>
            <Link to="/app/resumes" className="btn btn-ghost btn-sm -ml-3">
              <ArrowLeft size={16} />
              Back to resumes
            </Link>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <h2 className="text-2xl font-bold">{props.resume.title}</h2>
              <span
                className={`badge ${hasUnsavedChanges ? 'badge-warning' : 'badge-success'} badge-soft gap-1`}
              >
                {hasUnsavedChanges ? (
                  'Unsaved changes'
                ) : (
                  <>
                    <Check size={13} /> All changes saved
                  </>
                )}
              </span>
            </div>
            {state.lastSavedAt && !hasUnsavedChanges && (
              <p className="mt-1 text-xs text-base-content/55">
                Saved just now
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="btn btn-sm" onClick={() => setRenameOpen(true)}>
              <Pencil size={15} />
              Rename
            </button>
            <button
              className="btn btn-sm lg:hidden"
              onClick={() => setShowPreview((visible) => !visible)}
            >
              <Eye size={15} />
              {showPreview ? 'Edit' : 'Preview & export'}
            </button>
          </div>
        </header>
        <div className="grid items-start gap-5 xl:grid-cols-[220px_minmax(0,.9fr)_minmax(440px,1.2fr)]">
          <aside className="grid gap-3">
            <Navigation
              current={state.section}
              setCurrent={(nextSection) => {
                state.setSection(nextSection)
                setError('')
              }}
              complete={completionForState(state)}
              dirty={state.dirtySections}
            />
            <ResumeQualityPanel
              report={qualityReport}
              onFix={(target: ResumeQualitySection) => {
                if (target === 'settings') state.setSection('settings')
                else if (target === 'profile') state.setSection('profile')
                else if (target === 'summary') state.setSection('summary')
                else if (target === 'work') state.setSection('work')
                else if (target === 'education') state.setSection('education')
                else if (target === 'skills') state.setSection('skills')
                else if (target === 'projects') state.setSection('projects')
                else state.setSection(target)
                setShowPreview(false)
              }}
            />
          </aside>
          <section
            className={`card border border-base-300 bg-base-100 ${showPreview ? 'hidden lg:block' : ''}`}
          >
            <div className="card-body p-5 sm:p-6">
              <div className="mb-2 flex items-start justify-between gap-3">
                <div>
                  <h3 className="card-title text-xl">
                    {labels[state.section]}
                  </h3>
                  <p className="mt-1 text-xs text-base-content/55">
                    {state.dirtySections[state.section]
                      ? 'This section has unsaved changes.'
                      : 'You can move freely between sections.'}
                  </p>
                </div>
                {state.section !== 'settings' &&
                  state.section !== 'profile' &&
                  state.section !== 'summary' && (
                    <span className="badge badge-ghost badge-sm">
                      Saved per change
                    </span>
                  )}
              </div>
              {error && (
                <div
                  role="alert"
                  className="alert alert-error alert-soft text-sm"
                >
                  {error}
                </div>
              )}
              {contentForSection()}
              {needsSave && (
                <div className="card-actions mt-5 justify-end border-t border-base-300 pt-4">
                  <button
                    className="btn btn-primary"
                    disabled={state.savingSection !== null}
                    onClick={() =>
                      void (state.section === 'profile'
                        ? profileSave()
                        : state.section === 'summary'
                          ? summarySave()
                          : savePreferences())
                    }
                  >
                    {state.savingSection && (
                      <span className="loading loading-spinner loading-sm" />
                    )}
                    <Save size={16} />
                    {state.savingSection ? 'Saving...' : saveLabel}
                  </button>
                </div>
              )}
            </div>
          </section>
          <section
            className={`${showPreview ? '' : 'hidden'} xl:sticky xl:top-6 xl:block xl:min-h-0 xl:self-start`}
          >
            <div className="mb-3 flex items-center justify-between px-1">
              <div>
                <h3 className="text-sm font-semibold">Live preview</h3>
                <p className="text-xs text-base-content/60">
                  A4 · selectable text · automatic page wrapping
                </p>
              </div>
              <span className="badge badge-ghost badge-sm">{templateId}</span>
            </div>
            <ResumePdfPreview
              data={documentData}
              templateId={templateId}
              title={props.resume.title}
              onPageCountChange={setPageCount}
            />
          </section>
        </div>
      </div>
      {renameOpen && (
        <ResumeDialog
          mode="rename"
          resume={props.resume}
          onClose={() => setRenameOpen(false)}
          onSuccess={() => {
            setRenameOpen(false)
            void router.invalidate()
          }}
        />
      )}
    </main>
  )
}

function completionForState(
  state: ReturnType<typeof useResumeEditorState>,
): Record<EditorSection, boolean> {
  return {
    profile: Boolean(state.profile.fullName && state.profile.professionalTitle),
    summary: Boolean(state.summaryText.trim()),
    work: state.work.length > 0,
    education: state.education.length > 0,
    skills: state.skills.length > 0,
    projects: state.projects.length > 0,
    certifications: state.certifications.length > 0,
    languages: state.languages.length > 0,
    awards: state.awards.length > 0,
    volunteer: state.volunteer.length > 0,
    settings: true,
  }
}

function Navigation({
  current,
  setCurrent,
  complete,
  dirty,
}: {
  current: EditorSection
  setCurrent: (value: EditorSection) => void
  complete: Record<EditorSection, boolean>
  dirty: Record<EditorSection, boolean>
}) {
  const items: [EditorSection, typeof UserRound][] = [
    ['profile', UserRound],
    ['summary', Sparkles],
    ['work', BriefcaseBusiness],
    ['education', GraduationCap],
    ['skills', FileText],
    ['projects', FolderKanban],
    ['certifications', FileBadge],
    ['languages', Languages],
    ['awards', Award],
    ['volunteer', UsersRound],
    ['settings', Settings2],
  ]
  return (
    <aside className="card h-fit border border-base-300 bg-base-100">
      <div className="card-body p-3">
        <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wide text-base-content/50">
          Build your resume
        </p>
        <nav aria-label="Resume sections">
          <ul className="menu menu-sm p-0">
            {items.map(([key, Icon]) => (
              <li key={key}>
                <button
                  className={current === key ? 'menu-active' : ''}
                  onClick={() => setCurrent(key)}
                >
                  <Icon size={16} />
                  <span className="min-w-0 flex-1 truncate">{labels[key]}</span>
                  {dirty[key] ? (
                    <span
                      className="badge badge-warning badge-xs"
                      title="Unsaved changes"
                    >
                      !
                    </span>
                  ) : complete[key] ? (
                    <Check className="text-success" size={15} />
                  ) : null}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  )
}
