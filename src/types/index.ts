// Line data type
export interface LineData {
  id: number
  dailyTarget: number
  hourlyTarget: number
  productionPerHour: number
  actualProduction: number
}

// Dashboard data type
export interface DashboardData {
  lines: LineData[]
  timestamp: string
}

// Historical data item type
export interface HistoricalDataItem {
  id?: string
  date?: string
  timestamp?: string
  savedAt?: string
  lines: LineData[]
}

// Table row data type for the dashboard
export interface DashboardRowData {
  metric: string
  [key: string]: any // For dynamic line columns (line1, line2, etc.)
}

// Table row data type for historical data
export interface HistoricalRowData {
  date: string
  id: string
  [key: string]: any // For dynamic line columns (line1, line2, etc.)
}

// Firebase response type
export interface FirebaseResponse {
  success: boolean
  id?: string
  error?: any
}

// Date range type
export interface DateRange {
  startDate: string
  endDate: string
}

