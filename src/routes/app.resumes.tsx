import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/resumes')({
  component: Outlet,
})
