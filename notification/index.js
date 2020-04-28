const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const path = require('path');

const app = express();
app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.header("Access-Control-Allow-Headers", "Content-Type");
        res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
        next();
    });
const server = http.createServer(app);
const io = socketio(server, {
    path: '/notification',
	origins: '*:*'
});

const port = '5002'


app.get('/', function(req, res) {
    res.sendfile(path.join(__dirname, 'index.html'));
});

io.on('connection', function (socket) {
    console.log('connected');
    socket.on( 'new_notification', function( data, room ) {
        if(Array.isArray(room)){
            for(let value of room){
                console.log(value)
                io.sockets.in(value).emit( 'show_notification', { 
                    data, 
                });
            }
        }else if(typeof room == 'string'){
            io.sockets.in(room).emit( 'show_notification', { 
                data, 
            });
        }
    });

    socket.on('join', function(room) {
        socket.join(room);
        io.in(room).clients((err , clients) => {
            io.sockets.in(room).emit( 'online', {
                room, 
                online: clients.length, 
            });
        });

        socket.on('disconnect', function () {
            io.sockets.in(room).clients((err , clients) => {
                io.sockets.in(room).emit( 'online', { 
                    room, 
                    online: clients.length, 
                });
            });
        });
    });

    socket.on('leave', function(room) {
        socket.leave(room);
        io.in(room).clients((err , clients) => {
            io.in(room).emit( 'online', { 
                room,
                online: clients.length, 
            });
        });
    });
});

server.listen(port, (err) => {
    if (err) {
      console.log(err.stack);
      return;
    }
  
    console.log(`listens on http://127.0.0.1:${port}.`);
});
  
