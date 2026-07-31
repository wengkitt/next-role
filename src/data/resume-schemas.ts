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
