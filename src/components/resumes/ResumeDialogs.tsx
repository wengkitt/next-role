import { createResume, deleteResume, renameResume } from '#/data/resumes'
import { resumeTitleSchema } from '#/data/resume-schemas'
import { useEffect, useRef, useState } from 'react'

type ResumeDialogProps = {
  mode: 'create' | 'rename' | 'delete'
  resume?: { id: string; title: string }
  onClose: () => void
  onSuccess: (resume?: { id: string }) => void
}

export function ResumeDialog({
  mode,
  resume,
  onClose,
  onSuccess,
}: ResumeDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [title, setTitle] = useState(resume?.title ?? '')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    dialogRef.current?.showModal()
    const timer = window.setTimeout(() => inputRef.current?.focus(), 0)
    return () => window.clearTimeout(timer)
  }, [])

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    if (isSubmitting) return
    if (mode !== 'delete') {
      const parsed = resumeTitleSchema.safeParse(title)
      if (!parsed.success) {
        setError(parsed.error.issues[0]?.message ?? 'Resume title is required.')
        return
      }
      setTitle(parsed.data)
      setError(null)
    }
    setIsSubmitting(true)
    try {
      if (mode === 'create') {
        const created = await createResume({ data: { title } })
        onSuccess(created)
      } else if (mode === 'rename' && resume) {
        await renameResume({ data: { resumeId: resume.id, title } })
        onSuccess()
      } else if (mode === 'delete' && resume) {
        await deleteResume({ data: { resumeId: resume.id } })
        onSuccess()
      }
    } catch {
      setError(
        mode === 'delete'
          ? 'We could not delete your resume. Please try again.'
          : 'We could not save your changes. Please try again.',
      )
      setIsSubmitting(false)
    }
  }

  const isDelete = mode === 'delete'
  const heading = isDelete
    ? 'Delete resume?'
    : mode === 'create'
      ? 'Create a new resume'
      : 'Rename resume'
  const submitText = isDelete
    ? 'Delete Resume'
    : mode === 'create'
      ? 'Create Resume'
      : 'Save Changes'

  return (
    <dialog
      ref={dialogRef}
      className="modal"
      onClose={onClose}
      aria-labelledby="resume-dialog-title"
    >
      <div className="modal-box">
        <h2 id="resume-dialog-title" className="text-xl font-bold">
          {heading}
        </h2>
        <form className="mt-5" onSubmit={(event) => void submit(event)}>
          {isDelete ? (
            <p className="leading-7 text-base-content/70">
              This will permanently delete “{resume?.title}”. This action cannot
              be undone.
            </p>
          ) : (
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Resume title</legend>
              <input
                ref={inputRef}
                className={`input w-full ${error ? 'input-error' : ''}`}
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                onBlur={() => setTitle((value) => value.trim())}
                maxLength={100}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? 'resume-title-error' : undefined}
              />
              {error && (
                <p
                  id="resume-title-error"
                  className="label text-error"
                  role="alert"
                >
                  {error}
                </p>
              )}
            </fieldset>
          )}
          {isDelete && error && (
            <div
              className="alert alert-error alert-soft mt-4 text-sm"
              role="alert"
            >
              {error}
            </div>
          )}
          <div className="modal-action">
            <button
              className="btn"
              type="button"
              disabled={isSubmitting}
              onClick={() => dialogRef.current?.close()}
            >
              Cancel
            </button>
            <button
              className={`btn ${isDelete ? 'btn-error' : 'btn-primary'}`}
              disabled={isSubmitting}
            >
              {isSubmitting && (
                <span className="loading loading-spinner loading-sm" />
              )}
              {submitText}
            </button>
          </div>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button aria-label="Close dialog">close</button>
      </form>
    </dialog>
  )
}
