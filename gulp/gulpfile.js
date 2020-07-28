var gulp = require('gulp');
var fs = require('fs');
var path = require('path');
var merge = require('merge-stream');
var util = require('gulp-util');
var ifElse = require('gulp-if-else');
var through2 = require('through2');
var order = require('gulp-order');
var connect = require('gulp-connect');
var gulpOepn = require('gulp-open');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var cleanCSS = require('gulp-clean-css');
var rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var less = require('gulp-less');
var rev = require('gulp-rev');
var revCollector = require('gulp-rev-collector');
var gulpSequence = require('run-sequence')
var gulpFilter = require('gulp-filter')
var proxy = require('http-proxy-middleware');

var port = 8808;
var defaultBrowser = "chrome";
var localhost = 'http://pf-test.paic.com.cn';
var url = localhost + ":" + port;
var modules = ['public','annualPlan','annualPlan4email','monthReport','monthReport4email','rank','rank4email','printPreview'];
var changeStream = {};

var src = './',
    dist = './dist/';
var filePath = {
    src:{
        html:src + 'performance/',
        js:src + 'js/',
        css:src + 'css/',
        images:src + 'images/',
        lang:src + 'lang/'
    },
    dist:{
        html:dist + 'performance/',
        js:dist + 'js/',
        css:dist + 'css/',
        images:dist + 'images/',
        rev:dist + 'rev/'
    }
}

// 打印错误
function swallowError(error) {
  console.error(error.toString())
  this.emit('end')
}

// 获取文件夹
function getFolders(dir) {
    return fs.readdirSync(dir)
      .filter(function(file) {
        return fs.statSync(path.join(dir, file)).isDirectory();
      });
}

// 清空dist
gulp.task('cleanDist', function () {
    return gulp.src(dist, { read: false })
        .pipe(clean());
});

// css任务
gulp.task('style', function () {
    var folders = getFolders(filePath.src.css);
    // 公共css样式合并
    var commonCssTask = (function(){
        return gulp.src(filePath.src.css + '*.css')
                .pipe(concat('common.min.css'))
                .pipe(cleanCSS({ compatibility: 'ie8' }))
                .pipe(ifElse(process.env.NODE_ENV != 'development',function(){
                    return rev();
                }))
                .pipe(gulp.dest(filePath.dist.css))
                .pipe(connect.reload())
                .pipe(ifElse(process.env.NODE_ENV != 'development',function(){
                    return rev.manifest('common-css-manifest.json',{merge:false});
                }))
                .pipe(ifElse(process.env.NODE_ENV != 'development',function(){
                    return gulp.dest(filePath.dist.rev)
                }))
    })();
    // css样式合并
    var cssTask = folders.map(function(folder){
         return gulp.src(path.join(filePath.src.css, folder, '/*.css'))
                    .pipe(concat(folder + '.min.css'))
                    .pipe(cleanCSS({ compatibility: 'ie8' }))
                    .pipe(ifElse(process.env.NODE_ENV != 'development',function(){
                        return rev();
                    }))
                    .pipe(gulp.dest(filePath.dist.css))
                    .pipe(connect.reload())
                    .pipe(ifElse(process.env.NODE_ENV != 'development',function(){
                        return rev.manifest(folder+'-css-manifest.json',{merge:false});
                    }))
                    .pipe(ifElse(process.env.NODE_ENV != 'development',function(){
                        return gulp.dest(filePath.dist.rev)
                    }))
    })
    return merge(cssTask.concat(commonCssTask));
})


