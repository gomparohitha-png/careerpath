import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Printer,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Award,
  Home
} from 'lucide-react';
import { ResumeData, UserScoreStreak } from '../types/index.ts';
import { api } from '../lib/api.ts';

interface ResumeBuilderViewProps {
  score: UserScoreStreak;
  onResumeVerified: (res: any) => void;
}

export const ResumeBuilderView: React.FC<ResumeBuilderViewProps> = ({ score, onResumeVerified }) => {
  const [resume, setResume] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');

  useEffect(() => {
    api
      .getResume()
      .then(res => {
        setResume(res.resume);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading || !resume) {
    return <div className="p-8 text-center text-xs text-[#7D6B9E]">Loading resume editor...</div>;
  }

  const handleUpdateField = (field: keyof ResumeData, value: any) => {
    setResume(prev => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleAddProject = () => {
    setResume({
      ...resume,
      projects: [
        ...resume.projects,
        {
          name: 'New Project',
          tech: 'TypeScript, React',
          description: 'Engineered a system to optimize workflow performance with clean architecture.'
        }
      ]
    });
  };

  const handleRemoveProject = (idx: number) => {
    setResume({
      ...resume,
      projects: resume.projects.filter((_, i) => i !== idx)
    });
  };

  const handleVerifyResume = async () => {
    setStatusMessage(null);
    setIsVerifying(true);
    try {
      const res = await api.verifyResume(resume, 'task-y3-01');
      setStatusMessage({ type: 'success', text: res.message });
      onResumeVerified(res);
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Verification failed.' });
    } finally {
      setIsVerifying(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Breadcrumb & Home Link */}
      <div className="flex items-center justify-between pb-1 print:hidden">
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
          <span className="font-semibold text-[#2A1B4E]">Resume Builder</span>
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E6DBFF] print:hidden">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#D4A017] flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5" />
            ATS-Compliant Technical Resume
          </span>
          <h1 className="text-2xl font-black text-[#2A1B4E] mt-1">
            Technical Resume Builder & Proof Checker
          </h1>
          <p className="text-xs text-[#6B5A99] mt-1">
            Validates mandatory placement sections (Education, &ge;3 verified skills, &ge;2 technical projects).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 p-1 bg-[#F3EEFF] rounded-xl">
            <button
              type="button"
              onClick={() => setActiveTab('editor')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'editor' ? 'bg-white text-[#2A1B4E] shadow-xs' : 'text-[#6B5A99]'
              }`}
            >
              Editor
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'preview' ? 'bg-white text-[#2A1B4E] shadow-xs' : 'text-[#6B5A99]'
              }`}
            >
              ATS Preview
            </button>
          </div>

          <button
            type="button"
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-[#3B2A6B] bg-white border border-[#E6DBFF] hover:bg-[#FAF8FF] shadow-xs flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            Export / Print PDF
          </button>

          <button
            type="button"
            disabled={isVerifying}
            onClick={handleVerifyResume}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#D4A017] to-[#B3830E] hover:opacity-95 shadow-xs flex items-center gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            {isVerifying ? 'Verifying Structure...' : 'Verify Resume (+50 pts)'}
          </button>
        </div>
      </div>

      {statusMessage && (
        <div
          className={`p-4 rounded-xl border flex items-center gap-2.5 text-xs print:hidden ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : 'bg-rose-50 border-rose-300 text-rose-900'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* ================= EDITOR TAB ================= */}
      {activeTab === 'editor' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 print:hidden">
          {/* Section 1: Contact & Summary */}
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-white border border-[#E6DBFF] shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-[#2A1B4E] uppercase tracking-wider">
                1. Contact & Identity
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#3B2A6B] mb-1">Full Name</label>
                  <input
                    type="text"
                    value={resume.fullName}
                    onChange={e => handleUpdateField('fullName', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#D8CFEA] text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#3B2A6B] mb-1">Email</label>
                  <input
                    type="email"
                    value={resume.email}
                    onChange={e => handleUpdateField('email', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#D8CFEA] text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#3B2A6B] mb-1">Phone</label>
                  <input
                    type="text"
                    value={resume.phone}
                    onChange={e => handleUpdateField('phone', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#D8CFEA] text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#3B2A6B] mb-1">GitHub URL</label>
                  <input
                    type="text"
                    value={resume.github}
                    onChange={e => handleUpdateField('github', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#D8CFEA] text-xs font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#3B2A6B] mb-1">Professional Summary</label>
                <textarea
                  rows={2}
                  value={resume.summary}
                  onChange={e => handleUpdateField('summary', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#D8CFEA] text-xs"
                />
              </div>
            </div>

            {/* Section 2: Education */}
            <div className="p-6 rounded-2xl bg-white border border-[#E6DBFF] shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-[#2A1B4E] uppercase tracking-wider">
                2. Academic Education
              </h3>
              {resume.education.map((edu, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-[#FAF8FF] border border-[#E6DBFF] space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#3B2A6B] mb-1">University / Institute</label>
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={e => {
                        const updated = [...resume.education];
                        updated[idx].institution = e.target.value;
                        handleUpdateField('education', updated);
                      }}
                      className="w-full px-3 py-2 rounded-lg border border-[#D8CFEA] text-xs"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#3B2A6B] mb-1">Degree</label>
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={e => {
                          const updated = [...resume.education];
                          updated[idx].degree = e.target.value;
                          handleUpdateField('education', updated);
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-[#D8CFEA] text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#3B2A6B] mb-1">Branch</label>
                      <input
                        type="text"
                        value={edu.branch}
                        onChange={e => {
                          const updated = [...resume.education];
                          updated[idx].branch = e.target.value;
                          handleUpdateField('education', updated);
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-[#D8CFEA] text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#3B2A6B] mb-1">CGPA</label>
                      <input
                        type="text"
                        value={edu.cgpa}
                        onChange={e => {
                          const updated = [...resume.education];
                          updated[idx].cgpa = e.target.value;
                          handleUpdateField('education', updated);
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-[#D8CFEA] text-xs"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Skills & Projects */}
          <div className="space-y-6">
            {/* Skills */}
            <div className="p-6 rounded-2xl bg-white border border-[#E6DBFF] shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-[#2A1B4E] uppercase tracking-wider">
                3. Technical Skills (Requires &ge; 3)
              </h3>
              {resume.skills.map((skillGroup, idx) => (
                <div key={idx} className="space-y-1.5">
                  <label className="block text-[11px] font-semibold text-[#3B2A6B]">
                    {skillGroup.category}
                  </label>
                  <input
                    type="text"
                    value={skillGroup.items}
                    onChange={e => {
                      const updated = [...resume.skills];
                      updated[idx].items = e.target.value;
                      handleUpdateField('skills', updated);
                    }}
                    placeholder="e.g. C++, Python, SQL, Git"
                    className="w-full px-3 py-2 rounded-lg border border-[#D8CFEA] text-xs"
                  />
                </div>
              ))}
            </div>

            {/* Projects */}
            <div className="p-6 rounded-2xl bg-white border border-[#E6DBFF] shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#2A1B4E] uppercase tracking-wider">
                  4. Technical Projects (Requires &ge; 2)
                </h3>
                <button
                  type="button"
                  onClick={handleAddProject}
                  className="px-2.5 py-1 rounded-lg bg-[#F3EEFF] text-[#3B2A6B] hover:bg-[#E6DBFF] text-xs font-bold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Project
                </button>
              </div>

              {resume.projects.map((proj, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-[#FAF8FF] border border-[#E6DBFF] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#3B2A6B]">Project #{idx + 1}</span>
                    {resume.projects.length > 2 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveProject(idx)}
                        className="text-rose-600 hover:text-rose-800 text-xs"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Project Name"
                      value={proj.name}
                      onChange={e => {
                        const updated = [...resume.projects];
                        updated[idx].name = e.target.value;
                        handleUpdateField('projects', updated);
                      }}
                      className="px-2.5 py-1.5 rounded-lg border border-[#D8CFEA] text-xs font-semibold"
                    />
                    <input
                      type="text"
                      placeholder="Tech Stack"
                      value={proj.tech}
                      onChange={e => {
                        const updated = [...resume.projects];
                        updated[idx].tech = e.target.value;
                        handleUpdateField('projects', updated);
                      }}
                      className="px-2.5 py-1.5 rounded-lg border border-[#D8CFEA] text-xs font-mono"
                    />
                  </div>
                  <textarea
                    rows={2}
                    placeholder="Describe impact, algorithms, and results with action verbs..."
                    value={proj.description}
                    onChange={e => {
                      const updated = [...resume.projects];
                      updated[idx].description = e.target.value;
                      handleUpdateField('projects', updated);
                    }}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-[#D8CFEA] text-xs"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= ATS PREVIEW / PRINT VIEW ================= */}
      <div
        className={`bg-white rounded-3xl p-8 sm:p-12 border border-[#E6DBFF] shadow-lg max-w-4xl mx-auto font-sans text-slate-800 space-y-6 ${
          activeTab === 'editor' ? 'hidden' : 'block'
        } print:block print:border-none print:shadow-none print:p-0`}
      >
        {/* Header Block */}
        <div className="text-center pb-4 border-b border-slate-300 space-y-1">
          <h1 className="text-2xl font-bold uppercase tracking-tight text-slate-900">
            {resume.fullName}
          </h1>
          <div className="text-xs text-slate-600 flex flex-wrap items-center justify-center gap-2 font-mono">
            <span>{resume.email}</span>
            <span>·</span>
            <span>{resume.phone}</span>
            <span>·</span>
            <span>{resume.github}</span>
            <span>·</span>
            <span>{resume.linkedin}</span>
          </div>
        </div>

        {/* Summary */}
        <div className="space-y-1">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-0.5">
            Professional Summary
          </h2>
          <p className="text-xs text-slate-700 leading-relaxed pt-1">
            {resume.summary}
          </p>
        </div>

        {/* Education */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-0.5">
            Education
          </h2>
          {resume.education.map((edu, idx) => (
            <div key={idx} className="flex justify-between text-xs">
              <div>
                <div className="font-bold text-slate-900">{edu.institution}</div>
                <div className="text-slate-600">{edu.degree} in {edu.branch}</div>
              </div>
              <div className="text-right">
                <div className="font-mono text-slate-700">{edu.startYear} – {edu.endYear}</div>
                <div className="font-semibold text-slate-800">CGPA: {edu.cgpa}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Technical Skills */}
        <div className="space-y-1.5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-0.5">
            Technical Skills
          </h2>
          {resume.skills.map((sg, idx) => (
            <div key={idx} className="text-xs flex gap-2">
              <strong className="text-slate-800 w-36 shrink-0">{sg.category}:</strong>
              <span className="text-slate-700">{sg.items}</span>
            </div>
          ))}
        </div>

        {/* Projects */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-0.5">
            Technical Projects
          </h2>
          {resume.projects.map((proj, idx) => (
            <div key={idx} className="space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <div className="font-bold text-slate-900">
                  {proj.name} <span className="font-normal text-slate-500">| {proj.tech}</span>
                </div>
              </div>
              <p className="text-slate-700 leading-relaxed">{proj.description}</p>
            </div>
          ))}
        </div>

        {/* Certifications */}
        {resume.certifications.length > 0 && (
          <div className="space-y-1.5">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-0.5">
              Certifications & Honors
            </h2>
            <ul className="list-disc list-inside text-xs text-slate-700 space-y-0.5">
              {resume.certifications.map((c, idx) => (
                <li key={idx}>{c}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
