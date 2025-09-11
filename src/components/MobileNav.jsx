// src/components/MobileNav.jsx
import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, BellRing, FileText, MapPin, Users } from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore'

export default function MobileNav() {
  const user = useAuthStore(s => s.currentUser)
  const { pathname } = useLocation()
  if (!user) return null

  const isAuthority = user.role === 'authority'
  const items = isAuthority
    ? [
        { to: '/authority', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
        { to: '/authority/tourists', label: 'Tourists', icon: <Users size={16} /> },
        { to: '/authority/alerts', label: 'Alerts', icon: <BellRing size={16} /> },
        { to: '/authority/e-fir', label: 'E-FIR', icon: <FileText size={16} /> },
      ]
    : [{ to: '/tourist', label: 'My Trip', icon: <MapPin size={16} /> }]

  return (
    <div className="md:hidden border-b border-neutral-200/60 dark:border-neutral-800/60 bg-white/65 dark:bg-neutral-900/55 backdrop-blur">
      <div className="mx-auto max-w-7xl px-3 py-2 flex gap-2 overflow-x-auto">
        {items.map(it => {
          const active = pathname === it.to
          return (
            <Link
              key={it.to}
              to={it.to}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-xl text-sm shrink-0
                ${active
                  ? 'bg-gradient-to-r from-fuchsia-500/15 to-pink-500/15 border border-fuchsia-400/30 dark:border-fuchsia-500/30'
                  : 'border border-transparent hover:bg-neutral-100/60 dark:hover:bg-neutral-800/50'}
              `}
            >
              <span className={`
                grid place-items-center h-7 w-7 rounded-lg
                ${active
                  ? 'bg-gradient-to-br from-fuchsia-500 to-pink-500 text-white'
                  : 'bg-neutral-100/70 dark:bg-neutral-800/60 text-inherit'}
              `}>
                {it.icon}
              </span>
              <span className={active ? 'font-semibold' : ''}>{it.label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
