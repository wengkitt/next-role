import { createServerFn } from '@tanstack/react-start'
import {
  createResumeSchema,
  awardSchema,
  certificationSchema,
  deleteEntrySchema,
  educationSchema,
  languageSchema,
  profileSchema,
  projectSchema,
  reorderSchema,
  renameResumeSchema,
  resumeActionSchema,
  sectionPreferencesSchema,
  skillSchema,
  summarySchema,
  templateSchema,
  volunteerSchema,
  workExperienceSchema,
} from './resume-schemas'

export type ResumeSummary = {
  id: string
  title: string
  status: 'draft' | 'complete' | 'archived'
  templateId: 'classic' | 'modern' | 'minimal'
  createdAt: string
  updatedAt: string
}

export type ResumeProfile = {
  fullName: string
  professionalTitle: string
  email: string
  phone: string
  location: string
  website: string
  linkedinUrl: string
  githubUrl: string
}

export type ResumeSummaryContent = { content: string }
export type ResumeSectionId =
  | 'summary'
  | 'experience'
  | 'skills'
  | 'projects'
  | 'education'
  | 'certifications'
  | 'languages'
  | 'awards'
  | 'volunteer'
export type ResumeSectionPreferences = {
  order: ResumeSectionId[]
  hidden: ResumeSectionId[]
}
export type WorkExperience = {
  id: string
  jobTitle: string
  company: string
  location: string
  startDate: string
  endDate: string
  isCurrent: boolean
  description: string
  sortOrder: number
}
export type EducationEntry = {
  id: string
  institution: string
  qualification: string
  fieldOfStudy: string
  location: string
  startDate: string
  endDate: string
  description: string
  sortOrder: number
}
export type ResumeSkill = { id: string; name: string; sortOrder: number }
export type ResumeProject = {
  id: string
  name: string
  role: string
  description: string
  technologies: string
  projectUrl: string
  repositoryUrl: string
  startDate: string
  endDate: string
  sortOrder: number
}
export type ResumeCertification = {
  id: string
  name: string
  issuer: string
  date: string
  credentialUrl: string
  sortOrder: number
}
export type ResumeLanguage = {
  id: string
  language: string
  sortOrder: number
}
export type ResumeAward = {
  id: string
  title: string
  issuer: string
  date: string
  description: string
  sortOrder: number
}
export type ResumeVolunteer = {
  id: string
  organization: string
  role: string
  startDate: string
  endDate: string
  description: string
  sortOrder: number
}

async function requireUser() {
  const [{ auth }, { getRequestHeaders }] = await Promise.all([
    import('#/auth'),
    import('@tanstack/react-start/server'),
  ])
  const session = await auth.api.getSession({ headers: getRequestHeaders() })
  if (!session) throw new Error('Unauthorized')
  return session.user
}

const toSummary = (resume: {
  id: string
  title: string
  status: ResumeSummary['status']
  templateId: ResumeSummary['templateId']
  createdAt: Date
  updatedAt: Date
}): ResumeSummary => ({
  id: resume.id,
  title: resume.title,
  status: resume.status,
  templateId: resume.templateId,
  createdAt: resume.createdAt.toISOString(),
  updatedAt: resume.updatedAt.toISOString(),
})

export const getResumeSummaries = createServerFn({ method: 'GET' }).handler(
  async () => {
    const user = await requireUser()
    const [{ desc, eq }, { db }, { resumes }] = await Promise.all([
      import('drizzle-orm'),
      import('#/db'),
      import('#/db/schema'),
    ])
    const rows = await db
      .select()
      .from(resumes)
      .where(eq(resumes.userId, user.id))
      .orderBy(desc(resumes.updatedAt))
    return rows.map(toSummary)
  },
)

export const createResume = createServerFn({ method: 'POST' })
  .validator(createResumeSchema)
  .handler(async ({ data }) => {
    const user = await requireUser()
    const [{ db }, { resumes }] = await Promise.all([
      import('#/db'),
      import('#/db/schema'),
    ])
    const now = new Date()
    const resume = {
      id: crypto.randomUUID(),
      userId: user.id,
      title: data.title,
      status: 'draft' as const,
      templateId: 'classic' as const,
      createdAt: now,
      updatedAt: now,
    }
    await db.insert(resumes).values(resume)
    return toSummary(resume)
  })

