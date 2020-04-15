
let port = 9000,
    host = 'localhost';

const ws = new WebSocket('ws://' + host + ':' + port);

ws.onopen = (res) => {
    console.log('onOpen');
    ws.send('开始连接：', res);
}

ws.onmessage = (res) => {
    console.log('收到消息：', res.data);
}

ws.onclose = (res) => {
    console.log('关闭：', res);
}

ws.onerror = (err) => {
    console.log('报错：', err)
}