import type {
  EducationEntry,
  ResumeAward,
  ResumeCertification,
  ResumeLanguage,
  ResumeProfile,
  ResumeProject,
  ResumeSkill,
  ResumeVolunteer,
  WorkExperience,
} from '#/data/resumes'

export type ResumeProfileData = {
  name: string
  title: string
  email: string
  phone: string
  location: string
  website: string
  linkedinUrl: string
  githubUrl: string
}

export type ResumeExperienceData = {
  id: string
  role: string
  company: string
  location: string
  startDate: string
  endDate: string
  isCurrent: boolean
  dateRange: string
  highlights: string[]
}

export type ResumeEducationData = {
  id: string
  institution: string
  qualification: string
  fieldOfStudy: string
  location: string
  startDate: string
  endDate: string
  dateRange: string
  highlights: string[]
}

export type ResumeProjectData = {
  id: string
  name: string
  role: string
  startDate: string
  endDate: string
  dateRange: string
  technologies: string[]
  projectUrl: string
  repositoryUrl: string
  highlights: string[]
}

export type ResumeCertificationData = {
  id: string
  name: string
  issuer: string
  date: string
  credentialUrl: string
}

export type ResumeLanguageData = {
  id: string
  language: string
}

export type ResumeAwardData = {
  id: string
  title: string
  issuer: string
  date: string
  description: string
  highlights: string[]
}

export type ResumeVolunteerData = {
  id: string
  organization: string
  role: string
  startDate: string
  endDate: string
  dateRange: string
  highlights: string[]
}

export type ResumeDocumentSection =
  | 'summary'
  | 'experience'
  | 'skills'
  | 'projects'
  | 'education'
  | 'certifications'
  | 'languages'
  | 'awards'
  | 'volunteer'

export type ResumeDocumentData = {
  profile: ResumeProfileData
  summary?: string
  experience: ResumeExperienceData[]
  education: ResumeEducationData[]
  skills: string[]
  projects: ResumeProjectData[]
  certifications: ResumeCertificationData[]
  languages: ResumeLanguageData[]
  awards: ResumeAwardData[]
  volunteer: ResumeVolunteerData[]
  sectionOrder: ResumeDocumentSection[]
  hiddenSections: ResumeDocumentSection[]
}

export type ResumeDocumentInput = {
  resume: { title: string }
  profile: ResumeProfile
  summary: string
  work: WorkExperience[]
  education: EducationEntry[]
  skills: ResumeSkill[]
  projects: ResumeProject[]
  certifications?: ResumeCertification[]
  languages?: ResumeLanguage[]
  awards?: ResumeAward[]
  volunteer?: ResumeVolunteer[]
  sectionPreferences?: {
    order: ResumeDocumentSection[]
    hidden: ResumeDocumentSection[]
  }
}

export function parseHighlightLines(value?: string | null): string[] {
  const text = value?.replace(/\r\n?/g, '\n').trim() ?? ''
  if (!text) return []
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

export function formatResumeMonth(value?: string | null): string {
  if (!value) return ''
  const match = /^(\d{4})-(\d{2})$/.exec(value)
  if (!match) return value
  const [, year, month] = match
  const monthNumber = Number(month)
  if (!year || monthNumber < 1 || monthNumber > 12) return value
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(Number(year), monthNumber - 1, 1)))
}

export function formatResumeDateRange(
  start?: string | null,
  end?: string | null,
  current = false,
): string {
  return [
    formatResumeMonth(start),
    current ? 'Present' : formatResumeMonth(end),
  ]
    .filter(Boolean)
    .join(' - ')
}

const text = (value?: string | null) => value?.trim() ?? ''
const sortByOrder = <T extends { sortOrder: number }>(items: T[]) =>
  [...items].sort((a, b) => a.sortOrder - b.sortOrder)

export function normalizeResumeDocument(
  input: ResumeDocumentInput,
): ResumeDocumentData {
  const profile = input.profile
  const experience = sortByOrder(input.work).map((item) => ({
    id: item.id,
    role: text(item.jobTitle),
    company: text(item.company),
    location: text(item.location),
    startDate: text(item.startDate),
    endDate: text(item.endDate),
    isCurrent: item.isCurrent,
    dateRange: formatResumeDateRange(
      item.startDate,
      item.endDate,
      item.isCurrent,
    ),
    highlights: parseHighlightLines(item.description),
  }))
  const education = sortByOrder(input.education).map((item) => ({
    id: item.id,
    institution: text(item.institution),
    qualification: text(item.qualification),
    fieldOfStudy: text(item.fieldOfStudy),
    location: text(item.location),
    startDate: text(item.startDate),
    endDate: text(item.endDate),
    dateRange: formatResumeDateRange(item.startDate, item.endDate),
    highlights: parseHighlightLines(item.description),
  }))
  const projects = sortByOrder(input.projects).map((item) => ({
    id: item.id,
    name: text(item.name),
    role: text(item.role),
    startDate: text(item.startDate),
    endDate: text(item.endDate),
    dateRange: formatResumeDateRange(item.startDate, item.endDate),
    technologies: item.technologies
      .split(',')
      .map((technology) => technology.trim())
      .filter(Boolean),
    projectUrl: text(item.projectUrl),
    repositoryUrl: text(item.repositoryUrl),
    highlights: parseHighlightLines(item.description),
  }))
  return {
    profile: {
      name: text(profile.fullName) || text(input.resume.title),
      title: text(profile.professionalTitle),
      email: text(profile.email),
      phone: text(profile.phone),
      location: text(profile.location),
      website: text(profile.website),
      linkedinUrl: text(profile.linkedinUrl),
      githubUrl: text(profile.githubUrl),
    },
    summary: text(input.summary) || undefined,
    experience,
    education,
    skills: sortByOrder(input.skills)
      .map((item) => text(item.name))
      .filter(Boolean),
    projects,
    certifications: sortByOrder(input.certifications ?? []).map((item) => ({
      id: item.id,
      name: text(item.name),
      issuer: text(item.issuer),
      date: formatResumeMonth(item.date),
      credentialUrl: text(item.credentialUrl),
    })),
    languages: sortByOrder(input.languages ?? []).map((item) => ({
      id: item.id,
      language: text(item.language),
    })),
    awards: sortByOrder(input.awards ?? []).map((item) => ({
      id: item.id,
      title: text(item.title),
      issuer: text(item.issuer),
      date: formatResumeMonth(item.date),
      description: text(item.description),
      highlights: parseHighlightLines(item.description),
    })),
    volunteer: sortByOrder(input.volunteer ?? []).map((item) => ({
      id: item.id,
      organization: text(item.organization),
      role: text(item.role),
      startDate: text(item.startDate),
      endDate: text(item.endDate),
      dateRange: formatResumeDateRange(item.startDate, item.endDate),
      highlights: parseHighlightLines(item.description),
    })),
    sectionOrder: input.sectionPreferences?.order ?? [
      'summary',
      'experience',
      'education',
      'skills',
      'projects',
      'certifications',
      'languages',
      'awards',
      'volunteer',
    ],
    hiddenSections: input.sectionPreferences?.hidden ?? [],
  }
}
