import { useState, useEffect, useMemo, useRef } from "react";
import { fetchCurrentData } from "../services/api";
import { firebaseService } from "../services/firebase";
import { exportToExcel } from "../utils/excelExport";
import type { DashboardData } from "../types";
import DashboardHeader from "./dashboard/components/DashboardHeader";
import ProductionTable from "./dashboard/components/ProductionTable";
import StatisticsCards from "./dashboard/components/StatisticCard";
import ProductionChart from "./dashboard/components/ProductionChart";
import ProductionTrends from "./dashboard/components/ProductionTrends";
import LoadingSpinner from "./dashboard/components/LoadingSpinner";

const defaultLines = Array.from({ length: 8 }, (_, idx) => ({
  id: idx + 1,
  dailyTarget: 1000,
  hourlyTarget: 166,
  productionPerHour: 150,
  actualProduction: 0,
}));

const Dashboard = () => {
  const [data, setData] = useState<DashboardData>({
    lines: defaultLines,
    timestamp: new Date().toISOString(),
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const wsRef = useRef<WebSocket | null>(null);

  // Fetch data initially and set up interval for real-time updates
  useEffect(() => {
    setLoading(true);

    // WebSocket setup for real-time sensor updates
    wsRef.current = new WebSocket("ws://localhost:4000");
    wsRef.current.onmessage = (event) => {
      const msg = event.data as string;
      // Example: "Sensor 5 triggered, Total Score: 4"
      const match = msg.match(/Sensor (\d+) triggered, Total Score: (\d+)/);
      if (match) {
        const lineIdx = parseInt(match[1], 10) - 1;
        const totalScore = parseInt(match[2], 10);
        setData((prev) => {
          if (!prev) {
            return {
              lines: Array.from({ length: 8 }, (_, idx) => ({
                id: idx + 1,
                dailyTarget: 1000,
                hourlyTarget: 166,
                productionPerHour: 150,
                actualProduction: idx === lineIdx ? totalScore : 0,
              })),
              timestamp: new Date().toISOString(),
            };
          }
          const lines = prev.lines.map((line, idx) =>
            idx === lineIdx
              ? { ...line, actualProduction: totalScore }
              : line
          );
          return { ...prev, lines, timestamp: new Date().toISOString() };
        });
        setLastUpdated(new Date().toLocaleTimeString());
        setLoading(false);
      }
    };

    wsRef.current.onerror = (err) => {
      console.error("WebSocket error:", err);
      setLoading(false);
    };

    // Fallback: stop loading after 5 seconds if no data
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 5000);

    return () => {
      wsRef.current?.close();
      clearTimeout(timeout);
    };
  }, []);

  // Calculate statistics for dashboard cards
  const statistics = useMemo(() => {
    if (!data) return null;

    // Calculate overall efficiency
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

    // Find top performing line
    const lineEfficiencies = data.lines.map((line) => ({
      id: line.id,
      efficiency: Math.round((line.actualProduction / line.dailyTarget) * 100),
    }));

    const topLine = [...lineEfficiencies].sort(
      (a, b) => b.efficiency - a.efficiency
    )[0];

    // Find line needing attention (lowest efficiency)
    const needsAttentionLine = [...lineEfficiencies].sort(
      (a, b) => a.efficiency - b.efficiency
    )[0];

    return {
      overallEfficiency,
      totalProduction,
      topLine,
      needsAttentionLine,
    };
  }, [data]);

  // Handle saving data to Firestore
  const handleSaveToCloud = async () => {
    if (!data) return;

    setSaving(true);
    try {
      const result = await firebaseService.saveProductionData(data);
      if (result) {
        alert("Data successfully saved to Firestore!");
      } else {
        alert("Failed to save data. Please try again.");
      }
    } catch (error) {
      console.error("Error saving data:", error);
      alert("An error occurred while saving data.");
    } finally {
      setSaving(false);
    }
  };

  // Handle exporting data to Excel
  const handleExportToExcel = () => {
    if (!data) return;
    exportToExcel(
      data,
      `dashboard-data-${new Date().toISOString().split("T")[0]}.xlsx`
    );
  };

  // Handle updated data from editable cells
  const handleUpdateData = (updatedData: DashboardData) => {
    console.log("Dashboard received updated data:", updatedData);
    setData(updatedData);
    // Update the timestamp to reflect the change
    const newTimestamp = new Date().toLocaleTimeString();
    setLastUpdated(newTimestamp);
    console.log("Dashboard updated timestamp:", newTimestamp);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader lastUpdated={lastUpdated} />
      <main className="container mx-auto px-4 py-6">
        <StatisticsCards data={data} />
        <ProductionTable
          data={data}
          saving={saving}
          onExportToExcel={handleExportToExcel}
          onSaveToCloud={handleSaveToCloud}
          onUpdateData={handleUpdateData}
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ProductionChart data={data} />
          <ProductionTrends />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;