import type {
  EducationEntry,
  ResumeAward,
  ResumeCertification,
  ResumeLanguage,
  ResumeProject,
  ResumeSectionPreferences,
  ResumeSkill,
  ResumeSummaryContent,
  ResumeVolunteer,
  WorkExperience,
} from '#/data/resumes'
import type { ProfileValues } from '#/data/resume-schemas'
import type { Dispatch, SetStateAction } from 'react'
import { useState } from 'react'

export type EditorSection =
  | 'profile'
  | 'summary'
  | 'work'
  | 'education'
  | 'skills'
  | 'projects'
  | 'certifications'
  | 'languages'
  | 'awards'
  | 'volunteer'
  | 'settings'

export type ResumeEditorInitialState = {
  profile: ProfileValues
  summary: ResumeSummaryContent
  work: WorkExperience[]
  education: EducationEntry[]
  skills: ResumeSkill[]
  projects: ResumeProject[]
  certifications: ResumeCertification[]
  languages: ResumeLanguage[]
  awards: ResumeAward[]
  volunteer: ResumeVolunteer[]
  sectionPreferences: ResumeSectionPreferences
}

const sections: EditorSection[] = [
  'profile',
  'summary',
  'work',
  'education',
  'skills',
  'projects',
  'certifications',
  'languages',
  'awards',
  'volunteer',
  'settings',
]

const initialDirtyState = () =>
  Object.fromEntries(sections.map((section) => [section, false])) as Record<
    EditorSection,
    boolean
  >

export function useResumeEditorState(initial: ResumeEditorInitialState) {
  const [section, setSection] = useState<EditorSection>('profile')
  const [profile, setProfile] = useState(initial.profile)
  const [summaryText, setSummaryText] = useState(initial.summary.content)
  const [work, setWork] = useState(initial.work)
  const [education, setEducation] = useState(initial.education)
  const [skills, setSkills] = useState(initial.skills)
  const [projects, setProjects] = useState(initial.projects)
  const [certifications, setCertifications] = useState(initial.certifications)
  const [languages, setLanguages] = useState(initial.languages)
  const [awards, setAwards] = useState(initial.awards)
  const [volunteer, setVolunteer] = useState(initial.volunteer)
  const [sectionPreferences, setSectionPreferences] = useState(
    initial.sectionPreferences,
  )
  const [dirtySections, setDirtySections] =
    useState<Record<EditorSection, boolean>>(initialDirtyState)
  const [savingSection, setSavingSection] = useState<EditorSection | null>(null)
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null)

  function markDirty(target: EditorSection) {
    setDirtySections((current) => ({ ...current, [target]: true }))
  }
  function markSaved(target: EditorSection) {
    setDirtySections((current) => ({ ...current, [target]: false }))
    setLastSavedAt(new Date())
  }
  function updateProfile(next: SetStateAction<ProfileValues>): void {
    setProfile(next)
    markDirty('profile')
  }
  function updateSummary(next: string) {
    setSummaryText(next)
    markDirty('summary')
  }
  function setCollection<T>(
    target: EditorSection,
    setter: Dispatch<SetStateAction<T[]>>,
    next: SetStateAction<T[]>,
  ) {
    setter(next)
    markDirty(target)
  }

  return {
    section,
    setSection,
    profile,
    updateProfile,
    summaryText,
    updateSummary,
    work,
    setWork: (next: SetStateAction<WorkExperience[]>) =>
      setCollection('work', setWork, next),
    education,
    setEducation: (next: SetStateAction<EducationEntry[]>) =>
      setCollection('education', setEducation, next),
    skills,
    setSkills: (next: SetStateAction<ResumeSkill[]>) =>
      setCollection('skills', setSkills, next),
    projects,
    setProjects: (next: SetStateAction<ResumeProject[]>) =>
      setCollection('projects', setProjects, next),
    certifications,
    setCertifications: (next: SetStateAction<ResumeCertification[]>) =>
      setCollection('certifications', setCertifications, next),
    languages,
    setLanguages: (next: SetStateAction<ResumeLanguage[]>) =>
      setCollection('languages', setLanguages, next),
    awards,
    setAwards: (next: SetStateAction<ResumeAward[]>) =>
      setCollection('awards', setAwards, next),
    volunteer,
    setVolunteer: (next: SetStateAction<ResumeVolunteer[]>) =>
      setCollection('volunteer', setVolunteer, next),
    sectionPreferences,
    setSectionPreferences: (next: SetStateAction<ResumeSectionPreferences>) => {
      setSectionPreferences(next)
      markDirty('settings')
    },
    dirtySections,
    markDirty,
    markSaved,
    savingSection,
    setSavingSection,
    lastSavedAt,
  }
}
