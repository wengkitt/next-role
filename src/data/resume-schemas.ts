import { z } from 'zod'

export const resumeTitleSchema = z
  .string()
  .trim()
  .min(1, 'Resume title is required.')
  .max(100, 'Resume title must be 100 characters or fewer.')

export const resumeIdSchema = z.string().min(1)

export const createResumeSchema = z.object({ title: resumeTitleSchema })
export const renameResumeSchema = z.object({
  resumeId: resumeIdSchema,
  title: resumeTitleSchema,
})
export const resumeActionSchema = z.object({ resumeId: resumeIdSchema })
export const templateSchema = z.object({
  resumeId: resumeIdSchema,
  templateId: z.enum(['classic', 'minimal']),
})

export const resumeSectionSchema = z.enum([
  'summary',
  'experience',
  'skills',
  'projects',
  'education',
  'certifications',
  'languages',
  'awards',
  'volunteer',
])
export const sectionPreferencesSchema = z.object({
  resumeId: resumeIdSchema,
  order: z.array(resumeSectionSchema),
  hidden: z.array(resumeSectionSchema),
})

const optionalText = z.string().trim().max(200).optional()
const optionalUrl = z
  .string()
  .trim()
  .url('Enter a valid URL.')
  .or(z.literal(''))

export const profileSchema = z.object({
  resumeId: resumeIdSchema,
  fullName: optionalText,
  professionalTitle: optionalText,
  email: z
    .string()
    .trim()
    .email('Enter a valid email address.')
    .or(z.literal('')),
  phone: optionalText,
  location: optionalText,
  website: optionalUrl,
  linkedinUrl: optionalUrl,
  githubUrl: optionalUrl,
})

export type ProfileValues = Omit<z.infer<typeof profileSchema>, 'resumeId'>

const optionalLongText = z.string().trim().max(2_000).optional()
const optionalDate = z
  .string()
  .regex(/^\d{4}-\d{2}$/, 'Choose a valid month.')
  .or(z.literal(''))
const optionalEntryText = z.string().trim().max(200).optional()
const entryIdSchema = z.object({
  resumeId: resumeIdSchema,
  id: z.string().min(1),
})

export const summarySchema = z.object({
  resumeId: resumeIdSchema,
  content: z.string().trim().max(2_000),
})

export const workExperienceSchema = z
  .object({
    resumeId: resumeIdSchema,
    id: z.string().min(1).optional(),
    jobTitle: z.string().trim().min(1, 'Job title is required.').max(200),
    company: z.string().trim().min(1, 'Company is required.').max(200),
    location: optionalEntryText,
    startDate: z.string().regex(/^\d{4}-\d{2}$/, 'Start date is required.'),
    endDate: optionalDate,
    isCurrent: z.boolean(),
    description: optionalLongText,
  })
  .superRefine((value, context) => {
    if (!value.isCurrent && !value.endDate)
      context.addIssue({
        code: 'custom',
        path: ['endDate'],
        message: 'End date is required unless this is your current role.',
      })
    if (value.endDate && value.endDate < value.startDate)
      context.addIssue({
        code: 'custom',
        path: ['endDate'],
        message: 'End date cannot be earlier than start date.',
      })
  })

export const educationSchema = z
  .object({
    resumeId: resumeIdSchema,
    id: z.string().min(1).optional(),
    institution: z.string().trim().min(1, 'Institution is required.').max(200),
    qualification: z
      .string()
      .trim()
      .min(1, 'Qualification is required.')
      .max(200),
    fieldOfStudy: optionalEntryText,
    location: optionalEntryText,
    startDate: optionalDate,
    endDate: optionalDate,
    description: optionalLongText,
  })
  .superRefine((value, context) => {
    if (value.startDate && value.endDate && value.endDate < value.startDate)
      context.addIssue({
        code: 'custom',
        path: ['endDate'],
        message: 'End date cannot be earlier than start date.',
      })
  })

export const skillSchema = z.object({
  resumeId: resumeIdSchema,
  name: z.string().trim().min(1, 'Enter a skill.').max(60),
})
export const reorderSchema = z.object({
  resumeId: resumeIdSchema,
  ids: z.array(z.string().min(1)).min(1),
})
export const deleteEntrySchema = entryIdSchema

export const projectSchema = z
  .object({
    resumeId: resumeIdSchema,
    id: z.string().min(1).optional(),
    name: z.string().trim().min(1, 'Project name is required.').max(200),
    role: optionalEntryText,
    description: optionalLongText,
    technologies: z.string().trim().max(500).optional(),
    projectUrl: optionalUrl,
    repositoryUrl: optionalUrl,
    startDate: optionalDate,
    endDate: optionalDate,
  })
  .superRefine((value, context) => {
    if (value.startDate && value.endDate && value.endDate < value.startDate)
      context.addIssue({
        code: 'custom',
        path: ['endDate'],
        message: 'End date cannot be earlier than start date.',
      })
    if (
      value.technologies &&
      !value.technologies.split(',').some((item) => item.trim())
    )
      context.addIssue({
        code: 'custom',
        path: ['technologies'],
        message: 'Enter at least one technology.',
      })
  })

export type WorkExperienceValues = Omit<
  z.infer<typeof workExperienceSchema>,
  'resumeId' | 'id'
>
export type EducationValues = Omit<
  z.infer<typeof educationSchema>,
  'resumeId' | 'id'
>
export type ProjectValues = Omit<
  z.infer<typeof projectSchema>,
  'resumeId' | 'id'
>

export const certificationSchema = z.object({
  resumeId: resumeIdSchema,
  id: z.string().min(1).optional(),
  name: z.string().trim().min(1, 'Certification name is required.').max(200),
  issuer: optionalEntryText,
  date: optionalDate,
  credentialUrl: optionalUrl,
})

export const languageSchema = z.object({
  resumeId: resumeIdSchema,
  id: z.string().min(1).optional(),
  language: z.string().trim().min(1, 'Language is required.').max(100),
})

export const awardSchema = z.object({
  resumeId: resumeIdSchema,
  id: z.string().min(1).optional(),
  title: z.string().trim().min(1, 'Award title is required.').max(200),
  issuer: optionalEntryText,
  date: optionalDate,
  description: optionalLongText,
})

export const volunteerSchema = z
  .object({
    resumeId: resumeIdSchema,
    id: z.string().min(1).optional(),
    organization: z
      .string()
      .trim()
      .min(1, 'Organization is required.')
      .max(200),
    role: optionalEntryText,
    startDate: optionalDate,
    endDate: optionalDate,
    description: optionalLongText,
  })
  .superRefine((value, context) => {
    if (value.startDate && value.endDate && value.endDate < value.startDate)
      context.addIssue({
        code: 'custom',
        path: ['endDate'],
        message: 'End date cannot be earlier than the start date.',
      })
  })

export type CertificationValues = Omit<
  z.infer<typeof certificationSchema>,
  'resumeId' | 'id'
>
export type LanguageValues = Omit<
  z.infer<typeof languageSchema>,
  'resumeId' | 'id'
>
export type AwardValues = Omit<z.infer<typeof awardSchema>, 'resumeId' | 'id'>
export type VolunteerValues = Omit<
  z.infer<typeof volunteerSchema>,
  'resumeId' | 'id'
>
