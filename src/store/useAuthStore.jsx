import { create } from 'zustand'
import { useAppStore } from './useAppStore'

/** Storage keys */
const AUTH_KEY = 'sts_auth_v1'     // currently logged-in user
const USERS_KEY = 'sts_users_v1'   // registry of signed-up tourists

/** LocalStorage helpers */
const loadUsers = () => {
  try { return JSON.parse(localStorage.getItem(USERS_KEY)) || [] } catch { return [] }
}
const saveUsers = (arr) => localStorage.setItem(USERS_KEY, JSON.stringify(arr))
const loadCurrent = () => {
  try { return JSON.parse(localStorage.getItem(AUTH_KEY)) || null } catch { return null }
}
const saveCurrent = (u) => localStorage.setItem(AUTH_KEY, JSON.stringify(u))

/** Manually registered authority accounts (whitelist) */
const AUTHORITY_WHITELIST = [
  { email: 'sp.jaipur@police.in', name: 'SP Jaipur', phone: '0141-0000000', role: 'authority' },
  { email: 'dsp.jaipur@police.in', name: 'DSP Jaipur', phone: '0141-1111111', role: 'authority' },
]

export const useAuthStore = create((set, get) => ({
  /** Auth state */
  currentUser: loadCurrent(),   // { id, role, email, password?, name, phone, profile? }
  users: loadUsers(),           // [{ id, role:'tourist', email, password, name, phone, profile }]

  /** Tourist Sign Up — creates a user and immediately adds them to Active Tourists */
  signupTourist: ({ email, password }) => {
    const users = get().users
    const exists = users.some(u => u.email.toLowerCase() === email.toLowerCase())
    if (exists) throw new Error('Email already registered. Please log in.')

    const id = 'U-' + Math.random().toString(36).slice(2, 8).toUpperCase()
    const user = { id, role: 'tourist', email, password, name: '', phone: '', profile: null }

    const nextUsers = [user, ...users]
    set({ users: nextUsers, currentUser: user })
    saveUsers(nextUsers)
    saveCurrent(user)

    // ⬇️ Immediately visible on Authority "Active Tourists"
    const app = useAppStore.getState()
    app.setCurrentUserId(user.id)
    app.upsertActiveTourist({
      id: user.id,
      name: user.name || user.email,
      score: app.tourist.safetyScore,
      location: app.tourist.location,
    })
  },

  /** Tourist Login — only if already signed up; adds/upserts to Active Tourists */
  loginTourist: ({ email, password }) => {
    const users = get().users
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase())
    if (!found) throw new Error('No account found. Please sign up first.')
    if ((found.password || '') !== password) throw new Error('Incorrect password.')

    set({ currentUser: found })
    saveCurrent(found)

    const app = useAppStore.getState()
    app.setCurrentUserId(found.id)
    app.upsertActiveTourist({
      id: found.id,
      name: found.name || found.email,
      score: app.tourist.safetyScore,
      location: app.tourist.location,
    })
  },

  /** Authority Login — whitelist only (not added to Active Tourists) */
  loginAuthority: ({ email }) => {
    const found = AUTHORITY_WHITELIST.find(u => u.email.toLowerCase() === email.toLowerCase())
    if (!found) throw new Error('Not registered. Contact admin to get access.')
    const user = { ...found, id: found.email }
    set({ currentUser: user })
    saveCurrent(user)

    const app = useAppStore.getState()
    app.setCurrentUserId(null) // authorities aren't tourists on the map
  },

  /** Save Tourist Onboarding Profile — also updates Active Tourists name immediately */
  saveTouristProfile: ({ name, phone, itinerary, emergency }) => {
    const curr = get().currentUser
    if (!curr || curr.role !== 'tourist') return
    const profile = { name, phone, itinerary, emergency }
    const updated = { ...curr, name, phone, profile }

    // Update current user + users DB
    const users = get().users
    const nextUsers = users.map(u => u.id === curr.id ? updated : u)
    set({ currentUser: updated, users: nextUsers })
    saveUsers(nextUsers)
    saveCurrent(updated)

    // Reflect new name on the Authority list
    const app = useAppStore.getState()
    app.setCurrentUserId(updated.id)
    app.upsertActiveTourist({
      id: updated.id,
      name: name || updated.email,
      score: app.tourist.safetyScore,
      location: app.tourist.location,
    })
  },

  /** Logout — keep the tourist in Active Tourists (so Authority still sees them) */
  logout: () => {
    const curr = get().currentUser
    const app = useAppStore.getState()

    if (curr?.role === 'tourist') {
      // Do NOT remove from Active Tourists — keep their last known state visible
      app.setCurrentUserId(null)
    }
    set({ currentUser: null })
    localStorage.removeItem(AUTH_KEY)
  },
}))
