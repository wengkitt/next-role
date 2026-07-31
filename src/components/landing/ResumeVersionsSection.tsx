import { ArrowRight, CircleUserRound, FileText } from 'lucide-react'

export function ResumeVersionsSection() {
  const roles = [
    'Frontend Developer Resume',
    'Backend Developer Resume',
    'Full Stack Developer Resume',
  ]
  return (
    <section className="bg-base-100 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
        <div>
          <p className="mb-3 text-sm font-semibold tracking-widest text-primary uppercase">
            Built for every opportunity
          </p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            One career. Multiple opportunities.
          </h2>
          <p className="mt-5 max-w-xl leading-7 text-base-content/70">
            Maintain one complete career profile, then tailor focused resume
            versions for every job you want to pursue.
          </p>
          <a href="#get-started" className="btn btn-outline mt-7">
            Explore resume versions <ArrowRight size={17} aria-hidden="true" />
          </a>
        </div>
        <div className="rounded-box border border-base-300 bg-base-200 p-5 sm:p-8">
          <div className="mx-auto max-w-sm text-center">
            <div className="inline-flex items-center gap-2 rounded-box bg-primary px-4 py-3 font-semibold text-primary-content">
              <CircleUserRound size={19} />
              Master Career Profile
            </div>
            <div className="mx-auto h-8 w-px bg-base-content/25" />
            <div className="grid gap-3">
              {roles.map((role) => (
                <div
                  className="flex items-center gap-3 rounded-box border border-base-300 bg-base-100 p-3 text-left text-sm shadow-sm"
                  key={role}
                >
                  <FileText className="text-primary" size={18} />
                  <span className="font-medium">{role}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
