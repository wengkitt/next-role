import { saveLandingToast } from '#/components/LandingToast'
import { normalizeResume } from '#/lib/resume-normalizer'
import { getResumeTemplate, resumeTemplates } from '#/resume-templates/registry'
import { ResumeDialog } from '#/components/resumes/ResumeDialogs'
import { profileSchema, summarySchema } from '#/data/resume-schemas'
import {
  createResumeSkill,
  deleteEducationEntry,
  deleteResumeProject,
  deleteResumeSkill,
  deleteWorkExperience,
  reorderEducationEntries,
  reorderResumeProjects,
  reorderResumeSkills,
  reorderWorkExperiences,
  saveEducationEntry,
  saveProfessionalSummary,
  saveResumeProfile,
  saveResumeTemplate,
  saveResumeProject,
  saveWorkExperience,
} from '#/data/resumes'
import type {
  EducationEntry,
  ResumeProject,
  ResumeSkill,
  ResumeSummary,
  WorkExperience,
} from '#/data/resumes'
import type { ProfileValues } from '#/data/resume-schemas'
import { Link, useRouter } from '@tanstack/react-router'
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  BriefcaseBusiness,
  Eye,
  FileText,
  FolderKanban,
  GraduationCap,
  Pencil,
  Plus,
  Save,
  SlidersHorizontal,
  Sparkles,
  Trash2,
  UserRound,
} from 'lucide-react'
import { useLayoutEffect, useMemo, useRef, useState } from 'react'

const fields: { key: keyof ProfileValues; label: string; type?: string }[] = [
  { key: 'fullName', label: 'Full name' },
  { key: 'professionalTitle', label: 'Professional title' },
  { key: 'email', label: 'Email', type: 'email' },
  { key: 'phone', label: 'Phone' },
  { key: 'location', label: 'Location' },
  { key: 'website', label: 'Website', type: 'url' },
  { key: 'linkedinUrl', label: 'LinkedIn', type: 'url' },
  { key: 'githubUrl', label: 'GitHub', type: 'url' },
]
type Section =
  | 'profile'
  | 'summary'
  | 'work'
  | 'education'
  | 'skills'
  | 'projects'
  | 'settings'
