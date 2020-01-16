eval:关键字-rebuild；提升rebuild速度；
    eval的作用是是的打包后的bundle文件中每个模块代码使用eval去执行，会保留每个模块的eval形式的文件，即便是eval-source-map，仍然会在浏览器开发者工具中生成：webpack-internals://
    文件夹来保存一份里面是eval形式的模块文件。
source-map:
    生成.map文件，会在bundle文件末尾追加sourceURI=指定.map文件路径，会在浏览器开发者工具中看到webpack://文件夹
inline：关键字-dataURI；
    正常的source-map的生成目录是在dist目录下创建一个.map文件，inline的含义就是不产生独立的.map文件，而是把source-map的内容以dataURI的方式追加到bundle文件的末尾；sourceMappingURL=data;application/JSON;....
cheap:关键字-lines-only（只仅限于行，忽略列）
    忽略列的意思是就是出了问题只能定位到某一行，不能定位到这行的那一列，cheap主要是为了提升打包速度。
module:关键字-loader
    module的作用是map到loader处理前的文件，如果不加module，实际上是map到源文件经过对应loader处理后的样子。这个需要loader的支持。
hidden-source-map:
    就是不在bundle文件结尾处追加sourceURI指定其sourcemap文件的位置，但是仍会生成sourcemap文件。这样浏览器开发者工具就无法使用sourcemap，目的是避免把sourcemap文件发布到生产环境，造成源码泄露。
    生产环境应该用错误报告工具结合source-map文件来查找问题。
nosource-source-map:
    source-map中不带有源码，这样source-map可以部署到生产环境而不会造成源码泄露，同时一旦出了问题，error stacks中会显示错误信息，比如发生在哪个文件的哪一行；




品质说明(quality) 
    打包后的代码 - 将所有生成的代码视为一大块代码。你看不到相互分离的模块。
    生成后的代码 - 每个模块相互分离，并用模块名称进行注释。可以看到 webpack 生成的代码。示例：你会看到类似 var module__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(42); module__WEBPACK_IMPORTED_MODULE_1__.a();，而不是 import {test} from "module"; test();。
    转换过的代码 - 每个模块相互分离，并用模块名称进行注释。可以看到 webpack 转换前、loader 转译后的代码。示例：你会看到类似 import {test} from "module"; var A = function(_test) { ... }(test);，而不是 import {test} from "module"; class A extends test {}。
    原始源代码 - 每个模块相互分离，并用模块名称进行注释。你会看到转译之前的代码，正如编写它时。这取决于 loader 支持。
    无源代码内容 - source map 中不包含源代码内容。浏览器通常会尝试从 web 服务器或文件系统加载源代码。你必须确保正确设置 output.devtoolModuleFilenameTemplate，以匹配源代码的 url。
    （仅限行） - source map 被简化为每行一个映射。这通常意味着每个语句只有一个映射（假设你使用这种方式）。这会妨碍你在语句级别上调试执行，也会妨碍你在每行的一些列上设置断点。与压缩后的代码组合后，映射关系是不可能实现的，因为压缩工具通常只会输出一行。
对于开发环境 
    以下选项非常适合开发环境：
    eval - 每个模块都使用 eval() 执行，并且都有 //@ sourceURL。此选项会非常快地构建。主要缺点是，由于会映射到转换后的代码，而不是映射到原始代码（没有从 loader 中获取 source map），所以不能正确的显示行数。
    eval-source-map - 每个模块使用 eval() 执行，并且 source map 转换为 DataUrl 后添加到 eval() 中。初始化 source map 时比较慢，但是会在重新构建时提供比较快的速度，并且生成实际的文件。行数能够正确映射，因为会映射到原始代码中。它会生成用于开发环境的最佳品质的 source map。
    cheap-eval-source-map - 类似 eval-source-map，每个模块使用 eval() 执行。这是 "cheap(低开销)" 的 source map，因为它没有生成列映射(column mapping)，只是映射行数。它会忽略源自 loader 的 source map，并且仅显示转译后的代码，就像 eval devtool。
    cheap-module-eval-source-map - 类似 cheap-eval-source-map，并且，在这种情况下，源自 loader 的 source map 会得到更好的处理结果。然而，loader source map 会被简化为每行一个映射(mapping)。
特定场景 
    以下选项对于开发环境和生产环境并不理想。他们是一些特定场景下需要的，例如，针对一些第三方工具。
    inline-source-map - source map 转换为 DataUrl 后添加到 bundle 中。
    cheap-source-map - 没有列映射(column mapping)的 source map，忽略 loader source map。
    inline-cheap-source-map - 类似 cheap-source-map，但是 source map 转换为 DataUrl 后添加到 bundle 中。
    cheap-module-source-map - 没有列映射(column mapping)的 source map，将 loader source map 简化为每行一个映射(mapping)。
    inline-cheap-module-source-map - 类似 cheap-module-source-map，但是 source mapp 转换为 DataUrl 添加到 bundle 中。
对于生产环境 
    这些选项通常用于生产环境中：
    (none)（省略 devtool 选项） - 不生成 source map。这是一个不错的选择。
    source-map - 整个 source map 作为一个单独的文件生成。它为 bundle 添加了一个引用注释，以便开发工具知道在哪里可以找到它。(你应该将你的服务器配置为，不允许普通用户访问 source map 文件！)
    hidden-source-map - 与 source-map 相同，但不会为 bundle 添加引用注释。如果你只想 source map 映射那些源自错误报告的错误堆栈跟踪信息，但不想为浏览器开发工具暴露你的 source map，这个选项会很有用。(你不应将 source map 文件部署到 web 服务器。而是只将其用于错误报告工具。)
    nosources-source-map - 创建的 source map 不包含 sourcesContent(源代码内容)。它可以用来映射客户端上的堆栈跟踪，而无须暴露所有的源代码。你可以将 source map 文件部署到 web 服务器。(这仍然会暴露反编译后的文件名和结构，但它不会暴露原始代码。)