import type { ResumeDocumentData } from '#/lib/resume-document'
import type { TemplateId } from '#/resume-templates/registry'
import { lazy, Suspense, useEffect, useState } from 'react'

const ClientResumePdfPreview = lazy(() => import('./ResumePdfPreviewClient'))

function PreviewFallback({ compact = false }: { compact?: boolean }) {
  return (
    <div className="resume-pdf-preview rounded-box border border-base-300 bg-base-300 p-3">
      <div
        className={`flex items-center justify-center gap-2 text-sm text-base-content/60 ${compact ? 'min-h-20' : 'min-h-40'}`}
      >
        <span className="loading loading-spinner loading-sm" />
        Preparing the A4 preview...
      </div>
    </div>
  )
}

export function ResumePdfPreview({
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
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <PreviewFallback />
  return (
    <Suspense fallback={<PreviewFallback compact />}>
      <ClientResumePdfPreview
        data={data}
        templateId={templateId}
        title={title}
        onPageCountChange={onPageCountChange}
      />
    </Suspense>
  )
}
