'use strict'
var projectWebpackConfig = require('../webpack.config.js');
module.exports = {
    NODE_ENV: 'production',
    filename: projectWebpackConfig.dist.js + '[name].[chunkhash:6].js',
    chunkFilename: projectWebpackConfig.dist.js + '[id].[chunkhash:6].js',
    htmlFileName: projectWebpackConfig.dist.index,
    bundleAnalyzer: false,
    csssourceMap: false,
}
