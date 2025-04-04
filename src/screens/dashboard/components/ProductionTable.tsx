import React from "react";
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { BarChart2, Download, Upload } from "react-feather";
import type { DashboardData, DashboardRowData } from "../../../types";

type ProductionTableProps = {
    data: DashboardData | null;
    saving: boolean;
    onExportToExcel: () => void;
    onSaveToCloud: () => void;
};

const ProductionTable: React.FC<ProductionTableProps> = ({
    data,
    saving,
    onExportToExcel,
    onSaveToCloud,
}) => {
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
                <div className="text-left font-medium text-white py-3 px-4">
                    METRIC
                </div>
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

    return (
        <div className="w-full bg-white rounded-lg shadow-xl overflow-hidden mb-6 border border-blue-200">
            <div className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-blue-50">
                <h2 className="text-lg font-medium text-blue-800 flex items-center">
                    <BarChart2 size={18} className="mr-2" />
                    Production Metrics
                </h2>
                <div className="flex space-x-3">
                    <button
                        onClick={onExportToExcel}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md flex items-center transition-colors text-sm"
                    >
                        <Download size={16} className="mr-2" />
                        Export to Excel
                    </button>
                    <button
                        onClick={onSaveToCloud}
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
                                            className={`${isMetricCell ? "bg-blue-700 text-white" : ""}`}
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