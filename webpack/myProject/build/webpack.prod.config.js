'use strict'
var utils = require('./utils');
var config = require('../config');
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = config.prod.NODE_ENV
}
var base = require('./webpack.base.config.js');
var merge = require('webpack-merge');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var UglifyJsPlugin = require('uglifyjs-webpack-plugin');
var compiler = merge(base, {
  devtool: '#source-map',
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor:{//node_modules内的依赖库
            chunks:"all",
            test: /[\\/]node_modules[\\/]/,
            name:"vendor",
            minChunks: 1, //被不同entry引用次数(import),1次的话没必要提取
            maxInitialRequests: 5,
            minSize: 0,
            priority:100,
            // enforce: true?
        },
        common: {// ‘src/js’ 下的js文件
            chunks:"all",
            test:/[\\/]src[\\/]js[\\/]/,//也可以值文件/[\\/]src[\\/]js[\\/].*\.js/,
            name: "common", //生成文件名，依据output规则
            minChunks: 2,
            maxInitialRequests: 5,
            minSize: 0,
            priority:1
        },
        runtimeChunk: {
          name: 'manifest'
        }
      }
    },
    minimizer: [
      new UglifyJsPlugin({
        sourceMap: true,
        uglifyOptions: {
            compress: process.env.NODE_ENV === 'production'
        }
      })
    ],
  },
  plugins: [
    // new webpack.optimize.SplitChunksPlugin({
    //   name: 'vendor',
    //   minChunks: function(module, count) {
    //     var resPath = utils.resolve('node_modules');
    //     console.log('++++++++++++++++++');
    //     return (module.resource && /\.js$/.test(module.resource) && module.resource.indexOf(resPath));
    //   }
    // }),
    // new webpack.optimize.SplitChunksPlugin({
    //   names: ['app', 'vendor'],
    //   async: true,
    //   children: true
    // }),
    // new webpack.optimize.SplitChunksPlugin({
    //   names: ['manifest'],
    // }),
    // new UglifyJsPlugin({
    //   sourceMap: true,
    //   uglifyOptions: {
    //     compress: true
    //   }
    // }),
    new HtmlWebpackPlugin({
      filename: config.prod.htmlFileName,
      template: config.indexTpl,
      inject: true,
      title: config.title,
      favicon: config.favicon
    })
  ],
});

module.exports = compiler;
