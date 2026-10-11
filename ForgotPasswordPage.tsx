import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowRight, AlertCircle, CheckCircle2, KeyRound } from 'lucide-react';
import { api } from '../../lib/api.ts';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [step, setStep] = useState<'request' | 'reset'>('request');

  const handleRequestToken = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      const res = await api.forgotPassword(email);
      setMessage({ type: 'success', text: res.message });
      if (res.resetToken) {
        setResetToken(res.resetToken);
        setStep('reset');
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to request reset.' });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetToken) return;
    setMessage(null);
    setLoading(true);

    try {
      const res = await api.resetPassword(resetToken, newPassword);
      setMessage({ type: 'success', text: res.message });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to reset password.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-[#E6DBFF] p-8 sm:p-10 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#F3EEFF] flex items-center justify-center text-[#3B2A6B] mx-auto shadow-xs">
            <KeyRound className="w-6 h-6 text-[#D4A017]" />
          </div>
          <h1 className="text-2xl font-black text-[#2A1B4E]">Reset Password</h1>
          <p className="text-xs text-[#6B5A99]">
            {step === 'request'
              ? 'Enter your registered email address to receive password reset authorization'
              : 'Enter your new password below'}
          </p>
        </div>

        {message && (
          <div
            className={`p-3.5 rounded-xl border text-xs flex items-start gap-2 ${
              message.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border-rose-200 text-rose-700'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {step === 'request' ? (
          <form onSubmit={handleRequestToken} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#3B2A6B] uppercase tracking-wider mb-1">
                Registered Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="e.g. rohit@careerpath.edu"
                className="w-full px-4 py-2.5 rounded-xl border border-[#D8CFEA] text-xs text-[#2A1B4E]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#D4A017] to-[#B3830E] hover:opacity-95 shadow-md flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Processing...' : 'Request Password Reset'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#3B2A6B] uppercase tracking-wider mb-1">
                New Password
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="Enter your new password"
                className="w-full px-4 py-2.5 rounded-xl border border-[#D8CFEA] text-xs text-[#2A1B4E]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#D4A017] to-[#B3830E] hover:opacity-95 shadow-md flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Updating Password...' : 'Save New Password'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        <div className="text-center text-xs text-[#6B5A99] pt-2 border-t border-[#F3EEFF]">
          Remember your password?{' '}
          <Link to="/login" className="font-bold text-[#3B2A6B] hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};
