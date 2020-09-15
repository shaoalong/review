'use strict'
var config = require('../config');
if(!process.env.NODE_ENV) {
  process.env.NODE_ENV = config.dev.NODE_ENV;
}
var base = require('./webpack.base.config.js');
var merge = require('webpack-merge');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
// 增加热部署文件变更后浏览器刷新功能
Object.keys(base.entry).forEach(function(name) {
  base.entry[name] = ['./build/dev-client'].concat(base.entry[name]);
});

var compiler = merge(base, {
  devtool: '#cheap-module-eval-source-map',
  devServer: {
    index: '',
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(), // 模块有变更后，不用刷新页面就会自动更新浏览器端代码
    new webpack.NoEmitOnErrorsPlugin(),// 当编译报错的时候，错误信息不会输出到页面
    new HtmlWebpackPlugin({
      filename: config.dev.htmlFileName,
      template: config.indexTpl,
      inject: true,
      title: config.title,
      favicon: config.favicon
    }),
    new FriendlyErrorsPlugin()
  ]
});
module.exports = compiler;
