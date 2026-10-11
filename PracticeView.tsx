import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Zap,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  Award,
  ChevronRight,
  ArrowRight,
  BookOpen,
  MessageSquare,
  Sparkles,
  Home,
  Filter,
  AlertTriangle
} from 'lucide-react';
import { QuizBank, UserScoreStreak } from '../types/index.ts';
import { api } from '../lib/api.ts';

interface PracticeViewProps {
  score: UserScoreStreak;
  careerGoal: string;
  onQuizCompleted: (result: any) => void;
  onOpenScoringExplainer: () => void;
}

interface MockInterviewQuestion {
  id: string;
  category: string;
  question: string;
  modelAnswer: string;
  talkingPoints: string[];
}

export const PracticeView: React.FC<PracticeViewProps> = ({
  score,
  careerGoal,
  onQuizCompleted,
  onOpenScoringExplainer
}) => {
  const [activeTab, setActiveTab] = useState<'quizzes' | 'interview'>('quizzes');
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);
  const [activeQuiz, setActiveQuiz] = useState<QuizBank | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizResult, setQuizResult] = useState<any | null>(null);
  const [reviewFilter, setReviewFilter] = useState<'all' | 'incorrect' | 'correct'>('all');
  const [loading, setLoading] = useState(true);

  // Load quiz lists
  useEffect(() => {
    api
      .getQuizzes()
      .then(res => {
        setQuizzes(res.quizzes);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleSelectQuiz = async (quizId: string) => {
    setSelectedQuizId(quizId);
    setAnswers({});
    setQuizResult(null);
    try {
      const data = await api.getQuizDetails(quizId);
      setActiveQuiz(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAnswerSelect = (qId: string, optionIdx: number) => {
    if (quizResult) return; // Prevent changing after submission
    setAnswers(prev => ({ ...prev, [qId]: optionIdx }));
  };

  const handleSubmitQuiz = async () => {
    if (!activeQuiz) return;
    setIsSubmitting(true);
    try {
      const res = await api.verifyQuiz(activeQuiz.id, undefined, answers);
      setQuizResult(res);
      if (res.passed) {
        onQuizCompleted(res);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Mock Interview Questions tailored to career goal
  const mockQuestions: MockInterviewQuestion[] = [
    {
      id: 'mi-1',
      category: 'System & Architecture',
      question: 'How does an index in a database optimize query performance, and what are the trade-offs during write operations?',
      modelAnswer: 'A database index is typically structured as a B-Tree or B+ Tree. By maintaining a sorted data structure pointing to record memory offsets, it reduces query search complexity from O(N) full table scan down to O(log N). However, during INSERT, UPDATE, and DELETE operations, the database engine must also rebalance and write to the index tree, adding I/O overhead.',
      talkingPoints: [
        'Explain B-Tree search complexity vs full table scans',
        'Mention the write amplification penalty on inserts',
        'Reference composite index column ordering rules'
      ]
    },
    {
      id: 'mi-2',
      category: 'Data Structures & Algorithms',
      question: 'When would you prefer a Hash Map over a Binary Search Tree, and how do you handle hash collisions?',
      modelAnswer: 'A Hash Map offers average O(1) time complexity for lookup, insertion, and deletion, whereas a balanced BST offers O(log N). I prefer Hash Maps when order is irrelevant. When elements must remain sorted, or for range queries, a BST is superior. Hash collisions are handled either via Chaining (linked list / balanced tree per bucket) or Open Addressing (linear/quadratic probing).',
      talkingPoints: [
        'Compare O(1) average vs O(log N) worst case guarantees',
        'Explain chaining with tree bins (like Java HashMap) vs open addressing',
        'Mention load factor and resizing cost'
      ]
    },
    {
      id: 'mi-3',
      category: 'Behavioral & STAR Method',
      question: 'Describe a situation where a technical project milestone went wrong. How did you diagnose and resolve it?',
      modelAnswer: 'During our college project milestone, our frontend was failing to communicate with the REST API due to unhandled CORS headers and mismatched JSON key types. Using the browser network tab, I isolated the preflight HTTP OPTIONS error. I configured appropriate headers on Express, wrote an automated test with Postman, and deployed the patch 4 hours before submission.',
      talkingPoints: [
        'Situation: Concrete context (deadline pressure, tech stack)',
        'Task: Your explicit technical responsibility',
        'Action: Root cause analysis and code implementation',
        'Result: Working deployment and lessons learned'
      ]
    }
  ];

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
          <span className="font-semibold text-[#2A1B4E]">Practice & Interview Prep</span>
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
            <Zap className="w-3.5 h-3.5" />
            Skill Assessment & Interview Readiness
          </span>
          <h1 className="text-2xl font-black text-[#2A1B4E] mt-1">
            Technical Practice & Mock Assessments
          </h1>
          <p className="text-xs text-[#6B5A99] mt-1">
            Scores are evaluated server-side. Passing assessments awards +15 to +25 verified points.
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-1 p-1 bg-[#F3EEFF] rounded-xl self-start md:self-auto">
          <button
            type="button"
            onClick={() => {
              setActiveTab('quizzes');
              setActiveQuiz(null);
              setQuizResult(null);
            }}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'quizzes'
                ? 'bg-white text-[#2A1B4E] shadow-xs'
                : 'text-[#6B5A99] hover:text-[#2A1B4E]'
            }`}
          >
            Timed Quizzes
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('interview')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'interview'
                ? 'bg-white text-[#2A1B4E] shadow-xs'
                : 'text-[#6B5A99] hover:text-[#2A1B4E]'
            }`}
          >
            Mock Interviews
          </button>
        </div>
      </div>

      {/* ================= TAB 1: QUIZZES ================= */}
      {activeTab === 'quizzes' && (
        <div className="space-y-6">
          {!activeQuiz ? (
            /* Quiz Selection List */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quizzes.map((q: any) => (
                <div
                  key={q.id}
                  className="p-5 rounded-2xl bg-white border border-[#E6DBFF] hover:border-[#8E68CD] shadow-xs transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#8E68CD] capitalize">{q.category}</span>
                      <span className="text-[11px] font-mono font-bold text-[#D4A017]">+15-25 pts</span>
                    </div>
                    <h3 className="text-sm font-bold text-[#2A1B4E]">{q.title}</h3>
                    <p className="text-xs text-[#6B5A99]">
                      {q.questionCount} randomized multiple-choice questions. Passing threshold: {q.passingScore}%.
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#F3EEFF] flex items-center justify-between">
                    <span className="text-[11px] text-[#7D6B9E] font-medium flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#D4A017]" />
                      ~10 mins
                    </span>
                    <button
                      type="button"
                      onClick={() => handleSelectQuiz(q.id)}
                      className="px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#D4A017] to-[#B3830E] hover:opacity-95 shadow-xs flex items-center gap-1.5"
                    >
                      <span>Start Test</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Active Quiz Test Runner */
            <div className="max-w-3xl mx-auto space-y-6">
              {/* Quiz Header Bar */}
              <div className="p-5 rounded-2xl bg-white border border-[#E6DBFF] shadow-xs flex items-center justify-between">
                <div>
                  <button
                    type="button"
                    onClick={() => setActiveQuiz(null)}
                    className="text-xs font-semibold text-[#8E68CD] hover:underline mb-1"
                  >
                    ← Back to Quiz Selection
                  </button>
                  <h2 className="text-lg font-bold text-[#2A1B4E]">{activeQuiz.title}</h2>
                  <div className="text-xs text-[#6B5A99]">
                    Passing threshold: {activeQuiz.passingScore}% · {activeQuiz.questions.length} questions
                  </div>
                </div>

                {quizResult && (
                  <div className="text-right">
                    <div className={`text-2xl font-black font-mono tabular-nums ${quizResult.passed ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {quizResult.scorePercent}%
                    </div>
                    <div className="text-[10px] font-bold uppercase tracking-wider">
                      {quizResult.passed ? 'PASSED (+pts awarded)' : 'NEEDS PRACTICE'}
                    </div>
                  </div>
                )}
              </div>

              {/* Quiz Result Banner */}
              {quizResult && (
                <div className="space-y-4">
                  <div
                    className={`p-5 rounded-2xl border flex items-center justify-between ${
                      quizResult.passed
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                        : 'bg-rose-50 border-rose-300 text-rose-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {quizResult.passed ? (
                        <CheckCircle2 className="w-7 h-7 text-emerald-600 shrink-0" />
                      ) : (
                        <XCircle className="w-7 h-7 text-rose-600 shrink-0" />
                      )}
                      <div>
                        <div className="font-bold text-sm">
                          {quizResult.passed
                            ? `Verification Passed! You earned +${quizResult.pointsAwarded} practice points.`
                            : `Assessment score below threshold (${quizResult.scorePercent}% vs ${activeQuiz.passingScore}% required).`}
                        </div>
                        <p className="text-xs opacity-90 mt-0.5">
                          {quizResult.passed
                            ? `Great job! You answered ${quizResult.correctCount} of ${quizResult.totalQuestions} questions correctly.`
                            : `You answered ${quizResult.correctCount} of ${quizResult.totalQuestions} questions correctly. Review the incorrect questions below and understand the clear explanations before retrying.`}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSelectQuiz(activeQuiz.id)}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-white shadow-xs border shrink-0 text-[#2A1B4E] hover:bg-[#FAF8FF] transition-colors"
                    >
                      Retake Assessment
                    </button>
                  </div>

                  {/* Review Filter Tabs */}
                  <div className="flex items-center justify-between bg-white p-2.5 rounded-2xl border border-[#E6DBFF] shadow-xs">
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="text-[#7D6B9E] font-medium flex items-center gap-1 px-2">
                        <Filter className="w-3.5 h-3.5 text-[#8E68CD]" />
                        Filter:
                      </span>
                      <button
                        type="button"
                        onClick={() => setReviewFilter('all')}
                        className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
                          reviewFilter === 'all'
                            ? 'bg-[#3B2A6B] text-white shadow-xs'
                            : 'text-[#6B5A99] hover:bg-[#F3EEFF]'
                        }`}
                      >
                        All Questions ({activeQuiz.questions.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setReviewFilter('incorrect')}
                        className={`px-3 py-1.5 rounded-xl font-bold transition-colors flex items-center gap-1 ${
                          reviewFilter === 'incorrect'
                            ? 'bg-rose-600 text-white shadow-xs'
                            : 'text-rose-700 hover:bg-rose-50'
                        }`}
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        Incorrect Only ({quizResult.totalQuestions - quizResult.correctCount})
                      </button>
                      <button
                        type="button"
                        onClick={() => setReviewFilter('correct')}
                        className={`px-3 py-1.5 rounded-xl font-bold transition-colors flex items-center gap-1 ${
                          reviewFilter === 'correct'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'text-emerald-700 hover:bg-emerald-50'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Correct ({quizResult.correctCount})
                      </button>
                    </div>

                    <div className="text-xs font-semibold text-[#6B5A99] pr-2">
                      Reviewing: <span className="text-[#2A1B4E] font-bold capitalize">{reviewFilter}</span> questions
                    </div>
                  </div>
                </div>
              )}

              {/* Questions List */}
              <div className="space-y-4">
                {activeQuiz.questions.map((q, idx) => {
                  const evalResult = quizResult?.results?.find((r: any) => r.questionId === q.id);
                  const isAnswered = answers[q.id] !== undefined;

                  // Filter logic when reviewing result
                  if (evalResult && reviewFilter === 'incorrect' && evalResult.isCorrect) {
                    return null;
                  }
                  if (evalResult && reviewFilter === 'correct' && !evalResult.isCorrect) {
                    return null;
                  }

                  return (
                    <div
                      key={q.id}
                      className={`p-6 rounded-2xl border transition-all ${
                        evalResult
                          ? evalResult.isCorrect
                            ? 'bg-[#FAFCFA] border-emerald-300 shadow-xs'
                            : 'bg-[#FFF8F8] border-rose-300 shadow-xs'
                          : 'bg-white border-[#E6DBFF]'
                      }`}
                    >
                      {/* Top Evaluation Status Ribbon */}
                      {evalResult && (
                        <div className="mb-4 pb-3 border-b border-[#F3EEFF] flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {evalResult.isCorrect ? (
                              <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-[11px] font-bold flex items-center gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                Correct Answer
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 rounded-lg bg-rose-100 text-rose-800 text-[11px] font-bold flex items-center gap-1.5">
                                <XCircle className="w-3.5 h-3.5 text-rose-600" />
                                Incorrect Answer — Detailed Solution Below
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] font-semibold text-[#7D6B9E]">
                            Question {idx + 1} of {activeQuiz.questions.length}
                          </span>
                        </div>
                      )}

                      <div className="text-sm font-bold text-[#2A1B4E] mb-3">
                        {idx + 1}. {q.question}
                      </div>

                      <div className="space-y-2">
                        {q.options.map((opt, optIdx) => {
                          const isSelected = answers[q.id] === optIdx;
                          const isCorrectOption = evalResult?.correctAnswer === optIdx;

                          let optionStyle = 'border-[#E6DBFF] hover:bg-[#FAF8FF] text-[#4A3B6F]';
                          if (isSelected) {
                            optionStyle = 'border-[#3B2A6B] bg-[#F3EEFF] text-[#2A1B4E] font-semibold';
                          }
                          if (evalResult) {
                            if (isCorrectOption) {
                              optionStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold ring-2 ring-emerald-200';
                            } else if (isSelected && !evalResult.isCorrect) {
                              optionStyle = 'border-rose-400 bg-rose-50 text-rose-900 font-bold ring-2 ring-rose-200';
                            } else {
                              optionStyle = 'border-slate-200 bg-slate-50 text-slate-500 opacity-70';
                            }
                          }

                          return (
                            <label
                              key={optIdx}
                              className={`flex items-center gap-3 p-3 rounded-xl border text-xs cursor-pointer transition-colors ${optionStyle}`}
                            >
                              <input
                                type="radio"
                                name={`q-${q.id}`}
                                disabled={!!quizResult}
                                checked={isSelected}
                                onChange={() => handleAnswerSelect(q.id, optIdx)}
                                className="text-[#3B2A6B] focus:ring-[#8E68CD]"
                              />
                              <span className="flex-1">{opt}</span>
                              {evalResult && isCorrectOption && (
                                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                                  ✓ Correct Option
                                </span>
                              )}
                              {evalResult && isSelected && !evalResult.isCorrect && (
                                <span className="text-[11px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                                  ✕ Your Selection (Wrong)
                                </span>
                              )}
                            </label>
                          );
                        })}
                      </div>

                      {/* Prominent Deep Explanation Box */}
                      {evalResult && (
                        <div
                          className={`mt-4 p-4 rounded-xl border text-xs ${
                            evalResult.isCorrect
                              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                              : 'bg-white border-rose-200 shadow-xs text-[#2A1B4E]'
                          }`}
                        >
                          <div className="flex items-start gap-2.5">
                            <HelpCircle
                              className={`w-4 h-4 shrink-0 mt-0.5 ${
                                evalResult.isCorrect ? 'text-emerald-600' : 'text-[#8E68CD]'
                              }`}
                            />
                            <div className="space-y-2 flex-1">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-xs text-[#2A1B4E] uppercase tracking-wider flex items-center gap-1.5">
                                  {evalResult.isCorrect ? (
                                    <span className="text-emerald-800">✓ Concept Verified:</span>
                                  ) : (
                                    <span className="text-rose-700">💡 Clear Concept Explanation & Solution:</span>
                                  )}
                                </span>
                                {!evalResult.isCorrect && (
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                                    Concept Review
                                  </span>
                                )}
                              </div>

                              <p className="text-xs text-[#4A3B6F] leading-relaxed">
                                {evalResult.explanation}
                              </p>

                              {!evalResult.isCorrect && (
                                <div className="mt-2 p-2.5 rounded-lg bg-[#FAF8FF] border border-[#E6DBFF] text-[11px] text-[#6B5A99]">
                                  <strong className="text-[#3B2A6B]">Core Takeaway:</strong> Review the difference between the selected option and the correct answer. This concept frequently appears in engineering campus interviews and technical assessments.
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Submit Button */}
              {!quizResult && (
                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    disabled={isSubmitting || Object.keys(answers).length < activeQuiz.questions.length}
                    onClick={handleSubmitQuiz}
                    className={`px-6 py-3 rounded-xl text-xs font-bold text-white shadow-md transition-all ${
                      Object.keys(answers).length >= activeQuiz.questions.length && !isSubmitting
                        ? 'bg-gradient-to-r from-[#D4A017] to-[#B3830E] hover:opacity-95'
                        : 'bg-slate-300 cursor-not-allowed text-slate-500'
                    }`}
                  >
                    {isSubmitting ? 'Evaluating on Server...' : 'Submit Answers for Verification'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 2: MOCK INTERVIEWS ================= */}
      {activeTab === 'interview' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-[#FAF8FF] border border-[#E6DBFF] flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8E68CD]">
                Role Readiness Interview Bank
              </span>
              <h3 className="text-base font-bold text-[#2A1B4E]">
                Targeted for {careerGoal} Candidates
              </h3>
              <p className="text-xs text-[#6B5A99]">
                Structured technical & behavioral questions with model responses and key recruiter checkpoints.
              </p>
            </div>
            <Sparkles className="w-6 h-6 text-[#D4A017]" />
          </div>

          <div className="space-y-4">
            {mockQuestions.map((mq, idx) => (
              <div
                key={mq.id}
                className="p-6 rounded-2xl bg-white border border-[#E6DBFF] shadow-xs space-y-4"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2.5 py-1 rounded-lg bg-[#F3EEFF] text-[#3B2A6B] font-bold">
                    {mq.category}
                  </span>
                  <span className="text-[#7D6B9E] font-medium">Question {idx + 1}</span>
                </div>

                <h4 className="text-sm font-bold text-[#2A1B4E] leading-snug">
                  "{mq.question}"
                </h4>

                {/* Model Answer */}
                <div className="p-4 rounded-xl bg-[#FAF8FF] border border-[#E6DBFF] space-y-2">
                  <span className="text-xs font-bold text-[#3B2A6B] uppercase tracking-wider flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-[#D4A017]" />
                    Model Answer (STAR Structure):
                  </span>
                  <p className="text-xs text-[#4A3B6F] leading-relaxed">
                    {mq.modelAnswer}
                  </p>
                </div>

                {/* Key Talking Points */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-[#805E00] uppercase tracking-wider">
                    Key Checkpoints Interviewers Listen For:
                  </span>
                  <ul className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {mq.talkingPoints.map((pt, pIdx) => (
                      <li
                        key={pIdx}
                        className="p-2.5 rounded-lg bg-[#FFFDF5] border border-[#F2C94C]/60 text-[11px] text-[#4A3B6F] flex items-start gap-1.5"
                      >
                        <span className="text-[#D4A017] font-bold">✓</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
