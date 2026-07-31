import { Link } from '@tanstack/react-router'
import { ArrowLeft, FileText } from 'lucide-react'
import type { ReactNode } from 'react'

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <main className="grid min-h-screen bg-base-200 lg:grid-cols-2">
      <section className="flex items-center justify-center px-4 py-12 sm:px-6">
        <div className="w-full max-w-md">
          <Link to="/" className="btn btn-ghost btn-sm -ml-3 mb-8">
            <ArrowLeft size={16} aria-hidden="true" /> Back to home
          </Link>
          {children}
        </div>
      </section>
      <aside className="hidden bg-neutral p-12 text-neutral-content lg:flex lg:flex-col lg:justify-between">
        <Link to="/" className="text-2xl font-bold tracking-tight">
          Next<span className="text-primary">Role</span>
        </Link>
        <div className="max-w-md">
          <div className="mb-6 flex size-14 items-center justify-center rounded-box bg-primary text-primary-content">
            <FileText size={28} aria-hidden="true" />
          </div>
          <p className="text-sm font-semibold tracking-widest text-primary uppercase">
            Your next opportunity starts here
          </p>
          <h2 className="mt-4 text-4xl font-bold tracking-tight">
            Build a resume that puts your best work forward.
          </h2>
          <p className="mt-5 text-lg leading-8 text-neutral-content/70">
            Create tailored resume versions, keep your career story organised,
            and apply with confidence.
          </p>
        </div>
        <p className="text-sm text-neutral-content/55">© 2026 NextRole</p>
      </aside>
    </main>
  )
}
