import React from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { BarChart2, Download, Upload } from "react-feather";
import type { DashboardData, DashboardRowData } from "../../../types";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import dswdLogo from "../../../assets/dswd_logo.png";
import { firebaseService } from "@/services/firebase";
import { isFeatureEnabled } from "@/config/env";
import Swal from "sweetalert2";

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
  // Define table structure
  const rows = [
    // { id: "dailyTarget", name: "Daily Target" },
    // { id: "hourlyTarget", name: "Hourly Target" },
    // { id: "productionPerHour", name: "Production / Hr" },
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

      // Leave some rows for the image
      const startRow = 8;

      // Add header row with styling
      const headerRow = worksheet.getRow(startRow);
      headerRow.values = [
        "METRIC",
        ...Array.from({ length: 8 }, (_, i) => `LINE ${i + 1}`),
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
          const rowValues = [
            row.name,
            ...data.lines.map((line) => {
              const value = line[row.id as keyof LineData];
              return value !== undefined ? value : 0;
            }),
          ];
          dataRow.values = rowValues;

          // Style production/hr row
          if (row.id === "productionPerHour") {
            rowValues.forEach((value, colIdx) => {
              if (colIdx > 0) {
                const cell = dataRow.getCell(colIdx + 1);
                const hourlyTarget = data.lines[colIdx - 1]?.hourlyTarget || 0;
                cell.font = {
                  color: {
                    argb: Number(value) < hourlyTarget ? "DC2626" : "2563EB",
                  },
                };
              }
            });
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
        <h2 className="text-lg font-medium text-blue-800 flex items-center">
          <BarChart2 size={18} className="mr-2" />
          Production Metrics
        </h2>
        <div className="flex space-x-3">
          <button
            onClick={handleExportToExcel}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md flex items-center transition-colors text-sm"
          >
            <Download size={16} className="mr-2" />
            Export to Excel
          </button>
          {isFeatureEnabled('mockData') && (
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
          )}
        </div>
      </div>

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
