const http = require('http');
const express = require('express');
const url = require('url');
const formidable = require('formidable');
const path = require('path');
const mysql = require('mysql');

const linsen = 3300;
const app = express();

var router = express.Router();

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'wang',
    port: '3306'
});
connection.connect((err) => {
    if (err) {
        console.error('连接失败: ' + err.stack);
    } else {
        console.log('连接成功 id ' + connection.threadId);
    }
});

app.listen(linsen);
const tableName = "table01";

app.use('/api',
    router.get('/form', (req, res) => {
        var data = url.parse(req.url, true).query;
        var form = new formidable.IncomingForm(req.url);
        form.parse(req, function (err, files) {
            if (err) {
                res.send({
                    code: 400,
                    data: '',
                    reason: err
                })
            } else {
                let sql = "select * from " + tableName +
                    ((data.name || data.status || data.tel) ? " where " : "") +
                    "value like '%'" +
                    ((data.name) ? (" and name like '%" + data.name + "%'") : ("")) +
                    ((data.status) ? (" and status=" + data.status) : ("")) +
                    ((data.tel) ? (" and tel like '%" + data.tel + "%'") : (""));
                connection.query(
                    sql,((err, result) => {
                        if (err) {
                            res.send({
                                code: 400,
                                data: '',
                                sql: sql,
                                reason: err
                            })
                        } else {
                            res.send({
                                code: 200,
                                sql: sql,
                                data: result
                            })
                        }
                    })
                )
            }
        })
    }),
    router.post('/form', (req, res) => {
        var form = new formidable.IncomingForm(req.url);
        form.parse(req, function (err, data, files) {
            let sql = "INSERT INTO " + tableName +
                "(name,status,creatDate,upDateTime,tel,value)" +
                "VALUES" +
                "(" +
                "'" + data.name + "'" + "," +
                data.status + "," +
                "NOW()" + "," +
                "NOW()" + "," +
                data.tel + "," +
                "'" + data.value + "'" +
                ")"
            if (err) {
                res.send({
                    code: 400,
                    data: '',
                    reason: err
                })
            } else {
                connection.query(
                    sql, ((err, result) => {
                        if (err) {
                            res.send({
                                code: 400,
                                data: '',
                                sql: sql,
                                reason: err
                            })
                        } else {
                            res.send({
                                code: 200,
                                sql: sql,
                                data: result,
                            })
                        }
                    })
                )
            }
        })
    }),
    router.put('/form', (req, res) => {
        var form = new formidable.IncomingForm(req.url);
        form.parse(req, function (err, data, files) {
            let sql = "UPDATE " + tableName + " SET " +
                "name=" + "'" + data.name + "'" + "," +
                "status=" + data.status + "," +
                "upDateTime=NOW()" + "," +
                "tel=" + data.tel + "," +
                "value=" + "'" + data.value + "'" +
                " WHERE id=" + data.id;
            if (err) {
                res.send({
                    code: 400,
                    data: '',
                    reason: err
                })
            } else {
                connection.query(
                    sql, ((err, result) => {
                        if (err) {
                            res.send({
                                code: 400,
                                data: '',
                                sql: sql,
                                reason: err
                            })
                        } else {
                            res.send({
                                code: 200,
                                sql: sql,
                                data: result
                            })
                        }
                    })
                )
            }
        })
    }),
    router.delete('/form', (req, res) => {
        var data = url.parse(req.url, true).query;
        let sql = "DELETE FROM " + tableName + " WHERE id=" + data.id;
        connection.query(
            sql, ((err, result) => {
                if (err) {
                    res.send({
                        code: 400,
                        sql: sql,
                        data: '',
                        reason: err
                    })
                } else {
                    res.send({
                        code: 200,
                        sql: sql,
                        data: result
                    })
                }
            })
        )
    })
)

//静态页面的入口文件夹
app.use(express.static(path.join(__dirname, 'dist')));

// app.post('/api/login', function (req, res) {
//     var form = new formidable.IncomingForm(req.url);
//     form.parse(req, function (err, fields, files) {
//         if (err) {
//             res.send({
//                 code: 400,
//                 data: '',
//                 reason:err
//             })
//         } else {
//             res.send({
//                 code: 200,
//                 data: fields
//             })
//         }
//     })
// })
//把路由交给angular管理
app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname + '/dist/index.html'));
})

// http.createServer(function (request, response) {
//     // // 发送 HTTP 头部 
//     // // HTTP 状态值: 200 : OK
//     // // 内容类型: text/plain
//     // response.writeHead(200, { 'Content-Type': 'text/plain' });
//     // response.end('Hello World\n');
//     response.sendFile(path.join(__dirname + '/dist/index.html'));
// }).listen(linsen);
console.log('服务器开启正常,打开' + linsen + '查看')
console.log(__dirname);//此文件所在的目录