import React, { useEffect, useState } from "react";

// Define types for our data structure
type LineData = {
  count: number;
  timestamp: string;
  totalScore?: number; // Add totalScore to track cumulative count
};

type LineStatus = {
  [key: number]: LineData;
};

const MainScreenContainer = () => {
  // State for all 8 lines
  const [lineData, setLineData] = useState<LineStatus>({});
  const [connectionStatus, setConnectionStatus] = useState("Connecting...");
  const [ws, setWs] = useState<WebSocket | null>(null);

  // Function to trigger data collection
  const handleCollectData = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send("SEND_DATA");
    } else {
      console.error("WebSocket is not connected");
    }
  };

  useEffect(() => {
    const wsConnection = new WebSocket("ws://localhost:4000");

    // Store WebSocket instance in state
    setWs(wsConnection);

    // Connection event handlers
    wsConnection.onopen = () => {
      setConnectionStatus("Connected");
      console.log("Connected to WebSocket server");
    };

    wsConnection.onclose = () => {
      setConnectionStatus("Disconnected");
      console.log("Disconnected from WebSocket server");
    };

    wsConnection.onerror = (error) => {
      setConnectionStatus("Error");
      console.error("WebSocket error:", error);
    };

    wsConnection.onmessage = (event) => {
      try {
        const text = event.data;
        console.log("Received:", text);

        // Handle the "Sensor X triggered, Total Score: Y" format
        if (text.includes("Total Score:")) {
          // Extract the sensor number and total score
          const sensorMatch = text.match(/Sensor (\d+)/);
          const scoreMatch = text.match(/Total Score: (\d+)/);

          if (sensorMatch && scoreMatch) {
            const lineId = parseInt(sensorMatch[1]);
            const totalScore = parseInt(scoreMatch[1]);

            console.log(`Updating Line ${lineId} with score ${totalScore}`);

            setLineData((prev) => ({
              ...prev,
              [lineId]: {
                count: totalScore, // Use total score as current count
                timestamp: new Date().toISOString(),
                totalScore: totalScore, // Use total score directly
              },
            }));
          }
        }
      } catch (error) {
        console.error("Error processing message:", error);
      }
    };

    // Cleanup function
    return () => {
      if (wsConnection.readyState === WebSocket.OPEN) {
        wsConnection.close();
      }
    };
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">DSWD Relief Counter Dashboard</h1>
      <div className="mb-4 flex justify-between items-center">
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
        <button
          onClick={handleCollectData}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          disabled={connectionStatus !== "Connected"}
        >
          Collect Sensor Data
        </button>
      </div>

      {/* Display data for each line */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }, (_, i) => i + 1).map((lineId) => (
          <div key={lineId} className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-2">Line {lineId}</h2>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-600">Current Count</p>
                <p className="text-2xl font-bold text-blue-600">
                  {lineData[lineId]?.count || 0}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Score</p>
                <p className="text-2xl font-bold text-green-600">
                  {lineData[lineId]?.totalScore || 0}
                </p>
              </div>
              <p className="text-sm text-gray-500">
                Last updated:{" "}
                {lineData[lineId]?.timestamp
                  ? new Date(lineData[lineId].timestamp).toLocaleTimeString()
                  : "Never"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainScreenContainer;
