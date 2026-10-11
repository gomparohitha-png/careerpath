import React, { useState, useEffect } from 'react';
import {
  Compass,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  BookOpen,
  Briefcase,
  Layers,
  Clock,
  Code,
  GraduationCap,
  Target,
  CheckCircle2,
  Plus,
  X,
  Languages,
  Award,
  Calendar,
  AlertCircle
} from 'lucide-react';
import {
  Branch,
  CareerGoal,
  DailyStudyTime,
  SkillLevel,
  EducationLevel,
  CurrentSituation
} from '../types/index.ts';

interface OnboardingModalProps {
  initialName?: string;
  initialEmail?: string;
  isFullPage?: boolean;
  onComplete: (data: {
    name: string;
    email: string;
    educationLevel: EducationLevel;
    branch: Branch;
    year: number;
    semester: number;
    graduationYear?: string;
    careerGoal: CareerGoal;
    currentSituation: CurrentSituation;
    preferredLanguage?: string;
    interests: string[];
    currentSkills: { name: string; level: SkillLevel }[];
    dailyStudyTime: DailyStudyTime;
    existingExperience?: {
      projects?: string;
      certifications?: string;
      workExperience?: string;
      examsCompleted?: string;
    };
  }) => Promise<void>;
}

const EDUCATION_LEVELS: { id: EducationLevel; label: string; desc: string }[] = [
  { id: 'B.Tech pursuing', label: 'B.Tech (Pursuing)', desc: 'Currently enrolled in an undergraduate engineering program' },
  { id: 'B.Tech completed', label: 'B.Tech (Completed)', desc: 'Graduate seeking placements, jobs, or higher studies' },
  { id: 'Other undergraduate degree', label: 'Other Undergraduate', desc: 'B.Sc, BCA, B.Com, or other bachelor degree' },
  { id: 'Postgraduate student', label: 'Postgraduate Student', desc: 'M.Tech, MCA, M.Sc student' },
  { id: 'Postgraduate completed', label: 'Postgraduate Completed', desc: 'Master’s graduate preparing for industry or research' },
  { id: 'Other completed education', label: 'Other Completed Education', desc: 'Diploma, self-taught, or career transitioner' }
];

const BRANCHES: Branch[] = ['CSE', 'IT', 'ECE', 'EEE', 'Mechanical', 'Civil', 'Other'];

const CAREER_GOALS: { id: CareerGoal; label: string; desc: string }[] = [
  { id: 'Software Development', label: 'Software Development', desc: 'Full-stack, Backend, Frontend, and Mobile software engineering' },
  { id: 'AI and Data Science', label: 'AI & Data Science', desc: 'Machine Learning, Deep Learning, Data Analytics, and LLM Engineering' },
  { id: 'Cybersecurity', label: 'Cybersecurity', desc: 'Network security, ethical hacking, SOC analysis, and penetration testing' },
  { id: 'Core Engineering', label: 'Core Engineering', desc: 'VLSI, Embedded Systems, Automotive, Robotics, Structural & Civil' },
  { id: 'Government Jobs', label: 'Government Jobs (PSU/UPSC)', desc: 'ISRO, BARC, DRDO, IOCL, ONGC, SSC-JE, and Indian Engineering Services' },
  { id: 'GATE and Higher Studies', label: 'GATE & Higher Studies', desc: 'M.Tech at IITs/NITs, MS in US/Europe, or doctoral research' },
  { id: 'MBA', label: 'MBA & Techno-Management', desc: 'CAT/GMAT preparation, product management, and management consulting' },
  { id: 'Research', label: 'Scientific Research & R&D', desc: 'Academic publications, laboratory research, and PhD fellowships' },
  { id: 'Entrepreneurship', label: 'Entrepreneurship & Startups', desc: 'Founding tech startups, MVP building, and product development' },
  { id: 'Immediate Employment', label: 'Immediate Employment', desc: 'Fastest pathway to securing an entry-level offer or campus placement' },
  { id: 'Exploring Career Options', label: 'Exploring Career Options', desc: 'Discover high-demand tracks and align with personal strengths' }
];

