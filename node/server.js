var fs = require("fs");
var http = require('http');
var express = require('express');
// 引入 events 模块
var events = require('events');
// 创建 eventEmitter 对象
var eventEmitter = new events.EventEmitter();
eventEmitter.on('eventName', eventHandler);
eventEmitter.emit('eventName');




var data = fs.readFileSync('input.txt');
console.log('同步执行');
console.log(data.toString());


fs.readFile('input.txt', function (err, data) {
    if (err) return console.error(err);
    console.log(data.toString());
});
console.log('异步执行');



http.createServer(function (request, response) {
    response.writeHead(
        200,
        { 'Content-Type': 'text/plain' }
    );
    response.end('Hello World\n123');
}).listen(8888);
