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

type TrendData = {
    period: string;
    value: number;
    change: number; // Percentage change from previous period
};

type TrendTimeframe = "hour" | "day" | "week" | "month" | "year";

type ProductionTrendsProps = {
    // This would come from your API in a real implementation
    trendData?: {
        hourly: TrendData[];
        daily: TrendData[];
        weekly: TrendData[];
        monthly: TrendData[];
        yearly: TrendData[];
    };
};

const ProductionTrends: React.FC<ProductionTrendsProps> = ({ trendData }) => {
    const [activeTimeframe, setActiveTimeframe] = useState<TrendTimeframe>("hour");

    // Mock data for demonstration - replace with actual data from props in production
    const mockData = {
        hourly: [
            { period: "9 AM", value: 1240, change: 5 },
            { period: "10 AM", value: 1350, change: 8.9 },
            { period: "11 AM", value: 1200, change: -11.1 },
            { period: "12 PM", value: 980, change: -18.3 },
            { period: "1 PM", value: 1100, change: 12.2 },
            { period: "2 PM", value: 1300, change: 18.2 },
        ],
        daily: [
            { period: "Mon", value: 7500, change: 0 },
            { period: "Tue", value: 7800, change: 4 },
            { period: "Wed", value: 8100, change: 3.8 },
            { period: "Thu", value: 7900, change: -2.5 },
            { period: "Fri", value: 8300, change: 5.1 },
            { period: "Sat", value: 4200, change: -49.4 },
            { period: "Today", value: 6100, change: 45.2 },
        ],
        weekly: [
            { period: "Week 1", value: 42000, change: 0 },
            { period: "Week 2", value: 44500, change: 6 },
            { period: "Week 3", value: 43200, change: -2.9 },
            { period: "This Week", value: 46800, change: 8.3 },
        ],
        monthly: [
            { period: "Jan", value: 185000, change: 0 },
            { period: "Feb", value: 176000, change: -4.9 },
            { period: "Mar", value: 190000, change: 8 },
            { period: "Apr", value: 195000, change: 2.6 },
        ],
        yearly: [
            { period: "2022", value: 2100000, change: 0 },
            { period: "2023", value: 2350000, change: 11.9 },
            { period: "2024 YTD", value: 780000, change: -66.8 }, // Partial year
        ],
    };

    // Use provided data or fallback to mock data
    const data = trendData || mockData;

    // Calculate target lines for comparison
    const calculateTargetLine = (dataSet: TrendData[]) => {
        const avgValue = dataSet.reduce((sum, item) => sum + item.value, 0) / dataSet.length;
        // Set target 10% higher than average as an example
        return avgValue * 1.1;
    };

    // Get the appropriate dataset based on active timeframe
    const getActiveData = () => {
        switch (activeTimeframe) {
            case "hour":
                return data.hourly;
            case "day":
                return data.daily;
            case "week":
                return data.weekly;
            case "month":
                return data.monthly;
            case "year":
                return data.yearly;
            default:
                return data.hourly;
        }
    };

    const activeData = getActiveData();
    const targetValue = calculateTargetLine(activeData);

    // Format large numbers
    const formatYAxis = (value: number) => {
        if (value >= 1000000) {
            return `${(value / 1000000).toFixed(1)}M`;
        } else if (value >= 1000) {
            return `${(value / 1000).toFixed(0)}K`;
        }
        return value.toString();
    };

    // Custom tooltip to show both value and change percentage
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white p-3 shadow-lg border border-blue-100 rounded">
                    <p className="text-sm font-medium text-blue-800">{label}</p>
                    <p className="text-sm text-blue-800">
                        Value: <span className="font-medium">{data.value.toLocaleString()}</span>
                    </p>
                    <p className={`text-sm ${data.change >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                        Change: <span className="font-medium">{data.change >= 0 ? '+' : ''}{data.change}%</span>
                    </p>
                </div>
            );
        }
        return null;
    };

    // Get title and description based on active timeframe
    const getTimeframeInfo = () => {
        switch (activeTimeframe) {
            case "hour":
                return {
                    title: "Hourly Production Trends",
                    description: "Production output tracked by hour throughout today"
                };
            case "day":
                return {
                    title: "Daily Production Trends",
                    description: "Production comparison with yesterday and previous days"
                };
            case "week":
                return {
                    title: "Weekly Production Trends",
                    description: "Weekly production output over the past month"
                };
            case "month":
                return {
                    title: "Monthly Production Trends",
                    description: "Monthly production comparison for this year"
                };
            case "year":
                return {
                    title: "Yearly Production Trends",
                    description: "Year-over-year production comparison"
                };
            default:
                return {
                    title: "Production Trends",
                    description: "Historical production data"
                };
        }
    };

    const { title, description } = getTimeframeInfo();

    return (
        <div className="bg-white rounded-lg shadow-xl overflow-hidden border border-blue-100 mb-6">
            <div className="p-5">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                    <div>
                        <h2 className="text-lg font-medium text-blue-800 flex items-center">
                            <TrendingUp size={18} className="mr-2" />
                            {title}
                        </h2>
                        <p className="text-sm text-blue-600">{description}</p>
                    </div>
                </div>

                {/* Timeframe selector tabs */}
                <div className="flex mb-6 overflow-x-auto border-b border-blue-100">
                    <button
                        className={`px-4 py-2 font-medium text-sm ${activeTimeframe === "hour"
                                ? "text-blue-600 border-b-2 border-blue-600"
                                : "text-blue-800"
                            }`}
                        onClick={() => setActiveTimeframe("hour")}
                    >
                        <Clock size={14} className="inline mr-1" />
                        Hourly
                    </button>
                    <button
                        className={`px-4 py-2 font-medium text-sm ${activeTimeframe === "day"
                                ? "text-blue-600 border-b-2 border-blue-600"
                                : "text-blue-800"
                            }`}
                        onClick={() => setActiveTimeframe("day")}
                    >
                        <Calendar size={14} className="inline mr-1" />
                        Yesterday
                    </button>
                    <button
                        className={`px-4 py-2 font-medium text-sm ${activeTimeframe === "week"
                                ? "text-blue-600 border-b-2 border-blue-600"
                                : "text-blue-800"
                            }`}
                        onClick={() => setActiveTimeframe("week")}
                    >
                        <Calendar size={14} className="inline mr-1" />
                        Weekly
                    </button>
                    <button
                        className={`px-4 py-2 font-medium text-sm ${activeTimeframe === "month"
                                ? "text-blue-600 border-b-2 border-blue-600"
                                : "text-blue-800"
                            }`}
                        onClick={() => setActiveTimeframe("month")}
                    >
                        <Calendar size={14} className="inline mr-1" />
                        Monthly
                    </button>
                    <button
                        className={`px-4 py-2 font-medium text-sm ${activeTimeframe === "year"
                                ? "text-blue-600 border-b-2 border-blue-600"
                                : "text-blue-800"
                            }`}
                        onClick={() => setActiveTimeframe("year")}
                    >
                        <Calendar size={14} className="inline mr-1" />
                        Yearly
                    </button>
                </div>

                {/* Chart area */}
                <div className="w-full h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={activeData}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis
                                dataKey="period"
                                tick={{ fill: '#1e40af', fontSize: 12 }}
                                axisLine={{ stroke: '#cbd5e1' }}
                            />
                            <YAxis
                                tickFormatter={formatYAxis}
                                tick={{ fill: '#1e40af', fontSize: 12 }}
                                axisLine={{ stroke: '#cbd5e1' }}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <ReferenceLine
                                y={targetValue}
                                stroke="#fbbf24"
                                strokeDasharray="3 3"
                                label={{
                                    value: 'Target',
                                    position: 'insideTopRight',
                                    fill: '#d97706',
                                    fontSize: 12
                                }}
                            />
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
                                <p className="text-xs text-blue-600">Target</p>
                                <p className="text-sm font-bold text-yellow-600">
                                    {Math.round(targetValue).toLocaleString()}
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductionTrends;