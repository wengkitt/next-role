import { CheckCheck, FileText, Layers3, ScanText } from 'lucide-react'

export function BenefitsSection() {
  const benefits = [
    {
      icon: FileText,
      title: 'Goodbye, blank page',
      description: 'A little structure to help your story take shape.',
    },
    {
      icon: CheckCheck,
      title: 'The details, covered',
      description: 'Helpful checks for a more complete resume.',
    },
    {
      icon: Layers3,
      title: 'A version for every role',
      description: 'Tailor your experience to each opportunity.',
    },
    {
      icon: ScanText,
      title: 'Polished. Portable. Yours.',
      description: 'Clean, searchable PDFs, ready to send.',
    },
  ]
  return (
    <section id="benefits" className="border-y border-base-300 bg-base-100">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-9 sm:grid-cols-2 sm:px-10 lg:grid-cols-4 lg:gap-6">
        {benefits.map(({ icon: Icon, title, description }) => (
          <div className="flex gap-3" key={title}>
            <Icon
              size={21}
              strokeWidth={1.5}
              className="mt-0.5 shrink-0 text-base-content/65"
              aria-hidden="true"
            />
            <div>
              <h2 className="text-sm font-semibold">{title}</h2>
              <p className="mt-1.5 max-w-56 text-xs leading-5 text-base-content/55">
                {description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
