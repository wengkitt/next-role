import { Download } from 'lucide-react'
import type { ResumeDocumentData } from '#/lib/resume-document'
import type { TemplateId } from '#/resume-templates/registry'
import { ResumePdfDocument } from '#/resume-templates/ResumePdfDocument'
import { PDFDocument } from 'pdf-lib'
import { PDFViewer, usePDF } from '@react-pdf/renderer'
import { useEffect, useMemo, useState } from 'react'

function fileName(name: string) {
  const slug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  return `${slug || 'resume'}-resume.pdf`
}

export default function ResumePdfPreviewClient({
  data,
  templateId,
  title,
  onPageCountChange,
}: {
  data: ResumeDocumentData
  templateId: TemplateId
  title: string
  onPageCountChange?: (pageCount: number) => void
}) {
  const documentKey = useMemo(
    () => JSON.stringify([templateId, data]),
    [data, templateId],
  )

  return (
    <ResumePdfDocumentPreview
      key={documentKey}
      data={data}
      templateId={templateId}
      title={title}
      onPageCountChange={onPageCountChange}
    />
  )
}

function ResumePdfDocumentPreview({
  data,
  templateId,
  title,
  onPageCountChange,
}: {
  data: ResumeDocumentData
  templateId: TemplateId
  title: string
  onPageCountChange?: (pageCount: number) => void
}) {
  const document = useMemo(
    () => <ResumePdfDocument data={data} templateId={templateId} />,
    [data, templateId],
  )
  const [instance] = usePDF({ document })
  const [pageCount, setPageCount] = useState<number | null>(null)

  useEffect(() => {
    let active = true
    if (!instance.blob) {
      setPageCount(null)
      return () => {
        active = false
      }
    }
    const blob = instance.blob
    void (async () => {
      try {
        const pdf = await PDFDocument.load(await blob.arrayBuffer())
        if (!active) return
        const nextPageCount = pdf.getPageCount()
        setPageCount(nextPageCount)
        onPageCountChange?.(nextPageCount)
      } catch {
        if (active) setPageCount(null)
      }
    })()
    return () => {
      active = false
    }
  }, [instance.blob, onPageCountChange])

  return (
    <div className="resume-pdf-preview rounded-xl border border-base-300 bg-base-300/50 p-2 sm:p-3">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2 px-1">
        <span className="text-xs text-base-content/65">
          {instance.loading
            ? 'Rendering print-quality preview...'
            : instance.error
              ? 'Preview unavailable'
              : 'Ready to share.'}
        </span>
        <div className="flex items-center gap-2">
          {pageCount !== null && (
            <span className="badge badge-ghost badge-sm">
              {pageCount} page{pageCount === 1 ? '' : 's'}
            </span>
          )}
          {pageCount !== null && pageCount > 3 && (
            <span className="badge badge-warning badge-sm">
              Over 3-page target
            </span>
          )}
          <a
            className={`btn btn-sm bg-base-100 ${!instance.url ? 'pointer-events-none opacity-60' : ''}`}
            href={instance.url ?? undefined}
            download={fileName(data.profile.name || title)}
            aria-disabled={!instance.url}
          >
            {instance.loading && (
              <span className="loading loading-spinner loading-xs" />
            )}
            <Download size={14} aria-hidden="true" />
            {instance.loading ? 'Preparing PDF...' : 'Export PDF'}
          </a>
        </div>
      </div>
      {instance.error ? (
        <div className="alert alert-error alert-soft text-sm">
          We could not render this preview. You can keep editing and try the
          export again.
        </div>
      ) : (
        <PDFViewer className="resume-pdf-viewer" showToolbar={false}>
          {document}
        </PDFViewer>
      )}
    </div>
  )
}
