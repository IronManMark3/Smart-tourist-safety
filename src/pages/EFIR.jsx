import Sidebar from '../components/Sidebar'
import Modal from '../components/Modal'
import { useState } from 'react'
import { useAppStore } from '../store/useAppStore'
import { toast } from 'react-hot-toast'

export default function EFIR() {
  const { pushAlert } = useAppStore()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ touristId: '', name: '', lastSeen: '', reason: '' })

  function submit() {
    if (!form.touristId || !form.name) {
      toast.error('Tourist ID and Name are required.')
      return
    }
    pushAlert({
      id: 'EFIR-' + Date.now(),
      type: 'E-FIR',
      level: 'Info',
      msg: `E-FIR filed for ${form.name} (${form.touristId})`,
      time: new Date().toLocaleString()
    })
    toast.success('E-FIR generated (demo).')
    setOpen(false)
    setForm({ touristId: '', name: '', lastSeen: '', reason: '' })
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 flex">
      <Sidebar variant="authority" />
      <div className="flex-1 space-y-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div className="text-lg font-semibold">E-FIR</div>
            <button className="btn-primary" onClick={() => setOpen(true)}>Create E-FIR</button>
          </div>
          <div className="opacity-70 text-sm mt-3">
            File a quick E-FIR for a missing tourist with last known details. This is a front-end demo only.
          </div>
        </div>

        <Modal open={open} onClose={() => setOpen(false)} title="New E-FIR"
          footer={
            <>
              <button className="btn-ghost" onClick={() => setOpen(false)}>Cancel</button>
              <button className="btn-primary" onClick={submit}>Submit</button>
            </>
          }>
          <div className="grid gap-3">
            <div>
              <div className="text-xs opacity-70 mb-1">Tourist ID</div>
              <input className="input" value={form.touristId} onChange={e => setForm({ ...form, touristId: e.target.value })} placeholder="STID-XXXXXX" />
            </div>
            <div>
              <div className="text-xs opacity-70 mb-1">Name</div>
              <input className="input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="John Doe" />
            </div>
            <div>
              <div className="text-xs opacity-70 mb-1">Last Seen (date/time & location)</div>
              <input className="input" value={form.lastSeen} onChange={e => setForm({ ...form, lastSeen: e.target.value })} placeholder="2025-09-10 16:40, Amber Fort Gate" />
            </div>
            <div>
              <div className="text-xs opacity-70 mb-1">Reason / Notes</div>
              <textarea className="input min-h-[90px]" value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} placeholder="Prolonged inactivity, phone unreachable, deviated from itinerary"></textarea>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  )
}
