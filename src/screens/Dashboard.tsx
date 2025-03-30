import { useState, useEffect, useMemo } from "react";
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
import {
  ArrowUp,
  ArrowDown,
  Clock,
  RefreshCw,
  Download,
  Upload,
  Info,
  BarChart2,
  AlertCircle,
} from "react-feather";

// Simple tooltip wrapper with proper typing
type IconWithTooltipProps = {
  icon: React.ElementType;
  tooltip: string;
  size?: number;
  className?: string;
};

const IconWithTooltip: React.FC<IconWithTooltipProps> = ({
  icon: Icon,
  tooltip,
  ...props
}) => (
  <div className="relative group">
    <Icon {...props} />
    <div className="absolute z-10 hidden group-hover:block bg-slate-700 text-white text-xs rounded py-1 px-2 -mt-1 left-full ml-2 w-48">
      {tooltip}
    </div>
  </div>
);

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

  // Calculate statistics for dashboard cards
  const statistics = useMemo(() => {
    if (!data) return null;

    // Calculate overall efficiency
    const totalProduction = data.lines.reduce(
      (sum, line) => sum + line.actualProduction,
      0
    );
    const totalTarget = data.lines.reduce(
      (sum, line) => sum + line.dailyTarget,
      0
    );
    const overallEfficiency = totalTarget > 0
      ? Math.round((totalProduction / totalTarget) * 100)
      : 0;

    // Find top performing line
    const lineEfficiencies = data.lines.map((line) => ({
      id: line.id,
      efficiency: Math.round((line.actualProduction / line.dailyTarget) * 100),
    }));

    const topLine = [...lineEfficiencies].sort(
      (a, b) => b.efficiency - a.efficiency
    )[0];

    // Find line needing attention (lowest efficiency)
    const needsAttentionLine = [...lineEfficiencies].sort(
      (a, b) => a.efficiency - b.efficiency
    )[0];

    return {
      overallEfficiency,
      totalProduction,
      topLine,
      needsAttentionLine,
    };
  }, [data]);

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
      header: () => (
        <div className="text-left font-medium text-gray-300 py-3 px-4">
          METRIC
        </div>
      ),
      cell: (info) => (
        <div className="font-medium py-3 px-4 text-gray-300">
          {info.getValue()}
        </div>
      ),
    }),
    ...Array.from({ length: 8 }, (_, i) => i + 1).map((lineId) =>
      columnHelper.accessor(`line${lineId}`, {
        header: () => (
          <div className="text-center font-medium text-gray-300 py-3 px-4">
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
            cellStyle += isBelowTarget ? " text-red-400" : " text-blue-400";
          } else {
            cellStyle += " text-white";
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-full bg-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-300 font-medium">
            Loading dashboard data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 min-h-screen w-full text-white pt-20">
      {/* Dashboard Header */}
      <div className="w-full bg-slate-800 py-4 px-6 border-b border-slate-700">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 max-w-[1468px] mx-auto">
          <h1 className="text-xl font-bold text-white">
            DSWD Relief Dashboard
          </h1>
          <div className="flex items-center text-gray-400 text-sm">
            <Clock size={14} className="mr-2" />
            <span>Last updated: {lastUpdated}</span>
            <span className="mx-2">•</span>
            <RefreshCw size={14} className="mr-2" />
            <span>Auto-refreshes every 5 seconds</span>
          </div>
        </div>
      </div>

      {/* Main Content - Full Width */}
      <div className="w-full px-6 py-6">
        {/* Main Table */}
        <div className="w-full bg-slate-800 rounded-lg shadow-xl overflow-hidden mb-6">
          <div className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-lg font-medium text-white flex items-center">
              <BarChart2 size={18} className="mr-2" />
              Production Metrics
            </h2>
            <div className="flex space-x-3">
              <button
                onClick={handleExportToExcel}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md flex items-center transition-colors text-sm"
              >
                <Download size={16} className="mr-2" />
                Export to Excel
              </button>
              <button
                onClick={handleSaveToCloud}
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center transition-colors text-sm disabled:opacity-50"
              >
                <Upload size={16} className="mr-2" />
                {saving ? "Saving..." : "Add to Cloud"}
              </button>
            </div>
          </div>

          <div className="w-full overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-slate-700 border-b border-slate-600">
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
                    className={`border-b border-slate-700 ${
                      rowIndex % 2 === 0 ? "bg-slate-800" : "bg-slate-800/50"
                    } hover:bg-slate-700/50 transition-colors`}
                  >
                    {row.getVisibleCells().map((cell, cellIndex) => {
                      // Apply special styling to the first cell (metric name)
                      const isMetricCell = cellIndex === 0;

                      return (
                        <td
                          key={cell.id}
                          className={`${isMetricCell ? "bg-slate-700/70" : ""}`}
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

        {/* Statistics Cards */}
        {statistics && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {/* Overall Efficiency */}
            <div className="bg-slate-800 rounded-lg shadow-xl overflow-hidden border-l-4 border-green-500 hover:translate-y-[-2px] transition-transform">
              <div className="p-5">
                <h3 className="text-gray-400 text-sm font-medium mb-1 flex items-center">
                  Overall Efficiency
                  <IconWithTooltip
                    icon={Info}
                    size={14}
                    className="ml-2 text-gray-500 cursor-help"
                    tooltip="Average efficiency across all production lines"
                  />
                </h3>
                <div className="flex items-center">
                  <span className="text-4xl font-bold text-green-500">
                    {statistics.overallEfficiency}%
                  </span>
                  <ArrowUp className="ml-3 text-green-500" size={20} />
                </div>
                <p className="text-gray-400 text-xs mt-2">
                  Average across all lines
                </p>
              </div>
            </div>

            {/* Top Performing Line */}
            <div className="bg-slate-800 rounded-lg shadow-xl overflow-hidden border-l-4 border-blue-500 hover:translate-y-[-2px] transition-transform">
              <div className="p-5">
                <h3 className="text-gray-400 text-sm font-medium mb-1 flex items-center">
                  Top Performing Line
                  <IconWithTooltip
                    icon={Info}
                    size={14}
                    className="ml-2 text-gray-500 cursor-help"
                    tooltip="Line with highest efficiency"
                  />
                </h3>
                <div className="flex items-center">
                  <span className="text-4xl font-bold text-blue-500">
                    Line {statistics.topLine.id}
                  </span>
                  <ArrowUp className="ml-3 text-blue-500" size={20} />
                </div>
                <p className="text-gray-400 text-xs mt-2">
                  {statistics.topLine.efficiency}% efficiency
                </p>
              </div>
            </div>

            {/* Needs Attention */}
            <div className="bg-slate-800 rounded-lg shadow-xl overflow-hidden border-l-4 border-red-500 hover:translate-y-[-2px] transition-transform">
              <div className="p-5">
                <h3 className="text-gray-400 text-sm font-medium mb-1 flex items-center">
                  Needs Attention
                  <IconWithTooltip
                    icon={AlertCircle}
                    size={14}
                    className="ml-2 text-red-500 cursor-help"
                    tooltip="Line with lowest efficiency"
                  />
                </h3>
                <div className="flex items-center">
                  <span className="text-4xl font-bold text-red-500">
                    Line {statistics.needsAttentionLine.id}
                  </span>
                  <ArrowDown className="ml-3 text-red-500" size={20} />
                </div>
                <p className="text-gray-400 text-xs mt-2">
                  {statistics.needsAttentionLine.efficiency}% efficiency
                </p>
              </div>
            </div>

            {/* Total Production */}
            <div className="bg-slate-800 rounded-lg shadow-xl overflow-hidden border-l-4 border-purple-500 hover:translate-y-[-2px] transition-transform">
              <div className="p-5">
                <h3 className="text-gray-400 text-sm font-medium mb-1 flex items-center">
                  Total Production
                  <IconWithTooltip
                    icon={Info}
                    size={14}
                    className="ml-2 text-gray-500 cursor-help"
                    tooltip="Total units produced across all lines"
                  />
                </h3>
                <div className="flex items-center">
                  <span className="text-4xl font-bold text-purple-500">
                    {statistics.totalProduction.toLocaleString()}
                  </span>
                </div>
                <p className="text-gray-400 text-xs mt-2">Across all lines</p>
              </div>
            </div>
          </div>
        )}

        {/* Production Chart */}
        <div className="w-full bg-slate-800 rounded-lg shadow-xl overflow-hidden">
          <div className="p-5">
            <h2 className="text-lg font-medium text-white mb-4 flex items-center">
              <BarChart2 size={18} className="mr-2" />
              Production by Line
            </h2>
            <div className="h-64 bg-slate-700/50 rounded-lg flex items-center justify-center">
              <p className="text-gray-400 text-sm">
                Production chart would be displayed here
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
