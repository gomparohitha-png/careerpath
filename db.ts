import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import {
  User,
  UserProfile,
  TaskTemplate,
  UserTask,
  UserScoreStreak,
  ActivityEvent,
  QuizBank,
  ProjectTemplate,
  UserProjectSubmission,
  InternshipOpportunity,
  InternshipApplication,
  ResumeData,
  NotificationItem,
  Branch,
  CareerGoal,
  AIRoadmap
} from '../types/index.ts';
import {
  INITIAL_ROADMAP_TEMPLATES,
  INITIAL_QUIZ_BANKS,
  INITIAL_PROJECT_TEMPLATES,
  INITIAL_OPPORTUNITIES
} from './seed.ts';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'careerpath_db.json');

// Persistent Database store with JSON disk backing and structured collections
export class Database {
  users: Map<string, User & { passwordHash: string }> = new Map();
  profiles: Map<string, UserProfile> = new Map();
  roadmapTemplates: Map<string, TaskTemplate> = new Map();
  userTasks: Map<string, UserTask> = new Map(); // key: `${userId}_${taskId}`
  scores: Map<string, UserScoreStreak> = new Map();
  activityLogs: ActivityEvent[] = [];
  quizzes: Map<string, QuizBank> = new Map();
  projects: Map<string, ProjectTemplate> = new Map();
  projectSubmissions: Map<string, UserProjectSubmission> = new Map(); // key: `${userId}_${projectId}`
  opportunities: Map<string, InternshipOpportunity> = new Map();
  applications: Map<string, InternshipApplication> = new Map();
  resumes: Map<string, ResumeData> = new Map();
  notifications: Map<string, NotificationItem[]> = new Map();
  aiRoadmaps: Map<string, AIRoadmap> = new Map(); // key: userId
  passwordResetTokens: Map<string, { email: string; expires: number }> = new Map();

  constructor() {
    this.init();
  }

