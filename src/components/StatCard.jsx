export default function StatCard({ label, value, sub }) {
  return (
    <div className="card">
      <div className="text-xs text-soft">{label}</div>
      <div className="mt-1 text-3xl font-semibold tracking-tight">{value}</div>
      {sub && <div className="mt-1 text-xs opacity-70">{sub}</div>}
    </div>
  )
}
