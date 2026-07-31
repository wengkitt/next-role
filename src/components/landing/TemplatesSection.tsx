import { ArrowRight } from 'lucide-react'
import { SectionHeading } from './SectionHeading'
import { ResumeDocument } from './ResumeDocument'

export function TemplatesSection() {
  const templates = [
    ['Classic', 'A trusted, structured layout for clear storytelling.'],
    ['Modern', 'A confident layout with a fresh visual hierarchy.'],
    ['Minimal', 'A focused, understated design that lets experience lead.'],
  ]
  return (
    <section id="templates" className="bg-base-100 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Resume templates"
          title="Choose a layout that suits your story."
          description="Start with a well-crafted foundation, then make it yours."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {templates.map(([name, description], index) => (
            <article
              className="card card-border overflow-hidden bg-base-100"
              key={name}
            >
              <div
                className={`bg-base-200 p-6 ${index === 1 ? 'bg-base-300' : ''}`}
              >
                <div
                  className={
                    index === 1
                      ? 'mx-auto max-w-[11rem] border-l-4 border-primary shadow-md'
                      : 'mx-auto max-w-[11rem] shadow-md'
                  }
                >
                  <ResumeDocument compact />
                </div>
              </div>
              <div className="card-body">
                <h3 className="card-title">{name}</h3>
                <p className="leading-6 text-base-content/70">{description}</p>
                <div className="card-actions mt-3">
                  <a href="#get-started" className="btn btn-outline btn-sm">
                    Use This Template{' '}
                    <ArrowRight size={15} aria-hidden="true" />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
