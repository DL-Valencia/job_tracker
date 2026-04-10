import { useState, useEffect, useCallback, useRef } from 'react';
import { applicationsAPI } from '../services/api';
import Navbar from '../components/Navbar';
import ApplicationTable from '../components/ApplicationTable';
import ApplicationModal from '../components/ApplicationModal';
import ConfirmDialog from '../components/ConfirmDialog';
import SearchFilter from '../components/SearchFilter';
import Pagination from '../components/Pagination';
import { Plus, Download } from 'lucide-react';
import toast from 'react-hot-toast';

const DEFAULT_FILTERS = {
  search: '',
  platform: '',
  status: '',
  dateFrom: '',
  dateTo: '',
};

export default function ApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [metrics, setMetrics] = useState({});
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0, limit: 10 });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [sort, setSort] = useState('-createdAt');
  const [page, setPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Debounce search
  const searchTimer = useRef(null);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setDebouncedSearch(filters.search);
      setPage(1);
    }, 400);
    return () => clearTimeout(searchTimer.current);
  }, [filters.search]);

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 10,
        sort,
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(filters.platform && { platform: filters.platform }),
        ...(filters.status && { status: filters.status }),
        ...(filters.dateFrom && { dateFrom: filters.dateFrom }),
        ...(filters.dateTo && { dateTo: filters.dateTo }),
      };
      const res = await applicationsAPI.getAll(params);
      setApplications(res.data.data);
      setMetrics(res.data.metrics);
      setPagination(res.data.pagination);
    } catch {
      toast.error('Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  }, [page, sort, debouncedSearch, filters.platform, filters.status, filters.dateFrom, filters.dateTo]);

  useEffect(() => { fetchApplications(); }, [fetchApplications]);

  // ── Filter handlers ────────────────────────────────────────────────────────
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    if (key !== 'search') setPage(1);
  };

  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setPage(1);
  };

  // ── CRUD handlers ──────────────────────────────────────────────────────────
  const openCreate = () => { setEditData(null); setModalOpen(true); };
  const openEdit = (app) => { setEditData(app); setModalOpen(true); };

  const handleSubmit = async (form) => {
    setSubmitting(true);
    try {
      if (editData) {
        await applicationsAPI.update(editData._id, form);
        toast.success('Application updated ✅');
      } else {
        await applicationsAPI.create(form);
        toast.success('Application added 🎉');
      }
      setModalOpen(false);
      setEditData(null);
      fetchApplications();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  const openDelete = (app) => { setDeleteTarget(app); setConfirmOpen(true); };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await applicationsAPI.delete(deleteTarget._id);
      toast.success('Application deleted');
      setConfirmOpen(false);
      setDeleteTarget(null);
      fetchApplications();
    } catch {
      toast.error('Failed to delete application');
    } finally {
      setDeleting(false);
    }
  };

  // ── CSV Export ─────────────────────────────────────────────────────────────
  const exportCSV = () => {
    if (applications.length === 0) { toast.error('No data to export'); return; }
    const headers = ['Company', 'Job Title', 'Platform', 'Status', 'Date Applied', 'Job Link', 'Notes'];
    const rows = applications.map((a) => [
      `"${a.companyName}"`,
      `"${a.jobTitle}"`,
      a.platform,
      a.status,
      a.dateApplied ? new Date(a.dateApplied).toLocaleDateString() : '',
      a.jobLink || '',
      `"${(a.notes || '').replace(/"/g, '""')}"`,
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `job-applications-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Exported to CSV');
  };

  return (
    <div className="min-h-screen" style={{ background: '#0a0f1e' }}>
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-white">My Applications</h1>
            <p className="text-slate-500 text-sm mt-0.5">
              {loading ? '...' : `${metrics?.total ?? 0} total application${metrics?.total !== 1 ? 's' : ''}`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              id="btn-export-csv"
              onClick={exportCSV}
              className="btn-ghost"
              title="Export visible applications as CSV"
            >
              <Download size={15} /> Export CSV
            </button>
            <button id="btn-open-add-modal" onClick={openCreate} className="btn-primary">
              <Plus size={16} /> Add Application
            </button>
          </div>
        </div>

        {/* Status Quick Filter Pills */}
        <div className="flex flex-wrap gap-2 mb-5">
          {[
            { label: 'All', value: '', color: '#6378ff' },
            { label: '📤 Applied', value: 'Applied', color: '#3b82f6' },
            { label: '🎯 Interview', value: 'Interview', color: '#eab308' },
            { label: '🎉 Offer', value: 'Offer', color: '#22c55e' },
            { label: '❌ Rejected', value: 'Rejected', color: '#ef4444' },
            { label: '🔖 Saved', value: 'Saved', color: '#a855f7' },
          ].map((pill) => {
            const active = filters.status === pill.value;
            return (
              <button
                key={pill.value}
                id={`pill-${pill.value || 'all'}`}
                onClick={() => handleFilterChange('status', pill.value)}
                style={{
                  padding: '0.35rem 0.9rem',
                  borderRadius: 999,
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  border: `1px solid ${active ? pill.color : 'rgba(99,120,255,0.15)'}`,
                  background: active ? pill.color + '22' : 'transparent',
                  color: active ? pill.color : '#64748b',
                  transition: 'all 0.15s ease',
                }}
              >
                {pill.label}
                {pill.value && metrics?.[pill.value] !== undefined && (
                  <span
                    className="ml-1.5 px-1.5 py-0 rounded-full text-xs"
                    style={{ background: active ? pill.color + '33' : 'rgba(99,120,255,0.1)', color: active ? pill.color : '#475569' }}
                  >
                    {metrics[pill.value]}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Search + Advanced Filters */}
        <div className="mb-5">
          <SearchFilter
            filters={filters}
            onChange={handleFilterChange}
            onReset={handleResetFilters}
          />
        </div>

        {/* Results count */}
        {!loading && (
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Showing {applications.length} of {pagination.total} result{pagination.total !== 1 ? 's' : ''}
              {pagination.pages > 1 && ` — Page ${pagination.page} of ${pagination.pages}`}
            </p>
          </div>
        )}

        {/* Table */}
        <ApplicationTable
          applications={applications}
          loading={loading}
          onEdit={openEdit}
          onDelete={openDelete}
          sort={sort}
          onSortChange={setSort}
        />

        {/* Pagination */}
        <Pagination page={pagination.page} pages={pagination.pages} onPageChange={setPage} />
      </main>

      {/* Modals */}
      <ApplicationModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditData(null); }}
        onSubmit={handleSubmit}
        editData={editData}
        loading={submitting}
      />
      <ConfirmDialog
        isOpen={confirmOpen}
        title="Delete Application"
        message={`Are you sure you want to delete "${deleteTarget?.companyName} – ${deleteTarget?.jobTitle}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => { setConfirmOpen(false); setDeleteTarget(null); }}
        loading={deleting}
      />
    </div>
  );
}
