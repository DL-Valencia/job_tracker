import { format } from 'date-fns';
import { Pencil, Trash2, ExternalLink, ChevronUp, ChevronDown, DollarSign, TrendingUp } from 'lucide-react';
import StatusBadge from './StatusBadge';
import LoadingSpinner from './LoadingSpinner';

const PLATFORM_ICONS = {
  LinkedIn: '💼',
  Indeed: '🔍',
  JobStreet: '🏢',
  Others: '🌐',
};

export default function ApplicationTable({
  applications,
  loading,
  onEdit,
  onDelete,
  sort,
  onSortChange,
}) {
  const SortIcon = ({ field }) => {
    if (sort !== field && sort !== `-${field}`) return <ChevronUp size={12} className="opacity-20" />;
    return sort.startsWith('-') ? (
      <ChevronDown size={12} className="text-indigo-400" />
    ) : (
      <ChevronUp size={12} className="text-indigo-400" />
    );
  };

  const handleSort = (field) => {
    if (sort === `-${field}`) onSortChange(field);
    else onSortChange(`-${field}`);
  };

  const cols = [
    { key: 'companyName', label: 'Company' },
    { key: 'jobTitle', label: 'Job Title' },
    { key: 'askingSalary', label: 'Asking' },
    { key: 'offeredSalaryRange', label: 'Offer Range' },
    { key: 'platform', label: 'Platform' },
    { key: 'status', label: 'Status' },
    { key: 'dateApplied', label: 'Applied' },
  ];

  if (loading) {
    return (
      <div className="glass-card p-16 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading applications..." />
      </div>
    );
  }

  if (!loading && applications.length === 0) {
    return (
      <div className="glass-card p-16 flex flex-col items-center justify-center gap-3 text-center">
        <div className="text-5xl">📋</div>
        <h3 className="text-slate-200 font-semibold text-lg">No applications found</h3>
        <p className="text-slate-500 text-sm max-w-xs">
          Try adjusting your filters or add your first job application.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(99,120,255,0.12)' }}>
              {cols.map((col) => (
                <th
                  key={col.key}
                  className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider cursor-pointer select-none"
                  style={{ color: '#64748b' }}
                  onClick={() => handleSort(col.key)}
                >
                  <span className="flex items-center gap-1 hover:text-slate-300 transition-colors">
                    {col.label}
                    <SortIcon field={col.key} />
                  </span>
                </th>
              ))}
              <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider" style={{ color: '#64748b' }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app, idx) => (
              <tr
                key={app._id}
                className="transition-colors duration-150"
                style={{
                  borderBottom: idx < applications.length - 1 ? '1px solid rgba(99,120,255,0.06)' : 'none',
                  background: 'transparent',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(99,120,255,0.04)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <td className="px-5 py-4">
                  <p className="font-semibold text-white">{app.companyName}</p>
                  {app.notes && (
                    <p className="text-xs text-slate-500 truncate max-w-[180px] mt-0.5">{app.notes}</p>
                  )}
                </td>
                <td className="px-5 py-4">
                  <p className="text-slate-200">{app.jobTitle}</p>
                  {app.jobLink && (
                    <a
                      href={app.jobLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-0.5 mt-0.5 w-fit transition-colors"
                    >
                      View posting <ExternalLink size={10} />
                    </a>
                  )}
                </td>
                <td className="px-5 py-4">
                  <span className="text-emerald-400 font-medium">{app.askingSalary ? `${app.currency || '₱'} ${app.askingSalary}` : '—'}</span>
                </td>
                <td className="px-5 py-4">
                  <span className="text-amber-400 font-medium">{app.offeredSalaryRange ? `${app.currency || '₱'} ${app.offeredSalaryRange}` : '—'}</span>
                </td>
                <td className="px-5 py-4">
                  <span className="flex items-center gap-1.5 text-slate-300 text-xs">
                    <span>{PLATFORM_ICONS[app.platform]}</span>
                    {app.platform}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <StatusBadge status={app.status} />
                </td>
                <td className="px-5 py-4 text-slate-400 text-xs whitespace-nowrap">
                  {app.dateApplied
                    ? format(new Date(app.dateApplied), 'MMM d, yyyy')
                    : '—'}
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      id={`btn-edit-${app._id}`}
                      onClick={() => onEdit(app)}
                      className="p-1.5 rounded-lg transition-all duration-150"
                      title="Edit"
                      style={{ color: '#818cf8', background: 'transparent' }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(99,120,255,0.12)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      id={`btn-delete-${app._id}`}
                      onClick={() => onDelete(app)}
                      className="p-1.5 rounded-lg transition-all duration-150"
                      title="Delete"
                      style={{ color: '#f87171', background: 'transparent' }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(239,68,68,0.1)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
