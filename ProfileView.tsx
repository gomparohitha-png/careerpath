import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  CheckCircle2,
  AlertCircle,
  Clock,
  Briefcase,
  Compass,
  Home,
  Plus,
  Trash2,
  RefreshCw,
  Sparkles,
  Award,
  Layers,
  GraduationCap,
  Calendar,
  ChevronRight,
  ShieldCheck,
  Zap,
  Info,
  Check
} from 'lucide-react';
import { UserProfile, Branch, CareerGoal, DailyStudyTime, SkillLevel } from '../types/index.ts';
import { api } from '../lib/api.ts';
import { syncProfileToFirestore } from '../lib/firebase.ts';

interface ProfileViewProps {
  profile: UserProfile | null;
  onProfileUpdated: (updated: UserProfile, updatedUser?: any) => void;
}

const BRANCHES: { value: Branch; label: string; desc: string }[] = [
  { value: 'CSE', label: 'Computer Science & Engineering', desc: 'Software, algorithms, system design, cloud' },
  { value: 'IT', label: 'Information Technology', desc: 'Enterprise apps, networks, database architecture' },
  { value: 'ECE', label: 'Electronics & Communication', desc: 'VLSI, embedded systems, microcontrollers, IoT' },
  { value: 'EEE', label: 'Electrical & Electronics', desc: 'Power electronics, control systems, EV engineering' },
  { value: 'Mechanical', label: 'Mechanical Engineering', desc: 'CAD/CAM, thermodynamics, robotics, manufacturing' },
  { value: 'Civil', label: 'Civil Engineering', desc: 'Structural analysis, BIM, surveying, construction tech' },
  { value: 'Other', label: 'Other Engineering Branch', desc: 'Interdisciplinary & specialized engineering domains' }
];

const CAREER_GOALS: { value: CareerGoal; label: string; tag: string }[] = [
  { value: 'Software Development', label: 'Software Development (SDE)', tag: 'Frontend, Backend & Systems' },
  { value: 'AI/Data Science', label: 'AI & Data Science', tag: 'Machine Learning, Deep Learning, Analytics' },
  { value: 'Cybersecurity', label: 'Cybersecurity & Infosec', tag: 'Pen testing, cloud security, cryptography' },
  { value: 'Core Engineering', label: 'Core Engineering', tag: 'Domain-specific design, simulation, R&D' },
  { value: 'Government Jobs', label: 'Government Jobs & PSUs', tag: 'GATE, IES, state public service commissions' },
  { value: 'Higher Studies', label: 'Higher Studies (MS / M.Tech)', tag: 'Research, GRE, SOP, faculty publications' },
  { value: 'Exploring', label: 'Exploring Tech Pathways', tag: 'Broad foundational engineering exposure' }
];

const COMMON_INTERESTS = [
  'Web Development',
  'Competitive Coding (DSA)',
  'Embedded Systems',
  'Machine Learning',
  'Cloud & DevOps',
  'Robotics',
  'Mobile Apps',
  'GATE / PSU Exams',
  'System Architecture',
  'Open Source'
];

const POPULAR_SKILLS = [
  'C / C++',
  'Python',
  'Java',
  'JavaScript / TypeScript',
  'SQL',
  'Git & GitHub',
  'Linux',
  'React',
  'Data Structures',
  'Docker'
];

const STUDY_TIMES: DailyStudyTime[] = ['30 min', '1 hr', '2 hrs', '3+ hrs'];

