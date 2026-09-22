import { Link } from '@tanstack/react-router'
import { ArrowRight, ArrowUpRight, Copy, FileText } from 'lucide-react'

export function ResumeVersionsSection() {
  return (
    <section className="bg-base-100 px-6 py-20 sm:px-10 lg:py-24">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-24">
        <div className="min-w-0 rounded-2xl border border-base-300 bg-base-200 p-6 sm:p-9">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-xs font-medium text-base-content/60">
              A few possibilities. One place.
            </p>
            <Copy
              size={17}
              className="text-base-content/45"
              aria-hidden="true"
            />
          </div>
          <div className="space-y-3">
            {[
              'Product designer · My base resume',
              'Senior designer · Atlas',
              'Design lead · Northstar',
            ].map((title, i) => (
              <div
                key={title}
                className={`flex items-center gap-4 rounded-xl border border-base-300 bg-base-100 p-4 ${i === 1 ? 'sm:translate-x-3 shadow-md shadow-neutral/5' : ''}`}
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-base-200">
                  <FileText size={19} strokeWidth={1.5} aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium">{title}</p>
                  <p className="mt-1 text-[10px] text-base-content/50">
                    {i === 0
                      ? 'Your starting point'
                      : 'Tailored to the opportunity'}
                  </p>
                </div>
                <ArrowUpRight
                  size={16}
                  className="shrink-0 text-base-content/40"
                  aria-hidden="true"
                />
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-4 text-xs font-semibold tracking-[.18em] text-base-content/50 uppercase">
            One story. Many possibilities.
          </p>
          <h2 className="text-3xl font-medium leading-tight tracking-[-.035em] sm:text-4xl">
            A different opportunity.
            <br />
            The same brilliant you.
          </h2>
          <p className="mt-5 text-sm leading-7 text-base-content/60">
            Every role calls for something a little different. Duplicate your
            resume, bring the right experience forward, and keep every version
            beautifully organised.
          </p>
          <Link
            to="/sign-up"
            className="btn btn-ghost mt-6 -ml-4 max-w-full whitespace-normal"
          >
            Find your next possibility{' '}
            <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}
