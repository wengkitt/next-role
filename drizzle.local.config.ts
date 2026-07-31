import { readdirSync } from 'node:fs'
import { join } from 'node:path'
import { defineConfig } from 'drizzle-kit'

const d1Directory = '.wrangler/state/v3/d1/miniflare-D1DatabaseObject'
const databaseFile = readdirSync(d1Directory).find(
  (file) => file.endsWith('.sqlite') && file !== 'metadata.sqlite',
)

if (!databaseFile) {
  throw new Error(
    'No local D1 database found. Run pnpm db:migrate:local first.',
  )
}

export default defineConfig({
  schema: './src/db/schema.ts',
  dialect: 'sqlite',
  dbCredentials: {
    url: join(d1Directory, databaseFile),
  },
})
