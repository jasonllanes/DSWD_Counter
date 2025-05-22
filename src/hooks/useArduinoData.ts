import { useState, useEffect, useCallback } from 'react';
import { getWebSocketConfig, isFeatureEnabled } from '@/config/env';

interface ArduinoData {
  weight: number;
  timestamp: string;
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
        const parsedData = JSON.parse(event.data);
        setData({
          weight: parsedData.weight,
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
    // Only connect to real Arduino if mock data is disabled
    if (!isFeatureEnabled('mockData')) {
      const cleanup = connect();
      return cleanup;
    }
    
    // Mock data simulation when enabled
    if (isFeatureEnabled('mockData')) {
      const interval = setInterval(() => {
        setData({
          weight: Math.random() * 100,
          timestamp: new Date().toISOString()
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [connect]);

  return {
    data,
    error,
    isConnected
  };
}; 