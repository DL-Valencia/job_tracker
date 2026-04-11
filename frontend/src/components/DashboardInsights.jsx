import { TrendingUp, BarChart3, Target, Info } from 'lucide-react';

export default function DashboardInsights({ metrics }) {
  if (!metrics || metrics.total === 0) return null;

  const { Applied, Interview, Offer, Rejected, platforms } = metrics;
  
  // Funnel Data Calculation
  const funnelStages = [
    { label: 'Applied', count: Applied + Interview + Offer + Rejected, color: '#3b82f6' },
    { label: 'Interview', count: Interview + Offer, color: '#eab308' },
    { label: 'Offer', count: Offer, color: '#22c55e' },
  ];

  // Platform Momentum Calculation
  const maxPlatformCount = Math.max(...Object.values(platforms), 1);
  const platformEntries = Object.entries(platforms).sort((a, b) => b[1] - a[1]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Success Funnel */}
      <div className="glass-card p-6 flex flex-col h-full">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <Target size={18} className="text-indigo-400" /> Success Funnel
          </h3>
          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Conversion Rate</span>
        </div>

        <div className="flex-1 flex flex-col justify-center space-y-4">
          {funnelStages.map((stage, idx) => {
            const percentage = stage.count > 0 && funnelStages[0].count > 0 
              ? Math.round((stage.count / funnelStages[0].count) * 100) 
              : 0;
            const width = 100 - (idx * 15); // Funnel shape

            return (
              <div key={stage.label} className="relative group">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-400 font-medium">{stage.label}</span>
                  <span className="text-xs text-white font-bold">{stage.count}</span>
                </div>
                <div className="h-8 bg-slate-900/50 rounded-lg overflow-hidden border border-slate-800/30">
                  <div 
                    className="h-full transition-all duration-1000 ease-out flex items-center justify-end px-3"
                    style={{ 
                      width: `${percentage}%`, 
                      background: `linear-gradient(90deg, ${stage.color}22, ${stage.color}88)`,
                      borderRight: `2px solid ${stage.color}`,
                      maxWidth: `${width}%`,
                      margin: '0 auto'
                    }}
                  >
                    <span className="text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      {percentage}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 p-3 rounded-lg bg-indigo-500/5 border border-indigo-500/10 flex items-start gap-3">
          <Info size={14} className="text-indigo-400 mt-0.5 shrink-0" />
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Your primary goal is to widen the green "Offer" stage by increasing quality applications and interview prep.
          </p>
        </div>
      </div>

      {/* Platform Momentum */}
      <div className="glass-card p-6 flex flex-col h-full">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <BarChart3 size={18} className="text-indigo-400" /> Platform Momentum
          </h3>
          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Volume</span>
        </div>

        <div className="flex-1 flex flex-col justify-center space-y-5">
          {platformEntries.map(([name, count]) => {
            const percentage = Math.round((count / maxPlatformCount) * 100);
            return (
              <div key={name}>
                <div className="flex items-center justify-between mb-1.5 px-1">
                  <span className="text-xs text-slate-200 font-medium">{name}</span>
                  <span className="text-xs text-slate-500">{count} jobs</span>
                </div>
                <div className="h-2 bg-slate-900/50 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-500 rounded-full transition-all duration-1000 ease-out"
                    style={{ 
                      width: `${percentage}%`,
                      background: 'linear-gradient(90deg, #6366f1, #8b5cf6)'
                    }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex items-center gap-4 py-2 border-t border-slate-800/50">
          <div className="flex -space-x-2">
            {['💼', '🔍', '🏢', '🌐'].map((emoji, i) => (
              <div key={i} className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs">
                {emoji}
              </div>
            ))}
          </div>
          <p className="text-[11px] text-slate-400 font-medium">
            Most active on <span className="text-indigo-400 font-bold">{platformEntries[0][0]}</span> this month.
          </p>
        </div>
      </div>
    </div>
  );
}
