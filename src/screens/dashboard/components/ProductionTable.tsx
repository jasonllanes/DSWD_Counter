import React, { useState, useCallback } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { BarChart2, Download, Upload, Calendar } from "react-feather";
import type { DashboardData, DashboardRowData } from "../../../types";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import dswdLogo from "../../../assets/dswd_logo.png";
import { firebaseService } from "@/services/firebase";
import { isFeatureEnabled } from "@/config/env";
import Swal from "sweetalert2";
import DateRangePicker from "./DateRangePicker";
import EditableCell from "./EditableCell";

type ProductionTableProps = {
  data: DashboardData | null;
  saving: boolean;
  onExportToExcel: () => void;
  onSaveToCloud: () => void;
  onUpdateData: (updatedData: DashboardData) => void;
};

type LineData = {
  id: number;
  dailyTarget: number;
  hourlyTarget: number;
  productionPerHour: number;
  actualProduction: number;
};

type ExportRow = {
  id: keyof LineData;
  name: string;
};

const ProductionTable: React.FC<ProductionTableProps> = ({
  data,
  saving,
  onExportToExcel,
  onSaveToCloud,
  onUpdateData,
}) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Define table structure
  const rows = [
    { id: "dailyTarget", name: "Daily Target", isEditable: true },
    { id: "hourlyTarget", name: "Hourly Target", isEditable: true },
    { id: "productionPerHour", name: "Production / Hr", isEditable: false },
    { id: "actualProduction", name: "Actual Production", isEditable: false },
  ];

  // Handle cell value updates  
  const handleCellUpdate = (lineId: number, field: keyof LineData, newValue: number) => {
    if (!data) return;

    console.log(`Updating ${field} for Line ${lineId} to ${newValue}`);

    // Create a deep copy of the data
    const updatedData: DashboardData = {
      ...data,
      lines: data.lines.map((line) => {
        if (line.id === lineId) {
          // If we're updating hourlyTarget, calculate productionPerHour
          if (field === 'hourlyTarget') {
            return {
              ...line,
              [field]: newValue,
              // Update production per hour based on actual production
              productionPerHour: Math.round(line.actualProduction / (newValue > 0 ? newValue : 1))
            };
          }
          // Just update the field otherwise
          return { ...line, [field]: newValue };
        }
        return { ...line };
      })
    };

    console.log("Updated data:", updatedData);

    // Update state to show there are unsaved changes
    setHasUnsavedChanges(true);
    
    // Call the parent component's update function
    onUpdateData(updatedData);
    
    // Show a small toast notification
    Swal.fire({
      title: 'Value Updated',
      text: `${field === 'dailyTarget' ? 'Daily' : 'Hourly'} target for Line ${lineId} updated to ${newValue}`,
      icon: 'success',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000
    });
  };

  const columnHelper = createColumnHelper<DashboardRowData>();

  const columns = [
    columnHelper.accessor("metric", {
      header: () => (
        <div className="text-left font-medium text-white py-3 px-4">METRIC</div>
      ),
      cell: (info) => (
        <div className="font-medium py-3 px-4 text-white">
          {info.getValue()}
        </div>
      ),
    }),
    ...Array.from({ length: 8 }, (_, i) => i + 1).map((lineId) =>
      columnHelper.accessor(`line${lineId}`, {
        header: () => (
          <div className="text-center font-medium text-white py-3 px-4">
            LINE {lineId}
          </div>
        ),
        cell: (info) => {
          const value = info.getValue();
          const row = info.row.original;
          // Determine if production is below target
          const isProductionRow = row.metric === "Production / Hr";
          const isActualProductionRow = row.metric === "Actual Production";
          const isDailyTargetRow = row.metric === "Daily Target";
          const isHourlyTargetRow = row.metric === "Hourly Target";
          const hourlyTarget = data?.lines[lineId - 1]?.hourlyTarget || 0;
          const dailyTarget = data?.lines[lineId - 1]?.dailyTarget || 0;
          const isBelowTarget = isProductionRow && value < hourlyTarget;

          // Determine cell styling based on row type and values
          let cellStyle = "text-center font-medium";

          if (isProductionRow) {
            cellStyle += isBelowTarget ? " text-red-600" : " text-blue-600";
          } else if (isActualProductionRow) {
            cellStyle += " text-blue-600";
          } else {
            cellStyle += " text-blue-800";
          }

          // Determine if this cell is editable
          const isEditable = (isDailyTargetRow || isHourlyTargetRow);
          
          // For editable cells, use EditableCell component
          if (isEditable) {
            const fieldName = isDailyTargetRow ? 'dailyTarget' as keyof LineData : 'hourlyTarget' as keyof LineData;
            return (
              <EditableCell 
                value={Number(value)}
                isEditable={true}
                className={cellStyle}
                onSave={(newValue) => handleCellUpdate(lineId, fieldName, newValue)}
              />
            );
          }

          // For non-editable cells
          return (
            <div className={`${cellStyle} py-3 px-4 h-full flex flex-col justify-center`}>
              {value}
              {isActualProductionRow && dailyTarget > 0 && (
                <div className="mt-1 bg-gray-200 h-1.5 w-full rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${Number(value) >= dailyTarget ? 'bg-green-500' : 'bg-blue-500'}`}
                    style={{ 
                      width: `${Math.min(100, Math.round((Number(value) / dailyTarget) * 100))}%` 
                    }}
                  ></div>
                </div>
              )}
            </div>
          );
        },
      })
    ),
    // Add Total Column
    columnHelper.accessor("total", {
      header: () => (
        <div className="text-center font-medium text-white py-3 px-4 bg-blue-900 flex items-center justify-center">
          <span className="mr-1">∑</span> TOTAL
        </div>
      ),
      cell: (info) => {
        const row = info.row.original;
        const isActualProductionRow = row.metric === "Actual Production";
        const isDailyTargetRow = row.metric === "Daily Target";
        
        // Calculate total for this row by summing all line values
        let total = 0;
        for (let i = 1; i <= 8; i++) {
          const lineValue = row[`line${i}`] as number || 0;
          total += lineValue;
        }

        // Different styling for each row type
        const cellStyle = `text-center py-3 px-4 font-medium border-l-2 border-blue-200 ${
          isActualProductionRow 
            ? "text-blue-600 font-bold bg-blue-50" 
            : isDailyTargetRow
              ? "text-blue-800 bg-yellow-50"
              : "text-blue-800 bg-gray-50"
        }`;

        // Calculate progress for actual production
        let progressBar = null;
        if (isActualProductionRow) {
          // Find the total daily target from the table data
          const dailyTargetRow = tableData.find(r => r.metric === "Daily Target");
          let totalDailyTarget = 0;
          
          if (dailyTargetRow) {
            for (let i = 1; i <= 8; i++) {
              totalDailyTarget += (dailyTargetRow[`line${i}`] as number) || 0;
            }
          }
          
          if (totalDailyTarget > 0) {
            const percentage = Math.min(100, Math.round((total / totalDailyTarget) * 100));
            progressBar = (
              <div className="mt-1 bg-gray-200 h-1.5 w-full rounded-full overflow-hidden">
                <div 
                  className="bg-blue-600 h-full rounded-full" 
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            );
          }
        }

        return (
          <div className={cellStyle}>
            {total.toLocaleString()}
            {progressBar}
          </div>
        );
      },
    }),
  ];

  // Transform data for the table
  const tableData: DashboardRowData[] = rows.map((row) => {
    const rowData: DashboardRowData = { metric: row.name };

    if (data) {
      data.lines.forEach((line) => {
        rowData[`line${line.id}`] = line[row.id as keyof typeof line];
      });
    }

    return rowData;
  });

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleDateChange = useCallback((start: Date | null, end: Date | null) => {
    setStartDate(start);
    setEndDate(end);
    
    // If both dates are selected, show total production for the range
    if (start && end && data) {
      // In a real application, you would fetch data for this date range from your backend
      // For now, we'll just display the current data with a message about the date range
      const totalProduction = data.lines.reduce(
        (sum, line) => sum + line.actualProduction, 
        0
      );
      
      const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        });
      };
      
      Swal.fire({
        title: 'Total Production',
        html: `
          <div class="text-left">
            <p class="mb-3">Total for ${formatDate(start)} - ${formatDate(end)}:</p>
            <p class="text-3xl font-bold text-blue-600">${totalProduction.toLocaleString()}</p>
            <p class="mt-4 text-sm text-gray-600">Note: In a real application, this would show historical data for the selected date range.</p>
          </div>
        `,
        icon: 'info',
        confirmButtonColor: '#3B82F6'
      });
    }
  }, [data]);

  const handleSaveToCloud = async () => {
    if (!data) return;

    try {
      // Save to Firebase
      await firebaseService.saveProductionData(data);

      // Reset unsaved changes flag
      setHasUnsavedChanges(false);

      // Show success message
      Swal.fire({
        icon: 'success',
        title: 'Data Saved!',
        text: 'Production data has been uploaded to the cloud.',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Failed to save data:', error);
      Swal.fire({
        icon: 'error',
        title: 'Upload Failed',
        text: 'Could not save data to the cloud. Please try again.',
      });
    }
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-xl overflow-hidden mb-6 border border-blue-200">
      <div className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-blue-50">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <h2 className="text-lg font-medium text-blue-800 flex items-center">
            <BarChart2 size={18} className="mr-2" />
            Production Metrics
          </h2>
          <DateRangePicker onDateChange={handleDateChange} />
        </div>
        <div className="flex space-x-3">
          <button
            onClick={onExportToExcel}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md flex items-center transition-colors text-sm"
          >
            <Download size={16} className="mr-2" />
            Export to Excel
          </button>
          <button
            onClick={handleSaveToCloud}
            disabled={saving}
            className={`${
              hasUnsavedChanges ? 'animate-pulse bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
            } text-white px-4 py-2 rounded-md flex items-center transition-colors text-sm disabled:opacity-50`}
          >
            {saving ? (
              <>
                <span className="animate-spin mr-2">
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <circle 
                      className="opacity-25" 
                      cx="12" cy="12" r="10" 
                      stroke="currentColor" 
                      strokeWidth="4"
                    />
                    <path 
                      className="opacity-75" 
                      fill="currentColor" 
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                </span>
                Saving...
              </>
            ) : (
              <>
                <Upload size={16} className="mr-2" />
                {hasUnsavedChanges ? 'Save Changes' : 'Add to Cloud'}
              </>
            )}
          </button>
        </div>
      </div>

      {hasUnsavedChanges && (
        <div className="px-4 py-2 bg-yellow-100 text-sm text-yellow-800 border-t border-b border-yellow-200">
          <span className="font-medium">Unsaved changes!</span> Click "Save Changes" to persist your edits.
        </div>
      )}

      {startDate && endDate && (
        <div className="px-4 py-2 bg-blue-100 text-sm text-blue-800 border-t border-b border-blue-200">
          <span className="font-medium">Selected Date Range:</span> {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
        </div>
      )}

      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-blue-800 border-b border-blue-900">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="font-medium text-left">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row, rowIndex) => (
              <tr
                key={row.id}
                className={`border-b border-blue-100 ${rowIndex % 2 === 0 ? "bg-white" : "bg-blue-50"
                  } hover:bg-yellow-50 transition-colors`}
              >
                {row.getVisibleCells().map((cell, cellIndex) => {
                  // Apply special styling to the first cell (metric name)
                  const isMetricCell = cellIndex === 0;

                  return (                    <td                      key={cell.id}                      className={`${isMetricCell ? "bg-blue-700 text-white" : ""                        } relative h-16 min-h-[64px]`}                      style={{ padding: 0 }}                    >                      {flexRender(                        cell.column.columnDef.cell,                        cell.getContext()                      )}                    </td>                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="p-4 text-sm text-gray-600 bg-gray-50 border-t border-gray-200">        <p className="flex items-center">          <span className="mr-2">💡</span>          <span><strong>Tip:</strong> Click on Daily Target or Hourly Target values (with the ✏️ icon) to edit them.</span>        </p>      </div>
    </div>
  );
};

export default ProductionTable;
