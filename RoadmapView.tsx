import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronDown,
  ChevronUp,
  Clock,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  BookOpen,
  Calendar,
  Layers,
  Award,
  Home,
  MessageSquare,
  AlertTriangle,
  Send,
  Printer,
  Copy,
  Check,
  Target,
  Compass,
  Briefcase,
  GraduationCap,
  HelpCircle,
  FolderGit2,
  ListChecks,
  RefreshCw
} from 'lucide-react';
import {
  TaskTemplate,
  UserTask,
  UserProfile,
  AIRoadmap,
  AIRoadmapPhase
} from '../types/index.ts';
import { api } from '../lib/api.ts';
import { useFirebase } from '../context/FirebaseContext.tsx';

interface RoadmapViewProps {
  roadmapItems: { template: TaskTemplate; userTask: UserTask }[];
  profile: UserProfile | null;
  aiRoadmap?: AIRoadmap | null;
  onVerifyTask: (task: { template: TaskTemplate; userTask: UserTask }) => void;
  onNavigateToTab?: (tab: string) => void;
  onGenerateAIRoadmap?: () => Promise<void>;
  onRoadmapUpdated?: (roadmap: AIRoadmap) => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({
  roadmapItems,
  profile,
  aiRoadmap: propAiRoadmap,
  onVerifyTask,
  onNavigateToTab,
  onGenerateAIRoadmap,
  onRoadmapUpdated
}) => {
  const { saveAIRoadmap } = useFirebase();
  const [activeTab, setActiveTab] = useState<'ai_roadmap' | 'task_tracker'>('ai_roadmap');

  // AI Roadmap State
  const [aiRoadmap, setAiRoadmap] = useState<AIRoadmap | null>(propAiRoadmap || null);
  const [isLoadingRoadmap, setIsLoadingRoadmap] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingMessageIndex, setGeneratingMessageIndex] = useState(0);
  const [copiedSummary, setCopiedSummary] = useState(false);

  // Completed phases tracker in local storage for interactive satisfaction
  const [completedPhases, setCompletedPhases] = useState<Record<number, boolean>>({});

