import type {
  ResumeAwardData,
  ResumeCertificationData,
  ResumeDocumentData,
  ResumeDocumentSection,
  ResumeEducationData,
  ResumeExperienceData,
  ResumeProjectData,
  ResumeVolunteerData,
} from '#/lib/resume-document'
import type { TemplateId } from '#/resume-templates/registry'
import {
  Document,
  Link,
  Page,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer'
import { Fragment } from 'react'

const colors = {
  ink: '#18212b',
  muted: '#56616d',
  rule: '#cbd3da',
  accent: '#285a7d',
  white: '#ffffff',
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: colors.white,
    color: colors.ink,
    fontFamily: 'Helvetica',
    fontSize: 9.5,
    lineHeight: 1.35,
    paddingBottom: 42,
    paddingLeft: 42,
    paddingRight: 42,
    paddingTop: 38,
  },
  header: {
    borderBottomColor: colors.rule,
    borderBottomWidth: 1,
    marginBottom: 18,
    paddingBottom: 12,
  },
  minimalHeader: {
    borderBottomWidth: 0,
    marginBottom: 16,
    paddingBottom: 0,
  },
  name: {
    color: colors.ink,
    fontSize: 23,
    fontWeight: 700,
    lineHeight: 1.08,
  },
  title: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: 600,
    marginTop: 4,
  },
  minimalTitle: {
    color: colors.muted,
    fontWeight: 400,
  },
  contact: {
    color: colors.muted,
    flexDirection: 'row',
    flexWrap: 'wrap',
    fontSize: 8.5,
    marginTop: 8,
  },
  contactItem: {
    color: colors.muted,
  },
  contactSeparator: {
    color: colors.rule,
    marginLeft: 5,
    marginRight: 5,
  },
  link: {
    color: colors.accent,
    textDecoration: 'none',
  },
  section: {
    marginBottom: 13,
  },
  sectionHeading: {
    borderBottomColor: colors.rule,
    borderBottomWidth: 1,
    color: colors.accent,
    fontSize: 9.5,
    fontWeight: 700,
    letterSpacing: 0.9,
    marginBottom: 8,
    paddingBottom: 3,
    textTransform: 'uppercase',
  },
  minimalSectionHeading: {
    borderBottomWidth: 0,
    color: colors.ink,
    letterSpacing: 0.6,
    marginBottom: 6,
    paddingBottom: 0,
  },
  paragraph: {
    color: colors.ink,
    fontSize: 9.5,
  },
  entry: {
    marginBottom: 10,
  },
  entryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  entryMain: {
    flexGrow: 1,
    flexShrink: 1,
    paddingRight: 12,
  },
  entryTitle: {
    color: colors.ink,
    fontSize: 10,
    fontWeight: 700,
  },
  entryMeta: {
    color: colors.muted,
    fontSize: 9,
    marginTop: 1,
  },
  entryDate: {
    color: colors.muted,
    flexShrink: 0,
    fontSize: 8.5,
    textAlign: 'right',
    width: 100,
  },
  bulletList: {
    marginTop: 4,
    paddingLeft: 11,
  },
  bullet: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  bulletMark: {
    color: colors.accent,
    paddingRight: 5,
    width: 10,
  },
  bulletText: {
    color: colors.ink,
    flexGrow: 1,
    flexShrink: 1,
    fontSize: 9.2,
  },
  skills: {
    color: colors.ink,
    fontSize: 9.5,
  },
  skillLabel: {
    color: colors.accent,
    fontWeight: 700,
  },
  projectLink: {
    color: colors.accent,
    fontSize: 8.5,
    marginTop: 3,
    textDecoration: 'none',
  },
  compactLine: {
    color: colors.ink,
    fontSize: 9.2,
    marginBottom: 3,
  },
  compactMuted: {
    color: colors.muted,
  },
  footer: {
    bottom: 18,
    color: colors.muted,
    fontSize: 7.5,
    left: 42,
    position: 'absolute',
    right: 42,
    textAlign: 'right',
  },
})

const displayUrl = (url: string, label: string) => ({ url, label })

function ContactLine({ data }: { data: ResumeDocumentData['profile'] }) {
  const items: Array<{ label: string; href?: string }> = []
  if (data.email)
    items.push({ label: data.email, href: `mailto:${data.email}` })
  if (data.phone) items.push({ label: data.phone, href: `tel:${data.phone}` })
  if (data.location) items.push({ label: data.location })
  if (data.website) items.push(displayUrl(data.website, 'Portfolio'))
  if (data.linkedinUrl) items.push(displayUrl(data.linkedinUrl, 'LinkedIn'))
  if (data.githubUrl) items.push(displayUrl(data.githubUrl, 'GitHub'))
  return (
    <View style={styles.contact}>
      {items.map((item, index) => (
        <Fragment key={`${item.label}-${index}`}>
          {index > 0 && <Text style={styles.contactSeparator}>|</Text>}
          {item.href ? (
            <Link src={item.href} style={styles.link}>
              {item.label}
            </Link>
          ) : (
            <Text>{item.label}</Text>
          )}
        </Fragment>
      ))}
    </View>
  )
}

