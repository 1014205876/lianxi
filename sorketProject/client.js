const net = require('net'),
    readline = require('readline');

let port = 9000,
    host = 'localhost';

const client = new net.Socket(),
    rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

client.setEncoding('UTF-8');

client.connect(port, host, (() => {
    client.write('你好');
}))
client.on('data', ((res) => {
    console.log('服务端传来：' + res);
    say();
}))
client.on('err', ((err) => {
    console.log('出错：' + err);
    client.destroy();
}))

client.on('close', ((res) => {
    console.log(res + '关闭');
}))

function say() {
    rl.question('请输入：', (inputStr) => {
        if (inputStr != 'bye') {
            client.write(inputStr);
            say();
        } else {
            rl.close();
        }
    })
}