export const renameResume = createServerFn({ method: 'POST' })
  .validator(renameResumeSchema)
  .handler(async ({ data }) => {
    const user = await requireUser()
    const [{ and, eq }, { db }, { resumes }] = await Promise.all([
      import('drizzle-orm'),
      import('#/db'),
      import('#/db/schema'),
    ])
    const now = new Date()
    const result = await db
      .update(resumes)
      .set({ title: data.title, updatedAt: now })
      .where(and(eq(resumes.id, data.resumeId), eq(resumes.userId, user.id)))
      .returning()
    if (!result[0]) throw new Error('Resume not found')
    return toSummary(result[0])
  })

export const saveResumeTemplate = createServerFn({ method: 'POST' })
  .validator(templateSchema)
  .handler(async ({ data }) => {
    const user = await requireUser()
    const [{ and, eq }, { db }, { resumes }] = await Promise.all([
      import('drizzle-orm'),
      import('#/db'),
      import('#/db/schema'),
    ])
    const result = await db
      .update(resumes)
      .set({ templateId: data.templateId, updatedAt: new Date() })
      .where(and(eq(resumes.id, data.resumeId), eq(resumes.userId, user.id)))
      .returning()
    if (!result[0]) throw new Error('Resume not found')
    return toSummary(result[0])
  })

export const saveResumeSectionPreferences = createServerFn({ method: 'POST' })
  .validator(sectionPreferencesSchema)
  .handler(async ({ data }) => {
    const user = await requireUser()
    const [{ and, eq }, { db }, { resumes }] = await Promise.all([
      import('drizzle-orm'),
      import('#/db'),
      import('#/db/schema'),
    ])
    const now = new Date()
    const result = await db
      .update(resumes)
      .set({
        sectionOrder: JSON.stringify(defaultSectionOrder),
        hiddenSections: JSON.stringify(data.hidden),
        updatedAt: now,
      })
      .where(and(eq(resumes.id, data.resumeId), eq(resumes.userId, user.id)))
      .returning({ id: resumes.id })
    if (!result[0]) throw new Error('Resume not found')
    return {
      order: defaultSectionOrder,
      hidden: data.hidden,
      updatedAt: now.toISOString(),
    }
  })

export const duplicateResume = createServerFn({ method: 'POST' })
  .validator(resumeActionSchema)
  .handler(async ({ data }) => {
    const user = await requireUser()
    const [{ and, eq }, { db }, { resumes }] = await Promise.all([
      import('drizzle-orm'),
      import('#/db'),
      import('#/db/schema'),
    ])
    const source = await db
      .select()
      .from(resumes)
      .where(and(eq(resumes.id, data.resumeId), eq(resumes.userId, user.id)))
      .get()
    if (!source) throw new Error('Resume not found')
    const now = new Date()
    const copy = {
      id: crypto.randomUUID(),
      userId: user.id,
      title: `${source.title} Copy`,
      status: 'draft' as const,
      templateId: source.templateId,
      createdAt: now,
      updatedAt: now,
    }
    await db.insert(resumes).values(copy)
    return toSummary(copy)
  })

export const deleteResume = createServerFn({ method: 'POST' })
  .validator(resumeActionSchema)
  .handler(async ({ data }) => {
    const user = await requireUser()
    const [{ and, eq }, { db }, { resumes }] = await Promise.all([
      import('drizzle-orm'),
      import('#/db'),
      import('#/db/schema'),
    ])
    const result = await db
      .delete(resumes)
      .where(and(eq(resumes.id, data.resumeId), eq(resumes.userId, user.id)))
      .returning({ id: resumes.id })
    if (!result[0]) throw new Error('Resume not found')
  })

