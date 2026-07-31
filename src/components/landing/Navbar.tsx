import { Menu } from 'lucide-react'
import { ThemeSelector } from '../ThemeSelector'
import { Link } from '@tanstack/react-router'

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
          <div className="dropdown lg:hidden">
            <button
              className="btn btn-ghost btn-sm btn-square"
              aria-label="Open navigation menu"
            >
              <Menu aria-hidden="true" size={20} />
            </button>
            <ul className="dropdown-content menu z-50 mt-3 w-52 rounded-box border border-base-300 bg-base-100 p-2 shadow-lg">
              {navLinks.map(([label, href]) => (
                <li key={label}>
                  <a href={href}>{label}</a>
                </li>
              ))}
              <li>
                <Link to="/sign-in">Sign In</Link>
              </li>
            </ul>
          </div>
          <a
            href="#top"
            className="text-xl font-bold tracking-tight"
            aria-label="NextRole home"
          >
            Next<span className="text-primary">Role</span>
          </a>
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
            Build My Resume
          </Link>
          <ThemeSelector />
        </div>
      </nav>
    </header>
  )
}
