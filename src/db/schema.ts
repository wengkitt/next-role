import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

/**
 * A small, generic table that confirms the D1/Drizzle setup works end-to-end.
 * Replace or extend it with the application's domain tables.
 */
export const appSettings = sqliteTable('app_settings', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
    .notNull()
    .$defaultFn(() => new Date()),
})
