import { MapContainer, TileLayer, Marker, Circle, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import { useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useAppStore } from '../store/useAppStore'
import { AlertTriangle } from 'lucide-react'

const userIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconAnchor: [12, 40],
  popupAnchor: [0, -30],
})

function FitOnce({ center }) {
  const map = useMap()
  useEffect(() => {
    map.setView(center, 13)
  }, [center, map])
  return null
}

/**
 * Props:
 * - mode: 'tourist' | 'authority'
 * - showGeofence: boolean
 */
export default function MapView({ mode = 'tourist', showGeofence = true }) {
  const { tourist, setLocation, pushAlert, tourists } = useAppStore()
  const [inside, setInside] = useState(false)

  // Demo geofence: Amber Fort buffer zone
  const fenceCenter = useMemo(() => ({ lat: 26.9855, lng: 75.8513 }), [])
  const fenceRadius = 1000 // meters

  const pos = mode === 'tourist' ? tourist.location : { lat: 26.92, lng: 75.80 }

  function checkFence(newPos) {
    const d = L.latLng(newPos.lat, newPos.lng).distanceTo(L.latLng(fenceCenter.lat, fenceCenter.lng))
    const nowInside = d <= fenceRadius
    if (nowInside !== inside) {
      setInside(nowInside)
      if (nowInside) {
        toast.custom((t) => (
          <div className="card flex items-center gap-3">
            <AlertTriangle className="text-amber-500" /> <span>You entered a high-risk zone.</span>
          </div>
        ))
        pushAlert({ id: 'A-' + Date.now(), type: 'Geofence', level: 'High', msg: 'Entered high-risk zone', time: new Date().toLocaleString() })
      } else {
        toast.success('You left the high-risk zone.')
      }
    }
  }

  function onDragEnd(e) {
    const ll = e.target.getLatLng()
    const newPos = { lat: ll.lat, lng: ll.lng }
    setLocation(newPos)
    checkFence(newPos)
  }

  return (
    <div className="h-[420px] rounded-2xl overflow-hidden border border-neutral-200/60 dark:border-neutral-800/60">
      <MapContainer center={[pos.lat, pos.lng]} zoom={13} style={{ height: '100%', width: '100%' }}>
        <FitOnce center={[pos.lat, pos.lng]} />
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Tourist mode => draggable own marker */}
        {mode === 'tourist' && (
          <Marker
            position={[tourist.location.lat, tourist.location.lng]}
            draggable
            eventHandlers={{ dragend: onDragEnd }}
            icon={userIcon}
          >
            <Popup>Your location (drag to simulate movement)</Popup>
          </Marker>
        )}

        {/* Authority: show all tourists */}
        {mode === 'authority' && (tourists || []).map(t => (
          <Marker key={t.id} position={[t.location.lat, t.location.lng]} icon={userIcon}>
            <Popup>{t.name} — Safety {t.score}</Popup>
          </Marker>
        ))}

        {/* Geofence circle */}
        {showGeofence && (
          <Circle center={[fenceCenter.lat, fenceCenter.lng]} radius={fenceRadius} pathOptions={{ color: 'red', fillColor: 'red', fillOpacity: 0.1 }} />
        )}
      </MapContainer>
    </div>
  )
}
