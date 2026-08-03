import { Link } from '@tanstack/react-router'
import { ArrowRight, CheckCircle2, Eye, Sparkles } from 'lucide-react'
import { ResumeDocument } from './ResumeDocument'

export function HeroSection() {
  return (
    <section
      id="top"
      className="relative overflow-hidden border-b border-base-300/70 bg-base-200"
    >
      <div className="pointer-events-none absolute -left-24 top-20 size-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 size-80 rounded-full bg-secondary/10 blur-3xl" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[.85fr_1.15fr] lg:px-8 lg:py-24">
        <div className="max-w-xl">
          <div className="badge badge-soft badge-primary gap-2 border-0 px-3 py-3 font-medium">
            <Sparkles size={14} aria-hidden="true" />
            Build once. Tailor every application.
          </div>
          <h1 className="mt-6 text-5xl font-bold tracking-tight text-balance sm:text-6xl">
            Make your next role easier to say yes to.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-base-content/70">
            Turn your experience into a clear, confident resume with guided
            sections, quality checks, and a live PDF preview that keeps every
            detail ready to send.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/sign-up" className="btn btn-primary btn-lg">
              Start building <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <a href="#features" className="btn btn-ghost btn-lg">
              See how it works
            </a>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-5 gap-y-3 text-sm text-base-content/65">
            <span className="inline-flex items-center gap-2">
              <CheckCircle2
                className="text-success"
                size={17}
                aria-hidden="true"
              />
              No formatting guesswork
            </span>
            <span className="inline-flex items-center gap-2">
              <Eye className="text-success" size={17} aria-hidden="true" />
              Preview as you edit
            </span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[31rem]">
          <div className="absolute -inset-4 rounded-box bg-primary/10 blur-2xl" />
          <div className="relative overflow-hidden rounded-box border border-base-300 bg-base-100 shadow-2xl">
            <ResumeDocument templateId="classic" />
          </div>
        </div>
      </div>
    </section>
  )
}
