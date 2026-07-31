import { createServerFn } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'

import { auth } from '#/auth'

/**
 * Reads the Better Auth session from the request that invoked the route.
 * Keeping this server-only means protected routes can redirect before content
 * is rendered in the browser.
 */
export const getAuthSession = createServerFn({ method: 'GET' }).handler(
  async () => auth.api.getSession({ headers: getRequestHeaders() }),
)
