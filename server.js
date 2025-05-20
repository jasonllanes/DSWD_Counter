const WebSocket = require("ws");
const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");

const wss = new WebSocketServer({ port: 4000 });

// Mock data for testing
const mockData = {
  currentLine: 1,
  totalScore: 0,
};

// Function to send mock data
function sendMockData() {
  mockData.currentLine = (mockData.currentLine % 8) + 1;
  mockData.totalScore += 1;
  const mockMessage = `Sensor ${mockData.currentLine} triggered, Total Score: ${mockData.totalScore}`;

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(mockMessage);
    }
  });
}

// ===== ARDUINO MODE =====
// Uncomment this section when Arduino is connected
/*
const port = new SerialPort({
  path: "COM5",
  baudRate: 9600,
});

const parser = port.pipe(new ReadlineParser({ delimiter: "\r\n" }));

parser.on("data", (data) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
});
*/

// ===== MOCK DATA MODE =====
// Comment this section when switching to Arduino mode
setInterval(sendMockData, 2000);

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

console.log("WebSocket server is running on port 4000");
