// function MyImage(src) {
//   this.img = document.createElement('img')
//   this.img.src = src
//   document.body.appendChild(this.img)
// }
// MyImage.prototype.setSrc = function(src) {
//   this.img.src = src
// }

// function ProxyMyImage(src) {
//   this.img = new MyImage()
//   this.image = new Image()
//   this.setSrc(src)
//   this.image.onload = function() {
//     this.img.setSrc(this.src)
//   }
// }
// ProxyMyImage.prototype.setSrc = function(src) {
//   this.img.setSrc('loading.jpg')
//   this.image.src = src
// }

// var a = 'global'
// var obj = {
//   a: 'obj_a',
// }
// function fun(name, age) {
//   this.b = 100
//   console.log(this)
//   console.log(this.a)
//   console.log(name, age)
//   return this.a
// }
// if (!Function.prototype.bind) {
//   Function.prototype.bind = function(obj) {
//     if (typeof this !== 'function') {
//       throw new TypeError('must be a function')
//     }
//     var args = [].slice.call(arguments, 1)
//     var fn = this
//     var func = function() {}
//     func.prototype = fn.prototype

//     var returnValue = function() {
//       return fn.apply(this instanceof func ? this : obj, [...args, ...arguments])
//     }
//     returnValue.prototype = new func()
//     return returnValue
//   }
// }
// var Fun = fun.bind(obj, 'along')
// var aa = new Fun()
// // console.log(aa)

// var arr = [
//   {name:'小米1', value: 1,  type: 2, date: '2018-06-07T08:00:01.589Z' },

//    {name:'锤子T1', value: 1, type: 2, date: '2018-06-07T08:10:01.589Z' },

//    {name:'小米2', value: 1, type: 4, date: '2018-06-07T20:00:01.589Z' },

//    {name:'小米2', value: 4, type: 4, date: '2018-06-07T20:10:21.189Z' },

//    {name:'小米4', value: 1, type: 4, date: '2018-06-07T08:00:01.560Z' },

//    {name:'小米4', value: 2, type: 4, date: '2018-06-07T08:10:31.584Z' },

//    {name:'小米6', value: 1, type: 3, date: '2018-06-07T08:00:01.589Z' },

//    {name:'小米5s',value: 1, type: 4, date: '2018-06-07T08:00:01.589Z' },

//    {name:'锤子T2', value: 1, type: 4, date: '2018-06-07T08:00:01.589Z' },

//    {name:'锤子T1', value: 4, type: 4, date: '2018-06-07T08:06:01.589Z' },

//    {name:'魅蓝note5', value: 1, type: 4, date: '2018-06-07T08:00:01.589Z' },

//    {name:'魅蓝note2', value: 5, type: 4, date: '2018-06-02T08:07:01.589Z' },

//    {name:'魅蓝note2', value: 6, type: 4, date: '2018-06-07T08:00:01.589Z' },

//    {name:'魅蓝note3', value: 1, type: 4, date: '2018-06-05T08:00:01.589Z' },

//    {name:'魅蓝note', value: 1, type: 4, date: '2018-06-07T08:00:01.589Z' },

//    {name:'oppor9', value: 7, type: 4, date: '2018-06-04T08:04:01.588Z' },

//    {name:'华为p9', value: 1, type: 4, date: '2018-06-02T08:00:01.577Z' },

//    {name:'华为p9', value: 2, type: 4, date: '2018-06-07T08:00:01.110Z' },

//    {name:'华为p10', value: 1, type: 1, date: '2018-06-07T08:00:01.534Z' }
// ]

// function sumStatistics() {
//   var map = {}
//   arr.filter(x => x.type === 4).forEach(x => {
//     var key = `${x.name},${x.date.slice(0,10)}`
//     map[key] = (map[key] || 0) + x.value
//   })
//   return Object.keys(map).map(x => ({ key: x, value: map[x] })).sort((x, y) => y.value - x.value)
// }
// var result = sumStatistics()
// result.forEach(x => {
//   console.log(`${x.key},售出${x.value}部`)
// })

// function _instanceof(instance, constructor) {
//   if (constructor != null && typeof Symbol !== 'undefined' && constructor[Symbol.hasInstance]) {
//     return !!constructor[Symbol.hasInstance](instance)
//   } else {
//     return instance instanceof constructor
//   }
// }

// function _classCallCheck(instance, constructor) {
//   if (!_instanceof(instance, constructor)) {
//     throw new TypeError("Cannot call a class as a function")
//   }
// }

// function _defineProperties(target, props) {
//   for (var i = 0; i < props.length; i++) {
//     var descriptor = props[i]
//     descriptor.enumerable = descriptor.enumerable || false
//     descriptor.configurable = true
//     if ('value' in descriptor) descriptor.writable = true
//     Object.defineProperty(target, descriptor.key, descriptor)
//   }
// }

// function _createClass(constructor, protoProps, staticProps) {
//   if (protoProps) _defineProperties(constructor.prototype, protoProps)
//   if (staticProps) _defineProperties(constructor, staticProps)
//   return constructor
// }

// var Person = function() {
  
