import {
  UserProfile,
  UserScoreStreak,
  TaskTemplate,
  UserTask,
  QuizBank,
  ProjectTemplate,
  InternshipOpportunity,
  InternshipApplication,
  ResumeData,
  AIRoadmap
} from '../types/index.ts';

const TOKEN_KEY = 'careerpath_token';

export const api = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  },

  clearToken() {
    localStorage.removeItem(TOKEN_KEY);
  },

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {})
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(endpoint, {
      ...options,
      headers
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Request failed');
    }
    return data;
  },

  // Auth
  async login(email: string, password: string) {
    const res = await this.request<{ token: string; user: any; profile: UserProfile | null; score: UserScoreStreak }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    this.setToken(res.token);
    return res;
  },

  async firebaseLogin(uid: string, email: string, name: string) {
    const res = await this.request<{ token: string; user: any; profile: UserProfile | null; score: UserScoreStreak }>('/api/auth/firebase-login', {
      method: 'POST',
      body: JSON.stringify({ uid, email, name })
    });
    this.setToken(res.token);
    return res;
  },

  async register(name: string, email: string, password: string, role = 'student') {
    const res = await this.request<{ token: string; user: any }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role })
    });
    this.setToken(res.token);
    return res;
  },

  async forgotPassword(email: string) {
    return this.request<{ success: boolean; resetToken?: string; message: string }>('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  },

  async resetPassword(token: string, newPassword: string) {
    return this.request<{ success: boolean; message: string }>('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword })
    });
  },

  async getMe() {
    return this.request<{ user: any; profile: UserProfile | null; score: UserScoreStreak }>('/api/auth/me');
  },

  async switchAccount(targetRole: 'student' | 'admin') {
    const res = await this.request<{ token: string; user: any; profile: UserProfile | null; score: UserScoreStreak }>('/api/auth/switch-account', {
      method: 'POST',
      body: JSON.stringify({ targetRole })
    });
    this.setToken(res.token);
    return res;
  },

  // Profile & Onboarding
  async getProfile() {
    return this.request<{ profile: UserProfile | null }>('/api/profile');
  },

  async saveProfile(profileData: Partial<UserProfile>) {
    return this.request<{ success: boolean; profile: UserProfile; user?: any; message?: string }>('/api/profile', {
      method: 'POST',
      body: JSON.stringify(profileData)
    });
  },

  // Roadmap
  async getRoadmap() {
    return this.request<{ items: { template: TaskTemplate; userTask: UserTask }[] }>('/api/roadmap');
  },

  async generateAIRoadmap() {
    return this.request<{ roadmap: AIRoadmap; message: string }>('/api/roadmap/ai-generate', {
      method: 'POST'
    });
  },

  async getAIRoadmap() {
    return this.request<{ roadmap: AIRoadmap | null }>('/api/roadmap/ai');
  },

  async askAIMentor(question: string, context?: string) {
    return this.request<{ answer: string }>('/api/roadmap/ai-mentor', {
      method: 'POST',
      body: JSON.stringify({ question, context })
    });
  },

  // Dashboard
  async getDashboard() {
    return this.request<{
      profile: UserProfile | null;
      score: UserScoreStreak;
      stats: {
        totalTasks: number;
        completedCount: number;
        progressPercent: number;
        applicationsCount: number;
      };
      thisWeekTasks: { template: TaskTemplate; userTask: UserTask }[];
      nextBestAction: any;
      recentActivities: any[];
      notifications: any[];
    }>('/api/dashboard');
  },

  // AUTOMATED VERIFICATION ENDPOINTS
  async verifyLearning(taskId: string, activeSeconds: number, quizAnswers: Record<string, number>) {
    return this.request<{
      success: boolean;
      pointsAwarded: number;
      scoreRecord: UserScoreStreak;
      message: string;
      alreadyCompleted?: boolean;
    }>('/api/verify/learning', {
      method: 'POST',
      body: JSON.stringify({ taskId, activeSeconds, quizAnswers })
    });
  },

  async verifyQuiz(quizId: string, taskId: string | undefined, answers: Record<string, number>) {
    return this.request<{
      passed: boolean;
      scorePercent: number;
      correctCount: number;
      totalQuestions: number;
      pointsAwarded: number;
      scoreRecord: UserScoreStreak;
      results: any[];
    }>('/api/verify/quiz', {
      method: 'POST',
      body: JSON.stringify({ quizId, taskId, answers })
    });
  },

  async verifyGithub(repoUrl: string, projectId?: string, milestoneId?: string, taskId?: string) {
    return this.request<{
      success: boolean;
      repoName: string;
      commitCount: number;
      pointsAwarded: number;
      scoreRecord: UserScoreStreak;
      message: string;
    }>('/api/verify/github', {
      method: 'POST',
      body: JSON.stringify({ repoUrl, projectId, milestoneId, taskId })
    });
  },

  async verifyResume(resumeData: ResumeData, taskId?: string) {
    return this.request<{
      success: boolean;
      pointsAwarded: number;
      scoreRecord: UserScoreStreak;
      message: string;
    }>('/api/verify/resume', {
      method: 'POST',
      body: JSON.stringify({ resumeData, taskId })
    });
  },

  async verifyInternship(appData: {
    company: string;
    role: string;
    appliedDate: string;
    status: string;
    notes?: string;
    sourceUrl?: string;
    taskId?: string;
  }) {
    return this.request<{
      success: boolean;
      application: InternshipApplication;
      pointsAwarded: number;
      scoreRecord: UserScoreStreak;
      message: string;
    }>('/api/verify/internship', {
      method: 'POST',
      body: JSON.stringify(appData)
    });
  },

  // Resume
  async getResume() {
    return this.request<{ resume: ResumeData }>('/api/resume');
  },

  // Opportunities & Applications
  async getOpportunities() {
    return this.request<{ opportunities: InternshipOpportunity[] }>('/api/opportunities');
  },

  async getApplications() {
    return this.request<{ applications: InternshipApplication[] }>('/api/applications');
  },

  async updateApplication(id: string, status: string, notes?: string) {
    return this.request<{ success: boolean; application: InternshipApplication }>(`/api/applications/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status, notes })
    });
  },

  // Projects
  async getProjects() {
    return this.request<{ projects: (ProjectTemplate & { userSubmission: any })[] }>('/api/projects');
  },

  // Quizzes
  async getQuizzes() {
    return this.request<{ quizzes: any[] }>('/api/quizzes');
  },

  async getQuizDetails(id: string) {
    return this.request<QuizBank>(`/api/quizzes/${id}`);
  },

  // Notifications
  async getNotifications() {
    return this.request<{ notifications: any[] }>('/api/notifications');
  },

  async markNotificationRead(id: string) {
    return this.request<{ success: boolean }>(`/api/notifications/${id}/read`, {
      method: 'PATCH'
    });
  },

  async markAllNotificationsRead() {
    return this.request<{ success: boolean }>('/api/notifications/mark-all-read', {
      method: 'POST'
    });
  },

  // Progress Analytics
  async getProgressAnalytics() {
    return this.request<{
      score: UserScoreStreak;
      readinessScore: number;
      readinessBreakdown: {
        foundations: { score: number; max: number };
        projects: { score: number; max: number };
        practice: { score: number; max: number };
        resume: { score: number; max: number };
      };
      achievements: any[];
      totalCompletedTasks: number;
      totalRoadmapTasks: number;
      recentActivities: any[];
    }>('/api/progress');
  },

  // Admin CRUD
  async getAdminStats() {
    return this.request<any>('/api/admin/stats');
  },

  async adminGetTemplates() {
    return this.request<{ templates: TaskTemplate[] }>('/api/admin/templates');
  },

  async adminSaveTemplate(template: Partial<TaskTemplate>) {
    return this.request<{ success: boolean; template: TaskTemplate }>('/api/admin/templates', {
      method: 'POST',
      body: JSON.stringify(template)
    });
  },

  async adminDeleteTemplate(id: string) {
    return this.request<{ success: boolean }>(`/api/admin/templates/${id}`, {
      method: 'DELETE'
    });
  },

  async adminGetOpportunities() {
    return this.request<{ opportunities: InternshipOpportunity[] }>('/api/admin/opportunities');
  },

  async adminSaveOpportunity(opp: Partial<InternshipOpportunity>) {
    return this.request<{ success: boolean; opportunity: InternshipOpportunity }>('/api/admin/opportunities', {
      method: 'POST',
      body: JSON.stringify(opp)
    });
  },

  async adminDeleteOpportunity(id: string) {
    return this.request<{ success: boolean }>(`/api/admin/opportunities/${id}`, {
      method: 'DELETE'
    });
  }
};