export const getResumeEditorData = createServerFn({ method: 'GET' })
  .validator(resumeActionSchema)
  .handler(async ({ data }) => {
    const user = await requireUser()
    const [
      { and, asc, eq },
      { db },
      {
        educationEntries,
        resumeAwards,
        resumeCertifications,
        resumeLanguages,
        resumeProfiles,
        resumeProjects,
        resumeSkills,
        resumeSummaries,
        resumeVolunteer,
        resumes,
        workExperiences,
      },
    ] = await Promise.all([
      import('drizzle-orm'),
      import('#/db'),
      import('#/db/schema'),
    ])
    const resume = await db
      .select()
      .from(resumes)
      .where(and(eq(resumes.id, data.resumeId), eq(resumes.userId, user.id)))
      .get()
    if (!resume) return null
    const profile = await db
      .select()
      .from(resumeProfiles)
      .where(eq(resumeProfiles.resumeId, resume.id))
      .get()
    const [
      summary,
      work,
      education,
      skills,
      projects,
      certifications,
      languages,
      awards,
      volunteer,
    ] = await Promise.all([
      db
        .select()
        .from(resumeSummaries)
        .where(eq(resumeSummaries.resumeId, resume.id))
        .get(),
      db
        .select()
        .from(workExperiences)
        .where(eq(workExperiences.resumeId, resume.id))
        .orderBy(asc(workExperiences.sortOrder))
        .all(),
      db
        .select()
        .from(educationEntries)
        .where(eq(educationEntries.resumeId, resume.id))
        .orderBy(asc(educationEntries.sortOrder))
        .all(),
      db
        .select()
        .from(resumeSkills)
        .where(eq(resumeSkills.resumeId, resume.id))
        .orderBy(asc(resumeSkills.sortOrder))
        .all(),
      db
        .select()
        .from(resumeProjects)
        .where(eq(resumeProjects.resumeId, resume.id))
        .orderBy(asc(resumeProjects.sortOrder))
        .all(),
      db
        .select()
        .from(resumeCertifications)
        .where(eq(resumeCertifications.resumeId, resume.id))
        .orderBy(asc(resumeCertifications.sortOrder))
        .all(),
      db
        .select()
        .from(resumeLanguages)
        .where(eq(resumeLanguages.resumeId, resume.id))
        .orderBy(asc(resumeLanguages.sortOrder))
        .all(),
      db
        .select()
        .from(resumeAwards)
        .where(eq(resumeAwards.resumeId, resume.id))
        .orderBy(asc(resumeAwards.sortOrder))
        .all(),
      db
        .select()
        .from(resumeVolunteer)
        .where(eq(resumeVolunteer.resumeId, resume.id))
        .orderBy(asc(resumeVolunteer.sortOrder))
        .all(),
    ])
    return {
      resume: toSummary(resume),
      profile: {
        fullName: profile?.fullName ?? '',
        professionalTitle: profile?.professionalTitle ?? '',
        email: profile?.email ?? '',
        phone: profile?.phone ?? '',
        location: profile?.location ?? '',
        website: profile?.website ?? '',
        linkedinUrl: profile?.linkedinUrl ?? '',
        githubUrl: profile?.githubUrl ?? '',
      } satisfies ResumeProfile,
      summary: {
        content: summary?.content ?? '',
      } satisfies ResumeSummaryContent,
      workExperiences: work.map(workResult),
      educationEntries: education.map(educationResult),
      skills,
      projects: projects.map(projectResult),
      certifications: certifications.map(certificationResult),
      languages: languages.map(languageResult),
      awards: awards.map(awardResult),
      volunteer: volunteer.map(volunteerResult),
      sectionPreferences: parseSectionPreferences(resume.hiddenSections),
    }
  })

const defaultSectionOrder: ResumeSectionId[] = [
  'summary',
  'experience',
  'education',
  'skills',
  'projects',
  'certifications',
  'languages',
  'awards',
  'volunteer',
]

function parseSectionPreferences(hidden: string): ResumeSectionPreferences {
  const isSection = (value: unknown): value is ResumeSectionId =>
    typeof value === 'string' &&
    defaultSectionOrder.includes(value as ResumeSectionId)
  const read = (value: string) => {
    try {
      const parsed: unknown = JSON.parse(value || '[]')
      return Array.isArray(parsed) ? parsed.filter(isSection) : []
    } catch {
      return []
    }
  }
  return {
    order: [...defaultSectionOrder],
    hidden: read(hidden),
  }
}

