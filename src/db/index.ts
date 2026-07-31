import { env } from 'cloudflare:workers'
import { drizzle } from 'drizzle-orm/d1'

import * as schema from './schema'

/**
 * Cloudflare injects bindings for each request; `cloudflare:workers` exposes
 * them safely to TanStack Start's Worker runtime.
 */
export const db = drizzle(env.DB, { schema })
