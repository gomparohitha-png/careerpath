import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Compass,
  Home,
  Flame,
  Award,
  HelpCircle,
  User as UserIcon,
  Shield,
  Menu,
  ChevronDown,
  Info,
  Bell,
  LogOut,
  TrendingUp,
  Settings
} from 'lucide-react';
import { User, UserProfile, UserScoreStreak } from '../types/index.ts';
import { logOutFirebase } from '../lib/firebase.ts';

interface NavbarProps {
  user: User | null;
  profile: UserProfile | null;
  score: UserScoreStreak;
  unreadCount?: number;
  onOpenScoringExplainer: () => void;
  onToggleSidebar: () => void;
  onSwitchRole: (role: 'student' | 'admin') => void;
  onLogout: () => void;
}

interface NavItem {
  path: string;
  label: string;
  tooltip: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  profile,
  score,
  unreadCount = 0,
  onOpenScoringExplainer,
  onToggleSidebar,
  onSwitchRole,
  onLogout
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // Generate personalized navigation tabs based on user's branch and career goal
  const getPersonalizedNavItems = (): NavItem[] => {
    const branch = profile?.branch || 'CSE';
    const goal = profile?.careerGoal || 'Software Development';

    const items: NavItem[] = [
      {
        path: '/dashboard',
        label: 'Dashboard',
        tooltip: "Your command center: today's priority tasks, streak status, and weekly goals."
      },
      {
        path: '/roadmap',
        label: 'Roadmap',
        tooltip: 'Year-by-year syllabus milestones verified with automated checks.'
      }
    ];

    if (goal === 'Government Jobs') {
      items.push(
        { path: '/practice', label: 'Aptitude & GATE', tooltip: 'Speed quant, logical reasoning, and official engineering test banks.' },
        { path: '/planner', label: 'Study Planner', tooltip: 'Daily timetable calibrated to your target exam timeline.' },
        { path: '/skills', label: 'Skill Gap', tooltip: 'Benchmark syllabus readiness against PSU cutoffs.' },
        { path: '/progress', label: 'My Progress', tooltip: 'Verified score history, achievements, and preparation analytics.' }
      );
    } else if (goal === 'Higher Studies') {
      items.push(
        { path: '/practice', label: 'Exam Prep (GRE/GATE)', tooltip: 'Analytical writing, vocabulary and engineering practice banks.' },
        { path: '/projects', label: 'Research Projects', tooltip: 'Verified repositories suitable for research publication & faculty SOPs.' },
        { path: '/resume', label: 'Resume & SOP', tooltip: 'Academic CV formatter with coursework and research sections.' },
        { path: '/progress', label: 'My Progress', tooltip: 'Verified score history, achievements, and academic readiness.' }
      );
    } else if (branch === 'ECE' || branch === 'EEE') {
      items.push(
        { path: '/projects', label: 'Circuits & Embedded', tooltip: 'Microcontroller, FPGA, and hardware telemetry verified projects.' },
        { path: '/skills', label: 'Skill Gap', tooltip: 'Prioritize C++, Verilog, and circuit simulation benchmarks.' },
        { path: '/internships', label: 'Internships', tooltip: 'Verified core electronics and semiconductor internship listings.' },
        { path: '/resume', label: 'Resume', tooltip: 'ATS hardware engineer resume builder with live verification.' },
        { path: '/progress', label: 'My Progress', tooltip: 'Verified score history, achievements, and engineering progress.' }
      );
    } else {
      // CSE / IT / Software Development / AI
      items.push(
        { path: '/practice', label: 'DSA & Practice', tooltip: 'Coding challenges, algorithms, and technical assessment tests.' },
        { path: '/projects', label: 'Projects', tooltip: 'Real milestone-verified projects with public GitHub checking.' },
        { path: '/internships', label: 'Internships', tooltip: 'Verified company recruitment drives and application tracker.' },
        { path: '/resume', label: 'Resume', tooltip: 'ATS-tailored technical resume with automated verification.' },
        { path: '/skills', label: 'Skill Gap', tooltip: 'Automated skill gap matrix comparing you to software role criteria.' },
        { path: '/progress', label: 'My Progress', tooltip: 'Verified score history, achievements, and readiness metrics.' }
      );
    }

    items.push({
      path: '/profile',
      label: 'Profile',
      tooltip: 'Edit your branch, target career goal, and study availability.'
    });

    return items;
  };

