import { Link } from '@tanstack/react-router'
import { ArrowRight, ArrowUpRight } from 'lucide-react'

export function FinalCTASection() {
  return (
    <section id="get-started" className="bg-base-200 px-6 py-8 sm:px-10">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-neutral px-6 py-16 text-center text-neutral-content sm:py-20">
        <ArrowUpRight
          size={220}
          strokeWidth={0.5}
          className="pointer-events-none absolute -right-8 -bottom-10 text-neutral-content/10"
          aria-hidden="true"
        />
        <p className="mb-5 text-xs tracking-[.18em] uppercase text-neutral-content/55">
          The next chapter is yours
        </p>
        <h2 className="text-4xl font-medium tracking-[-.04em] sm:text-5xl">
          Good things start
          <br />
          with a little <span className="font-serif italic">confidence.</span>
        </h2>
        <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-neutral-content/65">
          You bring the experience. We’ll help you put it into words.
        </p>
        <Link
          to="/sign-up"
          className="btn mt-8 border-0 bg-accent px-6 text-accent-content"
        >
          Let’s build your resume <ArrowRight size={17} aria-hidden="true" />
        </Link>
      </div>
    </section>
  )
}
