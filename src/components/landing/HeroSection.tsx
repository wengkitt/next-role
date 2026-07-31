import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react'
import { ResumeDocument } from './ResumeDocument'
import { Link } from '@tanstack/react-router'

export function HeroSection() {
  return (
    <section id="top" className="overflow-hidden bg-base-200">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:px-8 lg:py-24">
        <div className="max-w-xl">
          <div className="badge badge-soft badge-primary gap-2 border-0 px-3 py-3 font-medium">
            <Sparkles size={14} aria-hidden="true" />
            Professional Resume Builder
          </div>
          <h1 className="mt-6 text-5xl font-bold tracking-tight text-balance sm:text-6xl">
            Build a resume for your next role.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-base-content/70">
            Create polished resumes with guided sections, professional
            templates, and a live preview that keeps every detail looking its
            best.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/sign-in" className="btn btn-primary btn-lg">
              Build My Resume <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <a href="#templates" className="btn btn-ghost btn-lg">
              View Templates
            </a>
          </div>
          <div className="mt-8 flex items-center gap-3 text-sm text-base-content/65">
            <CheckCircle2
              className="text-success"
              size={18}
              aria-hidden="true"
            />
            No design skills needed. Start with your experience.
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-md lg:max-w-lg">
          <div className="absolute -inset-5 -z-0 rounded-box bg-primary/10 blur-2xl" />
          <div className="relative rotate-1 rounded-box border border-base-300 bg-base-300 p-3 shadow-2xl sm:p-5">
            <ResumeDocument />
          </div>
        </div>
      </div>
    </section>
  )
}
