Axios是一个基于promise的HTTP库，可以用在浏览器和nodeJs中
1.从浏览器中创建XMLHttpRequest
2.在node环境创建http请求
3.支持promiseAPI
4.拦截请求和响应
5.转换请求数据和相应数据
6.取消请求
7.自动转换JSON数据

let cancel
let token = getToken() // 请求接口获取的token存在本地缓存，在请求接口的时候传递token。可以防止xss攻击
const service = axios.create({
    timeout: 40000,
    headers: { 'format': 'JSON' }
})
service.interceptors.request.use(config => {
    config.cancelToken = new axios.CancelToken((cancelObj) => {
        cancel = cancelObj
    })
    config.headers.token = token
    return config
})
service.interceptors.response.use(config => {

})


cancelToken原理：
axios/lib/cancel/CancelToken.js

'use strict';
var Cancel = require('./Cancel');
function CancelToken(executor) {
    if (typeof executor !== 'function') {
        throw new TypeError('executor must be a function.');
    }
    /**
    * 定义 resolvePromise
    * 新建promise实例
    * 将 promise的resolve方法赋值给 resolvePromise 目的是为了在promise对象外使用resolvePromise方法来改变对象状态
    */
    var resolvePromise;
    this.promise = new Promise(function promiseExecutor(resolve) {
        resolvePromise = resolve;
    });
    /**
    * 将CancelToken实例赋值给token
    * 给executor传入cancel方法，cancel可调用resolvePromise方法
    */
    var token = this;
    executor(function cancel(message) {
        if (token.reason) {
            // 取消已响应 返回
            return;
        }
        token.reason = new Cancel(message);
        // 这里执行的就是promise的resolve方法，改变状态
        resolvePromise(token.reason);
  });
}
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
    if (this.reason) {
        throw this.reason;
    }
};
CancelToken.source = function source() {
    var cancel;
    var token = new CancelToken(function executor(c) {
        // c 就是CancelToken中给executor传入的cancel方法
        cancel = c;
    });
    return {
        token: token,
        cancel: cancel
    };
};
module.exports = CancelToken;


通过源码我们可以发现，CancelToken这个类初始化的时候需要传递一个方法executor，并且它的内部新建了一个promise，最关键的是，
它把promise的resolve方法控制权放在了executor方法里面！这种操作代表什么意思？我们看一个小例子：

let resolveHandle;
new Promise((resolve)=>{
    resolveHandle=resolve;
}).then((val)=>{
 console.log('resolve',val);
});
resolveHandle('ok');
上面的例子中，我们用resolveHandle获取了一个promise的resolve方法的控制权，这样，我们就可以在外部控制这个promise的成功了。
要知道new Promise返回的对象是无法从外部决定它成功还是失败的。
也就是说cancel代表的是上面的这个方法，有了这个方法，就可以在外部控制CancelToken内部的promise对象了

CancelToken 的 resolve 的方法触发 promise.then 方法
// axios/lib/adapters/xhr.js
// 创建XHR对象
var request = new XMLHttpRequest()
// 模拟当前ajax请求
request.open(config.method.toUpperCase(), buildURL(config.url, config.params, config.paramsSerializer), true)
if (config.cancelToken) {
    config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
            return;
        }
        // 取消ajax请求
        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
    });
}
调用cancel()方法， 即resolve该promise，然后会走then方法调用abort()取消请求
promise -> cancel() -> resolve -> then -> abort