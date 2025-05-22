import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getFirebaseConfig, isFeatureEnabled } from './env';

// Initialize Firebase app
const app = initializeApp(getFirebaseConfig());

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);

// Initialize Analytics conditionally
export const analytics = async () => {
  if (isFeatureEnabled('analytics') && await isSupported()) {
    return getAnalytics(app);
  }
  return null;
};

export default app; 