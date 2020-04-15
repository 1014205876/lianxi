var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/index01', function (req, res) {
    console.log('get')
    res.sendfile('index01.html');
});
app.get('/index02', function (req, res) {
    console.log('get')
    res.sendfile('index02.html');
});

io.on('connection', function (socket) {
    console.log('a user connected');

    //监听客户端的消息
    socket.on('message', function (data) {

        // data.roomArr.array.forEach(item => {
        //     io.sockets.in(item.room).emit('message', item.name + '发给' + item.room + '内的用户');
        // });

        // io.sockets.emit("message", '给所有用户');
        io.sockets.in(data.room).emit('message', data.name + '发给' + data.room + '内的用户');
    });

    socket.on('join', function (data) {
        //用户加入房间
        socket.join(data.room);
        //对房间内的用户发送消息
        io.sockets.in(data.room).emit('alert', data.name + '加入了房间' + data.room);//包括自己
        //socket.broadcast.to(roomid).emit('event_name', data);//不包括自己
    });

    socket.on('leave', function (data) {
        //用户离开房间
        socket.leave(data.room);
        //向此用户发送信息
        io.sockets.in(data.room).emit('alert', data.name + '退出了房间' + data.room);//包括自己
    });


});

http.listen(3000, function () {
    console.log('listening on *:3000');
});