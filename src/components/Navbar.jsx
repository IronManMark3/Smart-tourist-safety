// src/components/Navbar.jsx
import { Shield, Globe, LogOut, LogIn } from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import { useI18n } from '../lib/i18n.jsx'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'
import MobileNav from './MobileNav'   // ← add this

export default function Navbar() {
  const { lang, setLang, t } = useI18n()
  const user = useAuthStore(s => s.currentUser)
  const logout = useAuthStore(s => s.logout)
  const nav = useNavigate()

  return (
    <header className="sticky top-0 z-50">
      {/* Glass/gradient header bar */}
      <div
        className="
          backdrop-blur
          border-b border-neutral-200/60 dark:border-neutral-800/60
          shadow-sm
          bg-white/65 dark:bg-neutral-900/55
        "
      >
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="
              grid place-items-center h-8 w-8 rounded-xl
              bg-gradient-to-br from-fuchsia-500 to-pink-500 text-white
              shadow-sm
            ">
              <Shield size={18} />
            </div>
            <span
              className="
                font-semibold tracking-tight
                bg-gradient-to-r from-fuchsia-600 to-pink-600
                dark:from-fuchsia-400 dark:to-pink-400
                bg-clip-text text-transparent
              "
            >
              {t('appTitle')}
            </span>
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language */}
            <div className="hidden sm:flex items-center gap-1.5">
              <Globe size={16} className="opacity-70" />
              <select
                className="text-sm outline-none bg-transparent px-1 py-0.5 rounded-md hover:bg-neutral-100/60 dark:hover:bg-neutral-800/50"
                value={lang}
                onChange={(e)=>setLang(e.target.value)}
              >
                <option value="en">EN</option>
                <option value="hi">HI</option>
              </select>
            </div>

            {/* Theme */}
            <ThemeToggle />

            {/* Auth */}
            {user ? (
              <div className="flex items-center gap-2">
                <span className="badge">
                  {user.role === 'authority' ? 'Authority' : 'Tourist'}
                  <span className="opacity-60">•</span>
                  {user.name || user.email}
                </span>
                <button
                  className="btn-ghost"
                  onClick={() => { logout(); nav('/'); }}
                >
                  <LogOut size={16} />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <Link to="/auth/login" className="btn-ghost">
                <LogIn size={16} />
                <span className="hidden sm:inline">Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile context nav (Sidebar is hidden on mobile) */}
      <MobileNav />
    </header>
  )
}
