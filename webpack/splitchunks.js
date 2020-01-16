// 默认配置
const splitChunks = {
    chunks: 'async',
    minSize: 30000,
    maxSize: 0,
    minChunks: 1,
    maxAsyncRequests: 5,
    maxInitialRequests: 3,
    automaticNameDelimiter: '~',
    name: true,
    cacheGroups: {
        vendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10
        },
        default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true
        }
    }
}

chunks: all(所有包);
async (异步包);
initial(初始包)
minSize: 分包前最小大小； 小于这个大小的包不会被拆分
minChunks: 分包前最小被引用次数； 小于这个引用次数的包不会被拆分
maxAsyncRequests: 最大异步请求数； 数量大于这个数， 包会被合并； 如被设置成1， 那么所有异步包都会被合并， 导致一个包被合并进多个包， 达不到分离包的目的
maxInitialRequests: html引用script的多大数量， 除了manifest
cacheGroups
priority: 表示缓存的优先级， 越大优先级越高， 优先打包到该包
test: 缓存组的规则， 表示符合条件的放入当前缓存组， 值可以使function、 boolean、 string、 RegExp， 默认为空
reuseExistingChunk: 表示可以使用已经存在的块， 即如果满足条件的块已经存在就使用已有的， 不在创建一个新的块。

require和 require.ensure的区别：
require([], [callback]): 使用时传递一个模块数组和回调函数， 模块都被下载下来且被执行后才执行回调函数
require.ensure([], callback, chunkName): 当依赖模块都被下载下来了， 但不会被执行， 只有在函数回调函数使用require(模块名) 后， 这个模块才会被执行
代码分离的分割线， 表示回调里面的require是我们想要分割出去的， 形成一个webpack打包的单独js文件； 但回调中的被使用过的require资源不会被合并。
原理： 把一些js模块给独立出一个个js文件， 然后需要用到的时候， 在创建一个script对象加入到head对象中即可， 浏览器会自动帮我们发起请求， 在写个回调， 去定义得到这个js后， 需要做甚， 额业务逻辑操作

vue-router引入组件的五种方式：
1.
import home from '~/views/home';（组件对象）
会把所有组件打包成一个包app， html会引入三个js包， app、 manifest、 vendor； 随着系统组件越来越多， app文件越来越大， 从而页面加载速度变慢。
2.
const home = (resolve) => require(['~/views/home'], resolve)
vue异步组件； webpack的代码分割;
这个特殊的require语法告诉webpack自动编译后的代码分割成不同模块， 这些快将通过ajax请求自动加载。
这里的require是AMD规范引入的关键词， resolve是全部引入成功以后的回调函数， 第一个参数是依赖， require会先引入依赖模块， 在执行回调函数。
3.
const home = (resolve) => require.ensure([], () => resolve(require('~/views/home')), 'homeChunk')
webpack提供的require.ensure是webpack的另一种代码分割;
多个路由指定相同的chunkName， 会打包成一个js文件。 vue官网推荐使用webpack的代码分割进行懒加载。 此方法依赖于Promise。
4.
const home = () => import ('~/views/home')
vue异步组件和webpack的代码分快点功能结合； 这里的import() 方法es6提出， 是动态加载， 返回一个Promise对象， then方法的参数是加载到的模块。 类似于Node.js的require方法。
import () 需要babel插件syntax - dynamic - import的支撑， 且webpack > 2.4
5.
const home = () =>
    import ( /*webpackChunkName: 'homeChunk'*/ '~/views/home')
import () 打包会发现， 出现的chunk包名字都是乱的， webpack3提供了Magic Comments(魔法注释);
这样相同webpackChunkName的包会被合并成这个包。

require，
import，
import () 的区别：
import命令会被javascript引擎静态解析， 先于模块内的其他模块执行。 这样的设计固然有利于编辑器提高效率， 但也导致无法再运行时加载模块，
在语法上， 条件加载就不可能实现。 如果import命令要取代Node的require方法， 就形成了一个障碍。 因为require是运行时加载模块， import命令无法取代require的动态加载功能。
const path = './' + fileName
const myModual = require(path)
上面的语句是动态加载， require到底加载哪一个模块， 只有运行时才知道。 import语法做不到这一点。

import () 是es6提出的方法， 它返回一个Promise对象
import (path).then(module => {})
import () 函数可以用在任何地方， 不仅仅是模块。 他是运行时执行的， 也就是说什么时候运行到这一句， 就会加载制定的模块。 另外import() 函数与所加载的模块没有静态链接关系， 这点也是与import语法不相同。
import () 类似于Node的require方法， 区别主要是前者是异步加载， 后者是同步加载。



runtimeChunk:优化持久化缓存的。
    runtime 指的是 webpack 的运行环境(具体作用就是模块解析, 加载) 和 模块信息清单, 
    模块信息清单在每次有模块变更(hash 变更)时都会变更, 所以我们想把这部分代码单独打包出来, 配合后端缓存策略, 这样就不会因为某个模块的变更导致包含模块信息的模块(通常会被包含在最后一个 bundle 中)缓存失效.
    optimization.runtimeChunk 就是告诉 webpack 是否要把这部分单独打包出来.

    假设一个使用动态导入的情况(使用import())，在app.js动态导入component.js
    const app = () =>import('./component').then();
    build之后，产生3个包。

    0.01e47fe5.js
    main.xxx.js
    runtime.xxx.js
    其中runtime，用于管理被分出来的包。
    如果采用这种分包策略，当更改app的时候runtime与（被分出的动态加载的代码）0.01e47fe5.js的名称(hash)不会改变，main的名称(hash)会改变。
    当更改component.js，main的名称(hash)不会改变，runtime与 (动态加载的代码) 0.01e47fe5.js的名称(hash)会改变。