import { Link } from '@tanstack/react-router'

export function Footer() {
  return (
    <footer className="bg-base-200 text-base-content">
      <div className="footer mx-auto max-w-7xl px-4 py-12 sm:footer-horizontal sm:px-6 lg:px-8">
        <aside>
          <Link to="/" className="text-xl font-bold tracking-tight">
            Next<span className="text-primary">Role</span>
          </Link>
          <p className="max-w-xs leading-6 text-base-content/65">
            A clear, guided resume builder for your next great opportunity.
          </p>
          <div className="sm:col-span-full sm:mt-4">
            <p className="text-sm text-base-content/60">
              © 2026 NextRole. All rights reserved.
            </p>
          </div>
        </aside>
        <nav>
          <h3 className="footer-title">Product</h3>
          <a className="link link-hover" href="#features">
            Features
          </a>
          <a className="link link-hover" href="#templates">
            Templates
          </a>
          <a className="link link-hover" href="#how-it-works">
            How it works
          </a>
        </nav>
        <nav>
          <h3 className="footer-title">Get started</h3>
          <Link className="link link-hover" to="/sign-in">
            Sign in
          </Link>
          <Link className="link link-hover" to="/sign-up">
            Create an account
          </Link>
        </nav>
      </div>
    </footer>
  )
}
