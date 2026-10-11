import React from 'react';
import { Link } from 'react-router-dom';
import {
  Award,
  Flame,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Info,
  BookOpen,
  FolderGit2,
  Zap,
  FileText,
  Briefcase,
  Home
} from 'lucide-react';

export const ScoringPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-200">
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
          <span className="font-semibold text-[#2A1B4E]">How Scoring Works</span>
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
      <div className="text-center space-y-3 pb-4 border-b border-[#E6DBFF]">
        <span className="text-xs font-bold uppercase tracking-wider text-[#D4A017] flex items-center justify-center gap-1.5">
          <Award className="w-4 h-4" />
          Server-Authoritative Evaluation Rubric
        </span>
        <h1 className="text-3xl font-black text-[#2A1B4E]">
          How Scoring & Streaks Work
        </h1>
        <p className="text-xs sm:text-sm text-[#6B5A99] max-w-lg mx-auto">
          Complete transparency. Points and streak days grow solely through verified engineering activity.
        </p>
      </div>

      {/* Important Disclaimer Card */}
      <div className="p-6 rounded-3xl bg-[#FFFDF5] border border-[#F2C94C] text-[#805E00] flex items-start gap-3.5 shadow-xs">
        <Info className="w-5 h-5 text-[#D4A017] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h3 className="font-bold text-sm text-[#2A1B4E]">
            Notice Regarding Campus Placement Readiness
          </h3>
          <p className="text-xs text-[#805E00] leading-relaxed">
            Your readiness score and student level reflect rigorous curriculum completion, verifiable GitHub code commits, and graded assessments. While high scores correlate strongly with placement performance, they represent personal preparedness benchmarks and are never presented as a guarantee of recruitment selection or job offer issuance.
          </p>
        </div>
      </div>

      {/* 1. Point Values Table */}
      <div className="p-8 rounded-3xl bg-white border border-[#E6DBFF] shadow-xs space-y-6">
        <h2 className="text-base font-bold text-[#2A1B4E] uppercase tracking-wider">
          1. Verified Point Allocation Rubric
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              cat: 'Learning Milestones',
              pts: '+10 pts',
              rule: 'Active time tracking (min 45s, pauses on blur) + passing 5-question check quiz (>=60%)',
              icon: BookOpen
            },
            {
              cat: 'Practice Assessments',
              pts: '+15 to +25 pts',
              rule: 'Graded by server: 70%=15 pts, 80%=20 pts, 90%+=25 pts with attempt logging',
              icon: Zap
            },
            {
              cat: 'Project Milestone',
              pts: '+30 pts',
              rule: 'Public GitHub repository verified with >= threshold commits and README.md',
              icon: FolderGit2
            },
            {
              cat: 'Capstone Complete',
              pts: '+100 pts',
              rule: 'End-to-end repository with all feature milestones, benchmarks, and deployment',
              icon: Award
            },
            {
              cat: 'Resume Validation',
              pts: '+50 pts',
              rule: 'Validated required sections: Education, >=3 skills, and >=2 detailed projects',
              icon: FileText
            },
            {
              cat: 'Internship Application',
              pts: '+20 pts',
              rule: 'Recorded authentic company application with role, date, and pipeline tracking',
              icon: Briefcase
            }
          ].map(item => {
            const Icon = item.icon;
            return (
              <div key={item.cat} className="p-4 rounded-2xl bg-[#FAF8FF] border border-[#E6DBFF] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-[#2A1B4E] flex items-center gap-2">
                    <Icon className="w-4 h-4 text-[#8E68CD]" />
                    {item.cat}
                  </span>
                  <span className="font-mono font-bold text-[#D4A017]">{item.pts}</span>
                </div>
                <p className="text-xs text-[#6B5A99] leading-relaxed">{item.rule}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Streak & Freeze Shield Mechanics */}
      <div className="p-8 rounded-3xl bg-white border border-[#E6DBFF] shadow-xs space-y-4">
        <h2 className="text-base font-bold text-[#2A1B4E] uppercase tracking-wider flex items-center gap-2">
          <Flame className="w-5 h-5 text-[#D4A017]" />
          2. Streak & Streak Freeze Shield Rules
        </h2>
        <ul className="space-y-3 text-xs text-[#6B5A99] leading-relaxed list-disc list-inside">
          <li>
            <strong className="text-[#2A1B4E]">Starts Strictly at 0:</strong> We never award participation streaks on signup. A streak day registers only when at least one verified milestone occurs on that calendar date.
          </li>
          <li>
            <strong className="text-[#2A1B4E]">Server-Side Timezone Synchronization:</strong> Day boundaries are logged in accordance with your declared active student timezone to ensure fairness across colleges.
          </li>
          <li>
            <strong className="text-[#2A1B4E]">Earned Weekly Streak Freeze:</strong> Consistent study unlocks 1 streak freeze per week. If unexpected lab exams or travel cause you to miss a day, the freeze shields your streak from resetting.
          </li>
        </ul>
      </div>

      {/* 3. Level Progression */}
      <div className="p-8 rounded-3xl bg-white border border-[#E6DBFF] shadow-xs space-y-4">
        <h2 className="text-base font-bold text-[#2A1B4E] uppercase tracking-wider">
          3. Student Level Hierarchy
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {[
            { lvl: 'Starter', pts: '0 – 99 pts', desc: 'Starting college journey' },
            { lvl: 'Explorer', pts: '100 – 249 pts', desc: 'Building core habits' },
            { lvl: 'Builder', pts: '250 – 499 pts', desc: 'Active projects in Git' },
            { lvl: 'Achiever', pts: '500 – 799 pts', desc: 'Internships & DSA' },
            { lvl: 'Placement Ready', pts: '800+ pts', desc: 'High campus caliber' }
          ].map(t => (
            <div key={t.lvl} className="p-4 rounded-2xl bg-[#FAF8FF] border border-[#E6DBFF] text-center space-y-1.5">
              <div className="font-bold text-xs text-[#2A1B4E]">{t.lvl}</div>
              <div className="text-xs font-mono font-bold text-[#D4A017]">{t.pts}</div>
              <div className="text-[10px] text-[#7D6B9E]">{t.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
