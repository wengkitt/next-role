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
  '/app/dashboard': 'Dashboard',
  '/app/resumes': 'Resumes',
  '/app/settings': 'Settings',
}

function AppLayout() {
  const { session } = Route.useRouteContext()
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })
  const user = session.user
  const title = pageTitles[pathname] ?? 'NextRole'

  return (
    <div className="drawer lg:drawer-open">
      <input id="app-sidebar" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content min-h-screen bg-base-200">
        <AppNavbar title={title} />
        <Outlet />
        <LandingToast />
      </div>
      <div className="drawer-side">
        <label
          htmlFor="app-sidebar"
          aria-label="Close navigation menu"
          className="drawer-overlay"
        />
        <AppSidebar user={user} />
      </div>
    </div>
  )
}
