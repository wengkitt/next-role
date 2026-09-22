import {
  ArrowRight,
  Check,
  CheckCheck,
  LayoutTemplate,
  PanelLeft,
  UserRound,
} from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { ResumeDocument } from './ResumeDocument'
import type { TemplateId } from '#/resume-templates/registry'

export function ProductPreviewSection() {
  const [template, setTemplate] = useState<TemplateId>('classic')
  return (
    <section id="features" className="bg-base-100 px-6 py-20 sm:px-10 lg:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[.8fr_1.2fr] lg:gap-20">
        <div>
          <p className="mb-4 text-xs font-semibold tracking-[.18em] text-base-content/50 uppercase">
            Less formatting. More you.
          </p>
          <h2 className="text-4xl font-medium leading-[1.15] tracking-[-.04em] sm:text-5xl">
            Your story,
            <br />
            coming together.
          </h2>
          <p className="mt-6 text-sm leading-7 text-base-content/60">
            A calm space to focus on what matters. Build your resume section by
            section, with your finished document always in view.
          </p>
          <ul className="mt-7 space-y-4 text-sm">
            {[
              'Thoughtful prompts to get you started',
              'Helpful feedback as you find your words',
              'A live preview, with no surprises',
            ].map((text) => (
              <li key={text} className="flex items-center gap-3">
                <Check
                  size={16}
                  className="text-base-content/50"
                  aria-hidden="true"
                />
                {text}
              </li>
            ))}
          </ul>
          <Link to="/sign-up" className="btn btn-ghost mt-7 -ml-4">
            Meet your new workspace <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>
        <div className="overflow-hidden rounded-2xl border border-base-300 bg-base-200 shadow-xl shadow-neutral/5">
          <div className="flex items-center justify-between border-b border-base-300 bg-base-100 px-5 py-4">
            <span className="flex items-center gap-2 text-xs font-medium">
              <PanelLeft size={15} aria-hidden="true" /> My next chapter
            </span>
            <span className="flex items-center gap-1.5 text-[10px] text-base-content/55">
              <CheckCheck size={14} aria-hidden="true" /> All changes saved
            </span>
          </div>
          <div className="grid gap-4 p-5 sm:grid-cols-[.7fr_1fr]">
            <div className="hidden sm:block">
              <div className="mb-4 flex items-center gap-2 text-[10px] font-semibold tracking-widest text-base-content/50 uppercase">
                <UserRound size={13} aria-hidden="true" /> Your details
              </div>
              <div className="space-y-4">
                {[
                  ['Full name', 'Maya Chen'],
                  ['Professional title', 'Product Designer'],
                  ['Location', 'Kuala Lumpur, MY'],
                ].map(([label, value]) => (
                  <div key={label}>
                    <p className="mb-1.5 text-[10px] text-base-content/60">
                      {label}
                    </p>
                    <div className="rounded-md border border-base-300 bg-base-100 px-3 py-2.5 text-[11px]">
                      {value}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-7 rounded-xl bg-secondary p-3 text-secondary-content">
                <CheckCheck size={18} aria-hidden="true" />
                <p className="mt-2 text-xs font-medium">Looking good.</p>
                <p className="mt-1 text-[10px] leading-5">
                  Your career story is taking shape, one detail at a time.
                </p>
              </div>
            </div>
            <div className="overflow-hidden rounded-sm border border-base-300">
              <ResumeDocument compact templateId={template} />
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-base-300 bg-base-100 px-5 py-3">
            <span className="flex items-center gap-2 text-[11px] text-base-content/55">
              <LayoutTemplate size={14} aria-hidden="true" /> Try a different
              look
            </span>
            <div className="flex gap-1">
              {(['classic', 'minimal'] as const).map((value) => (
                <button
                  type="button"
                  key={value}
                  aria-pressed={template === value}
                  onClick={() => setTemplate(value)}
                  className={`btn btn-xs capitalize ${template === value ? 'bg-secondary text-secondary-content border-transparent' : 'btn-ghost'}`}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
