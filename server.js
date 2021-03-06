var express = require('express'),
    app = express(),
    http = require('http'),
    socketIo = require('socket.io');

// start webserver on port 8080
var server =  http.createServer(app);
var io = socketIo.listen(server);
server.listen(4000);
// add directory with our static files
app.use(express.static(__dirname + '/public'));
console.log("Server running on 127.0.0.1:4000");

// array of all lines drawn
var line_history = [];

// event-handler for new incoming connections
io.on('connection', function (socket) {

   // first send the history to the new client
   for (var i in line_history) {
      console.log(i);
      socket.emit('draw_line', { line: line_history[i] } );
   }

   // add handler for message type "draw_line".
   socket.on('draw_line', function (data) {
      // add received line to history
      line_history.push(data.line);

      // send line to all clients
      io.emit('draw_line', { line: data.line });
   });

   socket.on('erase', function () {
      line_history = [];
      io.emit('erase', { line: [] });
   });

   socket.on('color', function (data) {
      io.emit('color', { col : data.col });
   });

});



var WebSocket = require('ws');
var WebSocketServer = WebSocket.Server;
var port = 3001;
var ws = new WebSocketServer({
    port: port
});
var messages = [];

console.log('websockets server started');

ws.on('connection', function(socket) {
    console.log('client connection established');

    messages.forEach(function(msg) {
        socket.send(msg);
    });
      
    socket.on('message', function(data) {
        console.log('message received: ' + data);
        messages.push(data);
        ws.clients.forEach(function (clientSocket) {
            clientSocket.send(data);
        });
    });
});
