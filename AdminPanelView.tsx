import React, { useState, useEffect } from 'react';
import {
  Shield,
  Users,
  CheckCircle2,
  Layers,
  Award,
  Zap,
  Briefcase,
  FolderGit2,
  Clock,
  Plus,
  Trash2,
  ExternalLink,
  Edit,
  ArrowRight
} from 'lucide-react';
import { TaskTemplate, InternshipOpportunity } from '../types/index.ts';
import { api } from '../lib/api.ts';

interface AdminPanelViewProps {
  onSwitchToStudent?: () => void;
}

export const AdminPanelView: React.FC<AdminPanelViewProps> = ({ onSwitchToStudent }) => {
  const [activeTab, setActiveTab] = useState<'stats' | 'templates' | 'opportunities' | 'projects' | 'quizzes'>('stats');
  const [stats, setStats] = useState<any | null>(null);
  const [templates, setTemplates] = useState<TaskTemplate[]>([]);
  const [opportunities, setOpportunities] = useState<InternshipOpportunity[]>([]);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Template Modal
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [tplTitle, setTplTitle] = useState('');
  const [tplYear, setTplYear] = useState(1);
  const [tplBranch, setTplBranch] = useState('ALL');
  const [tplLearn, setTplLearn] = useState('');
  const [tplWhy, setTplWhy] = useState('');
  const [tplTime, setTplTime] = useState('1 hour');
  const [tplType, setTplType] = useState<any>('learning');
  const [tplRule, setTplRule] = useState('Active reading tracker (60s min) + 5-question check quiz (>=60% score)');
  const [tplThreshold, setTplThreshold] = useState(60);
  const [tplPoints, setTplPoints] = useState(10);
  const [tplUrl, setTplUrl] = useState('https://developer.mozilla.org');

  // Opportunity Modal
  const [showOppModal, setShowOppModal] = useState(false);
  const [oppCompany, setOppCompany] = useState('');
  const [oppRole, setOppRole] = useState('');
  const [oppLocation, setOppLocation] = useState('Bengaluru / Hybrid');
  const [oppStipend, setOppStipend] = useState('₹40,000 / month');
  const [oppSource, setOppSource] = useState('Official Company Careers Portal');
  const [oppLink, setOppLink] = useState('https://careers.google.com');

  useEffect(() => {
    loadAllAdminData();
  }, []);

  const loadAllAdminData = async () => {
    try {
      setErrorMsg(null);
      const [statsRes, tplRes, oppRes, quizRes, projRes] = await Promise.all([
        api.getAdminStats(),
        api.adminGetTemplates(),
        api.adminGetOpportunities(),
        api.getQuizzes(),
        api.getProjects()
      ]);
      setStats(statsRes);
      setTemplates(tplRes.templates);
      setOpportunities(oppRes.opportunities);
      setQuizzes(quizRes.quizzes);
      setProjects(projRes.projects);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to load admin data. Ensure you have administrator permissions.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.adminSaveTemplate({
        title: tplTitle,
        year: Number(tplYear),
        branchCategory: tplBranch,
        whatYouWillLearn: tplLearn,
        whyItMatters: tplWhy,
        timeNeeded: tplTime,
        difficulty: 'Beginner',
        freeResourceUrl: tplUrl,
        resourceName: 'Verified Guide',
        verificationType: tplType,
        verificationRule: tplRule,
        threshold: Number(tplThreshold),
        minTimeSeconds: 45,
        points: Number(tplPoints),
        category: 'skills',
        order: 99
      });
      setShowTemplateModal(false);
      setTplTitle('');
      setTplLearn('');
      setTplWhy('');
      await loadAllAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to save template');
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    if (!confirm('Are you sure you want to delete this curriculum template?')) return;
    try {
      await api.adminDeleteTemplate(id);
      await loadAllAdminData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleSaveOpportunity = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.adminSaveOpportunity({
        company: oppCompany,
        role: oppRole,
        location: oppLocation,
        type: 'Summer Internship',
        stipend: oppStipend,
        branch: ['CSE', 'IT', 'ECE'],
        requirements: ['Core programming proficiency', 'Project portfolio'],
        verifiedSource: oppSource,
        applicationLink: oppLink,
        isVerified: true
      });
      setShowOppModal(false);
      setOppCompany('');
      setOppRole('');
      await loadAllAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to save opportunity');
    }
  };

  const handleDeleteOpportunity = async (id: string) => {
    if (!confirm('Are you sure you want to delete this verified opportunity listing?')) return;
    try {
      await api.adminDeleteOpportunity(id);
      await loadAllAdminData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-xs text-[#7D6B9E]">Loading Admin Management Console...</div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E6DBFF]">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#8E68CD] flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" />
            University TPO & Curriculum Administration
          </span>
          <h1 className="text-2xl font-black text-[#2A1B4E] mt-1">
            Admin Governance & Verification Console
          </h1>
          <p className="text-xs text-[#6B5A99] mt-1">
            Manage templates, audit verification rules, publish sourced opportunities, and monitor aggregate progress.
          </p>
        </div>

        {onSwitchToStudent && (
          <button
            type="button"
            onClick={onSwitchToStudent}
            className="px-4 py-2 rounded-xl text-xs font-bold text-[#3B2A6B] bg-white border border-[#E6DBFF] hover:bg-[#FAF8FF] shadow-xs"
          >
            Switch to Student View
          </button>
        )}
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
          {errorMsg}
        </div>
      )}

      {/* Aggregate Stats Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-[#E6DBFF] shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#F3EEFF] flex items-center justify-center text-[#3B2A6B]">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black font-mono text-[#2A1B4E] tabular-nums">
              {stats?.totalStudents || 1}
            </div>
            <div className="text-[11px] text-[#6B5A99]">Registered Students</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E6DBFF] shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black font-mono text-[#2A1B4E] tabular-nums">
              {stats?.totalVerifiedEvents || 0}
            </div>
            <div className="text-[11px] text-[#6B5A99]">Verified Proof Events</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E6DBFF] shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FFFDF5] text-[#D4A017] flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black font-mono text-[#2A1B4E] tabular-nums">
              {templates.length}
            </div>
            <div className="text-[11px] text-[#6B5A99]">Roadmap Templates</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E6DBFF] shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FAF8FF] text-[#8E68CD] flex items-center justify-center">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black font-mono text-[#2A1B4E] tabular-nums">
              {opportunities.length}
            </div>
            <div className="text-[11px] text-[#6B5A99]">Sourced Opportunities</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-[#F3EEFF] rounded-2xl max-w-xl text-xs font-bold">
        {[
          { id: 'stats', label: 'Audit Log' },
          { id: 'templates', label: `Roadmap Templates (${templates.length})` },
          { id: 'opportunities', label: `Opportunities (${opportunities.length})` },
          { id: 'projects', label: `Projects (${projects.length})` },
          { id: 'quizzes', label: `Quizzes (${quizzes.length})` }
        ].map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeTab === tab.id ? 'bg-white text-[#2A1B4E] shadow-xs' : 'text-[#6B5A99]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ================= TAB 1: AUDIT STREAM ================= */}
      {activeTab === 'stats' && (
        <div className="p-6 rounded-2xl bg-white border border-[#E6DBFF] shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-[#2A1B4E] uppercase tracking-wider">
            Live Proof-of-Work Verification Stream
          </h3>
          {(!stats?.recentActivity || stats.recentActivity.length === 0) ? (
            <div className="p-8 text-center text-xs text-[#7D6B9E]">
              No verified events logged yet. Activities will stream live here as students complete checks.
            </div>
          ) : (
            <div className="space-y-2">
              {stats.recentActivity.map((act: any) => (
                <div
                  key={act.id}
                  className="p-3.5 rounded-xl bg-[#FAF8FF] border border-[#F3EEFF] text-xs flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold text-[#2A1B4E]">{act.title}</span>
                    <div className="text-[10px] text-[#7D6B9E]">{act.details}</div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-[#D4A017]">+{act.points} pts</span>
                    <div className="text-[10px] text-[#9A8CB8]">
                      {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 2: TEMPLATES ================= */}
      {activeTab === 'templates' && (
        <div className="p-6 rounded-2xl bg-white border border-[#E6DBFF] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#2A1B4E] uppercase tracking-wider">
              Curriculum Roadmap Templates & Verification Rules
            </h3>
            <button
              type="button"
              onClick={() => setShowTemplateModal(true)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#D4A017] to-[#B3830E] flex items-center gap-1 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Template</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#F3EEFF] text-[#6B5A99] font-bold">
                  <th className="py-2.5 px-3">Year</th>
                  <th className="py-2.5 px-3">Branch</th>
                  <th className="py-2.5 px-3">Milestone Title</th>
                  <th className="py-2.5 px-3">Verification Rule</th>
                  <th className="py-2.5 px-3">Points</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F3EEFF]">
                {templates.map(tpl => (
                  <tr key={tpl.id} className="hover:bg-[#FAF8FF]">
                    <td className="py-2.5 px-3 font-bold text-[#3B2A6B]">Y{tpl.year}</td>
                    <td className="py-2.5 px-3 text-[#6B5A99]">{tpl.branchCategory}</td>
                    <td className="py-2.5 px-3 font-semibold text-[#2A1B4E]">{tpl.title}</td>
                    <td className="py-2.5 px-3 text-[#6B5A99]">{tpl.verificationRule}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-[#D4A017]">+{tpl.points}</td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleDeleteTemplate(tpl.id)}
                        className="text-rose-500 hover:text-rose-700 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 3: OPPORTUNITIES ================= */}
      {activeTab === 'opportunities' && (
        <div className="p-6 rounded-2xl bg-white border border-[#E6DBFF] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#2A1B4E] uppercase tracking-wider">
              Verified Internship Opportunities
            </h3>
            <button
              type="button"
              onClick={() => setShowOppModal(true)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#D4A017] to-[#B3830E] flex items-center gap-1 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Verified Opening</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {opportunities.map(opp => (
              <div key={opp.id} className="p-4 rounded-xl border border-[#E6DBFF] bg-[#FAF8FF] space-y-2 flex justify-between">
                <div>
                  <div className="font-bold text-sm text-[#2A1B4E]">{opp.company}</div>
                  <div className="text-xs text-[#3B2A6B]">{opp.role}</div>
                  <div className="text-[11px] text-[#6B5A99]">{opp.location} · {opp.stipend}</div>
                  <div className="text-[10px] text-[#8E68CD] pt-1">Source: {opp.verifiedSource}</div>
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => handleDeleteOpportunity(opp.id)}
                    className="text-rose-500 hover:text-rose-700 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 4: PROJECTS ================= */}
      {activeTab === 'projects' && (
        <div className="p-6 rounded-2xl bg-white border border-[#E6DBFF] shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-[#2A1B4E] uppercase tracking-wider">
            Active Engineering Project Templates ({projects.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map(p => (
              <div key={p.id} className="p-4 rounded-xl border border-[#E6DBFF] bg-[#FAF8FF] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-[#2A1B4E]">{p.title}</span>
                  <span className="text-[10px] font-bold text-[#D4A017]">{p.difficulty}</span>
                </div>
                <p className="text-xs text-[#6B5A99]">{p.description}</p>
                <div className="text-[11px] text-[#3B2A6B] font-semibold">
                  Milestones: {p.milestones.length} steps with GitHub API verification
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 5: QUIZZES ================= */}
      {activeTab === 'quizzes' && (
        <div className="p-6 rounded-2xl bg-white border border-[#E6DBFF] shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-[#2A1B4E] uppercase tracking-wider">
            Assessment & Quiz Banks ({quizzes.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {quizzes.map(q => (
              <div key={q.id} className="p-4 rounded-xl border border-[#E6DBFF] bg-[#FAF8FF] space-y-1.5">
                <div className="font-bold text-xs text-[#2A1B4E]">{q.title}</div>
                <div className="text-[11px] text-[#6B5A99] capitalize">Category: {q.category}</div>
                <div className="text-[10px] text-[#805E00] font-medium">
                  {q.questionCount} Questions · Threshold: {q.passingScore}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= ADD TEMPLATE MODAL ================= */}
      {showTemplateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2A1B4E]/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl p-6 shadow-2xl border border-[#E6DBFF] space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-sm text-[#2A1B4E]">Add New Curriculum Roadmap Template</h3>
              <button type="button" onClick={() => setShowTemplateModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSaveTemplate} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Milestone Title</label>
                <input required value={tplTitle} onChange={e => setTplTitle(e.target.value)} className="w-full p-2 border rounded-lg" placeholder="e.g. Distributed Cache Design" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold block mb-1">Academic Year</label>
                  <select value={tplYear} onChange={e => setTplYear(Number(e.target.value))} className="w-full p-2 border rounded-lg">
                    {[1, 2, 3, 4].map(y => <option key={y} value={y}>Year {y}</option>)}
                  </select>
                </div>
                <div>
                  <label className="font-semibold block mb-1">Branch Category</label>
                  <select value={tplBranch} onChange={e => setTplBranch(e.target.value)} className="w-full p-2 border rounded-lg">
                    <option value="ALL">ALL Branches</option>
                    <option value="CSE_IT">CSE & IT</option>
                    <option value="ECE">ECE</option>
                    <option value="EEE">EEE</option>
                    <option value="MECHANICAL">Mechanical</option>
                    <option value="CIVIL">Civil</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="font-semibold block mb-1">What You Will Learn (1-2 sentences)</label>
                <textarea required rows={2} value={tplLearn} onChange={e => setTplLearn(e.target.value)} className="w-full p-2 border rounded-lg" />
              </div>
              <div>
                <label className="font-semibold block mb-1">Why It Matters (1 sentence)</label>
                <input required value={tplWhy} onChange={e => setTplWhy(e.target.value)} className="w-full p-2 border rounded-lg" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold block mb-1">Verification Type</label>
                  <select value={tplType} onChange={e => setTplType(e.target.value as any)} className="w-full p-2 border rounded-lg">
                    <option value="learning">Learning (Active time + Quiz)</option>
                    <option value="quiz">Practice Assessment</option>
                    <option value="github_milestone">GitHub Repo Milestone</option>
                    <option value="resume">Resume Section</option>
                    <option value="internship_app">Internship Application</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold block mb-1">Points Awarded</label>
                  <input type="number" value={tplPoints} onChange={e => setTplPoints(Number(e.target.value))} className="w-full p-2 border rounded-lg" />
                </div>
              </div>
              <div>
                <label className="font-semibold block mb-1">Verification Rule Explanation</label>
                <input required value={tplRule} onChange={e => setTplRule(e.target.value)} className="w-full p-2 border rounded-lg" />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowTemplateModal(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-[#D4A017] text-white font-bold rounded-lg">Save Template</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= ADD OPPORTUNITY MODAL ================= */}
      {showOppModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2A1B4E]/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-[#E6DBFF] space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-sm text-[#2A1B4E]">Add Verified Opportunity Listing</h3>
              <button type="button" onClick={() => setShowOppModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSaveOpportunity} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Company</label>
                <input required value={oppCompany} onChange={e => setOppCompany(e.target.value)} className="w-full p-2 border rounded-lg" placeholder="e.g. Microsoft" />
              </div>
              <div>
                <label className="font-semibold block mb-1">Role</label>
                <input required value={oppRole} onChange={e => setOppRole(e.target.value)} className="w-full p-2 border rounded-lg" placeholder="e.g. Software Engineering Intern" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold block mb-1">Location</label>
                  <input value={oppLocation} onChange={e => setOppLocation(e.target.value)} className="w-full p-2 border rounded-lg" />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Stipend</label>
                  <input value={oppStipend} onChange={e => setOppStipend(e.target.value)} className="w-full p-2 border rounded-lg" />
                </div>
              </div>
              <div>
                <label className="font-semibold block mb-1">Verified Source</label>
                <input required value={oppSource} onChange={e => setOppSource(e.target.value)} className="w-full p-2 border rounded-lg" />
              </div>
              <div>
                <label className="font-semibold block mb-1">Application URL</label>
                <input required value={oppLink} onChange={e => setOppLink(e.target.value)} className="w-full p-2 border rounded-lg" />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowOppModal(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-[#D4A017] text-white font-bold rounded-lg">Publish Opening</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
