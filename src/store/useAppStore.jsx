import { create } from 'zustand'

function randomHash() {
  return Array.from(crypto.getRandomValues(new Uint8Array(16)))
    .map(b => b.toString(16).padStart(2, '0')).join('')
}

export const useAppStore = create((set, get) => ({
  // Tourist UI state
  tourist: {
    id: null, // digital ID object
    tracking: true,
    safetyScore: 86,
    lastSeen: new Date().toISOString(),
    location: { lat: 26.9124, lng: 75.7873 }, // Jaipur
  },

  // Which activeTourist corresponds to the current logged-in tourist
  currentUserId: null,
  setCurrentUserId: (id) => set({ currentUserId: id }),

  // Active tourists shown on Authority
  activeTourists: [
    // You can start empty [] if you want no demo users
    { id: 'T-DEMO-01', name: 'Alice', score: 82, location: { lat: 26.92, lng: 75.79 } },
    { id: 'T-DEMO-02', name: 'Rahul', score: 74, location: { lat: 26.91, lng: 75.80 } },
  ],

  upsertActiveTourist: ({ id, name, score, location }) => {
    set((state) => {
      const list = [...state.activeTourists]
      const idx = list.findIndex(t => t.id === id)
      const payload = {
        id,
        name: name ?? 'Tourist',
        score: typeof score === 'number' ? score : state.tourist.safetyScore,
        location: location ?? state.tourist.location,
      }
      if (idx >= 0) list[idx] = { ...list[idx], ...payload }
      else list.unshift(payload)
      return { activeTourists: list }
    })
  },
  removeActiveTourist: (id) => set((state) => ({
    activeTourists: state.activeTourists.filter(t => t.id !== id)
  })),

  alerts: [
    { id: 'A-101', type: 'Geofence', level: 'High', msg: 'Entered restricted buffer zone', time: new Date().toLocaleString() },
  ],
  pushAlert: (a) => set(state => ({ alerts: [a, ...state.alerts] })),

  // ✅ Generate a Digital ID from the LOGGED-IN tourist profile
  // profile: { name, phone, itinerary[], emergency, email, nationality? }
  generateDigitalId: (profile) => {
    const now = new Date()
    const till = new Date(Date.now() + 1000 * 60 * 60 * 24 * 5) // 5 days
    const idObj = {
      id: 'STID-' + randomHash().slice(0, 8).toUpperCase(),
      name: profile?.name || profile?.email || 'Tourist',
      email: profile?.email || undefined,
      phone: profile?.phone || undefined,
      nationality: profile?.nationality || 'IN',
      itinerary: Array.isArray(profile?.itinerary) ? profile.itinerary : [],
      emergency: profile?.emergency ? [profile.emergency] : [],
      validFrom: now.toISOString().slice(0, 10),
      validTo: till.toISOString().slice(0, 10),
      hash: randomHash(),
    }
    set(state => ({ tourist: { ...state.tourist, id: idObj } }))
  },

  toggleTracking: () => set(state => ({ tourist: { ...state.tourist, tracking: !state.tourist.tracking } })),

  // Update current tourist location and mirror to activeTourists entry
  setLocation: (location) => {
    set((state) => {
      const next = { ...state.tourist, location, lastSeen: new Date().toISOString() }
      const { currentUserId, activeTourists } = state
      let updated = activeTourists
      if (currentUserId) {
        const idx = activeTourists.findIndex(t => t.id === currentUserId)
        if (idx >= 0) {
          const copy = [...activeTourists]
          copy[idx] = { ...copy[idx], location }
          updated = copy
        }
      }
      return { tourist: next, activeTourists: updated }
    })
  },
}))
