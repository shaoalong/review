module.exports = function(NODE_ENV, gulp, config, $, browserSync, argv, runSequence, changeStream, postCssPlugins) {
    gulp.task('server', function() {
        browserSync.init({
            server: config.dist.html,
            open: true,
            directory: true,
            port: 3030
        });
    })
}