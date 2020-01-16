const path = require('path');
const webpack = require('webpack');
const webpackConfig = require('./webpack.dev.conf');
const express = require('express');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const connectHistoryApiFallback = require('connect-history-api-fallback');
const proxyMiddleware = require('http-proxy-middleware');
const chalk = require('chalk');
const opn = require('opn');
const config = require('../config');
const resolve = (_path) => path.join(__dirname, '..', _path);


if(!process.env.NODE_ENV) {
    process.env.NODE_ENV = config.dev.NODE_ENV;
}
const compiler = webpack(webpackConfig);
// 当html-webpack-plugin中的模版文件出现变更后，强制调试页面刷新
compiler.plugin('compilation', function(compilation) {
    compilation.plugin('html-webpack-plugin-after-emimt', function(data, callback) {
        if (!hotMiddleware) {
            console.log(chalk.yellow('没有启用webpack的热加载'));
            return;
        }
        hotMiddleware.publish({ action: 'reload' });
        callback();
    })
})

const app = express();
const devMiddleware = webpackDevMiddleware(compiler, { publicPath: '/', quiet: true });
const hotMiddleware = webpackHotMiddleware(compiler, { reload: true });

app.use(devMiddleware); // express绑定监听webpack打包输出后的资源目录
app.use(hotMiddleware); //支持热部署以及编译错误再页面展示
app.use(connectHistoryApiFallback({ index: '/html/index.html' })); // 让中间件支持h5 history模式的路由

// 代理设置
const { proxyMap } = config.dev
Object.keys(proxyMap).forEach((key) => {
    let options = proxyMap[key];
    if (typeof options === 'string') {
        options = { target: options }
    }
    app.use(proxyMiddleware(options.filter || key, options));
})

function clearMockCache() {
    const NOT_FOUND = -1;
    const cache = require.cache;
    for (let key in cache) {
        if (key.indexOf('mock') !== NOT_FOUND) {
            delete cache[key];
        }
    }
}

if (process.env.MOCk) {
    app.all('/api/*', function(req, res) {
        const fileName = resolve('mock/index.js');
        const mock = require(fileName).default;
        const path = req.path;
        const response = mock[path];
        res.send(response);
        clearMockCache();
    })
}

const port = config.dev.DEV_PORT || process.env.PORT;
app.listen();

const uri = 'http://localhost:' + port;
const autoOpenBrowser = config.dev.AUTO_OPEN_BROWSER;
new Promise((resolve) => {
    devMiddleware.waitUntilValid(() => {
        autoOpenBrowser && opn(uri);
        resolve();
    })
})