'use strict'
const utils = require('./utils');
const config = require('../config');
const baseWebpackConfig = require('./webpack.base.conf');
const merge = require('webpack-merge');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');

if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = config.build.NODE_ENV;
}

const webpackConfig = merge(baseWebpackConfig, {
    mode: 'production',
    module: {
        rules: utils.styleLoaders({
            sourceMap: config.build.cssSourceMap,
            extract: config.build.extract,
            usePostCss: config.build.usePostCss
        })
    },
    devtool: config.build.productionSourceMap ? config.build.devtool : false,
    optimization: {
        splitChunks: {
            chunks: 'async',
            minSize: 30000,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            name: true,
            cacheGroups: {
                vendor: {
                    name: 'vendor',
                    test: /node_modules\/(.*)\.js/,
                    chunks: 'initial',
                    priority: -10,
                    reuseExistingChunk: false
                },
                styles: {
                    name: 'styles',
                    test: /\.(less|scss|css)$/,
                    chunks: 'all',
                    minChunks: 1,
                    reuseExistingChunk: true,
                    enforce: true
                },
                apicommon: {
                    name: 'apicommon',
                    test: (module) => {
                        const path = module.resource && module.resource.split('\\').join('/')
                        return path && path.includes('src/api/index.js')
                    },
                    chunks: 'all',
                    reuseExistingChunk: true,
                    minChunks: 1,
                    enforce: true
                }
            }
        },
        runtimeChunk: {
            name: 'manifest'
        },
        minimizer: [
            new UglifyJsPlugin({
                uglifyOptions: {
                    compress: {
                        warning: false
                    }
                },
                sourceMap: config.build.productionSourceMap,
                parallel: true
            })
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: config.base.dist.css + '[name].[contenthash:6].css',
            allChunks: true
        }),
        new OptimizeCSSPlugin({
            cssProcessorOptions: config.build.productionSourceMap ? {
                safe: true,
                map: {
                inline: false
                }
            } : {
                safe: true
            }
        }),
        // keep module.id stable when vendor modules does not change
        new webpack.HashedModuleIdsPlugin(), // 
        // enable scope hoisting
        new webpack.optimize.ModuleConcatenationPlugin()
    ]
})

if (config.build.productionGzip) {
    const CompressionWebpackPlugin = require('compression-webpack-plugin');
    webpackConfig.plugins.push(
        new CompressionWebpackPlugin({
            filename: '[path].gz[query]',
            test: new RegExp('\\.(' + config.build.productionGzipExtensions.join('|') + ')$'),
            algorithm: 'gzip',
            threshold: 10240,
            minRatio: 0.8
        })
    )
}

if (config.build.bundleAnalyzerReport) {
    const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
    webpackConfig.plugins.push(new BundleAnalyzerPlugin());
}

module.exports = webpackConfig;