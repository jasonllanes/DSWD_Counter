import React from "react";
import { ArrowUp, ArrowDown, Info, AlertCircle } from "react-feather";

type Statistics = {
    overallEfficiency: number;
    totalProduction: number;
    topLine: {
        id: number;
        efficiency: number;
    };
    needsAttentionLine: {
        id: number;
        efficiency: number;
    };
};

type StatisticsCardsProps = {
    statistics: Statistics | null;
};

const StatisticsCards: React.FC<StatisticsCardsProps> = ({ statistics }) => {
    if (!statistics) return null;

    return (
        <div className="grid grid-cols-4 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Overall Efficiency */}
            <div className="bg-white rounded-lg shadow-xl overflow-hidden border-l-4 border-blue-600 hover:translate-y-[-2px] transition-transform">
                <div className="p-5">
                    <h3 className="text-blue-800 text-sm font-medium mb-1 flex items-center">
                        Overall Efficiency
                        <Info
                            size={14}
                            className="ml-2 text-blue-500 cursor-help"
                        />
                    </h3>
                    <div className="flex items-center">
                        <span className="text-4xl font-bold text-blue-600">
                            {statistics.overallEfficiency}%
                        </span>
                        <ArrowUp className="ml-3 text-blue-600" size={20} />
                    </div>
                    <p className="text-blue-800 text-xs mt-2">
                        Average across all lines
                    </p>
                </div>
            </div>

            {/* Top Performing Line */}
            <div className="bg-white rounded-lg shadow-xl overflow-hidden border-l-4 border-yellow-500 hover:translate-y-[-2px] transition-transform">
                <div className="p-5">
                    <h3 className="text-blue-800 text-sm font-medium mb-1 flex items-center">
                        Top Performing Line
                        <Info
                            size={14}
                            className="ml-2 text-blue-500 cursor-help"
                        />
                    </h3>
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

            {/* Needs Attention */}
            <div className="bg-white rounded-lg shadow-xl overflow-hidden border-l-4 border-red-600 hover:translate-y-[-2px] transition-transform">
                <div className="p-5">
                    <h3 className="text-blue-800 text-sm font-medium mb-1 flex items-center">
                        Needs Attention
                        <AlertCircle
                            size={14}
                            className="ml-2 text-red-600 cursor-help"
                        />
                    </h3>
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

            {/* Total Production */}
            <div className="bg-white rounded-lg shadow-xl overflow-hidden border-l-4 border-blue-600 hover:translate-y-[-2px] transition-transform">
                <div className="p-5">
                    <h3 className="text-blue-800 text-sm font-medium mb-1 flex items-center">
                        Total Production
                        <Info
                            size={14}
                            className="ml-2 text-blue-500 cursor-help"
                        />
                    </h3>
                    <div className="flex items-center">
                        <span className="text-4xl font-bold text-blue-600">
                            {statistics.totalProduction.toLocaleString()}
                        </span>
                    </div>
                    <p className="text-blue-800 text-xs mt-2">Across all lines</p>
                </div>
            </div>
        </div>
    );
};

export default StatisticsCards;