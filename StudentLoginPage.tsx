import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, ArrowRight, AlertCircle, Shield, Sparkles } from 'lucide-react';
import { api } from '../../lib/api.ts';
import { signInWithGoogle } from '../../lib/firebase.ts';

interface StudentLoginPageProps {
  onLoginSuccess: (res: any) => void;
}

export const StudentLoginPage: React.FC<StudentLoginPageProps> = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setGoogleLoading(true);
    try {
      const fbUser = await signInWithGoogle();
      if (!fbUser.email) {
        throw new Error('Google account must have an email address.');
      }
      const res = await api.firebaseLogin(fbUser.uid, fbUser.email, fbUser.displayName || fbUser.email.split('@')[0]);
      onLoginSuccess(res);
      if (!res.profile || !res.profile.onboarded) {
        navigate('/onboarding');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Firebase Google Sign-In failed. Please try again.');
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
      onLoginSuccess(res);
      if (!res.profile || !res.profile.onboarded) {
        navigate('/onboarding');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoStudent = () => {
    setEmail('rohit@careerpath.edu');
    setPassword('student123');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-[#E6DBFF] p-8 sm:p-10 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#3B2A6B] to-[#51368F] flex items-center justify-center text-white mx-auto shadow-xs">
            <Compass className="w-6 h-6 text-[#F2C94C]" />
          </div>
          <h1 className="text-2xl font-black text-[#2A1B4E]">Student Login</h1>
          <p className="text-xs text-[#6B5A99]">
            Access your personalized engineering roadmap & verified progress
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
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="e.g. rohit@careerpath.edu"
              className="w-full px-4 py-2.5 rounded-xl border border-[#D8CFEA] focus:border-[#8E68CD] focus:ring-2 focus:ring-[#E6DBFF] text-xs text-[#2A1B4E]"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-[#3B2A6B] uppercase tracking-wider">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-[11px] font-semibold text-[#8E68CD] hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-2.5 rounded-xl border border-[#D8CFEA] focus:border-[#8E68CD] focus:ring-2 focus:ring-[#E6DBFF] text-xs text-[#2A1B4E]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#D4A017] to-[#B3830E] hover:opacity-95 shadow-md flex items-center justify-center gap-2 transition-all transform active:scale-95"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Firebase Google Auth */}
        <div className="space-y-3">
          <div className="relative flex items-center justify-center">
            <div className="border-t border-[#E6DBFF] w-full"></div>
            <span className="bg-white px-3 text-[11px] font-semibold text-[#8E68CD] uppercase tracking-wider relative">
              Or continue with
            </span>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
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
            <span>{googleLoading ? 'Signing in with Google...' : 'Sign In with Google (Firebase)'}</span>
          </button>
        </div>

        {/* 1-Click Demo Fill */}
        <div className="pt-2 border-t border-[#F3EEFF]">
          <button
            type="button"
            onClick={fillDemoStudent}
            className="w-full py-2.5 rounded-xl text-xs font-semibold text-[#805E00] bg-[#FFFDF5] border border-[#F2C94C]/70 hover:bg-[#FFFBEA] transition-colors flex items-center justify-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D4A017]" />
            <span>Use Demo Student Account (Rohit)</span>
          </button>
        </div>

        <div className="text-center text-xs text-[#6B5A99] pt-2">
          Don't have an account yet?{' '}
          <Link to="/signup" className="font-bold text-[#3B2A6B] hover:underline">
            Register as a Student
          </Link>
        </div>
      </div>
    </div>
  );
};
