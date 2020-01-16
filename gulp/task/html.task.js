module.exports = function(NODE_ENV, gulp, config, $, browserSync, argv, runSequence, changeStream, postCssPlugins) {
    var srcPath;
    gulp.task('html', function() {
        srcPath = changeStream.type === 'changed' ? changeStream.path : config.src.html + '*.html';
        return gulp.src(srcPath)
                    .pipe($.plumber())
                    .pipe($.revCollector())
                    .pipe(gulp.dest(config.dist.html))
                    .pipe(browserSync.stream())
    });
}