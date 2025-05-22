import { SerialPort } from "serialport";
import { ReadlineParser } from "@serialport/parser-readline";
import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 4000 });
console.log("✅ WebSocket server running on ws://localhost:4000");

// Function to simulate sensor data
function simulateSensorData() {
  const sensorId = Math.floor(Math.random() * 8) + 1; // Random sensor 1-8
  const score = Math.floor(Math.random() * 100); // Random score 0-99
  return `Sensor ${sensorId} triggered, Total Score: ${score}`;
}

// Function to setup hardware connection
async function setupHardwareConnection() {
  try {
    const ports = await SerialPort.list();
    const arduinoPort = ports.find(port => port.path === "COM5");

    if (!arduinoPort) {
      throw new Error("Arduino not found on COM5");
    }

    const port = new SerialPort({
      path: "COM5",
      baudRate: 9600,
    });

    const parser = port.pipe(new ReadlineParser({ delimiter: "\n" }));

    parser.on("data", (data) => {
      console.log("Received from Arduino:", data);
      wss.clients.forEach((client) => {
        if (client.readyState === 1) {
          client.send(data);
        }
      });
    });

    console.log("✅ Connected to Arduino on COM5");
    return true;

  } catch (error) {
    console.log("⚠️ Hardware not connected, running in simulation mode");
    console.log("Error details:", error.message);
    return false;
  }
}

// Start the application
async function start() {
  const isHardwareConnected = await setupHardwareConnection();

  if (!isHardwareConnected) {
    // Simulate data every 2 seconds when no hardware is connected
    setInterval(() => {
      const mockData = simulateSensorData();
      console.log("Mock data:", mockData);
      wss.clients.forEach((client) => {
        if (client.readyState === 1) {
          client.send(mockData);
        }
      });
    }, 2000);
  }
}

start();
