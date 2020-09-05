async:一部函数是指通过事件循环异步执行的函数，他会通过一个隐式的Promise返回其结果。
async函数的返回值是Promise.resolve([return 的值])

async function func() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('timeout')
        }, 1000)
    })
}
async function func() {
    return 123
}
async function func() {
    return Promise.resolve('123')
}
async function func() {
    // no return
}
async function func() {
    return {
        then(resolve, reject) {
            resolve(123)
        }
    }
}
var p = func()
console.log(p)
setTimeout(() => {
    console.log(p)
})




// 异步调用在for和forEach中的区别
(async () => { for (var i of [1,2,3,4]) {
    await timeout()
    console.log(i)
}})()

// 
Array.prototype.forEach = function(callback){
    var k = 0;
    while(k < this.length){
        var kValue;
        kValue = this[ k ];
        callback(kValue, k);
        k++;
    }
}

var arr = [1,2,3,4]
arr.forEach(async (i, v) => {
    console.log(v)
    await timeout()
})
[return_value] = await expression
返回 Promise 对象的处理结果。如果等待的不是 Promise 对象，则返回该值本身。
await 表达式会暂停当前 async function 的执行，等待 Promise 处理完成。
若 Promise 正常处理(fulfilled)，其回调的resolve函数参数作为 await 表达式的值，继续执行 async function。
若 Promise 处理异常(rejected)，await 表达式会把 Promise 的异常原因抛出。

try catch是JavaScript的异常处理机制，把可能出错的代码放在try语句块中，如果出错了，就会被catch捕获来处理异常。如果不catch 一旦出错就会造成程序崩溃。


async function check(){
    let promises = [1,2,3,6,5,4].map(async(rule) => {
        throw new Error('aaaaaa');
    });
    return promises;
}

async function doCheck(){
    const ps = check()
    let result;
    try{
         result = await Promise.all(ps);
    }
    catch(e){
        console.log('error occurs');
    }
    console.log('iiiii')
}
doCheck()
console.log('===')


;(async () => {
    try {
      return new Promise((resolve, reject) => {
        reject('timeout');
      });
    } catch(e) {
        console.log('===')
    //   throw new Error(e);
    }
  })().catch(err => {
      console.log('--')
  })

  let config = {
    alert: setInterval(() => {console.log('Alert')}, 1000)
    }
    console.log(config)