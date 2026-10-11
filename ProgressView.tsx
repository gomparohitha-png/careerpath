import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Award,
  Flame,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  Zap,
  FolderGit2,
  FileText,
  Briefcase,
  Clock,
  ShieldCheck,
  Info,
  Calendar,
  Home
} from 'lucide-react';
import { UserScoreStreak, UserProfile } from '../types/index.ts';
import { api } from '../lib/api.ts';

interface ProgressViewProps {
  score: UserScoreStreak;
  profile: UserProfile | null;
  onOpenScoringExplainer: () => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({ score, profile, onOpenScoringExplainer }) => {
  const [analytics, setAnalytics] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getProgressAnalytics()
      .then(res => {
        setAnalytics(res);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [score.totalScore]);

  if (loading) {
    return <div className="p-8 text-center text-xs text-[#7D6B9E]">Loading verified progress records...</div>;
  }

  const iconMap: Record<string, any> = {
    Sparkles,
    Zap,
    FolderGit2,
    FileText,
    Briefcase,
    Flame
  };

  const readinessScore = analytics?.readinessScore || 0;
  const breakdown = analytics?.readinessBreakdown || {
    foundations: { score: 0, max: 25 },
    projects: { score: 0, max: 35 },
    practice: { score: 0, max: 25 },
    resume: { score: 0, max: 15 }
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
          <span className="font-semibold text-[#2A1B4E]">My Progress & Readiness</span>
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
            <TrendingUp className="w-3.5 h-3.5" />
            Verified Records & Activity Analytics
          </span>
          <h1 className="text-2xl font-black text-[#2A1B4E] mt-1">
            My Engineering Progress & Readiness
          </h1>
          <p className="text-xs text-[#6B5A99] mt-1">
            Authentic activity history, milestone badges, and transparent readiness calculations.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenScoringExplainer}
          className="px-4 py-2 rounded-xl text-xs font-bold text-[#3B2A6B] bg-white border border-[#E6DBFF] hover:bg-[#FAF8FF] shadow-xs self-start md:self-auto"
        >
          How Scoring Works
        </button>
      </div>

      {/* ================= PLACEMENT READINESS HERO CARD ================= */}
      <div className="p-8 rounded-3xl bg-gradient-to-br from-[#3B2A6B] via-[#4A3482] to-[#2A1B4E] text-white shadow-md relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Circular Score Gauge */}
          <div className="flex flex-col items-center justify-center text-center space-y-2">
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="rgba(255,255,255,0.15)"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="#F2C94C"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray="264"
                  strokeDashoffset={264 - (264 * readinessScore) / 100}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black font-mono text-[#F2C94C] tabular-nums">
                  {readinessScore}%
                </span>
                <span className="text-[10px] text-[#E6DBFF] uppercase tracking-wider font-semibold">
                  Readiness
                </span>
              </div>
            </div>
            <div className="text-xs font-bold text-[#E6DBFF]">
              Current Level: <strong className="text-white">{score.level}</strong>
            </div>
          </div>

          {/* Breakdown Bars */}
          <div className="md:col-span-2 space-y-3.5">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">Placement Readiness Breakdown</h3>
              <p className="text-xs text-[#E6DBFF] leading-relaxed">
                A transparent metric calibrated across four core recruitment dimensions. It is a tool for self-assessment, never a selection guarantee.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#E6DBFF]">Core Foundations</span>
                  <span className="font-mono font-bold text-[#F2C94C]">{breakdown.foundations.score} / {breakdown.foundations.max}</span>
                </div>
                <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#F2C94C] rounded-full transition-all duration-500"
                    style={{ width: `${(breakdown.foundations.score / breakdown.foundations.max) * 100}%` }}
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#E6DBFF]">GitHub Projects</span>
                  <span className="font-mono font-bold text-[#F2C94C]">{breakdown.projects.score} / {breakdown.projects.max}</span>
                </div>
                <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#F2C94C] rounded-full transition-all duration-500"
                    style={{ width: `${(breakdown.projects.score / breakdown.projects.max) * 100}%` }}
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#E6DBFF]">DSA & Assessments</span>
                  <span className="font-mono font-bold text-[#F2C94C]">{breakdown.practice.score} / {breakdown.practice.max}</span>
                </div>
                <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#F2C94C] rounded-full transition-all duration-500"
                    style={{ width: `${(breakdown.practice.score / breakdown.practice.max) * 100}%` }}
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#E6DBFF]">ATS Resume Quality</span>
                  <span className="font-mono font-bold text-[#F2C94C]">{breakdown.resume.score} / {breakdown.resume.max}</span>
                </div>
                <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#F2C94C] rounded-full transition-all duration-500"
                    style={{ width: `${(breakdown.resume.score / breakdown.resume.max) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= VERIFIED ACHIEVEMENTS BADGES ================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#2A1B4E] uppercase tracking-wider">
            Verified Achievement Badges
          </h3>
          <span className="text-xs text-[#7D6B9E]">
            {analytics?.achievements?.filter((a: any) => a.earned).length || 0} of {analytics?.achievements?.length || 6} Earned
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {analytics?.achievements?.map((ach: any) => {
            const Icon = iconMap[ach.icon] || Award;
            return (
              <div
                key={ach.id}
                className={`p-5 rounded-2xl border transition-all flex items-start gap-4 ${
                  ach.earned
                    ? 'bg-white border-[#D4A017] ring-1 ring-[#FFF8E7] shadow-xs'
                    : 'bg-[#FAF8FF] border-[#E6DBFF] opacity-60'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                    ach.earned
                      ? 'bg-gradient-to-br from-[#D4A017] to-[#F2C94C] text-[#2A1B4E] shadow-xs'
                      : 'bg-[#E6DBFF] text-[#9A8CB8]'
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-[#2A1B4E]">{ach.title}</h4>
                    {ach.earned && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Earned
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#6B5A99] leading-relaxed">{ach.description}</p>
                  {ach.earned && ach.date && (
                    <div className="text-[10px] font-mono text-[#8E68CD] pt-1">
                      Verified: {new Date(ach.date).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= VERIFIED ACTIVITY AUDIT STREAM ================= */}
      <div className="p-6 rounded-2xl bg-white border border-[#E6DBFF] shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-[#2A1B4E] uppercase tracking-wider">
          Complete Verified Activity Audit Log
        </h3>

        {(!analytics?.recentActivities || analytics.recentActivities.length === 0) ? (
          <div className="p-8 text-center text-xs text-[#7D6B9E]">
            No verified activity records yet. Complete your first roadmap reading task or assessment to start your verifiable history.
          </div>
        ) : (
          <div className="space-y-2.5">
            {analytics.recentActivities.map((act: any) => (
              <div
                key={act.id}
                className="p-3.5 rounded-xl bg-[#FAF8FF] border border-[#F3EEFF] text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div className="space-y-0.5">
                  <div className="font-bold text-[#2A1B4E]">{act.title}</div>
                  <div className="text-[11px] text-[#6B5A99]">{act.details || 'Proof verified by server'}</div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs font-mono font-bold text-[#D4A017]">
                    +{act.points} pts
                  </span>
                  <span className="text-[10px] text-[#9A8CB8]">
                    {new Date(act.timestamp).toLocaleDateString()} · {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
