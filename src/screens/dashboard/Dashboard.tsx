import { useState, useEffect } from "react";
import { saveDashboardData } from "../../services/firebase";
import { exportToExcel } from "../../utils/excelExport";
import type { DashboardData } from "../../types";
import { useArduinoData } from "../../hooks/useArduinoData";
import DashboardHeader from "./components/DashboardHeader";
import ProductionTable from "./components/ProductionTable";
import StatisticsCards from "./components/StatisticCard";
import ProductionChart from "./components/ProductionChart";
import ProductionTrends from "./components/ProductionTrends";
import LoadingSpinner from "./components/LoadingSpinner";

const Dashboard = () => {
  // Initialize with zeros
  const initialData: DashboardData = {
    lines: Array.from({ length: 8 }, (_, i) => ({
      id: i + 1,
      dailyTarget: 1000, // Keep the target values as they are business requirements
      hourlyTarget: 166, // Keep the target values as they are business requirements
      productionPerHour: 0,
      actualProduction: 0
    })),
    timestamp: new Date().toISOString()
  };

  const [data, setData] = useState<DashboardData>(initialData);
  const [saving, setSaving] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const { data: arduinoData, error, isConnected } = useArduinoData();

  // State for tracking historical data
  const [trendData, setTrendData] = useState({
    hourly: Array.from({ length: 6 }, (_, i) => ({
      period: `${new Date().getHours() - (5 - i)}:00`,
      value: 0,
      change: 0
    })),
    daily: Array.from({ length: 7 }, () => ({
      period: "Today",
      value: 0,
      change: 0
    })),
    weekly: [],
    monthly: [],
    yearly: []
  });

  // Update dashboard data when Arduino data changes
  useEffect(() => {
    if (arduinoData) {
      const now = new Date();
      const currentHour = now.getHours();

      setData(prevData => {
        const updatedData = {
          lines: prevData.lines.map(line => ({
            ...line,
            productionPerHour: arduinoData.sensorId === line.id ? line.productionPerHour + 1 : line.productionPerHour,
            actualProduction: arduinoData.sensorId === line.id ? line.actualProduction + 1 : line.actualProduction
          })),
          timestamp: arduinoData.timestamp
        };

        // Update trend data
        setTrendData(prevTrends => {
          // Update hourly data
          const hourlyData = [...prevTrends.hourly];
          const currentHourIndex = hourlyData.findIndex(h => 
            h.period.startsWith(currentHour.toString())
          );

          if (currentHourIndex !== -1) {
            hourlyData[currentHourIndex].value += 1;
          } else {
            // Shift array and add new hour if needed
            hourlyData.shift();
            hourlyData.push({
              period: `${currentHour}:00`,
              value: 1,
              change: 0
            });
          }

          // Update daily total
          const dailyData = [...prevTrends.daily];
          dailyData[0].value = updatedData.lines.reduce(
            (sum, line) => sum + line.actualProduction, 
            0
          );

          return {
            ...prevTrends,
            hourly: hourlyData,
            daily: dailyData
          };
        });

        return updatedData;
      });

      setLastUpdated(now.toLocaleTimeString());
    }
  }, [arduinoData]);

  const handleExportToExcel = async () => {
    await exportToExcel(data);
  };

  const handleSaveToCloud = async () => {
    setSaving(true);
    try {
      await saveDashboardData(data);
    } catch (error) {
      console.error("Error saving to cloud:", error);
    } finally {
      setSaving(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-600">
        Error connecting to Arduino: {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <DashboardHeader lastUpdated={lastUpdated} />
      <div className="space-y-6">
        <StatisticsCards data={data} />
        <ProductionTable
          data={data}
          saving={saving}
          onExportToExcel={handleExportToExcel}
          onSaveToCloud={handleSaveToCloud}
        />
        <ProductionChart data={data} />
        <ProductionTrends data={trendData} />
      </div>
    </div>
  );
};

export default Dashboard; 