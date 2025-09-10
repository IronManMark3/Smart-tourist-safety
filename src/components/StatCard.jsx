export default function StatCard({ label, value, sub }) {
    return (
      <div className="card">
        <div className="text-xs opacity-70">{label}</div>
        <div className="text-2xl font-semibold mt-1">{value}</div>
        {sub && <div className="text-xs opacity-60 mt-1">{sub}</div>}
      </div>
    )
  }
  