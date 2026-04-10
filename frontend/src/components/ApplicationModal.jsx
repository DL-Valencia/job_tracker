import { useState, useEffect } from 'react';
import { X, Briefcase, Building2, Link2, FileText, AlignLeft, Calendar, Tag } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

const PLATFORMS = ['LinkedIn', 'Indeed', 'JobStreet', 'Others'];
const STATUSES = ['Saved', 'Applied', 'Interview', 'Rejected', 'Offer'];

const EMPTY_FORM = {
  companyName: '',
  jobTitle: '',
  jobDescription: '',
  jobLink: '',
  platform: 'LinkedIn',
  status: 'Applied',
  dateApplied: new Date().toISOString().split('T')[0],
  notes: '',
};

export default function ApplicationModal({ isOpen, onClose, onSubmit, editData, loading }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editData) {
      setForm({
        companyName: editData.companyName || '',
        jobTitle: editData.jobTitle || '',
        jobDescription: editData.jobDescription || '',
        jobLink: editData.jobLink || '',
        platform: editData.platform || 'LinkedIn',
        status: editData.status || 'Applied',
        dateApplied: editData.dateApplied
          ? new Date(editData.dateApplied).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        notes: editData.notes || '',
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setErrors({});
  }, [editData, isOpen]);

  const validate = () => {
    const errs = {};
    if (!form.companyName.trim()) errs.companyName = 'Company name is required';
    if (!form.jobTitle.trim()) errs.jobTitle = 'Job title is required';
    if (!form.platform) errs.platform = 'Platform is required';
    if (form.jobLink && !/^https?:\/\/.+/.test(form.jobLink))
      errs.jobLink = 'Must be a valid URL (http/https)';
    return errs;
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    onSubmit(form);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl"
        style={{
          background: '#0f1629',
          border: '1px solid rgba(99,120,255,0.2)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: '1px solid rgba(99,120,255,0.12)' }}
        >
          <div>
            <h2 className="text-lg font-bold text-white">
              {editData ? 'Edit Application' : 'Add Application'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {editData ? 'Update the application details below' : 'Fill in the details of your job application'}
            </p>
          </div>
          <button
            id="btn-close-modal"
            onClick={onClose}
            className="p-2 rounded-lg transition-colors"
            style={{ color: '#64748b' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#e2e8f0'; e.currentTarget.style.background = 'rgba(99,120,255,0.1)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.background = 'transparent'; }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Row 1: Company + Job Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label flex items-center gap-1.5">
                <Building2 size={12} /> Company Name *
              </label>
              <input
                id="field-companyName"
                type="text"
                className="form-input"
                placeholder="e.g. Google, Microsoft"
                value={form.companyName}
                onChange={(e) => handleChange('companyName', e.target.value)}
              />
              {errors.companyName && <p className="form-error">{errors.companyName}</p>}
            </div>
            <div>
              <label className="form-label flex items-center gap-1.5">
                <Briefcase size={12} /> Job Title *
              </label>
              <input
                id="field-jobTitle"
                type="text"
                className="form-input"
                placeholder="e.g. Senior Frontend Developer"
                value={form.jobTitle}
                onChange={(e) => handleChange('jobTitle', e.target.value)}
              />
              {errors.jobTitle && <p className="form-error">{errors.jobTitle}</p>}
            </div>
          </div>

          {/* Row 2: Platform + Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label flex items-center gap-1.5">
                <Tag size={12} /> Platform *
              </label>
              <select
                id="field-platform"
                className="form-input"
                value={form.platform}
                onChange={(e) => handleChange('platform', e.target.value)}
              >
                {PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
              {errors.platform && <p className="form-error">{errors.platform}</p>}
            </div>
            <div>
              <label className="form-label flex items-center gap-1.5">
                <Tag size={12} /> Status
              </label>
              <select
                id="field-status"
                className="form-input"
                value={form.status}
                onChange={(e) => handleChange('status', e.target.value)}
              >
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Row 3: Date + Job Link */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label flex items-center gap-1.5">
                <Calendar size={12} /> Date Applied
              </label>
              <input
                id="field-dateApplied"
                type="date"
                className="form-input"
                value={form.dateApplied}
                onChange={(e) => handleChange('dateApplied', e.target.value)}
                style={{ colorScheme: 'dark' }}
              />
            </div>
            <div>
              <label className="form-label flex items-center gap-1.5">
                <Link2 size={12} /> Job Link
              </label>
              <input
                id="field-jobLink"
                type="url"
                className="form-input"
                placeholder="https://..."
                value={form.jobLink}
                onChange={(e) => handleChange('jobLink', e.target.value)}
              />
              {errors.jobLink && <p className="form-error">{errors.jobLink}</p>}
            </div>
          </div>

          {/* Job Description */}
          <div>
            <label className="form-label flex items-center gap-1.5">
              <AlignLeft size={12} /> Job Description
            </label>
            <textarea
              id="field-jobDescription"
              className="form-input"
              rows={3}
              placeholder="Paste the job description here..."
              value={form.jobDescription}
              onChange={(e) => handleChange('jobDescription', e.target.value)}
              style={{ resize: 'vertical', minHeight: '80px' }}
            />
          </div>

          {/* Notes */}
          <div>
            <label className="form-label flex items-center gap-1.5">
              <FileText size={12} /> Notes <span className="opacity-50">(optional)</span>
            </label>
            <textarea
              id="field-notes"
              className="form-input"
              rows={2}
              placeholder="Any personal notes, contact info, etc."
              value={form.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              style={{ resize: 'vertical', minHeight: '60px' }}
            />
          </div>

          {/* Footer */}
          <div
            className="flex items-center justify-end gap-3 pt-2"
            style={{ borderTop: '1px solid rgba(99,120,255,0.1)' }}
          >
            <button type="button" onClick={onClose} className="btn-ghost" id="btn-cancel-modal">
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading} id="btn-submit-modal">
              {loading ? (
                <LoadingSpinner size="sm" />
              ) : editData ? (
                'Save Changes'
              ) : (
                'Add Application'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
