import { useCallback } from 'react';
import { db, doc, setDoc } from '../lib/firebase';

export const useFirebase = (sessionId) => {
  const saveToFirebase = useCallback(async (path, data, merge = true) => {
    try {
      const docRef = doc(db, 'sessions', sessionId);
      await setDoc(docRef, {
        [path]: data,
        lastUpdated: new Date().toISOString()
      }, { merge });
      console.log(`Saved to Firebase: ${path}`);
      return true;
    } catch (error) {
      console.error('Firebase save error:', error);
      return false;
    }
  }, [sessionId]);

  return { saveToFirebase };
};
