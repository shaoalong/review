var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ejs = require('ejs');

var users = require('./routes/users');

var app = express();

//指定视图引擎为ejs
app.set('views', path.join(__dirname, 'views')); // 设定render函数的默认路径为'views', 默认是'views'
app.engine('html', ejs.__express);
app.engine('ejs', ejs.__express);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.all('*', function(req, res, next) { 
    res.header("Access-Control-Allow-Origin", "*");  
    res.header("Access-Control-Allow-Headers", "content-type");  
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");  
    res.header("X-Powered-By",' 3.2.1');
    // res.header("Content-Type", "text/html;charset=UTF-8");  
    next();  
});  

app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

// views: render函数的默认路径, 默认是'views'
// app.set('views', path.join(__dirname, 'pages')); // 设定render函数的默认路径为'pages'

// app.engine(ext, callback): 注册模板引擎的 callback 用来处理ext扩展名的文件,可以针对不同文件设置多个模板引擎
// var ejs = require('ejs')
// var jade = require('jade')
// app.engine('html', ejs.__express) 
// app.engine('ejs', ejs.__express)
// app.engine('jade', jade.__express)

// view engine: 没有指定文件模板格式时，默认使用的引擎插件
// app.set('view engine', 'html') // 没有指定文件模板格式时,使用html引擎