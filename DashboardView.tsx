import React from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  Home,
  Award,
  Flame,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  BookOpen,
  FolderGit2,
  Zap,
  Target,
  Calendar,
  AlertTriangle,
  Briefcase
} from 'lucide-react';
import { UserProfile, UserScoreStreak, TaskTemplate, UserTask } from '../types/index.ts';

interface DashboardViewProps {
  profile: UserProfile | null;
  score: UserScoreStreak;
  stats: {
    totalTasks: number;
    completedCount: number;
    progressPercent: number;
    applicationsCount: number;
  };
  thisWeekTasks: { template: TaskTemplate; userTask: UserTask }[];
  nextBestAction: any;
  recentActivities: any[];
  onVerifyTask: (task: { template: TaskTemplate; userTask: UserTask }) => void;
  onNavigateToTab: (tab: string) => void;
  onOpenScoringExplainer: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  profile,
  score,
  stats,
  thisWeekTasks,
  nextBestAction,
  recentActivities,
  onVerifyTask,
  onNavigateToTab,
  onOpenScoringExplainer
}) => {
  const isZeroState = score.totalScore === 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* ================= BREADCRUMB & HOME ORIENTATION ================= */}
      <div className="flex items-center justify-between pb-1">
        <nav className="flex items-center gap-2 text-xs text-[#7D6B9E]">
          <Link
            to="/"
            className="flex items-center gap-1.5 hover:text-[#2A1B4E] transition-colors"
            title="Public Home Page"
          >
            <Home className="w-3.5 h-3.5 text-[#8E68CD]" />
            <span>Home</span>
          </Link>
          <span className="text-[#C8BEDD]">/</span>
          <span className="font-semibold text-[#2A1B4E]">Student Dashboard</span>
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

      {/* ================= HERO GREETING BANNER ================= */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#3B2A6B] via-[#4A3482] to-[#2A1B4E] text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[11px] font-semibold text-[#F2C94C] border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-[#F2C94C]" />
            B.Tech {profile?.branch || 'Engineering'} · Year {profile?.year || 1} Personalized Dashboard
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {profile?.name || 'Engineer'}
          </h1>

          <p className="text-xs sm:text-sm text-[#E6DBFF] leading-relaxed">
            Targeting <strong className="text-white">{profile?.careerGoal || 'Software Development'}</strong> with a daily study pace of <strong className="text-white">{profile?.dailyStudyTime || '1 hr'}</strong>.
            Your score and streak reflect real, verified engineering proof-of-work.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigateToTab('roadmap')}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-[#2A1B4E] bg-gradient-to-r from-[#D4A017] to-[#F2C94C] hover:opacity-95 shadow-md flex items-center gap-2 transition-all transform active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Generate / View AI Roadmap</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={onOpenScoringExplainer}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white/90 hover:text-white bg-white/10 hover:bg-white/20 transition-colors"
            >
              How Scoring Works
            </button>
          </div>
        </div>

        {/* Ambient decorative badge */}
        <div className="hidden lg:flex absolute right-8 top-1/2 -translate-y-1/2 w-44 h-44 rounded-full bg-gradient-to-br from-[#D4A017]/20 to-transparent items-center justify-center border border-white/10">
          <div className="text-center">
            <div className="text-3xl font-black font-mono text-[#F2C94C] tabular-nums">
              {score.totalScore}
            </div>
            <div className="text-[11px] uppercase tracking-wider text-[#E6DBFF] font-semibold mt-0.5">
              Verified Points
            </div>
            <div className="text-[10px] text-white/80 font-bold mt-1">
              {score.level}
            </div>
          </div>
        </div>
      </div>

      {/* ================= ZERO STATE INVITATION (IF 0 POINTS) ================= */}
      {isZeroState && (
        <div className="p-5 rounded-2xl bg-[#FFFDF5] border border-[#F2C94C] text-[#805E00] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D4A017] text-white flex items-center justify-center shrink-0">
              <Flame className="w-5 h-5 text-[#2A1B4E]" />
            </div>
            <div>
              <div className="font-bold text-sm text-[#2A1B4E]">
                Complete your first task to start your streak!
              </div>
              <p className="text-xs text-[#805E00] mt-0.5">
                Unlike traditional apps, CareerPath never shows fake pre-filled numbers. Your progress reflects honest verification.
              </p>
            </div>
          </div>
          {nextBestAction && (
            <button
              type="button"
              onClick={() => onNavigateToTab('roadmap')}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#D4A017] to-[#B3830E] hover:opacity-95 shadow-xs whitespace-nowrap self-start sm:self-auto"
            >
              Start First Task
            </button>
          )}
        </div>
      )}

      {/* ================= 4 METRICS STRIP ================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Streak */}
        <div className="p-4 rounded-2xl bg-white border border-[#E6DBFF] shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#FFF8E7] border border-[#F2C94C]/60 flex items-center justify-center">
            <Flame className={`w-5 h-5 ${score.streakDays > 0 ? 'text-[#D4A017] fill-[#F2C94C]' : 'text-slate-300'}`} />
          </div>
          <div>
            <div className="text-xl font-black font-mono text-[#2A1B4E] tabular-nums">
              {score.streakDays} <span className="text-xs font-semibold text-[#6B5A99]">days</span>
            </div>
            <div className="text-[11px] text-[#6B5A99] font-medium">Verified Streak</div>
          </div>
        </div>

        {/* Roadmap Progress */}
        <div className="p-4 rounded-2xl bg-white border border-[#E6DBFF] shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#F3EEFF] border border-[#E6DBFF] flex items-center justify-center">
            <Compass className="w-5 h-5 text-[#3B2A6B]" />
          </div>
          <div>
            <div className="text-xl font-black font-mono text-[#2A1B4E] tabular-nums">
              {stats.progressPercent}%
            </div>
            <div className="text-[11px] text-[#6B5A99] font-medium">
              {stats.completedCount} / {stats.totalTasks} Milestones
            </div>
          </div>
        </div>

        {/* Verified Score */}
        <div className="p-4 rounded-2xl bg-white border border-[#E6DBFF] shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#FAF8FF] border border-[#E6DBFF] flex items-center justify-center">
            <Award className="w-5 h-5 text-[#D4A017]" />
          </div>
          <div>
            <div className="text-xl font-black font-mono text-[#2A1B4E] tabular-nums">
              {score.totalScore} <span className="text-xs font-semibold text-[#6B5A99]">pts</span>
            </div>
            <div className="text-[11px] text-[#6B5A99] font-medium">Level: {score.level}</div>
          </div>
        </div>

        {/* Applications Logged */}
        <div className="p-4 rounded-2xl bg-white border border-[#E6DBFF] shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#FAF8FF] border border-[#E6DBFF] flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-[#8E68CD]" />
          </div>
          <div>
            <div className="text-xl font-black font-mono text-[#2A1B4E] tabular-nums">
              {stats.applicationsCount}
            </div>
            <div className="text-[11px] text-[#6B5A99] font-medium">Internship Applications</div>
          </div>
        </div>
      </div>

      {/* ================= 2-COLUMN VIEWPORT: TODAY'S FOCUS & NEXT BEST ACTION ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Priority Focus Tasks */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#3B2A6B]" />
              <h3 className="text-base font-bold text-[#2A1B4E]">Priority Tasks for Today</h3>
            </div>
            <button
              type="button"
              onClick={() => onNavigateToTab('roadmap')}
              className="text-xs font-semibold text-[#8E68CD] hover:text-[#6540AB] flex items-center gap-1"
            >
              <span>All roadmap tasks</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {thisWeekTasks.length === 0 ? (
              <div className="p-8 rounded-2xl bg-white border border-[#E6DBFF] text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="text-sm font-bold text-[#2A1B4E]">All Current Tasks Completed!</h4>
                <p className="text-xs text-[#6B5A99]">
                  Outstanding work. Explore advanced projects or interview assessments in the practice module.
                </p>
              </div>
            ) : (
              thisWeekTasks.map(({ template, userTask }) => (
                <div
                  key={template.id}
                  className="p-5 rounded-2xl bg-white border border-[#E6DBFF] hover:border-[#8E68CD] shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-semibold text-[#8E68CD]">Year {template.year}</span>
                      <span>·</span>
                      <span className="text-[#6B5A99]">{template.timeNeeded}</span>
                      <span>·</span>
                      <span className="font-mono font-bold text-[#D4A017]">+{template.points} pts</span>
                    </div>
                    <h4 className="text-sm font-bold text-[#2A1B4E]">{template.title}</h4>
                    <p className="text-xs text-[#6B5A99] line-clamp-1">{template.whatYouWillLearn}</p>
                    <div className="text-[11px] text-[#4A3B6F] pt-0.5">
                      <strong>Check rule: </strong>{template.verificationRule}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onVerifyTask({ template, userTask })}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#D4A017] to-[#B3830E] hover:opacity-95 shadow-xs flex items-center gap-1.5 self-start sm:self-auto shrink-0 transition-transform active:scale-95"
                  >
                    <span>Verify Task</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Col: Next Best Action & Activity Feed */}
        <div className="space-y-5">
          {/* Next Best Action Card */}
          {nextBestAction && (
            <div className="p-5 rounded-2xl bg-gradient-to-br from-[#FFFBEA] to-[#FFF8E7] border border-[#F2C94C] shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-[#805E00]">
                <Target className="w-4 h-4 text-[#D4A017]" />
                <span className="text-xs font-bold uppercase tracking-wider">Next Best Action</span>
              </div>
              <h4 className="text-sm font-bold text-[#2A1B4E] leading-snug">
                {nextBestAction.title}
              </h4>
              <p className="text-xs text-[#6B5A99]">
                {nextBestAction.reason}
              </p>
              <div className="pt-2 flex items-center justify-between border-t border-[#F2C94C]/40">
                <span className="text-xs font-mono font-bold text-[#805E00]">
                  +{nextBestAction.points} pts
                </span>
                <button
                  type="button"
                  onClick={() => onNavigateToTab('roadmap')}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-[#3B2A6B] hover:bg-[#2A1B4E] shadow-xs"
                >
                  Go to Task
                </button>
              </div>
            </div>
          )}

          {/* Recent Verified Activity Log */}
          <div className="p-5 rounded-2xl bg-white border border-[#E6DBFF] shadow-xs space-y-3">
            <h4 className="text-xs font-bold text-[#3B2A6B] uppercase tracking-wider">
              Recent Verified Activity
            </h4>
            {recentActivities.length === 0 ? (
              <p className="text-xs text-[#7D6B9E] py-2">
                No activity yet. Complete learning checks or practice quizzes to record verified milestones.
              </p>
            ) : (
              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                {recentActivities.map((act: any) => (
                  <div
                    key={act.id}
                    className="p-2.5 rounded-xl bg-[#FAF8FF] border border-[#F3EEFF] text-xs flex items-center justify-between"
                  >
                    <div className="min-w-0 flex-1 pr-2">
                      <div className="font-semibold text-[#2A1B4E] truncate">{act.title}</div>
                      <div className="text-[10px] text-[#7D6B9E]">
                        {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    <span className="text-[11px] font-mono font-bold text-[#D4A017] shrink-0">
                      +{act.points} pts
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
