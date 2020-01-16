var fs = require('fs');

fs.readFile('input.txt', function(err, data) {
    if (err) {
        return console.error(err);
    }
    console.log('异步读取' + data.toString());
})

var data = fs.readFileSync('input.txt');
console.log('同步读取：' + data.toString());

console.log('程序执行完毕');


fs.open('input.txt', 'r+', function(err, fd) {
    if (err) {
        return console.log(err);
    }
    console.log('文件打开完成');
})

fs.stat('input.txt', function(err, stats) {
    console.log(stats.isFile());
    console.log(stats.isDirectory());
})



fs.writeFile('input.txt', '我是通 过fs.writeFile 写入文件的内容', function(err) {
    if (err) {
        return console.err(err);
    }
    console.log('写入数据成功');
    console.log('-----我是分割线------');
    console.log('开始读取数据');
    fs.readFile('input.txt', function(err, data) {
        if (err) {
            return console.error(err);
        }
        console.log('异步读取数据：' + data.toString());
    })
})


var buf = new Buffer.alloc(1024);
console.log('准备打已经存在的文件');
fs.open('input.txt', 'r+', function(err, fd) {
    if (err) {
        return console.log(err);
    }
    fs.read(fd, buf, 0, buf.length, 0, function(err, bytes) {
        if (err) {
            return console.log(err);
        }
        console.log(bytes + ' 字节被读取');
        if (bytes > 0) {
            console.log(buf.slice(0, bytes).toString());
        }
        fs.close(fd, function(err) {
            if (err) {
                return console.log(err);
            }
            console.log('关闭文件成功');
        });
    })
});

fs.mkdir('/tem/test/', { recursive: true }, function(err){
    if (err) {
        return console.error(err);
    }
    console.log('创建目录成功');
})

