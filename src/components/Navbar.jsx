import { Shield, Globe } from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import { useI18n } from '../lib/i18n'
import { Link } from 'react-router-dom'

export default function Navbar() {
  const { lang, setLang, t } = useI18n()
  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-white/60 dark:bg-neutral-950/60 border-b border-neutral-200/60 dark:border-neutral-800/60">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Shield className="text-neutral-900 dark:text-white" size={20} />
          <span className="font-semibold">{t('appTitle')}</span>
        </Link>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Globe size={16} className="opacity-70" />
            <select className="bg-transparent text-sm outline-none" value={lang} onChange={(e) => setLang(e.target.value)}>
              <option value="en">EN</option>
              <option value="hi">HI</option>
            </select>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
