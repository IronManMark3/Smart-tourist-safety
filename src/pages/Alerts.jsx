import Sidebar from '../components/Sidebar'
import { useAppStore } from '../store/useAppStore'

export default function Alerts() {
  const { alerts } = useAppStore()
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 flex">
      <Sidebar variant="authority" />
      <div className="flex-1 space-y-6">
        <div className="card">
          <div className="text-lg font-semibold mb-3">All Alerts</div>
          <table className="table">
            <thead>
              <tr><th>ID</th><th>Type</th><th>Level</th><th>Message</th><th>Time</th></tr>
            </thead>
            <tbody>
              {alerts.map(a => (
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
