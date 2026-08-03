import type { TemplateId } from '#/resume-templates/registry'

type ResumeDocumentProps = {
  compact?: boolean
  templateId?: TemplateId
}

const templateStyles: Record<
  TemplateId,
  {
    header: string
    title: string
    role: string
    contact: string
    section: string
  }
> = {
  classic: {
    header: 'border-b-2 border-primary pb-3',
    title: 'font-bold',
    role: 'text-primary',
    contact: 'text-base-content/65',
    section: 'text-primary',
  },
  minimal: {
    header: 'border-b border-base-300 pb-3',
    title: 'font-semibold',
    role: 'text-base-content/70',
    contact: 'text-base-content/55',
    section: 'text-base-content/60',
  },
}

export function ResumeDocument({
  compact = false,
  templateId = 'classic',
}: ResumeDocumentProps) {
  const styles = templateStyles[templateId]

  return (
    <article
      className={`bg-base-100 text-base-content shadow-xl ${compact ? 'min-h-[16rem] p-4 text-[6px] leading-tight' : 'min-h-[620px] p-7 text-[10px] leading-relaxed sm:p-9 sm:text-xs'}`}
    >
      <header className={styles.header}>
        <h3
          className={`${styles.title} tracking-tight ${compact ? 'text-sm' : 'text-2xl'}`}
        >
          Maya Chen
        </h3>
        <p className={`font-semibold ${styles.role}`}>Product Designer</p>
        <p className={`mt-1 ${styles.contact}`}>
          Kuala Lumpur, MY · maya.chen@email.com · linkedin.com/in/mayachen
        </p>
      </header>
      <ResumeSection
        title="Profile"
        compact={compact}
        sectionClass={styles.section}
      >
        Product designer with 6 years of experience turning complex workflows
        into clear, thoughtful digital products.
      </ResumeSection>
      <ResumeSection
        title="Experience"
        compact={compact}
        sectionClass={styles.section}
      >
        <p>
          <strong>Senior Product Designer</strong> · Atlas Works{' '}
          <span className="float-right">2022 — Present</span>
        </p>
        <p className="text-base-content/70">
          Led end-to-end design for a B2B analytics platform used by teams
          across complex workflows.
        </p>
        <p className="mt-2">
          <strong>Product Designer</strong> · Northstar Studio{' '}
          <span className="float-right">2019 — 2022</span>
        </p>
      </ResumeSection>
      <ResumeSection
        title="Education"
        compact={compact}
        sectionClass={styles.section}
      >
        B.Des. Interaction Design · University of Malaya · 2019
      </ResumeSection>
      <ResumeSection
        title="Skills"
        compact={compact}
        sectionClass={styles.section}
      >
        Product strategy · User research · Figma · Prototyping · Design systems
      </ResumeSection>
    </article>
  )
}

function ResumeSection({
  title,
  children,
  compact,
  sectionClass,
}: {
  title: string
  children: React.ReactNode
  compact: boolean
  sectionClass: string
}) {
  return (
    <section className={compact ? 'mt-2' : 'mt-5'}>
      <h4 className={`mb-1 font-bold tracking-wider uppercase ${sectionClass}`}>
        {title}
      </h4>
      <div>{children}</div>
    </section>
  )
}
