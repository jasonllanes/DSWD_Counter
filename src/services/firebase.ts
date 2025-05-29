import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  deleteDoc,
  doc,
} from "firebase/firestore";
import type {
  DashboardData,
  FirebaseResponse,
  HistoricalDataItem,
} from "../types";
import { db } from '@/config/firebase';

// Collection reference - single source of truth
const COLLECTION_NAME = 'production_data';
const OLD_COLLECTION_NAME = 'dashboardData';

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
  // Save production data to Firebase with optimized structure
  async saveProductionData(data: DashboardData): Promise<FirebaseResponse> {
    try {
      // Calculate summary statistics for quick access
      const totalProduction = data.lines.reduce(
        (sum, line) => sum + line.actualProduction, 
        0
      );
      const totalTarget = data.lines.reduce(
        (sum, line) => sum + line.dailyTarget, 
        0
      );
      const overallEfficiency = totalTarget > 0 
        ? Math.round((totalProduction / totalTarget) * 100) 
        : 0;

      // Find top and lowest performing lines
      const lineEfficiencies = data.lines.map((line) => ({
        id: line.id,
        efficiency: line.dailyTarget > 0 
          ? Math.round((line.actualProduction / line.dailyTarget) * 100) 
          : 0
      }));
      
      const topPerformingLineId = [...lineEfficiencies].sort(
        (a, b) => b.efficiency - a.efficiency
      )[0]?.id;
      
      const lowestPerformingLineId = [...lineEfficiencies].sort(
        (a, b) => a.efficiency - b.efficiency
      )[0]?.id;

      // Create a structured document
      const now = new Date();
      const operationDate = now.toISOString().split('T')[0]; // YYYY-MM-DD
      
      const enhancedData = {  
        // Metadata
        siteId: 'cebu-center-1', // You can make this configurable
        operationDate,
        timestamp: now.toISOString(),
        
        // Original data
        lines: data.lines,
        
        // Summary statistics
        summary: {
          totalProduction,
          totalTarget,
          overallEfficiency,
          topPerformingLineId,
          lowestPerformingLineId
        }
      };

      const docRef = await addDoc(collection(db, COLLECTION_NAME), enhancedData);
      console.log('✅ Data saved to Firebase:', docRef.id);
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('❌ Error saving data:', error);
      return { success: false, error };
    }
  },

  // Get latest production records
  async getLatestRecords(limitCount: number = 10): Promise<HistoricalDataItem[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        orderBy('timestamp', 'desc'),
        limit(limitCount)
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as HistoricalDataItem[];
    } catch (error) {
      console.error('❌ Error fetching records:', error);
      return [];
    }
  },

  // Get production records for a specific date
  async getRecordsByDate(date: string) {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        orderBy('operationDate'),
        orderBy('timestamp', 'desc')
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs
        .filter(doc => doc.data().operationDate === date)
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
    } catch (error) {
      console.error('❌ Error fetching records by date:', error);
      throw error;
    }
  },

  // Get summary statistics over time (daily)
  async getDailySummaries(days: number = 7) {
    try {
      // Calculate date range
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      
      // Format dates for query
      const startDateStr = startDate.toISOString().split('T')[0];
      const endDateStr = endDate.toISOString().split('T')[0];
      
      const q = query(
        collection(db, COLLECTION_NAME),
        orderBy('operationDate'),
        orderBy('timestamp', 'desc')
      );
      
      const snapshot = await getDocs(q);
      
      // Process data to get daily summaries
      interface DailySummary {
        date: string;
        totalProduction?: number;
        totalTarget?: number;
        overallEfficiency?: number;
        topPerformingLineId?: number;
        lowestPerformingLineId?: number;
        [key: string]: any; // For any additional fields
      }
      
      const dailySummaries: Record<string, DailySummary> = {};
      
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        const { operationDate, summary } = data as { 
          operationDate: string; 
          summary: Omit<DailySummary, 'date'>;
        };
        
        // Only include dates in our range
        if (operationDate >= startDateStr && operationDate <= endDateStr) {
          // For each date, keep only the latest record
          if (!dailySummaries[operationDate]) {
            dailySummaries[operationDate] = {
              date: operationDate,
              ...summary
            };
          }
        }
      });
      
      // Convert to array and sort by date
      return Object.values(dailySummaries).sort((a, b) => 
        a.date.localeCompare(b.date)
      );
    } catch (error) {
      console.error('❌ Error fetching daily summaries:', error);
      throw error;
    }
  },

  // Migration utility
  async migrateOldData(): Promise<{ success: boolean; migrated: number; errors: number }> {
    try {
      // Get all documents from old collection
      const oldCollectionRef = collection(db, OLD_COLLECTION_NAME);
      const oldDataSnapshot = await getDocs(oldCollectionRef);
      
      let migratedCount = 0;
      let errorCount = 0;

      // Process each old document
      for (const docSnapshot of oldDataSnapshot.docs) {
        try {
          const oldData = docSnapshot.data();
          
          // Transform old data to new format
          const now = new Date(oldData.savedAt || new Date().toISOString());
          const operationDate = now.toISOString().split('T')[0];
          
          // Calculate summary statistics
          const totalProduction = oldData.lines.reduce(
            (sum: number, line: any) => sum + (line.actualProduction || 0), 
            0
          );
          const totalTarget = oldData.lines.reduce(
            (sum: number, line: any) => sum + (line.dailyTarget || 0), 
            0
          );
          const overallEfficiency = totalTarget > 0 
            ? Math.round((totalProduction / totalTarget) * 100) 
            : 0;

          // Calculate line efficiencies
          const lineEfficiencies = oldData.lines.map((line: any) => ({
            id: line.id,
            efficiency: line.dailyTarget > 0 
              ? Math.round((line.actualProduction / line.dailyTarget) * 100) 
              : 0
          }));
          
          const topPerformingLineId = [...lineEfficiencies].sort(
            (a, b) => b.efficiency - a.efficiency
          )[0]?.id;
          
          const lowestPerformingLineId = [...lineEfficiencies].sort(
            (a, b) => a.efficiency - b.efficiency
          )[0]?.id;

          // Create new format document
          const enhancedData = {
            siteId: 'cebu-center-1',
            operationDate,
            timestamp: now.toISOString(),
            lines: oldData.lines,
            summary: {
              totalProduction,
              totalTarget,
              overallEfficiency,
              topPerformingLineId,
              lowestPerformingLineId
            }
          };

          // Save to new collection
          await addDoc(collection(db, COLLECTION_NAME), enhancedData);
          migratedCount++;

          // Delete old document
          await deleteDoc(doc(db, OLD_COLLECTION_NAME, docSnapshot.id));
        } catch (error) {
          console.error(`Error migrating document ${docSnapshot.id}:`, error);
          errorCount++;
        }
      }

      return {
        success: true,
        migrated: migratedCount,
        errors: errorCount
      };
    } catch (error) {
      console.error('Migration failed:', error);
      return {
        success: false,
        migrated: 0,
        errors: 1
      };
    }
  },

  // Cleanup utility
  async deleteOldCollection(): Promise<{ success: boolean; deleted: number }> {
    try {
      const oldCollectionRef = collection(db, OLD_COLLECTION_NAME);
      const snapshot = await getDocs(oldCollectionRef);
      
      let deletedCount = 0;
      
      // Delete all remaining documents in old collection
      for (const docSnapshot of snapshot.docs) {
        await deleteDoc(docSnapshot.ref);
        deletedCount++;
      }

      return {
        success: true,
        deleted: deletedCount
      };
    } catch (error) {
      console.error('Cleanup failed:', error);
      return {
        success: false,
        deleted: 0
      };
    }
  }
};
