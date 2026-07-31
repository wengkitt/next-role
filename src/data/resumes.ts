export type ResumeSummary = {
  id: string
  title: string
  updatedAt: string
  status: 'Draft'
}

/**
 * Temporary data boundary until resume persistence is introduced.
 *
 * Returning an empty collection is intentional: we do not invent resumes for
 * a user. Replace this function with a user-scoped database query when the
 * resume schema is available.
 */
export async function getResumeSummariesForUser(
  _userId: string,
): Promise<ResumeSummary[]> {
  return []
}