export const saveResumeProfile = createServerFn({ method: 'POST' })
  .validator(profileSchema)
  .handler(async ({ data }) => {
    const user = await requireUser()
    const [{ and, eq }, { db }, { resumeProfiles, resumes }] =
      await Promise.all([
        import('drizzle-orm'),
        import('#/db'),
        import('#/db/schema'),
      ])
    const ownedResume = await db
      .select({ id: resumes.id })
      .from(resumes)
      .where(and(eq(resumes.id, data.resumeId), eq(resumes.userId, user.id)))
      .get()
    if (!ownedResume) throw new Error('Resume not found')
    const now = new Date()
    const values = {
      fullName: data.fullName || null,
      professionalTitle: data.professionalTitle || null,
      email: data.email || null,
      phone: data.phone || null,
      location: data.location || null,
      website: data.website || null,
      linkedinUrl: data.linkedinUrl || null,
      githubUrl: data.githubUrl || null,
      updatedAt: now,
    }
    const existing = await db
      .select({ id: resumeProfiles.id })
      .from(resumeProfiles)
      .where(eq(resumeProfiles.resumeId, ownedResume.id))
      .get()
    if (existing)
      await db
        .update(resumeProfiles)
        .set(values)
        .where(eq(resumeProfiles.id, existing.id))
    else
      await db.insert(resumeProfiles).values({
        id: crypto.randomUUID(),
        resumeId: ownedResume.id,
        ...values,
        createdAt: now,
      })
    await db
      .update(resumes)
      .set({ updatedAt: now })
      .where(and(eq(resumes.id, ownedResume.id), eq(resumes.userId, user.id)))
    return {
      fullName: data.fullName ?? '',
      professionalTitle: data.professionalTitle ?? '',
      email: data.email,
      phone: data.phone ?? '',
      location: data.location ?? '',
      website: data.website,
      linkedinUrl: data.linkedinUrl,
      githubUrl: data.githubUrl,
      updatedAt: now.toISOString(),
    }
  })

async function requireOwnedResume(resumeId: string, userId: string) {
  const [{ and, eq }, { db }, { resumes }] = await Promise.all([
    import('drizzle-orm'),
    import('#/db'),
    import('#/db/schema'),
  ])
  const resume = await db
    .select({ id: resumes.id })
    .from(resumes)
    .where(and(eq(resumes.id, resumeId), eq(resumes.userId, userId)))
    .get()
  if (!resume) throw new Error('Resume not found')
  return resume
}

async function touchResume(resumeId: string, userId: string, now = new Date()) {
  const [{ and, eq }, { db }, { resumes }] = await Promise.all([
    import('drizzle-orm'),
    import('#/db'),
    import('#/db/schema'),
  ])
  await db
    .update(resumes)
    .set({ updatedAt: now })
    .where(and(eq(resumes.id, resumeId), eq(resumes.userId, userId)))
  return now
}

const nullable = (value: string | undefined) => value || null

export const saveProfessionalSummary = createServerFn({ method: 'POST' })
  .validator(summarySchema)
  .handler(async ({ data }) => {
    const user = await requireUser()
    await requireOwnedResume(data.resumeId, user.id)
    const [{ eq }, { db }, { resumeSummaries }] = await Promise.all([
      import('drizzle-orm'),
      import('#/db'),
      import('#/db/schema'),
    ])
    const now = new Date()
    const current = await db
      .select({ id: resumeSummaries.id })
      .from(resumeSummaries)
      .where(eq(resumeSummaries.resumeId, data.resumeId))
      .get()
    if (current)
      await db
        .update(resumeSummaries)
        .set({ content: data.content, updatedAt: now })
        .where(eq(resumeSummaries.id, current.id))
    else
      await db.insert(resumeSummaries).values({
        id: crypto.randomUUID(),
        resumeId: data.resumeId,
        content: data.content,
        createdAt: now,
        updatedAt: now,
      })
    await touchResume(data.resumeId, user.id, now)
    return { content: data.content, updatedAt: now.toISOString() }
  })

function workResult(row: any): WorkExperience {
  return {
    ...row,
    location: row.location ?? '',
    endDate: row.endDate ?? '',
    description: row.description ?? '',
  }
}
function educationResult(row: any): EducationEntry {
  return {
    ...row,
    fieldOfStudy: row.fieldOfStudy ?? '',
    location: row.location ?? '',
    startDate: row.startDate ?? '',
    endDate: row.endDate ?? '',
    description: row.description ?? '',
  }
}
function projectResult(row: any): ResumeProject {
  return {
    ...row,
    role: row.role ?? '',
    description: row.description ?? '',
    technologies: row.technologies ?? '',
    projectUrl: row.projectUrl ?? '',
    repositoryUrl: row.repositoryUrl ?? '',
    startDate: row.startDate ?? '',
    endDate: row.endDate ?? '',
  }
}
function certificationResult(row: any): ResumeCertification {
  return {
    ...row,
    issuer: row.issuer ?? '',
    date: row.date ?? '',
    credentialUrl: row.credentialUrl ?? '',
  }
}
function languageResult(row: any): ResumeLanguage {
  return {
    id: row.id,
    language: row.language,
    sortOrder: row.sortOrder,
  }
}
function awardResult(row: any): ResumeAward {
  return {
    ...row,
    issuer: row.issuer ?? '',
    date: row.date ?? '',
    description: row.description ?? '',
  }
}
function volunteerResult(row: any): ResumeVolunteer {
  return {
    ...row,
    role: row.role ?? '',
    startDate: row.startDate ?? '',
    endDate: row.endDate ?? '',
    description: row.description ?? '',
  }
}