const SITUATIONS: { id: CurrentSituation; label: string; icon: string }[] = [
  { id: 'Beginner', label: 'Absolute Beginner — Just starting out', icon: '🌱' },
  { id: 'Learning skills', label: 'Learning foundational skills & coursework', icon: '📚' },
  { id: 'Building projects', label: 'Building portfolio projects', icon: '🛠️' },
  { id: 'Searching for internships', label: 'Searching for summer/industrial internships', icon: '💼' },
  { id: 'Preparing for placements', label: 'Preparing for campus / off-campus placement drives', icon: '🎯' },
  { id: 'Recently graduated', label: 'Recently graduated — actively upskilling', icon: '🎓' },
  { id: 'Searching for a job', label: 'Actively searching for full-time job offers', icon: '🚀' },
  { id: 'Preparing for higher studies', label: 'Preparing for GATE / GRE / CAT / MS admissions', icon: '📖' }
];

const POPULAR_SKILLS = [
  'C / C++',
  'Python',
  'Java',
  'JavaScript',
  'TypeScript',
  'React',
  'Node.js',
  'SQL',
  'Git & GitHub',
  'Data Structures & Algorithms',
  'HTML & CSS',
  'Linux',
  'Docker',
  'MATLAB',
  'AutoCAD',
  'Embedded C',
  'Machine Learning Basics'
];

const COMMON_INTERESTS = [
  'Web Development',
  'Competitive Programming',
  'System Design',
  'Machine Learning & AI',
  'Cloud & DevOps',
  'Cybersecurity',
  'Mobile App Development',
  'Robotics & IoT',
  'Open Source Software',
  'Core Engineering Design',
  'GATE / PSU Exams',
  'Fintech & Startups'
];

const STUDY_TIMES: { id: DailyStudyTime; label: string; sub: string }[] = [
  { id: '30 min', label: '30 Minutes / day', sub: 'Light & steady pacing' },
  { id: '1 hr', label: '1 Hour / day', sub: 'Balanced college workload (Recommended)' },
  { id: '2 hrs', label: '2 Hours / day', sub: 'Accelerated skill development' },
  { id: '3+ hrs', label: '3+ Hours / day', sub: 'Intensive placement & hackathon sprint' }
];

