import { ArrowUpRight, Download, LayoutTemplate, PenLine } from 'lucide-react'
import { SectionHeading } from './SectionHeading'

export function HowItWorksSection() {
  const steps = [
    {
      icon: PenLine,
      title: 'Start with your story',
      text: 'Add your experience, skills, and the details that make you, you. We’ll give you a clear place for everything.',
    },
    {
      icon: LayoutTemplate,
      title: 'Make it feel like you',
      text: 'Choose a considered template. Refine your content, move sections, and watch your resume come together.',
    },
    {
      icon: Download,
      title: 'Take the next step',
      text: 'Give it a final look, download your PDF, and send your experience out into the world.',
    },
  ]
  return (
    <section
      id="how-it-works"
      className="bg-base-200 px-6 py-20 sm:px-10 lg:py-24"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="A simple way forward"
          title="From a fresh page to a fresh start."
          description="Three small steps. One resume you can feel good about."
        />
        <div className="grid gap-8 md:grid-cols-3">
          {steps.map(({ icon: Icon, title, text }, i) => (
            <article
              key={title}
              className="border-t border-base-content/20 pt-6"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-base-content/45">
                  0{i + 1}
                </span>
                <Icon size={21} strokeWidth={1.5} aria-hidden="true" />
              </div>
              <h3 className="mt-8 text-xl font-medium tracking-tight">
                {title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-base-content/60">
                {text}
              </p>
              <ArrowUpRight
                size={18}
                className="mt-6 text-base-content/35"
                aria-hidden="true"
              />
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
