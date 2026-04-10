const STATUS_CONFIG = {
  Applied: {
    bg: 'rgba(59,130,246,0.15)',
    border: 'rgba(59,130,246,0.35)',
    color: '#60a5fa',
    dot: '#3b82f6',
  },
  Interview: {
    bg: 'rgba(234,179,8,0.15)',
    border: 'rgba(234,179,8,0.35)',
    color: '#fbbf24',
    dot: '#eab308',
  },
  Rejected: {
    bg: 'rgba(239,68,68,0.15)',
    border: 'rgba(239,68,68,0.35)',
    color: '#f87171',
    dot: '#ef4444',
  },
  Offer: {
    bg: 'rgba(34,197,94,0.15)',
    border: 'rgba(34,197,94,0.35)',
    color: '#4ade80',
    dot: '#22c55e',
  },
  Saved: {
    bg: 'rgba(168,85,247,0.15)',
    border: 'rgba(168,85,247,0.35)',
    color: '#c084fc',
    dot: '#a855f7',
  },
};

export default function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG['Applied'];
  return (
    <span
      style={{
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
        color: cfg.color,
        padding: '0.25rem 0.75rem',
        borderRadius: '999px',
        fontSize: '0.78rem',
        fontWeight: 600,
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        whiteSpace: 'nowrap',
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: cfg.dot,
          display: 'inline-block',
          flexShrink: 0,
        }}
      />
      {status}
    </span>
  );
}
