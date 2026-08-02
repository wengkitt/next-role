# NextRole

NextRole is a professional resume builder for creating, managing, and exporting tailored resumes. Users can create multiple resume versions, edit structured resume sections, choose a visual template, review resume-quality suggestions, and export a searchable PDF.

## Features

- Email-and-password authentication with Better Auth
- Multiple resume versions with rename, duplicate, and delete actions
- Structured editing for:
  - Personal information and professional summary
  - Work experience and education
  - Skills and projects
  - Certifications, languages, awards, and volunteer work
- Three PDF templates: Classic ATS, Modern ATS, and Minimal
- Reorderable and hideable resume sections
- Live A4 PDF preview with page count feedback
- PDF export with selectable text
- Resume quality checks for completeness, clarity, measurable outcomes, and document length
- Light/dark theme selection

## Tech stack

- [TanStack Start](https://tanstack.com/start) and [TanStack Router](https://tanstack.com/router)
- React and TypeScript
- Vite
- Tailwind CSS and [daisyUI](https://daisyui.com/)
- [Better Auth](https://www.better-auth.com/) for authentication
- [Drizzle ORM](https://orm.drizzle.team/) with [Cloudflare D1](https://developers.cloudflare.com/d1/)
- [Cloudflare Workers](https://developers.cloudflare.com/workers/) for deployment
- [React PDF](https://react-pdf.org/) and `pdf-lib` for PDF generation and inspection
- Vitest, Oxlint, and Oxfmt for testing, linting, and formatting

## Prerequisites

- Node.js with [pnpm](https://pnpm.io/) enabled
- OpenSSL, used to generate a local authentication secret
- A Cloudflare account is required for remote D1 migrations and deployment

## Getting started

Install dependencies:

```bash
pnpm install
```

Create local Better Auth variables. Copy the example file, then set `BETTER_AUTH_SECRET` to the output of the `openssl` command:

```bash
cp .dev.vars.example .dev.vars
openssl rand -base64 32
```

The local variables should contain:

```dotenv
BETTER_AUTH_SECRET=<generated-secret>
BETTER_AUTH_URL=http://localhost:3000
```

Initialize the local Cloudflare D1 database from the checked-in migrations:

```bash
pnpm db:migrate:local
```

Start the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000), create an account, and start building a resume.

## Environment variables

### Local application variables

`.dev.vars` is used by the local Cloudflare Worker runtime and is ignored by Git. Copy `.dev.vars.example` and provide:

| Variable             | Purpose                                                            |
| -------------------- | ------------------------------------------------------------------ |
| `BETTER_AUTH_SECRET` | Secret used to sign Better Auth sessions.                          |
| `BETTER_AUTH_URL`    | Base URL used by Better Auth; use `http://localhost:3000` locally. |

### Drizzle Kit variables

The optional `.env` file is used by Drizzle Kit when connecting to the remote D1 database over HTTP. Copy `.env.example` and fill in the Cloudflare account ID, D1 database ID, and a token with D1 edit permissions:

```bash
cp .env.example .env
```

Do not expose these values to browser code or commit `.env`.

## Database workflow

The Drizzle schema lives in [`src/db/schema.ts`](src/db/schema.ts), and generated migrations live in [`drizzle/`](drizzle/).

After changing the schema:

```bash
pnpm db:generate
pnpm db:migrate:local
```

To apply the existing migrations to the configured remote D1 database:

```bash
pnpm db:migrate:remote
```

To inspect the database with Drizzle Studio:

```bash
# Local D1 database
pnpm db:studio:local

# Remote D1 database; requires the variables in .env
pnpm db:studio:remote
```

Keep database access in server-side code. The database binding is available through `src/db/index.ts` and should not be imported into browser-only modules.

## Available scripts

| Command                  | Description                                         |
| ------------------------ | --------------------------------------------------- |
| `pnpm dev`               | Start the Vite development server on port 3000.     |
| `pnpm build`             | Build the application for production.               |
| `pnpm preview`           | Build and preview the production bundle locally.    |
| `pnpm test`              | Run the Vitest test suite.                          |
| `pnpm lint`              | Check the project with Oxlint.                      |
| `pnpm lint:fix`          | Automatically fix supported Oxlint issues.          |
| `pnpm fmt`               | Format the project with Oxfmt.                      |
| `pnpm fmt:check`         | Check formatting without changing files.            |
| `pnpm generate-routes`   | Regenerate TanStack Router's file-based route tree. |
| `pnpm db:generate`       | Generate Drizzle migrations from the schema.        |
| `pnpm db:migrate:local`  | Apply migrations to local D1.                       |
| `pnpm db:migrate:remote` | Apply migrations to remote D1.                      |
| `pnpm cf-typegen`        | Regenerate Cloudflare Worker binding types.         |
| `pnpm deploy`            | Build and deploy the Worker with Wrangler.          |

Before committing changes, run:

```bash
pnpm test
pnpm lint
pnpm fmt:check
pnpm build
```

## Deployment

The application is configured for Cloudflare Workers through [`wrangler.jsonc`](wrangler.jsonc). Before deploying:

1. Authenticate Wrangler:

   ```bash
   pnpm exec wrangler login
   ```

2. Configure `BETTER_AUTH_URL` as a production Worker variable in `wrangler.jsonc` or the Cloudflare dashboard.

3. Store the production authentication secret as a Worker secret:

   ```bash
   pnpm exec wrangler secret put BETTER_AUTH_SECRET
   ```

4. Apply the database migrations to the remote D1 database:

   ```bash
   pnpm db:migrate:remote
   ```

5. Build and deploy:

   ```bash
   pnpm deploy
   ```

The `DB` D1 binding and migration directory are already declared in `wrangler.jsonc`. Review that configuration before deploying to a different Cloudflare account or database.

## Project structure

```text
src/
├── routes/            TanStack file-based routes and server endpoints
├── components/        Landing page, dashboard, auth, and editor UI
├── data/              Authenticated server functions and validation schemas
├── db/                Drizzle schema and Cloudflare D1 connection
├── auth/              Better Auth configuration and session helpers
├── lib/                Resume normalization, quality checks, and shared logic
└── resume-templates/  React PDF document and template definitions

drizzle/               Generated D1/SQLite migrations
wrangler.jsonc         Cloudflare Worker and D1 configuration
vite.config.ts         Vite, TanStack Start, Tailwind, and Cloudflare setup
```

Routes are generated from files in `src/routes`. The main application areas are:

- `/` — public landing page
- `/sign-in` and `/sign-up` — authentication
- `/app/resumes` — authenticated resume dashboard
- `/app/resumes/:resumeId/edit` — resume editor and PDF preview
- `/app/settings` — authenticated settings page

## License

No license has been specified yet.
