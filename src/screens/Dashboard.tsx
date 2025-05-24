import { useState, useEffect, useMemo, useRef } from "react";
import { fetchCurrentData } from "../services/api";
import { saveDashboardData } from "../services/firebase";
import { exportToExcel } from "../utils/excelExport";
import type { DashboardData } from "../types";
import DashboardHeader from "../screens/dashboard/components/DashboardHeader";
import ProductionTable from "../screens/dashboard/components/ProductionTable";
import StatisticsCards from "../screens/dashboard/components/StatisticCard";
import ProductionChart from "../screens/dashboard/components/ProductionChart";
import ProductionTrends from "../screens/dashboard/components/ProductionTrends";
import LoadingSpinner from "../screens/dashboard/components/LoadingSpinner";


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
    // Remove fetchCurrentData interval and only use WebSocket
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
          // If no previous data, initialize with default structure
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
      const result = await saveDashboardData(data);
      if (result.success) {
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

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="bg-white min-h-screen w-full text-blue-800 pt-20">
      <DashboardHeader lastUpdated={lastUpdated} />

      <div className="w-full px-6 py-6">
        <StatisticsCards statistics={statistics} />
        <ProductionTable
          data={data}
          saving={saving}
          onExportToExcel={handleExportToExcel}
          onSaveToCloud={handleSaveToCloud}
        />



        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ProductionTrends />
          <ProductionChart />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;