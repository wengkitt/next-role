import { Link } from '@tanstack/react-router'
import { SectionHeading } from './SectionHeading'
import { ResumeDocument } from './ResumeDocument'
import { resumeTemplates } from '#/resume-templates/registry'

export function TemplatesSection() {
  return (
    <section id="templates" className="bg-base-100 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Resume templates"
          title="Choose a layout that helps your story come through."
          description="Every template is built around the same searchable resume structure, so you can choose the presentation without losing the substance."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {resumeTemplates.map((template) => (
            <article
              className="card card-border overflow-hidden bg-base-100 shadow-sm"
              key={template.id}
            >
              <div
                className={`p-6 ${template.id === 'modern' ? 'bg-base-300' : 'bg-base-200'}`}
              >
                <div className="mx-auto max-w-[12rem] shadow-md">
                  <ResumeDocument compact templateId={template.id} />
                </div>
              </div>
              <div className="card-body gap-3">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="card-title">{template.displayName}</h3>
                  <span className="badge badge-ghost badge-sm">
                    {template.id}
                  </span>
                </div>
                <p className="leading-6 text-base-content/70">
                  {template.description}
                </p>
                <p className="text-sm leading-6 text-base-content/55">
                  {template.guidance}
                </p>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link to="/sign-up" className="btn btn-primary">
            Create your resume
          </Link>
        </div>
      </div>
    </section>
  )
}
