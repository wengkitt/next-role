import { Eye, FileText, LayoutTemplate, Sparkles } from 'lucide-react'
import { SectionHeading } from './SectionHeading'

export function BenefitsSection() {
  const benefits = [
    {
      icon: FileText,
      eyebrow: '01',
      title: 'Start with structure',
      description:
        'Guided sections make it easier to turn your experience into a complete, readable story.',
    },
    {
      icon: Sparkles,
      eyebrow: '02',
      title: 'Improve with confidence',
      description:
        'Quality checks surface missing details, long sections, and places where impact could be clearer.',
    },
    {
      icon: LayoutTemplate,
      eyebrow: '03',
      title: 'Choose your presentation',
      description:
        'Use Classic ATS or Minimal when you want a different visual starting point.',
    },
    {
      icon: Eye,
      eyebrow: '04',
      title: 'Preview before you send',
      description:
        'See the same A4 document you will export, with selectable text and automatic page wrapping.',
    },
  ]
  return (
    <section id="benefits" className="bg-base-100 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="The important parts, covered"
          title="A better way to move from experience to application."
          description="NextRole gives you the structure, feedback, and presentation tools to make your resume easier to finish and easier to trust."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map(({ icon: Icon, eyebrow, title, description }) => (
            <article
              className="card card-border bg-base-100 shadow-sm"
              key={title}
            >
              <div className="card-body gap-4 p-5">
                <div className="flex items-center justify-between">
                  <div className="flex size-11 items-center justify-center rounded-box bg-base-200 text-primary">
                    <Icon size={22} aria-hidden="true" />
                  </div>
                  <span className="badge badge-ghost badge-sm">{eyebrow}</span>
                </div>
                <h3 className="card-title text-lg">{title}</h3>
                <p className="leading-7 text-base-content/70">{description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
