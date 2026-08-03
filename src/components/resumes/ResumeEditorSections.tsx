import { saveLandingToast } from '#/components/LandingToast'
import {
  awardSchema,
  certificationSchema,
  educationSchema,
  languageSchema,
  projectSchema,
  volunteerSchema,
  workExperienceSchema,
} from '#/data/resume-schemas'
import {
  createResumeSkill,
  deleteEducationEntry,
  deleteResumeAward,
  deleteResumeCertification,
  deleteResumeLanguage,
  deleteResumeProject,
  deleteResumeSkill,
  deleteResumeVolunteer,
  deleteWorkExperience,
  reorderEducationEntries,
  reorderWorkExperiences,
  saveEducationEntry,
  saveResumeAward,
  saveResumeCertification,
  saveResumeLanguage,
  saveResumeProject,
  saveResumeVolunteer,
  saveWorkExperience,
} from '#/data/resumes'
import type { ResumeSectionPreferences, ResumeSkill } from '#/data/resumes'
import type { ProfileValues } from '#/data/resume-schemas'
import type { ResumeDocumentSection } from '#/lib/resume-document'
import { popularLanguages } from '#/lib/languages'
import { userFacingError } from '#/lib/user-facing-error'
import { resumeTemplates } from '#/resume-templates/registry'
import type { TemplateId } from '#/resume-templates/registry'
import { ArrowDown, ArrowUp, Plus, Save, Trash2 } from 'lucide-react'
import { useState } from 'react'

const fields: { key: keyof ProfileValues; label: string; type?: string }[] = [
  { key: 'fullName', label: 'Full name' },
  { key: 'professionalTitle', label: 'Target professional title' },
  { key: 'email', label: 'Email', type: 'email' },
  { key: 'phone', label: 'Phone' },
  { key: 'location', label: 'Location' },
  { key: 'website', label: 'Portfolio or website', type: 'url' },
  { key: 'linkedinUrl', label: 'LinkedIn URL', type: 'url' },
  { key: 'githubUrl', label: 'GitHub URL', type: 'url' },
]

const sectionLabels: Record<ResumeDocumentSection, string> = {
  summary: 'Professional summary',
  experience: 'Work experience',
  skills: 'Skills',
  projects: 'Projects',
  education: 'Education',
  certifications: 'Certifications',
  languages: 'Languages',
  awards: 'Awards',
  volunteer: 'Volunteer work',
}

export function Profile({
  values,
  setValues,
}: {
  values: ProfileValues
  setValues: (next: ProfileValues) => void
}) {
  return (
    <div className="space-y-6">
      <p className="text-sm text-base-content/65">
        Start with the details recruiters use to identify and contact you.
      </p>
      <section aria-labelledby="contact-details-heading">
        <div className="mb-3">
          <h4 className="text-sm font-semibold" id="contact-details-heading">
            Contact details
          </h4>
          <p className="mt-0.5 text-xs text-base-content/60">
            Use a professional email and a location relevant to your target
            roles.
          </p>
        </div>
        <div className="grid gap-x-4 gap-y-3 sm:grid-cols-2">
          {fields.slice(0, 5).map((field) => (
            <ProfileField
              key={field.key}
              field={field}
              values={values}
              setValues={setValues}
            />
          ))}
        </div>
      </section>
      <section
        aria-labelledby="professional-links-heading"
        className="border-t border-base-300 pt-5"
      >
        <div className="mb-3">
          <h4 className="text-sm font-semibold" id="professional-links-heading">
            Professional links
          </h4>
          <p className="mt-0.5 text-xs text-base-content/60">
            The PDF shows compact labels such as Portfolio, LinkedIn, and
            GitHub.
          </p>
        </div>
        <div className="grid gap-x-4 gap-y-3 sm:grid-cols-2">
          {fields.slice(5).map((field) => (
            <ProfileField
              key={field.key}
              field={field}
              values={values}
              setValues={setValues}
            />
          ))}
        </div>
      </section>
    </div>
  )
}

function ProfileField({
  field,
  values,
  setValues,
}: {
  field: (typeof fields)[number]
  values: ProfileValues
  setValues: (next: ProfileValues) => void
}) {
  return (
    <fieldset className="fieldset">
      <legend className="fieldset-legend">{field.label}</legend>
      <input
        className="input w-full"
        type={field.type ?? 'text'}
        value={values[field.key]}
        onChange={(event) =>
          setValues({ ...values, [field.key]: event.target.value })
        }
      />
    </fieldset>
  )
}

