
var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({ port: 3002 });

wss.on('connection', function connection(ws) {
    ws.on('open', function incoming(message) {
        console.log('服务开启1')
        ws.send('服务开启2');
    });
    ws.on('close', function incoming(message) {//网页端和服务端断开连接时由服务端触发触发
        console.log('服务关闭1')
    });
    ws.on('message', function incoming(message) {//网页端和服务端相互之间用send触发
        console.log('服务运行中')
        console.log(message)
        ws.send('服务运行2');
    });
    ws.on('error', function incoming(message) {
        console.log('服务报错1')
        ws.send('服务报错2');
    });
});