export const saveWorkExperience = createServerFn({ method: 'POST' })
  .validator(workExperienceSchema)
  .handler(async ({ data }) => {
    const user = await requireUser()
    await requireOwnedResume(data.resumeId, user.id)
    const [{ and, asc, eq }, { db }, { workExperiences }] = await Promise.all([
      import('drizzle-orm'),
      import('#/db'),
      import('#/db/schema'),
    ])
    const now = new Date()
    const values = {
      jobTitle: data.jobTitle,
      company: data.company,
      location: nullable(data.location),
      startDate: data.startDate,
      endDate: data.isCurrent ? null : nullable(data.endDate),
      isCurrent: data.isCurrent,
      description: nullable(data.description),
      updatedAt: now,
    }
    let row
    if (data.id) {
      row = (
        await db
          .update(workExperiences)
          .set(values)
          .where(
            and(
              eq(workExperiences.id, data.id),
              eq(workExperiences.resumeId, data.resumeId),
            ),
          )
          .returning()
      )[0]
      if (!row) throw new Error('Work experience not found')
    } else {
      const last = await db
        .select({ sortOrder: workExperiences.sortOrder })
        .from(workExperiences)
        .where(eq(workExperiences.resumeId, data.resumeId))
        .orderBy(asc(workExperiences.sortOrder))
        .all()
      row = (
        await db
          .insert(workExperiences)
          .values({
            id: crypto.randomUUID(),
            resumeId: data.resumeId,
            ...values,
            sortOrder: last.length,
            createdAt: now,
          })
          .returning()
      )[0]
    }
    await touchResume(data.resumeId, user.id, now)
    return workResult(row)
  })

export const saveEducationEntry = createServerFn({ method: 'POST' })
  .validator(educationSchema)
  .handler(async ({ data }) => {
    const user = await requireUser()
    await requireOwnedResume(data.resumeId, user.id)
    const [{ and, asc, eq }, { db }, { educationEntries }] = await Promise.all([
      import('drizzle-orm'),
      import('#/db'),
      import('#/db/schema'),
    ])
    const now = new Date()
    const values = {
      institution: data.institution,
      qualification: data.qualification,
      fieldOfStudy: nullable(data.fieldOfStudy),
      location: nullable(data.location),
      startDate: nullable(data.startDate),
      endDate: nullable(data.endDate),
      description: nullable(data.description),
      updatedAt: now,
    }
    let row
    if (data.id) {
      row = (
        await db
          .update(educationEntries)
          .set(values)
          .where(
            and(
              eq(educationEntries.id, data.id),
              eq(educationEntries.resumeId, data.resumeId),
            ),
          )
          .returning()
      )[0]
      if (!row) throw new Error('Education entry not found')
    } else {
      const existing = await db
        .select({ id: educationEntries.id })
        .from(educationEntries)
        .where(eq(educationEntries.resumeId, data.resumeId))
        .orderBy(asc(educationEntries.sortOrder))
        .all()
      row = (
        await db
          .insert(educationEntries)
          .values({
            id: crypto.randomUUID(),
            resumeId: data.resumeId,
            ...values,
            sortOrder: existing.length,
            createdAt: now,
          })
          .returning()
      )[0]
    }
    await touchResume(data.resumeId, user.id, now)
    return educationResult(row)
  })

