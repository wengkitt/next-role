import { Settings, FileText } from 'lucide-react'
import { Link, useRouterState } from '@tanstack/react-router'

import { UserMenu } from './UserMenu'

const navigation = [
  { to: '/app/resumes' as const, label: 'Resumes', icon: FileText },
  { to: '/app/settings' as const, label: 'Settings', icon: Settings },
]

type AppSidebarProps = {
  user: { name: string; email: string; image?: string | null }
}

export function AppSidebar({ user }: AppSidebarProps) {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })

  return (
    <aside className="flex min-h-full w-56 flex-col border-r border-base-300 bg-base-100">
      <div className="px-4 pt-4 pb-4">
        <Link
          to="/app/resumes"
          className="inline-flex items-center gap-2 text-lg font-bold tracking-tight focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          aria-label="NextRole resumes"
        >
          <span className="grid size-7 place-items-center rounded-box bg-primary text-sm font-black text-primary-content">
            N
          </span>
          NextRole
        </Link>
      </div>

      <nav className="px-2" aria-label="Main navigation">
        <ul className="menu menu-sm w-full gap-0.5 p-0">
          {navigation.map(({ to, label, icon: Icon }) => {
            const isActive = pathname === to || pathname.startsWith(`${to}/`)
            return (
              <li key={to}>
                <Link to={to} className={isActive ? 'menu-active' : undefined}>
                  <Icon size={18} aria-hidden="true" />
                  {label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="mt-auto border-t border-base-300 p-2">
        <UserMenu {...user} />
      </div>
    </aside>
  )
}
