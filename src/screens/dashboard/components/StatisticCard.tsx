import React, { useMemo, useEffect, useState } from 'react';
import { ArrowUp, ArrowDown, Info, AlertCircle, Minus } from "react-feather";
import { DashboardData } from '../../../types';

interface StatisticsCardsProps {
    data: DashboardData | null;
}

// Interface for storing previous statistics for trend comparison
interface PreviousStats {
    overallEfficiency: number;
    totalProduction: number;
    topLineId: number;
    topLineEfficiency: number;
    needsAttentionId: number;
    needsAttentionEfficiency: number;
}

const StatisticsCards: React.FC<StatisticsCardsProps> = ({ data }) => {
    const [prevStats, setPrevStats] = useState<PreviousStats | null>(null);
    const [trends, setTrends] = useState<{
        efficiency: 'up' | 'down' | 'stable';
        production: 'up' | 'down' | 'stable';
        topLine: 'up' | 'down' | 'stable';
        needsAttention: 'up' | 'down' | 'stable';
    }>({
        efficiency: 'stable',
        production: 'stable',
        topLine: 'stable',
        needsAttention: 'stable'
    });

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
        // Sort by efficiency first, then by production if efficiencies are equal
        const sortedLines = [...lineStats].sort((a, b) => {
            if (b.efficiency !== a.efficiency) {
                return b.efficiency - a.efficiency;
            }
            // If efficiencies are equal, sort by production
            return b.production - a.production;
        });

        const topLine = sortedLines[0];

        // Sort by efficiency ascending to find the line needing most attention
        const needsAttentionLine = [...lineStats].sort((a, b) => {
            if (a.efficiency !== b.efficiency) {
                return a.efficiency - b.efficiency;
            }
            // If efficiencies are equal, sort by production (lower is worse)
            return a.production - b.production;
        })[0];

        console.log('Top performing line:', topLine);
        console.log('Needs attention line:', needsAttentionLine);

        return {
            overallEfficiency,
            totalProduction,
            topLine,
            needsAttentionLine
        };
    }, [data]);

    // Track changes for trend indicators
    useEffect(() => {
        if (!statistics) return;

        if (prevStats) {
            setTrends({
                efficiency: statistics.overallEfficiency > prevStats.overallEfficiency ? 'up' :
                    statistics.overallEfficiency < prevStats.overallEfficiency ? 'down' : 'stable',

                production: statistics.totalProduction > prevStats.totalProduction ? 'up' :
                    statistics.totalProduction < prevStats.totalProduction ? 'down' : 'stable',

                topLine: statistics.topLine.efficiency > prevStats.topLineEfficiency ? 'up' :
                    statistics.topLine.efficiency < prevStats.topLineEfficiency ? 'down' : 'stable',

                needsAttention: statistics.needsAttentionLine.efficiency > prevStats.needsAttentionEfficiency ? 'up' :
                    statistics.needsAttentionLine.efficiency < prevStats.needsAttentionEfficiency ? 'down' : 'stable'
            });
        }

        // Save current stats for next comparison
        setPrevStats({
            overallEfficiency: statistics.overallEfficiency,
            totalProduction: statistics.totalProduction,
            topLineId: statistics.topLine.id,
            topLineEfficiency: statistics.topLine.efficiency,
            needsAttentionId: statistics.needsAttentionLine.id,
            needsAttentionEfficiency: statistics.needsAttentionLine.efficiency
        });
    }, [statistics]);

    const renderTrendIcon = (trend: 'up' | 'down' | 'stable', positiveIsGood: boolean = true) => {
        if (trend === 'up') {
            return <ArrowUp className={`ml-3 ${positiveIsGood ? 'text-green-600' : 'text-red-600'}`} size={20} />;
        } else if (trend === 'down') {
            return <ArrowDown className={`ml-3 ${positiveIsGood ? 'text-red-600' : 'text-green-600'}`} size={20} />;
        } else {
            return <Minus className="ml-3 text-gray-400" size={20} />;
        }
    };

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
                        {renderTrendIcon(trends.efficiency)}
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
                        {renderTrendIcon(trends.topLine)}
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
                        {renderTrendIcon(trends.needsAttention, false)}
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
                        {renderTrendIcon(trends.production)}
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