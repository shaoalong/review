'use strict'
var path = require('path');
var dev = require('./dev.js');
var prod = require('./prod.js');
var projectWebpackConfig = require('../webpack.config.js');
module.exports = {
    title: projectWebpackConfig.title,
    indexTpl: projectWebpackConfig.indexTpl,
    prod: prod,
    dev: dev,
    favicon: projectWebpackConfig.favicon
}