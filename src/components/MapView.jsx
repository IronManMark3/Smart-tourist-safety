// src/components/MapView.jsx
import { MapContainer, TileLayer, Marker, Circle, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import { useEffect, useMemo, useState } from 'react'
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

function FitTo({ center }) {
  const map = useMap()
  useEffect(() => {
    if (center && Array.isArray(center)) {
      map.setView(center, 13)
    }
  }, [center, map])
  return null
}

/**
 * Props:
 * - mode: 'tourist' | 'authority'
 * - showGeofence?: boolean
 * - tourists?: array (authority mode)
 * - focusCenter?: [lat, lng]  // center map when provided
 */
export default function MapView({ mode = 'tourist', showGeofence = true, tourists = [], focusCenter = null }) {
  const { tourist, setLocation, pushAlert } = useAppStore()
  const [inside, setInside] = useState(false)

  // Demo geofence: Amber Fort buffer zone
  const fenceCenter = useMemo(() => ({ lat: 26.9855, lng: 75.8513 }), [])
  const fenceRadius = 1000 // meters

  const defaultCenter = mode === 'tourist'
    ? [tourist.location.lat, tourist.location.lng]
    : [26.92, 75.80]

  function checkFence(newPos) {
    const d = L.latLng(newPos.lat, newPos.lng).distanceTo(L.latLng(fenceCenter.lat, fenceCenter.lng))
    const nowInside = d <= fenceRadius
    if (nowInside !== inside) {
      setInside(nowInside)
      if (nowInside) {
        toast.custom(() => (
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
    <div className="map-frame">
      <MapContainer center={focusCenter || defaultCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
        <FitTo center={focusCenter || defaultCenter} />
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

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

        {mode === 'authority' && (tourists || []).map(t => (
          <Marker key={t.id} position={[t.location.lat, t.location.lng]} icon={userIcon}>
            <Popup>{t.name} — Safety {t.score}</Popup>
          </Marker>
        ))}

        {showGeofence && (
          <Circle center={[fenceCenter.lat, fenceCenter.lng]} radius={fenceRadius} pathOptions={{ color: 'red', fillColor: 'red', fillOpacity: 0.1 }} />
        )}
      </MapContainer>
    </div>
  )
}