  private init() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.users)) {
          this.loadFromObject(parsed);
          return;
        }
      }
    } catch (err) {
      console.warn('[Database] Failed to read cached db file, reseeding:', err);
    }

    this.seed();
    this.saveToDisk();
  }

  saveToDisk(): void {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      const serialized = {
        users: Array.from(this.users.entries()),
        profiles: Array.from(this.profiles.entries()),
        roadmapTemplates: Array.from(this.roadmapTemplates.entries()),
        userTasks: Array.from(this.userTasks.entries()),
        scores: Array.from(this.scores.entries()),
        activityLogs: this.activityLogs,
        quizzes: Array.from(this.quizzes.entries()),
        projects: Array.from(this.projects.entries()),
        projectSubmissions: Array.from(this.projectSubmissions.entries()),
        opportunities: Array.from(this.opportunities.entries()),
        applications: Array.from(this.applications.entries()),
        resumes: Array.from(this.resumes.entries()),
        notifications: Array.from(this.notifications.entries()),
        aiRoadmaps: Array.from(this.aiRoadmaps.entries())
      };

      fs.writeFileSync(DB_FILE, JSON.stringify(serialized, null, 2), 'utf-8');
    } catch (err) {
      console.error('[Database] Failed to save database to disk:', err);
    }
  }

  private loadFromObject(data: any): void {
    if (data.users) this.users = new Map(data.users);
    if (data.profiles) this.profiles = new Map(data.profiles);
    if (data.roadmapTemplates) this.roadmapTemplates = new Map(data.roadmapTemplates);
    if (data.userTasks) this.userTasks = new Map(data.userTasks);
    if (data.scores) this.scores = new Map(data.scores);
    if (data.activityLogs) this.activityLogs = data.activityLogs || [];
    if (data.quizzes) this.quizzes = new Map(data.quizzes);
    if (data.projects) this.projects = new Map(data.projects);
    if (data.projectSubmissions) this.projectSubmissions = new Map(data.projectSubmissions);
    if (data.opportunities) this.opportunities = new Map(data.opportunities);
    if (data.applications) this.applications = new Map(data.applications);
    if (data.resumes) this.resumes = new Map(data.resumes);
    if (data.notifications) this.notifications = new Map(data.notifications);
    if (data.aiRoadmaps) this.aiRoadmaps = new Map(data.aiRoadmaps);

    // Make sure templates and opportunities exist if missing
    if (this.roadmapTemplates.size === 0) {
      INITIAL_ROADMAP_TEMPLATES.forEach(t => this.roadmapTemplates.set(t.id, t));
    }
    if (this.quizzes.size === 0) {
      INITIAL_QUIZ_BANKS.forEach(q => this.quizzes.set(q.id, q));
    }
    if (this.projects.size === 0) {
      INITIAL_PROJECT_TEMPLATES.forEach(p => this.projects.set(p.id, p));
    }
    if (this.opportunities.size === 0) {
      INITIAL_OPPORTUNITIES.forEach(o => this.opportunities.set(o.id, o));
    }

    // Ensure demo accounts always exist
    this.ensureDemoAccounts();
  }

  private ensureDemoAccounts() {
    const adminId = 'user-admin';
    if (!this.users.has(adminId)) {
      const adminSalt = bcrypt.genSaltSync(10);
      const adminHash = bcrypt.hashSync('admin123', adminSalt);
      this.users.set(adminId, {
        id: adminId,
        name: 'Dr. K. Sharma (TPO Admin)',
        email: 'admin@careerpath.edu',
        role: 'admin',
        passwordHash: adminHash
      });
    }

    const studentId = 'user-student-demo';
    if (!this.users.has(studentId)) {
      const studentSalt = bcrypt.genSaltSync(10);
      const studentHash = bcrypt.hashSync('student123', studentSalt);
      this.users.set(studentId, {
        id: studentId,
        name: 'Rohit Verma',
        email: 'rohit@careerpath.edu',
        role: 'student',
        passwordHash: studentHash
      });
    }

    if (!this.scores.has(studentId)) {
      this.initScore(studentId);
    }

    if (!this.profiles.has(studentId)) {
      const rohitProfile: UserProfile = {
        id: 'prof-user-student-demo',
        userId: studentId,
        name: 'Rohit Verma',
        email: 'rohit@careerpath.edu',
        branch: 'CSE',
        year: 2,
        semester: 4,
        careerGoal: 'Software Development',
        interests: ['Web Development', 'Algorithms', 'Cloud Computing'],
        currentSkills: [
          { name: 'Python', level: 'Intermediate' },
          { name: 'Data Structures', level: 'Intermediate' },
          { name: 'SQL', level: 'Beginner' }
        ],
        dailyStudyTime: '1 hr',
        timezone: 'Asia/Kolkata (IST, UTC+5:30)',
        notificationAlerts: true,
        emailReminders: true,
        preferredStudySlot: 'Evening (5 PM - 8 PM)',
        onboarded: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      this.profiles.set(studentId, rohitProfile);
    }
  }

  private seed() {
    // Seed roadmap templates
    INITIAL_ROADMAP_TEMPLATES.forEach(t => this.roadmapTemplates.set(t.id, t));

    // Seed quizzes
    INITIAL_QUIZ_BANKS.forEach(q => this.quizzes.set(q.id, q));

    // Seed projects
    INITIAL_PROJECT_TEMPLATES.forEach(p => this.projects.set(p.id, p));

    // Seed opportunities
    INITIAL_OPPORTUNITIES.forEach(o => this.opportunities.set(o.id, o));

    this.ensureDemoAccounts();
  }

  // --- Score & Streak Management ---
  initScore(userId: string): UserScoreStreak {
    const existing = this.scores.get(userId);
    if (existing) return existing;

    const initial: UserScoreStreak = {
      userId,
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
    };
    this.scores.set(userId, initial);
    this.saveToDisk();
    return initial;
  }

  getScore(userId: string): UserScoreStreak {
    return this.scores.get(userId) || this.initScore(userId);
  }

  calculateLevel(score: number): 'Starter' | 'Explorer' | 'Builder' | 'Achiever' | 'Placement Ready' {
    if (score >= 800) return 'Placement Ready';
    if (score >= 500) return 'Achiever';
    if (score >= 250) return 'Builder';
    if (score >= 100) return 'Explorer';
    return 'Starter';
  }

  awardVerifiedPoints(
    userId: string,
    category: 'skills' | 'projects' | 'practice' | 'resume' | 'internships',
    points: number,
    title: string,
    verificationType: any,
    details?: string
  ): { scoreRecord: UserScoreStreak; event: ActivityEvent } {
    const scoreRecord = this.getScore(userId);

    // Update category & total scores
    scoreRecord.categoryScores[category] += points;
    scoreRecord.totalScore += points;
    scoreRecord.level = this.calculateLevel(scoreRecord.totalScore);

    // Calculate Streak based on student day (today)
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const daysMap = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayName = daysMap[today.getDay()];

    scoreRecord.weeklyActivity[dayName] = true;

    if (!scoreRecord.lastActiveDate) {
      scoreRecord.streakDays = 1;
      scoreRecord.lastActiveDate = todayStr;
    } else if (scoreRecord.lastActiveDate !== todayStr) {
      const last = new Date(scoreRecord.lastActiveDate);
      const diffMs = today.getTime() - last.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        scoreRecord.streakDays += 1;
      } else if (diffDays === 2 && scoreRecord.streakFreezeAvailable) {
        scoreRecord.streakFreezeAvailable = false;
        scoreRecord.streakDays += 1;
      } else {
        scoreRecord.streakDays = 1;
      }
      scoreRecord.lastActiveDate = todayStr;
    }

    this.scores.set(userId, scoreRecord);

    // Create Activity Log Entry
    const event: ActivityEvent = {
      id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      userId,
      timestamp: new Date().toISOString(),
      category,
      points,
      title,
      verificationType,
      details
    };
    this.activityLogs.unshift(event);

    this.saveToDisk();
    return { scoreRecord, event };
  }

  // --- Profile & Roadmap Adaptation ---
  getProfile(userId: string): UserProfile | null {
    return this.profiles.get(userId) || null;
  }

  saveProfile(profile: UserProfile): UserProfile {
    profile.updatedAt = new Date().toISOString();
    this.profiles.set(profile.userId, profile);
    this.saveToDisk();
    return profile;
  }

  getAIRoadmap(userId: string): AIRoadmap | null {
    return this.aiRoadmaps.get(userId) || null;
  }

  saveAIRoadmap(userId: string, roadmap: AIRoadmap): AIRoadmap {
    this.aiRoadmaps.set(userId, roadmap);
    this.saveToDisk();
    return roadmap;
  }

  saveUser(user: User & { passwordHash: string }): void {
    this.users.set(user.id, user);
    this.saveToDisk();
  }

  // Fetch roadmap tasks tailored to user's branch, year, and career goal
  getPersonalizedRoadmap(userId: string): { template: TaskTemplate; userTask: UserTask }[] {
    const profile = this.getProfile(userId);
    const branch = profile ? profile.branch : 'CSE';
    const goal = profile ? profile.careerGoal : 'Software Development';

    const branchCategory =
      branch === 'CSE' || branch === 'IT'
        ? 'CSE_IT'
        : branch === 'ECE'
        ? 'ECE'
        : branch === 'EEE'
        ? 'EEE'
        : branch === 'Mechanical'
        ? 'MECHANICAL'
        : branch === 'Civil'
        ? 'CIVIL'
        : 'ALL';

    const tasks = Array.from(this.roadmapTemplates.values()).filter(t => {
      const matchBranch = t.branchCategory === 'ALL' || t.branchCategory === branchCategory;
      const matchGoal = !t.goalCategory || t.goalCategory === 'ALL' || t.goalCategory === goal;
      return matchBranch && matchGoal;
    });

    tasks.sort((a, b) => a.year - b.year || a.order - b.order);

    return tasks.map(template => {
      const key = `${userId}_${template.id}`;
      let userTask = this.userTasks.get(key);
      if (!userTask) {
        userTask = {
          id: key,
          userId,
          taskId: template.id,
          status: 'not_started',
          activeSecondsStudied: 0
        };
        this.userTasks.set(key, userTask);
      }
      return { template, userTask };
    });
  }

  // Mark task completed (ONLY called by server verification routines)
  completeUserTask(userId: string, taskId: string, verificationData?: any): UserTask {
    const key = `${userId}_${taskId}`;
    let userTask = this.userTasks.get(key);
    if (!userTask) {
      userTask = {
        id: key,
        userId,
        taskId,
        status: 'completed',
        completedAt: new Date().toISOString(),
        activeSecondsStudied: 0,
        verificationData
      };
    } else {
      userTask.status = 'completed';
      userTask.completedAt = new Date().toISOString();
      userTask.verificationData = verificationData;
    }
    this.userTasks.set(key, userTask);
    this.saveToDisk();
    return userTask;
  }

  // --- Notifications Management ---
  getUserNotifications(userId: string): NotificationItem[] {
    const list = this.notifications.get(userId);
    if (!list) {
      const initial: NotificationItem[] = [
        {
          id: `notif-1-${userId}`,
          userId,
          title: 'Welcome to CareerPath!',
          message: 'Your personalized roadmap is configured. Complete your first task to start your streak!',
          type: 'info',
          timestamp: new Date().toISOString(),
          read: false
        },
        {
          id: `notif-2-${userId}`,
          userId,
          title: 'Daily Focus Ready',
          message: 'Your weekly study planner has queued priority milestones based on your study cadence.',
          type: 'deadline',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          read: false
        }
      ];
      this.notifications.set(userId, initial);
      this.saveToDisk();
      return initial;
    }
    return list;
  }

  addNotification(userId: string, notif: Omit<NotificationItem, 'id' | 'userId' | 'timestamp' | 'read'>): NotificationItem {
    const item: NotificationItem = {
      ...notif,
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      userId,
      timestamp: new Date().toISOString(),
      read: false
    };
    const list = this.getUserNotifications(userId);
    list.unshift(item);
    this.notifications.set(userId, list);
    this.saveToDisk();
    return item;
  }

  markNotificationRead(userId: string, notifId: string): boolean {
    const list = this.getUserNotifications(userId);
    const item = list.find(n => n.id === notifId);
    if (item) {
      item.read = true;
      this.notifications.set(userId, list);
      this.saveToDisk();
      return true;
    }
    return false;
  }

  markAllNotificationsRead(userId: string): void {
    const list = this.getUserNotifications(userId);
    list.forEach(n => (n.read = true));
    this.notifications.set(userId, list);
    this.saveToDisk();
  }

  // --- Resumes & Applications & Projects ---
  saveResume(userId: string, data: ResumeData): ResumeData {
    this.resumes.set(userId, data);
    this.saveToDisk();
    return data;
  }

  saveApplication(app: InternshipApplication): InternshipApplication {
    this.applications.set(app.id, app);
    this.saveToDisk();
    return app;
  }

  saveProjectSubmission(key: string, sub: UserProjectSubmission): UserProjectSubmission {
    this.projectSubmissions.set(key, sub);
    this.saveToDisk();
    return sub;
  }

  // --- Progress & Analytics ---
  getProgressAnalytics(userId: string) {
    const score = this.getScore(userId);
    const activities = this.activityLogs.filter(a => a.userId === userId);
    const userRoadmap = this.getPersonalizedRoadmap(userId);
    const completedTasks = userRoadmap.filter(t => t.userTask.status === 'completed');

    const achievements = [
      {
        id: 'ach-first-step',
        title: 'First Verified Step',
        description: 'Complete your first learning task with active reading tracker',
        earned: score.totalScore >= 10,
        icon: 'Sparkles',
        date: activities.find(a => a.category === 'skills')?.timestamp || null
      },
      {
        id: 'ach-quiz-master',
        title: 'Assessment Ace',
        description: 'Pass a technical assessment or practice quiz with >= 70%',
        earned: score.categoryScores.practice >= 15,
        icon: 'Zap',
        date: activities.find(a => a.category === 'practice')?.timestamp || null
      },
      {
        id: 'ach-code-builder',
        title: 'Repository Architect',
        description: 'Submit and verify a public GitHub engineering project repository',
        earned: score.categoryScores.projects >= 30,
        icon: 'FolderGit2',
        date: activities.find(a => a.category === 'projects')?.timestamp || null
      },
      {
        id: 'ach-ats-resume',
        title: 'Recruitment Ready',
        description: 'Build and validate an ATS-compliant technical resume',
        earned: score.categoryScores.resume >= 50,
        icon: 'FileText',
        date: activities.find(a => a.category === 'resume')?.timestamp || null
      },
      {
        id: 'ach-pipeline',
        title: 'Opportunity Hunter',
        description: 'Record and track an authentic company internship application',
        earned: score.categoryScores.internships >= 20,
        icon: 'Briefcase',
        date: activities.find(a => a.category === 'internships')?.timestamp || null
      },
      {
        id: 'ach-streak-fire',
        title: 'Consistent Discipline',
        description: 'Maintain an active verified streak for 3 or more days',
        earned: score.streakDays >= 3,
        icon: 'Flame',
        date: score.streakDays >= 3 ? score.lastActiveDate : null
      }
    ];

    const foundationsWeight = Math.min(25, Math.round((score.categoryScores.skills / 80) * 25));
    const projectsWeight = Math.min(35, Math.round((score.categoryScores.projects / 120) * 35));
    const practiceWeight = Math.min(25, Math.round((score.categoryScores.practice / 75) * 25));
    const resumeWeight = Math.min(15, Math.round((score.categoryScores.resume / 50) * 15));
    const readinessScore = Math.min(100, foundationsWeight + projectsWeight + practiceWeight + resumeWeight);

    return {
      score,
      readinessScore,
      readinessBreakdown: {
        foundations: { score: foundationsWeight, max: 25 },
        projects: { score: projectsWeight, max: 35 },
        practice: { score: practiceWeight, max: 25 },
        resume: { score: resumeWeight, max: 15 }
      },
      achievements,
      totalCompletedTasks: completedTasks.length,
      totalRoadmapTasks: userRoadmap.length,
      recentActivities: activities.slice(0, 15)
    };
  }

  // --- Admin CRUD Operations ---
  addOrUpdateRoadmapTemplate(template: TaskTemplate): TaskTemplate {
    this.roadmapTemplates.set(template.id, template);
    this.saveToDisk();
    return template;
  }

  deleteRoadmapTemplate(id: string): boolean {
    const res = this.roadmapTemplates.delete(id);
    this.saveToDisk();
    return res;
  }

  addOrUpdateOpportunity(opp: InternshipOpportunity): InternshipOpportunity {
    this.opportunities.set(opp.id, opp);
    this.saveToDisk();
    return opp;
  }

  deleteOpportunity(id: string): boolean {
    const res = this.opportunities.delete(id);
    this.saveToDisk();
    return res;
  }

  addOrUpdateQuiz(quiz: QuizBank): QuizBank {
    this.quizzes.set(quiz.id, quiz);
    this.saveToDisk();
    return quiz;
  }

  addOrUpdateProject(proj: ProjectTemplate): ProjectTemplate {
    this.projects.set(proj.id, proj);
    this.saveToDisk();
    return proj;
  }

  // --- Password Reset Mock Store ---
  requestPasswordReset(email: string): string | null {
    const user = Array.from(this.users.values()).find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) return null;
    const token = `reset-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    this.passwordResetTokens.set(token, {
      email: user.email,
      expires: Date.now() + 3600000 // 1 hour
    });
    return token;
  }

  resetPassword(token: string, newPassword: string): boolean {
    const entry = this.passwordResetTokens.get(token);
    if (!entry || entry.expires < Date.now()) return false;
    const user = Array.from(this.users.values()).find(u => u.email.toLowerCase() === entry.email.toLowerCase());
    if (!user) return false;

    const salt = bcrypt.genSaltSync(10);
    user.passwordHash = bcrypt.hashSync(newPassword, salt);
    this.users.set(user.id, user);
    this.passwordResetTokens.delete(token);
    this.saveToDisk();
    return true;
  }
}

export const db = new Database();
