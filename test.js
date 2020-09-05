function MyImage(src) {
  this.img = document.createElement('img')
  this.img.src = src
  document.body.appendChild(this.img)
}
MyImage.prototype.setSrc = function(src) {
  this.img.src = src
}

function ProxyMyImage(src) {
  this.img = new MyImage()
  this.image = new Image()
  this.setSrc(src)
  this.image.onload = function() {
    this.img.setSrc(this.src)
  }
}
ProxyMyImage.prototype.setSrc = function(src) {
  this.img.setSrc('loading.jpg')
  this.image.src = src
}
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


class Node {
  constructor(data) {
    this.data = data
    this.next = null
  }
}
class LList {
  constructor() {
    this.head = new Node('head')
  }
  insert(el, data) {
    const node = new Node(data)
    let currentNode = this.head
    while (currentNode.next !== null && currentNode.data !== el) {
      currentNode = currentNode.next
    }
    node.next = currentNode.next
    currentNode.next = node
  }
  findPrev(el) {
    let currentNode = this.head
    while (currentNode.next !== null && currentNode.next.data !== el) {
      currentNode = currentNode.next
    }
    return currentNode
  }
  remove(el) {
    let prevNode = this.findPrev(el)
    prevNode.next = prevNode.next.next
  }
  display() {
    let currentNode = this.head
    let result = []
    while(currentNode.next !== null) {
      currentNode = currentNode.next
      result.push(currentNode.data)
    }
    console.log(result.join('->'))
  }
  length() {
    let currentNode = this.head
    let n = 0
    while(currentNode.next !== null) {
      currentNode = currentNode.next
      n++
    }
    return n
  }
  reverse(head) {
    if (!head || !head.next) return head
    let currentNode = head
    let prevNode = null
    while(currentNode) {
      var next = currentNode.next
      currentNode.next = prevNode
      prevNode = currentNode
      currentNode = next
    }
    return prevNode
  }
  findMid() {
    let fast = this.head
    let slow = this.head
    while (fast && fast.next) {
      slow = slow.next
      fast = fast.next.next
    }
    return slow
  }
  removeLastn(n) {
    let fast = this.head
    let slow = this.head
    while (n > 0) {
      fast = fast.next
      n--
    }
    while (fast !== null) {
      fast = fast.next
      slow = slow.next
    }
    slow.next = slow.next.next
  }
}

let list = new LList()
list.insert('head', 'A')
list.insert('A', 'B')
list.insert('B', 'C')
list.insert('C', 'D')
// list.remove('B')
// list.display()
// console.log(list.findMid())
// list.removeLastn(2)
list.display()

let list1 = new LList()
list1.insert('head', 'H')
list1.insert('H', 'K')
list1.insert('K', 'B')
list1.insert('B', 'C')
list1.insert('C', 'D')
list1.display()

function getInterNode(headA, headB) {
  let pA = headA
  let pB = headB
  while (pA || pB) {
    if (pA && pB && pA.data === pB.data) return pA.data
    pA = pA ? pA.next : headB
    pB = pB ? pB.next : headA
  }
  return null
}
console.log(getInterNode(list.head.next, list1.head.next))


function longestCommonPrefix(strs) {
  if (!strs || strs.length === 0) return
  return lCprefixRec(strs)
}

function lCprefixRec(arr) {
  let length = arr.length
  if (length === 1) {
    return arr[0]
  }
  let mid = Math.floor(length / 2)
  let left = arr.slice(0, mid)
  let right = arr.slice(mid, length)
  return lCprefixTwo(lCprefixRec(left), lCprefixRec(right))
}

function lCprefixTwo(str1, str2) {
  let j = 0
  for (; j < str1.length && j < str2.length; j++) {
    if (str1.charAt(j) !== str2.charAt(j)) break
  }
  return str1.substring(0, j)
}



function getMaxMin(arr) {
  
}