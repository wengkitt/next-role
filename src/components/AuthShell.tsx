import { Link } from '@tanstack/react-router'
import { ArrowLeft, ArrowUpRight, Check } from 'lucide-react'
import type { ReactNode } from 'react'
import { Brand } from './Brand'
import { ThemeSelector } from './ThemeSelector'

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <main className="grid min-h-screen bg-base-100 lg:grid-cols-[1fr_1fr]">
      <section className="flex min-h-screen flex-col px-6 py-7 sm:px-12 lg:px-16">
        <div className="flex items-center justify-between">
          <Link to="/" aria-label="NextRole home">
            <Brand />
          </Link>
          <ThemeSelector />
        </div>
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-12">
          <Link
            to="/"
            className="btn btn-ghost btn-sm -ml-3 mb-7 self-start text-base-content/55"
          >
            <ArrowLeft size={15} aria-hidden="true" /> Back to home
          </Link>
          {children}
        </div>
        <p className="text-xs text-base-content/45">
          Your next chapter starts with you.
        </p>
      </section>
      <aside className="relative m-4 ml-0 hidden overflow-hidden rounded-3xl bg-secondary p-12 text-secondary-content lg:flex lg:flex-col lg:justify-center xl:p-20">
        <ArrowUpRight
          size={380}
          strokeWidth={0.4}
          className="absolute -right-24 -top-20 text-secondary-content/10"
          aria-hidden="true"
        />
        <div className="relative max-w-md">
          <p className="text-xs font-semibold tracking-[.18em] uppercase opacity-60">
            A fresh perspective
          </p>
          <h2 className="mt-7 text-5xl font-medium leading-[1.12] tracking-[-.04em] xl:text-6xl">
            There’s a lot
            <br />
            to your story.
            <br />
            <span className="font-serif italic">Let’s tell it well.</span>
          </h2>
          <p className="mt-7 max-w-sm text-base leading-8 opacity-65">
            A little structure, a thoughtful design, and the confidence to take
            your next step.
          </p>
          <div className="mt-10 space-y-4 border-t border-secondary-content/15 pt-8">
            {[
              'Make your experience shine',
              'Keep every version in one place',
              'Leave with a resume you’re proud of',
            ].map((text) => (
              <p key={text} className="flex items-center gap-3 text-sm">
                <Check size={16} aria-hidden="true" />
                {text}
              </p>
            ))}
          </div>
        </div>
        <p className="absolute bottom-10 left-12 text-xs opacity-50 xl:left-20">
          Made for wherever you go next.
        </p>
      </aside>
    </main>
  )
}
