const express = require('express'),
    WebSocket = require('ws'),
    url = require('url'),
    proxy = require('http-proxy-middleware'),
    multer = require('multer'),
    session = require('express-session'),
    formidable = require('formidable'),
    path = require('path'),
    cookieParser = require('cookie-parser'),
    compression = require('compression'),
    jwt = require('jsonwebtoken'); // 使用jwt签名

let userArr = require('./json/user.json'),
    fileUtils = require('./fileUtils'),
    port = 3300;

const MemoryStore = require('session-memory-store')(session),
    app = express(),
    router = express.Router(),
    server = app.listen(port),
    wss = new WebSocket.Server({ port: port + 1 });

app.use(compression());
app.use(cookieParser());

var proxyConfig = proxy({//node代理转接
    target: 'http://jsonplaceholder.typicode.com',
    changeOrigin: true, // for vhosted sites, changes host header to match to target's host
    logLevel: 'debug',
    pathRewrite: {
        '^/api': '' // remove base path
    },
    onProxyReq: function onProxyReq(proxyReq, req, res) {
        // proxyReq.setHeader('AUTH_ID', '3316dc67-2517-46f5-958d-1cd46d4eab58');//217获客平台
        // proxyReq.setHeader('AUTH_USER', encodeURI('admin'));
    }
});
app.use('/api', proxyConfig);
let Temp;
let AllUserData = [];
wss.on('connection', (ws, req) => {
    ws.send(JSON.stringify({ msg: '连接开始'}));
    ws.on('message', (message) => {
        console.log(req.connection.remoteAddress)
        ws.send(JSON.stringify(req.connection.remoteAddress));
        // Temp = JSON.parse(message);
        // AllUserData.push({
        //     'id': Temp.ID,
        //     'ws': ws
        // });
        // console.log(49, AllUserData);
    });
});

app.use('/node',
    router.get('/cookie', (req, res) => {//查询浏览器记住的登录信息
        //禁止该接口返回304缓存
        // res.header('expires', '0');
        // res.header('cache-control', 'no-store');
        // res.header('pragma', 'no-cache');
        //调取接口判断当前用户是否登录
        let token = req.cookies.token
        if (token) {
            res.json({
                "code": "200",
                "reason": "node端自定义接口",
                "data": {
                    userName: jwt.decode(token).name
                }
            });
        } else {
            res.json({
                "code": "400",
                "reason": "node端自定义接口",
                "data": {}
            });
        }
    }),
    router.post('/loginOut', (req, res) => {//忘记登录状态
        //用户退出登录删除token
        res.clearCookie('token')
        res.json({
            "code": "200",
            "reason": "退出成功",
            "data": {}
        });
    }),
    router.post('/login', (req, res) => {//登录
        var form = new formidable.IncomingForm(req.url);
        form.parse(req, function (err, data, files) {
            if (err) {
                res.send({
                    code: 400,
                    data: '',
                    reason: err
                })
            } else {
                let has = true;
                userArr.forEach((item) => {
                    if (item.userName == data.userName) {
                        has = false;
                        if (item.password == data.password) {
                            var token = jwt.sign({ name: item.userName }, 'wangzheng', {
                                expiresIn: 60 * 60 * 24 * 30// 授权时效24小时
                            });
                            res.cookie('token', token, { maxAge: 60 * 60 * 24 * 1000 * 30 });// 授权时效24小时
                            res.send({
                                code: 200,
                                data: item,
                            });
                        } else {
                            res.send({
                                code: 404,
                                data: '',
                                reason: '密码错误'
                            })
                        }
                    }
                });
                if (has) {
                    res.send({
                        code: 404,
                        data: '',
                        reason: '查无此人'
                    })
                }
            }
        })
    }),
    router.post('/register', (req, res) => {//注册接口
        var form = new formidable.IncomingForm(req.url);
        form.parse(req, function (err, data, files) {
            if (err) {
                res.send({
                    code: 400,
                    data: '',
                    reason: err
                })
            } else {
                if (data.password == '111') {
                    userArr.push(data);
                    res.send({
                        code: 200,
                        data: userArr[userArr.length - 1],
                    })
                } else {
                    res.send({
                        code: 400,
                        data: '',
                        reason: '密码错误'
                    })
                }
            }
        })
    }),
    router.get('/user', (req, res) => {//查询当前登录的用户
        var data = url.parse(req.url, true).query;
        userArr.forEach((item) => {
            if (data.userName == item.userName) {
                res.send({
                    code: 200,
                    data: item,
                })
            }
        })
    }),
    router.post('/user', (req, res) => {//修改用户信息
        var form = new formidable.IncomingForm(req.url);
        form.parse(req, function (err, data, files) {
            userArr[0] = data;
            if (err) {
                res.send({
                    code: 400,
                    data: '',
                    reason: err
                })
            } else {
                res.send({
                    code: 200,
                    data: userArr,
                })
            }
        })
    }),
    router.get('/users', (req, res) => {//查询所有已经注册的用户
        var data = url.parse(req.url, true).query;
        if (data.password == '111') {
            res.send({
                code: 200,
                data: userArr,
            })
        } else {
            res.send({
                code: 404,
                data: '',
                reason: '密码错误'
            })
        }
    })
)

let uploadSingle = multer({ dest: 'upload/' });
app.post('/upload', uploadSingle.single('file'), function (req, res) {
    // 文件信息
    if (!req.file) {
        res.send(req.error);
        return;
    }
    var file = req.file;
    // 腾讯云
    // fileUtils.putObject(file.path, file.originalname, file.size, function (err, result) {
    //     if (err) {
    //         res.send(500, 'upload fail!');
    //     }
    //     else {


    //         res.send({
    //             code: 200,
    //             location: 'http://' + result.Location,
    //             name: file.originalname,
    //             data: result
    //         });

    //         // res.send({ location: 'http://' + result.Location, name: file.originalname });
    //     }
    // });
    // 阿里云
    fileUtils(file.originalname, file.path, function (code, result) {
        if (code == 200) {
            res.send({
                code: 200,
                location: result.url,
                name: result.name,
                data: result
            });
        } else {
            res.send({
                code: 500,
                reason: result
            });
        }
    });
});

//静态页面的入口文件夹
app.use(express.static(path.join(__dirname, 'dist')));

//把路由交给angular管理
app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname + '/dist/index.html'));
})