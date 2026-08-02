import { Link } from '@tanstack/react-router'
import { ArrowRight, BriefcaseBusiness } from 'lucide-react'

export function FinalCTASection() {
  return (
    <section
      id="get-started"
      className="bg-neutral px-4 py-20 text-neutral-content sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-2xl text-center">
        <BriefcaseBusiness
          className="mx-auto mb-5 text-primary"
          size={34}
          aria-hidden="true"
        />
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Ready for your next role?
        </h2>
        <p className="mt-4 text-lg text-neutral-content/75">
          Start with your experience. Leave with a resume you are ready to send.
        </p>
        <Link to="/sign-up" className="btn btn-primary btn-lg mt-8">
          Start building <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </div>
    </section>
  )
}
