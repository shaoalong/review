var setConfig = require('../set_config');
module.exports = function(NODE_ENV, gulp, config, $, browserSync, argv, runSequence, changeStream, postCssPlugins) {
    var srcPath;

    gulp.task('js', function() {
        srcPath = changeStream.type === 'chnaged' ? changeStream.path : config.src.js + '**';
        var filter = $.filter(['**/*.js', '!**/*.min.js'], {restore: true});
        return gulp.src(srcPath)
                    .pipe($.plumber())
                    .pipe($.ifElse(NODE_ENV === 'development', function() {
                        return $.sourcemaps.init();
                    }))
                    .pipe(setConfig({ type: process.env.NODE_ENV, config: config.config }))
                    .pipe(filter)
                    .pipe($.uglify())
                    .pipe(filter.restore)
                    .pipe($.ifElse(NODE_ENV === 'development', function() {
                        return $.sourcemaps.write('../maps');
                    }))
                    .pipe($.ifElse(NODE_ENV !== 'development', function() {
                        return $.rev();
                    }))
                    .pipe(gulp.dest(config.dist.js))
                    .pipe(browserSync.stream())
                    .pipe($.ifElse(NODE_ENV !== 'development', function() {
                        return $.rev.manifest();
                    }))
                    .pipe(gulp.dest(config.dist.js))
    });
}