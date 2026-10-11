import React, { useState, useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
  Link
} from 'react-router-dom';
import { PublicNavbar } from './components/public/PublicNavbar.tsx';
import { PublicFooter } from './components/public/PublicFooter.tsx';
import { HomePage } from './components/public/HomePage.tsx';
import { FeaturesPage } from './components/public/FeaturesPage.tsx';
import { HowItWorksPage } from './components/public/HowItWorksPage.tsx';
import { AboutPage } from './components/public/AboutPage.tsx';

import { StudentLoginPage } from './components/auth/StudentLoginPage.tsx';
import { StudentSignUpPage } from './components/auth/StudentSignUpPage.tsx';
import { ForgotPasswordPage } from './components/auth/ForgotPasswordPage.tsx';
import { AdminLoginPage } from './components/auth/AdminLoginPage.tsx';

import { Navbar } from './components/Navbar.tsx';
import { Sidebar } from './components/Sidebar.tsx';
import { OnboardingModal } from './components/OnboardingModal.tsx';
import { DashboardView } from './components/DashboardView.tsx';
import { RoadmapView } from './components/RoadmapView.tsx';
import { PracticeView } from './components/PracticeView.tsx';
import { ProjectsView } from './components/ProjectsView.tsx';
import { InternshipTrackerView } from './components/InternshipTrackerView.tsx';
import { ResumeBuilderView } from './components/ResumeBuilderView.tsx';
import { SkillGapView } from './components/SkillGapView.tsx';
import { WeeklyPlannerView } from './components/WeeklyPlannerView.tsx';
import { ProgressView } from './components/ProgressView.tsx';
import { NotificationsView } from './components/NotificationsView.tsx';
import { ProfileView } from './components/ProfileView.tsx';
import { ScoringPage } from './components/ScoringPage.tsx';
import { AdminPanelView } from './components/AdminPanelView.tsx';

import { TaskVerificationModal } from './components/TaskVerificationModal.tsx';
import { CelebrationModal } from './components/CelebrationModal.tsx';
import { ScoringExplainerModal } from './components/ScoringExplainerModal.tsx';

