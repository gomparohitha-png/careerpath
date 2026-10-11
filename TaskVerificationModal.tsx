import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  ExternalLink,
  Clock,
  Play,
  Pause,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Github,
  Award,
  Sparkles,
  FileText,
  Briefcase
} from 'lucide-react';
import { TaskTemplate, UserTask, QuizBank } from '../types/index.ts';
import { api } from '../lib/api.ts';

interface TaskVerificationModalProps {
  task: { template: TaskTemplate; userTask: UserTask } | null;
  onClose: () => void;
  onVerifiedSuccess: (result: any) => void;
  onNavigateToTab?: (tab: string) => void;
}

export const TaskVerificationModal: React.FC<TaskVerificationModalProps> = ({
  task,
  onClose,
  onVerifiedSuccess,
  onNavigateToTab
}) => {
  if (!task) return null;

  const { template, userTask } = task;

  // LEARNING VERIFICATION STATE
  const [activeSeconds, setActiveSeconds] = useState(0);
  const [isTabActive, setIsTabActive] = useState(true);
  const [hasOpenedResource, setHasOpenedResource] = useState(false);
  const [quizData, setQuizData] = useState<QuizBank | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [comprehensionResults, setComprehensionResults] = useState<any[] | null>(null);
  const [loadingQuiz, setLoadingQuiz] = useState(false);

  // GITHUB VERIFICATION STATE
  const [repoUrl, setRepoUrl] = useState('https://github.com/student-demo/portfolio-project');

  // INTERNSHIP VERIFICATION STATE
  const [appCompany, setAppCompany] = useState('');
  const [appRole, setAppRole] = useState('');
  const [appDate, setAppDate] = useState(new Date().toISOString().split('T')[0]);

  // STATUS & ERRORS
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const targetMinSeconds = template.minTimeSeconds || 45;
  const isTimeComplete = activeSeconds >= targetMinSeconds;

  // Active time tracking with blur & visibility pause
  useEffect(() => {
    if (template.verificationType !== 'learning') return;

    const handleVisibility = () => {
      setIsTabActive(!document.hidden);
    };

    const handleFocus = () => setIsTabActive(true);
    const handleBlur = () => setIsTabActive(false);

    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('visibilitychange', handleVisibility);

    const interval = setInterval(() => {
      if (isTabActive && hasOpenedResource && !isTimeComplete) {
        setActiveSeconds(prev => prev + 1);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [isTabActive, hasOpenedResource, isTimeComplete, template.verificationType]);

  // Fetch linked quiz if template has quizId
  useEffect(() => {
    if (template.quizId) {
      setLoadingQuiz(true);
      api
        .getQuizDetails(template.quizId)
        .then(res => setQuizData(res))
        .catch(err => console.error('Failed to load quiz', err))
        .finally(() => setLoadingQuiz(false));
    }
  }, [template.quizId]);

  const handleOpenResource = () => {
    setHasOpenedResource(true);
    window.open(template.freeResourceUrl, '_blank', 'noopener,noreferrer');
  };

  const handleSelectQuizAnswer = (qId: string, optionIdx: number) => {
    setQuizAnswers(prev => ({ ...prev, [qId]: optionIdx }));
  };

  // Submit Learning Verification
  const handleSubmitLearning = async () => {
    setErrorMessage(null);
    if (!isTimeComplete) {
      setErrorMessage(`Please complete at least ${targetMinSeconds} seconds of active reading before verifying.`);
      return;
    }

    if (quizData && Object.keys(quizAnswers).length < quizData.questions.length) {
      setErrorMessage('Please answer all 5 check questions to test comprehension.');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await api.verifyLearning(template.id, activeSeconds, quizAnswers);
      setComprehensionResults(res.results || null);
      onVerifiedSuccess(res);
    } catch (err: any) {
      if (err.data?.results) {
        setComprehensionResults(err.data.results);
      }
      setErrorMessage(err.message || 'Verification failed. Please review the detailed question explanations below and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetCheckQuiz = () => {
    setQuizAnswers({});
    setComprehensionResults(null);
    setErrorMessage(null);
  };

  // Submit GitHub Verification
  const handleSubmitGithub = async () => {
    setErrorMessage(null);
    if (!repoUrl.includes('github.com')) {
      setErrorMessage('Please enter a valid GitHub repository URL.');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await api.verifyGithub(repoUrl, undefined, undefined, template.id);
      onVerifiedSuccess(res);
    } catch (err: any) {
      setErrorMessage(err.message || 'GitHub verification failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit Internship Application
  const handleSubmitInternship = async () => {
    setErrorMessage(null);
    if (!appCompany || !appRole) {
      setErrorMessage('Please enter both Company and Target Role.');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await api.verifyInternship({
        company: appCompany,
        role: appRole,
        appliedDate: appDate,
        status: 'Applied',
        taskId: template.id
      });
      onVerifiedSuccess(res);
    } catch (err: any) {
      setErrorMessage(err.message || 'Application recording failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2A1B4E]/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#E6DBFF] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#F3EEFF] bg-gradient-to-r from-[#FAF8FF] to-white flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#D4A017] flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5" />
              Automated Proof-of-Work Verification
            </div>
            <h3 className="text-lg font-bold text-[#2A1B4E] mt-0.5 line-clamp-1">{template.title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#6B5A99] hover:bg-[#F3EEFF]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Rule banner */}
          <div className="p-3.5 rounded-xl bg-[#FFFDF5] border border-[#F2C94C]/70 text-xs text-[#805E00] flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-[#D4A017] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Verification Rule: </span>
              {template.verificationRule}
              <div className="text-[11px] text-[#A67C00] mt-0.5">
                Awards +{template.points} points upon server verification.
              </div>
            </div>
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* ================= TYPE 1: LEARNING TASK ================= */}
          {template.verificationType === 'learning' && (
            <div className="space-y-6">
              {/* Step 1: Active Reading Tracker */}
              <div className="p-4 rounded-xl border border-[#E6DBFF] bg-[#FAF8FF] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#3B2A6B] uppercase tracking-wider">
                    Step 1: Read Resource & Track Active Time
                  </span>
                  <div className="flex items-center gap-1 text-xs font-mono font-bold text-[#2A1B4E]">
                    <Clock className="w-3.5 h-3.5 text-[#D4A017]" />
                    {activeSeconds}s / {targetMinSeconds}s
                  </div>
                </div>

                {/* Progress bar */}
                <div className="h-2 w-full bg-[#E6DBFF] rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      isTimeComplete ? 'bg-[#16A34A]' : 'bg-gradient-to-r from-[#D4A017] to-[#F2C94C]'
                    }`}
                    style={{ width: `${Math.min(100, Math.round((activeSeconds / targetMinSeconds) * 100))}%` }}
                  />
                </div>

                {/* Resource button & anti-cheat alert */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                  <button
                    type="button"
                    onClick={handleOpenResource}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#3B2A6B] hover:bg-[#2A1B4E] transition-all flex items-center justify-center gap-2 shadow-xs"
                  >
                    <span>Open {template.resourceName}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>

                  <div className="text-[11px] text-[#6B5A99]">
                    {!hasOpenedResource ? (
                      <span className="text-amber-700 font-medium">Click "Open" to start the active reading timer.</span>
                    ) : !isTabActive ? (
                      <span className="text-rose-600 font-bold flex items-center gap-1">
                        <Pause className="w-3 h-3" /> Tracker paused: Tab inactive
                      </span>
                    ) : isTimeComplete ? (
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Time threshold met! Complete check quiz below.
                      </span>
                    ) : (
                      <span className="text-emerald-600 font-medium flex items-center gap-1">
                        <Play className="w-3 h-3" /> Active reading timer running...
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Step 2: 5-Question Check Quiz */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#3B2A6B] uppercase tracking-wider">
                    Step 2: 5-Question Comprehension Check
                  </span>
                  <span className="text-[11px] text-[#6B5A99]">Requires &ge; 60% score</span>
                </div>

                {!isTimeComplete ? (
                  <div className="p-6 rounded-xl border border-dashed border-[#D8CFEA] text-center text-xs text-[#7D6B9E] bg-[#FAF8FF]">
                    <Clock className="w-5 h-5 text-[#8E68CD] mx-auto mb-1.5 opacity-60" />
                    Complete the active reading time above to unlock the comprehension quiz.
                  </div>
                ) : loadingQuiz ? (
                  <div className="p-6 text-center text-xs text-[#7D6B9E]">Loading quiz questions...</div>
                ) : quizData ? (
                  <div className="space-y-4">
                    {comprehensionResults && (
                      <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
                        <div>
                          <span className="font-bold">Comprehension Evaluation: </span>
                          <span>
                            {comprehensionResults.filter(r => r.isCorrect).length} of {comprehensionResults.length} questions correct. Review incorrect questions below before retrying.
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={handleResetCheckQuiz}
                          className="px-3 py-1 rounded-lg bg-white border border-amber-300 font-bold text-amber-900 hover:bg-amber-100 text-xs shrink-0"
                        >
                          Retry Check Quiz
                        </button>
                      </div>
                    )}

                    {quizData.questions.map((q, idx) => {
                      const evalResult = comprehensionResults?.find(r => r.questionId === q.id);

                      return (
                        <div
                          key={q.id}
                          className={`p-4 rounded-xl border transition-all ${
                            evalResult
                              ? evalResult.isCorrect
                                ? 'border-emerald-300 bg-[#FAFCFA]'
                                : 'border-rose-300 bg-[#FFF8F8]'
                              : 'border-[#E6DBFF] bg-white'
                          } space-y-2.5`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="text-xs font-bold text-[#2A1B4E]">
                              {idx + 1}. {q.question}
                            </div>
                            {evalResult && (
                              evalResult.isCorrect ? (
                                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                  Correct
                                </span>
                              ) : (
                                <span className="text-[10px] font-bold text-rose-800 bg-rose-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                                  <AlertCircle className="w-3 h-3 text-rose-600" />
                                  Incorrect
                                </span>
                              )
                            )}
                          </div>

                          <div className="space-y-1.5">
                            {q.options.map((opt, optIdx) => {
                              const isSelected = quizAnswers[q.id] === optIdx;
                              const isCorrectOption = evalResult?.correctAnswer === optIdx;

                              let optClass = 'border-[#F3EEFF] hover:bg-[#FAF8FF] text-[#4A3B6F]';
                              if (isSelected) {
                                optClass = 'border-[#3B2A6B] bg-[#F3EEFF] text-[#2A1B4E] font-medium';
                              }
                              if (evalResult) {
                                if (isCorrectOption) {
                                  optClass = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold';
                                } else if (isSelected && !evalResult.isCorrect) {
                                  optClass = 'border-rose-400 bg-rose-50 text-rose-900 font-bold';
                                } else {
                                  optClass = 'border-slate-200 bg-slate-50 text-slate-500 opacity-60';
                                }
                              }

                              return (
                                <label
                                  key={optIdx}
                                  className={`flex items-center gap-2.5 p-2 rounded-lg border text-xs cursor-pointer transition-colors ${optClass}`}
                                >
                                  <input
                                    type="radio"
                                    name={`q-${q.id}`}
                                    disabled={!!comprehensionResults}
                                    checked={isSelected}
                                    onChange={() => handleSelectQuizAnswer(q.id, optIdx)}
                                    className="text-[#3B2A6B] focus:ring-[#8E68CD]"
                                  />
                                  <span className="flex-1">{opt}</span>
                                  {evalResult && isCorrectOption && (
                                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                                      ✓ Correct
                                    </span>
                                  )}
                                  {evalResult && isSelected && !evalResult.isCorrect && (
                                    <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded">
                                      ✕ Selected
                                    </span>
                                  )}
                                </label>
                              );
                            })}
                          </div>

                          {evalResult && (
                            <div className={`mt-2.5 p-3 rounded-lg border text-xs ${
                              evalResult.isCorrect ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950' : 'bg-white border-rose-200 text-[#2A1B4E]'
                            }`}>
                              <div className="font-bold flex items-center gap-1.5 mb-1 text-[11px] uppercase tracking-wider">
                                <HelpCircle className={`w-3.5 h-3.5 ${evalResult.isCorrect ? 'text-emerald-600' : 'text-[#8E68CD]'}`} />
                                {evalResult.isCorrect ? 'Concept Verified:' : 'Clear Concept Explanation:'}
                              </div>
                              <p className="text-xs text-[#4A3B6F] leading-relaxed">
                                {evalResult.explanation}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-4 text-xs text-[#7D6B9E]">Quiz bank loaded.</div>
                )}
              </div>
            </div>
          )}

          {/* ================= TYPE 2: GITHUB VERIFICATION ================= */}
          {template.verificationType === 'github_milestone' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-[#E6DBFF] bg-[#FAF8FF] space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-[#3B2A6B] uppercase tracking-wider">
                  <Github className="w-4 h-4 text-[#2A1B4E]" />
                  Enter Public GitHub Repository URL
                </div>
                <p className="text-xs text-[#6B5A99]">
                  Our backend verifies repository existence, public visibility, commit logs (&ge; {template.threshold} commits), and README documentation.
                </p>
                <div>
                  <input
                    type="url"
                    value={repoUrl}
                    onChange={e => setRepoUrl(e.target.value)}
                    placeholder="https://github.com/your-username/your-repository"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#D8CFEA] focus:border-[#8E68CD] focus:ring-2 focus:ring-[#E6DBFF] text-xs font-mono text-[#2A1B4E]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ================= TYPE 3: RESUME TASK ================= */}
          {template.verificationType === 'resume' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-[#E6DBFF] bg-[#FAF8FF] space-y-3 text-center py-6">
                <FileText className="w-8 h-8 text-[#D4A017] mx-auto" />
                <h4 className="text-sm font-bold text-[#2A1B4E]">Resume Builder Verification</h4>
                <p className="text-xs text-[#6B5A99] max-w-md mx-auto">
                  To complete this task, navigate to the Resume Builder tab, fill out your education, add at least 3 verified skills, and detail 2+ projects.
                </p>
                {onNavigateToTab && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onNavigateToTab('resume');
                    }}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#D4A017] to-[#B3830E] hover:opacity-95 shadow-xs"
                  >
                    Open Resume Builder
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ================= TYPE 4: INTERNSHIP APPLICATION ================= */}
          {template.verificationType === 'internship_app' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-[#E6DBFF] bg-[#FAF8FF] space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-[#3B2A6B] uppercase tracking-wider">
                  <Briefcase className="w-4 h-4 text-[#3B2A6B]" />
                  Record Verified Application
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#3B2A6B] mb-1">Company Name</label>
                    <input
                      type="text"
                      value={appCompany}
                      onChange={e => setAppCompany(e.target.value)}
                      placeholder="e.g. Razorpay, Google, TCS"
                      className="w-full px-3 py-2 rounded-lg border border-[#D8CFEA] text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#3B2A6B] mb-1">Target Role</label>
                    <input
                      type="text"
                      value={appRole}
                      onChange={e => setAppRole(e.target.value)}
                      placeholder="e.g. Backend Engineering Intern"
                      className="w-full px-3 py-2 rounded-lg border border-[#D8CFEA] text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#3B2A6B] mb-1">Date Applied</label>
                    <input
                      type="date"
                      value={appDate}
                      onChange={e => setAppDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-[#D8CFEA] text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer with verification submission buttons */}
        <div className="px-6 py-4 border-t border-[#F3EEFF] bg-[#FAF8FF] flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-[#6B5A99] hover:bg-[#E6DBFF]"
          >
            Cancel
          </button>

          {template.verificationType === 'learning' && (
            <button
              type="button"
              disabled={!isTimeComplete || isSubmitting}
              onClick={handleSubmitLearning}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold text-white flex items-center gap-2 shadow-xs transition-all ${
                isTimeComplete && !isSubmitting
                  ? 'bg-gradient-to-r from-[#D4A017] to-[#B3830E] hover:opacity-95'
                  : 'bg-slate-300 cursor-not-allowed text-slate-500'
              }`}
            >
              {isSubmitting ? 'Verifying with Server...' : `Submit & Verify (+${template.points} pts)`}
            </button>
          )}

          {template.verificationType === 'github_milestone' && (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmitGithub}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#D4A017] to-[#B3830E] hover:opacity-95 flex items-center gap-2 shadow-xs"
            >
              {isSubmitting ? 'Verifying GitHub Repo...' : `Verify Repository (+${template.points} pts)`}
            </button>
          )}

          {template.verificationType === 'internship_app' && (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmitInternship}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#D4A017] to-[#B3830E] hover:opacity-95 flex items-center gap-2 shadow-xs"
            >
              {isSubmitting ? 'Recording Application...' : `Record Application (+${template.points} pts)`}
            </button>
          )}

          {template.verificationType === 'quiz' && (
            <button
              type="button"
              onClick={() => {
                onClose();
                if (onNavigateToTab) onNavigateToTab('practice');
              }}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#D4A017] to-[#B3830E] hover:opacity-95 shadow-xs"
            >
              Take Assessment in Practice Tab
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
