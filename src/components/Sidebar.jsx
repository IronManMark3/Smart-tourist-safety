import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, BellRing, FileText, MapPin } from 'lucide-react'

export default function Sidebar({ variant = 'authority' }) {
  const { pathname } = useLocation()
  const nav = variant === 'authority'
    ? [
        { to: '/authority', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
        { to: '/authority/alerts', label: 'Alerts', icon: <BellRing size={16} /> },
        { to: '/authority/e-fir', label: 'E-FIR', icon: <FileText size={16} /> },
      ]
    : [
        { to: '/tourist', label: 'My Trip', icon: <MapPin size={16} /> },
      ]

  return (
    <aside className="w-56 shrink-0 border-r border-neutral-200/60 dark:border-neutral-800/60 p-4 hidden md:block">
      <nav className="space-y-1">
        {nav.map(item => (
          <Link key={item.to} to={item.to}
            className={`flex items-center gap-2 rounded-xl px-3 py-2 hover:bg-neutral-100/70 dark:hover:bg-neutral-800/50 ${pathname === item.to ? 'bg-neutral-100/60 dark:bg-neutral-800/40' : ''}`}>
            {item.icon}
            <span className="text-sm">{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  )
}
