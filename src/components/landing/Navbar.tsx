import { ArrowUpRight, Menu } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { Brand } from '../Brand'
import { ThemeSelector } from '../ThemeSelector'

const navLinks = [
  ['Features', '#features'],
  ['Templates', '#templates'],
  ['How it works', '#how-it-works'],
]

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-base-300/70 bg-base-200/95 backdrop-blur-xl">
      <nav
        className="navbar mx-auto min-h-20 max-w-7xl px-5 sm:px-10"
        aria-label="Main navigation"
      >
        <div className="navbar-start gap-2">
          <details className="dropdown lg:hidden">
            <summary
              className="btn btn-ghost btn-sm btn-square list-none [&::-webkit-details-marker]:hidden"
              aria-label="Open navigation menu"
            >
              <Menu size={20} aria-hidden="true" />
            </summary>
            <ul className="dropdown-content menu z-50 mt-5 w-56 rounded-box border border-base-300 bg-base-100 p-2 shadow-lg">
              {navLinks.map(([label, href]) => (
                <li key={label}>
                  <a
                    href={href}
                    onClick={(event) =>
                      event.currentTarget
                        .closest('details')
                        ?.removeAttribute('open')
                    }
                  >
                    {label}
                  </a>
                </li>
              ))}
              <li>
                <Link to="/sign-in">Sign in</Link>
              </li>
            </ul>
          </details>
          <Link to="/" aria-label="NextRole home">
            <Brand />
          </Link>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal gap-4 text-[13px] text-base-content/65">
            {navLinks.map(([label, href]) => (
              <li key={label}>
                <a
                  href={href}
                  onClick={(event) =>
                    event.currentTarget
                      .closest('details')
                      ?.removeAttribute('open')
                  }
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="navbar-end gap-2 sm:gap-3">
          <ThemeSelector />
          <Link
            to="/sign-in"
            className="btn btn-ghost btn-sm hidden sm:inline-flex"
          >
            Sign in
          </Link>
          <Link
            to="/sign-up"
            className="btn btn-sm border-base-content/20 bg-transparent px-4"
          >
            Get started <ArrowUpRight size={15} aria-hidden="true" />
          </Link>
        </div>
      </nav>
    </header>
  )
}
