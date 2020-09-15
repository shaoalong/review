'use strict'
var path = require('path');
var utils = require('./utils.js');
var webpack = require('webpack');
var config = require('../config');
var MiniCssExtractPlugin = require('mini-css-extract-plugin');
var EslintFriendlyFormatter = require('eslint-friendly-formatter');
var StyleLintPlugin = require('stylelint-webpack-plugin');
var StyleLintConf = require('../stylelint.config.js');
var projectWebpackConfig = require('../webpack.config.js');
var cleanWebpackPlugin = require('clean-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var { VueLoaderPlugin } = require('vue-loader')

var webpackConfig = {
  entry: projectWebpackConfig.entry,
  output: {
      path: projectWebpackConfig.dist.root,
      publicPath: '/',
      filename: process.env.NODE_ENV === config.prod.NODE_ENV ? config.prod.filename : config.dev.filename,
      chunkFilename: process.env.NODE_ENV === config.prod.NODE_ENV ? config.prod.chunkFilename : config.dev.chunkFilename,
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
            extractCss: true,
            loaders: {
                css: {
                  use: [
                        MiniCssExtractPlugin.loader,
                        {
                            loader: 'css-loader',
                            options: {
                                minimize:process.env.NODE_ENV === config.prod.NODE_ENV,
                                sourceMap: process.env.NODE_ENV === config.prod.NODE_ENV ? config.prod.cssSourceMap : config.dev.cssSourceMap
                            }
                        }
                      ],
                },
                postcss: {
                    use: [
                        MiniCssExtractPlugin.loader,
                        {
                            loader: 'css-loader',
                            options: {
                                minimize:process.env.NODE_ENV === config.prod.NODE_ENV,
                                sourceMap: process.env.NODE_ENV === config.prod.NODE_ENV ? config.prod.cssSourceMap : config.dev.cssSourceMap
                            }
                        },
                        {
                            loader: 'less-loader',
                            options: {
                                javascriptEnabled: true,
                                minimize:process.env.NODE_ENV === config.prod.NODE_ENV,
                                sourceMap: process.env.NODE_ENV === config.prod.NODE_ENV ? config.prod.cssSourceMap : config.dev.cssSourceMap
                            }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                minimize:process.env.NODE_ENV === config.prod.NODE_ENV,
                                sourceMap: process.env.NODE_ENV === config.prod.NODE_ENV ? config.prod.cssSourceMap : config.dev.cssSourceMap,
                            }
                        }
                    ],
                    fallback: 'vue-style-loader'
                },
                less: {
                    use: [
                        MiniCssExtractPlugin.loader,
                        {
                            loader: 'css-loader',
                            options: {
                                minimize:process.env.NODE_ENV === config.prod.NODE_ENV,
                                sourceMap: process.env.NODE_ENV === config.prod.NODE_ENV ? config.prod.cssSourceMap : config.dev.cssSourceMap
                            }
                        },
                        {
                            loader: 'less-loader',
                            options: {
                                javascriptEnabled: true,
                                minimize:process.env.NODE_ENV === config.prod.NODE_ENV,
                                sourceMap: process.env.NODE_ENV === config.prod.NODE_ENV ? config.prod.cssSourceMap : config.dev.cssSourceMap
                            }
                        }
                    ],
                    fallback: 'vue-style-loader'
                },
            },
        },
      },
      {
        test: /\.js/,
        loader: 'babel-loader',
        include: [utils.resolve('src')],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        loader: 'url-loader',
        options: {
          limit: 1024,
          name: projectWebpackConfig.dist.img + '[name].[ext]?[hash]',
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 1024,
          name: projectWebpackConfig.dist.font + '[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.(vue|js)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: utils.resolve('src'),
        options: {
          formatter: EslintFriendlyFormatter
        }
      }
    ].concat(utils.styleLoaders())
  },
  resolve: {
      extensions: ['.js', '.vue', '.json', '.less'],
      alias: Object.assign({
          'vue$': 'vue/dist/vue.esm.js'
      }, projectWebpackConfig.alias)
  },
  plugins: [
      new cleanWebpackPlugin(
          (function() {
              var delArr = [];
              var distConfig = projectWebpackConfig.dist;
              for (var key in distConfig) {
                  key !== 'root' && delArr.push(distConfig[key]);
              }
              return delArr;
          })(),
          {
              root: projectWebpackConfig.dist.root,
              allowExternal: true
          }
      ),
      new MiniCssExtractPlugin(projectWebpackConfig.dist.css + '[name].[contenthash:6].css'),
      new StyleLintPlugin({
          config: StyleLintConf,
          files: (function() {
              var suffixes = ['.less', '.vue', '.css'];
              var checkArr = [];
              suffixes.forEach(function(suffix) {
                  var projectPath = './src/**/*' + suffix;
                  checkArr.push(projectPath);
              });
              return checkArr;
          })(),
          syntax: 'less'
      }),
      new webpack.ProvidePlugin({
          jQuery: "jquery",
          $: "jquery"
      }),
      new CopyWebpackPlugin([
          {
              from: path.resolve(__dirname, '../static/'),
              to: projectWebpackConfig.dist.root,
              ignore: ['.*']
          },
      ]),
      new VueLoaderPlugin()
  ],
  performance: {
    hints: 'warning'
  },
}
module.exports = webpackConfig;
