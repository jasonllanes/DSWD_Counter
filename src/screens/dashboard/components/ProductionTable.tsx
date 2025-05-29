import React, { useState, useCallback, useEffect } from "react";
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
import { useTableEditing } from '@/hooks/useTableEditing';

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
  const {
    data: tableData,
    hasUnsavedChanges,
    handleCellUpdate,
    saveChanges,
    discardChanges
  } = useTableEditing({
    initialData: data,
    onUpdateData
  });

  // Add getCellClassName helper function
  const getCellClassName = (info: any) => {
    const row = info.row.original;
    const value = info.getValue();
    
    let className = "text-center font-medium";
    
    if (row.metric === "Production / Hr") {
      const hourlyTarget = tableData?.lines[info.column.id - 1]?.hourlyTarget || 0;
      className += value < hourlyTarget ? " text-red-600" : " text-blue-600";
    } else if (row.metric === "Actual Production") {
      className += " text-blue-600";
    } else {
      className += " text-blue-800";
    }
    
    return className;
  };

  // Transform data for the table
  const transformedData: DashboardRowData[] = React.useMemo(() => {
    if (!tableData) return [];

    return [
      {
        metric: "Daily Target",
        ...tableData.lines.reduce((acc, line) => ({
          ...acc,
          [`line${line.id}`]: line.dailyTarget
        }), {})
      },
      {
        metric: "Hourly Target",
        ...tableData.lines.reduce((acc, line) => ({
          ...acc,
          [`line${line.id}`]: line.hourlyTarget
        }), {})
      },
      {
        metric: "Production / Hr",
        ...tableData.lines.reduce((acc, line) => ({
          ...acc,
          [`line${line.id}`]: line.productionPerHour
        }), {})
      },
      {
        metric: "Actual Production",
        ...tableData.lines.reduce((acc, line) => ({
          ...acc,
          [`line${line.id}`]: line.actualProduction
        }), {})
      }
    ];
  }, [tableData]);

  // Define table structure
  const rows = [
    { id: "dailyTarget", name: "Daily Target", isEditable: true },
    { id: "hourlyTarget", name: "Hourly Target", isEditable: true },
    { id: "productionPerHour", name: "Production / Hr", isEditable: false },
    { id: "actualProduction", name: "Actual Production", isEditable: false },
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
          const row = info.row.original;
          const isDailyTargetRow = row.metric === "Daily Target";
          const isHourlyTargetRow = row.metric === "Hourly Target";
          const isEditable = isDailyTargetRow || isHourlyTargetRow;

          if (isEditable) {
            const fieldName = isDailyTargetRow ? 'dailyTarget' as keyof LineData : 'hourlyTarget' as keyof LineData;
            return (
              <EditableCell 
                value={Number(value)}
                isEditable={true}
                className={getCellClassName(info)}
                onSave={(newValue) => {
                  handleCellUpdate(lineId, fieldName, newValue);
                  // Show success toast
                  Swal.fire({
                    title: 'Value Updated',
                    text: `${fieldName === 'dailyTarget' ? 'Daily' : 'Hourly'} target for Line ${lineId} updated to ${newValue}`,
                    icon: 'success',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000
                  });
                }}
              />
            );
          }

          // Determine cell styling based on row type and values
          let cellStyle = "text-center font-medium";

          if (row.metric === "Production / Hr") {
            cellStyle += " text-blue-600";
          } else if (row.metric === "Actual Production") {
            cellStyle += " text-blue-600";
          } else {
            cellStyle += " text-blue-800";
          }

          // For non-editable cells
          const dailyTarget = tableData?.lines?.[lineId - 1]?.dailyTarget ?? 0;
          return (
            <div className={`${cellStyle} py-3 px-4 h-full flex flex-col justify-center`}>
              {value}
              {row.metric === "Actual Production" && dailyTarget > 0 && (
                <div className="mt-1 bg-gray-200 h-1.5 w-full rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${Number(value) >= dailyTarget ? 'bg-green-500' : 'bg-blue-500'}`}
                    style={{ 
                      width: `${Math.min(100, Math.round((Number(value) / dailyTarget) * 100))}%` 
                    }}
                  />
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
          const dailyTargetRow = transformedData.find(r => r.metric === "Daily Target");
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

  const table = useReactTable({
    data: transformedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleDateChange = useCallback((
    start: Date | null, 
    end: Date | null, 
    isUserSelection: boolean = false
  ) => {
    setStartDate(start);
    setEndDate(end);
    
    // Only show total production popup if it's a user selection
    if (start && end && data && isUserSelection) {
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
    if (!transformedData) return;

    try {
      await onSaveToCloud();
      saveChanges(); // Use the hook's saveChanges
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

  // Add Excel export functionality
  const handleExportToExcel = async () => {
    if (!data) return;

    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Production Data');

      // Convert image to base64 if it's not already
      const response = await fetch(dswdLogo);
      const blob = await response.blob();
      const reader = new FileReader();
      
      reader.onload = async () => {
        try {
          const base64Logo = reader.result as string;
          
          // Add logo
          const logoId = workbook.addImage({
            base64: base64Logo.split(',')[1],
            extension: 'png',
          });

          // Configure worksheet
          worksheet.properties.defaultRowHeight = 15;
          
          // Add logo
          worksheet.addImage(logoId, {
            tl: { col: 0, row: 0 },
            ext: { width: 80, height: 80 }
          });

          // Set row height for logo
          worksheet.getRow(1).height = 60;
          
          // Add spacing after logo
          for (let i = 0; i < 4; i++) {
            worksheet.addRow([]);
          }

          // Add title row with company name
          const titleRow = worksheet.addRow(['DSWD Production Data Report']);
          titleRow.font = {
            bold: true,
            size: 16
          };
          titleRow.alignment = {
            vertical: 'middle',
            horizontal: 'center'
          };
          worksheet.mergeCells(titleRow.number, 1, titleRow.number, 10);

          // Add date
          const dateRow = worksheet.addRow([`Report Generated: ${new Date().toLocaleDateString()}`]);
          dateRow.font = { size: 10 };
          dateRow.alignment = { horizontal: 'center' };
          worksheet.mergeCells(dateRow.number, 1, dateRow.number, 10);

          // Add empty row before headers
          worksheet.addRow([]);

          // Add headers with styling
          const headers = ['Metric', ...Array.from({ length: 8 }, (_, i) => `Line ${i + 1}`), 'Total'];
          const headerRow = worksheet.addRow(headers);

          // Style headers
          headerRow.eachCell((cell) => {
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: '2563EB' } // blue-600
            };
            cell.font = {
              color: { argb: 'FFFFFF' },
              bold: true
            };
            cell.alignment = {
              vertical: 'middle',
              horizontal: 'center'
            };
          });

          // Add data rows with styling
          rows.forEach((row) => {
            const rowData = [row.name];
            data.lines.forEach((line) => {
              rowData.push(String(line[row.id as keyof typeof line]));
            });

            // Calculate total
            const total = rowData.slice(1).reduce((sum, val) => sum + (Number(val) || 0), 0);
            rowData.push(String(total));

            const excelRow = worksheet.addRow(rowData);

            // Style data cells
            excelRow.eachCell((cell, colNumber) => {
              cell.alignment = {
                vertical: 'middle',
                horizontal: colNumber === 1 ? 'left' : 'center'
              };

              // Add specific styling based on row type
              if (row.id === 'actualProduction') {
                cell.font = {
                  color: { argb: '2563EB' }, // blue-600
                  bold: true
                };
              }

              // Add borders
              cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
              };
            });
          });

          // Auto-fit columns
          worksheet.columns.forEach(column => {
            column.width = 15;
          });

          // Generate and save file
          const buffer = await workbook.xlsx.writeBuffer();
          const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          saveAs(blob, `production_data_${new Date().toISOString().split('T')[0]}.xlsx`);

          // Show success message
          Swal.fire({
            icon: 'success',
            title: 'Export Complete',
            text: 'The production data has been exported to Excel.',
            timer: 2000,
            showConfirmButton: false
          });
        } catch (error) {
          console.error('Error generating Excel file:', error);
          Swal.fire({
            icon: 'error',
            title: 'Export Failed',
            text: 'Failed to generate Excel file. Please try again.',
          });
        }
      };

      reader.readAsDataURL(blob);
    } catch (error) {
      console.error('Error in export process:', error);
      Swal.fire({
        icon: 'error',
        title: 'Export Failed',
        text: 'Failed to export data. Please try again.',
      });
    }
  };

  const formatLastUpdated = () => {
    return new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  // Update the handleCellUpdate to include timestamp
  const handleCellEdit = (lineId: number, fieldName: keyof LineData, newValue: number) => {
    handleCellUpdate(lineId, fieldName, newValue);
    
    // Update the data with timestamp
    if (data) {
      const updatedData = {
        ...data,
        lastUpdated: formatLastUpdated()
      };
      onUpdateData(updatedData);
    }

    // Show success toast
    Swal.fire({
      title: 'Value Updated',
      text: `${fieldName === 'dailyTarget' ? 'Daily' : 'Hourly'} target for Line ${lineId} updated to ${newValue}`,
      icon: 'success',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000
    });
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
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md flex items-center"
          >
            <Download size={16} className="mr-2" />
            Export Excel
          </button>
          
          <button
            onClick={handleSaveToCloud}
            disabled={saving || !hasUnsavedChanges}
            className={`
              bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md 
              flex items-center transition-all
              ${hasUnsavedChanges ? 'animate-pulse' : ''}
              disabled:opacity-50
            `}
          >
            <Upload size={16} className="mr-2" />
            {saving ? 'Saving...' : 'Save to Cloud'}
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
      
      <div className="p-4 text-sm text-gray-600 bg-gray-50 border-t border-gray-200">        <p className="flex items-center">          <span className="mr-2">💡</span>          <span><strong>Tip:</strong> Click on Daily Target or Hourly Target values to edit them.</span>        </p>      </div>
    </div>
  );
};

export default ProductionTable;
