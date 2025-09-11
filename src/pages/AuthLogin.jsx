import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'
import { toast } from 'react-hot-toast'

export default function AuthLogin() {
  const [tab, setTab] = useState('tourist')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const nav = useNavigate()
  const loc = useLocation()
  const { loginTourist, loginAuthority } = useAuthStore()

  const goto = (fallback = '/') => {
    const target = (loc.state && loc.state.from) || fallback
    nav(target, { replace: true })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      if (tab === 'tourist') {
        if (!email || !password) { toast.error('Enter email & password'); return }
        loginTourist({ email, password })
        const user = useAuthStore.getState().currentUser
        toast.success('Logged in')
        if (!user?.profile) nav('/tourist/onboarding', { replace: true })
        else goto('/tourist')
      } else {
        if (!email) { toast.error('Enter authority email'); return }
        loginAuthority({ email })  // throws if not whitelisted
        toast.success('Logged in')
        // ⬇️ force direct redirect to avoid stale router state
        nav('/authority', { replace: true })
      }
    } catch (err) {
      toast.error(err.message || 'Login failed')
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <div className="card">
        <div className="flex gap-2 mb-4">
          <button
            className={`btn-ghost ${tab==='tourist'?'bg-neutral-100/60 dark:bg-neutral-800/40':''}`}
            onClick={()=>setTab('tourist')}>Tourist</button>
          <button
            className={`btn-ghost ${tab==='authority'?'bg-neutral-100/60 dark:bg-neutral-800/40':''}`}
            onClick={()=>setTab('authority')}>Authority</button>
        </div>

        <form className="space-y-3" onSubmit={handleSubmit}>
          <div>
            <div className="text-xs opacity-70 mb-1">Email</div>
            <input className="input" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder={tab==='authority'?'sp.jaipur@police.in':'you@example.com'} />
          </div>
          {tab === 'tourist' && (
            <div>
              <div className="text-xs opacity-70 mb-1">Password</div>
              <input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" />
            </div>
          )}

          <button className="btn-primary w-full" type="submit">Log in</button>
        </form>

        {tab === 'tourist' && (
          <div className="text-sm mt-4 opacity-80">
            New tourist? <Link to="/auth/signup" className="underline">Sign up</Link>
          </div>
        )}
        {tab === 'authority' && (
          <div className="text-xs mt-3 opacity-60">
            Only manually registered emails can access the dashboard.
          </div>
        )}
      </div>
    </div>
  )
}
