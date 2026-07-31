import { SectionHeading } from './SectionHeading'

export function HowItWorksSection() {
  const steps = [
    [
      '01',
      'Add Your Experience',
      'Tell us about your work, education, and skills with simple guided prompts.',
    ],
    [
      '02',
      'Choose a Template',
      'Select a professional layout that matches the role and your personal style.',
    ],
    [
      '03',
      'Download Your Resume',
      'Review your finished resume and export it when you are ready to apply.',
    ],
  ]
  return (
    <section
      id="how-it-works"
      className="bg-base-200 px-4 py-20 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="How it works"
          title="From blank page to ready-to-send."
          description="Three simple steps, one resume that feels unmistakably yours."
        />
        <ul className="steps steps-vertical w-full lg:steps-horizontal">
          {steps.map(([number, title, description]) => (
            <li
              className="step step-primary text-left"
              data-content={number}
              key={number}
            >
              <div className="max-w-xs py-4 lg:px-4">
                <h3 className="font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-base-content/70">
                  {description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
