import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { api } from '../../lib/api.ts';
import { signInWithGoogle } from '../../lib/firebase.ts';

interface AdminLoginPageProps {
  onLoginSuccess: (res: any) => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleGoogleAdminLogin = async () => {
    setErrorMsg(null);
    setGoogleLoading(true);
    try {
      const fbUser = await signInWithGoogle();
      if (!fbUser.email) {
        throw new Error('Google account must have an email address.');
      }
      const res = await api.firebaseLogin(fbUser.uid, fbUser.email, fbUser.displayName || fbUser.email.split('@')[0]);
      if (res.user.role !== 'admin') {
        setErrorMsg(`Account ${fbUser.email} is registered as a student. Administrator privileges are reserved for faculty & verified admins.`);
        return;
      }
      onLoginSuccess(res);
      navigate('/admin');
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Firebase Google Sign-In failed.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const res = await api.login(email, password);
      if (res.user.role !== 'admin') {
        setErrorMsg('Access denied: Account does not have administrator privileges.');
        return;
      }
      onLoginSuccess(res);
      navigate('/admin');
    } catch (err: any) {
      setErrorMsg(err.message || 'Administrator authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAdmin = () => {
    setEmail('admin@careerpath.edu');
    setPassword('admin123');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-[#E6DBFF] p-8 sm:p-10 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#3B2A6B] flex items-center justify-center text-white mx-auto shadow-xs">
            <Shield className="w-6 h-6 text-[#F2C94C]" />
          </div>
          <h1 className="text-2xl font-black text-[#2A1B4E]">Administrator Portal</h1>
          <p className="text-xs text-[#6B5A99]">
            University Training & Placement Officer (TPO) Management
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#3B2A6B] uppercase tracking-wider mb-1">
              Admin Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="e.g. admin@careerpath.edu"
              className="w-full px-4 py-2.5 rounded-xl border border-[#D8CFEA] text-xs text-[#2A1B4E]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#3B2A6B] uppercase tracking-wider mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full px-4 py-2.5 rounded-xl border border-[#D8CFEA] text-xs text-[#2A1B4E]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-xs font-bold text-white bg-[#3B2A6B] hover:bg-[#2A1B4E] shadow-md flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Authenticating...' : 'Enter Admin Console'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Firebase Google Auth */}
        <div className="space-y-3">
          <div className="relative flex items-center justify-center">
            <div className="border-t border-[#E6DBFF] w-full"></div>
            <span className="bg-white px-3 text-[11px] font-semibold text-[#8E68CD] uppercase tracking-wider relative">
              Or sign in with
            </span>
          </div>

          <button
            type="button"
            onClick={handleGoogleAdminLogin}
            disabled={googleLoading}
            className="w-full py-2.5 px-4 rounded-xl border border-[#D8CFEA] bg-white hover:bg-[#F3EEFF] text-xs font-bold text-[#2A1B4E] flex items-center justify-center gap-3 transition-colors shadow-2xs"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{googleLoading ? 'Verifying with Google...' : 'Sign In with Google (Admin)'}</span>
          </button>
        </div>

        <div className="pt-2 border-t border-[#F3EEFF]">
          <button
            type="button"
            onClick={fillDemoAdmin}
            className="w-full py-2.5 rounded-xl text-xs font-semibold text-[#3B2A6B] bg-[#F3EEFF] hover:bg-[#E6DBFF] transition-colors flex items-center justify-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D4A017]" />
            <span>Fill Demo Admin (Dr. K. Sharma)</span>
          </button>
        </div>

        <div className="text-center text-xs text-[#6B5A99] pt-2">
          Are you a student?{' '}
          <Link to="/login" className="font-bold text-[#3B2A6B] hover:underline">
            Go to Student Login
          </Link>
        </div>
      </div>
    </div>
  );
};