export function ResumeEditor({
  resume,
  profile,
  summary,
  workExperiences,
  educationEntries,
  skills,
  projects,
}: {
  resume: ResumeSummary
  profile: ProfileValues
  summary: { content: string }
  workExperiences: WorkExperience[]
  educationEntries: EducationEntry[]
  skills: ResumeSkill[]
  projects: ResumeProject[]
}) {
  const router = useRouter()
  const [section, setSection] = useState<Section>('profile')
  const [values, setValues] = useState(profile)
  const [summaryText, setSummaryText] = useState(summary.content)
  const [work, setWork] = useState(workExperiences)
  const [education, setEducation] = useState(educationEntries)
  const [skillList, setSkillList] = useState(skills)
  const [projectList, setProjectList] = useState(projects)
  const [showPreview, setShowPreview] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [renameOpen, setRenameOpen] = useState(false)
  const [templateId, setTemplateId] = useState(resume.templateId)
  const [isExporting, setIsExporting] = useState(false)
  const message = (text: string) =>
    saveLandingToast({ message: text, type: 'success' })
  async function profileSave() {
    const parsed = profileSchema.safeParse({ resumeId: resume.id, ...values })
    if (!parsed.success)
      return setError(parsed.error.issues[0]?.message ?? 'Check your details.')
    setSaving(true)
    setError('')
    try {
      const saved = await saveResumeProfile({ data: parsed.data })
      const { updatedAt: _, ...next } = saved
      setValues(next)
      message('Personal information saved.')
      await router.invalidate()
    } catch {
      setError('Unable to save changes.')
    } finally {
      setSaving(false)
    }
  }
  async function summarySave() {
    const parsed = summarySchema.safeParse({
      resumeId: resume.id,
      content: summaryText,
    })
    if (!parsed.success)
      return setError(parsed.error.issues[0]?.message ?? 'Check your summary.')
    setSaving(true)
    try {
      await saveProfessionalSummary({ data: parsed.data })
      message('Summary saved.')
      await router.invalidate()
    } catch {
      setError('Unable to save summary.')
    } finally {
      setSaving(false)
    }
  }
  async function chooseTemplate(nextTemplateId: typeof templateId) {
    if (nextTemplateId === templateId) return
    const previous = templateId
    setTemplateId(nextTemplateId)
    try {
      await saveResumeTemplate({
        data: { resumeId: resume.id, templateId: nextTemplateId },
      })
      message('Template selected.')
      await router.invalidate()
    } catch {
      setTemplateId(previous)
      setError('Unable to save template selection.')
    }
  }
  async function exportPdf() {
    if (isExporting) return
    const sourcePages = Array.from(
      document.querySelectorAll<HTMLElement>('.resume-pages .resume-page'),
    )
    if (!sourcePages.length) {
      saveLandingToast({
        message: 'Unable to prepare the resume for export.',
        type: 'error',
      })
      return
    }
    setIsExporting(true)
    const source = values.fullName || resume.title
    const filename = `${source
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')}-resume.pdf`
    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import('html2canvas'),
        import('jspdf'),
      ])
      const pdf = new jsPDF({
        format: 'a4',
        orientation: 'portrait',
        unit: 'mm',
      })
      for (const [index, sourcePage] of sourcePages.entries()) {
        const canvas = await html2canvas(sourcePage, {
          backgroundColor: '#ffffff',
          onclone: (clonedDocument) => {
            for (const element of [
              clonedDocument.documentElement,
              clonedDocument.body,
            ]) {
              element.style.setProperty(
                'background-color',
                '#ffffff',
                'important',
              )
              element.style.setProperty('color', '#111111', 'important')
            }
          },
          scale: 2,
          useCORS: true,
        })
        if (index) pdf.addPage()
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 210, 297)
      }
      pdf.save(filename)
      saveLandingToast({
        message: 'Your PDF download has started.',
        type: 'success',
      })
    } catch {
      saveLandingToast({
        message: 'Unable to create the PDF. Please try again.',
        type: 'error',
      })
    } finally {
      setIsExporting(false)
    }
  }
  const content =
    section === 'profile' ? (
      <Profile values={values} setValues={setValues} />
    ) : section === 'summary' ? (
      <Summary text={summaryText} setText={setSummaryText} />
    ) : section === 'settings' ? (
      <TemplateSelector active={templateId} onSelect={chooseTemplate} />
    ) : section === 'skills' ? (
      <Skills
        resumeId={resume.id}
        items={skillList}
        setItems={setSkillList}
        fail={setError}
      />
    ) : (
      <Entries
        key={section}
        kind={section}
        resumeId={resume.id}
        items={
          section === 'work'
            ? work
            : section === 'education'
              ? education
              : projectList
        }
        setItems={
          section === 'work'
            ? setWork
            : section === 'education'
              ? setEducation
              : setProjectList
        }
        fail={setError}
      />
    )
  return (
    <main className="min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1600px]">
        <header className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-base-300 pb-5">
          <div>
            <Link to="/app/resumes" className="btn btn-ghost btn-sm -ml-3">
              <ArrowLeft size={16} />
              Back to resumes
            </Link>
            <h2 className="mt-3 text-2xl font-bold">{resume.title}</h2>
          </div>
          <div className="flex gap-2">
            <button className="btn btn-sm" onClick={() => setRenameOpen(true)}>
              <Pencil size={15} />
              Rename
            </button>
            <button
              className="btn btn-sm lg:hidden"
              onClick={() => setShowPreview(!showPreview)}
            >
              <Eye size={15} />
              {showPreview ? 'Edit' : 'Preview'}
            </button>
            <button
              className="btn btn-sm"
              aria-label="Export resume as PDF"
              onClick={exportPdf}
              disabled={isExporting}
            >
              {isExporting && (
                <span className="loading loading-spinner loading-sm" />
              )}
              {isExporting ? 'Preparing PDF...' : 'Export PDF'}
            </button>
          </div>
        </header>
        <div className="grid items-start gap-5 xl:grid-cols-[200px_minmax(0,.9fr)_minmax(400px,1.25fr)]">
          <Navigation
            current={section}
            setCurrent={(nextSection: Section) => {
              setSection(nextSection)
              setError('')
            }}
            complete={{
              profile: !!values.fullName,
              summary: !!summaryText,
              work: !!work.length,
              education: !!education.length,
              skills: !!skillList.length,
              projects: !!projectList.length,
              settings: false,
            }}
          />
          <section
            className={`card border border-base-300 bg-base-100 ${showPreview ? 'hidden lg:block' : ''}`}
          >
            <div className="card-body p-5 sm:p-6">
              <h3 className="card-title text-xl">{labels[section]}</h3>
              {error && (
                <div
                  role="alert"
                  className="alert alert-error alert-soft text-sm"
                >
                  {error}
                </div>
              )}
              {content}
              {(section === 'profile' || section === 'summary') && (
                <div className="card-actions justify-end">
                  <button
                    className="btn btn-primary"
                    disabled={saving}
                    onClick={() =>
                      void (section === 'profile'
                        ? profileSave()
                        : summarySave())
                    }
                  >
                    {saving && (
                      <span className="loading loading-spinner loading-sm" />
                    )}
                    <Save size={16} />
                    {saving
                      ? 'Saving...'
                      : section === 'summary'
                        ? 'Save summary'
                        : 'Save changes'}
                  </button>
                </div>
              )}
            </div>
          </section>
          <section
            className={`${showPreview ? '' : 'hidden'} xl:sticky xl:top-6 xl:block xl:self-start`}
          >
            <div className="mb-3 flex items-center justify-between px-1">
              <div>
                <h3 className="text-sm font-semibold">Live preview</h3>
                <p className="text-xs text-base-content/60">
                  Updates as you edit
                </p>
              </div>
              <span className="badge badge-ghost badge-sm">A4</span>
            </div>
            <Preview
              resume={{ title: resume.title }}
              profile={values}
              summary={summaryText}
              work={work}
              education={education}
              skills={skillList}
              projects={projectList}
              templateId={templateId}
            />
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
            void router.invalidate()
          }}
        />
      )}
    </main>
  )
}
const labels: Record<Section, string> = {
  profile: 'Personal Information',
  summary: 'Professional Summary',
  work: 'Work Experience',
  education: 'Education',
  skills: 'Skills',
  projects: 'Projects',
  settings: 'Resume Settings',
}
function Navigation({
  current,
  setCurrent,
  complete,
}: {
  current: Section
  setCurrent: (v: Section) => void
  complete: Record<Section, boolean>
}) {
  const items: [Section, any][] = [
    ['profile', UserRound],
    ['summary', Sparkles],
    ['work', BriefcaseBusiness],
    ['education', GraduationCap],
    ['skills', FileText],
    ['projects', FolderKanban],
    ['settings', SlidersHorizontal],
  ]
  return (
    <aside className="card h-fit border border-base-300 bg-base-100">
      <div className="card-body p-3">
        <nav aria-label="Resume sections">
          <ul className="menu p-0">
            {items.map(([key, Icon]) => (
              <li key={key}>
                <button
                  className={current === key ? 'menu-active' : ''}
                  onClick={() => setCurrent(key)}
                >
                  <Icon size={17} />
                  {labels[key]}
                  {complete[key] && (
                    <span className="ml-auto text-success">✓</span>
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
function Profile({ values, setValues }: any) {
  return (
    <>
      <p className="text-sm text-base-content/65">
        Start with the details employers use to contact you.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((field) => (
          <fieldset className="fieldset" key={field.key}>
            <legend className="fieldset-legend">{field.label}</legend>
            <input
              className="input w-full"
              type={field.type ?? 'text'}
              value={values[field.key]}
              onChange={(e) =>
                setValues((v: any) => ({ ...v, [field.key]: e.target.value }))
              }
            />
          </fieldset>
        ))}
      </div>
    </>
  )
}
function Summary({ text, setText }: any) {
  return (
    <>
      <p className="text-sm text-base-content/65">
        Write a concise overview of your experience, strengths, and career
        focus.
      </p>
      <textarea
        className="textarea min-h-52 w-full"
        maxLength={2000}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <p className="text-right text-xs text-base-content/60">
        {text.length}/2,000
      </p>
    </>
  )
}
function Skills({ resumeId, items, setItems, fail }: any) {
  const [name, setName] = useState('')
  const [busy, setBusy] = useState(false)
  async function add() {
    setBusy(true)
    try {
      const item = await createResumeSkill({ data: { resumeId, name } })
      setItems([...items, item])
      setName('')
    } catch (e: any) {
      fail(e.message || 'Unable to add skill.')
    } finally {
      setBusy(false)
    }
  }
  async function remove(id: string) {
    try {
      await deleteResumeSkill({ data: { resumeId, id } })
      setItems(items.filter((v: any) => v.id !== id))
    } catch {
      fail('Unable to remove skill.')
    }
  }
  return (
    <>
      <p className="text-sm text-base-content/65">
        Add the skills most relevant to the roles you are targeting.
      </p>
      <div className="join w-full">
        <input
          aria-label="Skill"
          className="input join-item w-full"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') void add()
          }}
        />
        <button
          className="btn join-item"
          disabled={busy}
          onClick={() => void add()}
        >
          Add
        </button>
      </div>
      {items.length ? (
        <ul className="flex flex-wrap gap-2" aria-label="Skills">
          {items.map((item: any, index: number) => (
            <li className="badge badge-soft gap-1 py-3" key={item.id}>
              {item.name}
              <button
                aria-label={`Remove ${item.name}`}
                onClick={() => void remove(item.id)}
              >
                ×
              </button>
              <button
                disabled={!index}
                aria-label={`Move ${item.name} up`}
                onClick={() =>
                  void reorder(
                    items,
                    index,
                    setItems,
                    reorderResumeSkills,
                    resumeId,
                    fail,
                  )
                }
              >
                <ArrowUp size={12} />
              </button>
              <button
                disabled={index === items.length - 1}
                aria-label={`Move ${item.name} down`}
                onClick={() =>
                  void reorder(
                    items,
                    index,
                    setItems,
                    reorderResumeSkills,
                    resumeId,
                    fail,
                    1,
                  )
                }
              >
                <ArrowDown size={12} />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="alert alert-soft">No skills added</div>
      )}
    </>
  )
}
function Entries({ kind, resumeId, items, setItems, fail }: any) {
  const [form, setForm] = useState<any>(null)
  const defaults: any = {
    work: {
      jobTitle: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      description: '',
    },
    education: {
      institution: '',
      qualification: '',
      fieldOfStudy: '',
      location: '',
      startDate: '',
      endDate: '',
      description: '',
    },
    projects: {
      name: '',
      role: '',
      description: '',
      technologies: '',
      projectUrl: '',
      repositoryUrl: '',
      startDate: '',
      endDate: '',
    },
  }
  const saveFn: any = {
    work: saveWorkExperience,
    education: saveEducationEntry,
    projects: saveResumeProject,
  }[kind]
  const deleteFn: any = {
    work: deleteWorkExperience,
    education: deleteEducationEntry,
    projects: deleteResumeProject,
  }[kind]
  const reorderFn: any = {
    work: reorderWorkExperiences,
    education: reorderEducationEntries,
    projects: reorderResumeProjects,
  }[kind]
  async function save() {
    try {
      const result = await saveFn({ data: { resumeId, ...form } })
      setItems(
        form.id
          ? items.map((v: any) => (v.id === result.id ? result : v))
          : [...items, result],
      )
      setForm(null)
      saveLandingToast({ message: 'Entry saved.', type: 'success' })
    } catch (e: unknown) {
      fail(userFacingError(e, 'Unable to save entry.'))
    }
  }
  return (
    <>
      {form ? (
        <EntryForm kind={kind} value={form} setValue={setForm} save={save} />
      ) : (
        <>
          <p className="text-sm text-base-content/65">
            {kind === 'work'
              ? 'Add your current or previous roles to show employers your professional background.'
              : kind === 'education'
                ? 'Add your educational background, qualifications, or certifications.'
                : 'Showcase personal, academic, freelance, or professional projects.'}
          </p>
          <button
            className="btn btn-sm"
            onClick={() => setForm(defaults[kind])}
          >
            <Plus size={16} />
            Add{' '}
            {kind === 'work'
              ? 'Work Experience'
              : kind === 'education'
                ? 'Education'
                : 'Project'}
          </button>
          {items.length ? (
            <ul className="list">
              {items.map((item: any, index: number) => (
                <li className="list-row border-b border-base-300" key={item.id}>
                  <div className="list-col-grow">
                    <strong>
                      {item.jobTitle || item.qualification || item.name}
                    </strong>
                    <p className="text-sm text-base-content/65">
                      {item.company || item.institution || item.role}
                    </p>
                  </div>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => setForm(item)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-ghost btn-sm"
                    aria-label="Delete entry"
                    onClick={() => {
                      if (window.confirm('Delete this entry?'))
                        void deleteFn({ data: { resumeId, id: item.id } })
                          .then(() =>
                            setItems(
                              items.filter((v: any) => v.id !== item.id),
                            ),
                          )
                          .catch(() => fail('Unable to delete entry.'))
                    }}
                  >
                    <Trash2 size={15} />
                  </button>
                  <button
                    className="btn btn-ghost btn-sm"
                    disabled={!index}
                    onClick={() =>
                      void reorder(
                        items,
                        index,
                        setItems,
                        reorderFn,
                        resumeId,
                        fail,
                      )
                    }
                  >
                    <ArrowUp size={15} />
                  </button>
                  <button
                    className="btn btn-ghost btn-sm"
                    disabled={index === items.length - 1}
                    onClick={() =>
                      void reorder(
                        items,
                        index,
                        setItems,
                        reorderFn,
                        resumeId,
                        fail,
                        1,
                      )
                    }
                  >
                    <ArrowDown size={15} />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="alert alert-soft">
              No {kind === 'work' ? 'work experience' : kind} added
            </div>
          )}
        </>
      )}
    </>
  )
}
function userFacingError(error: unknown, fallback: string) {
  if (!(error instanceof Error) || !error.message) return fallback
  try {
    const issues = JSON.parse(error.message)
    if (Array.isArray(issues)) {
      const firstMessage = issues.find(
        (issue) => typeof issue?.message === 'string',
      )?.message
      if (firstMessage) return firstMessage
    }
  } catch {
    // Server errors are usually already suitable for the user.
  }
  return error.message.startsWith('[{') ? fallback : error.message
}
function EntryForm({ kind, value, setValue, save }: any) {
  const names: any = {
    work: [
      ['jobTitle', 'Job title'],
      ['company', 'Company'],
      ['location', 'Location'],
      ['startDate', 'Start date', 'month'],
      ['endDate', 'End date', 'month'],
      ['description', 'Description', 'textarea'],
    ],
    education: [
      ['institution', 'Institution'],
      ['qualification', 'Qualification'],
      ['fieldOfStudy', 'Field of study'],
      ['location', 'Location'],
      ['startDate', 'Start date', 'month'],
      ['endDate', 'End date', 'month'],
      ['description', 'Description', 'textarea'],
    ],
    projects: [
      ['name', 'Project name'],
      ['role', 'Role'],
      ['technologies', 'Technologies (comma separated)'],
      ['projectUrl', 'Project URL', 'url'],
      ['repositoryUrl', 'Repository URL', 'url'],
      ['startDate', 'Start date', 'month'],
      ['endDate', 'End date', 'month'],
      ['description', 'Description', 'textarea'],
    ],
  }[kind]
  return (
    <div className="grid gap-3">
      {names.map(([key, label, type]: any) => (
        <fieldset className="fieldset" key={key}>
          <legend className="fieldset-legend">{label}</legend>
          {type === 'textarea' ? (
            <textarea
              className="textarea w-full"
              value={value[key]}
              onChange={(e) => setValue({ ...value, [key]: e.target.value })}
            />
          ) : (
            <input
              className="input w-full"
              type={type || 'text'}
              disabled={key === 'endDate' && value.isCurrent}
              value={value[key]}
              onChange={(e) => setValue({ ...value, [key]: e.target.value })}
            />
          )}
        </fieldset>
      ))}
      {kind === 'work' && (
        <label className="label justify-start gap-2">
          <input
            className="checkbox"
            type="checkbox"
            checked={value.isCurrent}
            onChange={(e) =>
              setValue({
                ...value,
                isCurrent: e.target.checked,
                endDate: e.target.checked ? '' : value.endDate,
              })
            }
          />
          Currently working here
        </label>
      )}
      <div className="card-actions justify-end">
        <button className="btn" onClick={save}>
          Save entry
        </button>
      </div>
    </div>
  )
}
async function reorder(
  items: any[],
  index: number,
  setItems: any,
  action: any,
  resumeId: string,
  fail: any,
  direction = -1,
) {
  const next = [...items]
  const target = index + direction
  ;[next[index], next[target]] = [next[target], next[index]]
  setItems(next)
  try {
    await action({ data: { resumeId, ids: next.map((v) => v.id) } })
  } catch {
    setItems(items)
    fail('Unable to reorder entries.')
  }
}
function TemplateSelector({ active, onSelect }: any) {
  return (
    <fieldset className="fieldset">
      <legend className="fieldset-legend">Template</legend>
      <p className="label mb-2">
        Choose a template. Page size and margins use print-ready A4 defaults.
      </p>
      <div className="grid gap-2 sm:grid-cols-3">
        {resumeTemplates.map((template) => (
          <button
            key={template.id}
            type="button"
            className={`card card-border text-left ${active === template.id ? 'border-primary' : ''}`}
            aria-pressed={active === template.id}
            onClick={() => onSelect(template.id)}
          >
            <span
              className={`block h-12 rounded-t-box ${template.id === 'classic' ? 'bg-base-300' : template.id === 'modern' ? 'bg-info/25' : 'bg-base-200'}`}
            />
            <span className="block p-3 text-sm font-semibold">
              {template.displayName}
              {active === template.id && (
                <span className="badge badge-success badge-xs ml-2">
                  Active
                </span>
              )}
              <small className="mt-1 block font-normal text-base-content/60">
                {template.description}
              </small>
            </span>
          </button>
        ))}
      </div>
    </fieldset>
  )
}
function Preview(props: any) {
  const normalized = useMemo(
    () => normalizeResume(props),
    [
      props.resume,
      props.profile,
      props.summary,
      props.work,
      props.education,
      props.skills,
      props.projects,
    ],
  )
  const Template = getResumeTemplate(props.templateId).renderer
  const pagesRef = useRef<HTMLDivElement>(null)
  const sourceTemplateRef = useRef<{
    key: string
    template: HTMLElement
  } | null>(null)
  const paginationKey = JSON.stringify(normalized)
  useLayoutEffect(() => {
    const pages = pagesRef.current
    const firstPage = pages?.querySelector<HTMLElement>('.resume-page')
    const firstTemplate =
      firstPage?.querySelector<HTMLElement>('.resume-template')
    if (!pages || !firstPage || !firstTemplate) return
    pages
      .querySelectorAll('.resume-page:not(:first-child)')
      .forEach((page) => page.remove())
    if (sourceTemplateRef.current?.key === paginationKey) {
      firstTemplate.replaceChildren(
        ...Array.from(sourceTemplateRef.current.template.childNodes).map(
          (node) => node.cloneNode(true),
        ),
      )
    } else {
      sourceTemplateRef.current = {
        key: paginationKey,
        template: firstTemplate.cloneNode(true) as HTMLElement,
      }
    }

    const createPage = () => {
      const page = firstPage.cloneNode(false) as HTMLElement
      const template = firstTemplate.cloneNode(false) as HTMLElement
      page.append(template)
      pages.append(page)
      return { page, template }
    }
    const splitLastSection = (page: HTMLElement, template: HTMLElement) => {
      const sections = Array.from(
        template.querySelectorAll<HTMLElement>(':scope > .resume-section'),
      )
      const section = sections.at(-1)
      if (!section) return false
      const next = createPage()
      if (sections.length > 1) {
        next.template.prepend(section)
        return true
      }

      const sectionItems = Array.from(section.children).slice(1)
      const item = sectionItems.at(-1)
      if (!item) return false
      const continuation = section.cloneNode(false) as HTMLElement
      const heading = section.querySelector('h2')
      if (heading) continuation.append(heading.cloneNode(true))
      continuation.append(item)
      next.template.append(continuation)
      return true
    }

    const pageList = [firstPage]
    for (const page of pageList) {
      const template = page.querySelector<HTMLElement>('.resume-template')
      if (!template) continue
      while (page.scrollHeight > page.clientHeight) {
        const existingPages = pages.querySelectorAll('.resume-page').length
        if (existingPages > 12 || !splitLastSection(page, template)) break
        const nextPage = pages.lastElementChild as HTMLElement
        pageList.push(nextPage)
      }
    }
  }, [paginationKey])
  return (
    <div className="resume-preview-shell rounded-box border border-base-300 bg-base-300 p-3 sm:p-4">
      <div className="resume-pages" ref={pagesRef}>
        <article
          className="resume-page mx-auto bg-white shadow-xl"
          key={paginationKey}
        >
          <Template resume={normalized} />
        </article>
      </div>
    </div>
  )
}
