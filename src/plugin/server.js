import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';
import { WebSocketServer } from 'ws';

// ✅ Correct constructor with path:
const port = new SerialPort({
    path: 'COM6',   // <--- REQUIRED, this is your Arduino COM port
    baudRate: 9600
});

const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

const wss = new WebSocketServer({ port: 4000 });

parser.on('data', (data) => {
    console.log('Received from Arduino:', data);
    wss.clients.forEach((client) => {
        if (client.readyState === 1) { // OPEN
            client.send(data);
        }
    });
});

console.log("✅ WebSocket server running on ws://localhost:4000");
