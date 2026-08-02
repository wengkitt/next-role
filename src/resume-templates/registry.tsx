export type TemplateId = 'classic' | 'modern' | 'minimal'

export type ResumeTemplate = {
  id: TemplateId
  displayName: string
  description: string
  guidance: string
}

export const resumeTemplates: ResumeTemplate[] = [
  {
    id: 'classic',
    displayName: 'Classic ATS',
    description: 'Single-column hierarchy with restrained blue accents.',
    guidance: 'Best default for most professional and technical applications.',
  },
  {
    id: 'modern',
    displayName: 'Modern ATS',
    description: 'The same searchable structure with a stronger header.',
    guidance: 'A polished choice when you want a little more visual presence.',
  },
  {
    id: 'minimal',
    displayName: 'Minimal',
    description: 'Typography-led, quiet, and easy to scan.',
    guidance: 'Useful for senior, academic, or design-adjacent applications.',
  },
]

export const getResumeTemplate = (id: TemplateId) =>
  resumeTemplates.find((template) => template.id === id) ?? resumeTemplates[0]
