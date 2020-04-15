const ws = require('ws');

let port = 9000;

const webSocket = ws.Server,
    wss = new webSocket({ port: port });

    wss.on('connection',(res)=>{
        console.log(res+'上线');
        res.on('message',((message)=>{
            console.log('消息：'+message);
            res.send(message);
        }))
        res.on('close',(()=>{
            // globl.gc();//内存回收 node --expose-gc ws.js
            console.log('leave');
        }))
    })