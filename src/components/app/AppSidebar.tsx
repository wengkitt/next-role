import { ArrowUpRight, Settings, Files, Lightbulb } from 'lucide-react'
import { Link, useRouterState } from '@tanstack/react-router'
import { Brand } from '../Brand'
import { UserMenu } from './UserMenu'

const navigation = [
  { to: '/app/resumes' as const, label: 'My resumes', icon: Files },
  { to: '/app/settings' as const, label: 'Settings', icon: Settings },
]

type AppSidebarProps = {
  user: { name: string; email: string; image?: string | null }
  onNavigate?: () => void
}

export function AppSidebar({ user, onNavigate }: AppSidebarProps) {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })
  return (
    <aside className="flex min-h-full w-60 flex-col border-r border-base-300 bg-base-100">
      <div className="px-6 py-7">
        <Link
          to="/app/resumes"
          onClick={onNavigate}
          aria-label="NextRole resumes"
        >
          <Brand />
        </Link>
      </div>
      <div className="px-6 pt-7 pb-3 text-[10px] font-semibold tracking-[.18em] uppercase text-base-content/40">
        Your workspace
      </div>
      <nav className="px-3" aria-label="Main navigation">
        <ul className="menu w-full gap-1 p-0">
          {navigation.map(({ to, label, icon: Icon }) => {
            const isActive = pathname === to || pathname.startsWith(`${to}/`)
            return (
              <li key={to}>
                <Link
                  to={to}
                  onClick={onNavigate}
                  aria-current={isActive ? 'page' : undefined}
                  className={`gap-3 rounded-lg px-3 py-3 text-[13px] ${isActive ? 'bg-secondary font-semibold text-secondary-content' : 'text-base-content/60'}`}
                >
                  <Icon size={18} strokeWidth={1.7} aria-hidden="true" />
                  {label}
                  {isActive && (
                    <span className="ml-auto size-1.5 rounded-full bg-current" />
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
      <div className="mt-auto px-4 pt-20 pb-5">
        <div className="rounded-xl border border-base-300 bg-base-200 p-4">
          <Lightbulb
            size={20}
            strokeWidth={1.5}
            className="text-base-content/60"
            aria-hidden="true"
          />
          <p className="mt-3 text-xs font-semibold">
            A small tip for your next step
          </p>
          <p className="mt-2 text-xs leading-5 text-base-content/55">
            The best resume is the one that speaks to the role. Make a copy and
            tailor your story.
          </p>
          <Link
            to="/"
            hash="how-it-works"
            className="mt-4 inline-flex items-center gap-2 text-xs font-medium"
            onClick={onNavigate}
          >
            A little inspiration <ArrowUpRight size={13} aria-hidden="true" />
          </Link>
        </div>
      </div>
      <div className="border-t border-base-300 p-3">
        <UserMenu {...user} />
      </div>
    </aside>
  )
}
