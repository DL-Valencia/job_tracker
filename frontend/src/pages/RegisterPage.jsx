import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Mail, Lock, User, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Full name is required';
    if (!form.email) errs.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Enter a valid email address';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    const result = await register(form.name, form.email, form.password);
    if (result.success) {
      toast.success('Account created! Welcome aboard 🎉');
      navigate('/');
    } else {
      toast.error(result.message);
    }
  };

  const set = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
    setErrors({ ...errors, [field]: '' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(99,120,255,0.12) 0%, transparent 70%), #0a0f1e' }}>
      <div className="fixed top-20 right-10 w-64 h-64 rounded-full opacity-5 pointer-events-none" style={{ background: '#a78bfa', filter: 'blur(100px)' }} />
      <div className="fixed bottom-20 left-10 w-64 h-64 rounded-full opacity-5 pointer-events-none" style={{ background: '#38bdf8', filter: 'blur(100px)' }} />

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl text-2xl font-bold mb-4" style={{ background: 'linear-gradient(135deg,#6378ff,#a78bfa)' }}>J</div>
          <h1 className="text-3xl font-bold gradient-text">JobTrackr</h1>
          <p className="text-slate-500 text-sm mt-1">Create your free account</p>
        </div>

        <div className="glass-card p-8">
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Name */}
            <div>
              <label htmlFor="reg-name" className="form-label flex items-center gap-1.5"><User size={12} /> Full Name</label>
              <input id="reg-name" type="text" autoComplete="name" className="form-input" placeholder="John Doe" value={form.name} onChange={set('name')} />
              {errors.name && <p className="form-error">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="reg-email" className="form-label flex items-center gap-1.5"><Mail size={12} /> Email Address</label>
              <input id="reg-email" type="email" autoComplete="email" className="form-input" placeholder="you@example.com" value={form.email} onChange={set('email')} />
              {errors.email && <p className="form-error">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="reg-password" className="form-label flex items-center gap-1.5"><Lock size={12} /> Password</label>
              <div className="relative">
                <input
                  id="reg-password"
                  type={showPass ? 'text' : 'password'}
                  autoComplete="new-password"
                  className="form-input"
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={set('password')}
                  style={{ paddingRight: '2.8rem' }}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors" tabIndex={-1}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="form-error">{errors.password}</p>}
            </div>

            {/* Confirm */}
            <div>
              <label htmlFor="reg-confirm" className="form-label flex items-center gap-1.5"><Lock size={12} /> Confirm Password</label>
              <input id="reg-confirm" type={showPass ? 'text' : 'password'} autoComplete="new-password" className="form-input" placeholder="Re-enter your password" value={form.confirmPassword} onChange={set('confirmPassword')} />
              {errors.confirmPassword && <p className="form-error">{errors.confirmPassword}</p>}
            </div>

            <button id="btn-register" type="submit" className="btn-primary w-full justify-center py-3 mt-2" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : (
                <><UserPlus size={16} /> Create Account</>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors no-underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
