import type { DashboardData, HistoricalDataItem } from "../types";

// Mock API to simulate data from Arduino Mega
const initialData: DashboardData = {
  lines: [
    {
      id: 1,
      dailyTarget: 1000,
      hourlyTarget: 166,
      productionPerHour: 150,
      actualProduction: 300,
    },
    {
      id: 2,
      dailyTarget: 1000,
      hourlyTarget: 166,
      productionPerHour: 150,
      actualProduction: 300,
    },
    {
      id: 3,
      dailyTarget: 1000,
      hourlyTarget: 166,
      productionPerHour: 150,
      actualProduction: 300,
    },
    {
      id: 4,
      dailyTarget: 1000,
      hourlyTarget: 166,
      productionPerHour: 150,
      actualProduction: 300,
    },
    {
      id: 5,
      dailyTarget: 1000,
      hourlyTarget: 166,
      productionPerHour: 150,
      actualProduction: 300,
    },
    {
      id: 6,
      dailyTarget: 1000,
      hourlyTarget: 166,
      productionPerHour: 150,
      actualProduction: 300,
    },
    {
      id: 7,
      dailyTarget: 1000,
      hourlyTarget: 166,
      productionPerHour: 150,
      actualProduction: 300,
    },
    {
      id: 8,
      dailyTarget: 1000,
      hourlyTarget: 166,
      productionPerHour: 150,
      actualProduction: 300,
    },
  ],
  timestamp: new Date().toISOString(),
};

// Simulate real-time updates
const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const fetchCurrentData = (): Promise<DashboardData> => {
  // Simulate API call delay
  return new Promise((resolve) => {
    setTimeout(() => {
      // Update production values to simulate real-time changes
      const updatedData: DashboardData = {
        ...initialData,
        lines: initialData.lines.map((line) => ({
          ...line,
          productionPerHour: getRandomInt(140, 180),
          actualProduction: line.actualProduction + getRandomInt(5, 15),
        })),
        timestamp: new Date().toISOString(),
      };
      resolve(updatedData);
    }, 1000);
  });
};

export const fetchHistoricalData = (
  // startDate: string,
  // endDate: string
): Promise<HistoricalDataItem[]> => {
  // Simulate historical data
  return new Promise((resolve) => {
    setTimeout(() => {
      const days = 7; // Last 7 days of data
      const historicalData: HistoricalDataItem[] = [];

      for (let i = 0; i < days; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);

        historicalData.push({
          date: date.toISOString().split("T")[0],
          lines: initialData.lines.map((line) => ({
            ...line,
            productionPerHour: getRandomInt(140, 180),
            actualProduction: getRandomInt(800, 1200),
          })),
        });
      }

      resolve(historicalData);
    }, 1500);
  });
};