export const saveResumeProject = createServerFn({ method: 'POST' })
  .validator(projectSchema)
  .handler(async ({ data }) => {
    const user = await requireUser()
    await requireOwnedResume(data.resumeId, user.id)
    const [{ and, asc, eq }, { db }, { resumeProjects }] = await Promise.all([
      import('drizzle-orm'),
      import('#/db'),
      import('#/db/schema'),
    ])
    const now = new Date()
    const technologies = data.technologies
      ? data.technologies
          .split(',')
          .map((v) => v.trim())
          .filter(Boolean)
          .join(', ')
      : null
    const values = {
      name: data.name,
      role: nullable(data.role),
      description: nullable(data.description),
      technologies,
      projectUrl: nullable(data.projectUrl),
      repositoryUrl: nullable(data.repositoryUrl),
      startDate: nullable(data.startDate),
      endDate: nullable(data.endDate),
      updatedAt: now,
    }
    let row
    if (data.id) {
      row = (
        await db
          .update(resumeProjects)
          .set(values)
          .where(
            and(
              eq(resumeProjects.id, data.id),
              eq(resumeProjects.resumeId, data.resumeId),
            ),
          )
          .returning()
      )[0]
      if (!row) throw new Error('Project not found')
    } else {
      const existing = await db
        .select({ id: resumeProjects.id })
        .from(resumeProjects)
        .where(eq(resumeProjects.resumeId, data.resumeId))
        .orderBy(asc(resumeProjects.sortOrder))
        .all()
      row = (
        await db
          .insert(resumeProjects)
          .values({
            id: crypto.randomUUID(),
            resumeId: data.resumeId,
            ...values,
            sortOrder: existing.length,
            createdAt: now,
          })
          .returning()
      )[0]
    }
    await touchResume(data.resumeId, user.id, now)
    return projectResult(row)
  })

export const createResumeSkill = createServerFn({ method: 'POST' })
  .validator(skillSchema)
  .handler(async ({ data }) => {
    const user = await requireUser()
    await requireOwnedResume(data.resumeId, user.id)
    const [{ asc, eq }, { db }, { resumeSkills }] = await Promise.all([
      import('drizzle-orm'),
      import('#/db'),
      import('#/db/schema'),
    ])
    const existing = await db
      .select()
      .from(resumeSkills)
      .where(eq(resumeSkills.resumeId, data.resumeId))
      .orderBy(asc(resumeSkills.sortOrder))
      .all()
    if (
      existing.some(
        (skill) =>
          skill.name.toLocaleLowerCase() === data.name.toLocaleLowerCase(),
      )
    )
      throw new Error('That skill is already on this resume.')
    const now = new Date()
    const row = (
      await db
        .insert(resumeSkills)
        .values({
          id: crypto.randomUUID(),
          resumeId: data.resumeId,
          name: data.name,
          sortOrder: existing.length,
          createdAt: now,
          updatedAt: now,
        })
        .returning()
    )[0]
    await touchResume(data.resumeId, user.id, now)
    return row
  })

function deleteSectionEntry(
  key:
    | 'workExperiences'
    | 'educationEntries'
    | 'resumeProjects'
    | 'resumeSkills'
    | 'resumeCertifications'
    | 'resumeLanguages'
    | 'resumeAwards'
    | 'resumeVolunteer',
) {
  return createServerFn({ method: 'POST' })
    .validator(deleteEntrySchema)
    .handler(async ({ data }) => {
      const user = await requireUser()
      await requireOwnedResume(data.resumeId, user.id)
      const [{ and, eq }, { db }, schema] = await Promise.all([
        import('drizzle-orm'),
        import('#/db'),
        import('#/db/schema'),
      ])
      const table: any = schema[key]
      const row = await db
        .delete(table)
        .where(and(eq(table.id, data.id), eq(table.resumeId, data.resumeId)))
        .returning({ id: table.id })
      if (!row[0]) throw new Error('Entry not found')
      await touchResume(data.resumeId, user.id)
    })
}
export const deleteWorkExperience = createServerFn({ method: 'POST' })
  .validator(deleteEntrySchema)
  .handler(({ data }) => deleteSectionEntry('workExperiences')({ data } as any))
export const deleteEducationEntry = createServerFn({ method: 'POST' })
  .validator(deleteEntrySchema)
  .handler(({ data }) =>
    deleteSectionEntry('educationEntries')({ data } as any),
  )
export const deleteResumeProject = createServerFn({ method: 'POST' })
  .validator(deleteEntrySchema)
  .handler(({ data }) => deleteSectionEntry('resumeProjects')({ data } as any))
export const deleteResumeSkill = createServerFn({ method: 'POST' })
  .validator(deleteEntrySchema)
  .handler(({ data }) => deleteSectionEntry('resumeSkills')({ data } as any))
