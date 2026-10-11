import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported, Analytics } from 'firebase/analytics';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  User as FirebaseUser,
  onAuthStateChanged
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  getDocs,
  collection,
  query,
  where,
  onSnapshot,
  getDocFromServer
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { UserProfile, UserScoreStreak, UserTask, InternshipApplication, AIRoadmap } from '../types/index.ts';

export {
  doc,
  getDoc,
  setDoc,
  getDocs,
  collection,
  query,
  where,
  onSnapshot,
  getDocFromServer
};

// 1. Initialize Firebase App and Services
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId); /* CRITICAL: The app will break without this line */
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Firebase Analytics (guarded for browser environment)
export let analytics: Analytics | null = null;
if (typeof window !== 'undefined') {
  isSupported().then(supported => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {});
}

// 2. Validate Connection to Firestore on boot
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase status: Client is offline or Firestore is initializing.');
      return false;
    }
    // Expected permission or empty document response confirms network connectivity to Firestore instance
    return true;
  }
}

// Test connection on boot
testConnection().catch(() => {});

// 3. Error Handling - Strict Compliance with FirestoreErrorInfo
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write'
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// 4. Firebase Authentication Helpers
export async function signInWithGoogle(): Promise<FirebaseUser> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (err: any) {
    if (err.code === 'auth/popup-closed-by-user') {
      throw new Error('Sign-in popup was closed before completing. Please try again.');
    }
    if (err.code === 'auth/popup-blocked') {
      throw new Error('Popup blocked by your browser. Please allow popups for this site to sign in with Google.');
    }
    if (err.code === 'auth/unauthorized-domain') {
      throw new Error('This domain is not authorized in Firebase Console > Authentication > Settings > Authorized domains.');
    }
    if (err.code === 'auth/operation-not-allowed') {
      throw new Error('Google sign-in is not enabled in Firebase Console > Authentication > Sign-in method.');
    }
    console.error('Google Sign-In Error:', err);
    throw err;
  }
}

export async function logOutFirebase(): Promise<void> {
  try {
    await signOut(auth);
  } catch (err: any) {
    console.error('Firebase Sign-Out Error:', err);
  }
}

// 5. Firestore Persistence Helpers
export async function syncProfileToFirestore(profile: UserProfile): Promise<void> {
  if (!auth.currentUser || auth.currentUser.uid !== profile.userId) {
    return;
  }
  const path = `profiles/${profile.userId}`;
  try {
    await setDoc(doc(db, 'profiles', profile.userId), {
      userId: profile.userId,
      name: profile.name,
      email: profile.email,
      educationLevel: profile.educationLevel || 'B.Tech pursuing',
      branch: profile.branch,
      year: profile.year ?? 1,
      semester: profile.semester ?? 1,
      graduationYear: profile.graduationYear || '',
      careerGoal: profile.careerGoal,
      currentSituation: profile.currentSituation || 'Learning skills',
      preferredLanguage: profile.preferredLanguage || 'English',
      interests: profile.interests || [],
      currentSkills: profile.currentSkills || [],
      dailyStudyTime: profile.dailyStudyTime || '1 hr',
      existingExperience: profile.existingExperience || {},
      timezone: profile.timezone || 'Asia/Kolkata (IST, UTC+5:30)',
      preferredStudySlot: profile.preferredStudySlot || 'Evening (5 PM - 8 PM)',
      notificationAlerts: Boolean(profile.notificationAlerts),
      emailReminders: Boolean(profile.emailReminders),
      onboarded: Boolean(profile.onboarded),
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function fetchProfileFromFirestore(userId: string): Promise<UserProfile | null> {
  if (!auth.currentUser) return null;
  const path = `profiles/${userId}`;
  try {
    const snap = await getDoc(doc(db, 'profiles', userId));
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
    return null;
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, path);
  }
}

export async function syncScoreToFirestore(score: UserScoreStreak): Promise<void> {
  if (!auth.currentUser || auth.currentUser.uid !== score.userId) {
    return;
  }
  const path = `scores/${score.userId}`;
  try {
    await setDoc(doc(db, 'scores', score.userId), {
      userId: score.userId,
      totalScore: score.totalScore,
      streakDays: score.streakDays,
      streakFreezeAvailable: score.streakFreezeAvailable,
      level: score.level,
      lastActiveDate: score.lastActiveDate || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function fetchScoreFromFirestore(userId: string): Promise<UserScoreStreak | null> {
  if (!auth.currentUser) return null;
  const path = `scores/${userId}`;
  try {
    const snap = await getDoc(doc(db, 'scores', userId));
    if (snap.exists()) {
      return snap.data() as UserScoreStreak;
    }
    return null;
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, path);
  }
}

export async function syncTaskToFirestore(userTask: UserTask): Promise<void> {
  if (!auth.currentUser || auth.currentUser.uid !== userTask.userId) {
    return;
  }
  const docId = `${userTask.userId}_${userTask.taskId}`;
  const path = `tasks/${docId}`;
  try {
    await setDoc(doc(db, 'tasks', docId), {
      userId: userTask.userId,
      taskId: userTask.taskId,
      status: userTask.status,
      activeSecondsStudied: userTask.activeSecondsStudied || 0,
      completedAt: userTask.completedAt || null,
      verificationData: userTask.verificationData || null
    }, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function fetchTasksFromFirestore(userId: string): Promise<UserTask[]> {
  if (!auth.currentUser) return [];
  const path = 'tasks';
  try {
    const q = query(collection(db, 'tasks'), where('userId', '==', userId));
    const snap = await getDocs(q);
    const tasks: UserTask[] = [];
    snap.forEach(d => {
      tasks.push(d.data() as UserTask);
    });
    return tasks;
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
  }
}

export async function syncApplicationToFirestore(app: InternshipApplication): Promise<void> {
  if (!auth.currentUser || auth.currentUser.uid !== app.userId) {
    return;
  }
  const path = `applications/${app.id}`;
  try {
    await setDoc(doc(db, 'applications', app.id), {
      id: app.id,
      userId: app.userId,
      company: app.company,
      role: app.role,
      appliedDate: app.appliedDate,
      sourceUrl: app.sourceUrl || '',
      status: app.status,
      notes: app.notes || ''
    }, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function syncRoadmapToFirestore(roadmap: AIRoadmap): Promise<void> {
  if (!auth.currentUser || auth.currentUser.uid !== roadmap.userId) {
    return;
  }
  const path = `roadmaps/${roadmap.userId}`;
  try {
    await setDoc(doc(db, 'roadmaps', roadmap.userId), {
      ...roadmap,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function fetchRoadmapFromFirestore(userId: string): Promise<AIRoadmap | null> {
  if (!auth.currentUser) return null;
  const path = `roadmaps/${userId}`;
  try {
    const snap = await getDoc(doc(db, 'roadmaps', userId));
    if (snap.exists()) {
      return snap.data() as AIRoadmap;
    }
    return null;
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, path);
  }
}
