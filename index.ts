export type Branch = 'CSE' | 'IT' | 'ECE' | 'EEE' | 'Mechanical' | 'Civil' | 'Other';

export type EducationLevel =
  | 'B.Tech pursuing'
  | 'B.Tech completed'
  | 'Other undergraduate degree'
  | 'Postgraduate student'
  | 'Postgraduate completed'
  | 'Other completed education';

export type CareerGoal =
  | 'Software Development'
  | 'AI and Data Science'
  | 'AI/Data Science'
  | 'Cybersecurity'
  | 'Core Engineering'
  | 'Government Jobs'
  | 'GATE and Higher Studies'
  | 'Higher Studies'
  | 'MBA'
  | 'Research'
  | 'Entrepreneurship'
  | 'Immediate Employment'
  | 'Exploring Career Options'
  | 'Exploring';

export type CurrentSituation =
  | 'Beginner'
  | 'Learning skills'
  | 'Building projects'
  | 'Searching for internships'
  | 'Preparing for placements'
  | 'Recently graduated'
  | 'Searching for a job'
  | 'Preparing for higher studies';

export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type DailyStudyTime = '30 min' | '30 mins' | '1 hr' | '2 hrs' | '3+ hrs';

export type TaskDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export type VerificationType =
  | 'learning'
  | 'quiz'
  | 'github_milestone'
  | 'resume'
  | 'internship_app'
  | 'planner_activity';

export type TaskStatus = 'not_started' | 'in_progress' | 'completed';

export interface UserSkill {
  name: string;
  level: SkillLevel;
}

export interface UserProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  educationLevel?: EducationLevel;
  branch: Branch;
  year: number; // 1, 2, 3, 4
  semester: number; // 1 - 8
  graduationYear?: number | string;
  careerGoal: CareerGoal;
  currentSituation?: CurrentSituation;
  preferredLanguage?: string;
  interests: string[];
  currentSkills: UserSkill[];
  dailyStudyTime: DailyStudyTime;
  existingExperience?: {
    projects?: string;
    certifications?: string;
    workExperience?: string;
    examsCompleted?: string;
  };
  timezone?: string;
  notificationAlerts?: boolean;
  emailReminders?: boolean;
  preferredStudySlot?: 'Morning (6 AM - 9 AM)' | 'Afternoon (1 PM - 4 PM)' | 'Evening (5 PM - 8 PM)' | 'Night Owl (9 PM - Midnight)';
  onboarded: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AIRoadmapPhaseResource {
  title: string;
  url: string;
  type: 'Documentation' | 'Course' | 'Interactive' | 'Practice';
}

export interface AIRoadmapPhaseProject {
  title: string;
  description: string;
  techStack: string[];
  folderStructure?: string;
}

export interface AIRoadmapPhase {
  phaseNumber: number;
  title: string;
  expectedDuration: string;
  skillsToLearn: string[];
  topicsToStudy: string[];
  freeResources: AIRoadmapPhaseResource[];
  practiceExercises: string[];
  projectsToBuild: AIRoadmapPhaseProject[];
  expectedOutcome: string;
  completionRequirements: string;
  dependencies: string;
}

export interface AIRoadmap {
  id: string;
  userId: string;
  generatedAt: string;
  source: 'gemini' | 'curated_fallback';
  currentPosition: {
    stageTitle: string;
    careerGoal: string;
    existingSkills: string[];
    skillsToImprove: string[];
    currentStrengths: string[];
    importantSkillGaps: string[];
    summary: string;
  };
  phases: AIRoadmapPhase[];
  immediateActionPlan: {
    today: string;
    thisWeek: string;
    thisMonth: string;
    nextMilestone: string;
  };
  futureOpportunities: {
    potentialRoles: string[];
    internshipsAndExams: string[];
    higherStudiesOptions: string[];
    specializations: string[];
    disclaimer: string;
  };
  topThreeActions: string[];
  progressMeasurement: string;
}

export interface AIMentorMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
}

