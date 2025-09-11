import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, BellRing, FileText, MapPin, Users } from 'lucide-react'

export default function Sidebar({ variant = 'authority' }) {
  const { pathname } = useLocation()

  const nav =
    variant === 'authority'
      ? [
          { to: '/authority', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
          { to: '/authority/tourists', label: 'Active Tourists', icon: <Users size={16} /> },
          { to: '/authority/alerts', label: 'Alerts', icon: <BellRing size={16} /> },
          { to: '/authority/e-fir', label: 'E-FIR', icon: <FileText size={16} /> },
        ]
      : [{ to: '/tourist', label: 'My Trip', icon: <MapPin size={16} /> }]

  return (
    <aside
      className="
        hidden md:block w-60 shrink-0
        rounded-2xl p-4
        bg-white/65 dark:bg-neutral-900/55 backdrop-blur
        border border-neutral-200/60 dark:border-neutral-800/60
        shadow-sm
        mr-4
      "
    >
      <nav className="space-y-1">
        {nav.map((item) => {
          const active = pathname === item.to
          return (
            <Link
              key={item.to}
              to={item.to}
              aria-current={active ? 'page' : undefined}
              className={`
                group flex items-center gap-2 rounded-xl px-3 py-2 text-sm
                transition-colors
                ${active
                  ? 'bg-gradient-to-r from-fuchsia-500/15 to-pink-500/15 border border-fuchsia-400/30 dark:border-fuchsia-500/30'
                  : 'border border-transparent hover:bg-neutral-100/60 dark:hover:bg-neutral-800/50'}
              `}
            >
              <span
                className={`
                  grid place-items-center h-7 w-7 rounded-lg
                  ${active
                    ? 'bg-gradient-to-br from-fuchsia-500 to-pink-500 text-white'
                    : 'bg-neutral-100/70 dark:bg-neutral-800/60 text-inherit'}
                `}
              >
                {item.icon}
              </span>
              <span className={`truncate ${active ? 'font-semibold' : ''}`}>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
