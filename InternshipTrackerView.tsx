import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  CheckCircle2,
  Clock,
  ExternalLink,
  Plus,
  Building,
  ShieldCheck,
  Calendar,
  Filter,
  Layers,
  Award,
  Home
} from 'lucide-react';
import { InternshipOpportunity, InternshipApplication, UserScoreStreak } from '../types/index.ts';
import { api } from '../lib/api.ts';
import { useFirebase } from '../context/FirebaseContext.tsx';

interface InternshipTrackerViewProps {
  score: UserScoreStreak;
  onApplicationVerified: (res: any) => void;
}

export const InternshipTrackerView: React.FC<InternshipTrackerViewProps> = ({
  score,
  onApplicationVerified
}) => {
  const { saveApplication } = useFirebase();
  const [activeTab, setActiveTab] = useState<'opportunities' | 'pipeline'>('opportunities');
  const [opportunities, setOpportunities] = useState<InternshipOpportunity[]>([]);
  const [applications, setApplications] = useState<InternshipApplication[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal to log new application
  const [showLogModal, setShowLogModal] = useState(false);
  const [compName, setCompName] = useState('');
  const [roleTitle, setRoleTitle] = useState('');
  const [appliedDate, setAppliedDate] = useState(new Date().toISOString().split('T')[0]);
  const [appStatus, setAppStatus] = useState<string>('Applied');
  const [appNotes, setAppNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [oppRes, appRes] = await Promise.all([
        api.getOpportunities(),
        api.getApplications()
      ]);
      setOpportunities(oppRes.opportunities);
      setApplications(appRes.applications);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!compName || !roleTitle) {
      setErrorMsg('Please specify company name and role.');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await api.verifyInternship({
        company: compName,
        role: roleTitle,
        appliedDate,
        status: appStatus,
        notes: appNotes,
        taskId: 'task-y3-03'
      });

      // Synchronize directly with Firestore
      if (res.application) {
        await saveApplication(res.application).catch(err => console.warn('Firestore app sync:', err));
      }

      setShowLogModal(false);
      setCompName('');
      setRoleTitle('');
      setAppNotes('');
      await loadData();
      onApplicationVerified(res);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to record application.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStatus = async (appId: string, newStatus: string) => {
    try {
      await api.updateApplication(appId, newStatus);
      const targetApp = applications.find(a => a.id === appId);
      if (targetApp) {
        await saveApplication({ ...targetApp, status: newStatus as any }).catch(err => console.warn('Firestore app sync:', err));
      }
      await loadData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Breadcrumb & Home Link */}
      <div className="flex items-center justify-between pb-1">
        <nav className="flex items-center gap-2 text-xs text-[#7D6B9E]">
          <Link
            to="/"
            className="flex items-center gap-1 hover:text-[#2A1B4E] transition-colors"
            title="Public Home Page"
          >
            <Home className="w-3.5 h-3.5 text-[#8E68CD]" />
            <span>Home</span>
          </Link>
          <span className="text-[#C8BEDD]">/</span>
          <Link to="/dashboard" className="hover:text-[#2A1B4E] transition-colors">
            Dashboard
          </Link>
          <span className="text-[#C8BEDD]">/</span>
          <span className="font-semibold text-[#2A1B4E]">Internship Tracker</span>
        </nav>

        <Link
          to="/"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#E6DBFF] text-xs font-semibold text-[#6540AB] hover:bg-[#F3EEFF] transition-all shadow-2xs"
          title="Visit Public Website Home"
        >
          <Home className="w-3.5 h-3.5 text-[#8E68CD]" />
          <span>Public Home</span>
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E6DBFF]">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#D4A017] flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5" />
            Verified Recruitment Channels
          </span>
          <h1 className="text-2xl font-black text-[#2A1B4E] mt-1">
            Internship Tracker & Company Opportunities
          </h1>
          <p className="text-xs text-[#6B5A99] mt-1">
            Official verified listings clearly separated from your personal recruitment pipeline.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 p-1 bg-[#F3EEFF] rounded-xl">
            <button
              type="button"
              onClick={() => setActiveTab('opportunities')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'opportunities'
                  ? 'bg-white text-[#2A1B4E] shadow-xs'
                  : 'text-[#6B5A99]'
              }`}
            >
              Verified Openings ({opportunities.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('pipeline')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'pipeline'
                  ? 'bg-white text-[#2A1B4E] shadow-xs'
                  : 'text-[#6B5A99]'
              }`}
            >
              My Pipeline ({applications.length})
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowLogModal(true)}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#D4A017] to-[#B3830E] hover:opacity-95 shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Log Application (+20 pts)</span>
          </button>
        </div>
      </div>

      {/* ================= TAB 1: VERIFIED OPPORTUNITIES ================= */}
      {activeTab === 'opportunities' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-[#FFFDF5] border border-[#F2C94C]/70 text-xs text-[#805E00] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#D4A017]" />
              <span>
                <strong>Verification Standard: </strong> Every listing links to official university hiring programs and displays a last-checked date stamp.
              </span>
            </div>
            <span className="text-[11px] font-mono text-[#805E00]">Strictly Official Sources</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {opportunities.map(opp => (
              <div
                key={opp.id}
                className="p-6 rounded-2xl bg-white border border-[#E6DBFF] hover:border-[#8E68CD] shadow-xs transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#3B2A6B] flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-[#8E68CD]" />
                      {opp.company}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      ✓ Verified Source
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#2A1B4E] leading-snug">{opp.role}</h3>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-[#6B5A99]">
                    <span>📍 {opp.location}</span>
                    <span>·</span>
                    <span className="font-semibold text-[#805E00]">💰 {opp.stipend}</span>
                    <span>·</span>
                    <span>{opp.type}</span>
                  </div>

                  {/* Requirements */}
                  <div className="space-y-1 pt-1">
                    <span className="text-[11px] font-semibold text-[#3B2A6B] uppercase tracking-wider">
                      Eligibility & Skills:
                    </span>
                    <ul className="text-xs text-[#4A3B6F] space-y-0.5">
                      {opp.requirements.map((req, rIdx) => (
                        <li key={rIdx} className="flex items-start gap-1.5">
                          <span className="text-[#D4A017] font-bold">·</span>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Footer with Verified Source & Date */}
                <div className="pt-3 border-t border-[#F3EEFF] flex items-center justify-between text-[11px]">
                  <div className="text-[#7D6B9E]">
                    Source: <strong className="text-[#3B2A6B]">{opp.verifiedSource}</strong>
                    <div className="text-[10px] text-[#9A8CB8]">Checked: {opp.lastCheckedDate}</div>
                  </div>

                  <a
                    href={opp.applicationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-[#3B2A6B] bg-[#F3EEFF] hover:bg-[#E6DBFF] flex items-center gap-1"
                  >
                    <span>Apply Link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 2: MY APPLICATION PIPELINE ================= */}
      {activeTab === 'pipeline' && (
        <div className="space-y-6">
          {applications.length === 0 ? (
            <div className="p-12 rounded-2xl bg-white border border-[#E6DBFF] text-center space-y-3">
              <Briefcase className="w-8 h-8 text-[#8E68CD] mx-auto opacity-70" />
              <h3 className="text-base font-bold text-[#2A1B4E]">No Applications Logged Yet</h3>
              <p className="text-xs text-[#6B5A99] max-w-md mx-auto">
                Recording your applications helps maintain consistent interview follow-ups and automatically completes your 3rd-year internship task (+20 points).
              </p>
              <button
                type="button"
                onClick={() => setShowLogModal(true)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#D4A017] to-[#B3830E] hover:opacity-95 shadow-xs"
              >
                Log Your First Application
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {['Wishlist', 'Applied', 'Interviewing', 'Offer Received', 'Rejected'].map(statusName => {
                const columnApps = applications.filter(a => a.status === statusName);

                return (
                  <div
                    key={statusName}
                    className="p-3 rounded-2xl bg-[#FAF8FF] border border-[#E6DBFF] space-y-3 min-h-[300px]"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-[#E6DBFF]">
                      <span className="text-xs font-bold text-[#3B2A6B]">{statusName}</span>
                      <span className="w-5 h-5 rounded-full bg-white text-[10px] font-bold text-[#6B5A99] flex items-center justify-center shadow-xs">
                        {columnApps.length}
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {columnApps.map(app => (
                        <div
                          key={app.id}
                          className="p-3 rounded-xl bg-white border border-[#E6DBFF] shadow-xs space-y-2 text-xs"
                        >
                          <div className="font-bold text-[#2A1B4E]">{app.company}</div>
                          <div className="text-[11px] text-[#6B5A99]">{app.role}</div>
                          <div className="text-[10px] text-[#7D6B9E]">Applied: {app.appliedDate}</div>

                          {/* Quick status selector */}
                          <div className="pt-1.5 border-t border-[#F3EEFF]">
                            <select
                              value={app.status}
                              onChange={e => handleUpdateStatus(app.id, e.target.value)}
                              className="w-full text-[10px] bg-[#FAF8FF] border border-[#E6DBFF] rounded-lg p-1 text-[#3B2A6B] font-medium"
                            >
                              <option value="Wishlist">Wishlist</option>
                              <option value="Applied">Applied</option>
                              <option value="Interviewing">Interviewing</option>
                              <option value="Offer Received">Offer Received</option>
                              <option value="Rejected">Rejected</option>
                            </select>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ================= LOG APPLICATION MODAL ================= */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2A1B4E]/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#E6DBFF] p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#F3EEFF] pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4A017]">
                  Verified Pipeline Entry
                </span>
                <h3 className="text-base font-bold text-[#2A1B4E]">Record Internship Application</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowLogModal(false)}
                className="text-[#6B5A99] hover:text-[#2A1B4E] text-sm"
              >
                ✕
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleLogApplication} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#3B2A6B] mb-1">Company Name</label>
                <input
                  type="text"
                  required
                  value={compName}
                  onChange={e => setCompName(e.target.value)}
                  placeholder="e.g. Razorpay, Texas Instruments, TCS"
                  className="w-full px-3 py-2 rounded-xl border border-[#D8CFEA] text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3B2A6B] mb-1">Target Role</label>
                <input
                  type="text"
                  required
                  value={roleTitle}
                  onChange={e => setRoleTitle(e.target.value)}
                  placeholder="e.g. Software Development Intern"
                  className="w-full px-3 py-2 rounded-xl border border-[#D8CFEA] text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#3B2A6B] mb-1">Date Applied</label>
                  <input
                    type="date"
                    required
                    value={appliedDate}
                    onChange={e => setAppliedDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#D8CFEA] text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#3B2A6B] mb-1">Status</label>
                  <select
                    value={appStatus}
                    onChange={e => setAppStatus(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#D8CFEA] text-xs bg-white"
                  >
                    <option value="Wishlist">Wishlist</option>
                    <option value="Applied">Applied</option>
                    <option value="Interviewing">Interviewing</option>
                    <option value="Offer Received">Offer Received</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3B2A6B] mb-1">Notes (Optional)</label>
                <textarea
                  rows={2}
                  value={appNotes}
                  onChange={e => setAppNotes(e.target.value)}
                  placeholder="Referred by senior alumni / Submitted portfolio link..."
                  className="w-full px-3 py-2 rounded-xl border border-[#D8CFEA] text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#6B5A99]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#D4A017] to-[#B3830E] hover:opacity-95 shadow-xs"
                >
                  {isSubmitting ? 'Logging...' : 'Save & Verify (+20 pts)'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
