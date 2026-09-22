import { Link } from '@tanstack/react-router'
import { ArrowLeft, ArrowUpRight, RefreshCw } from 'lucide-react'
import { Brand } from './Brand'

export function NotFoundPage() {
  return (
    <main className="flex min-h-screen flex-col bg-base-200 px-6 py-8">
      <div className="mx-auto w-full max-w-6xl">
        <Link to="/" aria-label="NextRole home">
          <Brand />
        </Link>
      </div>
      <div className="m-auto max-w-lg py-20 text-center">
        <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-secondary text-secondary-content">
          <ArrowUpRight size={32} strokeWidth={1.3} aria-hidden="true" />
        </span>
        <p className="mt-8 text-xs font-semibold tracking-[.18em] uppercase text-base-content/45">
          404 · A little detour
        </p>
        <h1 className="mt-4 text-4xl font-medium tracking-[-.04em] sm:text-5xl">
          Let’s find your way back.
        </h1>
        <p className="mt-5 text-sm leading-7 text-base-content/60">
          This page may have moved, or the link might be incomplete. Your next
          chapter is still waiting.
        </p>
        <Link to="/" className="btn mt-8">
          <ArrowLeft size={16} aria-hidden="true" /> Back to home
        </Link>
      </div>
    </main>
  )
}

export function AppErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="grid min-h-[70vh] place-items-center bg-base-200 px-6 py-16">
      <div className="max-w-md text-center">
        <p className="text-xs font-semibold tracking-[.18em] uppercase text-base-content/45">
          A brief pause
        </p>
        <h1 className="mt-4 text-3xl font-medium tracking-tight">
          Something didn’t come together.
        </h1>
        <p className="mt-4 text-sm leading-7 text-base-content/60">
          We couldn’t load this page. Try again, or head home to start fresh.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <button className="btn" onClick={reset}>
            <RefreshCw size={16} aria-hidden="true" /> Try again
          </button>
          <Link to="/" className="btn btn-ghost">
            Back to home
          </Link>
        </div>
      </div>
    </main>
  )
}
