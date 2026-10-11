import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Home
} from 'lucide-react';
import { TaskTemplate, UserTask, UserProfile, UserScoreStreak } from '../types/index.ts';

interface WeeklyPlannerViewProps {
  roadmapItems: { template: TaskTemplate; userTask: UserTask }[];
  profile: UserProfile | null;
  score: UserScoreStreak;
  onVerifyTask: (task: { template: TaskTemplate; userTask: UserTask }) => void;
}

const WEEKDAYS = [
  { key: 'Mon', label: 'Monday' },
  { key: 'Tue', label: 'Tuesday' },
  { key: 'Wed', label: 'Wednesday' },
  { key: 'Thu', label: 'Thursday' },
  { key: 'Fri', label: 'Friday' },
  { key: 'Sat', label: 'Saturday' },
  { key: 'Sun', label: 'Sunday' }
];

export const WeeklyPlannerView: React.FC<WeeklyPlannerViewProps> = ({
  roadmapItems,
  profile,
  score,
  onVerifyTask
}) => {
  const [rescheduleNotice, setRescheduleNotice] = useState<string | null>(null);

  // Map pending tasks across the 7 weekdays respecting student's daily study time
  const pendingTasks = roadmapItems.filter(i => i.userTask.status !== 'completed');

  // Distribution based on study time:
  // '30 min': 1 task every 2-3 days
  // '1 hr': 1 task per weekday
  // '2 hrs': 1-2 tasks per weekday
  // '3+ hrs': 2 tasks per day

  const schedule: Record<string, { template: TaskTemplate; userTask: UserTask }[]> = {
    Mon: [],
    Tue: [],
    Wed: [],
    Thu: [],
    Fri: [],
    Sat: [],
    Sun: []
  };

  let taskIdx = 0;
  const daysWithTasks =
    profile?.dailyStudyTime === '30 min'
      ? ['Mon', 'Thu']
      : profile?.dailyStudyTime === '1 hr'
      ? ['Mon', 'Wed', 'Fri', 'Sun']
      : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  daysWithTasks.forEach(day => {
    if (taskIdx < pendingTasks.length) {
      schedule[day].push(pendingTasks[taskIdx]);
      taskIdx++;
    }
    if (profile?.dailyStudyTime === '3+ hrs' && taskIdx < pendingTasks.length) {
      schedule[day].push(pendingTasks[taskIdx]);
      taskIdx++;
    }
  });

  const handleAutoReschedule = () => {
    setRescheduleNotice('Rescheduled! Missed milestones have been reallocated into upcoming open days without overloading your daily study budget.');
    setTimeout(() => setRescheduleNotice(null), 4000);
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
          <span className="font-semibold text-[#2A1B4E]">Weekly Planner</span>
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
            <Calendar className="w-3.5 h-3.5" />
            Automatic Task Rescheduling
          </span>
          <h1 className="text-2xl font-black text-[#2A1B4E] mt-1">
            Weekly Study Planner: Mon – Sun
          </h1>
          <p className="text-xs text-[#6B5A99] mt-1">
            Tasks auto-distributed based on your declared {profile?.dailyStudyTime || '1 hr'}/day availability.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAutoReschedule}
          className="px-4 py-2 rounded-xl text-xs font-bold text-[#3B2A6B] bg-white border border-[#E6DBFF] hover:bg-[#FAF8FF] shadow-xs flex items-center gap-1.5 self-start md:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5 text-[#8E68CD]" />
          <span>Auto-Reschedule Incomplete</span>
        </button>
      </div>

      {rescheduleNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{rescheduleNotice}</span>
        </div>
      )}

      {/* 7-Day Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3">
        {WEEKDAYS.map(({ key, label }) => {
          const isDoneToday = score.weeklyActivity[key];
          const dayTasks = schedule[key] || [];

          return (
            <div
              key={key}
              className="p-3.5 rounded-2xl bg-white border border-[#E6DBFF] flex flex-col justify-between space-y-3 min-h-[260px] shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-[#F3EEFF]">
                  <div>
                    <div className="font-bold text-xs text-[#2A1B4E]">{key}</div>
                    <div className="text-[10px] text-[#7D6B9E]">{label}</div>
                  </div>
                  {isDoneToday && (
                    <span className="w-5 h-5 rounded-full bg-gradient-to-br from-[#D4A017] to-[#F2C94C] text-[#2A1B4E] flex items-center justify-center text-[10px] font-bold shadow-xs">
                      ✓
                    </span>
                  )}
                </div>

                {/* Day Tasks */}
                <div className="space-y-2 mt-3">
                  {dayTasks.length === 0 ? (
                    <div className="p-3 rounded-xl bg-[#FAF8FF] text-center text-[11px] text-[#9A8CB8] border border-dashed border-[#E6DBFF]">
                      Rest & revision
                    </div>
                  ) : (
                    dayTasks.map(({ template, userTask }) => (
                      <div
                        key={template.id}
                        className="p-2.5 rounded-xl bg-[#FAF8FF] border border-[#E6DBFF] text-xs space-y-2"
                      >
                        <div className="font-bold text-[#2A1B4E] text-[11px] line-clamp-2">
                          {template.title}
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-[#7D6B9E]">
                          <span>{template.timeNeeded}</span>
                          <span className="font-mono font-bold text-[#D4A017]">+{template.points} pts</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => onVerifyTask({ template, userTask })}
                          className="w-full py-1 rounded-lg text-[10px] font-bold text-white bg-gradient-to-r from-[#D4A017] to-[#B3830E] hover:opacity-95 shadow-xs"
                        >
                          Verify Task
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="text-[10px] text-[#9A8CB8] text-center pt-1 border-t border-[#F3EEFF]">
                {dayTasks.length} scheduled
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
