import { SerialPort } from "serialport";
import { ReadlineParser } from "@serialport/parser-readline";
import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 4000 });
console.log("✅ WebSocket server running on ws://localhost:4000");

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
    const arduinoPort = ports.find(port => 
      port.path === "COM5" || 
      (port.manufacturer && port.manufacturer.includes("Arduino"))
    );

    if (!arduinoPort) {
      throw new Error("Arduino not found on COM5 or any other port");
    }

    const port = new SerialPort({
      path: arduinoPort.path,
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
    });

    console.log(`✅ Connected to Arduino on ${arduinoPort.path}`);
    return true;

  } catch (error) {
    console.error("❌ Error connecting to Arduino:", error.message);
    throw error;
  }
}

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
  } catch (error) {
    console.error("❌ Application error:", error.message);
    process.exit(1);
  }
}

start();
