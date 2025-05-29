import React, { useMemo } from 'react';
import { ArrowUp, ArrowDown, Info, AlertCircle } from "react-feather";
import { DashboardData } from '../../../types';

interface StatisticsCardsProps {
    data: DashboardData | null;
}

const StatisticsCards: React.FC<StatisticsCardsProps> = ({ data }) => {
    const statistics = useMemo(() => {
        if (!data) return null;

        // Calculate total production and efficiency for each line
        const lineStats = data.lines.map(line => ({
            id: line.id,
            efficiency: line.dailyTarget > 0 
                ? Math.round((line.actualProduction / line.dailyTarget) * 100)
                : 0,
            production: line.actualProduction
        }));

        // Calculate overall statistics
        const totalProduction = lineStats.reduce((sum, line) => sum + line.production, 0);
        const totalTarget = data.lines.reduce((sum, line) => sum + line.dailyTarget, 0);
        const overallEfficiency = totalTarget > 0 
            ? Math.round((totalProduction / totalTarget) * 100)
            : 0;

        // Find top and bottom performing lines
        const sortedLines = [...lineStats].sort((a, b) => b.efficiency - a.efficiency);
        const topLine = sortedLines[0];
        const needsAttentionLine = sortedLines[sortedLines.length - 1];

        return {
            overallEfficiency,
            totalProduction,
            topLine,
            needsAttentionLine
        };
    }, [data]);

    if (!statistics) return null;

    return (
        <div className="grid grid-cols-2 gap-5 mb-6">
            {/* Overall Efficiency Card */}
            <div className="bg-white p-6 rounded-lg shadow-lg border border-blue-200">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-sm font-medium text-blue-800">Overall Efficiency</h3>
                    <Info className="text-blue-400" size={18} />
                </div>
                <div>
                    <div className="flex items-center">
                        <span className="text-4xl font-bold text-blue-600">
                            {statistics.overallEfficiency}%
                        </span>
                        <ArrowUp className="ml-3 text-blue-600" size={20} />
                    </div>
                    <p className="text-blue-800 text-xs mt-2">
                        Based on daily targets
                    </p>
                </div>
            </div>

            {/* Top Performing Line Card */}
            <div className="bg-white p-6 rounded-lg shadow-lg border border-blue-200">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-sm font-medium text-blue-800">Top Performing Line</h3>
                    <Info className="text-blue-400" size={18} />
                </div>
                <div>
                    <div className="flex items-center">
                        <span className="text-4xl font-bold text-yellow-500">
                            Line {statistics.topLine.id}
                        </span>
                        <ArrowUp className="ml-3 text-yellow-500" size={20} />
                    </div>
                    <p className="text-blue-800 text-xs mt-2">
                        {statistics.topLine.efficiency}% efficiency
                    </p>
                </div>
            </div>

            {/* Needs Attention Card */}
            <div className="bg-white p-6 rounded-lg shadow-lg border border-blue-200">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-sm font-medium text-blue-800">Needs Attention</h3>
                    <AlertCircle className="text-red-400" size={18} />
                </div>
                <div>
                    <div className="flex items-center">
                        <span className="text-4xl font-bold text-red-600">
                            Line {statistics.needsAttentionLine.id}
                        </span>
                        <ArrowDown className="ml-3 text-red-600" size={20} />
                    </div>
                    <p className="text-blue-800 text-xs mt-2">
                        {statistics.needsAttentionLine.efficiency}% efficiency
                    </p>
                </div>
            </div>

            {/* Total Production Card */}
            <div className="bg-white p-6 rounded-lg shadow-lg border border-blue-200">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-sm font-medium text-blue-800">Total Production</h3>
                    <Info className="text-blue-400" size={18} />
                </div>
                <div>
                    <div className="flex items-center">
                        <span className="text-4xl font-bold text-blue-600">
                            {statistics.totalProduction.toLocaleString()}
                        </span>
                    </div>
                    <p className="text-blue-800 text-xs mt-2">
                        Units produced today
                    </p>
                </div>
            </div>
        </div>
    );
};

export default StatisticsCards;