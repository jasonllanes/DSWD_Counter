/* eslint-env node */
import "dotenv/config";
import { SerialPort } from "serialport";
import { ReadlineParser } from "@serialport/parser-readline";
import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 4000 });
console.log("✅ WebSocket server running on ws://localhost:4000");

// // Mock data state (disabled by default)
// const mockData = {
//   currentLine: 1,
//   totalScore: 0,
// };

// Function to generate realistic mock data
// function generateMockData() {
//   mockData.currentLine = (mockData.currentLine % 8) + 1;
//   mockData.totalScore += Math.floor(Math.random() * 5) + 1; // Random increment 1-5
//   return `Sensor ${mockData.currentLine} triggered, Total Score: ${mockData.totalScore}`;
// }

// Function to broadcast data to all connected clients
function broadcastData(data) {
  wss.clients.forEach((client) => {
    if (client.readyState === 1) { // WebSocket.OPEN
      client.send(data);
    }
  });
}

// Function to setup hardware connection
async function setupHardwareConnection() {
  try {
    // List all available ports
    const ports = await SerialPort.list();

    const envPortRaw = process.env.VITE_ARDUINO_PORT;
    const envPort = envPortRaw ? envPortRaw.trim() : "";

    let selectedPort = null;

    // 1) If env specifies a concrete COM port (not AUTO), prefer it
    if (envPort && envPort.toUpperCase() !== "AUTO") {
      selectedPort = ports.find((p) => p.path === envPort) || null;
      if (selectedPort) {
        console.log(`🔌 Using Arduino port from .env: ${envPort}`);
      } else {
        console.warn(
          `⚠️ .env VITE_ARDUINO_PORT='${envPort}' not found among available ports. Falling back to auto-detect...`
        );
      }
    }

    // 2) Auto-detect by manufacturer if not found or AUTO requested
    if (!selectedPort) {
      selectedPort =
        ports.find((p) => (p.manufacturer || "").toLowerCase().includes("arduino")) || null;
      if (selectedPort) {
        console.log(`🔍 Auto-detected Arduino on ${selectedPort.path}`);
      }
    }

    // 3) If still not found, provide helpful info and run without hardware
    if (!selectedPort) {
      const available = ports.map((p) => p.path).join(", ") || "none";
      throw new Error(
        `Arduino not found. Set VITE_ARDUINO_PORT in .env or ensure device is connected. Available ports: ${available}`
      );
    }

    const port = new SerialPort({
      path: selectedPort.path,
      baudRate: 9600,
    });

    const parser = port.pipe(new ReadlineParser({ delimiter: "\r\n" }));

    // Handle data from Arduino
    parser.on("data", (data) => {
      console.log("📊 Received from Arduino:", data);
      broadcastData(data);
    });

    // Handle port errors
    port.on("error", (error) => {
      console.error("❌ Serial port error:", error.message);
      // startMockMode();
    });

    console.log(`✅ Connected to Arduino on ${selectedPort.path}`);
    return true;

  } catch (error) {
    console.log("⚠️ Hardware not connected, running in simulation mode");
    console.log("Error details:", error.message);
    return false;
  }
}

// Function to start mock data mode
// function startMockMode() {
//   console.log("🔄 Starting mock data simulation...");
//   setInterval(() => {
//     const mockMessage = generateMockData();
//     console.log("📤 Mock data:", mockMessage);
//     broadcastData(mockMessage);
//   }, 2000);
// }

// WebSocket connection handling
wss.on("connection", (ws) => {
  console.log("👤 Client connected");
  
  ws.on("close", () => {
    console.log("👋 Client disconnected");
  });

  ws.on("error", (error) => {
    console.error("❌ WebSocket error:", error.message);
  });
});

// Start the application
async function start() {
  try {
    await setupHardwareConnection();
    // if (!isHardwareConnected) {
    //   startMockMode();
    // }
  } catch (error) {
    console.error("❌ Application error:", error.message);
    // startMockMode();
  }
}

start();
