/* This is intended to be a Node.js WebSocket server that simply re-broadcasts any message to all other connections */
var WebSocketServer = require('ws').Server
    , http = require('http')
    , express = require('express')
    , app = express()
    , port = process.env.PORT || 5000;

app.use(express.static(__dirname + '/'));

var server = http.createServer(app);
server.listen(port);

var wss = new WebSocketServer({server: server});
console.log('websocket server created');

wss.on('connection', function(ws) {
	console.log('websocket connection open');

	ws.on('close', function() {
		console.log('websocket connection close');
	    });

	ws.on( 'message', function ( message ) {
		console.log( message );
	    });
    });
