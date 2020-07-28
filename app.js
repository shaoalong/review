const http = require('http')
const fs = require('fs')

const hostname = '127.0.0.1';
const port = '8088';
http.createServer((req, res) => {
    if (req.url === '/') {
        fs.readFile('test.html', 'utf-8', function(err, data) {
            if (!err) {
                res.writeHead(200, { 'Content-Type': 'text/html' })
                res.write(data)
                res.end()
            }
        })
    } else if (req.url === '/loading.gif') {
        //延迟 25s
        fs.readFile("loading.gif", function(err, data) {
            res.write(data);
            res.end();
        })
    } else if (req.url === '/timg.jpg') {
        //延迟 25s
        fs.readFile("timg.jpg", function(err, data) {
            setTimeout(function () {
                res.write(data);
                res.end();
            }, 5000);
        })
    }
}).listen(port, hostname, () => {
    console.log('Sever running at ' + hostname + ':' + port);
})