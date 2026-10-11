import React from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  ShieldCheck,
  CheckCircle2,
  FolderGit2,
  Zap,
  FileText,
  Briefcase,
  TrendingUp,
  Calendar,
  Clock,
  ArrowRight
} from 'lucide-react';

export const FeaturesPage: React.FC = () => {
  const featureList = [
    {
      title: 'Branch-Specific Year-Wise Roadmaps',
      description: 'Syllabus designed for your specific B.Tech engineering stream (CSE, IT, ECE, EEE, Mechanical, Civil) and career goals (Software, AI, Embedded, GATE/Govt, Higher Studies).',
      icon: Compass,
      points: ['Structured from Year 1 Foundations to Year 4 Placement Sprints', 'Current academic year expanded with focus view', 'Free high-quality vetted resource links']
    },
    {
      title: 'Automated Proof-of-Work Verification',
      description: 'No manual checkmarks. Tasks are verified by server-side algorithms evaluating genuine comprehension and active effort.',
      icon: ShieldCheck,
      points: ['Active reading tracker pauses when tab is hidden or blurred', '5-question comprehension check quiz with >=60% passing requirement', 'Anti-cheat cooldowns, score caps, and randomized question sequences']
    },
    {
      title: 'GitHub Milestone Verification',
      description: 'Submit public GitHub repositories for semester projects. The backend validates repository existence, commit histories, and documentation.',
      icon: FolderGit2,
      points: ['Direct inspection of commit count and README files', 'Step-by-step milestones (Architecture, Core logic, Deployment)', 'Awards 30 to 100 verified project points']
    },
    {
      title: 'Technical Practice & Mock Interviews',
      description: 'Comprehensive test banks for campus aptitude screens, linear data structures, trees, graphs, operating systems, and core domains.',
      icon: Zap,
      points: ['Timed practice tests with instant answers and explanations', 'Curated STAR-method behavioral and system design interview questions', 'Scores evaluated server-side (+15 to +25 points)']
    },
    {
      title: 'ATS Resume Builder with PDF Export',
      description: 'Format your academic credentials, verified skills, and project accomplishments into an industry-standard ATS layout.',
      icon: FileText,
      points: ['Server validates education, >=3 skills, and >=2 detailed projects', 'Single-click PDF export and print formatting', 'Awards 50 verified resume points']
    },
    {
      title: 'Verified Internship Opportunities',
      description: 'Discover verified company recruitment drives with explicit source listings and last-checked date stamps.',
      icon: Briefcase,
      points: ['Strictly authentic university programs from verified company portals', 'Track your personal application pipeline (Wishlist to Offer)', 'Awards 20 points for each logged application']
    },
    {
      title: 'Rule-Based Skill Gap Analyzer',
      description: 'Compare your declared skills against target job specifications to uncover high, medium, and low priority gaps.',
      icon: TrendingUp,
      points: ['High, medium, and low priority gap classifications', 'Direct practice exercises for each identified missing skill', 'Curated free study materials']
    },
    {
      title: 'Weekly Planner with Auto-Rescheduling',
      description: 'A study timetable that respects your daily available hours and automatically reallocates missed tasks.',
      icon: Calendar,
      points: ['Honors 30 min, 1 hr, 2 hrs, or 3+ hrs daily study budgets', 'One-click auto-reschedule to rebalance missed milestones', 'Mon-to-Sun verified activity tracking dots']
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 animate-in fade-in duration-200">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-[#D4A017]">
          Comprehensive Capabilities
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#2A1B4E]">
          Engineered for Rigorous Placement Preparation
        </h1>
        <p className="text-sm text-[#6B5A99] leading-relaxed">
          Every tool in CareerPath connects directly to server-authoritative verification, giving B.Tech students an authentic record of engineering growth.
        </p>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {featureList.map(feat => {
          const Icon = feat.icon;
          return (
            <div
              key={feat.title}
              className="p-8 rounded-3xl bg-white border border-[#E6DBFF] hover:border-[#8E68CD] shadow-xs space-y-4 transition-all"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#FAF8FF] border border-[#E6DBFF] flex items-center justify-center text-[#3B2A6B]">
                <Icon className="w-6 h-6 text-[#3B2A6B]" />
              </div>
              <h3 className="text-lg font-bold text-[#2A1B4E]">{feat.title}</h3>
              <p className="text-xs text-[#6B5A99] leading-relaxed">{feat.description}</p>
              <ul className="space-y-1.5 pt-2 border-t border-[#F3EEFF]">
                {feat.points.map((pt, idx) => (
                  <li key={idx} className="text-xs text-[#4A3B6F] flex items-start gap-2">
                    <span className="text-[#D4A017] font-bold">✓</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#3B2A6B] via-[#4A3482] to-[#2A1B4E] text-white text-center space-y-4">
        <h2 className="text-2xl font-bold">Ready to Experience Verified Learning?</h2>
        <p className="text-xs text-[#E6DBFF] max-w-md mx-auto">
          Sign up today and get your personalized roadmap ready in less than two minutes.
        </p>
        <Link
          to="/signup"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold text-[#2A1B4E] bg-gradient-to-r from-[#D4A017] to-[#F2C94C] hover:opacity-95 shadow-md"
        >
          <span>Get Started Free</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
