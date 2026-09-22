import { ArrowUpRight } from 'lucide-react'

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-neutral text-neutral-content">
        <ArrowUpRight size={24} strokeWidth={2.2} aria-hidden="true" />
      </span>
      {!compact && (
        <span className="text-xl font-semibold tracking-tight">
          nextrole<span className="text-base-content/40">.</span>
        </span>
      )}
    </span>
  )
}