//   function Person(name, age) {
//     console.log('Person', this)
//     _classCallCheck(this, Person)
//     this.name = name
//     this.age = age
//   }

//   _createClass(Person, [{
//     key: 'eat',
//     value: function eat() {
//       return 'eat'
//     }
//   }], [{
//     key: 'say',
//     value: function say() {
//       return 'say'
//     }
//   }])

//   return Person
// }

// const PersonC = Person()
// new PersonC()

// var xhr = new XMLHttpRequest()
// xhr.withCredentials = true
// xhr.open('PUT', 'http://localhost:4000/getData', true)
// xhr.setRequestHeader('name', 'along')
// document.cookie = 'name=along'
// xhr.onreadystatechange = function() {
//   if (this.readyState === 4) {
//     if (this.status >= 200 && this.status < 300 || this.status === 304) {
//       console.log(this.response)
//       console.log(this.getResponseHeader('name'))
//     }
//   }
// }

// var express = require('express')
// var app = express()
// var whiteList = ['http://localhost:3000']
// app.use(function(req, res, next) {
//   let origin = req.headers.origin
//   if (whiteList.includes(origin)) {
//     res.setHeader('Access-Control-Allow-Origin', origin)
//     res.setHeader('Access-Control-Allow-Methods', '*')
//     res.setHeader('Access-Control-Allow-Headers', 'name')
//     res.setHeader('Access-Control-Cridentials', true)
//     res.setHeader('Access-Control-Max-Age', 86400)
//     res.setHeader('Access-Control-Expose-Headers', 'name')
//     if (req.method === 'OPTION') {
//       res.end()
//     }
//   }
// })

// app.put('/getData', function(req, res) {
//   res.setHeader('name', 'haha')
//   res.end('i dont love you')
// })

// app.use(express.static(__dirname))
// app.listen(4000)


// // server1.js
// var http = require('http')
// http.createServer((req, res) => {
//   res.writeHead({
//     'Access-Control-Allow-Origin': '*',
//     'Access-Control-Allow-Methods': '*',
//     'Access-Control-Allow-Headers': 'Content-Type'
//   })

//   http.request({
//     host: '127.0.0.1',
//     port: '8080',
//     url: '/',
//     method: req.method,
//     headers: req.headers
//   }, serverResponse => {
//     let body = ''
//     serverResponse.on('data', chunck => {
//       body += chunck
//     })
//     serverResponse.on('end', () => {
//       res.end(body)
//     })
//   })
// }).listen(3000, () => {
//   console.log('The proxyServer is running at http://localhost:3000')
// })

// // server2.js
// var http = require('http')
// http.createServer((req, res) => {
//   if (req.url === '/') {
//     res.end(JSON.stringify({ title: 'fontend', password: '123456' }))
//   }
// }).listen(4000, () => {
//   console.log('The server is running at http://localhost:4000')
// })

// async function aa() {
//   const bb = await Promise.resolve('asdsadsa')
//   console.log(bb)
//   return bb
// }
// var dd = aa()
// console.log(dd)


// async function aa() {
//   // return 'aa'
//   await Promise.resolve('ppp')
// }
// var AA = aa()
// console.log(AA)
// AA.then(res => {
//   console.log(res)
// })

// const p = new Promise(resolve => {
//   // resolve('123')
//   return '123'
// })
// console.log(p)
// p.then(res => {
//   console.log(p)
// })
// var p = new Promise(resolve => {
//   resolve(Promise.resolve('123'))
// })
// console.log(p)
// p.then(res => {
//   console.log(res)
// })
// console.log('now')
// async function timeout(ms) {
//   return await '123'
//   return Promise.resolve('ppp')
//   return await new Promise((resolve, reject) => {
//     setTimeout(resolve, ms, 'done');
//   });
// }
// const ss = timeout(100)
// console.log(ss)
// ss.then((value) => {
//   console.log(value);
// });


// var p = Promise.resolve(Promise.resolve('ppp'))
// console.log(p)

// var p = (async () => {
//   var a = await '123'
//   return a
// })()
// console.log(p)


// class Node {
//   constructor(data) {
//     this.data = data
//     this.next = null
//   }
// }
// class LList {
//   constructor() {
//     this.head = new Node('head')
//   }
//   insert(el, data) {
//     const node = new Node(data)
//     let currentNode = this.head
//     while (currentNode.next !== null && currentNode.data !== el) {
//       currentNode = currentNode.next
//     }
//     node.next = currentNode.next
//     currentNode.next = node
//   }
//   findPrev(el) {
//     let currentNode = this.head
//     while (currentNode.next !== null && currentNode.next.data !== el) {
//       currentNode = currentNode.next
//     }
//     return currentNode
//   }
//   remove(el) {
//     let prevNode = this.findPrev(el)
//     prevNode.next = prevNode.next.next
//   }
//   display() {
//     let currentNode = this.head
//     let result = []
//     while(currentNode.next !== null) {
//       currentNode = currentNode.next
//       result.push(currentNode.data)
//     }
//     console.log(result.join('->'))
//   }
//   length() {
//     let currentNode = this.head
//     let n = 0
//     while(currentNode.next !== null) {
//       currentNode = currentNode.next
//       n++
//     }
//     return n
//   }
//   reverse(head) {
//     if (!head || !head.next) return head
//     let currentNode = head
//     let prevNode = null
//     while(currentNode) {
//       var next = currentNode.next
//       currentNode.next = prevNode
//       prevNode = currentNode
//       currentNode = next
//     }
//     return prevNode
//   }
//   findMid() {
//     let fast = this.head
//     let slow = this.head
//     while (fast && fast.next) {
//       slow = slow.next
//       fast = fast.next.next
//     }
//     return slow
//   }
//   removeLastn(n) {
//     let fast = this.head
//     let slow = this.head
//     while (n > 0) {
//       fast = fast.next
//       n--
//     }
//     while (fast !== null) {
//       fast = fast.next
//       slow = slow.next
//     }
//     slow.next = slow.next.next
//   }
// }

