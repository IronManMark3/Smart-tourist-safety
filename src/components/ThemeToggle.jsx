import { Sun, Moon, Monitor } from 'lucide-react'
import { useTheme } from '../lib/ThemeProvider'

export default function ThemeToggle() {
  const { theme, setTheme, resolved } = useTheme()
  const setT = (v) => { localStorage.setItem('theme', v); setTheme(v) }

  return (
    <div className="flex items-center gap-2">
      <button className="btn-ghost" title="Light" onClick={() => setT('light')}><Sun size={16} /></button>
      <button className="btn-ghost" title="Dark" onClick={() => setT('dark')}><Moon size={16} /></button>
      <button className="btn-ghost" title="System" onClick={() => setT('system')}><Monitor size={16} /></button>
      <span className="text-xs opacity-70">{theme === 'system' ? `System (${resolved})` : theme}</span>
    </div>
  )
}