  const navItems = getPersonalizedNavItems();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E6DBFF] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        {/* ZONE 1: BRAND WORDMARK & SIDEBAR TOGGLE */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="p-2 rounded-xl text-[#3B2A6B] hover:bg-[#F3EEFF] transition-colors"
            title="Toggle Progress Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-left group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#3B2A6B] to-[#51368F] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5 text-[#F2C94C]" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-[#2A1B4E]">
                Career<span className="text-[#D4A017]">Path</span>
              </span>
              <span className="hidden sm:inline-block ml-2 text-[11px] font-medium text-[#7D6B9E] tracking-tight">
                Plan · Learn · Grow
              </span>
            </div>
          </Link>

          {/* Quick Home Page Link */}
          <Link
            to="/"
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-[#6B5A99] hover:text-[#2A1B4E] hover:bg-[#F3EEFF] border border-transparent hover:border-[#E6DBFF] transition-all ml-1"
            title="Go to Public Website Home"
          >
            <Home className="w-4 h-4 text-[#8E68CD]" />
            <span>Home</span>
          </Link>
        </div>

        {/* ZONE 2: PERSONALIZED CHOICES NAVIGATION (with tooltips) */}
        <nav className="hidden lg:flex items-center gap-1 overflow-x-auto py-1">
          {navItems.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <div
                key={item.path}
                className="relative"
                onMouseEnter={() => setActiveTooltip(item.path)}
                onMouseLeave={() => setActiveTooltip(null)}
              >
                <Link
                  to={item.path}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#3B2A6B] text-white shadow-xs'
                      : 'text-[#4A3B6F] hover:text-[#2A1B4E] hover:bg-[#F3EEFF]'
                  }`}
                >
                  <span>{item.label}</span>
                  <Info className={`w-3 h-3 ${isActive ? 'text-[#F2C94C]' : 'text-[#8E68CD] opacity-60'}`} />
                </Link>

                {/* 'What this does' Tooltip */}
                {activeTooltip === item.path && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 p-2.5 rounded-xl bg-[#2A1B4E] text-white text-[11px] leading-tight shadow-xl z-50 pointer-events-none animate-in fade-in duration-150">
                    <div className="font-bold text-[#F2C94C] mb-0.5 flex items-center gap-1">
                      <HelpCircle className="w-3 h-3" />
                      What this does:
                    </div>
                    <div className="text-[#E6DBFF]">{item.tooltip}</div>
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#2A1B4E] rotate-45" />
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* ZONE 3: NOTIFICATIONS, STREAK, SCORE & USER PROFILE */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Notifications Bell */}
          <Link
            to="/notifications"
            className="relative p-2 rounded-xl text-[#3B2A6B] hover:bg-[#F3EEFF] transition-colors"
            title="View Notifications"
          >
            <Bell className="w-4 h-4 text-[#3B2A6B]" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#D4A017] ring-2 ring-white" />
            )}
          </Link>

          {/* STREAK COUNTER BADGE */}
          <Link
            to="/scoring"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FFF8E7] border border-[#F2C94C]/60 hover:border-[#D4A017] transition-all"
            title="Click to view streak rules & freeze mechanics"
          >
            <Flame className={`w-4 h-4 ${score.streakDays > 0 ? 'text-[#D4A017] animate-pulse fill-[#F2C94C]' : 'text-slate-400'}`} />
            <span className="text-xs font-bold font-mono text-[#7A5B00] tabular-nums">
              {score.streakDays}d
            </span>
          </Link>

          {/* TOTAL SCORE BADGE */}
          <Link
            to="/scoring"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#D4A017] to-[#F2C94C] text-[#2A1B4E] font-bold text-xs shadow-xs hover:opacity-95 transition-opacity"
            title="Click to view score rules & level thresholds"
          >
            <Award className="w-4 h-4" />
            <span className="font-mono tabular-nums">{score.totalScore} pts</span>
          </Link>

          {/* USER & ROLE DROPDOWN */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-[#F3EEFF] border border-transparent hover:border-[#E6DBFF] transition-all"
            >
              <div className="w-8 h-8 rounded-xl bg-[#3B2A6B] text-white flex items-center justify-center text-xs font-bold shadow-xs">
                {user?.name ? user.name[0].toUpperCase() : 'S'}
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-[#6B5A99]" />
            </button>

            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-[#E6DBFF] py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-4 py-2 border-b border-[#F3EEFF]">
                  <div className="text-xs font-bold text-[#2A1B4E] truncate">{user?.name}</div>
                  <div className="text-[11px] text-[#7D6B9E] truncate">{user?.email}</div>
                  <div className="text-[10px] font-mono font-medium text-[#D4A017] mt-0.5">
                    {profile?.branch} · Year {profile?.year || 1}
                  </div>
                </div>

                <div className="py-1 text-xs">
                  <Link
                    to="/"
                    onClick={() => setShowUserDropdown(false)}
                    className="w-full px-4 py-2 text-left font-medium text-[#3B2A6B] hover:bg-[#F3EEFF] flex items-center gap-2"
                  >
                    <Home className="w-3.5 h-3.5 text-[#8E68CD]" />
                    Public Home Page
                  </Link>

                  <Link
                    to="/dashboard"
                    onClick={() => setShowUserDropdown(false)}
                    className="w-full px-4 py-2 text-left font-medium text-[#3B2A6B] hover:bg-[#F3EEFF] flex items-center gap-2"
                  >
                    <Compass className="w-3.5 h-3.5 text-[#8E68CD]" />
                    Student Dashboard
                  </Link>

                  <Link
                    to="/profile"
                    onClick={() => setShowUserDropdown(false)}
                    className="w-full px-4 py-2 text-left font-medium text-[#3B2A6B] hover:bg-[#F3EEFF] flex items-center gap-2"
                  >
                    <UserIcon className="w-3.5 h-3.5" />
                    Profile & Settings
                  </Link>

                  <Link
                    to="/progress"
                    onClick={() => setShowUserDropdown(false)}
                    className="w-full px-4 py-2 text-left font-medium text-[#3B2A6B] hover:bg-[#F3EEFF] flex items-center gap-2"
                  >
                    <TrendingUp className="w-3.5 h-3.5" />
                    My Progress & Badges
                  </Link>

                  <Link
                    to="/notifications"
                    onClick={() => setShowUserDropdown(false)}
                    className="w-full px-4 py-2 text-left font-medium text-[#3B2A6B] hover:bg-[#F3EEFF] flex items-center gap-2"
                  >
                    <Bell className="w-3.5 h-3.5" />
                    Notifications
                  </Link>

                  <Link
                    to="/scoring"
                    onClick={() => setShowUserDropdown(false)}
                    className="w-full px-4 py-2 text-left font-medium text-[#3B2A6B] hover:bg-[#F3EEFF] flex items-center gap-2"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    How Scoring Works
                  </Link>

                  {user?.role === 'admin' ? (
                    <Link
                      to="/admin"
                      onClick={() => setShowUserDropdown(false)}
                      className="w-full px-4 py-2 text-left font-bold text-[#6540AB] hover:bg-[#F3EEFF] flex items-center gap-2"
                    >
                      <Shield className="w-3.5 h-3.5" />
                      Admin Dashboard
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        onSwitchRole('admin');
                        setShowUserDropdown(false);
                      }}
                      className="w-full px-4 py-2 text-left font-medium text-[#6540AB] hover:bg-[#F3EEFF] flex items-center gap-2"
                    >
                      <Shield className="w-3.5 h-3.5" />
                      Switch to Admin View
                    </button>
                  )}

                  <div className="border-t border-[#F3EEFF] my-1" />

                  <button
                    type="button"
                    onClick={() => {
                      setShowUserDropdown(false);
                      logOutFirebase();
                      onLogout();
                    }}
                    className="w-full px-4 py-2 text-left font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