// let list = new LList()
// list.insert('head', 'A')
// list.insert('A', 'B')
// list.insert('B', 'C')
// list.insert('C', 'D')
// // list.remove('B')
// // list.display()
// // console.log(list.findMid())
// // list.removeLastn(2)
// list.display()

// let list1 = new LList()
// list1.insert('head', 'H')
// list1.insert('H', 'K')
// list1.insert('K', 'B')
// list1.insert('B', 'C')
// list1.insert('C', 'D')
// list1.display()

// function getInterNode(headA, headB) {
//   let pA = headA
//   let pB = headB
//   while (pA || pB) {
//     if (pA && pB && pA.data === pB.data) return pA.data
//     pA = pA ? pA.next : headB
//     pB = pB ? pB.next : headA
//   }
//   return null
// }
// console.log(getInterNode(list.head.next, list1.head.next))


// function longestCommonPrefix(strs) {
//   if (!strs || strs.length === 0) return
//   return lCprefixRec(strs)
// }

// function lCprefixRec(arr) {
//   let length = arr.length
//   if (length === 1) {
//     return arr[0]
//   }
//   let mid = Math.floor(length / 2)
//   let left = arr.slice(0, mid)
//   let right = arr.slice(mid, length)
//   return lCprefixTwo(lCprefixRec(left), lCprefixRec(right))
// }

// function lCprefixTwo(str1, str2) {
//   let j = 0
//   for (; j < str1.length && j < str2.length; j++) {
//     if (str1.charAt(j) !== str2.charAt(j)) break
//   }
//   return str1.substring(0, j)
// }



// function getMaxMin(arr) {
  
// }

function swap(arr, i, j) {
  let temp = arr[i]
  arr[i] = arr[j]
  arr[j] = temp
}

var arr = [1,7,43,2,3,9,8,5]
// 冒泡排序
function bubbleSort(arr) {
  for (let i = arr.length; i > 0; i--) {
    let flag = true
    for (let j = 0; j < i; j++) {
      if (arr[j] > arr[j+1]) {
        swap(arr, j, j + 1)
        flag = false
      }
    }
    if (flag) {
      break
    }
  }
}
// bubbleSort(arr)
// 选择排序
function selectSort(arr) {
  let minIndex, temp
  for (let i = 0; i < arr.length; i++) {
    minIndex = i
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j
      }
    }
    temp = arr[i]
    arr[i] = arr[minIndex]
    arr[minIndex] = temp
  }
}
// selectSort(arr)
// 插入排序
function insertSort(arr) {
  for (var i = 1; i < arr.length; i++) {
    var n = i
    var temp = arr[i]
    while (n >= 0 && arr[n-1] > temp) {
      arr[n] = arr[n-1]
      n--
    }
    arr[n] = temp
  }
}
// insertSort(arr)
// 归并排序

function merginSort(arr) {
  var len = arr.length
  if (len < 2) {
    return arr
  } else {
    var mid = Math.floor(len / 2)
    var leftArr = arr.slice(0, mid)
    var rightArr = arr.slice(mid)
    return merginArr(merginSort(leftArr), merginSort(rightArr))
  }
}

function merginArr(leftArr, rightArr) {
  let leftLen = leftArr.length
  let rightLen = rightArr.length
  let arr = []
  let m = 0
  let n = 0
  let k = 0
  
  for (; m < leftLen && n < rightLen; k++) {
    if (leftArr[m] < rightArr[n]) {
      arr[k] = leftArr[m]
      m++
    } else {
      arr[k] = rightArr[n]
      n++
    }
  }
  while (m < leftLen) {
    arr[k++] = leftArr[m++]
  }
  while (n < rightLen) {
    arr[k++] = rightArr[n++]
  }
  return arr
}

// 快速排序
function quickSort(arr, point) {
  if (arr.length === 1) {
    return arr
  }
  
  quickSort(arr.slice(0, mid), p)
  quickSort(arr.slice(mid))
}

function parttion(arr, left, right) {
  var povit = left
  var index = povit + 1
  for (var i = index; i <= right; i++) {
    if (arr[i] < arr[povit]) {
      swap(arr, i, index);
      index++
    }
  }
  swap(arr, povit, index - 1)
  return index - 1
}




console.log(arr)