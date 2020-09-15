'use strict'
var fs = require('fs');
var Mock = require('mockjs');
require('./check-versions.js')();
var utils = require('./utils.js');
var path = require('path')
var config = require('../config');
require('babel-register')({
  presets: ["env", "stage-2"],
  cache: false,
  babelrc: false
});
if(!process.env.NODE_ENV) {
  process.env.NODE_ENV = config.dev.NODE_ENV;
}
var webpack = require('webpack');
var compileInfo = require('./webpack.dev.config.js');
var compiler = webpack(compileInfo);
var chalk = require('chalk');
// 当html-webpack-plugin中的模版文件出现变更后，强制调试页面刷新
compiler.plugin('compilation', function(compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function(data, callback) {
    console.log('> html模板刷新中...');
    if(!hotMiddleware) {
      console.log(chalk.yellow('没有启用webpack的热加载'));
      return;
    }
    hotMiddleware.publish({action: 'reload'});
    callback();
  });
});

var webpackDevMiddleware = require('webpack-dev-middleware');
var devMiddleware = webpackDevMiddleware(compiler, {
  publicPath: '/',
  quiet: true
});

var webpackHotMiddleware = require('webpack-hot-middleware');
var hotMiddleware = webpackHotMiddleware(compiler, {
  reload: true
});

var express = require('express');
var app = express();
var clearMockCache = function() {
  const NOT_FOUND = -1;
  var cache = require.cache;
  for(var key in cache) {
    if(key.indexOf('mock') !== NOT_FOUND) {
      delete cache[key];
    }
  }
};
// MOCK数据
if (process.env.MOCK && process.env.PROJECT_ENV === 'pc')
  app.all('/api/*', function(req, res) {
    var filename = utils.resolve('mock/index.js');
    var mock = require(filename).default;
    var path = req.path;
    var response = mock[path];
    // console.log(path+ '的mock数据:' + JSON.stringify(response));
    res.send(response);
    clearMockCache();
  });
  //  h5 mock api
  if (process.env.MOCK && process.env.PROJECT_ENV === 'h5') {
    app.all('/hrx/api/*', function (req, res) {
      var filename = utils.resolve('mock/index.js');
      var mock = require(filename).default;
      var path = req.path;
      var response = mock[path];
      // console.log(path+ '的mock数据:' + JSON.stringify(response));
      res.send(response);
      clearMockCache();
    });
  }

// 代理设置
var proxyMap = config.dev.proxyMap || {};
var proxyMiddleware = require('http-proxy-middleware');
Object.keys(proxyMap).forEach(function(key) {
  var options = proxyMap[key];
  if(typeof options === 'string')
    options = {target: options};
  app.use(proxyMiddleware(options.filter || key, options));
});

// 让中间件支持h5 history模式的路由
var connectHistoryApiFallback = require('connect-history-api-fallback');
app.use(connectHistoryApiFallback(
  {
    index: '/html/index.html',
  }
));

// express绑定监听webpack打包输出后的资源目录
app.use(devMiddleware);

//支持热部署以及编译错误再页面展示
app.use(hotMiddleware);



var port = config.dev.DEV_PORT || process.env.PORT
var server = app.listen(port);

var uri = 'http://localhost:' + port;
var opn = require('opn');
var autoOpenBrowser = config.dev.AUTO_OPEN_BROWSER;
var ready = new Promise(function(resolve) {
  console.log('> Starting dev server...');
  devMiddleware.waitUntilValid(function() {
    console.log('> Listening at ' + uri + '\n');
    autoOpenBrowser && opn(uri);
    resolve();
  });
});
