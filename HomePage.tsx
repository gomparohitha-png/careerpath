import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Compass,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Flame,
  Award,
  Sparkles,
  BookOpen,
  FolderGit2,
  FileText,
  Briefcase,
  Zap,
  Layers,
  ChevronRight
} from 'lucide-react';
import { User } from '../../types/index.ts';

interface HomePageProps {
  user: User | null;
}

export const HomePage: React.FC<HomePageProps> = ({ user }) => {
  const navigate = useNavigate();

  const handleCtaClick = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/signup');
    }
  };

  return (
    <div className="space-y-20 py-8 animate-in fade-in duration-300">
      {/* ================= HERO SECTION ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-br from-[#F3EEFF] via-[#FAF8FF] to-[#E6DBFF] border border-[#E6DBFF] p-8 sm:p-14 lg:p-20 overflow-hidden shadow-xs">
          {/* Subtle gold ambient glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-b from-[#F2C94C]/20 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-[#D8CFEA] text-xs font-semibold text-[#3B2A6B] shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#D4A017]" />
              <span>For B.Tech Engineering Students (Year 1 to 4)</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#2A1B4E] tracking-tight leading-[1.1]">
              A Roadmap That Proves Your Work. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4A017] via-[#B3830E] to-[#6540AB]">
                Not Self-Reported Checkboxes.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#4A3B6F] leading-relaxed">
              <strong>CareerPath: Plan • Learn • Grow</strong> delivers a clear, year-wise syllabus for skills, GitHub projects, internships, and placement prep. Tasks are marked complete by the app only when you prove your work with active study, check quizzes, and real commits.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              {/* PRIMARY PROMINENT CTA */}
              <button
                type="button"
                onClick={handleCtaClick}
                className="px-8 py-4 rounded-2xl text-sm font-extrabold text-[#2A1B4E] bg-gradient-to-r from-[#D4A017] via-[#F2C94C] to-[#D4A017] hover:opacity-95 shadow-md flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5 active:scale-95"
              >
                <span>Build My Career Roadmap</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <Link
                to="/how-it-works"
                className="px-6 py-4 rounded-2xl text-xs font-bold text-[#3B2A6B] bg-white border border-[#D8CFEA] hover:bg-[#FAF8FF] shadow-xs flex items-center justify-center gap-2 transition-colors"
              >
                <span>How Verification Works</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Micro proof markers */}
            <div className="pt-6 flex flex-wrap items-center gap-6 text-xs text-[#6B5A99] font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Zero Fake Numbers (Starts at 0)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#D4A017]" />
                <span>GitHub & Quiz Proof Engines</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-[#D4A017]" />
                <span>Daily Streak & Freeze Shield</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= THREE CORE PILLARS ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#D4A017]">
            Core Architecture
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2A1B4E]">
            How CareerPath Transforms Campus Preparation
          </h2>
          <p className="text-xs sm:text-sm text-[#6B5A99]">
            Traditional apps let students click "Done" without doing the work. CareerPath requires verifiable evidence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 rounded-3xl bg-white border border-[#E6DBFF] shadow-xs space-y-4 hover:border-[#8E68CD] transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#F3EEFF] text-[#3B2A6B] flex items-center justify-center font-bold">
              <Layers className="w-6 h-6 text-[#3B2A6B]" />
            </div>
            <h3 className="text-lg font-bold text-[#2A1B4E]">1. Branch-Specific Roadmap</h3>
            <p className="text-xs text-[#6B5A99] leading-relaxed">
              Curriculum structured across 4 distinct academic years: Year 1 Foundations, Year 2 Practical Skills, Year 3 Industry Experience, and Year 4 Placement Prep. Tailored for CSE, IT, ECE, EEE, Mechanical, and Civil.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-[#E6DBFF] shadow-xs space-y-4 hover:border-[#8E68CD] transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#FFFDF5] text-[#D4A017] flex items-center justify-center font-bold border border-[#F2C94C]/70">
              <ShieldCheck className="w-6 h-6 text-[#D4A017]" />
            </div>
            <h3 className="text-lg font-bold text-[#2A1B4E]">2. Automated Verification</h3>
            <p className="text-xs text-[#6B5A99] leading-relaxed">
              Tasks unlock points only upon completion of verified checks: active reading time tracker (pauses when tab blurs), 5-question comprehension check quizzes, and public GitHub repository commit inspections.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-[#E6DBFF] shadow-xs space-y-4 hover:border-[#8E68CD] transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#FAF8FF] text-[#8E68CD] flex items-center justify-center font-bold border border-[#E6DBFF]">
              <Award className="w-6 h-6 text-[#8E68CD]" />
            </div>
            <h3 className="text-lg font-bold text-[#2A1B4E]">3. Honest Verified Metrics</h3>
            <p className="text-xs text-[#6B5A99] leading-relaxed">
              Streaks and scores start strictly at 0. Level thresholds (Starter, Explorer, Builder, Achiever, Placement Ready) reflect honest achievements stored securely on the server.
            </p>
          </div>
        </div>
      </section>

      {/* ================= 4-YEAR JOURNEY OVERVIEW ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-[#E6DBFF] shadow-xs space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#D4A017]">
                Milestone Continuum
              </span>
              <h2 className="text-2xl font-black text-[#2A1B4E] mt-1">
                Your 4-Year B.Tech Placement Progression
              </h2>
            </div>
            <button
              type="button"
              onClick={handleCtaClick}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#D4A017] to-[#B3830E] hover:opacity-95 shadow-xs self-start sm:self-auto"
            >
              Start Your Roadmap
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                yr: 'Year 1',
                title: 'Foundations & Git',
                desc: 'Git version control, C/C++ memory logic, algorithmic foundations, and quantitative aptitude basics.',
                color: 'from-[#8E68CD] to-[#6540AB]'
              },
              {
                yr: 'Year 2',
                title: 'Practical Skills & Systems',
                desc: 'Data structures, relational SQL databases, REST API design, microcontrollers/CAD, and Milestone 1 projects.',
                color: 'from-[#3B2A6B] to-[#51368F]'
              },
              {
                yr: 'Year 3',
                title: 'Industry & Internships',
                desc: 'Trees, graphs, dynamic programming, ATS resume construction, and authentic company internship applications.',
                color: 'from-[#D4A017] to-[#B3830E]'
              },
              {
                yr: 'Year 4',
                title: 'Placement Sprints & Capstone',
                desc: 'Timed aptitude elimination rounds, OS/DBMS core revisions, STAR behavioral mock interviews, and final deployment.',
                color: 'from-[#D4A017] to-[#F2C94C]'
              }
            ].map(item => (
              <div key={item.yr} className="p-5 rounded-2xl bg-[#FAF8FF] border border-[#E6DBFF] space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#8E68CD]">{item.yr}</span>
                  <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${item.color}`} />
                </div>
                <h4 className="text-sm font-bold text-[#2A1B4E]">{item.title}</h4>
                <p className="text-xs text-[#6B5A99] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CALL TO ACTION BANNER ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#3B2A6B] via-[#4A3482] to-[#2A1B4E] text-white text-center space-y-6 shadow-md">
          <h2 className="text-2xl sm:text-3xl font-extrabold max-w-xl mx-auto">
            Ready to Build a Career You Can Prove?
          </h2>
          <p className="text-xs sm:text-sm text-[#E6DBFF] max-w-lg mx-auto">
            Answer a few quick questions about your branch and career ambitions. CareerPath configures your personalized plan in seconds.
          </p>
          <button
            type="button"
            onClick={handleCtaClick}
            className="px-8 py-3.5 rounded-2xl text-xs font-extrabold text-[#2A1B4E] bg-gradient-to-r from-[#D4A017] via-[#F2C94C] to-[#D4A017] hover:opacity-95 shadow-md transition-all inline-flex items-center gap-2"
          >
            <span>Build My Career Roadmap</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};
