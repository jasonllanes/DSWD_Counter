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

type ProductionTableProps = {
  data: DashboardData | null;
  saving: boolean;
  onExportToExcel: () => void;
  onSaveToCloud: () => void;
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
}) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // Define table structure
  const rows = [
    { id: "dailyTarget", name: "Daily Target" },
    { id: "hourlyTarget", name: "Hourly Target" },
    { id: "productionPerHour", name: "Production / Hr" },
    { id: "actualProduction", name: "Actual Production" },
  ];

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
          // Determine if production is below target
          const isProductionRow =
            info.row.original.metric === "Production / Hr";
          const hourlyTarget = data?.lines[lineId - 1]?.hourlyTarget || 0;
          const isBelowTarget = isProductionRow && value < hourlyTarget;

          // Determine cell styling based on row type and values
          let cellStyle = "text-center py-3 px-4 font-medium";

          if (isProductionRow) {
            cellStyle += isBelowTarget ? " text-red-600" : " text-blue-600";
          } else {
            cellStyle += " text-blue-800";
          }

          return <div className={cellStyle}>{value}</div>;
        },
      })
    ),
    // Add Total Column
    columnHelper.accessor("total", {
      header: () => (
        <div className="text-center font-medium text-white py-3 px-4 bg-blue-900">
          TOTAL
        </div>
      ),
      cell: (info) => {
        const row = info.row.original;
        const isActualProductionRow = row.metric === "Actual Production";
        
        // Calculate total for this row by summing all line values
        let total = 0;
        for (let i = 1; i <= 8; i++) {
          const lineValue = row[`line${i}`] as number || 0;
          total += lineValue;
        }

        // Different styling for Actual Production total
        const cellStyle = `text-center py-3 px-4 font-medium ${
          isActualProductionRow 
            ? "text-blue-600 font-bold bg-blue-50" 
            : "text-blue-800 bg-gray-50"
        }`;

        return <div className={cellStyle}>{total.toLocaleString()}</div>;
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

  const handleExportToExcel = async () => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Production Data");

      // Fetch and embed the logo as base64
      try {
        const response = await fetch(dswdLogo);

        if (!response.ok) {
          throw new Error(`Failed to fetch logo: ${response.statusText}`);
        }

        const blob = await response.blob();

        if (!blob.type.startsWith("image/")) {
          throw new Error("Invalid image format");
        }

        const base64data = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            if (typeof reader.result === "string") {
              resolve(reader.result);
            } else {
              reject(new Error("Failed to convert image to base64"));
            }
          };
          reader.onerror = () => reject(reader.error);
          reader.readAsDataURL(blob);
        });

        const base64Image = base64data.split(";base64,").pop();
        if (!base64Image) {
          throw new Error("Invalid base64 image data");
        }

        const imageId = workbook.addImage({
          base64: base64Image,
          extension: "png",
        });

        worksheet.addImage(imageId, {
          tl: { col: 0, row: 0 },
          ext: { width: 100, height: 100 },
        });
      } catch (error) {
        console.error("Failed to load DSWD logo:", error);
        // Continue without the logo
      }

      // Add date range information if available
      if (startDate && endDate) {
        const dateRangeRow = worksheet.getRow(5);
        dateRangeRow.getCell(1).value = `Date Range: ${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
        dateRangeRow.font = { bold: true };
      }

      // Leave some rows for the image
      const startRow = 8;

      // Add header row with styling
      const headerRow = worksheet.getRow(startRow);
      headerRow.values = [
        "METRIC",
        ...Array.from({ length: 8 }, (_, i) => `LINE ${i + 1}`),
        "TOTAL"
      ];
      headerRow.font = { bold: true };
      headerRow.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "2563EB" }, // blue-800 to match your UI
      };
      headerRow.font = { color: { argb: "FFFFFF" }, bold: true };

      // Add data rows with proper typing
      if (data) {
        rows.forEach((row, idx) => {
          const dataRow = worksheet.getRow(startRow + 1 + idx);
          const lineValues = data.lines.map((line) => {
            const value = line[row.id as keyof LineData];
            return value !== undefined ? value : 0;
          });
          
          // Calculate total for the row
          const rowTotal = lineValues.reduce((sum, val) => sum + val, 0);
          
          const rowValues = [
            row.name,
            ...lineValues,
            rowTotal // Add total column
          ];
          
          dataRow.values = rowValues;

          // Style production/hr row
          if (row.id === "productionPerHour") {
            lineValues.forEach((value, colIdx) => {
              if (colIdx < 8) { // Only for the 8 line columns
                const cell = dataRow.getCell(colIdx + 2); // +2 because column 1 is the metric name
                const hourlyTarget = data.lines[colIdx]?.hourlyTarget || 0;
                cell.font = {
                  color: {
                    argb: Number(value) < hourlyTarget ? "DC2626" : "2563EB",
                  },
                };
              }
            });
          }
          
          // Highlight the Actual Production total
          if (row.id === "actualProduction") {
            const totalCell = dataRow.getCell(10); // Column 10 is the total column
            totalCell.font = { bold: true, color: { argb: "2563EB" } };
            totalCell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "EFF6FF" }, // Light blue background
            };
          }
        });
      }

      // Auto-fit columns
      worksheet.columns.forEach((column) => {
        column.width = 15;
      });

      // Save the file
      const buffer = await workbook.xlsx.writeBuffer();
      saveAs(new Blob([buffer]), "DSWD_Production_Data.xlsx");
    } catch (error) {
      console.error("Failed to export Excel file:", error);
      // You might want to show an error message to the user here
    }
  };

  const handleSaveToCloud = async () => {
    if (!data) return;

    try {
      // Save to Firebase
      await firebaseService.saveProductionData(data);

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
            onClick={handleExportToExcel}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md flex items-center transition-colors text-sm"
          >
            <Download size={16} className="mr-2" />
            Export to Excel
          </button>
          <button
            onClick={handleSaveToCloud}
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center transition-colors text-sm disabled:opacity-50"
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
                Add to Cloud
              </>
            )}
          </button>
        </div>
      </div>

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

                  return (
                    <td
                      key={cell.id}
                      className={`${isMetricCell ? "bg-blue-700 text-white" : ""
                        }`}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductionTable;
