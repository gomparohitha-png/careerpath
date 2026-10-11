import React from 'react';
import {
  X,
  Award,
  Flame,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Info,
  Layers,
  BookOpen,
  FolderGit2,
  Zap,
  FileText,
  Briefcase
} from 'lucide-react';

interface ScoringExplainerModalProps {
  onClose: () => void;
}

export const ScoringExplainerModal: React.FC<ScoringExplainerModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2A1B4E]/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#E6DBFF] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#F3EEFF] bg-gradient-to-r from-[#FAF8FF] to-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#D4A017] to-[#F2C94C] flex items-center justify-center shadow-xs">
              <Award className="w-4 h-4 text-[#2A1B4E]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#2A1B4E]">How Scoring & Streaks Work</h3>
              <p className="text-xs text-[#6B5A99]">Complete transparency. Zero self-reported checkboxes.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#6B5A99] hover:bg-[#F3EEFF]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs text-[#4A3B6F]">
          {/* Important Placement Readiness Disclaimer */}
          <div className="p-4 rounded-xl bg-[#FFFDF5] border border-[#F2C94C]/70 text-[#805E00] flex items-start gap-2.5">
            <Info className="w-4 h-4 text-[#D4A017] shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold">Important Notice on Placement Readiness:</strong>
              Your readiness score and level measure objective progress and verified curriculum completion. It serves as a rigorous personal readiness benchmark, but is never presented as a contractual guarantee of campus selection, offer letters, or company shortlisting.
            </div>
          </div>

          {/* 1. Point Values */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#3B2A6B] uppercase tracking-wider">
              1. Verified Point Allocation
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                { cat: 'Learning Tasks', pts: '+10 pts', rule: 'Active time tracking (min 45s) + pass check quiz with >= 60%', icon: BookOpen },
                { cat: 'Practice Quizzes', pts: '+15 to +25 pts', rule: 'Graded by server: 70%=15, 80%=20, 90%+=25 pts', icon: Zap },
                { cat: 'Project Milestones', pts: '+30 pts', rule: 'Verified public GitHub repository with commits and README', icon: FolderGit2 },
                { cat: 'Capstone Complete', pts: '+100 pts', rule: 'Full project repo with all milestones and documentation', icon: Award },
                { cat: 'Resume Validation', pts: '+50 pts', rule: 'Education, >=3 skills, and >=2 detailed projects verified', icon: FileText },
                { cat: 'Internship Application', pts: '+20 pts', rule: 'Record company, role, date, and pipeline follow-up', icon: Briefcase }
              ].map(item => {
                const Icon = item.icon;
                return (
                  <div key={item.cat} className="p-3 rounded-xl bg-[#FAF8FF] border border-[#E6DBFF] space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#2A1B4E] flex items-center gap-1.5">
                        <Icon className="w-3.5 h-3.5 text-[#8E68CD]" />
                        {item.cat}
                      </span>
                      <span className="font-mono font-bold text-[#D4A017]">{item.pts}</span>
                    </div>
                    <p className="text-[11px] text-[#6B5A99]">{item.rule}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. Streak & Streak Freeze Rules */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#3B2A6B] uppercase tracking-wider flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-[#D4A017]" />
              2. Streak & Streak Freeze Mechanics
            </h4>
            <ul className="space-y-2 list-disc list-inside text-[#6B5A99]">
              <li>
                <strong>Starts at 0 Days:</strong> Your streak counter starts at 0 and increments only when at least one verified activity takes place on that day (server timestamp).
              </li>
              <li>
                <strong>Daily Cutoff:</strong> Days are recorded based on your active session timezone.
              </li>
              <li>
                <strong>Weekly Streak Freeze:</strong> You are granted 1 streak freeze per week earned through verified activity. If you miss a single day, the freeze shields your streak from resetting.
              </li>
            </ul>
          </div>

          {/* 3. Level Thresholds */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#3B2A6B] uppercase tracking-wider">
              3. Student Level Milestones
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
              {[
                { lvl: 'Starter', pts: '0 – 99 pts', desc: 'Starting college journey' },
                { lvl: 'Explorer', pts: '100 – 249 pts', desc: 'Building core habits' },
                { lvl: 'Builder', pts: '250 – 499 pts', desc: 'Active projects in Git' },
                { lvl: 'Achiever', pts: '500 – 799 pts', desc: 'Internships & DSA' },
                { lvl: 'Placement Ready', pts: '800+ pts', desc: 'High campus caliber' }
              ].map(t => (
                <div key={t.lvl} className="p-3 rounded-xl bg-white border border-[#E6DBFF] text-center space-y-1">
                  <div className="font-bold text-[#2A1B4E]">{t.lvl}</div>
                  <div className="text-[10px] font-mono text-[#D4A017] font-semibold">{t.pts}</div>
                  <div className="text-[10px] text-[#7D6B9E]">{t.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#F3EEFF] bg-[#FAF8FF] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#3B2A6B] hover:bg-[#2A1B4E] shadow-xs"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};
