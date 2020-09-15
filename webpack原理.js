webpack原理：
核心概念:
    1.entry: 一个可执行模块或者库的入口
    2.chunk: 多个文件组成一个代码块。可以将可执行的模块和他所依赖的模块组合成一个chunk，这就是打包。
    3.loader: 文件转换器。例如把es6转为es5，scss转为css等。
    4.plugin: 扩展webpack功能的插件。在webpack构建的生命周期节点上加入扩展hook，添加功能。
webpack构建流程(原理)：
    从启动构建到输出结果的一些列过程：
    1.初始化参数： 解析webpack配置参数合并shell传入和webpack.config.js文件配置的参数，形成最后的配置结果。
    2.开始编译： 上一步得到的参数初始化compiler对象，注册所有配置插件，插件监听webpack构建生命周期的时间节点，做出相应的反应，执行对象的run方法开始执行编译。
    3.确定入口： 从配置的entry入口，开始解析文件构建AST语法树，找出依赖，递归下去。
    4.编译模块： 递归中根据文件类型和loader配置，调用所有配置的loader对文件进行转换，再找出该模块依赖的模块，再递归本步骤直到所有入口依赖都经过本步骤的处理。
    5.完成编译模块并输出： 递归完事后，得到每个文件结果，包含每个模块以及他们之间的依赖关系，根据entry配置生成代码块chunk。
    6.输出完成： 输出所有的chunk到文件系统。
    注意：再构建生命周期中有一系列插件在合适的时机做合适的事情，比如uglifyPlugin会在loader转换完对结果使用UglifyJs压缩覆盖之前的结果。

compiler： 代表了配置好的完整webpack environment，这个对象一旦启动了webpack就被创建，并且该对象会被包括options/loaders/plugins等配置项所配置。
    当应用一个plugin到webpack环境时，plugin将会接收一个对这个compiler对象的引用。我们使用compiler对象来访问main webpack environment。
    钩子函数：run（开始读取 records 之前，钩入(hook into) compiler）、compile（一个新的编译(compilation)创建之后，钩入(hook into) compile）、emit（生成资源到 output 目录之前）、done（编译(compilation)完成）、failed（编译(compilation)失败）等
compilation： 代表一个versioned assets的一个single build。当运行webpack development middleware时，一旦监听到文件变更，那么就会创建一个compilation
    这样就会生成一套编译后的assets。每一个compilation对象使得module resources/compiled assets、changed files以及watched dependencied有一个参考水平面，
    该对象也提供了callbacks points供plugin选择使用以便定制行为。
    cimpilation实例能够访问所有模块和他们的依赖(大部分是循环依赖)。他会对应用程序的依赖图中所有模块进行字面上的编译。
    在编译阶段，模块会被加载(loaded)、封存(sealed)、优化(optimized)、分块(chunked)、哈希(hashed)和重新构建(rebuild)
    钩子函数：seal、optimize等
compiler和compilation类都扩展自Tapable。

plugin: 本质上是一些再起原型上定义了apply方法的实例化object，这个apply方法有webpack compiler在安装对对应plugin时来调用一次，
    apply方法将被传入对webpack compiler的引用，而通过这个compiler引用就授权了对compiler callbacks的访问。
    例子：
    file-list.js:
        class FileListPlugin {
            apply(compiler) {
                compiler.plugin('emit', (compilation, callback) => {
                    var fileList = 'In this build:\n\n'
                    for (let fileName in compilation.assets) {
                        fileList += ('- '+ fileName +'\n')
                    }
                    compilation.assets['fileList.md'] = {
                        source() {
                            return fileList
                        },
                        size() {
                            return fileList.length
                        }
                    }
                    callback()
                })
            }
        }
        module.exports = FileListPlugin
    使用：
        var FileListPlugin = require('file-list')
        var webpackConfig = {
            plugins: [
                new FileListPlugin()
            ]
        }