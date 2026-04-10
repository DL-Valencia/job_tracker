import { Search, SlidersHorizontal, X } from 'lucide-react';

const PLATFORMS = ['LinkedIn', 'Indeed', 'JobStreet', 'Others'];
const STATUSES = ['Saved', 'Applied', 'Interview', 'Rejected', 'Offer'];

export default function SearchFilter({ filters, onChange, onReset }) {
  const hasActiveFilters =
    filters.search || filters.status || filters.platform || filters.dateFrom || filters.dateTo;

  return (
    <div className="glass-card p-4">
      <div className="flex flex-wrap gap-3 items-end">
        {/* Search */}
        <div className="flex-1 min-w-[200px]">
          <label className="form-label flex items-center gap-1">
            <Search size={12} /> Search
          </label>
          <div className="relative">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
            />
            <input
              id="search-input"
              type="text"
              value={filters.search}
              onChange={(e) => onChange('search', e.target.value)}
              placeholder="Company or job title..."
              className="form-input"
              style={{ paddingLeft: '2.2rem' }}
            />
          </div>
        </div>

        {/* Platform filter */}
        <div className="min-w-[140px]">
          <label className="form-label">Platform</label>
          <select
            id="filter-platform"
            className="form-input"
            value={filters.platform}
            onChange={(e) => onChange('platform', e.target.value)}
          >
            <option value="">All Platforms</option>
            {PLATFORMS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        {/* Status filter */}
        <div className="min-w-[140px]">
          <label className="form-label">Status</label>
          <select
            id="filter-status"
            className="form-input"
            value={filters.status}
            onChange={(e) => onChange('status', e.target.value)}
          >
            <option value="">All Statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Date From */}
        <div className="min-w-[140px]">
          <label className="form-label">From Date</label>
          <input
            id="filter-date-from"
            type="date"
            className="form-input"
            value={filters.dateFrom}
            onChange={(e) => onChange('dateFrom', e.target.value)}
            style={{ colorScheme: 'dark' }}
          />
        </div>

        {/* Date To */}
        <div className="min-w-[140px]">
          <label className="form-label">To Date</label>
          <input
            id="filter-date-to"
            type="date"
            className="form-input"
            value={filters.dateTo}
            onChange={(e) => onChange('dateTo', e.target.value)}
            style={{ colorScheme: 'dark' }}
          />
        </div>

        {/* Reset */}
        {hasActiveFilters && (
          <button
            id="btn-reset-filters"
            onClick={onReset}
            className="btn-ghost flex items-center gap-1.5"
            style={{ alignSelf: 'flex-end' }}
          >
            <X size={14} /> Reset
          </button>
        )}
      </div>
    </div>
  );
}