// js任务
gulp.task("script",function(){
    var commonOrderArr = [
                            '**/require.min.js',
                            '**/jquery.cookie.min.js',
                            '**/mustache.min.js',
                            '**/calendar.min.js',
                            'js/*.js',
                            'lang/**/*.js'
                        ]
    var filterMin = gulpFilter(['**/*.js','!**/*.min.js'],{restore:true}); //压缩文件
    var filterLibs = gulpFilter(['**','!js/libs/*.js'],{restore:true});  //libs文件夹不加文件指纹
    var filterCommon = gulpFilter(commonOrderArr,{restore:true});   //文件合并文件
    var commonOrder = order(commonOrderArr); //文件顺序合并（依赖require.min.js）
    return gulp.src([filePath.src.js+'**/*.js',filePath.src.lang + '**/*'])
                .pipe(filterCommon)
                .pipe(commonOrder)
                .pipe(concat('common.min.js'))
                .pipe(filterCommon.restore)
                .pipe(filterMin)
                .pipe(uglify())
                // .pipe(rename({ suffix: '.min' }))
                .pipe(filterMin.restore)
                .pipe(filterLibs)
                .pipe(ifElse(process.env.NODE_ENV != 'development',function(){
                    return rev();
                }))
                .pipe(filterLibs.restore)
                .pipe(gulp.dest(filePath.dist.js))
                .pipe(connect.reload())
                .pipe(ifElse(process.env.NODE_ENV != 'development',function(){
                    return rev.manifest('js-manifest.json',{merge:false});
                }))
                .pipe(ifElse(process.env.NODE_ENV != 'development',function(){
                    return gulp.dest(filePath.dist.rev)
                }));
})

// html任务
gulp.task('html', function () {
    var filterHtml = gulpFilter('**/*.html',{restore:true});
    return gulp.src([filePath.src.html+'**/*',filePath.dist.rev+'*.json',])
        .pipe(filterHtml)
        .pipe(ifElse(process.env.NODE_ENV != 'development',function(){
            return revCollector({replaceReved:true})
        }))
        .pipe(filterHtml.restore)
        .pipe(gulp.dest(filePath.dist.html))
        .pipe(connect.reload());
})

// 图片任务
gulp.task('images', function () {
    var filterFavicon = gulpFilter('**/favicon.ico',{restore:true});
    return gulp.src([filePath.src.images + "**/*",src + 'favicon.ico'])
        .pipe(filterFavicon)
        .pipe(gulp.dest(dist))
        .pipe(filterFavicon.restore)
        .pipe(gulp.dest(filePath.dist.images))
        .pipe(connect.reload());
})

// 文件监听任务部署
gulp.task('watch',function(){
     var watchJson = [
            {
                watchArr:filePath.src.html + "*",
                task:'html'
            },
            {
                watchArr:[filePath.src.css + "**/*.css",filePath.src.less + "**/*.less"],
                task:'style'
            },
            {
                watchArr:[filePath.src.js + "**/*.js",filePath.src.lang + "**/*.js"],
                task:'script'
            },
            {
                watchArr:[filePath.src.images + "**/*",src + 'favicon.ico'],
                task:'images'
            },
        ];

    watchJson.forEach(function(item,i){
            gulp.watch(item.watchArr,function(stream){
                changeStream.type = stream.type;
                changeStream.path = stream.path;
                gulpSequence(item.task);
            });
        })

})

// 微型web服务器
gulp.task('webServer', function () {
    connect.server({
        root: dist,
        port: port,
        livereload: true, // 是否热加载
        middleware: function (connect, opt) {
            return [
                proxy('/performance/**/*.do',  {
                    target: 'http://zztj-performance-stg1.paic.com.cn',
                    changeOrigin:true
                })
            ]
        }
    });
});

// 开发环境
gulp.task('dev',function(){
    gulpSequence('cleanDist',['style','script','images'],'html','watch','webServer',function(){
        util.log(util.colors.yellow('开发环境'));
        util.log(util.colors.yellow('服务已启动!地址:'+url));
        gulp.src(__filename)
            .pipe(gulpOepn({
                uri:url,
                app:defaultBrowser
            }))
    });
})

// 上线前压缩，去注释，混淆，生成md5文件等。
gulp.task('production',function(cb){
    gulpSequence('cleanDist',['style','script','images'],'html',function(){
        util.log(util.colors.yellow('发布环境'));
    });
})