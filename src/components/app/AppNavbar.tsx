import { ThemeSelector } from '#/components/ThemeSelector'
import { Menu } from 'lucide-react'

type AppNavbarProps = {
  title: string
}

export function AppNavbar({ title }: AppNavbarProps) {
  return (
    <header className="navbar min-h-16 border-b border-base-300 bg-base-100 px-4 sm:px-6">
      <div className="navbar-start gap-2">
        <label
          htmlFor="app-sidebar"
          className="btn btn-ghost btn-sm btn-square drawer-button lg:hidden"
          aria-label="Open navigation menu"
        >
          <Menu size={20} aria-hidden="true" />
        </label>
        <h1 className="text-lg font-semibold">{title}</h1>
      </div>
      <div className="navbar-end gap-1">
        <ThemeSelector />
      </div>
    </header>
  )
}
