// src/pages/Tourist.jsx
import { useState, useMemo } from 'react'
import Sidebar from '../components/Sidebar'
import MapView from '../components/MapView'
import Modal from '../components/Modal'
import { useAppStore } from '../store/useAppStore'
import { useAuthStore } from '../store/useAuthStore'
import { toast } from 'react-hot-toast'
import QRCode from 'react-qr-code'
import { ShieldAlert, ShieldCheck, QrCode, MapPin, Bell, Pencil } from 'lucide-react'

export default function Tourist() {
  const { tourist, toggleTracking, pushAlert, generateDigitalId } = useAppStore()
  const user = useAuthStore(s => s.currentUser)
  const saveTouristProfile = useAuthStore(s => s.saveTouristProfile)

  const profile = user?.profile || null
  const profileIncomplete = !profile

  // —— Edit Profile Modal state ——
  const [editOpen, setEditOpen] = useState(false)
  const [name, setName] = useState(user?.name || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [itineraryStr, setItineraryStr] = useState(
    user?.profile?.itinerary?.join(', ') || ''
  )
  const [emergency, setEmergency] = useState(user?.profile?.emergency || '')

  // Keep form fields in sync if the store changes (e.g., after login/onboarding)
  useMemo(() => {
    setName(user?.name || '')
    setPhone(user?.phone || '')
    setItineraryStr(user?.profile?.itinerary?.join(', ') || '')
    setEmergency(user?.profile?.emergency || '')
  }, [user])

  function handlePanic() {
    pushAlert({
      id: 'A-' + Date.now(),
      type: 'SOS',
      level: 'Critical',
      msg: 'Panic button pressed',
      time: new Date().toLocaleString()
    })
    toast.error('SOS triggered — sharing live location to nearest unit + contacts (demo).')
  }

  function handleGenerateId() {
    // Build a profile snapshot from auth (fallbacks included)
    const snapshot = {
      name: profile?.name || user?.name || '',
      phone: profile?.phone || user?.phone || '',
      itinerary: profile?.itinerary || [],
      emergency: profile?.emergency || '',
      email: user?.email || '',
      nationality: 'IN',
    }
    generateDigitalId(snapshot)
    toast.success('Digital ID generated')
  }

  function submitEdit() {
    if (!name || !phone || !emergency) {
      toast.error('Please fill name, phone & emergency contact.')
      return
    }
    const iti = itineraryStr
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)

    saveTouristProfile({ name, phone, itinerary: iti, emergency })
    toast.success('Profile updated')
    setEditOpen(false)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 flex">
      <Sidebar variant="tourist" />

      <div className="flex-1 space-y-6">
        {profileIncomplete && (
          <div className="card border-amber-300/60">
            <div className="text-sm">
              Your profile is incomplete.{" "}
              <a className="underline" href="/tourist/onboarding">
                Complete onboarding
              </a>{" "}
              to add name, phone, itinerary & emergency contact — or click “Edit Profile” below.
            </div>
          </div>
        )}

        {/* Top stat cards */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="card">
            <div className="text-xs opacity-70">Safety Score</div>
            <div className="text-3xl font-bold mt-1 flex items-center gap-2">
              {tourist.safetyScore}
              {tourist.safetyScore >= 80
                ? <ShieldCheck className="text-emerald-500" />
                : <ShieldAlert className="text-amber-500" />}
            </div>
            <div className="text-xs opacity-60 mt-1">Higher is safer (based on mock patterns)</div>
          </div>

          <div className="card flex items-center justify-between">
            <div>
              <div className="text-xs opacity-70">Tracking</div>
              <div className="font-semibold">{tourist.tracking ? 'Enabled' : 'Disabled'}</div>
            </div>
            <button className="btn-ghost" onClick={toggleTracking}>
              {tourist.tracking ? 'Disable' : 'Enable'}
            </button>
          </div>

          <div className="card flex items-center justify-between">
            <div>
              <div className="text-xs opacity-70">Last seen</div>
              <div className="font-semibold truncate max-w-[220px]">
                {new Date(tourist.lastSeen).toLocaleString()}
              </div>
            </div>
            <button className="btn-primary" onClick={handlePanic}>
              <Bell size={16}/> SOS
            </button>
          </div>
        </div>

        {/* Map */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 opacity-70 text-sm">
            <MapPin size={16}/>
            Drag the marker to simulate movement into/out of a high-risk zone.
          </div>
          <MapView mode="tourist" />
        </div>

        {/* Digital ID + Profile Summary */}
        <div className="card">
          <div className="flex items-center justify-between">
            <div className="text-lg font-semibold flex items-center gap-2">
              <QrCode size={18}/> Digital Tourist ID
            </div>
            <div className="flex items-center gap-2">
              <button className="btn-ghost" onClick={() => setEditOpen(true)}>
                <Pencil size={16} /> Edit Profile
              </button>
              <button className="btn-primary" onClick={handleGenerateId}>Generate / Refresh</button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-4">
            <div className="space-y-2">
              <div className="text-sm">
                <span className="opacity-70">Name:</span>{" "}
                {user?.profile?.name || user?.name || <i className="opacity-60">—</i>}
              </div>
              <div className="text-sm">
                <span className="opacity-70">Phone:</span>{" "}
                {user?.profile?.phone || user?.phone || <i className="opacity-60">—</i>}
              </div>
              <div className="text-sm">
                <span className="opacity-70">Itinerary:</span>{" "}
                {user?.profile?.itinerary?.length ? user.profile.itinerary.join(', ') : <i className="opacity-60">—</i>}
              </div>
              <div className="text-sm">
                <span className="opacity-70">Emergency:</span>{" "}
                {user?.profile?.emergency || <i className="opacity-60">—</i>}
              </div>
            </div>

            <div className="space-y-3">
              {tourist.id ? (
                <div className="grid md:grid-cols-2 gap-4 items-center">
                  <div className="space-y-1">
                    <div className="text-sm"><span className="opacity-70">ID:</span> <b>{tourist.id.id}</b></div>
                    <div className="text-sm"><span className="opacity-70">Email:</span> {tourist.id.email || '—'}</div>
                    <div className="text-sm"><span className="opacity-70">Valid:</span> {tourist.id.validFrom} → {tourist.id.validTo}</div>
                    <div className="text-xs opacity-60 break-all">
                      <span className="opacity-70">Hash:</span> {tourist.id.hash}
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="bg-white p-3 rounded-xl shadow-inner">
                      <QRCode value={JSON.stringify(tourist.id)} size={160} />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-sm opacity-70">
                  Click “Generate / Refresh” to mint a mock blockchain-backed ID with your profile (demo).
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Edit Profile Modal */}
        <Modal
          open={editOpen}
          onClose={() => setEditOpen(false)}
          title="Edit Profile"
          footer={
            <>
              <button className="btn-ghost" onClick={() => setEditOpen(false)}>Cancel</button>
              <button className="btn-primary" onClick={submitEdit}>Save Changes</button>
            </>
          }
        >
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <div className="text-xs opacity-70 mb-1">Full Name</div>
              <input
                className="input"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="John Doe"
              />
            </div>
            <div>
              <div className="text-xs opacity-70 mb-1">Phone</div>
              <input
                className="input"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+91-XXXXXXXXXX"
              />
            </div>
            <div className="md:col-span-2">
              <div className="text-xs opacity-70 mb-1">Planned Itinerary (comma separated)</div>
              <input
                className="input"
                value={itineraryStr}
                onChange={e => setItineraryStr(e.target.value)}
                placeholder="Jaipur, Jodhpur, Udaipur"
              />
            </div>
            <div className="md:col-span-2">
              <div className="text-xs opacity-70 mb-1">Emergency Contact</div>
              <input
                className="input"
                value={emergency}
                onChange={e => setEmergency(e.target.value)}
                placeholder="+91-9999999999"
              />
            </div>
          </div>
        </Modal>
      </div>
    </div>
  )
}
