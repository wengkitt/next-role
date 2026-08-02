import { Menu } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { ThemeSelector } from '../ThemeSelector'

const navLinks = [
  ['Features', '#features'],
  ['Templates', '#templates'],
  ['How It Works', '#how-it-works'],
]

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-base-300/70 bg-base-100/90 backdrop-blur">
      <nav
        className="navbar mx-auto min-h-18 max-w-7xl px-4 sm:px-6 lg:px-8"
        aria-label="Main navigation"
      >
        <div className="navbar-start gap-2">
          <details className="dropdown lg:hidden">
            <summary
              className="btn btn-ghost btn-sm btn-square list-none [&::-webkit-details-marker]:hidden"
              aria-label="Open navigation menu"
            >
              <Menu aria-hidden="true" size={20} />
            </summary>
            <ul
              className="dropdown-content menu z-50 mt-3 w-56 rounded-box border border-base-300 bg-base-100 p-2 shadow-lg"
              aria-label="Landing page navigation"
            >
              {navLinks.map(([label, href]) => (
                <li key={label}>
                  <a href={href}>{label}</a>
                </li>
              ))}
              <li>
                <Link to="/sign-in">Sign in</Link>
              </li>
            </ul>
          </details>
          <Link
            to="/"
            className="text-xl font-bold tracking-tight"
            aria-label="NextRole home"
          >
            Next<span className="text-primary">Role</span>
          </Link>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal gap-1 px-1 text-sm font-medium">
            {navLinks.map(([label, href]) => (
              <li key={label}>
                <a href={href}>{label}</a>
              </li>
            ))}
          </ul>
        </div>
        <div className="navbar-end gap-1 sm:gap-3">
          <Link
            to="/sign-in"
            className="btn btn-primary btn-sm hidden sm:inline-flex"
          >
            Sign in
          </Link>
          <Link to="/sign-up" className="btn btn-sm">
            Get started
          </Link>
          <ThemeSelector />
        </div>
      </nav>
    </header>
  )
}
