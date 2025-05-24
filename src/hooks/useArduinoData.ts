import { useState, useEffect, useCallback } from 'react';
import { getWebSocketConfig } from '@/config/env';

interface ArduinoData {
  sensorId?: number;
  weight: number;
  timestamp: string;
  totalScore?: number;
}

export const useArduinoData = () => {
  const [data, setData] = useState<ArduinoData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const connect = useCallback(() => {
    const { url } = getWebSocketConfig();
    const ws = new WebSocket(url);

    ws.onopen = () => {
      console.log('✅ WebSocket Connected');
      setIsConnected(true);
      setError(null);
    };

    ws.onmessage = (event) => {
      try {
        // Handle both JSON and string formats
        let parsedData: any;
        
        try {
          parsedData = JSON.parse(event.data);
        } catch {
          // If not JSON, try parsing the Arduino string format
          const arduinoData = event.data.toString();
          const matches = arduinoData.match(/Sensor (\d+) triggered, Total Score: (\d+)/);
          
          if (matches) {
            parsedData = {
              sensorId: parseInt(matches[1]),
              weight: 1, // Trigger event
              totalScore: parseInt(matches[2]),
            };
          } else {
            throw new Error('Invalid data format');
          }
        }

        setData({
          ...parsedData,
          timestamp: new Date().toISOString()
        });
      } catch (err) {
        console.error('Failed to parse WebSocket data:', err);
        setError('Invalid data received');
      }
    };

    ws.onerror = (event) => {
      console.error('WebSocket error:', event);
      setError('Connection error');
      setIsConnected(false);
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
      // Attempt to reconnect after 5 seconds
      setTimeout(connect, 5000);
    };

    return () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    const cleanup = connect();
    return cleanup;
  }, [connect]);

  return {
    data,
    error,
    isConnected
  };
}; 