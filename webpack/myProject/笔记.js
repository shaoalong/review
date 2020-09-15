babel:ES6转码器，可以将ES6代码转成ES5代码。
    babel-cli：一种在命令行下使用Babel编译文件的简单方法。
                babel my-file.js // 编译文件
                babel my-file.js --out-file compiled.js // 编译文件输出到文件
                babel my-file.js -o compiled.js // 编译文件输出到文件
                babel src --out-dir lib // 编译目录输出到目录
                babel src -d lib // 编译目录输出到目录

    babel-core:以编程方式使用babel
                var babel = require('babel-core');
                babel.transform(string, options); // 转义字符串
                babel.transformFile(file, options, callback(err, result)); // 转义文件
                babel.transformFileSync(file, options); // 异步转义文件

    babel-polyfill: babel只是把ES6+的语法转成ES5语法，但并没有把API复制过来。如果浏览器不能原生的支持，polyfill就把API用js重写出来，以适用新的环境（全局引入）。

    babel-runtime + babel-plugin-transform-runtime:和polyfill一样功能，只不过我们可以在自己模块中单独引入，比如：require('babel-runtime/core-js/promise')，借助Runtime-transform插件可以自动化处理。

    babel-register: 改写require命令，为他加上一个钩子，伺候每当适用reqire加载.js/.jsx/.es/.es6等后缀文件，就会先用babel进行转码。（实时转码，所以只适用于开发环境）

    babel-node： babel-cli工具自带babel-node命令，可以代替node 命令，并且可以直接运行ES6代码。

    babel-preset-env:不同浏览器和平台对es6/es7/es8支持不一，按需转码。
            modules:将ES6模块语法转换成另一种模块类型，如amd,umd,commonjs,systemjs等，设置为false标识禁止转译。
            targets:环境配置，node环境、浏览器环境。
            如果没有任何配置，等同于latest，也就是最新的presets，比如babel-preset-es2016,babel-preset-es2017.
    配置文件：.babelrc
            plugins(插件)：
            presets(预设)：插件的集合。两种：按年份和按阶段。
            1.plugins优先于presets进行编译。
            2.plugins从数组从第一个到最后一个进行编译（正序）。
            3.presets从数组从最后一个到第一个进行编译（倒叙）。
            4.阶段预设包含的插件 stage-0 > stage-1 > stage-2 > stage-3。

            {
                "presets": [
                  [
                    "env",
                    {
                      "targets": {
                          "node": "6.10",
                          "chrome": 52,
                          "browsers": ["last 2 versions", "safari >= 7"]
                      },
                      "modules": false
                    }
                  ],
                  "stage-2"
                ],
                "plugins": [
                  "transform-runtime"
                ]
              }


vue-loader: 在 15.0.0 版本，必须在webpack配主机文件中的plugins中实例化该插件,否则会报错。
            const { VueLoaderPlugin } = require('vue-loader');
            plugins: [
              new VueLoaderPlugin()
            ]

eslint：javascript代码规范工具(eslint-loader)。
      .eslintrc.js: 配置代码规范。（0: off, 1: warn, 2: error）
      .eslintignore: 配置需要忽略规范的文件或文件夹。
      在代码中定义：
          禁用ESLint：
            /* eslint-disable */
            var a = 100;
            console.log(a);
            /* eslint-enable */
          禁用一条规则：
            /* eslint-disable no-console*/
            var a = 100;
            console.log(a);
            /* eslint-enable no-console*/
          调整规则：
            /* eslint no-console:0 */
            var a = 100;
            console.log(a);
stylelint: 样式代码规范工具(stylelint-webpack-plugin)。
postcss: css处理插件系统。可以使用 autoprefixer，px2rem等css处理插件。
           在根目录新建.postcssre.js或者postcss.config.js配置插件。

webpack-dev-middleware: 对更改的文件进行监控、编译。（编译的文件是放在内存中的，我们在实际文件中并不会看到）
webpack-hot-middleware: 页面的热重载。
            1.dev-Server.js中给express()添加webpack-hot-middleware中间件。
            2.在webpack配置文件entry中添加'webpack-hot-middleware/client?noInfo=true&relaod=true'。
            3.在webpack配置文件plugin中添加
              new webpack.HotModuleReplacementPlugin(), // 模块有变更后，不用刷新页面就会自动更新浏览器端代码
              new webpack.NoEmitOnErrorsPlugin(),// 当编译报错的时候，错误信息不会输出到页面
http-proxy-middleware：用于把请求代理转发到其他服务器的中间件。
connect-history-api-fallback:让中间件支持h5 history模式的路由。
            vue-router 默认 hash 模式。如果不想用很丑的hash，我们可以使用路由的history模式。因为我们是单页客户端应用，
            如果后台没有正确的配置，当用户在浏览器直接访问路径或者刷新页面时，后台就会返回404，所以你要在服务端增加一个覆盖
            所有情况的候选资源：如果URL匹配不到任何静态资源，则应返回同一个index.html页面，这个页面就是你app依赖的页面。






less兼容：
    错误信息：Inline JavaScript is not enabled. Is it set in your options?
    解决：less@3.0以上可能会出现这个错误，方案有：
            1.less版本降到3.0以下。
            2.关于less-loader的配置添加： javascriptEnabled: true.
