import { useState } from "react"
import Swal from "sweetalert2"
import type { DashboardData } from "../types"

type TargetType = "dailyTarget" | "hourlyTarget"

interface UseResetTargetsProps {
  tableData: DashboardData | null
  onUpdateData: (updatedData: DashboardData) => void
}

export const useResetTargets = ({
  tableData,
  onUpdateData,
}: UseResetTargetsProps) => {
  const resetTargets = async (targetType: TargetType) => {
    const isDaily = targetType === "dailyTarget"
    const title = isDaily
      ? "Reset All Daily Targets"
      : "Reset All Hourly Targets"
    const placeholder = isDaily ? "e.g., 1000" : "e.g., 100"
    const label = isDaily
      ? "Enter new daily target value for all lines:"
      : "Enter new hourly target value for all lines:"

    // Show confirmation dialog with input
    const { value: newTarget } = await Swal.fire({
      title,
      input: "number",
      inputLabel: label,
      inputPlaceholder: placeholder,
      showCancelButton: true,
      confirmButtonText: "OK",
      confirmButtonColor: "#3B82F6",
      cancelButtonColor: "#EF4444",
      inputValidator: (value) => {
        if (!value) {
          return "Please enter a value"
        }
        if (Number(value) < 0) {
          return "Value cannot be negative"
        }
      },
      customClass: {
        confirmButton: "swal2-confirm rounded-md px-4 py-2",
        cancelButton: "swal2-cancel rounded-md px-4 py-2",
        input: "swal2-input rounded-md border-gray-300",
      },
    })

    if (newTarget) {
      try {
        if (tableData) {
          const updatedLines = tableData.lines.map((line) => ({
            ...line,
            [targetType]: Number(newTarget),
          }))

          const updatedData = {
            ...tableData,
            lines: updatedLines,
            timestamp: new Date().toISOString(),
          }

          onUpdateData(updatedData)

          // Show success message
          Swal.fire({
            icon: "success",
            title: `${isDaily ? "Daily" : "Hourly"} Targets Updated`,
            text: `All lines have been set to ${newTarget}`,
            timer: 2000,
            showConfirmButton: false,
          })
        }
      } catch (error) {
        console.error(`Error resetting ${targetType}:`, error)
        Swal.fire({
          icon: "error",
          title: "Reset Failed",
          text: `Failed to reset ${
            isDaily ? "daily" : "hourly"
          } targets. Please try again.`,
        })
      }
    }
  }

  return {
    resetDailyTargets: () => resetTargets("dailyTarget"),
    resetHourlyTargets: () => resetTargets("hourlyTarget"),
  }
}
