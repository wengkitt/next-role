import { CheckCircle2, ChevronDown, Eye, Plus, Sparkles } from 'lucide-react'
import { ResumeDocument } from './ResumeDocument'
import { SectionHeading } from './SectionHeading'

export function ProductPreviewSection() {
  const fields = [
    'Personal Information',
    'Professional Summary',
    'Work Experience',
    'Education',
    'Skills',
    'Projects',
  ]
  const features = [
    'Move or hide sections to fit the story you want to tell.',
    'See quality checks beside the content you are editing.',
    'Preview and export the same searchable A4 PDF document.',
  ]
  return (
    <section id="features" className="bg-base-200 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Inside the editor"
          title="The blank page is not part of the process."
          description="Work through the sections that matter, keep an eye on the finished document, and make changes while the whole story is still in view."
        />
        <div className="grid items-start gap-10 lg:grid-cols-[1.35fr_.65fr]">
          <div className="mockup-window border border-base-300 bg-base-300 shadow-xl">
            <div className="bg-base-200 p-2 sm:p-4">
              <div className="overflow-hidden rounded-box border border-base-300 bg-base-100">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-base-300 px-3 py-3 sm:px-4">
                  <div>
                    <p className="text-xs text-base-content/55">Editing</p>
                    <p className="font-semibold">Product Designer Resume</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="badge badge-ghost badge-sm">Draft</span>
                    <span className="badge badge-success badge-soft badge-sm">
                      Saved
                    </span>
                  </div>
                </div>
                <div className="grid min-h-[520px] gap-3 bg-base-300 p-3 sm:grid-cols-[10rem_minmax(0,1fr)] sm:p-4">
                  <aside className="hidden rounded-box border border-base-300 bg-base-100 p-3 sm:block">
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <p className="text-xs font-semibold text-base-content/60">
                        Content
                      </p>
                      <span className="badge badge-ghost badge-xs">
                        6 sections
                      </span>
                    </div>
                    <div className="space-y-1">
                      {fields.map((field, index) => (
                        <button
                          key={field}
                          type="button"
                          className={`flex w-full items-center justify-between rounded-field px-2 py-2 text-left text-xs ${index === 0 ? 'bg-primary text-primary-content' : 'hover:bg-base-200'}`}
                        >
                          <span>{field}</span>
                          <ChevronDown size={12} aria-hidden="true" />
                        </button>
                      ))}
                    </div>
                    <button type="button" className="btn btn-ghost btn-xs mt-3">
                      <Plus size={13} aria-hidden="true" /> Add section
                    </button>
                    <div className="card card-border mt-5 bg-base-100">
                      <div className="card-body gap-2 p-3">
                        <div className="flex items-center gap-2 text-xs font-semibold">
                          <Sparkles
                            className="text-primary"
                            size={14}
                            aria-hidden="true"
                          />
                          Quality checks
                        </div>
                        <p className="text-[11px] leading-5 text-base-content/65">
                          Keep contact details, impact, and page length in view
                          as you edit.
                        </p>
                        <div className="space-y-1 text-[11px]">
                          <p className="flex items-center gap-1.5">
                            <CheckCircle2
                              className="text-success"
                              size={13}
                              aria-hidden="true"
                            />
                            Contact details added
                          </p>
                          <p className="flex items-center gap-1.5">
                            <CheckCircle2
                              className="text-success"
                              size={13}
                              aria-hidden="true"
                            />
                            Experience has outcomes
                          </p>
                        </div>
                      </div>
                    </div>
                  </aside>
                  <div className="min-w-0 bg-base-300 p-1 sm:p-2">
                    <div className="mx-auto w-full max-w-[29rem]">
                      <ResumeDocument templateId="classic" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:pt-8">
            <div className="badge badge-soft badge-primary mb-4 gap-2 border-0">
              <Eye size={14} aria-hidden="true" />
              Built around the finished document
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">
              Your career story, beautifully organised.
            </h2>
            <p className="mt-5 leading-7 text-base-content/70">
              NextRole gives you the structure of a great resume without making
              you wrestle with a blank document.
            </p>
            <ul className="mt-7 space-y-4">
              {features.map((feature) => (
                <li className="flex items-start gap-3" key={feature}>
                  <CheckCircle2
                    className="mt-0.5 shrink-0 text-success"
                    size={19}
                    aria-hidden="true"
                  />
                  <span className="leading-6">{feature}</span>
                </li>
              ))}
            </ul>
            <div className="card card-border mt-8 bg-base-100 shadow-sm">
              <div className="card-body gap-2 p-5">
                <p className="text-sm font-semibold">A preview you can trust</p>
                <p className="text-sm leading-6 text-base-content/65">
                  The editor preview and exported PDF use the same document, so
                  there are fewer surprises when you are ready to apply.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
