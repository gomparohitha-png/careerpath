import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ShieldCheck, Heart, Sparkles, ArrowRight } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 animate-in fade-in duration-200">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-[#D4A017]">
          Our Educational Mission
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#2A1B4E]">
          About CareerPath: Plan • Learn • Grow
        </h1>
        <p className="text-sm text-[#6B5A99] leading-relaxed">
          Building genuine competence and real engineering discipline for B.Tech students worldwide.
        </p>
      </div>

      <div className="prose prose-sm text-[#4A3B6F] space-y-6 bg-white p-8 sm:p-12 rounded-3xl border border-[#E6DBFF] shadow-xs">
        <h3 className="text-lg font-bold text-[#2A1B4E]">The Problem with Traditional Placement Prep</h3>
        <p className="text-xs leading-relaxed text-[#6B5A99]">
          Most undergraduate engineering students face information overload: hundreds of YouTube roadmaps, conflicting advice, and habit trackers with manual checkmarks. When students can click "Done" without understanding the concept or writing real code, they build a false sense of security that breaks during corporate online assessments and technical interviews.
        </p>

        <h3 className="text-lg font-bold text-[#2A1B4E]">Our Core Conviction: Proof-of-Work</h3>
        <p className="text-xs leading-relaxed text-[#6B5A99]">
          CareerPath is built on a single, uncompromising principle: <strong>Progress must be proven.</strong>
        </p>
        <p className="text-xs leading-relaxed text-[#6B5A99]">
          You cannot tick a box. To complete a learning milestone, you must spend active time studying the vetted resource and pass a 5-question comprehension quiz. To complete a project milestone, our server inspects your public GitHub repository for actual commits and documentation.
        </p>

        <h3 className="text-lg font-bold text-[#2A1B4E]">Zero Fake Vanity Scores</h3>
        <p className="text-xs leading-relaxed text-[#6B5A99]">
          Every new student starts with 0 score and 0 days of streak. There are no pre-filled numbers or vanity leaderboards. When you see a 500-point badge or a 14-day streak on CareerPath, you know it was earned through verified engineering work.
        </p>
      </div>

      <div className="text-center pt-2">
        <Link
          to="/signup"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl text-xs font-bold text-[#2A1B4E] bg-gradient-to-r from-[#D4A017] to-[#F2C94C] hover:opacity-95 shadow-md"
        >
          <span>Join CareerPath Today</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
