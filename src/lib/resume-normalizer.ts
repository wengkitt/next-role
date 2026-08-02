import type {
  EducationEntry,
  ResumeProfile,
  ResumeProject,
  ResumeSkill,
  WorkExperience,
} from '#/data/resumes'

export type NormalizedResume = {
  name: string
  title: string
  contact: { label: string; href?: string }[]
  summary?: string
  work: (WorkExperience & { dateRange: string; bullets: string[] })[]
  education: (EducationEntry & { dateRange: string })[]
  skills: string[]
  projects: (ResumeProject & { dateRange: string; technologyList: string[] })[]
}

const present = (value?: string) => value?.trim() || undefined
const descriptionBullets = (value: string) =>
  value
    .split(/\n+|(?<=[.!?])\s+(?=[A-Z])/)
    .map((item) => item.trim())
    .filter(Boolean)
const month = (value?: string) =>
  value
    ? new Date(`${value}-01T00:00:00`).toLocaleDateString(undefined, {
        month: 'short',
        year: 'numeric',
      })
    : ''
const range = (start?: string, end?: string, current?: boolean) =>
  [month(start), current ? 'Present' : month(end)].filter(Boolean).join(' – ')

export function normalizeResume({
  resume,
  profile,
  summary,
  work,
  education,
  skills,
  projects,
}: {
  resume: { title: string }
  profile: ResumeProfile
  summary: string
  work: WorkExperience[]
  education: EducationEntry[]
  skills: ResumeSkill[]
  projects: ResumeProject[]
}): NormalizedResume {
  const links = [
    ['Website', profile.website],
    ['LinkedIn', profile.linkedinUrl],
    ['GitHub', profile.githubUrl],
  ] as const
  return {
    name: present(profile.fullName) ?? resume.title,
    title: present(profile.professionalTitle) ?? '',
    contact: [
      present(profile.email) && {
        label: profile.email,
        href: `mailto:${profile.email}`,
      },
      present(profile.phone) && {
        label: profile.phone,
        href: `tel:${profile.phone}`,
      },
      present(profile.location) && { label: profile.location },
      ...links.map(([label, href]) =>
        present(href) ? { label: href, href } : undefined,
      ),
    ].filter(Boolean) as { label: string; href?: string }[],
    summary: present(summary),
    work: [...work]
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((item) => ({
        ...item,
        dateRange: range(item.startDate, item.endDate, item.isCurrent),
        bullets: descriptionBullets(item.description),
      })),
    education: [...education]
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((item) => ({
        ...item,
        dateRange: range(item.startDate, item.endDate),
      })),
    skills: [...skills]
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((item) => item.name)
      .filter(Boolean),
    projects: [...projects]
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((item) => ({
        ...item,
        dateRange: range(item.startDate, item.endDate),
        technologyList: item.technologies
          .split(',')
          .map((tech) => tech.trim())
          .filter(Boolean),
      })),
  }
}
