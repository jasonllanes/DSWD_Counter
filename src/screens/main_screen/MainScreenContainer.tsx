import React, { useEffect, useState } from "react";

// Define types for our data structure
type LineData = {
  count: number;
  timestamp: string;
};

type LineStatus = {
  [key: number]: LineData;
};

const MainScreenContainer = () => {
  // State for all 8 lines
  const [lineData, setLineData] = useState<LineStatus>({});
  const [connectionStatus, setConnectionStatus] = useState("Connecting...");

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:4000");

    // Connection event handlers
    ws.onopen = () => {
      setConnectionStatus("Connected");
      console.log("Connected to WebSocket server");
    };

    ws.onclose = () => {
      setConnectionStatus("Disconnected");
      console.log("Disconnected from WebSocket server");
    };

    ws.onerror = (error) => {
      setConnectionStatus("Error");
      console.error("WebSocket error:", error);
    };

    ws.onmessage = (event) => {
      try {
        const text = event.data;
        console.log("Received:", text);

        // Try to parse as JSON first (for structured data)
        try {
          const data = JSON.parse(text);
          if (data.lineId && typeof data.count === "number") {
            // Handle structured data format
            setLineData((prev) => ({
              ...prev,
              [data.lineId]: {
                count: data.count,
                timestamp: new Date().toISOString(),
              },
            }));
            return;
          }
        } catch (e) {
          // If not JSON, handle text format
          if (text.includes("Total Score:")) {
            // Extract line number and count from "Total Score: Line X: Y"
            const match = text.match(/Line (\d+):\s*(\d+)/);
            if (match) {
              const [, lineId, count] = match;
              setLineData((prev) => ({
                ...prev,
                [parseInt(lineId)]: {
                  count: parseInt(count),
                  timestamp: new Date().toISOString(),
                },
              }));
            }
          } else if (text.startsWith("count:")) {
            // Handle simple count format with line number
            const [lineId, count] = text.split(":").slice(1);
            if (lineId && count) {
              setLineData((prev) => ({
                ...prev,
                [parseInt(lineId)]: {
                  count: parseInt(count),
                  timestamp: new Date().toISOString(),
                },
              }));
            }
          }
        }
      } catch (error) {
        console.error("Error processing message:", error);
      }
    };

    // Cleanup function
    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">DSWD Relief Counter Dashboard</h1>
      <div className="mb-4">
        <p className="text-sm">
          Status:{" "}
          <span
            className={
              connectionStatus === "Connected"
                ? "text-green-500"
                : "text-red-500"
            }
          >
            {connectionStatus}
          </span>
        </p>
      </div>

      {/* Display data for each line */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }, (_, i) => i + 1).map((lineId) => (
          <div key={lineId} className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-2">Line {lineId}</h2>
            <p className="text-2xl font-bold">{lineData[lineId]?.count || 0}</p>
            <p className="text-sm text-gray-500">
              Last updated:{" "}
              {lineData[lineId]?.timestamp
                ? new Date(lineData[lineId].timestamp).toLocaleTimeString()
                : "Never"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainScreenContainer;
