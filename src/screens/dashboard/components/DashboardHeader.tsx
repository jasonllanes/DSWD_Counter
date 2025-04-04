import React from "react";
import { Clock, RefreshCw } from "react-feather";
import dswd_logo from "../../../assets/dswd_logo.png";

type DashboardHeaderProps = {
    lastUpdated: string;
};

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ lastUpdated }) => {
    return (
        <div className="w-full bg-blue-800 py-4 border-b border-blue-900 shadow-md">
            <div className="flex flex-col md:flex-row justify-between  gap-2 container mx-2 md:mx-2 lg:mx-2">
                <div className="flex items-center">
                    <img
                        src={dswd_logo}
                        alt="DSWD Logo"
                        className="h-10 mr-3"
                    />
                    <h1 className="text-xl font-bold text-white">
                        DSWD Relief Dashboard
                    </h1>
                </div>
                <div className="flex items-center text-yellow-300 text-sm">
                    <Clock size={14} className="mr-2" />
                    <span>Last updated: {lastUpdated}</span>
                    <span className="mx-2">•</span>
                    <RefreshCw size={14} className="mr-2" />
                    <span>Auto-refreshes every 5 seconds</span>
                </div>
            </div>
        </div>
    );
};

export default DashboardHeader;