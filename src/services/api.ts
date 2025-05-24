import type { DashboardData, HistoricalDataItem } from "../types";

// Initialize with zeros
const emptyData: DashboardData = {
  lines: Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    dailyTarget: 1000,
    hourlyTarget: 166,
    productionPerHour: 0,
    actualProduction: 0,
  })),
  timestamp: new Date().toISOString(),
};

export const fetchCurrentData = (): Promise<DashboardData> => {
  return Promise.resolve(emptyData);
};

export const fetchHistoricalData = (): Promise<HistoricalDataItem[]> => {
  return Promise.resolve([{
    date: new Date().toISOString().split("T")[0],
    lines: emptyData.lines
  }]);
};
