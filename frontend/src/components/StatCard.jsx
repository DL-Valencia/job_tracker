export default function StatCard({ icon, label, value, color, trend }) {
  return (
    <div
      className="glass-card p-5 flex items-start gap-4 hover:scale-[1.02] transition-transform duration-200"
      style={{ cursor: 'default' }}
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
        style={{ background: color + '22', border: `1px solid ${color}44` }}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">{label}</p>
        <p className="text-3xl font-bold text-white">{value}</p>
        {trend !== undefined && (
          <p className="text-xs mt-1" style={{ color: trend >= 0 ? '#4ade80' : '#f87171' }}>
            {trend >= 0 ? '▲' : '▼'} {Math.abs(trend)} this week
          </p>
        )}
      </div>
    </div>
  );
}
