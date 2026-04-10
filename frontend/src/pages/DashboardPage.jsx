import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { applicationsAPI } from '../services/api';
import Navbar from '../components/Navbar';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import { format } from 'date-fns';
import { ArrowRight, Plus, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';
import ApplicationModal from '../components/ApplicationModal';

const STAT_CONFIG = [
  { key: 'total', label: 'Total Applications', icon: '📊', color: '#6378ff' },
  { key: 'Applied', label: 'Applied', icon: '📤', color: '#3b82f6' },
  { key: 'Interview', label: 'Interviews', icon: '🎯', color: '#eab308' },
  { key: 'Offer', label: 'Offers', icon: '🎉', color: '#22c55e' },
  { key: 'Rejected', label: 'Rejected', icon: '❌', color: '#ef4444' },
  { key: 'Saved', label: 'Saved', icon: '🔖', color: '#a855f7' },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState({ applications: [], metrics: null });
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const res = await applicationsAPI.getAll({ limit: 5, sort: '-createdAt' });
      setData({
        applications: res.data.data,
        metrics: res.data.metrics,
      });
    } catch {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

  const handleCreate = async (form) => {
    setSubmitting(true);
    try {
      await applicationsAPI.create(form);
      toast.success('Application added! 🎉');
      setModalOpen(false);
      fetchDashboard();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create application');
    } finally {
      setSubmitting(false);
    }
  };

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="min-h-screen" style={{ background: '#0a0f1e' }}>
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
          <div>
            <p className="text-slate-400 text-sm mb-1">{getGreeting()},</p>
            <h1 className="text-3xl font-bold text-white">
              {user?.name?.split(' ')[0]} 👋
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Here's your job search overview
            </p>
          </div>
          <button onClick={() => setModalOpen(true)} className="btn-primary" id="btn-add-from-dashboard">
            <Plus size={16} /> Add Application
          </button>
        </div>

        {/* Stats */}
        {loading ? (
          <div className="h-40 flex items-center justify-center">
            <LoadingSpinner size="lg" text="Loading your dashboard..." />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
              {STAT_CONFIG.map((s) => (
                <StatCard
                  key={s.key}
                  icon={s.icon}
                  label={s.label}
                  value={data.metrics?.[s.key] ?? 0}
                  color={s.color}
                />
              ))}
            </div>

            {/* Success rate banner */}
            {data.metrics && data.metrics.total > 0 && (
              <div
                className="glass-card p-4 mb-8 flex items-center gap-4"
                style={{ borderColor: 'rgba(34,197,94,0.2)' }}
              >
                <div className="p-2 rounded-xl" style={{ background: 'rgba(34,197,94,0.12)' }}>
                  <TrendingUp size={20} className="text-green-400" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">Offer Rate</p>
                  <p className="text-slate-400 text-xs">
                    {data.metrics.Applied + data.metrics.Interview + data.metrics.Offer + data.metrics.Rejected > 0
                      ? `${Math.round((data.metrics.Offer / data.metrics.total) * 100)}% of your applications resulted in offers`
                      : 'Keep applying — your offer is coming!'}
                  </p>
                </div>
                <div className="ml-auto">
                  <span className="text-2xl font-bold text-green-400">{data.metrics.Offer}</span>
                  <span className="text-slate-500 text-xs ml-1">offer{data.metrics.Offer !== 1 ? 's' : ''}</span>
                </div>
              </div>
            )}

            {/* Recent Applications */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">Recent Applications</h2>
                <Link
                  to="/applications"
                  className="flex items-center gap-1 text-sm text-indigo-400 hover:text-indigo-300 transition-colors no-underline"
                >
                  View all <ArrowRight size={14} />
                </Link>
              </div>

              {data.applications.length === 0 ? (
                <div className="glass-card p-12 flex flex-col items-center gap-3 text-center">
                  <span className="text-5xl">🗂️</span>
                  <h3 className="text-white font-semibold">No applications yet</h3>
                  <p className="text-slate-500 text-sm">Start tracking your job hunt by adding your first application</p>
                  <button onClick={() => setModalOpen(true)} className="btn-primary mt-2">
                    <Plus size={15} /> Add your first application
                  </button>
                </div>
              ) : (
                <div className="glass-card overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr style={{ borderBottom: '1px solid rgba(99,120,255,0.1)' }}>
                          {['Company', 'Job Title', 'Platform', 'Status', 'Date'].map((h) => (
                            <th key={h} className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: '#64748b' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {data.applications.map((app, idx) => (
                          <tr
                            key={app._id}
                            style={{ borderBottom: idx < data.applications.length - 1 ? '1px solid rgba(99,120,255,0.06)' : 'none' }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(99,120,255,0.04)')}
                            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                          >
                            <td className="px-5 py-3.5 font-medium text-white">{app.companyName}</td>
                            <td className="px-5 py-3.5 text-slate-300">{app.jobTitle}</td>
                            <td className="px-5 py-3.5 text-slate-400">{app.platform}</td>
                            <td className="px-5 py-3.5"><StatusBadge status={app.status} /></td>
                            <td className="px-5 py-3.5 text-slate-400 text-xs whitespace-nowrap">
                              {app.dateApplied ? format(new Date(app.dateApplied), 'MMM d, yyyy') : '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </main>

      <ApplicationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreate}
        loading={submitting}
      />
    </div>
  );
}
