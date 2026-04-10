import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ page, pages, onPageChange }) {
  if (pages <= 1) return null;

  const getPages = () => {
    const arr = [];
    const delta = 2;
    const left = Math.max(1, page - delta);
    const right = Math.min(pages, page + delta);
    if (left > 1) { arr.push(1); if (left > 2) arr.push('...'); }
    for (let i = left; i <= right; i++) arr.push(i);
    if (right < pages) { if (right < pages - 1) arr.push('...'); arr.push(pages); }
    return arr;
  };

  const btnBase = {
    width: 36, height: 36, display: 'flex', alignItems: 'center',
    justifyContent: 'center', borderRadius: 8, fontSize: '0.875rem',
    fontWeight: 500, cursor: 'pointer', border: '1px solid rgba(99,120,255,0.15)',
    transition: 'all 0.15s ease',
  };

  return (
    <div className="flex items-center justify-center gap-1.5 mt-4">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        style={{ ...btnBase, color: page === 1 ? '#334155' : '#94a3b8',
          background: 'transparent', cursor: page === 1 ? 'not-allowed' : 'pointer' }}
      >
        <ChevronLeft size={16} />
      </button>
      {getPages().map((p, i) =>
        p === '...' ? (
          <span key={`ellipsis-${i}`} style={{ color: '#475569', width: 36, textAlign: 'center' }}>…</span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            style={{
              ...btnBase,
              background: p === page ? 'linear-gradient(135deg,#6378ff,#818cf8)' : 'transparent',
              color: p === page ? '#fff' : '#64748b',
              borderColor: p === page ? 'transparent' : 'rgba(99,120,255,0.15)',
            }}
          >
            {p}
          </button>
        )
      )}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === pages}
        style={{ ...btnBase, color: page === pages ? '#334155' : '#94a3b8',
          background: 'transparent', cursor: page === pages ? 'not-allowed' : 'pointer' }}
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
