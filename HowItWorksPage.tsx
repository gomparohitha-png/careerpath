import React from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Github,
  Award,
  Flame,
  Zap,
  Lock
} from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: '7-Step Student Onboarding Gate',
      desc: 'Enter your engineering branch, current academic year, semester, career ambition, technical interests, and daily study budget. The platform configures a personalized 4-year curriculum roadmap.',
      badge: 'Tailored Adaptation'
    },
    {
      num: '02',
      title: 'Follow Your Weekly Focus',
      desc: 'Based on whether you can study 30 min, 1 hr, or 2+ hrs per day, the weekly planner schedules digestible milestones. Never get overwhelmed by 100 tutorials at once.',
      badge: 'Paced Execution'
    },
    {
      num: '03',
      title: 'Provide Verifiable Proof of Work',
      desc: 'No manual checkboxes exist. Open the reading resource while the active-time tracker runs (pauses if you switch tabs), pass the 5-question comprehension check quiz (>=60%), and submit public GitHub repositories with real commits.',
      badge: 'Automated Verification'
    },
    {
      num: '04',
      title: 'Grow Real Streak & Verified Score',
      desc: 'Earn 10 points for learning tasks, 15-25 for practice quizzes, 30 for project milestones, and 50 for resumes. Advance from Starter to Placement Ready with complete transparency.',
      badge: 'Zero Vanity Metrics'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 animate-in fade-in duration-200">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-[#D4A017]">
          Verification Mechanics
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#2A1B4E]">
          How CareerPath Works
        </h1>
        <p className="text-sm text-[#6B5A99] leading-relaxed">
          From first-time enrollment to campus placement readiness: an honest journey powered by server-side verification.
        </p>
      </div>

      {/* Step List */}
      <div className="space-y-6 max-w-4xl mx-auto">
        {steps.map(step => (
          <div
            key={step.num}
            className="p-8 rounded-3xl bg-white border border-[#E6DBFF] shadow-xs flex flex-col sm:flex-row items-start gap-6 hover:border-[#8E68CD] transition-all"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#3B2A6B] to-[#51368F] text-white flex items-center justify-center font-black text-xl shrink-0 shadow-xs">
              <span className="text-[#F2C94C]">{step.num}</span>
            </div>
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FAF8FF] text-[#8E68CD] border border-[#E6DBFF]">
                  {step.badge}
                </span>
                <h3 className="text-lg font-bold text-[#2A1B4E]">{step.title}</h3>
              </div>
              <p className="text-xs text-[#6B5A99] leading-relaxed">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Verification Invariants Callout */}
      <div className="p-8 rounded-3xl bg-[#FFFDF5] border border-[#F2C94C] max-w-4xl mx-auto space-y-4 text-xs text-[#805E00]">
        <div className="flex items-center gap-2 font-bold text-sm text-[#2A1B4E]">
          <ShieldCheck className="w-5 h-5 text-[#D4A017]" />
          <span>Anti-Cheat & Verification Guarantees</span>
        </div>
        <p className="leading-relaxed">
          The client interface cannot mark tasks as completed. Submissions are dispatched to the backend, which tests active dwell time, randomizes quiz questions, validates threshold bounds, enforces retry cooldowns, and inspects GitHub API repository commit trees.
        </p>
      </div>

      <div className="text-center pt-4">
        <Link
          to="/signup"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl text-xs font-bold text-[#2A1B4E] bg-gradient-to-r from-[#D4A017] to-[#F2C94C] hover:opacity-95 shadow-md"
        >
          <span>Build My Career Roadmap</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
