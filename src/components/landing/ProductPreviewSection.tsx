import { CheckCircle2, ChevronDown, Plus } from 'lucide-react'
import { ResumeDocument } from './ResumeDocument'

export function ProductPreviewSection() {
  const fields = [
    'Personal Information',
    'Work Experience',
    'Education',
    'Skills',
  ]
  const features = [
    'Guided resume sections',
    'Real-time preview',
    'Reorderable sections',
    'Multiple resume versions',
    'PDF export',
  ]
  return (
    <section id="features" className="bg-base-200 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.25fr_.75fr]">
        <div className="mockup-window border border-base-300 bg-base-300 shadow-xl">
          <div className="overflow-hidden bg-base-200 p-3 sm:p-5">
            <div className="grid min-h-[660px] grid-cols-[.65fr_1.35fr] overflow-hidden rounded-box border border-base-300 bg-base-100">
              <aside className="border-r border-base-300 p-3 sm:p-4">
                <div
                  role="tablist"
                  className="tabs tabs-box tabs-sm mb-4 grid grid-cols-2"
                >
                  <button
                    role="tab"
                    className="tab tab-active text-[10px] sm:text-xs"
                  >
                    Content
                  </button>
                  <button role="tab" className="tab text-[10px] sm:text-xs">
                    Design
                  </button>
                </div>
                {fields.map((field, index) => (
                  <button
                    key={field}
                    className={`mb-2 flex w-full items-center justify-between rounded-field px-2 py-2 text-left text-[10px] sm:text-xs ${index === 0 ? 'bg-base-200 font-semibold' : 'hover:bg-base-200'}`}
                  >
                    <span>{field}</span>
                    <ChevronDown size={12} />
                  </button>
                ))}
                <button className="btn btn-ghost btn-xs mt-2">
                  <Plus size={13} /> Add section
                </button>
              </aside>
              <div className="bg-base-200 p-3 sm:p-5">
                <div className="mx-auto w-full">
                  <ResumeDocument />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <p className="mb-3 text-sm font-semibold tracking-widest text-primary uppercase">
            Designed to stay out of your way
          </p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Your career story, beautifully organised.
          </h2>
          <p className="mt-5 leading-7 text-base-content/70">
            NextRole gives you the structure of a great resume without making
            you wrestle with a blank document.
          </p>
          <ul className="mt-7 space-y-3">
            {features.map((feature) => (
              <li className="flex items-center gap-3" key={feature}>
                <CheckCircle2
                  className="shrink-0 text-success"
                  size={19}
                  aria-hidden="true"
                />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
