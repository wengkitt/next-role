import { getResumeQualityReport } from './resume-quality'
import {
  formatResumeDateRange,
  normalizeResumeDocument,
  parseHighlightLines,
} from './resume-document'
import type { ResumeDocumentData, ResumeDocumentInput } from './resume-document'
import { describe, expect, it } from 'vitest'

const input: ResumeDocumentInput = {
  resume: { title: 'Fallback title' },
  profile: {
    fullName: 'Ada Lovelace',
    professionalTitle: 'Product Designer',
    email: 'ada@example.com',
    phone: '',
    location: 'London',
    website: '',
    linkedinUrl: '',
    githubUrl: '',
  },
  summary: '',
  work: [],
  education: [],
  skills: [],
  projects: [],
}

describe('resume document normalization', () => {
  it('keeps an existing paragraph as one highlight', () => {
    expect(parseHighlightLines('Designed flows. Improved onboarding.')).toEqual(
      ['Designed flows. Improved onboarding.'],
    )
  })

  it('uses newline-delimited highlights for new entries', () => {
    expect(parseHighlightLines('Designed flows\nImproved onboarding')).toEqual([
      'Designed flows',
      'Improved onboarding',
    ])
  })

  it('formats dates deterministically with ASCII separators and preserves order', () => {
    const normalized = normalizeResumeDocument({
      ...input,
      work: [
        {
          id: 'two',
          jobTitle: 'Second role',
          company: 'B',
          location: '',
          startDate: '2024-02',
          endDate: '',
          isCurrent: true,
          description: '',
          sortOrder: 1,
        },
        {
          id: 'one',
          jobTitle: 'First role',
          company: 'A',
          location: '',
          startDate: '2020-01',
          endDate: '2024-01',
          isCurrent: false,
          description: 'One result',
          sortOrder: 0,
        },
      ],
    })
    expect(normalized.experience.map((item) => item.id)).toEqual(['one', 'two'])
    expect(normalized.experience[0]?.dateRange).toBe('Jan 2020 - Jan 2024')
    expect(normalized.experience[1]?.dateRange).toBe('Feb 2024 - Present')
    expect(formatResumeDateRange('2020-01', '2021-02')).toBe(
      'Jan 2020 - Feb 2021',
    )
  })

  it('normalizes optional sections and hides empty sections in the data contract', () => {
    const defaultOrder = normalizeResumeDocument(input)
    expect(defaultOrder.sectionOrder.slice(0, 4)).toEqual([
      'summary',
      'experience',
      'education',
      'skills',
    ])

    const normalized = normalizeResumeDocument({
      ...input,
      certifications: [
        {
          id: 'cert',
          name: 'Accessibility',
          issuer: 'W3C',
          date: '2025-03',
          credentialUrl: 'https://example.com/cert',
          sortOrder: 0,
        },
      ],
      sectionPreferences: {
        order: [
          'certifications',
          'experience',
          'skills',
          'summary',
          'projects',
          'education',
          'languages',
          'awards',
          'volunteer',
        ],
        hidden: ['projects'],
      },
    })
    expect(normalized.certifications[0]?.date).toBe('Mar 2025')
    expect(normalized.sectionOrder[0]).toBe('certifications')
    expect(normalized.hiddenSections).toEqual(['projects'])
  })
})

describe('resume quality checks', () => {
  const empty: ResumeDocumentData = {
    profile: {
      name: '',
      title: '',
      email: '',
      phone: '',
      location: '',
      website: '',
      linkedinUrl: '',
      githubUrl: '',
    },
    experience: [],
    education: [],
    skills: [],
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

  it('returns advisory checks without blocking an empty document', () => {
    const report = getResumeQualityReport(empty)
    expect(report.progress).toBeLessThan(100)
    expect(report.checks.some((check) => check.id === 'profile-name')).toBe(
      true,
    )
    expect(report.checks.some((check) => check.id === 'skills-present')).toBe(
      true,
    )
  })

  it('warns when the generated PDF exceeds the soft page target', () => {
    const report = getResumeQualityReport(empty, 4)
    expect(report.checks).toContainEqual(
      expect.objectContaining({ id: 'page-count', severity: 'warning' }),
    )
  })
})