  // Expanded project drawer / folder view
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});

  // AI Mentor Chat Drawer
  const [isMentorOpen, setIsMentorOpen] = useState(false);
  const [mentorInput, setMentorInput] = useState('');
  const [mentorLoading, setMentorLoading] = useState(false);
  const [mentorMessages, setMentorMessages] = useState<{ sender: 'user' | 'assistant'; text: string; time: string }[]>([
    {
      sender: 'assistant',
      text: `Hello ${profile?.name || 'there'}! I'm your AI Career Mentor. Ask me anything about your personalized roadmap, such as how to balance Phase 1 with semester exams, which projects to build first, or what recruiters look for in ${profile?.branch || 'engineering'} interviews.`,
      time: 'Just now'
    }
  ]);

  // Loading animation cycle messages
  const generatingMessages = [
    'Understanding your current skills...',
    'Analyzing your career goal...',
    'Finding your next learning steps...',
    'Curating verified projects and free resources...',
    'Building your personalized roadmap...'
  ];

  useEffect(() => {
    let interval: any;
    if (isGenerating) {
      interval = setInterval(() => {
        setGeneratingMessageIndex(prev => (prev + 1) % generatingMessages.length);
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  // Load roadmap if not passed via props
  useEffect(() => {
    if (propAiRoadmap) {
      setAiRoadmap(propAiRoadmap);
    } else {
      loadRoadmapFromApi();
    }
  }, [propAiRoadmap]);

  const loadRoadmapFromApi = async () => {
    setIsLoadingRoadmap(true);
    try {
      const res = await api.getAIRoadmap();
      if (res.roadmap) {
        setAiRoadmap(res.roadmap);
        if (onRoadmapUpdated) onRoadmapUpdated(res.roadmap);
      }
    } catch (err) {
      console.warn('Could not fetch existing AI roadmap:', err);
    } finally {
      setIsLoadingRoadmap(false);
    }
  };

  const handleGenerateClick = async () => {
    setIsGenerating(true);
    try {
      const res = await api.generateAIRoadmap();
      if (res.roadmap) {
        setAiRoadmap(res.roadmap);
        if (onRoadmapUpdated) onRoadmapUpdated(res.roadmap);
        // Persist to Firestore if logged in
        await saveAIRoadmap(res.roadmap).catch(e => console.warn('Firestore roadmap sync:', e));
      }
    } catch (err) {
      console.error('Failed to generate AI roadmap:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const togglePhaseCompletion = (phaseNum: number) => {
    setCompletedPhases(prev => ({
      ...prev,
      [phaseNum]: !prev[phaseNum]
    }));
  };

  const toggleFolder = (key: string) => {
    setExpandedFolders(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSendMentorQuestion = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!mentorInput.trim() || mentorLoading) return;

    const questionText = mentorInput.trim();
    setMentorInput('');
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setMentorMessages(prev => [...prev, { sender: 'user', text: questionText, time: now }]);
    setMentorLoading(true);

    try {
      const res = await api.askAIMentor(questionText, `Current Career Goal: ${profile?.careerGoal}`);
      setMentorMessages(prev => [
        ...prev,
        {
          sender: 'assistant',
          text: res.answer,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      setMentorMessages(prev => [
        ...prev,
        {
          sender: 'assistant',
          text: 'I ran into a temporary connection issue. Please make sure your daily study block is protected and review Phase 1 milestones!',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setMentorLoading(false);
    }
  };

  const handleCopySummary = () => {
    if (!aiRoadmap) return;
    const text = `CAREERPATH AI ROADMAP: ${aiRoadmap.currentPosition.stageTitle} -> ${aiRoadmap.currentPosition.careerGoal}\n` +
      `Summary: ${aiRoadmap.currentPosition.summary}\n\n` +
      `TOP 3 ACTIONS:\n${aiRoadmap.topThreeActions.map((a, i) => `${i + 1}. ${a}`).join('\n')}\n\n` +
      `IMMEDIATE PLAN:\n- Today: ${aiRoadmap.immediateActionPlan.today}\n- This Week: ${aiRoadmap.immediateActionPlan.thisWeek}\n- This Month: ${aiRoadmap.immediateActionPlan.thisMonth}\n\n` +
      `PHASES:\n${aiRoadmap.phases.map(p => `Phase ${p.phaseNumber}: ${p.title} (${p.expectedDuration})\nSkills: ${p.skillsToLearn.join(', ')}\nProjects: ${p.projectsToBuild.map(pr => pr.title).join(', ')}`).join('\n\n')}`;

    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  // Group task verification items by year
  const currentYear = profile?.year || 1;
  const [expandedYears, setExpandedYears] = useState<Record<number, boolean>>({
    [currentYear]: true,
    1: currentYear === 1,
    2: currentYear === 2,
    3: currentYear === 3,
    4: currentYear === 4
  });

  const toggleYear = (y: number) => {
    setExpandedYears(prev => ({ ...prev, [y]: !prev[y] }));
  };

  const tasksByYear: Record<number, { template: TaskTemplate; userTask: UserTask }[]> = {
    1: [],
    2: [],
    3: [],
    4: []
  };

  roadmapItems.forEach(item => {
    const y = item.template.year || 1;
    if (tasksByYear[y]) {
      tasksByYear[y].push(item);
    }
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Top Banner / Navigation Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#121626] border border-[#232A42] rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-[#D4A017]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#D4A017] bg-[#D4A017]/10 px-2.5 py-0.5 rounded-full border border-[#D4A017]/20">
              Personalized Guidance Engine
            </span>
            {aiRoadmap && (
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                aiRoadmap.source === 'gemini' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
              }`}>
                {aiRoadmap.source === 'gemini' ? '✨ Powered by Gemini 3.8 Flash' : '📘 Curated Branch Curriculum'}
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Your Engineering Career Roadmap
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 max-w-xl">
            Tailored specifically for <strong className="text-white">{profile?.name || 'You'}</strong> ({profile?.branch || 'Engineering'}, {profile?.educationLevel || `Year ${profile?.year || 2}`}) aiming for <strong className="text-[#D4A017]">{profile?.careerGoal || 'Software Development'}</strong>.
          </p>
        </div>

        {/* Tab & Action Controls */}
        <div className="relative z-10 flex flex-wrap items-center gap-2.5">
          {/* Mode Switcher */}
          <div className="bg-[#0B0D17] border border-[#232A42] p-1 rounded-2xl flex items-center">
            <button
              onClick={() => setActiveTab('ai_roadmap')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'ai_roadmap'
                  ? 'bg-gradient-to-r from-[#D4A017] to-[#B3830E] text-white shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              AI Personalized Plan
            </button>
            <button
              onClick={() => setActiveTab('task_tracker')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'task_tracker'
                  ? 'bg-gradient-to-r from-[#D4A017] to-[#B3830E] text-white shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <ListChecks className="w-3.5 h-3.5" />
              Task Verifier ({roadmapItems.filter(i => i.userTask.status === 'completed').length}/{roadmapItems.length})
            </button>
          </div>

          {/* Regenerate AI Roadmap Button */}
          <button
            onClick={handleGenerateClick}
            disabled={isGenerating}
            className="px-4 py-2 rounded-2xl bg-[#1A2035] hover:bg-[#232A42] border border-[#3A456B] text-xs font-bold text-white flex items-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#D4A017] ${isGenerating ? 'animate-spin' : ''}`} />
            {aiRoadmap ? 'Regenerate / Adapt' : 'Generate AI Roadmap'}
          </button>

          {/* Ask AI Mentor button */}
          <button
            onClick={() => setIsMentorOpen(true)}
            className="px-3.5 py-2 rounded-2xl bg-[#4F46E5]/20 hover:bg-[#4F46E5]/30 border border-[#4F46E5]/40 text-xs font-bold text-indigo-300 flex items-center gap-1.5 transition-all shadow-sm"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Ask AI Mentor
          </button>
        </div>
      </div>

      {/* Loading Overlay when generating AI Roadmap */}
      {isGenerating && (
        <div className="bg-[#121626] border border-[#D4A017]/40 rounded-3xl p-8 text-center shadow-2xl relative overflow-hidden animate-pulse">
          <div className="w-16 h-16 mx-auto mb-4 relative flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-[#232A42] border-t-[#D4A017] animate-spin" />
            <Sparkles className="w-6 h-6 text-[#D4A017]" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">Synthesizing Your Custom Engineering Roadmap</h3>
          <p className="text-xs text-gray-400 mb-4">
            Evaluating your daily study commitment ({profile?.dailyStudyTime || '1 hr'}), current semester, and skill gaps...
          </p>
          <div className="inline-flex items-center gap-2.5 bg-[#0B0D17] border border-[#232A42] rounded-full px-4 py-2">
            <span className="w-2 h-2 rounded-full bg-[#D4A017] animate-ping" />
            <span className="text-xs font-semibold text-[#E6C65B]">
              {generatingMessages[generatingMessageIndex]}
            </span>
          </div>
        </div>
      )}

      {/* TAB 1: AI Personalized Roadmap View */}
      {activeTab === 'ai_roadmap' && (
        <>
          {aiRoadmap ? (
            <div className="space-y-8">
              {/* SECTION 1: YOUR CURRENT POSITION */}
              <div className="bg-[#121626] border border-[#232A42] rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#232A42] pb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#3B2A6B] to-[#5B3E9B] flex items-center justify-center text-white shadow-md">
                      <Compass className="w-5 h-5 text-[#E6C65B]" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4A017]">Section 1</span>
                      <h2 className="text-xl font-bold text-white">Your Current Position</h2>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopySummary}
                      className="px-3 py-1.5 rounded-xl bg-[#0B0D17] hover:bg-[#1A2035] border border-[#283250] text-xs font-semibold text-gray-300 hover:text-white flex items-center gap-1.5 transition-all"
                    >
                      {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedSummary ? 'Copied!' : 'Copy Summary'}
                    </button>
                    <button
                      onClick={() => window.print()}
                      className="px-3 py-1.5 rounded-xl bg-[#0B0D17] hover:bg-[#1A2035] border border-[#283250] text-xs font-semibold text-gray-300 hover:text-white flex items-center gap-1.5 transition-all"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      Print
                    </button>
                  </div>
                </div>

                {/* Stage Badge & Summary */}
                <div className="bg-[#0B0D17] border border-[#232A42] rounded-2xl p-5 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#D4A017]/15 text-[#E6C65B] border border-[#D4A017]/30">
                      Stage: {aiRoadmap.currentPosition.stageTitle}
                    </span>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/30">
                      Goal: {aiRoadmap.currentPosition.careerGoal}
                    </span>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Daily Pacing: {profile?.dailyStudyTime || '1 hr'}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                    {aiRoadmap.currentPosition.summary}
                  </p>
                </div>

                {/* Strengths & Skill Gaps Comparison Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Current Strengths */}
                  <div className="bg-[#0E1322] border border-[#1E2742] rounded-2xl p-5 space-y-3">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                      <CheckCircle2 className="w-4 h-4" />
                      Current Strengths & Existing Skills
                    </div>
                    <ul className="space-y-2">
                      {aiRoadmap.currentPosition.currentStrengths?.map((str, idx) => (
                        <li key={idx} className="text-xs text-gray-300 flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                          <span>{str}</span>
                        </li>
                      ))}
                    </ul>
                    {/* Existing skills pills */}
                    <div className="pt-2 flex flex-wrap gap-1.5">
                      {aiRoadmap.currentPosition.existingSkills?.map((sk, idx) => (
                        <span key={idx} className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-[#192238] text-gray-300 border border-[#283659]">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Important Skill Gaps */}
                  <div className="bg-[#17121C] border border-[#3E2536] rounded-2xl p-5 space-y-3">
                    <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                      <AlertTriangle className="w-4 h-4" />
                      Important Skill Gaps to Bridge
                    </div>
                    <ul className="space-y-2">
                      {aiRoadmap.currentPosition.importantSkillGaps?.map((gap, idx) => (
                        <li key={idx} className="text-xs text-gray-300 flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                          <span>{gap}</span>
                        </li>
                      ))}
                    </ul>
                    {/* Skills to improve pills */}
                    <div className="pt-2 flex flex-wrap gap-1.5">
                      {aiRoadmap.currentPosition.skillsToImprove?.map((sk, idx) => (
                        <span key={idx} className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-[#261726] text-amber-200 border border-[#482845]">
                          + {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: YOUR ROADMAP (PHASE CARDS) */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#D4A017] to-[#B3830E] flex items-center justify-center text-white shadow-md">
                      <Layers className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4A017]">Section 2</span>
                      <h2 className="text-xl font-bold text-white">Your Sequential Learning Phases</h2>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-gray-400">
                    {aiRoadmap.phases.length} Structured Phases
                  </span>
                </div>

                <div className="space-y-6">
                  {aiRoadmap.phases.map((phase) => {
                    const isDone = Boolean(completedPhases[phase.phaseNumber]);

                    return (
                      <div
                        key={phase.phaseNumber}
                        className={`bg-[#121626] border rounded-3xl p-6 sm:p-8 shadow-xl transition-all relative overflow-hidden ${
                          isDone
                            ? 'border-emerald-500/40 bg-[#0E181D]'
                            : 'border-[#232A42] hover:border-[#3A456B]'
                        }`}
                      >
                        {/* Phase Ribbon Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#232A42] pb-5 mb-6">
                          <div className="flex items-start sm:items-center gap-3">
                            <div className={`w-10 h-10 rounded-2xl font-bold text-sm flex items-center justify-center shrink-0 ${
                              isDone ? 'bg-emerald-500 text-white' : 'bg-[#D4A017] text-white shadow-md'
                            }`}>
                              {isDone ? <Check className="w-5 h-5" /> : phase.phaseNumber}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4A017]">
                                  Phase {phase.phaseNumber}
                                </span>
                                <span className="text-[10px] font-semibold text-gray-400 bg-[#0B0D17] px-2 py-0.5 rounded-full border border-[#232A42] flex items-center gap-1">
                                  <Clock className="w-3 h-3 text-[#D4A017]" />
                                  Duration: {phase.expectedDuration}
                                </span>
                              </div>
                              <h3 className="text-lg sm:text-xl font-bold text-white mt-0.5">
                                {phase.title}
                              </h3>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => togglePhaseCompletion(phase.phaseNumber)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                              isDone
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : 'bg-[#0B0D17] hover:bg-[#1A2035] text-gray-300 border border-[#283250]'
                            }`}
                          >
                            <CheckCircle2 className={`w-4 h-4 ${isDone ? 'text-emerald-400' : 'text-gray-500'}`} />
                            {isDone ? 'Phase Completed' : 'Mark Phase Done'}
                          </button>
                        </div>

                        {/* Phase Content Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                          {/* Column 1: Skills & Topics */}
                          <div className="space-y-4">
                            <div>
                              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-2">
                                Core Skills to Learn:
                              </span>
                              <div className="flex flex-wrap gap-1.5">
                                {phase.skillsToLearn.map((skill, sIdx) => (
                                  <span
                                    key={sIdx}
                                    className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#0B0D17] text-[#E6C65B] border border-[#232A42]"
                                  >
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div>
                              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-2">
                                High-Yield Topics:
                              </span>
                              <ul className="space-y-1.5">
                                {phase.topicsToStudy.map((topic, tIdx) => (
                                  <li key={tIdx} className="text-xs text-gray-300 flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4A017] mt-1.5 shrink-0" />
                                    <span>{topic}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Dependencies */}
                            {phase.dependencies && (
                              <div className="bg-[#0B0D17] p-3 rounded-xl border border-[#232A42] text-[11px] text-gray-400">
                                <span className="font-semibold text-gray-300 block mb-0.5">Prerequisites:</span>
                                {phase.dependencies}
                              </div>
                            )}
                          </div>

                          {/* Column 2: Free Learning Resources & Practice */}
                          <div className="space-y-4">
                            <div>
                              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-2">
                                Recommended Free Resources:
                              </span>
                              <div className="space-y-2">
                                {phase.freeResources.map((res, rIdx) => (
                                  <a
                                    key={rIdx}
                                    href={res.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2.5 rounded-xl bg-[#0B0D17] hover:bg-[#1A2035] border border-[#232A42] hover:border-[#3A456B] flex items-center justify-between transition-all group"
                                  >
                                    <div className="min-w-0 pr-2">
                                      <span className="text-xs font-bold text-white group-hover:text-[#D4A017] transition-colors block truncate">
                                        {res.title}
                                      </span>
                                      <span className="text-[10px] text-gray-400">
                                        Type: {res.type}
                                      </span>
                                    </div>
                                    <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#D4A017] shrink-0" />
                                  </a>
                                ))}
                              </div>
                            </div>

                            <div>
                              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-2">
                                Actionable Practice Drills:
                              </span>
                              <ul className="space-y-2">
                                {phase.practiceExercises.map((ex, eIdx) => (
                                  <li key={eIdx} className="text-xs text-gray-300 bg-[#0B0D17] p-2.5 rounded-xl border border-[#232A42] flex items-start gap-2">
                                    <Target className="w-3.5 h-3.5 text-[#D4A017] shrink-0 mt-0.5" />
                                    <span>{ex}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          {/* Column 3: Projects to Build & Verification */}
                          <div className="space-y-4">
                            <div>
                              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-2">
                                Portfolio Project to Build:
                              </span>
                              {phase.projectsToBuild.map((proj, pIdx) => {
                                const folderKey = `${phase.phaseNumber}_${pIdx}`;
                                const isExpanded = Boolean(expandedFolders[folderKey]);

                                return (
                                  <div
                                    key={pIdx}
                                    className="p-4 rounded-2xl bg-[#0B0D17] border border-[#283250] space-y-3"
                                  >
                                    <div className="flex items-start justify-between gap-2">
                                      <h4 className="text-xs font-bold text-white">
                                        {proj.title}
                                      </h4>
                                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 shrink-0">
                                        Project
                                      </span>
                                    </div>

                                    <p className="text-[11px] text-gray-400 leading-relaxed">
                                      {proj.description}
                                    </p>

                                    {/* Tech Stack */}
                                    <div className="flex flex-wrap gap-1">
                                      {proj.techStack.map((tech, tIdx) => (
                                        <span
                                          key={tIdx}
                                          className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#1A2035] text-indigo-300 border border-[#2F3A5C]"
                                        >
                                          {tech}
                                        </span>
                                      ))}
                                    </div>

                                    {/* Folder Structure Toggle */}
                                    {proj.folderStructure && (
                                      <div className="pt-1">
                                        <button
                                          type="button"
                                          onClick={() => toggleFolder(folderKey)}
                                          className="text-[10px] font-bold text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
                                        >
                                          <FolderGit2 className="w-3 h-3 text-[#D4A017]" />
                                          {isExpanded ? 'Hide Folder Architecture' : 'View Suggested Repo Structure'}
                                        </button>
                                        {isExpanded && (
                                          <pre className="mt-2 p-2.5 rounded-xl bg-[#07090F] border border-[#232A42] text-[10px] text-gray-300 font-mono overflow-x-auto whitespace-pre">
                                            {proj.folderStructure}
                                          </pre>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>

                            {/* Outcome & Completion Requirements */}
                            <div className="bg-[#0E1424] border border-[#1E2945] p-3.5 rounded-2xl space-y-2">
                              <div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                                  Expected Outcome:
                                </span>
                                <p className="text-xs text-gray-300 leading-relaxed mt-0.5">
                                  {phase.expectedOutcome}
                                </p>
                              </div>
                              <div className="border-t border-[#1E2945] pt-2">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4A017] block">
                                  Proof of Completion Criteria:
                                </span>
                                <p className="text-[11px] text-gray-400 mt-0.5">
                                  {phase.completionRequirements}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* SECTION 3: YOUR IMMEDIATE ACTION PLAN */}
              <div className="bg-[#121626] border border-[#232A42] rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
                <div className="flex items-center gap-3 border-b border-[#232A42] pb-5">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#3B2A6B] to-[#5B3E9B] flex items-center justify-center text-white shadow-md">
                    <Calendar className="w-5 h-5 text-[#E6C65B]" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4A017]">Section 3</span>
                    <h2 className="text-xl font-bold text-white">Your Immediate Action Plan</h2>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Today */}
                  <div className="bg-[#0B0D17] border border-[#283250] rounded-2xl p-5 space-y-2 relative overflow-hidden">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Do Today ({profile?.dailyStudyTime || '1 hr'})
                    </span>
                    <p className="text-xs text-gray-200 leading-relaxed pt-1">
                      {aiRoadmap.immediateActionPlan.today}
                    </p>
                  </div>

                  {/* This Week */}
                  <div className="bg-[#0B0D17] border border-[#283250] rounded-2xl p-5 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      This Week Target
                    </span>
                    <p className="text-xs text-gray-200 leading-relaxed pt-1">
                      {aiRoadmap.immediateActionPlan.thisWeek}
                    </p>
                  </div>

                  {/* This Month */}
                  <div className="bg-[#0B0D17] border border-[#283250] rounded-2xl p-5 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      This Month Objective
                    </span>
                    <p className="text-xs text-gray-200 leading-relaxed pt-1">
                      {aiRoadmap.immediateActionPlan.thisMonth}
                    </p>
                  </div>

                  {/* Next Milestone */}
                  <div className="bg-[#0B0D17] border border-[#283250] rounded-2xl p-5 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      Next Big Milestone
                    </span>
                    <p className="text-xs text-gray-200 leading-relaxed pt-1">
                      {aiRoadmap.immediateActionPlan.nextMilestone}
                    </p>
                  </div>
                </div>

                {/* Top 3 Actions Box */}
                {aiRoadmap.topThreeActions && aiRoadmap.topThreeActions.length > 0 && (
                  <div className="bg-[#0E1220] border border-[#283250] rounded-2xl p-5 space-y-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#D4A017] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      Your Top 3 Highest-Impact Actions:
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {aiRoadmap.topThreeActions.map((act, aIdx) => (
                        <div key={aIdx} className="bg-[#0B0D17] p-3 rounded-xl border border-[#232A42] flex items-start gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-[#D4A017] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                            {aIdx + 1}
                          </span>
                          <span className="text-xs text-gray-300">{act}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION 4: YOUR FUTURE OPPORTUNITIES */}
              <div className="bg-[#121626] border border-[#232A42] rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
                <div className="flex items-center gap-3 border-b border-[#232A42] pb-5">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#3B2A6B] to-[#5B3E9B] flex items-center justify-center text-white shadow-md">
                    <Briefcase className="w-5 h-5 text-[#E6C65B]" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4A017]">Section 4</span>
                    <h2 className="text-xl font-bold text-white">Your Future Opportunities & Career Pathways</h2>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Potential Roles */}
                  <div className="bg-[#0B0D17] border border-[#232A42] rounded-2xl p-4 space-y-2.5">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-[#D4A017]" />
                      Target Job Roles:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {aiRoadmap.futureOpportunities.potentialRoles.map((role, rIdx) => (
                        <span key={rIdx} className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-[#161D30] text-gray-300 border border-[#2A3554]">
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Internships & Exams */}
                  <div className="bg-[#0B0D17] border border-[#232A42] rounded-2xl p-4 space-y-2.5">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-blue-400" />
                      Internships & Exams:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {aiRoadmap.futureOpportunities.internshipsAndExams.map((exam, eIdx) => (
                        <span key={eIdx} className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-[#161D30] text-gray-300 border border-[#2A3554]">
                          {exam}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Higher Studies */}
                  <div className="bg-[#0B0D17] border border-[#232A42] rounded-2xl p-4 space-y-2.5">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-purple-400" />
                      Higher Studies:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {aiRoadmap.futureOpportunities.higherStudiesOptions.map((opt, oIdx) => (
                        <span key={oIdx} className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-[#161D30] text-gray-300 border border-[#2A3554]">
                          {opt}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Specializations */}
                  <div className="bg-[#0B0D17] border border-[#232A42] rounded-2xl p-4 space-y-2.5">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5 text-emerald-400" />
                      Specializations:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {aiRoadmap.futureOpportunities.specializations.map((spec, sIdx) => (
                        <span key={sIdx} className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-[#161D30] text-gray-300 border border-[#2A3554]">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Disclaimer */}
                <div className="p-3.5 bg-[#0B0D17] border border-[#232A42] rounded-2xl flex items-start gap-3 text-gray-400 text-[11px]">
                  <HelpCircle className="w-4 h-4 text-[#D4A017] shrink-0 mt-0.5" />
                  <p>{aiRoadmap.futureOpportunities.disclaimer}</p>
                </div>
              </div>
            </div>
          ) : (
            /* Empty State if no roadmap yet */
            <div className="bg-[#121626] border border-[#232A42] rounded-3xl p-12 text-center shadow-xl space-y-4">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-[#D4A017]/20 border border-[#D4A017]/30 flex items-center justify-center text-[#D4A017]">
                <Sparkles className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-white">Generate Your Personalized AI Career Roadmap</h2>
              <p className="text-sm text-gray-400 max-w-md mx-auto">
                Click below to synthesize a tailored 4-phase engineering roadmap aligned with your current semester, skills, and target career goal.
              </p>
              <button
                onClick={handleGenerateClick}
                disabled={isGenerating}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#D4A017] to-[#B3830E] hover:opacity-95 text-white font-bold text-sm shadow-lg shadow-[#D4A017]/20 inline-flex items-center gap-2 cursor-pointer transition-all"
              >
                <Sparkles className="w-4 h-4" />
                Generate My Personalized AI Roadmap
              </button>
            </div>
          )}
        </>
      )}

      {/* TAB 2: Task Verification Tracker View */}
      {activeTab === 'task_tracker' && (
        <div className="space-y-6">
          <div className="bg-[#121626] border border-[#232A42] rounded-3xl p-6 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-1">
              Engineering Proof-of-Work Task Verifier
            </h2>
            <p className="text-xs text-gray-400">
              Complete hands-on milestones, take automated verification quizzes (score ≥ 60%), and commit code to verify proof of work and build your placement readiness score.
            </p>
          </div>

          <div className="space-y-4">
            {[1, 2, 3, 4].map(y => {
              const items = tasksByYear[y] || [];
              const isExpanded = Boolean(expandedYears[y]);
              const completedCount = items.filter(i => i.userTask.status === 'completed').length;
              const isCurrent = currentYear === y;

              return (
                <div
                  key={y}
                  className={`bg-[#121626] border rounded-3xl overflow-hidden transition-all shadow-md ${
                    isCurrent ? 'border-[#D4A017]/50' : 'border-[#232A42]'
                  }`}
                >
                  <button
                    onClick={() => toggleYear(y)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-[#161B2E] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                        isCurrent ? 'bg-[#D4A017] text-white shadow' : 'bg-[#1A2035] text-gray-400'
                      }`}>
                        Y{y}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white">
                            Year {y}: {y === 1 ? 'Foundations & Problem Solving' : y === 2 ? 'Core Systems & Full Stack' : y === 3 ? 'Industrial Internships & Pre-Placements' : 'Placement Drives & Capstone Deployments'}
                          </span>
                          {isCurrent && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#D4A017]/20 text-[#E6C65B] border border-[#D4A017]/30">
                              Current Year
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-400">
                          {completedCount} of {items.length} tasks completed
                        </span>
                      </div>
                    </div>
                    {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                  </button>

                  {isExpanded && (
                    <div className="px-6 pb-6 pt-2 border-t border-[#232A42] space-y-3">
                      {items.length === 0 ? (
                        <p className="text-xs text-gray-500 py-4 text-center">No tasks listed for Year {y}.</p>
                      ) : (
                        items.map(({ template, userTask }) => {
                          const isDone = userTask.status === 'completed';
                          const inProgress = userTask.status === 'in_progress';

                          return (
                            <div
                              key={template.id}
                              className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                                isDone
                                  ? 'bg-[#0E181D] border-emerald-500/30'
                                  : inProgress
                                  ? 'bg-[#171A2E] border-blue-500/30'
                                  : 'bg-[#0B0D17] border-[#232A42]'
                              }`}
                            >
                              <div className="space-y-1 max-w-xl">
                                <div className="flex items-center gap-2">
                                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                                    isDone ? 'bg-emerald-500/20 text-emerald-300' : 'bg-[#1A2035] text-gray-400'
                                  }`}>
                                    {template.category}
                                  </span>
                                  <span className="text-[10px] text-gray-400 flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> {template.timeNeeded}
                                  </span>
                                  <span className="text-[10px] text-[#D4A017] font-semibold">
                                    +{template.points} pts
                                  </span>
                                </div>
                                <h4 className="text-sm font-bold text-white">{template.title}</h4>
                                <p className="text-xs text-gray-400">{template.whatYouWillLearn}</p>
                              </div>

                              <div className="flex items-center gap-2 shrink-0">
                                {template.freeResourceUrl && (
                                  <a
                                    href={template.freeResourceUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 rounded-xl bg-[#1A2035] text-gray-300 hover:text-white border border-[#283250]"
                                    title="Open Learning Resource"
                                  >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                  </a>
                                )}
                                {isDone ? (
                                  <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1">
                                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                                  </span>
                                ) : (
                                  <button
                                    onClick={() => onVerifyTask({ template, userTask })}
                                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4A017] to-[#B3830E] hover:opacity-95 text-white text-xs font-bold shadow-md flex items-center gap-1.5 cursor-pointer"
                                  >
                                    <ShieldCheck className="w-3.5 h-3.5" /> Verify Proof
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* FLOATING / DRAWER AI CAREER MENTOR CHAT */}
      {isMentorOpen && (
        <div className="fixed inset-0 z-50 bg-[#0B0D17]/70 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md bg-[#121626] border-l border-[#232A42] h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
            {/* Mentor Header */}
            <div className="p-4 border-b border-[#232A42] bg-[#0E1220] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#4F46E5] to-[#7C3AED] flex items-center justify-center text-white shadow-md">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">AI Career Mentor</h3>
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> Online • Grounded in your roadmap
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsMentorOpen(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-[#1A2035]"
              >
                ✕
              </button>
            </div>

            {/* Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
              {mentorMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`p-3 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-[#D4A017] text-white rounded-tr-none'
                        : 'bg-[#1A2035] text-gray-200 border border-[#283250] rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-gray-500 mt-1 px-1">{msg.time}</span>
                </div>
              ))}
              {mentorLoading && (
                <div className="flex items-center gap-2 text-xs text-gray-400 p-2">
                  <span className="w-2 h-2 rounded-full bg-[#D4A017] animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-[#D4A017] animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-[#D4A017] animate-bounce [animation-delay:0.4s]" />
                  Mentor is thinking...
                </div>
              )}
            </div>

            {/* Quick Prompts */}
            <div className="px-4 py-2 border-t border-[#232A42] bg-[#0E1220]/50 flex gap-2 overflow-x-auto text-[10px]">
              <button
                type="button"
                onClick={() => setMentorInput('How do I balance Phase 1 with my semester exams?')}
                className="px-2.5 py-1 rounded-full bg-[#1A2035] text-gray-300 border border-[#283250] hover:border-[#D4A017] whitespace-nowrap"
              >
                Exam balance?
              </button>
              <button
                type="button"
                onClick={() => setMentorInput('Which project should I prioritize first?')}
                className="px-2.5 py-1 rounded-full bg-[#1A2035] text-gray-300 border border-[#283250] hover:border-[#D4A017] whitespace-nowrap"
              >
                Top project?
              </button>
              <button
                type="button"
                onClick={() => setMentorInput('What do recruiters look for in my branch?')}
                className="px-2.5 py-1 rounded-full bg-[#1A2035] text-gray-300 border border-[#283250] hover:border-[#D4A017] whitespace-nowrap"
              >
                Recruiter expectations?
              </button>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendMentorQuestion} className="p-3 border-t border-[#232A42] bg-[#0E1220] flex gap-2">
              <input
                type="text"
                value={mentorInput}
                onChange={e => setMentorInput(e.target.value)}
                placeholder="Ask about your roadmap, exams, or projects..."
                className="flex-1 px-3 py-2 rounded-xl bg-[#0B0D17] border border-[#283250] text-xs text-white focus:outline-none focus:border-[#D4A017]"
              />
              <button
                type="submit"
                disabled={mentorLoading || !mentorInput.trim()}
                className="px-3 py-2 rounded-xl bg-gradient-to-r from-[#D4A017] to-[#B3830E] text-white text-xs font-bold disabled:opacity-40"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
