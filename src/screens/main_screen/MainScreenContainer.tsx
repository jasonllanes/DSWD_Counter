import React, { useEffect, useState } from 'react';

const MainScreenContainer = () => {
    const [score, setScore] = useState(0);
    const [connectionStatus, setConnectionStatus] = useState('Connecting...');

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:4000');

        // Connection event handlers
        ws.onopen = () => {
            setConnectionStatus('Connected');
            console.log('Connected to WebSocket server');
        };

        ws.onclose = () => {
            setConnectionStatus('Disconnected');
            console.log('Disconnected from WebSocket server');
        };

        ws.onerror = (error) => {
            setConnectionStatus('Error');
            console.error('WebSocket error:', error);
        };

        ws.onmessage = (event) => {
            const text = event.data;
            console.log('Received:', text);
            console.log(text);
            setScore(0); // Reset score to 0 before processing the new message
            // Check if the message starts with "count:" or try to parse directly
            if (text.includes("Total Score:")) {
                // Extract the number after "Total Score:"
                const scoreMatch = text.match(/Total Score:\s*(\d+)/);
                if (scoreMatch && scoreMatch[1]) {
                    const count = parseInt(scoreMatch[1]);
                    console.log('Extracted score:', count);
                    setScore(count);
                }
            }
            // Keep existing parsing methods as fallbacks
            else if (text.startsWith('count:')) {
                const count = parseInt(text.split(':')[1]);
                setScore(count);
            } else {
                // Try to parse the raw count if it's just a number
                const count = parseInt(text);
                if (!isNaN(count)) {
                    setScore(count);
                }
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
        <div>
            <h1>Sensor Counter</h1>
            <h2>Current Count: {score}</h2>
            <p>Status: {connectionStatus}</p>
        </div>
    );
}

export default MainScreenContainer;