function DocumentHeader({
  data,
  templateId,
}: {
  data: ResumeDocumentData['profile']
  templateId: TemplateId
}) {
  const headerStyle = [
    styles.header,
    ...(templateId === 'minimal' ? [styles.minimalHeader] : []),
  ]
  return (
    <View style={headerStyle} wrap={false}>
      <Text style={styles.name}>{data.name}</Text>
      {data.title && (
        <Text
          style={[
            styles.title,
            ...(templateId === 'minimal' ? [styles.minimalTitle] : []),
          ]}
        >
          {data.title}
        </Text>
      )}
      <ContactLine data={data} />
    </View>
  )
}

function DocumentSection({
  title,
  children,
  templateId,
}: {
  title: string
  children: React.ReactNode
  templateId: TemplateId
}) {
  return (
    <View style={styles.section}>
      <Text
        minPresenceAhead={26}
        style={[
          styles.sectionHeading,
          ...(templateId === 'minimal' ? [styles.minimalSectionHeading] : []),
        ]}
      >
        {title}
      </Text>
      {children}
    </View>
  )
}

function BulletList({ items }: { items: string[] }) {
  if (!items.length) return null
  return (
    <View style={styles.bulletList}>
      {items.map((item, index) => (
        <View style={styles.bullet} key={`${item}-${index}`}>
          <Text style={styles.bulletMark}>•</Text>
          <Text orphans={2} widows={2} style={styles.bulletText}>
            {item}
          </Text>
        </View>
      ))}
    </View>
  )
}

function ExperienceEntry({ item }: { item: ResumeExperienceData }) {
  return (
    <View style={styles.entry} minPresenceAhead={48}>
      <View style={styles.entryRow}>
        <View style={styles.entryMain}>
          <Text style={styles.entryTitle}>{item.role || 'Role'}</Text>
          <Text style={styles.entryMeta}>
            {[item.company, item.location].filter(Boolean).join(' - ')}
          </Text>
        </View>
        {item.dateRange && (
          <Text style={styles.entryDate}>{item.dateRange}</Text>
        )}
      </View>
      <BulletList items={item.highlights} />
    </View>
  )
}

function EducationEntry({ item }: { item: ResumeEducationData }) {
  return (
    <View style={styles.entry} minPresenceAhead={48}>
      <View style={styles.entryRow}>
        <View style={styles.entryMain}>
          <Text style={styles.entryTitle}>
            {item.qualification || 'Qualification'}
          </Text>
          <Text style={styles.entryMeta}>
            {[item.institution, item.fieldOfStudy, item.location]
              .filter(Boolean)
              .join(' - ')}
          </Text>
        </View>
        {item.dateRange && (
          <Text style={styles.entryDate}>{item.dateRange}</Text>
        )}
      </View>
      <BulletList items={item.highlights} />
    </View>
  )
}

function ProjectEntry({ item }: { item: ResumeProjectData }) {
  return (
    <View style={styles.entry} minPresenceAhead={48}>
      <View style={styles.entryRow}>
        <View style={styles.entryMain}>
          <Text style={styles.entryTitle}>{item.name}</Text>
          {item.role && <Text style={styles.entryMeta}>{item.role}</Text>}
        </View>
        {item.dateRange && (
          <Text style={styles.entryDate}>{item.dateRange}</Text>
        )}
      </View>
      {item.technologies.length > 0 && (
        <Text style={styles.entryMeta}>
          <Text style={styles.skillLabel}>Tools: </Text>
          {item.technologies.join(', ')}
        </Text>
      )}
      <BulletList items={item.highlights} />
      {item.projectUrl && (
        <Link src={item.projectUrl} style={styles.projectLink}>
          Portfolio
        </Link>
      )}
      {item.repositoryUrl && (
        <Link src={item.repositoryUrl} style={styles.projectLink}>
          GitHub repository
        </Link>
      )}
    </View>
  )
}

function SkillList({ skills }: { skills: string[] }) {
  return (
    <Text style={styles.skills}>
      <Text style={styles.skillLabel}>Core skills: </Text>
      {skills.join('  |  ')}
    </Text>
  )
}

function CertificationEntry({ item }: { item: ResumeCertificationData }) {
  return (
    <View style={styles.compactLine} minPresenceAhead={30}>
      <Text style={styles.entryTitle}>{item.name}</Text>
      <Text style={styles.compactMuted}>
        {[item.issuer, item.date].filter(Boolean).join(' - ')}
      </Text>
      {item.credentialUrl && (
        <Link src={item.credentialUrl} style={styles.projectLink}>
          Credential
        </Link>
      )}
    </View>
  )
}

