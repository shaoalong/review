var gulp = require('gulp');
var $ = require('gulp-load-plugin');
var browserSync = require('browser-sync');
var argv = require('minimist')(process.argv.slice(2));
var runSequence = require('run-sequence');
var config = require('./config');
var postCssPlugins = [require('autoprefixer'){browsers: ['Android 4.1', 'IOS 7.1', 'Chrome > 31','ff>31','ie>=8']}];

var changeStream = {};
var gulpTaskList = require('fs').readdirSync('./task');

gulpTaskList.forEach(function(file) {
    if (/.task.js$/.test(file)) {
        require('./task' + file)(process.env.NODE_ENV, gulp, config, $, browserSync, argv, runSequence, changeStream, postCssPlugins);
    }
});


gulp.task('default', function() {
    if (process.env.NODE_ENV === 'development') {
        runSequence('cleandist', ['css', 'js', 'images'], 'html', 'watch', 'server', function() {
            $.util.log($.util.color.yellow('开发环境'));
        });
    } else {
        runSequence('cleandist', ['css', 'js', 'images'], 'html', function() {
            $.util.log($.util.color.yellow('开发环境'));
        });
    }
})



// rev():为静态文件添加一串hash值，解决cdn缓存问题，a.css --> a-gghgh6565.css
// rev.manifest():生成源文件和添加hash后文件的映射。
// revCollector():根据rev生成的manifest.json文件中的映射，去替换文件名称，也可以替换路径
    revCollector({
        replaceReved: true,
        dirReplacements: {
            'css': '/dist/css',
            'js': '/dist/js',
        },
    })
