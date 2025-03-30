import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import type {
  DashboardData,
  FirebaseResponse,
  HistoricalDataItem,
} from "../types";

// Your Firebase configuration
// Replace with your actual Firebase config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Save dashboard data to Firestore
export const saveDashboardData = async (
  data: DashboardData
): Promise<FirebaseResponse> => {
  try {
    const docRef = await addDoc(collection(db, "dashboardData"), {
      ...data,
      savedAt: new Date().toISOString(),
    });
    console.log("Document written with ID: ", docRef.id);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error adding document: ", error);
    return { success: false, error };
  }
};

// Get recent dashboard data from Firestore
export const getRecentDashboardData = async (
  limitCount = 10
): Promise<HistoricalDataItem[]> => {
  try {
    const q = query(
      collection(db, "dashboardData"),
      orderBy("savedAt", "desc"),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    const data: HistoricalDataItem[] = [];
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() } as HistoricalDataItem);
    });

    return data;
  } catch (error) {
    console.error("Error getting documents: ", error);
    return [];
  }
};
