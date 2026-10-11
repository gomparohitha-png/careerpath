import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithPopup,
  signOut
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  getDocs,
  collection,
  query,
  where,
  onSnapshot
} from 'firebase/firestore';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from '../lib/firebase.ts';
import { UserProfile, UserScoreStreak, UserTask, InternshipApplication, AIRoadmap } from '../types/index.ts';

interface FirebaseContextType {
  firebaseUser: FirebaseUser | null;
  isFirebaseReady: boolean;
  isCloudSyncActive: boolean;
  signInWithGoogle: () => Promise<FirebaseUser>;
  signOut: () => Promise<void>;
  // Firestore Data Operations
  saveUserProfile: (profile: UserProfile) => Promise<void>;
  fetchUserProfile: (userId: string) => Promise<UserProfile | null>;
  saveUserScore: (score: UserScoreStreak) => Promise<void>;
  fetchUserScore: (userId: string) => Promise<UserScoreStreak | null>;
  saveUserTask: (task: UserTask) => Promise<void>;
  fetchUserTasks: (userId: string) => Promise<UserTask[]>;
  saveApplication: (app: InternshipApplication) => Promise<void>;
  deleteApplication: (appId: string) => Promise<void>;
  fetchApplications: (userId: string) => Promise<InternshipApplication[]>;
  saveAIRoadmap: (roadmap: AIRoadmap) => Promise<void>;
  fetchAIRoadmap: (userId: string) => Promise<AIRoadmap | null>;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export const FirebaseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isFirebaseReady, setIsFirebaseReady] = useState(false);

  useEffect(() => {
    // 1. Reactive listener for Firebase Auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      setIsFirebaseReady(true);
    });

    return () => unsubscribe();
  }, []);

  // 2. Google Authentication with friendly error handling
  const signInWithGoogle = async (): Promise<FirebaseUser> => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (err: any) {
      if (err.code === 'auth/popup-closed-by-user') {
        throw new Error('Sign-in popup was closed before completing. Please try again.');
      }
      if (err.code === 'auth/popup-blocked') {
        throw new Error('Sign-in popup was blocked by your browser. Please allow popups to sign in with Google.');
      }
      if (err.code === 'auth/unauthorized-domain') {
        throw new Error('Domain not authorized for OAuth in Firebase Console. Please add this domain to Authentication > Settings > Authorized domains.');
      }
      if (err.code === 'auth/operation-not-allowed') {
        throw new Error('Google sign-in is not enabled in Firebase Console. Please enable Google in Authentication > Sign-in method.');
      }
      console.error('Google Sign-In Error:', err);
      throw err;
    }
  };

  const handleSignOut = async (): Promise<void> => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Sign-out error:', err);
    }
  };

  // 3. Firestore Document Helpers
  const saveUserProfile = async (profile: UserProfile): Promise<void> => {
    if (!auth.currentUser || auth.currentUser.uid !== profile.userId) {
      return;
    }
    const path = `profiles/${profile.userId}`;
    try {
      await setDoc(doc(db, 'profiles', profile.userId), {
        userId: profile.userId,
        name: profile.name,
        email: profile.email,
        branch: profile.branch,
        year: Number(profile.year) || 1,
        semester: Number(profile.semester) || 1,
        careerGoal: profile.careerGoal,
        interests: profile.interests || [],
        currentSkills: profile.currentSkills || [],
        dailyStudyTime: profile.dailyStudyTime || '1 hr',
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
  };

  const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
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
  };

  const saveUserScore = async (score: UserScoreStreak): Promise<void> => {
    if (!auth.currentUser || auth.currentUser.uid !== score.userId) {
      return;
    }
    const path = `scores/${score.userId}`;
    try {
      await setDoc(doc(db, 'scores', score.userId), {
        userId: score.userId,
        totalScore: Number(score.totalScore) || 0,
        streakDays: Number(score.streakDays) || 0,
        streakFreezeAvailable: Boolean(score.streakFreezeAvailable),
        level: score.level || 'Starter',
        lastActiveDate: score.lastActiveDate || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  };

  const fetchUserScore = async (userId: string): Promise<UserScoreStreak | null> => {
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
  };

  const saveUserTask = async (task: UserTask): Promise<void> => {
    if (!auth.currentUser || auth.currentUser.uid !== task.userId) {
      return;
    }
    const docId = `${task.userId}_${task.taskId}`;
    const path = `tasks/${docId}`;
    try {
      await setDoc(doc(db, 'tasks', docId), {
        userId: task.userId,
        taskId: task.taskId,
        status: task.status,
        activeSecondsStudied: Number(task.activeSecondsStudied) || 0,
        completedAt: task.completedAt || null,
        verificationData: task.verificationData || null
      }, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  };

  const fetchUserTasks = async (userId: string): Promise<UserTask[]> => {
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
  };

  const saveApplication = async (app: InternshipApplication): Promise<void> => {
    if (!auth.currentUser || auth.currentUser.uid !== app.userId) {
      return;
    }
    const path = `applications/${app.id}`;
    try {
      await setDoc(doc(db, 'applications', app.id), {
        id: app.id,
        userId: app.userId,
        company: app.company.trim(),
        role: app.role.trim(),
        appliedDate: app.appliedDate,
        sourceUrl: app.sourceUrl || '',
        status: app.status || 'Applied',
        notes: app.notes || ''
      }, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  };

  const deleteApplication = async (appId: string): Promise<void> => {
    if (!auth.currentUser) return;
    const path = `applications/${appId}`;
    try {
      await deleteDoc(doc(db, 'applications', appId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  };

  const fetchApplications = async (userId: string): Promise<InternshipApplication[]> => {
    if (!auth.currentUser) return [];
    const path = 'applications';
    try {
      const q = query(collection(db, 'applications'), where('userId', '==', userId));
      const snap = await getDocs(q);
      const apps: InternshipApplication[] = [];
      snap.forEach(d => {
        apps.push(d.data() as InternshipApplication);
      });
      return apps;
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, path);
    }
  };

  const saveAIRoadmap = async (roadmap: AIRoadmap): Promise<void> => {
    if (!auth.currentUser || auth.currentUser.uid !== roadmap.userId) return;
    const path = `roadmaps/${roadmap.userId}`;
    try {
      await setDoc(doc(db, 'roadmaps', roadmap.userId), {
        ...roadmap,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  };

  const fetchAIRoadmap = async (userId: string): Promise<AIRoadmap | null> => {
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
  };

  return (
    <FirebaseContext.Provider
      value={{
        firebaseUser,
        isFirebaseReady,
        isCloudSyncActive: Boolean(firebaseUser),
        signInWithGoogle,
        signOut: handleSignOut,
        saveUserProfile,
        fetchUserProfile,
        saveUserScore,
        fetchUserScore,
        saveUserTask,
        fetchUserTasks,
        saveApplication,
        deleteApplication,
        fetchApplications,
        saveAIRoadmap,
        fetchAIRoadmap
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = (): FirebaseContextType => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};
