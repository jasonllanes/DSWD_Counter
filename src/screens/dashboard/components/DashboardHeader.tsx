import React from "react";
import { Clock, RefreshCw, Calendar } from "react-feather";
import dswd_logo from "../../../assets/dswd_logo.png";

type DashboardHeaderProps = {
    lastUpdated: string;
};

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ lastUpdated }) => {
    const currentDate = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });

    return (
        <header className="bg-[#2B45A3] w-full">
            <div className="container mx-auto flex flex-col items-start justify-center py-4">
                <div className="flex items-center gap-2 mb-2">
                    <img
                        src={dswd_logo}
                        alt="DSWD Logo"
                        className="h-8 w-8"
                    />
                    <h1 className="text-white text-xl font-semibold">
                        DSWD Relief Dashboard
                    </h1>
                </div>
                
                <div className="flex flex-col  gap-1 text-yellow-300 text-sm">
                    <div className="flex ">
                        <Calendar size={14} className="mr-1.5" />
                        <span>{currentDate}</span>
                    </div>
                    <div className="flex ">
                        <Clock size={14} className="mr-1.5" />
                        <span>Last updated: {lastUpdated}</span>
                    </div>
                    <div className="flex ">
                        <RefreshCw size={14} className="mr-1.5" />
                        <span>Auto-refreshes every 5 seconds</span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default DashboardHeader;