export const deleteResumeCertification = createServerFn({ method: 'POST' })
  .validator(deleteEntrySchema)
  .handler(({ data }) =>
    deleteSectionEntry('resumeCertifications')({ data } as any),
  )
export const deleteResumeLanguage = createServerFn({ method: 'POST' })
  .validator(deleteEntrySchema)
  .handler(({ data }) => deleteSectionEntry('resumeLanguages')({ data } as any))
export const deleteResumeAward = createServerFn({ method: 'POST' })
  .validator(deleteEntrySchema)
  .handler(({ data }) => deleteSectionEntry('resumeAwards')({ data } as any))
export const deleteResumeVolunteer = createServerFn({ method: 'POST' })
  .validator(deleteEntrySchema)
  .handler(({ data }) => deleteSectionEntry('resumeVolunteer')({ data } as any))

function reorderSection(
  key:
    | 'workExperiences'
    | 'educationEntries'
    | 'resumeProjects'
    | 'resumeSkills'
    | 'resumeCertifications'
    | 'resumeLanguages'
    | 'resumeAwards'
    | 'resumeVolunteer',
) {
  return createServerFn({ method: 'POST' })
    .validator(reorderSchema)
    .handler(async ({ data }) => {
      const user = await requireUser()
      await requireOwnedResume(data.resumeId, user.id)
      const [{ and, asc, eq }, { db }, schema] = await Promise.all([
        import('drizzle-orm'),
        import('#/db'),
        import('#/db/schema'),
      ])
      const table: any = schema[key]
      const rows = await db
        .select({ id: table.id })
        .from(table)
        .where(eq(table.resumeId, data.resumeId))
        .orderBy(asc(table.sortOrder))
        .all()
      if (
        rows.length !== data.ids.length ||
        rows.some((row) => !data.ids.includes(row.id))
      )
        throw new Error('Unable to reorder entries.')
      const now = new Date()
      await Promise.all(
        data.ids.map((id, sortOrder) =>
          db
            .update(table)
            .set({ sortOrder, updatedAt: now })
            .where(and(eq(table.id, id), eq(table.resumeId, data.resumeId))),
        ),
      )
      await touchResume(data.resumeId, user.id, now)
    })
}
export const reorderWorkExperiences = createServerFn({ method: 'POST' })
  .validator(reorderSchema)
  .handler(({ data }) => reorderSection('workExperiences')({ data } as any))
export const reorderEducationEntries = createServerFn({ method: 'POST' })
  .validator(reorderSchema)
  .handler(({ data }) => reorderSection('educationEntries')({ data } as any))

export const saveResumeCertification = createServerFn({ method: 'POST' })
  .validator(certificationSchema)
  .handler(async ({ data }) => {
    const user = await requireUser()
    await requireOwnedResume(data.resumeId, user.id)
    const [{ and, asc, eq }, { db }, { resumeCertifications }] =
      await Promise.all([
        import('drizzle-orm'),
        import('#/db'),
        import('#/db/schema'),
      ])
    const now = new Date()
    const values = {
      name: data.name,
      issuer: nullable(data.issuer),
      date: nullable(data.date),
      credentialUrl: nullable(data.credentialUrl),
      updatedAt: now,
    }
    let row
    if (data.id) {
      row = (
        await db
          .update(resumeCertifications)
          .set(values)
          .where(
            and(
              eq(resumeCertifications.id, data.id),
              eq(resumeCertifications.resumeId, data.resumeId),
            ),
          )
          .returning()
      )[0]
      if (!row) throw new Error('Certification not found')
    } else {
      const existing = await db
        .select({ id: resumeCertifications.id })
        .from(resumeCertifications)
        .where(eq(resumeCertifications.resumeId, data.resumeId))
        .orderBy(asc(resumeCertifications.sortOrder))
        .all()
      row = (
        await db
          .insert(resumeCertifications)
          .values({
            id: crypto.randomUUID(),
            resumeId: data.resumeId,
            ...values,
            sortOrder: existing.length,
            createdAt: now,
          })
          .returning()
      )[0]
    }
    await touchResume(data.resumeId, user.id, now)
    return certificationResult(row)
  })

