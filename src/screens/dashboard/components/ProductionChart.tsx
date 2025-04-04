import React from "react";
import { BarChart2 } from "react-feather";

const ProductionChart: React.FC = () => {
    return (
        <div className="w-full bg-white rounded-lg shadow-xl overflow-hidden border border-blue-200">
            <div className="p-5">
                <h2 className="text-lg font-medium text-blue-800 mb-4 flex items-center">
                    <BarChart2 size={18} className="mr-2" />
                    Production by Line
                </h2>
                <div className="h-64 bg-blue-50 rounded-lg flex items-center justify-center border border-blue-100">
                    <p className="text-blue-800 text-sm">
                        Production chart would be displayed here
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ProductionChart;