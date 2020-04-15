const WebSocket = require('ws');
let port = 3300;
const wss = new WebSocket.Server({ port: port });

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        ws.send(message);
    });
    ws.send('something');
});