var app = require('../app');
var debug = require('debug')('nodejsexpress:server');
var http = require('http');

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);
var server = http.createServer(app);
server.listen(port);
server.on('error', function(error) {
    if (error.syscal !== 'listen') {
        throw error;
    }
    var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;
    switch(error.code) {
        case 'EACCESS': console.error(bind + ' request elvated provileges'); process.exit(1); break;
        case 'EADDRINUSE': console.error(bind + ' is request in use'); process.exit(1); break;
        default: throw error;
    }
})

server.on('listening', function() {
    var addr = server.address();
    var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
    debug('listening on ' + bind)
})


function normalizePort(val) {
    var port = parseInt(val, 10);
    if (isNaN) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
}