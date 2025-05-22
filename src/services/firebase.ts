import {
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
import { db } from '@/config/firebase';

// Collection references
const PRODUCTION_COLLECTION = 'production_data';

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

export const firebaseService = {
  // Save production data to Firebase
  async saveProductionData(data: DashboardData) {
    try {
      const docRef = await addDoc(collection(db, PRODUCTION_COLLECTION), {
        ...data,
        timestamp: new Date().toISOString()
      });
      console.log('✅ Data saved to Firebase:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('❌ Error saving data:', error);
      throw error;
    }
  },

  // Get latest production records
  async getLatestRecords(limitCount: number = 10) {
    try {
      const q = query(
        collection(db, PRODUCTION_COLLECTION),
        orderBy('timestamp', 'desc'),
        limit(limitCount)
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('❌ Error fetching records:', error);
      throw error;
    }
  }
};
