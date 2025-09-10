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
            Demo prototype for Digital ID, live geofencing, SOS, anomaly hints, and an authority dashboard with alerts & E-FIR.
            Built with React, Tailwind, Leaflet & Zustand.
          </p>
          <div className="flex gap-3">
            <Link to="/tourist" className="btn-primary">Enter Tourist App</Link>
            <Link to="/authority" className="btn-ghost">Open Authority Dashboard</Link>
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
