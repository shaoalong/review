const webpack = require('webpack');
const merge = require('webpack-merge');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const config = require('./webpack.config.js');

module.exports = merge(config, {
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production'),
        }),
        // new webpack.optimize.UglifyJsPlugin({
        //     compress:{  
        //        warnings:false
        //     }
        // })
    ],
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                uglifyOptions: {
                    compress: process.env.NODE_ENV === 'production'
                }
            })
        ]
    },
})
console.log('progress.env.NODE_ENV的值是（webpack.prod.config.js）:' + process.env.NODE_ENV);
