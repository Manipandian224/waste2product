'use client';

import { 
  Auth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  User 
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  serverTimestamp, 
  Firestore 
} from 'firebase/firestore';

/**
 * Ensures a user profile exists in Firestore.
 * If it doesn't exist, creates one with default values.
 * If it does exist, updates the last login timestamp.
 */
export async function syncUserProfile(db: Firestore, user: User, additionalData: { name?: string } = {}) {
  if (!db || !user) return;
  
  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    // New user creation
    await setDoc(userRef, {
      id: user.uid,
      name: additionalData.name || user.displayName || 'Eco Hero',
      email: user.email,
      walletBalance: 0,
      totalWasteSubmittedKg: 0,
      carbonSavedKg: 0,
      ecoScore: 0,
      leaderboardRank: 0,
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
      role: 'user',
    });
  } else {
    // Existing user, just update last login
    await setDoc(userRef, {
      lastLogin: serverTimestamp(),
    }, { merge: true });
  }
}

/**
 * Helper to handle Google Sign-in with profile sync.
 */
export async function signInWithGoogle(auth: Auth, db: Firestore) {
  if (!auth || !db) return;
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    await syncUserProfile(db, result.user);
    return result.user;
  } catch (error) {
    throw error;
  }
}