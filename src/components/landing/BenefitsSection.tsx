import { Eye, LayoutTemplate, WandSparkles } from 'lucide-react'
import { SectionHeading } from './SectionHeading'

export function BenefitsSection() {
  const benefits = [
    [
      WandSparkles,
      'Easy to Build',
      'Guided resume sections help you organise your information without worrying about formatting.',
    ],
    [
      LayoutTemplate,
      'Professional Templates',
      'Choose from clean resume layouts suitable for modern job applications.',
    ],
    [
      Eye,
      'Instant Preview',
      'See changes immediately while editing your resume, so every detail stays in place.',
    ],
  ]
  return (
    <section className="bg-base-100 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Made for your momentum"
          title="Everything you need to make a strong first impression."
          description="A calmer way to turn your experience into a resume you are proud to send."
        />
        <div className="grid gap-5 md:grid-cols-3">
          {benefits.map(([Icon, title, description]) => (
            <article
              className="card card-border bg-base-100"
              key={title as string}
            >
              <div className="card-body gap-4">
                <div className="flex size-11 items-center justify-center rounded-box bg-base-200 text-primary">
                  <Icon size={22} aria-hidden="true" />
                </div>
                <h3 className="card-title">{title as string}</h3>
                <p className="leading-7 text-base-content/70">
                  {description as string}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
