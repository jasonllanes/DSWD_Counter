import { useState, useEffect } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { fetchCurrentData } from "../services/api";
import { saveDashboardData } from "../services/firebase";
import { exportToExcel } from "../utils/excelExport";
import type { DashboardData, DashboardRowData } from "../types";

const Dashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  // Fetch data initially and set up interval for real-time updates
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchCurrentData();
        setData(result);
        setLastUpdated(new Date().toLocaleTimeString());
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();

    // Set up interval for real-time updates
    const intervalId = setInterval(fetchData, 5000); // Update every 5 seconds

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  // Handle saving data to Firestore
  const handleSaveToCloud = async () => {
    if (!data) return;

    setSaving(true);
    try {
      const result = await saveDashboardData(data);
      if (result.success) {
        alert("Data successfully saved to Firestore!");
      } else {
        alert("Failed to save data. Please try again.");
      }
    } catch (error) {
      console.error("Error saving data:", error);
      alert("An error occurred while saving data.");
    } finally {
      setSaving(false);
    }
  };

  // Handle exporting data to Excel
  const handleExportToExcel = () => {
    if (!data) return;
    exportToExcel(
      data,
      `dashboard-data-${new Date().toISOString().split("T")[0]}.xlsx`
    );
  };

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
      header: "",
      cell: (info) => info.getValue(),
    }),
    ...Array.from({ length: 8 }, (_, i) => i + 1).map((lineId) =>
      columnHelper.accessor(`line${lineId}`, {
        header: () => (
          <div className="text-center font-bold bg-gray-700 text-white p-2 rounded-t-md">
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

          return (
            <div
              className={`text-center p-2 font-bold ${
                isBelowTarget
                  ? "bg-red-200 text-red-700"
                  : "bg-blue-500 text-red-600"
              }`}
            >
              {value}
            </div>
          );
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

  if (loading) {
    return <div className="text-center py-10">Loading dashboard data...</div>;
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
      <h1 className="text-2xl font-bold text-white mb-6">
        Relief Goods Distribution Dashboard
      </h1>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="p-0">
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
            {table.getRowModel().rows.map((row) => {
              const metricName = row.original.metric;
              const rowColor =
                metricName === "Daily Target" || metricName === "Hourly Target"
                  ? "text-yellow-300"
                  : "text-white";

              return (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => {
                    // Apply special styling to the first cell (metric name)
                    const isMetricCell = cell.column.id === "metric";

                    return (
                      <td
                        key={cell.id}
                        className={`p-2 ${
                          isMetricCell
                            ? `bg-gray-600 ${rowColor} font-medium`
                            : ""
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
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex flex-wrap justify-between items-center">
        <div className="text-white">Last updated: {lastUpdated}</div>
        <div className="flex space-x-4 mt-4 sm:mt-0">
          <button
            onClick={handleSaveToCloud}
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            {saving ? "Saving..." : "Add to Cloud"}
          </button>
          <button
            onClick={handleExportToExcel}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Export to Excel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
