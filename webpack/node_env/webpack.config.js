const path = require('path');
// const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = {
    entry: path.join(__dirname, 'src/app.js'),
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'boundle.js',
    },
    plugins: [
        new HtmlWebpackPlugin(),
        // new webpack.DefinePlugin({
        //     'process.env.NODE_ENV': JSON.stringify('hehe'),
        // }),
    ],
}
module.exports = config;
console.log('progress.env的值是（webpack.config.js）:' + process.env);
console.log('progress.env.NODE_ENV的值是（webpack.config.js）:' + process.env.NODE_ENV);
