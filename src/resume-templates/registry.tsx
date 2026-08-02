import type { NormalizedResume } from '#/lib/resume-normalizer'
import type { ComponentType } from 'react'

export type TemplateId = 'classic' | 'modern' | 'minimal'
type Template = {
  id: TemplateId
  displayName: string
  description: string
  renderer: ComponentType<{ resume: NormalizedResume }>
}
const Section = ({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) => (
  <section className="resume-section">
    <h2>{title}</h2>
    {children}
  </section>
)
const descriptionBullets = (description: string) =>
  description
    .split(/\n+|(?<=[.!?])\s+(?=[A-Z])/)
    .map((item) => item.trim())
    .filter(Boolean)
const Contact = ({ resume }: { resume: NormalizedResume }) => (
  <div className="resume-contact">
    {resume.contact.map((item, index) => (
      <span key={item.label}>
        {index > 0 && ' · '}
        {item.href ? <a href={item.href}>{item.label}</a> : item.label}
      </span>
    ))}
  </div>
)
const Content = ({ resume }: { resume: NormalizedResume }) => (
  <>
    {resume.summary && (
      <Section title="Professional Summary">
        <p>{resume.summary}</p>
      </Section>
    )}
    {resume.work.length > 0 && (
      <Section title="Work Experience">
        {resume.work.map((item) => (
          <article className="resume-entry" key={item.id}>
            <div>
              <strong>{item.jobTitle}</strong>
              <span>
                {[item.company, item.location].filter(Boolean).join(' · ')}
              </span>
            </div>
            <time>{item.dateRange}</time>
            {item.bullets.length > 0 && (
              <ul>
                {item.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            )}
          </article>
        ))}
      </Section>
    )}
    {resume.education.length > 0 && (
      <Section title="Education">
        {resume.education.map((item) => (
          <article className="resume-entry" key={item.id}>
            <div>
              <strong>{item.qualification}</strong>
              <span>
                {[item.institution, item.fieldOfStudy, item.location]
                  .filter(Boolean)
                  .join(' · ')}
              </span>
            </div>
            <time>{item.dateRange}</time>
            {item.description && (
              <ul>
                {descriptionBullets(item.description).map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            )}
          </article>
        ))}
      </Section>
    )}
    {resume.skills.length > 0 && (
      <Section title="Skills">
        <div className="skills-block">
          {resume.skills.map((skill) => (
            <span className="skill-tag" key={skill}>
              {skill}
            </span>
          ))}
        </div>
      </Section>
    )}
    {resume.projects.length > 0 && (
      <Section title="Projects">
        {resume.projects.map((item) => (
          <article className="resume-entry" key={item.id}>
            <div>
              <strong>{item.name}</strong>
              <span>{item.role}</span>
            </div>
            {item.dateRange && <time>{item.dateRange}</time>}
            {item.technologyList.length > 0 && (
              <p className="resume-technologies">
                {item.technologyList.join(' · ')}
              </p>
            )}
            {item.description && (
              <ul>
                {descriptionBullets(item.description).map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            )}
            {item.projectUrl && (
              <a className="resume-link" href={item.projectUrl}>
                Live site: {item.projectUrl}
              </a>
            )}
            {item.repositoryUrl && (
              <a className="resume-link" href={item.repositoryUrl}>
                Repository: {item.repositoryUrl}
              </a>
            )}
          </article>
        ))}
      </Section>
    )}
  </>
)
function Classic({ resume }: { resume: NormalizedResume }) {
  return (
    <div className="resume-template classic-template">
      <header>
        <h1>{resume.name}</h1>
        {resume.title && <p className="resume-title">{resume.title}</p>}
        <Contact resume={resume} />
      </header>
      <Content resume={resume} />
    </div>
  )
}
function Modern({ resume }: { resume: NormalizedResume }) {
  return (
    <div className="resume-template modern-template">
      <header>
        <h1>{resume.name}</h1>
        {resume.title && <p className="resume-title">{resume.title}</p>}
        <Contact resume={resume} />
      </header>
      <Content resume={resume} />
    </div>
  )
}
function Minimal({ resume }: { resume: NormalizedResume }) {
  return (
    <div className="resume-template minimal-template">
      <header>
        <h1>{resume.name}</h1>
        {resume.title && <p className="resume-title">{resume.title}</p>}
        <Contact resume={resume} />
      </header>
      <Content resume={resume} />
    </div>
  )
}
export const resumeTemplates: Template[] = [
  {
    id: 'classic',
    displayName: 'Classic',
    description: 'Structured and traditional',
    renderer: Classic,
  },
  {
    id: 'modern',
    displayName: 'Modern',
    description: 'Contemporary with a subtle accent',
    renderer: Modern,
  },
  {
    id: 'minimal',
    displayName: 'Minimal',
    description: 'Clean, spacious, and understated',
    renderer: Minimal,
  },
]
export const getResumeTemplate = (id: TemplateId) =>
  resumeTemplates.find((template) => template.id === id) ?? resumeTemplates[0]
