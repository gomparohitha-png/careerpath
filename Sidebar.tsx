import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Flame,
  Award,
  ChevronRight,
  Sparkles,
  Zap,
  BookOpen,
  FolderGit2,
  CheckCircle2,
  FileText,
  Briefcase,
  X,
  Target,
  Compass,
  Home,
  Calendar,
  TrendingUp,
  Bell,
  User as UserIcon,
  HelpCircle
} from 'lucide-react';
import { UserProfile, UserScoreStreak } from '../types/index.ts';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile | null;
  score: UserScoreStreak;
  nextBestAction: any;
  onActionClick: (action: any) => void;
  onOpenScoringExplainer: () => void;
}

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  profile,
  score,
  nextBestAction,
  onActionClick,
  onOpenScoringExplainer
}) => {
  const location = useLocation();
  const isZeroState = score.totalScore === 0;
  const maxCategoryTarget = 150;

  const quickNav = [
    { path: '/', label: 'Public Home Page', icon: Home },
    { path: '/dashboard', label: 'Dashboard', icon: Compass },
    { path: '/roadmap', label: 'AI Career Roadmap', icon: Sparkles },
    { path: '/skills', label: 'Skill Gap Analyzer', icon: TrendingUp },
    { path: '/projects', label: 'Projects & GitHub', icon: FolderGit2 },
    { path: '/practice', label: 'Practice & Quizzes', icon: Zap },
    { path: '/internships', label: 'Internship Tracker', icon: Briefcase },
    { path: '/resume', label: 'Resume Builder', icon: FileText },
    { path: '/planner', label: 'Weekly Planner', icon: Calendar },
    { path: '/progress', label: 'My Progress', icon: Award },
    { path: '/notifications', label: 'Notifications', icon: Bell },
    { path: '/scoring', label: 'How Scoring Works', icon: HelpCircle }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-[#2A1B4E]/40 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed lg:sticky top-16 z-30 h-[calc(100vh-4rem)] bg-white border-r border-[#E6DBFF] transition-all duration-300 ease-in-out overflow-y-auto flex flex-col ${
          isOpen ? 'w-80 translate-x-0' : '-translate-x-full lg:w-0 lg:translate-x-0 lg:overflow-hidden lg:border-none'
        }`}
      >
        <div className="p-5 space-y-6 shrink-0 w-80">
          {/* Mobile close button */}
          <div className="flex items-center justify-between lg:hidden pb-1 border-b border-[#F3EEFF]">
            <span className="text-xs font-bold text-[#6B5A99] uppercase tracking-wider">
              Student Progress Panel
            </span>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#6B5A99] hover:bg-[#F3EEFF]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 1. PROFILE MINI-CARD */}
          <Link
            to="/profile"
            className="block p-4 rounded-2xl bg-gradient-to-br from-[#F3EEFF] to-[#FAF8FF] border border-[#E6DBFF] shadow-xs hover:border-[#8E68CD] transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#3B2A6B] to-[#51368F] flex items-center justify-center text-white font-extrabold text-base shadow-xs group-hover:scale-105 transition-transform">
                {profile?.name ? profile.name[0].toUpperCase() : 'S'}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-bold text-sm text-[#2A1B4E] truncate">
                  {profile?.name || 'Engineering Student'}
                </div>
                <div className="text-xs text-[#6B5A99] font-medium">
                  {profile?.branch || 'B.Tech'} · Year {profile?.year || 1}
                </div>
                <div className="text-[11px] text-[#8E68CD] font-medium truncate mt-0.5">
                  Goal: {profile?.careerGoal || 'Software'}
                </div>
              </div>
            </div>
          </Link>

          {/* 2. STREAK & LEVEL COUNTER */}
          <div className="grid grid-cols-2 gap-3">
            {/* Streak Counter */}
            <Link
              to="/scoring"
              className="p-3.5 rounded-2xl bg-[#FFFDF5] border border-[#F2C94C]/70 shadow-xs flex flex-col justify-between hover:border-[#D4A017] transition-all"
            >
              <div className="flex items-center justify-between text-[#805E00]">
                <span className="text-[11px] font-bold uppercase tracking-wider">Streak</span>
                <Flame className={`w-4 h-4 ${score.streakDays > 0 ? 'text-[#D4A017] fill-[#F2C94C]' : 'text-slate-300'}`} />
              </div>
              <div className="mt-2">
                <div className="text-2xl font-black font-mono text-[#2A1B4E] tabular-nums">
                  {score.streakDays}
                  <span className="text-xs font-semibold text-[#805E00] ml-1">days</span>
                </div>
                <div className="text-[10px] text-[#7D6B9E] font-medium mt-0.5">
                  {score.streakDays === 0 ? 'Starts at first task' : 'Active streak'}
                </div>
              </div>
            </Link>

            {/* Total Score & Level */}
            <Link
              to="/progress"
              className="p-3.5 rounded-2xl bg-[#FAF8FF] border border-[#E6DBFF] shadow-xs flex flex-col justify-between hover:border-[#8E68CD] transition-all"
            >
              <div className="flex items-center justify-between text-[#3B2A6B]">
                <span className="text-[11px] font-bold uppercase tracking-wider">Score</span>
                <Award className="w-4 h-4 text-[#D4A017]" />
              </div>
              <div className="mt-2">
                <div className="text-2xl font-black font-mono text-[#2A1B4E] tabular-nums">
                  {score.totalScore}
                  <span className="text-xs font-semibold text-[#7D6B9E] ml-1">pts</span>
                </div>
                <div className="text-[10px] font-bold text-[#6540AB] mt-0.5 truncate">
                  Level: {score.level}
                </div>
              </div>
            </Link>
          </div>

          {/* 3. WEEKLY ACTIVITY (Mon to Sun dots) */}
          <div className="p-4 rounded-2xl bg-white border border-[#E6DBFF] shadow-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#3B2A6B] uppercase tracking-wider">
                Weekly Activity
              </span>
              <span className="text-[10px] text-[#7D6B9E]">Verified only</span>
            </div>
            <div className="flex items-center justify-between gap-1 pt-1">
              {DAYS_OF_WEEK.map(day => {
                const isDone = score.weeklyActivity[day];
                return (
                  <div key={day} className="flex flex-col items-center gap-1.5 flex-1">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                        isDone
                          ? 'bg-gradient-to-br from-[#D4A017] to-[#F2C94C] text-[#2A1B4E] shadow-xs font-bold'
                          : 'bg-[#F3EEFF] text-[#9A8CB8]'
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#2A1B4E]" />
                      ) : (
                        <div className="w-1.5 h-1.5 rounded-full bg-[#D8CFEA]" />
                      )}
                    </div>
                    <span className="text-[10px] font-medium text-[#7D6B9E]">{day}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. SCORE BREAKDOWN BARS */}
          <div className="p-4 rounded-2xl bg-white border border-[#E6DBFF] shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#3B2A6B] uppercase tracking-wider">
                Score Breakdown
              </span>
              <Link
                to="/scoring"
                className="text-[10px] font-semibold text-[#8E68CD] hover:text-[#6540AB] underline"
              >
                Rules
              </Link>
            </div>

            {/* Zero State Notice */}
            {isZeroState && (
              <div className="p-3 rounded-xl bg-[#FAF8FF] border border-[#E6DBFF] text-center text-xs text-[#6B5A99]">
                <Sparkles className="w-4 h-4 text-[#D4A017] mx-auto mb-1" />
                <p className="font-semibold text-[#2A1B4E]">Ready to begin!</p>
                <p className="text-[11px] mt-0.5">
                  Complete your first task to start your streak and watch your score bars grow.
                </p>
              </div>
            )}

            <div className="space-y-2.5">
              {[
                { name: 'Skills & Study', val: score.categoryScores.skills, icon: BookOpen, color: 'from-[#8E68CD] to-[#6540AB]' },
                { name: 'Projects', val: score.categoryScores.projects, icon: FolderGit2, color: 'from-[#D4A017] to-[#F2C94C]' },
                { name: 'Practice & Quizzes', val: score.categoryScores.practice, icon: Zap, color: 'from-[#3B2A6B] to-[#51368F]' },
                { name: 'Resume', val: score.categoryScores.resume, icon: FileText, color: 'from-[#B3830E] to-[#D4A017]' },
                { name: 'Internships', val: score.categoryScores.internships, icon: Briefcase, color: 'from-[#6540AB] to-[#8E68CD]' }
              ].map(cat => {
                const Icon = cat.icon;
                const widthPercent = Math.min(100, Math.round((cat.val / maxCategoryTarget) * 100));
                return (
                  <div key={cat.name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5 text-[#4A3B6F] font-medium text-[11px]">
                        <Icon className="w-3 h-3 text-[#7D6B9E]" />
                        {cat.name}
                      </span>
                      <span className="font-mono text-[11px] font-bold text-[#2A1B4E] tabular-nums">
                        {cat.val} pts
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-[#F3EEFF] rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${cat.color} rounded-full transition-all duration-500`}
                        style={{ width: `${widthPercent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 5. NEXT BEST ACTION CARD */}
          {nextBestAction && (
            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#FFFBEA] to-[#FFF8E7] border border-[#F2C94C] shadow-xs space-y-2.5">
              <div className="flex items-center gap-1.5 text-[#805E00]">
                <Target className="w-4 h-4 text-[#D4A017]" />
                <span className="text-xs font-bold uppercase tracking-wider">Next Best Action</span>
              </div>
              <div className="text-sm font-bold text-[#2A1B4E] leading-snug">
                {nextBestAction.title}
              </div>
              <p className="text-[11px] text-[#6B5A99] line-clamp-2">
                {nextBestAction.reason}
              </p>
              <div className="pt-1 flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-[#805E00]">
                  +{nextBestAction.points} pts
                </span>
                <button
                  type="button"
                  onClick={() => onActionClick(nextBestAction)}
                  className="px-3 py-1 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#D4A017] to-[#B3830E] hover:opacity-95 shadow-xs flex items-center gap-1"
                >
                  Start Task
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* 6. QUICK NAVIGATION DRAWER LINKS */}
          <div className="pt-2 border-t border-[#F3EEFF] space-y-1">
            <span className="text-[10px] font-bold text-[#7D6B9E] uppercase tracking-wider px-2">
              All Sections
            </span>
            <div className="space-y-0.5">
              {quickNav.map(item => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => {
                      if (window.innerWidth < 1024) onClose();
                    }}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-[#3B2A6B] text-white shadow-xs'
                        : 'text-[#4A3B6F] hover:bg-[#F3EEFF]'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#F2C94C]' : 'text-[#8E68CD]'}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
