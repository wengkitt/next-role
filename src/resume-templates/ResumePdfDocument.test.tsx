import { PDFDocument } from 'pdf-lib'
import { renderToBuffer } from '@react-pdf/renderer'
import { writeFile } from 'node:fs/promises'
import { describe, expect, it } from 'vitest'
import { ResumePdfDocument } from './ResumePdfDocument'
import type { ResumeDocumentData } from '#/lib/resume-document'

const data: ResumeDocumentData = {
  profile: {
    name: 'Ada Lovelace',
    title: 'Product Designer',
    email: 'ada@example.com',
    phone: '+44 20 0000 0000',
    location: 'London',
    website: 'https://ada.example.com',
    linkedinUrl: 'https://linkedin.com/in/ada',
    githubUrl: 'https://github.com/ada',
  },
  summary: 'A focused professional summary with enough detail to render.',
  experience: [
    {
      id: 'experience',
      role: 'Product Designer',
      company: 'Analytical Engines',
      location: 'London',
      startDate: '2022-01',
      endDate: '',
      isCurrent: true,
      dateRange: 'Jan 2022 - Present',
      highlights: ['Improved a workflow by 25% for 400 users.'],
    },
  ],
  education: [],
  skills: ['Product strategy', 'Accessibility'],
  projects: [],
  certifications: [],
  languages: [],
  awards: [],
  volunteer: [],
  sectionOrder: [
    'summary',
    'experience',
    'skills',
    'projects',
    'education',
    'certifications',
    'languages',
    'awards',
    'volunteer',
  ],
  hiddenSections: [],
}

describe('ResumePdfDocument', () => {
  it('renders a searchable vector PDF with a stable page count', async () => {
    const buffer = await renderToBuffer(
      <ResumePdfDocument data={data} templateId="classic" />,
    )
    const bytes = new Uint8Array(buffer)
    if (process.env.PDF_QA_OUTPUT) {
      await writeFile(process.env.PDF_QA_OUTPUT, bytes)
    }
    expect(new TextDecoder().decode(bytes.slice(0, 5))).toBe('%PDF-')
    const pdf = await PDFDocument.load(bytes)
    expect(pdf.getPageCount()).toBe(1)
  })
})
