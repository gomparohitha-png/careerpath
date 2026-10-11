import React from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Award,
  Layers,
  Home
} from 'lucide-react';
import { UserProfile } from '../types/index.ts';

interface SkillGapViewProps {
  profile: UserProfile | null;
  onNavigateToTab: (tab: string) => void;
}

interface BenchmarkSkill {
  name: string;
  recommendedLevel: 'Intermediate' | 'Advanced';
  whyNeeded: string;
  exercise: string;
  freeResourceUrl: string;
  resourceName: string;
}

export const SkillGapView: React.FC<SkillGapViewProps> = ({ profile, onNavigateToTab }) => {
  const goal = profile?.careerGoal || 'Software Development';
  const declaredSkills = profile?.currentSkills || [];

  // Goal-based required benchmark skills
  const getGoalBenchmarks = (): BenchmarkSkill[] => {
    if (goal === 'Core Engineering' || profile?.branch === 'ECE') {
      return [
        {
          name: 'Circuit Analysis & Ohm\'s Law',
          recommendedLevel: 'Intermediate',
          whyNeeded: 'Fundamental circuit math tested in core electronics screening tests.',
          exercise: 'Simulate an op-amp non-inverting amplifier in Falstad and compute voltage gain.',
          freeResourceUrl: 'https://www.falstad.com/circuit/',
          resourceName: 'Falstad Circuit Simulator'
        },
        {
          name: 'Microcontrollers (C/C++)',
          recommendedLevel: 'Intermediate',
          whyNeeded: 'Hardware firms (TI, Qualcomm, Bosch) require register-level firmware proficiency.',
          exercise: 'Configure a hardware timer interrupt to toggle a pin without blocking delays.',
          freeResourceUrl: 'https://docs.espressif.com',
          resourceName: 'ESP-IDF Documentation'
        },
        {
          name: 'Git & GitHub',
          recommendedLevel: 'Intermediate',
          whyNeeded: 'Hardware HDL code and firmware repos require version-controlled releases.',
          exercise: 'Publish an Arduino/ESP32 repository with pin schematics in README.',
          freeResourceUrl: 'https://docs.github.com',
          resourceName: 'GitHub Official Guides'
        }
      ];
    } else if (goal === 'Government Jobs') {
      return [
        {
          name: 'Quantitative Problem Solving',
          recommendedLevel: 'Advanced',
          whyNeeded: 'GATE and PSU qualification exams heavily weigh speed numerical ability.',
          exercise: 'Solve 20 speed arithmetic problems on time-and-work and pipes-cisterns within 25 mins.',
          freeResourceUrl: 'https://indiabix.com',
          resourceName: 'IndiaBIX Quantitative Prep'
        },
        {
          name: 'Engineering Mathematics',
          recommendedLevel: 'Intermediate',
          whyNeeded: 'Differential equations, linear algebra, and probability form 15% of GATE marks.',
          exercise: 'Solve eigenvalues and matrix transformations for 3x3 systems.',
          freeResourceUrl: 'https://nptel.ac.in',
          resourceName: 'NPTEL Engineering Math'
        }
      ];
    } else {
      // Default Software Development & AI
      return [
        {
          name: 'Data Structures & Algorithms',
          recommendedLevel: 'Intermediate',
          whyNeeded: 'The foundational gatekeeper for software recruitment rounds and online assessments.',
          exercise: 'Implement Floyd\'s Tortoise and Hare algorithm to detect cycles in linked lists.',
          freeResourceUrl: 'https://neetcode.io/roadmap',
          resourceName: 'NeetCode DSA Roadmap'
        },
        {
          name: 'C / C++ or Java Core',
          recommendedLevel: 'Intermediate',
          whyNeeded: 'Object-Oriented Design and memory understanding evaluate low-level competence.',
          exercise: 'Implement a custom dynamic array class with memory reallocation logic.',
          freeResourceUrl: 'https://en.cppreference.com',
          resourceName: 'C++ Reference Docs'
        },
        {
          name: 'SQL & Relational Databases',
          recommendedLevel: 'Intermediate',
          whyNeeded: 'Nearly all backend systems and enterprise apps query relational databases.',
          exercise: 'Write a query using LEFT JOIN and GROUP BY with HAVING count criteria.',
          freeResourceUrl: 'https://sqlbolt.com',
          resourceName: 'SQLBolt Interactive'
        },
        {
          name: 'Web Application API Architecture',
          recommendedLevel: 'Intermediate',
          whyNeeded: 'Essential for shipping verifiable full-stack milestone projects.',
          exercise: 'Build an Express/FastAPI endpoint supporting GET and POST with validation.',
          freeResourceUrl: 'https://developer.mozilla.org',
          resourceName: 'MDN Web Docs API Guide'
        },
        {
          name: 'Git & GitHub',
          recommendedLevel: 'Intermediate',
          whyNeeded: 'Recruiters inspect commit histories and clean repository structure.',
          exercise: 'Initialize a repo, make 3 distinct branch commits, and resolve a merge conflict.',
          freeResourceUrl: 'https://docs.github.com',
          resourceName: 'GitHub Documentation'
        }
      ];
    }
  };

  const benchmarks = getGoalBenchmarks();

  // Determine priority gap for each benchmark
  const analyzedGaps = benchmarks.map(bm => {
    const matching = declaredSkills.find(
      s => s.name.toLowerCase().includes(bm.name.toLowerCase()) || bm.name.toLowerCase().includes(s.name.toLowerCase())
    );

    let priority: 'High' | 'Medium' | 'Low' = 'High';
    let statusLabel = 'Missing from Profile';

    if (matching) {
      if (matching.level === 'Advanced' || (matching.level === 'Intermediate' && bm.recommendedLevel === 'Intermediate')) {
        priority = 'Low';
        statusLabel = `Verified (${matching.level})`;
      } else {
        priority = 'Medium';
        statusLabel = `Foundation exists (${matching.level}), need ${bm.recommendedLevel}`;
      }
    }

    return {
      ...bm,
      priority,
      statusLabel,
      currentLevel: matching?.level || 'None'
    };
  });

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
          <span className="font-semibold text-[#2A1B4E]">Skill Gap Analyzer</span>
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
            <TrendingUp className="w-3.5 h-3.5" />
            Rule-Based Skill Benchmarking
          </span>
          <h1 className="text-2xl font-black text-[#2A1B4E] mt-1">
            Skill Gap Analyzer: {goal}
          </h1>
          <p className="text-xs text-[#6B5A99] mt-1">
            Compares your declared technical competencies against industry recruitment standards.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigateToTab('profile')}
          className="px-4 py-2 rounded-xl text-xs font-bold text-[#3B2A6B] bg-white border border-[#E6DBFF] hover:bg-[#FAF8FF] shadow-xs self-start md:self-auto"
        >
          Update My Skills
        </button>
      </div>

      {/* Priority Gap Cards */}
      <div className="space-y-4">
        {analyzedGaps.map(gap => {
          const isHigh = gap.priority === 'High';
          const isMedium = gap.priority === 'Medium';

          return (
            <div
              key={gap.name}
              className={`p-6 rounded-2xl border shadow-xs transition-all ${
                isHigh
                  ? 'bg-white border-amber-300 ring-1 ring-amber-100'
                  : isMedium
                  ? 'bg-white border-[#E6DBFF]'
                  : 'bg-[#FAFCFA] border-emerald-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                      isHigh
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : isMedium
                        ? 'bg-[#F3EEFF] text-[#3B2A6B] border border-[#E6DBFF]'
                        : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    }`}
                  >
                    {gap.priority} Priority Gap
                  </span>
                  <h3 className="text-base font-bold text-[#2A1B4E]">{gap.name}</h3>
                </div>

                <div className="text-xs text-[#6B5A99]">
                  Target: <strong className="text-[#3B2A6B]">{gap.recommendedLevel}</strong> (Current: {gap.currentLevel})
                </div>
              </div>

              <p className="text-xs text-[#6B5A99] mb-4">
                <strong>Why recruiters screen this: </strong>{gap.whyNeeded}
              </p>

              {/* Actionable Exercise and Free Resource */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-[#F3EEFF]">
                <div className="p-3 rounded-xl bg-[#FAF8FF] border border-[#E6DBFF] text-xs">
                  <span className="font-bold text-[#3B2A6B] block mb-1">
                    Recommended Practice Exercise:
                  </span>
                  <span className="text-[#4A3B6F]">{gap.exercise}</span>
                </div>

                <div className="p-3 rounded-xl bg-[#FFFDF5] border border-[#F2C94C]/70 text-xs flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[#805E00] block mb-0.5">
                      Curated Free Resource:
                    </span>
                    <span className="text-[#6B5A99]">{gap.resourceName}</span>
                  </div>
                  <a
                    href={gap.freeResourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-[#D4A017] hover:bg-[#B3830E] flex items-center gap-1 shadow-xs"
                  >
                    <span>Open</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
