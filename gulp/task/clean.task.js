module.exports = function(NODE_ENV, gulp, config, $, browserSync, argv, runSequence, changeStream, postCssPlugins) {
    gulp.task('cleandist', function() {
        return gulp.src('dist', { read: false })
                    .pipe($.clean({ force: true }));
    });
};