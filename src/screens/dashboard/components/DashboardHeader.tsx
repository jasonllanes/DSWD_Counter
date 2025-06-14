import React, { useState, useEffect } from "react"
import { Clock, RefreshCw, Calendar } from "react-feather"
import dswd_logo from "../../../assets/dswd_logo.png"

type DashboardHeaderProps = {
  lastUpdated: string
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ lastUpdated }) => {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formattedDate = currentTime.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  })

  const formattedTime = currentTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  })

  // Format the last updated text based on whether we have a timestamp
  const formatLastUpdated = () => {
    if (!lastUpdated) {
      return "No updates yet"
    }
    return lastUpdated
  }

  return (
    <header className="bg-gradient-to-r from-[#1e3a8a] via-[#2B45A3] to-[#1e40af]">
      <div className="container mx-auto px-6 py-4">
        {/* Logo and Title Section */}
        <div className="flex items-center gap-4 mb-6">
          <img src={dswd_logo} alt="DSWD Logo" className="h-14 w-14" />
          <div>
            <h1 className="text-white text-2xl font-bold tracking-wide">
              DSWD Relief Dashboard
            </h1>
            <p className="text-blue-200 text-sm mt-1">
              Real-time Monitoring System
            </p>
          </div>
        </div>

        {/* Time and Status Section */}
        <div className="flex flex-wrap gap-4">
          {/* Date Card */}
          <div className="flex items-center bg-[#1e3a8a]/50 backdrop-blur-sm rounded-lg px-5 py-2.5">
            <Calendar size={20} className="text-blue-300 mr-3" />
            <span className="text-white font-medium">{formattedDate}</span>
          </div>

          {/* Time Card */}
          <div className="flex items-center bg-[#1e3a8a]/50 backdrop-blur-sm rounded-lg px-5 py-2.5">
            <Clock size={20} className="text-blue-300 mr-3" />
            <span className="text-white font-medium">{formattedTime}</span>
          </div>

          {/* Last Updated Card */}
          <div className="flex items-center bg-[#1e3a8a]/50 backdrop-blur-sm rounded-lg px-5 py-2.5 ml-auto">
            <RefreshCw
              size={20}
              className={`text-green-400 mr-3 ${
                lastUpdated ? "animate-spin" : ""
              }`}
            />
            <div className="flex items-center">
              <span className="text-blue-200">Last updated:</span>
              <span className="ml-2 text-white font-medium">
                {formatLastUpdated()}
              </span>
              <div
                className={`w-2 h-2 rounded-full ml-3 ${
                  lastUpdated ? "bg-green-400 animate-pulse" : "bg-gray-400"
                }`}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default DashboardHeader
