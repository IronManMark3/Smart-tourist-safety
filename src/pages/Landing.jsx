import { Link } from 'react-router-dom'
import { ShieldCheck, User, ActivitySquare } from 'lucide-react'

export default function Landing() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <section className="grid md:grid-cols-2 gap-6 items-center">
        <div className="space-y-5">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Smart Tourist Safety Monitoring <span className="opacity-70">&</span> Incident Response
          </h1>
          <p className="opacity-80">
            Now with secure login: Tourists must sign in & complete onboarding. Authority access is restricted to pre-registered users.
          </p>
          <div className="flex gap-3">
            <Link to="/auth/login" className="btn-primary">Tourist: Login / Sign up</Link>
            <Link to="/auth/login" className="btn-ghost">Authority: Login</Link>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="card"><User /> <div className="mt-2 font-semibold">Digital ID</div></div>
          <div className="card"><ActivitySquare /> <div className="mt-2 font-semibold">Geofence</div></div>
          <div className="card"><ShieldCheck /> <div className="mt-2 font-semibold">SOS</div></div>
        </div>
      </section>
    </div>
  )
}
