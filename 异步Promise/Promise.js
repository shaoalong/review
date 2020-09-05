// all: 所有Promise状态都为fulfilled才会走resolve回调，此时返回参数是各个Promise的返回值；否则只要有一个不是fulfilled，就会走reject回调，此时返回值是率先rejected的Promise的返回值
// Promise.all([p1,p2]).then(res => { /* res:[p1返回值,p2返回值] *// }).catch(reason => {/* resaon:率先rejected的返回值 *//})

// race: 只要有Promise状态settled就会走回调，如果率先settled的Promise状态为fulfilled就走resolve回调，否则走reject回调
// Promise.race([p1,p2]).then(res => { /* res:率先settled的返回值 *//}).catch(reason => {/* reason:率先settled的返回值 *//})

// any:只要有Promise状态fulfilled就会走resolve回调；否则走reject回调
// Promise.any([p1,p2]).then(res => { /* res:率先fulfilled的返回值  *//}).catch(reason => { /*readon: [p1 rejected的返回值,p2 rejected的返回值] *//})

// allSettled:当所有Promise状态都settled时(不论是否是fulfilled或rejected)，会走resolve回调。(没有reject回调)
// Promise.allSettled([p1,p2]).then(res => { /* res:[p1, p2] *//})

// then:方法返回的是一个新的Promise实例（注意，不是原来那个Promise实例）

// resolve:把现有对象转成Promise对象
// Promise.resolve(obj)
//     1.如果obj是Promise实例,原封不动地返回obj
//     2.如果obj是thenable对象，会将这个对象转为 Promise 对象，然后就立即执行thenable对象的then方法
//         let thenable = {
//             then: function(resolve, reject) {
//                 resolve(33)
//             }
//         }
//         let p1 = Promise.resolve(thenable)
//         p1.then(function(value) {
//             console.log(value);  // 33
//         });
//         console.log(p1)
//     3.如果obj不是具有then方法的对象，或根本就不是对象，会返回一个新的 Promise 对象，状态为resolved
//     4.不带有任何参数,直接返回一个resolved状态的 Promise 对象。
//         const p = Promise.resolve()
//         console.log(p)



const MyPromise = require('./myPromise')

var p = new MyPromise(resolve => {
    resolve('p1')
})
var p1
setTimeout(() => {
    p1 = p.then(res => {
        console.log('p1.then', res)
        return 'p1-p2'
    })
}, 1000)

console.log('----now----')
console.log(p)
console.log(p1)

setTimeout(() => {
    console.log('----1s----')
    console.log(p)
    console.log(p1)
}, 1000)

setTimeout(() => {
    console.log('----2s----')
    console.log(p)
    console.log(p1)
}, 2000)
// p1.then(res => {
//     console.log(res)
// })

var p = Promise.resolve('123').then(res => {
    console.log('then')
    return 'then'
} )
setTimeout(() => {
    console.log(p)
})
console.log(p)


        const p = Promise.resolve('Hello');
        var p1 = p.then(function (s){
            console.log(s)
        });
        console.log(p1)
        console.log(p)


async function timeout(ms) {
    await new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
var p = timeout(100)
console.log(p)

var p1 = new Promise(resolve => {
    resolve(2)
}).then(res => {
    console.log(res)
})
var p2 = new Promise(resolve => {
    resolve(p1)
})
console.log(p2)
p2.then(res => {
    console.log(res)
})

var p1 = Promise.resolve(123)
// var p2 = Promise.resolve(p1)
const p2 = new Promise(function (resolve, reject) {
    resolve(p1)
    // setTimeout(() => resolve(p1), 1000)
  })
p2.then(res => {
    console.log(res)
})

const p1 = new Promise(function (resolve, reject) {
    resolve(1)
    // setTimeout(() => resolve(1), 3000)
  }).then(res => {
      console.log('p1.then', res)
      return 'p1-p1'
  })
  
  const p2 = new Promise(function (resolve, reject) {
    resolve(p1)
    // setTimeout(() => resolve(p1), 1000)
  })
  
  p2
    .then(result => console.log('p2.then', result))
    .catch(error => console.log(error))


async function f() {
    console.log('---')
    await '999'
    await Promise.resolve('出错了');
}
const res = f()
console.log('now')
console.log(res)

var p = 
console.log(Promise.resolve(Promise.resolve('123')))


const p1 = new Promise(function (resolve, reject) {
    resolve(1)
    // setTimeout(() => resolve(1), 3000)
  }).then(res => {
      console.log('p1.then', res)
      return 'p1-p1'
  })

  async function f2() {
    // var y = await 20;
    var y
    var p = Promise.resolve(20).then(res => {
        y = res
        console.log(y); // 20
    })
    return p
  }
  var x = f2();
  console.log(x)
  console.log('now')
  setTimeout(() => {
    console.log(x)
  }, 0)




