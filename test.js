var xhr = new XMLHttpRequest()
xhr.withCredentials = true
xhr.open('PUT', 'http://localhost:4000/getData', true)
xhr.setRequestHeader('name', 'along')
document.cookie = 'name=along'
xhr.onreadystatechange = function() {
  if (this.readyState === 4) {
    if (this.status >= 200 && this.status < 300 || this.status === 304) {
      console.log(this.response)
      console.log(this.getResponseHeader('name'))
    }
  }
}

var express = require('express')
var app = express()
var whiteList = ['http://localhost:3000']
app.use(function(req, res, next) {
  let origin = req.headers.origin
  if (whiteList.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Access-Control-Allow-Methods', '*')
    res.setHeader('Access-Control-Allow-Headers', 'name')
    res.setHeader('Access-Control-Cridentials', true)
    res.setHeader('Access-Control-Max-Age', 86400)
    res.setHeader('Access-Control-Expose-Headers', 'name')
    if (req.method === 'OPTION') {
      res.end()
    }
  }
})

app.put('/getData', function(req, res) {
  res.setHeader('name', 'haha')
  res.end('i dont love you')
})

app.use(express.static(__dirname))
app.listen(4000)


// server1.js
var http = require('http')
http.createServer((req, res) => {
  res.writeHead({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': '*',
    'Access-Control-Allow-Headers': 'Content-Type'
  })

  http.request({
    host: '127.0.0.1',
    port: '8080',
    url: '/',
    method: req.method,
    headers: req.headers
  }, serverResponse => {
    let body = ''
    serverResponse.on('data', chunck => {
      body += chunck
    })
    serverResponse.on('end', () => {
      res.end(body)
    })
  })
}).listen(3000, () => {
  console.log('The proxyServer is running at http://localhost:3000')
})

// server2.js
var http = require('http')
http.createServer((req, res) => {
  if (req.url === '/') {
    res.end(JSON.stringify({ title: 'fontend', password: '123456' }))
  }
}).listen(4000, () => {
  console.log('The server is running at http://localhost:4000')
})