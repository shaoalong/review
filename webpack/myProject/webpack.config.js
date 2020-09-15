var utils = require('./build/utils.js');
var path = require('path');

var config = {
    title: '我的项目',
    indexTpl: 'src/index.html',
    favicon: utils.resolve('static/favicon.ico'),
    entry: {
        app: ['babel-polyfill', utils.resolve('src/main.js')]
    },
    alias: {
        '~components': utils.resolve('src/components'),
        '~pages': utils.resolve('src/pages'),
        '~utils': utils.resolve('src/utils'),
        '~store': utils.resolve('src/store'),
        '~filters': utils.resolve('src/filter'),
        '~sub_pages': utils.resolve('src/sub_pages'),
        '~directives': utils.resolve('src/directives'),
        '~consts': utils.resolve('src/consts'),
        '~http': utils.resolve('src/http'),
        '~plugins': utils.resolve('src/plugins')
    },
    dist: {
        js: 'js/',
        index: 'html/index.html',
        css: 'css/',
        font: 'font/',
        img: 'images/',
        mapData: 'data/map/',
        root: utils.resolve('dist')
    },
    proxyMap: {
        '/api': 'http://localhost:9999', // 测试服务器
    }
}
module.exports = config;
