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
          title="From experience to ready-to-send."
          description="A simple workflow for building a strong base, tailoring the story, and checking the final document."
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
        <div className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-3">
          <div className="card card-border bg-base-100 shadow-sm">
            <div className="card-body p-5">
              <p className="text-sm font-semibold">
                Keep the important details
              </p>
              <p className="text-sm leading-6 text-base-content/65">
                Add the sections that make your experience relevant, then hide
                or reorder the rest.
              </p>
            </div>
          </div>
          <div className="card card-border bg-base-100 shadow-sm">
            <div className="card-body p-5">
              <p className="text-sm font-semibold">Make impact visible</p>
              <p className="text-sm leading-6 text-base-content/65">
                Use quality checks to spot missing outcomes and strengthen the
                details employers scan for.
              </p>
            </div>
          </div>
          <div className="card card-border bg-base-100 shadow-sm">
            <div className="card-body p-5">
              <p className="text-sm font-semibold">Send the document you saw</p>
              <p className="text-sm leading-6 text-base-content/65">
                Review the same searchable A4 PDF you export when you are ready
                to apply.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