export const ProfileView: React.FC<ProfileViewProps> = ({ profile, onProfileUpdated }) => {
  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [branch, setBranch] = useState<Branch>('CSE');
  const [year, setYear] = useState<number>(1);
  const [semester, setSemester] = useState<number>(1);
  const [careerGoal, setCareerGoal] = useState<CareerGoal>('Software Development');
  const [interests, setInterests] = useState<string[]>([]);
  const [currentSkills, setCurrentSkills] = useState<{ name: string; level: SkillLevel }[]>([]);
  const [dailyStudyTime, setDailyStudyTime] = useState<DailyStudyTime>('1 hr');
  const [timezone, setTimezone] = useState('Asia/Kolkata (IST, UTC+5:30)');
  const [preferredStudySlot, setPreferredStudySlot] = useState<'Morning (6 AM - 9 AM)' | 'Afternoon (1 PM - 4 PM)' | 'Evening (5 PM - 8 PM)' | 'Night Owl (9 PM - Midnight)'>('Evening (5 PM - 8 PM)');
  const [notificationAlerts, setNotificationAlerts] = useState(true);
  const [emailReminders, setEmailReminders] = useState(true);

  // UI / Status State
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState<SkillLevel>('Beginner');
  const [customInterest, setCustomInterest] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<{ title: string; details: string } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sync state whenever profile prop updates
  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setEmail(profile.email || '');
      setBranch(profile.branch || 'CSE');
      setYear(profile.year || 1);
      setSemester(profile.semester || 1);
      setCareerGoal(profile.careerGoal || 'Software Development');
      setInterests(profile.interests || ['Web Development', 'Competitive Coding (DSA)']);
      setCurrentSkills(profile.currentSkills || [{ name: 'C / C++', level: 'Intermediate' }]);
      setDailyStudyTime(profile.dailyStudyTime || '1 hr');
      setTimezone(profile.timezone || 'Asia/Kolkata (IST, UTC+5:30)');
      setPreferredStudySlot(profile.preferredStudySlot || 'Evening (5 PM - 8 PM)');
      setNotificationAlerts(profile.notificationAlerts ?? true);
      setEmailReminders(profile.emailReminders ?? true);
    }
  }, [profile]);

  // Check if form has unsaved modifications
  const isDirty = profile ? (
    name !== profile.name ||
    email !== profile.email ||
    branch !== profile.branch ||
    year !== profile.year ||
    semester !== profile.semester ||
    careerGoal !== profile.careerGoal ||
    dailyStudyTime !== profile.dailyStudyTime ||
    timezone !== (profile.timezone || 'Asia/Kolkata (IST, UTC+5:30)') ||
    preferredStudySlot !== (profile.preferredStudySlot || 'Evening (5 PM - 8 PM)') ||
    notificationAlerts !== (profile.notificationAlerts ?? true) ||
    emailReminders !== (profile.emailReminders ?? true) ||
    JSON.stringify(interests) !== JSON.stringify(profile.interests) ||
    JSON.stringify(currentSkills) !== JSON.stringify(profile.currentSkills)
  ) : false;

  const handleReset = () => {
    if (profile) {
      setName(profile.name || '');
      setEmail(profile.email || '');
      setBranch(profile.branch || 'CSE');
      setYear(profile.year || 1);
      setSemester(profile.semester || 1);
      setCareerGoal(profile.careerGoal || 'Software Development');
      setInterests(profile.interests || []);
      setCurrentSkills(profile.currentSkills || []);
      setDailyStudyTime(profile.dailyStudyTime || '1 hr');
      setTimezone(profile.timezone || 'Asia/Kolkata (IST, UTC+5:30)');
      setPreferredStudySlot(profile.preferredStudySlot || 'Evening (5 PM - 8 PM)');
      setNotificationAlerts(profile.notificationAlerts ?? true);
      setEmailReminders(profile.emailReminders ?? true);
      setErrorMsg(null);
    }
  };

  const handleAddSkill = () => {
    const trimmed = newSkillName.trim();
    if (!trimmed) return;
    if (currentSkills.some(s => s.name.toLowerCase() === trimmed.toLowerCase())) {
      setErrorMsg(`Skill "${trimmed}" is already in your skills list.`);
      return;
    }
    setCurrentSkills([...currentSkills, { name: trimmed, level: newSkillLevel }]);
    setNewSkillName('');
    setErrorMsg(null);
  };

  const handleRemoveSkill = (idx: number) => {
    setCurrentSkills(currentSkills.filter((_, i) => i !== idx));
  };

  const handleToggleInterest = (item: string) => {
    if (interests.includes(item)) {
      setInterests(interests.filter(i => i !== item));
    } else {
      setInterests([...interests, item]);
    }
  };

  const handleAddCustomInterest = () => {
    const trimmed = customInterest.trim();
    if (trimmed && !interests.includes(trimmed)) {
      setInterests([...interests, trimmed]);
      setCustomInterest('');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    // Validation
    if (!name.trim()) {
      setErrorMsg('Full Name cannot be empty.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setIsSaving(true);
    try {
      const res = await api.saveProfile({
        name: name.trim(),
        email: email.trim(),
        branch,
        year: Number(year),
        semester: Number(semester),
        careerGoal,
        interests,
        currentSkills,
        dailyStudyTime,
        timezone,
        preferredStudySlot,
        notificationAlerts,
        emailReminders
      });

      setSuccessMsg({
        title: 'Profile Updated & Engineering Roadmap Re-calibrated!',
        details: `Your profile has been saved. The 4-year curriculum and top navigation have been adapted for B.Tech ${branch} • Year ${year} (Semester ${semester}) • Goal: ${careerGoal}.`
      });

      onProfileUpdated(res.profile, res.user);

      // Cloud Persistence: Synchronize with Firestore
      try {
        await syncProfileToFirestore(res.profile);
      } catch (firestoreErr) {
        console.warn('Note: Profile synced locally; Firestore cloud backup log:', firestoreErr);
      }

      // Auto dismiss success toast after 7s
      setTimeout(() => {
        setSuccessMsg(null);
      }, 7000);
    } catch (err: any) {
      console.error('Profile update failed:', err);
      setErrorMsg(err.message || 'Failed to update profile. Please verify all fields and try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* 1. PROFESSIONAL BREADCRUMB & HEADER */}
      <div>
        <nav className="flex items-center gap-2 text-xs text-[#7D6B9E] mb-3">
          <Link
            to="/"
            className="flex items-center gap-1 hover:text-[#2A1B4E] transition-colors"
            title="Public Home Page"
          >
            <Home className="w-3.5 h-3.5 text-[#8E68CD]" />
            <span>Home</span>
          </Link>
          <ChevronRight className="w-3 h-3 text-[#C8BEDD]" />
          <Link to="/dashboard" className="hover:text-[#2A1B4E] transition-colors">
            Dashboard
          </Link>
          <ChevronRight className="w-3 h-3 text-[#C8BEDD]" />
          <span className="font-semibold text-[#2A1B4E]">Profile & Settings</span>
        </nav>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E6DBFF]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F3EEFF] border border-[#D8CFEA] text-xs font-semibold text-[#3B2A6B]">
              <Sparkles className="w-3.5 h-3.5 text-[#D4A017]" />
              <span>Personal Engineering Roadmap Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#2A1B4E] mt-2">
              Student Profile & Adaptation Rules
            </h1>
            <p className="text-xs sm:text-sm text-[#6B5A99] mt-1 max-w-2xl">
              Updating your branch, year, semester, or career ambition immediately re-calibrates your 4-year syllabus, priority tasks, and top navigation links.
            </p>
          </div>

          {/* Quick status chip */}
          <div className="flex items-center gap-2">
            {isDirty ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-800 text-xs font-bold animate-pulse">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Unsaved Changes
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                Profile Synchronized
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 2. SUCCESS FEEDBACK BANNER */}
      {successMsg && (
        <div className="p-4 sm:p-5 rounded-2xl bg-[#F0FDF4] border border-emerald-300 shadow-xs flex items-start gap-3.5 animate-in slide-in-from-top-2 duration-200">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-emerald-900">{successMsg.title}</h4>
            <p className="text-xs text-emerald-800 leading-relaxed">{successMsg.details}</p>
          </div>
        </div>
      )}

      {/* 3. ERROR FEEDBACK BANNER */}
      {errorMsg && (
        <div className="p-4 sm:p-5 rounded-2xl bg-rose-50 border border-rose-300 shadow-xs flex items-start gap-3.5 animate-in slide-in-from-top-2 duration-200">
          <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-rose-900">Profile Update Note</h4>
            <p className="text-xs text-rose-800 leading-relaxed">{errorMsg}</p>
          </div>
        </div>
      )}

      {/* 4. LIVE STUDENT PREVIEW CARD */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-[#F3EEFF] via-[#FAF8FF] to-[#E6DBFF] border border-[#E6DBFF] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#3B2A6B] to-[#51368F] flex items-center justify-center text-white text-xl font-extrabold shadow-md">
              {name ? name[0].toUpperCase() : 'S'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-[#2A1B4E]">{name || 'Your Name'}</h3>
                <span className="px-2 py-0.5 rounded-md bg-white border border-[#D8CFEA] text-[10px] font-bold text-[#6540AB]">
                  B.Tech {branch}
                </span>
              </div>
              <p className="text-xs text-[#6B5A99] font-medium mt-0.5">{email || 'student@university.edu'}</p>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#3B2A6B] bg-white/80 px-2.5 py-0.5 rounded-lg border border-[#D8CFEA]">
                  <GraduationCap className="w-3 h-3 text-[#D4A017]" />
                  Year {year} · Sem {semester}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#3B2A6B] bg-white/80 px-2.5 py-0.5 rounded-lg border border-[#D8CFEA]">
                  <Briefcase className="w-3 h-3 text-[#8E68CD]" />
                  Track: {careerGoal}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#3B2A6B] bg-white/80 px-2.5 py-0.5 rounded-lg border border-[#D8CFEA]">
                  <Clock className="w-3 h-3 text-[#D4A017]" />
                  {dailyStudyTime} / day
                </span>
              </div>
            </div>
          </div>

          <div className="text-left sm:text-right shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E6DBFF]/60">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#7D6B9E]">Roadmap Scope</span>
            <div className="text-xs font-bold text-[#2A1B4E] mt-0.5">Year {year} Milestones Active</div>
            <div className="text-[11px] text-[#8E68CD] mt-0.5">Auto-checks configured</div>
          </div>
        </div>
      </div>

      {/* 5. MAIN CONFIGURATION FORM */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Student Identity */}
        <div className="p-6 rounded-3xl bg-white border border-[#E6DBFF] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#F3EEFF]">
            <h3 className="text-sm font-bold text-[#2A1B4E] uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4 text-[#8E68CD]" />
              <span>1. Student Identity & Contact</span>
            </h3>
            <span className="text-[10px] font-semibold text-[#7D6B9E]">Used on verified certificates & resume</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#3B2A6B] mb-1.5">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Rohit Verma"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8CFEA] focus:border-[#8E68CD] focus:ring-2 focus:ring-[#E6DBFF] text-xs font-medium text-[#2A1B4E] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#3B2A6B] mb-1.5">
                College or Personal Email <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="e.g. rohit@careerpath.edu"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8CFEA] focus:border-[#8E68CD] focus:ring-2 focus:ring-[#E6DBFF] text-xs font-medium text-[#2A1B4E] transition-all"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Academic Standing */}
        <div className="p-6 rounded-3xl bg-white border border-[#E6DBFF] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#F3EEFF]">
            <h3 className="text-sm font-bold text-[#2A1B4E] uppercase tracking-wider flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-[#D4A017]" />
              <span>2. Academic Branch & Standing</span>
            </h3>
            <span className="text-[10px] font-semibold text-[#7D6B9E]">Calibrates curriculum syllabus</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#3B2A6B] mb-1.5">
                Engineering Branch <span className="text-rose-500">*</span>
              </label>
              <select
                value={branch}
                onChange={e => setBranch(e.target.value as Branch)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8CFEA] focus:border-[#8E68CD] focus:ring-2 focus:ring-[#E6DBFF] text-xs font-medium text-[#2A1B4E] bg-white transition-all"
              >
                {BRANCHES.map(b => (
                  <option key={b.value} value={b.value}>
                    {b.value} - {b.label}
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-[#7D6B9E] mt-1">
                {BRANCHES.find(b => b.value === branch)?.desc}
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#3B2A6B] mb-1.5">
                Current Academic Year <span className="text-rose-500">*</span>
              </label>
              <select
                value={year}
                onChange={e => {
                  const y = Number(e.target.value);
                  setYear(y);
                  setSemester((y - 1) * 2 + 1);
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8CFEA] focus:border-[#8E68CD] focus:ring-2 focus:ring-[#E6DBFF] text-xs font-medium text-[#2A1B4E] bg-white transition-all"
              >
                {[1, 2, 3, 4].map(y => (
                  <option key={y} value={y}>
                    Year {y} {y === 1 ? '(Foundations)' : y === 2 ? '(Practical Skills)' : y === 3 ? '(Industry & Projects)' : '(Placement Prep)'}
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-[#7D6B9E] mt-1">Expands this year in your roadmap.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#3B2A6B] mb-1.5">
                Current Semester <span className="text-rose-500">*</span>
              </label>
              <select
                value={semester}
                onChange={e => setSemester(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8CFEA] focus:border-[#8E68CD] focus:ring-2 focus:ring-[#E6DBFF] text-xs font-medium text-[#2A1B4E] bg-white transition-all"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                  <option key={s} value={s}>Semester {s}</option>
                ))}
              </select>
              <p className="text-[10px] text-[#7D6B9E] mt-1">Synchronized with academic schedule.</p>
            </div>
          </div>
        </div>

        {/* Section 3: Career Ambition & Study Cadence */}
        <div className="p-6 rounded-3xl bg-white border border-[#E6DBFF] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#F3EEFF]">
            <h3 className="text-sm font-bold text-[#2A1B4E] uppercase tracking-wider flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-[#8E68CD]" />
              <span>3. Target Career Goal & Daily Study Pace</span>
            </h3>
            <span className="text-[10px] font-semibold text-[#7D6B9E]">Adapts top navigation and focus tasks</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#3B2A6B] mb-1.5">
                Primary Career Goal <span className="text-rose-500">*</span>
              </label>
              <select
                value={careerGoal}
                onChange={e => setCareerGoal(e.target.value as CareerGoal)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8CFEA] focus:border-[#8E68CD] focus:ring-2 focus:ring-[#E6DBFF] text-xs font-medium text-[#2A1B4E] bg-white transition-all"
              >
                {CAREER_GOALS.map(g => (
                  <option key={g.value} value={g.value}>
                    {g.label}
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-[#7D6B9E] mt-1">
                {CAREER_GOALS.find(g => g.value === careerGoal)?.tag}
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#3B2A6B] mb-1.5">
                Daily Study Availability <span className="text-rose-500">*</span>
              </label>
              <select
                value={dailyStudyTime}
                onChange={e => setDailyStudyTime(e.target.value as DailyStudyTime)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8CFEA] focus:border-[#8E68CD] focus:ring-2 focus:ring-[#E6DBFF] text-xs font-medium text-[#2A1B4E] bg-white transition-all"
              >
                {STUDY_TIMES.map(t => (
                  <option key={t} value={t}>
                    {t} per day {t === '30 min' ? '(Light track, 2 tasks/week)' : t === '1 hr' ? '(Standard pace, 3 tasks/week)' : '(Intensive track, 4+ tasks/week)'}
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-[#7D6B9E] mt-1">Limits "This week's focus" so you avoid burnout.</p>
            </div>
          </div>
        </div>

        {/* Section 4: Focus Interests */}
        <div className="p-6 rounded-3xl bg-white border border-[#E6DBFF] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#F3EEFF]">
            <h3 className="text-sm font-bold text-[#2A1B4E] uppercase tracking-wider flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#D4A017]" />
              <span>4. Engineering Interests & Focus Domains</span>
            </h3>
            <span className="text-[10px] font-semibold text-[#7D6B9E]">Select multiple chips</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {COMMON_INTERESTS.map(item => {
              const selected = interests.includes(item);
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => handleToggleInterest(item)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    selected
                      ? 'bg-[#3B2A6B] text-white shadow-xs'
                      : 'bg-[#FAF8FF] text-[#4A3B6F] border border-[#E6DBFF] hover:border-[#8E68CD]'
                  }`}
                >
                  {selected && <Check className="w-3 h-3 text-[#F2C94C]" />}
                  <span>{item}</span>
                </button>
              );
            })}
          </div>

          {/* Add custom interest */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="text"
              placeholder="Add specialized interest (e.g. Quantum Computing, FPGA, Web3)..."
              value={customInterest}
              onChange={e => setCustomInterest(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddCustomInterest();
                }
              }}
              className="px-3.5 py-2 rounded-xl border border-[#D8CFEA] text-xs flex-1 text-[#2A1B4E]"
            />
            <button
              type="button"
              onClick={handleAddCustomInterest}
              className="px-4 py-2 rounded-xl text-xs font-bold text-[#3B2A6B] bg-[#F3EEFF] hover:bg-[#E6DBFF] transition-colors"
            >
              + Add Focus
            </button>
          </div>
        </div>

        {/* Section 5: Current Skills Inventory */}
        <div className="p-6 rounded-3xl bg-white border border-[#E6DBFF] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#F3EEFF]">
            <h3 className="text-sm font-bold text-[#2A1B4E] uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#8E68CD]" />
              <span>5. Technical Skills & Proficiency Levels</span>
            </h3>
            <span className="text-[10px] font-semibold text-[#7D6B9E]">Compared against industry benchmarks</span>
          </div>

          {currentSkills.length === 0 ? (
            <div className="p-4 rounded-xl bg-[#FAF8FF] border border-dashed border-[#D8CFEA] text-center text-xs text-[#7D6B9E]">
              No skills added yet. Use the selector below or pick from recommended skills.
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {currentSkills.map((sk, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#FAF8FF] border border-[#E6DBFF] text-xs shadow-2xs group"
                >
                  <span className="font-bold text-[#2A1B4E]">{sk.name}</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                    sk.level === 'Advanced'
                      ? 'bg-emerald-100 text-emerald-800'
                      : sk.level === 'Intermediate'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-indigo-100 text-indigo-800'
                  }`}>
                    {sk.level}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(idx)}
                    className="text-slate-400 hover:text-rose-600 transition-colors ml-1 p-0.5"
                    title="Remove skill"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Quick suggestions */}
          <div className="pt-2">
            <span className="text-[11px] font-bold text-[#7D6B9E] uppercase tracking-wider">Quick Add Popular Skills:</span>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {POPULAR_SKILLS.filter(s => !currentSkills.some(cs => cs.name.toLowerCase() === s.toLowerCase())).slice(0, 6).map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setCurrentSkills([...currentSkills, { name: s, level: 'Beginner' }])}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-medium text-[#6540AB] bg-[#F3EEFF] hover:bg-[#E6DBFF] transition-colors"
                >
                  + {s}
                </button>
              ))}
            </div>
          </div>

          {/* Add skill row */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-2 border-t border-[#F3EEFF]">
            <input
              type="text"
              placeholder="Enter skill name (e.g. Flutter, Kubernetes, PyTorch)..."
              value={newSkillName}
              onChange={e => setNewSkillName(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSkill();
                }
              }}
              className="px-3.5 py-2.5 rounded-xl border border-[#D8CFEA] text-xs flex-1 text-[#2A1B4E]"
            />
            <select
              value={newSkillLevel}
              onChange={e => setNewSkillLevel(e.target.value as SkillLevel)}
              className="px-3.5 py-2.5 rounded-xl border border-[#D8CFEA] text-xs bg-white font-medium text-[#2A1B4E]"
            >
              <option value="Beginner">Beginner (Foundational)</option>
              <option value="Intermediate">Intermediate (Hands-on)</option>
              <option value="Advanced">Advanced (Production-ready)</option>
            </select>
            <button
              type="button"
              onClick={handleAddSkill}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-[#3B2A6B] hover:bg-[#2A1B4E] transition-colors shrink-0 shadow-xs"
            >
              + Add Skill
            </button>
          </div>
        </div>

        {/* Section 6: Timezone & Schedule Preferences */}
        <div className="p-6 rounded-3xl bg-white border border-[#E6DBFF] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#F3EEFF]">
            <h3 className="text-sm font-bold text-[#2A1B4E] uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#D4A017]" />
              <span>6. Timezone & Study Schedule Preferences</span>
            </h3>
            <span className="text-[10px] font-semibold text-[#7D6B9E]">Calculates daily streak reset times</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#3B2A6B] mb-1.5">
                Your Primary Timezone
              </label>
              <select
                value={timezone}
                onChange={e => setTimezone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8CFEA] focus:border-[#8E68CD] focus:ring-2 focus:ring-[#E6DBFF] text-xs font-medium text-[#2A1B4E] bg-white transition-all"
              >
                <option value="Asia/Kolkata (IST, UTC+5:30)">Asia/Kolkata (IST, UTC+5:30) - Indian Standard Time</option>
                <option value="Asia/Dubai (GST, UTC+4:00)">Asia/Dubai (GST, UTC+4:00) - Gulf Standard Time</option>
                <option value="Asia/Singapore (SGT, UTC+8:00)">Asia/Singapore (SGT, UTC+8:00) - Singapore Standard Time</option>
                <option value="Europe/London (GMT/BST, UTC+0:00)">Europe/London (GMT/BST, UTC+0:00) - Western Europe</option>
                <option value="America/New_York (EST/EDT, UTC-5:00)">America/New_York (EST/EDT, UTC-5:00) - Eastern Time</option>
                <option value="America/Los_Angeles (PST/PDT, UTC-8:00)">America/Los_Angeles (PST/PDT, UTC-8:00) - Pacific Time</option>
              </select>
              <p className="text-[10px] text-[#7D6B9E] mt-1">Midnight cutoff in this timezone calculates streak resets and freeze activations.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#3B2A6B] mb-1.5">
                Preferred Study Slot
              </label>
              <select
                value={preferredStudySlot}
                onChange={e => setPreferredStudySlot(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8CFEA] focus:border-[#8E68CD] focus:ring-2 focus:ring-[#E6DBFF] text-xs font-medium text-[#2A1B4E] bg-white transition-all"
              >
                <option value="Morning (6 AM - 9 AM)">Morning (6 AM - 9 AM)</option>
                <option value="Afternoon (1 PM - 4 PM)">Afternoon (1 PM - 4 PM)</option>
                <option value="Evening (5 PM - 8 PM)">Evening (5 PM - 8 PM)</option>
                <option value="Night Owl (9 PM - Midnight)">Night Owl (9 PM - Midnight)</option>
              </select>
              <p className="text-[10px] text-[#7D6B9E] mt-1">Calibrates when the Weekly Planner suggests study blocks.</p>
            </div>
          </div>

          <div className="pt-3 border-t border-[#F3EEFF] grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="flex items-center gap-2.5 text-xs text-[#2A1B4E] cursor-pointer">
              <input
                type="checkbox"
                checked={notificationAlerts}
                onChange={e => setNotificationAlerts(e.target.checked)}
                className="rounded border-[#D8CFEA] text-[#6540AB] focus:ring-[#8E68CD]"
              />
              <span>In-app streak freeze reminders & milestone deadlines</span>
            </label>

            <label className="flex items-center gap-2.5 text-xs text-[#2A1B4E] cursor-pointer">
              <input
                type="checkbox"
                checked={emailReminders}
                onChange={e => setEmailReminders(e.target.checked)}
                className="rounded border-[#D8CFEA] text-[#6540AB] focus:ring-[#8E68CD]"
              />
              <span>Email notification digests for verified completions</span>
            </label>
          </div>
        </div>

        {/* 6. ACTION BAR */}
        <div className="sticky bottom-4 z-20 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-[#E6DBFF] shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-[#6B5A99]">
            <Info className="w-4 h-4 text-[#D4A017] shrink-0" />
            <span>
              {isDirty ? 'You have unsaved changes. Click save to re-calibrate your roadmap.' : 'All profile fields are currently up to date.'}
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            {isDirty && (
              <button
                type="button"
                onClick={handleReset}
                disabled={isSaving}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#6B5A99] hover:text-[#2A1B4E] hover:bg-[#F3EEFF] transition-colors"
              >
                Discard Changes
              </button>
            )}

            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl text-xs font-extrabold text-[#2A1B4E] bg-gradient-to-r from-[#D4A017] via-[#F2C94C] to-[#D4A017] hover:opacity-95 shadow-md flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isSaving ? 'animate-spin' : ''}`} />
              <span>{isSaving ? 'Re-calibrating Roadmap...' : 'Save Profile & Adapt Roadmap'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
