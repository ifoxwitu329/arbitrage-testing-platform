const express = require('express');
const WebSocket = require('ws');

const app = express();
const PORT = process.env.PORT || 3000;

// Set up WebSocket server
const wss = new WebSocket.Server({ noServer: true });

// Handle WebSocket connections
wss.on('connection', (ws) => {
    console.log('New client connected');
    ws.on('message', (message) => {
        console.log(`Received: ${message}`);
    });

    // Send a message to the client every 5 seconds
    const sendData = setInterval(() => {
        ws.send(JSON.stringify({ data: 'Some blockchain data' }));
    }, 5000);

    ws.on('close', () => {
        clearInterval(sendData);
        console.log('Client disconnected');
    });
});

// Set up HTTP server to handle WebSocket upgrades
const server = app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
    });
});

// Placeholder for blockchain data fetching 
// You can add more logic here to fetch data from the blockchain
app.get('/', (req, res) => {
    res.send('Hello World!');
});
