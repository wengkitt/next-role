import { useState } from 'react'
import { getAuthSession } from '#/auth/session'
import { AppNavbar } from '#/components/app/AppNavbar'
import { AppSidebar } from '#/components/app/AppSidebar'
import { LandingToast } from '#/components/LandingToast'
import {
  Outlet,
  createFileRoute,
  redirect,
  useRouterState,
} from '@tanstack/react-router'

export const Route = createFileRoute('/app')({
  beforeLoad: async () => {
    const session = await getAuthSession()
    if (!session) throw redirect({ to: '/sign-in' })
    return { session }
  },
  component: AppLayout,
})

const pageTitles: Record<string, string> = {
  '/app/resumes': 'Resumes',
  '/app/settings': 'Settings',
}

function AppLayout() {
  const { session } = Route.useRouteContext()
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })
  const [menuOpen, setMenuOpen] = useState(false)
  const user = session.user
  const title =
    pageTitles[pathname] ??
    (pathname.includes('/edit') ? 'Resume editor' : 'My resumes')

  return (
    <div className="drawer lg:drawer-open">
      <input
        id="app-sidebar"
        type="checkbox"
        className="drawer-toggle"
        checked={menuOpen}
        onChange={(event) => setMenuOpen(event.target.checked)}
        aria-label="Navigation menu"
      />
      <div className="drawer-content min-w-0 min-h-screen bg-base-200">
        <AppNavbar title={title} onOpenMenu={() => setMenuOpen(true)} />
        <Outlet />
        <LandingToast />
      </div>
      <div className="drawer-side z-50 lg:z-auto">
        <label
          htmlFor="app-sidebar"
          aria-label="Close navigation menu"
          className="drawer-overlay"
        />
        <AppSidebar user={user} onNavigate={() => setMenuOpen(false)} />
      </div>
    </div>
  )
}
