module.exports = function(NODE_ENV, gulp, config, $, browserSync, argv, runSequence, changeStream, postCssPlugins) {
    gulp.task('watch', function() {
        var watchJson = [
            {
                paths: config.src.html + '*',
                task: 'html',
            },
            {
                paths: [config.src.css + '**/".css', config.src.less + '**/*.less'],
                task: 'css',
            },
            {
                paths: config.src.js + '**/*.js',
                task: 'js',
            },
            {
                paths: config.src.images + '**/*',
                task: 'images'
            }
        ];

        watchJson.forEach(function(item) {
            gulp.watch(item.paths, function(stream) {
                changeStream.type = stream.type;
                changeStream.path = stream.path;
                runSequence(item.task);
            });
        });
    });
}