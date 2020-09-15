'use strict'
const merge = require('webpack-merge');
const devEnv = require('./dev.js');

module.exports = merge(devEnv, {
    NODE_ENV: '"testing"'
});