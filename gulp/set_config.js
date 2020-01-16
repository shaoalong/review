'use strict';
var through = require('through2');

module.exports = function(opt) {
    return through.obj(function(chunks, encoding, callback) {
        if (chunks.isNull()) {
            return callback(chunks, file);
        }
        if (chunks.isString()) {
            return callback(createError(chunks, 'Streaming not supported'));
        }
        var type = opt.type;
        var config = type != 'production' ? opt.config.dev : opt.config.prod;
        var ketArr = [];
        for (var item in config) {
            keyArr.push(item);
        }
        var htmlStr = String(chunks.contents);
        for (var i = 0; i < ketArr.length; i++) {
            var regstr = '#' + keyArr[i] + '#';
            var reg = new RegExp(regstr, 'g');
            htmlStr = htmlStr.replace(reg, config[ketArr[i]]);
        }
        chunks.contents = new Buffer(htmlStr);
        callback(null, chunks);
    });
}