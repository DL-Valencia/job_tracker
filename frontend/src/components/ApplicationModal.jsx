import { useState, useEffect } from 'react';
import { X, Calendar, Globe, Briefcase, FileText, Link as LinkIcon } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

const PLATFORMS = ['LinkedIn', 'Indeed', 'JobStreet', 'Others'];
const STATUSES = ['Saved', 'Applied', 'Interview', 'Rejected', 'Offer'];

export default function ApplicationModal({ isOpen, onClose, onSubmit, editData, loading }) {
  const [form, setForm] = useState({
    companyName: '',
    jobTitle: '',
    jobLink: '',
    platform: 'LinkedIn',
    status: 'Applied',
    dateApplied: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editData) {
      setForm({
        companyName: editData.companyName || '',
        jobTitle: editData.jobTitle || '',
        jobLink: editData.jobLink || '',
        platform: editData.platform || 'LinkedIn',
        status: editData.status || 'Applied',
        dateApplied: editData.dateApplied ? new Date(editData.dateApplied).toISOString().split('T')[0] : '',
        notes: editData.notes || '',
      });
    } else {
      setForm({
        companyName: '',
        jobTitle: '',
        jobLink: '',
        platform: 'LinkedIn',
        status: 'Applied',
        dateApplied: new Date().toISOString().split('T')[0],
        notes: '',
      });
    }
    setErrors({});
  }, [editData, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (!form.companyName.trim()) newErrors.companyName = 'Company name is required';
    if (!form.jobTitle.trim()) newErrors.jobTitle = 'Job title is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(form);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}>
      <div className="w-full max-w-lg glass-card p-0 overflow-hidden" style={{ maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800/50 flex items-center justify-between bg-indigo-500/5">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            {editData ? 'Edit Application' : 'Add New Application'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto custom-scrollbar space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Company */}
            <div className="col-span-2 sm:col-span-1">
              <label className="form-label flex items-center gap-1.5"><Briefcase size={14} /> Company Name</label>
              <input
                name="companyName"
                value={form.companyName}
                onChange={handleChange}
                placeholder="Google, Meta, etc."
                className="form-input"
                id="input-company-name"
              />
              {errors.companyName && <p className="form-error">{errors.companyName}</p>}
            </div>

            {/* Title */}
            <div className="col-span-2 sm:col-span-1">
              <label className="form-label flex items-center gap-1.5"><FileText size={14} /> Job Title</label>
              <input
                name="jobTitle"
                value={form.jobTitle}
                onChange={handleChange}
                placeholder="Software Engineer"
                className="form-input"
                id="input-job-title"
              />
              {errors.jobTitle && <p className="form-error">{errors.jobTitle}</p>}
            </div>

            {/* Platform */}
            <div className="col-span-1">
              <label className="form-label flex items-center gap-1.5"><Globe size={14} /> Platform</label>
              <select name="platform" value={form.platform} onChange={handleChange} className="form-input" id="select-platform">
                {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            {/* Status */}
            <div className="col-span-1">
              <label className="form-label flex items-center gap-1.5">🎯 Current Status</label>
              <select name="status" value={form.status} onChange={handleChange} className="form-input" id="select-status">
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* Date Applied */}
            <div className="col-span-1">
              <label className="form-label flex items-center gap-1.5"><Calendar size={14} /> Date Applied</label>
              <input
                type="date"
                name="dateApplied"
                value={form.dateApplied}
                onChange={handleChange}
                className="form-input"
                id="input-date-applied"
              />
            </div>

            {/* Job Link */}
            <div className="col-span-2 sm:col-span-1">
              <label className="form-label flex items-center gap-1.5"><LinkIcon size={14} /> Job Link (Optional)</label>
              <input
                name="jobLink"
                value={form.jobLink}
                onChange={handleChange}
                placeholder="https://linkedin.com/jobs/..."
                className="form-input"
                id="input-job-link"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="form-label">Notes (Optional)</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Salary range, key requirements, etc."
              rows={3}
              className="form-input resize-none"
              id="input-notes"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button type="submit" disabled={loading} className="btn-primary w-full py-3 justify-center text-base" id="btn-submit-application">
              {loading ? <LoadingSpinner size="sm" /> : editData ? 'Update Application' : 'Add Application'}
            </button>
            <button type="button" onClick={onClose} className="btn-ghost w-full py-3 justify-center text-base" id="btn-close-modal">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
