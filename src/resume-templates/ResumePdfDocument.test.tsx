import { PDFDocument } from 'pdf-lib'
import { renderToBuffer } from '@react-pdf/renderer'
import { writeFile } from 'node:fs/promises'
import { inflateSync } from 'node:zlib'
import { describe, expect, it } from 'vitest'
import { ResumePdfDocument } from './ResumePdfDocument'
import type { ResumeDocumentData } from '#/lib/resume-document'

function encodedPageText(pdf: PDFDocument) {
  const contents = pdf.getPages()[0]?.node.Contents()
  if (!contents) return ''
  const streams =
    'asArray' in contents
      ? contents.asArray().map((_, index) => contents.lookup(index))
      : [contents]
  const content = streams
    .map((stream) => {
      const getContents = (stream as { getContents?: () => Uint8Array })
        .getContents
      if (!getContents) return ''
      const bytes = getContents.call(stream)
      try {
        return new TextDecoder().decode(inflateSync(bytes))
      } catch {
        return new TextDecoder().decode(bytes)
      }
    })
    .join('')
  return [...content.matchAll(/<([0-9a-f]+)>/gi)]
    .map((match) => match[1])
    .join('')
}

function hexEncode(value: string) {
  return [...new TextEncoder().encode(value)]
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

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

    const annotations = pdf.getPages()[0]?.node.Annots()
    expect(annotations?.size()).toBe(2)
    const serializedPdf = new TextDecoder().decode(bytes)
    expect(serializedPdf).not.toContain('/URI (https://ada.example.com)')
    expect(serializedPdf).not.toContain('/URI (https://linkedin.com/in/ada)')
    expect(serializedPdf).not.toContain('/URI (https://github.com/ada)')
    const pageText = encodedPageText(pdf)
    expect(pageText).toContain(hexEncode('Portfolio: https://ada.example.com'))
    expect(pageText).toContain(
      hexEncode('LinkedIn: https://linkedin.com/in/ada'),
    )
    expect(pageText).toContain(hexEncode('GitHub: https://github.com/ada'))
  })
})
