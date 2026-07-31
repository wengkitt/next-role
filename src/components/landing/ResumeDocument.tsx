export function ResumeDocument({ compact = false }: { compact?: boolean }) {
  return (
    <article
      className={`bg-base-100 text-base-content shadow-xl ${compact ? 'min-h-[16rem] p-4 text-[6px] leading-tight' : 'min-h-[620px] p-7 text-[10px] leading-relaxed sm:p-9 sm:text-xs'}`}
    >
      <header className="border-b-2 border-primary pb-3">
        <h3
          className={`font-bold tracking-tight ${compact ? 'text-sm' : 'text-2xl'}`}
        >
          Maya Chen
        </h3>
        <p className="font-semibold text-primary">Product Designer</p>
        <p className="mt-1 text-base-content/65">
          Kuala Lumpur, MY · maya.chen@email.com · linkedin.com/in/mayachen
        </p>
      </header>
      <ResumeSection title="Profile" compact={compact}>
        Product designer with 6 years of experience turning complex workflows
        into clear, thoughtful digital products.
      </ResumeSection>
      <ResumeSection title="Experience" compact={compact}>
        <p>
          <strong>Senior Product Designer</strong> · Atlas Works{' '}
          <span className="float-right">2022 — Present</span>
        </p>
        <p className="text-base-content/70">
          Led end-to-end design for a B2B analytics platform used by 14,000+
          teams.
        </p>
        <p className="mt-2">
          <strong>Product Designer</strong> · Northstar Studio{' '}
          <span className="float-right">2019 — 2022</span>
        </p>
      </ResumeSection>
      <ResumeSection title="Education" compact={compact}>
        B.Des. Interaction Design · University of Malaya · 2019
      </ResumeSection>
      <ResumeSection title="Skills" compact={compact}>
        Product strategy · User research · Figma · Prototyping · Design systems
      </ResumeSection>
    </article>
  )
}

function ResumeSection({
  title,
  children,
  compact,
}: {
  title: string
  children: React.ReactNode
  compact: boolean
}) {
  return (
    <section className={compact ? 'mt-2' : 'mt-5'}>
      <h4 className="mb-1 font-bold tracking-wider text-primary uppercase">
        {title}
      </h4>
      <div>{children}</div>
    </section>
  )
}
