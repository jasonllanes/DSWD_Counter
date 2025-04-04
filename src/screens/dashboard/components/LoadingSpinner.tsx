import React from "react";

const LoadingSpinner: React.FC = () => {
    return (
        <div className="flex items-center justify-center h-screen w-full bg-white">
            <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-blue-800 font-medium">
                    Loading dashboard data...
                </p>
            </div>
        </div>
    );
};

export default LoadingSpinner;