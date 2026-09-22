import { Link } from '@tanstack/react-router'
import { Brand } from '../Brand'

export function Footer() {
  return (
    <footer className="bg-base-200 px-6 sm:px-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 py-12 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link to="/" aria-label="NextRole home">
            <Brand />
          </Link>
          <p className="mt-3 text-xs text-base-content/50">
            For the next chapter of your working life.
          </p>
        </div>
        <nav
          aria-label="Footer navigation"
          className="flex flex-wrap gap-6 text-xs text-base-content/65"
        >
          <a className="link link-hover" href="#features">
            Features
          </a>
          <a className="link link-hover" href="#templates">
            Templates
          </a>
          <Link className="link link-hover" to="/sign-in">
            Sign in
          </Link>
        </nav>
      </div>
      <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-3 border-t border-base-300 py-6 text-[11px] text-base-content/45">
        <p>© {new Date().getFullYear()} NextRole. All rights reserved.</p>
        <p>A thoughtful next step.</p>
      </div>
    </footer>
  )
}
