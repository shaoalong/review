'use strict'
const webpack = require('webpack');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');

// 增加热部署文件变更后浏览器刷新功能
baseWebpackConfig.entry.foreach(e => {
    e = [...e, './build/dev-client']
});

var compiler = merge(baseWebpackConfig, {
    devtool: '#cheap-module-eval-source-map',
    devServer: {
        index: ''
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(), // 
        new webpack.NoEmitOnErrorsPlugin(),
        new FriendlyErrorsPlugin()
    ]
})

module.exports = compiler;