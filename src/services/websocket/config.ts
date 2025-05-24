import { useState, useEffect } from 'react';

export const WS_CONFIG = {
  RECONNECT_INTERVAL: 5000,
  MAX_RETRIES: 3,
  ENDPOINTS: {
    ARDUINO: 'ws://localhost:4000',
  }
};

export class WebSocketService {
  private ws: WebSocket | null = null;
  private retries = 0;
  private url: string;

  constructor(url: string) {
    this.url = url;   
  }

  connect() {
    try {
      this.ws = new WebSocket(this.url);
      this.setupEventHandlers();
    } catch (error) {
      console.error('WebSocket connection error:', error);
      this.handleReconnection();
    }
  }

  private setupEventHandlers() {
    if (!this.ws) return;

    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.retries = 0;
    };

    this.ws.onclose = () => {
      console.log('WebSocket closed');
      this.handleReconnection();
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  private handleReconnection() {
    if (this.retries < WS_CONFIG.MAX_RETRIES) {
      setTimeout(() => {
        this.retries++;
        console.log(`Reconnecting... Attempt ${this.retries}`);
        this.connect();
      }, WS_CONFIG.RECONNECT_INTERVAL);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  send(data: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  close() {
    this.ws?.close();
  }
}

export const useWebSocket = (url: string) => {
  const [data, setData] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const ws = new WebSocketService(url);
    
    ws.connect();

    return () => {
      ws.close();
    };
  }, [url]);

  return { data, isConnected, error };
}; 