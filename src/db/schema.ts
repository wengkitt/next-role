import {
  index,
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from 'drizzle-orm/sqlite-core'

export const user = sqliteTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: integer('email_verified', { mode: 'boolean' })
    .notNull()
    .default(false),
  image: text('image'),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
})

export const session = sqliteTable('session', {
  id: text('id').primaryKey(),
  expiresAt: integer('expires_at', { mode: 'timestamp_ms' }).notNull(),
  token: text('token').notNull().unique(),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
})

export const account = sqliteTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: integer('access_token_expires_at', {
    mode: 'timestamp_ms',
  }),
  refreshTokenExpiresAt: integer('refresh_token_expires_at', {
    mode: 'timestamp_ms',
  }),
  scope: text('scope'),
  password: text('password'),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
})

export const verification = sqliteTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: integer('expires_at', { mode: 'timestamp_ms' }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }),
})

export const resumes = sqliteTable(
  'resumes',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    status: text('status', { enum: ['draft', 'complete', 'archived'] })
      .notNull()
      .default('draft'),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => [
    index('resumes_user_id_idx').on(table.userId),
    index('resumes_user_updated_at_idx').on(table.userId, table.updatedAt),
  ],
)

export const resumeProfiles = sqliteTable(
  'resume_profiles',
  {
    id: text('id').primaryKey(),
    resumeId: text('resume_id')
      .notNull()
      .references(() => resumes.id, { onDelete: 'cascade' }),
    fullName: text('full_name'),
    professionalTitle: text('professional_title'),
    email: text('email'),
    phone: text('phone'),
    location: text('location'),
    website: text('website'),
    linkedinUrl: text('linkedin_url'),
    githubUrl: text('github_url'),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => [
    uniqueIndex('resume_profiles_resume_id_unique').on(table.resumeId),
  ],
)

export const resumeSummaries = sqliteTable(
  'resume_summaries',
  {
    id: text('id').primaryKey(),
    resumeId: text('resume_id')
      .notNull()
      .references(() => resumes.id, { onDelete: 'cascade' }),
    content: text('content').notNull().default(''),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => [
    uniqueIndex('resume_summaries_resume_id_unique').on(table.resumeId),
  ],
)

export const workExperiences = sqliteTable(
  'work_experiences',
  {
    id: text('id').primaryKey(),
    resumeId: text('resume_id')
      .notNull()
      .references(() => resumes.id, { onDelete: 'cascade' }),
    jobTitle: text('job_title').notNull(),
    company: text('company').notNull(),
    location: text('location'),
    startDate: text('start_date').notNull(),
    endDate: text('end_date'),
    isCurrent: integer('is_current', { mode: 'boolean' })
      .notNull()
      .default(false),
    description: text('description'),
    sortOrder: integer('sort_order').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => [
    index('work_experiences_resume_sort_idx').on(
      table.resumeId,
      table.sortOrder,
    ),
  ],
)

export const educationEntries = sqliteTable(
  'education_entries',
  {
    id: text('id').primaryKey(),
    resumeId: text('resume_id')
      .notNull()
      .references(() => resumes.id, { onDelete: 'cascade' }),
    institution: text('institution').notNull(),
    qualification: text('qualification').notNull(),
    fieldOfStudy: text('field_of_study'),
    location: text('location'),
    startDate: text('start_date'),
    endDate: text('end_date'),
    description: text('description'),
    sortOrder: integer('sort_order').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => [
    index('education_entries_resume_sort_idx').on(
      table.resumeId,
      table.sortOrder,
    ),
  ],
)

export const resumeSkills = sqliteTable(
  'resume_skills',
  {
    id: text('id').primaryKey(),
    resumeId: text('resume_id')
      .notNull()
      .references(() => resumes.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    sortOrder: integer('sort_order').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => [
    index('resume_skills_resume_sort_idx').on(table.resumeId, table.sortOrder),
  ],
)

export const resumeProjects = sqliteTable(
  'resume_projects',
  {
    id: text('id').primaryKey(),
    resumeId: text('resume_id')
      .notNull()
      .references(() => resumes.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    role: text('role'),
    description: text('description'),
    technologies: text('technologies'),
    projectUrl: text('project_url'),
    repositoryUrl: text('repository_url'),
    startDate: text('start_date'),
    endDate: text('end_date'),
    sortOrder: integer('sort_order').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => [
    index('resume_projects_resume_sort_idx').on(
      table.resumeId,
      table.sortOrder,
    ),
  ],
)
