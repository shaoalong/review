var src = 'src/';
var dist = 'dist/';
module.exports = {
    src: {
        html: src,
        js: src + 'js/',
        css: src + 'style/',
        images: src + 'images/'
    },
    dist: {
        html: dist,
        js: dist + 'js/',
        css: dist + 'style/',
        images: dist + 'images/'
    },
    config: {
        dev: {
            platformUrl: 'http://pre.w1x.com' // 开发环境，平台url
        },
        prod: {
            platformUrl: 'http://www.w1x.com' // d生产环境，平台url
        }
    },
};