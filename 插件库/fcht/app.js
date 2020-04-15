// 加载 express   项目的主文件
var express = require('express');
// 加载 path 用来处理路径
var path = require('path');
// 加载、处理网页小图标的模块
var favicon = require('serve-favicon');
// 处理 网络请求的日志的
var logger = require('morgan');
// 处理 cookie 的模块  记录浏览器的
var cookieParser = require('cookie-parser');
// 加载session
var session=require("express-session");
// 处理 post 请求的数据的
var bodyParser = require('body-parser');

// 加载 路由文件
var index = require('./routes/index');

// express的入口函数
var app = express();

// view engine setup
/*app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');*/

// uncomment after placing your favicon in /public ==> 设置网页小图标的
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// 使用中间件
// 使用 处理网络请求日志的模块(中间件)
app.use(logger('dev'));
// 使用处理post请求数据的中间件
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// 使用处理 cookie 的中间件
app.use(cookieParser());

// 使用处理session的中间件
app.use(session({
		name:"fcht",// 存储session_id的那个cookie的名称
								// 默认connect.sid
		secret:"fcht",//加密的字段
		cookie:{
			maxAge:800000000//cookie的失效时间
		},
		resave:false,// 每一次请求是否重新设置
		saveUninitialized:false,//每次请求是否初始化session
}))



// 使用 静态资源托管中间件
app.use(express.static(path.join(__dirname, 'public')));

// 使用 index 路由文件   所有请求地址都有
app.use('/VueHandler', index);

// catch 404 and forward to error handler==> 捕获404并转发到错误处理程序
/*app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});*/

// error handler
/*app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});*/

module.exports = app;
