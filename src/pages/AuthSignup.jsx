// src/pages/AuthSignup.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'
import { toast } from 'react-hot-toast'

export default function AuthSignup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const nav = useNavigate()
  const { signupTourist } = useAuthStore()

  function submit(e) {
    e.preventDefault()
    if (!email || !password) { toast.error('Enter email & password'); return }
    try {
      signupTourist({ email, password }) // throws if email already exists
      toast.success('Account created')
      nav('/tourist/onboarding', { replace: true })
    } catch (err) {
      toast.error(err.message || 'Sign up failed')
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <div className="card">
        <div className="text-lg font-semibold mb-3">Tourist Sign Up</div>
        <form className="space-y-3" onSubmit={submit}>
          <div>
            <div className="text-xs opacity-70 mb-1">Email</div>
            <input className="input" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
          <div>
            <div className="text-xs opacity-70 mb-1">Password</div>
            <input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" />
          </div>
          <button className="btn-primary w-full" type="submit">Create account</button>
        </form>
        <div className="text-xs opacity-60 mt-3">
          You’ll complete your profile (name, phone, itinerary, emergency contact) next.
        </div>
      </div>
    </div>
  )
}
