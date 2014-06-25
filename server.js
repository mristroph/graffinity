/* This is intended to be a Node.js WebSocket server that simply re-broadcasts any message to all other connections */
var WebSocketServer = require('ws').Server
  , http = require('http')
  , express = require('express')
  , app = express()
  , port = process.env.PORT || 5000;

app.use(express.static(__dirname + '/public'));

var server = http.createServer(app);
server.listen(port);

var mongo = require('mongodb');

var mongoUri = process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL ||
  'mongodb://localhost/mydb';

var objects;

mongo.Db.connect(mongoUri, function (err, db) {
  db.collection('objects', function (er, collection) {
    objects = collection;
  });
});

var wss = new WebSocketServer({server: server});
console.log('websocket server created');

wss.broadcast = function (data) {
  for (var i in this.clients) {
    this.clients[i].send(data);
  }
};

wss.on('connection', function (ws) {
  console.log('websocket connection open');

  ws.on('close', function () {
    console.log('websocket connection close');
  });

  ws.on('message', function (message) {
    var data = JSON.parse(message);
    if (data.draw) {
      var draw = JSON.stringify(data.draw);
      wss.broadcast(draw);
      objects.insert({servertime: new Date().getTime(), message: draw}, {w: 1}, function (err, result) {
        if (err) {
          console.log('err', err);
        }
      });
    }
    if (data.replay) {
      console.log('replay', objects);
      playAll();
    }
  });

  function playAll() {
    objects.find({}).each(function (err, doc) {
      if (doc) {
        ws.send(doc['message']);
      }
    });
  }

  playAll();

});