export function Summary({
  text,
  setText,
}: {
  text: string
  setText: (value: string) => void
}) {
  return (
    <div className="grid gap-3">
      <p className="text-sm text-base-content/65">
        Write a focused overview of your experience, strongest skills, and the
        kind of role you want next. Aim for 30 to 120 words.
      </p>
      <textarea
        className="textarea min-h-52 w-full"
        maxLength={2000}
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="Example: Product designer with 6 years of experience..."
      />
      <p className="text-right text-xs text-base-content/60">
        {text.length}/2,000
      </p>
    </div>
  )
}

export function Skills({
  resumeId,
  items,
  setItems,
  onSaved,
  fail,
}: {
  resumeId: string
  items: ResumeSkill[]
  setItems: (
    next: ResumeSkill[] | ((current: ResumeSkill[]) => ResumeSkill[]),
  ) => void
  onSaved: () => void
  fail: (message: string) => void
}) {
  const [name, setName] = useState('')
  const [busy, setBusy] = useState(false)
  async function add() {
    if (!name.trim()) return fail('Enter a skill.')
    setBusy(true)
    try {
      const item = await createResumeSkill({
        data: { resumeId, name: name.trim() },
      })
      setItems([...items, item])
      setName('')
      onSaved()
    } catch (error) {
      fail(userFacingError(error, 'Unable to add skill.'))
    } finally {
      setBusy(false)
    }
  }
  async function remove(id: string) {
    try {
      await deleteResumeSkill({ data: { resumeId, id } })
      setItems(items.filter((item) => item.id !== id))
      onSaved()
    } catch (error) {
      fail(userFacingError(error, 'Unable to remove skill.'))
    }
  }
  return (
    <div className="grid gap-4">
      <p className="text-sm text-base-content/65">
        Use clean text in the PDF. Add only skills relevant to your target
        roles.
      </p>
      <div className="join w-full">
        <input
          aria-label="Skill"
          className="input join-item w-full"
          value={name}
          onChange={(event) => setName(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') void add()
          }}
          placeholder="e.g. Product strategy"
        />
        <button
          className="btn join-item"
          disabled={busy}
          onClick={() => void add()}
        >
          <Plus size={16} />
          Add
        </button>
      </div>
      {items.length ? (
        <ul className="grid gap-2" aria-label="Skills">
          {items.map((item) => (
            <li
              className="flex items-center gap-2 rounded-box border border-base-300 p-2"
              key={item.id}
            >
              <span className="min-w-0 flex-1 text-sm">{item.name}</span>
              <button
                className="btn btn-ghost btn-xs text-error"
                aria-label={`Remove ${item.name}`}
                onClick={() => void remove(item.id)}
              >
                <Trash2 size={14} />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="alert alert-soft">No skills added yet.</div>
      )}
    </div>
  )
}

export type EntryKind =
  | 'work'
  | 'education'
  | 'projects'
  | 'certifications'
  | 'languages'
  | 'awards'
  | 'volunteer'

const entryNames: Record<EntryKind, string> = {
  work: 'work experience',
  education: 'education',
  projects: 'project',
  certifications: 'certification',
  languages: 'language',
  awards: 'award',
  volunteer: 'volunteer role',
}

const entryDefaults: Record<EntryKind, Record<string, string | boolean>> = {
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
  certifications: { name: '', issuer: '', date: '', credentialUrl: '' },
  languages: { language: '' },
  awards: { title: '', issuer: '', date: '', description: '' },
  volunteer: {
    organization: '',
    role: '',
    startDate: '',
    endDate: '',
    description: '',
  },
}

const entryActions: Record<
  EntryKind,
  { save: any; remove: any; reorder?: any; schema: any }
> = {
  work: {
    save: saveWorkExperience,
    remove: deleteWorkExperience,
    reorder: reorderWorkExperiences,
    schema: workExperienceSchema,
  },
  education: {
    save: saveEducationEntry,
    remove: deleteEducationEntry,
    reorder: reorderEducationEntries,
    schema: educationSchema,
  },
  projects: {
    save: saveResumeProject,
    remove: deleteResumeProject,
    schema: projectSchema,
  },
  certifications: {
    save: saveResumeCertification,
    remove: deleteResumeCertification,
    schema: certificationSchema,
  },
  languages: {
    save: saveResumeLanguage,
    remove: deleteResumeLanguage,
    schema: languageSchema,
  },
  awards: {
    save: saveResumeAward,
    remove: deleteResumeAward,
    schema: awardSchema,
  },
  volunteer: {
    save: saveResumeVolunteer,
    remove: deleteResumeVolunteer,
    schema: volunteerSchema,
  },
}

export function Entries({
  kind,
  resumeId,
  items,
  setItems,
  onSaved,
  fail,
}: {
  kind: EntryKind
  resumeId: string
  items: any[]
  setItems: (next: any[] | ((current: any[]) => any[])) => void
  onSaved: () => void
  fail: (message: string) => void
}) {
  const [form, setForm] = useState<Record<string, string | boolean> | null>(
    null,
  )
  const action = entryActions[kind]
  async function save() {
    if (!form) return
    const parsed = action.schema.safeParse({ resumeId, ...form })
    if (!parsed.success)
      return fail(
        parsed.error.issues[0]?.message ?? `Check this ${entryNames[kind]}.`,
      )
    try {
      const result = await action.save({ data: parsed.data })
      setItems(
        form.id
          ? items.map((item) => (item.id === result.id ? result : item))
          : [...items, result],
      )
      setForm(null)
      onSaved()
      saveLandingToast({
        message: `${capitalize(entryNames[kind])} saved.`,
        type: 'success',
      })
    } catch (error) {
      fail(userFacingError(error, `Unable to save ${entryNames[kind]}.`))
    }
  }
  async function remove(id: string) {
    if (!window.confirm(`Delete this ${entryNames[kind]}?`)) return
    try {
      await action.remove({ data: { resumeId, id } })
      setItems(items.filter((item) => item.id !== id))
      onSaved()
    } catch (error) {
      fail(userFacingError(error, `Unable to delete ${entryNames[kind]}.`))
    }
  }
  async function move(index: number, direction: -1 | 1) {
    if (!action.reorder) return
    const target = index + direction
    if (target < 0 || target >= items.length) return
    const next = [...items]
    ;[next[index], next[target]] = [next[target], next[index]]
    const ordered = next.map((item, sortOrder) => ({ ...item, sortOrder }))
    setItems(ordered)
    try {
      await action.reorder({
        data: { resumeId, ids: ordered.map((item) => item.id) },
      })
      onSaved()
    } catch (error) {
      setItems(items)
      fail(userFacingError(error, `Unable to reorder ${entryNames[kind]}s.`))
    }
  }
  if (form)
    return (
      <EntryForm
        kind={kind}
        value={form}
        setValue={setForm}
        save={() => void save()}
        cancel={() => setForm(null)}
      />
    )
  return (
    <div className="grid gap-4">
      <p className="text-sm text-base-content/65">{entryDescription(kind)}</p>
      <button
        className="btn btn-sm w-fit"
        onClick={() => setForm({ ...entryDefaults[kind] })}
      >
        <Plus size={16} />
        Add {capitalize(entryNames[kind])}
      </button>
      {items.length ? (
        <ul className="grid gap-2">
          {items.map((item, index) => (
            <li
              className="flex flex-wrap items-center gap-2 rounded-box border border-base-300 p-3"
              key={item.id}
            >
              <div className="min-w-0 flex-1">
                <strong className="block truncate">
                  {item.jobTitle ||
                    item.qualification ||
                    item.name ||
                    item.language ||
                    item.title ||
                    item.organization}
                </strong>
                {entrySecondaryText(item) ? (
                  <span className="block truncate text-sm text-base-content/60">
                    {entrySecondaryText(item)}
                  </span>
                ) : null}
              </div>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setForm({ ...item })}
              >
                Edit
              </button>
              <button
                className="btn btn-ghost btn-sm text-error"
                aria-label={`Delete ${entryNames[kind]}`}
                onClick={() => void remove(item.id)}
              >
                <Trash2 size={15} />
              </button>
              {action.reorder && (
                <>
                  <button
                    className="btn btn-ghost btn-sm"
                    disabled={!index}
                    aria-label="Move up"
                    onClick={() => void move(index, -1)}
                  >
                    <ArrowUp size={15} />
                  </button>
                  <button
                    className="btn btn-ghost btn-sm"
                    disabled={index === items.length - 1}
                    aria-label="Move down"
                    onClick={() => void move(index, 1)}
                  >
                    <ArrowDown size={15} />
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <div className="alert alert-soft">No {entryNames[kind]} added yet.</div>
      )}
    </div>
  )
}

function entryDescription(kind: EntryKind) {
  if (kind === 'work')
    return 'Add the roles that best show your professional background. Use one achievement or responsibility per highlight line.'
  if (kind === 'education')
    return 'Add degrees, qualifications, or relevant training. Keep older details concise.'
  if (kind === 'projects')
    return 'Show personal, academic, freelance, or professional projects that strengthen your application.'
  if (kind === 'certifications')
    return 'Add credentials that are relevant to the role. They render only when populated.'
  if (kind === 'languages') return 'Select the languages you speak.'
  if (kind === 'awards')
    return 'Add meaningful recognition, grants, or competition results.'
  return 'Add community, nonprofit, or leadership work that supports your professional story.'
}

function entrySecondaryText(item: any) {
  return item.company || item.institution || item.role || item.issuer || ''
}

type EntryField = {
  key: string
  label: string
  type?: 'month' | 'url' | 'textarea'
}
const entryFields: Record<EntryKind, EntryField[]> = {
  work: [
    { key: 'jobTitle', label: 'Job title' },
    { key: 'company', label: 'Company' },
    { key: 'location', label: 'Location' },
    { key: 'startDate', label: 'Start date', type: 'month' },
    { key: 'endDate', label: 'End date', type: 'month' },
    { key: 'description', label: 'Highlights', type: 'textarea' },
  ],
  education: [
    { key: 'institution', label: 'Institution' },
    { key: 'qualification', label: 'Qualification' },
    { key: 'fieldOfStudy', label: 'Field of study' },
    { key: 'location', label: 'Location' },
    { key: 'startDate', label: 'Start date', type: 'month' },
    { key: 'endDate', label: 'End date', type: 'month' },
    { key: 'description', label: 'Highlights or details', type: 'textarea' },
  ],
  projects: [
    { key: 'name', label: 'Project name' },
    { key: 'role', label: 'Your role' },
    { key: 'technologies', label: 'Tools or technologies (comma separated)' },
    { key: 'projectUrl', label: 'Project URL', type: 'url' },
    { key: 'repositoryUrl', label: 'Repository URL', type: 'url' },
    { key: 'startDate', label: 'Start date', type: 'month' },
    { key: 'endDate', label: 'End date', type: 'month' },
    { key: 'description', label: 'Highlights', type: 'textarea' },
  ],
  certifications: [
    { key: 'name', label: 'Certification name' },
    { key: 'issuer', label: 'Issuer' },
    { key: 'date', label: 'Date', type: 'month' },
    { key: 'credentialUrl', label: 'Credential URL', type: 'url' },
  ],
  languages: [{ key: 'language', label: 'Language' }],
  awards: [
    { key: 'title', label: 'Award title' },
    { key: 'issuer', label: 'Issuer' },
    { key: 'date', label: 'Date', type: 'month' },
    { key: 'description', label: 'Description', type: 'textarea' },
  ],
  volunteer: [
    { key: 'organization', label: 'Organization' },
    { key: 'role', label: 'Role' },
    { key: 'startDate', label: 'Start date', type: 'month' },
    { key: 'endDate', label: 'End date', type: 'month' },
    { key: 'description', label: 'Highlights', type: 'textarea' },
  ],
}

function EntryForm({
  kind,
  value,
  setValue,
  save,
  cancel,
}: {
  kind: EntryKind
  value: Record<string, string | boolean>
  setValue: (next: Record<string, string | boolean>) => void
  save: () => void
  cancel: () => void
}) {
  return (
    <div className="grid gap-3 rounded-box border border-base-300 bg-base-200/20 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h4 className="font-semibold">
            {value.id ? `Edit ${entryNames[kind]}` : `Add ${entryNames[kind]}`}
          </h4>
          <p className="mt-1 text-xs text-base-content/60">
            {kind === 'languages' ? (
              'Choose a language from the list.'
            ) : (
              <>
                For highlights, enter one bullet per line. Existing paragraphs
                remain one bullet.
              </>
            )}
          </p>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={cancel}>
          Cancel
        </button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {entryFields[kind].map((field) => (
          <fieldset
            className={`fieldset ${field.type === 'textarea' ? 'sm:col-span-2' : ''}`}
            key={field.key}
          >
            <legend className="fieldset-legend">{field.label}</legend>
            {kind === 'languages' && field.key === 'language' ? (
              <LanguageSelect value={value} setValue={setValue} />
            ) : field.type === 'textarea' ? (
              <textarea
                className="textarea min-h-28 w-full"
                value={String(value[field.key] ?? '')}
                onChange={(event) =>
                  setValue({ ...value, [field.key]: event.target.value })
                }
              />
            ) : (
              <input
                className="input w-full"
                type={field.type ?? 'text'}
                disabled={
                  kind === 'work' &&
                  field.key === 'endDate' &&
                  value.isCurrent === true
                }
                value={String(value[field.key] ?? '')}
                onChange={(event) =>
                  setValue({ ...value, [field.key]: event.target.value })
                }
              />
            )}
          </fieldset>
        ))}
      </div>
      {kind === 'work' && (
        <label className="label justify-start gap-2">
          <input
            className="checkbox"
            type="checkbox"
            checked={value.isCurrent === true}
            onChange={(event) =>
              setValue({
                ...value,
                isCurrent: event.target.checked,
                endDate: event.target.checked ? '' : value.endDate,
              })
            }
          />
          Currently working here
        </label>
      )}
      <div className="card-actions justify-end">
        <button className="btn btn-primary" onClick={save}>
          <Save size={16} />
          Save {entryNames[kind]}
        </button>
      </div>
    </div>
  )
}

function LanguageSelect({
  value,
  setValue,
}: {
  value: Record<string, string | boolean>
  setValue: (next: Record<string, string | boolean>) => void
}) {
  const currentLanguage = String(value.language ?? '')
  const isLegacyLanguage =
    currentLanguage &&
    !popularLanguages.includes(
      currentLanguage as (typeof popularLanguages)[number],
    )

  return (
    <select
      className="select w-full"
      value={currentLanguage}
      onChange={(event) => setValue({ ...value, language: event.target.value })}
    >
      <option value="" disabled>
        Select a language
      </option>
      {isLegacyLanguage && (
        <option value={currentLanguage}>{currentLanguage}</option>
      )}
      {popularLanguages.map((language) => (
        <option key={language} value={language}>
          {language}
        </option>
      ))}
    </select>
  )
}

export function Settings({
  activeTemplate,
  onTemplateSelect,
  preferences,
  setPreferences,
}: {
  activeTemplate: TemplateId
  onTemplateSelect: (id: TemplateId) => void
  preferences: ResumeSectionPreferences
  setPreferences: (next: ResumeSectionPreferences) => void
}) {
  const canHide = (section: ResumeDocumentSection) =>
    !['summary', 'experience', 'skills'].includes(section)
  function toggleHidden(section: ResumeDocumentSection) {
    const hidden = preferences.hidden.includes(section)
      ? preferences.hidden.filter((item) => item !== section)
      : [...preferences.hidden, section]
    setPreferences({ ...preferences, hidden })
  }
  return (
    <div className="grid gap-7">
      <div>
        <h4 className="text-sm font-semibold">Templates</h4>
        <p className="mt-1 text-xs text-base-content/60">
          All variants keep a single-column, searchable A4 structure.
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {resumeTemplates.map((template) => (
            <button
              key={template.id}
              type="button"
              className={`card card-border text-left transition ${activeTemplate === template.id ? 'border-primary bg-primary/5' : ''}`}
              aria-pressed={activeTemplate === template.id}
              onClick={() => onTemplateSelect(template.id)}
            >
              <span
                className={`block h-12 rounded-t-box ${template.id === 'classic' ? 'bg-base-300' : template.id === 'modern' ? 'bg-info/25' : 'bg-base-200'}`}
              />
              <span className="block p-3 text-sm font-semibold">
                {template.displayName}
                {activeTemplate === template.id && (
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
      </div>
      <div className="border-t border-base-300 pt-6">
        <div className="mb-3">
          <h4 className="text-sm font-semibold">Document section order</h4>
          <p className="mt-1 text-xs text-base-content/60">
            Sections use a standard recruiter-friendly order. Optional sections
            can be hidden when they are not relevant.
          </p>
        </div>
        <ul className="grid gap-2">
          {preferences.order.map((section) => (
            <li
              className="flex items-center gap-2 rounded-box border border-base-300 p-2"
              key={section}
            >
              <span className="min-w-0 flex-1 text-sm">
                {sectionLabels[section]}
                {preferences.hidden.includes(section) && (
                  <span className="badge badge-ghost badge-xs ml-2">
                    Hidden
                  </span>
                )}
              </span>
              {canHide(section) && (
                <button
                  className="btn btn-ghost btn-xs"
                  onClick={() => toggleHidden(section)}
                >
                  {preferences.hidden.includes(section) ? 'Show' : 'Hide'}
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}
