import * as XLSX from "xlsx"
import type { DashboardData } from "../types"

export const exportToExcel = (data: DashboardData, filename = "dashboard-data.xlsx"): void => {
  // Prepare data for Excel format
  const worksheet = XLSX.utils.json_to_sheet(
    data.lines.map((line) => ({
      Line: `Line ${line.id}`,
      "Daily Target": line.dailyTarget,
      "Hourly Target": line.hourlyTarget,
      "Production / Hr": line.productionPerHour,
      "Actual Production": line.actualProduction,
    })),
  )

  // Create workbook and add the worksheet
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, "Dashboard Data")

  // Add timestamp to the workbook
  const infoSheet = XLSX.utils.json_to_sheet([{ Timestamp: new Date(data.timestamp).toLocaleString() }])
  XLSX.utils.book_append_sheet(workbook, infoSheet, "Info")

  // Generate Excel file and trigger download
  XLSX.writeFile(workbook, filename)
}

