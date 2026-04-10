import { AlertTriangle, X } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

export default function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel, loading }) {
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-6"
        style={{
          background: '#0f1629',
          border: '1px solid rgba(239,68,68,0.25)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
        }}
      >
        <div className="flex items-start gap-4">
          <div className="p-2 rounded-xl shrink-0" style={{ background: 'rgba(239,68,68,0.12)' }}>
            <AlertTriangle size={20} className="text-red-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-base">{title}</h3>
            <p className="text-slate-400 text-sm mt-1">{message}</p>
          </div>
        </div>
        <div className="flex gap-3 mt-6 justify-end">
          <button onClick={onCancel} className="btn-ghost" id="btn-confirm-cancel">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            id="btn-confirm-delete"
            className="btn-danger"
            style={{ padding: '0.6rem 1.2rem', fontSize: '0.875rem' }}
          >
            {loading ? <LoadingSpinner size="sm" /> : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
