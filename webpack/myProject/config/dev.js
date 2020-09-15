'use strict'
var projectWebpackConfig = require('../webpack.config.js');
module.exports = {
    NODE_ENV: 'development',
    DEV_PORT: '8882',
    AUTO_OPEN_BROWSER: true,
    filename: projectWebpackConfig.dist.js + '[name].js',
    chunkFilename: projectWebpackConfig.dist.js + '[id].js',
    htmlFileName: projectWebpackConfig.dist.index,
    cssSourceMap: true,
    assetsSubDirectory: 'static',
    proxyMap: projectWebpackConfig.proxyMap
}
