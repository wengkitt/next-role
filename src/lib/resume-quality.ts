import type { ResumeDocumentData } from '#/lib/resume-document'

export type ResumeQualitySection =
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

export type ResumeQualitySeverity = 'success' | 'warning' | 'tip'

export type ResumeQualityCheck = {
  id: string
  section: ResumeQualitySection
  severity: ResumeQualitySeverity
  message: string
  action: string
}

export type ResumeQualityReport = {
  checks: ResumeQualityCheck[]
  completed: number
  total: number
  progress: number
  pageCount?: number
}

const words = (value: string) => value.trim().split(/\s+/).filter(Boolean)
const hasContact = (data: ResumeDocumentData) =>
  Boolean(
    data.profile.email ||
    data.profile.phone ||
    data.profile.website ||
    data.profile.linkedinUrl ||
    data.profile.githubUrl,
  )

function check(
  checks: ResumeQualityCheck[],
  value: boolean,
  item: Omit<ResumeQualityCheck, 'severity'>,
) {
  checks.push({ ...item, severity: value ? 'success' : 'warning' })
}

export function getResumeQualityReport(
  data: ResumeDocumentData,
  pageCount?: number,
): ResumeQualityReport {
  const checks: ResumeQualityCheck[] = []
  check(checks, Boolean(data.profile.name), {
    id: 'profile-name',
    section: 'profile',
    message: 'Add your full name.',
    action: 'Add your name',
  })
  check(checks, Boolean(data.profile.title), {
    id: 'profile-title',
    section: 'profile',
    message: 'Add a target professional title.',
    action: 'Add a target title',
  })
  check(checks, hasContact(data), {
    id: 'profile-contact',
    section: 'profile',
    message: 'Add at least one reliable contact method.',
    action: 'Add contact details',
  })

  const summaryWords = words(data.summary ?? '')
  check(checks, summaryWords.length >= 30, {
    id: 'summary-length',
    section: 'summary',
    message:
      summaryWords.length === 0
        ? 'Add a concise professional summary.'
        : 'Expand the summary to roughly 30 words or more.',
    action: 'Improve the summary',
  })
  if (summaryWords.length > 120) {
    checks.push({
      id: 'summary-concise',
      section: 'summary',
      severity: 'tip',
      message: 'Keep the summary focused; it is longer than 120 words.',
      action: 'Tighten the summary',
    })
  }

  if (data.experience.length === 0) {
    checks.push({
      id: 'work-add-entry',
      section: 'work',
      severity: 'tip',
      message: 'Add relevant experience, internships, or freelance work.',
      action: 'Add experience',
    })
  }
  for (const item of data.experience) {
    check(checks, Boolean(item.role && item.company), {
      id: `work-details-${item.id}`,
      section: 'work',
      message: 'Complete the role and company for each experience entry.',
      action: 'Complete experience details',
    })
    check(checks, Boolean(item.dateRange), {
      id: `work-dates-${item.id}`,
      section: 'work',
      message: 'Add dates for each experience entry.',
      action: 'Add experience dates',
    })
    const highlightCount = item.highlights.length
    check(checks, highlightCount >= 2, {
      id: `work-highlights-${item.id}`,
      section: 'work',
      message:
        highlightCount === 0
          ? 'Add two to five accomplishment highlights to this role.'
          : 'Add at least one more highlight to show impact.',
      action: 'Add highlights',
    })
    if (highlightCount > 5) {
      checks.push({
        id: `work-highlights-many-${item.id}`,
        section: 'work',
        severity: 'tip',
        message:
          'Consider trimming this role to its five strongest highlights.',
        action: 'Trim highlights',
      })
    }
    for (const [index, highlight] of item.highlights.entries()) {
      if (words(highlight).length > 45) {
        checks.push({
          id: `work-paragraph-${item.id}-${index}`,
          section: 'work',
          severity: 'warning',
          message:
            'Break up this long highlight into a focused accomplishment.',
          action: 'Shorten highlight',
        })
      }
      if (!/\d|%|[$€£]/.test(highlight)) {
        checks.push({
          id: `work-measure-${item.id}-${index}`,
          section: 'work',
          severity: 'tip',
          message: 'Add a measurable outcome where possible.',
          action: 'Add an outcome',
        })
      }
    }
  }

  for (const item of data.education) {
    check(checks, Boolean(item.qualification && item.institution), {
      id: `education-details-${item.id}`,
      section: 'education',
      message: 'Complete the qualification and institution.',
      action: 'Complete education details',
    })
    if (!item.dateRange) {
      checks.push({
        id: `education-dates-${item.id}`,
        section: 'education',
        severity: 'tip',
        message: 'Add dates to make your education timeline clear.',
        action: 'Add education dates',
      })
    }
  }

  check(checks, data.skills.length > 0, {
    id: 'skills-present',
    section: 'skills',
    message: 'Add skills that match the roles you are targeting.',
    action: 'Add skills',
  })

  for (const item of data.projects) {
    check(checks, Boolean(item.name), {
      id: `project-name-${item.id}`,
      section: 'projects',
      message: 'Give each project a clear name.',
      action: 'Name the project',
    })
    if (item.highlights.length === 0) {
      checks.push({
        id: `project-highlights-${item.id}`,
        section: 'projects',
        severity: 'tip',
        message: 'Add highlights describing your contribution and outcome.',
        action: 'Add project highlights',
      })
    }
    if (item.technologies.length === 0) {
      checks.push({
        id: `project-tools-${item.id}`,
        section: 'projects',
        severity: 'tip',
        message: 'List the tools or technologies used in this project.',
        action: 'Add project tools',
      })
    }
  }

  if (pageCount !== undefined && pageCount > 3) {
    checks.push({
      id: 'page-count',
      section: 'settings',
      severity: 'warning',
      message: `This resume is ${pageCount} pages; three pages is the soft target.`,
      action: 'Review length',
    })
  } else if (pageCount !== undefined) {
    checks.push({
      id: 'page-count',
      section: 'settings',
      severity: 'success',
      message: `The generated document is ${pageCount} page${pageCount === 1 ? '' : 's'}.`,
      action: 'Review preview',
    })
  }

  const required = checks.filter((item) => item.severity !== 'tip')
  const completed = required.filter(
    (item) => item.severity === 'success',
  ).length
  const total = required.length
  return {
    checks,
    completed,
    total,
    progress: total ? Math.round((completed / total) * 100) : 0,
    pageCount,
  }
}
