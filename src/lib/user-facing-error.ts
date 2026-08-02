export function userFacingError(error: unknown, fallback: string) {
  if (!(error instanceof Error) || !error.message) return fallback
  try {
    const issues = JSON.parse(error.message)
    if (Array.isArray(issues)) {
      const first = issues.find(
        (issue) => typeof issue?.message === 'string',
      )?.message
      if (first) return first
    }
  } catch {
    /* Server errors can be shown directly. */
  }
  return error.message.startsWith('[{') ? fallback : error.message
}