export interface TaskTemplate {
  id: string;
  year: number; // 1, 2, 3, 4
  semester?: number;
  branchCategory: string; // 'CSE_IT' | 'ECE' | 'EEE' | 'MECHANICAL' | 'CIVIL' | 'ALL'
  goalCategory?: string; // e.g. 'Software Development' or 'ALL'
  title: string;
  whatYouWillLearn: string; // 1 to 2 simple sentences
  whyItMatters: string; // 1 sentence
  timeNeeded: string; // e.g. "45 mins", "2 hours"
  difficulty: TaskDifficulty;
  freeResourceUrl: string;
  resourceName: string;
  verificationType: VerificationType;
  verificationRule: string; // Plain English completion rule
  threshold: number; // e.g., 60 for 60% quiz, 3 commits, etc.
  minTimeSeconds: number; // min active reading time (e.g., 30s for demo, 180s for real)
  points: number; // e.g., 10 for learning, 25 for quiz, 30 milestone, etc.
  category: 'skills' | 'projects' | 'practice' | 'resume' | 'internships';
  quizId?: string;
  order: number;
}

export interface UserTask {
  id: string;
  userId: string;
  taskId: string;
  status: TaskStatus;
  completedAt?: string;
  activeSecondsStudied: number;
  lastAttemptAt?: string;
  verificationData?: any;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface QuizBank {
  id: string;
  title: string;
  category: string;
  questions: QuizQuestion[];
  passingScore: number; // default 60%
}

export interface ActivityEvent {
  id: string;
  userId: string;
  timestamp: string;
  category: 'skills' | 'projects' | 'practice' | 'resume' | 'internships';
  points: number;
  title: string;
  verificationType: VerificationType;
  details?: string;
}

export interface UserScoreStreak {
  userId: string;
  totalScore: number;
  streakDays: number;
  streakFreezeAvailable: boolean;
  lastActiveDate: string | null;
  level: 'Starter' | 'Explorer' | 'Builder' | 'Achiever' | 'Placement Ready';
  categoryScores: {
    skills: number;
    projects: number;
    practice: number;
    resume: number;
    internships: number;
  };
  weeklyActivity: { [dayOfWeek: string]: boolean }; // e.g. { "Mon": true, "Tue": false, ... }
}

export interface ProjectMilestone {
  id: string;
  title: string;
  description: string;
  verificationHint: string;
  points: number;
}

export interface ProjectTemplate {
  id: string;
  title: string;
  description: string;
  branch: string[];
  year: number[];
  careerGoal: string[];
  difficulty: TaskDifficulty;
  techStack: string[];
  learningOutcomes: string[];
  milestones: ProjectMilestone[];
  repoGuidelines: string;
}

export interface UserProjectSubmission {
  id: string;
  userId: string;
  projectId: string;
  repoUrl: string;
  completedMilestones: string[];
  verifiedCommitCount: number;
  hasReadme: boolean;
  lastVerifiedAt: string;
  status: 'in_progress' | 'completed';
}

export interface InternshipOpportunity {
  id: string;
  company: string;
  role: string;
  location: string;
  type: 'Summer Internship' | 'Winter Internship' | 'Full-Time Internship';
  stipend: string;
  branch: string[];
  requirements: string[];
  verifiedSource: string;
  lastCheckedDate: string;
  applicationLink: string;
  isVerified: boolean;
}

export interface InternshipApplication {
  id: string;
  userId: string;
  company: string;
  role: string;
  appliedDate: string;
  status: 'Wishlist' | 'Applied' | 'Interviewing' | 'Offer Received' | 'Rejected';
  notes?: string;
  sourceUrl?: string;
}

export interface ResumeData {
  fullName: string;
  email: string;
  phone: string;
  github: string;
  linkedin: string;
  summary: string;
  education: {
    institution: string;
    degree: string;
    branch: string;
    startYear: string;
    endYear: string;
    cgpa: string;
  }[];
  skills: {
    category: string;
    items: string;
  }[];
  projects: {
    name: string;
    tech: string;
    description: string;
    link?: string;
  }[];
  internships: {
    role: string;
    company: string;
    duration: string;
    contributions: string;
  }[];
  certifications: string[];
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'streak_risk' | 'deadline' | 'achievement' | 'info';
  timestamp: string;
  read: boolean;
}