const LANGUAGES = [
  'English',
  'Hinglish (Hindi + English)',
  'Hindi',
  'Telugu',
  'Tamil',
  'Kannada',
  'Bengali',
  'Marathi'
];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  initialName = '',
  initialEmail = '',
  isFullPage = false,
  onComplete
}) => {
  // Wizard state: 1 to 10
  const [step, setStep] = useState(1);
  const totalSteps = 10;

  // Form State
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [educationLevel, setEducationLevel] = useState<EducationLevel>('B.Tech pursuing');
  const [branch, setBranch] = useState<Branch>('CSE');
  const [year, setYear] = useState<number>(2);
  const [semester, setSemester] = useState<number>(4);
  const [graduationYear, setGraduationYear] = useState<string>('2027');
  const [careerGoal, setCareerGoal] = useState<CareerGoal>('Software Development');
  const [currentSituation, setCurrentSituation] = useState<CurrentSituation>('Learning skills');
  const [currentSkills, setCurrentSkills] = useState<{ name: string; level: SkillLevel }[]>([
    { name: 'C / C++', level: 'Intermediate' },
    { name: 'Data Structures & Algorithms', level: 'Beginner' }
  ]);
  const [customSkillInput, setCustomSkillInput] = useState('');
  const [interests, setInterests] = useState<string[]>(['Web Development', 'Competitive Programming']);
  const [dailyStudyTime, setDailyStudyTime] = useState<DailyStudyTime>('1 hr');
  const [preferredLanguage, setPreferredLanguage] = useState<string>('English');
  const [projectsExp, setProjectsExp] = useState('');
  const [certificationsExp, setCertificationsExp] = useState('');
  const [examsExp, setExamsExp] = useState('');

  // Loading animation state
  const [isBuildingRoadmap, setIsBuildingRoadmap] = useState(false);
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);

  const loadingMessages = [
    'Understanding your current skills...',
    'Analyzing your career goal...',
    'Finding your next learning steps...',
    'Synthesizing projects & practice plan...',
    'Building your personalized roadmap...'
  ];

  useEffect(() => {
    let interval: any;
    if (isBuildingRoadmap) {
      interval = setInterval(() => {
        setLoadingMsgIndex(prev => (prev + 1) % loadingMessages.length);
      }, 1600);
    }
    return () => clearInterval(interval);
  }, [isBuildingRoadmap]);

  const handleToggleSkill = (skillName: string) => {
    const existing = currentSkills.find(s => s.name === skillName);
    if (existing) {
      setCurrentSkills(prev => prev.filter(s => s.name !== skillName));
    } else {
      setCurrentSkills(prev => [...prev, { name: skillName, level: 'Beginner' }]);
    }
  };

  const handleUpdateSkillLevel = (skillName: string, level: SkillLevel) => {
    setCurrentSkills(prev =>
      prev.map(s => (s.name === skillName ? { ...s, level } : s))
    );
  };

  const handleAddCustomSkill = () => {
    if (!customSkillInput.trim()) return;
    const trimmed = customSkillInput.trim();
    if (!currentSkills.some(s => s.name.toLowerCase() === trimmed.toLowerCase())) {
      setCurrentSkills(prev => [...prev, { name: trimmed, level: 'Beginner' }]);
    }
    setCustomSkillInput('');
  };

  const handleToggleInterest = (interest: string) => {
    if (interests.includes(interest)) {
      setInterests(prev => prev.filter(i => i !== interest));
    } else {
      setInterests(prev => [...prev, interest]);
    }
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsBuildingRoadmap(true);
    try {
      await onComplete({
        name: name.trim() || 'Engineering Student',
        email: email.trim(),
        educationLevel,
        branch,
        year: educationLevel === 'B.Tech completed' ? 4 : year,
        semester: educationLevel === 'B.Tech completed' ? 8 : semester,
        graduationYear,
        careerGoal,
        currentSituation,
        preferredLanguage,
        interests,
        currentSkills,
        dailyStudyTime,
        existingExperience: {
          projects: projectsExp.trim() || undefined,
          certifications: certificationsExp.trim() || undefined,
          examsCompleted: examsExp.trim() || undefined
        }
      });
    } catch (err) {
      console.error('Failed to complete onboarding:', err);
      setIsBuildingRoadmap(false);
    }
  };

  if (isBuildingRoadmap) {
    return (
      <div className={`${isFullPage ? 'min-h-[80vh]' : 'fixed inset-0 z-50 bg-[#0B0D17]/80 backdrop-blur-md'} flex items-center justify-center p-4`}>
        <div className="bg-[#121626] border border-[#232A42] rounded-3xl p-8 max-w-md w-full text-center shadow-2xl relative overflow-hidden">
          {/* Glowing background halo */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#D4A017]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-[#4F46E5]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="w-20 h-20 mx-auto mb-6 relative flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-[#232A42] border-t-[#D4A017] animate-spin" />
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#D4A017] to-[#B3830E] flex items-center justify-center text-white shadow-lg">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
          </div>

          <h3 className="text-xl font-bold text-white mb-2">Generating Your AI Career Roadmap</h3>
          <p className="text-sm text-gray-400 mb-6">
            Analyzing your academic stage, target goal, and skills...
          </p>

          <div className="bg-[#0B0D17] border border-[#232A42] rounded-2xl p-4 flex items-center justify-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D4A017] animate-ping" />
            <span className="text-xs font-semibold text-[#E6C65B] tracking-wide transition-all">
              {loadingMessages[loadingMsgIndex]}
            </span>
          </div>

          <p className="text-[11px] text-gray-500 mt-6">
            Powered by Gemini AI • Adapting to {dailyStudyTime} daily study commitment
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${isFullPage ? 'w-full max-w-3xl mx-auto py-6' : 'fixed inset-0 z-50 bg-[#0B0D17]/85 backdrop-blur-sm overflow-y-auto p-4 flex items-center justify-center'}`}>
      <div className="bg-[#121626] border border-[#232A42] rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col my-auto">
        {/* Header with Progress Bar */}
        <div className="px-6 sm:px-8 pt-6 pb-4 border-b border-[#232A42] bg-[#0E1220]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#D4A017] to-[#B3830E] flex items-center justify-center text-white shadow-md">
                <Compass className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold text-white">CareerPath Onboarding</span>
            </div>
            <span className="text-xs font-semibold text-gray-400 bg-[#1A2035] px-3 py-1 rounded-full border border-[#283250]">
              Step {step} of {totalSteps}
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-[#1A2035] h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#D4A017] to-[#F3C64F] h-full rounded-full transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Body */}
        <div className="p-6 sm:p-8 flex-1 min-h-[360px] flex flex-col justify-center">
          {/* STEP 1: Name & Email */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#D4A017]">Personal Baseline</span>
                <h2 className="text-2xl font-bold text-white mt-1">Welcome! What should we call you?</h2>
                <p className="text-xs text-gray-400 mt-1">
                  We personalize your milestone notifications, project suggestions, and roadmap with this profile.
                </p>
              </div>

              <div className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Rohitha Gompa or Rahul Sharma"
                    className="w-full px-4 py-3 rounded-xl bg-[#0B0D17] border border-[#283250] text-sm text-white focus:outline-none focus:border-[#D4A017]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="student@college.edu or your personal email"
                    className="w-full px-4 py-3 rounded-xl bg-[#0B0D17] border border-[#283250] text-sm text-white focus:outline-none focus:border-[#D4A017]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Education Level */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#D4A017]">Academic Status</span>
                <h2 className="text-2xl font-bold text-white mt-1">What is your current education level?</h2>
                <p className="text-xs text-gray-400 mt-1">
                  Select your current degree or graduation status to tailor semester-specific milestones.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {EDUCATION_LEVELS.map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setEducationLevel(item.id)}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      educationLevel === item.id
                        ? 'border-[#D4A017] bg-[#D4A017]/10 text-white shadow-md'
                        : 'border-[#232A42] bg-[#0E1220] text-gray-300 hover:border-[#3A456B]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold text-white">{item.label}</span>
                      {educationLevel === item.id && (
                        <CheckCircle2 className="w-4 h-4 text-[#D4A017]" />
                      )}
                    </div>
                    <p className="text-[11px] text-gray-400 leading-relaxed">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: Branch / Discipline */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#D4A017]">Engineering Stream</span>
                <h2 className="text-2xl font-bold text-white mt-1">Which branch or degree are you in?</h2>
                <p className="text-xs text-gray-400 mt-1">
                  We adapt core engineering syllabus, competitive exams, and software crossover paths based on your branch.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {BRANCHES.map(b => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setBranch(b)}
                    className={`p-4 rounded-2xl border text-center transition-all ${
                      branch === b
                        ? 'border-[#D4A017] bg-[#D4A017]/15 text-white font-bold shadow-md scale-102'
                        : 'border-[#232A42] bg-[#0E1220] text-gray-300 hover:border-[#3A456B]'
                    }`}
                  >
                    <span className="text-base font-bold block mb-1">{b}</span>
                    <span className="text-[11px] text-gray-400">
                      {b === 'CSE' ? 'Computer Science' : b === 'IT' ? 'Information Tech' : b === 'ECE' ? 'Electronics & Comm.' : b === 'EEE' ? 'Electrical & Elect.' : b === 'Mechanical' ? 'Mechanical Eng.' : b === 'Civil' ? 'Civil Eng.' : 'Other Degree'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: Year, Semester & Graduation Year */}
          {step === 4 && (
            <div className="space-y-5">
              <div className="mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#D4A017]">Timeline & Runway</span>
                <h2 className="text-2xl font-bold text-white mt-1">Where are you in your academic timeline?</h2>
                <p className="text-xs text-gray-400 mt-1">
                  Helps us compute placement drive deadlines, semester exam windows, and remaining prep time.
                </p>
              </div>

              {educationLevel !== 'B.Tech completed' && educationLevel !== 'Postgraduate completed' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-2">Current Academic Year</label>
                    <div className="grid grid-cols-4 gap-2">
                      {[1, 2, 3, 4].map(y => (
                        <button
                          key={y}
                          type="button"
                          onClick={() => {
                            setYear(y);
                            setSemester(y * 2);
                          }}
                          className={`py-3 rounded-xl border text-center font-bold text-xs transition-all ${
                            year === y
                              ? 'border-[#D4A017] bg-[#D4A017] text-white shadow'
                              : 'border-[#232A42] bg-[#0E1220] text-gray-400 hover:border-[#3A456B]'
                          }`}
                        >
                          Year {y}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-2">Current Semester</label>
                    <div className="grid grid-cols-4 gap-2">
                      {[1, 2, 3, 4, 5, 6, 7, 8].slice((year - 1) * 2, year * 2).map(sem => (
                        <button
                          key={sem}
                          type="button"
                          onClick={() => setSemester(sem)}
                          className={`py-3 rounded-xl border text-center font-bold text-xs transition-all ${
                            semester === sem
                              ? 'border-[#D4A017] bg-[#D4A017] text-white shadow'
                              : 'border-[#232A42] bg-[#0E1220] text-gray-400 hover:border-[#3A456B]'
                          }`}
                        >
                          Sem {sem}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-2">Graduation / Expected Passing Year</label>
                <div className="grid grid-cols-5 gap-2">
                  {['2024', '2025', '2026', '2027', '2028'].map(gy => (
                    <button
                      key={gy}
                      type="button"
                      onClick={() => setGraduationYear(gy)}
                      className={`py-2.5 rounded-xl border text-center font-bold text-xs transition-all ${
                        graduationYear === gy
                          ? 'border-[#D4A017] bg-[#D4A017]/20 text-[#E6C65B] border-2 shadow'
                          : 'border-[#232A42] bg-[#0E1220] text-gray-400 hover:border-[#3A456B]'
                      }`}
                    >
                      {gy}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Career Goal */}
          {step === 5 && (
            <div className="space-y-4">
              <div className="mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#D4A017]">North Star Objective</span>
                <h2 className="text-2xl font-bold text-white mt-1">What is your primary career goal?</h2>
                <p className="text-xs text-gray-400 mt-1">
                  Choose your target destination. We construct your milestones, projects, and interview prep towards this goal.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[300px] overflow-y-auto pr-1">
                {CAREER_GOALS.map(cg => (
                  <button
                    key={cg.id}
                    type="button"
                    onClick={() => setCareerGoal(cg.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      careerGoal === cg.id
                        ? 'border-[#D4A017] bg-[#D4A017]/15 text-white shadow-md'
                        : 'border-[#232A42] bg-[#0E1220] text-gray-300 hover:border-[#3A456B]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-white">{cg.label}</span>
                      {careerGoal === cg.id && <CheckCircle2 className="w-3.5 h-3.5 text-[#D4A017]" />}
                    </div>
                    <p className="text-[10px] text-gray-400 line-clamp-1">{cg.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 6: Current Situation */}
          {step === 6 && (
            <div className="space-y-4">
              <div className="mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#D4A017]">Current Baseline</span>
                <h2 className="text-2xl font-bold text-white mt-1">Which option best describes your current situation?</h2>
                <p className="text-xs text-gray-400 mt-1">
                  This tells our AI whether to start from foundations or fast-forward straight to placement mock sprints.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {SITUATIONS.map(sit => (
                  <button
                    key={sit.id}
                    type="button"
                    onClick={() => setCurrentSituation(sit.id)}
                    className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                      currentSituation === sit.id
                        ? 'border-[#D4A017] bg-[#D4A017]/15 text-white shadow-md'
                        : 'border-[#232A42] bg-[#0E1220] text-gray-300 hover:border-[#3A456B]'
                    }`}
                  >
                    <span className="text-xl">{sit.icon}</span>
                    <span className="text-xs font-semibold">{sit.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 7: Current Skills & Proficiency */}
          {step === 7 && (
            <div className="space-y-4">
              <div className="mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#D4A017]">Skill Inventory</span>
                <h2 className="text-2xl font-bold text-white mt-1">Which skills do you already know?</h2>
                <p className="text-xs text-gray-400 mt-1">
                  Tap skills to add them. Set your proficiency (Beginner, Intermediate, Advanced) so we don't repeat basics.
                </p>
              </div>

              {/* Selected skills with level toggles */}
              {currentSkills.length > 0 && (
                <div className="p-3 bg-[#0B0D17] border border-[#232A42] rounded-2xl space-y-2 max-h-[140px] overflow-y-auto">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Your Selected Skills:</span>
                  <div className="flex flex-wrap gap-2">
                    {currentSkills.map(sk => (
                      <div
                        key={sk.name}
                        className="flex items-center gap-1.5 bg-[#1A2035] border border-[#3A456B] rounded-xl px-2.5 py-1 text-xs text-white"
                      >
                        <span className="font-semibold">{sk.name}</span>
                        <select
                          value={sk.level}
                          onChange={e => handleUpdateSkillLevel(sk.name, e.target.value as SkillLevel)}
                          className="bg-[#0E1220] text-[#D4A017] font-semibold text-[10px] rounded px-1 py-0.5 border border-[#3A456B] focus:outline-none"
                        >
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => handleToggleSkill(sk.name)}
                          className="text-gray-400 hover:text-red-400 ml-1"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular skill pills to tap */}
              <div>
                <span className="text-xs font-semibold text-gray-400 mb-2 block">Popular Skills (Tap to add):</span>
                <div className="flex flex-wrap gap-2 max-h-[110px] overflow-y-auto pr-1">
                  {POPULAR_SKILLS.map(sk => {
                    const isSelected = currentSkills.some(s => s.name === sk);
                    return (
                      <button
                        key={sk}
                        type="button"
                        onClick={() => handleToggleSkill(sk)}
                        className={`text-xs px-3 py-1.5 rounded-xl border transition-all ${
                          isSelected
                            ? 'bg-[#D4A017] border-[#D4A017] text-white font-bold'
                            : 'bg-[#0E1220] border-[#232A42] text-gray-300 hover:border-[#3A456B]'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}{sk}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Add custom skill input */}
              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  value={customSkillInput}
                  onChange={e => setCustomSkillInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCustomSkill();
                    }
                  }}
                  placeholder="Other skill (e.g. Flutter, Rust, Figma)..."
                  className="flex-1 px-3 py-2 rounded-xl bg-[#0B0D17] border border-[#283250] text-xs text-white focus:outline-none focus:border-[#D4A017]"
                />
                <button
                  type="button"
                  onClick={handleAddCustomSkill}
                  className="px-4 py-2 rounded-xl bg-[#232A42] hover:bg-[#2F395A] text-white text-xs font-bold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </div>
            </div>
          )}

          {/* STEP 8: Areas of Interest & Preferred Language */}
          {step === 8 && (
            <div className="space-y-4">
              <div className="mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#D4A017]">Curiosity & Communication</span>
                <h2 className="text-2xl font-bold text-white mt-1">What topics excite you most?</h2>
                <p className="text-xs text-gray-400 mt-1">
                  Select your interest areas and your preferred language for conceptual explanations.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-2">Areas of Interest (Select 2+)</label>
                <div className="flex flex-wrap gap-2 max-h-[140px] overflow-y-auto pr-1">
                  {COMMON_INTERESTS.map(interest => {
                    const isSel = interests.includes(interest);
                    return (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => handleToggleInterest(interest)}
                        className={`text-xs px-3 py-1.5 rounded-xl border transition-all ${
                          isSel
                            ? 'bg-[#4F46E5] border-[#4F46E5] text-white font-bold'
                            : 'bg-[#0E1220] border-[#232A42] text-gray-300 hover:border-[#3A456B]'
                        }`}
                      >
                        {isSel ? '★ ' : ''}{interest}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-2 flex items-center gap-1.5">
                  <Languages className="w-3.5 h-3.5 text-[#D4A017]" />
                  Preferred Explanation Language
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {LANGUAGES.map(lang => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => setPreferredLanguage(lang)}
                      className={`p-2.5 rounded-xl border text-xs text-center transition-all ${
                        preferredLanguage === lang
                          ? 'border-[#D4A017] bg-[#D4A017]/15 text-[#E6C65B] font-bold'
                          : 'border-[#232A42] bg-[#0E1220] text-gray-400 hover:border-[#3A456B]'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 9: Available Daily Study Time */}
          {step === 9 && (
            <div className="space-y-4">
              <div className="mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#D4A017]">Realistic Pacing</span>
                <h2 className="text-2xl font-bold text-white mt-1">How much time can you study daily?</h2>
                <p className="text-xs text-gray-400 mt-1">
                  Crucial for avoiding burnout. The AI scales weekly milestones to match your exact availability.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {STUDY_TIMES.map(st => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setDailyStudyTime(st.id)}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      dailyStudyTime === st.id
                        ? 'border-[#D4A017] bg-[#D4A017]/15 text-white shadow-md ring-1 ring-[#D4A017]'
                        : 'border-[#232A42] bg-[#0E1220] text-gray-300 hover:border-[#3A456B]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold text-white flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#D4A017]" />
                        {st.label}
                      </span>
                      {dailyStudyTime === st.id && <CheckCircle2 className="w-4 h-4 text-[#D4A017]" />}
                    </div>
                    <p className="text-[11px] text-gray-400">{st.sub}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 10: Optional Background (Projects, Certs, Work Experience) */}
          {step === 10 && (
            <div className="space-y-4">
              <div className="mb-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#D4A017]">Optional Background</span>
                  <span className="text-[11px] font-semibold text-gray-400 bg-[#1A2035] px-2 py-0.5 rounded">Optional</span>
                </div>
                <h2 className="text-2xl font-bold text-white mt-1">Any prior projects or certifications?</h2>
                <p className="text-xs text-gray-400 mt-1">
                  You can skip this, or mention existing projects so our AI can build upon your portfolio.
                </p>
              </div>

              <div className="space-y-3 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Existing Projects</label>
                  <input
                    type="text"
                    value={projectsExp}
                    onChange={e => setProjectsExp(e.target.value)}
                    placeholder="e.g. To-Do App in React, Arduino Smart Plant, or None"
                    className="w-full px-3 py-2 rounded-xl bg-[#0B0D17] border border-[#283250] text-xs text-white focus:outline-none focus:border-[#D4A017]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Certifications or Online Courses</label>
                  <input
                    type="text"
                    value={certificationsExp}
                    onChange={e => setCertificationsExp(e.target.value)}
                    placeholder="e.g. NPTEL Data Structures, Coursera Python, AWS Cloud Practitioner"
                    className="w-full px-3 py-2 rounded-xl bg-[#0B0D17] border border-[#283250] text-xs text-white focus:outline-none focus:border-[#D4A017]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Target Examinations or Completed Exams</label>
                  <input
                    type="text"
                    value={examsExp}
                    onChange={e => setExamsExp(e.target.value)}
                    placeholder="e.g. Aiming for GATE CS 2026, or TCS NQT, or None"
                    className="w-full px-3 py-2 rounded-xl bg-[#0B0D17] border border-[#283250] text-xs text-white focus:outline-none focus:border-[#D4A017]"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="px-6 sm:px-8 py-4 border-t border-[#232A42] bg-[#0E1220] flex items-center justify-between">
          <div>
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-2.5 rounded-xl border border-[#283250] text-xs font-bold text-gray-300 hover:text-white hover:bg-[#1A2035] flex items-center gap-1.5 transition-all"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
            ) : (
              <div />
            )}
          </div>

          <div className="flex items-center gap-3">
            {step === 10 && (
              <button
                type="button"
                onClick={handleSubmit}
                className="text-xs font-semibold text-gray-400 hover:text-white px-3 py-2"
              >
                Skip Optional Fields
              </button>
            )}

            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D4A017] to-[#B3830E] hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-[#D4A017]/20 flex items-center gap-2 transition-all cursor-pointer"
            >
              {step === totalSteps ? (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate My AI Roadmap
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
