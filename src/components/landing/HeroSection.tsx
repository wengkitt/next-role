import { Link } from '@tanstack/react-router'
import {
  ArrowDown,
  ArrowRight,
  Check,
  CheckCheck,
  FileText,
} from 'lucide-react'
import { ResumeDocument } from './ResumeDocument'

export function HeroSection() {
  return (
    <section id="top" className="overflow-hidden bg-base-200">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 py-16 sm:px-10 lg:min-h-[730px] lg:grid-cols-[1fr_1fr] lg:gap-16 lg:py-20">
        <div className="max-w-xl">
          <p className="mb-7 flex items-center gap-2.5 text-xs font-semibold tracking-[.16em] uppercase text-base-content/65">
            <span className="size-2 rounded-full bg-success" /> A little
            clarity. A big next step.
          </p>
          <h1 className="text-5xl leading-[1.08] font-medium tracking-[-.055em] text-balance sm:text-6xl lg:text-7xl">
            Your experience.
            <br />
            Your story.
            <br />
            <span className="font-serif italic text-base-content/60">
              Your next role.
            </span>
          </h1>
          <p className="mt-7 max-w-md text-base leading-7 text-base-content/65 sm:text-lg">
            A thoughtful resume builder for whatever comes next. Find the right
            words, make it your own, and put your best work forward.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link to="/sign-up" className="btn btn-primary h-12 px-6">
              Build my resume <ArrowRight size={17} aria-hidden="true" />
            </Link>
            <a href="#templates" className="btn btn-ghost h-12 px-4">
              Explore templates <ArrowDown size={16} aria-hidden="true" />
            </a>
          </div>
          <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-xs text-base-content/60">
            {['Guided from the start', 'Ready-to-send PDFs'].map((text) => (
              <span key={text} className="inline-flex items-center gap-1.5">
                <Check size={14} aria-hidden="true" />
                {text}
              </span>
            ))}
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-[490px] px-4 sm:px-7">
          <div className="absolute inset-x-0 top-12 bottom-8 rounded-[50%] bg-secondary" />
          <div className="relative rotate-3 overflow-hidden rounded-sm border border-base-300 shadow-xl shadow-neutral/10 motion-safe:transition-transform motion-safe:duration-500 hover:rotate-0">
            <ResumeDocument />
          </div>
          <div className="absolute -left-1 top-20 flex items-center gap-3 rounded-xl border border-base-300 bg-base-100 px-4 py-3 shadow-lg shadow-neutral/5 sm:-left-5">
            <span className="grid size-9 place-items-center rounded-full bg-secondary text-secondary-content">
              <CheckCheck size={18} aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-semibold">
                A stronger first impression
              </p>
              <p className="mt-0.5 text-[11px] text-base-content/55">
                Clear, polished, and all you.
              </p>
            </div>
          </div>
          <div className="absolute -right-1 bottom-9 flex items-center gap-3 rounded-xl border border-base-300 bg-base-100 p-4 shadow-lg shadow-neutral/5 sm:-right-5">
            <FileText
              size={20}
              className="text-base-content/55"
              aria-hidden="true"
            />
            <div>
              <p className="text-xs font-semibold">Your next chapter.pdf</p>
              <p className="mt-0.5 text-[11px] text-base-content/55">
                Ready when you are
              </p>
            </div>
            <span className="ml-2 grid size-6 place-items-center rounded-full bg-secondary text-secondary-content">
              <Check size={13} aria-hidden="true" />
            </span>
          </div>
          <p className="relative mt-7 text-center font-mono text-[10px] tracking-widest text-base-content/45 uppercase">
            Made with NextRole · Made for you
          </p>
        </div>
      </div>
    </section>
  )
}
