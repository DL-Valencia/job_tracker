import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import StatusBadge from '../components/StatusBadge';
import ConfirmDialog from '../components/ConfirmDialog';
import { Users, BarChart3, Trash2, Shield, User as UserIcon, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [usersRes, statsRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/stats'),
      ]);
      setUsers(usersRes.data.data);
      setStats(statsRes.data.data);
    } catch {
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRoleToggle = async (user) => {
    const newRole = user.role === 'super_admin' ? 'user' : 'super_admin';
    setActionLoading(true);
    try {
      await api.patch(`/admin/users/${user._id}/role`, { role: newRole });
      toast.success(`Role updated for ${user.name}`);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update role');
    } finally {
      setActionLoading(false);
    }
  };

  const openDelete = (user) => {
    setDeleteTarget(user);
    setConfirmOpen(true);
  };

  const handleDelete = async () => {
    setActionLoading(true);
    try {
      await api.delete(`/admin/users/${deleteTarget._id}`);
      toast.success('User and all their data deleted');
      setConfirmOpen(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete user');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f1e]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
            <Shield className="text-indigo-400" size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Control Panel</h1>
            <p className="text-slate-500 text-sm">System oversight and user management</p>
          </div>
        </div>

        {/* Global Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="glass-card p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Users size={24} />
              </div>
              <div>
                <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Total Users</p>
                <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
              </div>
            </div>
            <div className="glass-card p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <BarChart3 size={24} />
              </div>
              <div>
                <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Total Applications</p>
                <p className="text-3xl font-bold text-white">{stats.totalApplications}</p>
              </div>
            </div>
            <div className="glass-card p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400">
                <span className="text-xl font-bold">🎉</span>
              </div>
              <div>
                <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Total Offers</p>
                <p className="text-3xl font-bold text-white">{stats.statusBreakdown?.Offer || 0}</p>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-slate-800">
          <button
            onClick={() => setActiveTab('users')}
            className={`pb-3 px-2 text-sm font-medium transition-colors relative ${
              activeTab === 'users' ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            User Management
            {activeTab === 'users' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-400 rounded-full" />}
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`pb-3 px-2 text-sm font-medium transition-colors relative ${
              activeTab === 'analytics' ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            System Analytics
            {activeTab === 'analytics' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-400 rounded-full" />}
          </button>
        </div>

        {loading ? (
          <div className="py-20 flex justify-center">
            <LoadingSpinner size="lg" text="Fetching site data..." />
          </div>
        ) : activeTab === 'users' ? (
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-800/50">
                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">User</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Apps</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Joined</th>
                    <th className="text-right px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/30">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-indigo-500/[0.02] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
                            <UserIcon size={14} />
                          </div>
                          <div>
                            <p className="font-semibold text-white">{user.name}</p>
                            <p className="text-xs text-slate-500 flex items-center gap-1">
                              <Mail size={10} /> {user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-tighter ${
                          user.role === 'super_admin' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {user.role === 'super_admin' ? 'Super Admin' : 'User'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium">{user.applicationCount}</span>
                          <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-indigo-500"
                              style={{ width: `${Math.min(100, (user.applicationCount / 20) * 100)}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-400 text-xs">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleRoleToggle(user)}
                            className="p-2 rounded-lg hover:bg-indigo-500/10 text-indigo-400 transition-colors"
                            title={user.role === 'super_admin' ? 'Demote to User' : 'Promote to Admin'}
                            disabled={actionLoading}
                          >
                            <Shield size={16} />
                          </button>
                          <button
                            onClick={() => openDelete(user)}
                            className="p-2 rounded-lg hover:bg-red-500/10 text-red-400 transition-colors"
                            title="Delete User"
                            disabled={actionLoading}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6">
              <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                <BarChart3 className="text-indigo-400" size={18} />
                Application Status Distribution
              </h3>
              <div className="space-y-4">
                {['Applied', 'Interview', 'Rejected', 'Offer', 'Saved'].map((status) => {
                  const count = stats.statusBreakdown[status] || 0;
                  const pct = stats.totalApplications > 0 ? (count / stats.totalApplications) * 100 : 0;
                  return (
                    <div key={status}>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-slate-400">{status}</span>
                        <span className="text-white font-bold">{count} ({Math.round(pct)}%)</span>
                      </div>
                      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full"
                          style={{
                            width: `${pct}%`,
                            background: status === 'Offer' ? '#22c55e' : status === 'Rejected' ? '#ef4444' : '#6378ff'
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="glass-card p-6 flex flex-col items-center justify-center text-center gap-4">
              <div className="w-16 h-16 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                <Shield className="text-indigo-400" size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Platform Integrity</h3>
                <p className="text-slate-400 text-sm max-w-xs">
                  All system data is encrypted and monitored to ensure the best experience for all job seekers.
                </p>
              </div>
              <div className="px-4 py-2 rounded-full bg-slate-800 text-slate-400 text-xs font-mono">
                System Status: Operational
              </div>
            </div>
          </div>
        )}
      </main>

      <ConfirmDialog
        isOpen={confirmOpen}
        title="Permanently Delete User"
        message={`Are you absolutely sure you want to delete ${deleteTarget?.name}? All of their applications, interviews, and offers will be permanently erased.`}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
        loading={actionLoading}
      />
    </div>
  );
}
