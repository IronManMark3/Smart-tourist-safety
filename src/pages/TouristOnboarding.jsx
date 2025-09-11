import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'
import { toast } from 'react-hot-toast'

export default function TouristOnboarding() {
  const user = useAuthStore(s => s.currentUser)
  const saveTouristProfile = useAuthStore(s => s.saveTouristProfile)
  const nav = useNavigate()

  useEffect(() => {
    if (!user || user.role !== 'tourist') nav('/auth/login', { replace: true })
  }, [user, nav])

  const [name, setName] = useState(user?.name || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [itinerary, setItinerary] = useState(user?.profile?.itinerary?.join(', ') || '')
  const [emergency, setEmergency] = useState(user?.profile?.emergency || '')

  function submit(e) {
    e.preventDefault()
    if (!name || !phone || !emergency) { toast.error('Fill name, phone & emergency contact'); return }
    const iti = itinerary.split(',').map(s => s.trim()).filter(Boolean)
    saveTouristProfile({ name, phone, itinerary: iti, emergency })
    toast.success('Profile saved')
    nav('/tourist', { replace: true })
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="card">
        <div className="text-lg font-semibold mb-3">Tourist Onboarding</div>
        <form className="grid md:grid-cols-2 gap-4" onSubmit={submit}>
          <div>
            <div className="text-xs opacity-70 mb-1">Full Name</div>
            <input className="input" value={name} onChange={e=>setName(e.target.value)} placeholder="John Doe" />
          </div>
          <div>
            <div className="text-xs opacity-70 mb-1">Phone</div>
            <input className="input" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+91-XXXXXXXXXX" />
          </div>
          <div className="md:col-span-2">
            <div className="text-xs opacity-70 mb-1">Planned Itinerary (comma separated)</div>
            <input className="input" value={itinerary} onChange={e=>setItinerary(e.target.value)} placeholder="Jaipur, Jodhpur, Udaipur" />
          </div>
          <div className="md:col-span-2">
            <div className="text-xs opacity-70 mb-1">Emergency Contact</div>
            <input className="input" value={emergency} onChange={e=>setEmergency(e.target.value)} placeholder="+91-9999999999" />
          </div>
          <div className="md:col-span-2 flex justify-end gap-2">
            <button type="button" className="btn-ghost" onClick={()=>nav('/tourist')}>Skip</button>
            <button className="btn-primary">Save & Continue</button>
          </div>
        </form>
      </div>
    </div>
  )
}
