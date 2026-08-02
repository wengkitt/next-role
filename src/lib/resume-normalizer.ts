import type { ResumeDocumentInput } from '#/lib/resume-document'
import {
  formatResumeDateRange,
  formatResumeMonth,
  normalizeResumeDocument,
  parseHighlightLines,
} from '#/lib/resume-document'

export type {
  ResumeDocumentData,
  ResumeEducationData,
  ResumeExperienceData,
  ResumeProjectData,
  ResumeProfileData,
} from '#/lib/resume-document'

export { formatResumeDateRange, formatResumeMonth, parseHighlightLines }

/**
 * Compatibility entry point for callers that used the original normalizer.
 * The returned shape is now the stable document contract used by every PDF
 * template, so legacy paragraph descriptions are preserved as one highlight.
 */
export function normalizeResume(input: ResumeDocumentInput) {
  return normalizeResumeDocument(input)
}
