import { create } from 'zustand'

function randomHash() {
  return Array.from(crypto.getRandomValues(new Uint8Array(16)))
    .map(b => b.toString(16).padStart(2, '0')).join('')
}

export const useAppStore = create((set, get) => ({
  role: null,
  setRole: (r) => set({ role: r }),

  tourist: {
    id: null, // object with fields below
    tracking: true,
    safetyScore: 86,
    lastSeen: new Date().toISOString(),
    location: { lat: 26.9124, lng: 75.7873 }, // Jaipur
  },

  alerts: [
    { id: 'A-101', type: 'Geofence', level: 'High', msg: 'Entered restricted buffer zone', time: new Date().toLocaleString() },
  ],

  tourists: [
    { id: 'T-01', name: 'Alice', score: 82, location: { lat: 26.92, lng: 75.79 } },
    { id: 'T-02', name: 'Rahul', score: 74, location: { lat: 26.91, lng: 75.80 } },
    { id: 'T-03', name: 'Mina',  score: 90, location: { lat: 26.90, lng: 75.78 } },
  ],

  mintTouristId: () => {
    const now = new Date()
    const till = new Date(Date.now() + 1000 * 60 * 60 * 24 * 5) // 5 days
    const id = {
      id: 'STID-' + randomHash().slice(0, 8).toUpperCase(),
      name: 'John Doe',
      nationality: 'IN',
      validFrom: now.toISOString().slice(0, 10),
      validTo: till.toISOString().slice(0, 10),
      itinerary: ['Jaipur', 'Jodhpur', 'Udaipur'],
      emergency: ['+91-9999999999'],
      hash: randomHash(),
    }
    set(state => ({ tourist: { ...state.tourist, id } }))
  },

  toggleTracking: () => set(state => ({ tourist: { ...state.tourist, tracking: !state.tourist.tracking } })),
  setLocation: (location) => set(state => ({ tourist: { ...state.tourist, location, lastSeen: new Date().toISOString() } })),
  pushAlert: (a) => set(state => ({ alerts: [a, ...state.alerts] })),
}))
