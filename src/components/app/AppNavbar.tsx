import { ThemeSelector } from '#/components/ThemeSelector'
import { ChevronRight, Menu } from 'lucide-react'

type AppNavbarProps = { title: string; onOpenMenu?: () => void }

export function AppNavbar({ title, onOpenMenu }: AppNavbarProps) {
  return (
    <header className="navbar min-h-18 border-b border-base-300/70 bg-base-100 px-4 sm:px-8">
      <div className="flex flex-1 items-center gap-3">
        <button
          type="button"
          onClick={onOpenMenu}
          className="btn btn-ghost btn-sm btn-square lg:hidden"
          aria-label="Open navigation menu"
        >
          <Menu size={20} aria-hidden="true" />
        </button>
        <span className="hidden text-xs text-base-content/40 sm:inline">
          Workspace
        </span>
        <ChevronRight
          size={13}
          className="hidden text-base-content/30 sm:block"
          aria-hidden="true"
        />
        <p className="text-xs font-medium">{title}</p>
      </div>
      <div className="flex items-center gap-4">
        <span className="hidden text-[11px] text-base-content/45 md:inline">
          A little progress goes a long way.
        </span>
        <ThemeSelector />
      </div>
    </header>
  )
}