export const saveResumeLanguage = createServerFn({ method: 'POST' })
  .validator(languageSchema)
  .handler(async ({ data }) => {
    const user = await requireUser()
    await requireOwnedResume(data.resumeId, user.id)
    const [{ and, asc, eq }, { db }, { resumeLanguages }] = await Promise.all([
      import('drizzle-orm'),
      import('#/db'),
      import('#/db/schema'),
    ])
    const now = new Date()
    const values = {
      language: data.language,
      updatedAt: now,
    }
    let row
    if (data.id) {
      row = (
        await db
          .update(resumeLanguages)
          .set(values)
          .where(
            and(
              eq(resumeLanguages.id, data.id),
              eq(resumeLanguages.resumeId, data.resumeId),
            ),
          )
          .returning()
      )[0]
      if (!row) throw new Error('Language not found')
    } else {
      const existing = await db
        .select({ id: resumeLanguages.id })
        .from(resumeLanguages)
        .where(eq(resumeLanguages.resumeId, data.resumeId))
        .orderBy(asc(resumeLanguages.sortOrder))
        .all()
      row = (
        await db
          .insert(resumeLanguages)
          .values({
            id: crypto.randomUUID(),
            resumeId: data.resumeId,
            ...values,
            sortOrder: existing.length,
            createdAt: now,
          })
          .returning()
      )[0]
    }
    await touchResume(data.resumeId, user.id, now)
    return languageResult(row)
  })

export const saveResumeAward = createServerFn({ method: 'POST' })
  .validator(awardSchema)
  .handler(async ({ data }) => {
    const user = await requireUser()
    await requireOwnedResume(data.resumeId, user.id)
    const [{ and, asc, eq }, { db }, { resumeAwards }] = await Promise.all([
      import('drizzle-orm'),
      import('#/db'),
      import('#/db/schema'),
    ])
    const now = new Date()
    const values = {
      title: data.title,
      issuer: nullable(data.issuer),
      date: nullable(data.date),
      description: nullable(data.description),
      updatedAt: now,
    }
    let row
    if (data.id) {
      row = (
        await db
          .update(resumeAwards)
          .set(values)
          .where(
            and(
              eq(resumeAwards.id, data.id),
              eq(resumeAwards.resumeId, data.resumeId),
            ),
          )
          .returning()
      )[0]
      if (!row) throw new Error('Award not found')
    } else {
      const existing = await db
        .select({ id: resumeAwards.id })
        .from(resumeAwards)
        .where(eq(resumeAwards.resumeId, data.resumeId))
        .orderBy(asc(resumeAwards.sortOrder))
        .all()
      row = (
        await db
          .insert(resumeAwards)
          .values({
            id: crypto.randomUUID(),
            resumeId: data.resumeId,
            ...values,
            sortOrder: existing.length,
            createdAt: now,
          })
          .returning()
      )[0]
    }
    await touchResume(data.resumeId, user.id, now)
    return awardResult(row)
  })

export const saveResumeVolunteer = createServerFn({ method: 'POST' })
  .validator(volunteerSchema)
  .handler(async ({ data }) => {
    const user = await requireUser()
    await requireOwnedResume(data.resumeId, user.id)
    const [{ and, asc, eq }, { db }, { resumeVolunteer }] = await Promise.all([
      import('drizzle-orm'),
      import('#/db'),
      import('#/db/schema'),
    ])
    const now = new Date()
    const values = {
      organization: data.organization,
      role: nullable(data.role),
      startDate: nullable(data.startDate),
      endDate: nullable(data.endDate),
      description: nullable(data.description),
      updatedAt: now,
    }
    let row
    if (data.id) {
      row = (
        await db
          .update(resumeVolunteer)
          .set(values)
          .where(
            and(
              eq(resumeVolunteer.id, data.id),
              eq(resumeVolunteer.resumeId, data.resumeId),
            ),
          )
          .returning()
      )[0]
      if (!row) throw new Error('Volunteer entry not found')
    } else {
      const existing = await db
        .select({ id: resumeVolunteer.id })
        .from(resumeVolunteer)
        .where(eq(resumeVolunteer.resumeId, data.resumeId))
        .orderBy(asc(resumeVolunteer.sortOrder))
        .all()
      row = (
        await db
          .insert(resumeVolunteer)
          .values({
            id: crypto.randomUUID(),
            resumeId: data.resumeId,
            ...values,
            sortOrder: existing.length,
            createdAt: now,
          })
          .returning()
      )[0]
    }
    await touchResume(data.resumeId, user.id, now)
    return volunteerResult(row)
  })
