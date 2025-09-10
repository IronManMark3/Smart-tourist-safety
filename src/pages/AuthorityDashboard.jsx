import Sidebar from '../components/Sidebar'
import MapView from '../components/MapView'
import StatCard from '../components/StatCard'
import { useAppStore } from '../store/useAppStore'

export default function AuthorityDashboard() {
  const { tourists, alerts } = useAppStore()

  const active = tourists.length
  const highRisk = alerts.filter(a => a.type === 'Geofence').length
  const critical = alerts.filter(a => a.level === 'Critical').length

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 flex">
      <Sidebar variant="authority" />

      <div className="flex-1 space-y-6">
        <div className="grid md:grid-cols-3 gap-4">
          <StatCard label="Active Tourists (mock)" value={active} />
          <StatCard label="High-Risk Alerts" value={highRisk} sub="Geofence entries" />
          <StatCard label="Critical" value={critical} sub="SOS triggers" />
        </div>

        <div className="card">
          <div className="text-lg font-semibold mb-3">Live Map — Clusters & Risk Zones</div>
          <MapView mode="authority" showGeofence />
        </div>

        <div className="card">
          <div className="text-lg font-semibold mb-3">Recent Alerts</div>
          <table className="table">
            <thead>
              <tr><th>ID</th><th>Type</th><th>Level</th><th>Message</th><th>Time</th></tr>
            </thead>
            <tbody>
              {alerts.slice(0, 6).map(a => (
                <tr key={a.id}>
                  <td className="font-mono">{a.id}</td>
                  <td>{a.type}</td>
                  <td>{a.level}</td>
                  <td className="truncate">{a.msg}</td>
                  <td className="opacity-70">{a.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  )
}
