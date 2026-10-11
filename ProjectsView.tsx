import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderGit2,
  Github,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  Layers,
  ArrowRight,
  Award,
  Home
} from 'lucide-react';
import { ProjectTemplate, UserScoreStreak } from '../types/index.ts';
import { api } from '../lib/api.ts';

interface ProjectsViewProps {
  score: UserScoreStreak;
  onMilestoneVerified: (res: any) => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({ score, onMilestoneVerified }) => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeProject, setActiveProject] = useState<any | null>(null);

  // Verification modal state
  const [verifyingMilestone, setVerifyingMilestone] = useState<any | null>(null);
  const [repoUrlInput, setRepoUrlInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const res = await api.getProjects();
      setProjects(res.projects);
      if (res.projects.length > 0 && !activeProject) {
        setActiveProject(res.projects[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenVerifyModal = (milestone: any) => {
    setVerifyingMilestone(milestone);
    setErrorMsg(null);
    setRepoUrlInput(activeProject?.userSubmission?.repoUrl || 'https://github.com/student-demo/project-repo');
  };

  const handleVerifySubmission = async () => {
    if (!verifyingMilestone || !activeProject) return;
    setErrorMsg(null);

    if (!repoUrlInput.includes('github.com')) {
      setErrorMsg('Please enter a valid GitHub URL, e.g. https://github.com/username/project');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await api.verifyGithub(repoUrlInput, activeProject.id, verifyingMilestone.id);
      setVerifyingMilestone(null);
      await loadProjects();
      onMilestoneVerified(res);
    } catch (err: any) {
      setErrorMsg(err.message || 'GitHub verification failed. Ensure repo is public with commits.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-xs text-[#7D6B9E]">Loading recommended projects...</div>;
  }

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
          <span className="font-semibold text-[#2A1B4E]">Projects & GitHub</span>
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
            <FolderGit2 className="w-3.5 h-3.5" />
            Verified Portfolio Projects
          </span>
          <h1 className="text-2xl font-black text-[#2A1B4E] mt-1">
            Real-World Capstone & Engineering Projects
          </h1>
          <p className="text-xs text-[#6B5A99] mt-1">
            Build step-by-step milestones. The backend checks your public GitHub repository, commit activity, and documentation.
          </p>
        </div>

        <div className="px-4 py-2 rounded-xl bg-white border border-[#E6DBFF] text-xs font-medium text-[#4A3B6F] shadow-xs">
          Projects Score: <strong className="font-mono font-bold text-[#D4A017]">{score.categoryScores.projects} pts</strong>
        </div>
      </div>

      {/* Projects Grid / Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Projects List */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-[#3B2A6B] uppercase tracking-wider">
            Curated Projects
          </div>
          {projects.map(proj => {
            const isSelected = activeProject?.id === proj.id;
            const completedCount = proj.userSubmission?.completedMilestones?.length || 0;
            const totalMilestones = proj.milestones.length;

            return (
              <button
                key={proj.id}
                type="button"
                onClick={() => setActiveProject(proj)}
                className={`w-full p-4 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'border-[#8E68CD] bg-[#FAF8FF] shadow-xs ring-1 ring-[#E6DBFF]'
                    : 'border-[#E6DBFF] bg-white hover:border-[#8E68CD]'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-[#8E68CD]">{proj.difficulty}</span>
                  <span className="font-mono text-[11px] font-bold text-[#D4A017]">
                    {completedCount}/{totalMilestones} Milestones
                  </span>
                </div>
                <h3 className="text-sm font-bold text-[#2A1B4E] line-clamp-1">{proj.title}</h3>
                <p className="text-xs text-[#6B5A99] line-clamp-2 mt-1">{proj.description}</p>
              </button>
            );
          })}
        </div>

        {/* Right 2 Columns: Detailed Selected Project with Milestones */}
        {activeProject && (
          <div className="lg:col-span-2 space-y-6">
            {/* Project Overview Card */}
            <div className="p-6 rounded-2xl bg-white border border-[#E6DBFF] shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#D4A017]">
                    {activeProject.difficulty} Level · {activeProject.branch.join(', ')}
                  </span>
                  <h2 className="text-xl font-black text-[#2A1B4E] mt-0.5">{activeProject.title}</h2>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {activeProject.techStack.map((tech: string) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 rounded-lg bg-[#F3EEFF] text-[#3B2A6B] text-[11px] font-semibold"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <p className="text-xs text-[#4A3B6F] leading-relaxed">
                {activeProject.description}
              </p>

              {/* Learning Outcomes */}
              <div className="p-4 rounded-xl bg-[#FAF8FF] border border-[#E6DBFF] space-y-2">
                <span className="text-xs font-bold text-[#3B2A6B] uppercase tracking-wider">
                  What This Demonstrates to Recruiters:
                </span>
                <ul className="space-y-1">
                  {activeProject.learningOutcomes.map((out: string, idx: number) => (
                    <li key={idx} className="text-xs text-[#6B5A99] flex items-start gap-2">
                      <span className="text-[#D4A017] font-bold">✓</span>
                      <span>{out}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {activeProject.userSubmission && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Github className="w-4 h-4 text-emerald-700" />
                    <span>
                      Active Repo: <strong className="font-mono">{activeProject.userSubmission.repoUrl}</strong> ({activeProject.userSubmission.verifiedCommitCount} commits verified)
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Milestones List */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-[#3B2A6B] uppercase tracking-wider">
                Step-by-Step Verified Milestones
              </h3>

              <div className="space-y-3">
                {activeProject.milestones.map((m: any, idx: number) => {
                  const isCompleted = activeProject.userSubmission?.completedMilestones?.includes(m.id);

                  return (
                    <div
                      key={m.id}
                      className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        isCompleted
                          ? 'bg-[#FAFCFA] border-emerald-300 shadow-xs'
                          : 'bg-white border-[#E6DBFF] shadow-xs'
                      }`}
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2 text-xs">
                          {isCompleted ? (
                            <span className="flex items-center gap-1 font-bold text-emerald-700">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              Milestone {idx + 1} Verified
                            </span>
                          ) : (
                            <span className="font-semibold text-[#8E68CD]">
                              Milestone {idx + 1}
                            </span>
                          )}
                          <span>·</span>
                          <span className="font-mono font-bold text-[#D4A017]">+{m.points} pts</span>
                        </div>

                        <h4 className="text-sm font-bold text-[#2A1B4E]">{m.title}</h4>
                        <p className="text-xs text-[#6B5A99]">{m.description}</p>
                        <div className="text-[11px] text-[#4A3B6F]">
                          <strong>Check Requirement: </strong>{m.verificationHint}
                        </div>
                      </div>

                      <div>
                        {isCompleted ? (
                          <div className="px-3.5 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold">
                            ✓ Verified
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleOpenVerifyModal(m)}
                            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#D4A017] to-[#B3830E] hover:opacity-95 shadow-xs flex items-center gap-1.5"
                          >
                            <Github className="w-3.5 h-3.5" />
                            <span>Verify Milestone</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Verification Modal for Milestone */}
      {verifyingMilestone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2A1B4E]/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#E6DBFF] p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#F3EEFF] pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4A017]">
                  GitHub API Milestone Check
                </span>
                <h3 className="text-base font-bold text-[#2A1B4E]">{verifyingMilestone.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setVerifyingMilestone(null)}
                className="text-[#6B5A99] hover:text-[#2A1B4E] text-sm"
              >
                ✕
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
                {errorMsg}
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#3B2A6B] mb-1.5">
                  Public GitHub Repository URL
                </label>
                <input
                  type="url"
                  value={repoUrlInput}
                  onChange={e => setRepoUrlInput(e.target.value)}
                  placeholder="https://github.com/username/repository"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#D8CFEA] text-xs font-mono"
                />
              </div>

              <div className="p-3 rounded-xl bg-[#FAF8FF] border border-[#E6DBFF] text-[11px] text-[#6B5A99] space-y-1">
                <div className="font-bold text-[#3B2A6B]">Server Verification Invariants:</div>
                <div>· Repository must be publicly accessible on GitHub.</div>
                <div>· Must contain real commits demonstrating feature progression.</div>
                <div>· Awards +{verifyingMilestone.points} verified project points upon verification.</div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setVerifyingMilestone(null)}
                className="px-4 py-2 text-xs font-semibold text-[#6B5A99]"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleVerifySubmission}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#D4A017] to-[#B3830E] hover:opacity-95 shadow-xs"
              >
                {isSubmitting ? 'Verifying with GitHub...' : `Verify & Award (+${verifyingMilestone.points} pts)`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
