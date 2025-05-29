import React, { useState, useEffect } from "react";
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
import { DashboardData } from "../../../types";

type TrendTimeframe = "hour" | "day" | "week" | "month" | "year";

type TrendData = {
    period: string;
    value: number;
    change: number;
    isProjection?: boolean; // Add flag to identify projections
};

interface ProductionTrendsProps {
    data?: DashboardData;
    trendData?: {
        hourly: TrendData[];
        daily: TrendData[];
        weekly: TrendData[];
        monthly: TrendData[];
        yearly: TrendData[];
    };
}

const ProductionTrends: React.FC<ProductionTrendsProps> = ({ data, trendData: providedTrendData }) => {
    const [activeTimeframe, setActiveTimeframe] = useState<TrendTimeframe>("hour");
    const [localTrendData, setLocalTrendData] = useState<{
        hourly: TrendData[];
        daily: TrendData[];
        weekly: TrendData[];
        monthly: TrendData[];
        yearly: TrendData[];
    }>({
        hourly: Array.from({ length: 6 }, (_, i) => {
            // Format hour labels properly using 12-hour format
            const hour = i + 9;
            const formattedHour = hour === 12
                ? `12 PM`
                : hour < 12
                    ? `${hour} AM`
                    : `${hour - 12} PM`;

            return {
                period: formattedHour,
                value: 0,
                change: 0,
                isProjection: false
            };
        }),
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
    });

    // Update the hourly trend data when new production data comes in
    useEffect(() => {
        if (!data) return;

        const totalProduction = data.lines.reduce(
            (sum, line) => sum + line.actualProduction, 0
        );

        // Get current hour
        const now = new Date();
        const currentHour = now.getHours();

        // Only show data for the current hour and hours that have completely passed
        // Map to 9AM-2PM (0-5 index)
        const hourIndex = Math.min(5, Math.max(0, currentHour - 9));

        // Update the hourly trend with the latest data
        setLocalTrendData(prev => {
            // Create a copy of the hourly data
            const updatedHourly = [...prev.hourly];

            // Calculate change since last update
            const prevValue = updatedHourly[hourIndex].value;
            const change = totalProduction - prevValue;

            // Update the value for the current hour
            updatedHourly[hourIndex] = {
                period: updatedHourly[hourIndex].period,
                value: totalProduction,
                change: change,
                isProjection: false
            };

            // Clear any data for future hours - no projections
            for (let i = hourIndex + 1; i < updatedHourly.length; i++) {
                updatedHourly[i] = {
                    period: updatedHourly[i].period,
                    value: 0,  // No projection for future hours
                    change: 0,
                    isProjection: true
                };
            }

            // Also ensure past hours (which might have been filled with dummy data) have sensible values
            for (let i = 0; i < hourIndex; i++) {
                if (updatedHourly[i].value === 0) {
                    // If a past hour has no data, provide an estimation based on current production
                    // divided by how far we are in the day
                    const hoursActive = currentHour - 9 + 1; // +1 to count current hour
                    const estimatedHourlyProduction = Math.round(totalProduction / hoursActive);
                    updatedHourly[i] = {
                        ...updatedHourly[i],
                        value: estimatedHourlyProduction,
                        isProjection: false
                    };
                }
            }

            return {
                ...prev,
                hourly: updatedHourly
            };
        });

    }, [data]);

    // Use provided trend data if available, otherwise use local trend data
    const trendData = providedTrendData || localTrendData;

    // Get the appropriate dataset based on active timeframe
    const getActiveData = () => {
        switch (activeTimeframe) {
            case "hour":
                // For hourly data, filter out future hours with no actual data
                return trendData.hourly.map(item => ({
                    ...item,
                    // We only show actual values (not projections)
                    value: item.isProjection ? 0 : item.value
                }));
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

    // Get current hour for reference line
    const currentHourIndex = Math.min(5, Math.max(0, new Date().getHours() - 9));

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
                        className={`px-3 py-1 rounded-md text-sm flex items-center ${activeTimeframe === "hour"
                            ? "bg-blue-100 text-blue-800"
                            : "text-gray-600 hover:bg-gray-100"
                            }`}
                    >
                        <Clock size={14} className="mr-1" />
                        Hourly
                    </button>
                    <button
                        onClick={() => setActiveTimeframe("day")}
                        className={`px-3 py-1 rounded-md text-sm flex items-center ${activeTimeframe === "day"
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
                        <YAxis tickFormatter={formatYAxis} domain={[0, 'auto']} />
                        <Tooltip
                            formatter={(value: number) => [value.toLocaleString(), "Production"]}
                            labelFormatter={(label) => `Period: ${label}`}
                        />
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
                        {activeTimeframe === "hour" && (
                            <ReferenceLine
                                x={activeData[currentHourIndex]?.period}
                                stroke="#10b981"
                                label={{ value: "Current", position: "insideTopRight", fill: "#10b981" }}
                            />
                        )}
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Current time indicator */}
            <div className="mt-2 text-center text-xs text-gray-500">
                Current time: {new Date().toLocaleTimeString()}
            </div>

            {/* Summary stats */}
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                {activeData.length > 0 && (
                    <>
                        <div className="bg-blue-50 border border-blue-100 rounded p-2">
                            <p className="text-xs text-blue-600">Average</p>
                            <p className="text-sm font-bold text-blue-800">
                                {Math.round(
                                    // Only calculate average from non-zero values (actual data)
                                    activeData.filter(item => item.value > 0)
                                        .reduce((sum, item) => sum + item.value, 0) /
                                    Math.max(1, activeData.filter(item => item.value > 0).length)
                                ).toLocaleString()}
                            </p>
                        </div>

                        <div className="bg-blue-50 border border-blue-100 rounded p-2">
                            <p className="text-xs text-blue-600">Highest</p>
                            <p className="text-sm font-bold text-blue-800">
                                {Math.max(...activeData.map(item => item.value || 0)).toLocaleString()}
                            </p>
                        </div>

                        <div className="bg-blue-50 border border-blue-100 rounded p-2">
                            <p className="text-xs text-blue-600">Lowest</p>
                            <p className="text-sm font-bold text-blue-800">
                                {Math.min(...activeData.filter(item => item.value > 0).map(item => item.value || 0)).toLocaleString()}
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