import { Link } from '@tanstack/react-router'
import { ArrowUpRight } from 'lucide-react'
import { SectionHeading } from './SectionHeading'
import { ResumeDocument } from './ResumeDocument'
import { resumeTemplates } from '#/resume-templates/registry'

export function TemplatesSection() {
  return (
    <section
      id="templates"
      className="border-y border-base-300 bg-base-200 px-6 py-20 sm:px-10 lg:py-24"
    >
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          eyebrow="Considered, down to the details"
          title="Great experience deserves good design."
          description="Timeless layouts that let your work do the talking. Easy to read, easy to tailor, and ready for your next opportunity."
        />
        <div className="grid gap-7 md:grid-cols-2">
          {resumeTemplates.map((template, index) => (
            <article key={template.id} className="group">
              <Link
                to="/sign-up"
                aria-label={`Build a resume with ${template.displayName}`}
                className={`block h-80 overflow-hidden rounded-2xl border border-base-300 px-10 pt-9 sm:h-96 sm:px-16 ${index === 0 ? 'bg-secondary' : 'bg-base-300/60'}`}
              >
                <div className="mx-auto max-w-72 origin-bottom transition-transform duration-500 motion-reduce:transition-none group-hover:-translate-y-2">
                  <ResumeDocument compact templateId={template.id} />
                </div>
              </Link>
              <div className="flex items-start justify-between gap-5 px-1 pt-5">
                <div>
                  <h3 className="text-lg font-medium">
                    {template.displayName}
                  </h3>
                  <p className="mt-1 text-xs leading-6 text-base-content/55">
                    {template.id === 'classic'
                      ? 'Structured, confident, and always professional.'
                      : 'A little less on the page. A little more room for you.'}
                  </p>
                </div>
                <Link
                  to="/sign-up"
                  className="btn btn-circle btn-sm border-base-content/20 bg-transparent"
                  aria-label={`Use ${template.displayName}`}
                >
                  <ArrowUpRight size={17} aria-hidden="true" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
