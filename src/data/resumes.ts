import { createServerFn } from '@tanstack/react-start'
import {
  createResumeSchema,
  profileSchema,
  renameResumeSchema,
  resumeActionSchema,
} from './resume-schemas'

export type ResumeSummary = {
  id: string
  title: string
  status: 'draft' | 'complete' | 'archived'
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
  createdAt: Date
  updatedAt: Date
}): ResumeSummary => ({
  id: resume.id,
  title: resume.title,
  status: resume.status,
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
    const [{ and, eq }, { db }, { resumeProfiles, resumes }] =
      await Promise.all([
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
    }
  })

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
