import Sidebar from '../components/Sidebar'
import MapView from '../components/MapView'
import { useAppStore } from '../store/useAppStore'
import { toast } from 'react-hot-toast'
import QRCode from 'react-qr-code'
import { ShieldAlert, ShieldCheck, QrCode, MapPin, Bell } from 'lucide-react'

export default function Tourist() {
  const { tourist, mintTouristId, toggleTracking, pushAlert } = useAppStore()

  function handlePanic() {
    pushAlert({ id: 'A-' + Date.now(), type: 'SOS', level: 'Critical', msg: 'Panic button pressed', time: new Date().toLocaleString() })
    toast.error('SOS triggered — sharing live location to nearest unit + contacts (demo).')
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 flex">
      <Sidebar variant="tourist" />

      <div className="flex-1 space-y-6">
        {/* Header bar */}
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
              <div className="font-semibold truncate max-w-[220px]">{new Date(tourist.lastSeen).toLocaleString()}</div>
            </div>
            <button className="btn-primary" onClick={handlePanic}><Bell size={16}/> SOS</button>
          </div>
        </div>

        {/* Map */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 opacity-70 text-sm"><MapPin size={16}/> Drag the marker to simulate movement into/out of a high-risk zone.</div>
          <MapView mode="tourist" />
        </div>

        {/* Digital ID */}
        <div className="card">
          <div className="flex items-center justify-between">
            <div className="text-lg font-semibold flex items-center gap-2"><QrCode size={18}/> Digital Tourist ID</div>
            <button className="btn-primary" onClick={mintTouristId}>Generate / Refresh</button>
          </div>

          {tourist.id ? (
            <div className="grid md:grid-cols-2 gap-6 mt-4">
              <div className="space-y-2">
                <div className="text-sm"><span className="opacity-70">ID:</span> <b>{tourist.id.id}</b></div>
                <div className="text-sm"><span className="opacity-70">Name:</span> {tourist.id.name}</div>
                <div className="text-sm"><span className="opacity-70">Nationality:</span> {tourist.id.nationality}</div>
                <div className="text-sm"><span className="opacity-70">Valid:</span> {tourist.id.validFrom} → {tourist.id.validTo}</div>
                <div className="text-sm"><span className="opacity-70">Itinerary:</span> {tourist.id.itinerary.join(', ')}</div>
                <div className="text-sm"><span className="opacity-70">Emergency:</span> {tourist.id.emergency.join(', ')}</div>
                <div className="text-xs opacity-60 break-all"><span className="opacity-70">Hash:</span> {tourist.id.hash}</div>
              </div>
              <div className="flex items-center justify-center">
                <div className="bg-white p-3 rounded-xl shadow-inner">
                  <QRCode value={JSON.stringify(tourist.id)} size={160} />
                </div>
              </div>
            </div>
          ) : (
            <div className="text-sm opacity-70 mt-3">Click “Generate / Refresh” to mint a mock blockchain-backed ID (demo).</div>
          )}
        </div>
      </div>
    </div>
  )
}
