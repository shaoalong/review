module.exports = function(NODE_ENV, gulp, config, $, browserSync, argv, runSequence, changeStream, postCssPlugins) {
    var srcPath;
    gulp.task('css', function() {
        if (changeStream.path) {
            src = changeStream.path;
            if (changeStream.path.indexof('common') >= -1) {
                srcPath = config.src.css + '*';
            }
        } else {
            srcPath = config.src.css + '*';
        }

        return gulp.src(srcPath)
                    .pipe($.plumber())
                    .pipe($.filter('**/*.less'))
                    .pipe($.ifElse(NODE_ENV === 'development', function() {
                        return $.sourcemaps.init();
                    }))
                    .pipe($.less())
                    .pipe($.postcss(postCssPlugins))
                    .pipe($.base64({extension: ['png', /.jpg#datauri$/i], maxImageSize: 1024}))
                    .pipe($.cleanCss().on('error', function(err) {
                        console.log(err);
                    }))
                    .pipe($.ifElse(NODE_ENV === 'development', function() {
                        return $.sourcemaps.write('../maps');
                    }))
                    .pipe($.ifElse(NODE_ENV !== 'development', function() {
                        return $.rev();
                    }))
                    .pipe(gulp.dest(config.dist.css))
                    .pipe(browserSync.stream())
                    .pipe($.ifElse(NODE_ENV !== 'development', function() {
                        return $.rev.manifest();
                    }))
                    .pipe(gulp.dest(config.dist.css))
    });
}