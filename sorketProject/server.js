const net = require('net');

const chatServer = net.createServer();

let port = 9000,
    li = 0,
    clientMap = new Object();

//开启连接
chatServer.on('connection', ((client) => {

    client.name = ++li;
    clientMap[client.name] = client;
    console.log('有人连接：' + client.name);

    client.on('timeout', (() => {
        console.log('连接超时');
        client.end();
    }))

    client.on('data', ((res) => {
        console.log('客户端传来' + client.name + ':' + res);
        broadcast(res, client);
    }))

    client.on('error', ((err) => {
        console.log('失败：' + err);
        client.end();
    }))

    client.on('close', ((res) => {
        delete clientMap[client.name];
        console.log(client.name + '关机了');
        broadcast(client.name, client);
    }))
}))
function broadcast(message, client) {
    for (let key in clientMap) {
        clientMap[key].write(client.name + '说：' + message);
    }
}
chatServer.listen(port);
console.log(port + '开启s')