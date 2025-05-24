import React, { useState } from "react";
import { TrendingUp, Calendar, Clock } from "react-feather";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ReferenceLine
} from "recharts";

type TrendTimeframe = "hour" | "day" | "week" | "month" | "year";

type TrendData = {
    period: string;
    value: number;
    change: number;
};

interface ProductionTrendsProps {
    data?: {
        hourly: TrendData[];
        daily: TrendData[];
        weekly: TrendData[];
        monthly: TrendData[];
        yearly: TrendData[];
    };
}

const ProductionTrends: React.FC<ProductionTrendsProps> = ({ data }) => {
    const [activeTimeframe, setActiveTimeframe] = useState<TrendTimeframe>("hour");

    // Initialize with empty data instead of mock data
    const emptyData = {
        hourly: Array.from({ length: 6 }, (_, i) => ({
            period: `${i + 9} AM`,
            value: 0,
            change: 0
        })),
        daily: Array.from({ length: 7 }, (_, i) => ({
            period: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
            value: 0,
            change: 0
        })),
        weekly: Array.from({ length: 4 }, (_, i) => ({
            period: `Week ${i + 1}`,
            value: 0,
            change: 0
        })),
        monthly: Array.from({ length: 4 }, (_, i) => ({
            period: ["Jan", "Feb", "Mar", "Apr"][i],
            value: 0,
            change: 0
        })),
        yearly: Array.from({ length: 3 }, (_, i) => ({
            period: `${2022 + i}`,
            value: 0,
            change: 0
        }))
    };

    // Use provided data or fallback to empty data
    const trendData = data || emptyData;

    // Get the appropriate dataset based on active timeframe
    const getActiveData = () => {
        switch (activeTimeframe) {
            case "hour":
                return trendData.hourly;
            case "day":
                return trendData.daily;
            case "week":
                return trendData.weekly;
            case "month":
                return trendData.monthly;
            case "year":
                return trendData.yearly;
            default:
                return trendData.hourly;
        }
    };

    const activeData = getActiveData();

    // Format large numbers
    const formatYAxis = (value: number) => {
        if (value >= 1000000) {
            return `${(value / 1000000).toFixed(1)}M`;
        } else if (value >= 1000) {
            return `${(value / 1000).toFixed(0)}K`;
        }
        return value.toString();
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg border border-blue-200">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium text-blue-800 flex items-center">
                    <TrendingUp size={18} className="mr-2" />
                    Production Trends
                </h2>
                <div className="flex space-x-2">
                    <button
                        onClick={() => setActiveTimeframe("hour")}
                        className={`px-3 py-1 rounded-md text-sm flex items-center ${
                            activeTimeframe === "hour"
                                ? "bg-blue-100 text-blue-800"
                                : "text-gray-600 hover:bg-gray-100"
                        }`}
                    >
                        <Clock size={14} className="mr-1" />
                        Hourly
                    </button>
                    <button
                        onClick={() => setActiveTimeframe("day")}
                        className={`px-3 py-1 rounded-md text-sm flex items-center ${
                            activeTimeframe === "day"
                                ? "bg-blue-100 text-blue-800"
                                : "text-gray-600 hover:bg-gray-100"
                        }`}
                    >
                        <Calendar size={14} className="mr-1" />
                        Daily
                    </button>
                </div>
            </div>

            <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={activeData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="period" />
                        <YAxis tickFormatter={formatYAxis} />
                        <Tooltip />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="value"
                            name="Production"
                            stroke="#2563eb"
                            activeDot={{ r: 8, fill: '#3b82f6', stroke: '#1d4ed8' }}
                            strokeWidth={2}
                            dot={{ fill: '#2563eb', stroke: '#1d4ed8', strokeWidth: 2, r: 4 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Summary stats */}
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                {activeData.length > 0 && (
                    <>
                        <div className="bg-blue-50 border border-blue-100 rounded p-2">
                            <p className="text-xs text-blue-600">Average</p>
                            <p className="text-sm font-bold text-blue-800">
                                {Math.round(
                                    activeData.reduce((sum, item) => sum + item.value, 0) / activeData.length
                                ).toLocaleString()}
                            </p>
                        </div>

                        <div className="bg-blue-50 border border-blue-100 rounded p-2">
                            <p className="text-xs text-blue-600">Highest</p>
                            <p className="text-sm font-bold text-blue-800">
                                {Math.max(...activeData.map(item => item.value)).toLocaleString()}
                            </p>
                        </div>

                        <div className="bg-blue-50 border border-blue-100 rounded p-2">
                            <p className="text-xs text-blue-600">Lowest</p>
                            <p className="text-sm font-bold text-blue-800">
                                {Math.min(...activeData.map(item => item.value)).toLocaleString()}
                            </p>
                        </div>

                        <div className="bg-blue-50 border border-blue-100 rounded p-2">
                            <p className="text-xs text-blue-600">Total</p>
                            <p className="text-sm font-bold text-blue-800">
                                {activeData.reduce((sum, item) => sum + item.value, 0).toLocaleString()}
                            </p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ProductionTrends;