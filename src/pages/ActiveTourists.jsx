import { useMemo, useState } from 'react'
import Sidebar from '../components/Sidebar'
import Modal from '../components/Modal'
import MapView from '../components/MapView'
import { useAppStore } from '../store/useAppStore'
import { toast } from 'react-hot-toast'
import { Search, BellRing, FileWarning } from 'lucide-react'

export default function ActiveTourists() {
  const activeTourists = useAppStore(s => s.activeTourists)
  const pushAlert = useAppStore(s => s.pushAlert)
  const [q, setQ] = useState('')
  const [selected, setSelected] = useState(null) // tourist object

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase()
    if (!needle) return activeTourists
    return activeTourists.filter(t =>
      (t.name || '').toLowerCase().includes(needle) ||
      (t.id || '').toLowerCase().includes(needle)
    )
  }, [q, activeTourists])

  function pingTourist(t) {
    pushAlert({
      id: 'PING-' + Date.now(),
      type: 'Ping',
      level: 'Info',
      msg: `Ping sent to ${t.name || t.id}`,
      time: new Date().toLocaleString()
    })
    toast.success('Ping sent (demo).')
  }

  function markMissing(t) {
    pushAlert({
      id: 'EFIR-' + Date.now(),
      type: 'E-FIR',
      level: 'Info',
      msg: `E-FIR drafted for ${t.name || t.id} (marked missing)`,
      time: new Date().toLocaleString()
    })
    toast('E-FIR drafted (demo). You can finalize in the E-FIR page.', { icon: '📝' })
  }

  const focus = selected ? [selected.location.lat, selected.location.lng] : null

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 flex">
      <Sidebar variant="authority" />

      <div className="flex-1 space-y-6">
        {/* Header */}
        <div className="card">
          <div className="flex items-center justify-between">
            <div className="text-lg font-semibold">Active Tourists</div>
            <div className="flex items-center gap-2 w-full max-w-md">
              <div className="relative w-full">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60" />
                <input
                  className="input pl-9"
                  placeholder="Search by name or ID…"
                  value={q}
                  onChange={(e)=>setQ(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main split: list + map */}
        <div className="grid lg:grid-cols-2 gap-4">
          {/* List */}
          <div className="card">
            <table className="table">
              <thead>
                <tr>
                  <th className="w-[120px]">ID</th>
                  <th>Name</th>
                  <th>Score</th>
                  <th>Location</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {list.map(t => (
                  <tr key={t.id}>
                    <td className="font-mono">{t.id}</td>
                    <td>{t.name || 'Tourist'}</td>
                    <td>{t.score ?? '—'}</td>
                    <td className="text-xs opacity-80">
                      {t.location.lat.toFixed(4)}, {t.location.lng.toFixed(4)}
                    </td>
                    <td className="flex gap-2">
                      <button className="btn-ghost" onClick={() => setSelected(t)}>Details</button>
                      <button className="btn-ghost" onClick={() => pingTourist(t)} title="Ping">
                        <BellRing size={16} />
                      </button>
                      <button className="btn-ghost" onClick={() => markMissing(t)} title="Mark Missing">
                        <FileWarning size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                {list.length === 0 && (
                  <tr>
                    <td colSpan="5" className="py-6 text-center opacity-70 text-sm">No matching tourists.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Map */}
          <div className="card">
            <div className="text-sm opacity-70 mb-2">
              Click “Details” to center the map on a tourist.
            </div>
            <MapView mode="authority" tourists={activeTourists} showGeofence focusCenter={focus} />
          </div>
        </div>

        {/* Details modal */}
        <Modal
          open={!!selected}
          onClose={() => setSelected(null)}
          title="Tourist Details"
          footer={
            <>
              {selected && (
                <>
                  <button className="btn-ghost" onClick={() => pingTourist(selected)}><BellRing size={16}/> Ping</button>
                  <button className="btn-primary" onClick={() => markMissing(selected)}><FileWarning size={16}/> Mark Missing</button>
                </>
              )}
              <button className="btn-ghost" onClick={() => setSelected(null)}>Close</button>
            </>
          }
        >
          {selected && (
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-sm"><span className="opacity-70">ID:</span> <b>{selected.id}</b></div>
                <div className="text-sm"><span className="opacity-70">Name:</span> {selected.name || 'Tourist'}</div>
                <div className="text-sm"><span className="opacity-70">Safety Score:</span> {selected.score ?? '—'}</div>
                <div className="text-sm"><span className="opacity-70">Last Known Location:</span><br/>
                  <span className="font-mono text-xs">{selected.location.lat.toFixed(6)}, {selected.location.lng.toFixed(6)}</span>
                </div>
              </div>
              <div className="rounded-xl overflow-hidden border border-neutral-200/60 dark:border-neutral-800/60">
                <MapView mode="authority" tourists={[selected]} showGeofence focusCenter={[selected.location.lat, selected.location.lng]} />
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  )
}