import {
  User,
  UserProfile,
  UserScoreStreak,
  TaskTemplate,
  UserTask,
  AIRoadmap
} from './types/index.ts';
import { api } from './lib/api.ts';
import { FirebaseProvider, useFirebase } from './context/FirebaseContext.tsx';
import { db, doc, onSnapshot } from './lib/firebase.ts';

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [score, setScore] = useState<UserScoreStreak>({
    userId: 'user-student-demo',
    totalScore: 0,
    streakDays: 0,
    streakFreezeAvailable: true,
    lastActiveDate: null,
    level: 'Starter',
    categoryScores: {
      skills: 0,
      projects: 0,
      practice: 0,
      resume: 0,
      internships: 0
    },
    weeklyActivity: {
      Mon: false,
      Tue: false,
      Wed: false,
      Thu: false,
      Fri: false,
      Sat: false,
      Sun: false
    }
  });

  const [roadmapItems, setRoadmapItems] = useState<{ template: TaskTemplate; userTask: UserTask }[]>([]);
  const [dashboardData, setDashboardData] = useState<any | null>(null);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState<number>(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);

  // Verification & Celebrations
  const [verifyingTask, setVerifyingTask] = useState<{ template: TaskTemplate; userTask: UserTask } | null>(null);
  const [celebrationData, setCelebrationData] = useState<any | null>(null);
  const [showScoringExplainer, setShowScoringExplainer] = useState(false);
  const [aiRoadmap, setAiRoadmap] = useState<AIRoadmap | null>(null);

  const {
    firebaseUser,
    isCloudSyncActive,
    signOut: firebaseSignOut,
    saveUserProfile,
    saveUserScore,
    saveUserTask,
    saveAIRoadmap,
    fetchAIRoadmap
  } = useFirebase();

  // Real-time synchronization when Firebase Auth is active
  useEffect(() => {
    if (firebaseUser) {
      api.firebaseLogin(
        firebaseUser.uid,
        firebaseUser.email || '',
        firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Student'
      ).then(res => {
        setUser(res.user);
        if (res.profile) setProfile(res.profile);
        if (res.score) setScore(res.score);
      }).catch(err => {
        console.warn('Firebase login session sync warning:', err);
      });

      // Real-time Firestore Profile Listener
      const unsubProfile = onSnapshot(doc(db, 'profiles', firebaseUser.uid), (snap) => {
        if (snap.exists()) {
          setProfile(snap.data() as UserProfile);
        }
      }, () => {});

      // Real-time Firestore Score Listener
      const unsubScore = onSnapshot(doc(db, 'scores', firebaseUser.uid), (snap) => {
        if (snap.exists()) {
          setScore(snap.data() as UserScoreStreak);
        }
      }, () => {});

      // Real-time Firestore Roadmap Listener
      const unsubRoadmap = onSnapshot(doc(db, 'roadmaps', firebaseUser.uid), (snap) => {
        if (snap.exists()) {
          setAiRoadmap(snap.data() as AIRoadmap);
        }
      }, () => {});

      return () => {
        unsubProfile();
        unsubScore();
        unsubRoadmap();
      };
    }
  }, [firebaseUser]);

  useEffect(() => {
    loadAppState();
  }, []);

  const loadAppState = async () => {
    try {
      const authRes = await api.getMe();
      setUser(authRes.user);
      setProfile(authRes.profile);
      if (authRes.score) setScore(authRes.score);

      const [roadRes, dashRes, notifRes, aiRoadRes] = await Promise.all([
        api.getRoadmap(),
        api.getDashboard(),
        api.getNotifications().catch(() => ({ notifications: [] })),
        api.getAIRoadmap().catch(() => ({ roadmap: null }))
      ]);

      setRoadmapItems(roadRes.items);
      setDashboardData(dashRes);
      if (dashRes.score) setScore(dashRes.score);
      setUnreadNotificationsCount(notifRes.notifications.filter((n: any) => !n.read).length);
      if (aiRoadRes?.roadmap) {
        setAiRoadmap(aiRoadRes.roadmap);
      }
    } catch (err) {
      console.error('Failed to load app state:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteOnboarding = async (onboardingData: any) => {
    try {
      const res = await api.saveProfile(onboardingData);
      setProfile(res.profile);

      // Cloud Persistence: Synchronize Profile with Firestore
      if (res.profile) {
        await saveUserProfile(res.profile).catch(e => console.warn('Firestore profile sync log:', e));
      }

      // Automatically synthesize personalized AI Roadmap
      try {
        const aiRes = await api.generateAIRoadmap();
        if (aiRes?.roadmap) {
          setAiRoadmap(aiRes.roadmap);
          await saveAIRoadmap(aiRes.roadmap).catch(e => console.warn('Firestore roadmap sync log:', e));
        }
      } catch (aiErr) {
        console.warn('AI roadmap generation post-onboarding notice:', aiErr);
      }

      const [roadRes, dashRes] = await Promise.all([
        api.getRoadmap(),
        api.getDashboard()
      ]);
      setRoadmapItems(roadRes.items);
      setDashboardData(dashRes);

      // Navigate to the newly generated Roadmap view
      navigate('/roadmap');
    } catch (err) {
      console.error('Onboarding failed:', err);
    }
  };

  const handleVerifiedSuccess = async (res: any) => {
    setVerifyingTask(null);

    if (res.scoreRecord) {
      setScore(res.scoreRecord);
      await saveUserScore(res.scoreRecord).catch(e => console.warn('Firestore score sync log:', e));
    }

    if (verifyingTask?.template?.id && user?.id) {
      await saveUserTask({
        id: `${user.id}_${verifyingTask.template.id}`,
        userId: user.id,
        taskId: verifyingTask.template.id,
        status: 'completed',
        activeSecondsStudied: 60,
        completedAt: new Date().toISOString()
      }).catch(e => console.warn('Firestore task sync log:', e));
    }

    api.getRoadmap().then(r => setRoadmapItems(r.items));
    api.getDashboard().then(d => setDashboardData(d));
    api.getNotifications().then(n => {
      setUnreadNotificationsCount(n.notifications.filter((item: any) => !item.read).length);
    });

    setCelebrationData({
      pointsAwarded: res.pointsAwarded || 10,
      title: 'Milestone Verified',
      message: res.message || 'Proof-of-work verified by server.',
      streakDays: res.scoreRecord?.streakDays,
      level: res.scoreRecord?.level
    });
  };

  const handleSwitchRole = async (targetRole: 'student' | 'admin') => {
    try {
      setLoading(true);
      const res = await api.switchAccount(targetRole);
      setUser(res.user);
      setProfile(res.profile);
      if (res.score) setScore(res.score);

      const [roadRes, dashRes] = await Promise.all([
        api.getRoadmap(),
        api.getDashboard()
      ]);
      setRoadmapItems(roadRes.items);
      setDashboardData(dashRes);

      if (targetRole === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await firebaseSignOut();
    api.clearToken();
    setUser(null);
    setProfile(null);
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8FF] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#3B2A6B] to-[#51368F] flex items-center justify-center text-white mx-auto shadow-md animate-pulse">
            <span className="font-extrabold text-lg text-[#F2C94C]">CP</span>
          </div>
          <div className="text-sm font-bold text-[#2A1B4E]">Loading CareerPath...</div>
          <p className="text-xs text-[#7D6B9E]">Calibrating engineering curriculum</p>
        </div>
      </div>
    );
  }

  // Determine if current route is part of public website
  const publicRoutes = ['/', '/features', '/how-it-works', '/about', '/login', '/signup', '/forgot-password', '/admin-login'];
  const isPublicRoute = publicRoutes.includes(location.pathname);

  // Authenticated Student Layout Component wrapper
  const AuthenticatedLayout = ({ children }: { children: React.ReactNode }) => {
    // Protected check: If not logged in, redirect to login
    if (!user) {
      return <Navigate to="/login" replace />;
    }

    // Onboarding gate check: If student profile not complete and not on /onboarding, redirect to /onboarding
    if ((!profile || !profile.onboarded) && location.pathname !== '/onboarding') {
      return <Navigate to="/onboarding" replace />;
    }

    return (
      <div className="min-h-screen bg-[#FAF8FF] flex flex-col text-[#2A1B4E]">
        <Navbar
          user={user}
          profile={profile}
          score={score}
          unreadCount={unreadNotificationsCount}
          onOpenScoringExplainer={() => setShowScoringExplainer(true)}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onSwitchRole={handleSwitchRole}
          onLogout={handleLogout}
        />

        <div className="flex-1 flex max-w-7xl w-full mx-auto">
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            profile={profile}
            score={score}
            nextBestAction={dashboardData?.nextBestAction}
            onActionClick={(action) => {
              const match = roadmapItems.find(i => i.template.id === action.taskId);
              if (match) {
                setVerifyingTask(match);
              } else {
                navigate('/roadmap');
              }
            }}
            onOpenScoringExplainer={() => setShowScoringExplainer(true)}
          />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    );
  };

  // Protected Admin Layout Component
  const AdminProtectedLayout = ({ children }: { children: React.ReactNode }) => {
    if (!user) {
      return <Navigate to="/admin-login" replace />;
    }
    if (user.role !== 'admin') {
      // Unauthorized students redirected away to /dashboard
      return <Navigate to="/dashboard" replace />;
    }

    return (
      <div className="min-h-screen bg-[#FAF8FF] flex flex-col text-[#2A1B4E]">
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E6DBFF] shadow-xs px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#3B2A6B] text-white flex items-center justify-center font-bold text-xs">
              TPO
            </div>
            <div>
              <span className="font-bold text-sm text-[#2A1B4E]">CareerPath Admin Console</span>
              <span className="hidden sm:inline-block ml-2 text-[10px] text-[#D4A017] font-semibold uppercase">
                University Governance
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="p-1.5 rounded-lg text-[#6B5A99] hover:text-[#2A1B4E] hover:bg-[#F3EEFF] transition-colors flex items-center gap-1 text-xs font-semibold"
              title="Go to Public Website Home"
            >
              <span className="text-sm">🏠</span>
              <span className="hidden sm:inline">Home</span>
            </Link>
            <button
              type="button"
              onClick={() => handleSwitchRole('student')}
              className="text-xs font-semibold text-[#8E68CD] hover:underline"
            >
              Switch to Student View
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-rose-600 border border-rose-200 hover:bg-rose-50"
            >
              Logout
            </button>
          </div>
        </header>

        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    );
  };

  return (
    <>
      {/* If viewing a public route, wrap with PublicNavbar and PublicFooter */}
      {isPublicRoute ? (
        <div className="min-h-screen bg-[#FAF8FF] flex flex-col justify-between text-[#2A1B4E]">
          <PublicNavbar user={user} onLogout={handleLogout} />
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage user={user} />} />
              <Route path="/features" element={<FeaturesPage />} />
              <Route path="/how-it-works" element={<HowItWorksPage />} />
              <Route path="/about" element={<AboutPage />} />

              <Route
                path="/login"
                element={<StudentLoginPage onLoginSuccess={loadAppState} />}
              />
              <Route
                path="/signup"
                element={<StudentSignUpPage onSignUpSuccess={loadAppState} />}
              />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route
                path="/admin-login"
                element={<AdminLoginPage onLoginSuccess={loadAppState} />}
              />
            </Routes>
          </div>
          <PublicFooter />
        </div>
      ) : (
        <Routes>
          {/* 7-Step Onboarding Gate */}
          <Route
            path="/onboarding"
            element={
              user ? (
                <OnboardingModal
                  initialName={user.name}
                  initialEmail={user.email}
                  isFullPage={true}
                  onComplete={handleCompleteOnboarding}
                />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* Authenticated Student Routes */}
          <Route
            path="/dashboard"
            element={
              <AuthenticatedLayout>
                <DashboardView
                  profile={profile}
                  score={score}
                  stats={
                    dashboardData?.stats || {
                      totalTasks: roadmapItems.length,
                      completedCount: roadmapItems.filter(i => i.userTask.status === 'completed').length,
                      progressPercent: 0,
                      applicationsCount: 0
                    }
                  }
                  thisWeekTasks={dashboardData?.thisWeekTasks || []}
                  nextBestAction={dashboardData?.nextBestAction}
                  recentActivities={dashboardData?.recentActivities || []}
                  onVerifyTask={setVerifyingTask}
                  onNavigateToTab={(tab) => navigate(`/${tab}`)}
                  onOpenScoringExplainer={() => setShowScoringExplainer(true)}
                />
              </AuthenticatedLayout>
            }
          />

          <Route
            path="/roadmap"
            element={
              <AuthenticatedLayout>
                <RoadmapView
                  roadmapItems={roadmapItems}
                  profile={profile}
                  aiRoadmap={aiRoadmap}
                  onVerifyTask={setVerifyingTask}
                  onNavigateToTab={(tab) => navigate(`/${tab}`)}
                  onRoadmapUpdated={setAiRoadmap}
                />
              </AuthenticatedLayout>
            }
          />

          <Route
            path="/skills"
            element={
              <AuthenticatedLayout>
                <SkillGapView
                  profile={profile}
                  onNavigateToTab={(tab) => navigate(`/${tab}`)}
                />
              </AuthenticatedLayout>
            }
          />

          <Route
            path="/projects"
            element={
              <AuthenticatedLayout>
                <ProjectsView
                  score={score}
                  onMilestoneVerified={handleVerifiedSuccess}
                />
              </AuthenticatedLayout>
            }
          />

          <Route
            path="/practice"
            element={
              <AuthenticatedLayout>
                <PracticeView
                  score={score}
                  careerGoal={profile?.careerGoal || 'Software Development'}
                  onQuizCompleted={handleVerifiedSuccess}
                  onOpenScoringExplainer={() => setShowScoringExplainer(true)}
                />
              </AuthenticatedLayout>
            }
          />

          <Route
            path="/internships"
            element={
              <AuthenticatedLayout>
                <InternshipTrackerView
                  score={score}
                  onApplicationVerified={handleVerifiedSuccess}
                />
              </AuthenticatedLayout>
            }
          />

          <Route
            path="/resume"
            element={
              <AuthenticatedLayout>
                <ResumeBuilderView
                  score={score}
                  onResumeVerified={handleVerifiedSuccess}
                />
              </AuthenticatedLayout>
            }
          />

          <Route
            path="/planner"
            element={
              <AuthenticatedLayout>
                <WeeklyPlannerView
                  roadmapItems={roadmapItems}
                  profile={profile}
                  score={score}
                  onVerifyTask={setVerifyingTask}
                />
              </AuthenticatedLayout>
            }
          />

          <Route
            path="/progress"
            element={
              <AuthenticatedLayout>
                <ProgressView
                  score={score}
                  profile={profile}
                  onOpenScoringExplainer={() => setShowScoringExplainer(true)}
                />
              </AuthenticatedLayout>
            }
          />

          <Route
            path="/notifications"
            element={
              <AuthenticatedLayout>
                <NotificationsView
                  onNavigateToTab={(tab) => navigate(`/${tab}`)}
                />
              </AuthenticatedLayout>
            }
          />

          <Route
            path="/profile"
            element={
              <AuthenticatedLayout>
                <ProfileView
                  profile={profile}
                  onProfileUpdated={(up, updatedUser) => {
                    setProfile(up);
                    if (updatedUser) {
                      setUser(prev => prev ? { ...prev, name: updatedUser.name, email: updatedUser.email } : prev);
                    } else {
                      setUser(prev => prev ? { ...prev, name: up.name, email: up.email } : prev);
                    }
                    api.getRoadmap().then(r => setRoadmapItems(r.items));
                    api.getDashboard().then(d => {
                      setDashboardData(d);
                      if (d.score) setScore(d.score);
                    });
                  }}
                />
              </AuthenticatedLayout>
            }
          />

          <Route
            path="/scoring"
            element={
              <AuthenticatedLayout>
                <ScoringPage />
              </AuthenticatedLayout>
            }
          />

          {/* Protected Admin Console */}
          <Route
            path="/admin"
            element={
              <AdminProtectedLayout>
                <AdminPanelView
                  onSwitchToStudent={() => handleSwitchRole('student')}
                />
              </AdminProtectedLayout>
            }
          />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      )}

      {/* Task Verification Modal (when triggered anywhere in app) */}
      {verifyingTask && (
        <TaskVerificationModal
          task={verifyingTask}
          onClose={() => setVerifyingTask(null)}
          onVerifiedSuccess={handleVerifiedSuccess}
          onNavigateToTab={(tab) => navigate(`/${tab}`)}
        />
      )}

      {/* Verified Completion Celebration Modal */}
      {celebrationData && (
        <CelebrationModal
          data={celebrationData}
          onClose={() => setCelebrationData(null)}
        />
      )}

      {/* Scoring Explainer Modal */}
      {showScoringExplainer && (
        <ScoringExplainerModal
          onClose={() => setShowScoringExplainer(false)}
        />
      )}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <FirebaseProvider>
        <AppContent />
      </FirebaseProvider>
    </BrowserRouter>
  );
}
