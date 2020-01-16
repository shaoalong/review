module.exports = function(NODE_ENV, gulp, config, $, browserSync, argv, runSequence, changeStream, postCssPlugins) {
    var srcPath;
    gulp.task('images', function() {
        srcPath = changeStream.type === 'changed' ? changeStream.path : config.src.images + '**';
        return gulp.src(srcPath)
                    .pipe($.plumber())
                    .pipe(gulp.dest(config.dist.images))
                    .pipe(browserSync.stream())
    });
}