function AwardEntry({ item }: { item: ResumeAwardData }) {
  return (
    <View style={styles.compactLine} minPresenceAhead={30}>
      <View style={styles.entryRow}>
        <Text style={styles.entryTitle}>{item.title}</Text>
        {item.date && <Text style={styles.entryDate}>{item.date}</Text>}
      </View>
      {item.issuer && <Text style={styles.compactMuted}>{item.issuer}</Text>}
      <BulletList items={item.highlights} />
    </View>
  )
}

function VolunteerEntry({ item }: { item: ResumeVolunteerData }) {
  return (
    <View style={styles.entry} minPresenceAhead={48}>
      <View style={styles.entryRow}>
        <View style={styles.entryMain}>
          <Text style={styles.entryTitle}>{item.role || 'Volunteer'}</Text>
          <Text style={styles.entryMeta}>{item.organization}</Text>
        </View>
        {item.dateRange && (
          <Text style={styles.entryDate}>{item.dateRange}</Text>
        )}
      </View>
      <BulletList items={item.highlights} />
    </View>
  )
}

function PageFooter() {
  return (
    <Text
      fixed
      render={({ pageNumber, totalPages }) =>
        `Page ${pageNumber} of ${totalPages}`
      }
      style={styles.footer}
    />
  )
}

function ResumeContent({
  data,
  templateId,
}: {
  data: ResumeDocumentData
  templateId: TemplateId
}) {
  const renderSection = (section: ResumeDocumentSection): React.ReactNode => {
    if (data.hiddenSections.includes(section)) return null
    switch (section) {
      case 'summary':
        return data.summary ? (
          <DocumentSection title="Professional Summary" templateId={templateId}>
            <Text orphans={2} widows={2} style={styles.paragraph}>
              {data.summary}
            </Text>
          </DocumentSection>
        ) : null
      case 'experience':
        return data.experience.length > 0 ? (
          <DocumentSection title="Experience" templateId={templateId}>
            {data.experience.map((item) => (
              <ExperienceEntry item={item} key={item.id} />
            ))}
          </DocumentSection>
        ) : null
      case 'skills':
        return data.skills.length > 0 ? (
          <DocumentSection title="Skills" templateId={templateId}>
            <SkillList skills={data.skills} />
          </DocumentSection>
        ) : null
      case 'projects':
        return data.projects.length > 0 ? (
          <DocumentSection title="Projects" templateId={templateId}>
            {data.projects.map((item) => (
              <ProjectEntry item={item} key={item.id} />
            ))}
          </DocumentSection>
        ) : null
      case 'education':
        return data.education.length > 0 ? (
          <DocumentSection title="Education" templateId={templateId}>
            {data.education.map((item) => (
              <EducationEntry item={item} key={item.id} />
            ))}
          </DocumentSection>
        ) : null
      case 'certifications':
        return data.certifications.length > 0 ? (
          <DocumentSection title="Certifications" templateId={templateId}>
            {data.certifications.map((item) => (
              <CertificationEntry item={item} key={item.id} />
            ))}
          </DocumentSection>
        ) : null
      case 'languages':
        return data.languages.length > 0 ? (
          <DocumentSection title="Languages" templateId={templateId}>
            {data.languages.map((item) => (
              <Text style={styles.compactLine} key={item.id}>
                <Text style={styles.entryTitle}>{item.language}</Text>
              </Text>
            ))}
          </DocumentSection>
        ) : null
      case 'awards':
        return data.awards.length > 0 ? (
          <DocumentSection title="Awards" templateId={templateId}>
            {data.awards.map((item) => (
              <AwardEntry item={item} key={item.id} />
            ))}
          </DocumentSection>
        ) : null
      case 'volunteer':
        return data.volunteer.length > 0 ? (
          <DocumentSection title="Volunteer Experience" templateId={templateId}>
            {data.volunteer.map((item) => (
              <VolunteerEntry item={item} key={item.id} />
            ))}
          </DocumentSection>
        ) : null
    }
  }
  return (
    <>
      {data.sectionOrder.map((section) => (
        <Fragment key={section}>{renderSection(section)}</Fragment>
      ))}
    </>
  )
}

export function ResumePdfDocument({
  data,
  templateId = 'classic',
}: {
  data: ResumeDocumentData
  templateId?: TemplateId
}) {
  return (
    <Document
      author="Next Role"
      creator="Next Role Resume Builder"
      language="en-US"
      title={`${data.profile.name || 'Resume'} - Resume`}
    >
      <Page size="A4" style={styles.page}>
        <DocumentHeader data={data.profile} templateId={templateId} />
        <ResumeContent data={data} templateId={templateId} />
        <PageFooter />
      </Page>
    </Document>
  )
}
